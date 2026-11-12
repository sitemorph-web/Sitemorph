import React from 'react';
import { Phone, Mail, Instagram, MessageCircle, Sparkles } from 'lucide-react';
import {
  BRAND_CONFIG,
  CONTACT_DETAILS,
  MAIN_NAV_SECTIONS,
  getWhatsAppUrl,
} from '../siteConfig';
import { SiteMorphLogo } from './SiteMorphLogo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onGoToDesignServices: () => void;
  onGetWebsiteClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onGoToDesignServices,
  onGetWebsiteClick,
}) => {
  return (
    <footer className="relative bg-[#050505] border-t border-white/10 pt-16 pb-24 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('home');
              }}
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-lg"
            >
              <SiteMorphLogo size="md" />
            </a>
            <p className="text-sm font-medium text-white/90 tracking-wide">
              {BRAND_CONFIG.tagline}
            </p>
            <p className="text-sm text-[#A0A0A0] max-w-sm leading-relaxed">
              Custom websites built around your business and focused on real customer enquiries. Every package includes a free .com domain and 1 year of support.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-10 h-10 rounded-xl glass-surface glass-surface-hover flex items-center justify-center text-white hover:text-[#22E55E]"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_DETAILS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow SiteMorph on Instagram"
                className="w-10 h-10 rounded-xl glass-surface glass-surface-hover flex items-center justify-center text-white hover:text-[#00E5FF]"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                aria-label="Email SiteMorph"
                className="w-10 h-10 rounded-xl glass-surface glass-surface-hover flex items-center justify-center text-white hover:text-[#00E5FF]"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column (Our Work removed, Design Services added) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
              {MAIN_NAV_SECTIONS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateSection(item.id);
                    }}
                    className="text-sm text-[#A0A0A0] hover:text-white transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onGoToDesignServices}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00E5FF] hover:text-[#22E55E] transition-colors duration-150 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#22E55E]" />
                  <span>Design Services</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onGetWebsiteClick}
                  className="text-sm font-medium text-[#22E55E] hover:text-[#00E5FF] transition-colors duration-150 cursor-pointer"
                >
                  Book Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Contact Details</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${CONTACT_DETAILS.primaryPhoneTel}`}
                  className="inline-flex items-center gap-2.5 text-[#A0A0A0] hover:text-white transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#22E55E] shrink-0" />
                  <span>{CONTACT_DETAILS.primaryPhoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_DETAILS.secondaryPhoneTel}`}
                  className="inline-flex items-center gap-2.5 text-[#A0A0A0] hover:text-white transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <span>{CONTACT_DETAILS.secondaryPhoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_DETAILS.email}`}
                  className="inline-flex items-center gap-2.5 text-[#A0A0A0] hover:text-white transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <span>{CONTACT_DETAILS.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_DETAILS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#A0A0A0] hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#22E55E] shrink-0" />
                  <span>{CONTACT_DETAILS.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A0A0A0]">
          <p>© {BRAND_CONFIG.copyrightYear} {BRAND_CONFIG.name}. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Designed &amp; developed by Parth Jha, Adarsh Thakur, Vinayak Parashar &amp; Dhruv Madan
          </p>
        </div>
      </div>
    </footer>
  );
};
