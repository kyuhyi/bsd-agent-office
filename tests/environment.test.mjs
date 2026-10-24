import test from 'node:test';
import assert from 'node:assert/strict';
import {lightingAt,sanitizeEnvironment,BACKGROUNDS} from '../src/features/environment/environment.mjs';
test('한국 시간의 밤·아침·낮·노을 경계와 날짜 변경을 구분한다',()=>{
 const at=t=>lightingAt(new Date(`2026-10-24T${t}:00+09:00`),'auto');
 for(const [t,phase] of [['00:00','night'],['05:59','night'],['06:00','dawn'],['08:00','day'],['16:59','day'],['17:00','dusk'],['19:00','night'],['23:59','night']])assert.equal(at(t).phase,phase,t);
 assert.equal(lightingAt(new Date('2026-10-23T23:00:00Z'),'auto').phase,'day');
 assert.ok(at('06:00').daylight<at('07:00').daylight);assert.ok(at('17:00').daylight>at('18:00').daylight);
});
test('고정 낮·밤은 현재 시간을 따르지 않고 잘못된 저장값은 기본값으로 복구한다',()=>{
 assert.equal(lightingAt(new Date('2026-10-24T23:00:00+09:00'),'day').daylight,1);
 assert.equal(lightingAt(new Date('2026-10-24T12:00:00+09:00'),'night').daylight,0);
 assert.deepEqual(sanitizeEnvironment({background:'bad',mode:'bad'}),{background:'new-york',mode:'auto'});
 assert.deepEqual(sanitizeEnvironment({background:'forest',mode:'night'}),{background:'forest',mode:'night'});
 assert.equal(new Set(BACKGROUNDS.map(b=>b.id)).size,4);
});
