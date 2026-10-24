# BSD 사무실 기능 투어

사용자 승인: 비공개 `bsd-agent-office`, 음성 없는 한국어 자막, 16:9 약 2분, 실제 로컬 화면만 사용.

Bang Motion v1.19.0의 카메라 리그, GSAP 단일 타임라인, 영상 레이어 시간 동기화와 프레임 출력 방식을 적용했다. 출처: https://github.com/bangtutorial/bang-motion (MIT, Copyright 2026 Bang Tutorial).

## 제작 하네스

1. 실제 앱의 UI를 조작하며 CUA CDP 화면 캡처로 JPEG 프레임과 `capture.json`을 로컬 `output/office-tour-capture`에 저장한다.
2. `build.py`가 장면별 프레임 존재, 최소 캡처 수, 120초 구성을 검사하고 영상·자막·편집 가능한 HTML을 `output/bsd-office-tour-v2`에 생성한다.
3. `node scripts/video-tour/serve.mjs`로 127.0.0.1:43142에서 미리 보기를 연다. 영상 탐색을 위해 HTTP Range 요청을 지원한다.
4. `render-layers.mjs`는 HTML에서 28개 자막 레이어와 3,600개 GSAP 카메라 좌표를 내보낸다. `encode.py`는 실제 녹화에 같은 카메라 이징과 자막을 합성한다. 각 장면의 카메라 값은 GSAP 값과 자동 비교한다. 전체 화면을 매 프레임 브라우저에서 캡처하는 대안은 `render.mjs`에 남겨 두었다.
5. 주요 장면 검수 이미지와 브라우저 재생, 최종 영상 디코딩을 확인한다.

렌더링 도구는 `output/video-tools`의 Puppeteer·GSAP와 Python imageio-ffmpeg를 사용한다. 영상에는 계정 비밀값이 없으며 입력 시연은 제출 전임을 자막으로 표시한다. 기존 실제 제공자 응답과 결과물을 사용하며 새 실행으로 가장하지 않는다. 회의는 시각적 배치 기능, 일상 말풍선은 준비된 분위기용 대사다.

영상·원본 녹화·실행 결과는 `.gitignore` 대상인 `output/`에만 보관한다. 재현에 필요한 촬영 데이터는 개인 로컬 자료이므로 저장소에 올리지 않는다.
