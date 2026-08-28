"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuFileText,
  LuMonitor,
  LuSmartphone,
  LuStickyNote,
} from "react-icons/lu";
import type { SceneGuideTarget } from "@/types/scene-guide";

type SceneGuideProps = {
  open: boolean;
  stepIndex: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
};

const guideSteps = [
  {
    eyebrow: "WEB PROJECT",
    title: "모니터",
    description: "모니터를 클릭하면 제가 만든\n웹 프로젝트를 둘러볼 수 있어요.",
    icon: LuMonitor,
    target: "monitor" as SceneGuideTarget,
    labelClassName: "left-[25%] top-[17%]",
    dotClassName: "left-[58.2%] top-[39.1%]",
    linePath: "M 37 27 L 48 27 L 58.2 39.1",
  },
  {
    eyebrow: "APP PROJECT",
    title: "휴대폰",
    description: `휴대폰을 클릭하면 제가 만든\n모바일 앱을 둘러볼 수 있어요.`,
    icon: LuSmartphone,
    target: "phone" as SceneGuideTarget,
    labelClassName: "right-[5%] top-[31%] text-right",
    dotClassName: "left-[84.6%] top-[56%]",
    linePath: "M 91 42 L 89 47 L 84.6 56",
  },
  {
    eyebrow: "PROFILE",
    title: "프로필",
    description: "문서를 클릭하면 제 이력과 경력 정보를\n확인할 수 있어요.",
    icon: LuFileText,
    target: "profile" as SceneGuideTarget,
    labelClassName: "left-[29%] top-[17%]",
    dotClassName: "left-[22.7%] top-[36.7%]",
    linePath: "M 29 27 L 26 27 L 22.7 36.7",
  },
  {
    eyebrow: "GUESTBOOK",
    title: "방명록",
    description:
      "포스트잇을 클릭해 방문 기록을 남기고\n다른 사람의 메시지도 확인해보세요.",
    icon: LuStickyNote,
    target: "guestbook" as SceneGuideTarget,
    labelClassName: "left-[30%] top-[57%]",
    dotClassName: "left-[11.9%] top-[45.4%]",
    linePath: "M 30 65 L 21 60 L 11.9 45.4",
  },
] as const;

function GuideDot({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      <span className="block size-2 rounded-full border border-white/90 bg-sky-300" />
    </div>
  );
}

export function SceneGuide({
  open,
  stepIndex,
  onStepChange,
  onClose,
}: SceneGuideProps) {
  const reduceMotion = useReducedMotion();
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const step = guideSteps[stepIndex];
  const Icon = step.icon;
  const isLastStep = stepIndex === guideSteps.length - 1;

  useEffect(() => {
    if (!open) return;
    nextButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      return;
    }
    onStepChange(stepIndex + 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-label={`책상 사용 가이드 ${stepIndex + 1}단계: ${step.title}`}
          className="fixed inset-0 z-[30000000] overflow-hidden text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.35 }}
        >
          <svg
            className="absolute inset-0 size-full"
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.path
              key={step.linePath}
              d={step.linePath}
              fill="none"
              stroke="rgba(186, 230, 253, 0.78)"
              strokeWidth="0.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.45,
                ease: "easeOut",
              }}
            />
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.title}
              className="pointer-events-none absolute inset-0 hidden sm:block"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
            >
              <div className={`absolute ${step.labelClassName}`}>
                <div
                  className={`mb-2 flex items-center gap-2 ${step.labelClassName.includes("text-right") ? "justify-end" : ""}`}
                >
                  <Icon size={15} className="text-sky-200" aria-hidden="true" />
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-sky-200/75">
                    {step.eyebrow}
                  </span>
                </div>
                <p className="text-lg font-semibold tracking-[-0.02em]">
                  {step.title}
                </p>
                <p className="mt-1 max-w-[230px] whitespace-pre-line text-[13px] leading-5 text-white/60">
                  {step.description}
                </p>
              </div>
              <GuideDot className={step.dotClassName} />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-4 bottom-24 sm:hidden">
            <motion.div
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-[#111720]/92 px-4 py-3 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-sky-200">
                <Icon size={15} aria-hidden="true" />
                <span className="text-[10px] font-semibold tracking-[0.16em]">
                  {step.eyebrow}
                </span>
              </div>
              <p className="mt-2 text-base font-semibold">{step.title}</p>
              <p className="mt-1 whitespace-pre-line text-xs leading-5 text-white/58">
                {step.description}
              </p>
            </motion.div>
          </div>

          <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-3 px-4 sm:bottom-8">
            <div
              className="flex items-center gap-1.5"
              aria-label={`${guideSteps.length}단계 중 ${stepIndex + 1}단계`}
            >
              {guideSteps.map((guideStep, index) => (
                <span
                  key={guideStep.title}
                  className={`h-1 rounded-full transition-all ${index === stepIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  aria-label="이전 안내"
                  onClick={() => onStepChange(stepIndex - 1)}
                  className="grid size-10 place-items-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  <LuArrowLeft size={17} aria-hidden="true" />
                </button>
              )}
              <button
                ref={nextButtonRef}
                type="button"
                onClick={handleNext}
                className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#11151b] shadow-[0_10px_30px_rgba(0,0,0,0.32)] transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b10]"
              >
                {isLastStep ? "확인" : "다음"}
                {!isLastStep && (
                  <LuArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
