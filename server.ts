import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { spawnSync } from "child_process";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsers with limits for vision base64 payloads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazy initialisation of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Using mocked/fallback responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * OCR extraction of laboratory measurements using Gemini 3.5 Flash
 */
app.post("/api/extract", async (req, res) => {
  const { imageBase64, mimeType, keys } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Missing imageBase64 payload" });
  }

  const requestedKeys = keys || [
    // ❤️ Heart & Lipids
    "heartRate",
    "bloodPressure",
    "systolic",
    "diastolic",
    "cholesterol",
    "ldlCholesterol",
    "hdlCholesterol",
    "triglycerides",

    // 🩸 Diabetes
    "bloodGlucose",
    "insulin",
    "hba1c",

    // 🧬 Liver Function
    "alt",
    "ast",
    "bilirubin",
    "albumin",

    // 🧪 Kidney Function
    "creatinine",
    "urea",
    "bun",
    "gfr",

    // 🩸 CBC (Blood Count)
    "hemoglobin",
    "wbc",
    "rbc",
    "platelets",
    "hematocrit",

    // ⚡ Electrolytes
    "sodium",
    "potassium",
    "calcium",
    "magnesium",

    // 🔥 Inflammation / Risk markers
    "crp",
    "esr"
  ];
  try {
    const ai = getGenAI();
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key configured.");
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64,
      },
    };

    const promptText = `
You are a highly capable clinical laboratory data extraction system.
Analyze this medical report image or scan carefully and find the values for these physical/clinical metrics:
${requestedKeys.join(", ")}

Only extract information that is explicitly stated. For values like Blood Pressure and Vitals:
- Extract "systolic" and "diastolic" if both are shown (e.g., 120 and 80 for 120/80 mmHg).
- If bloodPressure is shown as "systolic/diastolic" format, also try to return the full "bloodPressure" string (e.g. "120/80").
- If values have different names relative to liver panel (e.g. Total Bilirubin, Albumin, AST/SGOT, ALT/SGPT), map them correctly.
- Return numbers where appropriate or readable strings.

You MUST respond strictly with a valid JSON document conforming to this layout:
Every key's value should be either a string or a number depending on what is found.
Exclude any keys for which no value is physically present in the report. Do NOT fabricate or guess information.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        { text: promptText }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);

  } catch (error: any) {
    console.error("OCR extraction failed:", error);

    return res.status(500).json({
      status: "error",
      message: "OCR extraction failed. No data could be extracted from the image.",
      error: error.message
    });
  }
});

// Run Python model prediction
function predictDiseaseRisk(disease: string, profile: any, metrics: any): any {
  const inputPayload = JSON.stringify({
    model_type: disease,
    profile,
    metrics
  });

  // على Windows بيكون "python"، على Linux/Mac بيكون "python3"
  const pythonCommands = process.platform === "win32"
    ? ["python", "python3"]
    : ["python3", "python"];

  for (const cmd of pythonCommands) {
    try {
      const result = spawnSync(cmd, ["predict.py"], {
        input: inputPayload,
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
        timeout: 15000,
        cwd: process.cwd()

      });

      // لو نجح
      if (result.status === 0 && result.stdout?.trim()) {
        return JSON.parse(result.stdout.trim());
      }

      // لو فشل بسبب إن الأمر مش موجود، جرب التاني
      const errCode = (result.error as any)?.code;
      if (errCode === "ENOENT" || errCode === "ETIMEDOUT") {
        continue;
      }

      console.warn(`[${cmd}] stderr:`, result.stderr || result.error);
    } catch (err) {
      console.error(`Failed with ${cmd}:`, err);
    }
  }

  return null;
}

/**
 * Predict risk level & generate report for particular screening page
 */
app.post("/api/predict/:disease", async (req, res) => {
  const { disease } = req.params;
  const { profile, metrics } = req.body;

  // Run the live Python ML prediction
  const mlPrediction = predictDiseaseRisk(disease, profile, metrics);
  const isMlSuccess = mlPrediction && mlPrediction.status === "success";

  if (!isMlSuccess) {
    const modelFilenames: Record<string, string> = {
      diabetes: "best_diabetes_model.pkl",
      bp: "best_hypertension_gb_model.pkl",
      kidney: "best_kidney_gb_model.pkl",
      heart: "heart_model.pkl"
    };
    const expectedModelFile = modelFilenames[disease] || `${disease}_model.pkl`;
    return res.json({
      riskLevel: "Unavailable",
      explanation: `The prediction model for this medical screening is currently unavailable because the trained Machine Learning pipeline (${expectedModelFile}) is not uploaded or active on our systems. Per safe healthcare directives, all dynamic heuristic and simulated fallback calculations have been deactivated to prevent diagnostic inaccuracies.`,
      recommendations: [
        "Please check back once the clinical ML pipeline is uploaded and enabled by the system administrator.",
        "Keep a manual, accurate diary of your clinical symptoms and vital measurements.",
        "Request a formal diagnostic evaluation from an accredited healthcare practitioner to ensure your safety."
      ],
      disclaimer: "This report indicates a machine learning model unavailability state and does not serve as medical screening or triage.",
      _mlModelUsed: false,
      _mlStatus: "unavailable",
      _mlMessage: mlPrediction ? mlPrediction.message : "Model binary file was not found under root directory."
    });
  }

  try {
    const ai = getGenAI();
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key configured.");
    }

    let mlContextInstruction = "";
    if (isMlSuccess) {
      const modelFilenames: Record<string, string> = {
        diabetes: "best_diabetes_model.pkl",
        bp: "best_hypertension_gb_model.pkl",
        kidney: "best_kidney_gb_model.pkl",
        heart: "heart_model.pkl"
      };
      const modelFile = modelFilenames[disease] || `${disease}_model.pkl`;
      mlContextInstruction = `
