'use client';
import {useEffect,useRef,useState} from 'react';
import {MessageCircle,BriefcaseBusiness,Footprints,Armchair,X,ArrowUp,ChevronLeft} from 'lucide-react';
import {TEAM} from './team';
import {statusLabels,type OfficeState} from '../office/types';
import {interactionRequest} from './interaction-request.mjs';
import {CharacterPortrait} from './CharacterPortrait';

type Props={actor:string|null;state:OfficeState;connected:boolean;onClose:()=>void;onMove:()=>void;onHome:()=>void;onTask:(id:string)=>void;action:(path:string,payload?:unknown)=>Promise<any>};
export function CharacterActions({actor,state,connected,onClose,onMove,onHome,onTask,action}:Props){
 const [screen,setScreen]=useState<'menu'|'chat'|'task'>('menu'),[recipient,setRecipient]=useState('eden'),[drafts,setDrafts]=useState({chat:'',task:''}),[provider,setProvider]=useState<'claude'|'codex'>('claude'),[kind,setKind]=useState<'analyze'|'create'>('analyze'),[busy,setBusy]=useState(false),[failure,setFailure]=useState('');
 const draft=drafts[screen==='task'?'task':'chat'];
 const setDraft=(value:string)=>setDrafts(d=>({...d,[screen==='task'?'task':'chat']:value}));
 const input=useRef<HTMLTextAreaElement>(null),pending=useRef(false),history=useRef<HTMLDivElement>(null);
 useEffect(()=>{setScreen('menu');setFailure('');const member=TEAM.find(m=>m.id===actor)??TEAM[0];setRecipient(member.id);setProvider(member.provider);setDrafts({chat:'',task:''});},[actor]);
 useEffect(()=>{if(screen!=='menu')input.current?.focus()},[screen]);
 useEffect(()=>{if(!actor)return;const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',handler);return()=>document.removeEventListener('keydown',handler)},[actor,onClose]);
 const conversations=state.tasks.filter(t=>t.roleId===recipient&&t.prompt.startsWith('[대화]')).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
 const latest=conversations.at(-1);
 useEffect(()=>{history.current?.scrollTo({top:history.current.scrollHeight,behavior:'smooth'})},[latest?.id,latest?.status,screen]);
 if(!actor)return null;
 const owner=actor==='kyu',person=TEAM.find(m=>m.id===actor),member=TEAM.find(m=>m.id===recipient)!;
 async function send(){if(!draft.trim()||pending.current)return;pending.current=true;setBusy(true);setFailure('');
  try{
   const task=await action('tasks',interactionRequest({recipient,provider,screen,kind,draft,conversations}));setDraft('');if(screen==='task'){onTask(task.id);onClose();}
  }catch(e){setFailure(e instanceof Error?e.message:'전달하지 못했습니다. 다시 시도해주세요.')}finally{pending.current=false;setBusy(false)}
 }
 return <section className={`character-actions ${screen!=='menu'?'expanded':''}`} aria-label={`${owner?'대표 퍼널띵':person?.name} 행동 메뉴`}>
  <header>{screen!=='menu'?<button aria-label="행동 메뉴로 돌아가기" onClick={()=>setScreen('menu')}><ChevronLeft size={17}/></button>:null}<div><strong>{owner?'대표 · 퍼널띵':person?.name}</strong><small>{screen==='menu'?(owner?'내 캐릭터':person?.role):screen==='chat'?(owner?'팀원에게 물어보기':`${member.name}와 대화`):'업무 지시'}</small></div><button aria-label="캐릭터 메뉴 닫기" onClick={onClose}><X size={17}/></button></header>
  {screen==='menu'?<div className="character-action-grid">
   <button onClick={()=>setScreen('chat')}><MessageCircle size={18}/><span>대화하기</span></button>
   <button onClick={()=>setScreen('task')}><BriefcaseBusiness size={18}/><span>업무 지시</span></button>
   {!person?.stationary?<button onClick={onMove}><Footprints size={18}/><span>이동하기</span></button>:null}
   {!person?.stationary?<button onClick={onHome}><Armchair size={18}/><span>자리로 복귀</span></button>:null}
  </div>:<>
   <div className="conversation-people" aria-label={`대표 퍼널띵과 ${member.name}의 대화`}><div><CharacterPortrait id="kyu" face/><span>대표 · 퍼널띵</span></div><span className="conversation-link">↔</span><div><CharacterPortrait id={recipient} face/><span>{member.name} · {member.role}</span></div></div>
   <div className="character-form-options">{owner?<select aria-label="대화·업무 담당자" value={recipient} onChange={e=>{setRecipient(e.target.value);setProvider(TEAM.find(m=>m.id===e.target.value)!.provider)}}>{TEAM.map(m=><option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}</select>:<span>{member.role}</span>}<select aria-label="캐릭터 실행 연결" value={provider} onChange={e=>setProvider(e.target.value as 'claude'|'codex')}><option value="claude">Claude Code</option><option value="codex">Codex</option></select></div>
   {screen==='chat'?<div className="character-conversation" ref={history} role="log" aria-label="직원과의 대화">{conversations.length?conversations.slice(-12).map(t=><article key={t.id}><div className="message-with-face from-owner"><CharacterPortrait id="kyu" face/><div className="user-message">{t.prompt.replace(/^\[대화\]\s*/,'')}</div></div><div className="message-with-face"><CharacterPortrait id={recipient} face/><div className="agent-message"><b>{member.name}</b>{t.result?<div>{t.result}</div>:<span>{t.error||statusLabels[t.status]}</span>}{['queued','running'].includes(t.status)?<button onClick={()=>void action(`tasks/${t.id}/cancel`).catch(()=>{})}>응답 중지</button>:null}</div></div></article>):<p>{member.name}에게 궁금한 점을 물어보세요.</p>}</div>:<div className="task-kind"><label><input type="radio" name="character-task-kind" checked={kind==='analyze'} onChange={()=>setKind('analyze')}/>분석·기획</label><label><input type="radio" name="character-task-kind" checked={kind==='create'} onChange={()=>setKind('create')}/>결과물 만들기</label></div>}
   <form onSubmit={e=>{e.preventDefault();void send()}}><textarea ref={input} aria-label={screen==='chat'?'직원에게 질문':'캐릭터에게 업무 지시'} placeholder={screen==='chat'?'궁금한 점을 입력하세요…':'원하는 결과와 조건을 적어주세요…'} value={draft} maxLength={screen==='chat'?5900:6000} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();void send()}}}/><div className="character-send"><small>{!connected?'사무실에 다시 연결 중':state.providers[provider]?.loggedIn?'로그인된 계정으로 실행':'설정에서 로그인해주세요'}</small><button type="submit" disabled={busy||!draft.trim()||!connected||!state.providers[provider]?.loggedIn} aria-label={screen==='chat'?'질문 보내기':'선택한 직원에게 업무 전달'}><ArrowUp size={16}/>{busy?'전달 중':screen==='chat'?'질문':'지시'}</button></div></form>
   {failure?<p className="character-error" role="alert">{failure}</p>:null}
  </>}
 </section>;
}
