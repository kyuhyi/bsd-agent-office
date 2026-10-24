import test from 'node:test';
import assert from 'node:assert/strict';
import {manualRoute,validDestination,OWNER_HOME} from '../src/features/characters/character-control.mjs';
import {HOMES,SCENE_OBSTACLES} from '../src/features/office/scene-layout.mjs';
import {blocked} from '../src/features/characters/navigation.mjs';
test('가구 위와 사무실 밖 목적지는 거절한다',()=>{
 assert.equal(validDestination([99,0]),false);assert.equal(validDestination([NaN,0]),false);
 for(const o of SCENE_OBSTACLES)assert.equal(validDestination([o.x,o.z]),false);
 assert.equal(validDestination([0,0]),true);
});
test('대표와 직원 전원이 통로로 나와 걸어갔다가 자기 좌석으로 돌아간다',()=>{
 for(const [id,home] of Object.entries({...HOMES,kyu:OWNER_HOME})){
  for(const [from,to] of [[home,[0,0]],[[0,0],home]]){
   const route=manualRoute(from,to,id);assert.ok(route.length>1,id);assert.deepEqual(route.at(-1),to);
   for(let i=1;i<route.length;i++)for(let j=0;j<=12;j++){
    const p=route[i].map((v,k)=>route[i-1][k]+(v-route[i-1][k])*j/12);
    assert.equal(blocked(p,SCENE_OBSTACLES,.09),false,`${id}: ${p}`);
   }
  }
 }
});
