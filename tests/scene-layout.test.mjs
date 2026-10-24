import test from 'node:test';
import assert from 'node:assert/strict';
import {HOMES,MEETING_SEATS,SCENE_OBSTACLES,BREAK_POINTS} from '../src/features/office/scene-layout.mjs';
import {findPath,blocked} from '../src/features/characters/navigation.mjs';
test('모든 직원이 가구를 피해 자기 자리와 회의 좌석 사이를 이동할 수 있다',()=>{
 Object.values(HOMES).forEach((home,i)=>{
  const route=findPath(home,MEETING_SEATS[i],SCENE_OBSTACLES);
  assert.ok(route.length>1,'회의 경로가 존재해야 한다');
  assert.deepEqual(route.at(-1),MEETING_SEATS[i]);
  for(const point of route)assert.equal(blocked(point,SCENE_OBSTACLES),false);
 });
});
test('소품과 외곽 화단을 추가해도 모든 직원의 휴식 왕복과 회의 전환 경로가 열린다',()=>{
 Object.values(HOMES).forEach((home,i)=>{
  for(const [from,to] of [[home,BREAK_POINTS[i]],[BREAK_POINTS[i],home],[BREAK_POINTS[i],MEETING_SEATS[i]]]){
   const route=findPath(from,to,SCENE_OBSTACLES);
   assert.deepEqual(route.at(-1),to,`직원 ${i} 이동 경로`);
   for(let step=0;step<route.length-1;step++){
    const a=route[step],b=route[step+1];
    for(let sample=0;sample<=10;sample++)assert.equal(blocked([a[0]+(b[0]-a[0])*sample/10,a[1]+(b[1]-a[1])*sample/10],SCENE_OBSTACLES),false);
   }
  }
 });
});
