'use client'

import React from 'react';
import { Mic, Info, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-indigo-600 p-6 rounded-full mb-6 animate-bounce">
        <Mic size={64} className="text-white" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Miked<span className="text-indigo-500">.live</span>
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mb-8">
        Create a professional technical rider and stage plot for your band in 5 minutes. 
        No account needed, instant results.
      </p>
      <button 
        onClick={onStart}
        className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Start Now <ArrowRight />
      </button>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-400 text-sm">
        <div className="flex flex-col items-center">
          <Info className="mb-2" />
          <span>Automatic Input List</span>
        </div>
        <div className="flex flex-col items-center">
          <Info className="mb-2" />
          <span>Drag & Drop Stage Plot</span>
        </div>
        <div className="flex flex-col items-center">
          <Info className="mb-2" />
          <span>Direct PDF Export</span>
        </div>
      </div>
    </div>
  );
};
