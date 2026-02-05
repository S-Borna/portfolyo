/**
 * Portfolio Renderer V2 - Exakt kopia av saidborna.com
 *
 * Sektioner:
 * 1. Hero (namn, titel, profilbild, CV-länk, meta-info)
 * 2. About (om mig, statistik, LIA-banner)
 * 3. Projects (projekt-kort med preview)
 * 4. Timeline (horisontell tidslinje med kurs-kort)
 * 5. Tech Stack (grid med verktyg)
 * 6. Contact (kontaktlänkar)
 *
 * Features:
 * - Flytande bakgrunds-orbs med animation
 * - Fade-in animationer på scroll
 * - Responsiv design (mobile-first)
 * - Språkstöd (sv/en)
 * - CV modal
 * - Hover-effekter överallt
 */

// ============================================
// DATA INTERFACES
// ============================================

export interface PortfolioDataV2 {
    // Meta
    language: 'sv' | 'en';

    // Hero
    fullName: string;
    firstName: string;
    lastName: string;
    title: string;           // "DevOps Engineer"
    tagline: string;         // Kort beskrivning under titeln
    profileImageUrl?: string;
    cvUrl?: string;

    // Meta items (under hero)
    metaItems: {
        label: string;
        value: string;
    }[];

    // About
    about: {
        paragraphs: {
            highlight: string;
            text: string;
        }[];
        badge?: {
            icon: string;
            text: string;
            link?: {
                url: string;
                label: string;
            };
        };
    };

    // Stats (4 kort)
    stats: {
        number: string;
        label: string;
    }[];

    // LIA/Internship Banner
    seeking?: {
        active: boolean;
        title: string;
        description: string;
        details: {
            label: string;
            value: string;
        }[];
        bgText?: string;
    };

    // Projects (max 5)
    projects: {
        tag: string;
        badge?: string;
        name: string;
        description: string;
        techStack: string[];
        link: {
            url: string;
            label: string;
        };
        previewImageUrl?: string;
    }[];

    // Timeline
    timeline: {
        intro: string;
        currentPosition: number;  // 0-5
        markers: {
            date: string;
        }[];
        cards: {
            period: string;
            title: string;
            subtitle: string;
            description: string;
            highlights: string[];
            projectNote?: string;
            badges?: string[];
            isCurrent?: boolean;
        }[];
    };

    // Tech Stack
    techStack: {
        name: string;
        tier: string;
        iconUrl: string;
        tooltip: string;
    }[];

    // Contact
    contact: {
        title: string;
        subtitle: string;
        links: {
            label: string;
            url: string;
            type: 'email' | 'phone' | 'linkedin' | 'github' | 'other';
        }[];
    };

    // Footer
    footer: {
        copyright: string;
        location: string;
    };
}

// ============================================
// TEMPLATE CONFIGURATION
// ============================================

export interface PortfolioTemplateConfigV2 {
    id: string;
    name: string;
    description: string;

    // Colors
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    accent: string;
    accentGlow: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    // Fonts
    fontHeading: string;
    fontBody: string;
}

