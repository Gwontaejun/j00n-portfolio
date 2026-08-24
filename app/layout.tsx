import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "j00n — Desk Portfolio",
  description:
    "웹과 모바일 앱을 만드는 개발자 j00n의 인터랙티브 작업 책상 포트폴리오",
  openGraph: {
    title: "j00n — Desk Portfolio",
    description: "모니터와 휴대폰을 눌러 프로젝트를 살펴보세요.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "j00n — Desk Portfolio",
    description: "인터랙티브 작업 책상 포트폴리오",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
