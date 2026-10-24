'use client';
import {useMemo} from 'react';
import * as THREE from 'three';
import {Solid} from './RoomShell';
import {LeafPlant} from './BotanicalDetails';
import {Mug} from './OfficeProps';
import {GroundContact} from './Atmosphere';

export function BookStack({position,rotation=0}:{position:[number,number,number];rotation?:number}){return <group position={position} rotation={[0,rotation,0]}>
 {['#506d78','#c6bba4','#ac6d4f'].map((color,i)=><group key={i} position={[i*.018,i*.055,0]} rotation={[0,i*.09,0]}><Solid size={[.36,.05,.25]} position={[0,.025,0]} color={color} radius={.004}/><Solid size={[.33,.027,.252]} position={[.005,.025,0]} color="#e5ddc9" radius={.002}/></group>)}
 </group>}
export function DeskAccessories({position,variant=0}:{position:[number,number,number];variant?:number}){return <group position={position}>
 <Solid size={[.81,.009,.38]} position={[0,.007,.31]} color={variant%2?'#6f6352':'#33454e'} radius={.03}/>
 <BookStack position={[-.7,.01,.28]} rotation={-.15}/>
 <mesh position={[.71,.085,.2]} castShadow><cylinderGeometry args={[.055,.055,.16,16]}/><meshStandardMaterial color="#aa8e60" metalness={.6} roughness={.35}/></mesh>
 {[0,1,2].map(i=><mesh key={i} position={[.69+i*.019,.19,.2]} rotation={[0,0,(i-1)*.13]} castShadow><cylinderGeometry args={[.005,.005,.22,6]}/><meshStandardMaterial color={i%2?'#ccb995':'#263644'}/></mesh>)}
 <Solid size={[.13,.015,.24]} position={[.7,.015,.48]} color="#25343e" radius={.015}/>
 </group>}

function RefreshmentCabinet(){return <group position={[-12.55,0,-3.9]} rotation={[0,Math.PI/2,0]} name="Refreshment_cabinet">
 <GroundContact position={[0,.015,0]} size={[3.8,1.4]} opacity={.45}/>
 <group position={[-1.05,0,0]}>
  <Solid size={[.88,1.85,.72]} position={[0,.96,0]} color="#242b30" metal={.6}/>
  <Solid size={[.72,1.57,.04]} position={[0,.95,.37]} color="#6b7578" metal={.8}/>
  <Solid size={[.63,1.42,.06]} position={[0,.97,.399]} color="#14282d" metal={.45}/>
  {[.37,.78,1.19].map((y,row)=><group key={y}><Solid size={[.62,.035,.035]} position={[0,y,.44]} color="#c0c9c9" metal={.7}/>{[-.21,0,.21].map((x,i)=><group key={x} position={[x,y+.14,.435]}><mesh castShadow><cylinderGeometry args={[.052,.052,.22,12]}/><meshStandardMaterial color={['#acb977','#72a8aa','#cc9b61'][(row+i)%3]} metalness={.4} roughness={.3}/></mesh><mesh position={[0,.117,0]}><cylinderGeometry args={[.025,.025,.025,10]}/><meshStandardMaterial color="#d1d2c7" metalness={.8}/></mesh></group>)}</group>)}
  <Solid size={[.035,1.24,.04]} position={[.33,.99,.46]} color="#bdc6c9" metal={.85}/>
  <mesh position={[-.3,.97,.447]}><planeGeometry args={[.012,1.36]}/><meshBasicMaterial color="#c9ebdf"/></mesh>
 </group>
 <Solid size={[1.95,1.02,.78]} position={[.49,.53,0]} color="#835b3d"/>
 <Solid size={[2.04,.07,.88]} position={[.49,1.075,0]} color="#dbd3c0" roughness={.28}/>
 {[0,1,2].map(i=><group key={i}><Solid size={[.6,.88,.025]} position={[-.15+i*.64,.54,.41]} color="#99704d"/><Solid size={[.19,.025,.035]} position={[-.15+i*.64,.88,.44]} color="#c5a66b" metal={.75}/></group>)}
 <Solid size={[1.97,.56,.09]} position={[.49,1.4,-.35]} color="#714d36"/>
 <Solid size={[2.02,.045,.32]} position={[.49,1.72,-.23]} color="#a37a52"/>
 {[-.24,.16,.56,.96].map((x,i)=><group key={x} position={[x,1.14,-.04]}><mesh position={[0,.16,0]} castShadow><cylinderGeometry args={[.115,.12,.32,20]}/><meshStandardMaterial color={['#a27f48','#c4aa72','#705239','#b8b098'][i]} roughness={.5}/></mesh><mesh position={[0,.335,0]}><cylinderGeometry args={[.12,.12,.035,20]}/><meshStandardMaterial color="#beac87" metalness={.4}/></mesh></group>)}
 <BookStack position={[.92,1.75,-.23]}/><LeafPlant position={[-.13,1.75,-.23]} height={.5} seed={4}/>
 <Mug position={[.45,1.12,.27]}/>
 </group>}

