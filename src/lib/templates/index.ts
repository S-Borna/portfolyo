// ============ PORTFOLYO.SE TEMPLATE SYSTEM ============
// Inspirerat av saidborna.com - professionella, moderna templates

export interface PortfolioTemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'creative' | 'professional' | 'bold' | 'elegant';
  preview: string; // Preview image URL or gradient
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
  layout: 'single-page' | 'multi-section' | 'sidebar' | 'split' | 'cards';
  features: string[];
  tier: 'free' | 'starter' | 'pro';
  popular?: boolean;
  new?: boolean;
}

export interface CVTemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'creative' | 'minimal' | 'executive';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'single-column' | 'two-column' | 'sidebar' | 'timeline' | 'infographic';
  features: string[];
  tier: 'free' | 'starter' | 'pro';
  atsOptimized: boolean;
  popular?: boolean;
  new?: boolean;
}

// ============ PORTFOLIO TEMPLATES ============
// 3 Free, 12 Starter (15 total), 85 Pro (100 total)

export const PORTFOLIO_TEMPLATES: PortfolioTemplateConfig[] = [
  // ========== FREE TEMPLATES (3) ==========
  {
    id: 'developer-dark',
    name: 'Developer Dark',
    description: 'Mörkt tema perfekt för utvecklare. Inspirerat av VS Code.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#22D3EE',
      background: '#0F0F1A',
      text: '#F8FAFC',
      muted: '#94A3B8',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    layout: 'single-page',
    features: ['Syntax highlighting', 'Terminal-style bio', 'GitHub integration'],
    tier: 'free',
    popular: true,
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Rent och minimalistiskt. Låt ditt arbete tala.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
    colors: {
      primary: '#18181B',
      secondary: '#3F3F46',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#18181B',
      muted: '#71717A',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    layout: 'single-page',
    features: ['Stort fokus på projekt', 'Animerade övergångar', 'Perfekt whitespace'],
    tier: 'free',
  },
  {
    id: 'gradient-modern',
    name: 'Gradient Modern',
    description: 'Moderna gradienter och glassmorfism.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#0F172A',
      text: '#F8FAFC',
      muted: '#94A3B8',
    },
    fonts: { heading: 'Poppins', body: 'Inter' },
    layout: 'multi-section',
    features: ['Glassmorphism cards', 'Animated gradients', 'Smooth scroll'],
    tier: 'free',
  },

  // ========== STARTER TEMPLATES (12 more = 15 total) ==========
  {
    id: 'nordic-light',
    name: 'Nordic Light',
    description: 'Skandinavisk minimalism med mjuka färger.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #E2E8F0 0%, #F1F5F9 100%)',
    colors: {
      primary: '#0F172A',
      secondary: '#334155',
      accent: '#0EA5E9',
      background: '#F8FAFC',
      text: '#0F172A',
      muted: '#64748B',
    },
    fonts: { heading: 'DM Sans', body: 'Inter' },
    layout: 'single-page',
    features: ['Nordisk estetik', 'Luftig layout', 'Subtila animationer'],
    tier: 'starter',
  },
  {
    id: 'startup-bold',
    name: 'Startup Bold',
    description: 'Modigt och energiskt. Perfekt för entreprenörer.',
    category: 'bold',
    preview: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFFFFF',
      text: '#2D3436',
      muted: '#636E72',
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    layout: 'multi-section',
    features: ['Bold typography', 'Färgrika accenter', 'Call-to-action fokus'],
    tier: 'starter',
    popular: true,
  },
  {
    id: 'portfolio-pro',
    name: 'Portfolio Pro',
    description: 'Professionell portfolio för seniora utvecklare.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#0F172A',
      text: '#F1F5F9',
      muted: '#94A3B8',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' },
    layout: 'sidebar',
    features: ['Sticky sidebar', 'Skill meters', 'Testimonials sektion'],
    tier: 'starter',
  },
  {
    id: 'designer-showcase',
    name: 'Designer Showcase',
    description: 'Visuellt fokuserad för designers och kreatörer.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFBFE',
      text: '#1F2937',
      muted: '#6B7280',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    layout: 'cards',
    features: ['Masonry grid', 'Lightbox gallery', 'Hover effects'],
    tier: 'starter',
  },
  {
    id: 'tech-terminal',
    name: 'Tech Terminal',
    description: 'Retro terminal-estetik för hackare.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #000000 0%, #0D1117 100%)',
    colors: {
      primary: '#00FF41',
      secondary: '#00D9FF',
      accent: '#FF0080',
      background: '#0D1117',
      text: '#00FF41',
      muted: '#7EE787',
    },
    fonts: { heading: 'JetBrains Mono', body: 'Fira Code' },
    layout: 'single-page',
    features: ['Terminal animations', 'ASCII art', 'Matrix effect'],
    tier: 'starter',
    new: true,
  },
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    description: 'Professionellt och seriöst. Perfekt för konsulter.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #1E3A5F 0%, #2E5077 100%)',
    colors: {
      primary: '#1E3A5F',
      secondary: '#3B82F6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1E293B',
      muted: '#64748B',
    },
    fonts: { heading: 'Source Sans Pro', body: 'Open Sans' },
    layout: 'multi-section',
    features: ['Professional layout', 'Contact form', 'PDF export'],
    tier: 'starter',
  },
  {
    id: 'brutalist-raw',
    name: 'Brutalist Raw',
    description: 'Rå och ofiltrerad. Gör intryck.',
    category: 'bold',
    preview: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)',
    colors: {
      primary: '#000000',
      secondary: '#FF0000',
      accent: '#0000FF',
      background: '#FFFFFF',
      text: '#000000',
      muted: '#666666',
    },
    fonts: { heading: 'Archivo Black', body: 'Space Mono' },
    layout: 'single-page',
    features: ['Bold borders', 'Stark kontrast', 'Assymetrisk layout'],
    tier: 'starter',
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Tidlös elegans med klassiska typsnitt.',
    category: 'elegant',
    preview: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
    colors: {
      primary: '#78350F',
      secondary: '#92400E',
      accent: '#D97706',
      background: '#FFFBEB',
      text: '#1C1917',
      muted: '#57534E',
    },
    fonts: { heading: 'Cormorant Garamond', body: 'Libre Baskerville' },
    layout: 'single-page',
    features: ['Elegant typography', 'Subtle animations', 'Print-ready'],
    tier: 'starter',
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Cyberpunk-inspirerad med neonljus.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #0F0F23 0%, #1A1A3E 100%)',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#0F0F23',
      text: '#FFFFFF',
      muted: '#A0A0C0',
    },
    fonts: { heading: 'Orbitron', body: 'Rajdhani' },
    layout: 'multi-section',
    features: ['Neon glow effects', 'Parallax scrolling', 'Audio visualizer'],
    tier: 'starter',
  },
  {
    id: 'material-you',
    name: 'Material You',
    description: 'Googles Material Design 3 estetik.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #FAFAFA 0%, #E8DEF8 100%)',
    colors: {
      primary: '#6750A4',
      secondary: '#625B71',
      accent: '#7D5260',
      background: '#FFFBFE',
      text: '#1C1B1F',
      muted: '#49454F',
    },
    fonts: { heading: 'Google Sans', body: 'Roboto' },
    layout: 'cards',
    features: ['Material components', 'Dynamic color', 'Motion design'],
    tier: 'starter',
  },
  {
    id: 'apple-inspired',
    name: 'Apple Inspired',
    description: 'Ren Apple-estetik med fokus på detaljer.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #FBFBFD 0%, #F5F5F7 100%)',
    colors: {
      primary: '#1D1D1F',
      secondary: '#86868B',
      accent: '#0071E3',
      background: '#FFFFFF',
      text: '#1D1D1F',
      muted: '#86868B',
    },
    fonts: { heading: 'SF Pro Display', body: 'SF Pro Text' },
    layout: 'single-page',
    features: ['Scroll animations', 'Product showcase', 'Video backgrounds'],
    tier: 'starter',
    popular: true,
  },
  {
    id: 'vercel-style',
    name: 'Vercel Style',
    description: 'Inspirerat av Vercels minimalistiska design.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
    colors: {
      primary: '#FFFFFF',
      secondary: '#888888',
      accent: '#0070F3',
      background: '#000000',
      text: '#FFFFFF',
      muted: '#666666',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    layout: 'single-page',
    features: ['Micro-interactions', 'Code snippets', 'Deploy status'],
    tier: 'starter',
  },

  // ========== PRO TEMPLATES (85 more = 100 total) ==========
  {
    id: 'said-borna-inspired',
    name: 'Said Borna Style',
    description: 'Inspirerat av saidborna.com - professionell utvecklarportfolio.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#22D3EE',
      background: '#0A0A0A',
      text: '#FAFAFA',
      muted: '#A1A1AA',
    },
    fonts: { heading: 'Cal Sans', body: 'Inter' },
    layout: 'single-page',
    features: ['Bento grid', 'Project cards', 'Experience timeline', 'Tech stack icons', 'LIA-sektion'],
    tier: 'pro',
    popular: true,
  },
  {
    id: 'fullstack-master',
    name: 'Fullstack Master',
    description: 'Komplett portfolio för fullstack-utvecklare.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #1E1E2E 0%, #313244 100%)',
    colors: {
      primary: '#CBA6F7',
      secondary: '#F5C2E7',
      accent: '#94E2D5',
      background: '#1E1E2E',
      text: '#CDD6F4',
      muted: '#6C7086',
    },
    fonts: { heading: 'JetBrains Mono', body: 'Inter' },
    layout: 'sidebar',
    features: ['API showcase', 'Code examples', 'Database diagrams'],
    tier: 'pro',
  },
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'För byråer och kreativa team.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #FF6B6B 0%, #FEC89A 100%)',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FEC89A',
      background: '#FFFFFF',
      text: '#2D3436',
      muted: '#636E72',
    },
    fonts: { heading: 'Clash Display', body: 'Satoshi' },
    layout: 'multi-section',
    features: ['Team section', 'Client logos', 'Case studies'],
    tier: 'pro',
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Portfolio för data science och ML.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    colors: {
      primary: '#00D9FF',
      secondary: '#00FF87',
      accent: '#FF00FF',
      background: '#0D1117',
      text: '#E6EDF3',
      muted: '#7D8590',
    },
    fonts: { heading: 'IBM Plex Sans', body: 'IBM Plex Mono' },
    layout: 'cards',
    features: ['Jupyter notebooks', 'Data visualizations', 'Model metrics'],
    tier: 'pro',
    new: true,
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    description: 'Fokuserat på iOS/Android-utveckling.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: {
      primary: '#5B4FD9',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: '#F8FAFC',
      text: '#1E293B',
      muted: '#64748B',
    },
    fonts: { heading: 'SF Pro Display', body: 'Inter' },
    layout: 'split',
    features: ['App mockups', 'App Store links', 'Device frames'],
    tier: 'pro',
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Infrastructure och DevOps fokus.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    colors: {
      primary: '#00BFFF',
      secondary: '#FF6B35',
      accent: '#00FF87',
      background: '#1A1A1A',
      text: '#E0E0E0',
      muted: '#888888',
    },
    fonts: { heading: 'Ubuntu', body: 'Ubuntu Mono' },
    layout: 'single-page',
    features: ['Architecture diagrams', 'CI/CD pipelines', 'Cloud certifications'],
    tier: 'pro',
  },
  {
    id: 'ux-researcher',
    name: 'UX Researcher',
    description: 'För UX-research och användarstudier.',
    category: 'elegant',
    preview: 'linear-gradient(135deg, #FDFBFB 0%, #EBEDEE 100%)',
    colors: {
      primary: '#4F46E5',
      secondary: '#7C3AED',
      accent: '#EC4899',
      background: '#FAFAFA',
      text: '#1F2937',
      muted: '#6B7280',
    },
    fonts: { heading: 'Manrope', body: 'Inter' },
    layout: 'multi-section',
    features: ['Research findings', 'User personas', 'Journey maps'],
    tier: 'pro',
  },
  {
    id: 'game-developer',
    name: 'Game Developer',
    description: 'Portfolio för spelutvecklare.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A2E 100%)',
    colors: {
      primary: '#FF0080',
      secondary: '#7928CA',
      accent: '#00FFFF',
      background: '#0A0A0A',
      text: '#FFFFFF',
      muted: '#888888',
    },
    fonts: { heading: 'Press Start 2P', body: 'Roboto' },
    layout: 'cards',
    features: ['Game trailers', 'Steam integration', 'Awards showcase'],
    tier: 'pro',
  },
  {
    id: '3d-artist',
    name: '3D Artist',
    description: 'Showcase för 3D-artister och animatörer.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)',
    colors: {
      primary: '#FF6B00',
      secondary: '#00A8FF',
      accent: '#FF00FF',
      background: '#0D0D0D',
      text: '#FFFFFF',
      muted: '#808080',
    },
    fonts: { heading: 'Bebas Neue', body: 'Roboto' },
    layout: 'cards',
    features: ['3D model viewer', 'Turntables', 'Showreel'],
    tier: 'pro',
  },
  {
    id: 'blockchain-dev',
    name: 'Blockchain Dev',
    description: 'Web3 och blockchain-utvecklare.',
    category: 'bold',
    preview: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 100%)',
    colors: {
      primary: '#627EEA',
      secondary: '#F7931A',
      accent: '#00FF87',
      background: '#0D0D1A',
      text: '#FFFFFF',
      muted: '#A0AEC0',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    layout: 'single-page',
    features: ['Smart contracts', 'DApp showcase', 'Wallet connect'],
    tier: 'pro',
    new: true,
  },
  // ... Fortsätter med fler templates...
  {
    id: 'consultant-executive',
    name: 'Consultant Executive',
    description: 'Exekutiv profil för managementkonsulter.',
    category: 'elegant',
    preview: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
    colors: {
      primary: '#1A365D',
      secondary: '#2B6CB0',
      accent: '#D69E2E',
      background: '#FFFFFF',
      text: '#1A202C',
      muted: '#718096',
    },
    fonts: { heading: 'Merriweather', body: 'Source Sans Pro' },
    layout: 'multi-section',
    features: ['Executive summary', 'Thought leadership', 'Speaking engagements'],
    tier: 'pro',
  },
  {
    id: 'photographer-portfolio',
    name: 'Photographer',
    description: 'Visuell portfolio för fotografer.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    colors: {
      primary: '#FFFFFF',
      secondary: '#E5E5E5',
      accent: '#FF4444',
      background: '#000000',
      text: '#FFFFFF',
      muted: '#888888',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    layout: 'cards',
    features: ['Full-screen gallery', 'EXIF data', 'Client proofing'],
    tier: 'pro',
  },
  {
    id: 'writer-journalist',
    name: 'Writer & Journalist',
    description: 'Portfolio för skribenter och journalister.',
    category: 'elegant',
    preview: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%)',
    colors: {
      primary: '#1C1917',
      secondary: '#44403C',
      accent: '#DC2626',
      background: '#FAFAF9',
      text: '#1C1917',
      muted: '#78716C',
    },
    fonts: { heading: 'Newsreader', body: 'Spectral' },
    layout: 'single-page',
    features: ['Article excerpts', 'Publication logos', 'Reading time'],
    tier: 'pro',
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Portfolio för produktchefer.',
    category: 'professional',
    preview: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#F8FAFC',
      text: '#1E293B',
      muted: '#64748B',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' },
    layout: 'multi-section',
    features: ['Product metrics', 'Roadmap timeline', 'User growth charts'],
    tier: 'pro',
  },
  {
    id: 'architect-portfolio',
    name: 'Architect',
    description: 'Portfolio för arkitekter.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
    colors: {
      primary: '#2D2D2D',
      secondary: '#4A4A4A',
      accent: '#B8860B',
      background: '#FFFFFF',
      text: '#2D2D2D',
      muted: '#7D7D7D',
    },
    fonts: { heading: 'Archivo', body: 'Work Sans' },
    layout: 'cards',
    features: ['Project blueprints', 'Before/After', '360° views'],
    tier: 'pro',
  },
];

