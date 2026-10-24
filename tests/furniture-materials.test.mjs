import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createFurnitureMaterial,furnitureFinish} from '../src/features/office/furniture-materials.mjs';

test('가구 재질 보정은 원본 PBR 맵을 보존하고 공유 원본을 변경하지 않는다',()=>{
 const source=new THREE.MeshStandardMaterial({roughness:.3,metalness:1});source.map=new THREE.Texture();source.normalMap=new THREE.Texture();source.roughnessMap=new THREE.Texture();source.metalnessMap=source.roughnessMap;
 const adjusted=createFurnitureMaterial(source,'leather');
 assert.notEqual(adjusted,source);assert.equal(adjusted.map,source.map);assert.equal(adjusted.normalMap,source.normalMap);assert.equal(adjusted.roughnessMap,source.roughnessMap);assert.equal(source.roughness,.3);assert.equal(source.normalScale.x,1);
 const shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:['color_fragment','roughnessmap_fragment','metalnessmap_fragment','lights_physical_fragment'].map(n=>`#include <${n}>`).join('\n')};
 adjusted.onBeforeCompile(shader);assert.match(shader.fragmentShader,/surfaceMask/);assert.match(shader.fragmentShader,/roughnessFactor/);assert.match(shader.fragmentShader,/metalnessFactor/);assert.ok(adjusted.normalScale.x<source.normalScale.x);
});
test('소파·회의 의자는 가죽, 업무 의자는 패브릭으로 선택하고 책상은 기존 마감을 유지한다',()=>{
 assert.equal(furnitureFinish('/models/modular-v2/leather-sofa.glb'),'leather');assert.equal(furnitureFinish('/models/modular-v2/meeting-chair.glb'),'leather');assert.equal(furnitureFinish('/models/modular-v2/task-chair.glb'),'fabric');assert.equal(furnitureFinish('/models/modular-v2/work-desk.glb'),null);
});
