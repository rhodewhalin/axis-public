# AXIS 학습 세션 — 완전공개판 (axis-public)

폐쇄망 로컬 AI(sLM) 배경지식 자습 사이트. 하드웨어 → LLM 동작 원리 → 양자화 → 서빙 엔진 → RAG·에이전트 → 평가, 7개 모듈 + 퀴즈 + 자가진단.

- 정적 HTML/CSS/JS — 빌드·설치 불필요, GitHub Pages로 서빙
- `specs/`는 초기 콘텐츠 스펙(이후 개정은 HTML이 원본 — 디자인은 화이트+레드 v2, 퀴즈는 재시도형 v2)

## 3-tier 구조에서 이 저장소의 위치

| tier | 저장소 | 내용 |
|---|---|---|
| **대외 완전공개** | **axis-public (이 저장소)** | 기관 실명·개인 발표 귀속·내부 인프라 식별정보 전부 제거된 일반 교육 콘텐츠 |
| 원내 공개 | axis-internal | public + 기관 맥락 복원 (개인 발표·프로젝트 귀속은 여기서도 제외) |
| 인트라넷 | axis-lab | trial 기록 플랫폼 — 사내망 전용, VPS·클라우드 배포 금지 |

콘텐츠 개정 흐름: **public에서 수정 → internal로 cherry-pick** (역방향 금지 —
internal에만 있는 기관 맥락이 public으로 흘러들어오는 사고 방지).

## push 전 게이트 (필수)

```bash
./scripts/check_public.sh
```

기관 실명·개인 귀속·내부 인프라 식별정보·발표덱 잔존을 검사한다. 실패하면 push 금지.

## 배포

- **라이브: https://rhodewhalin.github.io/axis-public/** (GitHub Pages, main 브랜치)
- `pdf/`는 이 공개 사이트에서 재생성한 12종(2026-07-19) — 콘텐츠 수정 후 `scripts/make-pdfs.sh` 재실행
- 커스텀 도메인을 붙이려면 CNAME 파일 추가 + DNS 설정 (원내용 axis.tesorae.com과는 별개 운영)

## 원본 대비 제외된 것

- `deck.html` + `assets/deck.js` (발표덱) 및 index의 덱 배너