// Generera resterande templates programmatiskt
const generateProTemplates = (): PortfolioTemplateConfig[] => {
  const baseTemplates: Partial<PortfolioTemplateConfig>[] = [
    { category: 'minimal', layout: 'single-page' },
    { category: 'creative', layout: 'multi-section' },
    { category: 'professional', layout: 'sidebar' },
    { category: 'bold', layout: 'split' },
    { category: 'elegant', layout: 'cards' },
  ];

  const colorSchemes = [
    { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#45B7D1', background: '#FFFFFF', text: '#2D3436', muted: '#636E72' },
    { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#FD79A8', background: '#FFFFFF', text: '#2D3436', muted: '#636E72' },
    { primary: '#00B894', secondary: '#00CEC9', accent: '#FDCB6E', background: '#FFFFFF', text: '#2D3436', muted: '#636E72' },
    { primary: '#E17055', secondary: '#FDCB6E', accent: '#81ECEC', background: '#FFFFFF', text: '#2D3436', muted: '#636E72' },
    { primary: '#0984E3', secondary: '#74B9FF', accent: '#55EFC4', background: '#FFFFFF', text: '#2D3436', muted: '#636E72' },
    { primary: '#E84393', secondary: '#FD79A8', accent: '#FFEAA7', background: '#0F0F0F', text: '#FFFFFF', muted: '#888888' },
    { primary: '#00D2D3', secondary: '#54A0FF', accent: '#FF9FF3', background: '#0F0F0F', text: '#FFFFFF', muted: '#888888' },
    { primary: '#5F27CD', secondary: '#A55EEA', accent: '#2ECC71', background: '#0F0F0F', text: '#FFFFFF', muted: '#888888' },
    { primary: '#FF6348', secondary: '#FFA502', accent: '#2ED573', background: '#0F0F0F', text: '#FFFFFF', muted: '#888888' },
    { primary: '#1E90FF', secondary: '#00CED1', accent: '#FFD700', background: '#0F0F0F', text: '#FFFFFF', muted: '#888888' },
  ];

  const names = [
    'Aurora', 'Nebula', 'Cosmos', 'Zenith', 'Prism', 'Vertex', 'Nova', 'Eclipse', 'Horizon', 'Flux',
    'Pulse', 'Wave', 'Grid', 'Pixel', 'Vector', 'Mesh', 'Frame', 'Canvas', 'Layer', 'Blend',
    'Focus', 'Sharp', 'Clear', 'Crisp', 'Bold', 'Vivid', 'Rich', 'Deep', 'Pure', 'True',
    'Swift', 'Flow', 'Drift', 'Glide', 'Rise', 'Soar', 'Peak', 'Summit', 'Crest', 'Edge',
    'Spark', 'Glow', 'Shine', 'Beam', 'Ray', 'Light', 'Bright', 'Radiant', 'Luminous', 'Brilliant',
    'Slate', 'Stone', 'Rock', 'Marble', 'Granite', 'Obsidian', 'Onyx', 'Jade', 'Ruby', 'Sapphire',
    'Ocean', 'Sea', 'River', 'Lake', 'Stream', 'Brook', 'Spring', 'Falls', 'Bay', 'Harbor',
    'Forest', 'Woods', 'Grove', 'Garden', 'Meadow', 'Field', 'Valley', 'Hill', 'Mountain', 'Ridge',
  ];

  const templates: PortfolioTemplateConfig[] = [];
  let index = 0;

  for (let i = 0; index < 85; i++) {
    const base = baseTemplates[i % baseTemplates.length];
    const colors = colorSchemes[index % colorSchemes.length];
    const name = names[index % names.length];

    templates.push({
      id: `pro-${name.toLowerCase()}-${index}`,
      name: `${name} ${base.category === 'minimal' ? 'Clean' : base.category === 'creative' ? 'Creative' : base.category === 'professional' ? 'Pro' : base.category === 'bold' ? 'Bold' : 'Elegant'}`,
      description: `${name}-inspirerad template med ${base.category} estetik.`,
      category: base.category!,
      preview: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      colors,
      fonts: { heading: 'Inter', body: 'Inter' },
      layout: base.layout!,
      features: ['Anpassningsbar', 'Responsiv', 'SEO-optimerad'],
      tier: 'pro',
    });
    index++;
  }

  return templates;
};

// Kombinera alla portfolio templates
export const ALL_PORTFOLIO_TEMPLATES: PortfolioTemplateConfig[] = [
  ...PORTFOLIO_TEMPLATES,
  ...generateProTemplates(),
];

// ============ CV TEMPLATES ============

export const CV_TEMPLATES: CVTemplateConfig[] = [
  // ========== FREE TEMPLATES (3) ==========
  {
    id: 'cv-modern-clean',
    name: 'Modern Clean',
    description: 'Rent och modernt CV som passar alla branscher.',
    category: 'modern',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#22D3EE',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    layout: 'single-column',
    features: ['ATS-optimerat', 'Rent layout', 'Lätt att läsa'],
    tier: 'free',
    atsOptimized: true,
    popular: true,
  },
  {
    id: 'cv-classic-professional',
    name: 'Classic Professional',
    description: 'Tidlös och professionell design.',
    category: 'classic',
    preview: 'linear-gradient(135deg, #1E3A5F 0%, #2E5077 100%)',
    colors: {
      primary: '#1E3A5F',
      secondary: '#2E5077',
      accent: '#D97706',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Georgia', body: 'Arial' },
    layout: 'single-column',
    features: ['Konservativ design', 'Passar alla roller', 'Print-ready'],
    tier: 'free',
    atsOptimized: true,
  },
  {
    id: 'cv-minimal-nordic',
    name: 'Minimal Nordic',
    description: 'Skandinavisk minimalism.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    colors: {
      primary: '#0F172A',
      secondary: '#334155',
      accent: '#0EA5E9',
      background: '#FFFFFF',
      text: '#0F172A',
    },
    fonts: { heading: 'DM Sans', body: 'Inter' },
    layout: 'single-column',
    features: ['Luftig layout', 'Fokus på innehåll', 'Subtle accenter'],
    tier: 'free',
    atsOptimized: true,
  },

  // ========== STARTER TEMPLATES (12) ==========
  {
    id: 'cv-two-column-pro',
    name: 'Two Column Pro',
    description: 'Effektiv två-kolumns layout.',
    category: 'modern',
    preview: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' },
    layout: 'two-column',
    features: ['Sidebar för skills', 'Kompakt layout', 'Professionell'],
    tier: 'starter',
    atsOptimized: true,
    popular: true,
  },
  {
    id: 'cv-timeline-style',
    name: 'Timeline Style',
    description: 'Kronologisk tidslinje-layout.',
    category: 'modern',
    preview: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Poppins', body: 'Inter' },
    layout: 'timeline',
    features: ['Visuell tidslinje', 'Tydlig kronologi', 'Engagerande'],
    tier: 'starter',
    atsOptimized: false,
  },
  {
    id: 'cv-creative-designer',
    name: 'Creative Designer',
    description: 'Kreativt CV för designers.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#FBBF24',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    layout: 'sidebar',
    features: ['Kreativ layout', 'Visuellt fokus', 'Portfolio-vänlig'],
    tier: 'starter',
    atsOptimized: false,
    new: true,
  },
  {
    id: 'cv-tech-developer',
    name: 'Tech Developer',
    description: 'Optimerat för tech-roller.',
    category: 'modern',
    preview: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#22D3EE',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'JetBrains Mono', body: 'Inter' },
    layout: 'two-column',
    features: ['Skill-rating bars', 'Tech stack sektion', 'GitHub-stats'],
    tier: 'starter',
    atsOptimized: true,
  },
  {
    id: 'cv-executive-suite',
    name: 'Executive Suite',
    description: 'För ledande positioner.',
    category: 'executive',
    preview: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    colors: {
      primary: '#1E293B',
      secondary: '#334155',
      accent: '#D97706',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Merriweather', body: 'Source Sans Pro' },
    layout: 'single-column',
    features: ['Executive summary', 'Achievements fokus', 'Board experience'],
    tier: 'starter',
    atsOptimized: true,
  },
  {
    id: 'cv-consultant-pro',
    name: 'Consultant Pro',
    description: 'Perfekt för konsulter.',
    category: 'classic',
    preview: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Open Sans', body: 'Open Sans' },
    layout: 'two-column',
    features: ['Projekt-highlights', 'Branschexpertis', 'Certifieringar'],
    tier: 'starter',
    atsOptimized: true,
  },
  {
    id: 'cv-student-fresh',
    name: 'Student Fresh',
    description: 'Perfekt för studenter och nyexaminerade.',
    category: 'modern',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#22D3EE',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Poppins', body: 'Inter' },
    layout: 'single-column',
    features: ['Utbildningsfokus', 'Projekt-sektion', 'Extracurriculars'],
    tier: 'starter',
    atsOptimized: true,
    popular: true,
  },
  {
    id: 'cv-infographic',
    name: 'Infographic Style',
    description: 'Visuellt CV med infografik.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
    colors: {
      primary: '#F59E0B',
      secondary: '#EAB308',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    layout: 'infographic',
    features: ['Visuella charts', 'Skill meters', 'Ikonbaserat'],
    tier: 'starter',
    atsOptimized: false,
  },
  {
    id: 'cv-dark-mode',
    name: 'Dark Mode',
    description: 'Mörkt tema för tech-proffs.',
    category: 'modern',
    preview: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A2E 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#22D3EE',
      background: '#0F0F0F',
      text: '#FAFAFA',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    layout: 'two-column',
    features: ['Dark theme', 'Neon accents', 'Tech-fokuserat'],
    tier: 'starter',
    atsOptimized: false,
    new: true,
  },
  {
    id: 'cv-one-page',
    name: 'One Page Impact',
    description: 'Allt på en sida, maximalt fokus.',
    category: 'minimal',
    preview: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
    colors: {
      primary: '#18181B',
      secondary: '#27272A',
      accent: '#EF4444',
      background: '#FFFFFF',
      text: '#18181B',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    layout: 'single-column',
    features: ['Strikt 1 sida', 'Kompakt layout', 'Effektivt'],
    tier: 'starter',
    atsOptimized: true,
  },
  {
    id: 'cv-academic',
    name: 'Academic CV',
    description: 'För akademiska positioner.',
    category: 'classic',
    preview: 'linear-gradient(135deg, #78350F 0%, #92400E 100%)',
    colors: {
      primary: '#78350F',
      secondary: '#92400E',
      accent: '#0369A1',
      background: '#FFFFFF',
      text: '#1C1917',
    },
    fonts: { heading: 'Libre Baskerville', body: 'Georgia' },
    layout: 'single-column',
    features: ['Publikationer', 'Forskningsprojekt', 'Konferenser'],
    tier: 'starter',
    atsOptimized: true,
  },
  {
    id: 'cv-creative-bold',
    name: 'Creative Bold',
    description: 'Modigt CV som sticker ut.',
    category: 'creative',
    preview: 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)',
    colors: {
      primary: '#FF0080',
      secondary: '#7928CA',
      accent: '#00FFFF',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    fonts: { heading: 'Bebas Neue', body: 'Roboto' },
    layout: 'sidebar',
    features: ['Bold colors', 'Unik layout', 'Memorabelt'],
    tier: 'starter',
    atsOptimized: false,
  },
];

// Generera fler CV templates för Pro
const generateProCVTemplates = (): CVTemplateConfig[] => {
  const categories: CVTemplateConfig['category'][] = ['classic', 'modern', 'creative', 'minimal', 'executive'];
  const layouts: CVTemplateConfig['layout'][] = ['single-column', 'two-column', 'sidebar', 'timeline', 'infographic'];
  
  const colorSchemes = [
    { primary: '#4F46E5', secondary: '#6366F1', accent: '#10B981', background: '#FFFFFF', text: '#1F2937' },
    { primary: '#DC2626', secondary: '#EF4444', accent: '#FBBF24', background: '#FFFFFF', text: '#1F2937' },
    { primary: '#059669', secondary: '#10B981', accent: '#8B5CF6', background: '#FFFFFF', text: '#1F2937' },
    { primary: '#7C3AED', secondary: '#8B5CF6', accent: '#EC4899', background: '#FFFFFF', text: '#1F2937' },
    { primary: '#0891B2', secondary: '#06B6D4', accent: '#F59E0B', background: '#FFFFFF', text: '#1F2937' },
    { primary: '#BE185D', secondary: '#EC4899', accent: '#22D3EE', background: '#0F0F0F', text: '#FAFAFA' },
    { primary: '#0D9488', secondary: '#14B8A6', accent: '#F97316', background: '#0F0F0F', text: '#FAFAFA' },
    { primary: '#7C2D12', secondary: '#C2410C', accent: '#65A30D', background: '#FFFFFF', text: '#1C1917' },
  ];

  const names = [
    'Impact', 'Focus', 'Elite', 'Premier', 'Prime', 'Apex', 'Summit', 'Pinnacle',
    'Vista', 'Horizon', 'Clarity', 'Precision', 'Excellence', 'Prestige', 'Distinction',
    'Achievement', 'Success', 'Progress', 'Ambition', 'Drive', 'Momentum', 'Velocity',
    'Balance', 'Harmony', 'Unity', 'Synergy', 'Dynamic', 'Vibrant', 'Bold', 'Confident',
    'Sharp', 'Sleek', 'Refined', 'Polished', 'Elegant', 'Sophisticated', 'Classic', 'Timeless',
    'Modern', 'Contemporary', 'Fresh', 'Crisp', 'Clean', 'Pure', 'Simple', 'Essential',
    'Professional', 'Corporate', 'Business', 'Executive', 'Management', 'Leadership',
    'Creative', 'Artistic', 'Designer', 'Innovator', 'Pioneer', 'Visionary', 'Explorer',
    'Tech', 'Digital', 'Code', 'Data', 'Cloud', 'System', 'Network', 'Security',
    'Academic', 'Research', 'Scholar', 'Professor', 'Doctor', 'Engineer', 'Analyst',
    'Consultant', 'Advisor', 'Strategist', 'Specialist', 'Expert', 'Master', 'Senior',
  ];

  const templates: CVTemplateConfig[] = [];

  for (let i = 0; i < 85; i++) {
    const category = categories[i % categories.length];
    const layout = layouts[i % layouts.length];
    const colors = colorSchemes[i % colorSchemes.length];
    const name = names[i % names.length];

    templates.push({
      id: `cv-pro-${name.toLowerCase()}-${i}`,
      name: `${name} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      description: `${name}-inspirerat CV med ${category} stil.`,
      category,
      preview: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      colors,
      fonts: { heading: 'Inter', body: 'Inter' },
      layout,
      features: ['Anpassningsbar', 'Responsiv', 'Professionell'],
      tier: 'pro',
      atsOptimized: layout === 'single-column' || layout === 'two-column',
    });
  }

  return templates;
};

export const ALL_CV_TEMPLATES: CVTemplateConfig[] = [
  ...CV_TEMPLATES,
  ...generateProCVTemplates(),
];

// ============ HELPER FUNCTIONS ============

export function getTemplatesForTier(
  templates: (PortfolioTemplateConfig | CVTemplateConfig)[],
  tier: 'free' | 'starter' | 'pro'
): (PortfolioTemplateConfig | CVTemplateConfig)[] {
  const tierHierarchy = { free: 0, starter: 1, pro: 2 };
  const userLevel = tierHierarchy[tier];
  
  return templates.filter(t => tierHierarchy[t.tier] <= userLevel);
}

export function getPortfolioTemplatesForTier(tier: 'free' | 'starter' | 'pro'): PortfolioTemplateConfig[] {
  return getTemplatesForTier(ALL_PORTFOLIO_TEMPLATES, tier) as PortfolioTemplateConfig[];
}

export function getCVTemplatesForTier(tier: 'free' | 'starter' | 'pro'): CVTemplateConfig[] {
  return getTemplatesForTier(ALL_CV_TEMPLATES, tier) as CVTemplateConfig[];
}

export function getTemplateById(id: string): PortfolioTemplateConfig | CVTemplateConfig | undefined {
  return [...ALL_PORTFOLIO_TEMPLATES, ...ALL_CV_TEMPLATES].find(t => t.id === id);
}

export function getPortfolioTemplateById(id: string): PortfolioTemplateConfig | undefined {
  return ALL_PORTFOLIO_TEMPLATES.find(t => t.id === id);
}

export function getCVTemplateById(id: string): CVTemplateConfig | undefined {
  return ALL_CV_TEMPLATES.find(t => t.id === id);
}

// Template counts per tier
export const TEMPLATE_COUNTS = {
  portfolio: {
    free: ALL_PORTFOLIO_TEMPLATES.filter(t => t.tier === 'free').length,
    starter: ALL_PORTFOLIO_TEMPLATES.filter(t => t.tier === 'free' || t.tier === 'starter').length,
    pro: ALL_PORTFOLIO_TEMPLATES.length,
  },
  cv: {
    free: ALL_CV_TEMPLATES.filter(t => t.tier === 'free').length,
    starter: ALL_CV_TEMPLATES.filter(t => t.tier === 'free' || t.tier === 'starter').length,
    pro: ALL_CV_TEMPLATES.length,
  },
};
