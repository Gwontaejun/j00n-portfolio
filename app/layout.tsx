import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const a2z = localFont({
  src: [
    { path: "../src/assets/fonts/에이투지체-1Thin.woff2", weight: "100" },
    { path: "../src/assets/fonts/에이투지체-2ExtraLight.woff2", weight: "200" },
    { path: "../src/assets/fonts/에이투지체-3Light.woff2", weight: "300" },
    { path: "../src/assets/fonts/에이투지체-4Regular.woff2", weight: "400" },
    { path: "../src/assets/fonts/에이투지체-5Medium.woff2", weight: "500" },
    { path: "../src/assets/fonts/에이투지체-6SemiBold.woff2", weight: "600" },
    { path: "../src/assets/fonts/에이투지체-7Bold.woff2", weight: "700" },
    { path: "../src/assets/fonts/에이투지체-8ExtraBold.woff2", weight: "800" },
    { path: "../src/assets/fonts/에이투지체-9Black.woff2", weight: "900" },
  ],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "J00N | Frontend Developer",
  description:
    "웹과 모바일 앱을 만드는 개발자 J00N의 인터랙티브 작업 책상 포트폴리오",
  openGraph: {
    title: "J00N | Frontend Developer",
    description: "모니터와 휴대폰을 눌러 프로젝트를 살펴보세요.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "J00N | Frontend Developer",
    description: "인터랙티브 작업 책상 포트폴리오",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={a2z.className}>{children}</body>
    </html>
  );
}
