import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../siteConfig';

export const FloatingElements: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);

  const springX = useSpring(cursorX, { stiffness: 140, damping: 24 });
  const springY = useSpring(cursorY, { stiffness: 140, damping: 24 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const mq = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mq.matches);

    const handlePointerMove = (e: PointerEvent) => {
      cursorX.set(e.clientX - 180);
      cursorY.set(e.clientY - 180);
    };

    if (mq.matches) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [cursorX, cursorY, prefersReducedMotion]);

  return (
    <>
      {/* Subtle Desktop Cursor Ambient Glow */}
      {hasFinePointer && !prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ x: springX, y: springY }}
          className="fixed top-0 left-0 w-[360px] h-[360px] rounded-full pointer-events-none z-10 opacity-35"
        >
          <div className="w-full h-full rounded-full bg-radial from-[#00E5FF]/12 via-[#22E55E]/6 to-transparent blur-2xl" />
        </motion.div>
      )}

      {/* Floating WhatsApp Button (Bottom-Right on All Pages) */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SiteMorph on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 h-12 px-4 sm:px-4.5 rounded-full bg-[#16A34A] hover:bg-[#22C55E] text-white font-semibold text-sm shadow-[0_8px_28px_rgba(34,229,94,0.38)] hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <MessageCircle className="w-5 h-5 fill-white/15 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">WhatsApp Us</span>
      </a>
    </>
  );
};
