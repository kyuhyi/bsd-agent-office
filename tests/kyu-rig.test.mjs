import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {prepareSeatedRig} from '../src/features/characters/seated-rig.mjs';
test('KYU 실제 24개 본과 스킨을 보존하며 앉은 자세의 크기·팔다리 방향이 정상이다',async()=>{
 const b=await fs.readFile(new URL('../public/models/modular-v2/kyu-rigged.glb',import.meta.url));const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));assert.equal(j.skins.length,1);assert.equal(j.skins[0].joints.length,24);assert.equal(j.images.length,3);assert.ok(j.meshes[0].primitives[0].attributes.WEIGHTS_0!==undefined);
 const loader=new GLTFLoader();loader.register(()=>({name:'test-no-images',loadTexture:()=>Promise.resolve(new THREE.Texture())}));const gltf=await loader.parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');const {model,bones,rest,standing,standingHips,seatedHips,swingAxes}=prepareSeatedRig(gltf.scene);model.updateMatrixWorld(true);model.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.update();o.computeBoundingBox()}});
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());assert.ok(size.x<2&&size.y>1&&size.y<2.2&&size.z<2,JSON.stringify(size));
 const knee=bones.LeftLeg.getWorldPosition(new THREE.Vector3()),hip=bones.LeftUpLeg.getWorldPosition(new THREE.Vector3()),foot=bones.LeftFoot.getWorldPosition(new THREE.Vector3());assert.ok(knee.z>hip.z+.2);assert.ok(foot.y<knee.y-.2);
 // 서기·앉기 사이의 모든 혼합 자세가 유한하고 관절의 크기를 바꾸지 않는다.
 for(const weight of [0,.25,.5,.75,1]){
  for(const [name,bone] of Object.entries(bones)){bone.quaternion.copy(standing[name]).slerp(rest[name],weight);assert.ok(Math.abs(bone.quaternion.length()-1)<1e-6);assert.ok(Math.abs(swingAxes[name].length()-1)<1e-6);}
  bones.Hips.position.copy(standingHips).lerp(seatedHips,weight);model.updateMatrixWorld(true);
  assert.ok(bones.Head.getWorldPosition(new THREE.Vector3()).toArray().every(Number.isFinite));
  if(weight===0){const elbow=bones.LeftForeArm.getWorldPosition(new THREE.Vector3()),shoulder=bones.LeftArm.getWorldPosition(new THREE.Vector3());assert.ok(elbow.y<shoulder.y-.1);assert.ok(bones.LeftLeg.getWorldPosition(new THREE.Vector3()).y<bones.LeftUpLeg.getWorldPosition(new THREE.Vector3()).y-.1);}
 }
});
