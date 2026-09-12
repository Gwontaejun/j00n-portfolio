"use client";

import { LuExternalLink, LuMonitor, LuMousePointer2 } from "react-icons/lu";
import { SiGithub } from "react-icons/si";

export function MobileExperienceNotice() {
  return (
    <main className="relative flex min-h-dvh overflow-hidden bg-[#0d1016] px-6 py-8 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(56,132,196,.18),transparent_36%),radial-gradient(circle_at_15%_85%,rgba(231,132,73,.10),transparent_35%)]"
      />

      <div className="relative mx-auto flex w-full max-w-md flex-col">
        <header className="flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-3xl font-semibold leading-none tracking-[-.06em]">J00N</p>
            <p className="mt-2 text-[10px] font-medium tracking-[.18em] text-white/45">
              FRONTEND DEVELOPER
            </p>
          </div>
          <span className="rounded-full border border-sky-300/15 bg-sky-300/8 px-3 py-1.5 text-[11px] font-medium text-sky-200/80">
            Desktop Experience
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12">
          <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/[.06] shadow-[0_18px_50px_rgba(0,0,0,.28)]">
            <LuMonitor size={30} className="text-sky-300" aria-hidden="true" />
          </div>

          <p className="mt-8 text-[13px] font-semibold tracking-[.12em] text-sky-300/80">
            데스크톱 환경을 권장합니다
          </p>
          <h1 className="mt-3 text-[30px] font-semibold leading-[1.25] tracking-[-.04em]">
            더 넓은 화면에서
            <br />
            작업 공간을 둘러보세요.
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/58">
            이 포트폴리오는 3D 책상과 모니터·휴대폰 오브젝트를 직접 조작하는
            데스크톱 경험에 맞춰 제작되었습니다. PC에서 접속하면 모든 프로젝트와
            인터랙션을 정상적으로 확인할 수 있습니다.
          </p>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/8 bg-white/[.035] p-4 text-[13px] leading-6 text-white/52">
            <LuMousePointer2
              size={18}
              className="mt-0.5 shrink-0 text-white/70"
              aria-hidden="true"
            />
            <p>권장 해상도는 가로 1400px 이상이며 마우스 조작에 최적화되어 있습니다.</p>
          </div>

          <a
            href="https://github.com/Gwontaejun"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-[#151922] transition active:scale-[.98]"
          >
            <SiGithub size={18} aria-hidden="true" />
            GitHub에서 프로젝트 보기
            <LuExternalLink size={15} className="ml-1" aria-hidden="true" />
          </a>
        </section>

        <p className="border-t border-white/10 pt-5 text-center text-[11px] text-white/32">
          J00N · Frontend Developer
        </p>
      </div>
    </main>
  );
}
