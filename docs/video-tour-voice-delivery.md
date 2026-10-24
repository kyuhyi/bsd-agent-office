# 한국어 음성 안내 영상

2026-10-24, 기존 Bang Motion 기능 투어에 한국어 여성 안내 음성, 사용자 제공 BGM, 실제 3D 회전과 확대·축소 촬영을 추가했다.

- 결과: `output/bsd-office-tour-voice-v3/BSD-Office-Tour-KO-Voice-1080p.mp4`
- 로컬 미리보기: http://127.0.0.1:43143/
- 길이 133초, 1920×1080, 30fps, 3,990프레임, H.264 + AAC 48kHz 스테레오.
- ElevenLabs 로그인된 Free 계정의 Anna Kim / Eleven Multilingual v2로 한국어 18구간 생성. 시작 10,000, 종료 9,338크레딧. 유료 결제 없음.
- 사용자 음악 `BSD_BG.mp3`는 로컬에서만 합성했다. 37초 음악의 반복 경계를 1.2초 크로스페이드하고, 음성이 나올 때 자동으로 볼륨을 낮췄다.
- 사무실 회전은 실제 OrbitControls 드래그로 촬영했다. 드래그 총 길이 1,040px / 캔버스 높이 1,040px로 한 바퀴 회전. 18초간 473프레임을 확보해 14초 도입부로 편집했다.
- 실제 확대·축소 125프레임을 8초 화면 제어 장면에 배치했다. 촬영용 브라우저 크기 변경은 복원했다.

## 검증

18개 원본 음성을 끝까지 PCM으로 디코딩해 실제 길이를 측정했다. 구간별 대본, 화면 기준점, 시작·끝 시간은 `scripts/video-tour/voice-plan.json`에 있다. 음성 해시 중복 없음, 전체 시간 범위 안 배치, 필요한 구간만 1.18배 이하 속도 보정 제한을 검증했다.

로컬 Whisper small로 18개 음성을 다시 인식해 대본과 비교했다. 한국어 설명 내용은 모두 대응하며 고유명사와 일부 단어에는 음성인식 표기 차이가 있다. 인식 결과는 완벽한 청취 품질 보증을 의미하지 않는다.

최종 MP4 전체 디코딩 통과. 측정 음량 -15.98 LUFS, true peak -1.53dBTP. 브라우저에서 133초·1080p·음소거 해제·실제 재생·오류 없음 확인. 기존 무음 영상과 원본 BGM은 보존했다.

이번 버전 역시 이전 영상의 실제 저장 응답과 결과물을 보여준다. 업무 입력은 제출 전 시연이며 새로운 작업을 생성했다고 표현하지 않는다. 회의 소집은 시각 동작, 분위기 말풍선은 사전 작성 대사다.

## 재현

1. 실제 브라우저 촬영을 버전별 `orbit-capture`, `zoom-stills` 폴더와 시간 메타데이터로 보관한다.
2. `node scripts/video-tour/voice-layers.mjs`로 기존 Bang Motion 레이아웃의 새 자막 레이어를 만든다.
3. `python scripts/video-tour/voice-build.py video`로 회전·확대 장면과 기존 기능 장면을 합친다.
4. 로그인된 ElevenLabs 화면에서 각 대본을 생성하고 `voice/<id>.mp3`로 보관한다. API 키를 사용하거나 저장하지 않는다.
5. `python scripts/video-tour/voice-build.py audio`, `python scripts/video-tour/voice-build.py mux`로 합성한다.
6. `python scripts/video-tour/voice-verify.py`로 음성과 전체 파일을 검증한다.

출력 파일이 있으면 FFmpeg는 자동 덮어쓰지 않는다. 새 버전 폴더를 쓰거나 명시적으로 확인한 뒤 처리한다. 영상·목소리·BGM·사용자 기존 대본은 Git에 포함하지 않는다. ElevenLabs 무료 플랜의 사용 조건과 상업적 이용 가능 여부는 외부 공개 전에 해당 계정의 약관을 확인해야 한다.
