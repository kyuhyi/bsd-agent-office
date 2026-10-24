'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import {cloneCharacter,usePremiumModel} from '../office/PremiumAssets';
import {OBSTACLES,type TeamMember} from './team';
import {advanceAlongPath,findPath} from './navigation.mjs';

export function PremiumCharacter({member,index,selected,working,meeting,motion,onSelect}:{member:TeamMember;index:number;selected:boolean;working:boolean;meeting:boolean;motion:boolean;onSelect:()=>void}){
 const {scene}=usePremiumModel();
 const model=useMemo(()=>{const source=scene.getObjectByName('CHAR_'+member.id);if(!source)throw new Error('캐릭터 모델을 찾지 못했습니다.');return cloneCharacter(source)},[scene,member.id]);
 const rig=useMemo(()=>Object.fromEntries(['body','head','eyes','armL','armR','legL','legR','shinL','shinR'].map(part=>[part,model.getObjectByName(member.id+'_'+part)!])),[model,member.id]);
 const root=useRef<THREE.Group>(null),home=useMemo(()=>[member.desk[0],member.desk[1]-1.12],[member]);
 const position=useRef([...home]),route=useRef<number[][]>([]),cursor=useRef(0),lastKey=useRef(''),phase=useRef(index*1.7),seated=useRef(1),walkingWeight=useRef(0),elapsed=useRef(0);
 useEffect(()=>{lastKey.current='';},[working,meeting,motion]);
 useEffect(()=>()=>{model.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose()})},[model]);
 useFrame((_,dt)=>{
  if(!root.current)return;
  const delta=Math.min(dt,.05);if(motion)elapsed.current+=delta;
  const time=elapsed.current,cycle=Math.floor((time+index*8)/25)%3;
  const roaming=!working&&!meeting&&motion&&cycle===1,angle=index*Math.PI/3;
  const destination=meeting?[5.9+Math.cos(angle)*2.2,2.5+Math.sin(angle)*1.8]:roaming?[member.desk[0]+(index%2?.5:-.5),1.5]:home;
  const key=destination.join(',');
  if(lastKey.current!==key){route.current=findPath(position.current,destination,OBSTACLES);cursor.current=1;lastKey.current=key;}
  let walking=false;
  if(motion&&cursor.current<route.current.length){
   const target=route.current[cursor.current],distance=Math.hypot(target[0]-position.current[0],target[1]-position.current[1]);
   const speed=cursor.current===route.current.length-1?Math.max(.25,Math.min(1.2,distance*2.7)):1.2;
   const next=advanceAlongPath(position.current,target,delta,speed),dx=next[0]-position.current[0],dz=next[1]-position.current[1];
   if(Math.hypot(dx,dz)>.0001){const desired=Math.atan2(dx,dz);root.current.rotation.y+=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y))*(1-Math.exp(-9*delta));walking=true;}
   position.current=next;if(distance<.05)cursor.current++;
  }
  if(!motion)return;
  const atHome=Math.hypot(position.current[0]-home[0],position.current[1]-home[1])<.15;
  seated.current=THREE.MathUtils.damp(seated.current,atHome&&!walking&&!meeting?1:0,6,delta);
  walkingWeight.current=THREE.MathUtils.damp(walkingWeight.current,walking?1:0,8,delta);
  const s=seated.current,w=walkingWeight.current;
  if(!walking){const desired=meeting?Math.atan2(5.9-position.current[0],2.5-position.current[1]):0;root.current.rotation.y+=Math.atan2(Math.sin(desired-root.current.rotation.y),Math.cos(desired-root.current.rotation.y))*(1-Math.exp(-5*delta));}
  phase.current+=delta*(2.3+w*6.4);const p=phase.current,swing=Math.sin(p)*.5*w;
  root.current.position.set(position.current[0],.05,position.current[1]);root.current.userData.motionState=walking?'walking':s>.7?'seated':'standing';
  rig.body.position.y=-s*.18+Math.abs(Math.sin(p))*.02*w+Math.sin(p*.5)*.006*(1-w);
  rig.body.rotation.z=Math.sin(p)*.023*w;rig.body.rotation.x=s*.04;
  rig.legL.rotation.x=-s*1.4+swing*(1-s);rig.legR.rotation.x=-s*1.4-swing*(1-s);
  rig.shinL.rotation.x=s*1.4+Math.max(0,-Math.sin(p))*.42*w;rig.shinR.rotation.x=s*1.4+Math.max(0,Math.sin(p))*.42*w;
  rig.armL.rotation.x=-s*.95-swing*.65+(working?Math.sin(p*3)*.05:0);rig.armR.rotation.x=-s*.95+swing*.65+(working?Math.cos(p*3)*.05:0);
  rig.head.rotation.y=Math.sin(p*.3)*.08*(1-w);rig.head.rotation.x=working?.09:0;
  rig.eyes.scale.y=Math.sin(time*1.1+index)>.998?.12:1;
 });
 return <group ref={root} name={'Agent_'+member.id} position={[home[0],.05,home[1]]} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
  <primitive object={model}/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,.015,0]}><ringGeometry args={[.36,.39,48]}/><meshBasicMaterial color={selected?'#d9b06d':member.color} transparent opacity={selected?.85:.15}/></mesh>
  <Html position={[0,2.03,0]} center zIndexRange={[10,0]} style={{pointerEvents:'none'}}><div className={`person-label ${selected?'selected':''}`}><i style={{background:working?'#d6a24e':member.color}}/>{member.name}<span>{working?'작업 중':meeting?'회의 공간':member.role}</span></div></Html>
 </group>;
}
