'use client';
import {useMemo} from 'react';
import * as THREE from 'three';
import {Solid} from './RoomShell';
import {DeskLamp} from './DeskEquipment';

export function Mug({position=[0,0,0]}:{position?:[number,number,number]}){return <group position={position}>
 <mesh position={[0,.06,0]} castShadow><cylinderGeometry args={[.065,.055,.12,20,1,true]}/><meshStandardMaterial color="#e3ddd0" roughness={.3} side={THREE.DoubleSide}/></mesh>
 <mesh position={[.066,.07,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.035,.012,8,16]}/><meshStandardMaterial color="#e3ddd0" roughness={.3}/></mesh>
 <mesh position={[0,.105,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.057,20]}/><meshStandardMaterial color="#3b2418" roughness={.22}/></mesh>
 </group>}
function CoffeeBar(){return <group name="Coffee_bar" position={[-7.2,0,-9.3]}>
 <Solid size={[6.2,.12,1.05]} position={[0,1.05,0]} color="#ac7950"/>
 {[-2.7,2.7].map(x=><Solid key={x} size={[.12,1.02,.8]} position={[x,.51,0]} color="#70513b"/>)}
 {[-2.1,-.7,.7,2.1].map(x=><group key={x} position={[x,0,.85]}><mesh position={[0,.72,0]} castShadow><cylinderGeometry args={[.28,.26,.12,32]}/><meshStandardMaterial color="#a6603d" roughness={.48}/></mesh>{[-.16,.16].flatMap(a=>[-.16,.16].map(b=><Solid key={`${a}/${b}`} size={[.035,.66,.035]} position={[a,.33,b]} color="#4a4440" metal={.5}/>))}<mesh position={[0,.25,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.22,.013,6,24]}/><meshStandardMaterial color="#8f7b60" metalness={.6}/></mesh></group>)}
 <group position={[-2.1,1.12,-.05]}><Solid size={[.6,.55,.4]} position={[0,.275,0]} color="#30363b" metal={.6}/><Solid size={[.42,.055,.25]} position={[0,.16,.3]} color="#b2b5b6" metal={.85}/><Solid size={[.4,.04,.1]} position={[0,.37,.23]} color="#a3a6a7" metal={.85}/><Mug position={[-.1,.2,.28]}/></group>
 {[-.6,1.7].map(x=><Mug key={x} position={[x,1.12,.05]}/>)}
 <group position={[.7,1.13,.05]}><mesh rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.3,32]}/><meshStandardMaterial color="#d9cbb5" roughness={.3}/></mesh>{[-.14,.02,.17].map((x,i)=><mesh key={x} position={[x,.055,(i%2)*.12-.05]} rotation={[0,0,.2]} castShadow><sphereGeometry args={[.075,12,8]}/><meshStandardMaterial color={i===1?'#cda449':'#9c4933'} roughness={.4}/></mesh>)}</group>
 <group position={[-1.35,1.13,-.1]}>{[0,1,2,3].map(i=><mesh key={i} position={[0,i*.025,0]}><cylinderGeometry args={[.14,.12,.025,24]}/><meshStandardMaterial color="#e5ddcd" roughness={.27}/></mesh>)}</group>
 </group>}
function Bookshelf(){return <group name="Library" position={[8.05,0,-9.7]}>
 {[-1.85,1.85].map(x=><Solid key={x} size={[.1,2.9,.65]} position={[x,1.45,0]} color="#725238"/>)}
 {[.1,.8,1.5,2.2,2.9].map(y=><Solid key={y} size={[3.8,.1,.7]} position={[0,y,0]} color="#936846"/>)}
 <Solid size={[3.8,2.9,.04]} position={[0,1.45,-.32]} color="#4d3c2f"/>
 {Array.from({length:32},(_,i)=>{const row=Math.floor(i/8),col=i%8;return <Solid key={i} size={[.15+(i%2)*.04,.39+(i%3)*.055,.32]} position={[-1.55+col*.43,.35+row*.7,.04]} color={['#828e83','#ba9e77','#4b6275','#965848','#d6c6a4'][i%5]} radius={.005}/>})}
 </group>}
