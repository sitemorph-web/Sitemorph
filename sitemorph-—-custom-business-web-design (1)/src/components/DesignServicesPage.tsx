import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Eye,
  Film,
  Instagram,
  Layers,
  MessageCircle,
  Palette,
  Send,
  Share2,
  Sparkles,
  Video,
  X,
  Zap,
} from 'lucide-react';
import {
  CONTACT_DETAILS,
  DESIGN_CAPABILITIES,
  DESIGN_FAQ,
  DESIGN_NEEDED_OPTIONS,
  DESIGN_PACKAGE_OPTIONS,
  DESIGN_PACKAGES,
  DESIGN_PROCESS_STEPS,
  DESIGN_SAMPLES,
  DesignCapabilityItem,
  getWhatsAppUrl,
} from '../siteConfig';
import { saveBookingToSupabase } from '../lib/supabase';

interface DesignServicesPageProps {
  onBackToHome: () => void;
  onGoToMainPlans: () => void;
}

interface DesignFormValues {
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  designNeeded: string;
  packageType: string;
  budget: string;
  message: string;
  referenceLink: string;
}

interface DesignFormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  message?: string;
}

const renderCapabilityIcon = (name: DesignCapabilityItem['iconName']) => {
  const cls = 'w-5 h-5 text-[#00E5FF] group-hover:text-[#39FF14] transition-colors duration-150';
  switch (name) {
    case 'sparkles':
      return <Sparkles className={cls} />;
    case 'video':
      return <Video className={cls} />;
    case 'instagram':
      return <Instagram className={cls} />;
    case 'film':
      return <Film className={cls} />;
    case 'layers':
      return <Layers className={cls} />;
    case 'creditCard':
      return <CreditCard className={cls} />;
    case 'palette':
      return <Palette className={cls} />;
    case 'share2':
      return <Share2 className={cls} />;
  }
};

