'use client';
import {useEffect} from 'react';
import {useTexture} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
export function NewYorkBackground(){
 const texture=useTexture('/environment/new-york-harbor.png'),{scene}=useThree();
 useEffect(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.repeat.set(1,.65);texture.offset.set(0,.08);texture.updateMatrix();scene.background=texture;return()=>{scene.background=null}},[texture,scene]);
 return null;
}
