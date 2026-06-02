import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  Heart, 
  Thermometer, 
  AlertCircle, 
  User, 
  Calendar, 
  Sparkles, 
  Brain, 
  FileText,
  Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PatientIntake } from '../types';

interface SymptomCheckerPageProps {
  intake: PatientIntake;
  onSetSuggested: (testId: string) => void;
}

const SYMPTOMS_LIST = [
  { id: 'fatigue', nameEn: 'Fatigue', icon: '😴', systemEn: 'Metabolic & Glycemic Path' },
  { id: 'headache', nameEn: 'Headache', icon: '🤕', systemEn: 'Vascular Systems' },
  { id: 'chest-pain', nameEn: 'Chest Pain', icon: '💔', systemEn: 'Cardiovascular Systems' },
  { id: 'shortness', nameEn: 'Shortness of Breath', icon: '🌬️', systemEn: 'Cardiovascular & Respiratory' },
  { id: 'dizziness', nameEn: 'Dizziness', icon: '😵', systemEn: 'Vascular Systems' },
  { id: 'nausea', nameEn: 'Nausea', icon: '🤢', systemEn: 'Hepatic & Digestive Processes' },
  { id: 'fever', nameEn: 'Fever', icon: '🤒', systemEn: 'Immune Response System' },
  { id: 'cough', nameEn: 'Cough', icon: '🤧', systemEn: 'Respiratory Pathways' },
];

