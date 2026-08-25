# J00N Portfolio

개발자 권태준의 웹·모바일 프로젝트를 실제 작업 책상처럼 둘러보는 3D 포트폴리오입니다.

## 실행 방법

필요 환경:

- Node.js 22.13 이상
- npm

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시된 로컬 주소를 엽니다.

## 검증 명령

```bash
npm run typecheck
npm run lint
npm run build
```

이 프로젝트는 Next.js App Router API를 사용하지만, 개발 및 빌드 런타임은 `vinext`와 Vite 기반입니다. 일반적인 `next dev`가 아니라 위 npm 스크립트를 사용해야 합니다.

## 주요 구조

```text
app/                              # App Router 진입점과 전역 스타일
src/data/projects.ts              # 웹/앱 프로젝트 데이터
src/types/project.ts              # 프로젝트 타입
src/features/desk-interaction/    # 3D 책상과 기기 상호작용
src/features/project-browser/     # 인트로와 보조 프로젝트 UI
src/shared/                       # 공용 훅과 유틸리티
public/3d-models/                 # GLB 모델
public/web-project/               # 웹 프로젝트 이미지
public/app-project/               # 앱 프로젝트 이미지
public/textures/                  # 배경 및 장면 텍스처
docs/PROJECT_STATE.md             # 현재 구현 상태와 인수인계 기록
AGENTS.md                         # AI 작업 규칙
```

## 다른 컴퓨터에서 이어서 작업하기

1. 현재 변경 사항을 커밋하고 원격 저장소에 푸시합니다.
2. 다른 컴퓨터에서 저장소를 clone 또는 pull 합니다.
3. `npm install` 후 `npm run dev`를 실행합니다.
4. 새 AI 대화에서는 먼저 `AGENTS.md`와 `docs/PROJECT_STATE.md`를 읽도록 요청합니다.

필수 환경변수는 현재 없습니다. 프로젝트 결정이나 미완료 작업이 바뀌면 같은 커밋에서 `docs/PROJECT_STATE.md`도 갱신합니다.
