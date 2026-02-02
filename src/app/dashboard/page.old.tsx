'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Badge,
  Progress,
  Avatar,
  StatCard,
  CreditDisplay,
  EmptyState,
  Icons,
} from '@/components/ui';
import ActivatePortfolioModal from '@/components/ActivatePortfolioModal';
import { usePortfolyoStore } from '@/lib/store';
import { PRICING, LEARNING_RESOURCES } from '@/lib/types';
import { getGreeting, formatNumber, getPortfolioUrl } from '@/lib/utils';
import { getUserPortfolios, getPortfolioAnalytics, type DbPortfolio, type DbAnalytics } from '@/lib/supabase';

const {
  Plus,
  Eye,
  Edit3,
  ExternalLink,
  Download,
  Trash2,
  Settings,
  LogOut,
  Zap,
  Star,
  BookOpen,
  User,
  Briefcase,
  Menu,
  ArrowRight,
  Copy,
  Check,
  Globe,
  Sparkles,
} = Icons;

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    portfolios: localPortfolios,
    cvs,
    credits,
    logout,
    deletePortfolio,
    deleteCV,
    setActivePortfolio,
    setActiveCV,
  } = usePortfolyoStore();

  const [activeTab, setActiveTab] = useState<'portfolios' | 'cvs' | 'resources'>('portfolios');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [dbPortfolios, setDbPortfolios] = useState<DbPortfolio[]>([]);
  const [portfolioAnalytics, setPortfolioAnalytics] = useState<Record<string, DbAnalytics>>({});
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch portfolios from Supabase
  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      const fetchPortfolios = async () => {
        setLoadingPortfolios(true);
        const portfolios = await getUserPortfolios(user.id);
        setDbPortfolios(portfolios);

        // Fetch analytics for each portfolio
        const analyticsMap: Record<string, DbAnalytics> = {};
        for (const p of portfolios) {
          const analytics = await getPortfolioAnalytics(p.id);
          if (analytics) {
            analyticsMap[p.id] = analytics;
          }
        }
        setPortfolioAnalytics(analyticsMap);
        setLoadingPortfolios(false);
      };
      fetchPortfolios();
    }
  }, [mounted, isAuthenticated, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const handleActivateSuccess = (username: string) => {
    setShowActivateModal(false);
    // Refresh portfolios
    if (user) {
      getUserPortfolios(user.id).then(setDbPortfolios);
    }
  };

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const totalViews = Object.values(portfolioAnalytics).reduce((sum, a) => sum + a.total_views, 0);
  const totalDownloads = Object.values(portfolioAnalytics).reduce((sum, a) => sum + a.cv_downloads, 0);
  const hasActivePortfolio = dbPortfolios.some(p => p.is_published);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">PORTFOLYO</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('portfolios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'portfolios'
              ? 'bg-violet-100 text-violet-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Globe className="h-5 w-5" />
            Portfolios
          </button>
          <button
            onClick={() => setActiveTab('cvs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'cvs'
              ? 'bg-violet-100 text-violet-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Briefcase className="h-5 w-5" />
            CV:n
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'resources'
              ? 'bg-violet-100 text-violet-700'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <BookOpen className="h-5 w-5" />
            Lärresurser
          </button>
        </nav>

        {/* Credits & Plan */}
        <div className="p-4 border-t border-gray-200">
          <Card className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="primary" size="sm">
                {user.plan === 'free' ? 'Gratis' : user.plan === 'starter' ? 'Starter' : 'Pro'}
              </Badge>
              <CreditDisplay credits={credits} />
            </div>
            {user.plan === 'free' && (
              <Link href="/upgrade">
                <Button size="sm" className="w-full" leftIcon={<Zap className="h-4 w-4" />}>
                  Uppgradera
                </Button>
              </Link>
            )}
          </Card>
        </div>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logga ut"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.name.split(/[\s.@]/)[0].charAt(0).toUpperCase() + user.name.split(/[\s.@]/)[0].slice(1).toLowerCase()}!
          </h1>
          <p className="text-gray-600">
            Hantera dina portfolios och CV:n
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Globe className="h-5 w-5" />}
            value={dbPortfolios.length}
            label="Portfolios"
          />
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            value={cvs.length}
            label="CV:n"
          />
          <StatCard
            icon={<Eye className="h-5 w-5" />}
            value={formatNumber(totalViews)}
            label="Totala visningar"
          />
          <StatCard
            icon={<Download className="h-5 w-5" />}
            value={formatNumber(totalDownloads)}
            label="CV-nedladdningar"
          />
        </div>

        {/* Portfolios Tab */}
        {activeTab === 'portfolios' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Min Portfolio</h2>
              {!hasActivePortfolio && (
                <Button
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  onClick={() => setShowActivateModal(true)}
                >
                  Aktivera Portfolio
                </Button>
              )}
            </div>

            {loadingPortfolios ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
              </div>
            ) : dbPortfolios.length === 0 ? (
              <EmptyState
                icon={<Globe className="h-8 w-8" />}
                title="Ingen aktiv portfolio"
                description="Skapa din portfolio för att visa upp dig för företag och visa att du söker LIA."
                action={{
                  label: 'Skapa Portfolio',
                  onClick: () => router.push('/portfolio/new'),
                }}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbPortfolios.map((portfolio) => {
                  const url = `https://${portfolio.username}.portfolyo.se`;
                  const analytics = portfolioAnalytics[portfolio.id];
                  return (
                    <Card key={portfolio.id} className="overflow-hidden" hover>
                      {/* Preview */}
                      <div className="aspect-video bg-gray-900 p-6 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Avatar name={portfolio.title} size="lg" className="mx-auto mb-2" />
                          <h3 className="font-bold">{portfolio.title || 'Din Portfolio'}</h3>
                          <p className="text-sm text-gray-400">{portfolio.tagline || 'YH-student'}</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={portfolio.is_published ? 'success' : 'warning'}>
                            {portfolio.is_published ? 'Publicerad' : 'Utkast'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {analytics?.total_views || 0} visningar
                          </span>
                        </div>

                        {/* URL */}
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-4">
                          <span className="text-sm text-gray-600 truncate flex-1">
                            {portfolio.username}.portfolyo.se
                          </span>
                          <button
                            onClick={() => copyToClipboard(url)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {copiedUrl === url ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Link href={`/portfolio/${portfolio.id}/edit`} className="flex-1">
                            <Button variant="secondary" size="sm" className="w-full" leftIcon={<Edit3 className="h-4 w-4" />}>
                              Redigera
                            </Button>
                          </Link>
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CVs Tab */}
        {activeTab === 'cvs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mina CV:n</h2>
              <Link href="/cv/new">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Nytt CV
                </Button>
              </Link>
            </div>

            {cvs.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-8 w-8" />}
                title="Inga CV:n än"
                description="Skapa ett ATS-optimerat CV som imponerar på rekryterare."
                action={{
                  label: 'Skapa CV',
                  onClick: () => router.push('/cv/new'),
                }}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvs.map((cv) => (
                  <Card key={cv.id} className="p-6" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cv.name}</h3>
                        <p className="text-sm text-gray-500">{cv.template} mall</p>
                      </div>
                      <Badge variant="outline">{cv.template}</Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p>{cv.personalInfo.fullName || 'Namn ej angivet'}</p>
                      <p>{cv.personalInfo.title || 'Titel ej angiven'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/cv/${cv.id}/edit`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full" leftIcon={<Edit3 className="h-4 w-4" />}>
                          Redigera
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                        PDF
                      </Button>
                      <button
                        onClick={() => {
                          if (confirm('Är du säker på att du vill ta bort detta CV?')) {
                            deleteCV(cv.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Lärresurser</h2>
              <p className="text-gray-600">
                Förbättra dina skills med våra kurser och guider
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {LEARNING_RESOURCES.map((resource) => (
                <Card key={resource.id} className="p-6" hover>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{resource.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        {resource.featured && (
                          <Badge variant="primary" size="sm">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                      <a
                        href={resource.url}
                        target={resource.url.startsWith('http') ? '_blank' : undefined}
                        rel={resource.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                          Utforska
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pro resources teaser */}
            {user.plan === 'free' && (
              <Card className="mt-8 p-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Få tillgång till fler resurser</h3>
                    <p className="text-violet-200">
                      Uppgradera till Pro för fler AI-credits och exklusiva guider.
                    </p>
                  </div>
                  <Link href="/upgrade">
                    <Button className="bg-white text-violet-600 hover:bg-violet-50">
                      Uppgradera nu
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Activate Portfolio Modal */}
      <ActivatePortfolioModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onSuccess={handleActivateSuccess}
        userId={user.id}
        userEmail={user.email}
        userName={user.name}
      />
    </div>
  );
}
