import React, { Suspense } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StageItem } from '../../types';
import { getItemConfig } from '../../utils/stageConfig';
import { percentToX, percentToZ } from '../../utils/stageHelpers';
import * as Models from './StageModels';

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
  const x = percentToX(item.x);
  const z = percentToZ(item.y);
  const isDragging = activeId === item.id;
  
  const opacity = isGhost ? 0.6 : 1;
  const transparent = isGhost;
  const materialProps = { opacity, transparent, roughness: 0.4 };

  // Always show label for better visibility
  const showLabel = true;

  const renderModel = () => {
    const labelLower = (item.label || '').toLowerCase();
    
    // --- 1. PERSON ---
    if (shape === 'person') {
        return <Models.PersonModel color={isDragging ? '#fbbf24' : undefined} />;
    }

    // --- 2. DRUMS ---
    if (labelLower.includes('drum') || labelLower.includes('kit')) {
        // Remove coloring, only highlight on drag
        return <Models.DrumsModel color={isDragging ? '#fbbf24' : undefined} />;
    }
    
    // --- 3. AMPS ---
    if (labelLower.includes('amp')) {
        return <Models.AmpModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    // --- 4. KEYS / SYNTH ---
    if (labelLower.includes('keys') || labelLower.includes('synth')) {
        // Add Stand, Remove coloring unless dragging
        return (
            <group>
                <Models.StandModel color={isDragging ? '#fbbf24' : '#64748b'} />
                <group position={[0, 0.8, 0]}>
                    <Models.SynthModel color={isDragging ? '#fbbf24' : undefined} />
                </group>
            </group>
        );
    }
    
    // --- 5. MIC STANDS ---
    if (labelLower.includes('mic')) {
        return <Models.MicStandModel color={isDragging ? '#fbbf24' : color} />;
    }

    // --- 6. INSTRUMENTS (Guitars - No Stand) ---
    
    if (labelLower.includes('acoustic')) {
         return <Models.AcousticGuitarModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    if (labelLower.includes('guitar')) { // Electric
         return <Models.ElectricGuitarModel color={isDragging ? '#fbbf24' : color} />;
    }

    // --- 7. INSTRUMENTS WITHOUT STAND (Bass, Horns) ---

    if (labelLower.includes('bass')) {
         return <Models.BassModel color={isDragging ? '#fbbf24' : color} />;
    }

    if (labelLower.includes('sax')) {
         return <Models.SaxModel color={isDragging ? '#fbbf24' : color} />;
    }

    if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
         return <Models.TrumpetModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    // --- 8. FALLBACKS ---
    
    if (shape === 'wedge') {
        return (
             <mesh position={[0, height/2, 0]} rotation={[Math.PI/6, 0, 0]} castShadow={!isGhost} receiveShadow>
                 <boxGeometry args={[width, height, depth]} />
                 <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
             </mesh>
        );
    }
    
    // Default Box
    return (
         <mesh position={[0, height/2, 0]} castShadow={!isGhost} receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
         </mesh>
    );
  };

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