[CRITICAL DESIGNATION]
An external, highly calibrated Machine Learning classifier (${modelFile}) was loaded and executed on this data, outputting:
- Machine Learning predicted classification: ${mlPrediction.riskLevel} Risk
- Predicted disease probability: ${(mlPrediction.probability * 100).toFixed(1)}%

You MUST align your clinical assessment's "riskLevel" output exactly with this machine learning model's classification ("${mlPrediction.riskLevel}").
In your "explanation", please mention that the patient's risk profile was run through the custom Machine Learning pipeline (loaded from ${modelFile}) returning a predicted probability of ${(mlPrediction.probability * 100).toFixed(1)}% with standard clinical features.
`;
    }

    const promptText = `
You are an expert clinical decision support algorithm. 
Perform a comprehensive diagnostic risk screening for: ${disease.toUpperCase()}.

Patient baseline profile:
- Age: ${profile.age} years
- Biological Sex: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg (Estimated BMI: ${(Number(profile.weight) / ((Number(profile.height) / 100) ** 2)).toFixed(1)} kg/m²)
- Tobacco Smoking: ${profile.smoke ? 'Yes' : 'No'}
- Alcohol Consumption: ${profile.alcohol ? 'Yes' : 'No'}
- Activity Level: ${profile.activityLevel}

Specific Healthcare Metrics Supplied for ${disease}:
${JSON.stringify(metrics, null, 2)}
${mlContextInstruction}

Instructions:
1. Classify riskLevel strictly as "Low", "Medium", or "High" (must align with ML model output if specified above).
2. Provide an "explanation" detailing why their biomarkers and personal history place them in this category, referencing their BMI, lifestyle triggers, and specific biomarkers.
3. Provide 3 highly personalized, evidence-based clinical/lifestyle "recommendations" that the patient can take.
4. Output a brief medical "disclaimer" asserting this is an AI tool and not a replacement for dynamic in-person medical diagnosis.

