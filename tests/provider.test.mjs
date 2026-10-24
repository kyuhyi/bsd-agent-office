import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { runProvider } from '../services/runner/provider.mjs';
const config={command:process.execPath,prefix:[path.resolve('tests/fixtures/mock-cli.mjs')]};
test('실제 프로세스의 쪼개진 UTF-8 스트림도 한글을 보존한다',async()=>{
 const result=await new Promise(resolve=>runProvider('claude',config,'text',process.cwd(),()=>{},resolve));
 assert.equal(result.code,0);assert.equal(result.answer,'한국어 응답 정상');
});
test('중지하면 작업 프로세스와 자식 프로세스가 함께 종료된다',{skip:process.platform!=='win32',timeout:15000},async()=>{
 let childPid;
 const result=await new Promise(resolve=>{
  const controller=runProvider('claude',config,'cancel-test',process.cwd(),event=>{if(event.kind==='answer'){childPid=Number(event.text);controller.stop();}},resolve);
 });
 assert.notEqual(result.code,0);assert.ok(childPid>0);
 let alive=true;try{process.kill(childPid,0)}catch{alive=false}
 assert.equal(alive,false);
});
