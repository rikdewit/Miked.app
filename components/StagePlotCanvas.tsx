import React, { useState, useRef, useEffect, Suspense } from 'react';
import { StageItem, BandMember } from '../types';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { OrthographicCamera, Grid, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { STAGE_WIDTH, STAGE_DEPTH, getItemConfig } from '../utils/stageConfig';
import { percentToX, percentToZ, xToPercent, zToPercent } from '../utils/stageHelpers';
import { StageDraggableItem } from './3d/StageDraggableItem';
import { MODEL_OFFSETS } from './3d/StageModels';

interface StagePlotCanvasProps {
  items: StageItem[];
  setItems: (items: StageItem[]) => void;
  editable: boolean;
  viewMode?: 'isometric' | 'top';
  showAudienceLabel?: boolean;
  isPreview?: boolean;
  ghostItems?: StageItem[];
  dragCoords?: { x: number; y: number; width: number; height: number } | null;
  onDragPosChange?: (x: number, y: number) => void;
  members?: BandMember[];
}

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
        
        // Return raw 0-100 coords. 
        const clampedX = Math.max(0, Math.min(100, pctX));
        const clampedY = Math.max(0, Math.min(100, pctY));
        
        onUpdate(clampedX, clampedY);
    }
  }, [dragCoords, camera, raycaster, onUpdate]);

  return null;
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
  onDragPosChange,
  members
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
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!editable) return;
    setActiveId(null);
    dragOffset.current = { x: 0, z: 0 };
  };

  const handlePlaneMove = (e: ThreeEvent<PointerEvent>) => {
    if (!activeId || !editable) return;
    e.stopPropagation();
    
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointOnPlane = new THREE.Vector3();
    e.ray.intersectPlane(plane, pointOnPlane);

    const targetWorldX = pointOnPlane.x + dragOffset.current.x;
    const targetWorldZ = pointOnPlane.z + dragOffset.current.z;

    // Get item dimensions to enforce boundaries
    const item = items.find(i => i.id === activeId);
    if (item) {
        const config = getItemConfig(item);
        const halfWidth = config.width / 2;
        const halfDepth = config.depth / 2;

        // Determine visual offset (must match StageDraggableItem logic)
        let offset = [0, 0, 0];
        const labelLower = (item.label || '').toLowerCase();
        
        if (config.shape !== 'person') {
            if (labelLower.includes('drum') || labelLower.includes('kit')) {
                offset = MODEL_OFFSETS.DRUMS;
            } else if (labelLower.includes('sax')) {
                offset = MODEL_OFFSETS.SAX;
            } else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
                offset = MODEL_OFFSETS.TRUMPET;
            }
        }
        const [offX, _offY, offZ] = offset;

        // Boundaries (World Coordinates)
        // We adjust bounds by the offset so the VISUAL mesh stays inside stage.
        // minX = Left Edge + Half Width - X Offset
        // maxX = Right Edge - Half Width - X Offset
        
        const minX = -(STAGE_WIDTH / 2) + halfWidth - offX;
        const maxX = (STAGE_WIDTH / 2) - halfWidth - offX;
        const minZ = -(STAGE_DEPTH / 2) + halfDepth - offZ;
        const maxZ = (STAGE_DEPTH / 2) - halfDepth - offZ;

        // Clamp
        const clampedWorldX = Math.max(minX, Math.min(maxX, targetWorldX));
        const clampedWorldZ = Math.max(minZ, Math.min(maxZ, targetWorldZ));

        const newX = xToPercent(clampedWorldX);
        const newY = zToPercent(clampedWorldZ);

        setItems(items.map(i => 
            i.id === activeId 
                ? { ...i, x: newX, y: newY } 
                : i
        ));
    }
  };

  const isTopView = viewMode === 'top';
  const camPosition: [number, number, number] = isTopView ? [0, 50, 0] : [-20, 30, 20];
  
  // Use tighter zoom for preview to minimize whitespace and fit the stage
  const camZoom = isPreview 
    ? (isTopView ? 75 : 50) 
    : (isTopView ? 80 : 60);
  
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

        <Suspense fallback={null}>
            {items.map((item) => (
              <StageDraggableItem 
                key={item.id} 
                item={item} 
                activeId={activeId} 
                onDown={handlePointerDown}
                onMove={handlePlaneMove} 
                onUp={handlePointerUp}
                member={members?.find(m => m.id === item.memberId)}
              />
            ))}

            {ghostItems.map((item) => (
              <StageDraggableItem 
                key={item.id} 
                item={item} 
                activeId={null} 
                onDown={() => {}} 
                onMove={() => {}} 
                onUp={() => {}}
                isGhost={true}
                member={members?.find(m => m.id === item.memberId)}
              />
            ))}
        </Suspense>

        {/* Logic to sync external drag (sidebar) with 3D world */}
        {dragCoords && onDragPosChange && (
            <ExternalDragHandler dragCoords={dragCoords} onUpdate={onDragPosChange} />
        )}

      </Canvas>
    </div>
  );
};