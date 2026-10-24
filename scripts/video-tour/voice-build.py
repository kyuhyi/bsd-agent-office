"""기존 Bang Motion 영상에 실제 카메라 촬영과 장면별 음성, 사용자 BGM을 합친다."""
import json, subprocess, re, wave, hashlib, sys
from pathlib import Path
import imageio_ffmpeg
import numpy as np

BASE=Path(__file__).resolve().parents[2]
ROOT=BASE/'output/bsd-office-tour-voice-v3'
OLD=BASE/'output/bsd-office-tour-v2'
FF=imageio_ffmpeg.get_ffmpeg_exe()
PLAN=json.loads((BASE/'scripts/video-tour/voice-plan.json').read_text(encoding='utf-8'))

def run(args):
    subprocess.run([FF,'-hide_banner','-loglevel','error',*map(str,args)],check=True)

def duration(path):
    # 실제로 끝까지 디코딩한 PCM 샘플 수로 길이를 측정한다.
    p=subprocess.run([FF,'-v','error','-i',str(path),'-f','s16le','-ar','48000','-ac','1','pipe:1'],capture_output=True,check=True)
    return len(p.stdout)/96000

def motion_clip(folder,name,seconds,layer):
    target=ROOT/(name+'.mp4')
    if target.exists(): return target
    source=ROOT/folder
    meta=json.loads((source/'capture.json').read_text())
    frames=[f for f in meta['frames'] if f['t']>=meta['start']]
    assert len(frames)>80, '실제 촬영 프레임 부족'
    intervals=[max(.01,min(.25,frames[i+1]['t']-f['t'])) if i+1<len(frames) else .04 for i,f in enumerate(frames)]
    scale=seconds/sum(intervals)
    lines=['ffconcat version 1.0']
    for f,dt in zip(frames,intervals):
        lines += [f"file '{(source/f'{f['n']:06}.jpg').as_posix()}'",f'duration {dt*scale:.9f}']
    lines += [lines[-2]]
    lst=ROOT/(name+'.ffconcat');lst.write_text('\n'.join(lines))
    run(['-f','concat','-safe','0','-i',lst,'-loop','1','-i',ROOT/'layers'/layer,
         '-filter_complex','[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x172337,setsar=1,fps=30[v];[v][1:v]overlay=0:0:format=auto,format=yuv420p[out]',
         '-map','[out]','-t',seconds,'-an','-c:v','libx264','-preset','fast','-crf','18','-movflags','+faststart',target])
    return target

def video():
    a=motion_clip('orbit-capture','orbit-captioned',14,'intro.png')
    b=motion_clip('zoom-stills','zoom-captioned',8,'zoom.png')
    parts=[a if i==0 else b if i==18 else OLD/'segments'/f'{i:02}.mp4' for i in range(28)]
    assert all(p.exists() for p in parts)
    lst=ROOT/'video.ffconcat';lst.write_text('\n'.join(f"file '{p.as_posix()}'" for p in parts))
    run(['-f','concat','-safe','0','-i',lst,'-c','copy','-movflags','+faststart',ROOT/'motion-video.mp4'])

def audio():
    clips=[];report=[]
    for s in PLAN['segments']:
        source=ROOT/'voice'/(s['id']+'.mp3');assert source.exists(),source
        actual=duration(source);window=s['end']-s['start'];speed=max(1,actual/(window-.08))
        assert speed<=1.18, f"대본 축약 필요: {s['id']} {actual:.2f}/{window:.2f}"
        report.append({**s,'actualDuration':actual,'tempo':speed,'placedDuration':actual/speed,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
        clips.append(source)
    assert len({s['sha256'] for s in report})==len(report),'음성 중복 저장 검사 실패'
    # 구간별로 먼저 정규화해 긴 지연 버퍼가 여러 배 쌓이지 않도록 한다.
    mixed=np.zeros(133*48000,dtype=np.float32)
    for i,(path,s) in enumerate(zip(clips,report)):
        result=subprocess.run([FF,'-v','error','-i',str(path),'-af',f"atempo={s['tempo']:.8f},loudnorm=I=-18:TP=-2:LRA=7",'-ar','48000','-ac','1','-f','f32le','pipe:1'],capture_output=True,check=True)
        samples=np.frombuffer(result.stdout,dtype='<f4');start=round(s['start']*48000)
        assert start+len(samples)<=len(mixed)
        mixed[start:start+len(samples)]+=samples
        print('음성 배치:',s['id'],flush=True)
    with wave.open(str(ROOT/'narration-mixed.wav'),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(48000)
        w.writeframes((np.repeat(np.clip(mixed,-1,1)[:,None],2,axis=1)*32767).astype('<i2').tobytes())
    bgm=Path('C:/Users/kyuhy/tts_mp4/assets/bgm/BSD_BG.mp3');assert bgm.exists()
    # 곡의 루프 경계를 크로스페이드하고 음성이 나올 때 배경음만 낮춘다.
    bgargs=[]
    for _ in range(4):bgargs+=['-i',bgm]
    run([*bgargs,'-filter_complex','[0:a][1:a]acrossfade=d=1.2:c1=tri:c2=tri[m1];[m1][2:a]acrossfade=d=1.2:c1=tri:c2=tri[m2];[m2][3:a]acrossfade=d=1.2:c1=tri:c2=tri,loudnorm=I=-22:TP=-3:LRA=9,afade=t=in:d=1.5,afade=t=out:st=129:d=4,atrim=duration=133[music]',
         '-map','[music]','-ar','48000','-ac','2',ROOT/'music-bed.wav'])
    run(['-i',ROOT/'narration-mixed.wav','-i',ROOT/'music-bed.wav','-filter_complex',
         '[0:a]asplit=2[voice][key];[1:a][key]sidechaincompress=threshold=0.025:ratio=5:attack=30:release=500:makeup=1[duck];[voice][duck]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1:LRA=9,afade=t=out:st=132:d=1[mix]',
         '-map','[mix]','-ar','48000','-ac','2',ROOT/'mix.wav'])
    (ROOT/'voice-sync-verification.json').write_text(json.dumps({'provider':PLAN['provider'],'voice':PLAN['voice'],'segments':report},ensure_ascii=False,indent=2),encoding='utf-8')

def mux():
    run(['-i',ROOT/'motion-video.mp4','-i',ROOT/'mix.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','133','-movflags','+faststart',ROOT/'BSD-Office-Tour-KO-Voice-1080p.mp4'])

if __name__=='__main__':
    {'video':video,'audio':audio,'mux':mux}[sys.argv[1]]()
