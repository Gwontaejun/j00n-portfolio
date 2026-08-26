# 프로젝트 상태 및 인수인계

최종 갱신: 2026-08-26

이 문서는 채팅 기록 없이도 다른 컴퓨터나 새 AI 세션에서 작업을 이어가기 위한 현재 상태 요약이다. 구현과 내용이 달라지면 즉시 갱신한다.

## 현재 콘셉트

`J00N Portfolio`는 사용자가 개발자의 실제 작업 책상을 둘러보며 웹 프로젝트, 앱 프로젝트, 프로필을 확인하는 3D 포트폴리오다. 방에는 책상, 모니터, 휴대폰과 거치대, 키보드, 마우스, 장패드, 카피홀더, 조명, 비 오는 창문이 있다.

인트로는 `J00N` 타이핑 후 `Portfolio`가 페이드인되고, 인트로가 완전히 사라진 다음 3D 장면을 보여준다.

## 현재 콘텐츠

### 웹 프로젝트

- Orbit | Record your ideas in 3D
- 서비스: https://orbit-notes.vercel.app/
- GitHub: https://github.com/Gwontaejun/orbit
- 대표 기술: React, TypeScript, Three.js, React Three Fiber, Tiptap, Supabase
- 현재 웹 프로젝트는 Orbit 하나만 노출한다.

### 앱 프로젝트

- Duck Routine | 작은 시작을 돕는 루틴
- GitHub: https://github.com/Gwontaejun/duck-routine
- 상태: 출시 준비 중
- Play Store 링크는 앱 심사 후 `src/data/projects.ts`에 추가한다.
- 대표 기술: Expo 54, React Native 0.81, TypeScript 5.9, Expo Router, AsyncStorage
- 현재 홈 화면에는 Duck Routine 하나만 노출한다.

### 프로필

- 책상 왼쪽의 `paper-holder.glb` 카피홀더에 로컬 이력서 첫 페이지 이미지를 표시한다.
- 이력서 원본은 `public/pdf/profile.pdf`, 미리보기는 `public/pdf/profile-page-1.png`를 사용한다.
- PDF 공개 경로는 `src/features/desk-interaction/model/resume.ts`에서 관리한다.
- 클릭하면 별도의 프로필 상세 뷰가 부드럽게 열리고 닫힌다.

## 상호작용 상태

### 책상

- 기본 카메라 위치: `[0.07, 3.15, 5.36]`
- 기본 카메라 타깃: `[0.04, 1.54, -0.45]`
- 기본적으로 카메라 이동은 잠겨 있다.
- 장면 준비 전에는 우측 상단 카메라 버튼을 표시하지 않는다.
- 모니터, 휴대폰, 프로필 상세가 활성화되면 다른 대상의 입력을 차단한다.

### 모니터

- 비활성 상태에서 화면 호버 시 회색 딤과 큰 눈 아이콘을 표시한다.
- 클릭하면 카메라가 모니터 앞으로 천천히 이동한다.
- 모니터 내부는 Windows 계열 데스크톱 문법을 사용한다.
- 작업표시줄에서 프로젝트를 선택·검색하며 화면에는 선택한 프로젝트 하나만 표시한다.
- 모니터 확대 전에는 내부 버튼이 동작하지 않는다.
- 프로젝트 창은 Windows식 최소화·닫기 버튼과 부드러운 전환을 사용한다.

### 휴대폰

- 비활성 상태에서 호버 시 모니터와 같은 눈 아이콘 계열을 표시한다.
- 클릭하면 휴대폰이 현재 위치에서 사용자 앞으로 이동하고 정면을 향한다. 카메라는 움직이지 않는다.
- Android 스타일 상태 표시와 하단 탐색을 사용한다.
- 하단 탐색 순서: 최근 앱(왼쪽), 홈(가운데), 뒤로가기(오른쪽).
- Duck Routine 상세 순서: 헤더/상태, Play Store·GitHub, 기술 스택, 앱 소개, 주요 기능.
- 상세 내용은 휴대폰 화면 안에서 스크롤할 수 있다.

## 중요한 파일

- `app/page.tsx`: 페이지 최상위 상태와 장면 연결
- `src/features/desk-interaction/components/DeskScene.tsx`: 장면, 카메라, 포커스 상태
- `src/features/desk-interaction/components/Monitor.tsx`: 모니터 화면과 웹 프로젝트 UI
- `src/features/desk-interaction/components/Phone.tsx`: 휴대폰 홈과 앱 상세 UI
- `src/features/desk-interaction/components/CopyHolder.tsx`: 책상 위 프로필 미리보기
- `src/features/desk-interaction/components/ResumeViewer.tsx`: 프로필 상세 화면
- `src/features/desk-interaction/components/RoomEnvironment.tsx`: 방과 창문, 비 효과
- `src/features/desk-interaction/model/scene.ts`: 기본 카메라와 책상 기준값
- `src/data/projects.ts`: 실제 프로젝트 콘텐츠와 링크

## 렌더링 및 리소스 상태

- Canvas는 DPR 1, 비활성화된 안티앨리어싱, demand 렌더 루프를 사용한다.
- 창문의 비 셰이더가 활성화된 동안에는 애니메이션을 위해 매 프레임 렌더링한다.
- 키보드는 `low-poly-keyboard.glb`를 사용하고 그림자를 생성하지 않는다.
- 장패드는 별도 GLB 대신 `DeskAccessories.tsx`의 라운드 도형으로 생성한다.
- 모니터·휴대폰·프로필 화면은 Drei `Html`을 사용하며 정면에서만 보이도록 처리한다.
- 휴대폰 이동 프레임은 HTML 좌표 계산보다 먼저 실행하고 월드 행렬을 즉시 갱신한다.

## 다음 후보 작업

- Duck Routine Play Store 심사 완료 후 실제 링크 추가
- 방명록 UX 결정: 모니터 앱으로 넣을지 실제 책상 위 노트 오브젝트로 만들지 미정
- 휴대폰 실기기 및 좁은 브라우저 화면에서 텍스트 크기와 스크롤 최종 검증
- 3D 장면과 `Html` 오버레이가 앞뒤에서 올바르게 가려지는지 회귀 검증
- 휴대폰 이동 중 모델과 `Html` 화면의 동기화 상태를 다양한 프레임률에서 검증

## 새 환경 체크리스트

```bash
git clone <repository-url>
cd j00n-portfolio
npm install
npm run typecheck
npm run lint
npm run dev
```

새 AI 대화의 첫 요청 예시:

> 이 저장소의 AGENTS.md와 docs/PROJECT_STATE.md를 먼저 읽고 현재 작업을 이어서 진행해줘. 기존 사용자 변경은 보존하고, 작업 후 상태 문서도 갱신해줘.

작업을 마칠 때는 코드와 이 문서를 같은 커밋에 포함하고 원격 저장소에 푸시한다. 채팅 전문을 옮기지 않아도 저장소의 코드, 규칙, 현재 상태만으로 이어갈 수 있게 유지하는 것이 목표다.
