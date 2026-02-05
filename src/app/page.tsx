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
    templateId: 'said-dark',
    profile: 'alex',
    label: 'Said Dark',
    color: '#ef4444', // Red
  },
  // CV 1 - Elegant Gold (Tobacco Vanille)
  {
    type: 'cv' as const,
    templateId: 'tf-tobacco-vanille',
    profile: 'erik',
    label: 'Tobacco Vanille',
    color: '#d4a553', // Gold
  },
  // Portfolio 2 - Teal/Ocean
  {
    type: 'portfolio' as const,
    templateId: 'nature-ocean',
    profile: 'maya',
    label: 'Nature Ocean',
    color: '#0ea5e9', // Sky blue
  },
  // CV 2 - Nature Sage (Grön)
  {
    type: 'cv' as const,
    templateId: 'nature-sage',
    profile: 'sofia',
    label: 'Nature Sage',
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
    }, 3000); // 2.5s visible + 0.5s for animation

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
      <Card className="relative bg-white border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-0">
          <Badge variant="primary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Live preview
          </Badge>
          <span className="text-xs text-slate-500">
            {currentItem.label}
          </span>
        </div>

        {/* Animated Template Preview */}
        <div className="relative h-[280px] mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentIndex}
                initial={{
                  opacity: 0,
                  x: 150,
                  rotateY: -30,
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
                  rotateY: 30,
                  scale: 0.85,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute inset-0"
                style={{ perspective: '1200px' }}
              >
                {isPortfolio ? (
                  // Portfolio Preview - Scaled iframe
                  <div className="relative w-full h-full bg-slate-900 rounded-t-xl overflow-hidden">
                    <div
                      className="absolute origin-top-left"
                      style={{
                        width: '1200px',
                        height: '2400px',
                        transform: 'scale(0.28)',
                        transformOrigin: 'top left',
                      }}
                    >
                      <iframe
                        src={iframeUrl}
                        style={{
                          border: 'none',
                          width: '1200px',
                          height: '2400px',
                        }}
                        className="pointer-events-none"
                      />
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  // CV Preview - Scaled iframe with sidebar layout
                  <div className="relative w-full h-full bg-white rounded-t-xl overflow-hidden border-t border-x border-slate-100">
                    <div
                      className="absolute origin-top-left"
                      style={{
                        width: '800px',
                        height: '1130px',
                        transform: 'scale(0.42)',
                        transformOrigin: 'top left',
                      }}
                    >
                      <iframe
                        src={iframeUrl}
                        style={{
                          border: 'none',
                          width: '800px',
                          height: '1130px',
                        }}
                        className="pointer-events-none"
                      />
                    </div>
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Dots & Type Badge */}
        <div className="p-4 pt-3 flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {CAROUSEL_ITEMS.map((item, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6' : 'w-2 bg-slate-200'
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
  { label: 'Portfolio', value: '1', description: 'Hostad på portfolyo.se/{username}' },
  { label: 'CV', value: '2', description: 'PDF + webbaserad version' },
  { label: 'Templates', value: '70+', description: '20 portfolio + 50 CV' },
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
    title: 'Portfolio som känns ny, varje dag',
    description: 'Vi hostar, optimerar och håller din sida skarp. Alltid snabb, alltid tillgänglig.',
    bullets: ['Egen subdomän', 'Snabb laddning', 'Trygg drift'],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'CV som rekryterare litar på',
    description: 'ATS-kompatibel, professionellt formaterad och redo för PDF eller webblänk.',
    bullets: ['ATS-klar', 'PDF + webblänk', 'Konservativt modernt'],
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: 'En helhetsbild av din kompetens',
    description: 'Projekt, resultat och storytelling som gör dig lätt att säga ja till.',
    bullets: ['Resultatfokuserat', 'Tydlig struktur', 'Anpassat för målrollen'],
  },
];

const FAQS = [
  {
    question: 'Kan jag använda mitt eget innehåll?',
    answer: 'Ja. Vi använder det du redan har och förbättrar det – inget behöver börja från noll.',
  },
  {
    question: 'Hur snabbt kan jag vara live?',
    answer: 'De flesta går live samma dag. Vi prioriterar snabb leverans med kvalitet.',
  },
  {
    question: 'Ingår hosting och uppdateringar?',
    answer: 'All hosting ingår. Du uppdaterar när du vill, vi hanterar tekniken.',
  },
  {
    question: 'Passar det här även seniora profiler?',
    answer: 'Ja. Ton, estetik och struktur är byggda för att kännas seniora och trygga.',
  },
  {
    question: 'Hur fungerar kredit-systemet?',
    answer: 'Credits används för större förändringar. Pro ger obegränsad tillgång.',
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
              <Badge variant="outline" className="mb-6">Premium portfolio & CV — hostat åt dig</Badge>
              <h1 className="text-4xl md:text-6xl font-semibold text-ink mb-6">
                En professionell närvaro som känns självklar.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl">
                Portfolyo är för människor som inte vill lägga tid på design, hosting eller format.
                Vi levererar ett resultat som matchar senior nivå — snabbt, tryggt och redo att dela.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Skapa min portfolio
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
                  <Star className="h-4 w-4 fill-slate-900 text-slate-900" />
                  <span>Premiumkänsla från dag ett</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>All hosting & drift ingår</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>CV i PDF + webblänk</span>
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
            <Badge variant="outline" className="mb-4">Priser</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-4">
              Välj en nivå som matchar din ambition
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Börja utan risk eller gå direkt på full nivå. Allt är byggt för premiumkänsla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 bg-white">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Gratis</h3>
                <div className="text-4xl font-semibold text-ink">0 kr</div>
                <p className="text-xs text-slate-500">för alltid</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {[
                  '1 portfolio',
                  '1 CV-template',
                  'portfolyo.se/{username}',
                  '3 credits för ändringar',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" className="w-full">
                  Kom igång
                </Button>
              </Link>
            </Card>

            <Card className="p-8 border border-slate-900 bg-white">
              <div className="flex items-center justify-between mb-6">
                <Badge variant="primary" className="gap-1"><Star className="h-3 w-3" /> Populärast</Badge>
                <Badge variant="outline">Starter</Badge>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-semibold text-ink">{PRICING.starter.price} kr</div>
                <p className="text-xs text-slate-500">per månad</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {PRICING.starter.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register?plan=starter" className="block">
                <Button className="w-full">
                  Välj Starter
                </Button>
              </Link>
            </Card>

            <Card className="p-8 bg-ink text-white border border-slate-900">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-white/10 text-white">Pro</Badge>
                <Badge className="bg-white/10 text-white">Obegränsat</Badge>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-semibold">{PRICING.pro.price} kr</div>
                <p className="text-xs text-slate-300">per månad</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-200">
                {PRICING.pro.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register?plan=pro" className="block">
                <Button variant="secondary" className="w-full">
                  Välj Pro
                </Button>
              </Link>
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
          <Badge className="bg-white/10 text-white mb-4">Portfolyo</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Bygg en portfolio som du faktiskt är stolt över
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto mb-8">
            Ett premiumresultat utan att du behöver tänka på teknik, design eller struktur.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Starta nu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-xl">PORTFOLYO</span>
              </div>
              <p className="text-slate-400 text-sm">
                Premium portfolio- och CV-builder för människor som vill göra intryck.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#product" className="hover:text-white">Funktioner</a></li>
                <li><a href="#pricing" className="hover:text-white">Priser</a></li>
                <li><a href="#templates" className="hover:text-white">Templates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resurser</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://sql.saidborna.com" target="_blank" rel="noopener" className="hover:text-white">SQL Arena</a></li>
                <li><a href="https://www.ginonova.com" target="_blank" rel="noopener" className="hover:text-white">GinoNova</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@portfolyo.se</li>
                <li>
                  <a href="https://github.com/S-Borna" target="_blank" rel="noopener" className="hover:text-white">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
            <p>© 2026 PORTFOLYO.SE. Alla rättigheter förbehållna.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-white">Integritetspolicy</a>
              <a href="/terms" className="hover:text-white">Villkor</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
