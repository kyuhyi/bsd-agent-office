/** Bang Motion export-frames.mjs를 MP4 스트리밍 출력에 맞게 적용. MIT © 2026 Bang Tutorial. */
import puppeteer from '../../output/video-tools/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {once} from 'node:events';
const FPS=30,ROOT=new URL('../../output/bsd-office-tour-v2/',import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1');
const ffmpeg=process.env.VIDEO_FFMPEG;
if(!ffmpeg)throw new Error('VIDEO_FFMPEG 경로를 지정하세요');
const browser=await puppeteer.launch({headless:true,args:['--enable-gpu','--use-gl=angle','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
console.log('편집 화면 로딩');
await page.goto('http://127.0.0.1:43142/index.html?clean=1',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForFunction('window.OPENER?.ready && window.OPENER.clipsReady()',{timeout:120000});
await page.evaluate(()=>document.fonts.ready);
const duration=await page.evaluate(()=>OPENER.DURATION);
if(duration!==120)throw new Error('영상 길이 불일치');
const encoder=spawn(ffmpeg,['-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',ROOT+'bsd-office-tour.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<duration*FPS;i++){
 const t=i/FPS;
 await page.evaluate(async t=>{await OPENER.seekFrame(t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},t);
 const frame=await page.screenshot({type:'jpeg',quality:94,clip:{x:0,y:0,width:1920,height:1080}});
 if(!encoder.stdin.write(frame))await once(encoder.stdin,'drain');
 if(i%150===0)console.log(`렌더링 ${t.toFixed(0)} / ${duration}초`);
 if(i%300===0)await writeFile(ROOT+`review-${String(Math.floor(t)).padStart(3,'0')}.jpg`,frame);
}
encoder.stdin.end();const [exitCode]=await once(encoder,'close');await browser.close();
if(exitCode!==0||errors.length)throw new Error(JSON.stringify({exitCode,errors}));
await writeFile(ROOT+'render-verification.json',JSON.stringify({duration,width:1920,height:1080,fps:FPS,frames:duration*FPS,audio:false,errors},null,2));
console.log('120초 MP4 렌더링 완료');
