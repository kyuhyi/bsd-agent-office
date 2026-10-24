'use client';
import {useMemo,useRef} from 'react';
import {useGLTF,Html} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {prepareSeatedRig} from './seated-rig.mjs';
import {manualRoute,OWNER_HOME} from './character-control.mjs';
import {advanceAlongPath} from './navigation.mjs';
import {MEETING_SEATS,MEETING_FACINGS} from '../office/scene-layout.mjs';
import type {CharacterCommand} from './control-types';

export function SeatedOwner({motion,meeting=false,command,selected,onSelect}:{motion:boolean;meeting?:boolean;command?:CharacterCommand;selected:boolean;onSelect:()=>void}){
 const {scene}=useGLTF('/models/modular-v2/kyu-rigged.glb');
 const {model,bones,rest,standing,standingHips,seatedHips,swingAxes}=useMemo(()=>prepareSeatedRig(scene),[scene]);
 const root=useRef<THREE.Group>(null),time=useRef(0),position=useRef([...OWNER_HOME]),route=useRef<number[][]>([]),cursor=useRef(1),key=useRef(-1),sit=useRef(1),walk=useRef(0),phase=useRef(0);
 const offset=useMemo(()=>new THREE.Quaternion(),[]),axisY=useMemo(()=>new THREE.Vector3(0,1,0),[]);
 useFrame((_,dt)=>{
  if(!root.current)return;const delta=motion?Math.min(dt,.05):0;time.current+=delta;
  const destination=command?.kind==='move'?command.destination!:!command&&meeting?MEETING_SEATS[11]:OWNER_HOME;
  const serial=command?.serial??(meeting?1:0);
  if(key.current!==serial){route.current=manualRoute(position.current,destination,'kyu');cursor.current=1;key.current=serial;}
  const distance=Math.hypot(position.current[0]-destination[0],position.current[1]-destination[1]);
  const moving=cursor.current<route.current.length&&distance>.025,wantsSit=command?.kind!=='move'&&!moving&&distance<.06;
  sit.current=THREE.MathUtils.damp(sit.current,wantsSit?1:0,4.8,delta);
  let moved=0,turning=false;
  if(moving&&sit.current<.055){const target=route.current[cursor.current],desired=Math.atan2(target[0]-position.current[0],target[1]-position.current[1]);const error=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y));root.current.rotation.y+=error*(1-Math.exp(-10*delta));turning=Math.abs(error)>.5;
   if(!turning){const next=advanceAlongPath(position.current,target,delta,Math.min(1.5,Math.max(.25,distance*3)));moved=Math.hypot(next[0]-position.current[0],next[1]-position.current[1]);position.current=next;if(Math.hypot(next[0]-target[0],next[1]-target[1])<.025)cursor.current++;}
  }
  if(wantsSit){const angle=(!command&&meeting?MEETING_FACINGS[11]:0)-root.current.rotation.y;root.current.rotation.y+=Math.atan2(Math.sin(angle),Math.cos(angle))*(1-Math.exp(-7*delta));}
  walk.current=THREE.MathUtils.damp(walk.current,moved>.00001?1:0,12,delta);phase.current+=moved*8.5;
  const s=sit.current,w=walk.current,p=phase.current,t=time.current;
  for(const [name,bone] of Object.entries(bones))bone.quaternion.copy(standing[name]).slerp(rest[name],s);
  bones.Hips.position.copy(standingHips).lerp(seatedHips,s);
  const swing=(name:string,angle:number)=>bones[name].quaternion.premultiply(offset.setFromAxisAngle(swingAxes[name],angle));
  swing('LeftUpLeg',Math.sin(p)*.43*w);swing('RightUpLeg',-Math.sin(p)*.43*w);
  swing('LeftLeg',Math.max(0,-Math.sin(p))*.52*w);swing('RightLeg',Math.max(0,Math.sin(p))*.52*w);
  swing('LeftArm',-Math.sin(p)*.28*w);swing('RightArm',Math.sin(p)*.28*w);
  bones.Head.quaternion.multiply(offset.setFromAxisAngle(axisY,Math.sin(t*.55)*.055*(1-w)));
  swing('LeftHand',Math.sin(t*7.2)*.025*s);swing('RightHand',Math.cos(t*7.6)*.025*s);
  root.current.position.set(position.current[0],.06+Math.abs(Math.sin(p))*.018*w,position.current[1]);
  root.current.userData.motionState=moving?(s>.055?'standing-up':turning?'turning':'walking'):s>.9?'seated':wantsSit?'sitting-down':'idle';
 });
 return <group ref={root} name="Agent_kyu" position={[OWNER_HOME[0],.06,OWNER_HOME[1]]} onClick={e=>{e.stopPropagation();onSelect()}} userData={{rigMethod:'higgsfield-meshy-24-joints'}}>
  <primitive object={model}/>
  {selected?<mesh rotation={[-Math.PI/2,0,0]} position={[0,.02,0]}><ringGeometry args={[.4,.44,40]}/><meshBasicMaterial color="#e8c086"/></mesh>:null}
  <Html position={[0,2.15,0]} center zIndexRange={[10,0]}><button className="owner-label character-label" aria-label="대표 퍼널띵 선택" onClick={e=>{e.stopPropagation();onSelect()}}>대표 · 퍼널띵</button></Html>
 </group>;
}