function Dartboard(){const rings=useMemo(()=>{
 const parts:{geometry:THREE.RingGeometry;color:string}[]=[];
 for(let i=0;i<20;i++)for(const [inner,outer,thin] of [[.06,.25,0],[.25,.275,1],[.275,.43,0],[.43,.455,1]]){
  parts.push({geometry:new THREE.RingGeometry(inner,outer,4,1,i*Math.PI/10,Math.PI/10-.009),color:thin?(i%2?'#af523d':'#4e7455'):(i%2?'#d5c3a0':'#292d2b')});
 }return parts;
 },[]);
 return <group position={[-13.02,0,.15]} rotation={[0,Math.PI/2,0]} name="Darts_lounge">
 <Solid size={[2.6,1.75,.15]} position={[0,.99,0]} color="#71482e"/>
 {Array.from({length:14},(_,i)=><Solid key={i} size={[.025,1.7,.03]} position={[-1.22+i*.188,.99,.09]} color="#a57b50" radius={.003}/>)}
 <mesh position={[.42,1.2,.11]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.49,.49,.065,48]}/><meshStandardMaterial color="#8b7251" metalness={.7}/></mesh>
 <group position={[.42,1.2,.15]}>{rings.map((r,i)=><mesh key={i} geometry={r.geometry}><meshStandardMaterial color={r.color} roughness={.9}/></mesh>)}<mesh><circleGeometry args={[.054,24]}/><meshStandardMaterial color="#a94836"/></mesh></group>
 <Solid size={[.5,.7,.035]} position={[-.72,1.22,.11]} color="#23342f"/>
 {[0,1,2,3].map(i=><Solid key={i} size={[.31,.009,.004]} position={[-.72,1.4-i*.11,.131]} color="#a3ad91" radius={.001}/>)}
 <Solid size={[2.7,.09,.48]} position={[0,.3,.17]} color="#a47c52"/>
 <Mug position={[-.8,.35,.18]}/>
 </group>;
}
function Jukebox(){const outline=useMemo(()=>{
 const s=new THREE.Shape();s.moveTo(-.46,0);s.lineTo(.46,0);s.lineTo(.46,1.12);s.absarc(0,1.12,.46,0,Math.PI,false);s.closePath();
 return new THREE.ExtrudeGeometry(s,{depth:.5,bevelEnabled:true,bevelSegments:3,bevelSize:.045,bevelThickness:.035,curveSegments:32});
 },[]);return <group position={[-12,0,1.1]} name="Vintage_jukebox">
 <mesh geometry={outline} castShadow receiveShadow><meshStandardMaterial color="#5b3430" metalness={.25} roughness={.36}/></mesh>
 <mesh position={[0,1.12,.55]}><torusGeometry args={[.365,.038,8,40,Math.PI]}/><meshStandardMaterial color="#edc570" emissive="#ef9d39" emissiveIntensity={.7} metalness={.45}/></mesh>
 {[-.365,.365].map(x=><mesh key={x} position={[x,.65,.55]}><cylinderGeometry args={[.038,.038,.95,12]}/><meshStandardMaterial color="#edc570" emissive="#efa239" emissiveIntensity={.7}/></mesh>)}
 <Solid size={[.57,.45,.025]} position={[0,.9,.55]} color="#222d3b"/>
 {[0,1,2,3,4].map(i=><Solid key={i} size={[.48,.025,.03]} position={[0,.75+i*.075,.57]} color={i%2?'#c6ad8b':'#bd6591'}/>)}
 <Solid size={[.57,.48,.04]} position={[0,.34,.55]} color="#af8a4d"/>
 {Array.from({length:8},(_,i)=><Solid key={i} size={[.018,.43,.012]} position={[-.23+i*.066,.34,.58]} color="#423d31" radius={.002}/>)}
 <Solid size={[.66,.08,.08]} position={[0,.62,.58]} color="#c7ae77" metal={.7}/>
 <GroundContact position={[0,.012,.2]} size={[1.5,1.1]} opacity={.4}/>
 </group>}
