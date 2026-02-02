'use client';

// ============================================
// PORTFOLYO.SE - Public Portfolio Page
// Renders user portfolios with full template support
// ============================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortfolioRenderer, type PortfolioData } from '@/components/portfolio/PortfolioRenderer';
import { getPortfolioByUsername, trackPortfolioView, type DbPortfolio } from '@/lib/supabase';
import { Icons } from '@/components/ui';

const { Sparkles, Search, ArrowLeft, Home } = Icons;

// Convert database portfolio to renderer format
function dbToPortfolioData(db: DbPortfolio, username: string): PortfolioData {
  return {
    username: username,
    templateId: db.template_id || 'dev-crimson-bold',
    profile: {
      fullName: db.title,
      title: db.tagline || '',
      tagline: db.bio,
      bio: db.bio,
      location: db.location,
      avatar: db.avatar_url,
    },
    lia: {
      seeking: db.is_seeking_lia,
      period: db.lia_period || undefined,
      location: db.lia_location || undefined,
      interests: db.lia_interests || [],
    },
    highlights: db.highlights || [],
    techStack: (db.tech_stack || []).map((t: any) =>
      typeof t === 'string' ? { name: t } : t
    ),
    projects: db.projects || [],
    timeline: db.timeline || [],
    contact: {
      email: db.email || undefined,
      phone: db.phone || undefined,
      linkedin: db.linkedin || undefined,
      github: db.github || undefined,
      website: db.website || undefined,
    },
    theme: db.theme ? {
      primaryColor: db.theme.primaryColor,
      accentColor: db.theme.accentColor,
      fontFamily: db.theme.fontFamily,
    } : undefined,
  };
}

interface PublicPortfolioPageProps {
  params: Promise<{ username: string }>;
}

export default function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const [username, setUsername] = useState<string>('');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setUsername(p.username);
    });
  }, [params]);

  useEffect(() => {
    if (!username) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      const dbPortfolio = await getPortfolioByUsername(username);

      if (dbPortfolio) {
        setPortfolioData(dbToPortfolioData(dbPortfolio, username));
        // Track view (fire and forget)
        trackPortfolioView(dbPortfolio.id);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchPortfolio();
  }, [username]);

  // Loading state
  if (loading) {
    return <LoadingPage />;
  }

  // Not found state
  if (notFound || !portfolioData) {
    return <NotFoundPage username={username} />;
  }

  // Render portfolio with template
  return <PortfolioRenderer data={portfolioData} />;
}

// ============================================
// LOADING PAGE
// ============================================

function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        {/* Animated logo */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 animate-ping opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-white">P</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-gray-500 mt-4 text-sm">Laddar portfolio...</p>
      </div>
    </div>
  );
}

// ============================================
// NOT FOUND PAGE
// ============================================

function NotFoundPage({ username }: { username: string }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* 404 Icon */}
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-gray-800/50 border border-gray-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-500" />
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border border-gray-700 animate-ping opacity-20" />
          <div className="absolute -inset-4 rounded-full border border-gray-800 opacity-30" />
        </div>

        {/* Error message */}
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          Portfolio hittades inte
        </h1>
        <p className="text-gray-400 mb-2">
          Användaren{' '}
          <span className="text-violet-400 font-mono bg-violet-500/10 px-2 py-1 rounded">
            @{username}
          </span>{' '}
          finns inte
        </p>
        <p className="text-gray-500 mb-8 text-sm">
          eller har inte publicerat sin portfolio än.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: 'white',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Sparkles className="h-5 w-5" />
            Skapa din egen portfolio
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-600"
          >
            <Home className="h-4 w-4" />
            Tillbaka hem
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Var du nyfiken på...
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {['utvecklare', 'designer', 'devops', 'student'].map((term) => (
              <Link
                key={term}
                href={`/?search=${term}`}
                className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
