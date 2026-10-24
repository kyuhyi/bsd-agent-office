'use client';
import {useMemo} from 'react';
import {RoundedBox,useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {ROOM} from './scene-layout.mjs';

export function Solid({size,position=[0,0,0],color='#d6d5cf',metal=0,roughness=.45,radius=.025}:{size:[number,number,number];position?:[number,number,number];color?:string;metal?:number;roughness?:number;radius?:number}){return <RoundedBox args={size} position={position} radius={Math.min(radius,...size.map(s=>s/3))} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={color} metalness={metal} roughness={roughness}/></RoundedBox>}
function Column({x,z}:{x:number;z:number}){return <group position={[x,0,z]}>
 <mesh position={[0,1.85,0]} castShadow receiveShadow><cylinderGeometry args={[.34,.38,3.7,40]}/><meshStandardMaterial color="#c8c4bb" roughness={.43} metalness={.15}/></mesh>
 <mesh position={[0,.1,0]}><cylinderGeometry args={[.39,.39,.16,40]}/><meshStandardMaterial color="#8d7552" metalness={.7} roughness={.3}/></mesh>
 <Solid size={[.15,.48,.09]} position={[0,1.8,.35]} color="#ad8c50" metal={.8}/>
 <mesh position={[0,1.8,.405]}><planeGeometry args={[.055,.36]}/><meshBasicMaterial color="#ffe5b4"/></mesh>
 <pointLight position={[0,1.85,.5]} color="#ffcc86" intensity={9} distance={4.1} decay={2}/>
 </group>}
function Pendants(){return <>{[-9.3,-5.8,-2.3,1.2,4.7,8.2].map(x=><group key={x} position={[x,0,-9.4]}>
 <mesh position={[0,3.1,0]}><cylinderGeometry args={[.012,.012,1.25,8]}/><meshStandardMaterial color="#30353a" metalness={.7}/></mesh>
 <mesh position={[0,2.5,0]}><sphereGeometry args={[.15,20,16]}/><meshStandardMaterial color="#fff0d3" emissive="#ffcd82" emissiveIntensity={2.2} roughness={.32}/></mesh>
 <mesh position={[0,2.66,0]}><cylinderGeometry args={[.05,.06,.08,16]}/><meshStandardMaterial color="#b1945d" metalness={.8}/></mesh>
 {[-9.3,-2.3,4.7].includes(x)&&<pointLight position={[0,2.35,.05]} intensity={8} color="#ffd6a2" distance={5.5} decay={2}/>}
 </group>)}</>}
function Staircase(){return <group position={[-12.25,0,-7.3]} name="Mezzanine_stairs">
 {Array.from({length:11},(_,i)=><Solid key={i} size={[1.6,.17,.41]} position={[0,.14+i*.23,2.2-i*.4]} color="#79604b"/>)}
 <Solid size={[1.85,.18,1.05]} position={[0,2.5,-2.25]} color="#79604b"/>
 </group>}
export function RoomShell(){
 const oak=useTexture('/environment/modular-v2/smoked-oak.png');
 const floor=useMemo(()=>{const map=oak.clone();map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(10,8);map.anisotropy=16;map.colorSpace=THREE.SRGBColorSpace;map.needsUpdate=true;return new THREE.MeshStandardMaterial({map,bumpMap:map,bumpScale:.009,color:'#7c8793',roughness:.52,metalness:.06})},[oak]);
 return <group name="Clean_independent_building">
 <Solid size={[ROOM.width+.3,.42,ROOM.depth+.3]} position={[ROOM.centerX,-.23,ROOM.centerZ]} color="#727c89" metal={.3} radius={.12}/>
 <mesh name="Square_floor" userData={{width:ROOM.width,depth:ROOM.depth}} position={[ROOM.centerX,.003,ROOM.centerZ]} rotation={[-Math.PI/2,0,0]} receiveShadow material={floor}><planeGeometry args={[ROOM.width,ROOM.depth]}/></mesh>
 <Solid size={[24.4,.045,.06]} position={[ROOM.centerX,.025,ROOM.maxZ-.01]} color="#ae9265" metal={.65}/>
 <Solid size={[.06,.045,ROOM.depth]} position={[10.68,.025,ROOM.centerZ]} color="#ae9265" metal={.65}/>
 <group name="Glass_curtain_wall">
  {Array.from({length:12},(_,i)=>-13.5+i*2.2).map(x=><Solid key={x} size={[.055,3.6,.07]} position={[x,1.8,-10.2]} color="#303c48" metal={.7}/>)}
  {Array.from({length:13},(_,i)=>-10.2+i*2.02).map(z=><Solid key={z} size={[.07,3.6,.055]} position={[-13.5,1.8,z]} color="#303c48" metal={.7}/>)}
  {[.15,3.6].map(y=><group key={y}><Solid size={[24.25,.08,.08]} position={[-1.4,y,-10.2]} color="#263642" metal={.65}/><Solid size={[.08,.08,ROOM.depth]} position={[-13.5,y,ROOM.centerZ]} color="#263642" metal={.65}/></group>)}
  <mesh position={[-1.4,1.85,-10.23]}><planeGeometry args={[24.2,3.5]}/><meshPhysicalMaterial color="#b0c9df" transparent opacity={.055} metalness={.12} roughness={.07} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  <mesh position={[-13.53,1.85,ROOM.centerZ]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[ROOM.depth,3.5]}/><meshPhysicalMaterial color="#b0c9df" transparent opacity={.055} metalness={.12} roughness={.07} side={THREE.DoubleSide} depthWrite={false}/></mesh>
 </group>
 {([[-13.2,-10],[-5.1,-10],[3,-10],[10.4,-10],[-13.2,-3],[-13.2,4.7],[-13.2,11.6]] as [number,number][]).map(([x,z])=><Column key={`${x}/${z}`} x={x} z={z}/>)}
 <Pendants/><Staircase/>
 </group>;
}
