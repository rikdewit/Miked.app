import React, { useRef, useState } from 'react';
import { Download, Mic, Music2, Layers, Box, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RiderData } from '../types';
import { InputList } from './InputList';
import { StagePlotCanvas } from './StagePlotCanvas';

interface PreviewProps {
  data: RiderData;
}

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPdf(true);
    
    // Cleanup any existing spacers from failed runs
    document.querySelectorAll('.pdf-spacer').forEach(s => s.remove());

    try {
      // Wait for React to render any pending updates
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = previewRef.current;
      // Calculate A4 Page Height in pixels based on the rendered width (A4 is 210mm x 297mm)
      // We assume the rendered width corresponds to 210mm minus margins, but HTML2Canvas captures the whole element.
      // If the CSS width is 210mm, then aspect ratio 1.414 gives height.
      const width = element.offsetWidth;
      const pageHeight = width * 1.414; 
      
      const breakAvoidElements = element.querySelectorAll('.break-inside-avoid');
      const spacers: HTMLDivElement[] = [];
      const containerTop = element.getBoundingClientRect().top;

      // Logic: Iterate over 'break-inside-avoid' elements.
      // If an element crosses a page boundary, insert a spacer before it to push it to the next page.
      breakAvoidElements.forEach((el) => {
          // Calculate position relative to the top of the preview container
          // We must re-calculate rect here because previous loop iterations might have shifted the DOM
          const currentRect = el.getBoundingClientRect();
          const elTop = currentRect.top - containerTop;
          const elBottom = elTop + currentRect.height;
          
          const startPage = Math.floor(elTop / pageHeight);
          const endPage = Math.floor(elBottom / pageHeight);
          
          if (startPage !== endPage) {
              // The element crosses a page break.
              // Push it to the start of the next page.
              const nextPageStart = (startPage + 1) * pageHeight;
              const spacerHeight = nextPageStart - elTop + 20; // +20px buffer
              
              const spacer = document.createElement('div');
              spacer.style.height = `${spacerHeight}px`;
              spacer.style.width = '100%';
              spacer.className = 'pdf-spacer';
              
              if (el.parentNode) {
                  el.parentNode.insertBefore(spacer, el);
                  spacers.push(spacer);
              }
          }
      });

      // Allow DOM to update layout with spacers
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        windowWidth: 1200, // Force specific width to ensure layout consistency
      });

      // Restore DOM immediately after capture
      spacers.forEach(s => s.remove());

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // We calculate the image width/height based on the PDF width
      const imgWidth = pdfWidth;
      const totalImgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = totalImgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, totalImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, totalImgHeight);
        heightLeft -= pdfHeight;
      }

      const safeName = data.details.bandName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'rider';
      pdf.save(`${safeName}_technical_rider.pdf`);
    } catch (err) {
      console.error(err);
      alert('Could not generate PDF automatically. You can try the "System Print" option instead.');
    } finally {
      document.querySelectorAll('.pdf-spacer').forEach(s => s.remove());
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="no-print w-full max-w-4xl mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800 p-4 rounded-lg">
         <div>
           <h2 className="text-xl font-bold text-white">Your Rider is ready!</h2>
           <p className="text-slate-400 text-sm">Review it below or download it now.</p>
         </div>
         <div className="flex gap-3">
            <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-wait text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all min-w-[180px] justify-center"
            >
                {isGeneratingPdf ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} 
                {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </button>
         </div>
      </div>

      {/* A4 PAPER PREVIEW */}
      <div ref={previewRef} className="a4-page bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl mx-auto relative flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{data.details.bandName || 'BAND NAME'}</h1>
            <div className="text-sm space-y-1">
              <p><span className="font-bold">Contact:</span> {data.details.contactName}</p>
              <p><span className="font-bold">Email:</span> {data.details.email}</p>
              <p className="text-slate-500 text-xs mt-2">Technical Rider & Stageplot</p>
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
        <div className="flex-1 flex flex-col min-h-0 break-inside-avoid">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Music2 size={20} /> Stage Plot
          </h3>
          
          <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Top View */}
              <div className="relative w-full max-w-[80%] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Layers size={24} className="text-black" />
                </div>
                <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="top" showAudienceLabel={true} />
              </div>

              {/* 3D View */}
              <div className="relative w-full max-w-[80%] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Box size={24} className="text-black" />
                </div>
                <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="isometric" showAudienceLabel={true} />
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
};