export const DesignServicesPage: React.FC<DesignServicesPageProps> = ({
  onBackToHome,
  onGoToMainPlans,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [selectedPackage, setSelectedPackage] = useState<string>('Social Media Pack');
  const [selectedDesignNeeded, setSelectedDesignNeeded] = useState<string>('Logo');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [previewSample, setPreviewSample] = useState<(typeof DESIGN_SAMPLES)[0] | null>(null);
  const [activePackageIndex, setActivePackageIndex] = useState<number>(1); // Highlighted Social Media Pack
  const [sampleImgErrors, setSampleImgErrors] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef<boolean>(false);

  // Ensure page immediately resets to top hero section when entering Design Services
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const hero = document.getElementById('design-services-hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    const t1 = setTimeout(() => {
      window.scrollTo(0, 0);
      const h = document.getElementById('design-services-hero');
      if (h) h.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 40);
    const t2 = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Helper to scroll carousel horizontally without affecting document window scroll
  const scrollCarouselTo = useCallback((idx: number, smooth: boolean = true) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const targetCard = container.children[idx] as HTMLElement | undefined;
    if (targetCard) {
      const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // Start mobile carousel on highlighted Social Media Pack on mount ONLY inside container (never scroll window)
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollCarouselTo(1, false);
    }, 80);
    return () => clearTimeout(timer);
  }, [scrollCarouselTo]);

  // Auto-move carousel every 3.5 seconds on mobile ONLY within horizontal container
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current || !carouselRef.current) return;
      setActivePackageIndex((prev) => {
        const nextIdx = (prev + 1) % DESIGN_PACKAGES.length;
        scrollCarouselTo(nextIdx, true);
        return nextIdx;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [scrollCarouselTo]);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.children[0]?.clientWidth || 280;
    const newIdx = Math.round(scrollLeft / cardWidth);
    setActivePackageIndex(Math.max(0, Math.min(newIdx, DESIGN_PACKAGES.length - 1)));
  };

  const scrollToPackage = (idx: number) => {
    setActivePackageIndex(idx);
    scrollCarouselTo(idx, true);
  };

  const [formValues, setFormValues] = useState<DesignFormValues>({
    fullName: '',
    phone: '',
    email: '',
    businessName: '',
    designNeeded: 'Logo',
    packageType: 'Social Media Pack',
    budget: '',
    message: '',
    referenceLink: '',
  });

  const [formErrors, setFormErrors] = useState<DesignFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<DesignFormValues | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const handleChoosePackage = (packageName: string) => {
    setSelectedPackage(packageName);
    setFormValues((prev) => ({ ...prev, packageType: packageName }));
    scrollToSection('design-order-form');
  };

  const validate = (): DesignFormErrors => {
    const nextErrors: DesignFormErrors = {};
    if (!formValues.fullName.trim() || formValues.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const cleanDigits = formValues.phone.replace(/\D/g, '');
    if (cleanDigits.length < 10 || cleanDigits.length > 15) {
      nextErrors.phone = 'Enter a valid 10-digit phone or WhatsApp number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formValues.businessName.trim()) {
      nextErrors.businessName = 'Please enter your brand or business name.';
    }
    if (!formValues.message.trim() || formValues.message.trim().length < 8) {
      nextErrors.message = 'Please provide a short description of the designs needed.';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const payload = {
      fullName: formValues.fullName.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      businessName: formValues.businessName.trim(),
      designNeeded: selectedDesignNeeded,
      packageType: selectedPackage,
      budget: formValues.budget.trim() || 'Not specified',
      message: formValues.message.trim(),
      referenceLink: formValues.referenceLink.trim() || 'None',
      submittedAt: new Date().toISOString(),
    };

    // Save to connected Supabase database (Project ID: uplukxjquzwrgxlgfzav)
    try {
      const supabaseResult = await saveBookingToSupabase({
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        businessName: payload.businessName,
        websiteType: payload.designNeeded,
        preferredPlan: payload.packageType,
        budget: payload.budget,
        message: payload.message,
        referenceLink: payload.referenceLink,
        source: 'design_services',
        submittedAt: payload.submittedAt,
      });
      console.log('[SiteMorph Design Services Order saved to Supabase]:', supabaseResult);
    } catch (saveErr) {
      console.warn('[SiteMorph Supabase Sync Warning]:', saveErr);
    }

    setIsSubmitting(false);
    setSubmittedPayload(payload);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[#080B0F] border border-white/12 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-colors';

  const whatsappPrefilled = submittedPayload
    ? `Hi SiteMorph! I'm ${submittedPayload.fullName} from ${submittedPayload.businessName}. I just requested a quote for ${submittedPayload.designNeeded} (${submittedPayload.packageType}).`
    : CONTACT_DETAILS.whatsappDesignMessage;

  return (
    <div id="design-services-hero" className="pt-24 sm:pt-28 pb-20 space-y-20 sm:space-y-24 scroll-mt-24">
      {/* 1. TOP BREADCRUMB & HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00E5FF] hover:text-[#22E55E] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
            <span className="text-white">Design Services by SiteMorph</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] text-white">
            Your Brand. Your Content.{' '}
            <span className="text-brand-gradient">Made to Get Noticed.</span>
          </h1>

          <div className="w-16 h-[2px] bg-gradient-to-r from-[#39FF14] to-[#00E5FF] rounded-full" />

          <p className="text-base sm:text-lg text-[#A0A0A0] leading-relaxed max-w-2xl">
            Logos, thumbnails and ad designs that help your business grow online.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => scrollToSection('design-order-form')}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#050505] bg-brand-gradient hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_28px_rgba(0,229,255,0.28)] transition-all duration-150 whitespace-nowrap cursor-pointer"
            >
              <span>Order a Design</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('design-packages')}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white border border-white/20 bg-white/[0.03] hover:border-[#00E5FF]/60 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap cursor-pointer"
            >
              <span>See Packages</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. WHAT WE CREATE (COMPACT ICON-TILE GRID: 3 COLS ON MOBILE, 4 ON TABLETS/DESKTOP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-[#22E55E]">What We Create</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Custom Graphic Assets Tailored for Online Growth.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">
            Every asset is delivered in high-resolution, vector formats ready for digital and print.
          </p>
        </div>

        {/* 3 columns on phones, 4 on tablets/desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {DESIGN_CAPABILITIES.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (idx % 4) * 0.04 }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090D12] border border-white/10 glass-surface-hover flex flex-col items-center text-center justify-center gap-2 sm:gap-2.5"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-[#00E5FF]/40 transition-colors shrink-0">
                {renderCapabilityIcon(item.iconName)}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {item.shortLabel || item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DESIGN PACKAGES (SWIPE CAROUSEL ON MOBILE, 3-COL ON DESKTOP) */}
      <section id="design-packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-[#00E5FF]">Transparent Packages</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Design Packages Built for Speed and Polish.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">
            Choose a standalone design package or combine with a website for bundle savings.
          </p>
        </div>

        {/* Desktop 3-Column Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 items-stretch">
          {DESIGN_PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-transform duration-200 ${
                pkg.featured
                  ? 'bg-[#0C1218] border border-[#00E5FF]/55 shadow-[0_16px_48px_-12px_rgba(0,229,255,0.2)]'
                  : 'glass-surface glass-surface-hover'
              }`}
            >
              {pkg.featured && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-brand-gradient"
                />
              )}

              <div className="space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  {pkg.highlightLabel && (
                    <span className="text-xs font-semibold text-[#00E5FF]">
                      {pkg.highlightLabel}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {pkg.price}
                  </p>
                  <p className="text-xs text-[#A0A0A0] mt-0.5">{pkg.deliveryTime}</p>
                </div>

                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">{pkg.subtitle}</p>

                <div className="border-t border-white/10 pt-4">
                  <ul className="space-y-2.5">
                    {pkg.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90">
                        <Check className="w-4 h-4 text-[#22E55E] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => handleChoosePackage(pkg.name)}
                  className={`w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    pkg.featured
                      ? 'bg-brand-gradient text-[#050505] hover:brightness-110 shadow-[0_0_24px_rgba(0,229,255,0.25)]'
                      : 'bg-white/[0.06] text-white border border-white/15 hover:border-[#00E5FF]/50 hover:bg-white/[0.1]'
                  }`}
                >
                  <span>Choose {pkg.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Carousel with Scroll-Snap */}
        <div className="lg:hidden space-y-4">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            onTouchStart={() => {
              isPausedRef.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                isPausedRef.current = false;
              }, 2000);
            }}
            onMouseEnter={() => {
              isPausedRef.current = true;
            }}
            onMouseLeave={() => {
              isPausedRef.current = false;
            }}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {DESIGN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`w-[85vw] max-w-[320px] shrink-0 snap-center rounded-2xl p-5 flex flex-col justify-between border ${
                  pkg.featured
                    ? 'bg-[#0C1218] border-[#00E5FF]/60 shadow-[0_0_24px_rgba(0,229,255,0.18)]'
                    : 'bg-[#090D12] border-white/12'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                    {pkg.highlightLabel && (
                      <span className="text-[10px] font-bold text-[#00E5FF] uppercase">
                        {pkg.highlightLabel}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-2xl font-extrabold text-white font-mono">
                      {pkg.price}
                    </p>
                    <p className="text-[11px] text-[#A0A0A0] mt-0.5">{pkg.deliveryTime}</p>
                  </div>

                  <p className="text-xs text-[#A0A0A0]">{pkg.subtitle}</p>

                  <div className="border-t border-white/10 pt-3">
                    <ul className="space-y-2">
                      {pkg.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-xs text-white/90">
                          <Check className="w-3.5 h-3.5 text-[#22E55E] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => handleChoosePackage(pkg.name)}
                    className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      pkg.featured
                        ? 'bg-brand-gradient text-[#050505] shadow-[0_0_16px_rgba(0,229,255,0.3)]'
                        : 'bg-white/[0.08] text-white border border-white/15'
                    }`}
                  >
                    <span>Choose {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {DESIGN_PACKAGES.map((pkg, idx) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => scrollToPackage(idx)}
                aria-label={`Go to ${pkg.name}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activePackageIndex === idx
                    ? 'w-6 bg-gradient-to-r from-[#39FF14] to-[#00E5FF]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SAMPLE DESIGNS GRID WITH ONERROR FALLBACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-[#22E55E]">Design Work Samples</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Recent Logos, Thumbnails and Brand Assets.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">
            Click any piece to inspect details or request similar styling for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESIGN_SAMPLES.map((sample, idx) => (
            <motion.article
              key={sample.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (idx % 3) * 0.06 }}
              className="group rounded-2xl glass-surface glass-surface-hover overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className={`relative ${sample.aspectClass} overflow-hidden bg-[#0A0D10]`}>
                  {!sampleImgErrors[sample.id] ? (
                    <img
                      src={sample.imageSrc}
                      alt={sample.altText}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setSampleImgErrors((prev) => ({ ...prev, [sample.id]: true }))
                      }
                      className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#070B0E] via-[#0D1520] to-[#05070A] p-4 text-center">
                      <Sparkles className="w-8 h-8 text-[#00E5FF]/40 mb-1" />
                      <span className="text-xs font-semibold text-white/60 block">{sample.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#050505]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                    <button
                      type="button"
                      onClick={() => setPreviewSample(sample)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gradient text-[#050505] text-xs font-bold shadow-lg cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Sample</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-1.5">
                  <p className="text-xs font-semibold text-[#00E5FF]">{sample.category}</p>
                  <h3 className="text-base font-bold text-white">{sample.title}</h3>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewSample(sample)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  <span>Inspect Design</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SAMPLE MODAL */}
      <AnimatePresence>
        {previewSample && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewSample(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-2xl lg:max-w-3xl rounded-2xl bg-[#0B0E12] border border-white/15 overflow-hidden shadow-2xl max-h-[82vh] flex flex-col my-auto"
            >
              {/* Modal Top Header Bar with category indicator and close icon */}
              <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#0B0E12] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22E55E] shadow-[0_0_8px_#22E55E]" />
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                    {previewSample.category}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSample(null)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Full Image Container - Fits comfortably within viewport with no top or bottom clipping */}
              <div className="relative flex-1 min-h-[180px] max-h-[46vh] sm:max-h-[50vh] bg-[#05070A] flex items-center justify-center p-3 sm:p-4 overflow-hidden border-b border-white/10">
                <img
                  src={previewSample.imageSrc}
                  alt={previewSample.altText}
                  referrerPolicy="no-referrer"
                  className="max-h-[42vh] sm:max-h-[46vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-xl mx-auto"
                />
              </div>

              {/* Modal Footer Info & Actions */}
              <div className="p-4 sm:p-5 space-y-3 shrink-0 bg-[#0B0E12]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{previewSample.title}</h3>
                  <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5 line-clamp-2">
                    Original graphic asset designed for high visual engagement and brand recall.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewSample(null)}
                    className="px-4 py-2 rounded-xl border border-white/15 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDesignNeeded(previewSample.category);
                      setPreviewSample(null);
                      scrollToSection('design-order-form');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-[#050505] bg-brand-gradient hover:brightness-110 transition-all cursor-pointer shadow-[0_0_16px_rgba(0,229,255,0.25)]"
                  >
                    Order Similar Design
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. HOW IT WORKS 4-STEP TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-xl space-y-2">
          <p className="text-xs font-semibold text-[#00E5FF]">How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            From Initial Brief to Delivery in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESIGN_PROCESS_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-[#0A0D10] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-sm font-mono font-bold text-brand-gradient tabular-nums">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                <p className="text-sm text-[#A0A0A0] mt-2 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. WEBSITE + DESIGN BUNDLE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-7 sm:p-10 rounded-3xl glass-surface border border-[#00E5FF]/40 shadow-[0_16px_48px_-12px_rgba(0,229,255,0.22)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22E55E]/10 border border-[#22E55E]/30 text-xs font-semibold text-[#22E55E]">
              <Zap className="w-3.5 h-3.5" />
              <span>Special Offer</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Get a website and a logo together and save.
            </h3>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Bundle your custom website build with logo design, social profile covers, and ad creatives under one transparent package.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToMainPlans}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-[#050505] bg-brand-gradient hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_24px_rgba(0,229,255,0.25)] transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>See Website Plans</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-xl space-y-2">
          <p className="text-xs font-semibold text-[#22E55E]">Got Questions?</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {DESIGN_FAQ.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl glass-surface border border-white/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00E5FF] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-5 text-sm text-[#A0A0A0] leading-relaxed border-t border-white/5 pt-3"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. ORDER FORM */}
      <section id="design-order-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl p-6 sm:p-10 lg:p-12 glass-surface border border-white/12 shadow-[0_24px_64px_-24px_rgba(0,229,255,0.16)]">
          <div className="max-w-2xl space-y-2.5 mb-8">
            <p className="text-xs font-semibold text-[#00E5FF]">Get Started Today</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Let&apos;s Create Your{' '}
              <span className="text-brand-gradient">Brand Look.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0A0]">
              Tell us what designs you need. We will respond promptly with draft ideas, timelines, and an honest quote.
            </p>
          </div>

          {submittedPayload ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 rounded-2xl bg-[#0A1310] border border-[#22E55E]/40 space-y-5"
            >
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-7 h-7 text-[#22E55E] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Design Request Received, {submittedPayload.fullName}!
                  </h3>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    Thank you for reaching out for{' '}
                    <span className="text-white font-medium">{submittedPayload.businessName}</span>{' '}
                    ({submittedPayload.designNeeded} · {submittedPayload.packageType}). We will get in touch on{' '}
                    <span className="text-white font-mono">{submittedPayload.phone}</span> shortly.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href={getWhatsAppUrl(whatsappPrefilled)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#22C55E] text-white text-xs sm:text-sm font-semibold transition-colors text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Send Details on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedPayload(null);
                    setFormValues({
                      fullName: '',
                      phone: '',
                      email: '',
                      businessName: '',
                      designNeeded: 'Logo',
                      packageType: 'Social Media Pack',
                      budget: '',
                      message: '',
                      referenceLink: '',
                    });
                  }}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/15 text-sm font-medium text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="df-name" className="block text-xs font-semibold text-white mb-1.5">
                    Full Name <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="df-name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formValues.fullName}
                    onChange={(e) => setFormValues({ ...formValues, fullName: e.target.value })}
                    className={inputClass}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="df-phone" className="block text-xs font-semibold text-white mb-1.5">
                    Phone / WhatsApp Number <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="df-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formValues.phone}
                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                    className={inputClass}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="df-email" className="block text-xs font-semibold text-white mb-1.5">
                    Email Address <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="df-email"
                    type="email"
                    placeholder="you@yourbusiness.com"
                    value={formValues.email}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    className={inputClass}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="df-business" className="block text-xs font-semibold text-white mb-1.5">
                    Business / Brand Name <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="df-business"
                    type="text"
                    placeholder="e.g. Aurora Apparel"
                    value={formValues.businessName}
                    onChange={(e) =>
                      setFormValues({ ...formValues, businessName: e.target.value })
                    }
                    className={inputClass}
                  />
                  {formErrors.businessName && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.businessName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="df-needed" className="block text-xs font-semibold text-white mb-1.5">
                    Design Needed
                  </label>
                  <select
                    id="df-needed"
                    value={selectedDesignNeeded}
                    onChange={(e) => setSelectedDesignNeeded(e.target.value)}
                    className={inputClass}
                  >
                    {DESIGN_NEEDED_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0B0E12] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="df-package" className="block text-xs font-semibold text-white mb-1.5">
                    Package
                  </label>
                  <select
                    id="df-package"
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className={inputClass}
                  >
                    {DESIGN_PACKAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0B0E12] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="df-budget" className="block text-xs font-semibold text-white mb-1.5">
                    Estimated Budget <span className="text-[#A0A0A0] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="df-budget"
                    type="text"
                    placeholder="e.g. ₹5,000 – ₹10,000"
                    value={formValues.budget}
                    onChange={(e) => setFormValues({ ...formValues, budget: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="df-link" className="block text-xs font-semibold text-white mb-1.5">
                    Reference / Moodboard Link <span className="text-[#A0A0A0] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="df-link"
                    type="url"
                    placeholder="e.g. Drive or Pinterest link"
                    value={formValues.referenceLink}
                    onChange={(e) =>
                      setFormValues({ ...formValues, referenceLink: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="df-message" className="block text-xs font-semibold text-white mb-1.5">
                  Message / Requirements <span className="text-[#22E55E]">*</span>
                </label>
                <textarea
                  id="df-message"
                  rows={4}
                  placeholder="Describe what visual style you like, your target audience, colors, or deadlines..."
                  value={formValues.message}
                  onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                  className={inputClass}
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.message}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#050505] bg-brand-gradient hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_28px_rgba(0,229,255,0.28)] transition-all duration-150 disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Book My Free Consultation'}</span>
                </button>

                <a
                  href={getWhatsAppUrl(CONTACT_DETAILS.whatsappDesignMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white border border-[#22E55E]/45 bg-[#22E55E]/10 hover:bg-[#22E55E]/18 transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-[#22E55E]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
