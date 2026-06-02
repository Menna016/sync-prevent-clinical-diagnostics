import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  ShieldCheck,
  HeartHandshake,
  Droplet,
  Moon,
  TrendingDown,
  Footprints,
  Smile,
  Utensils
} from 'lucide-react';
import { PatientIntake, TestResult } from '../types';

const clinicBanner = "/src/assets/images/comfortable_clinic_banner_1779650745816.png";
const familyWellness = "/src/assets/images/family_wellness_1779650763861.png";
const wellnessTipsImage = "/src/assets/images/holistic_wellbeing_flatlay_1779656889440.png";

const wellnessTips = [
  {
    icon: 'water',
    title: 'Drink Enough Water Daily',
    desc: 'Support renal filtration and maintain vascular volume by drinking 2.5 to 3 liters of water.',
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-600',
    colorBorder: 'border-sky-100'
  },
  {
    icon: 'sleep',
    title: 'Sleep Well & Rejuvenate',
    desc: 'Target 7–8 hours of sound sleep nightly. Deep sleep naturally regulates stress hormones and restores cardiac tissue.',
    colorBg: 'bg-indigo-50',
    colorText: 'text-indigo-600',
    colorBorder: 'border-indigo-100'
  },
  {
    icon: 'sugar',
    title: 'Minimize Excessive Sugar',
    desc: 'Reduce added sweeteners and refined corn syrups. Keeping sugars low naturally protects vascular linings.',
    colorBg: 'bg-rose-50',
    colorText: 'text-rose-600',
    colorBorder: 'border-rose-100'
  },
  {
    icon: 'exercise',
    title: 'Walk or Move Regularly',
    desc: 'Engage in moderate movements like brisk walking for 30 minutes daily. Aerobic tracking improves arterial compliance.',
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-600',
    colorBorder: 'border-emerald-100'
  },
  {
    icon: 'stress',
    title: 'Proactively Manage Stress',
    desc: 'Incorporate deep-breathing loops, nature walking, or meditation. Lowering chronic cortisol saves heart reserves.',
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-600',
    colorBorder: 'border-amber-100'
  },
  {
    icon: 'meal',
    title: 'Eat Whole Balanced Meals',
    desc: 'Emphasize high-fiber vegetables, lean proteins, and complex carbohydrates. Balanced nutrients maintain steady trends.',
    colorBg: 'bg-teal-50',
    colorText: 'text-teal-600',
    colorBorder: 'border-teal-100'
  }
];

interface HomeProps {
  intake: PatientIntake;
  setIntake: (newIntake: PatientIntake) => void;
  recentTests: Record<string, TestResult>;
}

