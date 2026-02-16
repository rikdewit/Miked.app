
import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { BandMember, InstrumentType, PersonPose } from '../types';
import { INSTRUMENTS } from '../constants';
import { COLORS } from '../utils/stageConfig';
import { getPersonPose } from '../utils/stageHelpers';
import * as Models from './3d/StageModels';

interface MemberPreview3DProps {
  member: BandMember;
  isDragging?: boolean;
  isSidebarPreview?: boolean;
}

interface SceneItem {
  id: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  type: string;
  pose?: PersonPose;
}

interface PreviewItemProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  label?: string;
  type: string;
  pose?: PersonPose;
}

const PreviewItem: React.FC<PreviewItemProps> = ({ position, args, color, type, pose }) => {
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
        
        // Instruments (Standalone)
        if (type === 'guitar_elec') return <Models.ElectricGuitarModel color={color} />;
        if (type === 'guitar_ac') return <Models.AcousticGuitarModel color={color} />;
        if (type === 'bass') return <Models.BassModel color={color} />;
        if (type === 'sax') return <Models.SaxModel color={color} />;
        if (type === 'trumpet') return <Models.TrumpetModel color={color} />;

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

export const MemberPreview3D: React.FC<MemberPreview3DProps> = ({ member, isDragging = false, isSidebarPreview = false }) => {
  const sceneItems = useMemo(() => {
    const items: SceneItem[] = [];

    // --- DETERMINE POSE ---
    const { pose, heldInstrumentId } = getPersonPose(member);
    
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

    member.instruments.forEach((slot) => {
      const instId = slot.instrumentId;
      const inst = INSTRUMENTS.find(i => i.id === instId);
      if (!inst) return;

      // Note: DRUMS, KEYS, DJ, VOCALS are part of the person model or main scene setup, 
      // so we don't add separate items for them here unless they are peripherals.
      
      // --- AMPS ---
      if (instId.includes('amp') || instId.includes('combined')) {
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

      // --- INSTRUMENTS (Standalone on stands) ---
      // We only add these if they are NOT the instrument currently being held/played in the model
      const isHeld = (instId === heldInstrumentId);
      const isBakedPose = ['guitar', 'bass', 'acoustic', 'sax', 'trumpet'].includes(pose);

      if (isHeld && isBakedPose) {
          // If this instrument is the one being played and the model supports it, 
          // do NOT add a separate item. The GLB includes it.
          return;
      }

      if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS || inst.type === InstrumentType.BRASS) {
          const isRight = instrumentCount % 2 === 0;
          const sideOffset = isRight ? 0.6 : -0.6;
          
          let type = 'box';
          if (inst.id === 'gtr_ac') type = 'guitar_ac';
          else if (inst.type === InstrumentType.BASS) type = 'bass';
          else if (inst.type === InstrumentType.GUITAR) type = 'guitar_elec';
          else if (inst.id.includes('sax')) type = 'sax';
          else if (inst.id.includes('tpt') || inst.id.includes('trumpet')) type = 'trumpet';

          // If it's held but not baked (e.g. some new instrument type), we might render it at [0,0,0]?
          // For now, assuming all held instruments are baked if logic matches.
          // So we only render items on stands here (side offsets).
          
          items.push({
              id: `inst-body-${instId}`,
              pos: [sideOffset, 0, 0.1], 
              size: [0.4, 1.0, 0.3], 
              color: COLORS.instrument,
              label: inst.type,
              type: type
          });
          
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
    <div
      className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative border border-slate-700 shadow-inner"
      style={{ touchAction: isSidebarPreview ? 'auto' : 'none' }}
    >
        <Canvas shadows camera={{ position: [2.5, 2.5, 3.5], fov: 35 }} style={{ touchAction: isSidebarPreview ? 'auto' : 'none', pointerEvents: isSidebarPreview ? 'none' : 'auto' }}>
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
                            pose={item.pose}
                        />
                    ))}
                    <gridHelper args={[5, 5, 0x334155, 0x1e293b]} position={[0, 0.001, 0]} />
                    <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
                </group>
            </Suspense>

            <OrbitControls enabled={!isSidebarPreview} enableZoom={false} autoRotate={!isDragging} autoRotateSpeed={1.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
    </div>
  );
};
