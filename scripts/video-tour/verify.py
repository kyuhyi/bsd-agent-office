"""완성 영상 전체 디코딩 및 대표 프레임 검수 자료 생성."""
import json,re,subprocess
from pathlib import Path
import imageio_ffmpeg
from PIL import Image,ImageDraw

ROOT=Path(__file__).resolve().parents[2]/'output/bsd-office-tour-v2'
FF=imageio_ffmpeg.get_ffmpeg_exe()
video=ROOT/'BSD-Office-Tour-1080p.mp4'
result=subprocess.run([FF,'-hide_banner','-loglevel','error','-i',str(video),'-progress','pipe:1','-nostats','-f','null','-'],capture_output=True,text=True,check=True)
assert not result.stderr.strip(),result.stderr
frames=[int(x) for x in re.findall(r'frame=(\d+)',result.stdout)]
assert frames[-1]==3600,frames[-1]
meta=subprocess.run([FF,'-hide_banner','-i',str(video)],capture_output=True,text=True).stderr
assert '1920x1080' in meta and '00:02:00.00' in meta and '30 fps' in meta
assert 'Audio:' not in meta
times=[3,15,26,47,58,68,78,91,99,106,113,118]
review=ROOT/'final-review';review.mkdir(exist_ok=True)
sheet=Image.new('RGB',(1280,6*386),'#172337')
for i,t in enumerate(times):
 path=review/f'checked-{t:03}.jpg'
 subprocess.run([FF,'-hide_banner','-loglevel','error','-ss',str(t),'-i',str(video),'-frames:v','1','-q:v','2',str(path)],check=True)
 im=Image.open(path).resize((640,360),Image.Resampling.LANCZOS)
 x,y=(i%2)*640,(i//2)*386;sheet.paste(im,(x,y));ImageDraw.Draw(sheet).text((x+12,y+365),f'{t:03}s',fill='white')
sheet.save(review/'contact-sheet.jpg',quality=92)
verification=json.loads((ROOT/'render-verification.json').read_text())
verification.update(fullDecodePassed=True,decodedFrames=frames[-1],visualSampleSeconds=times,bytes=video.stat().st_size)
(ROOT/'render-verification.json').write_text(json.dumps(verification,indent=2))
print(json.dumps(verification),flush=True)
