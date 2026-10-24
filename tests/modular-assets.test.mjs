import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for(const asset of ['task-chair','kyu-static'])test(`${asset}: 독립 고품질 메시와 세 PBR 텍스처를 보존한다`,async()=>{
 const b=await readFile(new URL(`../public/models/modular-v2/${asset}.glb`,import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(8),b.length);assert.ok(b.length<25*1024*1024);
 const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));assert.equal(j.meshes.length,1);assert.equal(j.images.length,3);
 const p=j.meshes[0].primitives[0],a=j.accessors[p.attributes.POSITION];assert.ok(a.max[1]-a.min[1]>.9);assert.ok(a.count>50000);assert.ok(j.materials[0].normalTexture);
 assert.equal(j.skins?.length||0,0,'현재 원본은 정적 모델이며 리깅된 모델로 잘못 표시하지 않는다');
});
