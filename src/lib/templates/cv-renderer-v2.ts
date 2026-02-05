// ============================================
// PORTFOLYO.SE - CV Renderer V2
// Exakt kopia av Said Borna CV-struktur
// Sidebar-layout med begränsade fält
// ============================================

// ============================================
// DATA TYPES - Utökade för sidebar-layout
// ============================================

export interface CVData {
    // === IDENTITY ===
    fullName: string;           // SAID BORNA
    title: string;              // DEVOPS (stor)
    subtitle: string;           // ENGINEER (ljusare)
    tagline: string;            // DEVOPS · LEDARSKAP · AI

    // === PHOTO ===
    photoUrl?: string;          // Cirkulär profilbild

    // === SEEKING BANNER (togglebar) ===
    seeking?: {
        active: boolean;
        title: string;            // "SÖKER LIA"
        period: string;           // "November 2026 – Maj 2027"
        description: string;      // "Selektiv – Söker företag där jag ser en framtid"
    };

    // === SIDEBAR: KONTAKT (max 5) ===
    contact: {
        phone?: string;           // 072-011 77 83
        email: string;            // said.borna.lia@gmail.com
        linkedin?: string;        // linkedin.com/in/saidborna
        github?: string;          // github.com/S-Borna
        location?: string;        // Stockholm
    };

    // === SIDEBAR: PORTFOLIO (max 1) ===
    portfolioUrl?: string;      // saidborna.com

    // === SIDEBAR: TEKNISKT (max 7) ===
    technicalSkills: string[];  // Linux/Unix, Bash & Automation, Docker, etc.

    // === SIDEBAR: LEDARSKAP (max 4) ===
    leadershipSkills: string[]; // Teamutveckling, Processoptimering, etc.

    // === SIDEBAR: SPRÅK (max 4) ===
    languages: Array<{
        name: string;             // Svenska
        level: string;            // modersmål, flytande, god
    }>;

    // === SIDEBAR: REFERENSER (max 4) ===
    references: string[];       // Chas Academy - DevOps, Läkarleasing, etc.

    // === SIDEBAR: ÖVRIGT (max 2) ===
    other: string[];            // Körkort B, Ordningsvakt (utb.)

    // === MAIN: PROFIL (max 4 rader, ~280 tecken) ===
    profile: string;

    // === MAIN: UTBILDNING (max 1 entry, 3 bullets) ===
    education?: {
        title: string;            // DevOps Engineer
        institution: string;      // Chas Academy
        period: string;           // 2025–2027
        bullets: string[];        // Max 3 bullets
    };

    // === MAIN: EGNA PROJEKT (max 2 entries, 2 bullets vardera) ===
    projects: Array<{
        name: string;             // GinoNova
        url?: string;             // ginonova.com
        bullets: string[];        // Max 2 bullets
    }>;

    // === MAIN: ERFARENHET I URVAL (max 4 entries, 1-2 bullets vardera) ===
    experience: Array<{
        title: string;            // Konsultchef SSK
        company: string;          // Läkarleasing Sverige
        bullets: string[];        // Max 2 bullets
    }>;
}

// ============================================
// TEMPLATE CONFIGURATION
// ============================================

export interface CVTemplateConfig {
    id: string;
    name: string;
    description: string;
    
    // Tier & Category (for filtering in UI)
    tier: 'free' | 'starter' | 'pro';
    category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';

    // Sidebar colors
    sidebarBg: string;
    sidebarText: string;
    sidebarMuted: string;

    // Main content colors
    mainBg: string;
    mainText: string;
    mainMuted: string;

    // Accent (seeking banner, section lines)
    accent: string;

    // Fonts
    fontHeading: string;
    fontBody: string;
}

