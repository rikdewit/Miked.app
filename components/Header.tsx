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
           <span>miked<span className="text-indigo-500">.app</span></span>
         </div>
         {step > 0 && (
           <div className="flex items-center gap-2 text-sm text-slate-400">
             <span className={step >= 1 ? 'text-indigo-400 font-bold' : ''}>1. Instruments</span>
             <span>→</span>
             <span className={step >= 2 ? 'text-indigo-400 font-bold' : ''}>2. Stage</span>
             <span>→</span>
             <span className={step >= 3 ? 'text-indigo-400 font-bold' : ''}>3. Info</span>
             <span>→</span>
             <span className={step >= 4 ? 'text-indigo-400 font-bold' : ''}>4. Done</span>
           </div>
         )}
      </div>
    </nav>
  );
};