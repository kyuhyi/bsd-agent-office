import test from 'node:test';
import assert from 'node:assert/strict';
import {PET_STOPS,petRoute} from '../src/features/pets/pet-life.mjs';
import {ambientSpeech} from '../src/features/characters/ambient-speech.mjs';
import {ROSTER} from '../src/features/characters/roster.mjs';
import {SCENE_OBSTACLES} from '../src/features/office/scene-layout.mjs';
import {validDestination} from '../src/features/characters/character-control.mjs';
import {blocked} from '../src/features/characters/navigation.mjs';

test('반려동물의 모든 산책 구간은 바닥 안에 있고 가구를 관통하지 않는다',()=>{
 for(const start of PET_STOPS)for(const end of PET_STOPS){
  assert.ok(validDestination(end),String(end));const route=petRoute(start,end);assert.deepEqual(route.at(-1),end);
  for(let i=1;i<route.length;i++)for(let j=0;j<=12;j++)assert.equal(blocked(route[i].map((v,k)=>route[i-1][k]+(v-route[i-1][k])*j/12),SCENE_OBSTACLES,.2),false);
 }
});
test('일상 말풍선은 한 번에 한 명만 표시하며 실제 실행 중에는 표시하지 않는다',()=>{
 const speakers=new Set();for(let t=0;t<360;t+=.5){const active=ROSTER.map((m,i)=>({id:m.id,text:ambientSpeech(t,i,ROSTER.length,{})})).filter(v=>v.text);assert.ok(active.length<=1);active.forEach(v=>speakers.add(v.id));}
 assert.equal(speakers.size,ROSTER.length);
 for(let t=0;t<180;t++)assert.equal(ambientSpeech(t,0,11,{working:true}),null);
});
