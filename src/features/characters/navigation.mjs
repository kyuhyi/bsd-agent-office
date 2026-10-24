import {ROOM} from '../office/scene-layout.mjs';
export function blocked([x,z], obstacles, padding=.28) {
  return obstacles.some(o=>Math.abs(x-o.x)<o.w/2+padding && Math.abs(z-o.z)<o.d/2+padding);
}
// 반 칸 격자 경로를 사용해 가구를 피하고 대각선 모서리 통과를 방지한다.
export function findPath(start,end,obstacles=[]) {
  const step=.5,key=([x,z])=>`${x},${z}`;
  const a=start.map(v=>Math.round(v/step)), b=end.map(v=>Math.round(v/step));
  const open=[a],prev=new Map([[key(a),null]]);
  while(open.length){
    const current=open.shift();
    if(key(current)===key(b)) {
      const result=[];let item=current;
      while(item){result.unshift(item.map(v=>v*step));item=prev.get(key(item));}
      result[0]=start;result[result.length-1]=end;return result;
    }
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const p=[current[0]+dx,current[1]+dz];
      if(p[0]<Math.ceil((ROOM.minX+.25)/step)||p[0]>Math.floor((ROOM.maxX-.25)/step)||p[1]<Math.ceil((ROOM.minZ+.25)/step)||p[1]>Math.floor((ROOM.maxZ-.25)/step)||prev.has(key(p))||blocked(p.map(v=>v*step),obstacles)) continue;
      prev.set(key(p),current);open.push(p);
    }
  }
  return [start];
}
export function advanceAlongPath(from,to,delta,speed=1.5) {
  const dx=to[0]-from[0],dz=to[1]-from[1],distance=Math.hypot(dx,dz),travel=Math.min(distance,speed*delta);
  return distance<.00001?[...to]:[from[0]+dx/distance*travel,from[1]+dz/distance*travel];
}
