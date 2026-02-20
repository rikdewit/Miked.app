import React, { useState, useRef, useEffect, Suspense } from 'react';
import { StageItem, BandMember } from '../types';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { OrthographicCamera, Grid, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { STAGE_WIDTH, STAGE_DEPTH, getItemConfig } from '../utils/stageConfig';
import { percentToX, percentToZ, xToPercent, zToPercent } from '../utils/stageHelpers';
import { StageDraggableItem } from './3d/StageDraggableItem';
import { MODEL_OFFSETS } from './3d/StageModels';
import { CAMERA_TOP_INTERACTIVE, CAMERA_TOP_PREVIEW, CAMERA_ISO_INTERACTIVE, CAMERA_ISO_PREVIEW, AUDIENCE_TEXT_FONT_SCALE_INTERACTIVE, AUDIENCE_TEXT_FONT_SCALE_PREVIEW } from '../constants';

// Component that captures canvas screenshot for preview mode
// Waits for actual rendering completion instead of using a fixed timeout
const ScreenshotCapture = ({ isPreview, containerRef, onScreenshot }: { isPreview: boolean; containerRef: React.RefObject<HTMLDivElement>; onScreenshot: (dataUrl: string) => void }) => {
  const frameCountRef = useRef(0);
  const hasCaptureedRef = useRef(false);
  const captureIdRef = useRef<string>(Math.random().toString(36).slice(2, 9));

  useEffect(() => {
    if (!isPreview || hasCaptureedRef.current) return;

    const captureId = captureIdRef.current;
    const container = containerRef.current;
    if (!container) {
      console.log(`[ScreenshotCapture ${captureId}] Container not found`);
      return;
    }

    console.log(`[ScreenshotCapture ${captureId}] Starting screenshot capture process`);

    // Find the canvas element inside the container
    const findCanvas = () => container.querySelector('canvas') as HTMLCanvasElement | null;

    let canvasFoundTime: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Wait for canvas to exist and render frames
    const checkAndCapture = () => {
      if (hasCaptureedRef.current) {
        console.log(`[ScreenshotCapture ${captureId}] Already captured during check, stopping`);
        return;
      }

      const canvas = findCanvas();
      if (!canvas) {
        if (frameCountRef.current % 30 === 0) {
          console.log(`[ScreenshotCapture ${captureId}] Waiting for canvas... (attempt ${Math.floor(frameCountRef.current / 30)})`);
        }
        frameCountRef.current++;
        requestAnimationFrame(checkAndCapture);
        return;
      }

      if (canvasFoundTime === null) {
        canvasFoundTime = performance.now();
        try {
          const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
          const dimensions = `${canvas.width}x${canvas.height}`;
          const hasContext = !!context;
          console.log(`[ScreenshotCapture ${captureId}] Canvas found! Dimensions: ${dimensions}, WebGL context: ${hasContext ? 'active' : 'missing'}`);
          if (context) {
            const pixels = new Uint8Array(4);
            context.readPixels(0, 0, 1, 1, context.RGBA, context.UNSIGNED_BYTE, pixels);
            console.log(`[ScreenshotCapture ${captureId}] Canvas pixel sample (RGBA): [${pixels[0]}, ${pixels[1]}, ${pixels[2]}, ${pixels[3]}]`);
          }
        } catch (e) {
          console.warn(`[ScreenshotCapture ${captureId}] Error checking canvas context:`, e);
        }
      }

      // Increment frame counter
      frameCountRef.current++;

      // After at least 30 frames (ensures THREE.js has rendered multiple times),
      // capture immediately - no waiting to prevent context loss
      if (frameCountRef.current >= 30) {
        console.log(`[ScreenshotCapture ${captureId}] Frames ready (${frameCountRef.current}), capturing immediately now`);
        // Capture in next macrotask to ensure render is flushed, but don't wait
        queueMicrotask(() => captureScreenshot());
      } else {
        if (frameCountRef.current % 10 === 0) {
          console.log(`[ScreenshotCapture ${captureId}] Frame ${frameCountRef.current}/30`);
        }
        requestAnimationFrame(checkAndCapture);
      }
    };

    const captureScreenshot = (retryCount = 0) => {
      if (hasCaptureedRef.current) {
        console.log(`[ScreenshotCapture ${captureId}] Already captured, skipping`);
        return;
      }

      if (!containerRef.current) {
        console.error(`[ScreenshotCapture ${captureId}] Container disappeared before capture!`);
        return;
      }

      // Check WebGL context health before capturing
      const canvas = containerRef.current.querySelector('canvas') as HTMLCanvasElement | null;
      if (canvas) {
        try {
          const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (!context) {
            console.warn(`[ScreenshotCapture ${captureId}] WebGL context not available, retrying... (attempt ${retryCount + 1})`);
            if (retryCount < 3) {
              // Retry after 200ms to allow context to recover
              setTimeout(() => captureScreenshot(retryCount + 1), 200);
              return;
            } else {
              console.error(`[ScreenshotCapture ${captureId}] WebGL context unavailable after ${retryCount} retries`);
            }
          } else {
            console.log(`[ScreenshotCapture ${captureId}] WebGL context confirmed before capture`);
          }
        } catch (e) {
          console.warn(`[ScreenshotCapture ${captureId}] Error checking WebGL context before capture:`, e);
        }
      }

      hasCaptureedRef.current = true;
      console.log(`[ScreenshotCapture ${captureId}] Starting html2canvas capture (attempt ${retryCount + 1})`);

      // Add CSS fix before capturing
      const style = document.createElement('style');
      style.textContent = `
        img { display: inline-block !important; }
        div { line-height: 1 !important; }
        * { line-height: 1 !important; }
      `;
      document.head.appendChild(style);

      import('html2canvas').then((html2canvas) => {
        console.log(`[ScreenshotCapture ${captureId}] html2canvas loaded, starting conversion`);
        const startTime = performance.now();

        html2canvas.default(containerRef.current!, {
          backgroundColor: '#f1f5f9',
          scale: 2,
          logging: false,
          useCORS: true,
          imageTimeout: 5000,
          allowTaint: true,
          removeContainer: true,
        }).then((canvas) => {
          const endTime = performance.now();
          const dataUrl = canvas.toDataURL('image/png');
          console.log(`[ScreenshotCapture ${captureId}] Screenshot captured successfully in ${(endTime - startTime).toFixed(2)}ms`, {
            imageDataLength: dataUrl.length,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
          });
          onScreenshot(dataUrl);
          // Clean up the style
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        }).catch((err) => {
          console.error(`[ScreenshotCapture ${captureId}] Screenshot capture failed:`, err);
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        });
      }).catch((err) => {
        console.error(`[ScreenshotCapture ${captureId}] Failed to import html2canvas:`, err);
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      });
    };

    // Start checking for canvas and frames
    console.log(`[ScreenshotCapture ${captureId}] Beginning frame check loop`);
    const raf = requestAnimationFrame(checkAndCapture);

    return () => {
      console.log(`[ScreenshotCapture ${captureId}] Cleanup: canceling animation frame and timeout (captured: ${hasCaptureedRef.current})`);
      cancelAnimationFrame(raf);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPreview, containerRef, onScreenshot]);

  return null;
};

// Component to handle responsive camera zoom and orientation
const ResponsiveCameraAdjuster = ({ isTopView, isPreview }: { isTopView: boolean; isPreview: boolean }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!camera) return;

    const orthoCamera = camera as THREE.OrthographicCamera;

    // Pick the right settings from constants
    const cfg = isTopView
      ? (isPreview ? CAMERA_TOP_PREVIEW : CAMERA_TOP_INTERACTIVE)
      : (isPreview ? CAMERA_ISO_PREVIEW : CAMERA_ISO_INTERACTIVE);

    // Set camera up vector FIRST (before lookAt)
    camera.up.set(...(isTopView ? [0, 0, -1] : [0, 1, 0]) as [number, number, number]);

    camera.position.set(...cfg.position);
    camera.lookAt(...cfg.lookAt);

    camera.updateMatrix();
    camera.updateMatrixWorld();

    // Zoom-to-fit: project stage bounding box corners at zoom=1, then scale to fill viewport.
    // This works for any camera angle or canvas size without hardcoded magic numbers.
    orthoCamera.zoom = 1;
    camera.updateProjectionMatrix();

    const h = cfg.modelHeight;
    const corners = [
      new THREE.Vector3(-STAGE_WIDTH / 2, 0, -STAGE_DEPTH / 2),
      new THREE.Vector3( STAGE_WIDTH / 2, 0, -STAGE_DEPTH / 2),
      new THREE.Vector3(-STAGE_WIDTH / 2, 0,  STAGE_DEPTH / 2),
      new THREE.Vector3( STAGE_WIDTH / 2, 0,  STAGE_DEPTH / 2),
      new THREE.Vector3(-STAGE_WIDTH / 2, h, -STAGE_DEPTH / 2),
      new THREE.Vector3( STAGE_WIDTH / 2, h, -STAGE_DEPTH / 2),
      new THREE.Vector3(-STAGE_WIDTH / 2, h,  STAGE_DEPTH / 2),
      new THREE.Vector3( STAGE_WIDTH / 2, h,  STAGE_DEPTH / 2),
    ];

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const corner of corners) {
      const ndc = corner.clone().project(camera);
      if (ndc.x < minX) minX = ndc.x;
      if (ndc.x > maxX) maxX = ndc.x;
      if (ndc.y < minY) minY = ndc.y;
      if (ndc.y > maxY) maxY = ndc.y;
    }

    // NDC range [-1,1] covers the full viewport. Zoom needed to fit the projected extent:
    const zoomX = 2 / ((maxX - minX) * (1 + cfg.padding));
    const zoomY = 2 / ((maxY - minY) * (1 + cfg.padding));
    orthoCamera.zoom = Math.min(zoomX, zoomY);
    camera.updateProjectionMatrix();
  }, [size, camera, isTopView, isPreview]);

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
  onScreenshot?: (dataUrl: string) => void;
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

