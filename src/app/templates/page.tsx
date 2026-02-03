'use client';

// ============================================
// PORTFOLYO.SE - TEMPLATE GALLERY PAGE
// Visa ALLA templates innan onboarding
// ============================================

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge, Icons } from '@/components/ui';
import { templates, type TemplateConfig } from '@/lib/templates';
import { ALL_CV_TEMPLATES, type CVTemplate } from '@/lib/templates';

const {
    ArrowLeft,
    ArrowRight,
    Globe,
    FileText,
    Eye,
    Crown,
    Lock,
    Check,
    Sparkles,
    Zap,
} = Icons;

// ============================================
// TYPES
// ============================================

type ViewMode = 'portfolio' | 'cv';
type CategoryFilter = 'all' | string;

// Helper to determine tier based on template index
function getTemplateTier(index: number, total: number): 'free' | 'starter' | 'pro' {
    const freeCount = Math.ceil(total * 0.1); // 10% free
    const starterCount = Math.ceil(total * 0.4); // 40% starter
    if (index < freeCount) return 'free';
    if (index < freeCount + starterCount) return 'starter';
    return 'pro';
}

// ============================================
// PORTFOLIO TEMPLATE CARD
// ============================================

interface PortfolioCardProps {
    template: TemplateConfig;
    index: number;
    totalCount: number;
    isSelected: boolean;
    isLocked: boolean;
    onSelect: () => void;
    onPreview: () => void;
}

function PortfolioTemplateCard({ template, index, totalCount, isSelected, isLocked, onSelect, onPreview }: PortfolioCardProps) {
    const { colorScheme } = template;
    const tier = getTemplateTier(index, totalCount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${isSelected
                    ? 'border-violet-500 ring-4 ring-violet-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isLocked ? 'opacity-70' : ''}`}
            onClick={isLocked ? undefined : onSelect}
            whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
        >
            {/* Preview area */}
            <div
                className="aspect-[4/3] p-4 relative overflow-hidden"
                style={{ backgroundColor: colorScheme.bgPrimary }}
            >
                {/* Mini layout preview */}
                <div className="absolute inset-4">
                    <div
                        className="h-2 w-16 rounded mb-3"
                        style={{ backgroundColor: colorScheme.accent }}
                    />
                    <div
                        className="h-4 w-32 rounded mb-2"
                        style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.8 }}
                    />
                    <div
                        className="h-2 w-24 rounded mb-4"
                        style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.5 }}
                    />
                    <div className="flex gap-2">
                        <div
                            className="h-12 w-12 rounded"
                            style={{ backgroundColor: colorScheme.bgSecondary }}
                        />
                        <div className="flex-1 space-y-1">
                            <div
                                className="h-2 w-full rounded"
                                style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.3 }}
                            />
                            <div
                                className="h-2 w-3/4 rounded"
                                style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.3 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Accent orb */}
                <div
                    className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30"
                    style={{ backgroundColor: colorScheme.accent }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                        }}
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        Förhandsgranska
                    </Button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-white">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{template.name}</h3>
                    {tier !== 'free' && (
                        <Badge variant={tier === 'pro' ? 'default' : 'outline'} className="text-xs">
                            {tier === 'pro' ? 'PRO' : 'STARTER'}
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{template.description}</p>

                {/* Color swatches */}
                <div className="flex gap-1 mt-3">
                    <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colorScheme.bgPrimary }}
                        title="Bakgrund"
                    />
                    <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colorScheme.accent }}
                        title="Accent"
                    />
                    <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colorScheme.textPrimary }}
                        title="Text"
                    />
                </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Locked overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-center">
                        <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs text-slate-500 font-medium">
                            {tier === 'pro' ? 'Pro' : 'Starter'}
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// ============================================
// CV TEMPLATE CARD
// ============================================

interface CVCardProps {
    template: CVTemplate;
    isSelected: boolean;
    isLocked: boolean;
    onSelect: () => void;
}

