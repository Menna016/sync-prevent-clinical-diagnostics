import React from 'react';
import { PatientIntake, FieldDefinition } from '../../types';
import { ShieldAlert, ChevronLeft, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';

interface ReviewStepProps {
  intake: PatientIntake;
  fields: FieldDefinition[];
  vitalsValues: Record<string, string>;
  vitalsSources: Record<string, 'user' | 'ocr' | 'default'>;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
  onBack: () => void;
  onNext: () => void;
  isPredicting: boolean;
}

const colorMaps = {
  rose: {
    btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-450 shadow-rose-950/10',
    accentText: 'text-rose-600',
    accentBg: 'bg-rose-50',
    lightBorder: 'border-rose-100',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  emerald: {
    btn: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-450 shadow-emerald-950/10',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  amber: {
    btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-450 shadow-amber-950/10',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-50',
    lightBorder: 'border-amber-100',
    badge: 'bg-amber-50 text-amber-700 border-amber-150',
  },
  indigo: {
    btn: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-450 shadow-indigo-950/10',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50',
    lightBorder: 'border-indigo-100',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  teal: {
    btn: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-450 shadow-teal-950/10',
    accentText: 'text-teal-600',
    accentBg: 'bg-teal-50',
    lightBorder: 'border-teal-100',
    badge: 'bg-teal-50 text-teal-700 border-teal-100',
  },
};

export default function ReviewStep({
  intake,
  fields,
  vitalsValues,
  vitalsSources,
  color,
  onBack,
  onNext,
  isPredicting,
}: ReviewStepProps) {
  const currentColors = colorMaps[color];

  // Helper to calculate BMI
  const heightM = Number(intake.height) / 100;
  const bmiVal = heightM > 0 ? (Number(intake.weight) / (heightM * heightM)).toFixed(1) : '24.0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col gap-6 shadow-xs text-left animate-fade-in font-sans">
      <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Step 3 — Verification & Clinical Imputation Review
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enforcing full-parameter modeling vectors before execution.
          </p>
        </div>
        <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border-emerald-100 border px-2.5 py-1 rounded-full">
          Safe Standards Ready
        </span>
      </div>

      {/* Safe Imputation note box */}
      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 flex gap-3.5">
        <ShieldAlert className="w-5.5 h-5.5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="font-sans">
          <span className="text-xs font-black text-indigo-950 uppercase">Clinical Vector Safe Processing</span>
          <p className="text-[11px] text-indigo-800 mt-1 leading-relaxed font-sans">
            Diagnostic prediction classifiers require a fully populated model matrix. Standard clinical averages will populate parameters you decided to skip to prevent model degradation while fully preserving user-supplied entries.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Composite Patient Diagnostic Vector Status
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demographic Parameters */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between gap-3">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              Demographic Constants
            </span>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Age Days:</span>
                <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {(Number(intake.age) * 365.25).toFixed(0)} d ({intake.age} yrs)
                </span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Biological Sex:</span>
                <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {intake.gender === 'Female' ? '1 (Female)' : '2 (Male)'}
                </span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Weight/Height Index (BMI):</span>
                <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {bmiVal} kg/m²
                </span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium font-sans">Habits & Routines:</span>
                <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded text-right whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]" title={`Smoke: ${intake.smoke ? 'Yes' : 'No'}, Alcohol: ${intake.alcohol ? 'Yes' : 'No'}`}>
                  Smoke: {intake.smoke ? 'Y' : 'N'}, Alco: {intake.alcohol ? 'Y' : 'N'}
                </span>
              </li>
            </ul>
            <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 rounded border border-amber-100 px-2 py-0.5 w-max">
              Determined Constants
            </span>
          </div>

          {/* Clinical Parameters */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between gap-3 font-sans">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              Biomarkers & Biomark Status
            </span>
            <ul className="flex flex-col gap-2">
              {fields.map((field) => {
                const isPresent = !!vitalsValues[field.key];
                const displayVal = isPresent ? vitalsValues[field.key] : field.defaultValue;
                const source = vitalsSources[field.key] || 'default';
                const optionLabel = field.inputType === 'select'
                  ? field.options?.find((opt) => opt.value === displayVal)?.label || displayVal
                  : displayVal;

                return (
                  <li key={field.key} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{field.label}:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">
                        {optionLabel} {field.unit}
                      </span>
                      {isPresent ? (
                        <span
                          className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                            source === 'ocr'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : currentColors.badge
                          }`}
                        >
                          {source === 'ocr' ? 'OCR' : 'Manual'}
                        </span>
                      ) : (
                        <span className="text-[8px] font-black uppercase bg-amber-50 text-amber-750 border border-amber-150 px-1.5 py-0.5 rounded">
                          Imputed Avg
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 w-max">
              Imputation Ready
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
        <button
          type="button"
          disabled={isPredicting}
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-750 text-slate-705 text-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Vitals</span>
        </button>

        <button
          type="button"
          disabled={isPredicting}
          onClick={onNext}
          className={`text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${currentColors.btn}`}
        >
          {isPredicting ? (
            <>
              <RefreshCw className="w-4.5 h-4.5 animate-spin" />
              <span>Analyzing Risk Bio-vectors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              <span>Compile Risk Assessment</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
