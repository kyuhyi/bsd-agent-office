'use client';
import {useEffect,useRef,useState} from 'react';
import {useFrame} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import {PET_STOPS,petRoute} from './pet-life.mjs';
import {advanceAlongPath} from '../characters/navigation.mjs';

function Fur({position=[0,0,0],scale=[1,1,1],color}:{position?:[number,number,number];scale?:[number,number,number];color:string}){
 return <mesh position={position} scale={scale} castShadow><sphereGeometry args={[1,20,14]}/><meshStandardMaterial color={color} roughness={.91}/></mesh>;
}
function Pet({kind,motion,index}:{kind:'cat'|'dog';motion:boolean;index:number}){
 const cat=kind==='cat',root=useRef<THREE.Group>(null),body=useRef<THREE.Group>(null),head=useRef<THREE.Group>(null),tail=useRef<THREE.Group>(null),legs=useRef<(THREE.Group|null)[]>([]);
 const position=useRef([...PET_STOPS[index*3]]),path=useRef<number[][]>([]),cursor=useRef(1),pause=useRef(index*2+1),phase=useRef(0),time=useRef(0),walking=useRef(0),reduced=useRef(false),lastStop=useRef(index*3);
 const [hover,setHover]=useState(false),fur=cat?'#aeb7c1':'#d5ad73',white='#f0e9dc',dark=cat?'#65717e':'#8a5c37';
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'),update=()=>{reduced.current=media.matches};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useFrame((_,dt)=>{
  if(!root.current||!body.current||!head.current||!tail.current)return;
  const delta=motion&&!reduced.current?Math.min(dt,.05):0;time.current+=delta;let moved=0;
  if(cursor.current>=path.current.length){
   pause.current-=delta;
   if(pause.current<=0&&delta){const next=(lastStop.current+1+Math.floor(Math.random()*(PET_STOPS.length-1)))%PET_STOPS.length;path.current=petRoute(position.current,PET_STOPS[next]);cursor.current=1;lastStop.current=next;pause.current=2+Math.random()*5;}
  }else{
   const target=path.current[cursor.current],desired=Math.atan2(target[0]-position.current[0],target[1]-position.current[1]);
   const angle=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y));root.current.rotation.y+=angle*(1-Math.exp(-12*delta));
   if(Math.abs(angle)<.65){const next=advanceAlongPath(position.current,target,delta,cat?1.85:2.25);moved=Math.hypot(next[0]-position.current[0],next[1]-position.current[1]);position.current=next;if(Math.hypot(next[0]-target[0],next[1]-target[1])<.025)cursor.current++;}
  }
  walking.current=THREE.MathUtils.damp(walking.current,moved>.0001?1:0,10,delta);phase.current+=moved*12;
  const w=walking.current,p=phase.current,t=time.current;
  root.current.position.set(position.current[0],.065,position.current[1]);root.current.userData.motionState=w>.2?'walking':'sniffing';
  body.current.position.y=Math.abs(Math.sin(p))*.035*w;
  legs.current.forEach((leg,i)=>{if(leg)leg.rotation.x=Math.sin(p+(i===0||i===3?0:Math.PI))*.5*w});
  tail.current.rotation.z=Math.sin(t*(cat?2.4:6))*(cat?.2:.45);tail.current.rotation.x=cat?-.2:.15;
  head.current.rotation.y=Math.sin(t*.8+index)*.2*(1-w);head.current.rotation.x=(1-w)*(.1+Math.sin(t*1.6)*.09);
 });
 return <group ref={root} name={`Pet_${kind}`} position={[position.current[0],.065,position.current[1]]} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)}>
  <group ref={body}>
   <Fur position={[0,.45,-.08]} scale={[.23,.25,cat?.43:.48]} color={fur}/>
   <Fur position={[0,.41,.25]} scale={[.18,.22,.16]} color={white}/>
   {([[-.17,.21],[.17,.21],[-.17,-.36],[.17,-.36]] as [number,number][]).map(([x,z],i)=><group ref={v=>{legs.current[i]=v}} key={i} position={[x,.36,z]}><Fur position={[0,-.12,0]} scale={[.075,.2,.075]} color={fur}/><Fur position={[0,-.28,.025]} scale={[.095,.075,.12]} color={white}/></group>)}
   <group ref={head} position={[0,.68,.34]}>
    <Fur scale={[.255,.24,.23]} color={fur}/>
    {[-1,1].map(side=><group key={side}>
     {cat?<group position={[side*.16,.22,0]} rotation={[0,0,-side*.15]}><mesh castShadow><coneGeometry args={[.12,.25,3]}/><meshStandardMaterial color={dark} roughness={.9}/></mesh><mesh position={[0,.015,.045]}><coneGeometry args={[.068,.16,3]}/><meshStandardMaterial color="#d9b5af" roughness={.95}/></mesh></group>:<group position={[side*.235,.05,-.03]} rotation={[0,0,side*.15]}><Fur position={[0,-.12,0]} scale={[.09,.24,.14]} color={dark}/></group>}
     <Fur position={[side*.104,.035,.202]} scale={[.055,.063,.035]} color="#242b30"/>
     <Fur position={[side*.095,.058,.232]} scale={[.015,.019,.01]} color="#ffffff"/>
     <Fur position={[side*.068,-.087,.21]} scale={[.094,.075,cat?.06:.105]} color={white}/>
     {cat?[0,1].map(j=><mesh key={j} position={[side*.18,-.09+j*.04,.225]} rotation={[0,0,side*(1.35+j*.2)]}><cylinderGeometry args={[.004,.004,.23,5]}/><meshStandardMaterial color="#e5e2d9"/></mesh>):null}
    </group>)}
    <Fur position={[0,-.065,cat?.274:.32]} scale={[.04,.03,.028]} color={cat?'#b77779':'#303032'}/>
    {!cat?<Fur position={[0,-.16,.28]} scale={[.04,.06,.024]} color="#d58e8d"/>:null}
   </group>
   <group ref={tail} position={[0,.48,-.47]}>
    {cat?<><Fur position={[0,.13,-.07]} scale={[.055,.23,.07]} color={dark}/><Fur position={[0,.35,-.045]} scale={[.055,.13,.07]} color={fur}/><Fur position={[0,.43,.03]} scale={[.055,.055,.1]} color={white}/></>:<Fur position={[0,.14,-.12]} scale={[.095,.24,.12]} color={fur}/>}
   </group>
   <mesh position={[0,.53,.26]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.19,.027,8,24]}/><meshStandardMaterial color={cat?'#96b6ab':'#ca775c'} roughness={.55}/></mesh>
   <Fur position={[0,.32,.32]} scale={[.04,.055,.02]} color="#d5ad65"/>
  </group>
  {hover?<Html position={[0,1.25,0]} center style={{pointerEvents:'none'}}><span className="pet-name">{cat?'모카 · 고양이':'두부 · 강아지'}</span></Html>:null}
 </group>;
}
export function OfficePets({motion}:{motion:boolean}){return <group name="Office_Pets"><Pet kind="cat" index={0} motion={motion}/><Pet kind="dog" index={1} motion={motion}/></group>}