export const PORTFOLIO_TEMPLATES_V2: PortfolioTemplateConfigV2[] = [
    // ============================================
    // FREE COLLECTION - 4 distinkta starter-templates
    // ============================================
    {
        id: 'dark-ember',
        name: 'Dark Ember',
        description: 'Klassisk mörk med eldröd accent - tidlös',
        bgPrimary: '#0a0a0a',
        bgSecondary: '#111111',
        bgCard: '#161616',
        accent: '#ff4d4d',
        accentGlow: 'rgba(255, 77, 77, 0.3)',
        textPrimary: '#ffffff',
        textSecondary: '#888888',
        textMuted: '#555555',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'midnight-gold',
        name: 'Midnight Gold',
        description: 'Elegant midnatt med lyxig guld-accent',
        bgPrimary: '#0c0c0c',
        bgSecondary: '#101010',
        bgCard: '#151515',
        accent: '#d4a553',
        accentGlow: 'rgba(212, 165, 83, 0.35)',
        textPrimary: '#f4f0e8',
        textSecondary: '#8a8478',
        textMuted: '#5a5650',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'ocean-teal',
        name: 'Ocean Teal',
        description: 'Havsdjup med frisk teal-accent',
        bgPrimary: '#0a0f12',
        bgSecondary: '#0f1518',
        bgCard: '#141c20',
        accent: '#14b8a6',
        accentGlow: 'rgba(20, 184, 166, 0.35)',
        textPrimary: '#e8f4f3',
        textSecondary: '#7a9a98',
        textMuted: '#4a5f5e',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'light-minimal',
        name: 'Light Minimal',
        description: 'Ren ljus design med blå accent',
        bgPrimary: '#f8fafc',
        bgSecondary: '#f0f4f8',
        bgCard: '#ffffff',
        accent: '#2563eb',
        accentGlow: 'rgba(37, 99, 235, 0.2)',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },

    // ============================================
    // STARTER COLLECTION - 6 varierade templates
    // ============================================
    {
        id: 'velvet-rose',
        name: 'Velvet Rose',
        description: 'Djup plommon med roséguld-elegans',
        bgPrimary: '#0c080a',
        bgSecondary: '#110d10',
        bgCard: '#181218',
        accent: '#b76e79',
        accentGlow: 'rgba(183, 110, 121, 0.35)',
        textPrimary: '#f5e8f0',
        textSecondary: '#9a7a90',
        textMuted: '#5a4a55',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'mystic-violet',
        name: 'Mystic Violet',
        description: 'Mystisk natt med djup lila accent',
        bgPrimary: '#08070a',
        bgSecondary: '#0d0c10',
        bgCard: '#141218',
        accent: '#8b5cf6',
        accentGlow: 'rgba(139, 92, 246, 0.4)',
        textPrimary: '#e8e0f0',
        textSecondary: '#8a80a0',
        textMuted: '#4a4560',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'forest-sage',
        name: 'Forest Sage',
        description: 'Naturlig skog med terrakotta-accent',
        bgPrimary: '#0a0c0a',
        bgSecondary: '#0f120f',
        bgCard: '#161a16',
        accent: '#c17f59',
        accentGlow: 'rgba(193, 127, 89, 0.35)',
        textPrimary: '#e8f0e8',
        textSecondary: '#8a9a8a',
        textMuted: '#4a5a4a',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'slate-steel',
        name: 'Slate Steel',
        description: 'Professionell skiffer med cool teal',
        bgPrimary: '#0c0e10',
        bgSecondary: '#111416',
        bgCard: '#181c1e',
        accent: '#4a9a8a',
        accentGlow: 'rgba(74, 154, 138, 0.35)',
        textPrimary: '#e8eaec',
        textSecondary: '#8a9095',
        textMuted: '#4a5055',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
    {
        id: 'cream-espresso',
        name: 'Cream Espresso',
        description: 'Varm kräm med rik espresso-accent',
        bgPrimary: '#faf8f5',
        bgSecondary: '#f5f0ea',
        bgCard: '#ffffff',
        accent: '#6b4423',
        accentGlow: 'rgba(107, 68, 35, 0.2)',
        textPrimary: '#1a1512',
        textSecondary: '#5a5048',
        textMuted: '#8a8078',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'blush-rose',
        name: 'Blush Rose',
        description: 'Mjuk rosa med elegant roséguld',
        bgPrimary: '#fdf8f8',
        bgSecondary: '#f8f0f0',
        bgCard: '#ffffff',
        accent: '#b76e79',
        accentGlow: 'rgba(183, 110, 121, 0.2)',
        textPrimary: '#2a1a1f',
        textSecondary: '#5a4a50',
        textMuted: '#9a8a90',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },

    // ============================================
    // PRO COLLECTION - Unika & Djärva
    // ============================================
    {
        id: 'burgundy-gold',
        name: 'Burgundy Gold',
        description: 'Rik vinröd natt med glänsande guld',
        bgPrimary: '#0a0508',
        bgSecondary: '#10090c',
        bgCard: '#180f14',
        accent: '#c9a227',
        accentGlow: 'rgba(201, 162, 39, 0.4)',
        textPrimary: '#f5e5e8',
        textSecondary: '#a08088',
        textMuted: '#5a4a50',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'sapphire-bronze',
        name: 'Sapphire Bronze',
        description: 'Djup safirblå med varm brons',
        bgPrimary: '#06080f',
        bgSecondary: '#0a0d16',
        bgCard: '#12161e',
        accent: '#cd7f32',
        accentGlow: 'rgba(205, 127, 50, 0.4)',
        textPrimary: '#e0e8f5',
        textSecondary: '#8090a8',
        textMuted: '#4a5568',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'emerald-gold',
        name: 'Emerald Gold',
        description: 'Smaragdgrön med metalliskt guld',
        bgPrimary: '#060a08',
        bgSecondary: '#0a100c',
        bgCard: '#121a16',
        accent: '#d4af37',
        accentGlow: 'rgba(212, 175, 55, 0.4)',
        textPrimary: '#e0f0ea',
        textSecondary: '#80a090',
        textMuted: '#4a5a55',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'arctic-fire',
        name: 'Arctic Fire',
        description: 'Isig natt med intensiv eldröd accent',
        bgPrimary: '#0a1015',
        bgSecondary: '#0f1520',
        bgCard: '#161c24',
        accent: '#dc2626',
        accentGlow: 'rgba(220, 38, 38, 0.45)',
        textPrimary: '#e8f0f5',
        textSecondary: '#8aa0b0',
        textMuted: '#4a6070',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'desert-oasis',
        name: 'Desert Oasis',
        description: 'Varm ökennatten med turkos-oasis',
        bgPrimary: '#0c0a08',
        bgSecondary: '#12100c',
        bgCard: '#1a1814',
        accent: '#14b8a6',
        accentGlow: 'rgba(20, 184, 166, 0.45)',
        textPrimary: '#f5f0e8',
        textSecondary: '#a09888',
        textMuted: '#5a5248',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'royal-amethyst',
        name: 'Royal Amethyst',
        description: 'Kunglig lila med antikt guld',
        bgPrimary: '#0a0810',
        bgSecondary: '#100e18',
        bgCard: '#181420',
        accent: '#cfb53b',
        accentGlow: 'rgba(207, 181, 59, 0.45)',
        textPrimary: '#f0e8f5',
        textSecondary: '#a098b0',
        textMuted: '#5a5068',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'electric-magenta',
        name: 'Electric Magenta',
        description: 'Vibrerande magenta med elektrisk cyan',
        bgPrimary: '#a21caf',
        bgSecondary: '#c026d3',
        bgCard: '#d946ef',
        accent: '#22d3ee',
        accentGlow: 'rgba(34, 211, 238, 0.4)',
        textPrimary: '#ffffff',
        textSecondary: '#f5d0fe',
        textMuted: '#e879f9',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'turquoise-coral',
        name: 'Turquoise Coral',
        description: 'Levande turkos med varm korall',
        bgPrimary: '#0d9488',
        bgSecondary: '#14b8a6',
        bgCard: '#2dd4bf',
        accent: '#fb7185',
        accentGlow: 'rgba(251, 113, 133, 0.4)',
        textPrimary: '#ffffff',
        textSecondary: '#ccfbf1',
        textMuted: '#99f6e4',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'nordic-aurora',
        name: 'Nordic Aurora',
        description: 'Arktisk natt med magiskt norrsken',
        bgPrimary: '#0f172a',
        bgSecondary: '#1e293b',
        bgCard: '#334155',
        accent: '#22c55e',
        accentGlow: 'rgba(34, 197, 94, 0.5)',
        textPrimary: '#f0fdf4',
        textSecondary: '#86efac',
        textMuted: '#4ade80',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'sunset-rose',
        name: 'Sunset Rose',
        description: 'Solnedgång i rosa med orange glöd',
        bgPrimary: '#7c2d6a',
        bgSecondary: '#9d3d7a',
        bgCard: '#b84d8a',
        accent: '#fca311',
        accentGlow: 'rgba(252, 163, 17, 0.5)',
        textPrimary: '#ffffff',
        textSecondary: '#f0c0e0',
        textMuted: '#d0a0c0',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'deep-violet',
        name: 'Deep Violet',
        description: 'Djup violett natt med elektrisk cyan',
        bgPrimary: '#1e1040',
        bgSecondary: '#2a1660',
        bgCard: '#3a2080',
        accent: '#00d4ff',
        accentGlow: 'rgba(0, 212, 255, 0.4)',
        textPrimary: '#e8e0ff',
        textSecondary: '#b0a0d0',
        textMuted: '#8070a0',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'royal-blue',
        name: 'Royal Blue',
        description: 'Kunglig blå med gyllene accent',
        bgPrimary: '#1e3a8a',
        bgSecondary: '#1e40af',
        bgCard: '#2563eb',
        accent: '#fbbf24',
        accentGlow: 'rgba(251, 191, 36, 0.4)',
        textPrimary: '#ffffff',
        textSecondary: '#bfdbfe',
        textMuted: '#93c5fd',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
    {
        id: 'sweden-pride',
        name: 'Sweden Pride',
        description: 'Svenska färger - blå & gul',
        bgPrimary: '#005293',
        bgSecondary: '#004080',
        bgCard: '#0066b3',
        accent: '#fecc00',
        accentGlow: 'rgba(254, 204, 0, 0.5)',
        textPrimary: '#ffffff',
        textSecondary: '#a0c4e8',
        textMuted: '#70a0d0',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
    {
        id: 'emerald-vivid',
        name: 'Emerald Vivid',
        description: 'Levande smaragdgrön med guld',
        bgPrimary: '#065f46',
        bgSecondary: '#047857',
        bgCard: '#059669',
        accent: '#fcd34d',
        accentGlow: 'rgba(252, 211, 77, 0.4)',
        textPrimary: '#ffffff',
        textSecondary: '#a7f3d0',
        textMuted: '#6ee7b7',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
];

export function getPortfolioTemplateV2(id: string): PortfolioTemplateConfigV2 {
    return PORTFOLIO_TEMPLATES_V2.find(t => t.id === id) || PORTFOLIO_TEMPLATES_V2[0];
}

// ============================================
// MAIN RENDERER
// ============================================

export interface PortfolioRenderOptions {
    previewMode?: boolean;
}

export function renderPortfolioV2(
    data: PortfolioDataV2,
    templateId: string = 'said-dark',
    options: PortfolioRenderOptions = {}
): string {
    const t = getPortfolioTemplateV2(templateId);
    const { previewMode = false } = options;

    // Preview mode: Statisk snapshot som visar hero med innehåll synligt
    const previewStyles = previewMode ? `
    /* === PREVIEW MODE - Statisk snapshot === */
    /* Stoppa alla animationer */
    *, *::before, *::after {
        animation: none !important;
        transition: none !important;
    }

    /* Bakgrundsorbarna statiska */
    .bg-animation .orb {
        animation: none !important;
    }

    /* Dölj onödiga element i preview */
    footer, .cta-button, .cv-modal, .cv-modal-overlay {
        display: none !important;
    }

    /* VIKTIGT: Ersätt 100vh med fasta höjder för förutsägbar scrollning */
    .hero {
        min-height: 700px !important;
        height: auto !important;
    }

    section {
        padding: 60px 4rem !important;
    }

    /* Kompaktare sektioner för preview */
    .about { min-height: auto !important; }
    .projects { min-height: auto !important; }
    .timeline { min-height: auto !important; }
    .stack { min-height: auto !important; }
    .contact {
        min-height: auto !important;
        padding: 80px 4rem !important;
    }

    /* Timeline mer kompakt */
    .timeline-content {
        min-height: 300px !important;
    }
    ` : '';

    return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(data.fullName)} | ${escapeHtml(data.title)}</title>
    <meta name="description" content="${escapeHtml(data.tagline)}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
${generateCSS(t)}
${previewStyles}
    </style>
</head>
<body>
    <div class="bg-animation">
        <div class="orb"></div>
        <div class="orb"></div>
        <div class="orb"></div>
    </div>

    ${renderNav(data, t)}
    ${renderHero(data, t)}
    ${renderAbout(data, t)}
    ${renderProjects(data, t)}
    ${renderTimeline(data, t)}
    ${renderTechStack(data, t)}
    ${renderContact(data, t)}
    ${renderCvModal(data, t)}
    ${renderCtaButton(data)}
    ${renderFooter(data)}

    <script>
${generateJS(data.language)}
    </script>
</body>
</html>`;
}

// ============================================
// CSS GENERATION
// ============================================

function generateCSS(t: PortfolioTemplateConfigV2): string {
    return `
    :root {
        --bg-primary: ${t.bgPrimary};
        --bg-secondary: ${t.bgSecondary};
        --bg-card: ${t.bgCard};
        --accent: ${t.accent};
        --accent-glow: ${t.accentGlow};
        --text-primary: ${t.textPrimary};
        --text-secondary: ${t.textSecondary};
        --text-muted: ${t.textMuted};
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        font-family: ${t.fontBody};
        background: var(--bg-primary);
        color: var(--text-primary);
        line-height: 1.6;
        overflow-x: hidden;
    }

    /* === BACKGROUND ANIMATION === */
    .bg-animation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
    }

    .bg-animation .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.4;
        animation: float-orb 20s ease-in-out infinite;
    }

    .bg-animation .orb:nth-child(1) {
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        top: -200px;
        right: -100px;
        animation-delay: 0s;
    }

    .bg-animation .orb:nth-child(2) {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        bottom: -100px;
        left: -100px;
        animation-delay: -7s;
    }

    .bg-animation .orb:nth-child(3) {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
        top: 50%;
        left: 30%;
        animation-delay: -14s;
    }

    @keyframes float-orb {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(50px, -30px) scale(1.1); }
        50% { transform: translate(-30px, 50px) scale(0.9); }
        75% { transform: translate(-50px, -20px) scale(1.05); }
    }

    /* Noise overlay */
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 1000;
    }

    /* === NAVIGATION === */
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1.5rem 4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 100;
        background: linear-gradient(to bottom, var(--bg-primary), transparent);
    }

    .logo {
        font-family: ${t.fontHeading};
        font-size: 1.5rem;
        letter-spacing: 2px;
    }

    .nav-links {
        display: flex;
        gap: 2.5rem;
        list-style: none;
    }

    .nav-links a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.85rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: color 0.3s ease;
    }

    .nav-links a:hover {
        color: var(--accent);
    }

    /* === HERO === */
    .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        padding: 0 4rem;
        position: relative;
    }

    .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
    }

    .hero-text {
        max-width: 600px;
    }

    .hero-image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .hero-profile-image {
        width: 320px;
        height: 320px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center 20%;
        border: 4px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
        position: relative;
        z-index: 2;
        transition: all 0.4s ease;
    }

    .hero-profile-image:hover {
        transform: scale(1.02);
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3);
    }

    .hero-label {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        color: var(--accent);
        font-size: 0.85rem;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 1.5rem;
    }

    .hero-label::before {
        content: '';
        width: 40px;
        height: 2px;
        background: var(--accent);
    }

    .hero-name {
        font-family: ${t.fontHeading};
        font-size: clamp(4rem, 8vw, 7rem);
        line-height: 0.9;
        letter-spacing: -2px;
        margin-bottom: 1.5rem;
    }

    .hero-name .outline {
        -webkit-text-stroke: 2px var(--text-primary);
        -webkit-text-fill-color: transparent;
    }

    .hero-title {
        font-size: 1.2rem;
        color: var(--text-secondary);
        font-weight: 400;
        margin-bottom: 2rem;
        line-height: 1.7;
    }

    /* CV Link */
    .cv-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .cv-arrow-indicator {
        display: flex;
        align-items: center;
        animation: bounce-arrow 1.5s ease-in-out infinite;
    }

    .cv-arrow-indicator svg {
        width: 28px;
        height: 28px;
        fill: var(--accent);
        filter: drop-shadow(0 0 8px var(--accent-glow));
    }

    @keyframes bounce-arrow {
        0%, 100% { transform: translateX(0); opacity: 1; }
        50% { transform: translateX(8px); opacity: 0.6; }
    }

    .hero-cv-link {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--accent);
        text-decoration: none;
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 0.75rem 1.5rem;
        background: rgba(255, 77, 77, 0.08);
        border: 1px solid rgba(255, 77, 77, 0.3);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        position: relative;
    }

    .hero-cv-link:hover {
        transform: scale(1.08);
        background: rgba(255, 77, 77, 0.15);
        border-color: var(--accent);
        box-shadow: 0 0 30px var(--accent-glow), 0 0 60px rgba(255, 77, 77, 0.2);
    }

    .cv-icon svg {
        width: 22px;
        height: 22px;
        fill: var(--accent);
        transition: all 0.4s ease;
    }

    .hero-meta {
        display: flex;
        gap: 3rem;
        margin-top: 2rem;
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .meta-label {
        color: var(--accent);
        font-size: 0.75rem;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    .scroll-indicator {
        position: absolute;
        bottom: 3rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-muted);
        font-size: 0.75rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(10px); }
    }

    /* === SECTIONS === */
    section {
        padding: 8rem 4rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 4rem;
    }

    .section-label {
        color: var(--accent);
        font-size: 0.85rem;
        letter-spacing: 3px;
        text-transform: uppercase;
    }

    .section-line {
        flex: 1;
        height: 1px;
        background: var(--text-muted);
        max-width: 100px;
    }

    .section-title {
        font-family: ${t.fontHeading};
        font-size: clamp(3rem, 8vw, 6rem);
        line-height: 1;
        margin-bottom: 2rem;
    }

    .section-title .outline {
        -webkit-text-stroke: 1px var(--text-primary);
        -webkit-text-fill-color: transparent;
    }

    /* === ABOUT === */
    .about {
        background: var(--bg-secondary);
    }

    .about-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        max-width: 1400px;
    }

    .about-text {
        font-size: 1.1rem;
        color: var(--text-secondary);
        line-height: 1.8;
    }

    .about-text p {
        margin-bottom: 1.5rem;
    }

    .about-highlight {
        color: var(--text-primary);
        font-weight: 500;
    }

    .student-rep-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(255, 77, 77, 0.1);
        border: 1px solid rgba(255, 77, 77, 0.3);
        padding: 0.75rem 1.25rem;
        margin-top: 1.5rem;
        font-size: 0.95rem;
        color: var(--text-primary);
        flex-wrap: wrap;
    }

    .badge-icon {
        color: var(--accent);
        font-size: 1.1rem;
    }

    .diploma-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: 1rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 77, 77, 0.05);
        border: 1px solid rgba(255, 77, 77, 0.2);
        border-radius: 4px;
        color: var(--accent);
        text-decoration: none;
        font-size: 0.85rem;
        transition: all 0.3s ease;
    }

    .diploma-link:hover {
        background: rgba(255, 77, 77, 0.15);
        border-color: var(--accent);
        transform: translateX(3px);
    }

    .about-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    .stat-card {
        background: var(--bg-card);
        padding: 2rem;
        border: 1px solid #222;
        transition: all 0.3s ease;
    }

    .stat-card:hover {
        border-color: var(--accent);
        transform: translateY(-5px);
    }

    .stat-number {
        font-family: ${t.fontHeading};
        font-size: 3rem;
        color: var(--accent);
        line-height: 1;
    }

    .stat-label {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    /* === LIA BANNER === */
    .lia-banner {
        background: linear-gradient(135deg, var(--accent) 0%, ${adjustColor(t.accent, -20)} 100%);
        padding: 4rem;
        margin-top: 4rem;
        position: relative;
        overflow: hidden;
    }

    .lia-banner::before {
        content: attr(data-bg-text);
        position: absolute;
        right: -50px;
        top: 50%;
        transform: translateY(-50%);
        font-family: ${t.fontHeading};
        font-size: 20rem;
        opacity: 0.1;
        line-height: 1;
    }

    .lia-content {
        position: relative;
        z-index: 2;
    }

    .lia-title {
        font-family: ${t.fontHeading};
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .lia-details {
        display: flex;
        gap: 3rem;
        margin-top: 1.5rem;
    }

    .lia-item {
        display: flex;
        flex-direction: column;
    }

    .lia-item-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.8;
    }

    .lia-item-value {
        font-size: 1.1rem;
        font-weight: 600;
    }

    /* === PROJECTS === */
    .projects {
        background: var(--bg-primary);
    }

    .project-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 3rem;
    }

    .project-card {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 3rem;
        background: var(--bg-secondary);
        border: 1px solid #1a1a1a;
        transition: all 0.4s ease;
    }

    .project-card:hover {
        border-color: var(--accent);
        transform: scale(1.01);
    }

    .project-info {
        padding: 2rem 0;
    }

    .project-tag {
        display: inline-block;
        background: var(--accent);
        color: var(--bg-primary);
        padding: 0.3rem 0.8rem;
        font-size: 0.7rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 1rem;
    }

    .project-badge {
        display: inline-block;
        background: transparent;
        color: var(--accent);
        padding: 0.3rem 0.8rem;
        font-size: 0.65rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-left: 0.5rem;
        border: 1px solid var(--accent);
    }

    .project-name {
        font-family: ${t.fontHeading};
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .project-description {
        color: var(--text-secondary);
        margin-bottom: 2rem;
        line-height: 1.8;
    }

    .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .tech-tag {
        background: var(--bg-card);
        border: 1px solid #333;
        padding: 0.4rem 0.8rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .project-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent);
        text-decoration: none;
        font-weight: 500;
        transition: gap 0.3s ease;
    }

    .project-link:hover {
        gap: 1rem;
    }

    .project-preview {
        background: var(--bg-card);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .project-preview img {
        width: 100%;
        height: auto;
        display: block;
    }

    /* === TIMELINE === */
    .timeline {
        background: var(--bg-secondary);
        position: relative;
        overflow: hidden;
    }

    .timeline-intro {
        max-width: 700px;
        margin: 0 auto 2.5rem;
        text-align: center;
        color: var(--text-secondary);
        font-size: 1rem;
        line-height: 1.6;
    }

    .timeline-container {
        max-width: 1600px;
        margin: 0 auto;
        position: relative;
        padding: 2rem 2rem 2rem;
    }

    .timeline-track {
        position: relative;
        height: 70px;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
    }

    .timeline-line {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 3px;
        background: linear-gradient(to right,
            var(--accent) 0%,
            var(--accent) 66%,
            var(--accent-glow) 66%,
            var(--accent-glow) 100%);
        transform: translateY(-50%);
    }

    .timeline-markers {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        padding: 0 1%;
    }

    .timeline-marker {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .timeline-dot {
        width: 18px;
        height: 18px;
        background: var(--accent);
        border-radius: 50%;
        border: 3px solid var(--bg-secondary);
        box-shadow: 0 0 0 3px var(--accent-glow);
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;
    }

    .timeline-marker:hover .timeline-dot {
        transform: scale(1.3);
        box-shadow: 0 0 0 5px var(--accent-glow), 0 0 20px var(--accent-glow);
    }

    .timeline-current-pointer {
        position: absolute;
        top: 50%;
        left: 66%;
        transform: translate(-50%, -50%);
        z-index: 10;
        animation: dance 3s ease-in-out infinite;
    }

    @keyframes dance {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        25% { transform: translate(-50%, -55%) scale(1.1); }
        50% { transform: translate(-50%, -50%) scale(1.15); }
        75% { transform: translate(-50%, -45%) scale(1.1); }
    }

    .timeline-pointer-dot {
        width: 28px;
        height: 28px;
        background: var(--accent);
        border-radius: 50%;
        border: 4px solid var(--bg-secondary);
        box-shadow: 0 0 0 6px var(--accent-glow), 0 0 30px var(--accent-glow);
        position: relative;
        animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 6px var(--accent-glow), 0 0 30px var(--accent-glow); }
        50% { box-shadow: 0 0 0 8px var(--accent-glow), 0 0 50px var(--accent); }
    }

    .timeline-pointer-label {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        color: var(--bg-primary);
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 1px;
        white-space: nowrap;
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-5px); }
    }

    .timeline-pointer-label::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--accent);
    }

    .timeline-date {
        color: var(--text-secondary);
        font-weight: 600;
        font-size: 0.7rem;
        text-align: center;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-top: 0.5rem;
        transition: color 0.3s ease;
    }

    .timeline-marker:hover .timeline-date {
        color: var(--accent);
    }

    .timeline-cards {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 1rem;
        max-width: 100%;
    }

    .timeline-item {
        position: relative;
    }

    .timeline-content {
        background: var(--bg-card);
        padding: 1rem;
        border: 1px solid #222;
        border-radius: 8px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        min-height: 480px;
    }

    .timeline-content:hover {
        border-color: var(--accent);
        box-shadow: 0 20px 60px var(--accent-glow), 0 0 0 2px var(--accent);
        z-index: 100;
        padding: 1.5rem;
        transform: scale(1.2) translateY(-15px);
    }

    .timeline-period {
        display: inline-block;
        background: rgba(255, 77, 77, 0.1);
        color: var(--accent);
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        font-size: 0.6rem;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        white-space: nowrap;
        line-height: 1;
    }

    .timeline-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.4rem;
        line-height: 1.2;
        transition: all 0.3s ease;
    }

    .timeline-content:hover .timeline-title {
        font-size: 1.1rem;
        color: var(--accent);
    }

    .timeline-subtitle {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--accent);
        margin-bottom: 0.5rem;
        line-height: 1.2;
    }

    .timeline-description {
        color: var(--text-secondary);
        line-height: 1.4;
        margin-bottom: 0.5rem;
        font-size: 0.75rem;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .timeline-content:hover .timeline-description {
        max-height: 200px;
        opacity: 1;
        margin-bottom: 0.75rem;
    }

    .timeline-highlights {
        list-style: none;
        margin-top: 0.5rem;
        flex-grow: 1;
    }

    .timeline-highlights li {
        color: var(--text-secondary);
        padding-left: 1.1rem;
        margin-bottom: 0.25rem;
        position: relative;
        line-height: 1.3;
        font-size: 0.7rem;
    }

    .timeline-highlights li::before {
        content: "→";
        position: absolute;
        left: 0;
        color: var(--accent);
        font-weight: bold;
        font-size: 0.8rem;
    }

    .timeline-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        background: rgba(255, 77, 77, 0.1);
        color: var(--accent);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
        margin-top: 0.5rem;
        margin-right: 0.3rem;
    }

    .timeline-project-note {
        margin-top: auto;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255, 77, 77, 0.2);
        color: var(--text-secondary);
        font-size: 0.7rem;
        line-height: 1.4;
        font-style: italic;
    }

    .timeline-project-note strong {
        color: var(--accent);
        font-weight: 600;
    }

    .timeline-current {
        position: relative;
        border-color: var(--accent) !important;
    }

    .timeline-current::after {
        content: "PÅGÅENDE";
        position: absolute;
        top: -10px;
        right: -10px;
        background: var(--accent);
        color: var(--bg-primary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        animation: pulse 2s ease-in-out infinite;
        z-index: 3;
    }

    html[lang="en"] .timeline-current::after {
        content: "ONGOING";
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }

    /* === TECH STACK === */
    .stack {
        background: var(--bg-secondary);
    }

    .stack-intro {
        max-width: 600px;
        color: var(--text-secondary);
        margin-bottom: 4rem;
        font-size: 1.1rem;
    }

    .stack-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
    }

    .stack-item {
        background: var(--bg-card);
        border: 1px solid #222;
        padding: 1.5rem 1rem;
        text-align: center;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
    }

    .stack-item:hover {
        border-color: var(--accent);
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px var(--accent-glow);
    }

    .stack-item:hover .stack-icon img {
        transform: scale(1.15) rotate(5deg);
        filter: drop-shadow(0 0 8px var(--accent-glow));
    }

    .stack-item:hover .stack-name {
        color: var(--accent);
    }

    .stack-icon {
        width: 40px;
        height: 40px;
        margin: 0 auto 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stack-icon img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .stack-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
        transition: color 0.3s ease;
    }

    .stack-tier {
        font-size: 0.65rem;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* Tooltip */
    .stack-item[data-tooltip]::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 16px);
        left: 50%;
        transform: translateX(-50%) translateY(8px) scale(0.96);
        background: linear-gradient(135deg, rgba(30, 30, 32, 0.95) 0%, rgba(20, 20, 22, 0.98) 100%);
        backdrop-filter: blur(20px);
        padding: 12px 18px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.95);
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 1000;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .stack-item[data-tooltip]:hover::after {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0) scale(1);
    }

    /* === CONTACT === */
    .contact {
        text-align: center;
        padding: 10rem 4rem;
    }

    .contact-title {
        font-family: ${t.fontHeading};
        font-size: clamp(3rem, 10vw, 8rem);
        margin-bottom: 2rem;
    }

    .contact-subtitle {
        color: var(--text-secondary);
        font-size: 1.2rem;
        margin-bottom: 3rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .contact-links {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .contact-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-primary);
        text-decoration: none;
        padding: 1rem 2rem;
        border: 1px solid #333;
        transition: all 0.3s ease;
    }

    .contact-link:hover {
        border-color: var(--accent);
        background: var(--accent);
        color: var(--bg-primary);
    }

    /* === CTA BUTTON === */
    .cta-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: var(--accent);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var(--bg-primary);
        font-weight: 600;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 10px 40px var(--accent-glow);
        transition: all 0.3s ease;
        z-index: 50;
        text-align: center;
        line-height: 1.3;
        padding: 0.5rem;
    }

    .cta-button:hover {
        transform: scale(1.1);
        box-shadow: 0 15px 50px var(--accent-glow);
    }

    .cta-button .arrow {
        font-size: 1.2rem;
        margin-bottom: 0.15rem;
        display: block;
    }

    /* === CV MODAL === */
    .cv-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .cv-modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .cv-modal {
        background: var(--bg-secondary);
        border: 1px solid #333;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s ease;
    }

    .cv-modal-overlay.active .cv-modal {
        transform: scale(1) translateY(0);
    }

    .cv-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #333;
    }

    .cv-modal-title {
        font-family: ${t.fontHeading};
        font-size: 1.5rem;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .cv-modal-title svg {
        width: 24px;
        height: 24px;
        fill: var(--accent);
    }

    .cv-modal-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .cv-download-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--accent);
        color: var(--bg-primary);
        padding: 0.6rem 1.2rem;
        border: none;
        cursor: pointer;
        font-family: ${t.fontBody};
        font-size: 0.85rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .cv-download-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 20px var(--accent-glow);
    }

    .cv-download-btn svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
    }

    .cv-modal-close {
        background: none;
        border: 1px solid #444;
        color: var(--text-secondary);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.5rem;
    }

    .cv-modal-close:hover {
        border-color: var(--accent);
        color: var(--accent);
    }

    .cv-modal-body {
        flex: 1;
        overflow: auto;
        padding: 0;
    }

    .cv-modal-body iframe {
        width: 100%;
        height: 70vh;
        border: none;
    }

    /* === FOOTER === */
    footer {
        padding: 2rem 4rem;
        border-top: 1px solid #1a1a1a;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-muted);
        font-size: 0.85rem;
    }

    /* === ANIMATIONS === */
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }

    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* === RESPONSIVE === */
    @media (max-width: 1024px) {
        nav { padding: 1.5rem 2rem; }
        section { padding: 6rem 2rem; }
        .hero { padding: 0 2rem; }
        .hero-content { grid-template-columns: 1fr; text-align: center; gap: 3rem; }
        .hero-image-container { order: -1; }
        .hero-label::before { display: none; }
        .hero-meta { justify-content: center; }
        .about-content { grid-template-columns: 1fr; }
        .project-grid { grid-template-columns: 1fr; }
        .stack-grid { grid-template-columns: repeat(3, 1fr); }
        .timeline-track { display: none; }
        .timeline-cards { grid-template-columns: 1fr; gap: 2rem; }
        .timeline-content { min-height: auto; }
        .timeline-content:hover { transform: none; padding: 1rem; }
    }

    @media (max-width: 768px) {
        nav { padding: 1rem 1.5rem; }
        .nav-links { display: none; }
        section { padding: 4rem 1.5rem; }
        .hero { padding-top: 100px; padding-bottom: 3rem; min-height: auto; }
        .hero-profile-image { width: 220px; height: 220px; }
        .hero-name { font-size: 3.5rem; }
        .section-title { font-size: 2.8rem; text-align: center; }
        .section-header { flex-direction: column; text-align: center; }
        .about-stats { grid-template-columns: repeat(2, 1fr); }
        .lia-details { flex-direction: column; gap: 1rem; }
        .stack-grid { grid-template-columns: repeat(2, 1fr); }
        .contact-links { flex-direction: column; }
        .cta-button { width: 65px; height: 65px; font-size: 0.55rem; }
        footer { flex-direction: column; gap: 0.75rem; text-align: center; }
        .scroll-indicator { display: none; }
        .cv-wrapper { flex-direction: column; align-items: center; }
    }
    `;
}

// ============================================
// SECTION RENDERERS
// ============================================

function renderNav(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    const labels = data.language === 'sv'
        ? { about: 'Om mig', timeline: 'Timeline', projects: 'Projekt', stack: 'Stack', contact: 'Kontakt' }
        : { about: 'About', timeline: 'Timeline', projects: 'Projects', stack: 'Stack', contact: 'Contact' };

    return `
    <nav>
        <div class="logo">${escapeHtml(data.fullName.toUpperCase())}</div>
        <ul class="nav-links">
            <li><a href="#about">${labels.about}</a></li>
            <li><a href="#timeline">${labels.timeline}</a></li>
            <li><a href="#projects">${labels.projects}</a></li>
            <li><a href="#stack">${labels.stack}</a></li>
            <li><a href="#contact">${labels.contact}</a></li>
        </ul>
    </nav>`;
}

function renderHero(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    const scrollText = data.language === 'sv' ? 'Scrolla' : 'Scroll';
    const profileLabel = data.language === 'sv' ? 'Profil' : 'Profile';

    return `
    <section class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <div class="hero-label">${profileLabel}</div>
                <h1 class="hero-name">${escapeHtml(data.firstName.toUpperCase())}<br><span class="outline">${escapeHtml(data.lastName.toUpperCase())}</span></h1>
                ${data.cvUrl ? `
                <div class="cv-wrapper">
                    <span class="cv-arrow-indicator">
                        <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>
                    </span>
                    <a href="#" class="hero-cv-link" onclick="openCvModal(); return false;">
                        <span class="cv-icon">
                            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/><path d="M8 12h8v2H8zm0 4h8v2H8z"/></svg>
                        </span>
                        <span class="cv-text">Curriculum Vitae</span>
                    </a>
                </div>
                ` : ''}
                <p class="hero-title">${escapeHtml(data.tagline)}</p>
                <div class="hero-meta">
                    ${data.metaItems.map(item => `
                    <div class="meta-item">
                        <span class="meta-label">${escapeHtml(item.label)}</span>
                        <span class="meta-value">${escapeHtml(item.value)}</span>
                    </div>
                    `).join('')}
                </div>
            </div>
            <div class="hero-image-container">
                ${data.profileImageUrl
            ? `<img src="${escapeHtml(data.profileImageUrl)}" alt="${escapeHtml(data.fullName)}" class="hero-profile-image">`
            : `<div class="hero-profile-image" style="background: var(--bg-card); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--accent);">${data.firstName.charAt(0)}${data.lastName.charAt(0)}</div>`
        }
            </div>
        </div>
        <div class="scroll-indicator"><span>↓</span><span>${scrollText}</span></div>
    </section>`;
}

function renderAbout(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    const label = data.language === 'sv' ? 'Om mig' : 'About';
    const titleParts = data.title.split(' ');
    const mainTitle = titleParts[0]?.toUpperCase() || 'DEVOPS';
    const subTitle = titleParts.slice(1).join(' ').toUpperCase() || 'ENGINEER';

    return `
    <section class="about" id="about">
        <div class="section-header">
            <span class="section-label">${label}</span>
            <div class="section-line"></div>
        </div>
        <h2 class="section-title">${mainTitle}<br><span class="outline">${subTitle}</span></h2>
        <div class="about-content fade-in">
            <div class="about-text">
                ${data.about.paragraphs.map(p => `
                <p><span class="about-highlight">${escapeHtml(p.highlight)}</span><br>${escapeHtml(p.text)}</p>
                `).join('')}
                ${data.about.badge ? `
                <div class="student-rep-badge">
                    <span class="badge-icon">${data.about.badge.icon}</span>
                    <span class="badge-text">${escapeHtml(data.about.badge.text)}</span>
                    ${data.about.badge.link ? `
                    <a href="${escapeHtml(data.about.badge.link.url)}" target="_blank" class="diploma-link">
                        <span class="diploma-icon">🎓</span>
                        <span>${escapeHtml(data.about.badge.link.label)}</span>
                    </a>
                    ` : ''}
                </div>
                ` : ''}
            </div>
            <div class="about-stats">
                ${data.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-number">${escapeHtml(stat.number)}</div>
                    <div class="stat-label">${escapeHtml(stat.label)}</div>
                </div>
                `).join('')}
            </div>
        </div>
        ${renderLiaBanner(data, t)}
    </section>`;
}

