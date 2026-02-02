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
