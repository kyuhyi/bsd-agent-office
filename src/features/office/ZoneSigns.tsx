'use client';
import {useEffect,useMemo} from 'react';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';
import {BENCHES} from './scene-layout.mjs';

function Plaque({position,label,color,width=2.9,posts=true}:{position:[number,number,number];label:string;color:string;width?:number;posts?:boolean}){
 const text=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d')!;x.font='700 162px Pretendard,sans-serif';x.fillStyle='#fff7e5';x.textAlign='center';x.textBaseline='middle';x.fillText(label,512,133);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t},[label]);
 useEffect(()=>()=>text.dispose(),[text]);
 return <group name={`Zone_sign_${label}`} position={position}>
  {posts&&[-width*.33,width*.33].map(x=><group key={x}><mesh position={[x,-.62,-.02]} castShadow><cylinderGeometry args={[.022,.025,1.06,12]}/><meshStandardMaterial color="#b59a65" metalness={.72} roughness={.35}/></mesh><mesh position={[x,-1.15,-.02]}><cylinderGeometry args={[.09,.1,.035,16]}/><meshStandardMaterial color="#9a835c" metalness={.65}/></mesh></group>)}
  <RoundedBox args={[width+.07,.79,.13]} radius={.09} smoothness={5} castShadow><meshStandardMaterial color="#b59a65" metalness={.65} roughness={.38}/></RoundedBox>
  <RoundedBox args={[width,.72,.145]} radius={.075} smoothness={5} castShadow><meshStandardMaterial color={color} roughness={.65}/></RoundedBox>
  <mesh position={[0,0,.078]}><planeGeometry args={[width-.12,.67]}/><meshBasicMaterial map={text} transparent toneMapped={false} depthWrite={false}/></mesh>
 </group>;
}
export function ZoneSigns(){return <group name="Readable_department_plaques">
 {BENCHES.map(b=><Plaque key={b.id} position={[b.x,2.22,b.z-.26]} label={b.team} color={b.color}/>)}
 <Plaque position={[-5.2,2.62,-5.12]} label="회의실" color="#5c686b" width={2.65} posts={false}/>
 <Plaque position={[7.9,3.18,-9.32]} label="대표실" color="#55515d" width={2.8} posts={false}/>
 </group>}