let canvasInstanceCounter = 0;

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
  onRotateItem,
  onScreenshot: onScreenshotProp
}) => {
  const instanceIdRef = useRef<number>(++canvasInstanceCounter);
  const instanceId = instanceIdRef.current;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rotationUiItemId, setRotationUiItemId] = useState<string | null>(null);
  const [resizingItemId, setResizingItemId] = useState<string | null>(null);
  const resizingItemIdRef = useRef<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const contextListenersRef = useRef<Array<{ canvas: HTMLCanvasElement; listener: (e: Event) => void; event: string }>>([]);

  const handleScreenshot = (dataUrl: string) => {
    setScreenshotUrl(dataUrl);
    onScreenshotProp?.(dataUrl);
  };
  const dragOffset = useRef<{ x: number, z: number }>({ x: 0, z: 0 });

  // Track component mount/unmount
  useEffect(() => {
    console.log(`[StagePlotCanvas #${instanceId}] Component mounted`, { viewMode, isPreview });
    return () => {
      console.log(`[StagePlotCanvas #${instanceId}] Component unmounted`, { viewMode, isPreview });
    };
  }, [instanceId, viewMode, isPreview]);

  // Keep ref in sync so the DOM listener can read the current resizingItemId without stale closure
  useEffect(() => {
    resizingItemIdRef.current = resizingItemId;
  }, [resizingItemId]);

  // Cleanup event listeners when component unmounts
  // Note: Don't manually dispose the renderer as React Three Fiber manages its lifecycle
  useEffect(() => {
    return () => {
      // Remove all tracked event listeners
      contextListenersRef.current.forEach(({ canvas, listener, event }) => {
        try {
          canvas.removeEventListener(event, listener);
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      contextListenersRef.current = [];
      rendererRef.current = null;
    };
  }, []);

  // Stop resize on any native pointerdown in the canvas container (fires even when THREE.js
  // stopPropagation prevents the floor-plane mesh from receiving the event)
  useEffect(() => {
    if (!resizingItemId) return;
    const container = containerRef.current;
    if (!container) return;

    const handlePointerDown = () => {
      const prev = resizingItemIdRef.current;
      setResizingItemId(null);
      if (prev) setRotationUiItemId(prev);
    };

    // Delay by one frame so the "Resize" button's own pointerdown doesn't immediately cancel
    const raf = requestAnimationFrame(() => {
      container.addEventListener('pointerdown', handlePointerDown);
    });

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [resizingItemId]);
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

  const handleMonitorNumberChange = (id: string, monitorNumber: number) => {
    setItems(items.map(i =>
      i.id === id ? { ...i, monitorNumber } : i
    ));
  };

  const handleLabelChange = (id: string, label: string) => {
    setItems(items.map(i => i.id === id ? { ...i, label } : i));
  };

  const handleResizeStart = (id: string) => {
    setResizingItemId(id);
    setRotationUiItemId(null);
  };

  const handleHeightChange = (id: string, height: number) => {
    setItems(items.map(i => i.id === id ? { ...i, customHeight: Math.max(0.1, height) } : i));
  };

  const handleLabelHeightChange = (id: string, height: number) => {
    setItems(items.map(i => i.id === id ? { ...i, labelHeight: Math.max(0.1, height) } : i));
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, id: string) => {
    if (!editable) return;
    // While in resize mode, don't start a drag — the DOM listener handles stopping resize
    if (resizingItemId) return;
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
    if (!editable) return;

    if (resizingItemId) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const pointOnPlane = new THREE.Vector3();
      e.ray.intersectPlane(plane, pointOnPlane);
      const item = items.find(i => i.id === resizingItemId);
      if (item) {
        const itemWorldX = percentToX(item.x);
        const itemWorldZ = percentToZ(item.y);
        const newWidth = Math.max(0.3, Math.abs(pointOnPlane.x - itemWorldX) * 2);
        const newDepth = Math.max(0.3, Math.abs(pointOnPlane.z - itemWorldZ) * 2);
        setItems(items.map(i => i.id === resizingItemId
          ? { ...i, customWidth: newWidth, customDepth: newDepth } : i));
      }
      return;
    }

    if (!activeId) return;
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

  // Responsive font sizes for audience label
  const baseAudienceFontSize = 0.5; // Smaller for audience
  const audienceFontSize = baseAudienceFontSize * (isPreview ? AUDIENCE_TEXT_FONT_SCALE_PREVIEW : AUDIENCE_TEXT_FONT_SCALE_INTERACTIVE);

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
      style={{ touchAction: 'none', cursor: resizingItemId ? 'crosshair' : undefined }}
    >
      <Canvas
        shadows
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          failIfMajorPerformanceCaveat: false,
          powerPreference: 'high-performance',
          alpha: true,
          stencil: false,
          depth: true
        }}
        className="w-full h-full"
        onCreated={(state) => {
          const gl = state.gl;
          const containerElement = containerRef.current;
          const isOffscreen = containerElement?.style.left === '-9999px';

          // Store renderer for cleanup
          rendererRef.current = gl;

          console.log(`[StagePlotCanvas #${instanceId}] Canvas created`, {
            isPreview,
            isOffscreen,
            rendererType: gl.constructor.name,
            canvasSize: {
              width: gl.domElement.width,
              height: gl.domElement.height,
            },
            maxTextureSize: gl.capabilities.maxTextureSize,
            devicePixelRatio: window.devicePixelRatio,
          });

          // Create and store context loss handler with detailed debugging
          const handleContextLoss = (e: Event) => {
            const event = e as WebGLContextEvent;
            const perf = performance as any;
            console.warn(`[StagePlotCanvas #${instanceId}] WebGL Context Lost`, {
              preview: isPreview,
              offscreen: isOffscreen,
              statusMessage: event.statusMessage,
              timestamp: new Date().toISOString(),
              activeMemory: perf.memory ? {
                usedJSHeapSize: (perf.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
                jsHeapSizeLimit: (perf.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
              } : 'N/A (non-Chrome browser)',
              rendererInfo: {
                canvasSize: gl.domElement.width + 'x' + gl.domElement.height,
                pixelRatio: window.devicePixelRatio,
                maxTextureSize: gl.capabilities.maxTextureSize
              }
            });
            e.preventDefault();
          };

          // Create and store context restored handler
          const handleContextRestored = () => {
            console.debug(`[StagePlotCanvas #${instanceId}] WebGL Context Restored`, {
              preview: isPreview,
              timestamp: new Date().toISOString()
            });
          };

          // Add listeners and track them for cleanup
          gl.domElement.addEventListener('webglcontextlost', handleContextLoss);
          gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

          contextListenersRef.current.push(
            { canvas: gl.domElement, listener: handleContextLoss, event: 'webglcontextlost' },
            { canvas: gl.domElement, listener: handleContextRestored, event: 'webglcontextrestored' }
          );
        }}
      >
        <OrthographicCamera
            key={viewMode}
            makeDefault
            position={camPosition}
            zoom={1}
            near={-50}
            far={200}
        />

        <ResponsiveCameraAdjuster isTopView={isTopView} isPreview={isPreview} />

        <ambientLight intensity={.9} />
        <directionalLight
          position={[-10, 30, 20]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={0.01}
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
            onPointerDown={() => {
              if (resizingItemId !== null) {
                const prev = resizingItemId;
                setResizingItemId(null);
                setRotationUiItemId(prev);
                return;
              }
              setRotationUiItemId(null);
            }}
            onPointerMove={handlePlaneMove}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[STAGE_WIDTH * 3, STAGE_DEPTH * 3]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          <ContactShadows position={[0, 0.02, 0]} opacity={0.2} scale={20} blur={10} far={2} color="#000000" />
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
                onMonitorNumberChange={handleMonitorNumberChange}
                onLabelChange={handleLabelChange}
                onHeightChange={handleHeightChange}
                onLabelHeightChange={handleLabelHeightChange}
                onResizeStart={handleResizeStart}
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
          <ScreenshotCapture isPreview={isPreview} containerRef={containerRef} onScreenshot={handleScreenshot} />
        )}

      </Canvas>
    </div>
  );
};