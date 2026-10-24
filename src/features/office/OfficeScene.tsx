'use client';
import { Component,Suspense,useCallback,useEffect,useRef,useState,type ReactNode } from 'react';
import { Canvas,useFrame,useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitType } from 'three-stdlib';
import { TEAM } from '../characters/team';
import { SkinnedStaff as PremiumCharacter } from '../characters/SkinnedStaff';
import { StudioEnvironment } from './PremiumAssets';
import { BrandDetails } from './BrandDetails';
import {SeatedOwner} from '../characters/SeatedOwner';
import {SceneDiagnostics} from './SceneDiagnostics';
import {AssembledOffice} from './AssembledOffice';
import {PracticalLighting} from './Atmosphere';
import {OfficeBackdrop} from '../environment/OfficeBackdrop';
import type {useOfficeEnvironment} from '../environment/useOfficeEnvironment';
import type { OfficeTask } from './types';
import {ROOM} from './scene-layout.mjs';
import {MovementTarget} from '../characters/MovementTarget';
import {OfficePets} from '../pets/OfficePets';
import type {CharacterCommands} from '../characters/control-types';

class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<div className="scene-fallback"><b>3D 화면을 시작하지 못했어요.</b><p>브라우저의 하드웨어 가속을 켜주세요. 오른쪽 팀원 목록과 아래 업무 지시는 계속 사용할 수 있습니다.</p></div>:this.props.children}}

function CameraRig({view,selected,zoomStep,movingActor}:{view:string;selected:string;zoomStep:number;movingActor:boolean}){
 const controls=useRef<OrbitType>(null),{camera,size,gl}=useThree(),goal=useRef({position:new THREE.Vector3(18,17.32,24),target:new THREE.Vector3(0,.3,0),zoom:35}),moving=useRef(true);
 useEffect(()=>{
  const person=TEAM.find(t=>t.id===selected)??{desk:[5.94,-8.9]};
  // 가로로 긴 창에서는 시선을 낮춰 뒤쪽 기둥과 앞쪽 바닥이 잘리지 않게 한다.
  const wide=THREE.MathUtils.clamp((size.width/size.height-1.35)/.45,0,1);
  const target=view==='focus'?new THREE.Vector3(person.desk[0],.7,person.desk[1]):view==='meeting'?new THREE.Vector3(-3.6,.7,-2.3):new THREE.Vector3(ROOM.centerX,3.3,ROOM.centerZ);
  const offset=view==='overview'?new THREE.Vector3(22,22-wide*3,22):new THREE.Vector3(8,6,10);
  const base=Math.min(size.width/37,size.height/(28-wide*3));
  goal.current={position:target.clone().add(offset),target,zoom:Math.max(10,Math.min(100,base*(view==='overview'?.93:1.85)+zoomStep*6))};moving.current=true;gl.domElement.dataset.cameraReady='false';
 },[view,selected,zoomStep,size.width,size.height,gl]);
 useFrame((_,delta)=>{
  if(!controls.current||!moving.current)return;
  const alpha=1-Math.exp(-5*Math.min(delta,.06));camera.position.lerp(goal.current.position,alpha);controls.current.target.lerp(goal.current.target,alpha);
  const ortho=camera as THREE.OrthographicCamera;ortho.zoom=THREE.MathUtils.lerp(ortho.zoom,goal.current.zoom,alpha);ortho.updateProjectionMatrix();controls.current.update();
  if(camera.position.distanceTo(goal.current.position)<.01&&Math.abs(ortho.zoom-goal.current.zoom)<.05){moving.current=false;gl.domElement.dataset.cameraReady='true';}
 });
 return <OrbitControls ref={controls} makeDefault enabled={!movingActor} enableDamping dampingFactor={.08} minZoom={10} maxZoom={100} minPolarAngle={.35} maxPolarAngle={1.25} maxDistance={50} onStart={()=>{moving.current=false;gl.domElement.dataset.cameraReady='true'}} target={[0,.4,0]}/>;
}
export default function OfficeScene({environment,selected,onSelect,tasks,night,motion,meeting,view,zoomStep,commands,movingActor,onDestination,onMoveError}:{environment:ReturnType<typeof useOfficeEnvironment>;selected:string;onSelect:(id:string)=>void;tasks:OfficeTask[];night:boolean;motion:boolean;meeting:boolean;view:string;zoomStep:number;commands:CharacterCommands;movingActor:string|null;onDestination:(p:number[])=>void;onMoveError:(message:string)=>void}){
 const [loaded,setLoaded]=useState(false);
 const ready=useCallback(()=>setLoaded(true),[]);
 return <SceneBoundary><div className={`canvas-shell ${night?'night':''}`}>
  <OfficeBackdrop background={environment.background} phase={environment.lighting.phase} daylight={environment.lighting.daylight}/>
  {!loaded?<div className="scene-loading"><span className="loader"/>사무실의 문을 여는 중…</div>:null}
  <Canvas style={{position:'absolute',inset:0,zIndex:1}} shadows={{type:THREE.PCFShadowMap}} dpr={[1,1.5]} orthographic camera={{position:[18,20.52,24],zoom:32,near:.1,far:100}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#152537',0);gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.9}}>
   
   <StudioEnvironment night={night} daylight={environment.lighting.daylight}/>
   <hemisphereLight args={['#c7dbeb','#64503c',.32+environment.lighting.daylight*.1]}/>
   <directionalLight position={[-9,15,-4]} intensity={1.8+environment.lighting.daylight*.7} color="#ffe8cc" castShadow shadow-mapSize={[2048,2048]} shadow-camera-near={.5} shadow-camera-far={48} shadow-camera-left={-19} shadow-camera-right={19} shadow-camera-top={17} shadow-camera-bottom={-17} shadow-normalBias={.018} shadow-bias={-.0001} shadow-radius={5} shadow-intensity={.88}/>
   <directionalLight position={[8,7,6]} intensity={.34+environment.lighting.daylight*.16} color="#bfd7f0"/>
   <PracticalLighting night={night} daylight={environment.lighting.daylight}/>
   <Suspense fallback={null}>
    <AssembledOffice onReady={ready} motion={motion} daylight={environment.lighting.daylight}/>
    <OfficePets motion={motion}/>
    <BrandDetails/><SeatedOwner meeting={meeting} motion={motion} command={commands.kyu} selected={selected==='kyu'} onSelect={()=>onSelect('kyu')}/>
    {TEAM.map((member,index)=><PremiumCharacter key={member.id} member={member} index={index} command={commands[member.id]} selected={selected===member.id} working={tasks.some(t=>t.roleId===member.id&&t.status==='running')} meeting={meeting&&!tasks.some(t=>t.roleId===member.id&&t.status==='running')} motion={motion} onSelect={()=>onSelect(member.id)}/>)}
    <MovementTarget actor={movingActor} onDestination={onDestination} onError={onMoveError}/>
   </Suspense>
   <SceneDiagnostics/>
   <CameraRig view={view} selected={selected} zoomStep={zoomStep} movingActor={!!movingActor}/>
  </Canvas>
 </div></SceneBoundary>
}
