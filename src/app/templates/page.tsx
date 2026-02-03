'use client';

// ============================================
// PORTFOLYO.SE - TEMPLATE GALLERY PAGE
// Fullständig mobilanpassning med premium UX
// + Hover Preview Modal med snygga effekter
// ============================================

import React, { useState, useMemo, useEffect, Suspense, useRef, useCallback } from 'react';
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
    X,
    ExternalLink,
    Maximize2,
} = Icons;

// ============================================
// TYPES
// ============================================

type ViewMode = 'portfolio' | 'cv';
type CategoryFilter = 'all' | string;

interface HoverPreview {
    template: TemplateConfig | CVTemplate;
    type: 'portfolio' | 'cv';
    position: { x: number; y: number };
}

// Helper to determine tier based on template index
function getTemplateTier(index: number, total: number): 'free' | 'starter' | 'pro' {
    const freeCount = Math.ceil(total * 0.1);
    const starterCount = Math.ceil(total * 0.4);
    if (index < freeCount) return 'free';
    if (index < freeCount + starterCount) return 'starter';
    return 'pro';
}

// ============================================
// TEMPLATE PREVIEW MODAL (Hover/Click)
// ============================================

interface PreviewModalProps {
    template: TemplateConfig | CVTemplate | null;
    type: 'portfolio' | 'cv';
    onClose: () => void;
    onSelect: () => void;
}

function PreviewModal({ template, type, onClose, onSelect }: PreviewModalProps) {
    if (!template) return null;

    const isPortfolio = type === 'portfolio';
    const portfolioTemplate = isPortfolio ? (template as TemplateConfig) : null;
    const cvTemplate = !isPortfolio ? (template as CVTemplate) : null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
                onClick={onClose}
            >
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                {/* Modal content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>

                    {/* Preview area */}
                    <div className="relative overflow-hidden">
                        {isPortfolio && portfolioTemplate ? (
                            <PortfolioPreviewLarge template={portfolioTemplate} />
                        ) : cvTemplate ? (
                            <CVPreviewLarge template={cvTemplate} />
                        ) : null}
                    </div>

                    {/* Info footer */}
                    <div className="p-6 bg-white border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="text-xl font-bold text-slate-900 mb-1">{template.name}</h2>
                                <p className="text-sm text-slate-500">{template.description}</p>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <Button variant="outline" size="sm" onClick={onClose}>
                                    Stäng
                                </Button>
                                <Button 
                                    size="sm" 
                                    onClick={onSelect}
                                    rightIcon={<ArrowRight className="w-4 h-4" />}
                                    className="shadow-lg shadow-violet-500/20"
                                >
                                    Använd template
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ============================================
// LARGE PORTFOLIO PREVIEW (for modal)
// ============================================

function PortfolioPreviewLarge({ template }: { template: TemplateConfig }) {
    const { colorScheme } = template;

    return (
        <div
            className="aspect-[16/10] p-6 sm:p-8 relative overflow-hidden"
            style={{ backgroundColor: colorScheme.bgPrimary }}
        >
            {/* Browser frame */}
            <div className="absolute inset-4 sm:inset-6 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                {/* Browser bar */}
                <div className="h-8 bg-slate-800/50 backdrop-blur flex items-center gap-2 px-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-4">
                        <div className="h-4 bg-white/10 rounded-full max-w-[200px] mx-auto" />
                    </div>
                </div>

                {/* Page content */}
                <div className="h-[calc(100%-2rem)] overflow-hidden" style={{ backgroundColor: colorScheme.bgPrimary }}>
                    {/* Navigation */}
                    <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colorScheme.bgSecondary }}>
                        <div className="h-5 w-24 rounded" style={{ backgroundColor: colorScheme.accent }} />
                        <div className="flex gap-4">
                            <div className="h-3 w-12 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.5 }} />
                            <div className="h-3 w-12 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.5 }} />
                            <div className="h-3 w-12 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.5 }} />
                        </div>
                    </div>

                    {/* Hero section */}
                    <div className="px-6 py-8">
                        <div className="max-w-md">
                            <div className="h-3 w-20 rounded mb-4" style={{ backgroundColor: colorScheme.accent }} />
                            <div className="h-8 w-full rounded mb-3" style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.9 }} />
                            <div className="h-8 w-3/4 rounded mb-6" style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.9 }} />
                            <div className="space-y-2 mb-6">
                                <div className="h-3 w-full rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.4 }} />
                                <div className="h-3 w-5/6 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.4 }} />
                                <div className="h-3 w-4/6 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.4 }} />
                            </div>
                            <div className="flex gap-3">
                                <div className="h-10 w-28 rounded-lg" style={{ backgroundColor: colorScheme.accent }} />
                                <div className="h-10 w-28 rounded-lg border-2" style={{ borderColor: colorScheme.textSecondary, opacity: 0.3 }} />
                            </div>
                        </div>
                    </div>

                    {/* Project cards */}
                    <div className="px-6 py-4">
                        <div className="h-4 w-32 rounded mb-4" style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.7 }} />
                        <div className="grid grid-cols-3 gap-4">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-[4/3] rounded-lg overflow-hidden"
                                    style={{ backgroundColor: colorScheme.bgSecondary }}
                                >
                                    <div className="h-2/3" style={{ backgroundColor: colorScheme.bgSecondary }} />
                                    <div className="h-1/3 p-2">
                                        <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.6 }} />
                                        <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.3 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative glow */}
            <div
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-40"
                style={{ backgroundColor: colorScheme.accent }}
            />
            <div
                className="absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: colorScheme.accent }}
            />
        </div>
    );
}

