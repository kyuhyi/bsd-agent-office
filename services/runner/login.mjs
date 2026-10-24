import {spawn,execFile} from 'node:child_process';

export function loginArguments(provider){
 if(provider==='claude')return ['auth','login','--claudeai'];
 if(provider==='codex')return ['login'];
 throw new Error('지원하지 않는 제공자입니다.');
}
export function loginMessage(state){
 const messages={starting:'공식 로그인 창을 여는 중입니다.',waiting:'브라우저에서 로그인을 완료해주세요.',complete:'로그인이 확인되었습니다.',failed:'로그인을 완료하지 못했습니다. 다시 시도해주세요.',cancelled:'로그인을 중지했습니다.'};
 return {status:state.status,message:messages[state.status]||'연결 상태를 확인해주세요.'};
}
// CLI가 공식 OAuth 브라우저를 연다. 원문 출력·인증 토큰은 화면과 로그에 남기지 않는다.
export function createLoginManager(refresh){
 const states=new Map();
 return {
  status(provider){return states.has(provider)?loginMessage(states.get(provider)):null},
  start(provider,config){
   const args=loginArguments(provider);
   if(!config?.installed)throw new Error('먼저 공식 CLI를 설치해주세요.');
   if(config.loggedIn)return {status:'complete',message:'이미 로그인되어 있습니다.'};
   const previous=states.get(provider);
   if(previous&&['starting','waiting'].includes(previous.status))return loginMessage(previous);
   const state={status:'starting',child:null,timer:null};states.set(provider,state);
   const child=spawn(config.command,[...config.prefix,...args],{windowsHide:true,shell:false,stdio:['pipe','pipe','pipe']});state.child=child;
   const finish=async(code)=>{if(state.status==='cancelled')return;clearTimeout(state.timer);const providers=await refresh();state.status=providers[provider]?.loggedIn?'complete':'failed';};
   child.stdout.on('data',()=>{state.status='waiting'});child.stderr.on('data',()=>{state.status='waiting'});
   child.stdin.on('error',()=>{});child.on('error',()=>void finish(-1));child.on('close',code=>void finish(code));
   state.timer=setTimeout(()=>{state.status='failed';if(child.pid)execFile('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true},()=>{});},180000);
   return loginMessage(state);
  },
  cancel(provider){const state=states.get(provider);if(!state)return;state.status='cancelled';clearTimeout(state.timer);if(state.child?.pid)execFile('taskkill',['/PID',String(state.child.pid),'/T','/F'],{windowsHide:true},()=>{});}
 };
}
