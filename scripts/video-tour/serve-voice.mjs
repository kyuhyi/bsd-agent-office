// 영상 탐색을 지원하는 로컬 전용 미리보기 서버.
import http from 'node:http';
import {createReadStream,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=resolve('output/bsd-office-tour-voice-v3');
http.createServer((req,res)=>{
 const file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html')));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{
  const stat=statSync(file);const type={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mp4':'video/mp4','.woff2':'font/woff2','.json':'application/json','.jpg':'image/jpeg','.srt':'text/plain; charset=utf-8'}[extname(file)]||'application/octet-stream';
  const headers={'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':'no-store'};
  const m=/bytes=(\d+)-(\d*)/.exec(req.headers.range||'');
  const start=m?Number(m[1]):0,end=m&&m[2]?Math.min(Number(m[2]),stat.size-1):stat.size-1;
  if(start>end){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}
  if(m)headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
  headers['Content-Length']=end-start+1;res.writeHead(m?206:200,headers);
  if(req.method==='HEAD')res.end();else createReadStream(file,{start,end}).pipe(res);
 }catch{res.writeHead(404).end('Not found');}
}).listen(43143,'127.0.0.1',()=>console.log('BSD 영상 미리보기 http://127.0.0.1:43143/'));
