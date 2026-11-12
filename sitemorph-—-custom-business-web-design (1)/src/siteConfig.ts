/**
 * ============================================================================
 * SITEMORPH — CENTRALIZED EDITABLE WEBSITE CONTENT & CONFIGURATION
 * ============================================================================
 * All constants, team members, plans, comparison table rows, sample mockups,
 * design services packages, and contact details are centralized here.
 * ============================================================================
 */

// 1. BRAND & LOGO SETTINGS
export const BRAND_CONFIG = {
  name: 'SiteMorph',
  tagline: 'Professional • Reliable • Result Driven',
  taglineCaps: 'PROFESSIONAL • RELIABLE • RESULT DRIVEN',
  /**
   * Set customLogoImageUrl to an image path (e.g. '/images/logo.png') to use an image.
   * If left empty or fails to load, the site always renders the sharp inline SVG logo mark.
   */
  customLogoImageUrl: '',
  copyrightYear: 2026,
};

// 2. CONTACT & SOCIAL DETAILS
export const CONTACT_DETAILS = {
  primaryPhoneDisplay: '+91 8920192435',
  primaryPhoneTel: '+918920192435',
  primaryWhatsappNumber: '918920192435',
  secondaryPhoneDisplay: '+91 97178 18296',
  secondaryPhoneTel: '+919717818296',
  secondaryWhatsappNumber: '919717818296',
  email: 'sitemorph.web@gmail.com',
  instagramHandle: '@sitemorph_web',
  instagramUrl: 'https://instagram.com/sitemorph_web',
  whatsappPrefilledMessage:
    "Hi SiteMorph! I'm interested in getting a custom website built for my business. Can we discuss details?",
  whatsappDesignMessage:
    "Hi SiteMorph! I'm interested in your Design Services (logos, thumbnails, or ad graphics). Can we discuss details?",
};

export function getWhatsAppUrl(
  customMessage?: string,
  phone = CONTACT_DETAILS.primaryWhatsappNumber
): string {
  const msg = encodeURIComponent(customMessage || CONTACT_DETAILS.whatsappPrefilledMessage);
  return `https://wa.me/${phone}?text=${msg}`;
}

// ----------------------------------------------------------------------------
// 3. HERO: DEVICE MOCKUP CONCEPTS (4 CODE-DRAWN SITES)
// ----------------------------------------------------------------------------
export interface SampleSite {
  id: string;
  category: 'Cafe' | 'Coaching' | 'Shop' | 'Salon';
  label: string;
  name: string;
  domain: string;
  accentHex: string;
  accentBg: string;
  headline: string;
  buttonText: string;
  cards: [string, string, string];
  /**
   * HOW TO REPLACE CODE-DRAWN CONCEPTS WITH REAL SCREENSHOTS:
   * To display a real website screenshot instead of the code-drawn interface,
   * set `image` (e.g. '/images/cafe-desktop.jpg') and `mobileImage` (e.g. '/images/cafe-mobile.jpg').
   * If empty or if an image fails to load (onError), SiteMorph automatically
   * displays the code-drawn interactive concept with a "Concept design" badge.
   */
  image: string;
  mobileImage: string;
}

export const SAMPLE_SITES: SampleSite[] = [
  {
    id: 'cafe',
    category: 'Cafe',
    label: 'Cafe',
    name: 'Brew & Bean',
    domain: 'brewandbean.com',
    accentHex: '#F59E0B',
    accentBg: 'bg-amber-500',
    headline: 'Fresh coffee. Warm corners.',
    buttonText: 'Order Now',
    cards: ['Menu', 'Offers', 'Visit Us'],
    image: '',
    mobileImage: '',
  },
  {
    id: 'coaching',
    category: 'Coaching',
    label: 'Coaching',
    name: 'BrightPath Institute',
    domain: 'brightpath.in',
    accentHex: '#3B82F6',
    accentBg: 'bg-blue-500',
    headline: 'Results that speak.',
    buttonText: 'Book a Demo',
    cards: ['Courses', 'Faculty', 'Results'],
    image: '',
    mobileImage: '',
  },
  {
    id: 'shop',
    category: 'Shop',
    label: 'Shop',
    name: 'UrbanCart',
    domain: 'urbancart.com',
    accentHex: '#A855F7',
    accentBg: 'bg-purple-500',
    headline: 'New styles. Fast delivery.',
    buttonText: 'Shop Now',
    cards: ['New In', 'Offers', 'Track Order'],
    image: '',
    mobileImage: '',
  },
  {
    id: 'salon',
    category: 'Salon',
    label: 'Salon',
    name: 'Glow Studio',
    domain: 'glowstudio.in',
    accentHex: '#F43F5E',
    accentBg: 'bg-rose-500',
    headline: 'Look good. Feel great.',
    buttonText: 'Book a Slot',
    cards: ['Services', 'Gallery', 'Pricing'],
    image: '',
    mobileImage: '',
  },
];

