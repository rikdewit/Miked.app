import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
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
  mic: '#94a3b8',        // Slate 400
  instrument: '#fbbf24', // Amber 400
  pedalboard: '#111827', // Gray 900
  di: '#f97316',         // Orange 500
  stand: '#64748b'       // Slate 500 (Hardware)
};

type ShapeType = 'box' | 'cylinder' | 'pole' | 'instrument' | 'person' | 'wedge';

interface SceneItem {
  id: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  shape?: ShapeType;
}

interface PreviewItemProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  label?: string;
  shape?: ShapeType;
}

// Consistent URL with StagePlotCanvas
const GUITAR_URL = 'https://raw.githubusercontent.com/rikdewit/Miked.app/production/public/assets/Electric_Guitar_Telecaster_Red.glb';

// Reusing the GuitarModel here for consistency in preview
const GuitarModel = ({ color }: { color: string }) => {
  const { scene } = useGLTF(GUITAR_URL);
  
  const clone = React.useMemo(() => {
    const c = scene.clone();
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
         (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ 
             color: color, 
             roughness: 0.3,
             metalness: 0.2
         });
         child.castShadow = true;
         child.receiveShadow = true;
      }
    });
    return c;
  }, [scene, color]);

  return <primitive object={clone} scale={1.5} rotation={[0, Math.PI / 2, 0]} position={[0, -0.5, 0]} />;
};

