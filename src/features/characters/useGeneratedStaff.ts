'use client';
import {useEffect,useMemo} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {skinHumanoid} from './local-skinning.mjs';
import {TEAM} from './team';
const FEMALE=new Set(['sora','yuna','aria','lia','nari']);
const cache=new WeakMap<THREE.Object3D,ReturnType<typeof skinHumanoid>>();
export function useGeneratedStaff(id:string){
 const female=FEMALE.has(id),{scene}=useGLTF(`/models/modular-v2/staff-${female?'female':'male'}.glb`);
 const result=useMemo(()=>{let base=cache.get(scene);if(!base){base=skinHumanoid(scene,{height:female?1.78:1.85,id:'staff'});cache.set(scene,base)}const model=clone(base.model);const rig=Object.fromEntries(Object.keys(base.rig).map(k=>[k,model.getObjectByName('staff_'+k)!]));
  model.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const material=(o.material as THREE.MeshStandardMaterial).clone();const tint=new THREE.Color(TEAM.find(t=>t.id===id)?.color||'#547ca2');material.onBeforeCompile=s=>{s.uniforms.shirtTint={value:tint};s.vertexShader='varying float staffHeight;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstaffHeight=position.y;');s.fragmentShader='uniform vec3 shirtTint; varying float staffHeight;\n'+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\nif(staffHeight>${female?'.91':'.83'} && staffHeight<${female?'1.25':'1.31'} && ${female?'diffuseColor.r>diffuseColor.g*1.15':'diffuseColor.b>diffuseColor.r*1.13'}){float shade=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=shirtTint*clamp(shade*4.0,.25,1.5);}`)};material.customProgramCacheKey=()=>`staff-shirt-${id}`;o.material=material});
  return {model,rig}},[scene,female,id]);
 useEffect(()=>()=>result.model.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose()}),[result]);
 return result;
}
