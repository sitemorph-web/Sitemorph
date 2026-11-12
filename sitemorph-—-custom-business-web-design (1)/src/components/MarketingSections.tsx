import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe,
  Layout,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ABOUT_CONTENT,
  BRAND_CONFIG,
  HERO_CHIPS,
  HERO_COUNTERS,
  PROCESS_STEPS,
  SAMPLE_SITES,
  SampleSite,
  TEAM,
  TeamMember,
  WE_BUILD_TYPES,
  WHAT_YOU_GET,
  WhatYouGetPin,
} from '../siteConfig';
import { HeroRibbonVisual } from './HeroRibbonVisual';

/* -------------------------------------------------------------------------- */
/* 1. HERO SECTION WITH DEVICE MOCKUPS & 4-CONCEPT SWITCHER                   */
/* -------------------------------------------------------------------------- */
interface HeroSectionProps {
  onGetWebsiteClick: () => void;
  onSeePlansClick: () => void;
  introEnded?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetWebsiteClick,
  onSeePlansClick,
  introEnded = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeSiteIndex, setActiveSiteIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [desktopImgError, setDesktopImgError] = useState<Record<string, boolean>>({});
  const [mobileImgError, setMobileImgError] = useState<Record<string, boolean>>({});

  const currentSite = SAMPLE_SITES[activeSiteIndex];

