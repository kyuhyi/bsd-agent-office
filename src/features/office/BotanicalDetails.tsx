'use client';
import {useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {Solid} from './RoomShell';
import {GroundContact} from './Atmosphere';

// 넓은 잎의 곡면과 중앙 능선을 실제 메시로 만들고 반복 잎은 인스턴스로 그린다.
function leafGeometry(){
 const points:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let row=0;row<=16;row++){const t=row/16,w=Math.pow(Math.sin(Math.PI*t),.75)*.3;
  for(let col=0;col<7;col++){const s=(col-3)/3;points.push(s*w*(1+Math.sin(t*25)*.025),t,Math.sin(t*Math.PI)*.23-Math.abs(s)*w*.4+Math.sin(t*31)*Math.abs(s)*.008);uv.push(col/6,t)}
 }
 for(let r=0;r<16;r++)for(let c=0;c<6;c++){const a=r*7+c;indices.push(a,a+1,a+7,a+1,a+8,a+7)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function LeafPlant({position,height=1.3,seed=0,pot='#d5cbbb'}:{position:[number,number,number];height?:number;seed?:number;pot?:string}){
 const leaves=useRef<THREE.InstancedMesh>(null),stems=useRef<THREE.InstancedMesh>(null),geometry=useMemo(leafGeometry,[]);
 useLayoutEffect(()=>{
  const dummy=new THREE.Object3D(),color=new THREE.Color();
  for(let i=0;i<48;i++){
   const angle=i*2.39996+seed*.7,level=(i%8)/8,variation=Math.sin(i*17.23+seed)*.5+.5,len=.52+level*.37+variation*.12;
   const tip=new THREE.Vector3(Math.cos(angle)*(.12+level*.2),.45+level*.58,Math.sin(angle)*(.12+level*.2));
   dummy.position.copy(tip);dummy.rotation.set(.28+(1-level)*1.02+variation*.18,angle,(variation-.5)*.25);dummy.scale.set(len*(.85+variation*.3),len,len);dummy.updateMatrix();leaves.current!.setMatrixAt(i,dummy.matrix);
   color.set(['#49663a','#617e47','#7b8c51','#345936','#82915d','#577b43'][i%6]);leaves.current!.setColorAt(i,color);
   const bottom=new THREE.Vector3(0,.28,0),dir=tip.clone().sub(bottom);dummy.position.copy(bottom).addScaledVector(dir,.5);dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());dummy.scale.set(.008,dir.length(),.008);dummy.updateMatrix();stems.current!.setMatrixAt(i,dummy.matrix);
  }
  leaves.current!.instanceMatrix.needsUpdate=true;stems.current!.instanceMatrix.needsUpdate=true;
 },[seed]);
 return <group position={position} scale={height/1.55} name="Broadleaf_planter">
  <GroundContact position={[0,.006,0]} size={[.95,.95]} opacity={.42}/>
  <mesh position={[0,.24,0]} castShadow receiveShadow><cylinderGeometry args={[.29,.235,.48,32]}/><meshStandardMaterial color={pot} roughness={.65}/></mesh>
  <mesh position={[0,.482,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.27,32]}/><meshStandardMaterial color="#302b20" roughness={1}/></mesh>
  <mesh position={[0,.47,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.28,.015,8,32]}/><meshStandardMaterial color={pot} roughness={.5}/></mesh>
  <instancedMesh ref={leaves} args={[geometry,undefined,48]} castShadow receiveShadow><meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={.64}/></instancedMesh>
  <instancedMesh ref={stems} args={[undefined,undefined,48]} castShadow><cylinderGeometry args={[1,1,1,5]}/><meshStandardMaterial color="#5c7039" roughness={.8}/></instancedMesh>
 </group>;
}
function TrailingVine({x}:{x:number}){const leaves=useRef<THREE.InstancedMesh>(null),geometry=useMemo(leafGeometry,[]),stem=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(x,.72,.18),new THREE.Vector3(x+.12,.6,.5),new THREE.Vector3(x-.03,.3,.58),new THREE.Vector3(x+.1,.12,.55)]),20,.008,5,false),[x]);
 useLayoutEffect(()=>{const d=new THREE.Object3D();for(let i=0;i<14;i++){const t=i/13;d.position.set(x+Math.sin(t*8)*.1,.7-t*.56,.34+Math.sin(t*Math.PI*.7)*.25);d.rotation.set(1.8+(i%2)*.4,(i%2?1:-1)*.9,t*.8);d.scale.setScalar(.2+(i%3)*.025);d.updateMatrix();leaves.current!.setMatrixAt(i,d.matrix)}leaves.current!.instanceMatrix.needsUpdate=true},[x]);
 return <><mesh geometry={stem}><meshStandardMaterial color="#68703d" roughness={.9}/></mesh><instancedMesh ref={leaves} args={[geometry,undefined,14]} castShadow receiveShadow><meshStandardMaterial color="#7f9154" roughness={.75} side={THREE.DoubleSide}/></instancedMesh></>;
}
function Planter({position,width=3.2,rotation=0}:{position:[number,number,number];width?:number;rotation?:number}){return <group position={position} rotation={[0,rotation,0]}>
 <Solid size={[width,.57,.76]} position={[0,.3,0]} color="#67472f" radius={.06}/>
 <Solid size={[width-.1,.035,.65]} position={[0,.605,0]} color="#2f3022"/>
 <Solid size={[width,.028,.025]} position={[0,.48,.39]} color="#b4955d" metal={.65}/>
 {Array.from({length:Math.floor(width/.58)},(_,i)=><LeafPlant key={i} position={[-width/2+.32+i*.58,.21,Math.sin(i*3)*.15]} height={1.2+(i%3)*.21} seed={i+3} pot="#5a4b35"/>)}
 <TrailingVine x={-width*.29}/><TrailingVine x={width*.24}/>
 <GroundContact position={[0,.015,0]} size={[width+.5,1.25]} opacity={.42}/>
 </group>}
export function BotanicalDetails(){return <group name="Layered_perimeter_gardens">
 <Planter position={[4.35,0,13]} width={6.25}/>
 <Planter position={[-9.6,0,12.75]} width={4.5}/>
 <Planter position={[10.1,0,6.3]} width={3.25} rotation={Math.PI/2}/>
 <Planter position={[-12.75,0,8.8]} width={2.6} rotation={Math.PI/2}/>
 {([[-11.9,10.5],[-12.45,-2.4],[-11.65,-2.3],[-6.8,-5.3],[-6.5,-8.5],[-4.3,-9.1],[2.3,-8.65],[9.8,-6],[9.8,-8.6],[-2.5,9.4],[7.6,12.7]] as [number,number][]).map(([x,z],i)=><LeafPlant key={i} position={[x,.035,z]} height={1.15+(i%3)*.25} seed={i} />)}
 </group>}
