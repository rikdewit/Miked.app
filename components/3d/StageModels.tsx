import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { clone as cloneGLTF } from 'three/examples/jsm/utils/SkeletonUtils';

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
  return <primitive object={model} scale={1.5} rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]} />;
};

export const AcousticGuitarModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.GUITAR_ACOUSTIC, color);
  return <primitive object={model} scale={1.4} rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]} />;
};

export const BassModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.BASS, color);
  return <primitive object={model} scale={1.5} rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]} />;
};

export const AmpModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.AMPLIFIER, color);
  return <primitive object={model} scale={1.2} position={[0, 0, 0]} />;
};

export const DrumsModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.DRUMS, color);
  // Rotate drums to face audience (assuming default model faces wrong way or needs adjustment)
  return <primitive object={model} scale={1.1} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />;
};

export const SynthModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.SYNTH, color);
  return <primitive object={model} scale={1.2} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />;
};

export const MicStandModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.MIC_STAND, color);
  return <primitive object={model} scale={1.3} position={[0, 0, 0]} />;
};

export const SaxModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.SAX, color);
  return <primitive object={model} scale={1.5} position={[0, 0.4, 0]} />;
};

export const TrumpetModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.TRUMPET, color);
  return <primitive object={model} scale={1.5} position={[0, 0.5, 0]} />;
};

export const StandModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.STAND, color);
  return <primitive object={model} scale={1.2} position={[0, 0, 0]} />;
};

export const PersonModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.PERSON, color);
  return <primitive object={model} scale={0.9} position={[0, 0, 0]} />;
};
