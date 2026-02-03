// ============================================
// CV TEMPLATES - Definition & Export
// Used by TemplateGallery component
// ============================================

export interface CVTemplateDefinition {
    id: string;
    name: string;
    description: string;
    category: string;
    tier: 'free' | 'starter' | 'pro';
    popular: boolean;
    new?: boolean;
    atsOptimized?: boolean;
    layout: 'two-column' | 'sidebar' | 'single-column' | 'header-sidebar';
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        muted: string;
        accent: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
}

// ============================================
// ALL CV TEMPLATES
// ============================================

export const CV_TEMPLATES: CVTemplateDefinition[] = [
    // ============================================
    // ORIGINAL SAID COLLECTION (FREE)
    // ============================================
    {
        id: 'said-dark',
        name: 'Said Dark',
        description: 'Original - mörk sidebar, ljus innehåll, röd accent',
        category: 'modern',
        tier: 'free',
        popular: true,
        layout: 'sidebar',
        colors: {
            primary: '#0a0a0a',
            secondary: '#111111',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#888888',
            accent: '#ff4d4d',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'said-light',
        name: 'Said Light',
        description: 'Inverterad - ljus sidebar, mörk innehåll',
        category: 'modern',
        tier: 'free',
        popular: true,
        layout: 'sidebar',
        colors: {
            primary: '#f5f5f5',
            secondary: '#e8e8e8',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#666666',
            accent: '#0066ff',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'said-navy',
        name: 'Said Navy',
        description: 'Professionell - marinblå sidebar, varm accent',
        category: 'professional',
        tier: 'free',
        popular: true,
        layout: 'sidebar',
        colors: {
            primary: '#1a2744',
            secondary: '#243556',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#94a3b8',
            accent: '#f59e0b',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Inter', sans-serif",
        },
    },
    {
        id: 'said-forest',
        name: 'Said Forest',
        description: 'Naturlig - skogsgrön sidebar, jordnära accent',
        category: 'modern',
        tier: 'free',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1a2e1a',
            secondary: '#234023',
            background: '#faf9f7',
            text: '#1a1a1a',
            muted: '#94b894',
            accent: '#22c55e',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },

    // ============================================
    // TOM FORD COLLECTION - Lyxigt & Sofistikerat (STARTER)
    // ============================================
    {
        id: 'tf-noir-extreme',
        name: 'Noir Extreme',
        description: 'Tom Ford-inspirerad - Djup svart med guld',
        category: 'executive',
        tier: 'starter',
        popular: true,
        layout: 'sidebar',
        colors: {
            primary: '#0c0c0c',
            secondary: '#1a1a1a',
            background: '#fdfcfa',
            text: '#1c1a17',
            muted: '#7a7468',
            accent: '#b8860b',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'tf-oud-wood',
        name: 'Oud Wood',
        description: 'Varm brun med bärnsten-accent',
        category: 'executive',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1a1512',
            secondary: '#2a2520',
            background: '#faf8f5',
            text: '#2a2420',
            muted: '#9a8b7a',
            accent: '#c4884a',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'tf-tobacco-vanille',
        name: 'Tobacco Vanille',
        description: 'Rik tobaksbrun med vanilj-guld',
        category: 'executive',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1f1714',
            secondary: '#2f2724',
            background: '#fffaf5',
            text: '#2a221c',
            muted: '#a89080',
            accent: '#d4a553',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'tf-tuscan-leather',
        name: 'Tuscan Leather',
        description: 'Djupt vinrött läder med koppar',
        category: 'executive',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1a0f10',
            secondary: '#2a1f20',
            background: '#fdfafa',
            text: '#2a1a1a',
            muted: '#9a7a7a',
            accent: '#b87333',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'tf-velvet-orchid',
        name: 'Velvet Orchid',
        description: 'Djup plommon med roséguld',
        category: 'creative',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1a0f18',
            secondary: '#2a1f28',
            background: '#fdfafc',
            text: '#2a1a25',
            muted: '#9a7a90',
            accent: '#b76e79',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'tf-black-orchid',
        name: 'Black Orchid',
        description: 'Mystisk svart med djup lila',
        category: 'creative',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#0d0a10',
            secondary: '#1d1a20',
            background: '#fafafc',
            text: '#1a1720',
            muted: '#7a7088',
            accent: '#6b5b95',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },

    // ============================================
    // EXECUTIVE COLLECTION - Corporate Luxury (STARTER)
    // ============================================
    {
        id: 'exec-charcoal',
        name: 'Executive Charcoal',
        description: 'Kol med platina-accent',
        category: 'professional',
        tier: 'starter',
        popular: true,
        layout: 'sidebar',
        colors: {
            primary: '#1a1a1a',
            secondary: '#2a2a2a',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#808080',
            accent: '#8b8b8b',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Inter', sans-serif",
        },
    },
    {
        id: 'exec-midnight-blue',
        name: 'Midnight Blue',
        description: 'Djup midnattsblå med silver',
        category: 'professional',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#0d1520',
            secondary: '#1d2530',
            background: '#fafcff',
            text: '#1a2030',
            muted: '#7a8a9a',
            accent: '#a8b5c8',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Inter', sans-serif",
        },
    },
    {
        id: 'exec-slate',
        name: 'Executive Slate',
        description: 'Sofistikerad skiffer med teal',
        category: 'professional',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1a1e22',
            secondary: '#2a2e32',
            background: '#fafbfc',
            text: '#1a2025',
            muted: '#7a8085',
            accent: '#4a9a8a',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Inter', sans-serif",
        },
    },

    // ============================================
    // NATURE COLLECTION - Jordnära Elegans (STARTER)
    // ============================================
    {
        id: 'nature-sage',
        name: 'Sage Wisdom',
        description: 'Salviagrönt med terrakotta',
        category: 'creative',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#1a201a',
            secondary: '#2a302a',
            background: '#fafcfa',
            text: '#1a251a',
            muted: '#7a8a7a',
            accent: '#c17f59',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'nature-moss',
        name: 'Moss & Stone',
        description: 'Djup mossa med varm sten',
        category: 'creative',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#151a15',
            secondary: '#252a25',
            background: '#faf9f7',
            text: '#1a1f1a',
            muted: '#758575',
            accent: '#a08060',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'nature-ocean',
        name: 'Deep Ocean',
        description: 'Havsdjup med korall',
        category: 'creative',
        tier: 'starter',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#0a1520',
            secondary: '#1a2530',
            background: '#f8fcff',
            text: '#152530',
            muted: '#6a8a9a',
            accent: '#e07050',
        },
        fonts: {
            heading: "'Bebas Neue', sans-serif",
            body: "'Space Grotesk', sans-serif",
        },
    },

    // ============================================
    // MINIMAL COLLECTION (FREE)
    // ============================================
    {
        id: 'minimal-clean',
        name: 'Clean Minimal',
        description: 'Ren och enkel - svart på vitt',
        category: 'minimal',
        tier: 'free',
        popular: true,
        layout: 'single-column',
        colors: {
            primary: '#1a1a1a',
            secondary: '#333333',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#888888',
            accent: '#1a1a1a',
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif",
        },
    },
    {
        id: 'minimal-soft',
        name: 'Soft Minimal',
        description: 'Mjuk grå med subtil accent',
        category: 'minimal',
        tier: 'free',
        popular: false,
        layout: 'single-column',
        colors: {
            primary: '#4a4a4a',
            secondary: '#6a6a6a',
            background: '#fafafa',
            text: '#2a2a2a',
            muted: '#9a9a9a',
            accent: '#666666',
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif",
        },
    },

    // ============================================
    // CLASSIC COLLECTION (STARTER)
    // ============================================
    {
        id: 'classic-serif',
        name: 'Classic Serif',
        description: 'Tidlös elegans med serif-typsnitt',
        category: 'classic',
        tier: 'starter',
        popular: false,
        layout: 'single-column',
        colors: {
            primary: '#1a1a2e',
            secondary: '#2a2a4e',
            background: '#fffef8',
            text: '#1a1a1a',
            muted: '#666666',
            accent: '#8b4513',
        },
        fonts: {
            heading: "'Playfair Display', serif",
            body: "'Source Serif Pro', serif",
        },
    },
    {
        id: 'classic-formal',
        name: 'Formal Classic',
        description: 'Traditionell och formell',
        category: 'classic',
        tier: 'starter',
        popular: false,
        layout: 'single-column',
        colors: {
            primary: '#0a1628',
            secondary: '#1a2638',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#555555',
            accent: '#1a4480',
        },
        fonts: {
            heading: "'Times New Roman', serif",
            body: "'Georgia', serif",
        },
    },

    // ============================================
    // TECH COLLECTION (PRO)
    // ============================================
    {
        id: 'tech-terminal',
        name: 'Terminal',
        description: 'Hacker-stil med grönt på svart',
        category: 'tech',
        tier: 'pro',
        popular: true,
        layout: 'sidebar',
        colors: {
            primary: '#0a0a0a',
            secondary: '#1a1a1a',
            background: '#0d1117',
            text: '#c9d1d9',
            muted: '#8b949e',
            accent: '#39d353',
        },
        fonts: {
            heading: "'JetBrains Mono', monospace",
            body: "'JetBrains Mono', monospace",
        },
    },
    {
        id: 'tech-neon',
        name: 'Neon Cyber',
        description: 'Cyberpunk med neon-accenter',
        category: 'tech',
        tier: 'pro',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#0f0f1a',
            secondary: '#1a1a2e',
            background: '#0a0a12',
            text: '#e0e0ff',
            muted: '#8888aa',
            accent: '#ff00ff',
        },
        fonts: {
            heading: "'Orbitron', sans-serif",
            body: "'Space Mono', monospace",
        },
    },
    {
        id: 'tech-matrix',
        name: 'Matrix Code',
        description: 'Matrix-inspirerad med grön kod',
        category: 'tech',
        tier: 'pro',
        popular: false,
        layout: 'sidebar',
        colors: {
            primary: '#001100',
            secondary: '#002200',
            background: '#000800',
            text: '#00ff00',
            muted: '#008800',
            accent: '#00ff00',
        },
        fonts: {
            heading: "'Share Tech Mono', monospace",
            body: "'Share Tech Mono', monospace",
        },
    },

    // ============================================
    // CREATIVE COLLECTION (PRO)
    // ============================================
    {
        id: 'creative-gradient',
        name: 'Gradient Flow',
        description: 'Moderna gradienter och färger',
        category: 'creative',
        tier: 'pro',
        popular: false,
        layout: 'header-sidebar',
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#6b7280',
            accent: '#ec4899',
        },
        fonts: {
            heading: "'Poppins', sans-serif",
            body: "'Poppins', sans-serif",
        },
    },
    {
        id: 'creative-bold',
        name: 'Bold & Beautiful',
        description: 'Stora färger och djärva val',
        category: 'creative',
        tier: 'pro',
        popular: false,
        layout: 'two-column',
        colors: {
            primary: '#ff6b6b',
            secondary: '#feca57',
            background: '#ffffff',
            text: '#2d3436',
            muted: '#636e72',
            accent: '#00d2d3',
        },
        fonts: {
            heading: "'Montserrat', sans-serif",
            body: "'Open Sans', sans-serif",
        },
    },
    {
        id: 'creative-pastel',
        name: 'Pastel Dreams',
        description: 'Mjuka pastellfärger',
        category: 'creative',
        tier: 'pro',
        popular: false,
        layout: 'two-column',
        colors: {
            primary: '#dda0dd',
            secondary: '#b0e0e6',
            background: '#fff5f5',
            text: '#4a4a4a',
            muted: '#8a8a8a',
            accent: '#ff69b4',
        },
        fonts: {
            heading: "'Quicksand', sans-serif",
            body: "'Quicksand', sans-serif",
        },
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCVTemplatesByTier(tier: 'free' | 'starter' | 'pro'): CVTemplateDefinition[] {
    if (tier === 'free') return CV_TEMPLATES.filter(t => t.tier === 'free');
    if (tier === 'starter') return CV_TEMPLATES.filter(t => t.tier === 'free' || t.tier === 'starter');
    return CV_TEMPLATES;
}

export function getCVTemplateById(id: string): CVTemplateDefinition | undefined {
    return CV_TEMPLATES.find(t => t.id === id);
}

export function getPopularCVTemplates(): CVTemplateDefinition[] {
    return CV_TEMPLATES.filter(t => t.popular);
}

export function getCVTemplatesByCategory(category: string): CVTemplateDefinition[] {
    return CV_TEMPLATES.filter(t => t.category === category);
}
