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

// CV Renderer V2 (consolidated)
export {
    renderCVV2 as renderCV,
    CV_TEMPLATES_V2 as CV_TEMPLATES,
    type CVTemplateConfig,
    type CVData,
} from './cv-renderer-v2';

// Types
export type {
    TemplateFamily,
    TemplateDefinition,
    TemplateStyle,
    TemplateFeature
} from './system';
