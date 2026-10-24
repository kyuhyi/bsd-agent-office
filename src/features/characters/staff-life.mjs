export const LEISURE_SPOTS=[
 {id:'arcade-blue',kind:'arcade',label:'게임 중',position:[-11.85,.5],facing:Math.PI,seated:false},
 {id:'arcade-purple',kind:'arcade',label:'게임 중',position:[-10.8,.5],facing:Math.PI,seated:false},
 {id:'coffee',kind:'coffee',label:'커피 휴식',position:[-7.9,-8.45],facing:Math.PI,seated:true},
 {id:'foosball-near',kind:'foosball',label:'테이블 축구',position:[-10.25,1.35],facing:0,seated:false},
 {id:'foosball-far',kind:'foosball',label:'테이블 축구',position:[-9.7,3.85],facing:Math.PI,seated:false},
];
// 인포 직원은 제외하고 세 명씩 순번을 바꾼다. 복귀 시간 38초를 별도로 확보한다.
export function activityFor(seconds,index,count,{working=false,meeting=false,manual=false,stationary=false}={}){
 if(working||meeting||manual||stationary||index>=count-1)return null;
 const round=Math.floor(seconds/120),phase=seconds%120;
 if(phase<8||phase>=82)return null;
 const available=count-1,slot=(index-(round*3)%available+available)%available;
 if(slot>=3)return null;
 return LEISURE_SPOTS[slot===2?2:round%2===0?slot:slot+3];
}
