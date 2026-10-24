'use client';
import {useState} from 'react';
import {ROOM} from '../office/scene-layout.mjs';
import {useThree} from '@react-three/fiber';
import {manualRoute,validDestination} from './character-control.mjs';

export function MovementTarget({actor,onDestination,onError}:{actor:string|null;onDestination:(p:number[])=>void;onError:(message:string)=>void}){
 const {scene}=useThree(),[hover,setHover]=useState<number[]|null>(null),[mark,setMark]=useState<number[]|null>(null);
 const point=actor?hover:mark,valid=point?validDestination(point):false;
 return <>
  {actor?<mesh name="이동 목적지 바닥" rotation={[-Math.PI/2,0,0]} position={[ROOM.centerX,.075,ROOM.centerZ]} onPointerMove={e=>{setHover([e.point.x,e.point.z])}} onClick={e=>{
   e.stopPropagation();if(e.delta>4)return;const p=[e.point.x,e.point.z],object=scene.getObjectByName('Agent_'+actor);
   if(!validDestination(p)||!object||manualRoute([object.position.x,object.position.z],p,actor).length<2){onError('가구가 없는 넓은 바닥을 선택해주세요.');return;}
   setMark(p);setHover(null);onDestination(p);
  }}><planeGeometry args={[ROOM.width,ROOM.depth]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>:null}
  {point?<mesh position={[point[0],.085,point[1]]} rotation={[-Math.PI/2,0,0]} raycast={()=>{}}><ringGeometry args={[.27,.34,48]}/><meshBasicMaterial color={valid?'#f4d392':'#e7796a'} transparent opacity={actor?.85:.5} depthWrite={false}/></mesh>:null}
 </>;
}