You MUST respond in JSON matching this exact schema:
{
  "riskLevel": "Low" | "Medium" | "High",
  "explanation": "compassionate and scientific analysis...",
  "recommendations": ["recommendation 1...", "recommendation 2...", "recommendation 3..."],
  "disclaimer": "This analytical assessment is generated based on standard references and does not replace professional consultation..."
}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, description: "Risk level: Low, Medium, or High" },
            explanation: { type: Type.STRING, description: "Explanation of risk analysis" },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 personalized health suggestions"
            },
            disclaimer: { type: Type.STRING, description: "Standard medical disclaimer" }
          },
          required: ["riskLevel", "explanation", "recommendations", "disclaimer"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text?.trim() || "{}");

    // Inject ML attributes if model calculation succeeded
    res.json({
      ...parsedResult,
      _mlModelUsed: isMlSuccess,
      _mlDetails: isMlSuccess ? mlPrediction : null,
      _mlStatus: mlPrediction ? mlPrediction.status : "absent",
      _mlMessage: mlPrediction && mlPrediction.message ? mlPrediction.message : null
    });

  } catch (error: any) {
    console.error(`Prediction for ${disease} failed:`, error);

    // Since isMlSuccess is guaranteed true here, we always return the real ML predictions safely
    const probPercent = (mlPrediction.probability * 100).toFixed(1);

    const featuresStr = Object.entries(mlPrediction.features)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    const modelFilenames: Record<string, string> = {
      diabetes: "best_diabetes_model.pkl",
      bp: "best_hypertension_gb_model.pkl",
      kidney: "best_kidney_gb_model.pkl",
      heart: "heart_model.pkl"
    };
    const modelFile = modelFilenames[disease] || `${disease}_model.pkl`;

    const mlExplanation = `[ML Model Active] Based on the custom Machine Learning pipeline (loaded via ${modelFile}), the patient has a predicted disease probability of ${probPercent}%. Features processed: ${featuresStr}.`;

    let mlRecs: string[] = [];
    if (disease === "heart") {
      mlRecs = [
        "Consult your primary cardiologist regarding a comprehensive lipid screening and resting ECG.",
        "Limit dietary sodium and highly processed foods below standard preventative limits.",
        "Maintain active, regular cardiovascular movement (30-40 minutes at least 4 times a week)."
      ];
    } else {
      mlRecs = [
        "Track and measure your biomarker levels daily to build an active diagnostic timeline.",
        "Implement high-fiber nutrition and exclude artificial synthetic options.",
        "Maintain consistent physiological activity standards mapped to your metabolic rate."
      ];
    }

    return res.json({
      riskLevel: mlPrediction.riskLevel,
      explanation: mlExplanation,
      recommendations: mlRecs,
      disclaimer: "This report was generated directly by the live Gradient Boosting Model classifier saved in your files. It does not replace hands-on medical care.",
      _mlModelUsed: true,
      _mlDetails: mlPrediction,
      _mlStatus: "success"
    });
  }
});

/**
 * AI Doctor Consultation Chat Bot
 */
