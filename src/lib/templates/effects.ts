// ============================================
// PORTFOLYO.SE - Effekt-bibliotek
// Baserat på saidborna.com design
// ============================================

// Färgscheman (30 varianter)
export const colorSchemes = {
    // Mörka teman
    crimson: {
        id: 'crimson',
        name: 'Crimson Night',
        bgPrimary: '#0a0a0a',
        bgSecondary: '#111111',
        bgCard: '#161616',
        accent: '#ff4d4d',
        accentGlow: 'rgba(255, 77, 77, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#888888',
        textMuted: '#555555',
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Deep',
        bgPrimary: '#0a0f14',
        bgSecondary: '#0d1419',
        bgCard: '#121a22',
        accent: '#00d4ff',
        accentGlow: 'rgba(0, 212, 255, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#7a9bb0',
        textMuted: '#4a6577',
    },
    emerald: {
        id: 'emerald',
        name: 'Emerald Forest',
        bgPrimary: '#0a100e',
        bgSecondary: '#0d1511',
        bgCard: '#121c17',
        accent: '#00ff88',
        accentGlow: 'rgba(0, 255, 136, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#7ab092',
        textMuted: '#4a7760',
    },
    purple: {
        id: 'purple',
        name: 'Purple Haze',
        bgPrimary: '#0c0a14',
        bgSecondary: '#110d19',
        bgCard: '#181422',
        accent: '#a855f7',
        accentGlow: 'rgba(168, 85, 247, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#9b8ab0',
        textMuted: '#6b5a7f',
    },
    gold: {
        id: 'gold',
        name: 'Golden Hour',
        bgPrimary: '#0f0d0a',
        bgSecondary: '#15120d',
        bgCard: '#1c1812',
        accent: '#fbbf24',
        accentGlow: 'rgba(251, 191, 36, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#b0a07a',
        textMuted: '#7f7055',
    },
    rose: {
        id: 'rose',
        name: 'Rose Noir',
        bgPrimary: '#0f0a0c',
        bgSecondary: '#150d10',
        bgCard: '#1c1216',
        accent: '#f43f5e',
        accentGlow: 'rgba(244, 63, 94, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#b08a95',
        textMuted: '#7f5a65',
    },
    mint: {
        id: 'mint',
        name: 'Mint Fresh',
        bgPrimary: '#0a0f0e',
        bgSecondary: '#0d1412',
        bgCard: '#121b18',
        accent: '#2dd4bf',
        accentGlow: 'rgba(45, 212, 191, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#7ab0a5',
        textMuted: '#4a7f75',
    },
    coral: {
        id: 'coral',
        name: 'Coral Reef',
        bgPrimary: '#0f0c0a',
        bgSecondary: '#15110d',
        bgCard: '#1c1612',
        accent: '#fb7185',
        accentGlow: 'rgba(251, 113, 133, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#b09a8a',
        textMuted: '#7f6a5a',
    },

    // Ljusa teman
    lightMinimal: {
        id: 'lightMinimal',
        name: 'Light Minimal',
        bgPrimary: '#ffffff',
        bgSecondary: '#f8f9fa',
        bgCard: '#ffffff',
        accent: '#000000',
        accentGlow: 'rgba(0, 0, 0, 0.1)',
        textPrimary: '#111111',
        textSecondary: '#666666',
        textMuted: '#999999',
    },
    lightWarm: {
        id: 'lightWarm',
        name: 'Warm Light',
        bgPrimary: '#fffbf5',
        bgSecondary: '#fff5eb',
        bgCard: '#ffffff',
        accent: '#e67e22',
        accentGlow: 'rgba(230, 126, 34, 0.2)',
        textPrimary: '#2c2c2c',
        textSecondary: '#666666',
        textMuted: '#999999',
    },
    lightCool: {
        id: 'lightCool',
        name: 'Cool Light',
        bgPrimary: '#f5f9ff',
        bgSecondary: '#ebf3ff',
        bgCard: '#ffffff',
        accent: '#3b82f6',
        accentGlow: 'rgba(59, 130, 246, 0.2)',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        textMuted: '#94a3b8',
    },

    // Gradient teman
    gradientSunset: {
        id: 'gradientSunset',
        name: 'Gradient Sunset',
        bgPrimary: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        bgSecondary: 'rgba(15, 12, 41, 0.9)',
        bgCard: 'rgba(48, 43, 99, 0.5)',
        accent: '#ff6b6b',
        accentGlow: 'rgba(255, 107, 107, 0.4)',
        textPrimary: '#ffffff',
        textSecondary: '#c9c5d3',
        textMuted: '#8a869a',
    },
    gradientAurora: {
        id: 'gradientAurora',
        name: 'Gradient Aurora',
        bgPrimary: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
        bgSecondary: 'rgba(0, 4, 40, 0.9)',
        bgCard: 'rgba(0, 78, 146, 0.3)',
        accent: '#00ffaa',
        accentGlow: 'rgba(0, 255, 170, 0.4)',
        textPrimary: '#ffffff',
        textSecondary: '#a0d8ef',
        textMuted: '#6bb8d9',
    },
} as const;

