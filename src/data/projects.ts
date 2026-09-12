import type { PortfolioProject } from "@/types/project";

// TODO: 실제 프로젝트의 제목, 설명, 링크와 public/projects 이미지 경로로 교체하세요.
export const webProjects: PortfolioProject[] = [
  {
    id: "orbit",
    title: "Orbit",
    subtitle: "Record your ideas in 3D",
    projectType: "개인 프로젝트",
    description:
      "Orbit은 노트와 3D 지식 그래프를 결합한 데스크톱 중심의 노트 애플리케이션입니다. 노트를 기록하고 부모·자식, 카테고리, 태그로 연결해 아이디어의 구조와 흐름을 공간에서 탐색할 수 있습니다. Google OAuth와 Supabase RLS를 기반으로 사용자별 워크스페이스를 안전하게 분리하며, 로그인 전에도 예시 그래프를 자유롭게 체험할 수 있습니다.",
    technologies: [
      "React",
      "TypeScript",
      "Three.js",
      "R3F",
      "Tiptap",
      "Supabase",
    ],
    features: [
      {
        title: "3D 지식 그래프",
        description: "노트 사이의 관계와 흐름을 공간에서 탐색합니다.",
      },
      {
        title: "노션 스타일 에디터",
        description: "제목, 목록, Todo, 코드 등 다양한 블록을 편집합니다.",
      },
      {
        title: "다양한 그래프 레이아웃",
        description: "구형, Helix, 카테고리와 태그 기준으로 시점을 전환합니다.",
      },
      {
        title: "사용자별 워크스페이스",
        description: "Google 로그인과 RLS로 개인 노트를 안전하게 분리합니다.",
      },
    ],
    href: "https://orbit-notes.vercel.app/",
    repositoryHref: "https://github.com/Gwontaejun/orbit",
    image: "/web-project/orbit-icon.png",
    accent: "#8ba8ff",
  },
  {
    id: "channelytics",
    title: "Channelytics",
    subtitle: "유튜브 채널·영상 분석",
    projectType: "개인 프로젝트",
    description:
      "YouTube 채널이나 영상 URL을 입력하면 공개 데이터를 바탕으로 콘텐츠 성과와 시청자 반응을 분석합니다. 영상 댓글을 AI로 분류해 주요 요청과 불만, 콘텐츠 아이디어를 근거 댓글과 함께 보여주고 최근 영상의 성과와 포맷별 흐름을 시각화합니다.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "FastAPI",
      "YouTube API",
      "Gemini",
    ],
    features: [
      {
        title: "영상·채널 URL 자동 판별",
        description:
          "영상, 단축 URL, 채널 ID와 핸들 형식을 구분해 알맞은 분석 흐름으로 연결합니다.",
      },
      {
        title: "AI 댓글 분석",
        description:
          "최대 1,000개의 댓글을 분류하고 주요 요청·불만·콘텐츠 아이디어를 근거 댓글과 함께 제공합니다.",
      },
      {
        title: "채널 성과 스냅샷",
        description:
          "최근 28일 공개 영상의 성과와 롱폼·Shorts별 조회수 흐름을 시각화합니다.",
      },
      {
        title: "근거 중심 인사이트",
        description:
          "주요 요청과 불만 토픽, 콘텐츠 아이디어에 실제 분석 대상 댓글을 함께 연결합니다.",
      },
      {
        title: "채널 AI 인사이트",
        description:
          "최근 12개 영상의 공개 지표를 분석해 채널의 강점과 다음 콘텐츠 기회를 제안합니다.",
      },
      {
        title: "반응형 분석 대시보드",
        description:
          "분석 입력부터 영상·채널별 결과까지 데스크톱과 모바일에 최적화해 제공합니다.",
      },
    ],
    href: "https://channelytics-app.vercel.app/",
    repositoryHref: "https://github.com/Gwontaejun/channelytics",
    image: "/web-project/channelytics-icon.svg",
    accent: "#e684cc",
  },
];

