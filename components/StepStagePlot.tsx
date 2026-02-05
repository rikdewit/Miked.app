import React, { useState, useEffect } from 'react';
import { Box, Layers } from 'lucide-react';
import { RiderData, StageItem, BandMember, InstrumentType } from '../types';
import { StagePlotCanvas } from './StagePlotCanvas';
import { INSTRUMENTS } from '../constants';

interface StepStagePlotProps {
  data: RiderData;
  setData: React.Dispatch<React.SetStateAction<RiderData>>;
  updateStageItems: (newItems: StageItem[]) => void;
}

export const StepStagePlot: React.FC<StepStagePlotProps> = ({ data, setData, updateStageItems }) => {
  const [stageViewMode, setStageViewMode] = useState<'isometric' | 'top'>('isometric');

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
  }, []); // Run once on mount when entering this step

  return (
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
};
