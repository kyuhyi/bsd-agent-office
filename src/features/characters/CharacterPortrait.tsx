'use client';
import {Suspense,useRef,useMemo,useState,useEffect} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import {PerspectiveCamera,View,useGLTF} from '@react-three/drei';
import {useGeneratedStaff} from './useGeneratedStaff';
import {prepareSeatedRig} from './seated-rig.mjs';

function OwnerPortrait(){
 const {scene}=useGLTF('/models/modular-v2/kyu-rigged.glb');
 const {model,bones,standing}=useMemo(()=>{const rig=prepareSeatedRig(scene);for(const [name,bone] of Object.entries(rig.bones))bone.quaternion.copy(rig.standing[name]);rig.bones.Hips.position.copy(rig.standingHips);return rig},[scene]);
 const clock=useRef(0);useFrame((_,dt)=>{clock.current+=Math.min(dt,.05);bones.Head.quaternion.copy(standing.Head);bones.Head.rotateY(Math.sin(clock.current*.55)*.04)});
 return <primitive object={model}/>;
}

function PortraitModel({id,large}:{id:string;large:boolean}){
 const {model,rig}=useGeneratedStaff(id);
 const clock=useRef(0);
 useFrame((_,delta)=>{clock.current+=Math.min(delta,.05);rig.head.rotation.y=Math.sin(clock.current*.55)*.1;});
 return <group rotation={[0,large?-.22:-.12,0]}><primitive object={model}/></group>;
}
export function CharacterPortrait({id,large=false,face=false}:{id:string;large?:boolean;face?:boolean}){
 const element=useRef<HTMLElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{if(!element.current)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting&&entry.intersectionRatio>.98),{threshold:[0,.98,1]});observer.observe(element.current);return()=>observer.disconnect()},[]);
 const eye=id==='kyu'?1.73:['sora','yuna','aria','lia','nari'].includes(id)?1.49:1.58;
 return <View ref={element} visible={visible} className={`character-portrait ${large?'portrait-large':''} ${face?'portrait-face':''}`}><Suspense fallback={null}>
  <PerspectiveCamera makeDefault position={face?[.08,eye,3.2]:large?[1.8,1.6,4.3]:[.25,1.5,3.4]} fov={face?16:large?29:21} onUpdate={c=>c.lookAt(0,face?eye:large?.95:1.35,0)}/>
  <ambientLight intensity={1.1}/><directionalLight position={[-3,5,5]} intensity={2.7} color="#ffead2"/><directionalLight position={[3,3,-2]} intensity={2.2} color="#a8c8ff"/>
  {id==='kyu'?<OwnerPortrait/>:<PortraitModel id={id} large={large}/>}
  {large?<mesh rotation={[-Math.PI/2,0,0]} position={[0,-.03,0]}><circleGeometry args={[.72,64]}/><meshStandardMaterial color="#28323e" roughness={.5} metalness={.45}/></mesh>:null}
 </Suspense></View>;
}
// 스크롤로 이동한 작은 얼굴의 이전 프레임이 유리창 위에 남지 않게 한다.
function ClearPortraitFrame(){useFrame(({gl})=>{gl.setScissorTest(false);gl.clear(true,true,true)},0);return null}
// 목록과 대화 얼굴을 하나의 WebGL 컨텍스트에서 렌더링한다.
export function PortraitRenderer(){return <div className="portrait-renderer global-portraits" aria-hidden="true"><Canvas dpr={[1,1.5]} gl={{alpha:true,antialias:true}} eventSource={undefined}><ClearPortraitFrame/><View.Port/></Canvas></div>}
