'use client';
import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {RoomShell,Solid} from './RoomShell';
import {OfficeProps,Mug} from './OfficeProps';
import {CleanArchitecture} from './CleanArchitecture';
import {ModularAsset} from './ModularAsset';
import {ModularChairs} from './ModularChairs';
import {Monitor,Keyboard,DeskLamp} from './DeskEquipment';
import {BENCHES,MEETING_SEATS,MEETING_FACINGS} from './scene-layout.mjs';
import {BotanicalDetails} from './BotanicalDetails';
import {DecorDetails,DeskAccessories} from './DecorDetails';
import {GroundContact} from './Atmosphere';
import {StaticDetails} from './StaticDetails';
import {SoftFurnishings} from './SoftFurnishings';
import {NeonRug,RugLightingContext} from './NeonRug';
const url=(name:string)=>`/models/modular-v2/${name}.glb`;
function Rug({position,size,color='#606671'}:{position:[number,number,number];size:[number,number];color?:string}){const geometry=useMemo(()=>{const [w,d]=size,r=.58,s=new THREE.Shape();s.moveTo(-w/2+r,-d/2);s.lineTo(w/2-r,-d/2);s.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);s.lineTo(w/2,d/2-r);s.quadraticCurveTo(w/2,d/2,w/2-r,d/2);s.lineTo(-w/2+r,d/2);s.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);s.lineTo(-w/2,-d/2+r);s.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const g=new THREE.ExtrudeGeometry(s,{depth:.018,bevelEnabled:true,bevelSize:.012,bevelThickness:.008,bevelSegments:2,curveSegments:12});g.rotateX(-Math.PI/2);return g},[size[0],size[1]]);return <group position={position}><mesh geometry={geometry} receiveShadow><meshStandardMaterial color={color} roughness={1}/></mesh><NeonRug size={size} seed={Math.abs(position[0]*.731+position[2]*.417)}/></group>}
function Plant({position,height=1.8}:{position:[number,number,number];height?:number}){return <ModularAsset url={url('schefflera')} height={height} position={position}/>}
export function AssembledOffice({onReady,motion=true,daylight=1}:{onReady:()=>void;motion?:boolean;daylight?:number}){
 useEffect(()=>onReady(),[onReady]);
 return <RugLightingContext.Provider value={{motion,daylight}}><group name="Modular_Office_v2">
  <RoomShell/><CleanArchitecture/><StaticDetails><OfficeProps/><DecorDetails/><BotanicalDetails/></StaticDetails><ModularChairs/><SoftFurnishings/>
  <Rug position={[-11,.025,1.1]} size={[4.4,5.25]} color="#835840"/>
  <Rug position={[-4.7,.025,9.65]} size={[3.1,2.6]} color="#64727a"/>
  {BENCHES.map((b,index)=><group key={b.id} name={`Workstation_${b.id}`}>
   <Rug position={[b.x,.025,b.z+.4]} size={[4.8,2.5]} color={index<2?'#596574':index===4?'#5c6963':'#70655f'}/>
   <ModularAsset url={url('work-desk')} width={4.25} position={[b.x,.055,b.z]}/>
   <GroundContact position={[b.x,.067,b.z]} size={[4.8,1.9]} opacity={.38}/>
   {[-1.05,1.05].map((x,i)=><group key={x}>
    {[-.43,.43].map((offset,j)=><group key={j} position={[b.x+x+offset,1.04,b.z+.035]} scale={.73}><Monitor rotation={j?-.08:.08} variant={index+i+j}/></group>)}
    <Keyboard position={[b.x+x,1.045,b.z+.56]}/>
    <DeskAccessories position={[b.x+x,1.04,b.z+.12]} variant={index+i}/>
    <Solid position={[b.x+x+.55,.38,b.z+.2]} size={[.23,.62,.46]} color="#2b3138"/>
    <Mug position={[b.x+x-.62,1.04,b.z+.35]}/>
   </group>)}
   <DeskLamp position={[b.x,1.04,b.z+.1]}/>
   <Plant position={[b.x+1.82,1.04,b.z-.03]} height={.47}/>
  </group>)}
  <Rug position={[-3.84,.025,-2.4]} size={[8.3,3.8]} color="#a29d91"/>
  <group position={[-3.84,.06,-2.4]} scale={[5.6/3.9,1,1]}><ModularAsset url={url('meeting-table')} width={3.9}/></group>
  <GroundContact position={[-3.84,.068,-2.4]} size={[6.3,2.15]} opacity={.37}/>
  {MEETING_SEATS.map(([x,z],i)=><ModularAsset key={i} url={url('meeting-chair')} height={1.23} position={[x,.06,z]} rotation={MEETING_FACINGS[i]-Math.PI/2}/>)}
  <Plant position={[-3.84,1.02,-2.4]} height={.45}/>
  <Rug position={[-9.3,.025,-4.6]} size={[4.8,4.2]} color="#5f6b79"/>
  <ModularAsset url={url('leather-sofa')} width={3.7} position={[-9.3,.06,-5.8]}/>
  <GroundContact position={[-9.3,.067,-5.7]} size={[4.3,1.8]} opacity={.47}/>
  <GroundContact position={[-9.3,.067,-4.15]} size={[2.4,1.5]} opacity={.24}/>
  <Rug position={[5.94,.025,-8.15]} size={[5.15,3.45]} color="#625e5a"/>
  <ModularAsset url={url('executive-desk')} width={3.65} position={[5.94,.06,-8.05]}/>
  <GroundContact position={[5.94,.067,-8.05]} size={[4.1,2.0]} opacity={.4}/>
  <ModularAsset url={url('executive-chair')} height={1.7} position={[5.94,.055,-8.9]} rotation={-Math.PI/2}/>
  <Monitor position={[4.95,1.13,-8.0]} rotation={Math.PI}/><Keyboard position={[5.6,1.15,-8.42]} rotation={Math.PI}/>
  <DeskLamp position={[7.25,1.12,-8.08]}/><Mug position={[6.4,1.13,-8.25]}/>
  {([[-12.65,-2.6],[-12.65,5.5],[-11.75,12],[-12.65,-5],[-11.7,-9.1],[-3.9,-9.25],[.1,-9.25],[2.5,-8.5],[9.7,-8.65],[10,-5.9],[10,-.25],[9.8,9.3],[-6.6,12.5],[-7.2,-5.8],[-7.3,-8.1]] as [number,number][]).map(([x,z],i)=><Plant key={i} position={[x,.035,z]} height={1.6+(i%3)*.22}/>)}
  {[2.1,3.7,5.4,6.8].map((x,i)=><Plant key={`front-${i}`} position={[x,.27,13]} height={1.15+(i%3)*.2}/>)}
 </group></RugLightingContext.Provider>
}
