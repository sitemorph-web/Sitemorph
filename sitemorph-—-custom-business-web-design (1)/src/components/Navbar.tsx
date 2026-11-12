import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { MAIN_NAV_SECTIONS } from '../siteConfig';
import { SiteMorphLogo } from './SiteMorphLogo';

interface NavbarProps {
  isDesignServicesPage: boolean;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onGoToDesignServices: () => void;
  onGetWebsiteClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDesignServicesPage,
  activeSection,
  onNavigateSection,
  onGoToDesignServices,
  onGetWebsiteClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Top scroll progress indicator */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="h-[2px] w-full origin-left bg-gradient-to-r from-[#39FF14] via-[#00E5FF] to-[#1E90FF]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand Wordmark & Ribbon M */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-lg"
          aria-label="SiteMorph Home"
        >
          <SiteMorphLogo size="md" />
        </a>

        {/* Zone 2: Desktop Navigation Links with Scroll-Spy Indicator */}
        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-6">
          {MAIN_NAV_SECTIONS.map((item) => {
            const isActive = !isDesignServicesPage && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded ${
                  isActive ? 'text-white font-semibold' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="active-nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#22E55E] to-[#00E5FF]"
                    transition={{ duration: 0.18 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: CTA Buttons + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Design Services Button (Outline with Gradient Border, Glow & NEW badge) */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onGoToDesignServices();
            }}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 relative ${
              isDesignServicesPage
                ? 'bg-[#00E5FF]/15 text-white border border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)]'
                : 'text-white border border-transparent bg-[#080D12] [background:linear-gradient(#080D12,#080D12)_padding-box,linear-gradient(95deg,#22E55E,#00E5FF,#1E90FF)_border-box] hover:shadow-[0_0_24px_rgba(0,229,255,0.28)] hover:-translate-y-0.5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22E55E]" />
            <span>Design Services</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-brand-gradient text-[#050505] leading-none">
              NEW
            </span>
          </button>

          {/* Primary CTA: Get a Website */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onGetWebsiteClick();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#050505] bg-brand-gradient hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_24px_rgba(0,229,255,0.25)] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Get a Website</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Small button beside hamburger menu with star/sparkles logo for Design Services */}
          <button
            type="button"
            onClick={onGoToDesignServices}
            aria-label="Design Services"
            className={`xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors duration-150 cursor-pointer ${
              isDesignServicesPage
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_14px_rgba(0,229,255,0.3)]'
                : 'border-white/12 bg-white/[0.04] text-[#22E55E] hover:border-[#00E5FF]/50 shadow-[0_0_12px_rgba(34,229,94,0.15)]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#22E55E]" />
          </button>

          {/* Hamburger toggle button on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/12 bg-white/[0.04] text-white hover:border-[#00E5FF]/50 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="xl:hidden bg-[#07090C]/98 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 pt-3 pb-6 max-h-[85vh] overflow-y-auto"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {MAIN_NAV_SECTIONS.map((item) => {
                const isActive = !isDesignServicesPage && activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-semibold'
                        : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="text-xs font-mono text-[#00E5FF]">Current</span>
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2.5">
              {/* Full-width Get a Website button on mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetWebsiteClick();
                }}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#050505] bg-brand-gradient shadow-[0_0_24px_rgba(0,229,255,0.28)] cursor-pointer"
              >
                <span>Get a Website</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
