export const BACKGROUNDS=[
 {id:'new-york',name:'뉴욕 하버',src:'/environment/new-york-harbor.png',position:'center 40%'},
 {id:'mountains',name:'마운틴 뷰',src:'/environment/backgrounds/mountains.jpg',position:'center 42%'},
 {id:'forest',name:'포레스트',src:'/environment/backgrounds/forest.jpg',position:'center 45%'},
 {id:'ocean',name:'오션 테라스',src:'/environment/backgrounds/ocean.jpg',position:'center 45%'}
];
export function sanitizeEnvironment(value){return {background:BACKGROUNDS.some(b=>b.id===value?.background)?value.background:'new-york',mode:['auto','day','night'].includes(value?.mode)?value.mode:'auto'}};
const koreanClock=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
// 실제 일출 예보가 아닌 한국 시간 기준 고정 일정. 아침과 노을은 밝기를 연속 보간한다.
export function lightingAt(date,mode='auto'){
 const clock=koreanClock.format(date),[hour,minute]=clock.split(':').map(Number),h=hour+minute/60;
 const phase=mode==='day'?'day':mode==='night'?'night':h<6||h>=19?'night':h<8?'dawn':h<17?'day':'dusk';
 const daylight=phase==='day'?1:phase==='night'?0:phase==='dawn'?(h-6)/2:(19-h)/2;
 return {phase,daylight,night:daylight<.5,clock,label:{day:'낮',night:'밤',dawn:'아침',dusk:'노을'}[phase]};
}
