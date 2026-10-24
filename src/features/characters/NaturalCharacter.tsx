'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import {cloneCharacter,usePremiumModel} from '../office/PremiumAssets';
import {HOMES,MEETING_SEATS,SCENE_OBSTACLES} from '../office/scene-layout.mjs';
import type {TeamMember} from './team';
import {advanceAlongPath,findPath} from './navigation.mjs';

export function NaturalCharacter({member,index,selected,working,meeting,motion,onSelect}:{member:TeamMember;index:number;selected:boolean;working:boolean;meeting:boolean;motion:boolean;onSelect:()=>void}){
 const {scene}=usePremiumModel();
 const model=useMemo(()=>{const source=scene.getObjectByName('CHAR_'+member.id);if(!source)throw new Error('직원 모델을 찾지 못했습니다.');return cloneCharacter(source)},[scene,member.id]);
 const rig=useMemo(()=>Object.fromEntries(['body','head','eyes','armL','armR','forearmL','forearmR','legL','legR','shinL','shinR'].map(k=>[k,model.getObjectByName(member.id+'_'+k)!])),[model,member.id]);
 const home=HOMES[member.id as keyof typeof HOMES],root=useRef<THREE.Group>(null);
 const position=useRef<number[]>([...home]),route=useRef<number[][]>([]),cursor=useRef(1),key=useRef(''),time=useRef(0),phase=useRef(index),sit=useRef(1),walk=useRef(0),turnDelay=useRef(0);
 useEffect(()=>()=>{model.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose()})},[model]);
 useFrame((_,dt)=>{
  if(!root.current)return;
  const delta=motion?Math.min(dt,.05):0;time.current+=delta;
  const pause=(time.current+index*11)%64,roam=motion&&!working&&!meeting&&pause>48&&pause<58;
  const breakPoints=[[-.2,.5],[-4.8,.35],[3.9,5.5],[-.7,-4.6],[6,.1],[4.7,.1]];
  const destination=meeting?MEETING_SEATS[index]:roam?breakPoints[index]:home;
  const nextKey=destination.join(',');
  if(motion&&key.current!==nextKey){route.current=findPath(position.current,destination,SCENE_OBSTACLES);cursor.current=1;key.current=nextKey;turnDelay.current=.15;}
  const distanceToSeat=Math.hypot(position.current[0]-destination[0],position.current[1]-destination[1]);
  const wantsMove=cursor.current<route.current.length&&distanceToSeat>.035;
  const wantsSit=!roam&&distanceToSeat<.06&&!wantsMove;
  sit.current=THREE.MathUtils.damp(sit.current,wantsSit?1:0,4.5,delta);
  let moved=0,turning=false;
  if(motion&&wantsMove&&sit.current<.06){
   const target=route.current[cursor.current],dx=target[0]-position.current[0],dz=target[1]-position.current[1],desired=Math.atan2(dx,dz);
   const error=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y));
   root.current.rotation.y+=error*(1-Math.exp(-9*delta));turning=Math.abs(error)>.45;
   turnDelay.current=Math.max(0,turnDelay.current-delta);
   if(!turning&&turnDelay.current===0){
    const speed=Math.min(1.35,Math.max(.22,distanceToSeat*2.8));const next=advanceAlongPath(position.current,target,delta,speed);
    moved=Math.hypot(next[0]-position.current[0],next[1]-position.current[1]);position.current=next;
    if(Math.hypot(next[0]-target[0],next[1]-target[1])<.025)cursor.current++;
   }
  }
  if(!wantsMove){const desired=meeting&&index>=3?0:Math.PI;root.current.rotation.y+=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y))*(1-Math.exp(-7*delta));}
  walk.current=THREE.MathUtils.damp(walk.current,moved>.00001?1:0,10,delta);phase.current+=moved*8.4;
  const s=sit.current,w=walk.current,p=phase.current,t=time.current,typing=(working?1:.18)*s;
  root.current.position.set(position.current[0],.06,position.current[1]);
  root.current.userData.motionState=wantsMove?(s>.06?'standing-up':turning?'turning':'walking'):s>.9?(working?'typing':'seated'):wantsSit?'sitting-down':'idle';
  rig.body.position.y=-s*.18+Math.abs(Math.sin(p))*.023*w+Math.sin(t*2+index)*.005*(1-w);
  rig.body.rotation.set(s*.06,0,Math.sin(p)*.025*w);
  rig.legL.rotation.x=-s*1.43+Math.sin(p)*.48*w;rig.legR.rotation.x=-s*1.43-Math.sin(p)*.48*w;
  rig.shinL.rotation.x=s*1.43+Math.max(0,-Math.sin(p))*.62*w;rig.shinR.rotation.x=s*1.43+Math.max(0,Math.sin(p))*.62*w;
  rig.armL.rotation.x=-s*.7-Math.sin(p)*.37*w+Math.sin(t*7.4)*.024*typing;
  rig.armR.rotation.x=-s*.7+Math.sin(p)*.37*w+Math.cos(t*8.1)*.024*typing;
  rig.forearmL.rotation.x=-s*.55;rig.forearmR.rotation.x=-s*.55;
  rig.head.rotation.y=Math.sin(t*.55+index)*.07*(1-w);rig.head.rotation.x=s*.1;
  const blink=(t+index*.7)%4.7;rig.eyes.scale.y=blink>4.57?Math.max(.08,Math.abs(blink-4.635)/.065):1;
 });
 return <group ref={root} name={'Agent_'+member.id} position={[home[0],.06,home[1]]} rotation={[0,Math.PI,0]} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
  <primitive object={model}/>
  {selected?<mesh rotation={[-Math.PI/2,0,0]} position={[0,.018,0]}><ringGeometry args={[.36,.385,40]}/><meshBasicMaterial color="#e8c086" transparent opacity={.55}/></mesh>:null}
  <Html position={[0,1.95,0]} center zIndexRange={[10,0]} style={{pointerEvents:'none'}}><div className={`person-label ${selected?'selected':''}`}><i style={{background:working?'#e7a95a':member.color}}/>{member.name}<span>{working?'작업 중':member.role}</span></div></Html>
 </group>;
}
