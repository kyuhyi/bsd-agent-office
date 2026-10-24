// Bang Motion 타임라인의 실제 자막 레이어와 카메라 값을 내보낸다.
import puppeteer from '../../output/video-tools/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root='output/bsd-office-tour-v2';
await mkdir(root+'/layers',{recursive:true});
const plan=JSON.parse(await readFile(root+'/timeline.json','utf8'));
const browser=await puppeteer.launch({headless:true,args:['--disable-gpu']});
try{
 const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:43142/index.html?clean=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction('window.OPENER?.ready',{timeout:60000});
 await page.addStyleTag({content:'html,body,#stage{background:transparent!important}#world,#progress{visibility:hidden!important}'});
 for(let i=0;i<plan.length;i++){
  await page.evaluate(t=>OPENER.seek(t),plan[i].start+.9);
  await page.screenshot({path:`${root}/layers/${String(i).padStart(2,'0')}.png`,omitBackground:true});
 }
 const cameras=await page.evaluate(()=>Array.from({length:3600},(_,i)=>{OPENER.seek(i/30);return {x:C.x,y:C.y,z:C.z};}));
 await writeFile(root+'/camera-frames.json',JSON.stringify(cameras));
 console.log('28개 자막 레이어와 3,600개 카메라 좌표 출력 완료');
}finally{await browser.close();}
