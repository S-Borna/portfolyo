'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Button,
  Input,
  Card,
  Icons,
} from '@/components/ui';
import { usePortfolyoStore } from '@/lib/store';

const { Lock, Mail, ArrowRight, Sparkles } = Icons;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = usePortfolyoStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [mounted, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Ange din e-postadress');
      return;
    }

    setIsLoading(true);
    
    // Simulate login - in production, this would call an API
    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        plan: 'free',
        credits: 3,
        creditsUsed: 0,
      });
      
      toast.success('Välkommen tillbaka!');
      router.push('/dashboard');
    }, 1000);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">PORTFOLYO</span>
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Välkommen tillbaka</h1>
            <p className="text-gray-600">Logga in på ditt konto</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-postadress"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              label="Lösenord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-600">Kom ihåg mig</span>
              </label>
              <a href="#" className="text-violet-600 hover:text-violet-700">
                Glömt lösenord?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Logga in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Har du inget konto?{' '}
              <Link href="/onboarding" className="text-violet-600 hover:text-violet-700 font-medium">
                Skapa konto gratis
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          💡 Demo: Ange valfri e-post för att logga in
        </p>
      </div>
    </div>
  );
}
