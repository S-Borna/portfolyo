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
import { supabase } from '@/lib/supabase';

const { Lock, Mail, ArrowRight, Sparkles, Github } = Icons;

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

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error('OAuth error:', error);
        toast.error('Kunde inte logga in med ' + provider);
        setIsLoading(false);
      }
      // Note: On success, user is redirected - no need to setIsLoading(false)
    } catch (err) {
      console.error('OAuth exception:', err);
      toast.error('Ett oväntat fel uppstod');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Ange din e-postadress');
      return;
    }

    if (!password) {
      toast.error('Ange ditt lösenord');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('E-postadressen är inte bekräftad');
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          }, 1500);
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Fel e-post eller lösenord');
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        login({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '',
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(),
          plan: 'free',
          credits: 3,
          creditsUsed: 0,
        });

        toast.success('Välkommen tillbaka!');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Ett fel uppstod. Försök igen.');
    } finally {
      setIsLoading(false);
    }
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

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">Fortsätt med GitHub</span>
            </button>
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium">Fortsätt med Google</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">eller</span>
            </div>
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
              required
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
              <Link href="/register" className="text-violet-600 hover:text-violet-700 font-medium">
                Skapa konto gratis
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
