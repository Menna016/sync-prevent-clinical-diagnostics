import React from 'react';

interface StepIndicatorProps {
  step: number;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
}

const colorMaps = {
  rose: { activeBg: 'bg-rose-600', activeText: 'text-rose-600', dashedBorder: 'border-rose-400' },
  emerald: { activeBg: 'bg-emerald-600', activeText: 'text-emerald-600', dashedBorder: 'border-emerald-400' },
  amber: { activeBg: 'bg-amber-600', activeText: 'text-amber-600', dashedBorder: 'border-amber-400' },
  indigo: { activeBg: 'bg-indigo-600', activeText: 'text-indigo-600', dashedBorder: 'border-indigo-400' },
  teal: { activeBg: 'bg-teal-600', activeText: 'text-teal-600', dashedBorder: 'border-teal-400' },
  cyan: { activeBg: 'bg-cyan-600', activeText: 'text-cyan-600', dashedBorder: 'border-cyan-400' },
  sky: { activeBg: 'bg-sky-600', activeText: 'text-sky-600', dashedBorder: 'border-sky-400' },
};

export default function StepIndicator({ step, color }: StepIndicatorProps) {
  const currentColors = colorMaps[color];

  const stepsData = [
    { num: 1, label: 'Patient Profile' },
    { num: 2, label: 'Lab Vitals / Scan' },
    { num: 3, label: 'Review Vectors' },
    { num: 4, label: 'Report Results' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between font-sans">
      <div className="flex items-center gap-1.5 sm:gap-4 w-full">
        {stepsData.map((s, index) => {
          const isActive = step >= s.num;
          const isCurrent = step === s.num;

          return (
            <React.Fragment key={s.num}>
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={`flex-1 h-0.5 border-t border-dashed transition-colors duration-300 ${
                    step >= s.num ? currentColors.dashedBorder : 'border-slate-200'
                  }`}
                />
              )}

              {/* Step circle & text */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    isActive
                      ? `${s.num === 4 ? 'bg-emerald-600' : currentColors.activeBg} text-white ring-2 ring-offset-2 ring-slate-100`
                      : 'bg-slate-150 text-slate-500 bg-slate-100 border border-slate-200'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden md:inline transition-all duration-300 ${
                    isCurrent
                      ? s.num === 4
                        ? 'text-emerald-600'
                        : currentColors.activeText
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