// Hero chips under CTA buttons
export const HERO_CHIPS = ['1 Year Free Domain', '1 Year Support', '100% Responsive'] as const;

// ----------------------------------------------------------------------------
// 4. HERO: 3 COMPACT COUNTER CARDS
// ----------------------------------------------------------------------------
export interface HeroCounterCard {
  id: string;
  bigText: string;
  label: string;
  isNumericCounter?: boolean;
  numericTarget?: number;
  numericSuffix?: string;
}

export const HERO_COUNTERS: HeroCounterCard[] = [
  {
    id: 'delivering',
    bigText: 'Still Delivering',
    label: 'New websites launching every month',
  },
  {
    id: 'happy-clients',
    bigText: 'Happy Clients',
    label: 'Business owners who trust our work',
  },
  {
    id: 'dedicated-support',
    bigText: '1 Year',
    label: 'Dedicated Support Included',
    isNumericCounter: true,
    numericTarget: 1,
    numericSuffix: ' Year',
  },
];

// ----------------------------------------------------------------------------
// 5. WHAT YOU GET SECTION (REPLACES SERVICES & WHY CHOOSE US)
// ----------------------------------------------------------------------------
export interface WhatYouGetPin {
  number: number;
  title: string;
  shortTitle: string;
  iconName: 'layout' | 'globe' | 'smartphone' | 'messageCircle' | 'zap' | 'shieldCheck';
  pinPosition: {
    top: string;
    left: string;
  };
  side: 'left' | 'right';
}

export const WHAT_YOU_GET: WhatYouGetPin[] = [
  {
    number: 1,
    title: 'Custom design',
    shortTitle: 'Custom design',
    iconName: 'layout',
    pinPosition: { top: '38%', left: '38%' },
    side: 'left',
  },
  {
    number: 2,
    title: 'Free .com domain',
    shortTitle: 'Free .com domain',
    iconName: 'globe',
    pinPosition: { top: '8%', left: '48%' },
    side: 'left',
  },
  {
    number: 3,
    title: 'Mobile ready',
    shortTitle: 'Mobile ready',
    iconName: 'smartphone',
    pinPosition: { top: '74%', left: '26%' },
    side: 'left',
  },
  {
    number: 4,
    title: 'Enquiry + WhatsApp button',
    shortTitle: 'WhatsApp & Enquiry',
    iconName: 'messageCircle',
    pinPosition: { top: '56%', left: '74%' },
    side: 'right',
  },
  {
    number: 5,
    title: 'Fast loading',
    shortTitle: 'Fast loading',
    iconName: 'zap',
    pinPosition: { top: '24%', left: '78%' },
    side: 'right',
  },
  {
    number: 6,
    title: '1 year support',
    shortTitle: '1 year support',
    iconName: 'shieldCheck',
    pinPosition: { top: '84%', left: '80%' },
    side: 'right',
  },
];

// "We build:" chips
export const WE_BUILD_TYPES = [
  'Business',
  'Cafe and Restaurant',
  'E-commerce',
  'Landing Pages',
  'Portfolio',
] as const;

