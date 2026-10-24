// 승인된 Bang Motion 자막 레이아웃으로 새 카메라 장면의 레이어를 출력한다.
import puppeteer from '../../output/video-tools/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import {mkdir} from 'node:fs/promises';
const root='output/bsd-office-tour-voice-v3';
await mkdir(root+'/layers',{recursive:true});
const browser=await puppeteer.launch({headless:true,args:['--disable-gpu']});
try{
 const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:43142/index.html?clean=1');
 await page.waitForFunction('window.OPENER?.ready');
 await page.addStyleTag({content:'html,body,#stage{background:transparent!important}#world,#progress{visibility:hidden!important}'});
 for(const s of [{name:'intro',t:1,title:'01 · BSD 가상 오피스',caption:'퍼널띵 대표와 11명의 직원이 함께하는 3D 사무실'},
 {name:'zoom',t:84,title:'10 · 화면 제어',caption:'확대·축소 · 드래그로 360도 둘러보기'}]){
  await page.evaluate(s=>{OPENER.seek(s.t);gsap.ticker.sleep();document.querySelector('#chapterText').textContent=s.title;document.querySelector('#caption').textContent=s.caption;},s);
  await page.screenshot({path:`${root}/layers/${s.name}.png`,omitBackground:true});
 }
}finally{await browser.close();}