  // Auto-cycle through concepts every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;
    const timer = setInterval(() => {
      setActiveSiteIndex((prev) => (prev + 1) % SAMPLE_SITES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, prefersReducedMotion]);

  const handleChipClick = (index: number) => {
    setActiveSiteIndex(index);
  };

  const whiteWords = ['WE', 'DESIGN', 'WEBSITES', 'THAT'];
  const gradientWords = ['DEFINE', 'BRANDS.'];

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-16 overflow-hidden scroll-mt-20"
    >
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-radial from-[#00E5FF]/10 via-[#22E55E]/5 to-transparent blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Sales Copy & CTAs */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.08] text-white">
              {whiteWords.map((word, index) => (
                <motion.span
                  key={word}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={introEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.24em]"
                >
                  {word}
                </motion.span>
              ))}
              <br className="hidden sm:inline" />
              {gradientWords.map((word, index) => (
                <motion.span
                  key={word}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={introEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.42,
                    delay: (whiteWords.length + index) * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.24em] text-brand-gradient"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtle Brand Accent Rule */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-[#39FF14] to-[#00E5FF] rounded-full" />

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={introEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: 0.36 }}
              className="text-base sm:text-lg text-[#A0A0A0] leading-relaxed max-w-xl"
            >
              We build fast, custom websites that turn visitors into paying customers. No templates.
              No hassle. Live in days.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={introEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              <button
                type="button"
                onClick={onGetWebsiteClick}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#050505] bg-brand-gradient hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_28px_rgba(0,229,255,0.3)] transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                <span>Get Your Website</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={onSeePlansClick}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white border border-white/20 bg-white/[0.03] hover:border-[#00E5FF]/60 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                <span>See Plans</span>
              </button>
            </motion.div>

            {/* Replaced 5-Card Strip: One Thin Row of Small Chips under Buttons (Fits in 1 line on mobile) */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={introEnded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.52 }}
              className="pt-2 flex flex-nowrap items-center gap-1.5 sm:gap-2.5 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {HERO_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/[0.04] border border-white/10 text-white/90 whitespace-nowrap shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22E55E]" />
                  <span>{chip}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Interactive Laptop + Phone Device Mockup with 4 Concepts */}
          <div
            className="lg:col-span-6 relative flex flex-col items-center justify-center pt-2 sm:pt-4 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Device Composition Container */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[540px] z-10 mx-auto"
            >
              {/* 1. LAPTOP FRAME */}
              <div className="relative rounded-2xl bg-[#12161D] p-2 sm:p-3 border border-white/15 shadow-2xl overflow-hidden">
                {/* Laptop Top Browser Bar */}
                <div className="flex items-center gap-2 pb-2 px-1 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  {/* Address Bar */}
                  <div className="flex-1 max-w-[240px] mx-auto px-3 py-0.5 rounded-md bg-[#07090C] border border-white/10 text-[11px] font-mono text-white/80 flex items-center justify-center gap-1 truncate">
                    <span className="text-[#22E55E]">https://</span>
                    <span className="text-white font-medium">{currentSite.domain}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/10 text-[#00E5FF]">
                    Concept design
                  </span>
                </div>

                {/* Laptop Screen Content (Code-Drawn or Image) */}
                <div className="relative aspect-[16/10] bg-[#07090C] overflow-hidden rounded-lg mt-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSite.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full p-4 sm:p-5 flex flex-col justify-between select-none"
                    >
                      {currentSite.image && !desktopImgError[currentSite.id] ? (
                        <img
                          src={currentSite.image}
                          alt={currentSite.name}
                          onError={() =>
                            setDesktopImgError((prev) => ({ ...prev, [currentSite.id]: true }))
                          }
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        /* Code-Drawn Interactive Mockup Website */
                        <div className="flex flex-col justify-between h-full">
                          {/* Mini Navbar */}
                          <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <span className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: currentSite.accentHex }}
                              />
                              {currentSite.name}
                            </span>
                            <div className="hidden sm:flex items-center gap-3 text-[11px] text-white/70">
                              <span>Home</span>
                              <span>About</span>
                              <span>Contact</span>
                            </div>
                            <span
                              className="px-2.5 py-1 rounded text-[10px] font-bold text-[#050505]"
                              style={{ backgroundColor: currentSite.accentHex }}
                            >
                              {currentSite.buttonText}
                            </span>
                          </div>

                          {/* Hero Area */}
                          <div className="my-auto py-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                              {currentSite.category} Experience
                            </p>
                            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                              {currentSite.headline}
                            </h3>
                            <p className="text-[11px] text-white/70 mt-1 max-w-xs">
                              Tailored digital presence built by SiteMorph for high engagement.
                            </p>
                          </div>

                          {/* 3 Mini Cards */}
                          <div className="grid grid-cols-3 gap-2">
                            {currentSite.cards.map((cName) => (
                              <div
                                key={cName}
                                className="p-2 rounded bg-white/[0.04] border border-white/10 text-center"
                              >
                                <span className="text-[10px] sm:text-xs font-bold text-white block">
                                  {cName}
                                </span>
                                <span className="text-[9px] text-[#22E55E] block mt-0.5">Explore →</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Laptop Base Stand */}
                <div className="h-2 w-full bg-[#1A1F29] rounded-b-md mt-1 mx-auto flex items-center justify-center">
                  <span className="w-16 h-0.5 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* 2. OVERLAPPING PHONE MOCKUP (BOTTOM RIGHT) */}
              <div className="absolute -bottom-3 right-1 sm:-bottom-5 sm:-right-4 w-24 sm:w-36 aspect-[9/18] bg-[#0E1218] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-white/20 shadow-2xl z-20 overflow-hidden flex flex-col justify-between">
                {/* Phone Speaker Notch */}
                <div className="w-10 h-1 bg-white/30 rounded-full mx-auto my-0.5 shrink-0" />

                {/* Phone Screen */}
                <div className="flex-1 bg-[#05070A] rounded-xl p-2 flex flex-col justify-between overflow-hidden border border-white/10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`phone-${currentSite.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col justify-between h-full select-none"
                    >
                      {currentSite.mobileImage && !mobileImgError[currentSite.id] ? (
                        <img
                          src={currentSite.mobileImage}
                          alt={`${currentSite.name} mobile`}
                          onError={() =>
                            setMobileImgError((prev) => ({ ...prev, [currentSite.id]: true }))
                          }
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[9px] font-bold text-white">
                            <span className="truncate">{currentSite.name}</span>
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: currentSite.accentHex }}
                            />
                          </div>

                          <div className="my-auto py-1">
                            <p className="text-[10px] font-extrabold text-white leading-tight">
                              {currentSite.headline}
                            </p>
                            <span
                              className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-[#050505]"
                              style={{ backgroundColor: currentSite.accentHex }}
                            >
                              {currentSite.buttonText}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-white/10 rounded" />
                            <div className="h-1.5 w-3/4 bg-white/10 rounded" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Phone Home Bar */}
                <div className="w-8 h-1 bg-white/40 rounded-full mx-auto my-0.5 shrink-0" />
              </div>
            </motion.div>

            {/* Concept Switcher Chips (Cafe, Coaching, Shop, Salon) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 z-20">
              {SAMPLE_SITES.map((site, index) => {
                const isActive = index === activeSiteIndex;
                return (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() => handleChipClick(index)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-[#050505] shadow-[0_0_16px_rgba(255,255,255,0.35)] scale-105'
                        : 'bg-white/[0.04] text-[#A0A0A0] hover:text-white hover:bg-white/[0.08] border border-white/10'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: site.accentHex }}
                    />
                    <span>{site.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact Row of 3 Counters Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {HERO_COUNTERS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#090C10] border border-white/8 glass-surface-hover flex flex-col items-center text-center justify-center"
            >
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-gradient">
                {card.bigText}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-white mt-1">{card.label}</p>
              {card.id === 'dedicated-support' && (
                <p className="text-[11px] text-[#A0A0A0] mt-0.5">Free maintenance & domain in every plan</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Moving Tagline Strip (Moving Left to Right at normal speed) */}
        <div className="mt-10 pt-6 border-t border-white/10 overflow-hidden relative select-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#050505] to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#050505] to-transparent z-10"
          />

          <motion.div
            animate={prefersReducedMotion ? undefined : { x: ['-50%', '0%'] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex items-center gap-10 sm:gap-14 whitespace-nowrap will-change-transform py-1.5"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-extrabold tracking-[0.24em] text-white/80 shrink-0"
              >
                <span className="text-white hover:text-[#39FF14] transition-colors">PROFESSIONAL</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14]" />
                <span className="text-brand-gradient">RELIABLE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                <span className="text-white hover:text-[#00E5FF] transition-colors">RESULT DRIVEN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF] shadow-[0_0_8px_#1E90FF]" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. NEW SECTION: "WHAT YOU GET" (REPLACES SERVICES & WHY CHOOSE US)         */
/* -------------------------------------------------------------------------- */
interface WhatYouGetSectionProps {
  onSelectWebsiteType: (type: string) => void;
}

export const WhatYouGetSection: React.FC<WhatYouGetSectionProps> = ({
  onSelectWebsiteType,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activePin, setActivePin] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const progressLineWidth = useTransform(scrollYProgress, [0.15, 0.65], ['0%', '100%']);

  const renderPinIcon = (iconName: WhatYouGetPin['iconName']) => {
    const cls = 'w-4 h-4';
    switch (iconName) {
      case 'layout':
        return <Layout className={cls} />;
      case 'globe':
        return <Globe className={cls} />;
      case 'smartphone':
        return <Smartphone className={cls} />;
      case 'messageCircle':
        return <MessageCircle className={cls} />;
      case 'zap':
        return <Zap className={cls} />;
      case 'shieldCheck':
        return <ShieldCheck className={cls} />;
    }
  };

  const leftPins = WHAT_YOU_GET.filter((p) => p.side === 'left');
  const rightPins = WHAT_YOU_GET.filter((p) => p.side === 'right');

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20"
    >
      {/* Header */}
      <div className="max-w-2xl space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#22E55E]" />
          <span className="text-white">What You Get</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything Your Business Needs to Win Online.
        </h2>
        <p className="text-sm text-[#A0A0A0]">
          No hidden fees, no messy add-ons. Every custom website comes complete with the essentials built-in.
        </p>
      </div>

      {/* Main Large Browser Mockup with 6 Numbered Pins */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Desktop Left Labels (1 to 3) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-5">
            {leftPins.map((item) => {
              const isHighlighted = activePin === item.number;
              return (
                <div
                  key={item.number}
                  onMouseEnter={() => setActivePin(item.number)}
                  onMouseLeave={() => setActivePin(null)}
                  className={`p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 border ${
                    isHighlighted
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)] translate-x-1'
                      : 'bg-[#0A0D11] border-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isHighlighted
                        ? 'bg-brand-gradient text-[#050505]'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {item.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#22E55E]">{renderPinIcon(item.iconName)}</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {item.shortTitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center: Large Generic Business Website Mockup with 6 Pins */}
          <div className="lg:col-span-6 relative">
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-2xl bg-[#0D1117] border border-white/15 p-2.5 sm:p-4 shadow-2xl relative overflow-hidden"
            >
              {/* Browser Header Bar */}
              <div className="flex items-center gap-2 pb-2 sm:pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 max-w-xs mx-auto px-3 py-0.5 sm:py-1 rounded bg-[#05070A] border border-white/10 text-[10px] sm:text-[11px] font-mono text-center text-white/70">
                  https://yourbusiness.com
                </div>
              </div>

              {/* Code-Drawn Generic Website Interface (Responsive height fits all text + 3 blocks on mobile) */}
              <div className="relative min-h-[290px] sm:min-h-0 sm:aspect-[16/10] bg-[#07090C] rounded-lg mt-2.5 sm:mt-3 p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border border-white/5">
                {/* Navbar */}
                <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-brand-gradient shadow-[0_0_8px_rgba(34,229,94,0.3)]" />
                    <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">Apex Business</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-white/60 font-medium">
                    <span>Services</span>
                    <span>About</span>
                    <span>Contact</span>
                  </div>
                </div>

                {/* Hero section inside mockup */}
                <div className="space-y-1.5 sm:space-y-2.5 my-auto py-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-[#22E55E]/15 text-[#22E55E] border border-[#22E55E]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22E55E] animate-pulse" />
                    <span>99+ Speed Score</span>
                  </div>
                  <p className="text-xs sm:text-lg lg:text-xl font-black text-white leading-snug tracking-tight">
                    Premium Solutions That Deliver Guaranteed Results.
                  </p>
                  <p className="text-[9px] sm:text-xs text-white/65 leading-relaxed max-w-sm">
                    Custom built with responsive precision and dedicated 1-year founder support.
                  </p>
                  <div className="pt-0.5 sm:pt-1 flex items-center gap-2">
                    <span className="px-2.5 sm:px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-bold bg-brand-gradient text-[#050505] shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                      Enquire Now
                    </span>
                    <span className="px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-semibold text-white/80 border border-white/15">
                      WhatsApp Chat
                    </span>
                  </div>
                </div>

                {/* 3 feature blocks inside mockup (Custom Look, Mobile Ready, 1 Year Support) */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-white/10 shrink-0">
                  <div className="p-1 sm:p-1.5 rounded-md bg-white/[0.04] border border-white/8 text-center flex flex-col items-center justify-center">
                    <span className="text-[8px] sm:text-[9px] font-bold text-white block truncate w-full">Custom Look</span>
                  </div>
                  <div className="p-1 sm:p-1.5 rounded-md bg-white/[0.04] border border-white/8 text-center flex flex-col items-center justify-center">
                    <span className="text-[8px] sm:text-[9px] font-bold text-white block truncate w-full">Mobile Ready</span>
                  </div>
                  <div className="p-1 sm:p-1.5 rounded-md bg-white/[0.04] border border-[#22E55E]/30 text-center flex flex-col items-center justify-center">
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#22E55E] block truncate w-full">1 Year Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop Right Labels (4 to 6) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-5">
            {rightPins.map((item) => {
              const isHighlighted = activePin === item.number;
              return (
                <div
                  key={item.number}
                  onMouseEnter={() => setActivePin(item.number)}
                  onMouseLeave={() => setActivePin(null)}
                  className={`p-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 border ${
                    isHighlighted
                      ? 'bg-[#22E55E]/10 border-[#22E55E] shadow-[0_0_20px_rgba(34,229,94,0.25)] -translate-x-1'
                      : 'bg-[#0A0D11] border-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isHighlighted
                        ? 'bg-brand-gradient text-[#050505]'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {item.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00E5FF]">{renderPinIcon(item.iconName)}</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {item.shortTitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile 2-Column Compact Benefits Grid (Clean icons & titles without pin numbers) */}
        <div className="lg:hidden mt-4 sm:mt-6 grid grid-cols-2 gap-2">
          {WHAT_YOU_GET.map((item) => (
            <div
              key={item.number}
              className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-[#0A0D11] text-left flex items-center gap-2 min-w-0"
            >
              <span className="text-[#00E5FF] shrink-0">{renderPinIcon(item.iconName)}</span>
              <span className="text-xs font-bold text-white truncate">{item.shortTitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row of Chips: "We build:" (Shifted to right on desktop) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090C10] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-white shrink-0">
          We build:
        </span>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-end gap-2 sm:ml-auto">
          {WE_BUILD_TYPES.map((type, idx) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelectWebsiteType(type)}
              className={`px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/12 text-white/90 hover:text-white hover:border-[#00E5FF]/60 hover:bg-white/[0.08] transition-all cursor-pointer group flex items-center justify-between sm:justify-start gap-1.5 ${
                idx === WE_BUILD_TYPES.length - 1 ? 'col-span-2 sm:col-auto' : ''
              }`}
            >
              <span className="truncate">{type}</span>
              <ArrowRight className="w-3 h-3 text-[#22E55E] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* "How It Works" Progress Line with 4 Steps (Visible on both mobile & desktop) */}
      <div className="pt-4 border-t border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#00E5FF] uppercase tracking-wider">
            How It Works
          </p>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#22E55E]/15 border border-[#22E55E]/30 text-[#22E55E]">
            Live in 7-12 days
          </span>
        </div>

        {/* Scroll-Linked Progress Line (Connecting line visible on mobile & desktop) */}
        <div className="relative pt-2">
          {/* Progress bar background line */}
          <div className="absolute top-4 sm:top-7 inset-x-6 sm:inset-x-8 h-1 bg-white/10 rounded-full" />
          {/* Scroll-Linked Animated Gradient Line */}
          <motion.div
            style={{ width: progressLineWidth }}
            className="absolute top-4 sm:top-7 left-6 sm:left-8 h-1 bg-gradient-to-r from-[#39FF14] via-[#00E5FF] to-[#1E90FF] rounded-full shadow-[0_0_12px_#00E5FF]"
          />

          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative z-10">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0B0E12] border border-white/20 text-white flex items-center justify-center text-xs sm:text-sm font-extrabold mb-2 shadow-md">
                  {step.step}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. ABOUT US SECTION (WITH 4-MEMBER TEAM & MOBILE COMPACTION)               */
/* -------------------------------------------------------------------------- */
export const AboutSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
          <span className="text-white">About SiteMorph</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {ABOUT_CONTENT.heading}
        </h2>

        {/* Desktop Intro (3 paragraphs) */}
        <div className="hidden sm:block space-y-3 text-sm sm:text-base text-[#A0A0A0] leading-relaxed pt-1">
          {ABOUT_CONTENT.lines.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Mobile Compacted Intro (3 short lines with bold key phrases) */}
        <div className="sm:hidden space-y-2 pt-1 text-sm text-[#A0A0A0]">
          {ABOUT_CONTENT.mobileLines.map((item, idx) => (
            <p key={idx} className="leading-snug">
              <span className="font-extrabold text-white">{item.bold}</span>{' '}
              {item.text.replace(item.bold, '')}
            </p>
          ))}
        </div>
      </div>

      {/* 4 Team Members Grid (2x2 on mobile, 4-col on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {TEAM.map((member, idx) => {
          return (
            <motion.div
              key={member.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="group p-3.5 sm:p-5 rounded-2xl bg-[#090C10] border border-white/10 glass-surface-hover flex flex-col items-center text-center justify-between"
            >
              <div className="flex flex-col items-center">
                {/* Team Initials with Glowing Gradient Ring (PJ, AT, VP, DM) */}
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#39FF14] to-[#00E5FF] mb-3 shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.22)]">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0B131A] to-[#06080C] flex items-center justify-center">
                    <span className="text-base sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#00E5FF] tracking-wider select-none">
                      {member.initials}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {member.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-[#00E5FF] mt-0.5">
                  {member.role}
                </p>
              </div>

              {/* Bio: Hidden on mobile for compaction, visible on desktop */}
              <p className="hidden sm:block text-xs text-[#A0A0A0] mt-3 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
