import React, { useState } from 'react';
import { PatientIntake } from '../../types';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface PatientProfileStepProps {
  intake: PatientIntake;
  setIntake: (intake: PatientIntake) => void;
  color: 'rose' | 'emerald' | 'amber' | 'indigo' | 'cyan' | 'sky' | 'teal';
  onNext: () => void;
}

const colorMaps = {
  rose: {
    btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-400',
    borderActive: 'border-rose-500 bg-rose-50/50 text-rose-700 font-extrabold',
    focusRing: 'focus:border-rose-400 focus:ring-rose-400',
  },
  emerald: {
    btn: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400',
    borderActive: 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-extrabold',
    focusRing: 'focus:border-emerald-400 focus:ring-emerald-400',
  },
  amber: {
    btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-400',
    borderActive: 'border-amber-500 bg-amber-50/50 text-amber-700 font-extrabold',
    focusRing: 'focus:border-amber-400 focus:ring-amber-400',
  },
  indigo: {
    btn: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400',
    borderActive: 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-extrabold',
    focusRing: 'focus:border-indigo-400 focus:ring-indigo-400',
  },
  teal: {
    btn: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-400',
    borderActive: 'border-teal-500 bg-teal-50/50 text-teal-700 font-extrabold',
    focusRing: 'focus:border-teal-400 focus:ring-teal-400',
  },
};

export default function PatientProfileStep({
  intake,
  setIntake,
  color,
  onNext,
}: PatientProfileStepProps) {
  const currentColors = colorMaps[color];
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [age, setAge] = useState<string>(intake.age || '42');
  const [gender, setGender] = useState<string>(intake.gender || 'Male');
  const [weight, setWeight] = useState<string>(intake.weight || '78');
  const [height, setHeight] = useState<string>(intake.height || '175');
  const [smoke, setSmoke] = useState<boolean>(intake.smoke || false);
  const [alcohol, setAlcohol] = useState<boolean>(intake.alcohol || false);
  const [activityLevel, setActivityLevel] = useState<string>(
    intake.activityLevel || 'Moderate Aerobic (150m/week)'
  );

  const handleProceed = () => {
    if (!age || isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setErrorMsg('Please enter a valid patient age (1 - 120).');
      return;
    }
    if (!height || isNaN(Number(height)) || Number(height) <= 50 || Number(height) > 250) {
      setErrorMsg('Please enter a valid height in cm (50 - 250).');
      return;
    }
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 10 || Number(weight) > 300) {
      setErrorMsg('Please enter a valid weight in kg (10 - 300).');
      return;
    }

    setErrorMsg(null);
    setIntake({
      age,
      gender,
      height,
      weight,
      smoke,
      alcohol,
      activityLevel,
    });
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col gap-6 shadow-xs text-left animate-fade-in font-sans">
      <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">
            Step 1 — General Patient Profile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Specify patient demographics and daily habits for baseline risk modeling.
          </p>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 uppercase">
          Required Baseline
        </span>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-750 p-3.5 rounded-xl border border-red-150 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Age */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Age (Years)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 45"
            min="1"
            max="120"
            className={`bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 transition-all ${currentColors.focusRing}`}
          />
        </div>

        {/* Biological Sex */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setGender('Male')}
              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gender === 'Male'
                  ? currentColors.borderActive
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender('Female')}
              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gender === 'Female'
                  ? currentColors.borderActive
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Height cm */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 175"
            className={`bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 transition-all ${currentColors.focusRing}`}
          />
        </div>

        {/* Weight kg */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 78"
            className={`bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 transition-all ${currentColors.focusRing}`}
          />
        </div>

        {/* Tobacco Smoking habit */}
        <div className="flex flex-col gap-1.5 font-sans">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Tobacco Smoking Habit
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setSmoke(true)}
              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                smoke === true
                  ? currentColors.borderActive
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setSmoke(false)}
              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                smoke === false
                  ? currentColors.borderActive
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Regular Alcohol consumption */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Regular Alcohol Use
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setAlcohol(true)}
              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                alcohol === true
                  ? currentColors.borderActive
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setAlcohol(false)}
              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                alcohol === false
                  ? currentColors.borderActive
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Exercise routines */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Physical Exercise Level
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 transition-all cursor-pointer w-full"
          >
            <option value="Sedentary (desk job)">Sedentary (desk-bounded, minimal light exercise)</option>
            <option value="Moderate Aerobic (150m/week)">Moderate (approx. 150m/week light workouts)</option>
            <option value="Active Athlete (daily training)">Highly Active (regular intensive structural fitness)</option>
            <option value="Elite Conditioning">Elite (very intensive clinical athletic routines)</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={handleProceed}
          className={`text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${currentColors.btn}`}
        >
          <span>Continue to Lab Vitals</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