// ============================================
// LARGE CV PREVIEW (for modal)
// ============================================

function CVPreviewLarge({ template }: { template: CVTemplate }) {
    const { colors, layout } = template;

    return (
        <div className="aspect-[16/10] p-6 sm:p-8 bg-slate-100 relative overflow-hidden flex items-center justify-center">
            {/* A4 Paper */}
            <div
                className="w-full max-w-md aspect-[1/1.414] rounded-lg shadow-2xl overflow-hidden"
                style={{ backgroundColor: colors.background }}
            >
                {layout === 'two-column' || layout === 'sidebar' ? (
                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-1/3 p-4" style={{ backgroundColor: colors.primary }}>
                            {/* Photo */}
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-white/20" />
                            {/* Name */}
                            <div className="text-center mb-6">
                                <div className="h-3 w-3/4 rounded mx-auto mb-2 bg-white/80" />
                                <div className="h-2 w-1/2 rounded mx-auto bg-white/40" />
                            </div>
                            {/* Contact */}
                            <div className="space-y-2 mb-6">
                                <div className="h-2 w-full rounded bg-white/30" />
                                <div className="h-2 w-4/5 rounded bg-white/30" />
                                <div className="h-2 w-3/4 rounded bg-white/30" />
                            </div>
                            {/* Skills */}
                            <div className="h-2 w-1/2 rounded mb-3 bg-white/60" />
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full rounded bg-white/20" />
                                <div className="h-1.5 w-5/6 rounded bg-white/20" />
                                <div className="h-1.5 w-4/5 rounded bg-white/20" />
                                <div className="h-1.5 w-3/4 rounded bg-white/20" />
                            </div>
                        </div>
                        {/* Main content */}
                        <div className="flex-1 p-4">
                            {/* Experience header */}
                            <div className="h-3 w-1/3 rounded mb-4" style={{ backgroundColor: colors.primary }} />
                            {/* Experience items */}
                            {[0, 1].map((i) => (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between mb-1">
                                        <div className="h-2 w-1/3 rounded" style={{ backgroundColor: colors.text, opacity: 0.8 }} />
                                        <div className="h-2 w-1/5 rounded" style={{ backgroundColor: colors.muted }} />
                                    </div>
                                    <div className="h-2 w-1/4 rounded mb-2" style={{ backgroundColor: colors.accent }} />
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-full rounded" style={{ backgroundColor: colors.muted }} />
                                        <div className="h-1.5 w-5/6 rounded" style={{ backgroundColor: colors.muted }} />
                                        <div className="h-1.5 w-3/4 rounded" style={{ backgroundColor: colors.muted }} />
                                    </div>
                                </div>
                            ))}
                            {/* Education */}
                            <div className="h-3 w-1/4 rounded mb-3 mt-6" style={{ backgroundColor: colors.primary }} />
                            <div className="space-y-1">
                                <div className="h-2 w-2/3 rounded" style={{ backgroundColor: colors.text, opacity: 0.7 }} />
                                <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: colors.muted }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        {/* Header */}
                        <div className="text-center pb-4 mb-4 border-b" style={{ borderColor: colors.primary }}>
                            <div className="h-4 w-1/3 rounded mx-auto mb-2" style={{ backgroundColor: colors.text }} />
                            <div className="h-2 w-1/4 rounded mx-auto" style={{ backgroundColor: colors.primary }} />
                        </div>
                        {/* Contact row */}
                        <div className="flex justify-center gap-4 mb-4">
                            <div className="h-1.5 w-20 rounded" style={{ backgroundColor: colors.muted }} />
                            <div className="h-1.5 w-24 rounded" style={{ backgroundColor: colors.muted }} />
                            <div className="h-1.5 w-16 rounded" style={{ backgroundColor: colors.muted }} />
                        </div>
                        {/* Sections */}
                        {['Erfarenhet', 'Utbildning'].map((section, i) => (
                            <div key={section} className="mb-4">
                                <div className="h-2 w-1/4 rounded mb-3" style={{ backgroundColor: colors.accent }} />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-2 w-1/3 rounded" style={{ backgroundColor: colors.text, opacity: 0.8 }} />
                                        <div className="h-2 w-1/6 rounded" style={{ backgroundColor: colors.muted }} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-full rounded" style={{ backgroundColor: colors.muted }} />
                                        <div className="h-1.5 w-4/5 rounded" style={{ backgroundColor: colors.muted }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: colors.primary }} />
        </div>
    );
}

// ============================================
// PORTFOLIO TEMPLATE CARD - Mobile Optimized
// Med skarpare, mer detaljerad preview
// ============================================

interface PortfolioCardProps {
    template: TemplateConfig;
    index: number;
    totalCount: number;
    isSelected: boolean;
    onSelect: () => void;
    onPreview: () => void;
}

function PortfolioTemplateCard({ template, index, totalCount, isSelected, onSelect, onPreview }: PortfolioCardProps) {
    const { colorScheme } = template;
    const tier = getTemplateTier(index, totalCount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 active:scale-[0.98] ${isSelected
                ? 'border-violet-500 ring-4 ring-violet-500/20'
                : 'border-slate-200 hover:border-slate-300'
                }`}
            onClick={onSelect}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Preview area - Skarpare design */}
            <div
                className="aspect-[4/3] relative overflow-hidden"
                style={{ backgroundColor: colorScheme.bgPrimary }}
            >
                {/* Mini browser frame */}
                <div className="absolute inset-2 sm:inset-3 rounded-lg overflow-hidden shadow-lg border border-white/10">
                    {/* Browser bar */}
                    <div className="h-4 sm:h-5 flex items-center gap-1 px-2" style={{ backgroundColor: colorScheme.bgSecondary }}>
                        <div className="flex gap-0.5 sm:gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/80" />
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400/80" />
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/80" />
                        </div>
                    </div>

                    {/* Page content */}
                    <div className="h-[calc(100%-1rem)] sm:h-[calc(100%-1.25rem)] p-2 sm:p-3" style={{ backgroundColor: colorScheme.bgPrimary }}>
                        {/* Nav */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="h-1.5 sm:h-2 w-8 sm:w-12 rounded" style={{ backgroundColor: colorScheme.accent }} />
                            <div className="flex gap-1 sm:gap-2">
                                <div className="h-1 sm:h-1.5 w-4 sm:w-6 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.4 }} />
                                <div className="h-1 sm:h-1.5 w-4 sm:w-6 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.4 }} />
                            </div>
                        </div>

                        {/* Hero text */}
                        <div className="mb-2 sm:mb-3">
                            <div className="h-2 sm:h-3 w-3/4 rounded mb-1" style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.9 }} />
                            <div className="h-2 sm:h-3 w-1/2 rounded mb-1.5 sm:mb-2" style={{ backgroundColor: colorScheme.textPrimary, opacity: 0.9 }} />
                            <div className="h-1 sm:h-1.5 w-full rounded mb-0.5" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.3 }} />
                            <div className="h-1 sm:h-1.5 w-2/3 rounded" style={{ backgroundColor: colorScheme.textSecondary, opacity: 0.3 }} />
                        </div>

                        {/* CTA Button */}
                        <div className="h-3 sm:h-4 w-12 sm:w-16 rounded" style={{ backgroundColor: colorScheme.accent }} />

                        {/* Project cards row */}
                        <div className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex-1 aspect-square rounded"
                                    style={{ backgroundColor: colorScheme.bgSecondary }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Accent glow */}
                <div
                    className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-60"
                    style={{ backgroundColor: colorScheme.accent }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 rounded-full bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                        }}
                    >
                        <Maximize2 className="w-5 h-5 text-slate-700" />
                    </motion.button>
                </div>

                {/* Mobile preview button */}
                <button
                    className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/60 backdrop-blur-sm text-white sm:hidden active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview();
                    }}
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            {/* Info */}
            <div className="p-3 sm:p-4 bg-white">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-1">{template.name}</h3>
                    {tier !== 'free' && (
                        <Badge variant={tier === 'pro' ? 'default' : 'outline'} className="text-[10px] sm:text-xs shrink-0">
                            {tier === 'pro' ? 'PRO' : 'STARTER'}
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{template.description}</p>

                {/* Color swatches */}
                <div className="flex gap-1 mt-2 sm:mt-3">
                    <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colorScheme.bgPrimary }}
                    />
                    <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colorScheme.accent }}
                    />
                    <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colorScheme.textPrimary }}
                    />
                </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-500 flex items-center justify-center shadow-lg"
                >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
            )}
        </motion.div>
    );
}

// ============================================
// CV TEMPLATE CARD - Mobile Optimized
// ============================================

interface CVCardProps {
    template: CVTemplate;
    isSelected: boolean;
    onSelect: () => void;
    onPreview: () => void;
}

function CVTemplateCard({ template, isSelected, onSelect, onPreview }: CVCardProps) {
    const { colors, layout } = template;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 active:scale-[0.98] ${isSelected
                ? 'border-violet-500 ring-4 ring-violet-500/20'
                : 'border-slate-200 hover:border-slate-300'
                }`}
            onClick={onSelect}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* A4 Preview */}
            <div
                className="aspect-[1/1.2] p-2 sm:p-3 relative"
                style={{ backgroundColor: colors.background }}
            >
                {layout === 'two-column' || layout === 'sidebar' ? (
                    <div className="flex h-full gap-1.5 sm:gap-2">
                        {/* Sidebar */}
                        <div
                            className="w-1/3 p-1.5 sm:p-2 rounded"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto mb-1.5 sm:mb-2 bg-white/20" />
                            <div className="space-y-0.5 sm:space-y-1">
                                <div className="h-1 sm:h-1.5 w-full rounded bg-white/30" />
                                <div className="h-0.5 sm:h-1 w-3/4 rounded bg-white/20 mx-auto" />
                            </div>
                            <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1">
                                <div className="h-0.5 sm:h-1 w-full rounded bg-white/15" />
                                <div className="h-0.5 sm:h-1 w-2/3 rounded bg-white/15" />
                                <div className="h-0.5 sm:h-1 w-4/5 rounded bg-white/15" />
                            </div>
                        </div>
                        {/* Main content */}
                        <div className="flex-1 p-1.5 sm:p-2">
                            <div
                                className="h-1.5 sm:h-2 w-3/4 rounded mb-1.5 sm:mb-2"
                                style={{ backgroundColor: colors.primary }}
                            />
                            <div className="space-y-0.5 sm:space-y-1">
                                <div className="h-0.5 sm:h-1 w-full rounded" style={{ backgroundColor: colors.muted }} />
                                <div className="h-0.5 sm:h-1 w-5/6 rounded" style={{ backgroundColor: colors.muted }} />
                                <div className="h-0.5 sm:h-1 w-4/6 rounded" style={{ backgroundColor: colors.muted }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full">
                        <div
                            className="text-center pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b"
                            style={{ borderColor: colors.primary }}
                        >
                            <div
                                className="h-1.5 sm:h-2 w-1/2 rounded mx-auto mb-0.5 sm:mb-1"
                                style={{ backgroundColor: colors.text }}
                            />
                            <div
                                className="h-1 sm:h-1.5 w-1/3 rounded mx-auto"
                                style={{ backgroundColor: colors.primary }}
                            />
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                            <div
                                className="h-1 sm:h-1.5 w-1/4 rounded"
                                style={{ backgroundColor: colors.accent }}
                            />
                            <div className="space-y-0.5 sm:space-y-1">
                                <div className="h-0.5 sm:h-1 w-full rounded" style={{ backgroundColor: colors.muted }} />
                                <div className="h-0.5 sm:h-1 w-5/6 rounded" style={{ backgroundColor: colors.muted }} />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Hover overlay with preview button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 rounded-full bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                        }}
                    >
                        <Maximize2 className="w-5 h-5 text-slate-700" />
                    </motion.button>
                </div>

                {/* Mobile preview button */}
                <button
                    className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/60 backdrop-blur-sm text-white sm:hidden active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview();
                    }}
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            {/* Info */}
            <div className="p-3 sm:p-4 bg-white">
                <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-1">{template.name}</h3>
                    <div className="flex gap-0.5 sm:gap-1 shrink-0">
                        {template.atsOptimized && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs text-emerald-600 border-emerald-200 px-1.5 sm:px-2">
                                ATS
                            </Badge>
                        )}
                        {template.tier !== 'free' && (
                            <Badge variant={template.tier === 'pro' ? 'default' : 'outline'} className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                                {template.tier === 'pro' ? 'PRO' : 'STARTER'}
                            </Badge>
                        )}
                    </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{template.description}</p>

                {/* Color swatches */}
                <div className="flex gap-1 mt-2 sm:mt-3">
                    <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colors.primary }}
                    />
                    <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colors.accent }}
                    />
                    <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: colors.background }}
                    />
                </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-500 flex items-center justify-center shadow-lg"
                >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
            )}
        </motion.div>
    );
}

