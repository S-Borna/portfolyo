// ============================================
// PORTFOLYO.SE - Template Index
// Export alla template-relaterade moduler
// ============================================

// Effects library
export {
    colorSchemes,
    animations,
    hoverEffects,
    backgroundPatterns,
    typographyStyles,
    layoutStyles,
    type ColorScheme,
    type Animation,
    type HoverEffect,
    type BackgroundPattern,
    type TypographyStyle,
    type LayoutStyle,
} from './effects';

// Templates
export {
    templates,
    getTemplateById,
    getTemplatesByCategory,
    getTemplatesByFeature,
    getTemplatesByTag,
    getPopularTemplates,
    searchTemplates,
    categoryDescriptions,
    type TemplateConfig,
    type TemplateCategory,
    type TemplateFeature,
} from './templates';

// CSS Generator
export {
    generateTemplateCSS,
    generateTailwindConfig,
} from './css-generator';

// CV Renderer V2 (sidebar layout)
export {
    renderCVV2,
    CV_TEMPLATES_V2,
    getCVTemplateV2,
    type CVDataV2,
    type CVTemplateConfigV2,
} from './cv-renderer-v2';

// Portfolio Renderer V2 (exact saidborna.com copy)
export {
    renderPortfolioV2,
    PORTFOLIO_TEMPLATES_V2,
    getPortfolioTemplateV2,
    type PortfolioDataV2,
    type PortfolioTemplateConfigV2,
} from './portfolio-renderer-v2';

// Presets för snabb användning
export const presets = {
    // Mest populära templates
    devOpsCrimson: 'dev-crimson-bold',
    minimalZen: 'min-zen-white',
    professionalBlue: 'pro-corporate-blue',
    designerRose: 'design-rose-elegant',
    creativeNeon: 'creative-neon-noir',

    // Rekommenderade för YH-studenter
    yh: {
        devOps: 'dev-crimson-bold',
        developer: 'dev-ocean-minimal',
        designer: 'design-minimal-white',
        business: 'pro-corporate-blue',
        creative: 'creative-abstract',
    },

    // LIA-optimerade (med LIA-banner)
    liaOptimized: [
        'dev-crimson-bold',
        'dev-purple-cloud',
        'dev-mint-fresh',
        'pro-corporate-blue',
        'pro-startup-cto',
        'pro-cv-first',
    ],
} as const;

// ============================================
// BAKÅTKOMPATIBILITET - Legacy exports
// För befintliga sidor (upgrade, cv/new)
// ============================================

import { templates, getTemplateById } from './templates';

// Template counts per tier
export const TEMPLATE_COUNTS = {
    portfolio: {
        free: 5,
        starter: 25,
        pro: 100,
    },
    cv: {
        free: 3,
        starter: 15,
        pro: 50,
    },
};

// CV Templates (subset av portfolio templates anpassade för CV)
export interface CVTemplate {
    id: string;
    name: string;
    description: string;
    category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';
    tier: 'free' | 'starter' | 'pro';
    preview: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        muted: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    layout: 'single-column' | 'two-column' | 'sidebar' | 'classic';
    atsOptimized: boolean;
    popular?: boolean;
    new?: boolean;
}