app.post("/api/chat", async (req, res) => {
  const { messages, intake, recentTests } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const ai = getGenAI();
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key configured.");
    }

    const languageInstruction = "RESPOND EXCLUSIVELY IN THE ENGLISH LANGUAGE. Use warm, highly compassionate and scientifically accurate English medical terminology.";

    // Embed current user profile contextual details to the system context
    let contextStr = `You are Dr. Sync, a warm, professional, certified virtual physician specializing in metabolic, hepatic, and cardiovascular preventive care.

IMPORTANT SAFETY CONSTRAINT: You are STRICTLY FORBIDDEN from discussing, explaining, or answering questions on topics outside of medicine, diseases, medical conditions, medications, clinical wellness, physiology, and suggestions for clinics and doctors. 
If the patient asks you about anything else whatsoever (for example, coding, computer science, jokes, general knowledge, sports, math, music, non-medical advice, etc.), you MUST decline politely and answer EXACTLY:
"I don't know. I am a specialized virtual AI medical assistant and can only discuss diseases, medicine, medications, or doctor and clinic suggestions."

Do not provide summaries, suggestions, analysis, or commentary for off-topic prompts. Return that message immediately.

${languageInstruction}
`;

    if (intake) {
      contextStr += `Active Patient File Details:
- Age: ${intake.age} years
- Biological Sex: ${intake.gender}
- Height: ${intake.height} cm, Weight: ${intake.weight} kg (BMI: ${(Number(intake.weight) / ((Number(intake.height) / 100) ** 2)).toFixed(1)})
- Smoking habit: ${intake.smoke ? 'Yes' : 'No'}
- Regular Alcohol: ${intake.alcohol ? 'Yes' : 'No'}
- Exercise routine: ${intake.activityLevel}
`;
    }

    if (recentTests && Object.keys(recentTests).length > 0) {
      contextStr += `Patient's Completed Screening Tests Results:
${JSON.stringify(recentTests, null, 2)}
`;
    }

    contextStr += `
Rules of engagement:
1. Speak compassionately, giving highly accurate, scientific, and patient-centered answers.
2. Structure your answers beautifully using markdown lists, bold titles, and clean spacing.
3. Keep answers concise, and always offer helpful next steps based on their specific profile, BMI, exercise level, and biomarkers.
4. IMPORTANT: Always include a gentle professional warning that you are an AI assistant and they should confirm treatment changes with their in-person physician.
    `;

    // Map message roles safely
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Generate output utilizing the conversational chat engine
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction: contextStr,
        temperature: 0.7,
      }
    });

    res.json({
      content: response.text || "I am reflecting on your symptoms. Please try rephrasing for a fully targeted medical assessment.",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("AI Doctor chat failed:", error);
    res.json({
      content: `Hello! I am Dr. Sync, your virtual AI preventative care consultant. (Simulation Fallback Mode)
Based on your parameters, I highly recommend consulting your healthcare provider regularly to manage your symptoms. Keeping active, limiting sodium/sugar, and watching metrics like BMI regularly are stellar steps. Is there any specific test parameter you would like me to explain mathematically?`,
      timestamp: new Date().toISOString(),
      _fallbackUsed: true
    });
  }
});


/**
 * Symptom Checker AI Copilot
 */
