# SYNC PREVENT - Clinical Diagnostic Platform

![TypeScript](https://img.shields.io/badge/TypeScript-90.6%25-blue) ![Python](https://img.shields.io/badge/Python-8.9%25-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Overview

**SYNC PREVENT** is an AI-powered clinical diagnostic platform designed to support early disease screening, health risk analysis, and intelligent patient assessment through data-driven insights. The platform combines advanced machine learning models with Google Gemini AI to provide comprehensive preventative care recommendations across multiple disease domains.

### Key Differentiators
- **Vision-Based OCR**: Automatic extraction of laboratory measurements from medical report images
- **ML-Powered Risk Assessment**: Pre-trained gradient boosting models for diabetes, hypertension, kidney disease, and heart disease
- **AI Doctor Consultation**: "Dr. Sync" – an intelligent medical chatbot for patient guidance
- **Symptom-to-Screening Mapping**: Intelligent system to correlate symptoms with relevant screening tests
- **Full-Stack Integration**: Seamless integration between frontend, backend AI, and Python ML pipelines

---

## ✨ Key Features

### 1. **Medical Report OCR Extraction**
- Upload medical report images (lab results, vital signs, etc.)
- Extracts ~30+ clinical metrics using Gemini 3.5 Flash vision capabilities
- Supports multiple lab test types: lipid panels, glucose metrics, liver/kidney function, CBC, electrolytes

### 2. **Disease Risk Screening**
Four specialized screening modules:
- **❤️ Heart Disease Screening**: Analyzes cardiovascular risk factors
- **🩸 Diabetes Risk Assessment**: Evaluates metabolic and glucose indicators
- **🧬 Kidney Disease Screening**: Assesses renal function and disease progression
- **⚡ Hypertension (Blood Pressure) Screening**: Blood pressure and arterial risk evaluation

### 3. **AI-Powered Clinical Decision Support**
- Machine learning models predict disease probability (Low/Medium/High risk)
- Personalized recommendations based on patient profile and biomarkers
- Clinical explanations aligned with ML model outputs
- Medical disclaimers and safety guidelines

### 4. **Intelligent Symptom Checker**
- Patient enters reported symptoms
- AI maps symptoms to most relevant screening test
- Provides clinical severity assessment (Mild/Moderate/Requires Attention)
- Suggests next diagnostic steps

### 5. **Virtual Doctor Consultation**
- "Dr. Sync" chatbot for medical questions
- Context-aware responses based on patient profile and test results
- Restricted to medical topics only (safety constraint)
- Multi-turn conversation support
- Professional, compassionate clinical tone

### 6. **PDF Report Generation**
- Export screening results as professional medical reports
- Include patient demographics, metrics, risk levels, and recommendations

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI Component Library**: Lucide React (icons)
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Data Visualization**: D3.js 7
- **Internationalization**: i18next (multi-language support)
- **PDF Export**: jsPDF 4
- **Animations**: Motion 12
- **Markdown Rendering**: React Markdown 10

### **Backend**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 4
- **AI Integration**: Google GenAI (Gemini 3.5 Flash)
- **Environment**: Dotenv configuration
- **Process Management**: Child Process (for Python integration)

### **Machine Learning**
- **Language**: Python 3
- **Libraries**: 
  - scikit-learn (model inference)
  - joblib (model loading)
  - pandas (data handling)
  - numpy (numerical computation)

### **Pre-trained Models**
- `best_diabetes_model.pkl` – Diabetes risk classifier
- `best_hypertension_gb_model.pkl` – Hypertension risk classifier
- `best_kidney_gb_model.pkl` – Kidney disease risk classifier
- `heart_model.pkl` – Heart disease risk classifier

### **Database/Storage**
- Firebase (real-time data and authentication - integrated but optional)
- JSON-based configuration

### **Deployment**
- Google AI Studio (primary deployment platform)
- Cloud Run compatible
- Environment variable injection via secrets management

---

## 📁 Project Structure

```
sync-prevent-clinical-diagnostics/
├── src/                              # React frontend source
│   ├── main.tsx                     # React app entry point
│   ├── components/                  # React components
│   ├── pages/                       # Screen/page components
│   └── styles/                      # CSS and Tailwind config
├── server.ts                         # Express backend API server
├── predict.py                        # Python ML inference pipeline
├── index.html                        # HTML template
├── vite.config.ts                    # Vite bundler configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Node.js dependencies
├── metadata.json                     # App metadata for Google AI Studio
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── best_diabetes_model.pkl           # ML model: Diabetes
├── best_hypertension_gb_model.pkl    # ML model: Hypertension
├── best_kidney_gb_model.pkl          # ML model: Kidney disease
├── heart_model.pkl                   # ML model: Heart disease
└── README.md                         # This file
```

---

## 📦 Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **Python** >= 3.8
- **npm** or **yarn** package manager
- **Google Gemini API Key** (for AI features)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Menna016/sync-prevent-clinical-diagnostics.git
cd sync-prevent-clinical-diagnostics
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

### Step 3: Install Python Dependencies
```bash
pip install scikit-learn joblib pandas numpy
```

### Step 4: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```bash
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"  # or your deployment URL
NODE_ENV="development"
```

**To obtain a Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing one
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env`

### Step 5: Verify ML Models are Present
Ensure these files exist in the root directory:
- `best_diabetes_model.pkl`
- `best_hypertension_gb_model.pkl`
- `best_kidney_gb_model.pkl`
- `heart_model.pkl`

If missing, the system will gracefully degrade with fallback responses.

---

## 🚀 Running the Application

### Development Mode

**Start the Development Server:**
```bash
npm run dev
```

This will:
- Start Express backend on port `3000`
- Start Vite dev server with hot module replacement
- Watch for TypeScript errors

**Access the Application:**
```
http://localhost:3000
```

### Build for Production

**Build the Application:**
```bash
npm run build
```

This creates:
- Frontend bundle in `dist/` (Vite build)
- Compiled backend server in `dist/server.cjs` (esbuild)

**Start Production Server:**
```bash
npm run start
```

### Clean Build Artifacts
```bash
npm run clean
```

### Lint TypeScript
```bash
npm run lint
```

---

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_api_key_here

# Application Configuration
APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Firebase Configuration (if using Firebase)
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_firebase_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for AI features |
| `APP_URL` | ✅ Yes | Base URL for the application |
| `NODE_ENV` | ❌ Optional | `development` or `production` |
| `FIREBASE_*` | ❌ Optional | Firebase credentials (if using Firebase) |

---

## 📱 User Guide / How to Use

### 1. **Upload Medical Report (OCR)**

**Flow:**
1. Navigate to "Upload Report" section
2. Select a medical report image (JPG, PNG)
3. System extracts ~30+ clinical metrics automatically using Gemini vision AI
4. Review extracted data and confirm accuracy
5. Data populates the metrics fields for screening

**Supported Metrics:**
- Vital Signs: Heart Rate, Blood Pressure, Systolic/Diastolic
- Lipids: Cholesterol, LDL, HDL, Triglycerides
- Glucose: Blood Glucose, Insulin, HbA1c
- Liver Function: ALT, AST, Bilirubin, Albumin
- Kidney Function: Creatinine, Urea, BUN, GFR
- Blood Count: Hemoglobin, WBC, RBC, Platelets
- Electrolytes: Sodium, Potassium, Calcium, Magnesium
- Inflammation: CRP, ESR

### 2. **Patient Profile Setup**

**Information Required:**
- Age
- Biological Sex (Male/Female)
- Height (cm)
- Weight (kg)
- Smoking Status (Yes/No)
- Alcohol Consumption (Yes/No)
- Activity Level (Sedentary/Moderate/Active)

BMI is automatically calculated from height and weight.

### 3. **Disease Screening**

**Heart Disease Screening:**
1. Enter patient profile and metrics (systolic, diastolic, cholesterol, glucose, BMI)
2. Click "Screen for Heart Disease"
3. Receive risk assessment: Low/Medium/High
4. ML model (`heart_model.pkl`) provides probability estimate
5. Gemini AI generates clinical explanation and personalized recommendations

**Diabetes Screening:**
1. Provide health indicators (blood pressure, cholesterol, physical activity, etc.)
2. System evaluates diabetes risk factors
3. Prediction based on `best_diabetes_model.pkl`
4. Personalized lifestyle recommendations

**Kidney Disease Screening:**
1. Input kidney-specific metrics (creatinine, BUN, GFR, urine output)
2. Assess renal function risk
3. Model: `best_kidney_gb_model.pkl`
4. Recommendations for kidney health management

**Hypertension (Blood Pressure) Screening:**
1. Provide BP readings and lifestyle factors (salt intake, stress, sleep, exercise)
2. Assess hypertension risk
3. Model: `best_hypertension_gb_model.pkl`
4. Blood pressure management strategies

### 4. **Symptom Checker**

**Flow:**
1. Enter observed symptoms (e.g., "chest pain, fatigue, shortness of breath")
2. Add additional context if needed
3. AI analyzes symptoms and maps to most relevant screening
4. Provides clinical severity assessment
5. Recommends which screening test to perform
6. Explains potential physiological causes

### 5. **Dr. Sync AI Consultation**

**Features:**
- Chat with "Dr. Sync" virtual doctor
- Ask medical questions about your condition
- Context-aware responses based on your profile and test results
- Medical expertise focused on preventative care
- Multi-turn conversation support

**Usage:**
1. Navigate to "Chat with Dr. Sync"
2. Enter your question
3. Receive evidence-based medical response
4. Continue conversation for clarifications

**Important:** Dr. Sync is an AI assistant, not a replacement for professional medical diagnosis. Always consult your healthcare provider for final treatment decisions.

### 6. **Export Results**

- Generate PDF reports of screening results
- Share with healthcare providers
- Keep personal health records

---

## 🔌 API Overview

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: Configured via `APP_URL` env variable

### Core Endpoints

#### 1. **Health Check**
```http
GET /api/health
```
**Response:**
```json
{ "status": "ok" }
```

---

#### 2. **OCR - Extract Lab Measurements from Image**
```http
POST /api/extract
```

**Request Body:**
```json
{
  "imageBase64": "base64_encoded_image_string",
  "mimeType": "image/jpeg",
  "keys": ["heartRate", "bloodPressure", "cholesterol", ...]
}
```

**Response:**
```json
{
  "heartRate": 72,
  "bloodPressure": "120/80",
  "systolic": 120,
  "diastolic": 80,
  "cholesterol": 200,
  "ldlCholesterol": 130,
  "bloodGlucose": 95,
  ...
}
```

**Error Handling:**
```json
{
  "status": "error",
  "message": "OCR extraction failed. No data could be extracted from the image.",
  "error": "error_details"
}
```

---

#### 3. **Disease Risk Prediction**
```http
POST /api/predict/:disease
```

**Parameters:**
- `:disease` – One of: `heart`, `diabetes`, `bp`, `kidney`

**Request Body:**
```json
{
  "profile": {
    "age": 45,
    "gender": "Male",
    "height": 180,
    "weight": 85,
    "smoke": false,
    "alcohol": true,
    "activityLevel": "Moderate"
  },
  "metrics": {
    "systolic": 130,
    "diastolic": 85,
    "cholesterol": 220,
    "bloodGlucose": 110,
    "ldlCholesterol": 140
  }
}
```

**Response:**
```json
{
  "riskLevel": "Medium",
  "probability": 0.58,
  "explanation": "Clinical analysis of risk factors...",
  "recommendations": [
    "Reduce sodium intake to below 2300mg daily",
    "Increase cardiovascular exercise to 30-40 minutes daily",
    "Schedule lipid panel screening with physician"
  ],
  "disclaimer": "This assessment is AI-generated and does not replace professional medical consultation.",
  "_mlModelUsed": true,
  "_mlDetails": {
    "status": "success",
    "riskLevel": "Medium",
    "probability": 0.58,
    "features": { ... }
  }
}
```

---

#### 4. **Symptom-Based Screening Recommendation**
```http
POST /api/symptom-check
```

**Request Body:**
```json
{
  "symptoms": ["chest pain", "fatigue", "shortness of breath"],
  "details": "Symptoms started after heavy exercise",
  "intake": {
    "age": 52,
    "gender": "Male",
    "height": 175,
    "weight": 90,
    "smoke": true,
    "alcohol": false,
    "activityLevel": "Sedentary"
  }
}
```

**Response:**
```json
{
  "assessment": "### Clinical Severity: **Moderate**\n\nThe reported symptoms align with cardiovascular risk indicators...",
  "suggestedTest": "heart",
  "timestamp": "2024-06-02T10:30:00Z"
}
```

---

#### 5. **AI Doctor Chat**
```http
POST /api/chat
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What can I do to prevent heart disease?"
    }
  ],
  "intake": {
    "age": 45,
    "gender": "Male",
    "height": 180,
    "weight": 85,
    "smoke": false,
    "alcohol": true,
    "activityLevel": "Moderate"
  },
  "recentTests": {
    "cholesterol": 220,
    "bloodPressure": "130/85"
  }
}
```

**Response:**
```json
{
  "content": "Dear patient, based on your profile and test results...",
  "timestamp": "2024-06-02T10:35:00Z"
}
```

---

## 🤖 Machine Learning Models

### Overview
The platform uses pre-trained **Gradient Boosting** classifiers for disease risk prediction.

### Model Details

| Disease | Model File | Input Features | Output |
|---------|-----------|-----------------|--------|
| **Heart Disease** | `heart_model.pkl` | Age, Gender, Height, Weight, Systolic/Diastolic BP, Cholesterol, Glucose, Smoking, Alcohol, Activity, BMI | Risk Level + Probability |
| **Diabetes** | `best_diabetes_model.pkl` | High BP, High Cholesterol, BMI, Smoking, Stroke History, Heart Disease, Physical Activity, Fruits/Veggies, Healthcare Access, Health Metrics, Demographics | Risk Level + Probability |
| **Hypertension** | `best_hypertension_gb_model.pkl` | Age, Salt Intake, Stress Score, BP History, Sleep Duration, Family History, Exercise Level, Smoking Status | Risk Level + Probability |
| **Kidney Disease** | `best_kidney_gb_model.pkl` | Age, Creatinine, BUN, Diabetes Status, Hypertension Status, GFR, Urine Output | Risk Level + Probability |

### How Predictions Work

1. **Feature Extraction**: Patient profile and metrics are extracted and normalized
2. **Scaler Application**: If a scaler (StandardScaler) exists, features are scaled
3. **Model Inference**: Features passed to trained model
4. **Probability Calculation**: Model outputs probability (0-1)
5. **Risk Classification**:
   - `Low` Risk: probability < 0.35
   - `Medium` Risk: 0.35 ≤ probability < 0.65
   - `High` Risk: probability ≥ 0.65

### Handling Missing Models

If a model file (`.pkl`) is not found:
- System falls back to informative messages
- User is prompted to upload model files
- Requests recommending manual check with healthcare provider
- No predictions are made without ML models

### Python Integration

The backend spawns Python subprocess to run `predict.py`:
- Passes patient data via stdin (JSON format)
- Returns predictions via stdout (JSON format)
- Handles both Python 2 and Python 3 command variants
- 15-second timeout to prevent hanging processes

---

## 🔐 Security & Privacy

### Key Security Features

1. **API Key Management**
   - Gemini API key stored in environment variables
   - Never committed to repository
   - Loaded via `.env` file

2. **Medical Data Handling**
   - Patient health data treated as sensitive
   - Medical disclaimer on all AI-generated content
   - No data persistence (stateless API design)

3. **AI Safety Constraints**
   - Dr. Sync chatbot restricted to medical topics only
   - Off-topic requests declined politely
   - Compassionate but accurate clinical language

4. **Content Security**
   - Input validation on all API endpoints
   - JSON response schemas enforce data structure
   - Error messages don't expose system internals

### Important Disclaimers

**⚠️ This application is not:**
- A replacement for professional medical diagnosis
- Licensed as a medical device
- A substitute for consulting with healthcare providers
- Intended for emergency situations

**✅ This application is:**
- A screening and decision-support tool
- Educational in nature
- Meant to encourage early disease detection
- Designed to supplement, not replace, medical care

---

## 🚀 Deployment

### Google Cloud Run (Recommended)

1. **Build Docker Image:**
   ```bash
   npm run build
   ```

2. **Deploy via Google Cloud:**
   ```bash
   gcloud run deploy sync-prevent \
     --source . \
     --region us-central1 \
     --set-env-vars GEMINI_API_KEY=your_key,APP_URL=your_url
   ```

### Google AI Studio

This application is optimized for Google AI Studio deployment:
- `metadata.json` provides capability declarations
- Automatic secret injection for `GEMINI_API_KEY`
- Cloud Run integration

### Environment Setup for Deployment

1. Set environment variables in deployment platform
2. Ensure Python dependencies installed (if using Python models)
3. Verify ML model files are accessible
4. Configure CORS if serving from different domain

---

## 📊 Usage Examples

### Example 1: Complete Heart Disease Screening Flow

```typescript
// 1. Upload medical report
const image = await uploadMedicalReport(reportImage);
const extractedMetrics = await extractLabMeasurements(image);

// 2. Setup patient profile
const profile = {
  age: 52,
  gender: "Male",
  height: 180,
  weight: 92,
  smoke: true,
  alcohol: true,
  activityLevel: "Sedentary"
};

// 3. Run screening
const screening = await predictDiseaseRisk("heart", profile, extractedMetrics);

// 4. Display results
console.log(`Risk Level: ${screening.riskLevel}`);
console.log(`Probability: ${(screening.probability * 100).toFixed(1)}%`);
console.log(`Explanation: ${screening.explanation}`);
console.log(`Recommendations: ${screening.recommendations.join(", ")}`);
```

### Example 2: Symptom Checker to Screening

```typescript
// 1. Patient reports symptoms
const symptoms = ["chest pain", "shortness of breath", "fatigue"];

// 2. Get AI assessment and recommended screening
const assessment = await checkSymptoms(symptoms, details, patientProfile);

// 3. Navigate to recommended screening
navigateTo(`/screening/${assessment.suggestedTest}`);
```

### Example 3: Multi-turn Doctor Consultation

```typescript
// Turn 1
let messages = [
  { role: "user", content: "I have high blood pressure. What should I eat?" }
];
let response = await chatWithDoctor(messages, patientProfile);

// Turn 2 - Follow-up
messages.push({ role: "assistant", content: response.content });
messages.push({ role: "user", content: "How much salt is too much?" });
response = await chatWithDoctor(messages, patientProfile);
```

---

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY is not defined"
**Solution:**
1. Verify `.env` file exists in root directory
2. Check `GEMINI_API_KEY` is correctly set
3. Restart the development server

### Issue: Python models not loading
**Solution:**
1. Ensure all `.pkl` files present in root:
   - `best_diabetes_model.pkl`
   - `best_hypertension_gb_model.pkl`
   - `best_kidney_gb_model.pkl`
   - `heart_model.pkl`
2. Install Python ML libraries: `pip install scikit-learn joblib pandas numpy`
3. System will degrade gracefully if models missing (uses Gemini AI only)

### Issue: "PORT already in use"
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Issue: OCR extraction returns empty
**Solution:**
1. Verify image quality is clear
2. Ensure Gemini API key is valid
3. Check image format is supported (JPG, PNG)
4. Verify `GEMINI_API_KEY` environment variable

### Issue: Frontend not updating (Vite HMR)
**Solution:**
```bash
# In development, set DISABLE_HMR to false
export DISABLE_HMR=false

# Then restart dev server
npm run dev
```

---

## 📈 Future Improvements

### Near-term Enhancements
- [ ] Multi-language support expansion (currently i18n ready)
- [ ] User authentication and patient records persistence
- [ ] Prescription drug interaction checker
- [ ] Integration with electronic health records (EHR) systems
- [ ] Mobile app (React Native)

### Medium-term Roadmap
- [ ] Additional disease screening modules (cancer, stroke, COPD)
- [ ] Predictive analytics for disease progression
- [ ] Longitudinal health tracking (multi-year trends)
- [ ] Clinician dashboard for patient management
- [ ] Integration with healthcare provider networks
- [ ] Real-time vital signs monitoring (wearable integration)

### Long-term Vision
- [ ] FDA approval as clinical decision support system
- [ ] Global deployment across multiple healthcare systems
- [ ] Advanced ML model ensemble with explainability
- [ ] Integration with telemedicine platforms
- [ ] Personalized preventative care pathways
- [ ] Real-world effectiveness validation studies

### Technical Debt
- [ ] Comprehensive unit and integration tests
- [ ] End-to-end testing automation
- [ ] Performance optimization (caching, CDN)
- [ ] Accessibility audit (WCAG compliance)
- [ ] API rate limiting and authentication
- [ ] Detailed error logging and monitoring

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- TypeScript strict mode enabled
- ESLint configuration (run `npm run lint`)
- Prettier formatting (auto-formatted on commit)

### Testing
- Unit tests for utility functions
- Integration tests for API endpoints
- Manual testing for UI components

---

## 📞 Support & Contact

For issues, questions, or feedback:

1. **GitHub Issues**: [Report a bug or request feature](https://github.com/Menna016/sync-prevent-clinical-diagnostics/issues)
2. **Documentation**: Check this README first
3. **Email**: Contact repository owner

---

## 🙏 Acknowledgments

- **Google Gemini API** for advanced AI capabilities
- **scikit-learn** for ML model framework
- **React** ecosystem for frontend development
- **Express.js** for backend framework
- **OpenAI/Medical Community** for clinical best practices reference

---

## ⚖️ Medical Disclaimer

**IMPORTANT - PLEASE READ:**

SYNC PREVENT is an artificial intelligence-based clinical decision support application designed to assist in early disease screening and risk analysis. It is **NOT** a replacement for professional medical diagnosis, treatment, or advice from licensed healthcare providers.

### Limitations:
- This tool provides risk assessments based on statistical models
- Results are NOT diagnostic and cannot confirm disease presence
- AI-generated recommendations are suggestions only
- Individual responses to interventions vary significantly
- Always consult with qualified healthcare professionals

### Proper Use:
- Use as an educational screening tool
- Share results with your healthcare provider
- Supplement, never replace, professional medical consultation
- Seek emergency medical attention for acute symptoms
- Do not delay seeking medical care based on screening results

**Your health is paramount. Always consult with qualified medical professionals.**

---

**Last Updated**: June 2024  
**Version**: 1.0.0  
**Repository**: [Menna016/sync-prevent-clinical-diagnostics](https://github.com/Menna016/sync-prevent-clinical-diagnostics)
