import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { clone as cloneGLTF } from 'three/examples/jsm/utils/SkeletonUtils';

// Use the direct raw.githubusercontent.com link to avoid redirects and CORS issues
const GUITAR_URL = 'https://raw.githubusercontent.com/rikdewit/Miked.app/production/public/assets/Electric_Guitar_Telecaster_Red.glb';
const PERSON_URL = 'https://raw.githubusercontent.com/rikdewit/Miked.app/production/public/assets/Male_Strong.glb';

/**
 * Hook to load and correctly clone a GLTF model (including SkinnedMesh support).
 * This ensures characters (bones) are cloned deeply and don't freeze when moved.
 */
export const useStageModel = (url: string, color: string) => {
  const { scene } = useGLTF(url);
  
  const model = useMemo(() => {
      // Use SkeletonUtils.clone to ensure SkinnedMeshes (bones) are cloned correctly
      const cloned = cloneGLTF(scene);
      
      cloned.traverse((node: any) => {
          if (node.isMesh) {
             const mesh = node as THREE.Mesh;
             mesh.castShadow = true;
             mesh.receiveShadow = true;
             if (mesh.material) {
                 const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                 const newMaterials = materials.map(m => {
                     const nm = m.clone() as THREE.MeshStandardMaterial;
                     nm.color.set(color);
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

export const GuitarModel = ({ color }: { color: string }) => {
  const model = useStageModel(GUITAR_URL, color);
  return <primitive object={model} scale={1.5} rotation={[0, Math.PI / 2, 0]} position={[0, -0.5, 0]} />;
};

export const PersonModel = ({ color }: { color: string }) => {
  const model = useStageModel(PERSON_URL, color);
  return (
    <primitive 
      object={model}
      scale={0.9} 
      position={[0, 0, 0]} 
      rotation={[0, Math.PI, 0]}
    />
  );
};