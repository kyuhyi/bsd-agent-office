import fs from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const bytes=await fs.readFile('public/models/modular-v2/kyu-rigged.glb');
const loader=new GLTFLoader();loader.register(()=>({name:'audit-no-images',loadTexture:()=>Promise.resolve(new THREE.Texture())}));
const gltf=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
gltf.scene.updateMatrixWorld(true);
const box=new THREE.Box3().setFromObject(gltf.scene);console.log('bounds',box.min.toArray(),box.max.toArray());
for(const name of ['Armature','Hips','Head','LeftArm','LeftForeArm','LeftHand','LeftUpLeg','LeftLeg','LeftFoot']){const o=gltf.scene.getObjectByName(name);console.log(name,o.getWorldPosition(new THREE.Vector3()).toArray(),o.getWorldScale(new THREE.Vector3()).toArray())}
