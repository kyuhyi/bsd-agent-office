'use client';
import { useEffect,useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html,RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { TeamMember } from './team';
import { OBSTACLES } from './team';
import { advanceAlongPath,findPath } from './navigation.mjs';

function Limb({color,length=.3,radius=.085}:{color:string;length?:number;radius?:number}){
 return <mesh castShadow position={[0,-length/2,0]}><capsuleGeometry args={[radius,Math.max(.01,length-radius*2),4,8]}/><meshStandardMaterial color={color} roughness={.8}/></mesh>
}
export function Character({member,index,selected,working,meeting,motion,onSelect}:{member:TeamMember;index:number;selected:boolean;working:boolean;meeting:boolean;motion:boolean;onSelect:()=>void}){
 const root=useRef<THREE.Group>(null),body=useRef<THREE.Group>(null),head=useRef<THREE.Group>(null),armL=useRef<THREE.Group>(null),armR=useRef<THREE.Group>(null),legL=useRef<THREE.Group>(null),legR=useRef<THREE.Group>(null),shinL=useRef<THREE.Group>(null),shinR=useRef<THREE.Group>(null),eyes=useRef<THREE.Group>(null);
 const home=useMemo(()=>[member.desk[0],member.desk[1]-1.12],[member]);
 const position=useRef([...home]),route=useRef<number[][]>([]),cursor=useRef(0),lastKey=useRef(''),phase=useRef(index*1.7),seated=useRef(1);
 useEffect(()=>{lastKey.current='';},[working,meeting,motion]);
 useFrame(({clock},dt)=>{
   if(!root.current||!body.current)return;
   const delta=Math.min(dt,.06),time=clock.elapsedTime;
   const cycle=Math.floor((time+index*8)/22)%3;
   const roaming=!working&&!meeting&&motion&&cycle===1;
   const angle=index*Math.PI/3;
   const destination=meeting?[5.9+Math.cos(angle)*2.0,2.5+Math.sin(angle)*1.65]:roaming?[member.desk[0]+(index%2?.5:-.5),1.5]:home;
   const key=destination.join(',');
   if(lastKey.current!==key){route.current=findPath(position.current,destination,OBSTACLES);cursor.current=1;lastKey.current=key;}
   let walking=false;
   if(motion&&cursor.current<route.current.length){
     const target=route.current[cursor.current],distance=Math.hypot(target[0]-position.current[0],target[1]-position.current[1]);
     const isLast=cursor.current===route.current.length-1;
     const speed=isLast?Math.max(.35,Math.min(1.5,distance*3)):1.5;
     const next=advanceAlongPath(position.current,target,delta,speed);
     const dx=next[0]-position.current[0],dz=next[1]-position.current[1];
     if(Math.hypot(dx,dz)>.0001){const desired=Math.atan2(dx,dz);root.current.rotation.y+=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y))*(1-Math.exp(-10*delta));walking=true;}
     position.current=next;if(distance<.05)cursor.current++;
   }
   const atHome=Math.hypot(position.current[0]-home[0],position.current[1]-home[1])<.15;
   const sit=atHome&&!walking&&!meeting?1:0;
   seated.current=THREE.MathUtils.damp(seated.current,sit,7,delta);
   const s=seated.current;
   if(!walking){const desired=meeting?Math.atan2(5.9-position.current[0],2.5-position.current[1]):0;root.current.rotation.y+=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y))*(1-Math.exp(-5*delta));}
   if(motion)phase.current+=delta*(walking?9:2.6);
   const p=phase.current,swing=walking?Math.sin(p)*.55:0;
   root.current.position.set(position.current[0],0,position.current[1]);
   body.current.position.y=-s*.19+(walking?Math.abs(Math.sin(p))*.025:Math.sin(p*.6)*.007);
   body.current.rotation.z=walking?Math.sin(p)*.025:0;
   if(legL.current)legL.current.rotation.x=-s*1.45+swing*(1-s);
   if(legR.current)legR.current.rotation.x=-s*1.45-swing*(1-s);
   if(shinL.current)shinL.current.rotation.x=s*1.45+(walking?Math.max(0,-Math.sin(p))*.5:0);
   if(shinR.current)shinR.current.rotation.x=s*1.45+(walking?Math.max(0,Math.sin(p))*.5:0);
   if(armL.current)armL.current.rotation.x=-s*.95-swing*.7+(working&&motion?Math.sin(p*3)*.06:0);
   if(armR.current)armR.current.rotation.x=-s*.95+swing*.7+(working&&motion?Math.cos(p*3)*.06:0);
   if(head.current){head.current.rotation.y=walking?0:Math.sin(p*.3)*.1;head.current.rotation.x=working?.08:0;}
   if(eyes.current)eyes.current.scale.y=motion&&Math.sin(time*1.2+index)> .995?.1:1;
 });
 return <group ref={root} position={[home[0],0,home[1]]} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,.025,0]}><ringGeometry args={[.36,.4,32]}/><meshBasicMaterial color={selected?'#d29e49':member.color} transparent opacity={selected?.9:.18}/></mesh>
  <group ref={body}>
   <RoundedBox args={[.48,.46,.32]} radius={.12} smoothness={3} position={[0,.93,0]} castShadow><meshStandardMaterial color={member.color} roughness={.75}/></RoundedBox>
   <mesh position={[0,1.14,0]}><cylinderGeometry args={[.1,.11,.16,12]}/><meshStandardMaterial color={member.skin}/></mesh>
   <mesh position={[.13,1.01,.166]}><boxGeometry args={[.09,.1,.015]}/><meshStandardMaterial color="#f6ead9"/></mesh>
   <group ref={head} position={[0,1.48,0]}>
    <mesh castShadow scale={[1,1.04,.95]}><sphereGeometry args={[.32,24,20]}/><meshStandardMaterial color={member.skin} roughness={.68}/></mesh>
    <mesh position={[0,.04,-.02]} castShadow><sphereGeometry args={[.335,24,16,0,Math.PI*2,0,Math.PI*.57]}/><meshStandardMaterial color={member.hair} roughness={.9}/></mesh>
    {[-.16,-.04,.08,.2].map((x,i)=><mesh key={i} position={[x,.18-i*.025,.23]} rotation={[0,0,-.25]} scale={[.11,.14,.10]} castShadow><sphereGeometry args={[1,12,10]}/><meshStandardMaterial color={member.hair}/></mesh>)}
    {member.style===1||member.style===2?<mesh position={[member.style===1?.26:0,.06,-.24]} scale={[.18,.23,.17]} castShadow><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={member.hair}/></mesh>:null}
    {[-1,1].map(side=><mesh key={side} position={[side*.305,-.02,0]}><sphereGeometry args={[.066,10,10]}/><meshStandardMaterial color={member.skin}/></mesh>)}
    <group ref={eyes} position={[0,-.015,.291]}>{[-1,1].map(side=><group key={side} position={[side*.115,0,0]}><mesh><sphereGeometry args={[.036,12,12]}/><meshStandardMaterial color="#282722"/></mesh><mesh position={[-.008,.01,.03]}><sphereGeometry args={[.009,8,8]}/><meshBasicMaterial color="#fff"/></mesh></group>)}</group>
    {[-1,1].map(side=><mesh key={side} position={[side*.19,-.085,.24]} scale={[1,.48,.3]}><sphereGeometry args={[.055,12,8]}/><meshStandardMaterial color="#e79d91" transparent opacity={.45}/></mesh>)}
    <mesh position={[0,-.065,.304]}><sphereGeometry args={[.036,10,8]}/><meshStandardMaterial color={member.skin}/></mesh>
    <mesh position={[0,-.13,.28]} rotation={[0,0,Math.PI]}><torusGeometry args={[.05,.009,6,12,Math.PI]}/><meshStandardMaterial color="#95624e"/></mesh>
    {member.style===0||member.style===4?<group position={[0,-.015,.315]}>{[-1,1].map(s=><mesh key={s} position={[s*.115,0,0]}><torusGeometry args={[.073,.012,6,16]}/><meshStandardMaterial color="#47413a"/></mesh>)}<mesh><boxGeometry args={[.08,.013,.015]}/><meshStandardMaterial color="#47413a"/></mesh></group>:null}
    {member.style===3?<group>{[-1,1].map(s=><mesh key={s} position={[s*.33,.02,0]}><boxGeometry args={[.07,.17,.14]}/><meshStandardMaterial color="#d2b082"/></mesh>)}<mesh rotation={[0,0,0]}><torusGeometry args={[.35,.027,8,20,Math.PI]}/><meshStandardMaterial color="#d2b082"/></mesh></group>:null}
   </group>
   {[-1,1].map((side,i)=><group key={side} ref={i===0?armL:armR} position={[side*.29,1.08,0]} rotation={[0,0,side*.1]}><Limb color={member.color} length={.27}/><group position={[0,-.23,0]} rotation={[-.18,0,0]}><Limb color={member.skin} length={.23} radius={.065}/><mesh position={[0,-.23,0]}><sphereGeometry args={[.073,12,10]}/><meshStandardMaterial color={member.skin}/></mesh></group></group>)}
   {[-1,1].map((side,i)=><group key={side} ref={i===0?legL:legR} position={[side*.13,.72,0]}><Limb color="#3b4245" length={.32} radius={.095}/><group ref={i===0?shinL:shinR} position={[0,-.3,0]}><Limb color="#3b4245" length={.3} radius={.08}/><RoundedBox args={[.18,.12,.28]} radius={.045} smoothness={2} position={[0,-.28,.045]} castShadow><meshStandardMaterial color="#faf2e4" roughness={.8}/></RoundedBox></group></group>)}
  </group>
  <Html position={[0,2.06,0]} center zIndexRange={[10,0]} style={{pointerEvents:'none'}}><div className={`person-label ${selected?'selected':''}`}><i style={{background:working?'#d6a24e':member.color}}/>{member.name}<span>{working?'작업 중':meeting?'회의 공간':member.role}</span></div></Html>
 </group>
}
