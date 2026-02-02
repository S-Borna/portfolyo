'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Badge,
  Icons,
} from '@/components/ui';
import { PRICING, LEARNING_RESOURCES } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const {
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Zap,
  Code,
  Briefcase,
  GraduationCap,
  Eye,
  Download,
  Edit3,
  BookOpen,
  Globe,
  Github,
} = Icons;

export default function LandingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Användaren är inloggad, redirect till dashboard
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Visa loading medan vi kollar auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl text-gray-900">PORTFOLYO</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Funktioner</a>
              <a href="#examples" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Exempel</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Priser</a>
              <a href="#resources" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Resurser</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Logga in</Button>
              </Link>
              <Link href="/onboarding">
                <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Kom igång
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-grid">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-driven portfolio builder
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Bygg din
              <span className="text-gradient"> karriär-vinnande </span>
              portfolio
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Skapa imponerande portfolios och ATS-optimerade CV:n som får rekryterare att ringa.
              AI hjälper dig skriva content som sticker ut.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/onboarding">
                <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Skapa din portfolio gratis
                </Button>
              </Link>
              <a href="#examples">
                <Button variant="secondary" size="xl" leftIcon={<Eye className="h-5 w-5" />}>
                  Se exempel
                </Button>
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 border-2 border-white" />
                  ))}
                </div>
                <span>500+ studenter</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">4.9/5 betyg</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 max-w-5xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-400">saidborna.portfolyo.se</span>
                </div>
              </div>
              <div className="p-8 md:p-12 text-white">
                <div className="flex items-start gap-8">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-bold">
                    SB
                  </div>
                  <div>
                    <Badge className="bg-violet-500/20 text-violet-300 mb-2">DEVOPS STUDENT</Badge>
                    <h2 className="text-4xl font-black mb-2">SAID BORNA</h2>
                    <p className="text-gray-400">DevOps Engineer | 5 produkter live | Söker LIA</p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-4 gap-4">
                  {[
                    { value: '15+', label: 'År ledarerfarenhet' },
                    { value: '5', label: 'Produkter live' },
                    { value: '6700', label: 'Förare koordinerade' },
                    { value: '94%', label: 'Leveranssäkerhet' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-800/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Funktioner</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Allt du behöver för att sticka ut
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Från portfolio till CV - vi hjälper dig presentera dig själv på bästa sätt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-6 w-6" />,
                title: 'Portfolio-sida',
                description: 'Professionell portfolio hostad på namn.portfolyo.se med eget design, projekt-showcase och kontaktformulär.',
                features: ['Egna subdomän', 'Mobilanpassad', 'SEO-optimerad'],
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: 'CV-generator',
                description: 'ATS-optimerade CV:n som passerar automatiska filter och imponerar på rekryterare.',
                features: ['ATS-optimerad', 'PDF-export', 'Flera mallar'],
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: 'AI-assistans',
                description: 'Låt AI hjälpa dig skriva övertygande texter med konkreta siffror och resultat.',
                features: ['Bio-generering', 'Projekt-beskrivningar', 'Achievement-formulering'],
              },
              {
                icon: <Edit3 className="h-6 w-6" />,
                title: 'Live-redigering',
                description: 'Uppdatera din portfolio när som helst. Se ändringar direkt utan att vänta.',
                features: ['Realtidsförhandsvisning', 'Drag & drop', 'Versionshistorik'],
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: 'Statistik',
                description: 'Se vem som tittar på din portfolio och vilka projekt som får mest uppmärksamhet.',
                features: ['Besöksstatistik', 'CV-nedladdningar', 'Kontaktklick'],
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: 'Lärresurser',
                description: 'Tillgång till SQL Arena, GinoNova och guider för att förbättra dina skills.',
                features: ['SQL Arena', 'DevOps-kurser', 'Prompt-guider'],
              },
            ].map((feature) => (
              <Card key={feature.title} className="p-6" hover>
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <Check className="h-4 w-4 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section id="examples" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Exempel</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Portfolios som imponerar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Se hur andra studenter presenterar sig själva
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden" hover>
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                    SB
                  </div>
                  <h3 className="text-xl font-bold">Said Borna</h3>
                  <p className="text-gray-400">DevOps Engineer</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="success">Live</Badge>
                  <a
                    href="https://saidborna.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 text-sm font-medium flex items-center gap-1"
                  >
                    Besök saidborna.com
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm">
                  DevOps-student med 15 års ledarerfarenhet. 5 produkter live och söker LIA-plats.
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden opacity-60" hover>
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500 p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                    ?
                  </div>
                  <h3 className="text-xl font-bold">Din portfolio</h3>
                  <p className="text-gray-400">Nästa framgångshistoria</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">Kommer snart</Badge>
                </div>
                <p className="text-gray-600 text-sm">
                  Skapa din portfolio idag och bli nästa framgångshistoria.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Priser</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Investera i din karriär
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Börja gratis eller välj en plan som passar dig
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gratis</h3>
                <div className="text-4xl font-black text-gray-900">0 kr</div>
                <p className="text-gray-500 text-sm">för alltid</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '1 portfolio-sida',
                  '1 CV-mall',
                  'namn.portfolyo.se',
                  '3 AI-credits (engång)',
                  'Community support',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="block">
                <Button variant="secondary" className="w-full">
                  Kom igång gratis
                </Button>
              </Link>
            </Card>

            {/* Starter Plan */}
            <Card className="p-8 border-2 border-violet-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary">Populärast</Badge>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{PRICING.starter.name}</h3>
                <div className="text-4xl font-black text-gray-900">{PRICING.starter.price} kr</div>
                <p className="text-gray-500 text-sm">per månad</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PRICING.starter.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=starter" className="block">
                <Button className="w-full">
                  Välj Starter
                </Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 bg-gray-900 text-white border-gray-800">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{PRICING.pro.name}</h3>
                <div className="text-4xl font-black">{PRICING.pro.price} kr</div>
                <p className="text-gray-400 text-sm">per månad</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PRICING.pro.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-violet-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=pro" className="block">
                <Button variant="outline" className="w-full border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-gray-900">
                  Välj Pro
                </Button>
              </Link>
            </Card>
          </div>

          {/* Credit Packs */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Behöver du fler AI-credits?</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                10 credits = 29 kr
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                25 credits = 59 kr
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                100 credits = 199 kr
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Bonus</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lärresurser för medlemmar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Som medlem får du tillgång till exklusiva lärresurser
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARNING_RESOURCES.map((resource) => (
              <Card key={resource.id} className="p-6" hover>
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <Badge variant="outline" size="sm">{resource.type}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Redo att sticka ut?
          </h2>
          <p className="text-xl text-violet-200 mb-8 max-w-2xl mx-auto">
            Skapa din professionella portfolio på under 10 minuter.
            Ingen kodkunskap krävs.
          </p>
          <Link href="/onboarding">
            <Button
              size="xl"
              className="bg-white text-violet-600 hover:bg-gray-100"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Skapa din portfolio nu
            </Button>
          </Link>
          <p className="text-violet-200 text-sm mt-4">
            Gratis att börja • Ingen kreditkort krävs
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-xl">PORTFOLYO</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-driven portfolio- och CV-builder för studenter och nyexaminerade.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Funktioner</a></li>
                <li><a href="#pricing" className="hover:text-white">Priser</a></li>
                <li><a href="#examples" className="hover:text-white">Exempel</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resurser</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://sql.saidborna.com" target="_blank" rel="noopener" className="hover:text-white">SQL Arena</a></li>
                <li><a href="https://www.ginonova.com" target="_blank" rel="noopener" className="hover:text-white">GinoNova</a></li>
                <li><a href="/guides" className="hover:text-white">Guider</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@portfolyo.se</li>
                <li>
                  <a href="https://github.com/S-Borna" target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
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
