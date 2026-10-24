import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseProviderLine, redact } from './contracts.mjs';
const exec=promisify(execFile);

export async function discoverProviders() {
  const result={};
  for(const name of ['claude','codex']) {
    try {
      const {stdout}=await exec('where.exe',[name==='claude'?'claude.exe':'codex.cmd'],{windowsHide:true,timeout:10000});
      const location=stdout.trim().split(/\r?\n/)[0];
      const command=name==='codex'?process.execPath:location;
      const entry=path.join(path.dirname(location),'node_modules','@openai','codex','bin','codex.js');
      if(name==='codex'&&!existsSync(entry)) throw new Error('Codex 실행 경로 확인 필요');
      const prefix=name==='codex'?[entry]:[];
      result[name]={command,prefix,installed:true,loggedIn:false,error:null};
      try{
       const auth=await exec(command,[...prefix,...(name==='claude'?['auth','status']:['login','status'])],{windowsHide:true,timeout:15000});
       result[name].loggedIn=name==='claude'?JSON.parse(auth.stdout).loggedIn:/Logged in/.test(auth.stdout+auth.stderr);
      }catch{result[name].error='로그인이 필요합니다.';}
    } catch(error) {result[name]={installed:false,loggedIn:false,error:redact(error.message).slice(0,250)};}
  }
  return result;
}

export function runProvider(provider, config, prompt, cwd, onEvent, onEnd) {
  const args=provider==='claude'
    ?['-p','--output-format','stream-json','--verbose','--tools','','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--setting-sources','','--no-session-persistence','--permission-mode','dontAsk']
    :['exec','--json','--sandbox','read-only','--skip-git-repo-check','--ignore-user-config','--ephemeral','-C',cwd,'-'];
  const child=spawn(config.command,[...config.prefix,...args],{cwd,windowsHide:true,shell:false,stdio:['pipe','pipe','pipe'],env:{...process.env,NO_COLOR:'1'}});
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  let buffer='',answer='',errorText='',done=false,total=0;
  const finish=(code,error)=>{if(done)return;done=true;clearTimeout(timer);onEnd({code,answer,error:error||errorText});};
  child.stdout.on('data',chunk=>{
    total+=chunk.length;
    if(total>4000000){stop();return;}
    buffer+=chunk.toString();
    const lines=buffer.split('\n');buffer=lines.pop();
    for(const line of lines) {
      const event=parseProviderLine(provider,line);
      if(!event)continue;
      if(event.kind==='answer')answer=event.text;
      if(event.kind==='error')errorText=event.text;
      onEvent(event);
    }
  });
  child.stderr.on('data',data=>{errorText=redact(errorText+data.toString()).slice(-2500);});
  child.on('error',error=>finish(-1,redact(error.message)));
  child.on('close',code=>{
    if(buffer.trim()){const e=parseProviderLine(provider,buffer);if(e?.kind==='answer')answer=e.text;if(e?.kind==='error')errorText=e.text;}
    finish(code);
  });
  child.stdin.on('error',()=>{});
  child.stdin.end(prompt);
  const stop=()=>{if(child.pid)execFile('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true},()=>{});};
  const timer=setTimeout(()=>{errorText='실행 시간 제한(5분)을 초과했습니다.';stop();},300000);
  return {pid:child.pid,stop};
}