export default function Home({ intake, setIntake, recentTests }: HomeProps) {
  const [successMsg, setSuccessMsg] = useState('');
  const completedCount = Object.keys(recentTests).length;

  const getDiseaseTranslation = (key: string) => {
    if (key === 'heart') return 'Heart Health';
    if (key === 'diabetes') return 'Diabetes Status';
    if (key === 'bp') return 'Blood Pressure';
    if (key === 'kidney') return 'Kidney Health';
    return key;
  };

  const getRiskTranslation = (level: string) => {
    return level;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1 font-mariupol text-start">
      
      {/* 1. Warm Hero Banner Section */}
      <div className="bg-gradient-to-br from-brand-dark to-[#0f3484] rounded-3xl text-white overflow-hidden mb-10 shadow-lg border border-brand-dark/20 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Main Hero Copy - Simplified */}
          <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] uppercase font-bold tracking-widest text-[#a8c5ff] font-comfortaa">
              <Sparkles className="w-3.5 h-3.5 text-brand-soft" />
              Easy & Gentle Health Guidance
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase font-comfortaa">
              Your Safe Space For Preventative Health
            </h1>
            
            <p className="text-sm text-slate-100 leading-relaxed font-semibold">
              Welcome! We make checking your health risk indicators simple, easy, and stress-free. In just a few smooth clicks, you can check key health signals or ask our caring AI doctor helpful questions about your body—completely privately.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/tests"
                className="px-6 py-3.5 bg-brand-medium hover:bg-brand-medium/90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:translate-y-[-1px] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Health Surveys</span>
                <ArrowRight className="w-4 h-4 text-brand-soft" />
              </Link>
              <Link
                to="/doctor"
                className="px-6 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Ask Caring Dr. Sync</span>
              </Link>
            </div>
          </div>

          {/* Calming Custom Banner Image */}
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden self-stretch min-h-[280px]">
            <img 
              src={clinicBanner} 
              alt="Comfortable Clinical Reassurance" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-[#0f3484]/15 to-[#0b2b6c]/90 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* 2. Simplified Guidelines & Reassurance Block */}
      <div className="mb-10 bg-indigo-50/65 border border-indigo-200/50 rounded-2xl p-5 md:p-6 text-slate-800 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-indigo-100 shrink-0">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-brand-dark uppercase tracking-wide font-comfortaa mb-1 flex items-center gap-2">
              <span>Your Personal Data Security Pledge</span>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                100% Private Session
              </span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              How our site works: This is a secure patient evaluation client. Any clinical numbers, age, biological profile items, or answers you type in are kept locally inside your active browser's temporary memory. We do not register accounts, require log-ins, or save your details to a cloud database. Once you close this tab, your data instantly clears out! Feel free to explore and run risk analyses with total privacy and zero lingering files.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-pulse">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* 3. Core Diagnostic Areas */}
      <div className="space-y-10">
        <div>
          <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight mb-4 font-comfortaa">
            Three Simple Ways to Navigate Your Care
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Predictive Screening */}
            <Link
              to="/tests"
              className="group border border-slate-200 bg-white p-6 rounded-2xl hover:border-brand-medium/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-medium mb-4 group-hover:scale-105 transition-transform">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black text-brand-dark uppercase tracking-tight mb-1 font-comfortaa">
                  Gentle Risk Surveys
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                  Easily check if you are within safe ranges for diabetes, heart health, blood pressure, or kidney signals.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-medium inline-flex items-center gap-1 mt-auto">
                <span>Check Risk Status</span> 
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* Pillar 2: AI Doctor */}
            <Link
              to="/doctor"
              className="group border border-slate-200 bg-white p-6 rounded-2xl hover:border-brand-medium/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-dark mb-4 group-hover:scale-105 transition-transform">
                  <Brain className="h-5 w-5 text-brand-medium" />
                </div>
                <h3 className="text-sm font-black text-brand-dark uppercase tracking-tight mb-1 font-comfortaa">
                  Caring AI Health Chat
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                  Have a relaxed, friendly conversation about basic wellness, wellness targets, and what your lab reports mean.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark inline-flex items-center gap-1 mt-auto">
                <span>Talk to AI Doctor</span> 
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            {/* Pillar 3: Symptom Checker */}
            <Link
              to="/symptoms"
              className="group border border-slate-200 bg-white p-6 rounded-2xl hover:border-brand-medium/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-brand-soft/20 border border-brand-soft/40 flex items-center justify-center text-brand-medium mb-4 group-hover:scale-105 transition-transform">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black text-brand-dark uppercase tracking-tight mb-1 font-comfortaa">
                  Easy Symptom Guide
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                  Tell us what feels off, and we will highlight the best screening modules or areas to review first.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-medium inline-flex items-center gap-1 mt-auto">
                <span>Explain Symptoms</span> 
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* 4. Active Testing Summary */}
        <div className="border border-slate-200 bg-white rounded-2xl p-6 text-start">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-black text-brand-dark uppercase tracking-tight font-comfortaa flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-brand-medium" />
                <span>Active Session Testing Metrics Summary</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Your temporary findings are shown below. They are lost immediately when you reload or close the program.
              </p>
            </div>
            <span className="self-start sm:self-auto text-[10px] px-2.5 py-1 bg-brand-light text-brand-medium border border-slate-100 rounded-lg font-bold">
              {completedCount}/4 Screenings Checked
            </span>
          </div>

          {completedCount === 0 ? (
            <div className="p-5 bg-brand-light/30 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 font-medium col-span-full">
              No tests have been filled in this session yet. Choose an option above to run a risk simulator!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {Object.entries(recentTests).map(([diseaseKey, result]) => {
                const colors = {
                  Low: 'bg-emerald-50 text-emerald-850 border-emerald-200',
                  Medium: 'bg-indigo-50 text-indigo-850 border-indigo-200',
                  High: 'bg-rose-50 text-rose-850 border-rose-200',
                  Unavailable: 'bg-slate-100 text-slate-700 border-slate-200'
                };

                return (
                  <div key={diseaseKey} className="p-3 border border-slate-100 rounded-xl bg-brand-light/20 flex items-center justify-between">
                    <div className="text-start">
                      <span className="text-[9px] font-black uppercase text-brand-slate block tracking-wider">
                        Tested profile
                      </span>
                      <span className="text-xs font-black text-brand-dark uppercase">
                        {getDiseaseTranslation(diseaseKey)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-[9px] font-black border uppercase ${colors[result.riskLevel] || ''}`}>
                      {getRiskTranslation(result.riskLevel)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4.5 Holistic Wellness & Daily Public-Health Guidance */}
        <div id="holistic-wellbeing-approach" className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-light text-brand-medium border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5" />
                Preventative Public-Health Goals
              </span>
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight font-comfortaa mt-2">
                Your Essential Daily Wellness Action Guidelines
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1 font-sans">
                Support your machine learning risk profile with these six critical, evidence-based lifestyle habits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Wellness Graphic Card */}
            <div className="lg:col-span-12 xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden min-h-[350px]">
              <div className="relative z-10 space-y-3">
                <h4 className="text-sm font-black text-brand-dark uppercase tracking-tight font-comfortaa">
                  💡 Holistic Well-being Approach
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed font-sans">
                  Prescriptive lifestyle advice mapped from active patient parameters.
                </p>
              </div>

              {/* Soothing illustration box */}
              <div className="h-56 w-full rounded-xl overflow-hidden mt-4 relative bg-slate-50 border border-slate-100 shadow-3xs cursor-pointer">
                <img 
                  src={wellnessTipsImage} 
                  alt="Holistic Wellness Center" 
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bento Grid Wellness Tips */}
            <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wellnessTips.map((tip, i) => {
                let IconComponent = Heart;
                if (tip.icon === 'water') IconComponent = Droplet;
                else if (tip.icon === 'sleep') IconComponent = Moon;
                else if (tip.icon === 'sugar') IconComponent = TrendingDown;
                else if (tip.icon === 'exercise') IconComponent = Footprints;
                else if (tip.icon === 'stress') IconComponent = Smile;
                else if (tip.icon === 'meal') IconComponent = Utensils;

                return (
                  <div 
                    key={i} 
                    className="bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-col gap-2.5 hover:border-brand-medium/30 hover:shadow-xs transition-all text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tip.colorBg} ${tip.colorText} border ${tip.colorBorder}`}>
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-xs font-black text-brand-dark uppercase tracking-wide font-comfortaa">
                        {tip.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed font-sans">
                      {tip.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Heart-Warming Medicine Reassurance Block with Image */}
        <div className="border border-slate-200 bg-white rounded-3xl overflow-hidden shadow-2xs hover:shadow-xs transition-all animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden self-stretch min-h-[250px]">
              <img 
                src={familyWellness} 
                alt="Happy and Comfortable Lifestyle" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 space-y-4">
              <h3 className="text-normal font-black text-brand-dark uppercase tracking-tight font-comfortaa">
                Preventative Medicine Made Warm and Simple
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 font-semibold font-sans">
                Many severe conditions, like diabetes and hypertension, occur stealthily over several years without immediate warning signs. Early detection using standardized screening tools offers patients a crucial strategic advantage.
              </p>
              <p className="text-xs leading-relaxed text-slate-600 font-semibold font-sans">
                Our hub is structured exclusively around the concept of accessible guidance. Through easy-to-read gauges, patient-first advice, and supportive guidance templates, you get clear clinical concepts without standard hospital anxiety. Remember, these tests are simulators for informational guidance to keep you informed—always talk to your primary clinical doctor for therapeutic answers!
              </p>
              <div className="pt-2 flex flex-wrap gap-6 text-slate-500 font-sans text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Early Intervention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Simplified Explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Private active sessions</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
