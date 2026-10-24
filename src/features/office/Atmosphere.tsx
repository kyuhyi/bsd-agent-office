'use client';
import {useMemo} from 'react';
import * as THREE from 'three';

let contactMap:THREE.DataTexture|undefined;
// 가구 밑의 넓은 간접 차폐는 공유 텍스처로 표현한다. 실시간 방향 그림자는 별도로 유지한다.
function contactTexture(){
 if(contactMap)return contactMap;
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=Math.abs((x+.5)/size*2-1),v=Math.abs((y+.5)/size*2-1);
  const a=Math.pow(Math.max(0,1-Math.pow(u,4)-Math.pow(v,4)),2),i=(y*size+x)*4;
  data[i]=17;data[i+1]=12;data[i+2]=9;data[i+3]=Math.round(a*255);
 }
 contactMap=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);contactMap.needsUpdate=true;
 contactMap.magFilter=THREE.LinearFilter;contactMap.minFilter=THREE.LinearFilter;
 return contactMap;
}
export function GroundContact({position,size,opacity=.32}:{position:[number,number,number];size:[number,number];opacity?:number}){
 const map=useMemo(contactTexture,[]);
 return <mesh position={position} rotation={[-Math.PI/2,0,0]} renderOrder={1}><planeGeometry args={size}/><meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false}/></mesh>;
}
function Pool({position,target,intensity,angle=1}:{position:[number,number,number];target:[number,number,number];intensity:number;angle?:number}){
 const aim=useMemo(()=>{const o=new THREE.Object3D();o.position.set(...target);return o},[...target]);
 return <><primitive object={aim}/><spotLight position={position} target={aim} intensity={intensity} color="#ffd7a0" distance={12} angle={angle} penumbra={1} decay={2}/></>;
}
export function PracticalLighting({night,daylight=night?0:1}:{night:boolean;daylight?:number}){const power=1-daylight*.38;return <group name="Warm_practical_lighting">
 <Pool position={[-4.8,5.8,-3.3]} target={[-3.8,0,-2.4]} intensity={85*power} angle={.8}/>
 <Pool position={[-10.5,4.8,-4.5]} target={[-9.5,0,-4.3]} intensity={56*power} angle={.85}/>
 <Pool position={[6.5,5,-8.5]} target={[6,0,-7.8]} intensity={58*power} angle={.8}/>
 <Pool position={[-11,4,1.7]} target={[-10.8,0,2]} intensity={35*power}/>
 <Pool position={[-4.7,3.4,10.25]} target={[-4.7,0,10]} intensity={16*power} angle={.75}/>
 <pointLight position={[-1.8,1.7,9.5]} color="#ffd49c" intensity={3.5*power} distance={3.8}/>
 </group>}
