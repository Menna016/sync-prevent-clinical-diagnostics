import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 font-medium text-left">
          <AlertOctagon className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Sync Prevent Diagnostic Suite</strong> is a preventative clinical screening model built on healthcare dataset averages. Always prioritize consultations with licensed human medical staff for official therapeutic decisions.
          </span>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
          © 2026 Sync Prevent Project
        </span>
      </div>
    </footer>
  );
}
