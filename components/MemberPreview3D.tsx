
import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { BandMember, InstrumentType } from '../types';
import { INSTRUMENTS } from '../constants';
import { COLORS } from '../utils/stageConfig';
import * as Models from './3d/StageModels';
import { MODEL_OFFSETS, PersonPose } from './3d/StageModels';

interface MemberPreview3DProps {
  member: BandMember;
}

interface SceneItem {
  id: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  type: string;
  held?: boolean;
  pose?: PersonPose;
}

interface PreviewItemProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  label?: string;
  type: string;
  held?: boolean;
  pose?: PersonPose;
}

const PreviewItem: React.FC<PreviewItemProps> = ({ position, args, color, label, type, held, pose }) => {
    const [width, height, depth] = args;
    
    const renderMesh = () => {
        if (type === 'person') return <Models.PersonModel pose={pose} />;
        if (type === 'drums') return <Models.DrumsModel />; 
        if (type === 'amp') return <Models.AmpModel color={color} />;
        
        if (type === 'keys') {
            return (
                 <group>
                    <Models.StandModel color="#64748b" />
                    <group position={[0, 0.8, 0]}>
                        <Models.SynthModel />
                    </group>
                </group>
            );
        }
        
        if (type === 'mic') return <Models.MicStandModel color={color} />;
        
        // Instruments
        if (type === 'guitar_elec') return <Models.ElectricGuitarModel color={color} held={held} />;
        if (type === 'guitar_ac') return <Models.AcousticGuitarModel color={color} held={held} />;
        if (type === 'bass') return <Models.BassModel color={color} held={held} />;
        if (type === 'sax') return <Models.SaxModel color={color} held={held} />;
        if (type === 'trumpet') return <Models.TrumpetModel color={color} held={held} />;

        if (type === 'wedge') {
            return (
                <mesh position={[0, height/2, 0]} rotation={[Math.PI/6, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width, height, depth]} />
                    <meshStandardMaterial color={color} roughness={0.4} />
                </mesh>
            );
        }

        return (
            <mesh castShadow receiveShadow position={[0, height/2, 0]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
        );
    };

    return (
        <group position={position}>
            {renderMesh()}
        </group>
    );
};

export const MemberPreview3D: React.FC<MemberPreview3DProps> = ({ member }) => {
  
  const sceneItems = useMemo(() => {
    const items: SceneItem[] = [];

    // --- DETERMINE POSE ---
    let pose: PersonPose = 'stand';
    let heldInstId: string | undefined;

    // 1. Check for specific Roles (Drums/Keys)
    const hasDrums = member.instrumentIds.some(id => INSTRUMENTS.find(i => i.id === id)?.type === InstrumentType.DRUMS);
    const hasKeys = member.instrumentIds.some(id => INSTRUMENTS.find(i => i.id === id)?.type === InstrumentType.KEYS);

    if (hasDrums) {
        pose = 'drums';
    } else if (hasKeys) {
        pose = 'keys';
    } else {
        // 2. Check for Held Instruments
        heldInstId = member.instrumentIds.find(id => {
            const inst = INSTRUMENTS.find(i => i.id === id);
            return inst && [InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS].includes(inst.type);
        });

        if (heldInstId) {
            const inst = INSTRUMENTS.find(i => i.id === heldInstId);
            const labelLower = (inst?.group || '').toLowerCase();
            
            if (inst?.type === InstrumentType.BASS) pose = 'bass';
            else if (inst?.id === 'gtr_ac' || labelLower.includes('acoustic')) pose = 'acoustic';
            else if (inst?.type === InstrumentType.GUITAR) pose = 'guitar';
            else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) pose = 'trumpet';
        }
    }
    
    // 1. The Person
    items.push({ 
      id: 'person', 
      pos: [0, 0, 0], 
      size: [0.5, 1.7, 0.5], 
      color: COLORS.person, 
      label: member.name || 'Musician', 
      type: 'person',
      pose: pose
    });

    let ampCount = 0;
    let instrumentCount = 0;
    
    member.instrumentIds.forEach((instId) => {
      const inst = INSTRUMENTS.find(i => i.id === instId);
      if (!inst) return;

      // --- DRUMS ---
      if (inst.type === InstrumentType.DRUMS) {
        items.push({ 
            id: `drum-${instId}`, 
            pos: [0, 0, 0], 
            size: [1, 1, 1], 
            color: COLORS.drum, 
            label: 'Kit',
            type: 'drums'
        });
      }
      
      // --- AMPS ---
      else if (instId.includes('amp') || instId.includes('combined')) {
        const offset = ampCount % 2 === 0 ? -0.9 : 0.9;
        items.push({ 
            id: `amp-${instId}-${ampCount}`, 
            pos: [offset, 0, -0.6], 
            size: [0.7, 0.7, 0.4], 
            color: COLORS.amp, 
            label: 'Amp',
            type: 'amp'
        });
        ampCount++;
      }

      // --- KEYS ---
      else if (inst.type === InstrumentType.KEYS || inst.id === 'dj') {
        // Place keys in front of the player if they are a keyboardist
        const pos: [number, number, number] = (pose === 'keys') ? [0, 0, 0.5] : [0.7, 0, 0.4];
        
        items.push({ 
            id: `keys-${instId}`, 
            pos: pos, 
            size: [1.2, 0.9, 0.4], 
            color: COLORS.keys, 
            label: inst.group,
            type: 'keys'
        });
      }

      // --- MICS ---
      else if (inst.type === InstrumentType.VOCAL || instId.includes('mic')) {
        items.push({ 
            id: `mic-${instId}`, 
            pos: [0, 0, 0.6], 
            size: [0.2, 1.5, 0.2], 
            color: COLORS.mic, 
            label: 'Mic',
            type: 'mic'
        });
      }
      
      // --- INSTRUMENTS ---
      if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS || inst.type === InstrumentType.BRASS) {
          const isRight = instrumentCount % 2 === 0;
          const sideOffset = isRight ? 0.6 : -0.6;
          
          let type = 'box';
          if (inst.id === 'gtr_ac') type = 'guitar_ac';
          else if (inst.type === InstrumentType.BASS) type = 'bass';
          else if (inst.type === InstrumentType.GUITAR) type = 'guitar_elec';
          else if (inst.id.includes('sax')) type = 'sax';
          else if (inst.id.includes('tpt') || inst.id.includes('trumpet')) type = 'trumpet';

          const isHeld = (instId === heldInstId);

          if (isHeld) {
              // If it's a baked instrument, do NOT add separate item
              // Baked: Guitar, Acoustic, Bass, Trumpet
              const isBaked = 
                  type === 'guitar_elec' || 
                  type === 'guitar_ac' || 
                  type === 'bass' || 
                  type === 'trumpet';

              if (!isBaked) {
                  items.push({
                      id: `inst-body-${instId}`,
                      pos: [0, 0, 0], 
                      size: [0.4, 1.0, 0.3], 
                      color: COLORS.instrument,
                      label: inst.type,
                      type: type,
                      held: true
                  });
              }
          } else {
              items.push({
                  id: `inst-body-${instId}`,
                  pos: [sideOffset, 0, 0.1], 
                  size: [0.4, 1.0, 0.3], 
                  color: COLORS.instrument,
                  label: inst.type,
                  type: type
              });
          }
          
          if (instId.includes('modeler')) {
              items.push({
                  id: `modeler-${instId}`,
                  pos: [sideOffset, 0, 0.7],
                  size: [0.6, 0.1, 0.3],
                  color: COLORS.pedalboard,
                  label: 'Modeler',
                  type: 'box'
              });
          } else if ((inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS) && inst.id !== 'gtr_ac') {
               items.push({
                   id: `pedal-${instId}`,
                   pos: [sideOffset, 0, 0.7],
                   size: [0.6, 0.1, 0.3],
                   color: COLORS.pedalboard,
                   label: 'Pedals',
                   type: 'box'
               });
          }

          instrumentCount++;
      }
    });

    return items;
  }, [member]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative border border-slate-700 shadow-inner">
        <Canvas shadows camera={{ position: [2.5, 2.5, 3.5], fov: 35 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[512, 512]} />
            <pointLight position={[-5, 2, -5]} intensity={0.5} color="#3b82f6" />
            
            <Suspense fallback={null}>
                <group position={[0, -0.8, 0]}>
                    {sceneItems.map((item, idx) => (
                        <PreviewItem 
                            key={idx}
                            position={item.pos}
                            args={item.size}
                            color={item.color}
                            label={item.label}
                            type={item.type}
                            held={item.held}
                            pose={item.pose}
                        />
                    ))}
                    <gridHelper args={[5, 5, 0x334155, 0x1e293b]} position={[0, 0.001, 0]} />
                    <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
                </group>
            </Suspense>

            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
    </div>
  );
};
