'use client'

import React from 'react';
import { Mic } from 'lucide-react';

interface HeaderProps {
  step: number;
  setStep: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ step, setStep }) => {
  return (
    <nav className="no-print bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-[1000]">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl flex items-center gap-2 cursor-pointer" onClick={() => setStep(0)}>
          <Mic className="text-indigo-500" />
          <span>miked<span className="text-indigo-500">.live</span></span>
        </div>
        <div className={`flex-1 flex items-center justify-end gap-6 text-sm ${step === 0 ? 'text-slate-600' : 'text-slate-400'}`}>
          {/* Full text version - shown only on larger screens */}
          <span className="hidden md:inline">
            <span className={step >= 1 ? 'text-indigo-400 font-bold' : ''}>1. Band</span>
            <span className="mx-3">→</span>
            <span className={step >= 2 ? 'text-indigo-400 font-bold' : ''}>2. Stage</span>
            <span className="mx-3">→</span>
            <span className={step >= 3 ? 'text-indigo-400 font-bold' : ''}>3. Details</span>
            <span className="mx-3">→</span>
            <span className={step >= 4 ? 'text-indigo-400 font-bold' : ''}>4. Done</span>
          </span>

          {/* Number-only version - shown on smaller screens */}
          <span className="md:hidden">
            <span className={step >= 1 ? 'text-indigo-400 font-bold' : ''}>1</span>
            <span className="mx-4">→</span>
            <span className={step >= 2 ? 'text-indigo-400 font-bold' : ''}>2</span>
            <span className="mx-4">→</span>
            <span className={step >= 3 ? 'text-indigo-400 font-bold' : ''}>3</span>
            <span className="mx-4">→</span>
            <span className={step >= 4 ? 'text-indigo-400 font-bold' : ''}>4</span>
          </span>
        </div>
      </div>
    </nav>
  );
};