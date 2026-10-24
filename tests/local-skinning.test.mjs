import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {skinHumanoid} from '../src/features/characters/local-skinning.mjs';
test('로컬 스켈레톤은 모든 정점의 정규화된 가중치와 유효한 본 인덱스를 만든다',()=>{
 const source=new THREE.Group();source.add(new THREE.Mesh(new THREE.BoxGeometry(.5,1.85,.3,5,24,4),new THREE.MeshStandardMaterial()));
 const {model,rig}=skinHumanoid(source,{facing:0});let count=0;
 model.traverse(o=>{if(!o.isSkinnedMesh)return;count++;const index=o.geometry.attributes.skinIndex,weight=o.geometry.attributes.skinWeight;for(let i=0;i<weight.count;i++){let sum=0;for(let k=0;k<4;k++){const w=weight.array[i*4+k];assert.ok(Number.isFinite(w)&&w>=0);assert.ok(index.array[i*4+k]<o.skeleton.bones.length);sum+=w}assert.ok(Math.abs(sum-1)<1e-5)}});
 assert.equal(count,1);assert.ok(rig.head.isBone);assert.ok(rig.legL.isBone);assert.ok(rig.forearmR.isBone);
});
