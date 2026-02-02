/**
 * PORTFOLYO DESIGN TOKENS
 * Single source of truth for all visual values
 *
 * These tokens implement the UX Specification.
 * Do not modify without reviewing UX_SPECIFICATION.md
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
    // Background
    bg: {
        primary: '#0a0a0a',    // ink - main background
        secondary: '#111111',  // elevated surfaces
        card: '#161616',       // card surfaces
        overlay: 'rgba(0,0,0,0.8)',
    },

    // Text
    text: {
        primary: '#ffffff',
        secondary: '#888888',
        muted: '#555555',
        disabled: '#333333',
    },

    // Accent
    accent: {
        action: '#ff4d4d',     // crimson - primary actions
        actionHover: '#ff3333',
        success: '#22c55e',    // emerald - positive states
        warning: '#f59e0b',    // amber - caution states
        error: '#ef4444',      // red - error states
    },

    // Border
    border: {
        default: '#222222',
        hover: '#333333',
        focus: '#ff4d4d',
    },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const fonts = {
    heading: "'Bebas Neue', sans-serif",
    body: "'Space Grotesk', sans-serif",
    mono: "'JetBrains Mono', monospace",
} as const;

export const fontSizes = {
    display: 'clamp(3rem, 10vw, 7rem)',
    h1: '2.5rem',    // 40px
    h2: '1.75rem',   // 28px
    h3: '1.25rem',   // 20px
    body: '1rem',    // 16px
    small: '0.875rem', // 14px
    micro: '0.75rem',  // 12px
} as const;

export const fontWeights = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const;

export const lineHeights = {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const radii = {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
    xl: '0 20px 25px rgba(0,0,0,0.3)',
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1280px',
} as const;

export const mediaQueries = {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
    desktop: `@media (min-width: ${breakpoints.tablet})`,
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 50,
    toast: 60,
    tooltip: 70,
} as const;

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const buttonTokens = {
    primary: {
        bg: colors.accent.action,
        text: colors.text.primary,
        hoverBg: colors.accent.actionHover,
        disabledOpacity: 0.5,
    },
    secondary: {
        bg: colors.border.default,
        text: colors.text.primary,
        hoverBg: colors.border.hover,
    },
    ghost: {
        bg: 'transparent',
        text: colors.text.secondary,
        hoverText: colors.text.primary,
    },
} as const;

export const inputTokens = {
    bg: colors.bg.secondary,
    border: colors.border.default,
    text: colors.text.primary,
    placeholder: colors.text.muted,
    focusBorder: colors.accent.action,
    errorBorder: colors.accent.error,
} as const;

export const cardTokens = {
    bg: colors.bg.card,
    border: colors.border.default,
    radius: radii.xl,
    padding: spacing[6],
    hoverTranslateY: '-4px',
} as const;

export const statusTokens = {
    live: {
        dot: colors.accent.success,
        text: colors.accent.success,
        bg: 'rgba(34, 197, 94, 0.05)',
        border: 'rgba(34, 197, 94, 0.2)',
    },
    draft: {
        dot: colors.accent.warning,
        text: colors.accent.warning,
        bg: 'rgba(245, 158, 11, 0.05)',
        border: 'rgba(245, 158, 11, 0.2)',
    },
} as const;

export const modalTokens = {
    overlay: colors.bg.overlay,
    bg: '#18181b', // zinc-900
    border: '#27272a', // zinc-800
    radius: radii['2xl'],
    padding: spacing[8],
    maxWidthSm: '480px',
    maxWidthMd: '640px',
} as const;

// ============================================================================
// CSS CUSTOM PROPERTIES EXPORT
// ============================================================================

export function generateCSSVariables(): string {
    return `
:root {
  /* Background */
  --color-bg-primary: ${colors.bg.primary};
  --color-bg-secondary: ${colors.bg.secondary};
  --color-bg-card: ${colors.bg.card};
  --color-bg-overlay: ${colors.bg.overlay};

  /* Text */
  --color-text-primary: ${colors.text.primary};
  --color-text-secondary: ${colors.text.secondary};
  --color-text-muted: ${colors.text.muted};
  --color-text-disabled: ${colors.text.disabled};

  /* Accent */
  --color-accent-action: ${colors.accent.action};
  --color-accent-action-hover: ${colors.accent.actionHover};
  --color-accent-success: ${colors.accent.success};
  --color-accent-warning: ${colors.accent.warning};
  --color-accent-error: ${colors.accent.error};

  /* Border */
  --color-border-default: ${colors.border.default};
  --color-border-hover: ${colors.border.hover};
  --color-border-focus: ${colors.border.focus};

  /* Typography */
  --font-heading: ${fonts.heading};
  --font-body: ${fonts.body};
  --font-mono: ${fonts.mono};

  /* Font Sizes */
  --text-display: ${fontSizes.display};
  --text-h1: ${fontSizes.h1};
  --text-h2: ${fontSizes.h2};
  --text-h3: ${fontSizes.h3};
  --text-body: ${fontSizes.body};
  --text-small: ${fontSizes.small};
  --text-micro: ${fontSizes.micro};

  /* Spacing */
  --space-1: ${spacing[1]};
  --space-2: ${spacing[2]};
  --space-3: ${spacing[3]};
  --space-4: ${spacing[4]};
  --space-5: ${spacing[5]};
  --space-6: ${spacing[6]};
  --space-8: ${spacing[8]};
  --space-10: ${spacing[10]};
  --space-12: ${spacing[12]};
  --space-16: ${spacing[16]};
  --space-20: ${spacing[20]};

  /* Radii */
  --radius-sm: ${radii.sm};
  --radius-md: ${radii.md};
  --radius-lg: ${radii.lg};
  --radius-xl: ${radii.xl};
  --radius-2xl: ${radii['2xl']};
  --radius-full: ${radii.full};

  /* Transitions */
  --transition-fast: ${transitions.fast};
  --transition-normal: ${transitions.normal};
  --transition-slow: ${transitions.slow};
}
`.trim();
}
