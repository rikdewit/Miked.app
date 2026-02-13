
import React, { Suspense, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StageItem, BandMember, PersonPose } from '../../types';
import { getItemConfig } from '../../utils/stageConfig';
import { percentToX, percentToZ, getPersonPose } from '../../utils/stageHelpers';
import * as Models from './StageModels';
import { MODEL_OFFSETS } from './StageModels';

interface DraggableItemProps {
  item: StageItem;
  activeId: string | null;
  onDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
  onMove: (e: ThreeEvent<PointerEvent>) => void;
  onUp: (e: ThreeEvent<PointerEvent>) => void;
  isGhost?: boolean;
  member?: BandMember;
  isRotating?: boolean;
  showRotationUI?: boolean;
  onRequestRotationUI?: () => void;
  onCloseRotationUI?: () => void;
  onRotate?: (itemId: string, direction: 'left' | 'right') => void;
  isEditable?: boolean;
}

export const StageDraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  activeId, 
  onDown, 
  onMove, 
  onUp, 
  isGhost = false, 
  member,
  isRotating = false,
  showRotationUI = false,
  onRequestRotationUI,
  onCloseRotationUI,
  onRotate,
  isEditable = false
}) => {
  const { width, height, depth, color, shape } = getItemConfig(item);
  const x = percentToX(item.x);
  const z = percentToZ(item.y);
  const isDragging = activeId === item.id;
  const activeColor = '#fbbf24';
  
  const opacity = isGhost ? 0.6 : 1;
  const transparent = isGhost;
  const materialProps = { opacity, transparent, roughness: 0.4 };

  // Track pointer position to detect clicks vs drags
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const threshold = 1; // pixels - if movement > this, it's a drag

  const showLabel = true;
  const labelLower = (item.label || '').toLowerCase();
  
  // --- Offset Logic for Visual Alignment ---
  let offset = MODEL_OFFSETS.DEFAULT;
  if (shape !== 'person') {
    if (labelLower.includes('drum') || labelLower.includes('kit')) {
        offset = MODEL_OFFSETS.DRUMS;
    } else if (labelLower.includes('sax')) {
        offset = MODEL_OFFSETS.SAX;
    } else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
        offset = MODEL_OFFSETS.TRUMPET;
    }
  }

  const [offX, offY, offZ] = offset;

  let labelYPadding = 0.3;
  if (shape === 'person') {
      labelYPadding = 0.65;
  } else if (labelLower.includes('sax')) {
      labelYPadding = 0.05;
  }

  const renderModel = () => {
    // --- PERSON ---
    if (shape === 'person') {
        const { pose } = member ? getPersonPose(member) : { pose: 'stand' as PersonPose };
        return <Models.PersonModel color={isDragging ? activeColor : undefined} pose={pose} />;
    }

    // --- MIC STAND ---
    if (item.type === 'stand') {
        return <Models.MicStandModel />;
    }

    const modelColor = isDragging ? activeColor : color;

    // --- INSTRUMENTS & GEAR ---
    if (labelLower.includes('amp')) {
        return <Models.AmpModel color={modelColor} />;
    }
    
    if (labelLower.includes('bass')) {
         return <Models.BassModel color={modelColor} />;
    }
    
    if (labelLower.includes('acoustic')) {
         return <Models.AcousticGuitarModel color={modelColor} />;
    }
    
    if (labelLower.includes('guitar')) { 
         return <Models.ElectricGuitarModel color={modelColor} />;
    }

    if (labelLower.includes('sax')) {
         return <Models.SaxModel color={modelColor} />;
    }

    if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
         return <Models.TrumpetModel color={modelColor} />;
    }
    
    // --- FALLBACK BOX/SHAPES ---
    if (shape === 'wedge') {
        return (
             <mesh position={[0, height/2, 0]} rotation={[Math.PI/6, 0, 0]} castShadow={!isGhost} receiveShadow>
                 <boxGeometry args={[width, height, depth]} />
                 <meshStandardMaterial color={modelColor} {...materialProps} />
             </mesh>
        );
    }
    
    return (
         <mesh position={[0, height/2, 0]} castShadow={!isGhost} receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={modelColor} {...materialProps} />
         </mesh>
    );
  };

  return (
    <group position={[x, 0, z]} rotation={[0, item.rotation || 0, 0]}>
      {showLabel && (
        <Html 
            position={[0 + offX, height + labelYPadding + offY, 0 + offZ]} 
            center 
            zIndexRange={isDragging ? [500, 400] : [100, 0]} 
            style={{ pointerEvents: 'none' }}
        >
          <div className={`text-[10px] font-black whitespace-nowrap select-none tracking-tight px-1 rounded backdrop-blur-sm border ${isGhost ? 'text-slate-700 bg-white/30 border-white/10' : 'text-slate-900 bg-white/50 border-white/20'}`}>
            {item.label}
          </div>
        </Html>
      )}

      {/* Rotation UI */}
      {showRotationUI && !isGhost && isEditable && onRotate && (
        <Html 
            position={[0 + offX, height + 0.8 + offY, 0 + offZ]} 
            center 
            zIndexRange={[1000, 900]} 
            style={{ pointerEvents: 'auto' }}
        >
          <div className="flex gap-1 bg-slate-900 border border-slate-600 rounded-lg p-1.5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onRotate(item.id, 'left')}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              title="Rotate left 22.5°"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => {
                onCloseRotationUI?.();
              }}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors"
              title="Done rotating"
            >
              Done
            </button>
            <button
              onClick={() => onRotate(item.id, 'right')}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              title="Rotate right 22.5°"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </Html>
      )}

      <group
        onPointerDown={!isGhost ? (e) => {
          e.stopPropagation();
          // Track pointer position for click detection
          downPosRef.current = { x: e.clientX, y: e.clientY };
          
          if (showRotationUI) {
            // Click while rotation UI showing - close it
            onCloseRotationUI?.();
          } else {
            // First click or switching items - initiate drag/selection
            onDown(e, item.id);
          }
        } : undefined}
        onPointerMove={!isGhost && !showRotationUI ? onMove : undefined}
        onPointerUp={!isGhost ? (e) => {
          e.stopPropagation();
          
          // Check if this was a click (no significant drag) or actual drag
          const wasDrag = downPosRef.current && (
            Math.abs(e.clientX - downPosRef.current.x) > threshold ||
            Math.abs(e.clientY - downPosRef.current.y) > threshold
          );
          downPosRef.current = null;
          
          if (!showRotationUI) {
            // Normal up handler for dragging
            onUp(e);
          }
          
          // Show rotation UI in response to a click (not a drag) on already-selected item
          if (!wasDrag && isEditable && activeId === item.id && !showRotationUI) {
            onRequestRotationUI?.();
          }
        } : undefined}
      >
        {/* Invisible Hit Box for easier selection */}
        <mesh position={[0 + offX, height / 2 + offY, 0 + offZ]}>
             <boxGeometry args={[Math.max(width, 0.6), height, Math.max(depth, 0.6)]} />
             <meshBasicMaterial transparent opacity={0} />
        </mesh>

        <Suspense fallback={
            <mesh position={[0, height/2, 0]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color={color} opacity={0.5} transparent />
            </mesh>
        }>
            {renderModel()}
        </Suspense>
      </group>
    </group>
  );
};
