'use client';

// ============================================
// PORTFOLYO.SE - Enterprise Template Gallery
// Beautiful template selection with live previews
// ============================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  templates,
  type TemplateConfig,
  type TemplateCategory,
  categoryDescriptions,
  ALL_CV_TEMPLATES,
  type CVTemplate,
} from '@/lib/templates';
import { Icons } from '@/components/ui';

const {
  Search, Filter, Check, Lock, Star, Sparkles, Zap,
  Grid, LayoutGrid, Crown, Eye, ChevronRight,
} = Icons;

// ============================================
// TYPES
// ============================================

interface TemplateGalleryProps {
  type: 'portfolio' | 'cv';
  selectedId?: string;
  onSelect: (id: string) => void;
  userTier: 'free' | 'starter' | 'pro';
  showPreview?: boolean;
}

// ============================================
// PORTFOLIO TEMPLATE CARD
// ============================================

interface PortfolioTemplateCardProps {
  template: TemplateConfig;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
  onPreview?: () => void;
}

function PortfolioTemplateCard({
  template,
  isSelected,
  isLocked,
  onClick,
  onPreview,
}: PortfolioTemplateCardProps) {
  const { colorScheme, typography, features } = template;

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${isSelected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900' : ''
        } ${isLocked ? 'opacity-60' : ''}`}
      onClick={isLocked ? undefined : onClick}
      whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
      style={{
        backgroundColor: colorScheme.bgCard || colorScheme.bgSecondary,
      }}
    >
      {/* Preview area */}
      <div
        className="aspect-[4/3] p-6 relative overflow-hidden"
        style={{
          backgroundColor: colorScheme.bgPrimary,
        }}
      >
        {/* Mini orbs for effect */}
        {features.includes('floatingOrbs') && (
          <>
            <div
              className="absolute w-20 h-20 rounded-full blur-xl opacity-40"
              style={{
                background: `radial-gradient(circle, ${colorScheme.accentGlow} 0%, transparent 70%)`,
                top: '-10%',
                right: '-5%',
              }}
            />
            <div
              className="absolute w-12 h-12 rounded-full blur-lg opacity-30"
              style={{
                background: `radial-gradient(circle, ${colorScheme.accentGlow} 0%, transparent 70%)`,
                bottom: '10%',
                left: '5%',
              }}
            />
          </>
        )}

        {/* Noise overlay */}
        {features.includes('noiseTexture') && (
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Mini preview content */}
        <div className="relative z-10">
          {/* Fake header */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: colorScheme.accent }}
            />
            <div
              className="h-2 w-12 rounded"
              style={{ backgroundColor: colorScheme.textMuted }}
            />
          </div>

          {/* Fake heading */}
          <div className="space-y-1 mb-3">
            <div
              className="h-4 w-20 rounded"
              style={{
                backgroundColor: typography.useOutlineText ? 'transparent' : colorScheme.textPrimary,
                border: typography.useOutlineText ? `1px solid ${colorScheme.textPrimary}` : 'none',
              }}
            />
            <div
              className="h-3 w-16 rounded"
              style={{ backgroundColor: colorScheme.accent }}
            />
          </div>

          {/* Fake content */}
          <div className="space-y-1">
            <div
              className="h-2 w-full rounded"
              style={{ backgroundColor: colorScheme.textMuted }}
            />
            <div
              className="h-2 w-3/4 rounded"
              style={{ backgroundColor: colorScheme.textMuted }}
            />
          </div>
        </div>

        {/* Preview button */}
        {onPreview && !isLocked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Info footer */}
      <div className="p-4" style={{ backgroundColor: `${colorScheme.bgPrimary}` }}>
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-sm"
            style={{ color: colorScheme.textPrimary }}
          >
            {template.name}
          </h3>
          {template.popularity > 90 && (
            <span
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${colorScheme.accent}20`, color: colorScheme.accent }}
            >
              <Star className="w-3 h-3" />
              Populär
            </span>
          )}
        </div>
        <p
          className="text-xs line-clamp-2"
          style={{ color: colorScheme.textMuted }}
        >
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${colorScheme.textMuted}20`,
                color: colorScheme.textSecondary,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-sm font-medium">Pro Template</p>
            <p className="text-white/60 text-xs">Uppgradera för att använda</p>
          </div>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// CV TEMPLATE CARD
// ============================================

interface CVTemplateCardProps {
  template: CVTemplate;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}

function CVTemplateCard({
  template,
  isSelected,
  isLocked,
  onClick,
}: CVTemplateCardProps) {
  const { colors, fonts, layout } = template;

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900' : ''
        } ${isLocked ? 'opacity-60' : ''}`}
      onClick={isLocked ? undefined : onClick}
      whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
    >
      {/* A4 Preview */}
      <div
        className="aspect-[1/1.414] p-4 relative"
        style={{ backgroundColor: colors.background }}
      >
        {layout === 'two-column' || layout === 'sidebar' ? (
          <div className="flex h-full">
            {/* Sidebar */}
            <div
              className="w-1/3 p-2 rounded-l"
              style={{ backgroundColor: colors.primary }}
            >
              {/* Avatar placeholder */}
              <div className="w-8 h-8 rounded-full mx-auto mb-2 bg-white/20" />
              {/* Lines */}
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded bg-white/30" />
                <div className="h-1 w-3/4 rounded bg-white/20 mx-auto" />
              </div>
              {/* Skills */}
              <div className="mt-4 space-y-1">
                <div className="h-1 w-full rounded bg-white/20" />
                <div className="h-1 w-2/3 rounded bg-white/20" />
                <div className="h-1 w-4/5 rounded bg-white/20" />
              </div>
            </div>
            {/* Content */}
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
            {/* Header */}
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
            {/* Content */}
            <div className="space-y-2">
              <div
                className="h-1.5 w-1/4 rounded"
                style={{ backgroundColor: colors.primary }}
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
      <div className="p-4 bg-gray-800">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-sm text-white">{template.name}</h3>
          <div className="flex gap-1">
            {template.popular && (
              <Star className="w-3 h-3 text-amber-400" />
            )}
            {template.new && (
              <Sparkles className="w-3 h-3 text-emerald-400" />
            )}
            {template.atsOptimized && (
              <Zap className="w-3 h-3 text-blue-400" />
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 line-clamp-1">{template.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded capitalize"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
            }}
          >
            {template.category}
          </span>
          {template.atsOptimized && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
              ATS-optimerat
            </span>
          )}
        </div>
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white/60 mx-auto mb-2" />
            <p className="text-white/80 text-sm">{template.tier === 'starter' ? 'Starter' : 'Pro'}</p>
          </div>
        </div>
      )}

      {/* Selected */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// MAIN TEMPLATE GALLERY
// ============================================

export function TemplateGallery({
  type,
  selectedId,
  onSelect,
  userTier,
  showPreview = true,
}: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  // Portfolio templates
  const portfolioTemplates = useMemo(() => {
    let filtered = [...templates];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // CV templates
  const cvTemplates = useMemo(() => {
    let filtered = [...ALL_CV_TEMPLATES];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Categories
  const categories =
    type === 'portfolio'
      ? [
        { id: 'all', name: 'Alla', icon: LayoutGrid },
        ...Object.entries(categoryDescriptions).map(([id, desc]) => ({
          id,
          name: desc.name,
          icon: LayoutGrid,
        })),
      ]
      : [
        { id: 'all', name: 'Alla', icon: LayoutGrid },
        { id: 'modern', name: 'Modern', icon: LayoutGrid },
        { id: 'classic', name: 'Klassisk', icon: LayoutGrid },
        { id: 'creative', name: 'Kreativ', icon: LayoutGrid },
        { id: 'minimal', name: 'Minimal', icon: LayoutGrid },
        { id: 'professional', name: 'Professionell', icon: LayoutGrid },
        { id: 'tech', name: 'Tech', icon: LayoutGrid },
        { id: 'executive', name: 'Executive', icon: LayoutGrid },
      ];

  const canUseTier = (tier: 'free' | 'starter' | 'pro') => {
    if (userTier === 'pro') return true;
    if (userTier === 'starter') return tier === 'free' || tier === 'starter';
    return tier === 'free';
  };

  // For portfolio templates, determine tier by template.popularity (free = top 5)
  const isPortfolioLocked = (template: TemplateConfig) => {
    const freeTemplates = templates.slice(0, 5).map((t) => t.id);
    const starterTemplates = templates.slice(0, 25).map((t) => t.id);

    if (userTier === 'pro') return false;
    if (userTier === 'starter') return !starterTemplates.includes(template.id);
    return !freeTemplates.includes(template.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={`Sök ${type === 'portfolio' ? 'portfolio' : 'CV'}-templates...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Tier indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl">
          <Crown
            className={`w-4 h-4 ${userTier === 'pro'
                ? 'text-violet-400'
                : userTier === 'starter'
                  ? 'text-blue-400'
                  : 'text-gray-500'
              }`}
          />
          <span className="text-sm text-gray-300">
            {userTier === 'pro'
              ? 'Alla templates tillgängliga'
              : userTier === 'starter'
                ? `${type === 'portfolio' ? '25' : '25'} templates`
                : `${type === 'portfolio' ? '5' : '5'} templates`}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                ? 'bg-violet-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {type === 'portfolio'
            ? portfolioTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <PortfolioTemplateCard
                  template={template}
                  isSelected={selectedId === template.id}
                  isLocked={isPortfolioLocked(template)}
                  onClick={() => onSelect(template.id)}
                  onPreview={
                    showPreview
                      ? () => setPreviewTemplate(template.id)
                      : undefined
                  }
                />
              </motion.div>
            ))
            : cvTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CVTemplateCard
                  template={template}
                  isSelected={selectedId === template.id}
                  isLocked={!canUseTier(template.tier)}
                  onClick={() => onSelect(template.id)}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {(type === 'portfolio' ? portfolioTemplates : cvTemplates).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Inga templates hittades
          </h3>
          <p className="text-gray-400">
            Försök med en annan sökning eller kategori
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 py-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {type === 'portfolio' ? templates.length : ALL_CV_TEMPLATES.length}
          </div>
          <div className="text-xs text-gray-500">Totalt antal templates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {type === 'portfolio'
              ? portfolioTemplates.filter((t) => !isPortfolioLocked(t)).length
              : cvTemplates.filter((t) => canUseTier(t.tier)).length}
          </div>
          <div className="text-xs text-gray-500">Tillgängliga för dig</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">
            {type === 'portfolio'
              ? templates.filter((t) => t.popularity > 90).length
              : ALL_CV_TEMPLATES.filter((t) => t.popular).length}
          </div>
          <div className="text-xs text-gray-500">Populära val</div>
        </div>
      </div>
    </div>
  );
}

export default TemplateGallery;
