import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Sliders, ShieldCheck, ChevronRight, Sparkles, Beaker } from 'lucide-react';
import { TestResult } from '../../types';
import SessionMetricsChart from '../../components/tests/SessionMetricsChart';

interface TestsHomePageProps {
  recentTests: Record<string, TestResult>;
  suggestedTestId?: string | null;
}

const targetTests = [
  {
    id: 'heart',
    title: 'Heart Disease Test Assistant',
    desc: 'Intensive cardiovascular screening, resting heart rate analytics, and lipid parameters evaluation.',
    path: '/tests/heart',
    color: 'rose',
    icon: Heart,
    themeClasses: {
      card: 'hover:border-rose-300 hover:shadow-rose-950/5',
      badge: 'bg-rose-50 text-rose-700 border-rose-100',
      iconBox: 'bg-rose-50 text-rose-600 border-rose-100',
      btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-950/10'
    }
  },
  {
    id: 'diabetes',
    title: 'Diabetes Risk Assistant',
    desc: 'Metabolic evaluation measuring blood glucose levels, insulin resistance indicators, and HbA1c metrics.',
    path: '/tests/diabetes',
    color: 'emerald',
    icon: Sparkles,
    themeClasses: {
      card: 'hover:border-emerald-300 hover:shadow-emerald-950/5',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconBox: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/10'
    }
  },
  {
    id: 'kidney',
    title: 'Kidney Function Screen',
    desc: 'Renal cellular clearance evaluation checking GFR levels, creatinine, blood urea nitrogen (BUN), and urine metrics.',
    path: '/tests/kidney',
    color: 'teal',
    icon: Beaker,
    themeClasses: {
      card: 'hover:border-teal-300 hover:shadow-teal-950/5',
      badge: 'bg-teal-50 text-teal-700 border-teal-100',
      iconBox: 'bg-teal-50 text-teal-600 border-teal-100',
      btn: 'bg-teal-600 hover:bg-teal-700 shadow-teal-950/10'
    }
  },
  {
    id: 'bp',
    title: 'Hypertension Monitor',
    desc: 'Circulatory arterial pressure risk screening looking at systolic, diastolic variability, and total lipids.',
    path: '/tests/bp',
    color: 'indigo',
    icon: Sliders,
    themeClasses: {
      card: 'hover:border-indigo-300 hover:shadow-indigo-950/5',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      iconBox: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-950/10'
    }
  }
];

export default function TestsHomePage({ recentTests, suggestedTestId }: TestsHomePageProps) {
  const completedCount = Object.keys(recentTests).length;

  const getTranslatedRisk = (level: string) => {
    return level;
  };

  return (
    <div id="tests-index" className="flex flex-col gap-8 py-6 md:py-8 text-start font-sans animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Preventative Health Investigation Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-normal mt-0.5">
            Select and run automated clinical risk profiles using guidelines. View deep analysis reports and biometric features.
          </p>
        </div>
      </div>

      {/* Dynamic D3 Session Metrics Chart */}
      {completedCount > 1 && (
        <SessionMetricsChart recentTests={recentTests} />
      )}

      {/* Grid List of Available Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {targetTests.map((test) => {
          const IconComp = test.icon;
          const completedResult = recentTests[test.id];
          const hasResult = !!completedResult;
          const isSuggested = suggestedTestId === test.id;

          return (
            <div
              key={test.id}
              className={`bg-white rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 relative ${
                isSuggested 
                  ? 'border-4 border-indigo-600 shadow-2xl ring-4 ring-indigo-500/25 scale-[1.02] outline-dashed outline-3 outline-indigo-500/80 outline-offset-6 md:outline-offset-8' 
                  : `border border-slate-200 shadow-2xs hover:shadow-md ${test.themeClasses.card}`
              }`}
            >
              {isSuggested && (
                <div className="absolute -top-3 left-4 bg-indigo-605 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md animate-bounce">
                  💡 Suggested Investigation
                </div>
              )}

              <div className="flex flex-col gap-3.5">
                
                {/* Header card row */}
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-3xs ${test.themeClasses.iconBox}`}>
                    <IconComp className="h-5.5 w-5.5 animate-pulse" />
                  </div>
                  
                  {isSuggested ? (
                    <div className="flex items-center gap-1 bg-indigo-50 text-indigo-805 border border-indigo-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-pulse shadow-2xs">
                      <Sparkles className="h-3 w-3 text-indigo-600 shrink-0" />
                      <span>Recommended for You</span>
                    </div>
                  ) : hasResult ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{getTranslatedRisk(completedResult.riskLevel)} - Risk Scored</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                      Testing Ready
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 font-sans">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans mt-0.5">
                    {test.desc}
                  </p>
                </div>

              </div>

              {/* Enter Button */}
              <Link
                to={test.path}
                className={`text-white font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  isSuggested
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md ring-2 ring-indigo-500/25'
                    : test.themeClasses.btn
                }`}
              >
                <span>{hasResult ? 'Re-run Risk Test' : 'Begin Assessment'}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
