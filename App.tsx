import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_RIDER_DATA, INSTRUMENTS } from './constants';
import { RiderData, BandMember, StageItem, InstrumentType } from './types';
import { StagePlotCanvas } from './components/StagePlotCanvas';
import { InputList } from './components/InputList';
import { Plus, Trash2, Mic, Info, ArrowRight, ArrowLeft, Download, Printer, Music2, X, Box, Layers, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Landing, 1: Instruments, 2: Stage, 3: Details, 4: Preview
  const [data, setData] = useState<RiderData>(INITIAL_RIDER_DATA);
  const [stageViewMode, setStageViewMode] = useState<'isometric' | 'top'>('isometric');
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- Step 1 Handlers (Instruments) ---
  const addMember = () => {
    const newMember: BandMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      instrumentIds: [INSTRUMENTS[0].id],
      notes: ''
    };
    setData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const applyRockTemplate = () => {
    const newMembers: BandMember[] = [
      { id: Math.random().toString(36).substr(2, 9), name: 'Drummer', instrumentIds: ['drums'], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Bassist', instrumentIds: ['bass'], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Guitarist', instrumentIds: ['gtr_elec'], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Singer', instrumentIds: ['voc_lead'], notes: '' },
    ];
    setData(prev => ({ ...prev, members: newMembers }));
  };

  const updateMemberName = (id: string, name: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, name } : m)
    }));
  };

  const updateMemberNotes = (id: string, notes: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, notes } : m)
    }));
  };

  const addMemberInstrument = (memberId: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          return { ...m, instrumentIds: [...m.instrumentIds, INSTRUMENTS[0].id] };
        }
        return m;
      })
    }));
  };

  const updateMemberInstrument = (memberId: string, index: number, instrumentId: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          const newIds = [...m.instrumentIds];
          newIds[index] = instrumentId;
          return { ...m, instrumentIds: newIds };
        }
        return m;
      })
    }));
  };

  const removeMemberInstrument = (memberId: string, index: number) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
           const newIds = m.instrumentIds.filter((_, i) => i !== index);
           return { ...m, instrumentIds: newIds };
        }
        return m;
      })
    }));
  };

  const removeMember = (id: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }));
  };

  // --- Step 2 Handlers (Stage Plot) ---
  
  // Helper to determine member role for layout
  const getMemberRole = (member: BandMember) => {
    const instruments = member.instrumentIds.map(id => INSTRUMENTS.find(i => i.id === id));
    if (instruments.some(i => i?.type === InstrumentType.DRUMS)) return 'drummer';
    if (instruments.some(i => i?.type === InstrumentType.BASS)) return 'bass';
    if (instruments.some(i => i?.type === InstrumentType.KEYS)) return 'keys';
    if (instruments.some(i => i?.type === InstrumentType.BRASS)) return 'horn';
    if (instruments.some(i => i?.type === InstrumentType.VOCAL)) return 'vocal'; // Lead vocal priority if no other heavy instrument
    return 'front'; // Guitars and others default to front
  };

  useEffect(() => {
    if (step === 2) {
      setData(prev => {
         // 1. Sync: Remove items for deleted members
         const validMemberIds = new Set(prev.members.map(m => m.id));
         let currentPlot = prev.stagePlot.filter(item => !item.memberId || validMemberIds.has(item.memberId));
         
         // Update labels of existing people (in case name changed)
         currentPlot = currentPlot.map(item => {
             if (item.type === 'person' && item.memberId) {
                 const m = prev.members.find(mem => mem.id === item.memberId);
                 if (m && m.name !== item.label) return { ...item, label: m.name };
             }
             return item;
         });

         // 2. Identify who is missing (Members who have NO items on stage)
         const existingMemberIds = new Set(currentPlot.filter(i => i.memberId).map(i => i.memberId));
         const membersToAdd = prev.members.filter(m => !existingMemberIds.has(m.id));

         // If no new members to add and no deletions, return previous state to Preserve Positions
         if (membersToAdd.length === 0) {
             if (JSON.stringify(currentPlot) !== JSON.stringify(prev.stagePlot)) {
                 return { ...prev, stagePlot: currentPlot };
             }
             return prev;
         }

         // 3. Generate Items for NEW members only
         const newItems: StageItem[] = [];
         const isFreshLayout = currentPlot.length === 0;
         
         const assignments = new Map<string, {x: number, y: number}>();
         
         if (isFreshLayout) {
             // -- Full Layout Logic (Only runs on first visit or clear) --
              let drummer = membersToAdd.find(m => getMemberRole(m) === 'drummer');
              let otherMembers = membersToAdd.filter(m => m !== drummer);
              
              const backRow: BandMember[] = [];
              const frontRow: BandMember[] = [];
              otherMembers.forEach(m => {
                const role = getMemberRole(m);
                (['bass', 'keys', 'horn'].includes(role)) ? backRow.push(m) : frontRow.push(m);
              });

              if (drummer) assignments.set(drummer.id, { x: 50, y: 25 });
              
              const backSlots = [30, 70, 15, 85]; 
              backRow.forEach((m, i) => assignments.set(m.id, { x: backSlots[i % backSlots.length] || 10 + (i*10), y: 30 }));
              
              const frontSlots = [50, 30, 70, 15, 85, 40, 60];
              const leadSingerIndex = frontRow.findIndex(m => getMemberRole(m) === 'vocal');
              if (leadSingerIndex !== -1) frontRow.unshift(frontRow.splice(leadSingerIndex, 1)[0]);
              frontRow.forEach((m, i) => assignments.set(m.id, { x: frontSlots[i % frontSlots.length] || 10 + (i*10), y: 75 }));

         } else {
             // -- Append Mode (Preserve existing, add new to generic spots) --
             membersToAdd.forEach((m, i) => {
                 assignments.set(m.id, { x: 50 + (i % 2 === 0 ? (i+1)*5 : -(i+1)*5), y: 50 });
             });
         }

         // Generate StageItems for new members
         membersToAdd.forEach(member => {
             const pos = assignments.get(member.id) || { x: 50, y: 50 };
             
             // Person
             newItems.push({ id: `person-${member.id}`, memberId: member.id, type: 'person', label: member.name, x: pos.x, y: pos.y });
             
             // Instruments
              const holdableTypes = [InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS, InstrumentType.STRINGS];
              const memberInstDefs = member.instrumentIds.map(id => INSTRUMENTS.find(i => i.id === id));
              const heldIndex = memberInstDefs.findIndex(def => def && holdableTypes.includes(def.type));

              member.instrumentIds.forEach((instId, idx) => {
                  const instDef = INSTRUMENTS.find(i => i.id === instId);
                  if (!instDef) return;
                  const isHeld = (idx === heldIndex);

                  if (instDef.id === 'gtr_elec' || instDef.type === InstrumentType.BASS) {
                      newItems.push({ id: `amp-${member.id}-${idx}`, memberId: member.id, type: 'member', label: 'Amp', x: pos.x + (idx % 2 === 0 ? -10 : 10), y: pos.y - 15 });
                      newItems.push({ id: `inst-${member.id}-${idx}`, memberId: member.id, type: 'member', label: instDef.type === InstrumentType.BASS ? 'Bass' : 'Gtr', x: isHeld ? pos.x + 2 : pos.x + 12, y: isHeld ? pos.y + 2 : pos.y - 5 });
                  } else {
                      let instX = pos.x, instY = pos.y, label = instDef.name;
                      if (isHeld) {
                          instX = pos.x + 2; instY = pos.y + 2;
                          if (instDef.type === InstrumentType.BRASS) label = instDef.name;
                      } else {
                          if (instDef.type === InstrumentType.DRUMS) { instY = pos.y; label = "Kit"; }
                          else if (instDef.type === InstrumentType.VOCAL) { instY = pos.y + 10; label = "Mic"; }
                          else if (instDef.type === InstrumentType.KEYS) { instX = pos.x + 6; instY = pos.y + 4; label = "Keys"; }
                          else if (instDef.id === 'dj') { instY = pos.y + 5; label = "DJ"; }
                          else if (instDef.id === 'laptop') { instX = pos.x + 10; label = "Laptop"; }
                          else if (holdableTypes.includes(instDef.type)) { instX = pos.x + 12; instY = pos.y - 5; label = instDef.name.split(' ')[0]; }
                      }
                      newItems.push({ id: `inst-${member.id}-${idx}`, memberId: member.id, type: 'member', label, x: instX, y: instY });
                  }
              });

              // Monitor
              if (member.instrumentIds.some(id => INSTRUMENTS.find(i => i.id === id)?.requiresMonitor)) {
                  newItems.push({ id: `mon-${member.id}`, memberId: member.id, type: 'monitor', label: 'Mon', x: pos.x, y: pos.y + 15 });
              }
         });

         return { ...prev, stagePlot: [...currentPlot, ...newItems] };
      });
    }
  }, [step]);

  const updateStageItems = useCallback((newItems: StageItem[]) => {
    setData(prev => ({ ...prev, stagePlot: newItems }));
  }, []);

  // --- Step 3 Handlers (Details) ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, details: { ...prev.details, logoUrl: reader.result as string } }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Navigation & Validation ---
  const canProceed = () => {
    if (step === 1) {
        return data.members.length > 0 && 
               data.members.every(m => m.name.trim() !== '' && m.instrumentIds.length > 0);
    }
    if (step === 3) return data.details.bandName.trim() !== '' && data.details.contactName.trim() !== '';
    return true;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPdf(true);
    
    // Cleanup any existing spacers from failed runs
    document.querySelectorAll('.pdf-spacer').forEach(s => s.remove());

    try {
      // Wait for React to render any pending updates
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = previewRef.current;
      const computedStyle = window.getComputedStyle(element);
      const width = element.offsetWidth;
      // Calculate A4 Page Height in pixels based on the rendered width (A4 is 210mm x 297mm)
      // We assume the rendered width corresponds to 210mm minus margins, but HTML2Canvas captures the whole element.
      // If the CSS width is 210mm, then aspect ratio 1.414 gives height.
      const pageHeight = width * 1.414; 
      
      const breakAvoidElements = element.querySelectorAll('.break-inside-avoid');
      const spacers: HTMLDivElement[] = [];
      const containerTop = element.getBoundingClientRect().top;

      // Logic: Iterate over 'break-inside-avoid' elements.
      // If an element crosses a page boundary, insert a spacer before it to push it to the next page.
      breakAvoidElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
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

  // --- Render Steps ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-indigo-600 p-6 rounded-full mb-6 animate-bounce">
        <Mic size={64} className="text-white" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        miked.app
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mb-8">
        Create a professional technical rider and stage plot for your band in 5 minutes. 
        No account needed, instant results.
      </p>
      <button 
        onClick={() => setStep(1)}
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

  const renderStep1 = () => (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">1</span>
        Instruments & Members
      </h2>
      
      {data.members.length === 0 && (
        <div className="mb-6 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Start Templates</h3>
          <button 
            onClick={applyRockTemplate}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-900 to-slate-800 border border-indigo-500/30 hover:border-indigo-500 p-4 rounded-xl text-left transition-all hover:shadow-lg hover:shadow-indigo-500/20 group"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                 <Music2 size={20} />
              </div>
              <span className="font-bold text-white text-lg">Rock Band</span>
            </div>
            <p className="text-slate-400 text-sm pl-[52px]">
              Drums, Bass, Electric Guitar, Lead Vocals
            </p>
          </button>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
        <div className="space-y-4">
          {data.members.map((member, index) => (
            <div key={member.id} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-700/50 rounded-lg items-start animate-fadeIn relative">
              <span className="text-slate-400 font-mono w-8 pt-2">#{index + 1}</span>
              
              <div className="flex-1 w-full space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 block mb-1">Member Name</label>
                        <input 
                        type="text" 
                        value={member.name}
                        onChange={(e) => updateMemberName(member.id, e.target.value)}
                        placeholder="e.g. John"
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 block mb-1">Notes (optional)</label>
                        <input 
                        type="text" 
                        value={member.notes}
                        onChange={(e) => updateMemberNotes(member.id, e.target.value)}
                        placeholder="e.g. Own vocal mic"
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-600/50">
                     <label className="text-xs text-slate-400 block mb-2 font-bold uppercase">Instruments</label>
                     <div className="space-y-2">
                        {member.instrumentIds.map((instId, iIndex) => (
                            <div key={iIndex} className="flex gap-2 items-center">
                                <select 
                                    value={instId}
                                    onChange={(e) => updateMemberInstrument(member.id, iIndex, e.target.value)}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                >
                                {INSTRUMENTS.map(inst => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                                </select>
                                <button 
                                    onClick={() => removeMemberInstrument(member.id, iIndex)}
                                    disabled={member.instrumentIds.length === 1}
                                    className={`p-2 rounded transition-colors ${member.instrumentIds.length === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400 hover:bg-slate-800'}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={() => addMemberInstrument(member.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2 font-medium"
                        >
                            <Plus size={14} /> Add Instrument
                        </button>
                     </div>
                </div>
              </div>

              <button 
                onClick={() => removeMember(member.id)}
                className="absolute top-2 right-2 md:static md:mt-2 text-red-400 hover:bg-red-900/20 rounded p-2 transition-colors"
                title="Remove member"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button 
            onClick={addMember}
            className="w-full py-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus /> Add Band Member
          </button>
        </div>
        
        {data.members.length === 0 && (
          <div className="mt-4 p-4 bg-blue-900/30 text-blue-200 rounded text-sm flex gap-2">
            <Info className="shrink-0" />
            <p>Start by adding your band members. You can assign multiple instruments per person.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">2</span>
            Stage Plot
        </h2>
        
        {/* View Mode Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button 
                onClick={() => setStageViewMode('isometric')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${stageViewMode === 'isometric' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Box size={16} /> 3D View
            </button>
            <button 
                onClick={() => setStageViewMode('top')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${stageViewMode === 'top' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Layers size={16} /> Top View
            </button>
        </div>
      </div>

      <p className="text-slate-400 mb-4">Drag instruments and monitors to their position on stage.</p>
      
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Overlay Menu */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
           <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-center">Extras</h3>
           <div className="flex flex-col gap-2">
               <button 
                 onClick={() => updateStageItems([...data.stagePlot, { id: `mon-${Date.now()}`, type: 'monitor', x: 50, y: 50, label: 'Mon' }])}
                 className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded hover:bg-slate-700 text-xs text-white transition-colors border border-slate-600 hover:border-slate-500"
               >
                 <div className="w-4 h-4 bg-slate-600 rounded-sm"></div>
                 <span>Add Monitor</span>
               </button>
               <button 
                 onClick={() => updateStageItems([...data.stagePlot, { id: `pwr-${Date.now()}`, type: 'power', x: 50, y: 50, label: '230V' }])}
                 className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded hover:bg-slate-700 text-xs text-white transition-colors border border-slate-600 hover:border-slate-500"
               >
                 <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                 <span>Add Power</span>
               </button>
           </div>
           <p className="text-[10px] text-slate-500 mt-2 text-center">Drag to move</p>
        </div>

        {/* 3D Canvas with View Mode */}
        <StagePlotCanvas items={data.stagePlot} setItems={updateStageItems} editable={true} viewMode={stageViewMode} />
        
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">3</span>
        Details & Contact
      </h2>
      
      <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Act / Band Name *</label>
          <input 
            type="text" 
            value={data.details.bandName}
            onChange={(e) => setData(prev => ({...prev, details: {...prev.details, bandName: e.target.value}}))}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="The Super Band"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contact Person *</label>
            <input 
              type="text" 
              value={data.details.contactName}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, contactName: e.target.value}}))}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
            <input 
              type="email" 
              value={data.details.email}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, email: e.target.value}}))}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-2">General Notes</label>
           <textarea 
             rows={4}
             value={data.details.generalNotes}
             onChange={(e) => setData(prev => ({...prev, details: {...prev.details, generalNotes: e.target.value}}))}
             placeholder="e.g. We bring our own van, need 3x2m space for banners..."
             className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Upload Logo (Optional)</label>
          <div className="flex items-center gap-4">
             <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" />
             {data.details.logoUrl && (
               <img src={data.details.logoUrl} alt="Logo preview" className="h-10 w-10 object-contain bg-white rounded" />
             )}
          </div>
        </div>

      </div>
    </div>
  );

  const renderPreview = () => (
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
          <div className="bg-slate-50 p-4 border-l-4 border-black text-sm">
             <h3 className="font-bold uppercase text-xs mb-2 text-slate-500">Notes</h3>
             <p className="whitespace-pre-wrap">{data.details.generalNotes}</p>
          </div>
        )}

        {/* Input List */}
        <div>
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Mic size={20} /> Input List
          </h3>
          <InputList members={data.members} />
        </div>

        {/* Stageplot */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-xl font-bold uppercase border-b border-black mb-4 flex items-center gap-2">
            <Music2 size={20} /> Stage Plot
          </h3>
          
          <div className="grid grid-cols-1 gap-6 mt-4">
              {/* Top View */}
              <div className="break-inside-avoid relative w-full max-w-[80%] mx-auto">
                <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-md border border-slate-300 shadow-sm print:border-black">
                   <Layers size={24} className="text-black" />
                </div>
                <StagePlotCanvas items={data.stagePlot} setItems={() => {}} editable={false} viewMode="top" showAudienceLabel={true} />
              </div>

              {/* 3D View */}
              <div className="break-inside-avoid relative w-full max-w-[80%] mx-auto">
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Navbar (Hidden on print) */}
      <nav className="no-print bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50">
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

      <main className="flex-grow p-4 md:p-8 flex flex-col items-center">
        {step === 0 && renderLanding()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderPreview()}
      </main>

      {/* Navigation Buttons (Hidden on landing & print) */}
      {step > 0 && (
        <div className="no-print bg-slate-950 p-4 border-t border-slate-800 sticky bottom-0 w-full z-40">
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
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                  canProceed() 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next Step <ArrowRight size={18} />
              </button>
            ) : (
               <button 
                  onClick={() => setStep(0)} 
                  className="text-slate-500 text-sm hover:text-white"
               >
                 Create New Rider
               </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;