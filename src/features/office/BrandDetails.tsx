'use client';
import {useMemo,useRef} from 'react';
import {useTexture,Html,RoundedBox} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {cloneCharacter,usePremiumModel} from './PremiumAssets';
import {ZoneSigns} from './ZoneSigns';

function BrandPlaque({position,width=2.5,rotation=[0,0,0]}:{position:[number,number,number];width?:number;rotation?:[number,number,number]}){
 const logo=useTexture('/brand/bsd-color.png');
 return <group position={position} rotation={rotation}>
  <RoundedBox args={[width+.22,width/5.05+.18,.045]} radius={.035} smoothness={3}><meshStandardMaterial color="#eee9df" roughness={.4}/></RoundedBox>
  <mesh position={[0,0,.026]}><planeGeometry args={[width,width/5.05]}/><meshBasicMaterial map={logo} transparent toneMapped={false}/></mesh>
 </group>;
}
export function BrandDetails(){
 return <group>
  <BrandPlaque position={[-.31,.61,10.17]} width={1.75}/>
  <ZoneSigns/>
 </group>;
}

export function OwnerAvatar({motion}:{motion:boolean}){
 const {scene}=usePremiumModel();
 const model=useMemo(()=>{const source=scene.getObjectByName('CHAR_kyu');if(!source)return null;const seated=cloneCharacter(source);const pose=(part:string,x:number)=>{const joint=seated.getObjectByName(`kyu_${part}`);if(joint)joint.rotation.x=x};pose('legL',-1.43);pose('legR',-1.43);pose('shinL',1.43);pose('shinR',1.43);pose('armL',-.7);pose('armR',-.7);pose('forearmL',-.55);pose('forearmR',-.55);const body=seated.getObjectByName('kyu_body');if(body)body.position.y=-.18;return seated},[scene]);
 const time=useRef(0);
 useFrame((_,dt)=>{if(!model||!motion)return;time.current+=Math.min(dt,.05);const t=time.current;
  const head=model.getObjectByName('kyu_head'),body=model.getObjectByName('kyu_body'),arm=model.getObjectByName('kyu_armR');
  if(head){head.rotation.y=Math.sin(t*.5)*.09;head.rotation.x=.1;}if(body)body.position.y=-.18+Math.sin(t*2)*.006;
  if(arm)arm.rotation.x=-.7+Math.sin(t*7)*.025;
 });
 if(!model)return null;
 return <group name="Owner_Seated" position={[5.94,.06,-8.9]} rotation={[0,0,0]}>
  <primitive object={model}/>
  <Html position={[0,1.97,0]} center zIndexRange={[10,0]} style={{pointerEvents:'none'}}><div className="owner-label">대표 · 퍼널띵</div></Html>
 </group>;
}

