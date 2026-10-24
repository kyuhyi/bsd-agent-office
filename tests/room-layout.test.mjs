import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ROOM,BENCHES,SCENE_OBSTACLES,HOMES} from '../src/features/office/scene-layout.mjs';
test('실제 바닥은 정사각형이고 모든 좌석과 가구가 그 안에 배치된다',()=>{
 assert.equal(ROOM.width,ROOM.depth);
 for(const p of Object.values(HOMES)){assert.ok(p[0]>ROOM.minX&&p[0]<ROOM.maxX);assert.ok(p[1]>ROOM.minZ&&p[1]<ROOM.maxZ);}
 for(const o of SCENE_OBSTACLES){assert.ok(o.x-o.w/2>=ROOM.minX&&o.x+o.w/2<=ROOM.maxX);assert.ok(o.z-o.d/2>=ROOM.minZ&&o.z+o.d/2<=ROOM.maxZ);}
 assert.equal(BENCHES.find(b=>b.id==='devB').team,'디자인팀');
 assert.equal(BENCHES.filter(b=>b.team==='개발팀').length,1);
});
