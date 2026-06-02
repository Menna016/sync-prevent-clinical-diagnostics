import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, Menu, X, User } from 'lucide-react';
import { PatientIntake } from '../types';

interface NavbarProps {
  intake: PatientIntake;
}

export default function Navbar({ intake }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Helper calculation for BMI
  const hM = Number(intake.height) / 100;
  const bmiVal = hM > 0 ? (Number(intake.weight) / (hM * hM)).toFixed(1) : '24.0';

  const getTranslatedGender = (gender: string) => {
    if (gender === 'Male') return 'Male';
    if (gender === 'Female') return 'Female';
    return gender;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-3xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Logo/Identity */}
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-brand-dark border border-brand-dark flex items-center justify-center text-white shadow-2xs group-hover:scale-102 transition-transform">
              <Activity className="h-5 w-5 text-brand-soft animate-pulse" />
            </div>
            <div className="flex flex-col text-start font-comfortaa">
              <span className="text-sm font-black text-brand-dark uppercase tracking-tight leading-none font-sans">
                Sync Prevent
              </span>
              <span className="text-[10px] font-bold text-brand-slate leading-none mt-1 uppercase font-sans">
                Clinical Diagnostics
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 h-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-soft/50 text-brand-dark'
                  : 'text-slate-600 hover:text-brand-dark hover:bg-brand-light'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tests"
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-soft/50 text-brand-dark'
                  : 'text-slate-600 hover:text-brand-dark hover:bg-brand-light'
              }`
            }
          >
            Preventative Tests
          </NavLink>

          <NavLink
            to="/doctor"
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-soft/50 text-brand-dark'
                  : 'text-slate-600 hover:text-brand-dark hover:bg-brand-light'
              }`
            }
          >
            Dr. Sync AI
          </NavLink>

          <NavLink
            to="/symptoms"
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-soft/50 text-brand-dark'
                  : 'text-slate-600 hover:text-brand-dark hover:bg-brand-light'
              }`
            }
          >
            Symptom Checker
          </NavLink>
        </nav>

        {/* Patient Header Summary */}
        <div className="flex items-center gap-3">
          
          {/* Profile Card */}
          <div className="hidden lg:flex items-center gap-3 bg-brand-light border border-slate-200 py-1.5 px-3.5 rounded-xl text-xs font-bold shadow-3xs text-brand-dark">
            <User className="w-4 h-4 text-brand-slate" />
            <span className="text-slate-500 font-medium font-sans">Patient Profile:</span>
            <span className="font-extrabold text-brand-dark font-sans">
              {intake.age}y {getTranslatedGender(intake.gender)}
            </span>
            <div className="w-px h-3 bg-slate-200" />
            <span className="text-slate-500 font-medium font-sans">BMI:</span>
            <span className="font-extrabold text-brand-medium font-sans">{bmiVal}</span>
          </div>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer animate-fade-in animate-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile responsive drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-2 animate-fade-in text-start">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-slate-700 hover:bg-slate-50 text-start cursor-pointer transition-all"
          >
            Home
          </Link>
          <Link
            to="/tests"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-slate-700 hover:bg-slate-50 text-start cursor-pointer transition-all"
          >
            Preventative Tests
          </Link>
          <Link
            to="/doctor"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-slate-700 hover:bg-slate-50 text-start cursor-pointer transition-all"
          >
            Dr. Sync AI
          </Link>
          <Link
            to="/symptoms"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-slate-700 hover:bg-slate-50 text-start cursor-pointer transition-all"
          >
            Symptom Checker
          </Link>

          {/* Patient statistics mobile info */}
          <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs px-4 text-slate-650">
              <span>
                Patient Profile: <strong>{intake.age}y {getTranslatedGender(intake.gender)}</strong>
              </span>
              <span>
                BMI: <strong>{bmiVal} kg/m²</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
