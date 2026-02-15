import React, { useState, useRef, useEffect, Suspense } from 'react';
import { StageItem, BandMember } from '../types';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { OrthographicCamera, Grid, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { STAGE_WIDTH, STAGE_DEPTH, getItemConfig } from '../utils/stageConfig';
import { percentToX, percentToZ, xToPercent, zToPercent } from '../utils/stageHelpers';
import { StageDraggableItem } from './3d/StageDraggableItem';
import { MODEL_OFFSETS } from './3d/StageModels';

// Component that captures canvas screenshot for preview mode with fixed camera
const ScreenshotCapture = ({ isPreview, isTopView, baseCamZoom, containerRef, onScreenshot }: { isPreview: boolean; isTopView: boolean; baseCamZoom: number; containerRef: React.RefObject<HTMLDivElement>; onScreenshot: (dataUrl: string) => void }) => {
  const { gl, camera } = useThree();

  useEffect(() => {
    if (!isPreview || !camera) return;

    // Set fixed camera settings for consistent screenshot
    if (isTopView) {
      camera.up.set(0, 0, -1);
    } else {
      camera.up.set(0, 1, 0);
    }

    // Use fixed camera position
    camera.position.set(isTopView ? 0 : -20, isTopView ? 50 : 30, isTopView ? 0 : 20);
    camera.lookAt(0, 0, 0);

    camera.updateMatrix();
    camera.updateMatrixWorld();

    // Use fixed zoom value
    (camera as THREE.OrthographicCamera).zoom = baseCamZoom;
    camera.updateProjectionMatrix();

    // Wait for render with fixed camera, then capture container including Html labels
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Use html2canvas to capture the entire container including Html labels
        import('html2canvas').then((html2canvas) => {
          html2canvas.default(containerRef.current!, {
            backgroundColor: '#f1f5f9',
            scale: 2,
            logging: false,
          }).then((canvas) => {
            const dataUrl = canvas.toDataURL('image/png');
            onScreenshot(dataUrl);
          });
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [gl, camera, isPreview, isTopView, baseCamZoom, containerRef, onScreenshot]);

  return null;
};

// Component to handle responsive camera zoom and orientation
const ResponsiveCameraAdjuster = ({ isTopView, isPreview, baseCamZoom }: { isTopView: boolean; isPreview: boolean; baseCamZoom: number }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!camera) return;

    // Set camera up vector FIRST (before lookAt)
    if (isTopView) {
      camera.up.set(0, 0, -1);
    } else {
      camera.up.set(0, 1, 0);
    }

    // Set position and look at
    // Preview uses different position than interactive mode
    if (isPreview) {
      camera.position.set(isTopView ? 0 : -20, isTopView ? 50 : 30, isTopView ? 0 : 20);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(isTopView ? 0 : -20, isTopView ? 70 : 30, isTopView ? -1 : 20);
      camera.lookAt(0, isTopView ? -30 : 0, isTopView ? 1 : 0);
    }

    // Update matrices before changing zoom
    camera.updateMatrix();
    camera.updateMatrixWorld();

    // Calculate zoom with consistent padding for both modes
    const canvasAspect = size.width / size.height;
    const frustumSize = 580; // (far - near)

    if (isTopView) {
      // Calculate zoom so stage fits with consistent padding
      // Both preview and interactive use same padding for consistent framing
      const SIDE_PADDING = 0.02; // minimal side padding
      const TOP_PADDING = 0.2; // 20% top padding
      const stagePaddedWidth = STAGE_WIDTH * (1 + SIDE_PADDING);
      const stagePaddedHeight = STAGE_DEPTH * (1 + TOP_PADDING);

      // Calculate zoom needed to fit stage in both dimensions
      const zoomForHeight = frustumSize / stagePaddedHeight;
      const zoomForWidth = (frustumSize * canvasAspect) / stagePaddedWidth;

      // Use the smaller zoom to ensure the stage fits in both dimensions
      const adjustedZoom = Math.min(zoomForHeight, zoomForWidth);

      (camera as THREE.OrthographicCamera).zoom = adjustedZoom;
    } else {
      // For isometric view, use responsive zoom based on canvas size in preview mode
      if (isPreview) {
        // Calculate zoom similar to top view but with different padding for isometric
        const SIDE_PADDING = 0.1; // 10% on sides
        const TOP_BOTTOM_PADDING = 0.15; // 15% on top/bottom (less than interactive)
        const stagePaddedWidth = STAGE_WIDTH * (1 + SIDE_PADDING);
        const stagePaddedHeight = STAGE_DEPTH * (1 + TOP_BOTTOM_PADDING);

        const zoomForHeight = frustumSize / stagePaddedHeight;
        const zoomForWidth = (frustumSize * canvasAspect) / stagePaddedWidth;

        const adjustedZoom = Math.min(zoomForHeight, zoomForWidth);
        (camera as THREE.OrthographicCamera).zoom = adjustedZoom;
      } else {
        (camera as THREE.OrthographicCamera).zoom = baseCamZoom;
      }
    }

    camera.updateProjectionMatrix();
  }, [size, camera, isTopView, baseCamZoom, isPreview]);

  return null;
};

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
  rotatingItemId?: string | null;
  onRotateItem?: (itemId: string, direction: 'left' | 'right') => void;
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
  members,
  rotatingItemId,
  onRotateItem
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rotationUiItemId, setRotationUiItemId] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number, z: number }>({ x: 0, z: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    setRotationUiItemId(null);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems(items.map(i =>
      i.id === id ? { ...i, quantity } : i
    ));
  };

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
  const camPosition: [number, number, number] = isTopView ? [0, 70, -1] : [-20, 30, 20];
  
  // Use appropriate zoom for preview to fit the stage properly
  // Top view needs higher zoom to fill viewport, 3D view slightly zoomed out
  const camZoom = isPreview
    ? (isTopView ? 60 : 45)
    : (isTopView ? 60 : 60);

  // Responsive font sizes for stage and audience labels
  const stageFontSize = isPreview ? 0.6 : 1.2;
  const audienceFontSize = 0.5; // Smaller for audience

  // For preview with screenshot, show static image instead of threejs canvas
  if (isPreview && screenshotUrl) {
    return (
      <div
        className="w-full h-full bg-slate-50 overflow-hidden border-2 border-slate-300 print:border-black shadow-inner relative select-none"
        style={{ touchAction: 'none' }}
      >
        <img
          src={screenshotUrl}
          alt="Stage plot"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-50 overflow-hidden border-2 border-slate-300 print:border-black shadow-inner relative select-none"
      style={{ touchAction: 'none' }}
    >
      <Canvas shadows gl={{ preserveDrawingBuffer: true, antialias: true }} className="w-full h-full">
        <OrthographicCamera
            key={viewMode}
            makeDefault
            position={camPosition}
            zoom={camZoom}
            near={-50}
            far={200}
        />

        <ResponsiveCameraAdjuster isTopView={isTopView} isPreview={isPreview} baseCamZoom={camZoom} />

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
              position={[0, 0.05, STAGE_DEPTH / 2 + 0.3]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={audienceFontSize}
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
            onPointerDown={() => setRotationUiItemId(null)}
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
                isRotating={rotatingItemId === item.id}
                showRotationUI={rotationUiItemId === item.id}
                onRequestRotationUI={() => setRotationUiItemId(item.id)}
                onCloseRotationUI={() => setRotationUiItemId(null)}
                onRotate={onRotateItem}
                onDelete={handleDeleteItem}
                onQuantityChange={handleQuantityChange}
                isEditable={editable}
                viewMode={viewMode}
                isPreview={isPreview}
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
                isPreview={isPreview}
              />
            ))}
        </Suspense>

        {/* Logic to sync external drag (sidebar) with 3D world */}
        {dragCoords && onDragPosChange && (
            <ExternalDragHandler dragCoords={dragCoords} onUpdate={onDragPosChange} />
        )}

        {/* Capture screenshot for preview mode with fixed camera */}
        {isPreview && (
          <ScreenshotCapture isPreview={isPreview} isTopView={isTopView} baseCamZoom={camZoom} containerRef={containerRef} onScreenshot={setScreenshotUrl} />
        )}

      </Canvas>
    </div>
  );
};