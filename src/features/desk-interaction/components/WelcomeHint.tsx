'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export function WelcomeHint({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="첫 화면 안내 닫기"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.35 }}
          onClick={onDismiss}
          className="absolute left-1/2 top-[22%] z-10 -translate-x-1/2 rounded-2xl border border-white/15 bg-[#10151d]/75 px-6 py-4 text-center text-white shadow-2xl backdrop-blur-md outline-none hover:bg-[#141b25]/85 focus-visible:ring-2 focus-visible:ring-sky-200 sm:top-1/4"
        >
          <span className="block text-sm font-semibold">제 작업 공간에 오신 것을 환영합니다.</span>
          <span className="mt-1 block whitespace-nowrap text-xs leading-5 text-white/60">모니터에서는 웹 프로젝트를,<br />휴대폰에서는 모바일 앱을 살펴보세요.</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