function Arcade({position,color}:{position:[number,number,number];color:string}){
 const screen=useMemo(()=>{const c=document.createElement('canvas');c.width=256;c.height=192;const ctx=c.getContext('2d')!;ctx.fillStyle='#10162f';ctx.fillRect(0,0,256,192);ctx.strokeStyle='#283966';for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(128+(i-4)*12,80);ctx.lineTo((i-1)*42,192);ctx.stroke()}for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(0,80+i*i*3);ctx.lineTo(256,80+i*i*3);ctx.stroke()}ctx.fillStyle='#d6e5f0';ctx.font='bold 11px Pretendard';ctx.fillText('HI 024800',12,18);for(let row=0;row<3;row++)for(let col=0;col<6;col++){ctx.fillStyle=['#b576c8','#70c9d5','#efbc66'][row];ctx.fillRect(25+col*37,36+row*21,17,9);ctx.fillRect(29+col*37,31+row*21,9,6)}ctx.fillStyle='#75dbdf';ctx.fillRect(117,146,22,8);ctx.fillRect(125,138,6,17);ctx.fillStyle='#f3c267';ctx.fillRect(128,111,3,12);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t},[]);
 const shape=useMemo(()=>{const s=new THREE.Shape();s.moveTo(-.45,0);s.lineTo(.45,0);s.lineTo(.45,1.18);s.lineTo(.25,1.35);s.lineTo(.32,2.05);s.lineTo(-.42,2.05);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:.7,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2});g.rotateY(Math.PI/2);g.translate(-.35,0,0);return g},[]);
 return <group position={position} name="Arcade_machine">
 <mesh geometry={shape} castShadow receiveShadow><meshStandardMaterial color="#24232d" roughness={.45}/></mesh>
 <Solid size={[.75,.2,.08]} position={[0,1.93,.43]} color={color}/>
 <Solid size={[.64,.51,.05]} position={[0,1.5,.48]} color="#0c1e39"/>
 <mesh position={[0,1.5,.512]}><planeGeometry args={[.57,.44]}/><meshBasicMaterial map={screen} toneMapped={false}/></mesh>
 <Solid size={[.74,.08,.27]} position={[0,1.17,.55]} color={color}/>
 <mesh position={[-.18,1.25,.57]}><sphereGeometry args={[.045,12,8]}/><meshStandardMaterial color="#e04339"/></mesh>
 {[.1,.22].map(x=><mesh key={x} position={[x,1.23,.57]}><cylinderGeometry args={[.035,.035,.025,12]}/><meshStandardMaterial color="#edc560"/></mesh>)}
 </group>;
}
function Foosball(){return <group name="Foosball" position={[-10.05,0,2.6]}>
 <Solid size={[2.5,.32,1.4]} position={[0,.95,0]} color="#986443"/>
 <Solid size={[2.25,.03,1.16]} position={[0,1.12,0]} color="#266450"/>
 {[-1.08,1.08].flatMap(x=>[-.55,.55].map(z=><Solid key={`${x}/${z}`} size={[.14,.85,.14]} position={[x,.42,z]} color="#584434"/>))}
 {[-1.15,1.15].map(x=><Solid key={x} size={[.04,.18,1.3]} position={[x,1.17,0]} color="#be905d"/>)}
 {[-.65,.65].map(z=><Solid key={z} size={[2.45,.18,.06]} position={[0,1.17,z]} color="#be905d"/>)}
 {Array.from({length:6},(_,i)=><group key={i} position={[-.9+i*.36,1.26,0]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.014,.014,1.95,8]}/><meshStandardMaterial color="#c2c7c9" metalness={.9} roughness={.18}/></mesh>{[-.35,0,.35].map(z=><Solid key={z} size={[.08,.16,.09]} position={[0,-.04,z]} color={i%2?'#d7d3b8':'#df6949'}/>)}</group>)}
 <mesh position={[0,1.15,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.23,.245,24]}/><meshBasicMaterial color="#d3dfcd"/></mesh>
 </group>}
export function OfficeProps(){return <group name="Independent_office_objects"><CoffeeBar/><Bookshelf/><Arcade position={[-11.85,0,-.8]} color="#355ba6"/><Arcade position={[-10.8,0,-.8]} color="#96568e"/><Foosball/>
 <group position={[-9.3,0,-4.15]}><Solid size={[1.9,.1,1.1]} position={[0,.56,0]} color="#dad9d3" radius={.1}/>{[-.7,.7].flatMap(x=>[-.36,.36].map(z=><Solid key={`${x}/${z}`} size={[.065,.53,.065]} position={[x,.26,z]} color="#b1986b" metal={.6}/>))}<Mug position={[.4,.62,.1]}/></group>
 <DeskLamp position={[-1.6,1.13,9.4]}/>
 </group>}
