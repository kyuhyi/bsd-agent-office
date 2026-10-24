'use client';
import {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {Bounds,OrbitControls,useGLTF,Environment} from '@react-three/drei';
function GeneratedRoom(){const {scene}=useGLTF('/models/bsd-gpt-tripo-v1.glb');return <primitive object={scene}/>}
export default function Review(){return <main style={{position:'fixed',inset:0,background:'#152338'}}><Canvas orthographic camera={{position:[0,2,.001],zoom:800}} gl={{antialias:true}}><color attach="background" args={['#152338']}/><ambientLight intensity={.9}/><directionalLight position={[1,3,2]} intensity={2}/><Suspense fallback={null}><Environment preset="city"/><GeneratedRoom/></Suspense><OrbitControls makeDefault/></Canvas></main>}
