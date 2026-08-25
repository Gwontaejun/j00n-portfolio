import type { PortfolioProject } from "@/types/project";

// TODO: 실제 프로젝트의 제목, 설명, 링크와 public/projects 이미지 경로로 교체하세요.
export const webProjects: PortfolioProject[] = [
  {
    id: "orbit",
    title: "Orbit",
    subtitle: "Record your ideas in 3D",
    projectType: "개인 프로젝트",
    description:
      "개인 프로젝트로 제작한 Orbit은 노션과 유사한 편집 경험에 3D 지식 그래프를 결합한 데스크톱 중심의 노트 애플리케이션입니다. 노트를 기록하고 부모·자식, 카테고리, 태그로 연결해 아이디어의 구조와 흐름을 공간에서 탐색할 수 있습니다. Google OAuth와 Supabase RLS를 기반으로 사용자별 워크스페이스를 안전하게 분리하며, 로그인 전에도 예시 그래프를 자유롭게 체험할 수 있습니다.",
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
];

export const duckRoutineProject: PortfolioProject = {
  id: "duck-routine",
  title: "Duck Routine",
  subtitle: "작은 시작을 돕는 루틴",
  projectType: "개인 프로젝트",
  description:
    "막막한 일을 아주 작은 행동 단위로 나누어 부담 없이 첫걸음을 뗄 수 있도록 돕는 앱입니다. 오늘 할 일을 일정으로 등록하고 단계별 타이머를 따라가며 하나씩 완료할 수 있습니다.",
  technologies: ["Expo 54", "React Native 0.81", "TypeScript 5.9", "Expo Router", "AsyncStorage"],
  features: [
    {
      title: "작은 단계의 루틴",
      description: "기본 루틴을 활용하거나 나만의 루틴을 작은 행동 단위로 만들 수 있습니다.",
    },
    {
      title: "일정과 반복 설정",
      description: "날짜, 요일, 기간을 기준으로 일정을 계획하고 알림을 받을 수 있습니다.",
    },
    {
      title: "단계별 진행 타이머",
      description: "각 행동에 집중할 시간을 설정하고 루틴을 순서대로 이어갈 수 있습니다.",
    },
    {
      title: "활동 기록",
      description: "완료 횟수, 연속 일수, 누적 시간과 일별 활동 차트를 확인할 수 있습니다.",
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
