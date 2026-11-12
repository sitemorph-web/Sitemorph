import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
}

let memoryIntroSeen = false;

export function hasSeenIntro(): boolean {
  return memoryIntroSeen;
}

export function markIntroSeen(): void {
  memoryIntroSeen = true;
}

/**
 * 2.1s Intro Animation for SiteMorph
 *
 * Timeline:
 * 0-200ms: Center thin light beam ignites
 * 200-650ms: Left & right vector ribbon M-halves slide in from edges
 * 650-900ms: Collision & snap with controlled overshoot and soft glow pulse
 * 900-1100ms: Settling with light pulse running through the unified ribbon
 * 1100-1450ms: Line 1 masked reveal: "WE MAKE WEBSITES."
 * 1450-1900ms: Line 2 masked reveal: "THAT MAKE BUSINESSES BETTER."
 * 1900-2100ms: Smooth overlay fade-out; unmounts from DOM
 */
export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'line' | 'slide' | 'collide' | 'settle' | 'text1' | 'text2' | 'fadeout'>(
    'line'
  );
  const [isVisible, setIsVisible] = useState(true);

  // Lock page scrolling during intro
  useEffect(() => {
    if (!isVisible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    // If reduced motion is requested, play a simplified, gentle fade
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        markIntroSeen();
        onComplete();
      }, 1100);
      return () => clearTimeout(timer);
    }

    // Sequence timeline for standard motion
    const t1 = setTimeout(() => setPhase('slide'), 200);
    const t2 = setTimeout(() => setPhase('collide'), 650);
    const t3 = setTimeout(() => setPhase('settle'), 900);
    const t4 = setTimeout(() => setPhase('text1'), 1100);
    const t5 = setTimeout(() => setPhase('text2'), 1450);
    const t6 = setTimeout(() => setPhase('fadeout'), 1900);
    const t7 = setTimeout(() => {
      setIsVisible(false);
      markIntroSeen();
      onComplete();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [prefersReducedMotion, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="sitemorph-intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-4 select-none overflow-hidden"
        style={{ pointerEvents: phase === 'fadeout' ? 'none' : 'auto' }}
      >
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="absolute w-[500px] h-[500px] rounded-full bg-radial from-[#00E5FF]/14 via-[#22E55E]/8 to-transparent blur-3xl pointer-events-none"
        />

        {/* 0-200ms Thin center light line */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: phase === 'line' ? 1 : phase === 'slide' ? 0.6 : 0,
            height: phase === 'line' ? 140 : 180,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-[#00E5FF] to-transparent shadow-[0_0_12px_#00E5FF] pointer-events-none z-10"
        />

        {/* Soft light pulse on collision */}
        {(phase === 'collide' || phase === 'settle') && (
          <motion.div
            initial={{ opacity: 0.9, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00E5FF] blur-2xl pointer-events-none z-10"
          />
        )}

        {/* Main Ribbon M Container */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          {prefersReducedMotion ? (
            /* Reduced motion: Static unified M with subtle fade */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <UnifiedRibbonSvg />
            </motion.div>
          ) : (
            <motion.div
              animate={
                phase === 'collide'
                  ? {
                      scaleX: [1, 0.93, 1.03, 1],
                      scaleY: [1, 1.05, 0.98, 1],
                    }
                  : phase === 'settle'
                  ? { scale: [1, 1.015, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Left Half of M */}
              <motion.div
                initial={{ x: '-160%', opacity: 0 }}
                animate={{
                  x: phase === 'line' ? '-160%' : '0%',
                  opacity: phase === 'line' ? 0 : 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <LeftHalfSvg />
              </motion.div>

              {/* Right Half of M */}
              <motion.div
                initial={{ x: '160%', opacity: 0 }}
                animate={{
                  x: phase === 'line' ? '160%' : '0%',
                  opacity: phase === 'line' ? 0 : 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <RightHalfSvg />
              </motion.div>

              {/* Specular light sweep across M at 900-1100ms */}
              {(phase === 'settle' || phase === 'text1' || phase === 'text2') && (
                <motion.div
                  initial={{ opacity: 0, x: '-60%' }}
                  animate={{ opacity: [0, 0.7, 0], x: '60%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none z-20"
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Text Reveal Block (1100ms - 1900ms) */}
        <div className="mt-7 sm:mt-8 flex flex-col items-center text-center max-w-sm sm:max-w-md px-2">
          {/* Line 1: WE MAKE WEBSITES. */}
          <div className="overflow-hidden h-7 sm:h-8 flex items-center justify-center">
            {(phase === 'text1' || phase === 'text2' || phase === 'fadeout' || prefersReducedMotion) && (
              <motion.p
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-xl font-extrabold tracking-wider text-white"
              >
                WE MAKE WEBSITES.
              </motion.p>
            )}
          </div>

          {/* Line 2: THAT MAKE BUSINESSES BETTER. */}
          <div className="overflow-hidden min-h-[30px] sm:min-h-[36px] flex items-center justify-center mt-1">
            {(phase === 'text2' || phase === 'fadeout' || prefersReducedMotion) && (
              <motion.p
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-2xl font-black tracking-tight text-white"
              >
                THAT MAKE BUSINESSES <span className="text-brand-gradient">BETTER.</span>
              </motion.p>
            )}
          </div>

          {/* Subline: SITEMORPH · DESIGN. DEVELOPMENT. DIGITAL EXPERIENCE. */}
          <div className="overflow-hidden mt-2.5">
            {(phase === 'text2' || phase === 'fadeout' || prefersReducedMotion) && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="text-[10px] sm:text-xs font-semibold tracking-[0.24em] text-white/60 uppercase"
              >
                SITEMORPH · DESIGN. DEVELOPMENT. DIGITAL EXPERIENCE.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* -------------------------------------------------------------------------- */
/* VECTOR SHAPES: LEFT & RIGHT FOLDED RIBBON M HALVES                         */
/* -------------------------------------------------------------------------- */

const LeftHalfSvg: React.FC = () => (
  <svg
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-[0_0_16px_rgba(0,229,255,0.4)]"
  >
    <defs>
      <linearGradient id="intro-l-main" x1="20" y1="20" x2="70" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#39FF14" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#1E90FF" />
      </linearGradient>
      <linearGradient id="intro-l-fold" x1="38" y1="16" x2="70" y2="76" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7CFF3B" />
        <stop offset="55%" stopColor="#22E55E" />
        <stop offset="100%" stopColor="#00C8FF" />
      </linearGradient>
      <linearGradient id="intro-l-curl" x1="18" y1="80" x2="55" y2="125" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#052033" />
        <stop offset="50%" stopColor="#0B75E6" />
        <stop offset="100%" stopColor="#00E5FF" />
      </linearGradient>
    </defs>

    {/* Left lower curl loop */}
    <path
      d="M20 98C20 114 32 126 48 126C58 126 66 118 68 106L68 84L54 94C44 102 34 104 26 98L20 98Z"
      fill="url(#intro-l-curl)"
    />

    {/* Left vertical ribbon column */}
    <path
      d="M20 38C20 28 28 20 38 20L44 20L54 48L54 96C54 104 48 110 40 110L28 110C22 106 20 96 20 86L20 38Z"
      fill="url(#intro-l-main)"
    />

    {/* Left center fold angling to center dip */}
    <path
      d="M44 20L70 54V86L38 46C34 40 36 30 42 22L44 20Z"
      fill="url(#intro-l-fold)"
    />

    {/* Specular edge sheen */}
    <path
      d="M42 21L70 54"
      stroke="#A8FF78"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
  </svg>
);

const RightHalfSvg: React.FC = () => (
  <svg
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-[0_0_16px_rgba(34,229,94,0.4)]"
  >
    <defs>
      <linearGradient id="intro-r-main" x1="120" y1="20" x2="70" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#39FF14" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#1E90FF" />
      </linearGradient>
      <linearGradient id="intro-r-fold" x1="102" y1="16" x2="70" y2="76" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5CFF26" />
        <stop offset="50%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0B75E6" />
      </linearGradient>
      <linearGradient id="intro-r-curl" x1="122" y1="80" x2="85" y2="125" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#052033" />
        <stop offset="50%" stopColor="#0B75E6" />
        <stop offset="100%" stopColor="#00E5FF" />
      </linearGradient>
    </defs>

    {/* Right lower curl loop */}
    <path
      d="M120 98C120 114 108 126 92 126C82 126 74 118 72 106L72 84L86 94C96 102 106 104 114 98L120 98Z"
      fill="url(#intro-r-curl)"
    />

    {/* Right vertical ribbon column */}
    <path
      d="M120 38C120 28 112 20 102 20L96 20L86 48L86 96C86 104 92 110 100 110L112 110C118 106 120 96 120 86L120 38Z"
      fill="url(#intro-r-main)"
    />

    {/* Right center fold angling to center dip */}
    <path
      d="M96 20L70 54V86L102 46C106 40 104 30 98 22L96 20Z"
      fill="url(#intro-r-fold)"
    />

    {/* Specular edge sheen */}
    <path
      d="M98 21L70 54"
      stroke="#A8FF78"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
  </svg>
);

const UnifiedRibbonSvg: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute inset-0">
      <LeftHalfSvg />
    </div>
    <div className="absolute inset-0">
      <RightHalfSvg />
    </div>
  </div>
);