function FloorLamp({position}:{position:[number,number,number]}){return <group position={position}>
 <mesh position={[0,.045,0]} castShadow><cylinderGeometry args={[.25,.29,.09,32]}/><meshStandardMaterial color="#8d7854" metalness={.8} roughness={.3}/></mesh>
 <mesh position={[0,.94,0]} castShadow><cylinderGeometry args={[.022,.025,1.85,12]}/><meshStandardMaterial color="#b39a69" metalness={.8} roughness={.26}/></mesh>
 <mesh position={[0,1.86,0]} castShadow><cylinderGeometry args={[.26,.43,.46,40,1,true]}/><meshStandardMaterial color="#e9d8b6" emissive="#db9d53" emissiveIntensity={.22} roughness={.9} side={THREE.DoubleSide}/></mesh>
 <pointLight position={[0,1.66,0]} color="#ffd29a" intensity={4} distance={3.5}/>
 </group>}
function Lantern({position}:{position:[number,number,number]}){return <group position={position}>
 <Solid size={[.43,.42,.43]} position={[0,.21,0]} color="#7f5837"/>
 <Solid size={[.35,.035,.35]} position={[0,.44,0]} color="#baa16f" metal={.7}/>
 <mesh position={[0,.65,0]}><cylinderGeometry args={[.095,.095,.34,20]}/><meshStandardMaterial color="#fff0cb" emissive="#ffd18e" emissiveIntensity={2}/></mesh>
 <Solid size={[.24,.04,.24]} position={[0,.84,0]} color="#bda16c" metal={.7}/>
 </group>}
export function DecorDetails(){return <group name="Hospitality_details">
 <RefreshmentCabinet/><Dartboard/><Jukebox/>
 <FloorLamp position={[-7.08,0,-4.4]}/><FloorLamp position={[8.65,0,-8.65]}/>
 {([[-12.35,10.8],[-7,12.82],[.8,13],[7.9,13],[10.1,8.2]] as [number,number][]).map(([x,z])=><Lantern key={`${x}/${z}`} position={[x,.02,z]}/>)}
 <BookStack position={[-9.7,.62,-4.2]} rotation={.18}/><LeafPlant position={[-9.2,.62,-4.4]} height={.43}/>
 <BookStack position={[7.1,1.14,-8.3]}/>
 {[-4.65,-3.4,-2.6].map((x,i)=><group key={x}><Solid size={[.39,.018,.28]} position={[x,1.035,-2.06]} color={i%2?'#435c65':'#b4a18b'}/><Mug position={[x+.26,1.04,-2.18]}/></group>)}
 <group position={[-5.2,1.5,-5.08]}>
  {[-.85,-.35,.15,.65].map((x,i)=><group key={x}><Solid size={[.32,.21,.008]} position={[x,.26,0]} color={['#cfb88c','#91aaac','#c89580','#b3bd9b'][i]} radius={.003}/><Solid size={[.23,.14,.008]} position={[x,-.06,0]} color="#d5cdba" radius={.003}/></group>)}
 </group>
 </group>}
