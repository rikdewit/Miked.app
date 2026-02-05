import React, { useState } from 'react';
import { Box, Layers, ArrowRight, Trash2 } from 'lucide-react';
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

  // Logic to generate individual items for a member (Person, Amps, Pedals, DIs)
  const generateMemberItems = (member: BandMember, startX: number, startY: number): StageItem[] => {
      const items: StageItem[] = [];
      const baseId = `${member.id}-${Date.now()}`;

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

      // 3. Monitor (if needed)
      if (member.instrumentIds.some(id => INSTRUMENTS.find(i => i.id === id)?.requiresMonitor)) {
          items.push({ id: `mon-${baseId}`, memberId: member.id, type: 'monitor', label: 'Mon', x: startX, y: startY + 12 });
      }

      return items;
  };

  const handlePlaceMember = (member: BandMember) => {
      // Find a somewhat empty spot or center
      const newItems = generateMemberItems(member, 50, 50);
      updateStageItems([...data.stagePlot, ...newItems]);
  };

  const isMemberPlaced = (memberId: string) => {
      return data.stagePlot.some(item => item.memberId === memberId);
  };

  const clearStage = () => {
      if(window.confirm("Are you sure you want to clear the stage?")) {
          updateStageItems([]);
      }
  }

  return (
    <div className="w-full h-[calc(100vh-140px)] flex gap-6">
        
        {/* SIDEBAR: Member List & Previews */}
        <div className="w-[320px] shrink-0 flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-700">
                <h3 className="font-bold text-lg text-white">Band Members</h3>
                <p className="text-xs text-slate-400">Click to place on stage</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {data.members.map((member) => {
                    const placed = isMemberPlaced(member.id);
                    return (
                        <div key={member.id} className={`bg-slate-700/50 rounded-lg p-2 transition-all ${placed ? 'opacity-50 grayscale' : 'hover:bg-slate-700'}`}>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="font-bold text-sm text-white truncate">{member.name}</span>
                                {placed && <span className="text-[10px] bg-green-900 text-green-200 px-1.5 py-0.5 rounded">Placed</span>}
                            </div>
                            
                            {/* Mini Preview */}
                            <div className="h-[120px] w-full rounded bg-slate-900/50 mb-3 pointer-events-none">
                                <MemberPreview3D member={member} />
                            </div>

                            <button 
                                onClick={() => handlePlaceMember(member)}
                                disabled={placed}
                                className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                                    placed 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                                }`}
                            >
                                {placed ? 'Already on Stage' : <>Place on Stage <ArrowRight size={12} /></>}
                            </button>
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

             <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative">
                <StagePlotCanvas items={data.stagePlot} setItems={updateStageItems} editable={true} viewMode={stageViewMode} />
                
                {data.stagePlot.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 text-center max-w-sm">
                            <Box size={48} className="mx-auto text-slate-500 mb-4" />
                            <h3 className="text-white font-bold mb-2">The Stage is Empty</h3>
                            <p className="text-slate-400 text-sm">Use the sidebar on the left to place your band members and their gear onto the stage.</p>
                        </div>
                    </div>
                )}
             </div>
        </div>

    </div>
  );
};