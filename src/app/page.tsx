'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Card,
  Badge,
  Icons,
} from '@/components/ui';
import { PRICING } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { CookieSettingsButton } from '@/components/CookieConsent';

const {
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Eye,
  Globe,
  FileText,
  Briefcase,
  Download,
  Lock,
  Crown,
  Zap,
  ChevronUp,
  ChevronDown,
} = Icons;

// ============================================
// ANIMATED CAROUSEL DATA - Riktiga templates med iframes
// ============================================

const CAROUSEL_ITEMS = [
  // Portfolio 1 - Mörk med röd accent
  {
    type: 'portfolio' as const,
    templateId: 'dark-ember',
    profile: 'alex',
    label: 'Dark Ember',
    color: '#ef4444', // Red
  },
  // CV 1 - Elegant Gold
  {
    type: 'cv' as const,
    templateId: 'midnight-gold',
    profile: 'erik',
    label: 'Midnight Gold',
    color: '#d4a553', // Gold
  },
  // Portfolio 2 - Teal/Ocean
  {
    type: 'portfolio' as const,
    templateId: 'ocean-teal',
    profile: 'maya',
    label: 'Ocean Teal',
    color: '#14b8a6', // Teal
  },
  // CV 2 - Forest Earth (Grön)
  {
    type: 'cv' as const,
    templateId: 'forest-earth',
    profile: 'sofia',
    label: 'Forest Earth',
    color: '#22c55e', // Green
  },
];

// ============================================
// ANIMATED LIVE PREVIEW CARD COMPONENT
// ============================================

function AnimatedLivePreviewCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate through carousel items
  useEffect(() => {
    const interval = setInterval(() => {
      // Start exit animation
      setIsVisible(false);

      // After exit animation, change item and show entry
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
        setIsVisible(true);
      }, 500); // Match exit animation duration
    }, 3500); // 3s visible + 0.5s for animation

    return () => clearInterval(interval);
  }, []);

  const currentItem = CAROUSEL_ITEMS[currentIndex];
  const isPortfolio = currentItem.type === 'portfolio';

  // Build iframe URL
  const iframeUrl = isPortfolio
    ? `/api/portfolio-preview?template=${currentItem.templateId}&profile=${currentItem.profile}`
    : `/api/cv-preview?template=${currentItem.templateId}&profile=${currentItem.profile}`;

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-white/60 blur-2xl rounded-3xl" />
      <Card className="relative bg-white border-slate-200 shadow-2xl overflow-hidden">
        {/* Header - Browser-style */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <Badge variant="primary" className="gap-1 ml-2">
              <Sparkles className="h-3 w-3" />
              Live preview
            </Badge>
          </div>
          <span className="text-sm font-medium text-slate-600">
            {currentItem.label}
          </span>
        </div>

        {/* Animated Template Preview */}
        <div className="relative h-[340px] overflow-hidden bg-slate-100">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentIndex}
                initial={{
                  opacity: 0,
                  x: 150,
                  rotateY: -25,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  rotateY: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: -200,
                  rotateY: 25,
                  scale: 0.85,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute inset-0 flex items-start justify-center"
                style={{ perspective: '1200px' }}
              >
                {isPortfolio ? (
                  // Portfolio Preview - Full width, top-aligned
                  <div className="relative w-full h-full overflow-hidden">
                    <div
                      className="absolute left-1/2"
                      style={{
                        width: '1440px',
                        height: '900px',
                        transform: 'translateX(-50%) scale(0.36)',
                        transformOrigin: 'top center',
                      }}
                    >
                      <iframe
                        src={iframeUrl}
                        style={{
                          border: 'none',
                          width: '1440px',
                          height: '900px',
                          backgroundColor: '#0a0a0a',
                        }}
                        className="pointer-events-none"
                      />
                    </div>
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  // CV Preview - Centered A4 document
                  <div className="relative w-full h-full flex justify-center overflow-hidden">
                    <div
                      className="absolute shadow-2xl rounded-sm overflow-hidden"
                      style={{
                        width: '794px',
                        height: '1123px',
                        transform: 'scale(0.38)',
                        transformOrigin: 'top center',
                        top: '16px',
                      }}
                    >
                      <iframe
                        src={iframeUrl}
                        style={{
                          border: 'none',
                          width: '794px',
                          height: '1123px',
                        }}
                        className="pointer-events-none"
                      />
                    </div>
                    {/* Subtle fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-100/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Dots & Type Badge */}
        <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-slate-100">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {CAROUSEL_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 hover:opacity-80 ${index === currentIndex ? 'w-6' : 'w-2 bg-slate-200'
                  }`}
                style={{
                  backgroundColor: index === currentIndex ? item.color : undefined,
                }}
              />
            ))}
          </div>

          {/* Type Badge */}
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium"
            style={{ borderColor: currentItem.color, color: currentItem.color }}
          >
            {isPortfolio ? (
              <><Globe className="h-2.5 w-2.5" /> Portfolio</>
            ) : (
              <><FileText className="h-2.5 w-2.5" /> CV</>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Portfolio sections med scroll-positioner (pixlar i iframe-dokumentet)
// Med previewMode: Hero=700px, sektioner behöver större offset
const PORTFOLIO_SECTIONS = [
  { name: 'Hero', offset: 0 },
  { name: 'Om mig', offset: 700 },       // Efter hero (700px)
  { name: 'Projekt', offset: 1700 },     // About - ökat
  { name: 'Tidslinje', offset: 2950 },   // Projects - ökat kraftigt
  { name: 'Tech Stack', offset: 4550 },  // Timeline - ökat kraftigt
  { name: 'Kontakt', offset: 5800 },     // Stack - ökat kraftigt
];

// Portfolio Preview Card med navigering
function PortfolioPreviewCard({ template }: { template: { id: string; title: string; label: string; profile?: string } }) {
  const [currentSection, setCurrentSection] = useState(0);

  const goUp = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const goDown = () => {
    if (currentSection < PORTFOLIO_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  // Beräkna offset för nuvarande sektion
  const currentOffset = PORTFOLIO_SECTIONS[currentSection].offset;
  const profileParam = template.profile ? `&profile=${template.profile}` : '';

  return (
    <Card className="overflow-hidden bg-white group" hover>
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
        {/*
          Portfolio preview med scroll-navigering:
          - Iframe: 1200x8000px (rymmer hela portfolion)
          - Scale 0.25 för att passa i kortet
          - TranslateY scrollar till olika sektioner
        */}
        <div
          className="absolute origin-top-left transition-transform duration-500 ease-out"
          style={{
            width: '1200px',
            height: '8000px',
            transform: `scale(0.25) translateY(-${currentOffset}px)`
          }}
        >
          <iframe
            src={`/api/portfolio-preview?template=${template.id}${profileParam}`}
            style={{
              border: 'none',
              width: '1200px',
              height: '8000px'
            }}
            className="pointer-events-none"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Navigation arrows */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
          <button
            onClick={goUp}
            disabled={currentSection === 0}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Föregående sektion"
          >
            <ChevronUp className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={goDown}
            disabled={currentSection === PORTFOLIO_SECTIONS.length - 1}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Nästa sektion"
          >
            <ChevronDown className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Section indicator */}
        <div className="absolute left-2 bottom-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white/90 font-medium">
          {PORTFOLIO_SECTIONS[currentSection].name}
        </div>
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink">{template.title}</p>
        <p className="text-xs text-slate-500">{template.label}</p>
      </div>
    </Card>
  );
}

const HIGHLIGHTS = [
  { label: 'Live på', value: '20 sek', description: 'Från publicera till din egen URL' },
  { label: 'Hosting', value: '24/7', description: 'Vi sköter allt, dygnet runt' },
  { label: 'Templates', value: '40+', description: 'Portfolio + CV i samma DNA' },
  { label: 'Support', value: 'Människor', description: 'Direkt, tydligt, tryggt' },
];

const PROCESS = [
  {
    title: 'Skicka underlag',
    description: 'Vi hämtar det du redan har – LinkedIn, CV eller GitHub – och bygger en struktur som säljer.',
  },
  {
    title: 'Design med riktning',
    description: 'Du väljer uttryck. Vi formar en portfolio och ett CV som känns seniora från dag ett.',
  },
  {
    title: 'Finjustera snabbt',
    description: 'Korta iterationer. Ändra, godkänn, gå vidare. Ingen teknisk friktion.',
  },
  {
    title: 'Publicera & dela',
    description: 'Klar inom timmar. Redo att dela på portfolyo.se/{username}.',
  },
];

const PILLARS = [
  {
    icon: <Globe className="h-5 w-5" />,
    title: 'Din sida, live på 20 sekunder',
    description: 'Publicera och dela direkt. Vi hostar din portfolio dygnet runt på portfolyo.se/{username}.',
    bullets: ['Live hosting 24/7', '20 sek till publicerad', 'Egen personlig URL'],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Från simpelt CV till wow-faktor',
    description: 'Vi transformerar ditt innehåll till ett professionellt CV som imponerar vid första ögonkastet.',
    bullets: ['ATS-kompatibel PDF', 'Inkludera i portfolion', 'Exportera & dela'],
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: 'Premium-nivå för alla',
    description: 'Oavsett bakgrund eller inriktning – du får samma seniora, professionella intryck som etablerade profiler.',
    bullets: ['Resultatfokuserat', 'Tydlig struktur', 'Samma nivå för alla'],
  },
];

const FAQS = [
  {
    question: 'Hur snabbt är min sida live?',
    answer: '20 sekunder från att du klickar publicera. Vi hostar den dygnet runt på portfolyo.se/{ditt-namn}.',
  },
  {
    question: 'Vad ingår i engångsavgiften?',
    answer: 'Publicering, hosting för alltid och 1 CV-generering. Du betalar aldrig mer om du inte vill göra ändringar.',
  },
  {
    question: 'Hur fungerar credits?',
    answer: '1 credit = ändring på CV, 2 credits = nytt CV eller ändring på portfolio, 4 credits = ny portfolio. En credit kostar 14,99 kr.',
  },
  {
    question: 'Kan jag inkludera CV i min portfolio?',
    answer: 'Ja! Ditt CV kan visas som en del av portfolion och laddas ner som PDF av besökare.',
  },
  {
    question: 'Passar det även om jag inte är teknisk?',
    answer: 'Absolut. Vi gör allt det tekniska. Du får ett professionellt resultat oavsett bakgrund.',
  },
  {
    question: 'Vem sköter supporten?',
    answer: 'Människor. Direkt, tydligt och tryggt. Ingen chattbot, ingen väntetid i dagar.',
  },
];

export default function LandingPage() {
  const router = useRouter();

  // Check auth in background - NEVER block page render
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace('/dashboard');
      }
    }).catch(() => {
      // Ignore errors - just show landing page
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">PORTFOLYO</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#product" className="hover:text-slate-900">Produkt</a>
              <a href="#templates" className="hover:text-slate-900">Templates</a>
              <a href="#process" className="hover:text-slate-900">Process</a>
              <a href="#pricing" className="hover:text-slate-900">Priser</a>
              <a href="#faq" className="hover:text-slate-900">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Logga in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Starta nu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-aurora">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6">49 kr engång – hostat för alltid</Badge>
              <h1 className="text-4xl md:text-6xl font-semibold text-ink mb-6">
                Från simpelt CV till wow-faktor på 20 sekunder.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl">
                Skicka ditt underlag. Vi transformerar det till en professionell portfolio och CV som imponerar vid första ögonkastet.
                Live på din egen URL direkt.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Publicera för 49 kr
                  </Button>
                </Link>
                <a href="#templates">
                  <Button variant="secondary" size="lg" leftIcon={<Eye className="h-5 w-5" />}>
                    Se templates
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Live hosting 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>CV ingår i portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>PDF redo att skicka</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <AnimatedLivePreviewCard />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            {HIGHLIGHTS.map((item) => (
              <Card key={item.label} className="p-5 bg-white/70 border-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="text-2xl font-semibold text-ink mt-2">{item.value}</p>
                <p className="text-sm text-slate-600 mt-1">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product */}
      <section id="product" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Det du faktiskt behöver</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4">
              Ett komplett paket för en professionell närvaro
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Inget överflöd. Bara det som gör dig tydlig, trovärdig och lätt att säga ja till.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <Card key={pillar.title} className="p-6" hover>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{pillar.description}</p>
                <ul className="space-y-2">
                  {pillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <Badge variant="outline" className="mb-4">Templates</Badge>
              <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-3">
                44 portfolio + 42 CV — ett och samma DNA
              </h2>
              <p className="text-slate-600 max-w-xl">
                Varje template är unik, men alla känns premium. Inget generiskt. Ingen Canva-känsla.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="gap-1"><Crown className="h-3 w-3" /> Pro-teman</Badge>
              <Badge variant="outline" className="gap-1"><Zap className="h-3 w-3" /> Snabb leverans</Badge>
            </div>
          </div>

          {/* Portfolio Templates - with scroll animation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" /> Portfolio Templates
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { id: 'said-dark', title: 'Alex Lindqvist', label: 'Full Stack Developer', profile: 'alex' },
                { id: 'flag-sweden', title: 'Maya Eriksson', label: 'UX/UI Designer', profile: 'maya' },
                { id: 'flag-magenta', title: 'Omar Johansson', label: 'ML Engineer', profile: 'omar' },
              ].map((template) => (
                <PortfolioPreviewCard key={template.id} template={template} />
              ))}
            </div>
          </div>

          {/* CV Templates - static preview, no click */}
          <div>
            <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" /> CV Templates
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { id: 'said-dark', title: 'Sofia Andersson', label: 'Cloud Architect', profile: 'sofia' },
                { id: 'flag-emerald', title: 'Erik Nilsson', label: 'Security Engineer', profile: 'erik' },
                { id: 'flag-turquoise', title: 'Lin Bergström', label: 'Frontend Specialist', profile: 'lin' },
              ].map((template) => (
                <Card key={template.id} className="overflow-hidden bg-white" hover>
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                    <iframe
                      src={`/api/cv-preview?template=${template.id}&profile=${template.profile}`}
                      className="absolute inset-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                      style={{ border: 'none' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-ink">{template.title}</p>
                    <p className="text-xs text-slate-500">{template.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4">
              Det känns som concierge, inte verktyg
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Du lägger 20 minuter. Vi gör resten. Resultatet känns som ett beställt premiumarbete.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PROCESS.map((step, index) => (
              <Card key={step.title} className="p-6 bg-white" hover>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Enkel prissättning</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4">
              Betala en gång. Hostat för alltid.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Ingen prenumeration. Ingen dolda kostnader. Du betalar bara när du vill göra ändringar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Engångsavgift */}
            <Card className="p-8 border-2 border-slate-900 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="primary" className="gap-1"><Star className="h-3 w-3" /> Allt du behöver</Badge>
              </div>
              <div className="mb-2">
                <div className="text-5xl font-semibold text-ink">{PRICING.oneTime.price} kr</div>
                <p className="text-sm text-slate-500 mt-1">engångsavgift</p>
              </div>
              <p className="text-slate-600 text-sm mb-6">{PRICING.oneTime.description}</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {PRICING.oneTime.includes.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full" size="lg">
                  Publicera nu
                </Button>
              </Link>
            </Card>

            {/* Credits */}
            <Card className="p-8 bg-slate-50">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-ink mb-2">Credits för ändringar</h3>
                <p className="text-sm text-slate-600">{PRICING.credits.description}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {PRICING.credits.tiers.map((tier) => (
                  <div key={tier.label} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-sm text-slate-700">{tier.label}</span>
                    <Badge variant="outline">{tier.credits} {tier.credits === 1 ? 'credit' : 'credits'}</Badge>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-6">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Credit-paket</p>
                <div className="space-y-2">
                  {PRICING.credits.bundles.map((bundle) => (
                    <div key={bundle.credits} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{bundle.credits} credits</span>
                      <span className="font-medium text-ink">{bundle.price} kr <span className="text-emerald-600 text-xs">({bundle.savings} rabatt)</span></span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">Eller köp enstaka: {PRICING.credits.pricePerCredit} kr/credit</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4">
              Vanliga frågor, raka svar
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FAQS.map((item) => (
              <Card key={item.question} className="p-6">
                <h3 className="text-base font-semibold text-ink mb-2">{item.question}</h3>
                <p className="text-sm text-slate-600">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 bg-ink text-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="bg-white/10 text-white mb-4">49 kr. Live på 20 sek.</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Redo att göra intryck?
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto mb-8">
            Publicera din portfolio och ditt CV idag. Vi sköter hosting, design och teknik — du delar bara länken.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Publicera nu för 49 kr
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-2xl tracking-tight">PORTFOLYO</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                Premium portfolio- och CV-builder för människor som vill göra intryck. 
                Publicera på 20 sekunder — vi sköter resten.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/S-Borna" target="_blank" rel="noopener" 
                   className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com/in/saidborna" target="_blank" rel="noopener"
                   className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Produkt */}
            <div>
              <h4 className="font-semibold text-white mb-4">Produkt</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#product" className="hover:text-white transition-colors">Funktioner</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Priser</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Resurser */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resurser</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="https://sql.saidborna.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">SQL Arena</a></li>
                <li><a href="https://www.ginonova.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">GinoNova</a></li>
                <li><a href="https://saidborna.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">saidborna.com</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Allmänna villkor</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Integritetspolicy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie-policy</Link></li>
                <li><CookieSettingsButton className="text-sm text-slate-400" /></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="text-sm text-slate-500 text-center md:text-left">
                <p>© {new Date().getFullYear()} Portfolyo. Alla rättigheter förbehållna.</p>
                <p className="mt-1">Org.nr: 559XXX-XXXX • Sverige</p>
              </div>

              {/* Built by */}
              <div className="flex flex-col items-center md:items-end gap-1">
                <p className="text-sm text-slate-400">
                  Built & Designed by{' '}
                  <a href="https://saidborna.com" target="_blank" rel="noopener" 
                     className="text-white font-medium hover:text-slate-300 transition-colors">
                    Said Borna
                  </a>
                </p>
                <p className="text-xs text-slate-500">
                  <a href="mailto:said@saidborna.com" className="hover:text-slate-400 transition-colors">
                    said@saidborna.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
