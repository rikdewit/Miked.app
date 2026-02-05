import React, { useState, useRef } from 'react';
import { StageItem } from '../types';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, Grid, Html, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

// Extend JSX.IntrinsicElements to fix TypeScript errors related to R3F elements
// We augment both global JSX and React module JSX to handle different TS/React versions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      boxGeometry: any;
      cylinderGeometry: any;
      directionalLight: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      planeGeometry: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      boxGeometry: any;
      cylinderGeometry: any;
      directionalLight: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      planeGeometry: any;
    }
  }
}

interface StagePlotCanvasProps {
  items: StageItem[];
  setItems: (items: StageItem[]) => void;
  editable: boolean;
  viewMode?: 'isometric' | 'top';
  showAudienceLabel?: boolean;
}

// --- Constants ---
const STAGE_WIDTH = 7; // 7 meters wide
const STAGE_DEPTH = 4; // 4 meters deep

// --- Helpers to map Data (0-100%) to World ---
const percentToX = (p: number) => ((p / 100) * STAGE_WIDTH) - (STAGE_WIDTH / 2);
const percentToZ = (p: number) => ((p / 100) * STAGE_DEPTH) - (STAGE_DEPTH / 2);
const xToPercent = (w: number) => ((w + (STAGE_WIDTH / 2)) / STAGE_WIDTH) * 100;
const zToPercent = (w: number) => ((w + (STAGE_DEPTH / 2)) / STAGE_DEPTH) * 100;

// --- 3D Components ---

