import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html } from '@react-three/drei';
import { BandMember, InstrumentType } from '../types';
import { INSTRUMENTS } from '../constants';
import { COLORS } from '../utils/stageConfig';
import * as Models from './3d/StageModels';
import { MODEL_OFFSETS } from './3d/StageModels';

interface MemberPreview3DProps {
  member: BandMember;
}

interface SceneItem {
  id: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  type: string; // Used for model selection
  held?: boolean;
}

interface PreviewItemProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  label?: string;
  type: string;
  held?: boolean;
}

const PreviewItem: React.FC<PreviewItemProps> = ({ position, args, color, label, type, held }) => {
    const [width, height, depth] = args;
    
    // Determine offset
    let offset = MODEL_OFFSETS.DEFAULT;
    if (type === 'drums') offset = MODEL_OFFSETS.DRUMS;
    else if (type === 'sax') offset = MODEL_OFFSETS.SAX;
    else if (type === 'trumpet') offset = MODEL_OFFSETS.TRUMPET;

    // const [offX, offY, offZ] = offset; // Unused if labels are removed

    const renderMesh = () => {
        if (type === 'person') return <Models.PersonModel />;
        if (type === 'drums') return <Models.DrumsModel />; 
        if (type === 'amp') return <Models.AmpModel color={color} />;
        
        // Keys with Stand, No Color
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
        
        // Guitars No Stand
        if (type === 'guitar_elec') return <Models.ElectricGuitarModel color={color} />;
        if (type === 'guitar_ac') return <Models.AcousticGuitarModel color={color} />;
        
        // Bass
        if (type === 'bass') return <Models.BassModel color={color} held={held} />;
        
        // Sax No Stand
        if (type === 'sax') return <Models.SaxModel color={color} />;
        
        // Trumpet No Stand
        if (type === 'trumpet') return <Models.TrumpetModel color={color} />;

        if (type === 'wedge') {
            return (
                <mesh position={[0, height/2, 0]} rotation={[Math.PI/6, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width, height, depth]} />
                    <meshStandardMaterial color={color} roughness={0.4} />
                </mesh>
            );
        }

        // Default Box
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
    
    // 1. The Person (Center)
    items.push({ 
      id: 'person', 
      pos: [0, 0, 0], 
      size: [0.5, 1.7, 0.5], 
      color: COLORS.person, 
      label: member.name || 'Musician',
      type: 'person' 
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
            pos: [0, 0, -1.0], 
            size: [1.8, 0.9, 1.5], 
            color: COLORS.drum, 
            label: 'Kit',
            type: 'drums'
        });
      }
      
      // --- AMPS (Guitar/Bass) ---
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

      // --- KEYS / DJ ---
      else if (inst.type === InstrumentType.KEYS || inst.id === 'dj') {
        items.push({ 
            id: `keys-${instId}`, 
            pos: [0.7, 0, 0.4], 
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

          // The Instrument
          if (type === 'bass') {
              // Bass is held by the person (centered)
              items.push({
                  id: `inst-body-${instId}`,
                  pos: [0, 0, 0], // Positioned at origin, model handles 'held' offsets
                  size: [0.4, 1.0, 0.3], 
                  color: COLORS.instrument,
                  label: inst.type,
                  type: type,
                  held: true
              });
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
          
          // Pedalboard / Modeler
          if (instId.includes('modeler')) {
              items.push({
                  id: `modeler-${instId}`,
                  pos: [sideOffset, 0, 0.7],
                  size: [0.6, 0.1, 0.3],
                  color: COLORS.pedalboard,
                  label: 'Modeler',
                  type: 'box'
              });
          } else if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS) {
               if (inst.id !== 'gtr_ac') {
                   items.push({
                       id: `pedal-${instId}`,
                       pos: [sideOffset, 0, 0.7],
                       size: [0.6, 0.1, 0.3],
                       color: COLORS.pedalboard,
                       label: 'Pedals',
                       type: 'box'
                   });
               }
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