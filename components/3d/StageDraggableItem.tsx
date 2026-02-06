import React, { Suspense } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StageItem } from '../../types';
import { getItemConfig } from '../../utils/stageConfig';
import { percentToX, percentToZ } from '../../utils/stageHelpers';
import { GuitarModel, PersonModel } from './StageModels';

interface DraggableItemProps {
  item: StageItem;
  activeId: string | null;
  onDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
  onMove: (e: ThreeEvent<PointerEvent>) => void;
  onUp: (e: ThreeEvent<PointerEvent>) => void;
  isGhost?: boolean;
}

export const StageDraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  activeId, 
  onDown,
  onMove,
  onUp,
  isGhost = false
}) => {
  const { width, height, depth, color, shape } = getItemConfig(item);
  const yPos = height / 2;
  const x = percentToX(item.x);
  const z = percentToZ(item.y);
  const isDragging = activeId === item.id;
  
  const opacity = isGhost ? 0.6 : 1;
  const transparent = isGhost;
  const materialProps = { opacity, transparent, roughness: 0.4 };

  // Always show label for better visibility
  const showLabel = true;

  // Check if it's a guitar or bass for the 3D model
  const isGuitarOrBass = (item.label || '').toLowerCase().match(/guitar|bass/);

  return (
    <group position={[x, 0, z]}>
      {showLabel && (
        <Html 
            position={[0, height + 0.3, 0]} 
            center 
            zIndexRange={isDragging ? [500, 400] : [100, 0]} 
            style={{ pointerEvents: 'none' }}
        >
          <div className={`text-[10px] font-black whitespace-nowrap select-none tracking-tight px-1 rounded backdrop-blur-sm border ${isGhost ? 'text-slate-700 bg-white/30 border-white/10' : 'text-slate-900 bg-white/50 border-white/20'}`}>
            {item.label}
          </div>
        </Html>
      )}

      <group
        onPointerDown={!isGhost ? (e) => onDown(e, item.id) : undefined}
        onPointerMove={!isGhost ? onMove : undefined}
        onPointerUp={!isGhost ? onUp : undefined}
      >
        {/* HIT BOX - Invisible mesh to ensure robust drag-and-drop interaction */}
        <mesh position={[0, height / 2, 0]}>
             <boxGeometry args={[Math.max(width, 0.6), height, Math.max(depth, 0.6)]} />
             <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {shape === 'wedge' ? (
             // Monitor Wedge shape
             <mesh position={[0, height/2, 0]} rotation={[Math.PI/6, 0, 0]} castShadow={!isGhost} receiveShadow>
                 <boxGeometry args={[width, height, depth]} />
                 <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
             </mesh>
        ) : shape === 'pole' ? (
             // Mic Stand
             <group>
                 <mesh position={[0, height/2, 0]} castShadow={!isGhost}>
                     <cylinderGeometry args={[0.02, 0.02, height]} />
                     <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
                 </mesh>
                 <mesh position={[0, 0.02, 0]}>
                     <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                     <meshStandardMaterial color="#475569" {...materialProps} />
                 </mesh>
             </group>
        ) : shape === 'instrument' ? (
             isGuitarOrBass ? (
                 <group position={[0, height/2, 0]}>
                    <Suspense fallback={
                         <mesh position={[0, 0, 0]} castShadow={!isGhost}>
                             <boxGeometry args={[width, height*0.6, 0.1]} />
                             <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
                         </mesh>
                    }>
                        <GuitarModel color={isDragging ? '#fbbf24' : color} />
                    </Suspense>
                 </group>
             ) : (
                // Abstract Instrument Shape (Sax/Trumpet etc)
                <group>
                    {/* Body */}
                    <mesh position={[0, height*0.4, 0]} castShadow={!isGhost}>
                        <boxGeometry args={[width, height*0.6, 0.1]} />
                        <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
                    </mesh>
                    {/* Neck */}
                    <mesh position={[0, height*0.8, 0]}>
                        <boxGeometry args={[width*0.2, height*0.4, 0.05]} />
                        <meshStandardMaterial color="#475569" {...materialProps} />
                    </mesh>
                    {/* Stand Base */}
                    <mesh position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                        <meshStandardMaterial color="#475569" {...materialProps} />
                    </mesh>
                </group>
             )
        ) : shape === 'person' ? (
             // Band Member 3D Model
             <group position={[0, 0, 0]}>
                 <Suspense fallback={
                     <mesh position={[0, height/2, 0]} castShadow={!isGhost} receiveShadow>
                        <boxGeometry args={[width, height, depth]} />
                        <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
                     </mesh>
                 }>
                     <PersonModel color={isDragging ? '#fbbf24' : color} />
                 </Suspense>
             </group>
        ) : (
             // Default Box / Amp
             <mesh position={[0, yPos, 0]} castShadow={!isGhost} receiveShadow>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
             </mesh>
        )}
      </group>
    </group>
  );
};