// 회사 프로젝트는 공개 가능한 범위가 정리되면 이 배열에 추가합니다.
// 사이드 프로젝트와 분리해 모니터의 `실무 프로젝트` 폴더에서만 노출합니다.
export const workProjects: PortfolioProject[] = [
  {
    id: "skt-litmus-plus",
    title: "SKT Litmus+",
    subtitle: "이동 패턴 및 네트워크 모니터링 서비스",
    projectType: "실무 프로젝트",
    organization: "드제이",
    period: "2024.11 - 2025.02",
    description:
      "사용자의 이동·체류 패턴을 통계로 시각화하고 교통 및 네트워크 상태를 지도에서 모니터링하는 서비스입니다. Mapbox GL과 deck.gl을 결합해 대규모 공간 데이터를 직관적으로 탐색할 수 있도록 구현했습니다.",
    technologies: [
      "React",
      "TypeScript",
      "Zustand",
      "Chart.js",
      "deck.gl",
      "Mapbox GL",
    ],
    features: [
      {
        title: "공간 데이터 시각화",
        description:
          "Mapbox GL과 deck.gl 레이어를 결합해 이동·체류 데이터를 지도에 표현했습니다.",
      },
      {
        title: "H3 셀 및 3D 건물",
        description:
          "H3 기반 영역 집계와 3D 건물 레이어로 지역별 데이터를 입체적으로 탐색하도록 구성했습니다.",
      },
      {
        title: "렌더링 최적화",
        description:
          "초 단위 상태 갱신과 레이어 연산을 메모이제이션해 지도 렌더링 부하를 줄였습니다.",
      },
      {
        title: "CES 2025 대응",
        description:
          "전시 일정에 맞춰 서비스 완성도와 현장 시연 안정성을 개선했습니다.",
      },
    ],
    image: "/web-project/work-project.svg",
    accent: "#2563eb",
  },
  {
    id: "lg-hrdx-admin",
    title: "LG HRDX Career Advisor ADMIN",
    subtitle: "커리어 서비스 운영 관리 도구",
    projectType: "실무 프로젝트",
    organization: "드제이",
    period: "2024.03 - 2024.06",
    description:
      "Career Advisor의 운영 현황을 확인하고 사용자와 데이터를 관리하는 관리자 서비스입니다. 메뉴 진입, 체류 시간, 기능 사용량 등의 통계를 대시보드로 제공했습니다.",
    technologies: ["React", "TypeScript", "Redux", "Redux-Saga", "Ant Design"],
    features: [
      {
        title: "운영 통계 대시보드",
        description:
          "메뉴별 진입 수, 체류 시간, 기능 사용량을 한 화면에서 확인하도록 구현했습니다.",
      },
      {
        title: "사용자 관리",
        description:
          "회원 정보를 조회하고 운영에 필요한 관리 기능을 구성했습니다.",
      },
      {
        title: "데이터셋 관리",
        description:
          "서비스에서 사용하는 데이터셋을 조회하고 관리하는 화면을 개발했습니다.",
      },
      {
        title: "로그 조회",
        description:
          "운영 이슈를 추적할 수 있도록 서비스 로그 조회 흐름을 구현했습니다.",
      },
    ],
    image: "/web-project/work-project.svg",
    accent: "#7c3aed",
  },
  {
    id: "lg-hrdx-career-advisor",
    title: "LG HRDX Career Advisor",
    subtitle: "사내 커리어 성장 지원 서비스",
    projectType: "실무 프로젝트",
    organization: "드제이",
    period: "2023.11 - 2024.03",
    description:
      "구성원의 프로필, 조직 과제, 지원 요청, 보유 기술과 인력 이동을 관리하는 사내 커리어 서비스입니다. 복잡한 비동기 흐름과 권한 처리를 정리하고 재사용 가능한 UI 구조를 구축했습니다.",
    technologies: [
      "React",
      "TypeScript",
      "Redux",
      "Redux-Saga",
      "Ant Design",
      "Axios",
    ],
    features: [
      {
        title: "커리어 프로필",
        description:
          "개인의 기술과 경력 정보를 확인하고 관리하는 화면을 구현했습니다.",
      },
      {
        title: "조직 이동 및 과제",
        description:
          "조직 이동, 지원 요청, 과제 배정에 필요한 업무 흐름을 개발했습니다.",
      },
      {
        title: "비동기 상태 관리",
        description:
          "Redux-Saga로 API 호출과 인증이 포함된 비동기 흐름을 구성했습니다.",
      },
      {
        title: "공통 UI 체계",
        description:
          "Atomic Design과 Axios 인터셉터를 적용해 화면과 통신 로직의 일관성을 높였습니다.",
      },
    ],
    image: "/web-project/work-project.svg",
    accent: "#8b5cf6",
  },
  {
    id: "42dot-homepage",
    title: "42dot 홈페이지",
    subtitle: "기업 및 채용 홈페이지 리뉴얼",
    projectType: "실무 프로젝트",
    organization: "드제이",
    period: "2023.07 - 2023.09",
    description:
      "42dot의 기업 및 채용 홈페이지를 Next.js 13으로 리뉴얼한 프로젝트입니다. 프론트엔드 PL로서 일정과 업무를 조율하고 협력사 커뮤니케이션을 담당했습니다.",
    technologies: [
      "Next.js 13",
      "React",
      "TypeScript",
      "Recoil",
      "SSR",
      "SSG",
      "ISR",
    ],
    features: [
      {
        title: "프론트엔드 리딩",
        description:
          "업무 분배와 일정을 관리하고 협력사와 개발 범위를 조율했습니다.",
      },
      {
        title: "렌더링 전략",
        description: "페이지 성격에 맞춰 SSR, SSG, ISR을 구분해 적용했습니다.",
      },
      {
        title: "검색 노출 개선",
        description:
          "Next.js 메타데이터와 렌더링 방식을 활용해 SEO 기반을 정비했습니다.",
      },
      {
        title: "반응형 홈페이지",
        description:
          "기업 및 채용 콘텐츠를 다양한 화면에서 일관되게 제공하도록 구현했습니다.",
      },
    ],
    image: "/web-project/work-project.svg",
    accent: "#0891b2",
  },
  {
    id: "emart-ev-control",
    title: "이마트 EV 충전 관제",
    subtitle: "전기차 충전소 운영 관제 서비스",
    projectType: "실무 프로젝트",
    organization: "드제이",
    period: "2022.10 - 2023.10",
    description:
      "전기차 충전소의 운영 상태를 확인하고 관리하는 관제 서비스입니다. 사용자가 원하는 방식으로 대시보드를 구성하고 지도에서 충전소를 탐색할 수 있도록 개발했습니다.",
    technologies: ["React", "TypeScript", "Redux", "iNavi Maps"],
    features: [
      {
        title: "맞춤형 대시보드",
        description:
          "위젯을 이동하고 배치해 사용자별 관제 화면을 구성하도록 구현했습니다.",
      },
      {
        title: "지도 기반 탐색",
        description:
          "검색과 마커 기능을 연동해 충전소 위치와 상태를 빠르게 확인하도록 했습니다.",
      },
      {
        title: "복잡한 폼 최적화",
        description:
          "메모이제이션을 적용해 입력 항목이 많은 관리 화면의 렌더링 성능을 개선했습니다.",
      },
    ],
    image: "/web-project/work-project.svg",
    accent: "#059669",
  },
  {
    id: "lg-ev-control",
    title: "LG EV 충전 관제",
    subtitle: "글로벌 전기차 충전 운영 서비스",
    projectType: "실무 프로젝트",
    organization: "드제이",
    period: "2022.01 - 2022.09",
    description:
      "전기차 충전소와 충전기의 상태를 관리하는 운영 관제 서비스입니다. 접근성과 다국어 대응을 강화하고 Google Maps 기반의 검색 및 마커 기능을 구현했습니다.",
    technologies: ["React", "TypeScript", "Redux", "Google Maps", "i18n"],
    features: [
      {
        title: "웹 접근성",
        description:
          "웹와치 접근성 평가 100%를 달성할 수 있도록 인터페이스를 개선했습니다.",
      },
      {
        title: "다국어 지원",
        description:
          "해외 운영 환경을 고려해 i18n 기반의 다국어 구조를 적용했습니다.",
      },
      {
        title: "지도 기반 관제",
        description:
          "Google Maps 검색과 마커를 연결해 충전소 탐색 기능을 구현했습니다.",
      },
      {
        title: "화면 성능 개선",
        description:
          "상태와 컴포넌트 렌더링을 메모이제이션해 관제 화면의 반응성을 높였습니다.",
      },
    ],
    image: "/web-project/work-project.svg",
    accent: "#0d9488",
  },
];

