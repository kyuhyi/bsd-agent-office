'use client';
import {useMemo,useLayoutEffect,useRef} from 'react';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';

function Display({variant}:{variant:number}){
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=640;const x=c.getContext('2d')!;
  x.fillStyle='#111a29';x.fillRect(0,0,1024,640);x.fillStyle='#233047';x.fillRect(0,0,1024,35);x.fillStyle='#182235';x.fillRect(0,35,160,605);
  ['#ee786b','#ebbf62','#75b9a0'].forEach((color,i)=>{x.fillStyle=color;x.beginPath();x.arc(20+i*22,18,5,0,Math.PI*2);x.fill()});
  x.font='18px Pretendard';x.fillStyle='#c4d0e4';x.fillText(variant%2?'Design workspace':'Project workspace',180,65);
  for(let i=0;i<12;i++){x.fillStyle=i===2?'#729eca':'#45536d';x.fillRect(20,72+i*28,85-(i%3)*14,6)}
  if(variant%2){x.fillStyle='#e6e7e4';x.fillRect(185,100,610,480);x.fillStyle='#333d4d';x.fillRect(220,130,535,20);x.fillStyle='#a9c7c5';x.fillRect(220,180,535,180);for(let i=0;i<3;i++){x.fillStyle=['#b8b4b0','#a2b2c3','#c8a491'][i];x.fillRect(220+i*184,390,166,110)}x.fillStyle='#485a74';x.fillRect(830,110,145,150);x.fillRect(830,290,110,9)}
  else{for(let row=0;row<21;row++){x.fillStyle='#42546e';x.fillText(String(row+1),178,110+row*23);let left=220+(row%4)*16;for(let j=0;j<3+(row%3);j++){x.fillStyle=['#9eb8d2','#8abfa6','#c1a4d5','#d2b38c'][(row+j)%4];const w=24+((row*17+j*31)%120);x.fillRect(left,100+row*23,w,7);left+=w+12}}}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;
 },[variant]);
 return <mesh position={[0,.51,.047]}><planeGeometry args={[1.1,.66]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
export function Monitor({position=[0,0,0],rotation=0,variant=0}:{position?:[number,number,number];rotation?:number;variant?:number}){return <group name="Monitor_27inch" position={position} rotation={[0,rotation,0]}>
 <RoundedBox args={[1.17,.73,.085]} position={[0,.51,0]} radius={.025} smoothness={3} castShadow><meshStandardMaterial color="#242b32" roughness={.25} metalness={.65}/></RoundedBox>
 <Display variant={variant}/>
 <mesh position={[.52,.18,.046]}><sphereGeometry args={[.009,8,8]}/><meshBasicMaterial color="#b8e6d3"/></mesh>
 <RoundedBox args={[.08,.32,.07]} position={[0,.16,-.015]} radius={.012} smoothness={2} castShadow><meshStandardMaterial color="#929ba3" metalness={.85} roughness={.25}/></RoundedBox>
 <RoundedBox args={[.43,.035,.3]} position={[0,.025,.03]} radius={.015} smoothness={2} receiveShadow><meshStandardMaterial color="#84909b" metalness={.85} roughness={.24}/></RoundedBox>
 </group>}
export function Keyboard({position=[0,0,0],rotation=0}:{position?:[number,number,number];rotation?:number}){
 const keys=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const m=new THREE.Matrix4();for(let row=0;row<5;row++)for(let col=0;col<14;col++){m.makeTranslation((col-6.5)*.045,.035,(row-2)*.045);keys.current!.setMatrixAt(row*14+col,m)}keys.current!.instanceMatrix.needsUpdate=true},[]);
 return <group name="Keyboard_and_mouse" position={position} rotation={[0,rotation,0]}>
  <RoundedBox args={[.69,.035,.27]} radius={.018} smoothness={2} castShadow><meshStandardMaterial color="#8e969c" metalness={.5} roughness={.4}/></RoundedBox>
  <instancedMesh ref={keys} args={[undefined,undefined,70]} castShadow><boxGeometry args={[.038,.014,.035]}/><meshStandardMaterial color="#e2e2dc" roughness={.5}/></instancedMesh>
  <mesh position={[.48,.027,0]} scale={[.066,.032,.1]} castShadow><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color="#d3d6d8" metalness={.25} roughness={.32}/></mesh>
 </group>;
}
export function DeskLamp({position=[0,0,0]}:{position?:[number,number,number]}){return <group position={position} name="Brass_desk_lamp">
 <mesh position={[0,.025,0]} castShadow><cylinderGeometry args={[.13,.15,.05,24]}/><meshStandardMaterial color="#ae8c50" metalness={.8} roughness={.3}/></mesh>
 <mesh position={[0,.28,0]} castShadow><cylinderGeometry args={[.018,.018,.5,12]}/><meshStandardMaterial color="#bba16d" metalness={.8} roughness={.25}/></mesh>
 <mesh position={[0,.55,0]} castShadow><sphereGeometry args={[.18,24,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#b69960" metalness={.65} roughness={.28} side={THREE.DoubleSide}/></mesh>
 <mesh position={[0,.54,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.165,24]}/><meshBasicMaterial color="#ffe3a5" side={THREE.DoubleSide}/></mesh>
 </group>}
