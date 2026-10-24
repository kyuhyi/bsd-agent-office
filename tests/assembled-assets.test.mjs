import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const ledger=JSON.parse(await fs.readFile(new URL('../docs/modular-generation-ledger.json',import.meta.url),'utf8'));
test('승인된 9종 자산은 각각 독립된 유효 PBR GLB이며 제작비 합계가 승인 한도 내다',async()=>{
 assert.equal(ledger.jobs.length,9);assert.equal(new Set(ledger.jobs.map(j=>j.name)).size,9);assert.ok(ledger.jobs.reduce((n,j)=>n+j.cost,0)<=ledger.furnitureAndStaffCeiling);
 for(const {name} of ledger.jobs){const b=await fs.readFile(new URL(`../public/models/modular-v2/${name}.glb`,import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF',name);assert.equal(b.readUInt32LE(8),b.length);const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));assert.ok(j.images.length>=3);assert.ok(j.materials[0].normalTexture);assert.ok(j.materials[0].pbrMetallicRoughness.baseColorTexture);for(const m of j.meshes)for(const p of m.primitives){const a=j.accessors[p.attributes.POSITION];assert.ok(a.count>1000);assert.ok(a.max.every((v,i)=>Number.isFinite(v)&&v>a.min[i]))}}
});
test('리깅 입력은 원본 KYU 메시 수와 PBR 이미지를 유지하고 정면 축만 교정한다',async()=>{
 const read=async n=>{const b=await fs.readFile(new URL(`../public/models/modular-v2/${n}.glb`,import.meta.url));return JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)))};
 const before=await read('kyu-static'),after=await read('kyu-forward');assert.deepEqual(after.images,before.images);assert.deepEqual(after.materials,before.materials);const a=before.accessors[1],b=after.accessors[1];assert.equal(a.count,b.count);assert.ok(Math.abs((a.max[0]-a.min[0])-(b.max[2]-b.min[2]))<1e-5);
});
