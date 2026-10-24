import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('고급 사무실 GLB에 여섯 팀원 관절과 실제 가구가 포함된다',async()=>{
 const bytes=await readFile(new URL('../public/models/bsd-new-york.glb',import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'glTF');
 assert.equal(bytes.readUInt32LE(4),2);
 assert.equal(bytes.readUInt32LE(8),bytes.length);
 assert.ok(bytes.length<35*1024*1024,'웹 모델 용량이 35 MB를 넘지 않아야 한다');
 const json=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
 const names=new Set(json.nodes.map(n=>n.name));
 for(const id of ['eden','sora','yuna','leo','noah','june']){
  for(const part of ['body','head','eyes','armL','armR','legL','legR','shinL','shinR'])assert.ok(names.has(`${id}_${part}`),`${id} ${part} 누락`);
 }
 assert.ok(json.meshes.length>30,'분리된 실제 3D 모델이어야 한다');
 assert.ok([...names].some(n=>n.startsWith('PRP_sofa_seat')));
 assert.ok([...names].some(n=>n.startsWith('PRP_botanical_leaf')));
 for(const texture of json.images||[])assert.ok(texture.bufferView!==undefined,'외부 텍스처 누락을 막기 위해 GLB에 포함한다');
});