export const duckRoutineProject: PortfolioProject = {
  id: "duck-routine",
  title: "Duck Routine",
  subtitle: "작은 시작을 돕는 루틴",
  projectType: "개인 프로젝트",
  description:
    "막막한 일을 아주 작은 행동 단위로 나누어 부담 없이 첫걸음을 뗄 수 있도록 돕는 앱입니다. 오늘 할 일을 일정으로 등록하고 단계별 타이머를 따라가며 하나씩 완료할 수 있습니다.",
  technologies: [
    "Expo 54",
    "React Native 0.81",
    "TypeScript 5.9",
    "Expo Router",
    "AsyncStorage",
  ],
  features: [
    {
      title: "작은 단계의 루틴",
      description:
        "기본 루틴을 활용하거나 나만의 루틴을 작은 행동 단위로 만들 수 있습니다.",
    },
    {
      title: "일정과 반복 설정",
      description:
        "날짜, 요일, 기간을 기준으로 일정을 계획하고 알림을 받을 수 있습니다.",
    },
    {
      title: "단계별 진행 타이머",
      description:
        "각 행동에 집중할 시간을 설정하고 루틴을 순서대로 이어갈 수 있습니다.",
    },
    {
      title: "활동 기록",
      description:
        "완료 횟수, 연속 일수, 누적 시간과 일별 활동 차트를 확인할 수 있습니다.",
    },
  ],
  // TODO: Play Store 심사가 끝나면 실제 스토어 URL로 교체하세요.
  href: "",
  repositoryHref: "https://github.com/Gwontaejun/duck-routine",
  image: "/app-project/duck-routine-icon.png",
  accent: "#ff7a16",
};