app.post("/api/symptom-check", async (req, res) => {
  const { symptoms, details, intake } = req.body;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ error: "At least one symptom is required." });
  }

  // 1. Local robust classification fallback heuristic
  let heuristicTest = "heart";
  const symptomsStr = symptoms.map((s: string) => s.toLowerCase()).join(" ");
  if (symptomsStr.includes("fatigue") || symptomsStr.includes("urination") || symptomsStr.includes("thirst") || symptomsStr.includes("glucose") || symptomsStr.includes("sugar")) {
    heuristicTest = "diabetes";
  } else if (symptomsStr.includes("foamy") || symptomsStr.includes("kidney") || symptomsStr.includes("urine") || symptomsStr.includes("renal") || symptomsStr.includes("gfr") || symptomsStr.includes("creatinine") || symptomsStr.includes("back soreness") || symptomsStr.includes("edema") || symptomsStr.includes("swelling") || symptomsStr.includes("nausea") || symptomsStr.includes("liver") || symptomsStr.includes("abdominal") || symptomsStr.includes("yellow")) {
    heuristicTest = "kidney";
  } else if (symptomsStr.includes("headache") || symptomsStr.includes("dizziness") || symptomsStr.includes("buzzing") || symptomsStr.includes("tension") || symptomsStr.includes("blood pressure")) {
    heuristicTest = "bp";
  }

  try {
    const ai = getGenAI();
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No Gemini API key configured.");
    }

    const systemPrompt = `You are a professional medical reasoning AI assistant named Sync Symptom Analyser. 
Analyze the symptoms provided, correlate them with the patient's biological stats, and output a structured diagnostic feedback along with a recommended preventative screening.

Your response MUST specify which of our four available screening tests is the absolute most suitable for their active risk symptoms:
- 'heart': Choose if symptoms contain chest pain, heart flutters, fatigue with elevated BMI, breathlessness, or cardiovascular factors.
- 'diabetes': Choose if symptoms contain dry throat, extreme fatigue, hunger shifts, thirst, or direct glycemic metabolic indicators.
- 'kidney': Choose if symptoms contain foamy urine, lower back or flank soreness, swelling/edema in ankles/legs, urinary changes, liver/nausea anomalies, or renal blood panel markers.
- 'bp': Choose if symptoms contain headaches, dizzy lightheadedness, pressure indicators, or arterial strain.

Combine scientific precision with a compassionate tone.
You MUST write the 'assessment' field strictly in the ENGLISH language using high-quality English clinical terms and beautiful formatting.`;

    const userPrompt = `
Symptoms reported: ${symptoms.join(", ")}
Additional contextual details provided: ${details || "None."}

Patient Baseline Metrics:
- Age: ${intake?.age || "35"} years
- Gender: ${intake?.gender || "Not specified"}
- Height: ${intake?.height || "175"} cm
- Weight: ${intake?.weight || "70"} kg (BMI: ${(Number(intake?.weight || 70) / ((Number(intake?.height || 175) / 100) ** 2)).toFixed(1)})
- Tobacco smoking: ${intake?.smoke ? "Yes" : "No"}
- Alcohol: ${intake?.alcohol ? "Yes" : "No"}

Provide a beautifully formatted markdown assessment inside 'assessment' containing sections for clinical severity score (Mild, Moderate, or Requires Attention), likely physiological causes, and an actionable care plan. Specify the chosen suggested test ID from ['heart', 'diabetes', 'bp', 'kidney'] strictly inside 'suggestedTest'.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assessment: {
              type: Type.STRING,
              description: "Complete clinical report formatted cleanly in markdown."
            },
            suggestedTest: {
              type: Type.STRING,
              description: "Must be exactly one of: 'heart', 'diabetes', 'bp', or 'kidney'."
            }
          },
          required: ["assessment", "suggestedTest"]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");

    res.json({
      assessment: parsed.assessment || "Assessment details compile complete.",
      suggestedTest: ["heart", "diabetes", "bp", "kidney"].includes(parsed.suggestedTest) ? parsed.suggestedTest : heuristicTest,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Symptom checking failed:", error);

    // Generates high-quality fallback including the heuristic recommendation mapping
    const fallbackAssessment = `### Clinical Severity: **Moderate (Advisor-Assigned)**
    
Representative diagnostic assessment completed for symptoms: **${symptoms.join(", ")}**.

* **Primary Systems Potentially Involved**: Circulatory & metabolical signaling pathways.
* **Suggested Companion Lab Work**: Based on active symptom markers and lifestyle indicators, we highly recommend scheduling the **${heuristicTest === 'heart' ? 'Heart Disease Screening' : heuristicTest === 'diabetes' ? 'Diabetes Risk Screening' : heuristicTest === 'kidney' ? 'Kidney Disease Risk Screen' : 'Hypertension / BP Screen'}** as your priority action metric.
* **General Preventative Advice**:
  1. Complete proper hydration logs (target 2.5-3L water daily).
  2. Map out active parameters (resting heart rates, sugars, tensions) into a continuous diagnostic diary.
  3. Ensure regular moderate cardiovascular physical workouts (min 25 minutes daily).

*Medical Advisory Disclaimer: This automated screening matches basic diagnostic aggregates. For hands-on care, please book an appointment with a local licensed physician.*`;

    res.json({
      assessment: fallbackAssessment,
      suggestedTest: heuristicTest,
      timestamp: new Date().toISOString(),
      _fallbackUsed: true
    });
  }
});


// ----------------------------------------------------
// VITE OR STATIC FILE SERVING MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