// 4-Step Process Line
export const PROCESS_STEPS = [
  { step: '01', title: 'Enquiry' },
  { step: '02', title: 'Design' },
  { step: '03', title: 'Build' },
  { step: '04', title: 'Launch' },
] as const;

// ----------------------------------------------------------------------------
// 6. ABOUT US & 4-MEMBER TEAM
// ----------------------------------------------------------------------------
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  initials: string;
  altText: string;
}

export const ABOUT_CONTENT = {
  heading: 'Web Designers Who Build for Real Business Growth.',
  // Desktop copy
  lines: [
    'SiteMorph is a dedicated web design and development team building fast, sharp, custom websites for growing businesses.',
    'We do not rely on bloated, cookie-cutter templates. Every layout is designed around what makes customers trust you and get in touch.',
    'From clean mobile responsiveness to fast page load speeds, we handle domain setup, launch, and a full year of post-launch support.',
  ],
  // Mobile compacted 3 short lines with bold key phrases
  mobileLines: [
    { text: 'Custom web design engineered to build trust and get enquiries.', bold: 'build trust and get enquiries.' },
    { text: 'Fast, mobile-first layouts with domain setup and zero cookie-cutter templates.', bold: 'zero cookie-cutter templates.' },
    { text: '1 full year of dedicated support and updates included with every build.', bold: '1 full year of dedicated support' },
  ],
};

export const TEAM: TeamMember[] = [
  {
    id: 'parth-jha',
    name: 'Parth Jha',
    role: 'Founder · Web Developer',
    bio: 'Builds fast, clean websites that work on every device and go live without problems.',
    imageSrc: '/images/parth-jha.jpg',
    initials: 'PJ',
    altText: 'Parth Jha – Founder and Web Developer at SiteMorph',
  },
  {
    id: 'adarsh-thakur',
    name: 'Adarsh Thakur',
    role: 'Co-Founder · Marketing',
    bio: 'Plans how your business gets seen online and turns visitors into enquiries.',
    imageSrc: '/images/adarsh-thakur.jpg',
    initials: 'AT',
    altText: 'Adarsh Thakur – Co-Founder and Marketing at SiteMorph',
  },
  {
    id: 'vinayak-parashar',
    name: 'Vinayak Parashar',
    role: 'Partner · Networking and Web Designer',
    bio: 'Connects us with businesses and designs layouts that look sharp and earn trust.',
    imageSrc: '/images/vinayak-parashar.jpg',
    initials: 'VP',
    altText: 'Vinayak Parashar – Partner, Networking and Web Designer at SiteMorph',
  },
  {
    id: 'dhruv-madan',
    name: 'Dhruv Madan',
    role: 'Partner · Marketing and Web Developer',
    bio: 'Combines marketing know-how with solid development to get your site found and working.',
    imageSrc: '/images/dhruv-madan.jpg',
    initials: 'DM',
    altText: 'Dhruv Madan – Partner, Marketing and Web Developer at SiteMorph',
  },
];

// ----------------------------------------------------------------------------
// 7. PRICING PLANS & COMPARISON TABLE
// ----------------------------------------------------------------------------
export type PlanName = 'Starter' | 'Business' | 'Premium';

export interface PricingPlan {
  id: string;
  name: PlanName;
  price: string;
  billingNote: string;
  bestFor: string;
  featured: boolean;
  highlightLabel?: string;
  deliveryEstimate: string;
  bullets: string[];
}

