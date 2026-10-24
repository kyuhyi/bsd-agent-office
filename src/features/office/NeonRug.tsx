'use client';
import {createContext,useContext,useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export const RugLightingContext=createContext({motion:true,daylight:1});

// 바닥에 붙은 발광 띠와 퍼지는 빛을 한 장으로 그려 추가 광원·그림자 비용을 줄인다.
const vertexShader=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader=`
varying vec2 vUv;
uniform vec2 uSize;
uniform float uTime,uSeed,uDaylight;
float hash(float n){return fract(sin(n*127.1+uSeed*311.7)*43758.5453);}
vec3 palette(float n){
 float h=hash(n);
 if(h<.25)return vec3(.28,.78,1.0);
 if(h<.5)return vec3(.48,1.0,.78);
 if(h<.75)return vec3(1.0,.65,.33);
 return vec3(.76,.52,1.0);
}
void main(){
 vec2 p=(vUv-.5)*(uSize+vec2(.9));
 float radius=.56;
 vec2 q=abs(p)-(uSize*.5-vec2(radius+.045));
 float d=abs(length(max(q,0.0))+min(max(q.x,q.y),0.0)-radius);
 float t=uTime/(4.0+hash(7.0)*4.0)+uSeed*4.0;
 float segment=floor(t),phase=fract(t),blend=smoothstep(.78,1.0,phase);
 vec3 color=mix(palette(segment),palette(segment+1.0),blend);
 // 매 주기마다 점등 시점·밝기·잔광 길이를 달리하고 다음 점등 전에는 충분히 어두워진다.
 float onset=.04+hash(segment+13.0)*.14;
 float peak=onset+.065+hash(segment+31.0)*.055;
 float end=peak+.28+hash(segment+47.0)*.3;
 float pulse=smoothstep(onset,peak,phase)*(1.0-smoothstep(peak,end,phase));
 float power=.025+pulse*(.72+.28*hash(segment+21.0));
 float core=1.0-smoothstep(.012,.028,d);
 float halo=exp(-d*mix(32.0,14.0,pulse))*.38+exp(-d*7.0)*.08*pulse;
 float intensity=power*(1.0-uDaylight*.12);
 float alpha=(core*.9+halo)*intensity;
 if(alpha<.004)discard;
 gl_FragColor=vec4(mix(color,vec3(1.0),core*.35),alpha);
}`;

export function NeonRug({size,seed}:{size:[number,number];seed:number}){
 const {motion,daylight}=useContext(RugLightingContext),reduced=useRef(false),material=useRef<THREE.ShaderMaterial>(null);
 const uniforms=useMemo(()=>({uSize:{value:new THREE.Vector2(size[0],size[1])},uTime:{value:0},uSeed:{value:seed},uDaylight:{value:daylight}}),[size[0],size[1],seed]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'),update=()=>{reduced.current=media.matches};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useFrame((_,dt)=>{if(!material.current)return;const u=material.current.uniforms;u.uDaylight.value=daylight;if(motion&&!reduced.current)u.uTime.value+=Math.min(dt,.05)});
 return <mesh name="Carpet_Neon" position={[0,.04,0]} rotation={[-Math.PI/2,0,0]} raycast={()=>{}} userData={{carpetNeon:true}}>
  <planeGeometry args={[size[0]+.9,size[1]+.9]}/>
  <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending}/>
 </mesh>;
}
