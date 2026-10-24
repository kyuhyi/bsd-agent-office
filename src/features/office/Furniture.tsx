'use client';
import { RoundedBox } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';

type V=[number,number,number];
export function Box({size,position=[0,0,0],color='#e7dece',radius=.04,...props}:{size:V;position?:V;color?:string;radius?:number}&Omit<ThreeElements['group'],'position'>){return <group {...props} position={position}><RoundedBox args={size} radius={radius} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.72}/></RoundedBox></group>}
export function Plant({position,scale=1}:{position:V;scale?:number}){return <group position={position} scale={scale}>
 <mesh position={[0,.24,0]} castShadow><cylinderGeometry args={[.26,.2,.48,16]}/><meshStandardMaterial color="#e7dfcd" roughness={.9}/></mesh>
 <mesh position={[0,.485,0]}><cylinderGeometry args={[.23,.23,.015,16]}/><meshStandardMaterial color="#524533"/></mesh>
 {[0,1,2,3,4,5,6,7].map(i=>{const a=i*2.4;return <group key={i} rotation={[Math.sin(a)*.4,a,Math.cos(a)*.4]} position={[0,.48,0]}><mesh position={[0,.27,0]}><cylinderGeometry args={[.012,.017,.6,5]}/><meshStandardMaterial color="#52664a"/></mesh><mesh position={[.12,.47,0]} rotation={[0,0,-.6]} scale={[.15,.32,.055]} castShadow><sphereGeometry args={[1,8,8]}/><meshStandardMaterial color={i%2?'#69815b':'#3e684c'} roughness={.8}/></mesh></group>})}
 </group>}
export function Chair({position,color='#70877d',rotation=0}:{position:V;color?:string;rotation?:number}){return <group position={position} rotation={[0,rotation,0]}>
 <Box size={[.6,.12,.58]} position={[0,.53,0]} color={color} radius={.08}/><Box size={[.6,.55,.12]} position={[0,.87,-.27]} color={color} radius={.08}/>
 <mesh position={[0,.28,0]}><cylinderGeometry args={[.045,.045,.5,10]}/><meshStandardMaterial color="#48504b" metalness={.5} roughness={.4}/></mesh>
 {[0,1,2,3,4].map(i=><group key={i} rotation={[0,i*Math.PI*.4,0]}><Box size={[.055,.05,.38]} position={[0,.09,.13]} color="#555b55" radius={.015}/><mesh position={[0,.06,.3]}><sphereGeometry args={[.055,8,8]}/><meshStandardMaterial color="#3c4240"/></mesh></group>)}
 </group>}
export function Desk({x,z,color,working}:{x:number;z:number;color:string;working:boolean}){return <group position={[x,0,z]} rotation={[0,Math.PI,0]}>
 <Box size={[2.7,.12,1.15]} position={[0,.94,0]} color="#d4b68e" radius={.08}/>
 {[-1.12,1.12].map(side=><Box key={side} size={[.12,.9,.8]} position={[side,.45,0]} color="#4d5b52" radius={.02}/>)}
 <Box size={[.55,.7,.85]} position={[.88,.37,0]} color="#e5ddcd" radius={.045}/>
 {[.26,.47,.68].map(y=><Box key={y} size={[.32,.025,.025]} position={[.88,y,.44]} color="#a29d8b" radius={.008}/>)}
 <Box size={[1.1,.07,.55]} position={[-.2,1.015,.28]} color="#87978b" radius={.045}/>
 <Box size={[.28,.04,.2]} position={[-.18,1.03,-.25]} color="#5b645e"/>
 <Box size={[.05,.35,.045]} position={[-.18,1.2,-.3]} color="#5b645e" radius={.01}/>
 <Box size={[1.08,.65,.055]} position={[-.18,1.49,-.3]} color="#303e3b" radius={.045}/>
 <mesh position={[-.18,1.49,-.268]}><planeGeometry args={[.97,.54]}/><meshStandardMaterial color={working?'#283e40':'#37544f'} emissive={working?'#6fa7a0':'#44665e'} emissiveIntensity={working?.45:.12}/></mesh>
 {Array.from({length:6},(_,i)=><Box key={i} size={[.18+(i%3)*.14,.018,.008]} position={[-.46+(i%2)*.06,1.67-i*.065,-.259]} color={i%2?'#88b5a4':'#dab987'} radius={.003}/>)}
 <Box size={[.65,.035,.22]} position={[-.25,1.066,.3]} color="#e6e8dc" radius={.025}/>
 <Box size={[.12,.05,.17]} position={[.25,1.07,.32]} color="#ebece1" radius={.04}/>
 <Plant position={[-1.03,1.01,-.27]} scale={.29}/>
 <mesh position={[.65,1.1,.24]}><cylinderGeometry args={[.085,.07,.18,12]}/><meshStandardMaterial color={color}/></mesh>
 <mesh position={[.74,1.1,.24]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.052,.015,6,12]}/><meshStandardMaterial color={color}/></mesh>
 <Chair position={[0,0,1.12]} color={color} rotation={Math.PI}/>
 </group>}
