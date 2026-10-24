import test from 'node:test';
import assert from 'node:assert/strict';
import { safeArtifactPath, redact, parseProviderLine, canTransition, validateLocalRequest, parseDeliverable } from '../services/runner/contracts.mjs';

test('결과 경로의 상위 폴더·절대 경로·비밀 파일 접근을 차단한다', () => {
  for (const name of ['../outside.txt', '/etc/file', 'C:\\temp\\file', '.env', 'a/../../b', 'a/.env.local', 'a:ads', 'node_modules/a', 'a\\b', 'CON.txt']) {
    assert.throws(() => safeArtifactPath(name), name);
  }
  assert.equal(safeArtifactPath('src/index.html'), 'src/index.html');
});
test('민감한 토큰과 환경 변수 값이 화면 이벤트에 남지 않는다', () => {
  const clean = redact('Bearer abc123secret ANTHROPIC_API_KEY=really-secret sk-ant-1234567890abcdefghijk');
  assert.ok(!clean.includes('abc123secret'));
  assert.ok(!clean.includes('really-secret'));
  assert.ok(!clean.includes('1234567890abcdefghijk'));
});
test('깨진 JSON과 도구 상태를 실제 모델 답변으로 오인하지 않는다', () => {
  assert.equal(parseProviderLine('codex', '{broken'), null);
  assert.equal(parseProviderLine('codex', JSON.stringify({type:'item.completed',item:{type:'command_execution',aggregated_output:'secret'}}))?.text, undefined);
  assert.equal(parseProviderLine('codex', JSON.stringify({type:'item.completed',item:{type:'agent_message',text:'완료'}})).text, '완료');
  assert.equal(parseProviderLine('claude', JSON.stringify({type:'result',is_error:true,result:'인증 실패'})).kind, 'error');
});
test('종료된 업무가 늦게 도착한 이벤트로 부활하지 않는다', () => {
  assert.equal(canTransition('cancelled', 'review'), false);
  assert.equal(canTransition('failed', 'running'), false);
  assert.equal(canTransition('running', 'review'), true);
  assert.equal(canTransition('review', 'approved'), true);
});
test('외부 웹사이트와 잘못된 인증값으로 로컬 작업을 시작하지 못한다', () => {
  const headers = {host:'127.0.0.1:43140',origin:'http://127.0.0.1:43140','x-office-token':'correct'};
  assert.equal(validateLocalRequest(headers,'correct',43140), true);
  assert.equal(validateLocalRequest({...headers,origin:'https://evil.test'},'correct',43140), false);
  assert.equal(validateLocalRequest({...headers,host:'evil.test:43140'},'correct',43140), false);
  assert.equal(validateLocalRequest({...headers,'x-office-token':'wrong'},'correct',43140), false);
});
test('구조화된 코드 결과만 새 파일로 만들고 잘못된 경로는 거절한다', () => {
  assert.deepEqual(parseDeliverable('```json\n{"summary":"완료","files":[{"path":"index.html","content":"hello"}]}\n```').files[0],{path:'index.html',content:'hello'});
  assert.throws(()=>parseDeliverable('{"summary":"a","files":[{"path":"../evil","content":"b"}]}'));
  assert.equal(parseDeliverable('분석 결과입니다').summary,'분석 결과입니다');
});
