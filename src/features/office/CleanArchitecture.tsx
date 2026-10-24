'use client';
import {RoundedBox} from '@react-three/drei';
import {useMemo} from 'react';
import * as THREE from 'three';

function Part({position,size,color,metalness=0,radius=.035}:{position:[number,number,number];size:[number,number,number];color:string;metalness?:number;radius?:number}){return <RoundedBox position={position} args={size} radius={radius} smoothness={4} castShadow receiveShadow><meshStandardMaterial color={color} roughness={metalness?.27:.5} metalness={metalness}/></RoundedBox>}
function Counter(){
 const geometry=useMemo(()=>{const w=3.5,d=1.45,r=.48,s=new THREE.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const g=new THREE.ExtrudeGeometry(s,{depth:1.05,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,curveSegments:20});g.rotateX(-Math.PI/2);return g},[]);
 return <group position={[-.31,.04,9.4]}>
  <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color="#61402b" roughness={.4}/></mesh>
  <mesh geometry={geometry} position={[0,1.06,0]} scale={[1.015,.045,1.02]}><meshStandardMaterial color="#c4a67b" metalness={.45} roughness={.3}/></mesh>
  <mesh geometry={geometry} position={[0,.015,0]} scale={[1.01,.035,1.01]}><meshStandardMaterial color="#ffd39b" emissive="#ffb85c" emissiveIntensity={2}/></mesh>
  <Part position={[-.4,1.48,-.12]} size={[.86,.57,.065]} color="#a4adb3" metalness={.8}/>
  <Part position={[-.4,1.19,-.1]} size={[.075,.25,.07]} color="#b7b8b8" metalness={.8}/>
  <Part position={[-.4,1.12,-.07]} size={[.4,.035,.24]} color="#adb5bc" metalness={.8} radius={.01}/>
  <Part position={[-.43,1.13,.27]} size={[.65,.03,.22]} color="#deded9" radius={.012}/>
 </group>;
}
export function CleanArchitecture(){return <group name="Independent_Architecture">
 <Counter/>
 <group position={[-4.7,0,9.55]}>
  <Part position={[-1.04,1.45,0]} size={[.27,2.9,.8]} color="#c4c7cb" metalness={.55}/>
  <Part position={[1.04,1.45,0]} size={[.27,2.9,.8]} color="#c4c7cb" metalness={.55}/>
  <Part position={[0,2.79,0]} size={[2.34,.24,.8]} color="#c4c7cb" metalness={.55}/>
  <Part position={[0,1.36,-.15]} size={[1.83,2.7,.12]} color="#27303a"/>
  {[-1,1].map(side=><Part key={side} position={[side*.45,1.35,.05]} size={[.88,2.6,.1]} color="#9eacb6" metalness={.85} radius={.01}/>)}
  <Part position={[.99,1.28,.45]} size={[.12,.24,.035]} color="#2f3640" metalness={.7} radius={.012}/>
  {[-.92,.92].map(x=><mesh key={x} position={[x,1.36,.115]}><planeGeometry args={[.025,2.57]}/><meshBasicMaterial color="#ffe1ac"/></mesh>)}
  <Part position={[0,2.57,.12]} size={[.38,.15,.025]} color="#25343b" radius={.008}/>
  <mesh position={[0,2.57,.137]}><planeGeometry args={[.08,.035]}/><meshBasicMaterial color="#e2c99d"/></mesh>
 </group>
 <group position={[-5.2,0,-5.15]}>
  <Part position={[0,1.5,0]} size={[3.25,1.4,.08]} color="#333c45" metalness={.4}/>
  <Part position={[0,1.5,.05]} size={[3.12,1.27,.03]} color="#e7e7e1" radius={.015}/>
  {[-1.15,1.15].map(x=><group key={x}><Part position={[x,.57,0]} size={[.05,1.14,.05]} color="#333c45" metalness={.5} radius={.01}/><Part position={[x,.05,0]} size={[.09,.06,.65]} color="#333c45" metalness={.5} radius={.01}/></group>)}
 </group>
 </group>}
