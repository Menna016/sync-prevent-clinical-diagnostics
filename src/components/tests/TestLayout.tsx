import React, { useState, useEffect } from 'react';
import { PatientIntake, FieldDefinition, TestResult } from '../../types';
import StepIndicator from './StepIndicator';
import PatientProfileStep from './PatientProfileStep';
import VitalsStep from './VitalsStep';
import ReviewStep from './ReviewStep';
import ResultStep from './ResultStep';
import { ShieldCheck, Activity, Brain, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestLayoutProps {
  title: string;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
  fields: FieldDefinition[];
  apiEndpoint: string;
  diseaseId: string;
  intake: PatientIntake;
  setIntake: (intake: PatientIntake) => void;
  setTestResult: (diseaseId: string, result: TestResult) => void;
  testResult: TestResult | null;
}

const colorMaps = {
  rose: {
    accentText: 'text-rose-600',
    lightBg: 'bg-rose-50',
    border: 'border-rose-500',
    iconColor: 'text-rose-600',
  },
  emerald: {
    accentText: 'text-emerald-700',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-500',
    iconColor: 'text-emerald-600',
  },
  amber: {
    accentText: 'text-amber-700',
    lightBg: 'bg-amber-50',
    border: 'border-amber-500',
    iconColor: 'text-amber-500',
  },
  indigo: {
    accentText: 'text-indigo-700',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-500',
    iconColor: 'text-indigo-600',
  },
  teal: {
    accentText: 'text-teal-700',
    lightBg: 'bg-teal-50',
    border: 'border-teal-500',
    iconColor: 'text-teal-600',
  },
};

export default function TestLayout({
  title,
  color,
  fields,
  apiEndpoint,
  diseaseId,
  intake,
  setIntake,
  setTestResult,
  testResult,
}: TestLayoutProps) {
  const currentColors = colorMaps[color];

  // Stepper state
  const [step, setStep] = useState<number>(1);

  // local copy of vitals values (for step 2)
  const [vitalsValues, setVitalsValues] = useState<Record<string, string>>({});
  // tracking sources (ocr, manual, default)
  const [vitalsSources, setVitalsSources] = useState<Record<string, 'user' | 'ocr' | 'default'>>({});

  // API Call state
  const [isPredicting, setIsPredicting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-init local vitals values with default field definitions if available
  useEffect(() => {
    const initVals: Record<string, string> = {};
    const initSrcs: Record<string, 'user' | 'ocr' | 'default'> = {};
    fields.forEach((f) => {
      initVals[f.key] = '';
      initSrcs[f.key] = 'default';
    });
    setVitalsValues(initVals);
    setVitalsSources(initSrcs);
    setStep(1);
  }, [fields]);

  // Sync back to Step 1 on test change or restart
  useEffect(() => {
    if (!testResult) {
      setStep(1);
    } else {
      setStep(4);
    }
  }, [testResult]);

  // Handle predicting
  const handleCompileRisk = async () => {
    setIsPredicting(true);
    setErrorMsg(null);

    // Build values mapping skipping empty with default values
    const finalMetrics: Record<string, any> = {};
    fields.forEach((f) => {
      const v = vitalsValues[f.key];
      finalMetrics[f.key] = v ? (f.inputType === 'number' ? Number(v) : v) : Number(f.defaultValue);
    });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: intake,
          metrics: finalMetrics,
        }),
      });

      if (!response.ok) {
        throw new Error('Risk assessment API completed unfavourably.');
      }

      const resData: TestResult = await response.json();
      setTestResult(diseaseId, resData);

      setStep(4);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('The predictive screening service is currently offline or the request could not be processed. Please try again or verify binary configurations.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleRestart = () => {
    // Clear completed test result to reset wizard
    // (We pass clean values or can just let client handle it)
    setStep(1);
    const clearedVals: Record<string, string> = {};
    const clearedSrcs: Record<string, 'user' | 'ocr' | 'default'> = {};
    fields.forEach((f) => {
      clearedVals[f.key] = '';
      clearedSrcs[f.key] = 'default';
    });
    setVitalsValues(clearedVals);
    setVitalsSources(clearedSrcs);
  };

  return (
    <div className="flex flex-col gap-8 py-6 md:py-8 px-4 md:px-8 lg:px-12 text-left font-sans animate-fade-in">
      
      {/* Test Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-205 border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <Link
            to="/tests"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <Activity className={`h-6 w-6 ${currentColors.iconColor} animate-pulse`} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight font-sans">
              {title}
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-normal mt-0.5">
              Structured step-based clinical screening tool to help you evaluate disease variables.
            </p>
          </div>
        </div>

        <Link
          to="/tests"
          className="text-xs font-black uppercase text-slate-500 hover:text-slate-900 border border-slate-205 border-slate-200 bg-white px-4 py-2.5 rounded-xl text-center shadow-2xs self-start md:self-auto"
        >
          View All Screenings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Stepper Content Module */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Progress Tracker */}
          <StepIndicator step={step} color={color} />

          {errorMsg && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sizing Active Workspace */}
          {step === 1 && (
            <PatientProfileStep
              intake={intake}
              setIntake={setIntake}
              color={color}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <VitalsStep
              fields={fields}
              vitalsValues={vitalsValues}
              setVitalsValues={setVitalsValues}
              vitalsSources={vitalsSources}
              setVitalsSources={setVitalsSources}
              color={color}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <ReviewStep
              intake={intake}
              fields={fields}
              vitalsValues={vitalsValues}
              vitalsSources={vitalsSources}
              color={color}
              onBack={() => setStep(2)}
              onNext={handleCompileRisk}
              isPredicting={isPredicting}
            />
          )}

          {step === 4 && testResult && (
            <ResultStep
              result={testResult}
              color={color}
              onRestart={handleRestart}
              intake={intake}
              fields={fields}
              vitalsValues={vitalsValues}
              testTitle={title}
            />
          )}

        </div>

        {/* Informational Guidelines Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6 font-sans">
          


          {/* Patients' Simple Health Glossary Section */}
          <div className="bg-indigo-50/70 rounded-2xl border border-indigo-150 p-6 flex flex-col gap-4 text-left shadow-xs font-mariupol">
            <div className="pb-3 border-b border-indigo-100 flex items-center gap-2">
              <span className="text-indigo-650">💡</span>
              <span className="text-[10px] font-black uppercase text-indigo-750 tracking-wider">
                Friendly Health Glossary
              </span>
            </div>

            <div className="flex flex-col gap-3.5 prose text-xs text-slate-700 font-sans leading-relaxed">
              {diseaseId === 'heart' && (
                <>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">💓 Estimated BMI (Height &amp; Weight):</strong>
                    <span>Body Mass Index (BMI) measures your body weight compared to your height. Since you entered your height and weight, we estimate this baseline automatically! It helps represent body size variables without requiring any complex clinical scales or blood draws.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">💓 Systolic &amp; Diastolic Pressure:</strong>
                    <span>Systolic (the higher top number) is the pressure of your blood flowing when your heart pumps. Diastolic (the lower bottom number) is the resting pressure in your vessels when your heart relaxes between beats.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">💓 LDL Cholesterol Level:</strong>
                    <span>Known as the "bad" cholesterol. If LDL is too high, it can deposit fatty build-ups in blood vessels, which requires heart muscles to pump harder.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">💓 Fasting Blood Glucose:</strong>
                    <span>Your blood sugar level after fasting overnight. It reflects how effectively your metabolism processes energy and manages glucose levels.</span>
                  </div>
                </>
              )}

              {diseaseId === 'diabetes' && (
                <>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">📊 General Health Rating:</strong>
                    <span>A subjective scale from 1 (excellent) to 5 (poor) that reflects how healthy you feel overall in your daily life.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">📊 Poor Physical / Mental Days:</strong>
                    <span>The number of days in the past month you felt physically unwell, injured, fatigued, or anxious. It tracks metabolic lifestyle stressors.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">📊 Comorbid History:</strong>
                    <span>Whether you have ever been diagnosed with standard metabolic companion symptoms (e.g., high blood pressure, high cholesterol, heart stress, or history of a stroke).</span>
                  </div>
                </>
              )}

              {diseaseId === 'kidney' && (
                <>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">🧫 Creatinine Level:</strong>
                    <span>A waste product from muscle wear-and-tear. Healthy kidneys filter it out completely, so high blood creatinine points to reduced filtration efficiency.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">🧫 Blood Urea Nitrogen (BUN):</strong>
                    <span>A medical marker measuring nitrogen from protein breakdown. High levels suggest your kidneys may not be working at full capacity or you are dehydrated.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">🧫 Glomerular Filtration Rate (eGFR):</strong>
                    <span>A computed rate that estimates how many milliliters of blood your kidneys clean per minute. It is the gold standard for kidney health.</span>
                  </div>
                </>
              )}

              {diseaseId === 'bp' && (
                <>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">📈 Subjective Stress Scale:</strong>
                    <span>A simple rating from 1 (fully relaxed) to 10 (extreme stress) tracking neuro-hormonal pressures that tighten blood vessels.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">📈 Daily Sodium Intake:</strong>
                    <span>The amount of regular table salt you consume in food. Excess sodium draws fluid into the bloodstream, elevating vascular pressures.</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-0.5">📈 Sleep Duration:</strong>
                    <span>The average hours of sleep you get per night. Quality sleep allows your nervous system to fully down-regulate blood pressure and heal.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active Context sync block */}
          <div className="bg-white rounded-2xl border border-slate-202 border-slate-200 p-6 flex flex-col gap-4.5 shadow-xs font-sans text-left">
            <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
              <Brain className="h-4.5 w-4.5 text-indigo-505 text-indigo-600" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Sync Engine Status
              </span>
            </div>

            <div className="flex gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                  Auto-Synchronized Sessions
                </span>
                <p className="text-[11px] text-slate-500 leading-normal font-sans">
                  Completed biometric statistics and risk thresholds compile automatically to your active browser session. If you switch to the <strong>AI Doctor Chat</strong> workspace, Dr. Sync can immediately review your report parameters.
                </p>
              </div>
            </div>
          </div>

          {/* Normal Standards reference Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 font-sans text-left">
            <div className="pb-3 border-b border-slate-250 border-slate-200 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-slate-500" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Clinical Reference Standards
              </span>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                Biological Target Values
              </span>
              <ul className="flex flex-col gap-2">
                {fields.map((f) => (
                  <li key={f.key} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{f.label}:</span>
                    <span className="font-extrabold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {f.defaultValue} {f.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
