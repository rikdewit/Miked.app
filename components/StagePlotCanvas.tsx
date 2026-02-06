import React, { useState, useRef, useEffect } from 'react';
import { StageItem } from '../types';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { OrthographicCamera, Grid, Html, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing R3F types in environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      cylinderGeometry: any;
      ambientLight: any;
      directionalLight: any;
      planeGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

interface StagePlotCanvasProps {
  items: StageItem[];
  setItems: (items: StageItem[]) => void;
  editable: boolean;
  viewMode?: 'isometric' | 'top';
  showAudienceLabel?: boolean;
  isPreview?: boolean;
  ghostItems?: StageItem[];
  // New props for external drag handling
  dragCoords?: { x: number; y: number; width: number; height: number } | null;
  onDragPosChange?: (x: number, y: number) => void;
}

// --- Constants ---
const STAGE_WIDTH = 8; // Wider stage for better spacing
const STAGE_DEPTH = 5; 

// --- Helpers to map Data (0-100%) to World ---
const percentToX = (p: number) => ((p / 100) * STAGE_WIDTH) - (STAGE_WIDTH / 2);
const percentToZ = (p: number) => ((p / 100) * STAGE_DEPTH) - (STAGE_DEPTH / 2);
const xToPercent = (w: number) => ((w + (STAGE_WIDTH / 2)) / STAGE_WIDTH) * 100;
const zToPercent = (w: number) => ((w + (STAGE_DEPTH / 2)) / STAGE_DEPTH) * 100;

// Reusing updated palette from MemberPreview3D
const COLORS = {
  person: '#3b82f6',     // Blue 500
  amp: '#1e293b',        // Slate 800
  drum: '#ef4444',       // Red 500
  keys: '#8b5cf6',       // Violet 500
  mic: '#94a3b8',        // Slate 400
  instrument: '#fbbf24', // Amber 400
  pedalboard: '#111827', // Gray 900
  di: '#f97316',         // Orange 500
  monitor: '#374151',    // Gray 700
  power: '#eab308'       // Yellow 500
};

// --- Config Helper ---
const getItemConfig = (item: StageItem) => {
  const isPerson = item.type === 'person';
  const isMonitor = item.type === 'monitor';
  const isPower = item.type === 'power';
  const label = (item.label || '').toLowerCase();

  // Specific Item Detection based on labels generated in StepStagePlot
  if (isPerson) {
    return { width: 0.5, depth: 0.5, height: 1.7, color: COLORS.person, shape: 'person' };
  } 
  
  if (isMonitor) {
    return { width: 0.6, depth: 0.4, height: 0.3, color: COLORS.monitor, shape: 'wedge' };
  }

  if (isPower) {
    return { width: 0.3, depth: 0.3, height: 0.3, color: COLORS.power, shape: 'box' };
  }

  // Instrument / Gear detection
  if (label.includes('amp')) {
    return { width: 0.7, depth: 0.4, height: 0.7, color: COLORS.amp, shape: 'box' };
  }
  if (label.includes('kit') || label.includes('drum')) {
    return { width: 1.8, depth: 1.5, height: 0.9, color: COLORS.drum, shape: 'box' };
  }
  if (label.includes('keys')) {
    return { width: 1.2, depth: 0.4, height: 0.9, color: COLORS.keys, shape: 'box' }; // Simplified key stand
  }
  if (label.includes('di')) {
    return { width: 0.2, depth: 0.2, height: 0.1, color: COLORS.di, shape: 'box' };
  }
  if (label.includes('pedal') || label.includes('modeler')) {
    return { width: 0.6, depth: 0.3, height: 0.1, color: COLORS.pedalboard, shape: 'box' };
  }
  if (label.includes('mic')) {
    return { width: 0.2, depth: 0.2, height: 1.5, color: COLORS.mic, shape: 'pole' };
  }
  if (label.includes('gtr') || label.includes('bass') || label.includes('sax') || label.includes('tpt')) {
     // Instrument on stand
     return { width: 0.4, depth: 0.3, height: 1.0, color: COLORS.instrument, shape: 'instrument' };
  }

  // Fallback
  return { width: 0.3, depth: 0.3, height: 0.3, color: '#cbd5e1', shape: 'box' };
};

// --- 3D Components ---

const StagePlatform = () => {
  const thickness = 0.2;
  return (
    <group position={[0, -thickness / 2, 0]}>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[STAGE_WIDTH, thickness, STAGE_DEPTH]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
    </group>
  );
};

// Component to handle External Drag Logic inside Canvas context
const ExternalDragHandler = ({ 
  dragCoords, 
  onUpdate 
}: { 
  dragCoords: { x: number; y: number; width: number; height: number };
  onUpdate: (x: number, y: number) => void;
}) => {
  const { camera, raycaster } = useThree();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const mouse = new THREE.Vector2();
  const intersectPoint = new THREE.Vector3();

  useEffect(() => {
    // Convert Pixel Coords to NDC (-1 to +1)
    mouse.x = (dragCoords.x / dragCoords.width) * 2 - 1;
    mouse.y = -(dragCoords.y / dragCoords.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // Raycast to the floor plane
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        const pctX = xToPercent(intersectPoint.x);
        const pctY = zToPercent(intersectPoint.z);
        
        // Clamp
        const clampedX = Math.max(2, Math.min(98, pctX));
        const clampedY = Math.max(2, Math.min(98, pctY));
        
        onUpdate(clampedX, clampedY);
    }
  }, [dragCoords, camera, raycaster, onUpdate]);

  return null;
};

interface DraggableItemProps {
  item: StageItem;
  activeId: string | null;
  onDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
  onMove: (e: ThreeEvent<PointerEvent>) => void;
  onUp: (e: ThreeEvent<PointerEvent>) => void;
  isGhost?: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  activeId, 
  onDown,
  onMove,
  onUp,
  isGhost = false
}) => {
  const { width, height, depth, color, shape } = getItemConfig(item);
  const yPos = height / 2;
  const x = percentToX(item.x);
  const z = percentToZ(item.y);
  const isDragging = activeId === item.id;
  
  const opacity = isGhost ? 0.6 : 1;
  const transparent = isGhost;
  const materialProps = { opacity, transparent, roughness: 0.4 };

  return (
    <group position={[x, 0, z]}>
      <Html position={[0, height + 0.3, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`text-[10px] font-black whitespace-nowrap select-none tracking-tight px-1 rounded backdrop-blur-sm border ${isGhost ? 'text-slate-700 bg-white/30 border-white/10' : 'text-slate-900 bg-white/50 border-white/20'}`}>
          {item.label}
        </div>
      </Html>

      <group
        onPointerDown={!isGhost ? (e) => onDown(e, item.id) : undefined}
        onPointerMove={!isGhost ? onMove : undefined}
        onPointerUp={!isGhost ? onUp : undefined}
      >
        {shape === 'wedge' ? (
             // Monitor Wedge shape
             <mesh position={[0, height/2, 0]} rotation={[Math.PI/6, 0, 0]} castShadow={!isGhost} receiveShadow>
                 <boxGeometry args={[width, height, depth]} />
                 <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
             </mesh>
        ) : shape === 'pole' ? (
             // Mic Stand
             <group>
                 <mesh position={[0, height/2, 0]} castShadow={!isGhost}>
                     <cylinderGeometry args={[0.02, 0.02, height]} />
                     <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
                 </mesh>
                 <mesh position={[0, 0.02, 0]}>
                     <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                     <meshStandardMaterial color="#475569" {...materialProps} />
                 </mesh>
             </group>
        ) : shape === 'instrument' ? (
             // Abstract Instrument Shape
             <group>
                 {/* Body */}
                 <mesh position={[0, height*0.4, 0]} castShadow={!isGhost}>
                     <boxGeometry args={[width, height*0.6, 0.1]} />
                     <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
                 </mesh>
                 {/* Neck */}
                 <mesh position={[0, height*0.8, 0]}>
                     <boxGeometry args={[width*0.2, height*0.4, 0.05]} />
                     <meshStandardMaterial color="#475569" {...materialProps} />
                 </mesh>
                 {/* Stand Base */}
                 <mesh position={[0, 0.05, 0]}>
                     <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                     <meshStandardMaterial color="#475569" {...materialProps} />
                 </mesh>
             </group>
        ) : (
             // Default Box / Person / Amp
             <mesh position={[0, yPos, 0]} castShadow={!isGhost} receiveShadow>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color={isDragging ? '#fbbf24' : color} {...materialProps} />
             </mesh>
        )}
      </group>
    </group>
  );
};

export const StagePlotCanvas: React.FC<StagePlotCanvasProps> = ({ 
  items, 
  setItems, 
  editable, 
  viewMode = 'isometric', 
  showAudienceLabel = true,
  isPreview = false,
  ghostItems = [],
  dragCoords,
  onDragPosChange
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number, z: number }>({ x: 0, z: 0 });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, id: string) => {
    if (!editable) return;
    e.stopPropagation();
    
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
    // @ts-ignore 
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
    
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointOnPlane = new THREE.Vector3();
    e.ray.intersectPlane(plane, pointOnPlane);

    const targetWorldX = pointOnPlane.x + dragOffset.current.x;
    const targetWorldZ = pointOnPlane.z + dragOffset.current.z;

    const newX = xToPercent(targetWorldX);
    const newY = zToPercent(targetWorldZ);

    const clampedX = Math.max(2, Math.min(98, newX));
    const clampedY = Math.max(2, Math.min(98, newY));

    setItems(items.map(item => 
      item.id === activeId 
        ? { ...item, x: clampedX, y: clampedY } 
        : item
    ));
  };

  const isTopView = viewMode === 'top';
  const camPosition: [number, number, number] = isTopView ? [0, 50, 0] : [-20, 30, 20];
  const camZoom = isPreview ? 40 : (isTopView ? 80 : 60); 
  
  return (
    <div className="w-full h-full bg-slate-50 overflow-hidden border-2 border-slate-300 print:border-black shadow-inner relative">
      <Canvas shadows gl={{ preserveDrawingBuffer: true, antialias: true }} className="w-full h-full">
        <OrthographicCamera 
            key={viewMode}
            makeDefault 
            position={camPosition} 
            zoom={camZoom} 
            near={-50} 
            far={200}
            onUpdate={c => {
                c.lookAt(0, 0, 0);
                if (isTopView) c.up.set(0, 0, -1); else c.up.set(0, 1, 0);
            }}
        />

        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[-10, 30, 20]} 
          intensity={0.9} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[10, 10, -10]} intensity={0.4} />

        <group position={[0, 0, 0]}>
          <StagePlatform />
          <Grid 
            position={[0, 0.01, 0]} 
            args={[STAGE_WIDTH, STAGE_DEPTH]} 
            cellSize={1} 
            cellThickness={0.6} 
            cellColor="#cbd5e1" 
            sectionSize={2} 
            sectionThickness={1} 
            sectionColor="#94a3b8" 
            infiniteGrid={false}
          />
          
          {showAudienceLabel && (
            <Text 
              position={[0, 0.05, STAGE_DEPTH / 2 + 0.8]} 
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.8}
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
            <planeGeometry args={[STAGE_WIDTH * 3, STAGE_DEPTH * 3]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          <ContactShadows position={[0, 0.02, 0]} opacity={0.4} scale={20} blur={3} far={2} color="#000000" />
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

        {ghostItems.map((item) => (
          <DraggableItem 
            key={item.id} 
            item={item} 
            activeId={null} 
            onDown={() => {}} 
            onMove={() => {}} 
            onUp={() => {}}
            isGhost={true}
          />
        ))}

        {/* Logic to sync external drag (sidebar) with 3D world */}
        {dragCoords && onDragPosChange && (
            <ExternalDragHandler dragCoords={dragCoords} onUpdate={onDragPosChange} />
        )}

      </Canvas>
    </div>
  );
};