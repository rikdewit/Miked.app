import React, { useState, useMemo, useRef } from 'react';
import { Box, Layers, Trash2, GripVertical } from 'lucide-react';
import { RiderData, StageItem, BandMember, InstrumentType } from '../types';
import { StagePlotCanvas } from './StagePlotCanvas';
import { INSTRUMENTS } from '../constants';
import { MemberPreview3D } from './MemberPreview3D';

interface StepStagePlotProps {
  data: RiderData;
  setData: React.Dispatch<React.SetStateAction<RiderData>>;
  updateStageItems: (newItems: StageItem[]) => void;
}

export const StepStagePlot: React.FC<StepStagePlotProps> = ({ data, setData, updateStageItems }) => {
  const [stageViewMode, setStageViewMode] = useState<'isometric' | 'top'>('isometric');
  const [draggingMemberId, setDraggingMemberId] = useState<string | null>(null);
  
  // Stores the Percentage Position (0-100) on the stage
  const [dragPos, setDragPos] = useState<{ x: number, y: number } | null>(null);
  
  // Stores the raw pixel coordinates for the canvas to process
  const [rawDragCoords, setRawDragCoords] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  
  // Ref for the custom drag image
  const dragLabelRef = useRef<HTMLDivElement>(null);
  const [dragLabelText, setDragLabelText] = useState("");

  // Logic to generate individual items for a member (Person, Amps, Pedals, DIs)
  const generateMemberItems = (member: BandMember, startX: number, startY: number, idBaseOverride?: string): StageItem[] => {
      const items: StageItem[] = [];
      const baseId = idBaseOverride || `${member.id}-${Date.now()}`;

      // 1. The Person
      items.push({ 
          id: `person-${baseId}`, 
          memberId: member.id, 
          type: 'person', 
          label: member.name || 'Musician', 
          x: startX, 
          y: startY 
      });

      // 2. Instruments & Gear
      let instrumentCount = 0;
      let ampCount = 0;

      member.instrumentIds.forEach((instId, idx) => {
          const inst = INSTRUMENTS.find(i => i.id === instId);
          if (!inst) return;

          // Offsets to spread items around the person
          const isRight = idx % 2 === 0;
          const spreadX = isRight ? 8 : -8; 
          
          // DRUMS
          if (inst.type === InstrumentType.DRUMS) {
              items.push({ id: `drum-${baseId}`, memberId: member.id, type: 'member', label: 'Drum Kit', x: startX, y: startY - 15 });
          }
          
          // KEYS
          else if (inst.type === InstrumentType.KEYS) {
              items.push({ id: `keys-${baseId}-${idx}`, memberId: member.id, type: 'member', label: inst.group, x: startX + spreadX, y: startY });
          }

          // AMPS
          else if (instId.includes('amp') || instId.includes('combined')) {
             const ampX = startX + (ampCount % 2 === 0 ? -12 : 12);
             items.push({ id: `amp-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Amp', x: ampX, y: startY - 10 });
             ampCount++;
          }

          // INSTRUMENTS ON STANDS (Guitar/Bass/Brass)
          if ([InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS].includes(inst.type)) {
              // Instrument Body
              items.push({ 
                  id: `inst-${baseId}-${idx}`, 
                  memberId: member.id, 
                  type: 'member', 
                  label: inst.type, // e.g. "Guitar"
                  x: startX + spreadX, 
                  y: startY - 5 
              });

              // Pedalboard / Modeler
              if (instId.includes('modeler')) {
                   items.push({ id: `mod-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Modeler', x: startX + spreadX, y: startY + 8 });
              } else if (inst.type !== InstrumentType.BRASS && inst.id !== 'gtr_ac') {
                   items.push({ id: `pedal-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Pedals', x: startX + spreadX, y: startY + 8 });
              }
              
              // DI Box
              if (inst.defaultDi || instId.includes('di')) {
                   items.push({ id: `di-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'DI', x: startX + spreadX + (isRight?2:-2), y: startY + 5 });
              }
          }
          
          // MIC STAND (Vocals)
          if (inst.type === InstrumentType.VOCAL) {
               items.push({ id: `mic-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Mic', x: startX, y: startY + 5 });
          }
      });

      return items;
  };

  const isMemberPlaced = (memberId: string) => {
      return data.stagePlot.some(item => item.memberId === memberId);
  };

  const clearStage = () => {
      if(window.confirm("Are you sure you want to clear the stage?")) {
          updateStageItems([]);
      }
  }

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, memberId: string, memberName: string) => {
    e.dataTransfer.setData("memberId", memberId);
    e.dataTransfer.effectAllowed = "copy";
    setDraggingMemberId(memberId);
    
    // Set custom drag image (just the label)
    setDragLabelText(memberName);
    if (dragLabelRef.current) {
        // Use a timeout to ensure state update renders before capturing, 
        // though strictly synchronous setDragImage requires the element to be present.
        // We rely on the element being always in DOM but hidden off-screen.
        e.dataTransfer.setDragImage(dragLabelRef.current, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "copy";

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pass raw pixel coordinates to Canvas for Raycasting
    setRawDragCoords({ x, y, width: rect.width, height: rect.height });
  };

  const handleGhostUpdate = (x: number, y: number) => {
      setDragPos({ x, y });
  };

  const handleDragLeave = (e: React.DragEvent) => {
      // Check if we actually left the container
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      setDragPos(null);
      setRawDragCoords(null);
  };

  const handleDragEnd = () => {
      setDraggingMemberId(null);
      setDragPos(null);
      setRawDragCoords(null);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const memberId = e.dataTransfer.getData("memberId");
    
    // We use the last calculated dragPos (from the Raycaster)
    const finalPos = dragPos;

    // Reset drag states
    setDraggingMemberId(null);
    setDragPos(null);
    setRawDragCoords(null);

    if (!memberId || !finalPos) return;

    const member = data.members.find(m => m.id === memberId);
    if (!member) return;

    if (isMemberPlaced(memberId)) {
        alert(`${member.name} is already on the stage.`);
        return;
    }

    const newItems = generateMemberItems(member, finalPos.x, finalPos.y);
    updateStageItems([...data.stagePlot, ...newItems]);
  };

  // Generate Ghost Items for Preview
  const ghostItems = useMemo(() => {
     if (!draggingMemberId || !dragPos) return [];
     const member = data.members.find(m => m.id === draggingMemberId);
     if (!member) return [];
     
     // Use a stable seed for ID generation to prevent re-mounting meshes during drag
     return generateMemberItems(member, dragPos.x, dragPos.y, `ghost-${member.id}`);
  }, [draggingMemberId, dragPos, data.members]);

  return (
    <div className="w-full h-[calc(100vh-140px)] flex gap-6 relative">
        
        {/* Hidden Custom Drag Image */}
        <div 
            ref={dragLabelRef} 
            className="absolute top-[-9999px] left-[-9999px] bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-md border border-slate-600 shadow-xl whitespace-nowrap z-50 pointer-events-none"
        >
            {dragLabelText}
        </div>

        {/* SIDEBAR: Member List & Previews */}
        <div className="w-[320px] shrink-0 flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-700">
                <h3 className="font-bold text-lg text-white">Band Members</h3>
                <p className="text-xs text-slate-400">Drag members onto the stage</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {data.members.map((member) => {
                    const placed = isMemberPlaced(member.id);
                    return (
                        <div 
                            key={member.id} 
                            draggable={!placed}
                            onDragStart={(e) => handleDragStart(e, member.id, member.name)}
                            onDragEnd={handleDragEnd}
                            className={`bg-slate-700/50 rounded-lg p-2 transition-all group relative border border-transparent ${
                                placed 
                                ? 'opacity-50 grayscale cursor-not-allowed' 
                                : 'hover:bg-slate-700 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing hover:shadow-lg'
                            }`}
                        >
                            {!placed && (
                                <div className="absolute right-2 top-2 text-slate-500 group-hover:text-indigo-400">
                                    <GripVertical size={16} />
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="font-bold text-sm text-white truncate pr-6">{member.name}</span>
                                {placed && <span className="text-[10px] bg-green-900 text-green-200 px-1.5 py-0.5 rounded">Placed</span>}
                            </div>
                            
                            {/* Mini Preview */}
                            <div className="h-[120px] w-full rounded bg-slate-900/50 mb-1 pointer-events-none">
                                <MemberPreview3D member={member} />
                            </div>
                            
                            {!placed && (
                                <div className="text-[10px] text-center text-indigo-300 font-medium py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Drag to Stage
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* MAIN AREA: Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
             <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setStageViewMode('isometric')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${stageViewMode === 'isometric' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Box size={16} /> 3D View
                    </button>
                    <button 
                        onClick={() => setStageViewMode('top')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${stageViewMode === 'top' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Layers size={16} /> Top View
                    </button>
                </div>

                <div className="flex gap-2">
                     <button 
                        onClick={() => updateStageItems([...data.stagePlot, { id: `mon-${Date.now()}`, type: 'monitor', x: 50, y: 50, label: 'Mon' }])}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600"
                     >
                        + Mon
                     </button>
                     <button 
                        onClick={() => updateStageItems([...data.stagePlot, { id: `pwr-${Date.now()}`, type: 'power', x: 50, y: 50, label: '230V' }])}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600"
                     >
                        + Power
                     </button>
                     <button 
                        onClick={clearStage}
                        className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-900/50 rounded text-xs flex items-center gap-1"
                     >
                        <Trash2 size={14} /> Clear
                     </button>
                </div>
             </div>

             <div 
                className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
             >
                <StagePlotCanvas 
                    items={data.stagePlot} 
                    setItems={updateStageItems} 
                    editable={true} 
                    viewMode={stageViewMode} 
                    ghostItems={ghostItems}
                    dragCoords={rawDragCoords}
                    onDragPosChange={handleGhostUpdate}
                />
                
                {data.stagePlot.length === 0 && !draggingMemberId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center max-w-sm">
                            <Box size={48} className="mx-auto text-slate-500 mb-4" />
                            <h3 className="text-white font-bold mb-2">The Stage is Empty</h3>
                            <p className="text-slate-400 text-sm">Drag band members from the sidebar onto the stage area to place them.</p>
                        </div>
                    </div>
                )}
             </div>
        </div>

    </div>
  );
};