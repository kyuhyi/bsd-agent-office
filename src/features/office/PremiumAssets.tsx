'use client';
import {useEffect,useMemo} from 'react';
import {useGLTF} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export const OFFICE_MODEL='/models/bsd-new-york.glb';
const control=/(?:_body|_head|_eyes|_arm[LR]|_forearm[LR]|_leg[LR]|_shin[LR])$/;

// 질감과 피벗을 보존하면서 같은 소재의 정적인 부품을 합쳐 그리기 호출을 줄인다.
function batchParts(source:THREE.Object3D,target:THREE.Group,ignoreControls=false){
 source.updateWorldMatrix(true,true);
 const inverse=new THREE.Matrix4().copy(source.matrixWorld).invert();
 const batches=new Map<string,{material:THREE.Material;geometries:THREE.BufferGeometry[];name:string}>();
 function visit(object:THREE.Object3D){
  if(object!==source&&ignoreControls&&control.test(object.name))return;
  if(object instanceof THREE.Mesh){
   const geometry=object.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,object.matrixWorld));
   for(const attr of Object.keys(geometry.attributes))if(!['position','normal','uv','color'].includes(attr))geometry.deleteAttribute(attr);
   if(!geometry.attributes.normal)geometry.computeVertexNormals();
   const materials=Array.isArray(object.material)?object.material:[object.material];
   if(materials.length===1){
    const signature=materials[0].uuid+Object.keys(geometry.attributes).sort().join(',');
    if(!batches.has(signature))batches.set(signature,{material:materials[0],geometries:[],name:object.name});
    batches.get(signature)!.geometries.push(geometry.index?geometry.toNonIndexed():geometry);
   }else{
    const mesh=new THREE.Mesh(geometry,materials);mesh.castShadow=true;mesh.receiveShadow=true;target.add(mesh);
   }
  }
  object.children.forEach(visit);
 }
 visit(source);
 for(const {material,geometries,name} of batches.values()){
  const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());
  if(!merged)throw new Error('3D 부품을 결합하지 못했습니다.');
  const mesh=new THREE.Mesh(merged,material);mesh.name=name;
  mesh.castShadow=!/Sky|glass|City/i.test(material.name);mesh.receiveShadow=!/Sky|glass|City/i.test(material.name);
  target.add(mesh);
 }
}

export function cloneCharacter(source:THREE.Object3D){
 source.updateWorldMatrix(true,true);
 const root=new THREE.Group();root.name=source.name;
 function copyPivot(input:THREE.Object3D,output:THREE.Group){
  batchParts(input,output,true);
  for(const child of input.children){
   if(control.test(child.name)){
    const pivot=new THREE.Group();pivot.name=child.name;pivot.position.copy(child.position);pivot.quaternion.copy(child.quaternion);pivot.scale.copy(child.scale);output.add(pivot);copyPivot(child,pivot);
   }
  }
 }
 copyPivot(source,root);return root;
}

export function usePremiumModel(){
 const gltf=useGLTF(OFFICE_MODEL);
 useMemo(()=>{
  const seen=new Set<THREE.Material>();
  gltf.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of [o.material].flat()){
   if(seen.has(m))continue;seen.add(m);
   if(m instanceof THREE.MeshStandardMaterial){
    if(m.map){m.map.anisotropy=8;if(/Oak|Walnut|Travertine|Boucle|Linen|jacket|rug/i.test(m.name)){m.bumpMap=m.map;m.bumpScale=/Boucle|jacket/.test(m.name)?.009:.006;}}
    if(/glass/i.test(m.name)){m.transparent=true;m.opacity=.13;m.depthWrite=false;if(m instanceof THREE.MeshPhysicalMaterial)m.transmission=0;}
    if(/Sky_gradient/.test(m.name)){m.side=THREE.DoubleSide;}
   }
  }});
 },[gltf.scene]);
 return gltf;
}

export function PremiumOffice({night,onReady}:{night:boolean;onReady:()=>void}){
 const gltf=usePremiumModel();
 const model=useMemo(()=>{
  const source=gltf.scene.clone(true);
  const discard:THREE.Object3D[]=[];
  source.traverse(o=>{if(o.name.startsWith('CHAR_')||o.name.startsWith('PROXY')||o.name.startsWith('PRP_brand')||o.name.startsWith('PRP_display_type')||o.name.startsWith('PRP_display_sub')||o.name.includes('Catalog')||o.name==='sofa_3seat'||o instanceof THREE.Light||o instanceof THREE.Camera)discard.push(o)});
  discard.forEach(o=>o.removeFromParent());
  const result=new THREE.Group();result.name='BSD_Atelier_Environment';batchParts(source,result);return result;
 },[gltf.scene]);
 useEffect(()=>{onReady();return()=>{model.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose()})}},[model,onReady]);
 useEffect(()=>{model.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const m=o.material as THREE.MeshStandardMaterial;if(/Sky_gradient/.test(m.name))m.emissiveIntensity=night?.25:.7;if(/Warm_LED|City_windows/.test(m.name))m.emissiveIntensity=night?2:1.3;});},[model,night]);
 return <primitive object={model}/>;
}

export function StudioEnvironment({night,daylight=night?0:1}:{night:boolean;daylight?:number}){
 const {gl,scene}=useThree();
 useEffect(()=>{
  const generator=new THREE.PMREMGenerator(gl),room=new RoomEnvironment();
  const target=generator.fromScene(room,.04);scene.environment=target.texture;room.dispose();generator.dispose();
  return()=>{scene.environment=null;target.dispose()};
 },[gl,scene]);
 useEffect(()=>{scene.environmentIntensity=.3+daylight*.1},[scene,daylight]);
 return null;
}
