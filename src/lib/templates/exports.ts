// ============================================
// PORTFOLYO.SE - Template System Index
// Central exports for all template modules
// ============================================

// Template System (new unified architecture)
export {
    TEMPLATES,
    TEMPLATE_FAMILIES,
    getTemplate,
    getTemplatesForTier,
    getTemplatesByFamily,
    canUseTemplate,
    getFamily,
    getDefaultTemplate,
    getTemplateCount,
    styleToCssVars,
    hasFeature,
} from './system';

// Portfolio Renderer
export { renderPortfolio, translations } from './renderer';

// CV Renderer
export {
    renderCV,
    getCVTemplate,
    CV_TEMPLATES,
    type CVTemplateId,
} from './cv-renderer';

// Types
export type {
    TemplateFamily,
    TemplateDefinition,
    TemplateStyle,
    TemplateFeature
} from './system';