export const CV_TEMPLATES_V2: CVTemplateConfig[] = [
    // ============================================
    // GRUND-SAMLING (FREE) - 4 distinkta starter-templates
    // ============================================
    {
        id: 'classic-mono',
        name: 'Classic Mono',
        description: 'Tidlös svart sidebar med ren vit - klassikern',
        tier: 'free',
        category: 'modern',
        sidebarBg: '#0a0a0a',
        sidebarText: '#ffffff',
        sidebarMuted: '#888888',
        mainBg: '#ffffff',
        mainText: '#1a1a1a',
        mainMuted: '#555555',
        accent: '#ff4d4d',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', 'Inter', sans-serif",
    },
    {
        id: 'nordic-clean',
        name: 'Nordic Clean',
        description: 'Skandinavisk ljus design med diskret elegans',
        tier: 'free',
        category: 'minimal',
        sidebarBg: '#f5f5f5',
        sidebarText: '#1a1a1a',
        sidebarMuted: '#666666',
        mainBg: '#ffffff',
        mainText: '#1a1a1a',
        mainMuted: '#555555',
        accent: '#0066ff',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', 'Inter', sans-serif",
    },
    {
        id: 'executive-navy',
        name: 'Executive Navy',
        description: 'Professionell marinblå - perfekt för företag',
        tier: 'free',
        category: 'professional',
        sidebarBg: '#1a2744',
        sidebarText: '#ffffff',
        sidebarMuted: '#94a3b8',
        mainBg: '#ffffff',
        mainText: '#1a1a1a',
        mainMuted: '#555555',
        accent: '#f59e0b',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
    {
        id: 'forest-earth',
        name: 'Forest Earth',
        description: 'Naturlig skogsgrön med jordnära värme',
        tier: 'free',
        category: 'creative',
        sidebarBg: '#1a2e1a',
        sidebarText: '#ffffff',
        sidebarMuted: '#94b894',
        mainBg: '#faf9f7',
        mainText: '#1a1a1a',
        mainMuted: '#555555',
        accent: '#22c55e',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },

    // ============================================
    // STARTER COLLECTION - Bred variation
    // ============================================
    {
        id: 'luxe-noir',
        name: 'Luxe Noir',
        description: 'Djup svart med lyxig guld - sofistikerat',
        tier: 'starter',
        category: 'professional',
        sidebarBg: '#0c0c0c',
        sidebarText: '#f4f0e8',
        sidebarMuted: '#7a7468',
        mainBg: '#fdfcfa',
        mainText: '#1c1a17',
        mainMuted: '#5a5650',
        accent: '#b8860b',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'velvet-plum',
        name: 'Velvet Plum',
        description: 'Djup plommon med roséguld - unikt & elegant',
        tier: 'starter',
        category: 'creative',
        sidebarBg: '#2a1028',
        sidebarText: '#f5e8f0',
        sidebarMuted: '#b090a8',
        mainBg: '#fdfafc',
        mainText: '#2a1a25',
        mainMuted: '#6a5060',
        accent: '#b76e79',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'ocean-coral',
        name: 'Ocean Coral',
        description: 'Havsdjup blå med levande korall-accent',
        tier: 'starter',
        category: 'creative',
        sidebarBg: '#0a1520',
        sidebarText: '#e0f0f5',
        sidebarMuted: '#6a8a9a',
        mainBg: '#f8fcff',
        mainText: '#152530',
        mainMuted: '#456070',
        accent: '#e07050',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'slate-teal',
        name: 'Slate Teal',
        description: 'Sofistikerad skiffer med frisk teal-accent',
        tier: 'starter',
        category: 'professional',
        sidebarBg: '#1a1e22',
        sidebarText: '#e8eaec',
        sidebarMuted: '#7a8085',
        mainBg: '#fafbfc',
        mainText: '#1a2025',
        mainMuted: '#505560',
        accent: '#14b8a6',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
    {
        id: 'warm-espresso',
        name: 'Warm Espresso',
        description: 'Varm beige med rik espresso - inbjudande',
        tier: 'starter',
        category: 'minimal',
        sidebarBg: '#f5f2ef',
        sidebarText: '#2a2520',
        sidebarMuted: '#7a7570',
        mainBg: '#fdfcfa',
        mainText: '#2a2520',
        mainMuted: '#5a5550',
        accent: '#5d4037',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'mystic-violet',
        name: 'Mystic Violet',
        description: 'Mystisk djup lila med cool violett accent',
        tier: 'starter',
        category: 'creative',
        sidebarBg: '#1e1040',
        sidebarText: '#e8e0ff',
        sidebarMuted: '#b0a0d0',
        mainBg: '#faf8ff',
        mainText: '#1e1040',
        mainMuted: '#5a4a7a',
        accent: '#8b5cf6',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },

    // ============================================
    // PRO COLLECTION - Unika & Djärva
    // ============================================
    {
        id: 'burgundy-gold',
        name: 'Burgundy Gold',
        description: 'Rik vinröd med glänsande guld - lyxigt',
        tier: 'pro',
        category: 'professional',
        sidebarBg: '#2a0a15',
        sidebarText: '#f5e5e8',
        sidebarMuted: '#a08088',
        mainBg: '#fffafa',
        mainText: '#2a1a1c',
        mainMuted: '#5a4a4c',
        accent: '#c9a227',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'sapphire-bronze',
        name: 'Sapphire Bronze',
        description: 'Djup safirblå med varm brons-accent',
        tier: 'pro',
        category: 'professional',
        sidebarBg: '#0a1530',
        sidebarText: '#e0e8f5',
        sidebarMuted: '#7080a0',
        mainBg: '#fafcff',
        mainText: '#1a2540',
        mainMuted: '#4a5570',
        accent: '#cd7f32',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'emerald-gold',
        name: 'Emerald Gold',
        description: 'Rik smaragdgrön med metalliskt guld',
        tier: 'pro',
        category: 'creative',
        sidebarBg: '#065f46',
        sidebarText: '#e0f0ea',
        sidebarMuted: '#6ee7b7',
        mainBg: '#fafffc',
        mainText: '#1a2a25',
        mainMuted: '#4a5a55',
        accent: '#fcd34d',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'arctic-flame',
        name: 'Arctic Flame',
        description: 'Isblå sidebar med intensiv eldröd accent',
        tier: 'pro',
        category: 'modern',
        sidebarBg: '#e8f4f8',
        sidebarText: '#0a2030',
        sidebarMuted: '#5a7080',
        mainBg: '#ffffff',
        mainText: '#1a1a1a',
        mainMuted: '#555555',
        accent: '#dc2626',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'desert-oasis',
        name: 'Desert Oasis',
        description: 'Varm sand med djup turkos - ökenkänsla',
        tier: 'pro',
        category: 'modern',
        sidebarBg: '#f5e6d3',
        sidebarText: '#3a2a1a',
        sidebarMuted: '#8a7a6a',
        mainBg: '#fffefa',
        mainText: '#2a2520',
        mainMuted: '#5a5550',
        accent: '#0d9488',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'royal-amethyst',
        name: 'Royal Amethyst',
        description: 'Kunglig lila med antikt guld - majestätiskt',
        tier: 'pro',
        category: 'creative',
        sidebarBg: '#2a1a35',
        sidebarText: '#f0e8f5',
        sidebarMuted: '#a090b0',
        mainBg: '#fdfcff',
        mainText: '#1a1525',
        mainMuted: '#555060',
        accent: '#cfb53b',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'electric-magenta',
        name: 'Electric Magenta',
        description: 'Vibrerande magenta med elektrisk cyan - djärv!',
        tier: 'pro',
        category: 'creative',
        sidebarBg: '#a21caf',
        sidebarText: '#ffffff',
        sidebarMuted: '#f5d0fe',
        mainBg: '#fdf4ff',
        mainText: '#4a044e',
        mainMuted: '#86198f',
        accent: '#22d3ee',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'turquoise-coral',
        name: 'Turquoise Coral',
        description: 'Levande turkos med varm korall-kontrast',
        tier: 'pro',
        category: 'modern',
        sidebarBg: '#0d9488',
        sidebarText: '#ffffff',
        sidebarMuted: '#99f6e4',
        mainBg: '#ffffff',
        mainText: '#134e4a',
        mainMuted: '#5eead4',
        accent: '#fb7185',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'nordic-aurora',
        name: 'Nordic Aurora',
        description: 'Mörk natt med norrskensgrönt - magiskt',
        tier: 'pro',
        category: 'modern',
        sidebarBg: '#0f172a',
        sidebarText: '#f0fdf4',
        sidebarMuted: '#86efac',
        mainBg: '#ffffff',
        mainText: '#0f172a',
        mainMuted: '#475569',
        accent: '#22c55e',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'sunset-rose',
        name: 'Sunset Rose',
        description: 'Drömmig rosa med djup lila accent',
        tier: 'pro',
        category: 'creative',
        sidebarBg: '#7c2d6a',
        sidebarText: '#ffffff',
        sidebarMuted: '#f0c0e0',
        mainBg: '#fff5f7',
        mainText: '#4a1535',
        mainMuted: '#8a4a6a',
        accent: '#fca311',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Space Grotesk', sans-serif",
    },
    {
        id: 'sweden-pride',
        name: 'Sweden Pride',
        description: 'Svenska färger - klassisk blå & gul',
        tier: 'pro',
        category: 'modern',
        sidebarBg: '#005293',
        sidebarText: '#ffffff',
        sidebarMuted: '#a0c4e8',
        mainBg: '#ffffff',
        mainText: '#1a2530',
        mainMuted: '#4a5a6a',
        accent: '#fecc00',
        fontHeading: "'Bebas Neue', 'Arial Black', sans-serif",
        fontBody: "'Inter', sans-serif",
    },
];

export function getCVTemplateV2(id: string): CVTemplateConfig {
    return CV_TEMPLATES_V2.find(t => t.id === id) || CV_TEMPLATES_V2[0];
}

// ============================================
// FIELD LIMITS - Exakt som ditt CV
// ============================================

export const CV_FIELD_LIMITS = {
    // Sidebar
    contact: 5,
    portfolio: 1,
    technicalSkills: 7,
    leadershipSkills: 4,
    languages: 4,
    references: 4,
    other: 2,

    // Main content
    profileMaxChars: 280,
    educationBullets: 3,
    projects: 2,
    projectBullets: 2,
    experience: 4,
    experienceBullets: 2,
} as const;

// ============================================
// MAIN RENDERER
// ============================================

export function renderCVV2(
    data: CVData,
    templateId: string = 'said-dark',
    options: {
        showPhoto?: boolean;
        pageSize?: 'a4' | 'letter';
    } = {}
): string {
    const template = getCVTemplateV2(templateId);
    const { showPhoto = true, pageSize = 'a4' } = options;

    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${escapeHtml(data.fullName)}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
${generateCSS(template, pageSize)}
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      ${renderSidebarHeader(data, showPhoto)}
      ${renderSidebarSections(data)}
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      ${renderSeekingBanner(data.seeking, template)}
      ${renderMainHeader(data, template)}
      ${renderProfile(data.profile)}
      ${renderEducation(data.education)}
      ${renderProjects(data.projects)}
      ${renderExperience(data.experience)}
    </main>
  </div>
</body>
</html>`;
}

// ============================================
// CSS GENERATION
// ============================================

function generateCSS(t: CVTemplateConfig, pageSize: 'a4' | 'letter'): string {
    const pageDimensions = pageSize === 'a4'
        ? { width: '210mm', height: '297mm' }
        : { width: '8.5in', height: '11in' };

    return `
    /* === PAGE SETUP === */
    @page {
      size: ${pageDimensions.width} ${pageDimensions.height};
      margin: 0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: ${pageDimensions.width};
      height: ${pageDimensions.height};
      font-family: ${t.fontBody};
      font-size: 10pt;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    /* === LAYOUT: Two columns === */
    .cv-container {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* === SIDEBAR (33% width - tighter to match original) === */
    .sidebar {
      width: 33%;
      min-width: 33%;
      max-width: 33%;
      background: ${t.sidebarBg};
      color: ${t.sidebarText};
      padding: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* === SEEKING BANNER (on main content side) === */
    .seeking-banner {
      background: ${t.accent};
      color: #ffffff;
      padding: 8pt 14pt 7pt;
      margin: -20pt -22pt 14pt -24pt;
      text-align: left;
      flex-shrink: 0;
    }

    .seeking-title {
      font-family: ${t.fontHeading};
      font-size: 12pt;
      letter-spacing: 2pt;
      font-weight: 400;
      margin-bottom: 2pt;
      display: inline;
    }

    .seeking-period {
      font-size: 7.5pt;
      font-weight: 500;
      margin-left: 8pt;
      letter-spacing: 0.3pt;
      display: inline;
    }

    .seeking-description {
      font-size: 6.5pt;
      opacity: 0.9;
      font-style: italic;
      display: block;
      margin-top: 2pt;
    }

    /* === SIDEBAR HEADER (photo + name) === */
    .sidebar-header {
      padding: 16pt 14pt 12pt;
      text-align: center;
      flex-shrink: 0;
    }

    .profile-photo {
      width: 80pt;
      height: 80pt;
      border-radius: 50%;
      object-fit: cover;
      object-position: center 20%;
      border: 2pt solid rgba(255, 255, 255, 0.12);
      margin-bottom: 10pt;
      box-shadow: 0 4pt 12pt rgba(0, 0, 0, 0.3);
    }

    .sidebar-name {
      font-family: ${t.fontHeading};
      font-size: 26pt;
      letter-spacing: 1pt;
      line-height: 1;
      margin-bottom: 0;
    }

    .sidebar-name-first,
    .sidebar-name-last {
      display: block;
    }

    .sidebar-tagline {
      font-size: 6.5pt;
      color: ${t.sidebarMuted};
      letter-spacing: 1.5pt;
      text-transform: uppercase;
      margin-top: 6pt;
    }

    /* === SIDEBAR SECTIONS === */
    .sidebar-sections {
      flex: 1;
      padding: 0 14pt 12pt;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .sidebar-section {
      margin-bottom: 11pt;
      flex-shrink: 0;
    }

    .sidebar-section:last-child {
      margin-bottom: 0;
    }

    .sidebar-section-title {
      font-size: 7pt;
      font-weight: 600;
      color: ${t.sidebarText};
      letter-spacing: 1.2pt;
      text-transform: uppercase;
      margin-bottom: 5pt;
      opacity: 0.6;
    }

    .sidebar-section-title::before {
      content: "— ";
    }

    .sidebar-list {
      list-style: none;
    }

    .sidebar-list li {
      font-size: 8pt;
      color: ${t.sidebarText};
      margin-bottom: 2.5pt;
      padding-left: 9pt;
      position: relative;
      line-height: 1.3;
    }

    .sidebar-list li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: ${t.accent};
      font-size: 6.5pt;
      top: 0.5pt;
    }

    .sidebar-list .sublabel {
      color: ${t.sidebarMuted};
      font-size: 7pt;
    }

    .sidebar-link {
      color: inherit;
      text-decoration: none;
    }

    .sidebar-link:hover {
      text-decoration: underline;
    }

    /* === MAIN CONTENT (67% width) === */
    .main-content {
      width: 67%;
      background: ${t.mainBg};
      color: ${t.mainText};
      padding: 20pt 22pt 18pt 24pt;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* === MAIN HEADER (Title hierarchy) === */
    .main-header {
      margin-bottom: 14pt;
      flex-shrink: 0;
    }

    .main-title {
      font-family: ${t.fontHeading};
      font-size: 48pt;
      letter-spacing: 3pt;
      line-height: 0.85;
      color: ${t.mainText};
    }

    .main-subtitle {
      font-family: ${t.fontHeading};
      font-size: 42pt;
      letter-spacing: 3pt;
      line-height: 0.85;
      color: ${t.mainMuted};
      font-weight: 400;
      opacity: 0.5;
    }

    /* === MAIN SECTIONS === */
    .main-section {
      margin-bottom: 12pt;
      flex-shrink: 0;
    }

    .main-section:last-child {
      margin-bottom: 0;
    }

    .main-section-title {
      font-size: 8pt;
      font-weight: 600;
      color: ${t.mainText};
      letter-spacing: 1.2pt;
      text-transform: uppercase;
      margin-bottom: 6pt;
      padding-bottom: 3pt;
      border-bottom: 0.75pt solid rgba(0, 0, 0, 0.15);
    }

    .main-section-title::before {
      content: "— ";
      color: ${t.mainMuted};
    }

    /* === PROFILE === */
    .profile-text {
      font-size: 9pt;
      color: ${t.mainText};
      line-height: 1.55;
    }

    /* === EDUCATION === */
    .education-entry {
      margin-bottom: 6pt;
    }

    .education-header {
      font-size: 9.5pt;
      font-weight: 600;
      color: ${t.mainText};
      margin-bottom: 2pt;
    }

    .education-header .institution {
      font-weight: 400;
      color: ${t.mainMuted};
    }

    .education-header .period {
      color: ${t.mainMuted};
      font-weight: 400;
      font-size: 8.5pt;
    }

    /* === PROJECTS === */
    .project-entry {
      margin-bottom: 8pt;
    }

    .project-entry:last-child {
      margin-bottom: 0;
    }

    .project-header {
      font-size: 9.5pt;
      font-weight: 600;
      color: ${t.mainText};
      margin-bottom: 2pt;
    }

    .project-header .url {
      font-weight: 400;
      color: ${t.accent};
      font-size: 8.5pt;
    }

    /* === EXPERIENCE === */
    .experience-entry {
      margin-bottom: 6pt;
    }

    .experience-entry:last-child {
      margin-bottom: 0;
    }

    .experience-header {
      font-size: 9.5pt;
      font-weight: 600;
      color: ${t.mainText};
      margin-bottom: 1pt;
    }

    .experience-header .company {
      font-weight: 400;
      color: ${t.mainMuted};
    }

    /* === BULLET LISTS (arrows) === */
    .bullet-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .bullet-list li {
      font-size: 8.5pt;
      color: ${t.mainText};
      padding-left: 12pt;
      margin-bottom: 1.5pt;
      position: relative;
      line-height: 1.4;
    }

    .bullet-list li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: ${t.accent};
      font-weight: 600;
      font-size: 9pt;
    }

    /* === PRINT === */
    @media print {
      html, body {
        width: ${pageDimensions.width};
        height: ${pageDimensions.height};
      }

      .cv-container {
        width: ${pageDimensions.width};
        height: ${pageDimensions.height};
      }
    }
  `;
}

// ============================================
// SECTION RENDERERS
// ============================================

function renderSeekingBanner(
    seeking: CVData['seeking'],
    template: CVTemplateConfig
): string {
    if (!seeking?.active) return '';

    return `
      <div class="seeking-banner">
        <div class="seeking-title">${escapeHtml(seeking.title)}</div>
        <div class="seeking-period">${escapeHtml(seeking.period)}</div>
        <div class="seeking-description">${escapeHtml(seeking.description)}</div>
      </div>
  `;
}

function renderSidebarHeader(data: CVData, showPhoto: boolean): string {
    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return `
      <div class="sidebar-header">
        ${showPhoto && data.photoUrl ? `
          <img src="${escapeHtml(data.photoUrl)}" alt="${escapeHtml(data.fullName)}" class="profile-photo">
        ` : ''}
        <div class="sidebar-name">
          <span class="sidebar-name-first">${escapeHtml(firstName.toUpperCase())}</span>
          <span class="sidebar-name-last">${escapeHtml(lastName.toUpperCase())}</span>
        </div>
        <div class="sidebar-tagline">${escapeHtml(data.tagline)}</div>
      </div>
  `;
}

function renderSidebarSections(data: CVData): string {
    const sections: string[] = [];

    // KONTAKT
    const contactItems: string[] = [];
    if (data.contact.phone) {
        contactItems.push(data.contact.phone);
    }
    if (data.contact.email) {
        contactItems.push(`<a href="mailto:${escapeHtml(data.contact.email)}" class="sidebar-link">${escapeHtml(data.contact.email)}</a>`);
    }
    if (data.contact.linkedin) {
        const linkedinDisplay = data.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '');
        contactItems.push(`<a href="${escapeHtml(data.contact.linkedin)}" class="sidebar-link">${escapeHtml(linkedinDisplay)}</a>`);
    }
    if (data.contact.github) {
        const githubDisplay = data.contact.github.replace(/^https?:\/\/(www\.)?/, '');
        contactItems.push(`<a href="${escapeHtml(data.contact.github)}" class="sidebar-link">${escapeHtml(githubDisplay)}</a>`);
    }
    if (data.contact.location) {
        contactItems.push(data.contact.location);
    }

    if (contactItems.length > 0) {
        sections.push(renderSidebarSection('Kontakt', contactItems.slice(0, CV_FIELD_LIMITS.contact)));
    }

    // PORTFOLIO
    if (data.portfolioUrl) {
        const portfolioDisplay = data.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '');
        sections.push(renderSidebarSection('Portfolio', [
            `<a href="${escapeHtml(data.portfolioUrl)}" class="sidebar-link">${escapeHtml(portfolioDisplay)}</a>`
        ]));
    }

    // TEKNISKT
    if (data.technicalSkills.length > 0) {
        sections.push(renderSidebarSection('Tekniskt', data.technicalSkills.slice(0, CV_FIELD_LIMITS.technicalSkills)));
    }

    // LEDARSKAP
    if (data.leadershipSkills.length > 0) {
        sections.push(renderSidebarSection('Ledarskap', data.leadershipSkills.slice(0, CV_FIELD_LIMITS.leadershipSkills)));
    }

    // SPRÅK
    if (data.languages.length > 0) {
        const langItems = data.languages.slice(0, CV_FIELD_LIMITS.languages).map(
            lang => `${escapeHtml(lang.name)} <span class="sublabel">– ${escapeHtml(lang.level)}</span>`
        );
        sections.push(renderSidebarSection('Språk', langItems));
    }

    // REFERENSER
    if (data.references.length > 0) {
        sections.push(renderSidebarSection('Referenser', data.references.slice(0, CV_FIELD_LIMITS.references)));
    }

    // ÖVRIGT
    if (data.other.length > 0) {
        sections.push(renderSidebarSection('Övrigt', data.other.slice(0, CV_FIELD_LIMITS.other)));
    }

    return `
      <div class="sidebar-sections">
        ${sections.join('')}
      </div>
  `;
}

function renderSidebarSection(title: string, items: string[]): string {
    return `
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">${escapeHtml(title)}</h3>
          <ul class="sidebar-list">
            ${items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
  `;
}

function renderMainHeader(data: CVData, template: CVTemplateConfig): string {
    return `
      <header class="main-header">
        <h1 class="main-title">${escapeHtml(data.title.toUpperCase())}</h1>
        <h2 class="main-subtitle">${escapeHtml(data.subtitle.toUpperCase())}</h2>
      </header>
  `;
}

function renderProfile(profile: string): string {
    if (!profile) return '';

    // Truncate to max chars
    const truncated = profile.slice(0, CV_FIELD_LIMITS.profileMaxChars);

    return `
      <section class="main-section">
        <h3 class="main-section-title">Profil</h3>
        <p class="profile-text">${escapeHtml(truncated)}</p>
      </section>
  `;
}

function renderEducation(education: CVData['education']): string {
    if (!education) return '';

    const bullets = education.bullets.slice(0, CV_FIELD_LIMITS.educationBullets);

    return `
      <section class="main-section">
        <h3 class="main-section-title">Utbildning</h3>
        <div class="education-entry">
          <div class="education-header">
            ${escapeHtml(education.title)} · <span class="institution">${escapeHtml(education.institution)}</span> <span class="period">${escapeHtml(education.period)}</span>
          </div>
          ${bullets.length > 0 ? `
            <ul class="bullet-list">
              ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </section>
  `;
}

function renderProjects(projects: CVData['projects']): string {
    if (!projects || projects.length === 0) return '';

    const limitedProjects = projects.slice(0, CV_FIELD_LIMITS.projects);

    return `
      <section class="main-section">
        <h3 class="main-section-title">Egna Projekt</h3>
        ${limitedProjects.map(project => {
        const bullets = project.bullets.slice(0, CV_FIELD_LIMITS.projectBullets);
        return `
            <div class="project-entry">
              <div class="project-header">
                ${escapeHtml(project.name)}${project.url ? ` · <span class="url">${escapeHtml(project.url)}</span>` : ''}
              </div>
              ${bullets.length > 0 ? `
                <ul class="bullet-list">
                  ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `;
    }).join('')}
      </section>
  `;
}

function renderExperience(experience: CVData['experience']): string {
    if (!experience || experience.length === 0) return '';

    const limitedExperience = experience.slice(0, CV_FIELD_LIMITS.experience);

    return `
      <section class="main-section">
        <h3 class="main-section-title">Erfarenhet i Urval</h3>
        ${limitedExperience.map(exp => {
        const bullets = exp.bullets.slice(0, CV_FIELD_LIMITS.experienceBullets);
        return `
            <div class="experience-entry">
              <div class="experience-header">
                ${escapeHtml(exp.title)} · <span class="company">${escapeHtml(exp.company)}</span>
              </div>
              ${bullets.length > 0 ? `
                <ul class="bullet-list">
                  ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `;
    }).join('')}
      </section>
  `;
}

// ============================================
// UTILITIES
// ============================================

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// CONVERSION: From existing CV data to CVData
// ============================================

export function convertToCVData(
    renderData: {
        full_name: string;
        title: string;
        email: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        summary: string;
        experience: Array<{
            company: string;
            title: string;
            achievements: string[];
        }>;
        education: Array<{
            institution: string;
            degree: string;
            field: string;
            start_date: string;
            end_date?: string;
            achievements?: string[];
        }>;
        skills: Array<{
            name: string;
            skills: string[];
        }>;
        languages: Array<{
            language: string;
            level: string;
        }>;
        projects: Array<{
            name: string;
            description: string;
            url?: string;
        }>;
    },
    options?: {
        seeking?: CVData['seeking'];
        photoUrl?: string;
        portfolioUrl?: string;
        leadershipSkills?: string[];
        references?: string[];
        other?: string[];
    }
): CVData {
    // Split title into title/subtitle (e.g., "DevOps Engineer" -> "DevOps" / "Engineer")
    const titleParts = renderData.title.split(' ');
    const mainTitle = titleParts[0] || renderData.title;
    const subtitle = titleParts.slice(1).join(' ') || '';

    // Extract technical skills from first skills category or all
    const technicalSkills = renderData.skills.find(s =>
        s.name.toLowerCase().includes('teknisk') ||
        s.name.toLowerCase().includes('technical')
    )?.skills || renderData.skills.flatMap(s => s.skills).slice(0, 7);

    // Convert languages
    const languages = renderData.languages.map(l => ({
        name: l.language,
        level: l.level === 'native' ? 'modersmål' :
            l.level === 'fluent' ? 'flytande' :
                l.level === 'advanced' ? 'avancerad' :
                    l.level === 'intermediate' ? 'god' : 'grundläggande',
    }));

    // Convert education (take first one)
    const firstEdu = renderData.education[0];
    const education = firstEdu ? {
        title: firstEdu.degree,
        institution: firstEdu.institution,
        period: `${firstEdu.start_date}–${firstEdu.end_date || 'Nu'}`,
        bullets: firstEdu.achievements || [],
    } : undefined;

    // Convert projects
    const projects = renderData.projects.slice(0, 2).map(p => ({
        name: p.name,
        url: p.url,
        bullets: [p.description].filter(Boolean),
    }));

    // Convert experience
    const experience = renderData.experience.slice(0, 4).map(exp => ({
        title: exp.title,
        company: exp.company,
        bullets: exp.achievements.slice(0, 2),
    }));

    // Build tagline from skills categories
    const tagline = renderData.skills.slice(0, 3).map(s => s.name.toUpperCase()).join(' · ');

    return {
        fullName: renderData.full_name,
        title: mainTitle,
        subtitle: subtitle,
        tagline: tagline || 'DEVOPS · TECH · UTVECKLING',
        photoUrl: options?.photoUrl,
        seeking: options?.seeking,
        contact: {
            phone: renderData.phone,
            email: renderData.email,
            linkedin: renderData.linkedin,
            github: renderData.github,
            location: renderData.location,
        },
        portfolioUrl: options?.portfolioUrl || renderData.website,
        technicalSkills: technicalSkills,
        leadershipSkills: options?.leadershipSkills || [],
        languages: languages,
        references: options?.references || [],
        other: options?.other || [],
        profile: renderData.summary,
        education: education,
        projects: projects,
        experience: experience,
    };
}

// ============================================
// EXPORT: Templates list
// ============================================

export { CV_TEMPLATES_V2 as CV_TEMPLATES };