export const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹7,999',
    billingNote: 'One-time build · Placeholder price',
    bestFor: 'New local businesses',
    featured: false,
    deliveryEstimate: '5–7 Days Delivery',
    bullets: [
      '3 Custom Designed Pages',
      'Free .com / .in Domain (1 Year)',
      '1 Full Year Dedicated Support',
      '100% Mobile & Tablet Responsive',
      'Enquiry Form & WhatsApp Button',
      'Fast Loading & SSL Certificate',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹14,999',
    billingNote: 'One-time build · Placeholder price',
    bestFor: 'Growing businesses and cafes',
    featured: true,
    highlightLabel: 'Most Popular',
    deliveryEstimate: '7–12 Days Delivery',
    bullets: [
      '7 Custom Designed Pages',
      'Everything in Starter Included',
      'Custom Brand Styling & Animations',
      'Lead Capture Form & Google Maps',
      'Interactive Services / Menu Showcase',
      'Complete On-Page SEO Optimization',
      'Priority 7–12 Days Delivery',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹19,999',
    billingNote: 'One-time build · Placeholder price',
    bestFor: 'Stores and established brands',
    featured: false,
    deliveryEstimate: '12–18 Days Delivery',
    bullets: [
      '10+ Pages or Full Online Store',
      'Everything in Business Included',
      'Product Catalog, Cart & Payments',
      'Advanced Booking / Order Workflow',
      'Speed Optimization & Analytics Setup',
      'Custom Database & Lead Alerts',
      'Dedicated VIP Support & Revisions',
    ],
  },
];

export interface PlanComparisonRow {
  feature: string;
  starter: string | boolean;
  business: string | boolean;
  premium: string | boolean;
}

export const PLAN_COMPARISON: PlanComparisonRow[] = [
  {
    feature: 'Pages',
    starter: '3 Pages',
    business: '7 Pages',
    premium: '10+ or full storefront',
  },
  {
    feature: 'WhatsApp button & enquiry form',
    starter: true,
    business: true,
    premium: true,
  },
  {
    feature: 'Custom animations & brand styling',
    starter: false,
    business: true,
    premium: true,
  },
  {
    feature: 'Lead forms, Google Maps, social links',
    starter: false,
    business: true,
    premium: true,
  },
  {
    feature: 'Product catalog, cart & payments',
    starter: false,
    business: false,
    premium: true,
  },
  {
    feature: 'Booking or enquiry workflow',
    starter: false,
    business: false,
    premium: true,
  },
  {
    feature: 'SEO',
    starter: 'Basic',
    business: 'Complete',
    premium: 'Advanced + analytics',
  },
  {
    feature: 'Support level',
    starter: 'Standard',
    business: 'Priority',
    premium: 'Priority + updates',
  },
  {
    feature: 'Delivery',
    starter: '5–7 days',
    business: '7–12 days',
    premium: '12–18 days',
  },
];

// Universal banner included in every plan
export const PLAN_UNIVERSAL_BANNER =
  'In every plan: free .com domain for 1 year · 1 year support · fully responsive.';

// ----------------------------------------------------------------------------
// 8. ENQUIRY FORM OPTIONS
// ----------------------------------------------------------------------------
export const WEBSITE_TYPE_OPTIONS = [
  'Business',
  'Cafe and Restaurant',
  'Portfolio',
  'E-commerce',
  'Landing Pages',
  'Other',
] as const;

export const PREFERRED_PLAN_OPTIONS = ['Starter', 'Business', 'Premium', 'Not sure'] as const;

// ----------------------------------------------------------------------------
// 9. MAIN SINGLE-PAGE NAVBAR SECTIONS (Order: Home, What You Get, About, Plans, Contact)
// ----------------------------------------------------------------------------
export interface NavSectionItem {
  id: string;
  label: string;
  href: string;
}

export const MAIN_NAV_SECTIONS: NavSectionItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'services', label: 'What You Get', href: '#services' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'plans', label: 'Plans', href: '#plans' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

// ----------------------------------------------------------------------------
// 10. DESIGN SERVICES PAGE CONFIGURATION & DATA CONSTANTS
// ----------------------------------------------------------------------------
export interface DesignCapabilityItem {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  iconName:
    | 'sparkles'
    | 'video'
    | 'instagram'
    | 'film'
    | 'layers'
    | 'creditCard'
    | 'palette'
    | 'share2';
}

