'use client';
import {useEffect,useRef,useState} from 'react';
import {Image as ImageIcon,Sun,Moon,Clock3,X,Check} from 'lucide-react';
import {BACKGROUNDS} from './environment.mjs';
type Props={preferences:{background:string;mode:string};lighting:{label:string;clock:string;night:boolean};onChange:(p:{background?:string;mode?:string})=>void};
export function EnvironmentControls({preferences,lighting,onChange}:Props){
 const [open,setOpen]=useState(false),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false)},key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.stopPropagation();setOpen(false);trigger.current?.focus()}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key,true);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key,true)}},[open]);
 return <div className="environment-controls" ref={root}>
  <button ref={trigger} className="scene-btn environment-trigger" aria-label="배경과 시간 설정" aria-expanded={open} aria-controls="environment-panel" onClick={()=>setOpen(v=>!v)}><ImageIcon size={15}/><span>배경</span><i/>{preferences.mode==='auto'?<Clock3 size={14}/>:lighting.night?<Moon size={14}/>:<Sun size={14}/>}<span>{preferences.mode==='auto'?'자동 · ':''}{lighting.label}</span></button>
  {open?<section className="environment-panel" id="environment-panel" aria-label="배경과 시간"><header><strong>창밖의 풍경</strong><button aria-label="배경 설정 닫기" onClick={()=>{setOpen(false);trigger.current?.focus()}}><X size={18}/></button></header>
   <div className="background-options">{BACKGROUNDS.map(b=><button key={b.id} aria-label={`${b.name} 배경`} aria-pressed={preferences.background===b.id} onClick={()=>onChange({background:b.id})}><img src={b.src} alt=""/><span>{b.name}</span>{preferences.background===b.id?<Check size={16}/>:null}</button>)}</div>
   <h3>빛과 시간</h3><div className="lighting-options">{[['auto','자동',Clock3],['day','낮',Sun],['night','밤',Moon]].map(([value,label,Icon]:any)=><button key={value} aria-label={`${label} 조명`} aria-pressed={preferences.mode===value} onClick={()=>onChange({mode:value})}><Icon size={15}/>{label}</button>)}</div>
   <p><span>한국 시간 <time>{lighting.clock}</time></span><b>{lighting.label}</b></p><small>자동: 아침 06–08 · 낮 08–17 · 노을 17–19 · 밤 19–06</small>
  </section>:null}
 </div>;
}
