"""생성 음성의 문장 일치와 최종 영상 디코딩을 검증한다."""
import json, subprocess, difflib, re
from pathlib import Path
from faster_whisper import WhisperModel
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'output/bsd-office-tour-voice-v3'
plan=json.loads((ROOT/'scripts/video-tour/voice-plan.json').read_text(encoding='utf-8'))
model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4,local_files_only=True)
results=[]
norm=lambda x: re.sub(r'[^가-힣a-z0-9]','',x.lower())
for s in plan['segments']:
 segs,info=model.transcribe(str(OUT/'voice'/(s['id']+'.mp3')),language='ko',beam_size=3,vad_filter=True)
 text=' '.join(x.text.strip() for x in segs)
 similarity=difflib.SequenceMatcher(None,norm(text),norm(s['text'])).ratio()
 results.append(dict(id=s['id'],transcript=text,similarity=similarity))
 print(s['id'],round(similarity,3),text,flush=True)
(OUT/'voice-transcript-check.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
assert all(r['similarity']>.65 for r in results),'음성 대본 검토 필요'
video=OUT/'BSD-Office-Tour-KO-Voice-1080p.mp4'
if video.exists():
 subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-i',str(video),'-f','null','-'],check=True)
 print('최종 영상과 음성 전체 디코딩 통과',flush=True)
