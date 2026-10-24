const WORK=['이 부분은 같이 확인해 볼까요?','사용자 입장에서 한 번 더 볼까요?','좋은 아이디어가 떠올랐어요.','잠깐 의견 나눌까요?'];
const LIFE=['오늘 점심은 뭐 먹을까요?','커피 한 잔 하실래요?','창밖 풍경이 참 좋네요.','고양이가 또 산책 나왔네요.','강아지, 오늘도 신났네요!'];
const MEETING=['서로의 의견부터 들어볼까요?','다음 순서를 같이 정해 봐요.','사용자에게 어떤 도움이 될까요?'];
// 미리 작성한 분위기용 대사다. 실제 업무 응답과 작업 완료 상태를 만들지 않는다.
export function ambientSpeech(seconds,index,count,{working=false,meeting=false,stationary=false,activity=false}={}){
 if(working||seconds<12)return null;
 const slot=Math.floor((seconds-12)/10),phase=(seconds-12)%10;
 if(slot%count!==index||phase>5.5)return null;
 const round=Math.floor(slot/count),lines=stationary?['어서 오세요. 편하게 둘러보세요.','필요한 일이 있으면 말씀해 주세요.']:meeting?MEETING:activity?LIFE:round%2?LIFE:WORK;
 return lines[(index+round)%lines.length];
}
