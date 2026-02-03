'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, Card, Badge, Icons } from '@/components/ui';
import type { DbPortfolio, DbAnalytics, DbProfile } from '@/lib/models';

const {
    Globe,
    FileText,
    Eye,
    User,
    Download,
    Mail,
    Edit3,
    ArrowRight,
    Plus,
    Check,
    Copy,
    Zap,
    Crown,
    Settings,
    LogOut,
    ExternalLink,
    Calendar,
    Briefcase,
    Code,
    Palette,
    ChevronRight,
} = Icons;

// ============================================
// PORTFOLYO DASHBOARD - Elegant Light Design
// Matchar landing page DNA
// ============================================

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<DbProfile | null>(null);
    const [portfolio, setPortfolio] = useState<DbPortfolio | null>(null);
    const [analytics, setAnalytics] = useState<DbAnalytics | null>(null);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
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
        const { usePortfolyoStore } = await import('@/lib/store');
        usePortfolyoStore.getState().logout();
        router.replace('/');
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-porcelain flex items-center justify-center">
                <div className="relative">
                    <div className="w-10 h-10 border-2 border-slate-200 rounded-full" />
                    <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin absolute inset-0" />
                </div>
            </div>
        );
    }

    const isPublished = portfolio?.status === 'published';
    const portfolioUrl = isPublished && portfolio ? `https://${portfolio.username}.portfolyo.se` : null;
    const firstName = user?.full_name?.split(' ')[0] || 'där';

    return (
        <div className="min-h-screen bg-porcelain">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-ink rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                P
                            </div>
                            <span className="font-semibold text-ink tracking-tight">PORTFOLYO</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link href="/upgrade">
                                <Badge variant="outline" className="gap-1.5 cursor-pointer hover:bg-slate-50">
                                    <Crown className="h-3.5 w-3.5" />
                                    Uppgradera
                                </Badge>
                            </Link>

                            <div className="h-6 w-px bg-slate-200" />

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                                    {firstName[0]?.toUpperCase()}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-ink">{user?.full_name}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Logga ut"
                                >
                                    <LogOut className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Welcome */}
                <div className="mb-10">
                    <h1 className="text-3xl font-semibold text-ink mb-2">
                        Välkommen tillbaka, {firstName}
                    </h1>
                    <p className="text-slate-500">
                        Hantera din portfolio och CV från en plats.
                    </p>
                </div>

                {/* Stats - Only show real data */}
                {analytics && (analytics.total_views > 0 || analytics.unique_visitors > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <StatCard
                            label="Visningar"
                            value={analytics.total_views || 0}
                            icon={<Eye className="w-4 h-4" />}
                        />
                        <StatCard
                            label="Unika besökare"
                            value={analytics.unique_visitors || 0}
                            icon={<User className="w-4 h-4" />}
                        />
                        <StatCard
                            label="CV-nedladdningar"
                            value={analytics.cv_downloads || 0}
                            icon={<Download className="w-4 h-4" />}
                        />
                        <StatCard
                            label="Kontaktklick"
                            value={analytics.contact_clicks || 0}
                            icon={<Mail className="w-4 h-4" />}
                        />
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Portfolio Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 bg-white border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-ink">Din Portfolio</h2>
                                        {portfolio && (
                                            <p className="text-xs text-slate-500">
                                                {isPublished ? 'Publicerad' : 'Utkast'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {isPublished && (
                                    <Badge variant="primary" className="gap-1">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        Live
                                    </Badge>
                                )}
                            </div>

                            {portfolio ? (
                                <div className="space-y-4">
                                    {/* Published URL */}
                                    {isPublished && portfolioUrl && (
                                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-emerald-800">Din portfolio är live</p>
                                                <a
                                                    href={portfolioUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-emerald-600 hover:underline truncate block"
                                                >
                                                    {portfolioUrl.replace('https://', '')}
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => copyUrl(portfolioUrl)}
                                                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                                                title="Kopiera länk"
                                            >
                                                {copied ? (
                                                    <Check className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-emerald-600" />
                                                )}
                                            </button>
                                            <a
                                                href={portfolioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 text-emerald-600" />
                                            </a>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/portfolio/${portfolio.id}/edit`}>
                                            <Button variant="secondary" className="w-full justify-center gap-2">
                                                <Edit3 className="w-4 h-4" />
                                                Redigera innehåll
                                            </Button>
                                        </Link>
                                        <Link href="/templates">
                                            <Button variant="secondary" className="w-full justify-center gap-2">
                                                <Palette className="w-4 h-4" />
                                                Byt template
                                            </Button>
                                        </Link>
                                    </div>

                                    {!isPublished && (
                                        <Button
                                            onClick={() => setShowPublishModal(true)}
                                            className="w-full justify-center gap-2"
                                        >
                                            <Zap className="w-4 h-4" />
                                            Publicera portfolio
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <Globe className="w-7 h-7 text-slate-400" />
                                    </div>
                                    <h3 className="font-medium text-ink mb-1">Ingen portfolio ännu</h3>
                                    <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                                        Skapa din professionella portfolio på några minuter.
                                    </p>
                                    <Link href="/templates">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Skapa portfolio
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </Card>

                        {/* CV Section */}
                        <Card className="p-6 bg-white border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-ink">Ditt CV</h2>
                                    <p className="text-xs text-slate-500">Skapa professionella CV:n</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/templates?view=cv">
                                    <Button variant="secondary" className="w-full justify-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Skapa nytt CV
                                    </Button>
                                </Link>
                                <Link href="/templates">
                                    <Button variant="ghost" className="w-full justify-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Se alla templates
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="p-6 bg-white border-slate-200">
                            <h3 className="font-semibold text-ink mb-4">Snabbåtgärder</h3>
                            <div className="space-y-2">
                                {portfolio && (
                                    <>
                                        <QuickAction
                                            icon={<Briefcase className="w-4 h-4" />}
                                            label="Redigera projekt"
                                            href={`/portfolio/${portfolio.id}/edit?tab=projects`}
                                        />
                                        <QuickAction
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Uppdatera erfarenhet"
                                            href={`/portfolio/${portfolio.id}/edit?tab=timeline`}
                                        />
                                        <QuickAction
                                            icon={<Code className="w-4 h-4" />}
                                            label="Hantera tech stack"
                                            href={`/portfolio/${portfolio.id}/edit?tab=skills`}
                                        />
                                    </>
                                )}
                                <QuickAction
                                    icon={<FileText className="w-4 h-4" />}
                                    label="Skapa CV från portfolio"
                                    href="/cv/new"
                                />
                            </div>
                        </Card>

                        {/* Tips */}
                        <Card className="p-6 bg-gradient-to-br from-slate-50 to-white border-slate-200">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-ink text-sm mb-1">Tips</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Håll din portfolio uppdaterad med senaste projekt för bäst resultat hos rekryterare.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Help */}
                        <Card className="p-6 bg-white border-slate-200">
                            <h3 className="font-semibold text-ink mb-4">Behöver du hjälp?</h3>
                            <div className="space-y-2">
                                <a
                                    href="mailto:support@portfolyo.se"
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-sm text-slate-600"
                                >
                                    <Mail className="w-4 h-4" />
                                    Kontakta support
                                </a>
                            </div>
                        </Card>
                    </div>
                </div>
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
// COMPONENTS
// ============================================

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <Card className="p-4 bg-white border-slate-200">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    {icon}
                </div>
            </div>
            <div className="text-2xl font-semibold text-ink">{value.toLocaleString()}</div>
            <div className="text-xs text-slate-500">{label}</div>
        </Card>
    );
}

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
        >
            <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{icon}</span>
                <span className="text-sm text-slate-600">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
        </Link>
    );
}

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
        const { data } = await supabase.rpc('check_username_available', { p_username: value });
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

        const { data, error: publishError } = await supabase.rpc('publish_portfolio', {
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
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-md w-full">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-slate-600" />
                </div>

                <h2 className="text-xl font-semibold text-ink mb-2">Publicera din portfolio</h2>
                <p className="text-slate-500 text-sm mb-6">
                    Välj ett användarnamn för din unika subdomän.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-ink mb-2">
                        Användarnamn
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="dittnamn"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-ink placeholder-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all"
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            {checking && (
                                <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
                            )}
                            {!checking && available === true && (
                                <Check className="w-4 h-4 text-emerald-500" />
                            )}
                            {!checking && available === false && (
                                <span className="text-red-500 text-sm">✕</span>
                            )}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {username.length >= 3 ? `${username}.portfolyo.se` : 'Minst 3 tecken'}
                    </p>
                    {available === false && (
                        <p className="text-sm text-red-500 mt-1">Det användarnamnet är upptaget</p>
                    )}
                    {available === true && (
                        <p className="text-sm text-emerald-500 mt-1">✓ Tillgängligt!</p>
                    )}
                    {error && (
                        <p className="text-sm text-red-500 mt-1">{error}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Avbryt
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={!available || username.length < 3 || publishing}
                        className="flex-1"
                    >
                        {publishing ? 'Publicerar...' : 'Publicera'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
