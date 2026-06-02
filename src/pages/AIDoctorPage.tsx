import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  AlertCircle 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PatientIntake, ChatMessage, TestResult } from '../types';

interface AIDoctorPageProps {
  intake: PatientIntake;
  recentTests: Record<string, TestResult>;
}

export default function AIDoctorPage({ intake, recentTests }: AIDoctorPageProps) {
  const [searchParams] = useSearchParams();
  const prefill = searchParams.get('prefill');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set up introductory message dynamically depending on url prefill context
  useEffect(() => {
    let content = "";
    
    if (prefill && recentTests[prefill]) {
      const testName = 
        prefill === 'heart' ? 'Heart Disease' : 
        prefill === 'diabetes' ? 'Diabetes Risk' : 
        prefill === 'kidney' ? 'Kidney Function' :
        'Hypertension';
      
      const res = recentTests[prefill];
      
      content = `Hello! I see you just finished your **${testName} Screening** with a calculated **${res.riskLevel} Risk Level**! Excellent work taking preventive action.\n\nI have fully loaded your clinical data from the screening:
- **Result Output**: ${res.explanation || 'Analyzed successfully'}
- **Current Intake**: Age ${intake.age || '42'}, Gender ${intake.gender || 'Male'}
- **Activity Status**: ${intake.activityLevel || 'Active'}

What metabolic, dietary, or diagnostic elements would you like to discuss first relative to your results? Choose one of our recommended diagnostic questions or write yours below!`;
    } else {
      content = "Hello! I am **Dr. Sync**, your virtual preventative care consultant. I have synced your baseline bio stats and any completed screening parameters.\n\nHow can I help you map out your clinical risk, explain particular medical biomarkers, or optimize your physical routines today?";
    }

    setMessages([
      {
        id: 'welcome-' + (prefill || 'general'),
        role: 'model',
        content,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [prefill, recentTests, intake]);

  // Automatically scroll chat to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const chatBody = {
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        intake,
        recentTests
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatBody)
      });

      if (!response.ok) {
        throw new Error('Consultation request failed.');
      }

      const data = await response.json();
      
      const incomingMessage: ChatMessage = {
        id: Date.now().toString() + '-model',
        role: 'model',
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, incomingMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-err',
        role: 'model',
        content: "I am experiencing clinical uplink delays but I am ready to advise you offline. Based on standard health guidelines, please ensure you consult a qualified physician in your physical area for custom clinical updates.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || loading) return;
    const textToSend = inputMsg;
    setInputMsg('');
    await sendMessage(textToSend);
  };

  const handleSelectSuggestion = async (text: string) => {
    if (loading) return;
    await sendMessage(text);
  };

  // Get dynamic suggestions based on what test was prefilled
  const getDynamicSuggestions = () => {
    if (prefill === 'heart') {
      return [
        {
          label: "Assess my Heart risk score",
          query: "Dr. Sync, can you explain what my clinical cardiovascular score and BMI mean, and what I should ask my in-person physician?"
        },
        {
          label: "Lifestyle cardio triggers",
          query: "How do active smoker, alcohol, or sedentary baseline metrics impact my resting cardiological biomarkers?"
        },
        {
          label: "Preventative workout routines",
          query: "Suggest a highly structured preventative cardiovascular cardio-vascular physical routine tailored for my age."
        }
      ];
    } else if (prefill === 'diabetes') {
      return [
        {
          label: "Analyze Glycemic resistance",
          query: "Dr. Sync, please check my HbA1c and glucose biomarkers. Are they within normal limits or leaning toward metabolic resistance?"
        },
        {
          label: "Glucose optimizing habits",
          query: "What specific glycemic index shifts can I introduce into my lifestyle to protect my blood glucose levels?"
        },
        {
          label: "Action and metabolic compliance",
          query: "Explain the scientific links between skeletal physical movements and cellular diabetic safety."
        }
      ];
    } else if (prefill === 'bp') {
      return [
        {
          label: "Understand arterial pressures",
          query: "Explain how my blood pressure figures (systolic and diastolic tension) translate to standard medical hypertension levels."
        },
        {
          label: "Dietary tension controls",
          query: "What sodium, water balance, and potassium adjustments yield the highest drops in arterial vessel tension?"
        },
        {
          label: "Vascular tension-release drills",
          query: "What breathing, meditative, or clinical relaxation actions trigger rapid safe reductions in systemic vascular resistance?"
        }
      ];
    } else if (prefill === 'kidney') {
      return [
        {
          label: "Analyze Renal clearances",
          query: "Dr. Sync, please check my kidney filtration GFR, Creatinine, and BUN levels. How do these clearance numbers describe my overall metabolic renal filtration workload?"
        },
        {
          label: "GFR & hydrating actions",
          query: "What habits, water inputs, and vascular pressure adjustments are optimal to protect glomeruli nephrons and sustain standard GFR clearance?"
        },
        {
          label: "Dietary protein & sodium filters",
          query: "Explain how high-protein consumption or excessive processed sodium loads translate to cellular strain in glomerular filters."
        }
      ];
    }

    // Default suggestions
    return [
      {
        label: "Analyze BMI & metabolic risks",
        query: "What is the scientific correlation between my estimated BMI and metabolic risks like type-2 diabetes?"
      },
      {
        label: "Explain ALT/AST liver markers",
        query: "Can you explain ast and alt metrics in a clinical liver panel simply for me?"
      },
      {
        label: "Suggest blood pressure habits",
        query: "What are the primary lifestyle habits to help prevent elevated systolic blood pressure?"
      }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 font-sans flex flex-col xl:flex-row gap-8 text-start">
      
      {/* Visual Workspace Sidebar */}
      <div className="xl:w-80 shrink-0 space-y-6 font-mariupol">
        <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-sm text-start">
          <div className="h-44 w-full relative overflow-hidden bg-slate-850">
            <img 
              src="/src/assets/images/dr_blue_globe_1779657294963.png" 
              alt="Premium AI Doctor Guide"  
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-base font-black uppercase tracking-tight mb-1 font-comfortaa flex items-center gap-1.5 justify-start">
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <span>Dr. Sync AI</span>
              </h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Hello, I am Dr. Sync! Let's chat peacefully about your active bio surveys, standard blood panel figures, or basic lifestyle suggestions. I am here to help explain everything simply.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-850 space-y-2.5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Synced Session Details
              </h4>
              <div className="flex justify-between text-[11px] text-slate-350 font-semibold gap-2">
                <span>Biological Profile:</span>
                <strong className="text-white">
                  {intake.age}y {intake.gender}
                </strong>
              </div>
              <div className="flex justify-between text-[11px] text-slate-350 font-semibold gap-2">
                <span>Tobacco Profile:</span>
                <strong className="text-white">
                  {intake.smoke ? 'Active / Routine' : 'None'}
                </strong>
              </div>
              <div className="flex justify-between text-[11px] text-indigo-305 text-indigo-300 font-bold pt-1.5 border-t border-slate-850 gap-2">
                <span>Active Survey Data:</span>
                <strong>
                  {Object.keys(recentTests).length} Profiles Ready
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Chat Box Space */}
      <div className="flex-1 flex flex-col border border-slate-200 bg-white rounded-2xl overflow-hidden min-h-[550px] shadow-3xs relative text-start">
        
        {/* Chat Header */}
        <div className="border-b border-slate-150 py-4 px-6 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <div>
              <span className="text-xs font-black uppercase tracking-tight text-slate-900 block leading-none">
                Live Consultation Console
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-1 inline-block">
                Powered by Gemini-3.5-Flash
              </span>
            </div>
          </div>

          <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-500 uppercase px-2.5 py-1 rounded-lg">
            Active Session
          </span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[500px]">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 max-w-4xl text-start ${isBot ? '' : 'flex-row-reverse ml-auto'}`}
              >
                {/* Avatar */}
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border shadow-3xs ${
                  isBot 
                    ? 'bg-slate-900 border-slate-850 text-white' 
                    : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                }`}>
                  {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium ${
                  isBot 
                    ? 'bg-slate-50 text-slate-800 border border-slate-200/60' 
                    : 'bg-indigo-600 text-white font-semibold shadow-xs'
                }`}>
                  {isBot ? (
                    <div className="markdown-body prose max-w-none text-start">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line text-start">{msg.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3.5 max-w-md p-4 bg-slate-50 border border-slate-200/40 rounded-2xl animate-pulse">
              <Bot className="w-5 h-5 text-indigo-500 shrink-0 animate-bounce" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-5/6" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts Inside Chat */}
        <div className="border-t border-slate-150 p-4 bg-slate-50/20 text-start">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-505 shrink-0 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Suggested clinical questions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getDynamicSuggestions().map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s.query)}
                disabled={loading}
                className="text-start px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-3xs hover:shadow-2xs disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-150 p-4 bg-slate-50/40 flex items-center gap-3">
          <input
            type="text"
            required
            disabled={loading}
            placeholder="Describe your medical symptoms, test concerns, or clinical questions..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 min-w-0 bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3.5 text-xs sm:text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputMsg.trim()}
            className="px-5 py-3.5 bg-slate-900 border border-slate-850 hover:bg-slate-855 text-white rounded-xl text-xs uppercase font-black tracking-wider shadow-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Send Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Medical Advisory Box Bottom */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-150 flex items-center gap-2.5 text-[10px] text-slate-400 font-semibold text-start select-none">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Diagnostic tools are for informational screening, never a substitute for direct physician consultations.</span>
        </div>
      </div>
    </div>
  );
}
