import test from 'node:test';
import assert from 'node:assert/strict';
import {loginArguments,loginMessage} from '../services/runner/login.mjs';

test('로그인 실행은 구독 계정 명령만 허용한다',()=>{
 assert.deepEqual(loginArguments('claude'),['auth','login','--claudeai']);
 assert.deepEqual(loginArguments('codex'),['login']);
 assert.throws(()=>loginArguments('cmd'),/제공자/);
});
test('로그인 응답에 CLI 원문과 인증값을 노출하지 않는다',()=>{
 const value=loginMessage({status:'failed',output:'access_token=secret',error:'secret'});
 assert.equal(value.status,'failed');assert.ok(!JSON.stringify(value).includes('secret'));
});
