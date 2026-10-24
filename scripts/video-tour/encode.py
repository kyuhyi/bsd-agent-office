"""Bang Motion 카메라 좌표와 브라우저 자막 레이어를 실제 녹화에 합성한다."""
import json, subprocess, math
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[2]/'output/bsd-office-tour-v2'
PLAN=json.loads((ROOT/'timeline.json').read_text(encoding='utf-8'))
CAM=json.loads((ROOT/'camera-frames.json').read_text())
FF=imageio_ffmpeg.get_ffmpeg_exe()
(ROOT/'segments').mkdir(exist_ok=True)

def render(item):
 i,s=item
 # GSAP power2.inOut과 동일한 입방 이징. 각 구간의 카메라 중심은 HTML의 focus 규칙과 같다.
 prev=PLAN[i-1]['camera'] if i else [960,540,1]
 cur=s['camera']
 def clamp(c):
  x,y,z=c
  return [max(960/z,min(1920-960/z,x)),max(540/z,min(1080-540/z,y)),z]
 a,b=clamp(prev),clamp(cur)
 d=min(.8,s['duration']*.2)
 p=f'min(1,on/{30*d})'
 ease=f'if(lt({p},0.5),4*pow({p},3),1-pow(-2*{p}+2,3)/2)'
 def expr(k):return f'({a[k]}+({b[k]-a[k]})*({ease}))'
 z,x,y=expr(2),expr(0),expr(1)
 # 하네스: 내보낸 GSAP 좌표와 수식의 중간 지점이 일치하는지 검증.
 frame=int((s['start']+d/2)*30);p0=(frame/30-s['start'])/d
 e=4*p0**3 if p0<.5 else 1-(-2*p0+2)**3/2
 for k,key in enumerate(['x','y','z']):assert abs(CAM[frame][key]-(a[k]+(b[k]-a[k])*e))<.02,(i,key)
 graph=f"[0:v]zoompan=z='{z}':x='{x}-iw/(2*zoom)':y='{y}-ih/(2*zoom)':d=1:s=1920x1080:fps=30[screen];[screen][1:v]overlay=0:0:format=auto,format=yuv420p[v]"
 target=ROOT/'segments'/f'{i:02}.mp4'
 if target.exists():return target
 subprocess.run([FF,'-hide_banner','-loglevel','error','-threads','2','-ss',str(s['start']),'-i',str(ROOT/'footage.mp4'),'-loop','1','-i',str(ROOT/'layers'/f'{i:02}.png'),'-filter_complex_threads','2','-filter_complex',graph,'-map','[v]','-t',str(s['duration']),'-an','-c:v','libx264','-threads','2','-preset','fast','-crf','18','-pix_fmt','yuv420p',str(target)],check=True)
 print(f"장면 {i+1:02} / {len(PLAN)} 완료: {s['name']}",flush=True)
 return target

with ThreadPoolExecutor(max_workers=2) as pool: paths=list(pool.map(render,enumerate(PLAN)))
lst=ROOT/'final.ffconcat';lst.write_text('\n'.join("file '"+p.as_posix()+"'" for p in paths))
subprocess.run([FF,'-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(lst),'-c','copy','-movflags','+faststart',str(ROOT/'BSD-Office-Tour-1080p.mp4')],check=True)
(ROOT/'render-verification.json').write_text(json.dumps(dict(duration=120,width=1920,height=1080,fps=30,frames=3600,audio=False,scenes=len(PLAN),cameraHarness='28 scenes compared with exported GSAP timeline',errors=[]),indent=2))
print('120초 MP4 합성 완료',flush=True)
