import React from 'react';
import { ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react';

interface FooterNavProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  canProceed: boolean;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export const FooterNav: React.FC<FooterNavProps> = ({ step, setStep, canProceed, onDownload, isDownloading }) => {
  if (step === 0) return null;

  return (
    <div className="no-print bg-slate-950 p-4 border-t border-slate-800 sticky bottom-0 w-full z-[1000]">
      <div className="max-w-4xl mx-auto flex justify-between">
        <button 
          onClick={() => setStep(s => s - 1)}
          className={`px-6 py-2 rounded font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors ${step === 4 ? 'visible' : ''}`}
        >
          <ArrowLeft size={18} /> Back
        </button>
        
        {step < 4 ? (
          <button 
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
              canProceed 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Next Step <ArrowRight size={18} />
          </button>
        ) : (
           <button 
              onClick={onDownload}
              disabled={isDownloading} 
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-wait text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all"
           >
             {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
             {isDownloading ? 'Generating...' : 'Download PDF'}
           </button>
        )}
      </div>
    </div>
  );
};