// 포트폴리오에 노출되는 실제 앱 프로젝트 목록입니다.
export const appProjects: PortfolioProject[] = [duckRoutineProject];

// TODO: 데이터 구조 참고용 예시입니다. 실제 앱을 추가할 때 appProjects에 연결하세요.
export const exampleAppProjects: PortfolioProject[] = [
  {
    id: "mori",
    title: "Mori",
    description: "매일의 기분과 작은 순간을 기록하는 감정 저널.",
    technologies: ["React Native", "Expo", "Firebase"],
    href: "https://play.google.com/store",
    image: "/projects/mori-placeholder.svg",
    accent: "#f09a99",
  },
  {
    id: "stride",
    title: "Stride",
    description: "나만의 속도로 루틴을 만들고 지켜가는 습관 트래커.",
    technologies: ["Flutter", "Dart", "SQLite"],
    href: "https://play.google.com/store",
    image: "/projects/stride-placeholder.svg",
    accent: "#78b6ac",
  },
  {
    id: "pulse",
    title: "Pulse",
    description: "집중 시간과 휴식 리듬을 관리하는 미니 타이머.",
    technologies: ["React Native", "TypeScript"],
    href: "https://play.google.com/store",
    image: "/projects/pulse-placeholder.svg",
    accent: "#8a9ff0",
  },
  {
    id: "pocket",
    title: "Pocket",
    description: "떠오른 아이디어를 빠르게 모으는 메모 앱.",
    technologies: ["Expo", "SQLite"],
    href: "https://play.google.com/store",
    image: "/projects/pocket-placeholder.svg",
    accent: "#e6b66c",
  },
];
