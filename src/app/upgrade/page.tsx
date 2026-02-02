'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  Badge,
  CreditDisplay,
  Icons,
} from '@/components/ui';
import { usePortfolyoStore } from '@/lib/store';
import { PRICING, CREDIT_PACKS } from '@/lib/types';
import { TEMPLATE_COUNTS } from '@/lib/templates';

const { ArrowLeft, Check, Sparkles, Zap, Crown, CreditCard, Gift, Palette } = Icons;

export default function UpgradePage() {
  const router = useRouter();
  const { user, credits, addCredits, isAuthenticated } = usePortfolyoStore();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const handleUpgrade = async (plan: 'starter' | 'pro') => {
    setSelectedPlan(plan);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const creditsToAdd = plan === 'starter' ? PRICING.starter.credits : PRICING.pro.credits;
      addCredits(creditsToAdd);
      toast.success(`🎉 Uppgraderat till ${plan === 'starter' ? 'Starter' : 'Pro'}! +${creditsToAdd} credits`);
      setIsProcessing(false);
      router.push('/dashboard');
    }, 2000);
  };

  const handleBuyCredits = async (pack: { readonly credits: number; readonly price: number }) => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      addCredits(pack.credits);
      toast.success(`🎉 +${pack.credits} credits tillagt!`);
      setIsProcessing(false);
    }, 1500);
  };

  if (!mounted) {
    return null;
  }

  const plans = [
    {
      id: 'free' as const,
      name: 'Gratis',
      price: 0,
      credits: 3,
      icon: Gift,
      templates: {
        portfolio: TEMPLATE_COUNTS.portfolio.free,
        cv: TEMPLATE_COUNTS.cv.free,
      },
      features: [
        '3 AI-credits att börja med',
        '1 portfolio',
        `${TEMPLATE_COUNTS.portfolio.free} portfolio-templates`,
        `${TEMPLATE_COUNTS.cv.free} CV-templates`,
        'portfolyo.se/användarnamn',
      ],
      current: user?.plan === 'free',
    },
    {
      id: 'starter' as const,
      name: 'Starter',
      price: PRICING.starter.price,
      credits: PRICING.starter.credits,
      icon: Zap,
      templates: {
        portfolio: TEMPLATE_COUNTS.portfolio.starter,
        cv: TEMPLATE_COUNTS.cv.starter,
      },
      features: [
        `${PRICING.starter.credits} AI-credits/månad`,
        'Obegränsade portfolios',
        `${TEMPLATE_COUNTS.portfolio.starter} portfolio-templates`,
        `${TEMPLATE_COUNTS.cv.starter} CV-templates`,
        'CV-generator',
        'Egen domän (snart)',
        'Prioriterad support',
      ],
      popular: true,
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: PRICING.pro.price,
      credits: PRICING.pro.credits,
      icon: Crown,
      templates: {
        portfolio: TEMPLATE_COUNTS.portfolio.pro,
        cv: TEMPLATE_COUNTS.cv.pro,
      },
      features: [
        `${PRICING.pro.credits} AI-credits/månad`,
        'Allt i Starter',
        `${TEMPLATE_COUNTS.portfolio.pro} portfolio-templates`,
        `${TEMPLATE_COUNTS.cv.pro} CV-templates`,
        'AI-optimering av texter',
        'Avancerade analytics',
        'API-tillgång',
        'White-label export',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Tillbaka till dashboard</span>
          </Link>
          <CreditDisplay credits={credits} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="primary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Uppgradera
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lås upp fler AI-credits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Få mer ut av PORTFOLYO med fler AI-genererade texter och premium-funktioner
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`p-6 relative ${plan.popular ? 'ring-2 ring-violet-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Populärast</Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    plan.popular ? 'bg-violet-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${plan.popular ? 'text-violet-600' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500"> kr/mån</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.credits} AI-credits
                  </p>
                  {plan.templates && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Palette className="h-3 w-3 text-violet-500" />
                      <span className="text-xs text-violet-600 font-medium">
                        {plan.templates.portfolio + plan.templates.cv} templates
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Nuvarande plan
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Gratis
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'primary' : 'secondary'}
                    onClick={() => handleUpgrade(plan.id as 'starter' | 'pro')}
                    isLoading={isProcessing && selectedPlan === plan.id}
                  >
                    Uppgradera till {plan.name}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Credit Packs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Eller köp extra credits
            </h2>
            <p className="text-gray-600">
              Engångsköp utan prenumeration
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <Card 
                key={pack.credits} 
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-gray-900">{pack.credits}</div>
                <div className="text-gray-500 mb-4">credits</div>
                <div className="text-xl font-bold text-violet-600 mb-4">
                  {pack.price} kr
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleBuyCredits(pack)}
                  isLoading={isProcessing}
                  leftIcon={<CreditCard className="h-4 w-4" />}
                >
                  Köp
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Vanliga frågor
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Vad är en AI-credit?',
                a: 'En AI-credit används för att generera texter med AI. T.ex. kostar det 1 credit att generera en bio och 3 credits för att generera en hel portfolio.',
              },
              {
                q: 'Kan jag avsluta när som helst?',
                a: 'Ja! Du kan avsluta din prenumeration när som helst. Dina credits gäller till slutet av betalningsperioden.',
              },
              {
                q: 'Vad händer om mina credits tar slut?',
                a: 'Du kan fortfarande använda alla funktioner, men AI-generering pausas tills du köper fler credits eller din månad förnyas.',
              },
              {
                q: 'Kan jag behålla min portfolio om jag avslutar?',
                a: 'Ja, din portfolio finns kvar och är publicerad. Du kan bara inte använda AI-funktioner utan credits.',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
