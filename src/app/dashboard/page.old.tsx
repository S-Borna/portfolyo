'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { DbPortfolio, DbAnalytics, DbProfile } from '@/lib/models';

// ============================================
// PORTFOLYO DASHBOARD - Premium Design
// Benchmark för hela appens design
// ============================================

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<DbProfile | null>(null);
    const [portfolio, setPortfolio] = useState<DbPortfolio | null>(null);
    const [analytics, setAnalytics] = useState<DbAnalytics | null>(null);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'cv' | 'apps'>('overview');

    useEffect(() => {
        const init = async () => {
            try {
                // First check session (faster than getUser)
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    // No session - clear any stale local store data and redirect
                    const { usePortfolyoStore } = await import('@/lib/store');
                    usePortfolyoStore.getState().logout();
                    router.replace('/login');
                    return;
                }

                const authUser = session.user;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (profile) setUser(profile);

                const { data: portfolios } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('user_id', authUser.id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (portfolios && portfolios.length > 0) {
                    setPortfolio(portfolios[0]);

                    const { data: analyticsData } = await supabase
                        .from('portfolio_analytics')
                        .select('*')
                        .eq('portfolio_id', portfolios[0].id)
                        .single();

                    if (analyticsData) setAnalytics(analyticsData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Dashboard init error:', error);
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Clear local store to prevent stale state
        const { usePortfolyoStore } = await import('@/lib/store');
        usePortfolyoStore.getState().logout();
        router.replace('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 border-2 border-[#ff4d4d]/20 rounded-full" />
                    <div className="w-12 h-12 border-2 border-[#ff4d4d] border-t-transparent rounded-full animate-spin absolute inset-0" />
                </div>
            </div>
        );
    }

    const isPublished = portfolio?.status === 'published';
    const portfolioUrl = isPublished && portfolio ? `https://portfolyo.se/p/${portfolio.username}` : null;
    const firstName = user?.full_name?.split(' ')[0] || 'där';

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff4d4d]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d4d] to-[#ff3333] rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-[#ff4d4d]/20 group-hover:shadow-[#ff4d4d]/40 transition-shadow">
                                P
                            </div>
                            <span className="font-bold text-xl tracking-tight">PORTFOLYO</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            {/* Quick Actions */}
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                    <BellIcon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                </button>
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                                    <SettingsIcon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff4d4d] to-purple-500 flex items-center justify-center text-sm font-medium">
                                    {firstName[0]?.toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-sm font-medium">{user?.full_name || 'Användare'}</div>
                                    <div className="text-xs text-zinc-500">{user?.email}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                    title="Logga ut"
                                >
                                    <LogoutIcon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Hej, {firstName}! 👋
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Välkommen till din kreativa hub. Vad vill du göra idag?
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-8"
                >
                    <div className="inline-flex p-1 bg-white/5 rounded-2xl backdrop-blur-sm">
                        {[
                            { id: 'overview', label: 'Översikt', icon: GridIcon },
                            { id: 'portfolio', label: 'Portfolio', icon: GlobeIcon },
                            { id: 'cv', label: 'CV', icon: DocumentIcon },
                            { id: 'apps', label: 'Appar', icon: AppsIcon },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-xl"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <tab.icon className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            portfolio={portfolio}
                            analytics={analytics}
                            isPublished={isPublished}
                            portfolioUrl={portfolioUrl}
                            onPublish={() => setShowPublishModal(true)}
                        />
                    )}
                    {activeTab === 'portfolio' && (
                        <PortfolioTab
                            portfolio={portfolio}
                            isPublished={isPublished}
                            portfolioUrl={portfolioUrl}
                            onPublish={() => setShowPublishModal(true)}
                        />
                    )}
                    {activeTab === 'cv' && <CVTab />}
                    {activeTab === 'apps' && <AppsTab />}
                </AnimatePresence>
            </main>

            {/* Publish Modal */}
            {showPublishModal && portfolio && (
                <PublishModal
                    portfolio={portfolio}
                    onClose={() => setShowPublishModal(false)}
                    onPublished={(username) => {
                        setPortfolio(prev => prev ? { ...prev, status: 'published', username } : null);
                        setShowPublishModal(false);
                    }}
                />
            )}
        </div>
    );
}

// ============================================
// TAB COMPONENTS
// ============================================

function OverviewTab({
    portfolio,
    analytics,
    isPublished,
    portfolioUrl,
    onPublish
}: {
    portfolio: DbPortfolio | null;
    analytics: DbAnalytics | null;
    isPublished: boolean;
    portfolioUrl: string | null;
    onPublish: () => void;
}) {
    return (
        <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Visningar"
                    value={analytics?.total_views || 0}
                    icon={<EyeIcon className="w-5 h-5" />}
                    trend={12}
                    color="emerald"
                />
                <StatCard
                    label="Besökare"
                    value={analytics?.unique_visitors || 0}
                    icon={<UsersIcon className="w-5 h-5" />}
                    trend={8}
                    color="blue"
                />
                <StatCard
                    label="CV Downloads"
                    value={analytics?.cv_downloads || 0}
                    icon={<DownloadIcon className="w-5 h-5" />}
                    trend={24}
                    color="purple"
                />
                <StatCard
                    label="Kontakt-klick"
                    value={analytics?.contact_clicks || 0}
                    icon={<MailIcon className="w-5 h-5" />}
                    trend={5}
                    color="orange"
                />
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Portfolio Status */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Din Portfolio</h2>
                            {portfolio && (
                                <StatusBadge isPublished={isPublished} />
                            )}
                        </div>

                        {portfolio ? (
                            <div className="space-y-6">
                                {/* Preview Card */}
                                <div className="relative group">
                                    <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ff4d4d] to-purple-500 flex items-center justify-center">
                                                    <GlobeIcon className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-1">{portfolio.title || 'Min Portfolio'}</h3>
                                                <p className="text-zinc-400 text-sm">{portfolio.tagline || 'Ingen tagline ännu'}</p>
                                            </div>
                                        </div>
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Link
                                                href={`/portfolio/${portfolio.id}/edit`}
                                                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                                            >
                                                Redigera
                                            </Link>
                                            {isPublished && portfolioUrl && (
                                                <a
                                                    href={portfolioUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    Visa live
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={`/portfolio/${portfolio.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        Redigera innehåll
                                    </Link>
                                    <Link
                                        href={`/portfolio/${portfolio.id}/edit?tab=design`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        <PaletteIcon className="w-4 h-4" />
                                        Byt design
                                    </Link>
                                    {!isPublished && (
                                        <button
                                            onClick={onPublish}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff4d4d] to-[#ff3333] hover:from-[#ff3333] hover:to-[#ff2222] rounded-xl text-sm font-medium transition-colors shadow-lg shadow-[#ff4d4d]/20"
                                        >
                                            <RocketIcon className="w-4 h-4" />
                                            Publicera
                                        </button>
                                    )}
                                </div>

                                {/* Published URL */}
                                {isPublished && portfolioUrl && (
                                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <CheckIcon className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-emerald-400 font-medium mb-0.5">Live på webben</p>
                                            <a
                                                href={portfolioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-zinc-400 hover:text-white truncate block transition-colors"
                                            >
                                                {portfolioUrl.replace('https://', '')}
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(portfolioUrl)}
                                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                            title="Kopiera länk"
                                        >
                                            <CopyIcon className="w-4 h-4 text-zinc-400" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <EmptyPortfolioState />
                        )}
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-6">
                    {/* CV Quick Access */}
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6">
                        <h2 className="text-lg font-semibold mb-4">Ditt CV</h2>
                        <div className="space-y-3">
                            <Link
                                href="/cv/new"
                                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlusIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Skapa nytt CV</p>
                                    <p className="text-xs text-zinc-500">Generera från portfolio</p>
                                </div>
                            </Link>
                            <Link
                                href="/cv/new?edit=true"
                                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <EditIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Redigera CV</p>
                                    <p className="text-xs text-zinc-500">Anpassa innehåll & design</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Connected Apps */}
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Länkade appar</h2>
                            <Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">
                                Hantera
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <AppLink name="GitHub" icon="github" connected />
                            <AppLink name="LinkedIn" icon="linkedin" connected />
                            <AppLink name="Dribbble" icon="dribbble" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function PortfolioTab({
    portfolio,
    isPublished,
    portfolioUrl,
    onPublish
}: {
    portfolio: DbPortfolio | null;
    isPublished: boolean;
    portfolioUrl: string | null;
    onPublish: () => void;
}) {
    return (
        <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {portfolio ? (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Portfolio Management */}
                    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6">
                        <h2 className="text-lg font-semibold mb-6">Hantera Portfolio</h2>

                        <div className="space-y-4">
                            <ActionButton
                                icon={<EditIcon className="w-5 h-5" />}
                                title="Redigera profil"
                                description="Namn, titel, bio och kontaktinfo"
                                href={`/portfolio/${portfolio.id}/edit?tab=profile`}
                            />
                            <ActionButton
                                icon={<FolderIcon className="w-5 h-5" />}
                                title="Hantera projekt"
                                description="Lägg till och redigera dina projekt"
                                href={`/portfolio/${portfolio.id}/edit?tab=projects`}
                            />
                            <ActionButton
                                icon={<TimelineIcon className="w-5 h-5" />}
                                title="Tidslinje"
                                description="Erfarenheter och utbildning"
                                href={`/portfolio/${portfolio.id}/edit?tab=timeline`}
                            />
                            <ActionButton
                                icon={<CodeIcon className="w-5 h-5" />}
                                title="Tech Stack"
                                description="Tekniker och verktyg du använder"
                                href={`/portfolio/${portfolio.id}/edit?tab=skills`}
                            />
                        </div>
                    </div>

                    {/* Design & Publishing */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6">
                            <h2 className="text-lg font-semibold mb-6">Design & Tema</h2>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {['Mörk', 'Ljus', 'Gradient'].map((theme, i) => (
                                    <button
                                        key={theme}
                                        className={`aspect-[4/3] rounded-xl border-2 transition-all ${i === 0 ? 'border-[#ff4d4d] bg-zinc-900' : 'border-white/10 bg-zinc-800/50 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-xs text-zinc-400">{theme}</span>
                                    </button>
                                ))}
                            </div>

                            <Link
                                href={`/portfolio/${portfolio.id}/edit?tab=design`}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                            >
                                <PaletteIcon className="w-4 h-4" />
                                Alla templates
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6">
                            <h2 className="text-lg font-semibold mb-4">Publicering</h2>

                            <StatusBadge isPublished={isPublished} className="mb-4" />

                            {isPublished && portfolioUrl ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-zinc-500 mb-1">Din URL</p>
                                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#ff4d4d] hover:underline">
                                            {portfolioUrl.replace('https://', '')}
                                        </a>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                                            Dela
                                        </button>
                                        <button className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                                            QR-kod
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={onPublish}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff4d4d] to-[#ff3333] rounded-xl text-sm font-medium shadow-lg shadow-[#ff4d4d]/20 hover:shadow-[#ff4d4d]/40 transition-shadow"
                                >
                                    <RocketIcon className="w-4 h-4" />
                                    Publicera nu
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyPortfolioState large />
            )}
        </motion.div>
    );
}

function CVTab() {
    return (
        <motion.div
            key="cv"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Create New */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                        <DocumentIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Skapa nytt CV</h2>
                    <p className="text-zinc-400 mb-6">
                        Generera ett professionellt CV baserat på din portfolio-data.
                        Välj bland 27 premium-templates.
                    </p>
                    <Link
                        href="/cv/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Skapa CV
                    </Link>
                </div>

                {/* Templates Preview */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6">
                    <h2 className="text-lg font-semibold mb-4">Populära templates</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {['Said Dark', 'Noir Extreme', 'Executive Charcoal', 'Minimal Snow'].map((template) => (
                            <div key={template} className="aspect-[3/4] bg-zinc-800 rounded-xl flex items-end p-3">
                                <span className="text-xs text-zinc-400">{template}</span>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/cv/new?gallery=true"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                    >
                        Se alla 27 templates
                        <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* CV Tips */}
            <div className="mt-6 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <LightbulbIcon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-400 mb-1">Tips för ditt CV</h3>
                        <p className="text-sm text-zinc-300">
                            Rekryterare lägger i snitt 6 sekunder på ett CV. Håll det koncist,
                            lyft fram relevanta erfarenheter och se till att designen är ren och professionell.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function AppsTab() {
    const apps = [
        { name: 'GitHub', icon: 'github', description: 'Visa dina repositories', connected: true, color: 'from-gray-600 to-gray-800' },
        { name: 'LinkedIn', icon: 'linkedin', description: 'Importera arbetslivserfarenhet', connected: true, color: 'from-blue-600 to-blue-800' },
        { name: 'Dribbble', icon: 'dribbble', description: 'Visa design-shots', connected: false, color: 'from-pink-500 to-pink-700' },
        { name: 'Behance', icon: 'behance', description: 'Kreativa projekt', connected: false, color: 'from-blue-500 to-indigo-700' },
        { name: 'Twitter/X', icon: 'twitter', description: 'Länka din profil', connected: false, color: 'from-zinc-700 to-zinc-900' },
        { name: 'Medium', icon: 'medium', description: 'Visa dina artiklar', connected: false, color: 'from-emerald-600 to-teal-800' },
    ];

    return (
        <motion.div
            key="apps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-3xl border border-white/10 p-6 mb-6">
                <h2 className="text-lg font-semibold mb-2">Koppla dina appar</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Länka dina favorit-plattformar för att automatiskt visa ditt arbete i portfolion.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {apps.map((app) => (
                        <div
                            key={app.name}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                                    <AppIconComponent icon={app.icon} />
                                </div>
                                {app.connected ? (
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Kopplad</span>
                                ) : (
                                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-full transition-colors">
                                        Koppla
                                    </button>
                                )}
                            </div>
                            <h3 className="font-medium mb-0.5">{app.name}</h3>
                            <p className="text-xs text-zinc-500">{app.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

function StatCard({
    label,
    value,
    icon,
    trend,
    color
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    trend?: number;
    color: 'emerald' | 'blue' | 'purple' | 'orange';
}) {
    const colors = {
        emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
        blue: 'from-blue-500/20 to-blue-500/5 text-blue-400',
        purple: 'from-purple-500/20 to-purple-500/5 text-purple-400',
        orange: 'from-orange-500/20 to-orange-500/5 text-orange-400',
    };

    return (
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] rounded-2xl border border-white/10 p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold mb-0.5">{value.toLocaleString()}</div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{label}</span>
                {trend && (
                    <span className="text-xs text-emerald-400">+{trend}%</span>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ isPublished, className = '' }: { isPublished: boolean; className?: string }) {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            {isPublished ? (
                <>
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm text-emerald-400 font-medium">Live</span>
                </>
            ) : (
                <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-sm text-amber-400 font-medium">Utkast</span>
                </>
            )}
        </div>
    );
}

function EmptyPortfolioState({ large = false }: { large?: boolean }) {
    return (
        <div className={`text-center ${large ? 'py-16' : 'py-8'}`}>
            <div className={`${large ? 'w-20 h-20' : 'w-16 h-16'} mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ff4d4d]/20 to-purple-500/20 flex items-center justify-center`}>
                <GlobeIcon className={`${large ? 'w-10 h-10' : 'w-8 h-8'} text-zinc-400`} />
            </div>
            <h3 className={`${large ? 'text-xl' : 'text-lg'} font-semibold mb-2`}>Ingen portfolio ännu</h3>
            <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                Skapa din professionella portfolio på några minuter och börja visa upp ditt arbete.
            </p>
            <Link
                href="/portfolio/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4d4d] to-[#ff3333] rounded-xl text-sm font-medium shadow-lg shadow-[#ff4d4d]/20 hover:shadow-[#ff4d4d]/40 transition-shadow"
            >
                <PlusIcon className="w-4 h-4" />
                Skapa portfolio
            </Link>
        </div>
    );
}

function ActionButton({
    icon,
    title,
    description,
    href
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
        >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/20 transition-all">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium">{title}</p>
                <p className="text-xs text-zinc-500 truncate">{description}</p>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
    );
}

function AppLink({ name, icon, connected = false }: { name: string; icon: string; connected?: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
                <AppIconComponent icon={icon} />
                <span className="text-sm">{name}</span>
            </div>
            {connected ? (
                <CheckIcon className="w-4 h-4 text-emerald-400" />
            ) : (
                <span className="text-xs text-zinc-500">Koppla</span>
            )}
        </div>
    );
}

function AppIconComponent({ icon }: { icon: string }) {
    const icons: Record<string, React.ReactNode> = {
        github: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
        linkedin: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
        dribbble: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z" /></svg>,
        behance: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" /></svg>,
        twitter: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
        medium: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" /></svg>,
    };
    return icons[icon] || null;
}

// ============================================
// PUBLISH MODAL
// ============================================

function PublishModal({
    portfolio,
    onClose,
    onPublished
}: {
    portfolio: DbPortfolio;
    onClose: () => void;
    onPublished: (username: string) => void;
}) {
    const [username, setUsername] = useState('');
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState('');

    const checkAvailability = async (value: string) => {
        if (value.length < 3) {
            setAvailable(null);
            return;
        }

        setChecking(true);
        const { data } = await supabase
            .rpc('check_username_available', { p_username: value });
        setAvailable(data);
        setChecking(false);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setUsername(value);
        setError('');
        checkAvailability(value);
    };

    const handlePublish = async () => {
        if (!available || username.length < 3) return;

        setPublishing(true);
        setError('');

        const { data, error: publishError } = await supabase
            .rpc('publish_portfolio', {
                p_portfolio_id: portfolio.id,
                p_username: username
            });

        if (publishError || !data) {
            setError('Kunde inte publicera. Försök igen.');
            setPublishing(false);
            return;
        }

        onPublished(username);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 max-w-md w-full"
            >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff4d4d] to-purple-500 flex items-center justify-center mb-6">
                    <RocketIcon className="w-7 h-7" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Publicera din portfolio</h2>
                <p className="text-zinc-400 mb-6">
                    Välj ett användarnamn för din publika URL. Detta blir din permanenta adress.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Välj användarnamn
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                            portfolyo.se/p/
                        </span>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="dittnamn"
                            className="w-full pl-[120px] pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d4d] focus:ring-1 focus:ring-[#ff4d4d]/50 transition-all"
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            {checking && (
                                <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                            )}
                            {!checking && available === true && (
                                <CheckIcon className="w-5 h-5 text-emerald-500" />
                            )}
                            {!checking && available === false && (
                                <XIcon className="w-5 h-5 text-red-500" />
                            )}
                        </span>
                    </div>
                    {available === false && (
                        <p className="text-sm text-red-400 mt-2">Det användarnamnet är upptaget</p>
                    )}
                    {available === true && (
                        <p className="text-sm text-emerald-400 mt-2">✓ Tillgängligt!</p>
                    )}
                    {error && (
                        <p className="text-sm text-red-400 mt-2">{error}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={!available || username.length < 3 || publishing}
                        className="flex-1 px-5 py-3 bg-gradient-to-r from-[#ff4d4d] to-[#ff3333] text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#ff4d4d]/20 transition-all"
                    >
                        {publishing ? 'Publicerar...' : 'Publicera'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ============================================
// ICONS
// ============================================

function GridIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    );
}

function GlobeIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    );
}

function DocumentIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function AppsIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
    );
}

function BellIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );
}

function SettingsIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function LogoutIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}

function EyeIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function UsersIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}

function DownloadIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );
}

function MailIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function EditIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function PaletteIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    );
}

function RocketIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
    );
}

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function CopyIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
}

function PlusIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    );
}

function FolderIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
    );
}

function TimelineIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function CodeIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    );
}

function LightbulbIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    );
}
