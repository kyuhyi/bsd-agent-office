import {blocked,findPath} from './navigation.mjs';
import {SCENE_OBSTACLES,ROOM} from '../office/scene-layout.mjs';
export const OWNER_HOME=[5.94,-8.9];
const GATE=[5.5,-9.35];
const same=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<.08;
export function validDestination(p){return p.length===2&&p.every(Number.isFinite)&&p[0]>ROOM.minX+.6&&p[0]<ROOM.maxX-.5&&p[1]>ROOM.minZ+.7&&p[1]<ROOM.maxZ-.6&&!blocked(p,SCENE_OBSTACLES);}
function clear(a,b,padding=.25){const n=Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/.08);for(let i=0;i<=n;i++){const t=n?i/n:0;if(blocked([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],SCENE_OBSTACLES,padding))return false;}return true;}
function anchors(p){const choices=[];for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){const q=[Math.round(p[0]*2)/2+x*.5,Math.round(p[1]*2)/2+z*.5];if(q[0]>=ROOM.minX+.6&&q[0]<=ROOM.maxX-.5&&q[1]>=ROOM.minZ+.7&&q[1]<=ROOM.maxZ-.5&&!blocked(q,SCENE_OBSTACLES)&&clear(p,q))choices.push(q);}return choices.sort((a,b)=>Math.hypot(a[0]-p[0],a[1]-p[1])-Math.hypot(b[0]-p[0],b[1]-p[1]));}
// 대표 좌석 뒤의 짧은 출입 구간을 제외하면 안전한 격자점에 연결한다.
export function manualRoute(start,end,id){
 const exiting=id==='kyu'&&same(start,OWNER_HOME),returning=id==='kyu'&&same(end,OWNER_HOME);
 const a=exiting?GATE:start,b=returning?GATE:end;
 if(same(start,end))return [[...start],[...end]];
 for(const first of anchors(a))for(const last of anchors(b)){
  const path=findPath(first,last,SCENE_OBSTACLES);
  if(!same(path.at(-1),last)||path.some((p,i)=>i&&!clear(path[i-1],p)))continue;
  return [start,...(exiting?[GATE]:[]),...path,b,...(returning?[OWNER_HOME]:[])].filter((p,i,all)=>!i||Math.hypot(p[0]-all[i-1][0],p[1]-all[i-1][1])>.001);
 }
 return [];
}

