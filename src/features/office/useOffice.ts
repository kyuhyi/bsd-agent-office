'use client';
import { useCallback,useEffect,useRef,useState } from 'react';
import type { OfficeState } from './types';
const empty:OfficeState={tasks:[],providers:{},project:null,workspace:'',activeId:null};
export function useOffice(){
 const [state,setState]=useState<OfficeState>(empty),[connected,setConnected]=useState(false),[error,setError]=useState('');
 const token=useRef('');
 useEffect(()=>{let source:EventSource|undefined,disposed=false;
   fetch('/office-api/session').then(r=>r.json()).then(data=>{if(disposed)return;if(data.error)throw new Error(data.error);token.current=data.token;setState(data);setConnected(true);source=new EventSource('/office-api/events');source.onmessage=event=>{setState(JSON.parse(event.data));setConnected(true)};source.onerror=()=>setConnected(false);}).catch(e=>setError(e.message));
   return()=>{disposed=true;source?.close()};
 },[]);
 const action=useCallback(async(path:string,payload:unknown={})=>{
   setError('');
   try {const response=await fetch('/office-api/'+path,{method:'POST',headers:{'Content-Type':'application/json','X-Office-Token':token.current},body:JSON.stringify(payload)});const data=await response.json();if(!response.ok)throw new Error(data.error||'요청 실패');return data;}
   catch(e){const message=e instanceof Error?e.message:'요청을 처리하지 못했습니다.';setError(message);throw e;}
 },[]);
 return {state,connected,error,setError,action};
}
