<div align="center">

# J00N Portfolio

### Frontend Developer · 권태준

실제 작업 공간을 둘러보듯 웹·모바일 프로젝트 개발 경험을 탐색하는 3D 포트폴리오입니다.

</div>

## 프로젝트 소개

J00N Portfolio는 단순한 프로젝트 목록 대신 개발자의 책상을 하나의 인터페이스로 구성했습니다. 모니터에서는 실무·사이드 프로젝트와 프로필을 확인하고, 휴대폰에서는 모바일 앱을 살펴볼 수 있습니다. 코르크보드에는 이력서와 방문자가 남긴 방명록이 포스트잇 형태로 표시됩니다.

화면 속 기기와 오브젝트는 React Three Fiber로 렌더링하며, 실제 정보 화면은 Drei `Html`과 React UI를 결합해 선명도와 상호작용을 유지합니다.

> 3D 오브젝트와 넓은 화면 구성을 온전히 경험하려면 가로 1400px 이상의 데스크톱 환경을 권장합니다. 1400px 미만에서는 별도의 데스크톱 접속 안내 화면을 제공합니다.

## 프리뷰

![J00N Portfolio 작업 공간](./public/screenshot/전체%20캡처1.PNG)

## 기술 스택

### Frontend

<p>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

### 3D & Interaction

<p>
  <img src="https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-9-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Three Fiber" />
  <img src="https://img.shields.io/badge/React_Three_Drei-10-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React Three Drei" />
  <img src="https://img.shields.io/badge/Framer_Motion-13-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

### Data & Deployment

<p>
  <img src="https://img.shields.io/badge/Supabase-2-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Next.js_Route_Handlers-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js Route Handlers" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

### Code Quality

<p>
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript Strict Mode" />
  <img src="https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
</p>

## 주요 경험

### 모니터 · 웹 프로젝트 탐색

Windows 데스크톱을 모티브로 구성한 모니터에서 실무 프로젝트와 사이드 프로젝트를 폴더로 구분해 탐색할 수 있습니다. 프로젝트 상세 화면에서는 소개, 기술 스택, 주요 기능과 외부 링크를 확인합니다.

![Orbit 프로젝트 상세 화면](./public/screenshot/모니터%20캡처1.PNG)

### 프로필 · 경력과 기술

프로필 창에서는 경력, 주요 업무 경험, 학력, 자격증, 기술 스택과 협업 도구를 확인할 수 있습니다. 왼쪽 프로필 카드는 고정하고 오른쪽 상세 정보만 스크롤되도록 구성했습니다.

![프로필 상세 화면](./public/screenshot/모니터%20캡처2.PNG)

### 데스크톱형 프로젝트 브라우저

프로필과 프로젝트 폴더는 바탕화면과 작업표시줄에서 열고 최소화하거나 다시 복원할 수 있습니다. 여러 창은 사용자가 직접 닫기 전까지 실행 상태를 유지합니다.

![모니터 기본 화면](./public/screenshot/모니터%20캡처3.PNG)

### 휴대폰 · 앱 프로젝트

휴대폰을 선택하면 모델이 사용자 앞으로 이동해 정면을 향합니다. Android 화면 문법을 기반으로 앱 소개, 기술 스택, 주요 기능과 스토어·GitHub 링크를 제공합니다.

![Duck Routine 앱 상세 화면](./public/screenshot/모바일%20캡처1.PNG)

### 코르크보드 · 프로필과 방명록

코르크보드에는 프로필 미리보기와 방명록이 배치됩니다. 방명록은 로그인 없이 작성할 수 있으며, Supabase에 저장된 메시지를 포스트잇 형태로 불러옵니다.

![코르크보드 방명록 화면](./public/screenshot/보드%20캡처1.PNG)

## 주요 기능

- GLB 모델을 활용한 개발자 작업 공간과 비 오는 창문 연출
- 모니터·휴대폰·코르크보드로 연결되는 오브젝트 중심 탐색
- 카메라 및 휴대폰 모델의 부드러운 포커스·복귀 애니메이션
- Windows 스타일 프로젝트 브라우저와 Android 스타일 앱 화면
- 실무 프로젝트, 사이드 프로젝트, 앱 프로젝트 데이터 분리
- 경력·업무 경험·기술 스택을 담은 프로필 화면
- Supabase와 Next.js Route Handler 기반 익명 방명록
- 처음 방문한 사용자를 위한 단계별 3D 오브젝트 가이드
- 모바일·좁은 화면의 불필요한 3D 로딩을 차단하는 접속 안내

## 프로젝트 구조

```text
app/
├─ api/guestbook/                 # 방명록 조회·등록 Route Handler
├─ layout.tsx                     # 전역 레이아웃과 메타데이터
└─ page.tsx                       # 화면 크기 분기와 3D 씬 진입점

src/
├─ data/projects.ts               # 웹·실무·앱 프로젝트 데이터
├─ features/
│  ├─ desk-interaction/           # 3D 장면, 기기, 방과 카메라 상호작용
│  ├─ guestbook/                  # 방명록 UI와 데이터 타입
│  └─ project-browser/            # 인트로, 가이드, 모바일 안내
├─ shared/                        # 공용 훅과 Supabase 서버 클라이언트
└─ types/                         # 프로젝트와 장면 타입

public/
├─ 3d-models/                     # 책상과 기기 GLB 모델
├─ app-project/                   # 앱 프로젝트 이미지
├─ web-project/                   # 웹 프로젝트 이미지
├─ screenshot/                    # README 화면 이미지
└─ textures/                      # 장면 텍스처
```

---

<div align="center">
  <strong>J00N · Frontend Developer</strong>
</div>
