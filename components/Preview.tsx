import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Mic, Music2, Layers, Box, Clock, Printer } from 'lucide-react';
import { RiderData } from '../types';
import { InputList } from './InputList';
import { StagePlotCanvas } from './StagePlotCanvas';

export interface PreviewHandle {
  downloadPdf: () => Promise<void>;
}

interface PreviewProps {
  data: RiderData;
}

export const Preview = forwardRef<PreviewHandle, PreviewProps>(({ data }, ref) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    
    try {
      // Wait for React to render any pending updates
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use system print dialog for reliable PDF generation
      // This avoids html2canvas text rendering issues
      window.print();
    } catch (err) {
      console.error(err);
      alert('Error opening print dialog. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useImperativeHandle(ref, () => ({
    downloadPdf: handleDownloadPDF
  }));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="no-print w-full max-w-4xl mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800 p-4 rounded-lg">
         <div>
           <h2 className="text-xl font-bold text-white">Your Rider is ready!</h2>
           <p className="text-slate-400 text-sm">Review it below. Click "Print to PDF" or use your browser's print function (Ctrl+P / Cmd+P).</p>
         </div>
         <button
           onClick={handleDownloadPDF}
           disabled={isGeneratingPdf}
           className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
         >
           <Printer size={20} />
           Print to PDF
         </button>
      </div>

      {/* A4 PAPER PREVIEW */}
      <div ref={previewRef} className="a4-page bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl mx-auto relative flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{data.details.bandName || 'BAND NAME'}</h1>
            <div className="flex gap-8 text-sm">
                <div className="space-y-1">
                    {data.details.contactName && <p><span className="font-bold">Contact:</span> {data.details.contactName}</p>}
                    {data.details.email && <p><span className="font-bold">Email:</span> {data.details.email}</p>}
                    {data.details.phone && <p><span className="font-bold">Phone:</span> {data.details.phone}</p>}
                    {data.details.website && <p><span className="font-bold">Website:</span> {data.details.website}</p>}
                </div>
                {(data.details.showDuration || data.details.soundcheckDuration || (data.details.stageWidth && data.details.stageDepth)) && (
                    <div className="space-y-1 border-l border-slate-300 pl-8">
                         {data.details.showDuration && <p className="flex items-center gap-2"><Clock size={14} /> <span className="font-bold">Show:</span> {data.details.showDuration}</p>}
                         {data.details.soundcheckDuration && <p className="flex items-center gap-2"><Clock size={14} /> <span className="font-bold">Soundcheck:</span> {data.details.soundcheckDuration}</p>}
                         {data.details.stageWidth && data.details.stageDepth && (
                           <p className="flex items-center gap-2"><Layers size={14} /> <span className="font-bold">Stage:</span> {data.details.stageWidth}{data.details.stageDimensionUnit} × {data.details.stageDepth}{data.details.stageDimensionUnit}</p>
                         )}
                    </div>
                )}
            </div>
          </div>
          {data.details.logoUrl ? (
             <img src={data.details.logoUrl} alt="Band Logo" className="h-24 max-w-[150px] object-contain" />
          ) : (
             <div className="h-24 w-24 bg-slate-100 flex items-center justify-center text-slate-300 font-bold border border-slate-200">LOGO</div>
          )}
        </div>

        {/* Notes */}
        {data.details.generalNotes && (
          <div className="bg-slate-50 p-4 border-l-4 border-black text-sm break-inside-avoid">
             <h3 className="font-bold uppercase text-xs mb-2 text-slate-500">Notes</h3>
             <p className="whitespace-pre-wrap">{data.details.generalNotes}</p>
          </div>
        )}

        {/* Input List */}
        <div className="break-inside-avoid">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Mic size={20} /> Input List
          </h3>
          <InputList members={data.members} />
        </div>

        {/* Stageplot */}
        <div className="flex-1 flex flex-col min-h-0 break-inside-avoid pt-8">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Music2 size={20} /> Stage Plot
          </h3>
          
          <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Top View */}
              <div className="relative w-full max-w-[90%] aspect-[8/5] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Layers size={24} className="text-black" />
                </div>
                <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="top" showAudienceLabel={true} isPreview={true} members={data.members} />
              </div>

              {/* 3D View */}
              <div className="relative w-full max-w-[90%] aspect-[8/5] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Box size={24} className="text-black" />
                </div>
                <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="isometric" showAudienceLabel={true} isPreview={true} members={data.members} />
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 uppercase">
           <span>{data.details.bandName} - Tech Rider</span>
           <span>Created with miked.app</span>
        </div>

      </div>
      
      <div className="no-print mt-8 text-center text-slate-500 text-sm">
        <p>Tip: You can customize the stage positions in step 2 before downloading.</p>
      </div>
    </div>
  );
});