export const DESIGN_CAPABILITIES: DesignCapabilityItem[] = [
  {
    id: 'logo-design',
    title: 'Logo Design',
    shortLabel: 'Logo Design',
    description: 'Distinctive, vector-crisp brand marks that establish instant credibility.',
    iconName: 'sparkles',
  },
  {
    id: 'youtube-thumbnails',
    title: 'YouTube Thumbnails',
    shortLabel: 'YouTube Thumbnails',
    description: 'High-CTR custom video thumbnails engineered to stop the scroll.',
    iconName: 'video',
  },
  {
    id: 'social-posts',
    title: 'Instagram & Facebook Posts',
    shortLabel: 'Social Posts',
    description: 'Cohesive, on-brand feeds, carousels, and promotional graphics.',
    iconName: 'instagram',
  },
  {
    id: 'reel-story-covers',
    title: 'Reel & Story Covers',
    shortLabel: 'Reel Covers',
    description: 'Punchy vertical cover artwork that keeps your profile grid organized.',
    iconName: 'film',
  },
  {
    id: 'ad-banners',
    title: 'Ad Banners & Posters',
    shortLabel: 'Ad Banners',
    description: 'Performance-driven advertising banners for Meta, Google, and event print.',
    iconName: 'layers',
  },
  {
    id: 'cards-flyers-menus',
    title: 'Cards, Flyers & Menus',
    shortLabel: 'Cards & Menus',
    description: 'Print-ready vector stationery, modern product flyers, and restaurant menus.',
    iconName: 'creditCard',
  },
  {
    id: 'brand-kit',
    title: 'Brand Kit (Logo, Colors, Fonts)',
    shortLabel: 'Brand Kit',
    description: 'Curated color palettes, typography pairings, and complete brand guidelines.',
    iconName: 'palette',
  },
  {
    id: 'profile-covers',
    title: 'Google & Social Covers',
    shortLabel: 'Profile Covers',
    description: 'Sized and optimized banners for Google Maps, LinkedIn, X, and Facebook.',
    iconName: 'share2',
  },
];

export interface DesignPackage {
  id: string;
  name: string;
  price: string;
  subtitle: string;
  featured: boolean;
  highlightLabel?: string;
  deliveryTime: string;
  bullets: string[];
}

export const DESIGN_PACKAGES: DesignPackage[] = [
  {
    id: 'logo-pack',
    name: 'Logo Pack',
    price: 'Starting from ₹999',
    subtitle: 'Everything required to launch your brand logo with clean vectors.',
    featured: false,
    deliveryTime: '2–3 Days Turnaround',
    bullets: [
      '3 Distinct Logo Concepts to Choose From',
      'All Formats (PNG, JPG, SVG & Vector PDF)',
      'Transparent Background Variations',
      'Light & Dark Theme Adaptations',
      '2 Rounds of Revisions Included',
      'Full Commercial Copyright Ownership',
    ],
  },
  {
    id: 'social-media-pack',
    name: 'Social Media Pack',
    price: 'Starting from ₹1,999',
    subtitle: 'Curated monthly content and thumbnail assets built to increase audience engagement.',
    featured: true,
    highlightLabel: 'Most Popular',
    deliveryTime: '3–5 Days Turnaround',
    bullets: [
      'Up to 10 Custom Post or Carousel Graphics',
      '5 High-CTR YouTube Thumbnails or Reel Covers',
      'Branded Story Templates for Daily Updates',
      'Optimized for Instagram, Facebook & LinkedIn',
      'Editable Canva / Figma Source Templates',
      '2 Rounds of Revisions Per Asset',
    ],
  },
  {
    id: 'complete-brand-kit',
    name: 'Complete Brand Kit',
    price: 'Starting from ₹2,999',
    subtitle: 'The full corporate identity suite covering logos, stationery, ads, and digital covers.',
    featured: false,
    deliveryTime: '5–7 Days Turnaround',
    bullets: [
      'Primary Logo, Secondary Mark & Favicon',
      'Complete Typography Pairing & Color Palette Guide',
      'Print-Ready Business Card & Letterhead Stationery',
      'Social Profile & Google Business Cover Banners',
      '3 High-Converting Ad Banner Graphics',
      'Lifetime Vector Assets + Brand Style Guide PDF',
    ],
  },
];

export interface DesignSample {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  aspectClass: string;
  altText: string;
}

