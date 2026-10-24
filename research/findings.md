# 참고 사무실 조사 기록

조사일: 2026-10-24 / 상태: 공개 게시물과 영상 화면 분석. 원본 앱 소스 분석 아님.

## 출처
- 사용자 공유 링크: https://www.threads.com/share/HvuW-Ffdi
- 확인된 원문: https://www.threads.com/@littlewins_log/post/De07SwjD3kU
- 제작 방식 설명: 동일 원문 댓글의 작성자 답변.
- 브라우저 실행 답변: https://www.threads.com/@littlewins_log/post/De1UaSjknn4
- 사용자 제공 스크린샷: codex-clipboard-5bcba80c-29fb-4c9c-8bb0-b587ab545305.png
- 관측 자료: threads-reference.png, reference-5s.png, reference-15s.png, reference-25s.png

## 관측·설명·추정 구분
| 항목 | 근거 | 판정 |
|---|---|---|
| 브라우저 실행 | 작성자의 공개 댓글 | 작성자 설명 확인 |
| 원하는 사무실 이미지를 Claude에 제공하고 대화로 다듬음 | 작성자의 제작 방법 댓글 | 작성자 설명 확인 |
| 영상 길이 약 32.33초 | 페이지 video 메타데이터 | 직접 확인 |
| 고정된 아이소메트릭 공간 | 첨부 및 5/15/25초 화면 | 해당 구간 관측 |
| 캐릭터 위치와 말풍선 변화 | 서로 다른 시점의 캡처 | 직접 확인 |
| 업무 상태·부서·보고함·결재함·대화창 | 첨부 및 영상 화면 | UI 존재 확인 |
| 고정 배경 + 독립 캐릭터 + UI 레이어 | 배경의 동일성과 캐릭터 위치 변화 | 재현 가능한 구조에 대한 추정 |
| React, Canvas, PixiJS, Three.js 중 원본 엔진 | 원본 앱 URL/소스 없음 | 미확인 |
| 보행 프레임/리깅/보간 구현 | 샘플 화면만 확보 | 미확인 |
| CLI 실제 실행, 토큰 잔량, 작업 결과 진위 | 영상에서 백엔드 증거 확인 불가 | 미확인 |

## 역설계 한계
Threads 페이지의 기술 스택을 원본 사무실의 기술 스택으로 취급하지 않는다. 원본 웹 앱의 실행 주소나 소스가 없는 상태에서 REA로 Threads 자체를 분석해도 사무실 엔진은 확인되지 않는다. 따라서 이번 결과는 관측 가능한 UX와 재현 설계이며 원본 코드 복원은 아니다.

## 로컬 준비 상태
- 최초 작업 폴더는 비어 있었다.
- Claude Code, Codex, Node.js, npm 실행 파일을 확인했다.
- `codex exec --help`: 비대화형 실행, JSONL 출력, 작업 디렉터리와 세션 재개 기능 확인.
- `claude --help`: 비대화형 실행, stream-json 출력, 세션 재개와 도구 권한 옵션 확인.
- 로그인 상태·실제 추론·프로젝트 수정·배포는 실행하지 않았다.
- .env와 인증 파일 내용은 읽지 않았다.

## 재현 설계 참고
- Three.js 애니메이션 시스템: https://threejs.org/manual/pages/animation-system.html
- Claude Code 프로그램 실행: https://code.claude.com/docs/en/headless
- Codex 연결 가능 옵션은 설치된 CLI 도움말을 근거로 한다.
- Claude의 bare 모드는 구독 로그인과 다르게 동작하므로 사용자 로그인 기반 운영에 무조건 적용하지 않는다.
