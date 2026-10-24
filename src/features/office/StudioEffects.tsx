'use client';
import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';

// 가구 틈과 발밑에 간접 그림자를 더해 공간의 실제 깊이가 보이게 한다.
export function StudioEffects(){
 const {gl,scene,camera,size}=useThree(),composer=useRef<EffectComposer|null>(null);
 useEffect(()=>{
  if(size.width<600)return;
  const effects=new EffectComposer(gl);effects.setPixelRatio(Math.min(gl.getPixelRatio(),1.25));effects.setSize(size.width,size.height);
  const ao=new SSAOPass(scene,camera,size.width,size.height,16);ao.kernelRadius=.7;ao.minDistance=.001;ao.maxDistance=.12;
  const beauty=new RenderPass(scene,camera),output=new OutputPass();effects.addPass(beauty);effects.addPass(ao);effects.addPass(output);composer.current=effects;
  return()=>{composer.current=null;beauty.dispose();ao.dispose();output.dispose();effects.dispose()};
 },[gl,scene,camera,size.width,size.height]);
 useFrame(()=>{if(composer.current)composer.current.render();else gl.render(scene,camera)},1);
 return null;
}
