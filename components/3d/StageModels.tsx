import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { clone as cloneGLTF } from 'three/examples/jsm/utils/SkeletonUtils';
import { malePose } from './male_pose';

const BASE_URL = 'https://raw.githubusercontent.com/rikdewit/Miked.app/production/public/assets/';

const URLS = {
  GUITAR_ELEC: BASE_URL + 'Electric_Guitar_Telecaster_Red.glb',
  GUITAR_ACOUSTIC: BASE_URL + 'Acoustic_Guitar_Beige.glb',
  BASS: BASE_URL + 'Bass_Guitar_White.glb',
  AMPLIFIER: BASE_URL + 'Amplifier.glb',
  DRUMS: BASE_URL + 'Drums_A.glb',
  PERSON: BASE_URL + 'Male_Strong.glb',
  MIC_STAND: BASE_URL + 'Microfon_Stand_B.glb',
  SAX: BASE_URL + 'Saxophone.glb',
  TRUMPET: BASE_URL + 'Trumpet.glb',
  STAND: BASE_URL + 'Stand.glb',
  SYNTH: BASE_URL + 'Synth.glb',
};

// Preload models to prevent pop-in
Object.values(URLS).forEach(url => useGLTF.preload(url));

// --- CENTRALIZED OFFSETS ---
// These define the shift relative to the center point (x, z) or floor (y)
// Used by StageDraggableItem to align Hitboxes and Labels
export const MODEL_OFFSETS = {
  DRUMS: [0, 0, 1.75] as [number, number, number],
  SAX: [0, 0.4, 0] as [number, number, number],
  TRUMPET: [0, 0.5, 0] as [number, number, number],
  SYNTH: [-.1, 0.15, 0] as [number, number, number],
  DEFAULT: [0, 0, 0] as [number, number, number],
};

export const useStageModel = (url: string, color?: string) => {
  const { scene } = useGLTF(url);
  
  const model = useMemo(() => {
      const cloned = cloneGLTF(scene);
      cloned.traverse((node: any) => {
          if (node.isMesh) {
             const mesh = node as THREE.Mesh;
             mesh.castShadow = true;
             mesh.receiveShadow = true;
             
             // Apply color override if provided (e.g. for selection/dragging highlight)
             if (color && mesh.material) {
                 const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                 const newMaterials = materials.map(m => {
                     const nm = m.clone() as THREE.MeshStandardMaterial;
                     nm.color.set(color);
                     // Reduce metalness/roughness for simple colored look
                     nm.metalness = 0.1;
                     nm.roughness = 0.6;
                     return nm;
                 });
                 mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];
             }
          }
      });
      return cloned;
  }, [scene, color]);

  return model;
};

export const ElectricGuitarModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.GUITAR_ELEC, color);
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const AcousticGuitarModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.GUITAR_ACOUSTIC, color);
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const BassModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.BASS, color);

  if (held) {
      return (
        <primitive 
            object={model} 
            scale={1.4} 
            // Positioned chest height, slightly left to center body mass, forward
            position={[.32, 1.3, 0.06]} 
            rotation={[
                THREE.MathUtils.degToRad(90), // X: 0 (No forward/back tilt)
                THREE.MathUtils.degToRad(-60), // Y: Face Audience 96.191
                THREE.MathUtils.degToRad(3) // Z: Diagonal Neck Angle
            ]} 
        />
      );
  }

  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const AmpModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.AMPLIFIER, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DEFAULT} />;
};

export const DrumsModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.DRUMS, color);
  // Rotate drums to face audience and apply centralized offset
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DRUMS} rotation={[0, 0, 0]} />;
};

export const SynthModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.SYNTH, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.SYNTH} rotation={[0, Math.PI, 0]} />;
};

export const MicStandModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.MIC_STAND, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DEFAULT} rotation={[0, Math.PI, 0]} />;
};

export const SaxModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.SAX, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.SAX} />;
};

export const TrumpetModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.TRUMPET, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.TRUMPET} />;
};

export const StandModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.STAND, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DEFAULT} />;
};

export const PersonModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.PERSON, color);

  useMemo(() => {
    // Flatten the pose data for easier lookup
    const poseMap = new Map<string, any>();
    const traversePose = (data: any) => {
        poseMap.set(data.name, data);
        if (data.children) data.children.forEach(traversePose);
    };
    traversePose(malePose);

    // Apply pose to the skeleton
    model.traverse((node: any) => {
      if (node.isBone) {
        const pose = poseMap.get(node.name);
        if (pose) {
            // Apply quaternion rotation from JSON [x, y, z, w]
            node.quaternion.set(
                pose.rotation[0],
                pose.rotation[1],
                pose.rotation[2],
                pose.rotation[3]
            );
            
            // Apply position from JSON [x, y, z]
            node.position.set(
                pose.position[0],
                pose.position[1],
                pose.position[2]
            );

            // Apply scale from JSON [x, y, z]
            node.scale.set(
                pose.scale[0],
                pose.scale[1],
                pose.scale[2]
            );
        }
      }
    });
  }, [model]);

  return <primitive object={model} scale={1.1} position={MODEL_OFFSETS.DEFAULT} />;
};