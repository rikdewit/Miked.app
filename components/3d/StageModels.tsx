
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { clone as cloneGLTF } from 'three/examples/jsm/utils/SkeletonUtils';
import { malePose } from './male_pose';
import { bassBodyPose, bassPose } from './bass_pose';

const BASE_URL = 'https://raw.githubusercontent.com/rikdewit/Miked.app/production/public/assets/';

const URLS = {
  GUITAR_ELEC: BASE_URL + 'Electric_Guitar_Telecaster_Blue.glb',
  GUITAR_ACOUSTIC: BASE_URL + 'Acoustic_Guitar_Beige.glb',
  BASS: BASE_URL + 'Bass_Guitar_Firebird_Red.glb',
  AMPLIFIER: BASE_URL + 'Amplifier.glb',
  DRUMS: BASE_URL + 'Drums_A.glb',
  PERSON: BASE_URL + 'Male_Strong.glb',
  MALE_ACOUSTIC: BASE_URL + 'Male_Ac_Guitar_Playing.glb',
  MIC_STAND: BASE_URL + 'Microfon_Stand_B.glb',
  SAX: BASE_URL + 'Saxophone.glb',
  TRUMPET: BASE_URL + 'Trumpet.glb',
  STAND: BASE_URL + 'Stand.glb',
  SYNTH: BASE_URL + 'Synth.glb',
};

// Preload models to prevent pop-in
Object.values(URLS).forEach(url => useGLTF.preload(url));

// --- CENTRALIZED OFFSETS ---
export const MODEL_OFFSETS = {
  DRUMS: [0, 0, 1.75] as [number, number, number],
  SAX: [0, 0.4, 0] as [number, number, number],
  TRUMPET: [0, 0.5, 0] as [number, number, number],
  SYNTH: [-.1, 0.15, 0] as [number, number, number],
  DEFAULT: [0, 0, 0] as [number, number, number],
};

// --- COORDINATE CONVERSION HELPERS ---
// Unity (Left-Handed, Y-Up, Z-Forward) -> Three.js (Right-Handed, Y-Up, Z-Backward)

const convertPosition = (pos: number[]) => {
  // Flip X axis to fix 180-degree rotation and handedness
  // Preserving Z keeps facial features (eyes/brows) on the front of the face
  return new THREE.Vector3(-pos[0], pos[1], pos[2]);
};

const convertQuaternion = (rot: number[]) => {
  // Flip Y and Z components to match X-axis position flip
  return new THREE.Quaternion(rot[0], -rot[1], -rot[2], rot[3]);
};

// Recursive function to apply pose data to the skeleton
const applyPose = (boneData: any, bone: THREE.Object3D) => {
  if (!bone) return;

  // Apply transforms
  bone.position.copy(convertPosition(boneData.position));
  bone.quaternion.copy(convertQuaternion(boneData.rotation));
  bone.scale.set(boneData.scale[0], boneData.scale[1], boneData.scale[2]);

  // Recursively apply to children
  if (boneData.children && boneData.children.length > 0) {
    boneData.children.forEach((childData: any) => {

      const targetName = childData.name;
      const childBone = bone.children.find(b => b.name === targetName);
      
      if (childBone) {
        applyPose(childData, childBone);
      }
    });
  }
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

// HELPER FOR HELD TRANSFORMS (Reusing Bass logic for guitars)
const HELD_GUITAR_POS: [number, number, number] = [0, 0, 0];
const HELD_GUITAR_ROT: [number, number, number] = [0, 0, 0];

// Standardized helper to calculate world transform for held instruments
const getHeldTransform = (bodyPose: any, instrumentPose: any) => {
    // 1. Convert Hips Position
    const hipsPos = convertPosition(bodyPose.position);
    
    // 2. Convert Instrument Local Position (Relative to Hips)
    // We assume the offset is in the same space as the pose data
    const instLocalPos = convertPosition(instrumentPose.position);
    
    // 3. Add them up (Approximation, ignoring Hips rotation which is mostly identity in this pose)
    const finalPos = hipsPos.add(instLocalPos);
    
    // 4. Convert Rotation
    const finalRot = convertQuaternion(instrumentPose.rotation);
    
    // 5. Scale
    const finalScale = new THREE.Vector3(...instrumentPose.scale);
    
    return { position: finalPos, quaternion: finalRot, scale: finalScale };
};

export const ElectricGuitarModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.GUITAR_ELEC, color);
  if (held) {
      return (
        <primitive 
            object={model} 
            scale={1} 
            position={HELD_GUITAR_POS}
            rotation={HELD_GUITAR_ROT} 
        />
      );
  }
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const AcousticGuitarModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.GUITAR_ACOUSTIC, color);
  
  if (held) {
      // Held acoustic guitar is now part of the PersonModel 'acoustic' pose
      return null;
  }
  return <primitive object={model} scale={1} rotation={[0, Math.PI / 2, 0]} position={MODEL_OFFSETS.DEFAULT} />;
};

export const BassModel = ({ color, held }: { color?: string, held?: boolean }) => {
  const model = useStageModel(URLS.BASS, color);
  const transform = useMemo(() => getHeldTransform(bassBodyPose, bassPose), []);

  if (held) {
      return (
        <primitive 
            object={model} 
            scale={transform.scale} 
            position={transform.position} 
            quaternion={transform.quaternion} 
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
      return (
        <primitive 
            object={model} 
            scale={1} 
            position={[0, 1.45, 0.2]} 
            rotation={[0, 0, 0]} 
        />
      );
  }
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.TRUMPET} />;
};

export const StandModel = ({ color }: { color?: string }) => {
  const model = useStageModel(URLS.STAND, color);
  return <primitive object={model} scale={1} position={MODEL_OFFSETS.DEFAULT} />;
};

export const PersonModel = ({ color, pose = 'stand' }: { color?: string, pose?: 'stand' | 'guitar' | 'bass' | 'acoustic' }) => {
  // Use specific model for acoustic (baked), generic model for others (posed)
  const url = pose === 'acoustic' ? URLS.MALE_ACOUSTIC : URLS.PERSON;
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const cloned = cloneGLTF(scene);
    
    // Apply Color
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

    // Apply Pose if using generic model
    if (pose === 'guitar' || pose === 'bass') {
        let hips: THREE.Object3D | undefined;
        cloned.traverse((node: any) => {
            if (node.name === 'Hips') hips = node;
        });
        
        if (hips) {
            if (pose === 'bass') {
                applyPose(bassBodyPose, hips);
            } else {
                applyPose(malePose, hips);
            }
        }
    }
    // Note: 'acoustic' pose is baked into the model file, so no applyPose needed.

    return cloned;
  }, [scene, color, pose]);

  return <primitive object={model} scale={1.1} position={MODEL_OFFSETS.DEFAULT} />;
};