function renderLiaBanner(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    if (!data.seeking?.active) return '';

    return `
    <div class="lia-banner fade-in" data-bg-text="${escapeHtml(data.seeking.bgText || 'LIA')}">
        <div class="lia-content">
            <h3 class="lia-title">${escapeHtml(data.seeking.title)}</h3>
            <p>${escapeHtml(data.seeking.description)}</p>
            <div class="lia-details">
                ${data.seeking.details.map(detail => `
                <div class="lia-item">
                    <span class="lia-item-label">${escapeHtml(detail.label)}</span>
                    <span class="lia-item-value">${escapeHtml(detail.value)}</span>
                </div>
                `).join('')}
            </div>
        </div>
    </div>`;
}

function renderProjects(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    if (!data.projects.length) return '';

    const label = data.language === 'sv' ? 'Projekt' : 'Projects';
    const titleWords = data.language === 'sv' ? ['VISA', 'PROJEKT'] : ['VIEW', 'PROJECTS'];

    return `
    <section class="projects" id="projects">
        <div class="section-header">
            <span class="section-label">${label}</span>
            <div class="section-line"></div>
        </div>
        <h2 class="section-title">${titleWords[0]}<br><span class="outline">${titleWords[1]}</span></h2>
        <div class="project-grid">
            ${data.projects.map(project => `
            <article class="project-card fade-in">
                <div class="project-info">
                    <span class="project-tag">${escapeHtml(project.tag)}</span>
                    ${project.badge ? `<span class="project-badge">${escapeHtml(project.badge)}</span>` : ''}
                    <h3 class="project-name">${escapeHtml(project.name)}</h3>
                    <p class="project-description">${escapeHtml(project.description)}</p>
                    <div class="project-tech">
                        ${project.techStack.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
                    </div>
                    <a href="${escapeHtml(project.link.url)}" target="_blank" class="project-link">${escapeHtml(project.link.label)} →</a>
                </div>
                ${project.previewImageUrl ? `
                <div class="project-preview">
                    <img src="${escapeHtml(project.previewImageUrl)}" alt="${escapeHtml(project.name)}">
                </div>
                ` : ''}
            </article>
            `).join('')}
        </div>
    </section>`;
}

function renderTimeline(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    if (!data.timeline.cards.length) return '';

    const label = data.language === 'sv' ? 'Min Resa' : 'My Journey';
    const titleWords = ['DEVOPS', 'JOURNEY'];
    const pointerLabel = data.language === 'sv' ? 'JUST NU' : 'RIGHT NOW';

    // Calculate position percentage (0-5 maps to ~0-100%)
    const positionPercent = (data.timeline.currentPosition / 6) * 100;

    return `
    <section class="timeline" id="timeline">
        <div class="section-header">
            <span class="section-label">${label}</span>
            <div class="section-line"></div>
        </div>
        <h2 class="section-title">${titleWords[0]}<br><span class="outline">${titleWords[1]}</span></h2>
        <p class="timeline-intro">${escapeHtml(data.timeline.intro)}</p>

        <div class="timeline-container">
            <div class="timeline-track">
                <div class="timeline-line"></div>
                <div class="timeline-markers">
                    ${data.timeline.markers.map(marker => `
                    <div class="timeline-marker">
                        <div class="timeline-dot"></div>
                        <div class="timeline-date">${escapeHtml(marker.date)}</div>
                    </div>
                    `).join('')}
                </div>
                <div class="timeline-current-pointer" style="left: ${positionPercent}%;">
                    <div class="timeline-pointer-label">${pointerLabel}</div>
                    <div class="timeline-pointer-dot"></div>
                </div>
            </div>

            <div class="timeline-cards">
                ${data.timeline.cards.map(card => `
                <div class="timeline-item fade-in">
                    <div class="timeline-content${card.isCurrent ? ' timeline-current' : ''}">
                        <span class="timeline-period">${escapeHtml(card.period)}</span>
                        <h3 class="timeline-title">${escapeHtml(card.title)}</h3>
                        <p class="timeline-subtitle">${escapeHtml(card.subtitle)}</p>
                        <p class="timeline-description">${escapeHtml(card.description)}</p>
                        <ul class="timeline-highlights">
                            ${card.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                        </ul>
                        ${card.projectNote ? `<p class="timeline-project-note"><strong>Projekt:</strong> ${escapeHtml(card.projectNote)}</p>` : ''}
                        ${card.badges ? card.badges.map(b => `<div class="timeline-badge">${escapeHtml(b)}</div>`).join('') : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>`;
}

function renderTechStack(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    if (!data.techStack.length) return '';

    const label = data.language === 'sv' ? 'Tech Stack' : 'Tech Stack';
    const titleWords = data.language === 'sv' ? ['TEKNISK', 'KOMPETENS'] : ['TECHNICAL', 'SKILLS'];

    return `
    <section class="stack" id="stack">
        <div class="section-header">
            <span class="section-label">${label}</span>
            <div class="section-line"></div>
        </div>
        <h2 class="section-title">${titleWords[0]}<br><span class="outline">${titleWords[1]}</span></h2>
        <div class="stack-grid fade-in">
            ${data.techStack.map(tech => `
            <div class="stack-item" data-tooltip="${escapeHtml(tech.tooltip)}">
                <div class="stack-icon"><img src="${escapeHtml(tech.iconUrl)}" alt="${escapeHtml(tech.name)}"></div>
                <div class="stack-name">${escapeHtml(tech.name)}</div>
                <div class="stack-tier">${escapeHtml(tech.tier)}</div>
            </div>
            `).join('')}
        </div>
    </section>`;
}

function renderContact(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    return `
    <section class="contact" id="contact">
        <h2 class="contact-title">${data.contact.title.replace(/\n/g, '<br>')}</h2>
        <p class="contact-subtitle">${data.contact.subtitle.replace(/\n/g, '<br>')}</p>
        <div class="contact-links">
            ${data.contact.links.map(link => {
        const href = link.type === 'email' ? `mailto:${link.url}`
            : link.type === 'phone' ? `tel:${link.url}`
                : link.url;
        return `<a href="${escapeHtml(href)}" ${link.type !== 'email' && link.type !== 'phone' ? 'target="_blank"' : ''} class="contact-link">${escapeHtml(link.label)}</a>`;
    }).join('')}
        </div>
    </section>`;
}

function renderCvModal(data: PortfolioDataV2, t: PortfolioTemplateConfigV2): string {
    if (!data.cvUrl) return '';

    const title = 'Curriculum Vitae';
    const downloadText = data.language === 'sv' ? 'Ladda ner PDF' : 'Download PDF';

    return `
    <div class="cv-modal-overlay" id="cvModal">
        <div class="cv-modal">
            <div class="cv-modal-header">
                <div class="cv-modal-title">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>
                    <span>${title}</span>
                </div>
                <div class="cv-modal-actions">
                    <a href="${escapeHtml(data.cvUrl)}" download class="cv-download-btn">
                        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        <span>${downloadText}</span>
                    </a>
                    <button class="cv-modal-close" onclick="closeCvModal()">&times;</button>
                </div>
            </div>
            <div class="cv-modal-body">
                <iframe src="${escapeHtml(data.cvUrl)}#zoom=80" title="${title}"></iframe>
            </div>
        </div>
    </div>`;
}

function renderCtaButton(data: PortfolioDataV2): string {
    const text = data.language === 'sv' ? 'Visa<br>Projekt' : 'View<br>Projects';

    return `
    <a href="#projects" class="cta-button">
        <span class="arrow">↓</span>
        <span class="text">${text}</span>
    </a>`;
}

function renderFooter(data: PortfolioDataV2): string {
    return `
    <footer>
        <span>${escapeHtml(data.footer.copyright)}</span>
        <span>${escapeHtml(data.footer.location)}</span>
    </footer>`;
}

// ============================================
// JAVASCRIPT GENERATION
// ============================================

function generateJS(lang: 'sv' | 'en'): string {
    const showText = lang === 'sv' ? 'Visa' : 'View';
    const projectsText = lang === 'sv' ? 'Projekt' : 'Projects';
    const topText = lang === 'sv' ? 'Toppen' : 'Top';

    return `
    // Scroll animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // CTA button scroll behavior
    const ctaButton = document.querySelector('.cta-button');
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
            ctaButton.innerHTML = '<span class="arrow">↑</span><span class="text">${topText}</span>';
            ctaButton.href = '#';
        } else {
            ctaButton.innerHTML = '<span class="arrow">↓</span><span class="text">${showText}<br>${projectsText}</span>';
            ctaButton.href = '#projects';
        }
    });

    // CV Modal
    function openCvModal() {
        document.getElementById('cvModal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCvModal() {
        document.getElementById('cvModal')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('cvModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeCvModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeCvModal();
    });
    `;
}

// ============================================
// UTILITIES
// ============================================

function escapeHtml(str: string): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
