import React, { useState, useRef } from 'react';
import { StageItem } from '../types';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, Grid, Html, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

interface StagePlotCanvasProps {
  items: StageItem[];
  setItems: (items: StageItem[]) => void;
  editable: boolean;
  viewMode?: 'isometric' | 'top';
  showAudienceLabel?: boolean;
  isPreview?: boolean;
}

// --- Constants ---
const STAGE_WIDTH = 7; // 7 meters wide
const STAGE_DEPTH = 4; // 4 meters deep

// --- Helpers to map Data (0-100%) to World ---
const percentToX = (p: number) => ((p / 100) * STAGE_WIDTH) - (STAGE_WIDTH / 2);
const percentToZ = (p: number) => ((p / 100) * STAGE_DEPTH) - (STAGE_DEPTH / 2);
const xToPercent = (w: number) => ((w + (STAGE_WIDTH / 2)) / STAGE_WIDTH) * 100;
const zToPercent = (w: number) => ((w + (STAGE_DEPTH / 2)) / STAGE_DEPTH) * 100;

// --- Config Helper ---
const getItemConfig = (item: StageItem) => {
  const isPerson = item.type === 'person';
  const isMonitor = item.type === 'monitor';
  const label = item.label || '';
  const isAmp = label.toLowerCase().includes('amp');
  const isDrum = label.toLowerCase().includes('kit') || label.toLowerCase().includes('drum');

  if (isPerson) {
    return { width: 0.4, depth: 0.4, height: 1.6, color: '#3b82f6' }; // Blue 500
  } else if (isAmp) {
    return { width: 0.6, depth: 0.4, height: 0.6, color: '#1e293b' }; // Slate 800
  } else if (isDrum) {
    return { width: 1.5, depth: 1.2, height: 0.8, color: '#ef4444' }; // Red 500
  } else if (isMonitor) {
    return { width: 0.5, depth: 0.4, height: 0.3, color: '#111827' }; // Gray 900
  } else {
    // Generic Instrument
    return { width: 0.2, depth: 0.2, height: 0.8, color: '#8b5cf6' }; // Violet 500
  }
};

// --- 3D Components ---

