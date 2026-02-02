// ============================================
// PORTFOLYO.SE - Template System
// Family-based template architecture
// ============================================

import type {
    TemplateFamily,
    TemplateDefinition,
    TemplateStyle,
    TemplateFeature,
    Tier
} from '../models';

// ============================================
// TEMPLATE FAMILIES
// ============================================

/**
 * Each family shares the same DNA - colors, typography, effects
 * Variations within a family differ in layout, features, intensity
 */

export const TEMPLATE_FAMILIES: Record<TemplateFamily, {
    name: string;
    description: string;
    baseStyle: TemplateStyle;
}> = {
    crimson: {
        name: 'Crimson',
        description: 'Bold dark theme med röd accent - vår signaturdesign',
        baseStyle: {
            bg_primary: '#0a0a0a',
            bg_secondary: '#111111',
            bg_card: '#161616',
            accent: '#ff4d4d',
            accent_glow: 'rgba(255, 77, 77, 0.3)',
            text_primary: '#ffffff',
            text_secondary: '#888888',
            text_muted: '#555555',
            font_heading: "'Bebas Neue', sans-serif",
            font_body: "'Space Grotesk', sans-serif",
            hero_layout: 'split',
            project_layout: 'grid',
            has_floating_orbs: true,
            has_noise_texture: true,
            has_gradient_bg: false,
            has_sticky_nav: true,
        },
    },
    arctic: {
        name: 'Arctic',
        description: 'Ljus och luftig med blå accenter',
        baseStyle: {
            bg_primary: '#ffffff',
            bg_secondary: '#f8fafc',
            bg_card: '#ffffff',
            accent: '#0ea5e9',
            accent_glow: 'rgba(14, 165, 233, 0.2)',
            text_primary: '#0f172a',
            text_secondary: '#475569',
            text_muted: '#94a3b8',
            font_heading: "'Sora', sans-serif",
            font_body: "'Inter', sans-serif",
            hero_layout: 'centered',
            project_layout: 'grid',
            has_floating_orbs: false,
            has_noise_texture: false,
            has_gradient_bg: true,
            has_sticky_nav: true,
        },
    },
    noir: {
        name: 'Noir',
        description: 'Rent svart med vit typografi - maximum kontrast',
        baseStyle: {
            bg_primary: '#000000',
            bg_secondary: '#0a0a0a',
            bg_card: '#111111',
            accent: '#ffffff',
            accent_glow: 'rgba(255, 255, 255, 0.1)',
            text_primary: '#ffffff',
            text_secondary: '#737373',
            text_muted: '#404040',
            font_heading: "'Bebas Neue', sans-serif",
            font_body: "'Space Grotesk', sans-serif",
            hero_layout: 'asymmetric',
            project_layout: 'list',
            has_floating_orbs: false,
            has_noise_texture: true,
            has_gradient_bg: false,
            has_sticky_nav: true,
        },
    },
    forest: {
        name: 'Forest',
        description: 'Mörkt med gröna accenter - naturinspirerat',
        baseStyle: {
            bg_primary: '#0c0f0a',
            bg_secondary: '#1a1f16',
            bg_card: '#1f2419',
            accent: '#22c55e',
            accent_glow: 'rgba(34, 197, 94, 0.25)',
            text_primary: '#f0fdf4',
            text_secondary: '#86efac',
            text_muted: '#4ade80',
            font_heading: "'Sora', sans-serif",
            font_body: "'Inter', sans-serif",
            hero_layout: 'split',
            project_layout: 'masonry',
            has_floating_orbs: true,
            has_noise_texture: true,
            has_gradient_bg: false,
            has_sticky_nav: true,
        },
    },
    studio: {
        name: 'Studio',
        description: 'Kreativ och lekfull med starka färger',
        baseStyle: {
            bg_primary: '#18181b',
            bg_secondary: '#27272a',
            bg_card: '#3f3f46',
            accent: '#f472b6',
            accent_glow: 'rgba(244, 114, 182, 0.3)',
            text_primary: '#fafafa',
            text_secondary: '#a1a1aa',
            text_muted: '#71717a',
            font_heading: "'Space Grotesk', sans-serif",
            font_body: "'Inter', sans-serif",
            hero_layout: 'asymmetric',
            project_layout: 'masonry',
            has_floating_orbs: true,
            has_noise_texture: false,
            has_gradient_bg: true,
            has_sticky_nav: true,
        },
    },
    corporate: {
        name: 'Corporate',
        description: 'Professionell och traditionell - perfekt för konsulter',
        baseStyle: {
            bg_primary: '#ffffff',
            bg_secondary: '#f1f5f9',
            bg_card: '#ffffff',
            accent: '#1e40af',
            accent_glow: 'rgba(30, 64, 175, 0.15)',
            text_primary: '#1e293b',
            text_secondary: '#475569',
            text_muted: '#94a3b8',
            font_heading: "'Inter', sans-serif",
            font_body: "'Inter', sans-serif",
            hero_layout: 'centered',
            project_layout: 'grid',
            has_floating_orbs: false,
            has_noise_texture: false,
            has_gradient_bg: false,
            has_sticky_nav: true,
        },
    },
};

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export const TEMPLATES: TemplateDefinition[] = [
    // =====================
    // CRIMSON FAMILY (Free + Premium)
    // =====================
    {
        id: 'crimson-dark',
        family: 'crimson',
        name: 'Crimson Dark',
        description: 'Original saidborna.com design med floating orbs',
        style: { ...TEMPLATE_FAMILIES.crimson.baseStyle },
        features: ['timeline', 'stats', 'tech_stack', 'seeking_banner', 'cv_download', 'project_grid', 'floating_orbs', 'noise_texture', 'sticky_nav'],
        tier: 'free',
        preview_url: '/templates/crimson-dark.png',
    },
    {
        id: 'crimson-minimal',
        family: 'crimson',
        name: 'Crimson Minimal',
        description: 'Samma DNA, mindre effekter',
        style: {
            ...TEMPLATE_FAMILIES.crimson.baseStyle,
            has_floating_orbs: false,
            project_layout: 'list',
        },
        features: ['timeline', 'tech_stack', 'cv_download', 'sticky_nav'],
        tier: 'free',
        preview_url: '/templates/crimson-minimal.png',
    },
    {
        id: 'crimson-centered',
        family: 'crimson',
        name: 'Crimson Centered',
        description: 'Centrerad hero med stor avatar',
        style: {
            ...TEMPLATE_FAMILIES.crimson.baseStyle,
            hero_layout: 'centered',
        },
        features: ['timeline', 'stats', 'tech_stack', 'seeking_banner', 'cv_download', 'project_grid', 'floating_orbs', 'noise_texture', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/crimson-centered.png',
    },
    {
        id: 'crimson-bold',
        family: 'crimson',
        name: 'Crimson Bold',
        description: 'Extra stor typografi, maximalt impact',
        style: {
            ...TEMPLATE_FAMILIES.crimson.baseStyle,
            hero_layout: 'asymmetric',
        },
        features: ['timeline', 'stats', 'tech_stack', 'seeking_banner', 'cv_download', 'project_grid', 'floating_orbs', 'noise_texture', 'sticky_nav', 'scroll_progress'],
        tier: 'standard',
        preview_url: '/templates/crimson-bold.png',
    },

    // =====================
    // ARCTIC FAMILY
    // =====================
    {
        id: 'arctic-clean',
        family: 'arctic',
        name: 'Arctic Clean',
        description: 'Ljus och professionell',
        style: { ...TEMPLATE_FAMILIES.arctic.baseStyle },
        features: ['timeline', 'tech_stack', 'cv_download', 'project_grid', 'gradient_bg', 'sticky_nav'],
        tier: 'free',
        preview_url: '/templates/arctic-clean.png',
    },
    {
        id: 'arctic-gradient',
        family: 'arctic',
        name: 'Arctic Gradient',
        description: 'Med subtila gradient-accenter',
        style: {
            ...TEMPLATE_FAMILIES.arctic.baseStyle,
            accent: '#6366f1',
        },
        features: ['timeline', 'stats', 'tech_stack', 'seeking_banner', 'cv_download', 'project_grid', 'gradient_bg', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/arctic-gradient.png',
    },
    {
        id: 'arctic-minimal',
        family: 'arctic',
        name: 'Arctic Minimal',
        description: 'Extremt ren och enkel',
        style: {
            ...TEMPLATE_FAMILIES.arctic.baseStyle,
            project_layout: 'list',
            has_gradient_bg: false,
        },
        features: ['timeline', 'cv_download', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/arctic-minimal.png',
    },

    // =====================
    // NOIR FAMILY
    // =====================
    {
        id: 'noir-classic',
        family: 'noir',
        name: 'Noir Classic',
        description: 'Rent svart, maximum elegans',
        style: { ...TEMPLATE_FAMILIES.noir.baseStyle },
        features: ['timeline', 'tech_stack', 'cv_download', 'noise_texture', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/noir-classic.png',
    },
    {
        id: 'noir-editorial',
        family: 'noir',
        name: 'Noir Editorial',
        description: 'Tidskrifts-inspirerad layout',
        style: {
            ...TEMPLATE_FAMILIES.noir.baseStyle,
            hero_layout: 'split',
            project_layout: 'masonry',
        },
        features: ['timeline', 'stats', 'tech_stack', 'cv_download', 'project_grid', 'noise_texture', 'sticky_nav'],
        tier: 'premium',
        preview_url: '/templates/noir-editorial.png',
    },

    // =====================
    // FOREST FAMILY
    // =====================
    {
        id: 'forest-calm',
        family: 'forest',
        name: 'Forest Calm',
        description: 'Naturinspirerat och lugnt',
        style: { ...TEMPLATE_FAMILIES.forest.baseStyle },
        features: ['timeline', 'tech_stack', 'cv_download', 'project_grid', 'floating_orbs', 'noise_texture', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/forest-calm.png',
    },
    {
        id: 'forest-bold',
        family: 'forest',
        name: 'Forest Bold',
        description: 'Starkare gröna accenter',
        style: {
            ...TEMPLATE_FAMILIES.forest.baseStyle,
            accent: '#4ade80',
        },
        features: ['timeline', 'stats', 'tech_stack', 'seeking_banner', 'cv_download', 'project_grid', 'floating_orbs', 'noise_texture', 'sticky_nav'],
        tier: 'premium',
        preview_url: '/templates/forest-bold.png',
    },

    // =====================
    // STUDIO FAMILY
    // =====================
    {
        id: 'studio-pink',
        family: 'studio',
        name: 'Studio Pink',
        description: 'Kreativ och lekfull',
        style: { ...TEMPLATE_FAMILIES.studio.baseStyle },
        features: ['timeline', 'stats', 'tech_stack', 'cv_download', 'project_grid', 'floating_orbs', 'gradient_bg', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/studio-pink.png',
    },
    {
        id: 'studio-purple',
        family: 'studio',
        name: 'Studio Purple',
        description: 'Lila variant för designers',
        style: {
            ...TEMPLATE_FAMILIES.studio.baseStyle,
            accent: '#a855f7',
            accent_glow: 'rgba(168, 85, 247, 0.3)',
        },
        features: ['timeline', 'stats', 'tech_stack', 'seeking_banner', 'cv_download', 'project_grid', 'floating_orbs', 'gradient_bg', 'sticky_nav'],
        tier: 'premium',
        preview_url: '/templates/studio-purple.png',
    },
    {
        id: 'studio-orange',
        family: 'studio',
        name: 'Studio Orange',
        description: 'Energisk och varm',
        style: {
            ...TEMPLATE_FAMILIES.studio.baseStyle,
            accent: '#f97316',
            accent_glow: 'rgba(249, 115, 22, 0.3)',
        },
        features: ['timeline', 'stats', 'tech_stack', 'cv_download', 'project_grid', 'gradient_bg', 'sticky_nav'],
        tier: 'premium',
        preview_url: '/templates/studio-orange.png',
    },

    // =====================
    // CORPORATE FAMILY
    // =====================
    {
        id: 'corporate-blue',
        family: 'corporate',
        name: 'Corporate Blue',
        description: 'Klassisk professionell',
        style: { ...TEMPLATE_FAMILIES.corporate.baseStyle },
        features: ['timeline', 'tech_stack', 'cv_download', 'project_grid', 'sticky_nav'],
        tier: 'standard',
        preview_url: '/templates/corporate-blue.png',
    },
    {
        id: 'corporate-navy',
        family: 'corporate',
        name: 'Corporate Navy',
        description: 'Mörkare och mer seriös',
        style: {
            ...TEMPLATE_FAMILIES.corporate.baseStyle,
            bg_primary: '#0f172a',
            bg_secondary: '#1e293b',
            text_primary: '#f8fafc',
            text_secondary: '#cbd5e1',
        },
        features: ['timeline', 'stats', 'tech_stack', 'cv_download', 'project_grid', 'sticky_nav'],
        tier: 'premium',
        preview_url: '/templates/corporate-navy.png',
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get template by ID
 */
export function getTemplate(id: string): TemplateDefinition | undefined {
    return TEMPLATES.find(t => t.id === id);
}

/**
 * Get all templates for a tier (includes lower tiers)
 */
export function getTemplatesForTier(tier: Tier): TemplateDefinition[] {
    const tierHierarchy: Record<Tier, number> = { free: 0, standard: 1, premium: 2 };
    const userLevel = tierHierarchy[tier];

    return TEMPLATES.filter(t => tierHierarchy[t.tier] <= userLevel);
}

/**
 * Get templates by family
 */
export function getTemplatesByFamily(family: TemplateFamily): TemplateDefinition[] {
    return TEMPLATES.filter(t => t.family === family);
}

/**
 * Check if user can use template
 */
export function canUseTemplate(template: TemplateDefinition, userTier: Tier): boolean {
    const tierHierarchy: Record<Tier, number> = { free: 0, standard: 1, premium: 2 };
    return tierHierarchy[template.tier] <= tierHierarchy[userTier];
}

/**
 * Get family info
 */
export function getFamily(family: TemplateFamily) {
    return TEMPLATE_FAMILIES[family];
}

/**
 * Get default template
 */
export function getDefaultTemplate(): TemplateDefinition {
    return TEMPLATES.find(t => t.id === 'crimson-dark')!;
}

/**
 * Count templates per tier
 */
export function getTemplateCount(tier: Tier): number {
    return getTemplatesForTier(tier).length;
}

// ============================================
// STYLE UTILITIES
// ============================================

/**
 * Generate CSS variables from template style
 */
export function styleToCssVars(style: TemplateStyle): string {
    return `
    --bg-primary: ${style.bg_primary};
    --bg-secondary: ${style.bg_secondary};
    --bg-card: ${style.bg_card};
    --accent: ${style.accent};
    --accent-glow: ${style.accent_glow};
    --text-primary: ${style.text_primary};
    --text-secondary: ${style.text_secondary};
    --text-muted: ${style.text_muted};
    --font-heading: ${style.font_heading};
    --font-body: ${style.font_body};
  `;
}

/**
 * Check if template has feature
 */
export function hasFeature(template: TemplateDefinition, feature: TemplateFeature): boolean {
    return template.features.includes(feature);
}

// ============================================
// EXPORTS
// ============================================

export type { TemplateFamily, TemplateDefinition, TemplateStyle, TemplateFeature };
