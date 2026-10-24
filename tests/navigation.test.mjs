import test from 'node:test';
import assert from 'node:assert/strict';
import { findPath, blocked, advanceAlongPath } from '../src/features/characters/navigation.mjs';

test('직원이 책상을 통과하지 않고 통로로 이동한다', () => {
  const obstacles=[{x:0,z:0,w:3,d:2}];
  const path=findPath([-3,0],[3,0],obstacles);
  assert.ok(path.length>2);
  assert.ok(path.every(p=>!blocked(p,obstacles)));
  assert.deepEqual(path.at(-1),[3,0]);
});
test('프레임 속도가 달라도 같은 거리만 이동하며 목적지를 지나치지 않는다', () => {
  let a=[0,0],b=[0,0];
  for(let i=0;i<60;i++) a=advanceAlongPath(a,[2,0],1/60,1);
  for(let i=0;i<30;i++) b=advanceAlongPath(b,[2,0],1/30,1);
  assert.ok(Math.abs(a[0]-b[0])<0.001);
  assert.deepEqual(advanceAlongPath([1.99,0],[2,0],1,10),[2,0]);
});
