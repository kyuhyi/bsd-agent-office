# 사무실 기능 투어 제작 완료

2026-10-24 사용자 승인에 따라 비공개 `kyuhyi/bsd-agent-office` 저장소를 생성하고 앱 소스를 업로드했다.

영상 규격은 16:9, 1920×1080, 30fps, 120초이며 음성 없이 한국어 자막만 사용한다. 전체 28개 장면이 실제 로컬 사무실 화면에서 촬영됐다. 이 문서의 확정 내용이 초기 `video-tour-brief.md`의 선택 대기 항목보다 우선한다.

- 최종 파일: `output/bsd-office-tour-v2/BSD-Office-Tour-1080p.mp4`
- 자막: `output/bsd-office-tour-v2/bsd-office-tour.ko.srt`
- 편집 가능한 Bang Motion 화면: `output/bsd-office-tour-v2/index.html`
- 제작·검수 도구: `scripts/video-tour/`
- 로컬 영상 재생: `http://127.0.0.1:43142/BSD-Office-Tour-1080p.mp4`

## 검증

- 앱 테스트 39개 통과.
- 영상 전체 디코딩 통과: 3,600프레임, 120초, 1920×1080, 30fps, 오디오 없음.
- 28개 장면의 카메라 좌표를 실제 GSAP 타임라인과 비교했다.
- 대표 장면 12개를 확인하고, Codex 체크리스트 3/3 완료와 Claude 준비 항목 펼침 상태를 별도로 확인했다.
- 완성 MP4를 브라우저에서 열고 재생 시간 증가, 실제 1920×1080 해상도, 오류 없음 확인.

기존 실제 Claude·Codex 응답과 생성 결과물을 시연한다. 새 질문·업무 입력은 제출 전 시연이며 자막으로 명시한다. 회의 버튼은 직원의 시각적 배치 기능이고 AI 회의 실행은 별도로 업무 지시한다. 일상 말풍선은 준비된 분위기용 대사다.

영상과 원본 녹화는 로컬에 보관하며 GitHub에는 앱·제작 소스만 올린다. 로그인 정보, `.env`, `.office` 작업 기록은 저장소에서 제외한다. 추가 유료 생성은 사용하지 않았다.

제작 프레임워크: [Bang Motion v1.19.0](https://github.com/bangtutorial/bang-motion), MIT © 2026 Bang Tutorial. 라이선스 사본은 `scripts/video-tour/BANG-MOTION-LICENSE.txt`에 포함되어 있다.