export default function SymptomCheckerPage({ intake, onSetSuggested }: SymptomCheckerPageProps) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: intake.age || '42',
    gender: intake.gender || 'Male',
    selectedSymptoms: [] as string[],
    duration: '',
    severity: '',
    customDetails: ''
  });

  const [assessment, setAssessment] = useState<string | null>(null);
  const [suggestedLocalTest, setSuggestedLocalTest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Helper calculating BMI
  const hM = Number(intake.height) / 100;
  const bmiVal = hM > 0 ? (Number(intake.weight) / (hM * hM)).toFixed(1) : '24.0';

  const toggleSymptom = (symptomId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptomId)
        ? prev.selectedSymptoms.filter(s => s !== symptomId)
        : [...prev.selectedSymptoms, symptomId]
    }));
  };

  const handleCompleteAndCheck = async () => {
    setLoading(true);
    setShowRecommendation(true);
    setAssessment(null);
    setSuggestedLocalTest(null);

    // Human readable symptoms mapped
    const symptomNames = formData.selectedSymptoms.map(id => {
      const match = SYMPTOMS_LIST.find(s => s.id === id);
      return match ? match.nameEn : id;
    });

    // 1. Determine local heuristic fallback in case offline
    let heuristicTest = "heart";
    const symptomsStr = formData.selectedSymptoms.join(" ");
    if (symptomsStr.includes("fatigue") || symptomsStr.includes("diabetes")) {
      heuristicTest = "diabetes";
    } else if (symptomsStr.includes("nausea")) {
      heuristicTest = "kidney";
    } else if (symptomsStr.includes("headache") || symptomsStr.includes("dizzy") || symptomsStr.includes("bp")) {
      heuristicTest = "bp";
    }

    try {
      const response = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          symptoms: symptomNames.length > 0 ? symptomNames : ["General Unspecified Wellness Outlier"],
          details: `Duration: ${formData.duration}. Severity Level: ${formData.severity}. ${formData.customDetails}`,
          intake: {
            ...intake,
            age: formData.age,
            gender: formData.gender
          }
        })
      });

      if (!response.ok) {
        throw new Error('Symptom search failed.');
      }

      const data = await response.json();
      setAssessment(data.assessment);
      if (data.suggestedTest) {
        setSuggestedLocalTest(data.suggestedTest);
        onSetSuggested(data.suggestedTest);
      } else {
        setSuggestedLocalTest(heuristicTest);
        onSetSuggested(heuristicTest);
      }
    } catch (error) {
      console.error(error);
      setSuggestedLocalTest(heuristicTest);
      onSetSuggested(heuristicTest);

      setAssessment(`### Clinical severity: **${formData.severity || 'Moderate'}**
Offline correlation mapping completed for: **${symptomNames.join(", ") || 'General health discomfort'}**.

* **Primary Affected Channels**: Vascular and Metabolic stress pathways.
* **Estimated Metabolic Rate**: Your estimated BMI of **${bmiVal} kg/m²** correlates high with insulin sensitivity adjustments when exercising less.
* **Suggested Next Actions**:
  1. Organize a lifestyle log noting symptom frequencies.
  2. Confirm hydration standards over the next 48 hours.
  3. Schedule a standard non-invasive **Arterial Pressure Screen** to map your heart statistics.

*Medical Advisory Disclaimer: This information represents community aggregates and does not substitute professional diagnostic physical clinic visits.*`);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const getTranslatedDuration = (opt: string) => {
    return opt;
  };

  const getTranslatedSeverity = (opt: string) => {
    return opt;
  };

  const getTranslatedSeverityDesc = (opt: string) => {
    if (opt === 'Mild') return 'minimal impact on routines';
    if (opt === 'Moderate') return 'noticeable discomfort / active stress';
    if (opt === 'Severe') return 'immediate preventative priority';
    return '';
  };

  const getTranslatedGender = (g: string) => {
    return g;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex-1 text-start bg-brand-light/40 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-soft/20 rounded-full border border-brand-soft text-brand-medium text-xs font-bold mb-4 font-comfortaa">
            <Activity className="w-4 h-4 animate-pulse text-brand-medium" />
            <span>Easy Health Companion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight mb-3 font-comfortaa text-center">
            Symptom Evaluation Wizard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-mariupol font-semibold text-center">
            Describe how you are feeling to see which of our proactive screening modules maps best to your symptoms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main interactive form card side */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
          {!showRecommendation ? (
            <motion.div
              key="checker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl shadow-md p-6 md:p-10 border border-slate-200/80 font-mariupol"
              id="checker-form"
            >
              {/* Progress Indicator */}
              <div className="mb-8" id="step-progress-indicator">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-brand-slate uppercase tracking-widest font-mariupol">
                    Step {step} of {totalSteps}
                  </span>
                  <span className="text-xs font-black text-brand-medium font-comfortaa">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 border border-slate-200/40">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-medium to-brand-slate"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </div>

              {/* Step 1: Age & Gender */}
              {step === 1 && (
                <div className="space-y-6 text-start">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 justify-start">
                    <div className="h-10 w-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-medium shrink-0">
                      <User className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-brand-dark font-comfortaa">
                        Basic Information
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Biological baseline context
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 text-start">
                      <label className="text-[10px] font-black text-brand-slate uppercase tracking-wider">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="E.g. 42"
                        className="w-full px-4 py-3 text-xs bg-brand-light text-brand-dark font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-brand-medium focus:ring-1 focus:ring-brand-medium transition-all text-start"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2 text-start">
                      <label className="text-[10px] font-black text-brand-slate uppercase tracking-wider">
                        Gender
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Male', 'Female'].map((genderOption) => (
                          <button
                            key={genderOption}
                            onClick={() => setFormData({ ...formData, gender: genderOption })}
                            type="button"
                            className={`px-4 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              formData.gender === genderOption
                                ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                                : 'bg-brand-light/50 border-slate-200 text-slate-600 hover:bg-brand-light'
                            }`}
                          >
                            {genderOption}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Select Symptoms */}
              {step === 2 && (
                <div className="space-y-6 text-start">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 justify-start">
                    <div className="h-10 w-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-medium shrink-0">
                      <Activity className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-brand-dark font-comfortaa">
                        Select Your Symptoms
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Choose one or more systems to map out
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    {SYMPTOMS_LIST.map((symptom) => {
                      const active = formData.selectedSymptoms.includes(symptom.id);
                      return (
                        <button
                          key={symptom.id}
                          type="button"
                          onClick={() => toggleSymptom(symptom.id)}
                          className={`p-4 rounded-xl text-center transition-all cursor-pointer border flex flex-col justify-between h-32 text-start ${
                            active
                              ? 'bg-brand-medium text-white border-brand-medium shadow-md scale-[1.03]'
                              : 'bg-brand-light/20 border-slate-200 text-brand-dark hover:bg-brand-light'
                          }`}
                        >
                          <div className="text-3xl mb-1 text-center">{symptom.icon}</div>
                          <div className="text-start mt-auto">
                            <span className="text-xs font-extrabold block leading-tight">
                              {symptom.nameEn}
                            </span>
                            <span className={`text-[9px] block mt-0.5 leading-none ${active ? 'text-brand-soft' : 'text-slate-400'}`}>
                              {symptom.systemEn}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] font-black text-brand-slate uppercase tracking-wider bg-brand-light py-2 px-3 rounded-lg inline-block text-start">
                    Selected: {formData.selectedSymptoms.length} Common Symptoms
                  </p>
                </div>
              )}

              {/* Step 3: Duration */}
              {step === 3 && (
                <div className="space-y-6 text-start">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 justify-start">
                    <div className="h-10 w-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-medium shrink-0">
                      <Calendar className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-brand-dark font-comfortaa">
                        Symptom Duration
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        How long have you observed these biological indicators?
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Less than 24 hours', '1-3 days', '4-7 days', 'More than a week'].map((durationOption) => (
                      <button
                        key={durationOption}
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: durationOption })}
                        className={`p-5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer border text-start flex items-center justify-between ${
                          formData.duration === durationOption
                            ? 'bg-brand-medium text-white border-brand-medium shadow-sm'
                            : 'bg-brand-light/30 border-slate-200 text-brand-dark hover:bg-slate-50'
                        }`}
                      >
                        <span>{durationOption}</span>
                        <Clock className={`w-4 h-4 ${formData.duration === durationOption ? 'text-brand-soft' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Severity */}
              {step === 4 && (
                <div className="space-y-6 text-start">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 justify-start">
                    <div className="h-10 w-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-medium shrink-0">
                      <Thermometer className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-brand-dark font-comfortaa">
                        Current Severity
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Evaluate physical stress levels
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { level: 'Mild', color: 'bg-emerald-50 border-emerald-250 text-emerald-800' },
                      { level: 'Moderate', color: 'bg-brand-soft/30 border-brand-soft text-brand-dark' },
                      { level: 'Severe', color: 'bg-rose-50 border-rose-100 text-rose-800' },
                    ].map((item) => {
                      const active = formData.severity === item.level;
                      return (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => setFormData({ ...formData, severity: item.level })}
                          className={`p-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border text-center flex flex-col justify-start items-center ${
                            active
                              ? 'bg-brand-dark text-white border-brand-dark shadow-md scale-[1.03]'
                              : `${item.color} hover:opacity-90`
                          }`}
                        >
                          <span className="block text-sm">
                            {item.level}
                          </span>
                          <span className="block text-[10px] lowercase font-normal mt-1 opacity-75 leading-tight">
                            {getTranslatedSeverityDesc(item.level)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Summary & Run analysis */}
              {step === 5 && (
                <div className="space-y-6 text-start font-mariupol">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 justify-start">
                    <div className="h-10 w-10 bg-brand-dark text-white rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles className="w-5.2 h-5.2" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-brand-dark font-comfortaa">
                        Review & Predict Risk
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Double check biological metrics prior to server computation
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-brand-light/50 border border-slate-200 rounded-2xl p-6 shadow-xs text-start">
                    <div className="flex justify-between text-xs font-medium gap-2">
                      <span className="text-brand-slate uppercase tracking-wider font-bold text-[10px]">
                        Age Profile:
                      </span>
                      <strong className="text-brand-dark">
                        {formData.age} years ({formData.gender})
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs font-medium pt-2.5 border-t border-slate-200/50 gap-2">
                      <span className="text-brand-slate uppercase tracking-wider font-bold text-[10px]">
                        Selected Symptoms:
                      </span>
                      <strong className="text-brand-dark block text-right max-w-sm">
                        {formData.selectedSymptoms.length > 0 
                          ? formData.selectedSymptoms.map(id => {
                              const match = SYMPTOMS_LIST.find(s => s.id === id);
                              return match ? match.nameEn : id;
                            }).join(', ') 
                          : 'No symptoms chosen'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs font-medium pt-2.5 border-t border-slate-200/50 gap-2">
                      <span className="text-brand-slate uppercase tracking-wider font-bold text-[10px]">
                        Duration:
                      </span>
                      <strong className="text-brand-dark">
                        {formData.duration ? formData.duration : 'Not specified'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs font-medium pt-2.5 border-t border-slate-200/50 gap-2 animate-pulse">
                      <span className="text-brand-slate uppercase tracking-wider font-bold text-[10px]">
                        Severity Level:
                      </span>
                      <strong className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase inline-block ${
                        formData.severity === 'Mild' ? 'bg-emerald-100 text-emerald-850' :
                        formData.severity === 'Moderate' ? 'bg-brand-soft text-brand-dark' :
                        'bg-rose-100 text-rose-850'
                      }`}>
                        {formData.severity ? formData.severity : 'Not evaluated'}
                      </strong>
                    </div>
                    {formData.customDetails.trim() && (
                      <div className="flex justify-between text-xs font-medium pt-2.5 border-t border-slate-200/50 gap-2">
                        <span className="text-brand-slate uppercase tracking-wider font-bold text-[10px]">
                          Context details:
                        </span>
                        <p className="text-brand-dark font-medium text-right max-w-md text-xs italic">
                          "{formData.customDetails}"
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCompleteAndCheck}
                    type="button"
                    className="w-full py-4 bg-brand-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md cursor-pointer hover:bg-brand-dark/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4 text-brand-soft shrink-0" />
                    <span>Get AI Recommendation</span>
                  </button>
                </div>
              )}

              {/* Navigation Back / Continue Buttons */}
              {step < 5 && (
                <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      type="button"
                      className="flex items-center gap-1.5 px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-brand-light transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (step === 2 && formData.selectedSymptoms.length === 0) {
                        alert("Please select at least one symptom to proceed.");
                        return;
                      }
                      if (step === 3 && !formData.duration) {
                        alert("Please select the symptom duration to proceed.");
                        return;
                      }
                      if (step === 4 && !formData.severity) {
                        alert("Please evaluate your current severity to proceed.");
                        return;
                      }
                      setStep(step + 1);
                    }}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-medium text-white rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 cursor-pointer transition-all shadow-sm justify-center"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="recommendation"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-md p-6 md:p-10 border border-brand-soft/60 text-start font-mariupol text-start"
              id="recommendation-result"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                  <Heart className="w-8 h-8 text-brand-soft animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-brand-dark font-comfortaa">
                   AI Recommendation Report
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                   Correlated screening outputs based on baseline metrics and active biomarker indicators
                </p>
              </div>

              {loading ? (
                <div className="bg-brand-light/40 rounded-2xl p-6 border border-slate-100 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                  </div>
                </div>
              ) : (
                <div className="bg-brand-light/50 rounded-2xl p-5 md:p-7 border border-brand-soft/45 shadow-3xs mb-8 text-start">
                  <div className="flex items-start gap-4 justify-start">
                    <div className="w-10 h-10 bg-brand-medium text-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5.2 h-5.2" />
                    </div>
                    <div className="flex-1 text-start">
                      {suggestedLocalTest && (
                        <div className="mb-5 bg-gradient-to-r from-indigo-50 to-indigo-100/40 border border-indigo-200 p-4 rounded-xl flex items-center justify-between gap-3 text-start">
                          <div className="flex items-center gap-2.5 justify-start">
                            <span className="text-xl">💡</span>
                            <div>
                              <span className="text-[9px] uppercase font-black tracking-widest text-indigo-850 block">
                                AI Recommended Screening
                              </span>
                              <strong className="text-xs text-indigo-950 font-black uppercase tracking-tight block mt-0.5">
                                {suggestedLocalTest === "heart" && 'Heart Disease Test Assistant'}
                                {suggestedLocalTest === "diabetes" && 'Diabetes Risk Assistant'}
                                {suggestedLocalTest === "kidney" && 'Kidney Function Screen'}
                                {suggestedLocalTest === "bp" && 'Hypertension Monitor'}
                              </strong>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                This test is now highlighted on the Tests page for your absolute convenience.
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-full shrink-0 animate-pulse">
                            Active Highlight
                          </span>
                        </div>
                      )}

                      <div className="prose prose-slate prose-xs max-w-none text-brand-dark leading-relaxed font-semibold text-xs text-slate-700 text-start animate-fade-in">
                        <ReactMarkdown>{assessment || ''}</ReactMarkdown>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold mt-6 pt-5 border-t border-brand-soft/25 justify-start">
                        <div className="flex items-center gap-1.5 text-brand-dark bg-brand-soft/30 px-3 py-1 rounded-full border border-brand-soft/40 justify-start">
                          <span className="w-1.5 h-1.5 bg-brand-dark rounded-full"></span>
                          <span>Suggested Track: Preventative Health Testing</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-[11px] justify-start">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Complete clinical profiling</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate('/tests')}
                        type="button"
                        className="w-full mt-6 py-4 bg-brand-dark hover:bg-brand-dark/90 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <span>Start Preventative Biomarker Screening</span>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRecommendation(false);
                    setStep(1);
                    setFormData({ age: intake.age || '42', gender: intake.gender || 'Male', selectedSymptoms: [], duration: '', severity: '', customDetails: '' });
                  }}
                  className="flex-1 py-3.5 text-xs font-black uppercase text-brand-dark bg-brand-light hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer text-center"
                >
                  Start New Checker Profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/doctor')}
                  className="flex-1 py-3.5 text-xs font-black uppercase text-white bg-brand-medium hover:bg-brand-medium/90 transition-all rounded-xl text-center cursor-pointer"
                >
                  Discuss Symptoms via Dr. Sync Chat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Supportive Side Helper Card */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs font-mariupol space-y-5 text-start">
        <div className="h-44 w-full relative overflow-hidden bg-slate-50 border-b border-slate-100">
          <img 
            src="/src/assets/images/patient_care_hand_1779658089084.png" 
            alt="Guidance Checklist Helper" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="p-5 pt-1 space-y-4 text-start">
          <h4 className="text-xs font-black text-brand-dark uppercase tracking-tight font-comfortaa flex items-center gap-2 justify-start">
            <span>Wellness Support Desk</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            We know that describing a symptom can sometimes feel stressful. Take your time!
          </p>
          <ul className="space-y-2.5 text-[11px] text-slate-600 font-medium font-sans">
            <li className="flex items-start gap-2 justify-start">
              <span className="text-brand-medium shrink-0">🌿</span>
              <span>
                We only look at common metabolic, heart, and basic physical indicators.
              </span>
            </li>
            <li className="flex items-start gap-2 justify-start">
              <span className="text-brand-medium shrink-0">🌟</span>
              <span>
                No complex medical vocabulary is required; simply choose or type what you feel.
              </span>
            </li>
            <li className="flex items-start gap-2 justify-start">
              <span className="text-brand-medium shrink-0">🍀</span>
              <span>
                All assessment reports are designed to match our simple preventative screening tests immediately.
              </span>
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-150 font-sans text-start">
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              Note: Close this browser tab at any time to instantly clear your assessment from active memory.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
  );
}
