import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html } from '@react-three/drei';
import { BandMember, InstrumentType } from '../types';
import { INSTRUMENTS } from '../constants';

interface MemberPreview3DProps {
  member: BandMember;
}

// Updated Color Palette
const COLORS = {
  person: '#3b82f6',     // Blue 500
  amp: '#1e293b',        // Slate 800
  drum: '#ef4444',       // Red 500
  keys: '#8b5cf6',       // Violet 500
  mic: '#cbd5e1',        // Slate 300 (Silver)
  instrument: '#fbbf24', // Amber 400 (Guitar/Bass body)
  pedalboard: '#111827', // Gray 900 (Black)
  di: '#f97316',         // Orange 500
  stand: '#64748b'       // Slate 500 (Hardware)
};

interface PreviewItemProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  label?: string;
}

const PreviewItem: React.FC<PreviewItemProps> = ({ position, args, color, label }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, args[1]/2, 0]}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    {label && (
        <Html position={[0, args[1] + 0.1, 0]} center zIndexRange={[100, 0]}>
            <div className="text-[7px] font-bold bg-black/60 text-white px-1 py-0.5 rounded backdrop-blur-sm whitespace-nowrap border border-white/10">
                {label}
            </div>
        </Html>
    )}
  </group>
);

interface SceneItem {
  id: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
}

export const MemberPreview3D: React.FC<MemberPreview3DProps> = ({ member }) => {
  
  const sceneItems = useMemo(() => {
    const items: SceneItem[] = [];
    
    // 1. The Person (Center)
    items.push({ 
      id: 'person', 
      pos: [0, 0, 0], 
      size: [0.4, 1.6, 0.4], 
      color: COLORS.person, 
      label: member.name || 'Musician' 
    });

    // Track positioning to prevent overlapping
    let ampCount = 0;
    let instrumentCount = 0;
    
    member.instrumentIds.forEach((instId) => {
      const inst = INSTRUMENTS.find(i => i.id === instId);
      if (!inst) return;

      // --- DRUMS ---
      if (inst.type === InstrumentType.DRUMS) {
        items.push({ 
            id: `drum-${instId}`, 
            pos: [0, 0, -1.0], // Behind person
            size: [1.6, 0.8, 1.0], 
            color: COLORS.drum, 
            label: 'Kit' 
        });
      }
      
      // --- AMPS (Guitar/Bass) ---
      else if (instId.includes('amp') || instId.includes('combined')) {
        const offset = ampCount % 2 === 0 ? -0.9 : 0.9;
        items.push({ 
            id: `amp-${instId}-${ampCount}`, 
            pos: [offset, 0, -0.6], // Behind and to side
            size: [0.7, 0.7, 0.4], 
            color: COLORS.amp, 
            label: 'Amp' 
        });
        ampCount++;
      }

      // --- KEYS / DJ ---
      else if (inst.type === InstrumentType.KEYS || inst.id === 'dj') {
        items.push({ 
            id: `keys-${instId}`, 
            pos: [0.7, 0, 0.4], // Front-Right
            size: [0.9, 0.9, 0.35], 
            color: COLORS.keys, 
            label: inst.group 
        });
      }

      // --- MICS (Vocals or Horns on stand) ---
      else if (inst.type === InstrumentType.VOCAL || instId.includes('mic')) {
        // Mic Stand
        items.push({ 
            id: `mic-${instId}`, 
            pos: [0, 0, 0.6], // Directly in front
            size: [0.05, 1.5, 0.05], 
            color: COLORS.mic, 
            label: 'Mic' 
        });
        // Mic Base
        items.push({ 
            id: `mic-base-${instId}`, 
            pos: [0, 0, 0.6], 
            size: [0.3, 0.02, 0.3], 
            color: COLORS.stand, 
            label: '' 
        });
      }
      
      // --- INSTRUMENTS (Guitars/Bass Visuals) ---
      if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS) {
          const isRight = instrumentCount % 2 === 0;
          const sideOffset = isRight ? 0.6 : -0.6;
          
          // The Instrument Body (placed next to musician)
          items.push({
              id: `inst-body-${instId}`,
              pos: [sideOffset, 0.5, 0.1],
              size: [0.3, 0.8, 0.15],
              color: COLORS.instrument,
              label: inst.type
          });
          
          // Neck of instrument (simulated)
          items.push({
              id: `inst-neck-${instId}`,
              pos: [sideOffset, 1.0, 0.1],
              size: [0.05, 0.5, 0.05],
              color: COLORS.stand,
              label: ''
          });

          // Pedalboard / Modeler
          if (instId.includes('modeler')) {
              items.push({
                  id: `modeler-${instId}`,
                  pos: [sideOffset, 0, 0.7],
                  size: [0.5, 0.1, 0.3],
                  color: COLORS.pedalboard,
                  label: 'Modeler'
              });
          } else if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS) {
               // Standard pedalboard for electric instruments
               if (inst.id !== 'gtr_ac') {
                   items.push({
                       id: `pedal-${instId}`,
                       pos: [sideOffset, 0, 0.7],
                       size: [0.5, 0.05, 0.3],
                       color: COLORS.pedalboard,
                       label: 'Pedals'
                   });
               }
          }

          // DI Box
          if (inst.defaultDi || instId.includes('di') || instId.includes('modeler')) {
              items.push({
                  id: `di-${instId}`,
                  pos: [sideOffset + (isRight ? 0.3 : -0.3), 0, 0.5],
                  size: [0.15, 0.1, 0.2],
                  color: COLORS.di,
                  label: 'DI'
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
            {/* Key Light */}
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[512, 512]} />
            {/* Fill Light (Blueish for stage feel) */}
            <pointLight position={[-5, 2, -5]} intensity={0.5} color="#3b82f6" />
            
            <group position={[0, -0.8, 0]}> {/* Center the scene vertically */}
                {sceneItems.map((item, idx) => (
                    <PreviewItem 
                        key={idx}
                        position={item.pos}
                        args={item.size}
                        color={item.color}
                        label={item.label}
                    />
                ))}
                
                {/* Floor Grid for reference */}
                <gridHelper args={[5, 5, 0x334155, 0x1e293b]} position={[0, 0.001, 0]} />
                <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
            </group>

            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
    </div>
  );
};