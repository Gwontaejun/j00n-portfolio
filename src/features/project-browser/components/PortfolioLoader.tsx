"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type PortfolioLoaderProps = {
  sceneReady: boolean;
  onComplete: () => void;
};

export function PortfolioLoader({
  sceneReady,
  onComplete,
}: PortfolioLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [typedCharacterCount, setTypedCharacterCount] = useState(0);

  useEffect(() => {
    const characterDelay = reduceMotion ? 0 : 400;
    const typingStartDelay = reduceMotion ? 0 : 180;
    const timers = Array.from({ length: 4 }, (_, index) =>
      window.setTimeout(
        () => setTypedCharacterCount(index + 1),
        typingStartDelay + index * characterDelay,
      ),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (typedCharacterCount < 4 || !sceneReady) return;

    const hideTimer = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 100 : 900,
    );

    return () => window.clearTimeout(hideTimer);
  }, [reduceMotion, sceneReady, typedCharacterCount]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          aria-live="polite"
          aria-label={
            sceneReady ? "포트폴리오를 여는 중" : "포트폴리오 로딩 중"
          }
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.1 : 0.7,
            ease: "easeInOut",
          }}
          className="pointer-events-auto fixed inset-0 z-[20000000] grid place-items-center bg-[radial-gradient(circle_at_50%_42%,#18202a_0%,#0b0e13_48%,#06080b_100%)] text-white"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-max flex-col items-center text-center"
          >
            <p
              aria-label="J00N"
              className="inline-flex items-baseline text-4xl font-semibold tracking-[-0.06em] sm:text-6xl"
            >
              <span aria-hidden="true">
                {"J00N".slice(0, typedCharacterCount)}
              </span>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: reduceMotion ? 0 : 1 }}
                animate={{ opacity: reduceMotion ? 0 : [1, 1, 0, 0] }}
                transition={{
                  duration: 0.85,
                  delay: reduceMotion ? 0 : 0.95,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "linear",
                }}
                className="ml-1 inline-block h-[0.78em] w-[2px] bg-white/75 sm:w-[3px]"
              />
            </p>
            <motion.p
              aria-hidden={typedCharacterCount !== 4}
              initial={false}
              animate={{
                opacity: typedCharacterCount === 4 ? 1 : 0,
                y: typedCharacterCount === 4 ? 0 : 3,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: !reduceMotion && typedCharacterCount === 4 ? 0.3 : 0,
              }}
              className="mt-2 text-center text-[12px] font-medium tracking-[0.18em] text-white/55 [text-indent:0.18em] sm:text-[13px]"
            >
              Frontend Developer
            </motion.p>
            <div className="mt-5 h-5 text-center text-[12px] font-medium tracking-[0.04em] text-white/45">
              <AnimatePresence mode="wait">
                {typedCharacterCount === 4 && !sceneReady && (
                  <motion.p
                    key="loading"
                    role="status"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3 }}
                  >
                    책상 정리 중입니다...
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PortfolioBrand({ hidden }: { hidden: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.4 }}
          className="pointer-events-none absolute left-5 top-5 z-[20000000] flex w-max flex-col items-center text-center text-white sm:left-8 sm:top-8"
        >
          <p className="text-[38px] font-semibold leading-none tracking-[-0.06em]">
            J00N
          </p>
          <p className="mt-1.5 whitespace-nowrap text-center text-[9px] font-medium tracking-[0.16em] text-white/52 [text-indent:0.16em]">
            Frontend Developer
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
