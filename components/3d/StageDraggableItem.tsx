
import React, { Suspense } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StageItem, BandMember, InstrumentType } from '../../types';
import { getItemConfig } from '../../utils/stageConfig';
import { percentToX, percentToZ } from '../../utils/stageHelpers';
import * as Models from './StageModels';
import { MODEL_OFFSETS } from './StageModels';
import { INSTRUMENTS } from '../../constants';

interface DraggableItemProps {
  item: StageItem;
  activeId: string | null;
  onDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
  onMove: (e: ThreeEvent<PointerEvent>) => void;
  onUp: (e: ThreeEvent<PointerEvent>) => void;
  isGhost?: boolean;
  member?: BandMember;
}

export const StageDraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  activeId, 
  onDown,
  onMove,
  onUp,
  isGhost = false,
  member
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

  const labelLower = (item.label || '').toLowerCase();
  
  // Logic to determine which offset to apply to the Label and Hitbox
  // This must match the model used in renderModel
  let offset = MODEL_OFFSETS.DEFAULT;
  
  // Only apply instrument-specific offsets if the item is NOT a person.
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

  // Custom vertical label adjustment
  let labelYPadding = 0.3; // Default padding
  if (shape === 'person') {
      labelYPadding = 0.65; // Higher for person
  } else if (labelLower.includes('sax')) {
      labelYPadding = 0.05; // Lower for sax
  }

  const renderModel = () => {
    
    // --- 1. PERSON ---
    if (shape === 'person') {
        let heldElement = null;

        // Check if the member has an instrument that should be held
        if (member) {
             const heldInstId = member.instrumentIds.find(id => {
                  const inst = INSTRUMENTS.find(i => i.id === id);
                  return inst && [InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS].includes(inst.type);
             });
             
             if (heldInstId) {
                  const inst = INSTRUMENTS.find(i => i.id === heldInstId);
                  const instType = inst?.type;
                  const labelLowerInst = (inst?.group || '').toLowerCase();

                  if (labelLowerInst.includes('bass')) {
                      heldElement = <Models.BassModel held />;
                  } else if (labelLowerInst.includes('acoustic')) {
                      heldElement = <Models.AcousticGuitarModel held />;
                  } else if (instType === InstrumentType.GUITAR) { // Electric
                      heldElement = <Models.ElectricGuitarModel held />;
                  } else if (labelLowerInst.includes('sax')) {
                      heldElement = <Models.SaxModel held />;
                  } else if (labelLowerInst.includes('trumpet') || labelLowerInst.includes('tpt')) {
                      heldElement = <Models.TrumpetModel held />;
                  }
             }
        }

        return (
            <group>
                <Models.PersonModel color={isDragging ? '#fbbf24' : undefined} />
                {heldElement}
            </group>
        );
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

    // --- 6. INSTRUMENTS (On Stand) ---

    // Check Bass BEFORE Guitar to prevent "Bass Guitar" from being caught by the "guitar" check
    if (labelLower.includes('bass')) {
         return <Models.BassModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    if (labelLower.includes('acoustic')) {
         return <Models.AcousticGuitarModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    if (labelLower.includes('guitar')) { // Electric
         return <Models.ElectricGuitarModel color={isDragging ? '#fbbf24' : color} />;
    }

    // --- 7. HORNS (On Stand) ---

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
            // Apply offset to Label
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

      <group
        onPointerDown={!isGhost ? (e) => onDown(e, item.id) : undefined}
        onPointerMove={!isGhost ? onMove : undefined}
        onPointerUp={!isGhost ? onUp : undefined}
      >
        {/* HIT BOX - Invisible mesh with OFFSET applied to match the model's visual location */}
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