const StagePlatform = () => {
  const thickness = 0.2;
  const legHeight = 1.0;
  const legRadius = 0.1;
  const offsetX = STAGE_WIDTH / 2 - 0.2; 
  const offsetZ = STAGE_DEPTH / 2 - 0.2;

  return (
    <group position={[0, -thickness / 2, 0]}>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[STAGE_WIDTH, thickness, STAGE_DEPTH]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
         <boxGeometry args={[STAGE_WIDTH + 0.05, thickness - 0.05, STAGE_DEPTH + 0.05]} />
         <meshStandardMaterial color="#94a3b8" />
      </mesh>

      <group position={[0, -thickness/2 - legHeight/2, 0]}>
          <mesh position={[offsetX, 0, offsetZ]} castShadow receiveShadow>
             <cylinderGeometry args={[legRadius, legRadius, legHeight]} />
             <meshStandardMaterial color="#64748b" />
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
  onMove: (e: ThreeEvent<PointerEvent>) => void;
  onUp: (e: ThreeEvent<PointerEvent>) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  activeId, 
  onDown,
  onMove,
  onUp
}) => {
  const { width, height, depth, color } = getItemConfig(item);
  const isMonitor = item.type === 'monitor';
  
  const yPos = height / 2;
  const x = percentToX(item.x);
  const z = percentToZ(item.y);
  
  const isDragging = activeId === item.id;

  return (
    <group position={[x, 0, z]}>
      <Html position={[0, height + 0.2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-[10px] font-black text-slate-800 whitespace-nowrap select-none tracking-tight" style={{ textShadow: '0 0 2px white' }}>
          {item.label}
        </div>
      </Html>

      <mesh 
        position={[0, yPos, 0]} 
        onPointerDown={(e) => onDown(e, item.id)}
        onPointerMove={onMove}
        onPointerUp={onUp}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={isDragging ? '#fbbf24' : color}
          roughness={0.4}
        />
      </mesh>
      
      {isMonitor && (
         <mesh position={[0, yPos, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
             <boxGeometry args={[width, 0.05, 0.1]} />
             <meshStandardMaterial color="#374151" />
         </mesh>
      )}
    </group>
  );
};

export const StagePlotCanvas: React.FC<StagePlotCanvasProps> = ({ 
  items, 
  setItems, 
  editable, 
  viewMode = 'isometric', 
  showAudienceLabel = true,
  isPreview = false
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number, z: number }>({ x: 0, z: 0 });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, id: string) => {
    if (!editable) return;
    e.stopPropagation();
    
    // Calculate intersection with the drag plane (y=0) to ensure smooth dragging without jumps.
    // We project the click ray onto the y=0 plane because movement happens on this plane.
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointOnPlane = new THREE.Vector3();
    e.ray.intersectPlane(plane, pointOnPlane);
    
    const item = items.find(i => i.id === id);
    if (item) {
        const currentX = percentToX(item.x);
        const currentZ = percentToZ(item.y);
        dragOffset.current = {
            x: currentX - pointOnPlane.x,
            z: currentZ - pointOnPlane.z
        };
    }

    setActiveId(id);
    // @ts-ignore - target setPointerCapture is available on the canvas event source
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!editable) return;
    setActiveId(null);
    dragOffset.current = { x: 0, z: 0 };
    // @ts-ignore
    e.target.releasePointerCapture(e.pointerId);
  };

  const handlePlaneMove = (e: ThreeEvent<PointerEvent>) => {
    if (!activeId || !editable) return;
    e.stopPropagation();
    
    const activeItem = items.find(i => i.id === activeId);
    if (!activeItem) return;

    // IMPORTANT: Ignore e.point (which hits whatever object is under cursor)
    // Always project the ray to the floor plane (y=0) to ensure 1:1 movement stability
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointOnPlane = new THREE.Vector3();
    e.ray.intersectPlane(plane, pointOnPlane);

    // Get dimensions of the active item
    const { width, depth } = getItemConfig(activeItem);

    // Calculate margins in percentage terms to prevent overhang
    const marginX = ((width / 2) / STAGE_WIDTH) * 100;
    const marginY = ((depth / 2) / STAGE_DEPTH) * 100;

    // Apply offset to get target world position
    const targetWorldX = pointOnPlane.x + dragOffset.current.x;
    const targetWorldZ = pointOnPlane.z + dragOffset.current.z;

    // Convert target world position to percentages
    const newX = xToPercent(targetWorldX);
    const newY = zToPercent(targetWorldZ);

    // Clamp values with margins
    const clampedX = Math.max(marginX, Math.min(100 - marginX, newX));
    const clampedY = Math.max(marginY, Math.min(100 - marginY, newY));

    setItems(items.map(item => 
      item.id === activeId 
        ? { ...item, x: clampedX, y: clampedY } 
        : item
    ));
  };

  const isTopView = viewMode === 'top';
  
  // Camera Logic
  const camPosition: [number, number, number] = isTopView ? [0, 50, 0] : [-20, 30, 20];
  
  // Use zoomed in view for editor (90/80), but keep old zoom (50/50) for preview/PDF
  const camZoom = isPreview 
    ? 50 
    : (isTopView ? 90 : 80); 
  
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
                    c.up.set(0, 0, -1); 
                } else {
                    c.up.set(0, 1, 0);
                }
            }}
        />

        {/* --- Diffuse Lighting Setup --- */}
        
        {/* 1. Base Ambient Light: Reduced to allow Hemisphere to take over for atmosphere */}
        <ambientLight intensity={0.5} />
        
        {/* 2. Hemisphere Light: Simulates sky/ground reflection for "diffuse" feel */}
        <hemisphereLight 
          color="#ffffff" 
          groundColor="#cbd5e1" 
          intensity={0.6} 
        />

        {/* 3. Main Key Light (Casts Shadows): Positioned away from camera as requested */}
        <directionalLight 
          position={[-15, 40, 25]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* 4. Fill Light (No Shadows): Softens the dark side of objects */}
        <directionalLight 
          position={[15, 20, -15]} 
          intensity={0.4} 
          castShadow={false} 
        />

        <group position={[0, 0, 0]}>
          
          <StagePlatform />

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

          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0, 0]} 
            onPointerMove={handlePlaneMove}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[STAGE_WIDTH * 2, STAGE_DEPTH * 2]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          <ContactShadows position={[0, 0.02, 0]} opacity={0.4} scale={20} blur={4} far={4} color="#000000" />
        </group>

        {items.map((item) => (
          <DraggableItem 
            key={item.id} 
            item={item} 
            activeId={activeId} 
            onDown={handlePointerDown}
            onMove={handlePlaneMove} 
            onUp={handlePointerUp}
          />
        ))}

      </Canvas>
    </div>
  );
};