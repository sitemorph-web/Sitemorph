/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * SITEMORPH — SINGLE PAGE MAIN WEBSITE & DESIGN SERVICES
 * ============================================================================
 * Centralized editable content is located in `src/siteConfig.ts`.
 * - Main site order: Home -> What You Get -> About -> Plans -> Enquiry Form -> Contact -> Footer
 * - Design Services: dedicated route (`#/design-services` or `/design-services`)
 * - Intro animation: plays once per session (~2.1s), can be disabled via sessionStorage
 * ============================================================================
 */

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PlanName } from './siteConfig';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingElements } from './components/FloatingElements';
import { IntroAnimation, hasSeenIntro } from './components/IntroAnimation';
import {
  AboutSection,
  HeroSection,
  WhatYouGetSection,
} from './components/MarketingSections';
import {
  ContactSection,
  EnquiryFormSection,
  PlansSection,
} from './components/ConversionSections';
import { DesignServicesPage } from './components/DesignServicesPage';

type AppRoute = 'main' | 'design-services';

const SEO_CONFIG = {
  main: {
    title: 'SiteMorph – Custom Business Websites That Define Brands',
    description:
      'SiteMorph designs fast, mobile-first custom websites for businesses, cafes, institutes, and online stores. Includes 1 year free .com domain and 1 year support.',
  },
  'design-services': {
    title: 'Logo, Thumbnail and Ad Design Services | SiteMorph',
    description:
      'Professional logo design, high-CTR YouTube thumbnails, social media post graphics, and ad designs by SiteMorph. Build a brand look that gets noticed.',
  },
};

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'main';

  // 1. Check user's current session state:
  // If user was on the Home page, always stay on Home!
  const savedSession = sessionStorage.getItem('sitemorph_active_route');
  if (savedSession === 'main') {
    if (window.location.pathname.includes('design-services') || window.location.hash.includes('design-services')) {
      try {
        window.history.replaceState(null, '', '/');
      } catch {
        // ignore
      }
    }
    return 'main';
  }

  if (savedSession === 'design-services') {
    return 'design-services';
  }

  // 2. Check hash
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('design-services')) {
    return 'design-services';
  }

  // 3. Fresh visit: default to main home page
  return 'main';
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedPlan, setSelectedPlan] = useState<string>('Business');
  const [selectedWebsiteType, setSelectedWebsiteType] = useState<string>('Business');

  // Intro Animation State: plays once per browser session
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());
  const [introEnded, setIntroEnded] = useState(() => hasSeenIntro());

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIntroEnded(true);
  }, []);

  // Handle URL changes & popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('design-services')) {
        sessionStorage.setItem('sitemorph_active_route', 'design-services');
        setCurrentRoute('design-services');
      } else {
        sessionStorage.setItem('sitemorph_active_route', 'main');
        setCurrentRoute('main');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update Document Title and Meta Description for SEO
  useEffect(() => {
    const seo = SEO_CONFIG[currentRoute];
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [currentRoute]);

  // Scroll to top whenever route switches smoothly
  useEffect(() => {
    sessionStorage.setItem('sitemorph_active_route', currentRoute);
    if (currentRoute === 'main') {
      if (window.location.hash.includes('design-services') || window.location.pathname.includes('design-services')) {
        try {
          window.history.replaceState(null, '', '/');
        } catch {
          // ignore
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // Scroll Spy for Single Page Main Site (Order: Home, What You Get, About, Plans, Contact)
  useEffect(() => {
    if (currentRoute !== 'main') return;

    const sectionIds = ['home', 'services', 'about', 'plans', 'enquiry-form', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            // Map enquiry-form to 'contact' for nav highlighting
            const mappedSection = id === 'enquiry-form' ? 'contact' : id;
            setActiveSection(mappedSection);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  const scrollToElement = useCallback(
    (elementId: string) => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [prefersReducedMotion]
  );

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (sectionId === 'home') {
        sessionStorage.setItem('sitemorph_active_route', 'main');
        if (currentRoute !== 'main') {
          window.location.hash = '';
          try {
            window.history.replaceState(null, '', '/');
          } catch {
            // ignore
          }
          setCurrentRoute('main');
        }
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }

      if (currentRoute !== 'main') {
        sessionStorage.setItem('sitemorph_active_route', 'main');
        window.location.hash = '';
        try {
          window.history.replaceState(null, '', '/');
        } catch {
          // ignore
        }
        setCurrentRoute('main');
        setTimeout(() => {
          scrollToElement(sectionId);
        }, 100);
      } else {
        scrollToElement(sectionId);
      }
    },
    [currentRoute, prefersReducedMotion, scrollToElement]
  );

  const handleGoToDesignServices = useCallback(() => {
    sessionStorage.setItem('sitemorph_active_route', 'design-services');
    window.location.hash = '#/design-services';
    if (currentRoute !== 'design-services') {
      setCurrentRoute('design-services');
    }
    // Immediately reset to top hero section
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const hero = document.getElementById('design-services-hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
      const h = document.getElementById('design-services-hero');
      if (h) h.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 40);
  }, [currentRoute]);

  const handleBackToHome = useCallback(() => {
    sessionStorage.setItem('sitemorph_active_route', 'main');
    window.location.hash = '';
    try {
      window.history.replaceState(null, '', '/');
    } catch {
      // ignore
    }
    setCurrentRoute('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGetWebsiteClick = useCallback(() => {
    navigateToSection('enquiry-form');
  }, [navigateToSection]);

  const handleSeePlansClick = useCallback(() => {
    navigateToSection('plans');
  }, [navigateToSection]);

  const handleSelectPlan = useCallback(
    (planName: PlanName) => {
      setSelectedPlan(planName);
      navigateToSection('enquiry-form');
    },
    [navigateToSection]
  );

  const handleSelectWebsiteType = useCallback(
    (type: string) => {
      setSelectedWebsiteType(type);
      navigateToSection('enquiry-form');
    },
    [navigateToSection]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#A0A0A0] relative overflow-x-clip">
      {/* 2.1s Intro Animation Overlay (plays once per session) */}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Universal Sticky Navbar */}
      <Navbar
        isDesignServicesPage={currentRoute === 'design-services'}
        activeSection={activeSection}
        onNavigateSection={navigateToSection}
        onGoToDesignServices={handleGoToDesignServices}
        onGetWebsiteClick={handleGetWebsiteClick}
      />

      <main className="flex-1 relative z-20">
        <AnimatePresence mode="wait">
          {currentRoute === 'main' ? (
            <motion.div
              key="main-single-page"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* 1. Home (Hero + Chips + Counters + Tagline Strip) */}
              <HeroSection
                onGetWebsiteClick={handleGetWebsiteClick}
                onSeePlansClick={handleSeePlansClick}
                introEnded={introEnded}
              />

              {/* 2. What You Get (Large Browser Mockup with 6 Pins + We Build Chips + Process Line) */}
              <WhatYouGetSection onSelectWebsiteType={handleSelectWebsiteType} />

              {/* 3. About (with 4 Team Members) */}
              <AboutSection />

              {/* 4. Plans (Comparison Table) */}
              <PlansSection onSelectPlan={handleSelectPlan} />

              {/* 5. Enquiry Form */}
              <EnquiryFormSection
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
                selectedWebsiteType={selectedWebsiteType}
                onWebsiteTypeChange={setSelectedWebsiteType}
              />

              {/* 6. Contact */}
              <ContactSection />
            </motion.div>
          ) : (
            <motion.div
              key="design-services-page"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              onAnimationComplete={() => {
                window.scrollTo(0, 0);
                const hero = document.getElementById('design-services-hero');
                if (hero) hero.scrollIntoView({ behavior: 'auto', block: 'start' });
              }}
            >
              <DesignServicesPage
                onBackToHome={handleBackToHome}
                onGoToMainPlans={() => {
                  sessionStorage.setItem('sitemorph_active_route', 'main');
                  window.location.hash = '';
                  try {
                    window.history.replaceState(null, '', '/');
                  } catch {
                    // ignore
                  }
                  setCurrentRoute('main');
                  setTimeout(() => scrollToElement('plans'), 80);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <Footer
        onNavigateSection={navigateToSection}
        onGoToDesignServices={handleGoToDesignServices}
        onGetWebsiteClick={handleGetWebsiteClick}
      />

      {/* Floating Elements (Ambient cursor glow on desktop + persistent floating WhatsApp button) */}
      <FloatingElements />
    </div>
  );
}
