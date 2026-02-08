
import React, { Suspense } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StageItem, BandMember, InstrumentType } from '../../types';
import { getItemConfig } from '../../utils/stageConfig';
import { percentToX, percentToZ } from '../../utils/stageHelpers';
import * as Models from './StageModels';
import { MODEL_OFFSETS, PersonPose } from './StageModels';
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

  const showLabel = true;
  const labelLower = (item.label || '').toLowerCase();
  
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
    
    // --- 1. PERSON ---
    if (shape === 'person') {
        let heldElement = null;
        let pose: PersonPose = 'stand';

        if (member) {
             // 1. Check for specific roles that define posture (Drums/Keys)
             const hasDrums = member.instrumentIds.some(id => INSTRUMENTS.find(i => i.id === id)?.type === InstrumentType.DRUMS);
             const hasKeys = member.instrumentIds.some(id => INSTRUMENTS.find(i => i.id === id)?.type === InstrumentType.KEYS);

             if (hasDrums) {
                 pose = 'drums';
             } else if (hasKeys) {
                 pose = 'keys';
             } else {
                 // 2. Check for held instruments
                 const heldInstId = member.instrumentIds.find(id => {
                      const inst = INSTRUMENTS.find(i => i.id === id);
                      return inst && [InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS].includes(inst.type);
                 });
                 
                 if (heldInstId) {
                      const inst = INSTRUMENTS.find(i => i.id === heldInstId);
                      const instType = inst?.type;
                      const labelLowerInst = (inst?.group || '').toLowerCase();

                      if (labelLowerInst.includes('bass')) {
                          pose = 'bass';
                          // Bass is baked in
                      } else if (labelLowerInst.includes('acoustic')) {
                          pose = 'acoustic';
                          // Acoustic is baked in
                      } else if (instType === InstrumentType.GUITAR) { // Electric
                          pose = 'guitar';
                          // Guitar is baked in
                      } else if (labelLowerInst.includes('trumpet') || labelLowerInst.includes('tpt')) {
                          pose = 'trumpet';
                          // Trumpet is baked in
                      } else if (labelLowerInst.includes('sax')) {
                          heldElement = <Models.SaxModel held />;
                          // Sax is NOT baked in, keep standing pose
                      }
                 }
             }
        }

        return (
            <group>
                <Models.PersonModel color={isDragging ? '#fbbf24' : undefined} pose={pose} />
                {heldElement}
            </group>
        );
    }

    // --- 2. DRUMS ---
    if (labelLower.includes('drum') || labelLower.includes('kit')) {
        return <Models.DrumsModel color={isDragging ? '#fbbf24' : undefined} />;
    }
    
    // --- 3. AMPS ---
    if (labelLower.includes('amp')) {
        return <Models.AmpModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    // --- 4. KEYS / SYNTH ---
    if (labelLower.includes('keys') || labelLower.includes('synth')) {
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
    if (labelLower.includes('bass')) {
         return <Models.BassModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    if (labelLower.includes('acoustic')) {
         return <Models.AcousticGuitarModel color={isDragging ? '#fbbf24' : color} />;
    }
    
    if (labelLower.includes('guitar')) { 
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