export const DESIGN_SAMPLES: DesignSample[] = [
  {
    id: 'sample-logo-aurora',
    title: 'Aurora Modern Architectural Logo',
    category: 'Logo Design',
    imageSrc: '/images/sample-logo.jpg',
    aspectClass: 'aspect-[4/3]',
    altText: 'Minimalist luxury geometric logo presentation on dark obsidian matte background',
  },
  {
    id: 'sample-thumbnail-creator',
    title: 'High-CTR YouTube Tech Video Thumbnail',
    category: 'YouTube Thumbnail',
    imageSrc: '/images/sample-thumbnail.jpg',
    aspectClass: 'aspect-[16/9]',
    altText: 'Punchy high-contrast YouTube video thumbnail graphic design with bold neon typography',
  },
  {
    id: 'sample-banner-audio',
    title: 'Immersive Audio Display Ad Banner',
    category: 'Ad Banner',
    imageSrc: '/images/sample-ad-banner.jpg',
    aspectClass: 'aspect-[4/3]',
    altText: 'Commercial digital display ad banner mockup with neon lighting on dark slate',
  },
  {
    id: 'sample-brand-kit-aurelia',
    title: 'Aurelia Editorial Brand Identity Kit',
    category: 'Brand Kit',
    imageSrc: '/images/sample-brand-kit.jpg',
    aspectClass: 'aspect-[4/3]',
    altText: 'Complete brand identity kit showcase mockup with stationery and color swatches',
  },
  {
    id: 'sample-cafe-menu',
    title: 'Artisan Roasthouse Dine-In & QR Menu Card',
    category: 'Print & Menu',
    imageSrc: '/images/sample-logo.jpg',
    aspectClass: 'aspect-[4/3]',
    altText: 'Modern specialty cafe vector print menu card and table tent design',
  },
  {
    id: 'sample-social-carousel',
    title: 'Growth Advisory Carousel & Story Pack',
    category: 'Social Media',
    imageSrc: '/images/sample-ad-banner.jpg',
    aspectClass: 'aspect-[4/3]',
    altText: 'Clean multi-slide Instagram carousel design with neon accents on dark background',
  },
];

export const DESIGN_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Brief',
    description: 'Tell us about your brand, preferred visual style, target audience, and design requirements.',
  },
  {
    step: '02',
    title: 'Concept',
    description: 'We create original, high-fidelity draft concepts for your review within 48 to 72 hours.',
  },
  {
    step: '03',
    title: 'Revisions',
    description: 'We refine colors, typography, layout, or copy based on your direct feedback.',
  },
  {
    step: '04',
    title: 'Final Files',
    description: 'You receive all high-res master files, print-ready vectors, and editable templates.',
  },
] as const;

export interface DesignFaqItem {
  question: string;
  answer: string;
}

export const DESIGN_FAQ: DesignFaqItem[] = [
  {
    question: 'How fast will I receive the first draft concepts?',
    answer:
      'First concepts for logos and thumbnails are typically delivered within 48 to 72 hours. Complete brand kits take 4 to 6 business days.',
  },
  {
    question: 'How many revisions can I request?',
    answer:
      'All packages include 2 to 3 rounds of focused revisions. We adjust colors, fonts, sizing, and details until you are completely satisfied.',
  },
  {
    question: 'What file formats will you deliver?',
    answer:
      'You receive vector master files (SVG, EPS, PDF) for unlimited crisp scaling, high-res web PNG/JPG files (including transparent backgrounds), and editable Canva/Figma links when requested.',
  },
  {
    question: 'Who owns the final design once the project is finished?',
    answer:
      'You own 100% of the commercial rights upon final delivery and payment. You can trademark, print, or use the designs anywhere without royalties.',
  },
];

export const DESIGN_NEEDED_OPTIONS = [
  'Logo',
  'YouTube Thumbnail',
  'Social Media Posts',
  'Ad Banner / Poster',
  'Business Card / Flyer',
  'Brand Kit',
  'Other',
] as const;

export const DESIGN_PACKAGE_OPTIONS = [
  'Logo Pack',
  'Social Media Pack',
  'Complete Brand Kit',
  'Not sure',
] as const;