// ============================================
// MOBILE FILTER DRAWER
// ============================================

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    categoryLabels: Record<string, string>;
    selectedCategory: string;
    onSelectCategory: (cat: string) => void;
}

function FilterDrawer({
    isOpen,
    onClose,
    categories,
    categoryLabels,
    selectedCategory,
    onSelectCategory,
}: FilterDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 rounded-full bg-slate-200" />
                        </div>

                        <div className="px-6 pb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Filter</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Kategorier</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                onSelectCategory(cat);
                                                onClose();
                                            }}
                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${selectedCategory === cat
                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {categoryLabels[cat] || cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
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
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    
    // Preview modal state
    const [previewTemplate, setPreviewTemplate] = useState<TemplateConfig | CVTemplate | null>(null);
    const [previewType, setPreviewType] = useState<'portfolio' | 'cv'>('portfolio');

    // Open preview modal
    const openPreview = useCallback((template: TemplateConfig | CVTemplate, type: 'portfolio' | 'cv') => {
        setPreviewTemplate(template);
        setPreviewType(type);
    }, []);

    // Close preview modal
    const closePreview = useCallback(() => {
        setPreviewTemplate(null);
    }, []);

    // Check URL for initial view mode
    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'cv') {
            setViewMode('cv');
        }
    }, [searchParams]);

    // User tier - set to 'pro' during development
    const userTier: 'free' | 'starter' | 'pro' = 'pro';

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

        return filtered;
    }, [searchQuery, categoryFilter]);

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

        return filtered;
    }, [searchQuery, categoryFilter]);

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

    // Stats
    const freePortfolioCount = Math.ceil(templates.length * 0.1);
    const freeCVCount = ALL_CV_TEMPLATES.filter(t => t.tier === 'free').length;
    const freeCount = viewMode === 'portfolio' ? freePortfolioCount : freeCVCount;
    const totalCount = viewMode === 'portfolio' ? templates.length : ALL_CV_TEMPLATES.length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header - Mobile Optimized */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back + Title */}
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <Link
                                href="/dashboard"
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0 active:scale-95"
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-600" />
                            </Link>
                            <div className="min-w-0">
                                <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">Välj Template</h1>
                                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                                    {freeCount} gratis • {totalCount} totalt
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Mobile: Show count badge */}
                            <span className="text-xs text-slate-500 sm:hidden">{totalCount} templates</span>

                            {/* Desktop: Full button */}
                            <Button
                                onClick={handleStartCreation}
                                size="sm"
                                className="hidden sm:flex"
                                rightIcon={<ArrowRight className="h-4 w-4" />}
                            >
                                {selectedTemplate ? `Skapa` : `Skapa ${viewMode === 'portfolio' ? 'Portfolio' : 'CV'}`}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* View Mode Toggle - Mobile Optimized */}
            <div className="bg-white border-b border-slate-200 sticky top-[57px] sm:top-[65px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    {/* Toggle buttons - Full width on mobile */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => {
                                setViewMode('portfolio');
                                setCategoryFilter('all');
                                setSearchQuery('');
                            }}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all active:scale-[0.98] ${viewMode === 'portfolio'
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-600'
                                }`}
                        >
                            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">Portfolio</span>
                            <Badge variant={viewMode === 'portfolio' ? 'default' : 'outline'} className="text-[10px] sm:text-xs ml-1">
                                {templates.length}
                            </Badge>
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('cv');
                                setCategoryFilter('all');
                                setSearchQuery('');
                            }}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all active:scale-[0.98] ${viewMode === 'cv'
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-600'
                                }`}
                        >
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">CV</span>
                            <Badge variant={viewMode === 'cv' ? 'default' : 'outline'} className="text-[10px] sm:text-xs ml-1">
                                {ALL_CV_TEMPLATES.length}
                            </Badge>
                        </button>
                    </div>

                    {/* Search + Filter row */}
                    <div className="flex gap-2 sm:gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Sök..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                            />
                        </div>

                        {/* Mobile: Filter button */}
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
                        >
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop: Category pills - Scrollable */}
                    <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
                        {currentCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${categoryFilter === cat
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {categoryLabels[cat] || cat}
                            </button>
                        ))}
                    </div>

                    {/* Mobile: Horizontal scroll categories */}
                    <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 mt-3 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2">
                            {currentCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap active:scale-95 ${categoryFilter === cat
                                        ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {categoryLabels[cat] || cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Drawer - Mobile */}
            <FilterDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                categories={currentCategories}
                categoryLabels={categoryLabels}
                selectedCategory={categoryFilter}
                onSelectCategory={setCategoryFilter}
            />

            {/* Template Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-32">
                {viewMode === 'portfolio' ? (
                    <>
                        {/* Count */}
                        <div className="mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-slate-500">
                                Visar {filteredPortfolioTemplates.length} av {templates.length} portfolio-templates
                            </p>
                        </div>

                        {/* Grid - 2 columns on mobile, scales up */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredPortfolioTemplates.map((template, displayIndex) => (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: Math.min(displayIndex * 0.02, 0.3) }}
                                    >
                                        <PortfolioTemplateCard
                                            template={template}
                                            index={template._index}
                                            totalCount={templates.length}
                                            isSelected={selectedPortfolioTemplate === template.id}
                                            onSelect={() => setSelectedPortfolioTemplate(template.id)}
                                            onPreview={() => openPreview(template, 'portfolio')}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Empty state */}
                        {filteredPortfolioTemplates.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12 sm:py-16"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Inga templates hittades</h3>
                                <p className="text-sm text-slate-500 px-4">Prova att ändra filter eller sökord</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => {
                                        setCategoryFilter('all');
                                        setSearchQuery('');
                                    }}
                                >
                                    Återställ filter
                                </Button>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <>
                        {/* CV info banner - Mobile optimized */}
                        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm text-slate-500">
                                Visar {filteredCVTemplates.length} av {ALL_CV_TEMPLATES.length} CV-templates
                            </p>
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>ATS = Optimerad för rekryteringssystem</span>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredCVTemplates.map((template, index) => (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: Math.min(index * 0.02, 0.3) }}
                                    >
                                        <CVTemplateCard
                                            template={template}
                                            isSelected={selectedCVTemplate === template.id}
                                            onSelect={() => setSelectedCVTemplate(template.id)}
                                            onPreview={() => openPreview(template, 'cv')}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Empty state */}
                        {filteredCVTemplates.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12 sm:py-16"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Inga templates hittades</h3>
                                <p className="text-sm text-slate-500 px-4">Prova att ändra filter eller sökord</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => {
                                        setCategoryFilter('all');
                                        setSearchQuery('');
                                    }}
                                >
                                    Återställ filter
                                </Button>
                            </motion.div>
                        )}
                    </>
                )}
            </main>

            {/* Fixed Bottom Bar - Mobile First Design */}
            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-2xl"
                    >
                        {/* Safe area padding for iPhone notch */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4">
                            <div className="max-w-7xl mx-auto">
                                {/* Mobile layout - Stacked */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    {/* Template info */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0 shadow-lg"
                                            style={{
                                                backgroundColor: viewMode === 'portfolio'
                                                    ? (selectedTemplate as TemplateConfig).colorScheme?.bgPrimary
                                                    : (selectedTemplate as CVTemplate).colors?.primary
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{selectedTemplate.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{selectedTemplate.description}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 sm:flex-none"
                                            onClick={() => {
                                                if (viewMode === 'portfolio') {
                                                    setSelectedPortfolioTemplate(null);
                                                } else {
                                                    setSelectedCVTemplate(null);
                                                }
                                            }}
                                        >
                                            <X className="w-4 h-4 sm:mr-1" />
                                            <span className="hidden sm:inline">Avbryt</span>
                                        </Button>
                                        <Button
                                            onClick={handleStartCreation}
                                            size="sm"
                                            className="flex-1 sm:flex-none shadow-lg shadow-violet-500/20"
                                            rightIcon={<ArrowRight className="w-4 h-4" />}
                                        >
                                            <span className="sm:hidden">Fortsätt</span>
                                            <span className="hidden sm:inline">Fortsätt med {selectedTemplate.name}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating action button when nothing selected - Mobile only */}
            <AnimatePresence>
                {!selectedTemplate && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-4 sm:hidden z-40"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                    >
                        <Button
                            onClick={handleStartCreation}
                            size="lg"
                            className="rounded-full shadow-2xl shadow-violet-500/30 pl-5 pr-4"
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            Skapa
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            {previewTemplate && (
                <PreviewModal
                    template={previewTemplate}
                    type={previewType}
                    onClose={closePreview}
                    onSelect={() => {
                        if (previewType === 'portfolio') {
                            setSelectedPortfolioTemplate((previewTemplate as TemplateConfig).id);
                        } else {
                            setSelectedCVTemplate((previewTemplate as CVTemplate).id);
                        }
                        closePreview();
                    }}
                />
            )}
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-slate-500">Laddar templates...</p>
                </motion.div>
            </div>
        }>
            <TemplatesPageContent />
        </Suspense>
    );
}
