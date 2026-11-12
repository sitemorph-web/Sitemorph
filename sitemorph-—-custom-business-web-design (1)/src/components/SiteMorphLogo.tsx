import React, { useState } from 'react';
import { BRAND_CONFIG } from '../siteConfig';

interface SiteMorphLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Placeholder Logo Component matching the SiteMorph glowing folded-ribbon "M"
 * and "Site" (white) + "Morph" (green-to-cyan gradient) wordmark.
 *
 * To swap in a real PNG/SVG logo image file later:
 * Set `BRAND_CONFIG.customLogoImageUrl = '/your-logo.png'` in `src/siteConfig.ts`.
 */
export const SiteMorphLogo: React.FC<SiteMorphLogoProps> = ({ size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-[22px]',
    lg: 'text-2xl',
  };

  if (BRAND_CONFIG.customLogoImageUrl && !imgError) {
    return (
      <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
        <img
          src={BRAND_CONFIG.customLogoImageUrl}
          alt={`${BRAND_CONFIG.name} logo`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${iconSizes[size]} object-contain`}
        />
        <span className={`${textSizes[size]} font-extrabold tracking-tight leading-none`}>
          <span className="text-white">Site</span>
          <span className="text-brand-gradient">Morph</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none group ${className}`}>
      <span className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Subtle ambient glow behind folded M */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#39FF14]/25 via-[#00E5FF]/20 to-[#1E90FF]/25 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        />
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_0_10px_rgba(0,229,255,0.28)]"
          role="img"
          aria-label="SiteMorph folded ribbon M mark"
        >
          <defs>
            <linearGradient id="sm-left-pillar" x1="8" y1="12" x2="22" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#39FF14" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>
            <linearGradient id="sm-left-fold" x1="12" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7CFF3B" />
              <stop offset="45%" stopColor="#22E55E" />
              <stop offset="100%" stopColor="#00C8FF" />
            </linearGradient>
            <linearGradient id="sm-right-fold" x1="52" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5CFF26" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0B75E6" />
            </linearGradient>
            <linearGradient id="sm-right-pillar" x1="56" y1="12" x2="42" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#39FF14" />
              <stop offset="55%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>
            <linearGradient id="sm-inner-shadow" x1="8" y1="36" x2="24" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#072B47" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
          </defs>

          {/* Left lower ribbon return */}
          <path d="M8 46L22 36V48L14 56L8 46Z" fill="url(#sm-inner-shadow)" />
          {/* Right lower ribbon return */}
          <path d="M56 46L42 36V48L50 56L56 46Z" fill="url(#sm-inner-shadow)" />

          {/* Left vertical folded ribbon */}
          <path
            d="M8 18C8 15.2 9.5 12.8 11.8 11.4L16 8.8L22 24V44C22 46.2 20.8 48.2 18.8 49.4L14 56L8 46V18Z"
            fill="url(#sm-left-pillar)"
          />
          {/* Right vertical folded ribbon */}
          <path
            d="M56 18C56 15.2 54.5 12.8 52.2 11.4L48 8.8L42 24V44C42 46.2 43.2 48.2 45.2 49.4L50 56L56 46V18Z"
            fill="url(#sm-right-pillar)"
          />

          {/* Center-left V fold */}
          <path
            d="M16 8.8L32 23.5V39.5L11.2 15.5C9.8 13.9 10.2 11.5 12 10.4L16 8.8Z"
            fill="url(#sm-left-fold)"
          />
          {/* Center-right V fold */}
          <path
            d="M48 8.8L32 23.5V39.5L52.8 15.5C54.2 13.9 53.8 11.5 52 10.4L48 8.8Z"
            fill="url(#sm-right-fold)"
          />

          {/* Specular ribbon edge highlights */}
          <path
            d="M16 8.8L32 23.5L48 8.8"
            stroke="#A8FF78"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          />
        </svg>
      </span>

      <span className={`${textSizes[size]} font-extrabold tracking-tight leading-none`}>
        <span className="text-white">Site</span>
        <span className="text-brand-gradient">Morph</span>
      </span>
    </span>
  );
};