function CVTemplateCard({ template, isSelected, isLocked, onSelect }: CVCardProps) {
    const { colors, layout } = template;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${isSelected
                    ? 'border-violet-500 ring-4 ring-violet-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isLocked ? 'opacity-70' : ''}`}
            onClick={isLocked ? undefined : onSelect}
            whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
        >
            {/* A4 Preview */}
            <div
                className="aspect-[1/1.2] p-3 relative"
                style={{ backgroundColor: colors.background }}
            >
                {layout === 'two-column' || layout === 'sidebar' ? (
                    <div className="flex h-full gap-2">
                        {/* Sidebar */}
                        <div
                            className="w-1/3 p-2 rounded"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <div className="w-8 h-8 rounded-full mx-auto mb-2 bg-white/20" />
                            <div className="space-y-1">
                                <div className="h-1.5 w-full rounded bg-white/30" />
                                <div className="h-1 w-3/4 rounded bg-white/20 mx-auto" />
                            </div>
                            <div className="mt-3 space-y-1">
                                <div className="h-1 w-full rounded bg-white/15" />
                                <div className="h-1 w-2/3 rounded bg-white/15" />
                                <div className="h-1 w-4/5 rounded bg-white/15" />
                            </div>
                        </div>
                        {/* Main content */}
                        <div className="flex-1 p-2">
                            <div
                                className="h-2 w-3/4 rounded mb-2"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <div className="space-y-1">
                                <div className="h-1 w-full rounded" style={{ backgroundColor: colors.muted }} />
                                <div className="h-1 w-5/6 rounded" style={{ backgroundColor: colors.muted }} />
                                <div className="h-1 w-4/6 rounded" style={{ backgroundColor: colors.muted }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full">
                        <div
                            className="text-center pb-2 mb-2 border-b"
                            style={{ borderColor: colors.primary }}
                        >
                            <div
                                className="h-2 w-1/2 rounded mx-auto mb-1"
                                style={{ backgroundColor: colors.text }}
                            />
                            <div
                                className="h-1.5 w-1/3 rounded mx-auto"
                                style={{ backgroundColor: colors.primary }}
                            />
                        </div>
                        <div className="space-y-2">
                            <div
                                className="h-1.5 w-1/4 rounded"
                                style={{ backgroundColor: colors.accent }}
                            />
                            <div className="space-y-1">
                                <div className="h-1 w-full rounded" style={{ backgroundColor: colors.muted }} />
                                <div className="h-1 w-5/6 rounded" style={{ backgroundColor: colors.muted }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 bg-white">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{template.name}</h3>
                    <div className="flex gap-1">
                        {template.atsOptimized && (
                            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
                                ATS
                            </Badge>
                        )}
                        {template.tier !== 'free' && (
                            <Badge variant={template.tier === 'pro' ? 'default' : 'outline'} className="text-xs">
                                {template.tier === 'pro' ? 'PRO' : 'STARTER'}
                            </Badge>
                        )}
                    </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{template.description}</p>

                {/* Color swatches */}
                <div className="flex gap-1 mt-3">
                    <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colors.primary }}
                        title="Primär"
                    />
                    <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colors.accent }}
                        title="Accent"
                    />
                    <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colors.background }}
                        title="Bakgrund"
                    />
                </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Locked overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-center">
                        <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs text-slate-500 font-medium">
                            {template.tier === 'pro' ? 'Pro' : 'Starter'}
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// ============================================
// INNER COMPONENT WITH SEARCH PARAMS
// ============================================

function TemplatesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<ViewMode>('portfolio');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [selectedPortfolioTemplate, setSelectedPortfolioTemplate] = useState<string | null>(null);
    const [selectedCVTemplate, setSelectedCVTemplate] = useState<string | null>(null);
    const [showLockedTemplates, setShowLockedTemplates] = useState(true);

    // Check URL for initial view mode
    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'cv') {
            setViewMode('cv');
        }
    }, [searchParams]);

    // User tier (would come from auth in real app)
    const userTier: 'free' | 'starter' | 'pro' = 'free';

    const canUseTier = (tier: 'free' | 'starter' | 'pro') => {
        const tierHierarchy = { free: 0, starter: 1, pro: 2 };
        return tierHierarchy[tier] <= tierHierarchy[userTier];
    };

    // Portfolio categories
    const portfolioCategories = useMemo(() => {
        const cats = new Set(templates.map(t => t.category));
        return ['all', ...Array.from(cats)];
    }, []);

    // CV categories
    const cvCategories = useMemo(() => {
        const cats = new Set(ALL_CV_TEMPLATES.map(t => t.category));
        return ['all', ...Array.from(cats)];
    }, []);

    // Filtered portfolio templates
    const filteredPortfolioTemplates = useMemo(() => {
        let filtered = templates.map((t, i) => ({ ...t, _index: i }));

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                t => t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.tags?.some(tag => tag.toLowerCase().includes(q))
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        if (!showLockedTemplates) {
            filtered = filtered.filter(t => canUseTier(getTemplateTier(t._index, templates.length)));
        }

        return filtered;
    }, [searchQuery, categoryFilter, showLockedTemplates, userTier]);

    // Filtered CV templates
    const filteredCVTemplates = useMemo(() => {
        let filtered = [...ALL_CV_TEMPLATES];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                t => t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q)
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        if (!showLockedTemplates) {
            filtered = filtered.filter(t => canUseTier(t.tier));
        }

        return filtered;
    }, [searchQuery, categoryFilter, showLockedTemplates, userTier]);

    // Category labels
    const categoryLabels: Record<string, string> = {
        all: 'Alla',
        developer: 'Utvecklare',
        designer: 'Designer',
        minimal: 'Minimal',
        creative: 'Kreativ',
        professional: 'Professionell',
        bold: 'Modig',
        elegant: 'Elegant',
        modern: 'Modern',
        classic: 'Klassisk',
        tech: 'Tech',
        artistic: 'Konstnärlig',
        startup: 'Startup',
    };

    const currentCategories = viewMode === 'portfolio' ? portfolioCategories : cvCategories;

    const handleStartCreation = () => {
        if (viewMode === 'portfolio') {
            if (selectedPortfolioTemplate) {
                router.push(`/portfolio/new?template=${selectedPortfolioTemplate}`);
            } else {
                router.push('/portfolio/new');
            }
        } else {
            if (selectedCVTemplate) {
                router.push(`/cv/new?template=${selectedCVTemplate}`);
            } else {
                router.push('/cv/new');
            }
        }
    };

    const selectedTemplate = viewMode === 'portfolio'
        ? templates.find(t => t.id === selectedPortfolioTemplate)
        : ALL_CV_TEMPLATES.find(t => t.id === selectedCVTemplate);

    const selectedPortfolioIndex = templates.findIndex(t => t.id === selectedPortfolioTemplate);
    const selectedPortfolioTier = selectedPortfolioIndex >= 0 ? getTemplateTier(selectedPortfolioIndex, templates.length) : 'free';

    const isSelectedTemplateLocked = selectedTemplate && (
        viewMode === 'portfolio'
            ? !canUseTier(selectedPortfolioTier)
            : !canUseTier((selectedTemplate as CVTemplate).tier)
    );

    // Stats
    const freePortfolioCount = Math.ceil(templates.length * 0.1);
    const freeCVCount = ALL_CV_TEMPLATES.filter(t => t.tier === 'free').length;
    const freeCount = viewMode === 'portfolio' ? freePortfolioCount : freeCVCount;
    const totalCount = viewMode === 'portfolio' ? templates.length : ALL_CV_TEMPLATES.length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Välj Template</h1>
                                <p className="text-sm text-slate-500">
                                    {freeCount} gratis • {totalCount} totalt
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {userTier === 'free' && (
                                <Link href="/upgrade">
                                    <Badge variant="outline" className="gap-1.5 cursor-pointer hover:bg-violet-50 hover:border-violet-300">
                                        <Crown className="h-3.5 w-3.5 text-violet-500" />
                                        Lås upp alla templates
                                    </Badge>
                                </Link>
                            )}

                            <Button
                                onClick={handleStartCreation}
                                disabled={!!isSelectedTemplateLocked}
                                rightIcon={<ArrowRight className="h-4 w-4" />}
                            >
                                {selectedTemplate
                                    ? `Skapa med ${selectedTemplate.name}`
                                    : `Skapa ${viewMode === 'portfolio' ? 'Portfolio' : 'CV'}`
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* View mode toggle + filters */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* View mode toggle */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <button
                            onClick={() => {
                                setViewMode('portfolio');
                                setCategoryFilter('all');
                                setSearchQuery('');
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${viewMode === 'portfolio'
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Globe className="h-5 w-5" />
                            Portfolio Templates
                            <Badge variant={viewMode === 'portfolio' ? 'default' : 'outline'} className="ml-1">
                                {templates.length}
                            </Badge>
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('cv');
                                setCategoryFilter('all');
                                setSearchQuery('');
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${viewMode === 'cv'
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <FileText className="h-5 w-5" />
                            CV Templates
                            <Badge variant={viewMode === 'cv' ? 'default' : 'outline'} className="ml-1">
                                {ALL_CV_TEMPLATES.length}
                            </Badge>
                        </button>
                    </div>

                    {/* Search and filters */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Sök templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            {currentCategories.slice(0, 8).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${categoryFilter === cat
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {categoryLabels[cat] || cat}
                                </button>
                            ))}
                        </div>

                        {/* Show locked toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLockedTemplates}
                                onChange={(e) => setShowLockedTemplates(e.target.checked)}
                                className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-sm text-slate-600">Visa låsta</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Template Grid */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {viewMode === 'portfolio' ? (
                    <>
                        {/* Portfolio templates */}
                        <div className="mb-6">
                            <p className="text-sm text-slate-500">
                                Visar {filteredPortfolioTemplates.length} av {templates.length} portfolio-templates
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredPortfolioTemplates.map((template, displayIndex) => {
                                    const tier = getTemplateTier(template._index, templates.length);
                                    return (
                                        <motion.div
                                            key={template.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: displayIndex * 0.02 }}
                                        >
                                            <PortfolioTemplateCard
                                                template={template}
                                                index={template._index}
                                                totalCount={templates.length}
                                                isSelected={selectedPortfolioTemplate === template.id}
                                                isLocked={!canUseTier(tier)}
                                                onSelect={() => setSelectedPortfolioTemplate(template.id)}
                                                onPreview={() => console.log('Preview:', template.id)}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {filteredPortfolioTemplates.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Inga templates hittades</h3>
                                <p className="text-slate-500">Prova att ändra dina filter eller sökord</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* CV templates */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Visar {filteredCVTemplates.length} av {ALL_CV_TEMPLATES.length} CV-templates
                            </p>
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                <Sparkles className="w-4 h-4" />
                                <span>ATS = Optimerad för rekryteringssystem</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredCVTemplates.map((template, index) => (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.02 }}
                                    >
                                        <CVTemplateCard
                                            template={template}
                                            isSelected={selectedCVTemplate === template.id}
                                            isLocked={!canUseTier(template.tier)}
                                            onSelect={() => setSelectedCVTemplate(template.id)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredCVTemplates.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Inga templates hittades</h3>
                                <p className="text-slate-500">Prova att ändra dina filter eller sökord</p>
                            </div>
                        )}
                    </>
                )}

                {/* Upgrade CTA for free users */}
                {userTier === 'free' && (
                    <div className="mt-12 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
                        <Crown className="w-12 h-12 mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold mb-2">Lås upp alla {totalCount} templates</h3>
                        <p className="text-violet-100 mb-6 max-w-md mx-auto">
                            Uppgradera till Starter eller Pro för tillgång till premium-templates och fler funktioner.
                        </p>
                        <Link href="/upgrade">
                            <Button variant="outline" size="lg" rightIcon={<Zap className="w-5 h-5" />} className="bg-white text-violet-600 border-white hover:bg-violet-50">
                                Se planer & priser
                            </Button>
                        </Link>
                    </div>
                )}
            </main>

            {/* Fixed bottom bar when template is selected */}
            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-50"
                    >
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl"
                                    style={{
                                        backgroundColor: viewMode === 'portfolio'
                                            ? (selectedTemplate as TemplateConfig).colorScheme?.bgPrimary
                                            : (selectedTemplate as CVTemplate).colors?.primary
                                    }}
                                />
                                <div>
                                    <h4 className="font-semibold text-slate-900">{selectedTemplate.name}</h4>
                                    <p className="text-sm text-slate-500">{selectedTemplate.description}</p>
                                </div>
                                {isSelectedTemplateLocked && (
                                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                                        <Lock className="w-3 h-3 mr-1" />
                                        Kräver uppgradering
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        if (viewMode === 'portfolio') {
                                            setSelectedPortfolioTemplate(null);
                                        } else {
                                            setSelectedCVTemplate(null);
                                        }
                                    }}
                                >
                                    Avbryt val
                                </Button>
                                {isSelectedTemplateLocked ? (
                                    <Link href="/upgrade">
                                        <Button rightIcon={<Crown className="w-4 h-4" />}>
                                            Uppgradera för att använda
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        onClick={handleStartCreation}
                                        rightIcon={<ArrowRight className="w-4 h-4" />}
                                    >
                                        Fortsätt med {selectedTemplate.name}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function TemplatesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
            </div>
        }>
            <TemplatesPageContent />
        </Suspense>
    );
}
