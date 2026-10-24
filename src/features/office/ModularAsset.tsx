'use client';
import {useEffect,useMemo} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {createFurnitureMaterial,furnitureFinish} from './furniture-materials.mjs';
export function ModularAsset({url,height,width,position=[0,0,0],rotation=0,upholstery}:{url:string;height?:number;width?:number;position?:[number,number,number];rotation?:number;upholstery?:string}){
 const {scene}=useGLTF(url);
 const model=useMemo(()=>{const root=scene.clone(true);let box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());if(width&&size.z>size.x){root.rotation.y=-Math.PI/2;root.updateMatrixWorld(true);box=new THREE.Box3().setFromObject(root);size=box.getSize(new THREE.Vector3())}const center=box.getCenter(new THREE.Vector3()),scale=width?width/size.x:(height??1)/size.y;root.scale.setScalar(scale);root.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);root.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;let m=o.material as THREE.MeshStandardMaterial;if(m.map)m.map.anisotropy=8;
  const finish=furnitureFinish(url);if(finish)o.material=createFurnitureMaterial(m,finish,upholstery);
 }});return root},[scene,height,width,upholstery,url]);
 useEffect(()=>()=>{if(furnitureFinish(url))model.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose()})},[model,url]);
 return <group position={position} rotation={[0,rotation,0]}><primitive object={model}/></group>;
}
