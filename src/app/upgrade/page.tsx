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
import { PRICING } from '@/lib/types';

const { ArrowLeft, Check, Sparkles, CreditCard, Zap } = Icons;

export default function UpgradePage() {
  const router = useRouter();
  const { credits, addCredits, isAuthenticated } = usePortfolyoStore();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const handleBuyBundle = async (bundle: typeof PRICING.credits.bundles[number]) => {
    setSelectedBundle(bundle.credits);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      addCredits(bundle.credits);
      toast.success(`🎉 +${bundle.credits} credits tillagt!`);
      setIsProcessing(false);
      setSelectedBundle(null);
    }, 1500);
  };

  const handleBuySingle = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      addCredits(1);
      toast.success(`🎉 +1 credit tillagt!`);
      setIsProcessing(false);
    }, 1500);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="primary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Köp credits
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Credits för ändringar och tillägg
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Använd credits för att göra ändringar på ditt CV, skapa nya CVs eller portfolios.
          </p>
        </div>

        {/* Credit Tiers Explanation */}
        <Card className="p-6 mb-10 bg-slate-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-slate-600" />
            Så fungerar credits
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PRICING.credits.tiers.map((tier) => (
              <div key={tier.label} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700">{tier.label}</span>
                <Badge variant="outline">{tier.credits} {tier.credits === 1 ? 'credit' : 'credits'}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Credit Bundles */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Välj ett credit-paket
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.credits.bundles.map((bundle, index) => (
              <Card
                key={bundle.credits}
                className={`p-6 text-center hover:shadow-lg transition-shadow ${index === 1 ? 'ring-2 ring-slate-900' : ''}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Populärast</Badge>
                  </div>
                )}
                <div className="text-4xl font-bold text-gray-900">{bundle.credits}</div>
                <div className="text-gray-500 mb-2">credits</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {bundle.price} kr
                </div>
                <div className="text-sm text-emerald-600 font-medium mb-4">
                  Spara {bundle.savings}
                </div>
                <Button
                  className="w-full"
                  variant={index === 1 ? 'primary' : 'secondary'}
                  onClick={() => handleBuyBundle(bundle)}
                  isLoading={isProcessing && selectedBundle === bundle.credits}
                  leftIcon={<CreditCard className="h-4 w-4" />}
                >
                  Köp
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Single Credit */}
        <Card className="p-6 text-center max-w-md mx-auto mb-12">
          <p className="text-gray-600 mb-4">
            Behöver du bara en ändring? Köp en enskild credit.
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-lg font-semibold text-gray-900">1 credit = {PRICING.credits.pricePerCredit} kr</span>
            <Button
              variant="outline"
              onClick={handleBuySingle}
              isLoading={isProcessing && selectedBundle === null}
            >
              Köp 1 credit
            </Button>
          </div>
        </Card>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Vanliga frågor
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Hur länge gäller mina credits?',
                a: 'Credits har ingen utgångsdatum. De finns kvar tills du använder dem.',
              },
              {
                q: 'Vad kostar det att publicera?',
                a: 'Att publicera din första portfolio eller CV kostar 49 kr som engångsavgift. 1 CV-generering ingår.',
              },
              {
                q: 'Kan jag få tillbaka pengar för oanvända credits?',
                a: 'Nej, men credits går aldrig ut så du kan använda dem när du vill.',
              },
              {
                q: 'Vad räknas som en "ändring"?',
                a: 'En ändring är t.ex. att byta ut text, lägga till ett projekt, eller uppdatera kontaktinfo på ditt CV eller portfolio.',
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
