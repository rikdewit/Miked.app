
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
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
  onDelete?: (itemId: string) => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onMonitorNumberChange?: (itemId: string, monitorNumber: number) => void;
  isEditable?: boolean;
  viewMode?: 'isometric' | 'top';
  isPreview?: boolean;
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
  onDelete,
  onQuantityChange,
  onMonitorNumberChange,
  isEditable = false,
  viewMode = 'isometric',
  isPreview = false
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

  // Context menu positioning
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [contextMenuOffset, setContextMenuOffset] = useState<{ y: number; z: number }>({ y: 0, z: 0 });

  // Adjust context menu position if it goes off-screen
  useEffect(() => {
    if (!showRotationUI || !contextMenuRef.current) return;

    let rafId: number;
    const checkPosition = () => {
      if (!contextMenuRef.current) return;

      const rect = contextMenuRef.current.getBoundingClientRect();
      const offset = { y: 0, z: 0 };
      const padding = 10;

      // If menu goes above viewport, shift it down significantly
      if (rect.top < padding) {
        offset.y = -2.4;
      }
      // If menu goes below viewport, shift it up
      else if (rect.bottom > window.innerHeight - padding) {
        offset.y = 2.4;
      }

      // Horizontal: shift right if off left edge
      if (rect.left < padding) {
        offset.z = 1.0;
      }
      // Shift left if off right edge
      else if (rect.right > window.innerWidth - padding) {
        offset.z = -1.0;
      }

      setContextMenuOffset(offset);
      rafId = requestAnimationFrame(checkPosition);
    };

    // Delay to ensure element is rendered
    const startDelay = setTimeout(() => {
      rafId = requestAnimationFrame(checkPosition);
    }, 100);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(rafId);
    };
  }, [showRotationUI]);

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

  // Context menu position is relative to label position - place below/away from item
  const labelBaseY = height + labelYPadding + offY;
  // In top view, Z is vertical on screen (up=-Z), in isometric Y is vertical
  // Default: place away from item with generous offset
  const contextMenuPosY = viewMode === 'isometric' ? labelBaseY - 1.5 : labelBaseY;
  const contextMenuPosZ = viewMode === 'top' ? (0 + offZ + 0.6) : (0 + offZ);

  // Hitbox dimensions - make it deeper in Z for top view so it covers label area
  const hitboxDepth = viewMode === 'top' ? Math.max(depth, 2) : Math.max(depth, 0.6);
  const hitboxZOffset = viewMode === 'top' ? (height + labelYPadding / 2 + offZ) : (0 + offZ);

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
    <group position={[x, 0, z]}>
      {showLabel && (
        <Html
            position={[0 + offX, height + labelYPadding + offY, 0 + offZ]}
            center
            zIndexRange={isDragging ? [500, 400] : [100, 0]}
            style={{ pointerEvents: isPreview ? 'none' : 'none' }}
        >
          <div
            className={`text-[10px] font-black whitespace-nowrap select-none tracking-tight px-1 rounded border text-center inline-block ${isGhost ? 'text-slate-700 bg-white/30 border-white/10' : 'text-slate-900 bg-white/50 border-white/20'}`}
            style={{
              lineHeight: '1.2',
              padding: '2px 4px',
              minHeight: '16px',
              display: 'inline-block',
              verticalAlign: 'baseline'
            }}
          >
            {item.type === 'power' && item.quantity ? `${item.label} (${item.quantity})` : item.type === 'monitor' && item.monitorNumber ? `${item.label} ${item.monitorNumber}` : item.label}
          </div>
        </Html>
      )}

      {/* Rotation UI - not inside rotating group so it stays fixed */}
      {showRotationUI && !isGhost && isEditable && (onRotate || item.type === 'power' || item.type === 'monitor') && (
        <Html
            position={[0 + offX, contextMenuPosY + contextMenuOffset.y, contextMenuPosZ + contextMenuOffset.z]}
            center
            zIndexRange={[1000, 900]}
            style={{ pointerEvents: 'auto' }}
        >
          <div
            ref={contextMenuRef}
            className="flex gap-1 bg-slate-900 border border-slate-600 rounded-lg p-1.5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            {item.type === 'power' ? (
              <>
                <button
                  onClick={() => {
                    const newQty = Math.max(1, (item.quantity || 1) - 1);
                    onQuantityChange?.(item.id, newQty);
                  }}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  title="Decrease quantity"
                >
                  −
                </button>
                <div className="px-2 py-1 text-white text-xs font-bold flex items-center bg-slate-800 rounded">
                  {item.quantity || 1}
                </div>
                <button
                  onClick={() => {
                    onQuantityChange?.(item.id, (item.quantity || 1) + 1);
                  }}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  title="Increase quantity"
                >
                  +
                </button>
              </>
            ) : item.type === 'monitor' ? (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const newNum = Math.max(0, (item.monitorNumber || 0) - 1);
                      onMonitorNumberChange?.(item.id, newNum);
                    }}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                    title="Decrease monitor number"
                  >
                    −
                  </button>
                  <div className="px-2 py-1 text-white text-xs font-bold flex items-center bg-slate-800 rounded min-w-[32px] justify-center">
                    {item.monitorNumber || 0}
                  </div>
                  <button
                    onClick={() => {
                      onMonitorNumberChange?.(item.id, (item.monitorNumber || 0) + 1);
                    }}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                    title="Increase monitor number"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onRotate?.(item.id, 'left')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1"
                    title="Rotate left 22.5°"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => {
                      onCloseRotationUI?.();
                    }}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex-1"
                    title="Done rotating"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => onRotate?.(item.id, 'right')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1"
                    title="Rotate right 22.5°"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onRotate?.(item.id, 'left')}
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
                  onClick={() => onRotate?.(item.id, 'right')}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  title="Rotate right 22.5°"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}
            <div className="w-px bg-slate-600" />
            <button
              onClick={() => onDelete?.(item.id)}
              className="p-1.5 bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </Html>
      )}

      <group
        rotation={[0, item.rotation || 0, 0]}
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
        {/* In top view, make it deeper to cover label area */}
        <mesh position={[0 + offX, height / 2 + offY, hitboxZOffset]}>
             <boxGeometry args={[Math.max(width, 0.6), height, hitboxDepth]} />
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
