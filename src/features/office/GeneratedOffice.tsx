'use client';
import {useEffect,useMemo} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {CHAIR_SEATS} from './ModularChairs';
import {BENCHES} from './scene-layout.mjs';
export const GENERATED_OFFICE_MODEL='/models/bsd-gpt-tripo-v1.glb';
// 생성 원본을 보존하고, 좌석·이동 경로가 사용하는 미터 단위로 변환한다.
export function GeneratedOffice({onReady}:{onReady:()=>void}){
 const {scene}=useGLTF(GENERATED_OFFICE_MODEL);
 const room=useMemo(()=>{const copy=scene.clone(true);copy.traverse(o=>{if(o instanceof THREE.Mesh){o.material=o.material.clone();const m=o.material as THREE.MeshStandardMaterial;if(m.map)m.map.anisotropy=8;m.envMapIntensity=.3;
 // 가구와 러그의 원래 텍스처는 유지하고 바닥 표면만 차콜 월넛으로 보정한다.
 m.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 officeLocalPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nofficeLocalPosition = position;');
  shader.fragmentShader='varying vec3 officeLocalPosition;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat floorMask = 1.0 - smoothstep(-0.072, -0.0705, officeLocalPosition.y);\nfloat grain = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));\nvec3 walnut = mix(diffuseColor.rgb, vec3(grain), 0.65) * vec3(0.43, 0.46, 0.51);\ndiffuseColor.rgb = mix(diffuseColor.rgb, walnut, floorMask);');
  const marker='#include <color_fragment>';
  shader.fragmentShader=shader.fragmentShader.replace(marker,marker+'\nvec3 officeWorld = officeLocalPosition * 25.0 + vec3(-1.5,1.825,-0.5);\nbool oldBoard = officeWorld.x > -7.1 && officeWorld.x < -3.3 && officeWorld.z > -5.6 && officeWorld.z < -4.55 && officeWorld.y > 0.22;\nbool oldLift = officeWorld.x > -6.0 && officeWorld.x < -3.3 && officeWorld.z > 5.1 && officeWorld.z < 8.2 && officeWorld.y > 0.1;\nbool oldCounter = officeWorld.x > -2.0 && officeWorld.x < 1.6 && officeWorld.z > 5.2 && officeWorld.z < 7.7 && officeWorld.y > 0.1;\nif(oldBoard || oldLift || oldCounter) discard;');
  const chairBounds=[...CHAIR_SEATS,...BENCHES.flatMap(b=>[[b.x-1,b.z-.95],[b.x+1,b.z-.95]])].map(([x,z])=>`(abs(officeWorld.x - (${x.toFixed(3)})) < 0.55 && abs(officeWorld.z - (${z.toFixed(3)})) < 0.37)`).join(' || ');
  shader.fragmentShader=shader.fragmentShader.replace('if(oldBoard || oldLift || oldCounter) discard;',`if(oldBoard || oldLift || oldCounter) discard;\nif(officeWorld.y > 0.12 && officeWorld.y < 1.7 && (${chairBounds})) discard;`);
 };m.customProgramCacheKey=()=> 'bsd-charcoal-clean-architecture-v3';
 o.receiveShadow=true;o.castShadow=false;}});return copy;},[scene]);
 useEffect(()=>{onReady();return()=>room.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose()})},[room,onReady]);
 return <group position={[-1.5,1.825,-.5]} scale={25}><primitive object={room}/></group>;
}
