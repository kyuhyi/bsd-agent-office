import {ROSTER} from './roster.mjs';
// 화면의 선택 대상과 실제 CLI 작업의 담당자를 일치시킨다.
/** @param {{recipient:string,provider:string,screen:string,kind:string,draft:string,conversations?:Array<{id:string,roleId:string,prompt:string,status:string}>}} input */
export function interactionRequest({recipient,provider,screen,kind,draft,conversations=[]}){
 if(!ROSTER.some(m=>m.id===recipient))throw new Error('업무를 맡길 팀원을 선택해주세요.');
 if(!['claude','codex'].includes(provider))throw new Error('실행 연결을 선택해주세요.');
 if(!['chat','task'].includes(screen)||!['analyze','create'].includes(kind))throw new Error('요청 종류를 확인해주세요.');
 const text=draft.trim(),prompt=screen==='chat'?'[대화] '+text:text;
 if(!text||prompt.length>6000)throw new Error('내용을 6,000자 이내로 입력해주세요.');
 const parent=screen==='chat'?[...conversations].reverse().find(t=>t.roleId===recipient&&t.prompt.startsWith('[대화]')&&['review','approved'].includes(t.status)):null;
 return {roleId:recipient,provider,mode:screen==='chat'?'analyze':kind,prompt,...(parent?{parentId:parent.id}:{})};
}
