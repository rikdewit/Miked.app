
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { clone as cloneGLTF } from 'three/examples/jsm/utils/SkeletonUtils';

const BASE_URL = 'https://raw.githubusercontent.com/rikdewit/Miked.app/production/public/assets/';

const URLS = {
  GUITAR_ELEC: BASE_URL + 'Electric_Guitar_Telecaster_Blue.glb',
  GUITAR_ACOUSTIC: BASE_URL + 'Acoustic_Guitar_Beige.glb',
  BASS: BASE_URL + 'Bass_Guitar_Firebird_Red.glb',
  AMPLIFIER: BASE_URL + 'Amplifier.glb',
  DRUMS: BASE_URL + 'Drums_A.glb',
  PERSON: BASE_URL + 'Male_Strong.glb',
  
  // Baked Animation Models
  MALE_ACOUSTIC: BASE_URL + 'Male_Ac_Guitar_Playing.glb',
  MALE_BASS: BASE_URL + 'Male_Bass_Playing.glb',
  MALE_DRUMS: BASE_URL + 'Male_Drumming.glb', 
  MALE_GUITAR: BASE_URL + 'Male_Guitar_Playing.glb',
  MALE_KEYS: BASE_URL + 'Male_Keys_Playing.glb',
  MALE_TRUMPET: BASE_URL + 'Male_Trumpet_Playing.glb',

  MIC_STAND: BASE_URL + 'Microfon_Stand_B.glb',
  SAX: BASE_URL + 'Saxophone.glb',
  TRUMPET: BASE_URL + 'Trumpet.glb',
  STAND: BASE_URL + 'Stand.glb',
  SYNTH: BASE_URL + 'Synth.glb',
};

// Preload models
Object.values(URLS).forEach(url => useGLTF.preload(url));

// --- CENTRALIZED OFFSETS ---
export const MODEL_OFFSETS = {
  DRUMS: [0, 0, 0] as [number, number, number],
  SAX: [0, 0, 0] as [number, number, number],
  TRUMPET: [0, 0, 0] as [number, number, number],
  SYNTH: [0, 0, 0] as [number, number, number],
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
             
             if (color && mesh.material) {
                 const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                 const newMaterials = materials.map(m => {
                     const nm = m.clone() as THREE.MeshStandardMaterial;
                     nm.color.set(color);
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

export const ElectricGuitarModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.GUITAR_ELEC, color);
  if (held) {
      // Held guitar is now part of the PersonModel 'guitar' pose
      return null;
  }
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const AcousticGuitarModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.GUITAR_ACOUSTIC, color);
  if (held) {
      // Held acoustic guitar is part of the PersonModel 'acoustic' pose
      return null;
  }
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const BassModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.BASS, color);
  if (held) {
      // Held bass is now part of the PersonModel 'bass' pose
      return null;
  }
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const AmpModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.AMPLIFIER, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DEFAULT} />;
};

export const DrumsModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.DRUMS, color);
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

export const SaxModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.SAX, color);
  if (held) {
      return (
        <primitive 
            object={model} 
            scale={1} 
            position={[0, 1.1, 0.25]} 
            rotation={[0, 0, 0]} 
        />
      );
  }
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.SAX} />;
};

export const TrumpetModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.TRUMPET, color);
  if (held) {
      // Held trumpet is now part of the PersonModel 'trumpet' pose
      return null;
  }
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.TRUMPET} />;
};

export const StandModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.STAND, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DEFAULT} />;
};

export type PersonPose = 'stand' | 'guitar' | 'bass' | 'acoustic' | 'drums' | 'keys' | 'trumpet';

export const PersonModel = ({ color, pose = 'stand' }: { color?: string, pose?: PersonPose }) => {
  let url = URLS.PERSON;
  
  if (pose === 'acoustic') url = URLS.MALE_ACOUSTIC;
  else if (pose === 'bass') url = URLS.MALE_BASS;
  else if (pose === 'guitar') url = URLS.MALE_GUITAR;
  else if (pose === 'drums') url = URLS.MALE_DRUMS;
  else if (pose === 'keys') url = URLS.MALE_KEYS;
  else if (pose === 'trumpet') url = URLS.MALE_TRUMPET;

  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const cloned = cloneGLTF(scene);
    
    cloned.traverse((node: any) => {
        if (node.isMesh) {
           const mesh = node as THREE.Mesh;
           mesh.castShadow = true;
           mesh.receiveShadow = true;
           
           if (color && mesh.material) {
               const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
               const newMaterials = materials.map(m => {
                   const nm = m.clone() as THREE.MeshStandardMaterial;
                   nm.color.set(color);
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

  return <primitive object={model} scale={1.1} position={MODEL_OFFSETS.DEFAULT} />;
};
