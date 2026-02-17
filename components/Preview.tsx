import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Mic, Music2, Layers, Box, Clock, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const headerRef = useRef<HTMLDivElement>(null);
  const generalNotesRef = useRef<HTMLDivElement>(null);
  const inputListRef = useRef<HTMLDivElement>(null);
  const technicalNotesRef = useRef<HTMLDivElement>(null);
  const stagePlotRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);

    try {
      // Wait for React to render and images to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const pageMargin = 15;
      const usableWidth = pdfWidth - (pageMargin * 2);

      let currentY = pageMargin;

      // Helper function to safely add images to PDF
      const safeAddImage = (imageData: string, x: number, y: number, width: number, height: number, label: string) => {
        if (!imageData || !width || !height || isNaN(width) || isNaN(height)) {
          console.warn(`[PDF] Skipping ${label} - invalid dimensions:`, { width, height, dataLength: imageData?.length });
          return;
        }
        console.log(`[PDF] Adding ${label} - dimensions: ${width}x${height}`);
        pdf.addImage(imageData, 'JPEG', x, y, width, height);
      };

      // PAGE 1: Capture and add header + input list sections
      if (headerRef.current) {
        const headerCanvas = await html2canvas(headerRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const headerHeight = (headerCanvas.height * usableWidth) / headerCanvas.width;
        safeAddImage(headerCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, headerHeight, 'Header');
        currentY += headerHeight + 8;
      }

      // Add general notes section if it exists
      if (generalNotesRef.current) {
        const generalNotesCanvas = await html2canvas(generalNotesRef.current, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 5000,
          removeContainer: false,
        });

        const generalNotesHeight = (generalNotesCanvas.height * usableWidth) / generalNotesCanvas.width;

        // Check if general notes fits on current page, if not start new page
        if (currentY + generalNotesHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }

        safeAddImage(generalNotesCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, generalNotesHeight, 'General Notes');
        currentY += generalNotesHeight + 8;
      }

      // Add input list section
      if (inputListRef.current) {
        const inputListCanvas = await html2canvas(inputListRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const inputListHeight = (inputListCanvas.height * usableWidth) / inputListCanvas.width;

        // Check if input list fits on current page, if not start new page
        if (currentY + inputListHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }

        safeAddImage(inputListCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, inputListHeight, 'Input List');
        currentY += inputListHeight;
      }

      // Add technical notes section if it exists
      if (technicalNotesRef.current) {
        const technicalNotesCanvas = await html2canvas(technicalNotesRef.current, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 5000,
          removeContainer: false,
        });

        const technicalNotesHeight = (technicalNotesCanvas.height * usableWidth) / technicalNotesCanvas.width;

        // Check if technical notes fits on current page, if not start new page
        if (currentY + technicalNotesHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }

        safeAddImage(technicalNotesCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, technicalNotesHeight, 'Technical Notes');
        currentY += technicalNotesHeight + 8;
      }

      // PAGE 2+: Add stage plot on new page
      pdf.addPage();
      currentY = pageMargin;

      if (stagePlotRef.current) {
        const stagePlotCanvas = await html2canvas(stagePlotRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const stagePlotHeight = (stagePlotCanvas.height * usableWidth) / stagePlotCanvas.width;
        safeAddImage(stagePlotCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, stagePlotHeight, 'Stage Plot');
      }

      // Add footer to all pages
      if (footerRef.current) {
        const footerCanvas = await html2canvas(footerRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const footerHeight = (footerCanvas.height * usableWidth) / footerCanvas.width;
        const footerY = pdfHeight - pageMargin - footerHeight - 5; // Extra 5mm buffer from bottom
        const totalPages = pdf.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          safeAddImage(footerCanvas.toDataURL('image/jpeg', 0.99), pageMargin, footerY, usableWidth, footerHeight, `Footer (Page ${i})`);
        }
      }

      pdf.save(`${data.details.bandName || 'tech-rider'}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF. Please try again.');
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
           <p className="text-slate-400 text-sm">Review it below and download as PDF.</p>
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
        <div ref={headerRef} className="flex justify-between items-start border-b-2 border-black pb-6">
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
          <div ref={generalNotesRef} className="text-sm break-inside-avoid">
             <div
               className="max-w-none [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2"
               dangerouslySetInnerHTML={{ __html: data.details.generalNotes }}
             />
          </div>
        )}

        {/* Input List */}
        <div ref={inputListRef} className="break-inside-avoid">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Mic size={20} /> Input List
          </h3>
          <InputList members={data.members} />
        </div>

        {/* Technical Notes */}
        {data.details.technicalNotes && (
          <div ref={technicalNotesRef} className="text-sm break-inside-avoid">
             <div
               className="max-w-none [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2"
               dangerouslySetInnerHTML={{ __html: data.details.technicalNotes }}
             />
          </div>
        )}

        {/* Stageplot */}
        <div ref={stagePlotRef} className="pt-8">
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
        <div ref={footerRef} className="mt-auto pt-8 pb-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 uppercase">
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