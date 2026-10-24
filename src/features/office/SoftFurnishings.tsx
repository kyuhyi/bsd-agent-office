'use client';
import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {GroundContact} from './Atmosphere';

let linen:THREE.DataTexture|undefined;
export function linenWeave(){
 if(linen)return linen;
 const size=256,pixels=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const crossing=Math.sin(x*Math.PI/2)*Math.cos(y*Math.PI/2),fiber=Math.sin(x*1.17+y*7.23)*.18;
  const value=Math.round(128+crossing*42+fiber*24),i=(y*size+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=value;pixels[i+3]=255;
 }
 linen=new THREE.DataTexture(pixels,size,size);linen.wrapS=linen.wrapT=THREE.RepeatWrapping;linen.repeat.set(3,3);linen.magFilter=THREE.LinearFilter;linen.minFilter=THREE.LinearMipmapLinearFilter;linen.generateMipmaps=true;linen.anisotropy=8;linen.needsUpdate=true;return linen;
}
function Fabric({color}:{color:string}){return <meshPhysicalMaterial color={color} roughness={.88} metalness={0} sheen={.35} sheenColor="#dbcfb9" sheenRoughness={.9} specularIntensity={.22} bumpMap={linenWeave()} bumpScale={.005}/>}
function Cushion({position,color,rotation=0}:{position:[number,number,number];color:string;rotation?:number}){
 const geometry=useMemo(()=>{const g=new THREE.SphereGeometry(1,48,32),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,Math.sign(x)*Math.pow(Math.abs(x),.65)*.3,Math.sign(y)*Math.pow(Math.abs(y),.65)*.29,Math.sign(z)*Math.pow(Math.abs(z),.75)*.135)}g.computeVertexNormals();return g;
 },[]);
 const piping=useMemo(()=>{const points=Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2,c=Math.cos(a),s=Math.sin(a);return new THREE.Vector3(Math.sign(c)*Math.pow(Math.abs(c),.65)*.297,Math.sign(s)*Math.pow(Math.abs(s),.65)*.287,.012)});return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true),80,.006,6,true)},[]);
 useEffect(()=>()=>{geometry.dispose();piping.dispose()},[geometry,piping]);
 return <group position={position} rotation={[-.2,rotation,.12]}><mesh geometry={geometry} castShadow receiveShadow><Fabric color={color}/></mesh><mesh geometry={piping}><meshStandardMaterial color={color} roughness={1}/></mesh></group>;
}
function Throw(){const geometry=useMemo(()=>{
 const g=new THREE.PlaneGeometry(.82,1.23,32,40),p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),t=(p.getY(i)+.615)/1.23,z=-.24+t*1.23;
  const fall=Math.pow(Math.max(0,(t-.57)/.43),.8);
  p.setXYZ(i,x-1.25,.94-fall*.7+Math.sin(x*28+t*2)*.025+Math.sin(t*9)*.016,z);
 }g.computeVertexNormals();return g;
 },[]);return <mesh position={[-9.3,.06,-5.8]} geometry={geometry} castShadow receiveShadow><meshPhysicalMaterial color="#bdb4a0" side={THREE.DoubleSide} roughness={.94} sheen={.3} sheenColor="#e0d6c2" bumpMap={linenWeave()} bumpScale={.006}/></mesh>}
function Ottoman({position,color}:{position:[number,number,number];color:string}){
 const geometry=useMemo(()=>{
  const curve=new THREE.CatmullRomCurve3([[0,.015],[.31,.02],[.53,.08],[.62,.26],[.56,.45],[.4,.53],[.22,.46],[0,.34]].map(([r,y])=>new THREE.Vector3(r,y,0)));
  const g=new THREE.LatheGeometry(curve.getPoints(40).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y)),64),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),wrinkle=1+Math.sin(a*9+y*13)*.014;p.setXYZ(i,x*wrinkle,y+Math.sin(a*6)*.006,z*wrinkle)}g.computeVertexNormals();return g;
 },[]);
 return <group position={position}><GroundContact position={[0,.012,0]} size={[1.6,1.55]} opacity={.3}/><mesh geometry={geometry} castShadow receiveShadow><Fabric color={color}/></mesh></group>;
}
export function SoftFurnishings(){return <group name="Soft_lounge_textiles">
 <Cushion position={[-8.05,.88,-5.65]} color="#c7bda7" rotation={-.12}/>
 <Cushion position={[-10.35,.89,-5.69]} color="#869071" rotation={.1}/>
 <Throw/>
 <Ottoman position={[-10.25,.035,-2.7]} color="#b87b54"/>
 <Ottoman position={[-8.6,.035,-2.7]} color="#7b8761"/>
 </group>}