// Animationer (20 varianter)
export const animations = {
    // Bakgrundsanimationer
    floatingOrbs: {
        id: 'floatingOrbs',
        name: 'Floating Orbs',
        css: `
      @keyframes float-orb {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(50px, -30px) scale(1.1); }
        50% { transform: translate(-30px, 50px) scale(0.9); }
        75% { transform: translate(-50px, -20px) scale(1.05); }
      }
    `,
        duration: '20s',
        easing: 'ease-in-out',
    },
    particleFloat: {
        id: 'particleFloat',
        name: 'Particle Float',
        css: `
      @keyframes particle-float {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
      }
    `,
        duration: '15s',
        easing: 'linear',
    },
    gradientShift: {
        id: 'gradientShift',
        name: 'Gradient Shift',
        css: `
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
        duration: '8s',
        easing: 'ease',
    },

    // Element-animationer
    fadeInUp: {
        id: 'fadeInUp',
        name: 'Fade In Up',
        css: `
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
        duration: '0.8s',
        easing: 'ease-out',
    },
    fadeInScale: {
        id: 'fadeInScale',
        name: 'Fade In Scale',
        css: `
      @keyframes fade-in-scale {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `,
        duration: '0.6s',
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    slideInLeft: {
        id: 'slideInLeft',
        name: 'Slide In Left',
        css: `
      @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
        duration: '0.6s',
        easing: 'ease-out',
    },
    slideInRight: {
        id: 'slideInRight',
        name: 'Slide In Right',
        css: `
      @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
        duration: '0.6s',
        easing: 'ease-out',
    },
    bounceIn: {
        id: 'bounceIn',
        name: 'Bounce In',
        css: `
      @keyframes bounce-in {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.1); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
    `,
        duration: '0.8s',
        easing: 'ease-out',
    },

    // Interaktiva animationer
    pulseGlow: {
        id: 'pulseGlow',
        name: 'Pulse Glow',
        css: `
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); }
        50% { box-shadow: 0 0 0 20px transparent; }
      }
    `,
        duration: '2s',
        easing: 'ease-in-out',
    },
    shimmer: {
        id: 'shimmer',
        name: 'Shimmer',
        css: `
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `,
        duration: '2s',
        easing: 'ease-in-out',
    },
    borderSpin: {
        id: 'borderSpin',
        name: 'Border Spin',
        css: `
      @keyframes border-spin {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
    `,
        duration: '3s',
        easing: 'linear',
    },
} as const;

// Hover-effekter (15 varianter)
export const hoverEffects = {
    lift: {
        id: 'lift',
        name: 'Lift',
        transform: 'translateY(-8px)',
        shadow: '0 20px 40px rgba(0,0,0,0.15)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    scale: {
        id: 'scale',
        name: 'Scale Up',
        transform: 'scale(1.05)',
        shadow: '0 15px 35px rgba(0,0,0,0.12)',
        transition: 'all 0.3s ease',
    },
    tilt: {
        id: 'tilt',
        name: 'Tilt 3D',
        transform: 'perspective(1000px) rotateX(-5deg) rotateY(5deg)',
        shadow: '10px 10px 30px rgba(0,0,0,0.15)',
        transition: 'all 0.4s ease',
    },
    glow: {
        id: 'glow',
        name: 'Glow',
        transform: 'translateY(-4px)',
        shadow: '0 0 40px var(--accent-glow), 0 15px 30px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
    },
    borderAccent: {
        id: 'borderAccent',
        name: 'Border Accent',
        border: '1px solid var(--accent)',
        shadow: '0 0 20px var(--accent-glow)',
        transition: 'all 0.3s ease',
    },
    morphCard: {
        id: 'morphCard',
        name: 'Morph Card',
        transform: 'scale(1.02)',
        borderRadius: '20px',
        shadow: '0 25px 50px rgba(0,0,0,0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    slideReveal: {
        id: 'slideReveal',
        name: 'Slide Reveal',
        transform: 'translateY(-5px)',
        clipPath: 'inset(0 0 0 0)',
        transition: 'all 0.4s ease',
    },
    rotateSubtle: {
        id: 'rotateSubtle',
        name: 'Rotate Subtle',
        transform: 'rotate(2deg) scale(1.02)',
        shadow: '0 15px 40px rgba(0,0,0,0.15)',
        transition: 'all 0.4s ease',
    },
    depthPush: {
        id: 'depthPush',
        name: 'Depth Push',
        transform: 'translateZ(20px) scale(1.02)',
        shadow: '0 30px 60px rgba(0,0,0,0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
} as const;

// Bakgrundsmönster (10 varianter)
export const backgroundPatterns = {
    noise: {
        id: 'noise',
        name: 'Noise Texture',
        css: `
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.03;
    `,
    },
    dots: {
        id: 'dots',
        name: 'Dot Pattern',
        css: `
      background-image: radial-gradient(circle, var(--text-muted) 1px, transparent 1px);
      background-size: 24px 24px;
      opacity: 0.3;
    `,
    },
    grid: {
        id: 'grid',
        name: 'Grid Lines',
        css: `
      background-image: linear-gradient(var(--text-muted) 1px, transparent 1px),
                        linear-gradient(90deg, var(--text-muted) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.1;
    `,
    },
    diagonalLines: {
        id: 'diagonalLines',
        name: 'Diagonal Lines',
        css: `
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        var(--text-muted) 10px,
        var(--text-muted) 11px
      );
      opacity: 0.05;
    `,
    },
    circuitBoard: {
        id: 'circuitBoard',
        name: 'Circuit Board',
        css: `
      background-image:
        linear-gradient(90deg, var(--accent) 1px, transparent 1px),
        linear-gradient(var(--accent) 1px, transparent 1px),
        radial-gradient(circle, var(--accent) 2px, transparent 2px);
      background-size: 100px 100px, 100px 100px, 100px 100px;
      background-position: 0 0, 0 0, 50px 50px;
      opacity: 0.05;
    `,
    },
    waves: {
        id: 'waves',
        name: 'Wave Pattern',
        css: `
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.03' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: repeat-x;
      background-position: bottom;
    `,
    },
    none: {
        id: 'none',
        name: 'No Pattern',
        css: '',
    },
} as const;

// Typografi-stilar (10 varianter)
export const typographyStyles = {
    modern: {
        id: 'modern',
        name: 'Modern Bold',
        headingFont: "'Bebas Neue', sans-serif",
        bodyFont: "'Space Grotesk', sans-serif",
        headingWeight: '400',
        headingLetterSpacing: '-2px',
        useOutlineText: true,
    },
    elegant: {
        id: 'elegant',
        name: 'Elegant Serif',
        headingFont: "'Playfair Display', serif",
        bodyFont: "'Source Sans Pro', sans-serif",
        headingWeight: '700',
        headingLetterSpacing: '-1px',
        useOutlineText: false,
    },
    tech: {
        id: 'tech',
        name: 'Tech Mono',
        headingFont: "'JetBrains Mono', monospace",
        bodyFont: "'Inter', sans-serif",
        headingWeight: '700',
        headingLetterSpacing: '0',
        useOutlineText: false,
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal Clean',
        headingFont: "'Inter', sans-serif",
        bodyFont: "'Inter', sans-serif",
        headingWeight: '800',
        headingLetterSpacing: '-1px',
        useOutlineText: false,
    },
    creative: {
        id: 'creative',
        name: 'Creative Display',
        headingFont: "'Archivo Black', sans-serif",
        bodyFont: "'DM Sans', sans-serif",
        headingWeight: '400',
        headingLetterSpacing: '0',
        useOutlineText: true,
    },
    classic: {
        id: 'classic',
        name: 'Classic Professional',
        headingFont: "'Montserrat', sans-serif",
        bodyFont: "'Lato', sans-serif",
        headingWeight: '700',
        headingLetterSpacing: '0',
        useOutlineText: false,
    },
    playful: {
        id: 'playful',
        name: 'Playful Rounded',
        headingFont: "'Poppins', sans-serif",
        bodyFont: "'Nunito', sans-serif",
        headingWeight: '800',
        headingLetterSpacing: '0',
        useOutlineText: false,
    },
    editorial: {
        id: 'editorial',
        name: 'Editorial Style',
        headingFont: "'Cormorant Garamond', serif",
        bodyFont: "'Crimson Pro', serif",
        headingWeight: '600',
        headingLetterSpacing: '2px',
        useOutlineText: false,
    },
} as const;

// Layouter (15 varianter)
export const layoutStyles = {
    splitHero: {
        id: 'splitHero',
        name: 'Split Hero',
        heroLayout: 'grid',
        heroColumns: '1fr 1fr',
        imagePosition: 'right',
        imageShape: 'circle',
        contentAlignment: 'left',
    },
    centeredHero: {
        id: 'centeredHero',
        name: 'Centered Hero',
        heroLayout: 'flex',
        heroColumns: '1fr',
        imagePosition: 'top',
        imageShape: 'circle',
        contentAlignment: 'center',
    },
    fullscreenImage: {
        id: 'fullscreenImage',
        name: 'Fullscreen Image',
        heroLayout: 'stack',
        heroColumns: '1fr',
        imagePosition: 'background',
        imageShape: 'none',
        contentAlignment: 'center',
    },
    asymmetric: {
        id: 'asymmetric',
        name: 'Asymmetric',
        heroLayout: 'grid',
        heroColumns: '2fr 1fr',
        imagePosition: 'right',
        imageShape: 'rounded',
        contentAlignment: 'left',
    },
    sidebar: {
        id: 'sidebar',
        name: 'Sidebar Layout',
        heroLayout: 'grid',
        heroColumns: '300px 1fr',
        imagePosition: 'left',
        imageShape: 'square',
        contentAlignment: 'left',
    },
    magazine: {
        id: 'magazine',
        name: 'Magazine Style',
        heroLayout: 'grid',
        heroColumns: '1fr 1fr',
        imagePosition: 'left',
        imageShape: 'none',
        contentAlignment: 'right',
    },
    stacked: {
        id: 'stacked',
        name: 'Stacked Sections',
        heroLayout: 'flex',
        heroColumns: '1fr',
        imagePosition: 'bottom',
        imageShape: 'rounded',
        contentAlignment: 'center',
    },
    overlapping: {
        id: 'overlapping',
        name: 'Overlapping Elements',
        heroLayout: 'relative',
        heroColumns: '1fr',
        imagePosition: 'overlap',
        imageShape: 'circle',
        contentAlignment: 'center',
    },
} as const;

// Export types
export type ColorScheme = typeof colorSchemes[keyof typeof colorSchemes];
export type Animation = typeof animations[keyof typeof animations];
export type HoverEffect = typeof hoverEffects[keyof typeof hoverEffects];
export type BackgroundPattern = typeof backgroundPatterns[keyof typeof backgroundPatterns];
export type TypographyStyle = typeof typographyStyles[keyof typeof typographyStyles];
export type LayoutStyle = typeof layoutStyles[keyof typeof layoutStyles];
