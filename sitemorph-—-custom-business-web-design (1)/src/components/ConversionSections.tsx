import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Check,
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  CONTACT_DETAILS,
  PLANS,
  PLAN_UNIVERSAL_BANNER,
  PREFERRED_PLAN_OPTIONS,
  PlanName,
  WEBSITE_TYPE_OPTIONS,
  getWhatsAppUrl,
} from '../siteConfig';
import { saveBookingToSupabase } from '../lib/supabase';

/* -------------------------------------------------------------------------- */
/* 5. PLANS / PRICING SECTION (3 DISTINCT CARDS + MOBILE AUTO-MOVING)         */
/* -------------------------------------------------------------------------- */
interface PlansSectionProps {
  onSelectPlan: (planName: PlanName) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({ onSelectPlan }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activePlanIndex, setActivePlanIndex] = useState<number>(1); // Highlighted Business
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef<boolean>(false);

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

  // Center on Business plan on mount ONLY horizontally within container (never scroll window)
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
      setActivePlanIndex((prev) => {
        const nextIdx = (prev + 1) % PLANS.length;
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
    setActivePlanIndex(Math.max(0, Math.min(newIdx, PLANS.length - 1)));
  };

  const scrollToPlan = (idx: number) => {
    setActivePlanIndex(idx);
    scrollCarouselTo(idx, true);
  };

  return (
    <section id="plans" className="py-12 sm:py-20 border-t border-white/8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="max-w-2xl space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#22E55E]" />
            <span className="text-white">Choose Your Plan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Plans Built Around Your Stage of Business.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">
            Transparent pricing without surprise charges. Choose the plan that matches your goals.
          </p>
        </motion.div>

        {/* Universal Banner Included in Every Plan */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#090D12] border border-[#00E5FF]/30 shadow-[0_0_24px_rgba(0,229,255,0.12)] flex items-center justify-center text-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22E55E] shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-white/90">
            {PLAN_UNIVERSAL_BANNER}
          </p>
        </div>

        {/* Desktop 3-Column Cards Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-transform duration-200 ${
                plan.featured
                  ? 'bg-[#0C1218] border border-[#00E5FF]/60 shadow-[0_16px_48px_-12px_rgba(0,229,255,0.22)] ring-1 ring-[#00E5FF]/30'
                  : 'glass-surface glass-surface-hover'
              }`}
            >
              {plan.featured && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-brand-gradient"
                />
              )}

              <div className="space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.highlightLabel && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-gradient text-[#050505] shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                      {plan.highlightLabel}
                    </span>
                  )}
                </div>

                <div>
                  <p
                    className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
                      plan.featured ? 'text-brand-gradient' : 'text-white'
                    }`}
                  >
                    {plan.price}
                  </p>
                  <p className="text-xs text-[#A0A0A0] mt-0.5">{plan.deliveryEstimate}</p>
                </div>

                <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                  Best for: <span className="text-white/90 font-medium">{plan.bestFor}</span>
                </p>

                <div className="border-t border-white/10 pt-4">
                  <ul className="space-y-2.5">
                    {plan.bullets.map((bullet) => (
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
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    plan.featured
                      ? 'bg-brand-gradient text-[#050505] hover:brightness-110 shadow-[0_0_24px_rgba(0,229,255,0.25)]'
                      : 'bg-white/[0.06] text-white border border-white/15 hover:border-[#00E5FF]/50 hover:bg-white/[0.1]'
                  }`}
                >
                  <span>Choose {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Auto-Moving Carousel */}
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
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`w-[85vw] max-w-[320px] shrink-0 snap-center rounded-2xl p-5 flex flex-col justify-between border relative ${
                  plan.featured
                    ? 'bg-[#0C1218] border-[#00E5FF]/60 shadow-[0_0_24px_rgba(0,229,255,0.18)]'
                    : 'bg-[#090D12] border-white/12'
                }`}
              >
                {plan.featured && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-brand-gradient"
                  />
                )}

                <div className="space-y-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {plan.highlightLabel && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-brand-gradient text-[#050505]">
                        {plan.highlightLabel}
                      </span>
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-2xl font-extrabold font-mono ${
                        plan.featured ? 'text-brand-gradient' : 'text-white'
                      }`}
                    >
                      {plan.price}
                    </p>
                    <p className="text-[11px] text-[#A0A0A0] mt-0.5">{plan.deliveryEstimate}</p>
                  </div>

                  <p className="text-xs text-[#A0A0A0]">
                    Best for: <span className="text-white/90 font-medium">{plan.bestFor}</span>
                  </p>

                  <div className="border-t border-white/10 pt-3">
                    <ul className="space-y-2">
                      {plan.bullets.map((bullet) => (
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
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      plan.featured
                        ? 'bg-brand-gradient text-[#050505] shadow-[0_0_16px_rgba(0,229,255,0.3)]'
                        : 'bg-white/[0.08] text-white border border-white/15'
                    }`}
                  >
                    <span>Choose {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {PLANS.map((plan, idx) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => scrollToPlan(idx)}
                aria-label={`Go to ${plan.name} plan`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activePlanIndex === idx
                    ? 'w-6 bg-gradient-to-r from-[#39FF14] to-[#00E5FF]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. ENQUIRY / BOOKING FORM SECTION                                          */
/* -------------------------------------------------------------------------- */
interface EnquiryFormSectionProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
  selectedWebsiteType: string;
  onWebsiteTypeChange: (type: string) => void;
}

interface FormValues {
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  budget: string;
  message: string;
  preferredCallTime: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  message?: string;
}

export const EnquiryFormSection: React.FC<EnquiryFormSectionProps> = ({
  selectedPlan,
  onPlanChange,
  selectedWebsiteType,
  onWebsiteTypeChange,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [values, setValues] = useState<FormValues>({
    fullName: '',
    phone: '',
    email: '',
    businessName: '',
    budget: '',
    message: '',
    preferredCallTime: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<
    (FormValues & { websiteType: string; preferredPlan: string }) | null
  >(null);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!values.fullName.trim() || values.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const cleanDigits = values.phone.replace(/\D/g, '');
    if (cleanDigits.length < 10 || cleanDigits.length > 15) {
      nextErrors.phone = 'Enter a valid 10-digit phone or WhatsApp number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!values.businessName.trim()) {
      nextErrors.businessName = 'Please enter your business or project name.';
    }
    if (!values.message.trim() || values.message.trim().length < 8) {
      nextErrors.message = 'Briefly tell us what pages or features you need.';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      businessName: values.businessName.trim(),
      websiteType: selectedWebsiteType,
      preferredPlan: selectedPlan,
      budget: values.budget.trim() || 'Not specified',
      message: values.message.trim(),
      preferredCallTime: values.preferredCallTime.trim() || 'Anytime',
      submittedAt: new Date().toISOString(),
      source: 'website_consultation' as const,
    };

    // Save to connected Supabase database (Project ID: uplukxjquzwrgxlgfzav)
    try {
      const supabaseResult = await saveBookingToSupabase(payload);
      console.log('[SiteMorph Consultation Enquiry saved to Supabase]:', supabaseResult);
    } catch (saveErr) {
      console.warn('[SiteMorph Supabase Sync Warning]:', saveErr);
    }

    setIsSubmitting(false);
    setSubmittedPayload(payload);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[#080B0F] border border-white/12 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-colors';

  const whatsappDirectLink = getWhatsAppUrl(
    submittedPayload
      ? `Hi SiteMorph! I'm ${submittedPayload.fullName} from ${submittedPayload.businessName}. I'm interested in the ${submittedPayload.preferredPlan} plan for a ${submittedPayload.websiteType} website.`
      : undefined
  );

  return (
    <section id="enquiry-form" className="py-18 sm:py-24 border-t border-white/8 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 sm:p-10 lg:p-12 glass-surface border border-white/12 shadow-[0_24px_64px_-24px_rgba(0,229,255,0.16)]"
        >
          <div className="max-w-2xl space-y-2.5 mb-8">
            <p className="text-xs font-semibold text-[#22E55E]">Free Website Consultation</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Let&apos;s Build Something{' '}
              <span className="text-brand-gradient">Remarkable.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0A0]">
              Share a few details about your business. We will get back to you with a clear plan, timeline, and honest quote—no obligation.
            </p>
          </div>

          {submittedPayload ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-8 rounded-2xl bg-[#0A1310] border border-[#22E55E]/40 space-y-5"
            >
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-7 h-7 text-[#22E55E] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Enquiry Received, {submittedPayload.fullName}!
                  </h3>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    Thank you for reaching out about{' '}
                    <span className="text-white font-medium">{submittedPayload.businessName}</span>{' '}
                    ({submittedPayload.websiteType} · Plan: {submittedPayload.preferredPlan}). We will contact you shortly on{' '}
                    <span className="text-white font-mono">{submittedPayload.phone}</span>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href={whatsappDirectLink}
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
                    setValues({
                      fullName: '',
                      phone: '',
                      email: '',
                      businessName: '',
                      budget: '',
                      message: '',
                      preferredCallTime: '',
                    });
                  }}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/15 text-sm font-medium text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-white mb-1.5">
                    Full Name <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Rahul Sharma"
                    value={values.fullName}
                    onChange={(e) => setValues({ ...values, fullName: e.target.value })}
                    aria-invalid={Boolean(errors.fullName)}
                    className={inputClass}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-white mb-1.5">
                    Phone / WhatsApp Number <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={values.phone}
                    onChange={(e) => setValues({ ...values, phone: e.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                    className={inputClass}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-white mb-1.5">
                    Email Address <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@yourbusiness.com"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-xs font-semibold text-white mb-1.5">
                    Business Name <span className="text-[#22E55E]">*</span>
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. Urban Roast Cafe"
                    value={values.businessName}
                    onChange={(e) => setValues({ ...values, businessName: e.target.value })}
                    aria-invalid={Boolean(errors.businessName)}
                    className={inputClass}
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-xs text-red-400">{errors.businessName}</p>
                  )}
                </div>

                {/* Type of Website Dropdown */}
                <div>
                  <label htmlFor="websiteType" className="block text-xs font-semibold text-white mb-1.5">
                    Type of Website
                  </label>
                  <select
                    id="websiteType"
                    value={selectedWebsiteType}
                    onChange={(e) => onWebsiteTypeChange(e.target.value)}
                    className={inputClass}
                  >
                    {WEBSITE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0B0E12] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Plan Dropdown */}
                <div>
                  <label htmlFor="preferredPlan" className="block text-xs font-semibold text-white mb-1.5">
                    Preferred Plan
                  </label>
                  <select
                    id="preferredPlan"
                    value={selectedPlan}
                    onChange={(e) => onPlanChange(e.target.value)}
                    className={inputClass}
                  >
                    {PREFERRED_PLAN_OPTIONS.map((planOpt) => (
                      <option key={planOpt} value={planOpt} className="bg-[#0B0E12] text-white">
                        {planOpt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget (Optional) */}
                <div>
                  <label htmlFor="budget" className="block text-xs font-semibold text-white mb-1.5">
                    Estimated Budget <span className="text-[#A0A0A0] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="budget"
                    type="text"
                    placeholder="e.g. ₹10,000 – ₹20,000"
                    value={values.budget}
                    onChange={(e) => setValues({ ...values, budget: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Preferred Call Time (Optional) */}
                <div>
                  <label htmlFor="preferredCallTime" className="block text-xs font-semibold text-white mb-1.5">
                    Preferred Call Time <span className="text-[#A0A0A0] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="preferredCallTime"
                    type="text"
                    placeholder="e.g. Today after 5 PM"
                    value={values.preferredCallTime}
                    onChange={(e) => setValues({ ...values, preferredCallTime: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Message / Requirements */}
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-white mb-1.5">
                  Message / Website Requirements <span className="text-[#22E55E]">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us what your business does, any reference websites you like, or features you need..."
                  value={values.message}
                  onChange={(e) => setValues({ ...values, message: e.target.value })}
                  aria-invalid={Boolean(errors.message)}
                  className={inputClass}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              {/* Primary Submit & WhatsApp Alternative */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#050505] bg-brand-gradient hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_28px_rgba(0,229,255,0.28)] transition-all duration-150 disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Submitting...' : 'Book My Free Consultation'}
                  </span>
                </button>

                <a
                  href={getWhatsAppUrl()}
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
        </motion.div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. CONTACT SECTION (GLOWING ICON CARDS)                                    */
/* -------------------------------------------------------------------------- */
export const ContactSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="contact" className="py-18 sm:py-24 border-t border-white/8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl space-y-2.5"
        >
          <p className="text-xs font-semibold text-[#00E5FF]">Direct Contact</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Reach Out Directly—Call, WhatsApp, Email, or Instagram.
          </h2>
          <p className="text-sm sm:text-base text-[#A0A0A0]">
            Prefer speaking directly with us instead of filling out a form? Tap any option below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Primary Phone & WhatsApp Card */}
          <div className="p-6 rounded-2xl glass-surface glass-surface-hover flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#22E55E]/12 border border-[#22E55E]/30 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#22E55E]" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0]">Phone &amp; WhatsApp (Primary)</p>
                <a
                  href={`tel:${CONTACT_DETAILS.primaryPhoneTel}`}
                  className="block text-base sm:text-lg font-bold text-white hover:text-[#22E55E] transition-colors mt-1 tabular-nums"
                >
                  {CONTACT_DETAILS.primaryPhoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-white/8 text-xs font-semibold">
              <a
                href={`tel:${CONTACT_DETAILS.primaryPhoneTel}`}
                className="text-white hover:text-[#00E5FF] transition-colors"
              >
                Tap to Call
              </a>
              <span aria-hidden="true" className="text-white/25">·</span>
              <a
                href={getWhatsAppUrl(undefined, CONTACT_DETAILS.primaryWhatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#22E55E] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Secondary Phone & WhatsApp Card */}
          <div className="p-6 rounded-2xl glass-surface glass-surface-hover flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/12 border border-[#00E5FF]/30 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0]">Phone &amp; WhatsApp (Partner)</p>
                <a
                  href={`tel:${CONTACT_DETAILS.secondaryPhoneTel}`}
                  className="block text-base sm:text-lg font-bold text-white hover:text-[#00E5FF] transition-colors mt-1 tabular-nums"
                >
                  {CONTACT_DETAILS.secondaryPhoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-white/8 text-xs font-semibold">
              <a
                href={`tel:${CONTACT_DETAILS.secondaryPhoneTel}`}
                className="text-white hover:text-[#00E5FF] transition-colors"
              >
                Tap to Call
              </a>
              <span aria-hidden="true" className="text-white/25">·</span>
              <a
                href={getWhatsAppUrl(undefined, CONTACT_DETAILS.secondaryWhatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#22E55E] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Instagram Card */}
          <a
            href={CONTACT_DETAILS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl glass-surface glass-surface-hover flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#22E55E]/12 border border-[#22E55E]/30 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-[#22E55E]" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0]">Instagram</p>
                <p className="text-base sm:text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors mt-1">
                  {CONTACT_DETAILS.instagramHandle}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/8 text-xs font-semibold text-[#00E5FF] inline-flex items-center gap-1">
              <span>View Recent Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${CONTACT_DETAILS.email}`}
            className="p-6 rounded-2xl glass-surface glass-surface-hover flex flex-col justify-between gap-5 group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/12 border border-[#00E5FF]/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0]">Email Us</p>
                <p className="text-sm sm:text-base font-bold text-white group-hover:text-[#22E55E] transition-colors mt-1 break-all">
                  {CONTACT_DETAILS.email}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/8 text-xs font-semibold text-[#22E55E] inline-flex items-center gap-1">
              <span>Send an Email</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
