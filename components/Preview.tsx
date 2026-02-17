import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Mic, Music2, Layers, Box, Clock, Download, Loader2 } from 'lucide-react';
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
  const [topViewImage, setTopViewImage] = useState<string | null>(null);
  const [isoViewImage, setIsoViewImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // Update preview scale when window resizes
  useEffect(() => {
    const updateScale = () => {
      const padding = 32; // accounts for responsive px-2 sm:px-4 md:px-8 padding
      const maxWidth = window.innerWidth - padding;
      const previewWidth = 794;
      setScale(Math.min(1, maxWidth / previewWidth));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Measure the preview's natural (unscaled) height so we can collapse dead space below it
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      setNaturalHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);

    // Add CSS fix before capturing
    const style = document.createElement('style');
    style.textContent = `
      img { display: inline-block !important; }
      p, h1, h2, h3, h4, h5, h6, li, div { word-wrap: break-word !important; overflow-wrap: break-word !important; }
      p, li { line-height: 1.5 !important; }
    `;
    document.head.appendChild(style);

    // Clone the preview into a fixed-width off-screen container for consistent captures
    let cloneContainer: HTMLDivElement | null = null;

    try {
      const previewEl = previewRef.current;
      if (!previewEl) return;

      // Create an off-screen clone at fixed A4 width so captures are screen-independent
      cloneContainer = document.createElement('div');
      cloneContainer.style.position = 'fixed';
      cloneContainer.style.left = '-9999px';
      cloneContainer.style.top = '0';
      cloneContainer.style.width = '794px'; // 210mm at 96dpi
      cloneContainer.style.maxWidth = '794px';
      cloneContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(cloneContainer);

      const clone = previewEl.cloneNode(true) as HTMLElement;
      clone.style.width = '100%';
      clone.style.transform = 'none';
      clone.style.marginBottom = '0';
      clone.style.maxWidth = '100%';
      cloneContainer.appendChild(clone);

      // Wait for reflow and images to settle at fixed width
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find sections in the clone by data attributes
      const clonedHeader = clone.querySelector('[data-pdf="header"]') as HTMLElement | null;
      const clonedGeneralNotes = clone.querySelector('[data-pdf="general-notes"]') as HTMLElement | null;
      const clonedInputList = clone.querySelector('[data-pdf="input-list"]') as HTMLElement | null;
      const clonedTechnicalNotes = clone.querySelector('[data-pdf="technical-notes"]') as HTMLElement | null;
      const clonedStagePlot = clone.querySelector('[data-pdf="stage-plot"]') as HTMLElement | null;
      const clonedFooter = clone.querySelector('[data-pdf="footer"]') as HTMLElement | null;

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
      if (clonedHeader) {
        const headerCanvas = await html2canvas(clonedHeader, {
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
      if (clonedGeneralNotes) {
        const generalNotesCanvas = await html2canvas(clonedGeneralNotes, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 5000,
          removeContainer: false,
        });

        const generalNotesHeight = (generalNotesCanvas.height * usableWidth) / generalNotesCanvas.width;

        if (currentY + generalNotesHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }

        safeAddImage(generalNotesCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, generalNotesHeight, 'General Notes');
        currentY += generalNotesHeight + 8;
      }

      // Add input list section
      if (clonedInputList) {
        const inputListCanvas = await html2canvas(clonedInputList, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const inputListHeight = (inputListCanvas.height * usableWidth) / inputListCanvas.width;

        if (currentY + inputListHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }

        safeAddImage(inputListCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, inputListHeight, 'Input List');
        currentY += inputListHeight;
      }

      // Add technical notes section if it exists
      if (clonedTechnicalNotes) {
        const technicalNotesCanvas = await html2canvas(clonedTechnicalNotes, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          imageTimeout: 5000,
          removeContainer: false,
        });

        const technicalNotesHeight = (technicalNotesCanvas.height * usableWidth) / technicalNotesCanvas.width;

        if (currentY + technicalNotesHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }

        safeAddImage(technicalNotesCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, technicalNotesHeight, 'Technical Notes');
        currentY += technicalNotesHeight + 8;
      }

      // PAGE 2+: Add stage plot images directly (captured at fixed size for consistency)
      pdf.addPage();
      currentY = pageMargin;

      // Add "Stage Plot" heading
      if (clonedStagePlot) {
        const headingEl = clonedStagePlot.querySelector('h3');
        if (headingEl) {
          const headingCanvas = await html2canvas(headingEl as HTMLElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          });
          const headingHeight = (headingCanvas.height * usableWidth) / headingCanvas.width;
          safeAddImage(headingCanvas.toDataURL('image/jpeg', 0.99), pageMargin, currentY, usableWidth, headingHeight, 'Stage Plot Heading');
          currentY += headingHeight + 4;
        }
      }

      // Add captured stage plot images at known 8:5 aspect ratio
      const plotWidth = usableWidth * 0.9;
      const plotHeight = plotWidth * (5 / 8);
      const plotX = pageMargin + (usableWidth - plotWidth) / 2;

      if (topViewImage) {
        safeAddImage(topViewImage, plotX, currentY, plotWidth, plotHeight, 'Stage Plot - Top View');
        currentY += plotHeight + 6;
      }

      if (isoViewImage) {
        if (currentY + plotHeight > pdfHeight - pageMargin) {
          pdf.addPage();
          currentY = pageMargin;
        }
        safeAddImage(isoViewImage, plotX, currentY, plotWidth, plotHeight, 'Stage Plot - 3D View');
      }

      // Add footer to all pages
      if (clonedFooter) {
        const footerCanvas = await html2canvas(clonedFooter, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const footerHeight = (footerCanvas.height * usableWidth) / footerCanvas.width;
        const footerY = pdfHeight - pageMargin - footerHeight - 5;
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
      // Remove the off-screen clone
      if (cloneContainer) {
        document.body.removeChild(cloneContainer);
      }
      // Remove CSS fix
      document.head.removeChild(style);
      setIsGeneratingPdf(false);
    }
  };

  useImperativeHandle(ref, () => ({
    downloadPdf: handleDownloadPDF
  }));

  return (
    <div className="w-full flex flex-col items-center bg-slate-900">
      <div className="no-print w-full mx-2 sm:mx-4 md:mx-8 max-w-2xl mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800 p-4 rounded-lg">
         <div>
           <h2 className="text-xl font-bold text-white">Your Rider is ready!</h2>
           <p className="text-slate-400 text-sm">Review it below and download as PDF.</p>
         </div>
         <button
           onClick={handleDownloadPDF}
           disabled={isGeneratingPdf}
           className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-wait text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all whitespace-nowrap"
         >
           {isGeneratingPdf ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
           {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
         </button>
      </div>

      {/* Scale container — no transform here, just centering */}
      <div className="flex justify-center w-full bg-slate-900">
      {/* A4 PAPER PREVIEW — scaled here so layout space collapses naturally via negative margin */}
      <div ref={previewRef} className="a4-page bg-white text-black shadow-2xl relative flex flex-col gap-8" style={{ width: '794px', padding: '56px', boxSizing: 'border-box', transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: `${-naturalHeight * (1 - scale)}px` }}>
        
        {/* Header */}
        <div ref={headerRef} data-pdf="header" className="flex justify-between items-start border-b-2 border-black pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{data.details.bandName || 'BAND NAME'}</h1>
            <div className="flex gap-8 text-sm">
                <div className="space-y-1">
                    {data.details.contactName && <p><span className="font-bold">Contact:</span> {data.details.contactName}</p>}
                    {data.details.email && <p><span className="font-bold">Email:</span> {data.details.email}</p>}
                    {data.details.phone && <p><span className="font-bold">Phone:</span> {data.details.phone}</p>}
                    {data.details.website && <p><span className="font-bold">Website:</span> {data.details.website}</p>}
                    {data.details.socials && <p><span className="font-bold">Socials:</span> {data.details.socials}</p>}
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
          <div ref={generalNotesRef} data-pdf="general-notes" className="text-sm break-inside-avoid">
             <div
               className="max-w-full break-words [&_*]:break-words [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2 [&_p]:break-words [&_p]:word-wrap"
               dangerouslySetInnerHTML={{ __html: data.details.generalNotes }}
             />
          </div>
        )}

        {/* Input List */}
        <div ref={inputListRef} data-pdf="input-list" className="break-inside-avoid">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Mic size={20} /> Input List
          </h3>
          <InputList members={data.members} />
        </div>

        {/* Technical Notes */}
        {data.details.technicalNotes && (
          <div ref={technicalNotesRef} data-pdf="technical-notes" className="text-sm break-inside-avoid">
             <div
               className="max-w-full break-words [&_*]:break-words [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:font-bold [&_h3]:text-sm [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2 [&_p]:break-words [&_p]:word-wrap"
               dangerouslySetInnerHTML={{ __html: data.details.technicalNotes }}
             />
          </div>
        )}

        {/* Stageplot */}
        <div ref={stagePlotRef} data-pdf="stage-plot" className="pt-8">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Music2 size={20} /> Stage Plot
          </h3>

          <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Top View */}
              <div className="relative w-full max-w-[90%] aspect-[8/5] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Layers size={24} className="text-black" />
                </div>
                {topViewImage ? (
                  <img src={topViewImage} alt="Stage plot - top view" className="w-full h-full object-contain border-2 border-slate-300 bg-slate-50" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-300">Loading stage plot...</div>
                )}
              </div>

              {/* 3D View */}
              <div className="relative w-full max-w-[90%] aspect-[8/5] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Box size={24} className="text-black" />
                </div>
                {isoViewImage ? (
                  <img src={isoViewImage} alt="Stage plot - 3D view" className="w-full h-full object-contain border-2 border-slate-300 bg-slate-50" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-300">Loading stage plot...</div>
                )}
              </div>
          </div>
        </div>

        {/* Footer */}
        <div ref={footerRef} data-pdf="footer" className="mt-auto pt-8 pb-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 uppercase">
           <span>{data.details.bandName} - Tech Rider</span>
           <span>Created with miked.app</span>
        </div>

      </div>
      </div>

      {/* Off-screen fixed-size containers for consistent stage plot captures */}
      {!topViewImage && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: 1600, height: 1000 }} aria-hidden="true">
          <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="top" showAudienceLabel={true} isPreview={true} members={data.members} onScreenshot={setTopViewImage} />
        </div>
      )}
      {!isoViewImage && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: 1600, height: 1000 }} aria-hidden="true">
          <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="isometric" showAudienceLabel={true} isPreview={true} members={data.members} onScreenshot={setIsoViewImage} />
        </div>
      )}
    </div>
  );
});