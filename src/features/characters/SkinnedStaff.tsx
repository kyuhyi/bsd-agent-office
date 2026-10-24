'use client';
import {useRef,useState} from 'react';
import {useFrame,createPortal} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import {useGeneratedStaff} from './useGeneratedStaff';
import {activityFor} from './staff-life.mjs';
import {ambientSpeech} from './ambient-speech.mjs';
import {TEAM} from './team';
import {Mug} from '../office/OfficeProps';
import {HOMES,MEETING_SEATS,MEETING_FACINGS,SCENE_OBSTACLES,BREAK_POINTS} from '../office/scene-layout.mjs';
import type {TeamMember} from './team';
import {advanceAlongPath,findPath} from './navigation.mjs';
import {manualRoute} from './character-control.mjs';
import type {CharacterCommand} from './control-types';

export function SkinnedStaff({member,index,selected,working,meeting,motion,onSelect,command}:{member:TeamMember;index:number;selected:boolean;working:boolean;meeting:boolean;motion:boolean;onSelect:()=>void;command?:CharacterCommand}){
 const {model,rig}=useGeneratedStaff(member.id);
 const cup=useRef<THREE.Group>(null),status=useRef(''),[activityLabel,setActivityLabel]=useState('');
 const speechRef=useRef<string|null>(null),[speech,setSpeech]=useState<string|null>(null);
 const home=HOMES[member.id as keyof typeof HOMES],root=useRef<THREE.Group>(null);
 const position=useRef<number[]>([...home]),route=useRef<number[][]>([]),cursor=useRef(1),key=useRef(''),time=useRef(0),phase=useRef(index),sit=useRef(1),walk=useRef(0),turnDelay=useRef(0);
 useFrame((_,dt)=>{
  if(!root.current)return;
  const delta=motion?Math.min(dt,.05):0;time.current+=delta;
  const activity=activityFor(time.current,index,TEAM.length,{working,meeting,manual:!!command,stationary:!!member.stationary});
  const line=ambientSpeech(time.current,index,TEAM.length,{working,meeting,stationary:!!member.stationary,activity:!!activity});
  if(speechRef.current!==line){speechRef.current=line;setSpeech(line)}
  const effectiveCommand=member.stationary?undefined:command,atMeeting=meeting&&!member.stationary;
  const destination=member.stationary?home:effectiveCommand?(effectiveCommand.kind==='move'?effectiveCommand.destination!:home):atMeeting?MEETING_SEATS[index]:activity?activity.position:home;
  const nextKey=destination.join(',')+':'+(command?.serial??'auto');
  if(motion&&key.current!==nextKey){route.current=manualRoute(position.current,destination,member.id);cursor.current=1;key.current=nextKey;turnDelay.current=.15;}
  const distanceToSeat=Math.hypot(position.current[0]-destination[0],position.current[1]-destination[1]);
  const wantsMove=cursor.current<route.current.length&&distanceToSeat>.035;
  const wantsSit=effectiveCommand?.kind!=='move'&&(!activity||activity.seated)&&distanceToSeat<.06&&!wantsMove;
  const enjoying=!!activity&&distanceToSeat<.06&&!wantsMove;
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
  if(!wantsMove){const desired=activity?activity.facing:member.stationary?0:!effectiveCommand&&atMeeting?MEETING_FACINGS[index]:Math.PI;root.current.rotation.y+=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y))*(1-Math.exp(-7*delta));}
  walk.current=THREE.MathUtils.damp(walk.current,moved>.00001?1:0,10,delta);phase.current+=moved*8.4;
  const s=sit.current,w=walk.current,p=phase.current,t=time.current,typing=(working?1:.18)*s;
  root.current.position.set(position.current[0],.06,position.current[1]);
  root.current.userData.activity=activity?.kind??null;
  root.current.userData.motionState=member.stationary?'reception':enjoying?activity!.kind:wantsMove?(s>.06?'standing-up':turning?'turning':'walking'):s>.9?(working?'typing':'seated'):wantsSit?'sitting-down':'idle';
  rig.body.position.y=-s*.18+Math.abs(Math.sin(p))*.023*w+Math.sin(t*2+index)*.005*(1-w);
  rig.body.rotation.set(s*.06,0,Math.sin(p)*.025*w);
  rig.legL.rotation.x=-s*1.43+Math.sin(p)*.48*w;rig.legR.rotation.x=-s*1.43-Math.sin(p)*.48*w;
  rig.shinL.rotation.x=s*1.43+Math.max(0,-Math.sin(p))*.62*w;rig.shinR.rotation.x=s*1.43+Math.max(0,Math.sin(p))*.62*w;
  rig.armL.rotation.x=-s*.7-Math.sin(p)*.37*w+Math.sin(t*7.4)*.024*typing;
  rig.armR.rotation.x=-s*.7+Math.sin(p)*.37*w+Math.cos(t*8.1)*.024*typing;
  rig.forearmL.rotation.x=-s*.55;rig.forearmR.rotation.x=-s*.55;
  const leisureName=enjoying?activity!.label:activity?'휴식 이동':'';
  if(status.current!==leisureName){status.current=leisureName;setActivityLabel(leisureName)}
  if(cup.current)cup.current.visible=enjoying&&activity?.kind==='coffee';
  rig.handL.rotation.set(0,0,0);rig.handR.rotation.set(0,0,0);
  if(enjoying&&(activity!.kind==='arcade'||activity!.kind==='foosball')){
   const rhythm=Math.sin(t*(activity!.kind==='arcade'?6.5:3.8));
   rig.body.rotation.x=.08;rig.armL.rotation.x=-.8+rhythm*.07;rig.armR.rotation.x=-.82-rhythm*.06;
   rig.forearmL.rotation.x=-.65+Math.sin(t*4)*.1;rig.forearmR.rotation.x=-.65;
   rig.handL.rotation.z=rhythm*.2;rig.handR.rotation.x=Math.sin(t*7)*.16;
  }
  if(enjoying&&activity!.kind==='coffee'){
   const sip=Math.pow(Math.max(0,Math.sin(t*.65)),3);rig.body.rotation.x=-.035;
   rig.armR.rotation.x=-.65-sip*.45;rig.forearmR.rotation.x=-1.15-sip*.55;
   rig.armL.rotation.x=-.15;rig.forearmL.rotation.x=-.3;
  }
  rig.head.rotation.y=Math.sin(t*.55+index)*.07*(1-w);rig.head.rotation.x=s*.1;
 });
 return <group ref={root} name={'Agent_'+member.id} position={[home[0],.06,home[1]]} rotation={[0,member.stationary?0:Math.PI,0]} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
  <primitive object={model}/>
  {speech?<Html position={[0,2.65,0]} center zIndexRange={[12,11]} style={{pointerEvents:'none'}}><div className="ambient-speech" aria-label="사무실 일상 말풍선">{speech}</div></Html>:null}
  {createPortal(<group ref={cup} visible={false} position={[0,.015,.025]}><Mug/></group>,rig.handR)}
  {selected?<mesh rotation={[-Math.PI/2,0,0]} position={[0,.018,0]}><ringGeometry args={[.36,.385,40]}/><meshBasicMaterial color="#e8c086" transparent opacity={.55}/></mesh>:null}
  <Html position={[0,1.95,0]} center zIndexRange={[10,0]}><button aria-label={`${member.name} 선택`} onClick={e=>{e.stopPropagation();onSelect()}} className={`person-label character-label ${selected?'selected':''}`}><i style={{background:working?'#e7a95a':member.color}}/>{member.name}{!meeting||member.stationary?<span>{working?'작업 중':activityLabel||member.role}</span>:null}</button></Html>
 </group>;
}
