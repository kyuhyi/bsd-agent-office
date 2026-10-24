"""실제 브라우저 캡처를 승인된 120초 구성으로 편집한다."""
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAPTURE = ROOT / 'output/office-tour-capture'
OUT = ROOT / 'output/bsd-office-tour-v2'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads((CAPTURE / 'capture.json').read_text())

# 이름, 길이, 장 제목, 자막, 카메라 중심 x/y/확대 배율
PLAN = [
 ('overview-final',6,'01 · BSD 가상 오피스','퍼널띵 대표와 11명의 직원이 함께하는 3D 사무실',[960,565,1.02]),
 ('team-wide',6,'02 · 팀원과 역할','팀원을 선택하면 담당 역할과 업무 현황을 확인할 수 있어요',[1510,550,1.4]),
 ('chat-wide',7,'03 · 캐릭터와 대화','캐릭터를 클릭해 대화하기 · 저장된 실제 Claude 응답입니다',[700,650,1.35]),
 ('question-wide',4,'03 · 캐릭터와 대화','질문을 입력한 뒤 전송 · 이 장면은 제출 전 입력 시연입니다',[700,650,1.35]),
 ('task-wide',7,'04 · 업무 지시','업무 유형과 Claude·Codex를 선택해 업무를 지시해요',[740,690,1.3]),
 ('reports',5,'05 · 보고함','전체·진행·검토로 업무를 나누고 담당자와 실행 결과를 확인',[1490,530,1.35]),
 ('live',3,'05 · 실시간','실시간에서는 진행 중인 업무를 확인 · 현재 실행 중인 업무는 없어요',[1480,480,1.35]),
 ('artifact-list',3,'06 · 결과물 목록','생성된 파일이 있는 작업만 모아서 확인해요',[1490,530,1.35]),
 ('result-detail',5,'06 · 결과 확인','요청과 결과를 함께 검토하고 생성 파일을 미리 볼 수 있어요',[960,540,1.06]),
 ('artifact-check',5,'06 · Codex 결과물','실제로 생성된 HTML · 체크하면 완료 개수가 바로 바뀝니다',[960,650,1.22]),
 ('artifact-complete',2,'06 · Codex 결과물','기획·디자인·개발, 3 / 3 완료',[960,650,1.22]),
 ('artifact-reset',2,'06 · Codex 결과물','초기화 버튼도 실제로 동작합니다',[960,650,1.22]),
 ('claude-artifact',6,'07 · Claude 결과물','준비 항목을 펼쳐 확인 · 다운로드와 교차 검수도 이 화면에서',[960,650,1.16]),
 ('briefing',3,'08 · 비서 브리핑','비서 브리핑에서 운영 담당자를 선택하고 요청을 작성해요',[1430,560,1.12]),
 ('meeting',8,'09 · 회의실','회의 버튼으로 직원들을 모으기 · AI 회의 실행은 별도 업무 지시',[1000,540,1.5]),
 ('meeting-return',3,'09 · 회의실','한 번 더 누르면 자리로 복귀 · 인포메이션은 나리가 지켜요',[1000,575,1.25]),
 ('owner-move',5,'10 · 대표 이동','대표 선택 → 이동하기 → 원하는 바닥을 클릭',[1290,630,1.4]),
 ('owner-return',3,'10 · 대표 이동','자리로 복귀하면 대표실로 돌아갑니다',[1350,600,1.35]),
 ('camera-controls',3,'10 · 화면 제어','확대·축소와 움직임 일시정지 · 전체 보기로 구도를 되돌려요',[1300,700,1.15]),
 ('background-mountain',2,'11 · 배경 바꾸기','마운틴 뷰',[960,540,1]),
 ('background-forest',2,'11 · 배경 바꾸기','포레스트',[960,540,1]),
 ('background-ocean',2,'11 · 배경 바꾸기','오션 테라스 · 뉴욕까지 네 가지 배경',[960,540,1]),
 ('night',4,'12 · 빛과 시간','밤에는 따뜻한 실내 조명으로 분위기를 바꿔요',[960,580,1.05]),
 ('night-neon',4,'12 · 빛과 시간','카펫의 네온은 서로 다른 리듬으로 밝아졌다 잦아듭니다',[1000,650,1.2]),
 ('auto-time',3,'12 · 빛과 시간','자동 모드는 한국 시간에 맞춰 아침·낮·노을·밤으로 전환',[1510,280,1.32]),
 ('leisure-pets',7,'13 · 사무실의 일상','게임·커피 휴식과 반려동물 산책 · 말풍선은 분위기용 대사예요',[960,590,1.35]),
 ('connections',6,'14 · 실행 연결','로그인된 Claude Code·Codex CLI 사용 · 프로젝트 폴더를 연결해요',[960,530,1.15]),
 ('overview-final',4,'BSD 가상 오피스','캐릭터에게 질문하고, 업무를 맡기고, 결과물을 확인하세요',[960,560,1]),
]
assert sum(p[1] for p in PLAN) == 120
assert len(set(p[0] for p in PLAN)) == 27
shots = {s['name']:s for s in data['shots']}
shots['team'] = {'name':'team','begin':7,'end':67}
timeline=[]
concat=['ffconcat version 1.0']
clock=0
for name,duration,title,caption,camera in PLAN:
    shot=shots[name]
    mark=next(m for m in data['marks'] if m['name']==name and m['n']==shot['begin'])
    frames=[f for f in data['frames'][shot['begin']:shot['end']] if f['t']>=mark['t']]
    assert len(frames)>3, f'캡처 부족: {name}'
    intervals=[max(.01,min(.4,frames[i+1]['t']-f['t'])) if i<len(frames)-1 else .1 for i,f in enumerate(frames)]
    total=sum(intervals)
    for f,dt in zip(frames,intervals):
        path=CAPTURE/f"{f['n']:06d}.jpg"
        assert path.exists()
        concat.extend([f"file '{path.as_posix()}'",f'duration {dt/total*duration:.8f}'])
    timeline.append(dict(name=name,start=clock,duration=duration,title=title,caption=caption,camera=camera))
    clock+=duration
concat.append(concat[-2])
(OUT/'footage.ffconcat').write_text('\n'.join(concat),encoding='utf-8')
(OUT/'timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding='utf-8')
def stamp(t):
    return f'{int(t)//3600:02d}:{int(t)//60%60:02d}:{int(t)%60:02d},000'
(OUT/'bsd-office-tour.ko.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(s['start'])} --> {stamp(s['start']+s['duration'])}\n{s['caption']}" for i,s in enumerate(timeline)),encoding='utf-8')
shutil.copy2(ROOT/'public/fonts/PretendardVariable.woff2',OUT/'PretendardVariable.woff2')
shutil.copy2(ROOT/'output/video-tools/node_modules/gsap/dist/gsap.min.js',OUT/'gsap.min.js')
shutil.copy2(ROOT/'output/tools/bang-motion/LICENSE',OUT/'BANG-MOTION-LICENSE.txt')
html=(ROOT/'scripts/video-tour/index.html').read_text(encoding='utf-8')
(OUT/'index.html').write_text(html.replace('/* TIMELINE_DATA */',json.dumps(timeline,ensure_ascii=False)),encoding='utf-8')
import imageio_ffmpeg
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(OUT/'footage.ffconcat'),'-t','120','-vf','scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x172337,setsar=1,fps=30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'footage.mp4')],check=True)
print('검증 통과: 120초, 28개 장면, 실제 캡처 기반 footage.mp4 생성 완료',flush=True)