const StagePlatform = () => {
  const thickness = 0.2;
  const legHeight = 1.0;
  const legRadius = 0.1;
  const offsetX = STAGE_WIDTH / 2 - 0.2; 
  const offsetZ = STAGE_DEPTH / 2 - 0.2;

  return (
    <group position={[0, -thickness / 2, 0]}>
       {/* Main Slab */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[STAGE_WIDTH, thickness, STAGE_DEPTH]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} /> {/* Slate 300 - Light Gray Stage */}
      </mesh>
      
      {/* Side trim */}
      <mesh position={[0, 0, 0]}>
         <boxGeometry args={[STAGE_WIDTH + 0.05, thickness - 0.05, STAGE_DEPTH + 0.05]} />
         <meshStandardMaterial color="#94a3b8" /> {/* Slate 400 */}
      </mesh>

      {/* Legs */}
      <group position={[0, -thickness/2 - legHeight/2, 0]}>
          <mesh position={[offsetX, 0, offsetZ]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#64748b" /> {/* Slate 500 */}
          </mesh>
          <mesh position={[-offsetX, 0, offsetZ]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[offsetX, 0, -offsetZ]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[-offsetX, 0, -offsetZ]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Center support */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#64748b" />
          </mesh>
      </group>
    </group>
  );
};

interface DraggableItemProps {
  item: StageItem;
  activeId: string | null;
  onDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  activeId, 
  onDown 
}) => {
  const isPerson = item.type === 'person';
  const isMonitor = item.type === 'monitor';
  const isAmp = item.label.toLowerCase().includes('amp');
  const isDrum = item.label.toLowerCase().includes('kit') || item.label.toLowerCase().includes('drum');
  
  // Dimensions based on type
  let width = 0.4, height = 0.4, depth = 0.4;
  let color = '#ffffff';
  let yPos = height / 2;

  // Brighter colors for objects
  if (isPerson) {
    width = 0.4; depth = 0.4; height = 1.6;
    color = '#3b82f6'; // Bright Blue (Blue 500)
    yPos = height / 2;
  } else if (isAmp) {
    width = 0.6; depth = 0.4; height = 0.6;
    color = '#1e293b'; // Slate 800 (Amps stay dark)
    yPos = height / 2;
  } else if (isDrum) {
    width = 1.5; depth = 1.2; height = 0.8;
    color = '#ef4444'; // Bright Red (Red 500)
    yPos = height / 2;
  } else if (isMonitor) {
    width = 0.5; depth = 0.4; height = 0.3;
    color = '#111827'; // Near Black (Gray 900)
    yPos = height / 2;
  } else {
    // Generic Instrument
    width = 0.2; depth = 0.2; height = 0.8; // Stand-like
    color = '#8b5cf6'; // Bright Violet (Violet 500)
    yPos = height / 2;
  }

  const x = percentToX(item.x);
  const z = percentToZ(item.y);
  
  const isDragging = activeId === item.id;

  return (
    <group position={[x, 0, z]}>
      {/* Label - Darker text for contrast against light stage if low, but these float */}
      <Html position={[0, height + 0.2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-black text-slate-800 whitespace-nowrap select-none tracking-tight" style={{ textShadow: '0 0 2px white' }}>
          {item.label}
        </div>
      </Html>

      {/* The 3D Object */}
      <mesh 
        position={[0, yPos, 0]} 
        onPointerDown={(e) => onDown(e, item.id)}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={isDragging ? '#fbbf24' : color} // Amber when dragging
          roughness={0.4}
        />
      </mesh>
      
      {/* Monitor Wedge Shape tweak if monitor */}
      {isMonitor && (
         <mesh position={[0, yPos, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
             <boxGeometry args={[width, 0.05, 0.1]} />
             <meshStandardMaterial color="#374151" />
         </mesh>
      )}
    </group>
  );
};

export const StagePlotCanvas: React.FC<StagePlotCanvasProps> = ({ items, setItems, editable, viewMode = 'isometric', showAudienceLabel = true }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, id: string) => {
    if (!editable) return;
    e.stopPropagation();
    setActiveId(id);
    // @ts-ignore - target setPointerCapture is available on the canvas event source
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!editable) return;
    setActiveId(null);
    // @ts-ignore
    e.target.releasePointerCapture(e.pointerId);
  };

  const handlePlaneMove = (e: ThreeEvent<PointerEvent>) => {
    if (!activeId || !editable) return;
    e.stopPropagation();
    
    // Convert intersection point to percentages
    const newX = xToPercent(e.point.x);
    const newY = zToPercent(e.point.z);

    // Clamp values
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));

    setItems(items.map(item => 
      item.id === activeId 
        ? { ...item, x: clampedX, y: clampedY } 
        : item
    ));
  };

  // Determine Camera Settings
  const isTopView = viewMode === 'top';
  
  // Camera Logic:
  // Top View: [0, 50, 0] looking at 0,0,0.
  // Isometric/3D: [-20, 30, 20]. 
  //   -X moves camera Left. 
  //   +Z moves camera Front.
  //   +Y moves camera Up.
  //   This points the camera at the Front-Left corner of the stage.
  const camPosition: [number, number, number] = isTopView ? [0, 50, 0] : [-20, 30, 20];
  const camZoom = isTopView ? 50 : 50; 
  
  return (
    <div className="w-full aspect-video bg-white rounded-lg overflow-hidden border-2 border-slate-300 print:border-black shadow-inner">
      <Canvas 
        shadows 
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="w-full h-full"
      >
        <OrthographicCamera 
            key={viewMode}
            makeDefault 
            position={camPosition} 
            zoom={camZoom} 
            near={-50} 
            far={200}
            onUpdate={c => {
                c.lookAt(0, 0, 0);
                if (isTopView) {
                    // Top View: Audience (Front) is at bottom of screen
                    c.up.set(0, 0, -1); 
                } else {
                    // 3D View: Standard up
                    c.up.set(0, 1, 0);
                }
            }}
        />

        <ambientLight intensity={0.9} />
        <directionalLight 
          position={[-5, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />

        <group position={[0, 0, 0]}>
          
          <StagePlatform />

          {/* Floor Grid */}
          <Grid 
            position={[0, 0.01, 0]} 
            args={[STAGE_WIDTH, STAGE_DEPTH]} 
            cellSize={0.5} 
            cellThickness={0.6} 
            cellColor="#94a3b8" 
            sectionSize={1} 
            sectionThickness={1} 
            sectionColor="#64748b" 
            infiniteGrid={false}
            fadeDistance={25}
          />
          
          {/* Audience Label */}
          {showAudienceLabel && (
            <Text 
              position={[0, 0.05, STAGE_DEPTH / 2 + 1.2]} 
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
            >
              AUDIENCE
            </Text>
          )}

          {/* Invisible Plane for Dragging */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]} 
            onPointerMove={handlePlaneMove}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[STAGE_WIDTH * 2, STAGE_DEPTH * 2]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          {/* Shadows on stage floor */}
          <ContactShadows position={[0, 0.02, 0]} opacity={0.3} scale={15} blur={2.5} far={4} color="#000000" />
        </group>

        {/* Stage Objects */}
        {items.map((item) => (
          <DraggableItem 
            key={item.id} 
            item={item} 
            activeId={activeId} 
            onDown={handlePointerDown} 
          />
        ))}

      </Canvas>
    </div>
  );
};