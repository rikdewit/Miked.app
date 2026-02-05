import React, { useState, useRef } from 'react';
import { StageItem } from '../types';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, Grid, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface StagePlotCanvasProps {
  items: StageItem[];
  setItems: (items: StageItem[]) => void;
  editable: boolean;
}

// --- Constants ---
const STAGE_SIZE = 8; // 8 meters
const GRID_DIVISIONS = 16; // 0.5 meter grid for 8m

// --- Helpers to map Data (0-100%) to World (-4 to 4) ---
const percentToWorld = (p: number) => ((p / 100) * STAGE_SIZE) - (STAGE_SIZE / 2);
const worldToPercent = (w: number) => ((w + (STAGE_SIZE / 2)) / STAGE_SIZE) * 100;

// --- 3D Components ---

const StagePlatform = () => {
  const thickness = 0.2;
  const legHeight = 1.0;
  const legRadius = 0.1;
  const offset = STAGE_SIZE / 2 - 0.2; // Inset legs slightly

  return (
    <group position={[0, -thickness / 2, 0]}>
       {/* Main Slab */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[STAGE_SIZE, thickness, STAGE_SIZE]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} /> {/* Slate 800 - Stage floor color */}
      </mesh>
      
      {/* Side trim (optional, to make it look constructed) */}
      <mesh position={[0, 0, 0]}>
         <boxGeometry args={[STAGE_SIZE + 0.05, thickness - 0.05, STAGE_SIZE + 0.05]} />
         <meshStandardMaterial color="#0f172a" /> {/* Darker Slate 900 for edges */}
      </mesh>

      {/* Legs */}
      <group position={[0, -thickness/2 - legHeight/2, 0]}>
          <mesh position={[offset, 0, offset]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#475569" /> {/* Metal/Slate 600 */}
          </mesh>
          <mesh position={[-offset, 0, offset]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[offset, 0, -offset]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[-offset, 0, -offset]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Center support */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#475569" />
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

  if (isPerson) {
    width = 0.4; depth = 0.4; height = 1.6;
    color = '#4f46e5'; // Indigo
    yPos = height / 2;
  } else if (isAmp) {
    width = 0.6; depth = 0.4; height = 0.6;
    color = '#1e293b'; // Slate 800
    yPos = height / 2;
  } else if (isDrum) {
    width = 1.5; depth = 1.2; height = 0.8;
    color = '#7f1d1d'; // Red 900
    yPos = height / 2;
  } else if (isMonitor) {
    width = 0.5; depth = 0.4; height = 0.3;
    color = '#334155'; // Slate 700
    yPos = height / 2;
  } else {
    // Generic Instrument
    width = 0.2; depth = 0.2; height = 0.8; // Stand-like
    color = '#94a3b8'; // Slate 400
    yPos = height / 2;
  }

  const x = percentToWorld(item.x);
  const z = percentToWorld(item.y);
  
  const isDragging = activeId === item.id;

  return (
    <group position={[x, 0, z]}>
      {/* Label */}
      <Html position={[0, height + 0.2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-[8px] font-bold text-white whitespace-nowrap select-none tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
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
          color={isDragging ? '#ef4444' : color} 
          roughness={0.6}
        />
      </mesh>
      
      {/* Monitor Wedge Shape tweak if monitor */}
      {isMonitor && (
         <mesh position={[0, yPos, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
             <boxGeometry args={[width, 0.05, 0.1]} />
             <meshStandardMaterial color="#000" />
         </mesh>
      )}
    </group>
  );
};

export const StagePlotCanvas: React.FC<StagePlotCanvasProps> = ({ items, setItems, editable }) => {
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
    const newX = worldToPercent(e.point.x);
    const newY = worldToPercent(e.point.z);

    // Clamp values
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));

    setItems(items.map(item => 
      item.id === activeId 
        ? { ...item, x: clampedX, y: clampedY } 
        : item
    ));
  };

  return (
    <div className="w-full aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300 print:border-black shadow-inner">
      <Canvas 
        shadows 
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="w-full h-full"
      >
        {/* Camera: Isometric view - Zoom adjusted for larger stage */}
        <OrthographicCamera 
            makeDefault 
            position={[20, 20, 20]} 
            zoom={60} 
            near={-50} 
            far={200}
            onUpdate={c => c.lookAt(0, 0, 0)}
        />

        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />

        <group position={[0, 0, 0]}>
          
          <StagePlatform />

          {/* Floor Grid - Lift slightly above platform surface */}
          <Grid 
            position={[0, 0.01, 0]} 
            args={[STAGE_SIZE, STAGE_SIZE]} 
            cellSize={0.5} 
            cellThickness={0.6} 
            cellColor="#cbd5e1" 
            sectionSize={1} 
            sectionThickness={1} 
            sectionColor="#94a3b8" 
            infiniteGrid={false}
            fadeDistance={25}
          />
          
          {/* Invisible Plane for Dragging */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]} 
            onPointerMove={handlePlaneMove}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[STAGE_SIZE * 2, STAGE_SIZE * 2]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          {/* Shadows on stage floor */}
          <ContactShadows position={[0, 0.02, 0]} opacity={0.4} scale={15} blur={2} far={4} color="#000000" />
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