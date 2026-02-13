import React, { useState, useMemo, useRef } from 'react';
import { Box, Layers, Trash2, GripVertical, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { RiderData, StageItem, BandMember } from '../types';
import { StagePlotCanvas } from './StagePlotCanvas';
import { MemberPreview3D } from './MemberPreview3D';
import { STAGE_WIDTH, STAGE_DEPTH, getItemConfig } from '../utils/stageConfig';
import { generateMemberItems } from '../utils/stageHelpers';
import { MODEL_OFFSETS } from './3d/StageModels';

interface StepStagePlotProps {
  data: RiderData;
  setData: React.Dispatch<React.SetStateAction<RiderData>>;
  updateStageItems: (newItems: StageItem[]) => void;
}

export const StepStagePlot: React.FC<StepStagePlotProps> = ({ data, setData, updateStageItems }) => {
  const [stageViewMode, setStageViewMode] = useState<'isometric' | 'top'>('isometric');
  const [draggingMemberId, setDraggingMemberId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [rotatingItemId, setRotatingItemId] = useState<string | null>(null);
  
  // Stores the Percentage Position (0-100) on the stage
  const [dragPos, setDragPos] = useState<{ x: number, y: number } | null>(null);
  
  // Stores the raw pixel coordinates for the canvas to process
  const [rawDragCoords, setRawDragCoords] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  
  // Ref for the custom drag image
  const dragLabelRef = useRef<HTMLDivElement>(null);
  const [dragLabelText, setDragLabelText] = useState("");

  const isMemberFullyPlaced = (member: BandMember) => {
      // 1. Check if Person exists
      const hasPerson = data.stagePlot.some(item => item.memberId === member.id && item.type === 'person');
      if (!hasPerson) return false;

      // 2. Strict check: Do we have all the specific gear items we expect?
      const expectedItems = generateMemberItems(member, 50, 50);

      for (const expected of expectedItems) {
          if (expected.type === 'person') continue;

          // Find a matching item on stage
          // Match by: MemberID, InstrumentIndex, and Label
          const match = data.stagePlot.find(existing => 
              existing.memberId === member.id &&
              existing.fromInstrumentIndex === expected.fromInstrumentIndex &&
              existing.label === expected.label
          );

          if (!match) return false;
      }

      return true;
  };

  const getPlacementStatus = (member: BandMember) => {
      const hasPerson = data.stagePlot.some(item => item.memberId === member.id && item.type === 'person');
      const isFull = isMemberFullyPlaced(member);
      
      if (isFull) return 'full';
      if (hasPerson) return 'partial';
      return 'none';
  };

  const requestClearStage = () => {
      if (data.stagePlot.length > 0) {
          setShowClearConfirm(true);
      }
  };

  const confirmClearStage = () => {
      updateStageItems([]);
      setShowClearConfirm(false);
  };

  // --- Rotation Handlers ---
  const handleRotateItem = (itemId: string, direction: 'left' | 'right') => {
      const ROTATION_STEP = 22.5 * (Math.PI / 180); // Convert degrees to radians
      const item = data.stagePlot.find(i => i.id === itemId);
      if (!item) return;

      const currentRotation = item.rotation || 0;
      const newRotation = direction === 'right' 
          ? currentRotation + ROTATION_STEP
          : currentRotation - ROTATION_STEP;

      // Normalize to 0-2π
      const normalizedRotation = ((newRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);

      updateStageItems(
          data.stagePlot.map(i => 
              i.id === itemId ? { ...i, rotation: normalizedRotation } : i
          )
      );
  };

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, memberId: string, memberName: string) => {
    e.dataTransfer.setData("memberId", memberId);
    e.dataTransfer.effectAllowed = "copy";
    setDraggingMemberId(memberId);
    
    // Set custom drag image (just the label)
    setDragLabelText(memberName);
    if (dragLabelRef.current) {
        e.dataTransfer.setDragImage(dragLabelRef.current, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "copy";
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRawDragCoords({ x, y, width: rect.width, height: rect.height });
  };

  const handleGhostUpdate = (x: number, y: number) => {
      if (!draggingMemberId) return;
      const member = data.members.find(m => m.id === draggingMemberId);
      if (!member) return;

      // 1. Generate items at the proposed center to check bounds
      const tempItems = generateMemberItems(member, x, y, 'temp-bounds-check');
      
      let minX = 100, maxX = 0, minY = 100, maxY = 0;
      
      tempItems.forEach(item => {
          const config = getItemConfig(item);
          // Convert World Dimensions to Percentage
          const wPercent = (config.width / STAGE_WIDTH) * 100;
          const dPercent = (config.depth / STAGE_DEPTH) * 100;
          
          const halfW = wPercent / 2;
          const halfD = dPercent / 2;

          // Determine Visual Offset (Matches StageDraggableItem logic)
          let offset = [0, 0, 0];
          const labelLower = (item.label || '').toLowerCase();
          
          if (config.shape !== 'person') {
              if (labelLower.includes('drum') || labelLower.includes('kit')) {
                  offset = MODEL_OFFSETS.DRUMS;
              } else if (labelLower.includes('sax')) {
                  offset = MODEL_OFFSETS.SAX;
              } else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
                  offset = MODEL_OFFSETS.TRUMPET;
              }
          }
          const [offX, _, offZ] = offset;

          // Convert Offset to Percent
          const offXPercent = (offX / STAGE_WIDTH) * 100;
          const offZPercent = (offZ / STAGE_DEPTH) * 100;

          // Apply offset to center position for bounds check
          const visualCenterX = item.x + offXPercent;
          const visualCenterY = item.y + offZPercent;
          
          const iMinX = visualCenterX - halfW;
          const iMaxX = visualCenterX + halfW;
          const iMinY = visualCenterY - halfD;
          const iMaxY = visualCenterY + halfD;
          
          if (iMinX < minX) minX = iMinX;
          if (iMaxX > maxX) maxX = iMaxX;
          if (iMinY < minY) minY = iMinY;
          if (iMaxY > maxY) maxY = iMaxY;
      });

      // 2. Calculate Shift needed to fit in 0-100 with margin
      let shiftX = 0;
      let shiftY = 0;
      const MARGIN = 0.5; // Small margin to prevent clipping

      if (minX < MARGIN) shiftX = MARGIN - minX;
      else if (maxX > (100 - MARGIN)) shiftX = (100 - MARGIN) - maxX;

      if (minY < MARGIN) shiftY = MARGIN - minY;
      else if (maxY > (100 - MARGIN)) shiftY = (100 - MARGIN) - maxY;
      
      setDragPos({ x: x + shiftX, y: y + shiftY });
  };

  const handleDragLeave = (e: React.DragEvent) => {
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
    const finalPos = dragPos; // Use the clamped position

    setDraggingMemberId(null);
    setDragPos(null);
    setRawDragCoords(null);

    if (!memberId || !finalPos) return;

    const member = data.members.find(m => m.id === memberId);
    if (!member) return;

    // Check if fully placed
    if (isMemberFullyPlaced(member)) {
        alert(`${member.name} is already on the stage.`);
        return;
    }

    // Generate potential items at drop location
    const potentialItems = generateMemberItems(member, finalPos.x, finalPos.y);

    // Filter Items to avoid duplication
    // 1. If Person exists, remove new Person
    const hasPerson = data.stagePlot.some(i => i.memberId === memberId && i.type === 'person');
    
    const itemsToAdd = potentialItems.filter(newItem => {
        // Skip Person if already on stage
        if (newItem.type === 'person' && hasPerson) return false;

        // Smart Filtering for Instrument Gear:
        if (newItem.fromInstrumentIndex !== undefined) {
            const index = newItem.fromInstrumentIndex;
            const existingCore = data.stagePlot.find(
                i => i.memberId === memberId && i.fromInstrumentIndex === index && !i.isPeripheral
            );
            
            // If new item is Core, and we already have a Core item for this index -> Skip new core
            if (!newItem.isPeripheral && existingCore) return false;
            
            // Peripherals (like Amps/DI) are always added if dragged, assuming the hook cleared old ones.
            // Duplicate check: prevent adding exact same peripheral type for same index if it somehow exists
            const existingSameItem = data.stagePlot.find(
                i => i.memberId === memberId && i.fromInstrumentIndex === index && i.label === newItem.label
            );
            if (existingSameItem) return false;
        }

        return true;
    });

    updateStageItems([...data.stagePlot, ...itemsToAdd]);
  };

  // Generate Ghost Items for Preview
  const ghostItems = useMemo(() => {
     if (!draggingMemberId || !dragPos) return [];
     const member = data.members.find(m => m.id === draggingMemberId);
     if (!member) return [];
     
     // Same filtering logic as Drop to show only what will be added
     const potentialItems = generateMemberItems(member, dragPos.x, dragPos.y, `ghost-${member.id}`);
     const hasPerson = data.stagePlot.some(i => i.memberId === draggingMemberId && i.type === 'person');

     return potentialItems.filter(newItem => {
         if (newItem.type === 'person' && hasPerson) return false;
         if (newItem.fromInstrumentIndex !== undefined) {
             const index = newItem.fromInstrumentIndex;
             const existingCore = data.stagePlot.find(
                 i => i.memberId === draggingMemberId && i.fromInstrumentIndex === index && !i.isPeripheral
             );
             if (!newItem.isPeripheral && existingCore) return false;
             
             const existingSameItem = data.stagePlot.find(
                i => i.memberId === draggingMemberId && i.fromInstrumentIndex === index && i.label === newItem.label
             );
             if (existingSameItem) return false;
         }
         return true;
     });
  }, [draggingMemberId, dragPos, data.members, data.stagePlot]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-6 relative">

        {/* Hidden Custom Drag Image */}
        <div
            ref={dragLabelRef}
            className="absolute top-[-9999px] left-[-9999px] bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-md border border-slate-600 shadow-xl whitespace-nowrap z-50 pointer-events-none"
        >
            {dragLabelText}
        </div>

        {/* SIDEBAR: Member List & Previews - Desktop only */}
        <div className="hidden lg:flex w-[320px] shrink-0 flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-700">
                <h3 className="font-bold text-lg text-white">Band Members</h3>
                <p className="text-xs text-slate-400">Drag members onto the stage</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {data.members.map((member) => {
                    const status = getPlacementStatus(member);
                    const isFull = status === 'full';
                    const isPartial = status === 'partial';

                    return (
                        <div
                            key={member.id}
                            draggable={!isFull}
                            onDragStart={(e) => handleDragStart(e, member.id, member.name)}
                            onDragEnd={handleDragEnd}
                            className={`rounded-lg transition-all group relative border ${
                                isFull
                                ? 'bg-slate-900/40 border-slate-700 p-3 cursor-default'
                                : isPartial
                                    ? 'bg-slate-800/80 border-indigo-900/50 p-3 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing'
                                    : 'bg-slate-700/50 border-transparent p-2 hover:bg-slate-700 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing hover:shadow-lg'
                            }`}
                        >
                            {/* Drag Handle - Show if draggable */}
                            {!isFull && (
                                <div className="absolute right-2 top-2 text-slate-500 group-hover:text-indigo-400 z-10">
                                    <GripVertical size={16} />
                                </div>
                            )}

                            <div className="flex justify-between items-center px-1">
                                <span className={`font-bold text-sm truncate pr-6 ${isFull ? 'text-slate-500' : 'text-white'}`}>
                                    {member.name}
                                </span>
                                {isFull && (
                                    <span className="flex items-center gap-1 text-[10px] bg-green-900/30 text-green-500 border border-green-900/50 px-2 py-0.5 rounded-full font-medium">
                                        <Check size={10} /> Placed
                                    </span>
                                )}
                                {isPartial && (
                                    <span className="flex items-center gap-1 text-[10px] bg-indigo-900/30 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded-full font-medium">
                                        <RefreshCw size={10} /> Update
                                    </span>
                                )}
                            </div>

                            {/* 3D Preview - HIDE when fully placed, SHOW when partial or none */}
                            {!isFull && (
                                <div className="h-[120px] w-full rounded bg-slate-900/50 mb-1 pointer-events-none mt-2">
                                    <MemberPreview3D member={member} />
                                </div>
                            )}

                            {!isFull && (
                                <div className="text-[10px] text-center text-indigo-300 font-medium py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isPartial ? 'Drag to Add New Gear' : 'Drag to Stage'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* MOBILE: Members as horizontal scrollable list at top */}
        <div className="lg:hidden flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white px-1">Drag members onto the stage</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                {data.members.map((member) => {
                    const status = getPlacementStatus(member);
                    const isFull = status === 'full';

                    return (
                        <div
                            key={member.id}
                            draggable={!isFull}
                            onDragStart={(e) => handleDragStart(e, member.id, member.name)}
                            onDragEnd={handleDragEnd}
                            className={`flex-shrink-0 rounded-lg transition-all group relative border p-2 text-center min-w-[100px] ${
                                isFull
                                ? 'bg-slate-900/40 border-slate-700 cursor-default'
                                : 'bg-slate-700/50 border-transparent hover:bg-slate-700 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing hover:shadow-lg'
                            }`}
                        >
                            <span className={`block font-bold text-xs truncate ${isFull ? 'text-slate-500' : 'text-white'}`}>
                                {member.name}
                            </span>
                            {isFull && (
                                <span className="text-[8px] text-green-400 font-medium">Placed ✓</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* MAIN AREA: Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
             {/* Toolbar with responsive layout */}
             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                {/* View mode buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setStageViewMode('isometric')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${stageViewMode === 'isometric' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Box size={16} /> <span className="hidden sm:inline">3D View</span>
                    </button>
                    <button
                        onClick={() => setStageViewMode('top')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${stageViewMode === 'top' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                        <Layers size={16} /> <span className="hidden sm:inline">Top View</span>
                    </button>
                </div>

                {/* Action buttons - responsive wrap */}
                <div className="flex flex-wrap gap-2 lg:ml-auto">
                     <button
                        onClick={() => updateStageItems([...data.stagePlot, { id: `mon-${Date.now()}`, type: 'monitor', x: 50, y: 50, label: 'Mon' }])}
                        className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap"
                     >
                        + Mon
                     </button>
                     <button
                        onClick={() => updateStageItems([...data.stagePlot, { id: `stand-${Date.now()}`, type: 'stand', x: 50, y: 50, label: 'Mic Stand' }])}
                        className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap"
                     >
                        + Stand
                     </button>
                     <button
                        onClick={() => updateStageItems([...data.stagePlot, { id: `pwr-${Date.now()}`, type: 'power', x: 50, y: 50, label: 'Power', quantity: 1 }])}
                        className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap"
                     >
                        + Power
                     </button>
                     <button
                        type="button"
                        onClick={requestClearStage}
                        disabled={data.stagePlot.length === 0}
                        className={`flex-1 sm:flex-none px-3 py-2 rounded text-xs flex items-center gap-1 border transition-colors justify-center sm:justify-start ${
                            data.stagePlot.length === 0
                            ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                            : 'bg-red-900/30 hover:bg-red-900/50 text-red-200 border-red-900/50 cursor-pointer'
                        }`}
                        title="Remove all items from the stage"
                     >
                        <Trash2 size={14} className="pointer-events-none" /> <span className="hidden sm:inline">Clear</span>
                     </button>
                </div>
             </div>

             <div
                className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative min-h-[300px] sm:min-h-[500px]"
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
                    members={data.members}
                    rotatingItemId={rotatingItemId}
                    onRotateItem={handleRotateItem}
                />

                {data.stagePlot.length === 0 && !draggingMemberId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                        <div className="bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-700 text-center max-w-sm">
                            <Box size={40} className="mx-auto text-slate-500 mb-4" />
                            <h3 className="text-white font-bold mb-2 text-base sm:text-lg">The Stage is Empty</h3>
                            <p className="text-slate-400 text-xs sm:text-sm">Click "Members" to add band members to the stage.</p>
                        </div>
                    </div>
                )}
             </div>
        </div>

        {/* CLEAR CONFIRMATION MODAL */}
        {showClearConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-3 mb-4 text-red-400">
                        <AlertTriangle size={24} />
                        <h3 className="text-lg font-bold text-white">Clear Stage?</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">
                        Are you sure you want to remove all items from the stage? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setShowClearConfirm(false)}
                            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmClearStage}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 text-sm font-bold transition-all"
                        >
                            Yes, Clear All
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};