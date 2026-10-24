import test from 'node:test';
import assert from 'node:assert/strict';
import {ROSTER} from '../src/features/characters/roster.mjs';
import {activityFor,LEISURE_SPOTS} from '../src/features/characters/staff-life.mjs';
import {HOMES,SCENE_OBSTACLES,MEETING_SEATS} from '../src/features/office/scene-layout.mjs';
import {manualRoute} from '../src/features/characters/character-control.mjs';
import {OWNER_HOME} from '../src/features/characters/character-control.mjs';
import {blocked} from '../src/features/characters/navigation.mjs';
import {interactionRequest} from '../src/features/characters/interaction-request.mjs';
test('11명 직원이 각자 중복 없는 자리와 실제 업무 요청 담당자를 갖는다',()=>{
 assert.equal(ROSTER.length,11);assert.equal(new Set(Object.values(HOMES).map(p=>p.join(','))).size,11);
 for(const member of ROSTER){assert.ok(HOMES[member.id]);assert.equal(interactionRequest({recipient:member.id,provider:member.provider,screen:'chat',kind:'analyze',draft:'안녕'}).roleId,member.id)}
});
test('회의실은 12석이며 대표가 왕복할 수 있고 인포 직원은 항상 휴식에서 제외된다',()=>{
 assert.equal(MEETING_SEATS.length,12);assert.equal(new Set(MEETING_SEATS.map(p=>p.join(','))).size,12);
 for(const [a,b] of [[OWNER_HOME,MEETING_SEATS[11]],[MEETING_SEATS[11],OWNER_HOME]])assert.deepEqual(manualRoute(a,b,'kyu').at(-1),b);
 const index=ROSTER.findIndex(m=>m.id==='nari');assert.equal(ROSTER[index].stationary,true);
 for(let t=0;t<1440;t++)assert.equal(activityFor(t,index,ROSTER.length,{stationary:true}),null);
});
test('휴식 순번은 동시에 세 명 이하이며 같은 게임기나 커피 자리를 차지하지 않는다',()=>{
 const seen=new Set();for(let t=0;t<1440;t+=1){const active=ROSTER.map((m,i)=>activityFor(t,i,ROSTER.length)).filter(Boolean);assert.ok(active.length<=3);assert.equal(new Set(active.map(a=>a.id)).size,active.length);active.forEach(a=>seen.add(a.kind))}
 assert.ok(seen.has('arcade'));assert.ok(seen.has('foosball'));assert.ok(seen.has('coffee'));
 assert.equal(activityFor(20,0,11,{working:true}),null);assert.equal(activityFor(20,0,11,{meeting:true}),null);assert.equal(activityFor(20,0,11,{manual:true}),null);
});
test('모든 직원은 가구를 통과하지 않고 모든 휴게 자리로 왕복할 수 있다',()=>{
 for(const [id,home] of Object.entries(HOMES))for(const spot of LEISURE_SPOTS)for(const [from,to] of [[home,spot.position],[spot.position,home]]){
  const route=manualRoute(from,to,id);assert.ok(route.length>1,`${id}:${spot.id}`);assert.deepEqual(route.at(-1),to);
  for(let i=1;i<route.length;i++)for(let j=0;j<=8;j++)assert.equal(blocked(route[i].map((v,k)=>route[i-1][k]+(v-route[i-1][k])*j/8),SCENE_OBSTACLES,.2),false,`${id}:${spot.id}`);
 }
});
