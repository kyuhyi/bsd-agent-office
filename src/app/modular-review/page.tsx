'use client';
import {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {ModularAsset} from '../../features/office/ModularAsset';
import {StudioEnvironment} from '../../features/office/PremiumAssets';
export default function ModularReview(){return <main style={{position:'fixed',inset:0,background:'#111923'}}><Canvas shadows camera={{position:[2.6,2.2,4.9],fov:36}}><color attach="background" args={['#111923']}/><ambientLight intensity={.6}/><directionalLight position={[-3,5,4]} intensity={2.2} color="#ffebd5" castShadow/><directionalLight position={[3,3,-1]} intensity={1.4} color="#b5ccf5"/><StudioEnvironment night={false}/><Suspense fallback={null}><ModularAsset url="/models/modular-v2/task-chair.glb" height={1.3} position={[-.9,0,0]}/><ModularAsset url="/models/modular-v2/kyu-static.glb" height={1.8} position={[.75,0,0]} rotation={-Math.PI/2}/></Suspense><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.015,0]} receiveShadow><circleGeometry args={[3.3,96]}/><meshStandardMaterial color="#242e3b" roughness={.65}/></mesh><OrbitControls target={[0,.85,0]} minDistance={2} maxDistance={8}/></Canvas></main>}
