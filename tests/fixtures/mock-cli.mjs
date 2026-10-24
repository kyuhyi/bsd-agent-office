import { spawn } from 'node:child_process';
let input='';for await(const chunk of process.stdin)input+=chunk;
if(input==='cancel-test'){
 const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{windowsHide:true,stdio:'ignore'});
 process.stdout.write(JSON.stringify({type:'result',result:String(child.pid)})+'\n');
 setInterval(()=>{},1000);
}else{
 const output=Buffer.from(JSON.stringify({type:'result',result:'한국어 응답 정상',is_error:false})+'\n');
 for(let i=0;i<output.length;i+=2){process.stdout.write(output.subarray(i,i+2));await new Promise(r=>setTimeout(r,1));}
}