export const ALL_CV_TEMPLATES: CVTemplate[] = [
    // Free tier (3)
    { id: 'cv-minimal-clean', name: 'Minimal Clean', description: 'Enkel och ren design', category: 'minimal', tier: 'free', preview: '/cv/minimal-clean.png', colors: { primary: '#000000', secondary: '#666666', accent: '#333333', background: '#ffffff', text: '#000000', muted: '#6b7280' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column', atsOptimized: true },
    { id: 'cv-professional-blue', name: 'Professional Blue', description: 'Klassisk professionell stil', category: 'professional', tier: 'free', preview: '/cv/professional-blue.png', colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa', background: '#ffffff', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column', atsOptimized: true },
    { id: 'cv-modern-dark', name: 'Modern Dark', description: 'Mörkt modernt tema', category: 'modern', tier: 'free', preview: '/cv/modern-dark.png', colors: { primary: '#ff4d4d', secondary: '#888888', accent: '#ff6666', background: '#0a0a0a', text: '#ffffff', muted: '#a1a1aa' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column', atsOptimized: false },
    // Starter tier (12 more = 15 total)
    { id: 'cv-creative-gradient', name: 'Creative Gradient', description: 'Kreativ med gradienter', category: 'creative', tier: 'starter', preview: '/cv/creative-gradient.png', colors: { primary: '#8b5cf6', secondary: '#ec4899', accent: '#a78bfa', background: '#ffffff', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Poppins, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column', atsOptimized: false },
    { id: 'cv-classic-serif', name: 'Classic Serif', description: 'Tidlös serif-typografi', category: 'classic', tier: 'starter', preview: '/cv/classic-serif.png', colors: { primary: '#1a1a1a', secondary: '#4a4a4a', accent: '#666666', background: '#fafaf8', text: '#1a1a1a', muted: '#6b7280' }, fonts: { heading: 'Playfair Display, serif', body: 'Lora, serif' }, layout: 'classic', atsOptimized: true },
    { id: 'cv-tech-mono', name: 'Tech Mono', description: 'Teknisk monospace-stil', category: 'modern', tier: 'starter', preview: '/cv/tech-mono.png', colors: { primary: '#00ff00', secondary: '#00aa00', accent: '#22c55e', background: '#0d0d0d', text: '#00ff00', muted: '#86efac' }, fonts: { heading: 'JetBrains Mono, monospace', body: 'JetBrains Mono, monospace' }, layout: 'single-column', atsOptimized: false },
    { id: 'cv-elegant-gold', name: 'Elegant Gold', description: 'Elegant med guldaccenter', category: 'professional', tier: 'starter', preview: '/cv/elegant-gold.png', colors: { primary: '#d4af37', secondary: '#b8860b', accent: '#e6c75a', background: '#fffef7', text: '#1a1a1a', muted: '#78716c' }, fonts: { heading: 'Cormorant Garamond, serif', body: 'Inter, sans-serif' }, layout: 'two-column', atsOptimized: true },
    { id: 'cv-startup-fresh', name: 'Startup Fresh', description: 'Fräsch startup-vibe', category: 'modern', tier: 'starter', preview: '/cv/startup-fresh.png', colors: { primary: '#06b6d4', secondary: '#22d3ee', accent: '#67e8f9', background: '#ffffff', text: '#0f172a', muted: '#64748b' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column', atsOptimized: true },
    { id: 'cv-academic', name: 'Academic', description: 'Akademisk och formell', category: 'classic', tier: 'starter', preview: '/cv/academic.png', colors: { primary: '#1e3a5f', secondary: '#2c5282', accent: '#3b82f6', background: '#ffffff', text: '#1a202c', muted: '#6b7280' }, fonts: { heading: 'Times New Roman, serif', body: 'Times New Roman, serif' }, layout: 'classic', atsOptimized: true },
    { id: 'cv-designer-portfolio', name: 'Designer Portfolio', description: 'För kreativa designers', category: 'creative', tier: 'starter', preview: '/cv/designer-portfolio.png', colors: { primary: '#f472b6', secondary: '#ec4899', accent: '#f9a8d4', background: '#ffffff', text: '#1f2937', muted: '#9ca3af' }, fonts: { heading: 'Space Grotesk, sans-serif', body: 'Inter, sans-serif' }, layout: 'sidebar', atsOptimized: false },
    { id: 'cv-corporate', name: 'Corporate', description: 'Företagsprofessionell', category: 'professional', tier: 'starter', preview: '/cv/corporate.png', colors: { primary: '#334155', secondary: '#475569', accent: '#64748b', background: '#ffffff', text: '#1e293b', muted: '#94a3b8' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column', atsOptimized: true },
    { id: 'cv-nordic-light', name: 'Nordic Light', description: 'Skandinavisk minimalism', category: 'minimal', tier: 'starter', preview: '/cv/nordic-light.png', colors: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1', background: '#f8fafc', text: '#334155', muted: '#94a3b8' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column', atsOptimized: true },
    { id: 'cv-bold-statement', name: 'Bold Statement', description: 'Gör ett starkt intryck', category: 'creative', tier: 'starter', preview: '/cv/bold-statement.png', colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171', background: '#ffffff', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Archivo Black, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column', atsOptimized: false },
    { id: 'cv-consultant', name: 'Consultant', description: 'För konsulter', category: 'professional', tier: 'starter', preview: '/cv/consultant.png', colors: { primary: '#0284c7', secondary: '#0369a1', accent: '#38bdf8', background: '#ffffff', text: '#1e293b', muted: '#64748b' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column', atsOptimized: true },
    { id: 'cv-developer', name: 'Developer', description: 'För utvecklare', category: 'modern', tier: 'starter', preview: '/cv/developer.png', colors: { primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80', background: '#0f172a', text: '#e2e8f0', muted: '#94a3b8' }, fonts: { heading: 'JetBrains Mono, monospace', body: 'Inter, sans-serif' }, layout: 'sidebar', atsOptimized: false },
    // Pro tier (35 more = 50 total)
    { id: 'cv-executive', name: 'Executive', description: 'C-level profil', category: 'professional', tier: 'pro', preview: '/cv/executive.png', colors: { primary: '#1e293b', secondary: '#334155', accent: '#475569', background: '#ffffff', text: '#0f172a', muted: '#64748b' }, fonts: { heading: 'Cormorant Garamond, serif', body: 'Inter, sans-serif' }, layout: 'two-column', atsOptimized: true },
    { id: 'cv-infographic', name: 'Infographic', description: 'Visuell infografik-stil', category: 'creative', tier: 'pro', preview: '/cv/infographic.png', colors: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd', background: '#ffffff', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Poppins, sans-serif', body: 'Inter, sans-serif' }, layout: 'sidebar', atsOptimized: false },
    { id: 'cv-timeline', name: 'Timeline', description: 'Tidslinje-fokuserad', category: 'modern', tier: 'pro', preview: '/cv/timeline.png', colors: { primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee', background: '#ffffff', text: '#164e63', muted: '#67e8f9' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column', atsOptimized: true },
];

export function getCVTemplatesForTier(tier: 'free' | 'starter' | 'pro'): CVTemplate[] {
    if (tier === 'free') return ALL_CV_TEMPLATES.filter(t => t.tier === 'free');
    if (tier === 'starter') return ALL_CV_TEMPLATES.filter(t => t.tier === 'free' || t.tier === 'starter');
    return ALL_CV_TEMPLATES; // Pro får alla
}

export function getCVTemplateById(id: string): CVTemplate | undefined {
    return ALL_CV_TEMPLATES.find(t => t.id === id);
}

// Type alias för bakåtkompatibilitet
export type CVTemplateConfig = CVTemplate;

// ============================================
// PORTFOLIO TEMPLATES - Legacy exports
// ============================================

export interface PortfolioTemplate {
    id: string;
    name: string;
    description: string;
    category: 'developer' | 'designer' | 'minimal' | 'creative' | 'professional' | 'bold' | 'elegant';
    tier: 'free' | 'starter' | 'pro';
    preview: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        muted: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    layout: 'single-column' | 'two-column' | 'grid' | 'masonry' | 'asymmetric';
    popular?: boolean;
    new?: boolean;
}

export const ALL_PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
    // Free tier (5)
    { id: 'dev-crimson-bold', name: 'DevOps Crimson', description: 'Bold crimson för DevOps', category: 'developer', tier: 'free', preview: '/templates/dev-crimson-bold.png', colors: { primary: '#ff4d4d', secondary: '#cc0000', accent: '#ff6666', background: '#0a0a0a', text: '#ffffff', muted: '#888888' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column' },
    { id: 'min-zen-white', name: 'Zen White', description: 'Ultra-minimalistiskt', category: 'minimal', tier: 'free', preview: '/templates/min-zen-white.png', colors: { primary: '#000000', secondary: '#666666', accent: '#333333', background: '#ffffff', text: '#000000', muted: '#6b7280' }, fonts: { heading: 'Georgia, serif', body: 'Georgia, serif' }, layout: 'single-column' },
    { id: 'pro-corporate-blue', name: 'Corporate Blue', description: 'Professionellt blått', category: 'professional', tier: 'free', preview: '/templates/pro-corporate-blue.png', colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa', background: '#ffffff', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column' },
    { id: 'design-minimal-white', name: 'Clean Canvas', description: 'Minimalistiskt för designers', category: 'designer', tier: 'free', preview: '/templates/design-minimal-white.png', colors: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd', background: '#fafafa', text: '#18181b', muted: '#71717a' }, fonts: { heading: 'Poppins, sans-serif', body: 'Inter, sans-serif' }, layout: 'grid' },
    { id: 'creative-abstract', name: 'Abstract Art', description: 'Abstrakt kreativt', category: 'creative', tier: 'free', preview: '/templates/creative-abstract.png', colors: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d', background: '#1f2937', text: '#f3f4f6', muted: '#9ca3af' }, fonts: { heading: 'Playfair Display, serif', body: 'Inter, sans-serif' }, layout: 'asymmetric' },
    // Starter tier (20 more = 25 total)
    { id: 'dev-ocean-minimal', name: 'Deep Ocean', description: 'Mörkt blått tema', category: 'developer', tier: 'starter', preview: '/templates/dev-ocean-minimal.png', colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8', background: '#0c4a6e', text: '#f0f9ff', muted: '#7dd3fc' }, fonts: { heading: 'JetBrains Mono, monospace', body: 'Inter, sans-serif' }, layout: 'two-column' },
    { id: 'dev-emerald-matrix', name: 'Matrix Code', description: 'Hacker-inspirerat', category: 'developer', tier: 'starter', preview: '/templates/dev-emerald-matrix.png', colors: { primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80', background: '#052e16', text: '#dcfce7', muted: '#86efac' }, fonts: { heading: 'JetBrains Mono, monospace', body: 'JetBrains Mono, monospace' }, layout: 'single-column' },
    { id: 'dev-purple-cloud', name: 'Cloud Engineer', description: 'AWS/Azure inspirerat', category: 'developer', tier: 'starter', preview: '/templates/dev-purple-cloud.png', colors: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd', background: '#1e1b4b', text: '#ede9fe', muted: '#c7d2fe' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'grid' },
    { id: 'design-rose-elegant', name: 'Rose Elegance', description: 'Elegant rosa för designers', category: 'designer', tier: 'starter', preview: '/templates/design-rose-elegant.png', colors: { primary: '#f472b6', secondary: '#ec4899', accent: '#f9a8d4', background: '#fdf2f8', text: '#831843', muted: '#be185d' }, fonts: { heading: 'Playfair Display, serif', body: 'Lato, sans-serif' }, layout: 'masonry' },
    { id: 'design-brutalist', name: 'Brutalist Bold', description: 'Anti-design brutalist', category: 'designer', tier: 'starter', preview: '/templates/design-brutalist.png', colors: { primary: '#000000', secondary: '#ffff00', accent: '#ff0000', background: '#ffffff', text: '#000000', muted: '#6b7280' }, fonts: { heading: 'Space Grotesk, sans-serif', body: 'Space Grotesk, sans-serif' }, layout: 'asymmetric' },
    { id: 'min-dark-void', name: 'Dark Void', description: 'Mörk minimal', category: 'minimal', tier: 'starter', preview: '/templates/min-dark-void.png', colors: { primary: '#ffffff', secondary: '#a3a3a3', accent: '#d4d4d4', background: '#0a0a0a', text: '#fafafa', muted: '#737373' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column' },
    { id: 'pro-consultant', name: 'Senior Consultant', description: 'För konsulter', category: 'professional', tier: 'starter', preview: '/templates/pro-consultant.png', colors: { primary: '#0284c7', secondary: '#0369a1', accent: '#38bdf8', background: '#ffffff', text: '#1e293b', muted: '#64748b' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column' },
    { id: 'bold-neon-pink', name: 'Neon Pink', description: 'Stark neon-rosa', category: 'bold', tier: 'starter', preview: '/templates/bold-neon-pink.png', colors: { primary: '#f472b6', secondary: '#ec4899', accent: '#f9a8d4', background: '#18181b', text: '#fafafa', muted: '#a1a1aa' }, fonts: { heading: 'Orbitron, sans-serif', body: 'Inter, sans-serif' }, layout: 'grid' },
    { id: 'elegant-champagne', name: 'Champagne Gold', description: 'Lyxigt champagne', category: 'elegant', tier: 'starter', preview: '/templates/elegant-champagne.png', colors: { primary: '#d4af37', secondary: '#c19a32', accent: '#e6c75a', background: '#fffef7', text: '#1a1a1a', muted: '#78716c' }, fonts: { heading: 'Playfair Display, serif', body: 'Cormorant Garamond, serif' }, layout: 'two-column' },
    { id: 'creative-glitch', name: 'Glitch Art', description: 'Glitch-effekter', category: 'creative', tier: 'starter', preview: '/templates/creative-glitch.png', colors: { primary: '#00ffff', secondary: '#ff00ff', accent: '#ffff00', background: '#0a0a0a', text: '#ffffff', muted: '#a1a1aa' }, fonts: { heading: 'VT323, monospace', body: 'Inter, sans-serif' }, layout: 'asymmetric' },
    { id: 'dev-gold-senior', name: 'Senior Dev Gold', description: 'Prestigefyllt guld', category: 'developer', tier: 'starter', preview: '/templates/dev-gold-senior.png', colors: { primary: '#fbbf24', secondary: '#f59e0b', accent: '#fcd34d', background: '#0f172a', text: '#fef3c7', muted: '#d97706' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column' },
    { id: 'design-editorial', name: 'Editorial Style', description: 'Tidningsinspirerat', category: 'designer', tier: 'starter', preview: '/templates/design-editorial.png', colors: { primary: '#1f2937', secondary: '#374151', accent: '#4b5563', background: '#f9fafb', text: '#111827', muted: '#6b7280' }, fonts: { heading: 'Libre Baskerville, serif', body: 'Source Sans Pro, sans-serif' }, layout: 'masonry' },
    { id: 'min-single-accent', name: 'Single Accent', description: 'En färg accent', category: 'minimal', tier: 'starter', preview: '/templates/min-single-accent.png', colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444', background: '#fafafa', text: '#18181b', muted: '#71717a' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'single-column' },
    { id: 'pro-startup-cto', name: 'Startup CTO', description: 'Startup tech-ledare', category: 'professional', tier: 'starter', preview: '/templates/pro-startup-cto.png', colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee', background: '#ffffff', text: '#0f172a', muted: '#64748b' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'grid' },
    { id: 'bold-cyber-yellow', name: 'Cyber Yellow', description: 'Cyberpunk gult', category: 'bold', tier: 'starter', preview: '/templates/bold-cyber-yellow.png', colors: { primary: '#facc15', secondary: '#eab308', accent: '#fef08a', background: '#18181b', text: '#fef08a', muted: '#a1a1aa' }, fonts: { heading: 'Orbitron, sans-serif', body: 'Rajdhani, sans-serif' }, layout: 'asymmetric' },
    { id: 'elegant-marble', name: 'Marble Luxe', description: 'Marmor-inspirerat', category: 'elegant', tier: 'starter', preview: '/templates/elegant-marble.png', colors: { primary: '#78716c', secondary: '#a8a29e', accent: '#d6d3d1', background: '#fafaf9', text: '#1c1917', muted: '#78716c' }, fonts: { heading: 'Cormorant Garamond, serif', body: 'Lato, sans-serif' }, layout: 'two-column' },
    { id: 'creative-comic', name: 'Comic Pop', description: 'Serietidnings-stil', category: 'creative', tier: 'starter', preview: '/templates/creative-comic.png', colors: { primary: '#ef4444', secondary: '#3b82f6', accent: '#fbbf24', background: '#fef08a', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Bangers, cursive', body: 'Comic Neue, cursive' }, layout: 'grid' },
    { id: 'dev-mint-fresh', name: 'Fresh Start', description: 'Fräscht mint', category: 'developer', tier: 'starter', preview: '/templates/dev-mint-fresh.png', colors: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7', background: '#ecfdf5', text: '#064e3b', muted: '#047857' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'two-column' },
    { id: 'design-3d-creative', name: '3D Creative', description: 'Tilt-effekter och 3D', category: 'designer', tier: 'starter', preview: '/templates/design-3d-creative.png', colors: { primary: '#6366f1', secondary: '#818cf8', accent: '#a5b4fc', background: '#1e1b4b', text: '#e0e7ff', muted: '#a5b4fc' }, fonts: { heading: 'Space Grotesk, sans-serif', body: 'Inter, sans-serif' }, layout: 'grid' },
    { id: 'min-text-only', name: 'Type Only', description: '100% typografi', category: 'minimal', tier: 'starter', preview: '/templates/min-text-only.png', colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#374151', background: '#ffffff', text: '#1f2937', muted: '#9ca3af' }, fonts: { heading: 'Libre Baskerville, serif', body: 'Libre Baskerville, serif' }, layout: 'single-column' },
    // Pro tier (75 more = 100 total - representativa exempel)
    { id: 'dev-terminal-dark', name: 'Terminal Pro', description: 'Terminal-inspirerat', category: 'developer', tier: 'pro', preview: '/templates/dev-terminal-dark.png', colors: { primary: '#22c55e', secondary: '#15803d', accent: '#4ade80', background: '#000000', text: '#22c55e', muted: '#86efac' }, fonts: { heading: 'JetBrains Mono, monospace', body: 'JetBrains Mono, monospace' }, layout: 'single-column' },
    { id: 'dev-ml-gradient', name: 'ML Engineer', description: 'AI/ML gradient', category: 'developer', tier: 'pro', preview: '/templates/dev-ml-gradient.png', colors: { primary: '#8b5cf6', secondary: '#ec4899', accent: '#f472b6', background: '#0f0f23', text: '#e0e7ff', muted: '#c4b5fd' }, fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' }, layout: 'grid' },
    { id: 'design-photo-grid', name: 'Photo Grid', description: 'Masonry för fotografer', category: 'designer', tier: 'pro', preview: '/templates/design-photo-grid.png', colors: { primary: '#78716c', secondary: '#a8a29e', accent: '#d6d3d1', background: '#1c1917', text: '#fafaf9', muted: '#a8a29e' }, fonts: { heading: 'Playfair Display, serif', body: 'Inter, sans-serif' }, layout: 'masonry' },
    { id: 'pro-executive', name: 'Executive Level', description: 'C-level profiler', category: 'professional', tier: 'pro', preview: '/templates/pro-executive.png', colors: { primary: '#1e293b', secondary: '#334155', accent: '#475569', background: '#ffffff', text: '#0f172a', muted: '#64748b' }, fonts: { heading: 'Cormorant Garamond, serif', body: 'Inter, sans-serif' }, layout: 'two-column' },
    { id: 'bold-maximalist', name: 'Maximalist Mix', description: 'Allt på max', category: 'bold', tier: 'pro', preview: '/templates/bold-maximalist.png', colors: { primary: '#f97316', secondary: '#8b5cf6', accent: '#ec4899', background: '#fef3c7', text: '#1f2937', muted: '#6b7280' }, fonts: { heading: 'Archivo Black, sans-serif', body: 'Work Sans, sans-serif' }, layout: 'asymmetric' },
    { id: 'elegant-midnight-blue', name: 'Midnight Blue', description: 'Djupt midnattsblått', category: 'elegant', tier: 'pro', preview: '/templates/elegant-midnight-blue.png', colors: { primary: '#60a5fa', secondary: '#3b82f6', accent: '#93c5fd', background: '#0f172a', text: '#f1f5f9', muted: '#94a3b8' }, fonts: { heading: 'Playfair Display, serif', body: 'Lato, sans-serif' }, layout: 'two-column' },
    { id: 'creative-synthwave', name: 'Synthwave', description: '80-tals retro', category: 'creative', tier: 'pro', preview: '/templates/creative-synthwave.png', colors: { primary: '#f472b6', secondary: '#818cf8', accent: '#c084fc', background: '#1e1b4b', text: '#fdf4ff', muted: '#d8b4fe' }, fonts: { heading: 'Orbitron, sans-serif', body: 'Rajdhani, sans-serif' }, layout: 'grid' },
    { id: 'creative-vaporwave', name: 'Vaporwave', description: '90-tals retro-futurism', category: 'creative', tier: 'pro', preview: '/templates/creative-vaporwave.png', colors: { primary: '#f0abfc', secondary: '#67e8f9', accent: '#a5f3fc', background: '#581c87', text: '#fdf4ff', muted: '#e879f9' }, fonts: { heading: 'Press Start 2P, cursive', body: 'Inter, sans-serif' }, layout: 'asymmetric' },
];

export function getPortfolioTemplatesForTier(tier: 'free' | 'starter' | 'pro'): PortfolioTemplate[] {
    if (tier === 'free') return ALL_PORTFOLIO_TEMPLATES.filter(t => t.tier === 'free');
    if (tier === 'starter') return ALL_PORTFOLIO_TEMPLATES.filter(t => t.tier === 'free' || t.tier === 'starter');
    return ALL_PORTFOLIO_TEMPLATES; // Pro får alla
}

export function getPortfolioTemplateById(id: string): PortfolioTemplate | undefined {
    return ALL_PORTFOLIO_TEMPLATES.find(t => t.id === id);
}

// Type alias för bakåtkompatibilitet
export type PortfolioTemplateConfig = PortfolioTemplate;
