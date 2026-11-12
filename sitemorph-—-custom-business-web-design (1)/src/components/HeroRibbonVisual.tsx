import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Sculptural 3D folded S-ribbon hero artwork with green-to-cyan-to-blue
 * glowing specular edges on near-black obsidian surfaces, matching the
 * SiteMorph brand visual identity.
 */
export const HeroRibbonVisual: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] flex items-center justify-center select-none overflow-visible">
      {/* Ambient floating gradient orbs */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [-10, 12, -10],
                x: [-6, 8, -6],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 right-10 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-[#22E55E]/14 blur-[75px] pointer-events-none"
      />
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [12, -14, 12],
                x: [8, -8, 8],
                scale: [1.04, 0.96, 1.04],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-8 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#00E5FF]/15 blur-[85px] pointer-events-none"
      />

      {/* Floating 3D Folded S-Ribbon SVG */}
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [-8, 10, -8],
                rotate: [-1.2, 1.4, -1.2],
              }
        }
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full max-w-[440px] h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 500 560"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_24px_54px_rgba(0,229,255,0.18)]"
          role="img"
          aria-label="Abstract 3D glowing green and cyan folded ribbon sculpture"
        >
          <defs>
            {/* Dark obsidian inner body of the 3D ribbon with neon rim reflection */}
            <linearGradient id="ribbon-upper-body" x1="150" y1="30" x2="360" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#091510" />
              <stop offset="32%" stopColor="#0D2C28" />
              <stop offset="68%" stopColor="#071923" />
              <stop offset="100%" stopColor="#05080B" />
            </linearGradient>

            <linearGradient id="ribbon-mid-fold" x1="120" y1="160" x2="410" y2="390" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22E55E" stopOpacity="0.88" />
              <stop offset="22%" stopColor="#00E5FF" stopOpacity="0.65" />
              <stop offset="56%" stopColor="#09212E" />
              <stop offset="100%" stopColor="#060B10" />
            </linearGradient>

            <linearGradient id="ribbon-lower-loop" x1="95" y1="320" x2="415" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#04080A" />
              <stop offset="55%" stopColor="#0A2229" />
              <stop offset="85%" stopColor="#0D4A5E" />
              <stop offset="100%" stopColor="#22E55E" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="neon-edge-stroke" x1="110" y1="20" x2="400" y2="530" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#39FF14" />
              <stop offset="38%" stopColor="#22E55E" />
              <stop offset="72%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>

            <linearGradient id="neon-edge-secondary" x1="390" y1="50" x2="120" y2="510" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22E55E" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#39FF14" stopOpacity="0.55" />
            </linearGradient>

            <filter id="soft-edge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Upper sweeping dark ribbon plane */}
          <path
            d="M420 18C325 76 168 134 152 224C138 302 278 338 386 286C442 258 474 218 492 184L420 18Z"
            fill="url(#ribbon-upper-body)"
          />

          {/* Lower sweeping dark ribbon loop */}
          <path
            d="M402 318C304 282 118 354 96 446C80 512 186 552 308 518C398 492 436 420 402 318Z"
            fill="url(#ribbon-lower-loop)"
          />

          {/* Central 3D twisted fold bridge with vibrant green-to-cyan specular sheen */}
          <path
            d="M154 206C142 284 236 330 356 382C418 409 426 462 374 498C434 468 456 390 404 322C348 248 198 228 194 148C191 96 274 52 368 14C258 60 166 128 154 206Z"
            fill="url(#ribbon-mid-fold)"
          />

          {/* Glowing primary edge highlight */}
          <path
            d="M368 14C256 62 164 128 154 208C144 288 250 334 366 386C424 412 430 468 370 502"
            stroke="url(#neon-edge-stroke)"
            strokeWidth="2.6"
            strokeLinecap="round"
            filter="url(#soft-edge-glow)"
          />

          {/* Secondary crisp rim highlight */}
          <path
            d="M484 186C420 248 288 312 168 372C112 400 88 438 102 478"
            stroke="url(#neon-edge-secondary)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Subtle floating light nodes */}
          <circle cx="154" cy="212" r="3.5" fill="#39FF14" opacity="0.85" />
          <circle cx="404" cy="346" r="3.5" fill="#00E5FF" opacity="0.9" />
          <circle cx="292" cy="112" r="2.2" fill="#00E5FF" opacity="0.6" />
        </svg>

        {/* Bottom subtle trust badge card anchored harmoniously at base of visual */}
        <div className="hidden sm:flex items-center justify-between gap-6 absolute bottom-2 left-4 right-4 px-5 py-3.5 rounded-2xl glass-surface border border-white/10">
          <div>
            <p className="text-xs font-medium text-[#A0A0A0]">Every Package Includes</p>
            <p className="text-sm font-semibold text-white mt-0.5">
              Free .com Domain · 1 Year Support
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#22E55E] tabular-nums shrink-0">
            100% Custom
          </span>
        </div>
      </motion.div>
    </div>
  );
};