const PreviewItem: React.FC<PreviewItemProps> = ({ position, args, color, label, shape = 'box' }) => {
    const [width, height, depth] = args;

    const renderMesh = () => {
        if (shape === 'pole') {
            // Mic Stand
            return (
                <group>
                    <mesh position={[0, height/2, 0]} castShadow>
                        <cylinderGeometry args={[0.02, 0.02, height]} />
                        <meshStandardMaterial color={color} roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 0.02, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                        <meshStandardMaterial color="#475569" roughness={0.4} />
                    </mesh>
                </group>
            );
        }
        if (shape === 'instrument') {
            // Check label for Guitar/Bass
            const isGuitarOrBass = (label || '').toLowerCase().match(/guitar|bass/);
            
            if (isGuitarOrBass) {
                return (
                    <group position={[0, height/2, 0]}>
                         <Suspense fallback={
                             <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[width, height*0.6, 0.1]} />
                                <meshStandardMaterial color={color} roughness={0.4} />
                             </mesh>
                         }>
                             <GuitarModel color={color} />
                         </Suspense>
                    </group>
                );
            }

            // Fallback for Horns/Others
            return (
                <group>
                    {/* Body */}
                    <mesh position={[0, height*0.4, 0]} castShadow>
                        <boxGeometry args={[width, height*0.6, 0.1]} />
                        <meshStandardMaterial color={color} roughness={0.4} />
                    </mesh>
                    {/* Neck */}
                    <mesh position={[0, height*0.8, 0]}>
                        <boxGeometry args={[width*0.2, height*0.4, 0.05]} />
                        <meshStandardMaterial color="#475569" roughness={0.4} />
                    </mesh>
                    {/* Stand Base */}
                    <mesh position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                        <meshStandardMaterial color="#475569" roughness={0.4} />
                    </mesh>
                </group>
            );
        }
        if (shape === 'wedge') {
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
            {label && (
                <Html position={[0, height + 0.3, 0]} center zIndexRange={[100, 0]}>
                    <div className="text-[7px] font-bold bg-black/60 text-white px-1 py-0.5 rounded backdrop-blur-sm whitespace-nowrap border border-white/10">
                        {label}
                    </div>
                </Html>
            )}
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
      size: [0.5, 1.7, 0.5], // Matched StagePlotCanvas
      color: COLORS.person, 
      label: member.name || 'Musician',
      shape: 'box' 
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
            size: [1.8, 0.9, 1.5], // Matched StagePlotCanvas
            color: COLORS.drum, 
            label: 'Kit',
            shape: 'box'
        });
      }
      
      // --- AMPS (Guitar/Bass) ---
      else if (instId.includes('amp') || instId.includes('combined')) {
        const offset = ampCount % 2 === 0 ? -0.9 : 0.9;
        items.push({ 
            id: `amp-${instId}-${ampCount}`, 
            pos: [offset, 0, -0.6], // Behind and to side
            size: [0.7, 0.7, 0.4], // Matched StagePlotCanvas
            color: COLORS.amp, 
            label: 'Amp',
            shape: 'box'
        });
        ampCount++;
      }

      // --- KEYS / DJ ---
      else if (inst.type === InstrumentType.KEYS || inst.id === 'dj') {
        items.push({ 
            id: `keys-${instId}`, 
            pos: [0.7, 0, 0.4], // Front-Right
            size: [1.2, 0.9, 0.4], // Matched StagePlotCanvas
            color: COLORS.keys, 
            label: inst.group,
            shape: 'box'
        });
      }

      // --- MICS (Vocals or Horns on stand) ---
      else if (inst.type === InstrumentType.VOCAL || instId.includes('mic')) {
        // Mic Stand
        items.push({ 
            id: `mic-${instId}`, 
            pos: [0, 0, 0.6], // Directly in front
            size: [0.2, 1.5, 0.2], // Matched StagePlotCanvas logic (Pole args)
            color: COLORS.mic, 
            label: 'Mic',
            shape: 'pole'
        });
      }
      
      // --- INSTRUMENTS (Guitars/Bass Visuals) ---
      if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS) {
          const isRight = instrumentCount % 2 === 0;
          const sideOffset = isRight ? 0.6 : -0.6;
          
          // The Instrument
          items.push({
              id: `inst-body-${instId}`,
              pos: [sideOffset, 0, 0.1], // Y=0 because shape handles elevation
              size: [0.4, 1.0, 0.3], // Matched StagePlotCanvas
              color: COLORS.instrument,
              label: inst.type,
              shape: 'instrument'
          });
          
          // Pedalboard / Modeler
          if (instId.includes('modeler')) {
              items.push({
                  id: `modeler-${instId}`,
                  pos: [sideOffset, 0, 0.7],
                  size: [0.6, 0.1, 0.3],
                  color: COLORS.pedalboard,
                  label: 'Modeler',
                  shape: 'box'
              });
          } else if (inst.type === InstrumentType.GUITAR || inst.type === InstrumentType.BASS) {
               // Standard pedalboard for electric instruments
               if (inst.id !== 'gtr_ac') {
                   items.push({
                       id: `pedal-${instId}`,
                       pos: [sideOffset, 0, 0.7],
                       size: [0.6, 0.1, 0.3],
                       color: COLORS.pedalboard,
                       label: 'Pedals',
                       shape: 'box'
                   });
               }
          }

          // DI Box
          if (inst.defaultDi || instId.includes('di') || instId.includes('modeler')) {
              items.push({
                  id: `di-${instId}`,
                  pos: [sideOffset + (isRight ? 0.3 : -0.3), 0, 0.5],
                  size: [0.2, 0.1, 0.2],
                  color: COLORS.di,
                  label: 'DI',
                  shape: 'box'
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
            
            <Suspense fallback={null}>
                <group position={[0, -0.8, 0]}> {/* Center the scene vertically */}
                    {sceneItems.map((item, idx) => (
                        <PreviewItem 
                            key={idx}
                            position={item.pos}
                            args={item.size}
                            color={item.color}
                            label={item.label}
                            shape={item.shape}
                        />
                    ))}
                    
                    {/* Floor Grid for reference */}
                    <gridHelper args={[5, 5, 0x334155, 0x1e293b]} position={[0, 0.001, 0]} />
                    <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
                </group>
            </Suspense>

            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
    </div>
  );
};