export function OfficeRoom({night}:{night:boolean}){return <group>
 <Box size={[18.9,.45,12.9]} position={[0,-.29,0]} color="#bca888" radius={.2}/>
 <Box size={[18.65,.12,12.65]} position={[0,-.03,0]} color="#e3d2b7" radius={.1}/>
 {Array.from({length:31},(_,i)=><Box key={i} size={[.018,.005,12.3]} position={[-9+i*.6,.033,0]} color="#d1bc9c" radius={.001}/>)}
 <Box size={[18.7,.12,.15]} position={[0,.13,6.3]} color="#f7e9d2"/>
 <Box size={[.15,.12,12.6]} position={[9.3,.13,0]} color="#f7e9d2"/>
 <Box size={[18.7,.75,.22]} position={[0,.38,-6.25]} color="#e8dfcc" radius={.04}/>
 <Box size={[.22,.75,12.5]} position={[-9.25,.38,0]} color="#e8dfcc" radius={.04}/>
 {Array.from({length:9},(_,i)=><group key={i} position={[-8.3+i*2.07,0,-6.23]}>
  <mesh position={[0,2.35,0]}><boxGeometry args={[1.95,3.1,.04]}/><meshStandardMaterial color={night?'#748b9f':'#b7d2cc'} transparent opacity={.24} roughness={.15} metalness={.2}/></mesh>
  <Box size={[.055,3.85,.1]} position={[-1.02,2.2,0]} color="#55665e" radius={.01}/>
  <Box size={[2.07,.055,.09]} position={[0,2.5,0]} color="#55665e" radius={.01}/>
 </group>)}
 {Array.from({length:5},(_,i)=><group key={i} position={[-9.23,0,-5+i*2.4]}>
  <mesh position={[0,2.35,0]}><boxGeometry args={[.04,3.1,2.3]}/><meshStandardMaterial color="#bdd3cd" transparent opacity={.19} roughness={.15}/></mesh>
  <Box size={[.1,3.85,.06]} position={[0,2.2,-1.2]} color="#55665e" radius={.01}/>
 </group>)}
 <Box size={[18.8,.12,.18]} position={[0,4.1,-6.23]} color="#54655d"/>
 <Box size={[.18,.12,12.6]} position={[-9.23,4.1,0]} color="#54655d"/>
 {/* 도시 실루엣도 실제 입체 기하로 구성한다. */}
 {Array.from({length:12},(_,i)=>{const h=1.5+((i*7)%11)*.28;return <group key={i} position={[-8.3+i*1.45,-1,-8.3-(i%3)*.5]}><Box size={[.85,h,.8]} position={[0,h/2,0]} color={night?'#8b9ba5':'#c0cbbd'} radius={.02}/>{[0,1,2].map(j=><Box key={j} size={[.08,.12,.01]} position={[-.22+j*.22,h*.65,.41]} color={night?'#f1d69e':'#d0d8cd'} radius={.005}/>)}</group>})}
 {/* 건축 기둥과 벽면 조명 */}
 {[-8.6,3.8,8.6].map(x=><group key={x} position={[x,0,-5.8]}><Box size={[.34,3.9,.38]} position={[0,1.95,0]} color="#ebe1ce" radius={.06}/><Box size={[.13,1.1,.07]} position={[0,2,.22]} color="#d8bd87" radius={.02}/><pointLight position={[0,2,.45]} intensity={night?1.5:.4} color="#ffd6a1" distance={4}/></group>)}
 <Box size={[3.3,2.9,.3]} position={[6.45,1.45,-5.65]} color="#526a5c" radius={.07}/>
 {[.5,1.4,2.3].map(y=><group key={y}><Box size={[3.05,.07,.55]} position={[6.45,y,-5.39]} color="#bc9b74"/>{[0,1,2,3,4,5].map(i=><Box key={i} size={[.14,.32+(i%2)*.1,.28]} position={[5.15+i*.24,y+.22,-5.36]} color={['#d4c5ac','#b88165','#8ba092'][i%3]} radius={.01}/>)}</group>)}
 <Plant position={[7.55,2.34,-5.35]} scale={.42}/>
 <Plant position={[-8.4,0,-4.7]} scale={1.3}/><Plant position={[8.35,0,-4.65]} scale={1.25}/><Plant position={[8.3,0,5.35]} scale={1.3}/><Plant position={[-8.25,0,5.35]} scale={1.1}/>
 <Box size={[4.6,.035,2.9]} position={[-5.8,.05,3.2]} color="#c9caba" radius={.18}/>
 <Box size={[3.5,.4,1.05]} position={[-5.8,.43,4]} color="#dcba94" radius={.18}/>
 <Box size={[3.5,.65,.23]} position={[-5.8,.84,4.43]} color="#e3c6a4" radius={.1}/>
 {[-7.4,-4.2].map(x=><Box key={x} size={[.23,.6,1.05]} position={[x,.72,4]} color="#e3c6a4" radius={.1}/>)}
 {[-6.9,-5.8,-4.7].map(x=><Box key={x} size={[.95,.16,.79]} position={[x,.71,3.95]} color="#eddbc0" radius={.1}/>)}
 <Box size={[.48,.48,.18]} position={[-6.8,1,4.12]} rotation={[.2,0,-.2]} color="#71907a" radius={.1}/>
 <Box size={[.48,.48,.18]} position={[-4.7,1,4.12]} rotation={[.2,0,.2]} color="#bd8064" radius={.1}/>
 <Box size={[1.8,.12,.75]} position={[-5.7,.5,2.5]} color="#ac8560" radius={.17}/>
 {[-6.3,-5.1].map(x=><Box key={x} size={[.1,.45,.45]} position={[x,.23,2.5]} color="#81694f"/>)}
 <Plant position={[-5.4,.57,2.5]} scale={.25}/><Box size={[.4,.04,.3]} position={[-6,.58,2.5]} color="#f0e8d8"/>
 <Box size={[4.5,.03,3.6]} position={[5.8,.055,2.5]} color="#bfcfc7" radius={.25}/>
 <Box size={[3.25,.14,1.65]} position={[5.9,.92,2.5]} color="#bd9670" radius={.28}/>
 {[-1,1].map(s=><Box key={s} size={[.18,.88,1.1]} position={[5.9+s,.44,2.5]} color="#566b5e"/>)}
 {[-1,0,1].map(i=><group key={i}><Chair position={[5.9+i*.95,0,1.3]} color="#b59d7e"/><Chair position={[5.9+i*.95,0,3.7]} color="#b59d7e" rotation={Math.PI}/></group>)}
 <Plant position={[5.9,1,2.5]} scale={.3}/>
 <Box size={[.65,.04,.45]} position={[4.95,1.02,2.5]} color="#e5e0d1"/>
 <Box size={[.75,.045,.5]} position={[6.9,1.02,2.5]} color="#596f66"/>
 {/* 낮은 유리 파티션으로 회의실과 작업 공간을 나눈다. */}
 <mesh position={[3.65,1.2,3]}><boxGeometry args={[.04,2.4,3.9]}/><meshStandardMaterial color="#c6ded5" transparent opacity={.14} roughness={.1}/></mesh>
 {[1.05,4.95].map(z=><Box key={z} size={[.05,2.5,.05]} position={[3.65,1.25,z]} color="#6a7c70" radius={.01}/>)}
 <Box size={[.05,.05,3.95]} position={[3.65,2.5,3]} color="#6a7c70" radius={.01}/>
 <Box size={[3.1,1.05,.8]} position={[-.8,.55,5]} color="#e5d4b7" radius={.15}/>
 {Array.from({length:19},(_,i)=><Box key={i} size={[.045,.85,.04]} position={[-2.2+i*.155,.53,5.42]} color="#b9a27e" radius={.01}/>)}
 <Box size={[3.2,.09,.9]} position={[-.8,1.11,5]} color="#f2e9d8" radius={.06}/><Plant position={[.35,1.16,5]} scale={.38}/>
 <Box size={[.7,.4,.06]} position={[-1.35,1.39,5]} color="#56675b" radius={.045}/>
 <mesh position={[-1.35,1.1,5]}><cylinderGeometry args={[.045,.045,.4,8]}/><meshStandardMaterial color="#80785f"/></mesh>
 <Plant position={[2.2,0,5.4]} scale={.9}/>
 {[-5.8,-2,1.8].map(x=><group key={x} position={[x,0,-2.3]}><mesh position={[0,3.9,0]}><cylinderGeometry args={[.012,.012,1.3,6]}/><meshStandardMaterial color="#6a6b59"/></mesh><mesh position={[0,3.2,0]} castShadow><cylinderGeometry args={[.42,.57,.18,24]}/><meshStandardMaterial color="#d6c4a3"/></mesh><mesh position={[0,3.1,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.48,24]}/><meshBasicMaterial color="#fff3ce"/></mesh></group>)}
 </group>}
