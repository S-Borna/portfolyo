'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { DbPortfolio, DbAnalytics, DbProfile } from '@/lib/models';

// ============================================
// DASHBOARD - SIMPLIFIED
// Focus: Status → Action
// ============================================

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<DbProfile | null>(null);
    const [portfolio, setPortfolio] = useState<DbPortfolio | null>(null);
    const [analytics, setAnalytics] = useState<DbAnalytics | null>(null);
    const [showPublishModal, setShowPublishModal] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                // Timeout efter 5 sekunder
                const timeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth timeout')), 5000)
                );

                const authCheck = supabase.auth.getUser();
                const { data: { user: authUser } } = await Promise.race([authCheck, timeout]) as Awaited<typeof authCheck>;

                if (!authUser) {
                    router.push('/login');
                    return;
                }

                // Get profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (profile) setUser(profile);

                // Get portfolio (first one)
                const { data: portfolios } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('user_id', authUser.id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (portfolios && portfolios.length > 0) {
                    setPortfolio(portfolios[0]);

                    // Get analytics
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
                // Vid timeout eller fel - skicka till login
                router.push('/login');
            }
        };

        init();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#ff4d4d] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isPublished = portfolio?.status === 'published';
    const portfolioUrl = isPublished && portfolio
        ? `https://portfolyo.se/p/${portfolio.username}`
        : null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-zinc-800">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#ff4d4d] rounded-lg flex items-center justify-center font-bold">
                            P
                        </div>
                        <span className="font-bold text-lg tracking-tight">PORTFOLYO</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Logga ut
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Välkommen{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋
                    </h1>
                    <p className="text-zinc-400">
                        Härifrån hanterar du din portfolio och ditt CV.
                    </p>
                </div>

                {/* Portfolio Status Card */}
                {portfolio ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className={`p-8 rounded-2xl border ${isPublished
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-amber-500/5 border-amber-500/20'
                            }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        {isPublished ? (
                                            <>
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-emerald-400 font-medium">Live</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                                <span className="text-amber-400 font-medium">Utkast</span>
                                            </>
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold mb-1">{portfolio.title || 'Min Portfolio'}</h2>
                                    <p className="text-zinc-400">{portfolio.tagline || 'Ingen tagline ännu'}</p>

                                    {isPublished && portfolioUrl && (
                                        <a
                                            href={portfolioUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 text-sm text-[#ff4d4d] hover:underline"
                                        >
                                            {portfolioUrl.replace('https://', '')}
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        href={`/portfolio/${portfolio.id}/edit`}
                                        className="px-5 py-2.5 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                                    >
                                        Redigera
                                    </Link>
                                    {!isPublished && (
                                        <button
                                            onClick={() => setShowPublishModal(true)}
                                            className="px-5 py-2.5 bg-[#ff4d4d] text-white text-sm font-medium rounded-lg hover:bg-[#ff3333] transition-colors"
                                        >
                                            Publicera
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : null}

                {/* Stats Grid */}
                {isPublished && analytics && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-4 gap-4 mb-12"
                    >
                        <StatCard
                            label="Visningar"
                            value={analytics.total_views}
                            icon={<EyeIcon />}
                        />
                        <StatCard
                            label="Unika besökare"
                            value={analytics.unique_visitors}
                            icon={<UserIcon />}
                        />
                        <StatCard
                            label="CV nedladdningar"
                            value={analytics.cv_downloads}
                            icon={<DownloadIcon />}
                        />
                        <StatCard
                            label="Kontakt-klick"
                            value={analytics.contact_clicks}
                            icon={<MailIcon />}
                        />
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-semibold mb-4">Snabbåtgärder</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {portfolio ? (
                            <>
                                <ActionCard
                                    icon={<EditIcon />}
                                    title="Redigera innehåll"
                                    description="Uppdatera projekt, kompetenser och mer"
                                    href={`/portfolio/${portfolio.id}/edit`}
                                />
                                <ActionCard
                                    icon={<PaletteIcon />}
                                    title="Byt design"
                                    description="Välj bland 20+ premium templates"
                                    href={`/portfolio/${portfolio.id}/edit?tab=design`}
                                />
                            </>
                        ) : (
                            <ActionCard
                                icon={<EditIcon />}
                                title="Skapa portfolio"
                                description="Bygg din professionella portfolio"
                                href="/portfolio/new"
                            />
                        )}
                        <ActionCard
                            icon={<DocumentIcon />}
                            title="Skapa CV"
                            description="Generera PDF baserat på din portfolio"
                            href="/cv/new"
                        />
                    </div>
                </motion.div>
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

function EmptyDashboard({ user }: { user: DbProfile | null }) {
    const [showTips, setShowTips] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#ff4d4d] rounded-lg flex items-center justify-center font-bold">
                            P
                        </div>
                        <span className="font-bold text-lg tracking-tight">PORTFOLYO</span>
                    </Link>
                    <span className="text-sm text-zinc-500">{user?.email}</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Welcome */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">
                        Välkommen{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Det här är din dashboard. Härifrån hanterar du din portfolio och ditt CV.
                    </p>
                </div>

                {/* Main card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-8">
                    <div className="flex items-start gap-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#ff4d4d]/20 to-[#ff4d4d]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-[#ff4d4d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-2">Redo att skapa din portfolio?</h2>
                            <p className="text-zinc-400 mb-6 leading-relaxed">
                                Ta din tid. Du kan börja när du vill och spara utkast längs vägen.
                                Processen tar ungefär 5-10 minuter.
                            </p>
                            <Link
                                href="/portfolio/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff4d4d] text-white font-medium rounded-lg hover:bg-[#ff3333] transition-colors"
                            >
                                Skapa portfolio
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Why portfolio matters */}
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">💡</span>
                            <span className="font-medium">Osäker? Så här tänker rekryterare</span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-zinc-500 transition-transform ${showTips ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showTips && (
                        <div className="px-6 pb-6 border-t border-zinc-800/50">
                            <div className="pt-6 space-y-6 text-zinc-300">
                                <div>
                                    <h3 className="font-medium text-white mb-2">Verkligheten: 6 sekunder</h3>
                                    <p className="text-sm leading-relaxed">
                                        En rekryterare lägger i snitt 6 sekunder på ett CV innan de bestämmer sig.
                                        Med 200+ ansökningar per tjänst behöver du sticka ut — inte med tricks,
                                        utan genom att göra det enkelt att se din kompetens.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-white mb-2">Vad de letar efter först</h3>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#ff4d4d] mt-1">→</span>
                                            <span><strong>Relevans</strong> — Matchar du rollen? Snabb skanning av titel och skills.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#ff4d4d] mt-1">→</span>
                                            <span><strong>Tydlighet</strong> — Kan de förstå vad du gjort på 10 sekunder?</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#ff4d4d] mt-1">→</span>
                                            <span><strong>Professionalitet</strong> — Ser det seriöst ut? Småfel = varningsflagga.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-white mb-2">Varför en portfolio gör skillnad</h3>
                                    <p className="text-sm leading-relaxed">
                                        Ett CV säger vad du gjort. En portfolio <em>visar</em> det.
                                        Den som tar sig tid att presentera sitt arbete ordentligt signalerar något viktigt:
                                        du bryr dig om kvalitet. Det är samma egenskap arbetsgivare vill ha i teamet.
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-zinc-800/50">
                                    <p className="text-sm text-zinc-400 italic">
                                        "Den enda ansökan med portfolio fastnade direkt.
                                        Det var inte ens den mest erfarna kandidaten — men den enda
                                        som visade att de brydde sig."
                                        <span className="block mt-1 text-zinc-500 not-italic">— Tech Lead, startup i Stockholm</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500">
                    <Link href="/cv/new" className="hover:text-white transition-colors">
                        Skapa bara CV →
                    </Link>
                    <a href="mailto:support@portfolyo.se" className="hover:text-white transition-colors">
                        Behöver du hjälp?
                    </a>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="p-5 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-500">{icon}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{value.toLocaleString()}</div>
            <div className="text-sm text-zinc-500">{label}</div>
        </div>
    );
}

function ActionCard({
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
            className="p-5 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors group"
        >
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors mb-3">
                {icon}
            </div>
            <div className="font-medium mb-1">{title}</div>
            <div className="text-sm text-zinc-500">{description}</div>
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
                className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-2">Publicera din portfolio</h2>
                <p className="text-zinc-400 mb-6">
                    Välj ett användarnamn för din publika URL.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Användarnamn
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                            portfolyo.se/p/
                        </span>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="dittnamn"
                            className="w-full pl-32 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#ff4d4d]"
                            autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            {checking && (
                                <svg className="w-5 h-5 animate-spin text-zinc-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {!checking && available === true && (
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {!checking && available === false && (
                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {available === false && (
                        <p className="text-sm text-red-400 mt-2">Det användarnamnet är upptaget</p>
                    )}
                    {error && (
                        <p className="text-sm text-red-400 mt-2">{error}</p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-5 py-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={!available || username.length < 3 || publishing}
                        className="flex-1 px-5 py-3 bg-[#ff4d4d] text-white font-medium rounded-lg hover:bg-[#ff3333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

function EyeIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function DownloadIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function PaletteIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    );
}

function DocumentIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}
