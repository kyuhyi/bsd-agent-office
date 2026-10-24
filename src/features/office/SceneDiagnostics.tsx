'use client';
import {useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {TEAM} from '../characters/team';

// 검증용 상태만 캔버스 속성에 기록한다. 제품 화면에는 진단 글자를 표시하지 않는다.
export function SceneDiagnostics(){
 const {gl,scene}=useThree(),frame=useRef(0),elapsed=useRef(0),samples=useRef<number[]>([]);
 useFrame((_,delta)=>{frame.current++;elapsed.current+=delta;samples.current.push(delta);if(samples.current.length>1800)samples.current.shift();
  if(frame.current%30!==0)return;
  const canvas=gl.domElement;canvas.dataset.room=JSON.stringify(scene.getObjectByName('Square_floor')?.userData??{});canvas.dataset.fps=(frame.current/elapsed.current).toFixed(1);
  const recent=samples.current.slice(-180);canvas.dataset.recentFps=(recent.length/recent.reduce((sum,v)=>sum+v,0)).toFixed(1);
  const sorted=[...samples.current].sort((a,b)=>b-a);canvas.dataset.lowFps=(1/(sorted[Math.floor(sorted.length*.01)]||delta)).toFixed(1);
  canvas.dataset.drawCalls=String(gl.info.render.calls);canvas.dataset.triangles=String(gl.info.render.triangles);
  canvas.dataset.agents=JSON.stringify([...TEAM,{id:'kyu'}].map(m=>{const o=scene.getObjectByName('Agent_'+m.id);return {id:m.id,position:o?.position.toArray().map(v=>Number(v.toFixed(3))),state:o?.userData.motionState}}));
  canvas.dataset.pets=JSON.stringify(['cat','dog'].map(id=>{const o=scene.getObjectByName('Pet_'+id);return {id,position:o?.position.toArray().map(v=>Number(v.toFixed(3))),state:o?.userData.motionState}}));
  const carpets:{time:number;seed:number}[]=[];scene.traverse(o=>{if(o.userData.carpetNeon){const u=(o as any).material.uniforms;carpets.push({time:Number(u.uTime.value.toFixed(2)),seed:u.uSeed.value})}});canvas.dataset.carpetNeon=JSON.stringify(carpets);
 });return null;
}
