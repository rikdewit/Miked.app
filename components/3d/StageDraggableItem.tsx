
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { StageItem, BandMember, PersonPose } from '../../types';
import { getItemConfig } from '../../utils/stageConfig';
import { percentToX, percentToZ, getPersonPose } from '../../utils/stageHelpers';
import { MODEL_LABEL_FONT_SCALE_INTERACTIVE, MODEL_LABEL_FONT_SCALE_PREVIEW } from '../../constants';
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
  onLabelChange?: (itemId: string, label: string) => void;
  onHeightChange?: (itemId: string, height: number) => void;
  onLabelHeightChange?: (itemId: string, height: number) => void;
  onResizeStart?: (itemId: string) => void;
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
  onLabelChange,
  onHeightChange,
  onLabelHeightChange,
  onResizeStart,
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

  // Get THREE.js camera for bounding box calculations
  const { camera } = useThree();

  // Calculate object's screen-space bounding box
  const getObjectScreenBounds = () => {
    const corners = [
      new THREE.Vector3(x - width / 2, 0, z - depth / 2),
      new THREE.Vector3(x + width / 2, 0, z - depth / 2),
      new THREE.Vector3(x - width / 2, height, z - depth / 2),
      new THREE.Vector3(x + width / 2, height, z - depth / 2),
      new THREE.Vector3(x - width / 2, 0, z + depth / 2),
      new THREE.Vector3(x + width / 2, 0, z + depth / 2),
      new THREE.Vector3(x - width / 2, height, z + depth / 2),
      new THREE.Vector3(x + width / 2, height, z + depth / 2),
    ];

    const screenCorners = corners.map(corner => {
      corner.project(camera);
      return {
        x: (corner.x + 1) / 2 * window.innerWidth,
        y: (1 - corner.y) / 2 * window.innerHeight,
      };
    });

    return {
      minX: Math.min(...screenCorners.map(c => c.x)),
      maxX: Math.max(...screenCorners.map(c => c.x)),
      minY: Math.min(...screenCorners.map(c => c.y)),
      maxY: Math.max(...screenCorners.map(c => c.y)),
    };
  };

  // Context menu positioning
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [contextMenuOffset, setContextMenuOffset] = useState<{ y: number; z: number }>({ y: 0, z: 0 });
  const fixedContextMenuPosRef = useRef<{ y: number; z: number } | null>(null);
  const prevShowRotationUIRef = useRef(false);
  const [menuReady, setMenuReady] = useState(false);

  const showLabel = true;
  const labelLower = (item.label || '').toLowerCase();

  // Calculate scaled font size for preview vs interactive
  const baseFontSize = 10;
  const fontScale = isPreview ? MODEL_LABEL_FONT_SCALE_PREVIEW : MODEL_LABEL_FONT_SCALE_INTERACTIVE;
  const scaledFontSize = baseFontSize * fontScale;

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

  // Isometric: Y = -1.0 puts the menu below the stage floor, which projects below ALL objects on screen.
  // Top view: Z = depth/2 + 1.2 places the menu below the object's footprint on screen.
  const calculatedContextMenuPosY = viewMode === 'isometric' ? -1.0 : 0;
  const calculatedContextMenuPosZ = viewMode === 'top' ? (offZ + depth / 2 + 1.2) : offZ;

  // When menu opens: render it invisible at the initial position, measure actual bounds, correct,
  // then reveal. This prevents any visible jump regardless of menu height.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (showRotationUI && !prevShowRotationUIRef.current) {
      setMenuReady(false);
      setContextMenuOffset({ y: 0, z: 0 });

      // Set initial world-space position (menu is invisible at this point)
      if (viewMode === 'top') {
        fixedContextMenuPosRef.current = { y: 0, z: offZ + depth / 2 + 1.2 };
      } else {
        fixedContextMenuPosRef.current = { y: -1.0, z: offZ };
      }

      // After DOM renders (one frame is enough), measure actual position and correct if needed
      timer = setTimeout(() => {
        const newOffset = { y: 0, z: 0 };

        if (contextMenuRef.current) {
          const menuRect = contextMenuRef.current.getBoundingClientRect();
          const objectBounds = getObjectScreenBounds();
          const margin = 24;
          const padding = 12;

          const overlapsObject =
            menuRect.left   < objectBounds.maxX + margin &&
            menuRect.right  > objectBounds.minX - margin &&
            menuRect.top    < objectBounds.maxY + margin &&
            menuRect.bottom > objectBounds.minY - margin;

          const outBottom = menuRect.bottom > window.innerHeight - padding;
          const outTop    = menuRect.top    < padding;
          const outLeft   = menuRect.left   < padding;
          const outRight  = menuRect.right  > window.innerWidth  - padding;

          if (overlapsObject || outBottom || outTop || outLeft || outRight) {
            const wp0 = new THREE.Vector3(x, 0, z).project(camera);
            const wpY = new THREE.Vector3(x, 1, z).project(camera);
            const screenPerWorldY = Math.abs((wpY.y - wp0.y) * (window.innerHeight / 2)) || 80;

            const menuMidY   = (menuRect.top + menuRect.bottom) / 2;
            const spaceAbove = objectBounds.minY - padding;
            const spaceBelow = window.innerHeight - objectBounds.maxY - padding;

            if (overlapsObject || outBottom) {
              if (spaceAbove >= menuRect.height + margin) {
                const targetMidY = objectBounds.minY - margin - menuRect.height / 2;
                newOffset.y = -(targetMidY - menuMidY) / screenPerWorldY;
              } else if (spaceBelow >= menuRect.height + margin) {
                const targetMidY = objectBounds.maxY + margin + menuRect.height / 2;
                newOffset.y = -(targetMidY - menuMidY) / screenPerWorldY;
              } else {
                const spaceRight = window.innerWidth - objectBounds.maxX - padding;
                newOffset.z = spaceRight >= menuRect.width + margin ? -2.5 : 2.5;
              }
            } else if (outTop) {
              const targetMidY = padding + menuRect.height / 2;
              newOffset.y = -(targetMidY - menuMidY) / screenPerWorldY;
            }

            if (outLeft)       newOffset.z =  2.0;
            else if (outRight) newOffset.z = -2.0;
          }
        }

        setContextMenuOffset(newOffset);
        setMenuReady(true);
      // getObjectScreenBounds, x, z, camera etc. are captured by closure at open time
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, 50);
    }

    if (!showRotationUI && prevShowRotationUIRef.current) {
      fixedContextMenuPosRef.current = null;
      setMenuReady(false);
    }

    prevShowRotationUIRef.current = showRotationUI;

    return () => { if (timer) clearTimeout(timer); };
  // offZ, depth, viewMode, x, z, camera captured by closure at open time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRotationUI]);

  // Use fixed position while menu is open, otherwise calculate current position
  const contextMenuPosY = fixedContextMenuPosRef.current?.y ?? calculatedContextMenuPosY;
  const contextMenuPosZ = fixedContextMenuPosRef.current?.z ?? calculatedContextMenuPosZ;

  // Hitbox dimensions - match actual model dimensions for better selection
  // In both views, we need width x depth coverage with small padding
  const hitboxPadding = 0.2;
  const hitboxWidth = Math.max(width, 0.6) + hitboxPadding;
  const hitboxDepth = Math.max(depth, 0.6) + hitboxPadding;

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
    
    // --- CUSTOM LABEL-ONLY (invisible hitbox) ---
    if (item.type === 'custom' && !(item.customWidth ?? 0) && !(item.customDepth ?? 0)) {
      return (
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.3]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      );
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
            position={[0 + offX, item.type === 'custom' && item.labelHeight ? item.labelHeight : height + labelYPadding + offY, 0 + offZ]}
            center
            zIndexRange={isDragging ? [500, 400] : [100, 0]}
            style={{ pointerEvents: isPreview ? 'none' : 'none' }}
        >
          <div
            className={`font-black whitespace-nowrap select-none tracking-tight px-1 rounded border text-center inline-block ${isGhost ? 'text-slate-700 bg-white/30 border-white/10' : 'text-slate-900 bg-white/50 border-white/20'}`}
            style={{
              fontSize: `${scaledFontSize}px`,
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
      {showRotationUI && !isGhost && isEditable && (onRotate || item.type === 'power' || item.type === 'monitor' || item.type === 'custom') && (
        <Html
            position={[0 + offX, contextMenuPosY + contextMenuOffset.y, contextMenuPosZ + contextMenuOffset.z]}
            center
            zIndexRange={[1000, 900]}
            style={{ pointerEvents: 'auto' }}
        >
          <div
            ref={contextMenuRef}
            className="flex gap-1 bg-slate-900 border border-slate-600 rounded-lg p-1.5 shadow-lg"
            style={{ opacity: menuReady ? 1 : 0, pointerEvents: menuReady ? undefined : 'none' }}
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
            ) : item.type === 'custom' ? (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => onLabelChange?.(item.id, e.target.value)}
                  className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:border-indigo-500 w-full min-w-[120px]"
                  placeholder="Name..."
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') onCloseRotationUI?.(); }}
                />
                {(item.customWidth ?? 0) === 0 && (item.customDepth ?? 0) === 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px] w-7">Label</span>
                    <button
                      onClick={() => onLabelHeightChange?.(item.id, (item.labelHeight ?? 1.7) - 0.2)}
                      className="p-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-[10px]"
                    >−</button>
                    <div className="px-1 py-1 text-white text-[10px] font-bold flex items-center bg-slate-800 rounded min-w-[32px] justify-center">
                      {((item.labelHeight ?? 1.7)).toFixed(1)}m
                    </div>
                    <button
                      onClick={() => onLabelHeightChange?.(item.id, (item.labelHeight ?? 1.7) + 0.2)}
                      className="p-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-[10px]"
                    >+</button>
                  </div>
                )}
                {(item.customWidth ?? 0) > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[10px] w-8">W</span>
                      <button onClick={() => onResizeStart?.(item.id)} className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1" title="Move cursor to resize width/depth. Switch to Top View for best results. Click canvas to finish.">⇲ Drag</button>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[10px] w-8">H</span>
                      <button
                        onClick={() => onHeightChange?.(item.id, (item.customHeight ?? 0.3) - 0.2)}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                      >−</button>
                      <div className="px-1 py-1 text-white text-[10px] font-bold flex items-center bg-slate-800 rounded min-w-[32px] justify-center">
                        {((item.customHeight ?? 0.3) * 10).toFixed(0) === '0' ? '0.1' : ((item.customHeight ?? 0.3)).toFixed(1)}m
                      </div>
                      <button
                        onClick={() => onHeightChange?.(item.id, (item.customHeight ?? 0.3) + 0.2)}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                      >+</button>
                    </div>
                  </>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={() => onRotate?.(item.id, 'left')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1"
                    title="Rotate left 22.5°"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => onCloseRotationUI?.()}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex-1"
                    title="Done"
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
        {/* For custom labels, position hitbox at label height; otherwise use item height */}
        {(() => {
          const isLabelOnly = item.type === 'custom' && (item.customWidth ?? 0) === 0 && (item.customDepth ?? 0) === 0;
          const hitboxY = isLabelOnly && item.labelHeight ? item.labelHeight : height / 2 + offY;
          return (
            <mesh position={[0 + offX, hitboxY, 0 + offZ]}>
              <boxGeometry args={[hitboxWidth, isLabelOnly ? 0.4 : height, hitboxDepth]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          );
        })()}

        <Suspense fallback={null}>
            {renderModel()}
        </Suspense>
      </group>
    </group>
  );
};
