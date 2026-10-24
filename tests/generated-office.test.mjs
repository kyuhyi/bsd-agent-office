import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('GPT 이미지에서 생성한 Tripo 모델은 텍스처·입체 메시를 포함한 독립 GLB다',async()=>{
 const b=await readFile(new URL('../public/models/bsd-gpt-tripo-v1.glb',import.meta.url));
 assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(8),b.length);
 const j=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
 const p=j.meshes[0].primitives[0],a=j.accessors[p.attributes.POSITION];
 assert.ok(a.count>100000);assert.ok(a.max[1]-a.min[1]>.1,'평면 이미지가 아닌 높이 있는 메시');
 const m=j.materials[p.material];assert.ok(m.pbrMetallicRoughness.baseColorTexture);assert.ok(m.pbrMetallicRoughness.metallicRoughnessTexture);assert.ok(m.normalTexture);
 assert.ok(j.images.length>=3);for(const image of j.images)assert.notEqual(image.bufferView,undefined);
});
