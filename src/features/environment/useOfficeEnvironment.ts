'use client';
import {useEffect,useState} from 'react';
import {BACKGROUNDS,lightingAt,sanitizeEnvironment} from './environment.mjs';
const KEY='bsd-office:environment:v1';
export function useOfficeEnvironment(){
 const [preferences,setPreferences]=useState({background:'new-york',mode:'auto'}),[now,setNow]=useState<Date|null>(null),[ready,setReady]=useState(false);
 useEffect(()=>{try{setPreferences(sanitizeEnvironment(JSON.parse(localStorage.getItem(KEY)||'null')))}catch{}setNow(new Date());setReady(true);
  const tick=()=>setNow(new Date()),timer=setInterval(tick,30000);window.addEventListener('focus',tick);document.addEventListener('visibilitychange',tick);
  return()=>{clearInterval(timer);window.removeEventListener('focus',tick);document.removeEventListener('visibilitychange',tick)};
 },[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,JSON.stringify(preferences))}catch{}},[preferences,ready]);
 const lighting=lightingAt(now??new Date('2026-01-01T12:00:00+09:00'),preferences.mode);
 return {preferences,lighting,background:BACKGROUNDS.find(b=>b.id===preferences.background)!,update:(patch:Partial<typeof preferences>)=>setPreferences(p=>sanitizeEnvironment({...p,...patch}))};
}
