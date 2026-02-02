// ============================================
// PORTFOLYO.SE - Portfolio HTML Renderer
// Genererar statisk HTML från template + data
// Benchmark: saidborna.com
// ============================================

export interface PortfolioData {
    // Identity
    fullName: string;
    title: string;
    tagline: string;
    bio: string;
    avatar?: string;
    location: string;

    // Contact
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;

    // Content
    highlights: Array<{ value: string; label: string }>;
    skills: string[];
    projects: Array<{
        name: string;
        description: string;
        tags: string[];
        url?: string;
        image?: string;
    }>;
    experience: Array<{
        title: string;
        company: string;
        period: string;
        description?: string;
        current?: boolean;
    }>;
    education: Array<{
        degree: string;
        institution: string;
        period: string;
    }>;

    // Seeking (optional LIA/job section)
    seeking?: {
        title: string;
        description: string;
        period?: string;
        location?: string;
        interests?: string[];
    };

    // Settings
    language: 'sv' | 'en';
    showCV: boolean;
    cvUrl?: string;
}

export interface TemplateStyle {
    // Colors
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    accent: string;
    accentGlow: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    // Typography
    fontHeading: string;
    fontBody: string;

    // Layout
    heroLayout: 'split' | 'centered' | 'asymmetric';
    projectLayout: 'grid' | 'list' | 'masonry';

    // Effects
    hasFloatingOrbs: boolean;
    hasNoiseTexture: boolean;
    hasGradientBg: boolean;
    hasStickyNav: boolean;
}

// Default style matching saidborna.com
export const defaultStyle: TemplateStyle = {
    bgPrimary: '#0a0a0a',
    bgSecondary: '#111111',
    bgCard: '#161616',
    accent: '#ff4d4d',
    accentGlow: 'rgba(255, 77, 77, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#888888',
    textMuted: '#555555',
    fontHeading: "'Bebas Neue', sans-serif",
    fontBody: "'Space Grotesk', sans-serif",
    heroLayout: 'split',
    projectLayout: 'grid',
    hasFloatingOrbs: true,
    hasNoiseTexture: true,
    hasGradientBg: false,
    hasStickyNav: true,
};

/**
 * Generates complete HTML for a portfolio
 */
export function renderPortfolioHTML(
    data: PortfolioData,
    style: TemplateStyle = defaultStyle
): string {
    const t = translations[data.language];

    return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.fullName} | ${data.title}</title>
  <meta name="description" content="${data.tagline}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    ${generateCSS(style)}
  </style>
</head>
<body>
  ${style.hasFloatingOrbs ? renderFloatingOrbs() : ''}
  ${style.hasStickyNav ? renderNavigation(data, t) : ''}

  ${renderHeroSection(data, style, t)}
  ${renderAboutSection(data, t)}
  ${data.seeking ? renderSeekingSection(data.seeking, t) : ''}
  ${renderProjectsSection(data.projects, t)}
  ${renderSkillsSection(data.skills, t)}
  ${renderContactSection(data, t)}

  ${renderFooter(data, t)}

  <script>
    ${generateJS(data)}
  </script>
</body>
</html>`;
}

// ============================================
// CSS Generation
// ============================================

function generateCSS(style: TemplateStyle): string {
    return `
    :root {
      --bg-primary: ${style.bgPrimary};
      --bg-secondary: ${style.bgSecondary};
      --bg-card: ${style.bgCard};
      --accent: ${style.accent};
      --accent-glow: ${style.accentGlow};
      --text-primary: ${style.textPrimary};
      --text-secondary: ${style.textSecondary};
      --text-muted: ${style.textMuted};
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
      font-family: ${style.fontBody};
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Typography */
    h1, h2, h3, h4 {
      font-family: ${style.fontHeading};
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    .section-title {
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 0.9;
      margin-bottom: 1rem;
    }

    .outline {
      -webkit-text-stroke: 1px var(--text-primary);
      -webkit-text-fill-color: transparent;
    }

    /* Navigation */
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1.5rem 4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(10, 10, 10, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logo {
      font-family: ${style.fontHeading};
      font-size: 1.5rem;
      letter-spacing: 2px;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      letter-spacing: 1px;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: var(--accent);
    }

    /* Hero Section */
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

    .hero-label {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--accent);
      font-size: 0.85rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .hero-label::before {
      content: '';
      width: 40px;
      height: 1px;
      background: var(--accent);
    }

    .hero-name {
      font-family: ${style.fontHeading};
      font-size: clamp(4rem, 12vw, 8rem);
      line-height: 0.9;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      color: var(--text-secondary);
      font-size: 1.2rem;
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .hero-profile-image {
      width: 320px;
      height: 320px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
    }

    /* CV Link */
    .hero-cv-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--accent);
      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 77, 77, 0.08);
      border: 1px solid rgba(255, 77, 77, 0.3);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .hero-cv-link:hover {
      transform: scale(1.05);
      background: rgba(255, 77, 77, 0.15);
      border-color: var(--accent);
      box-shadow: 0 0 30px rgba(255, 77, 77, 0.4);
    }

    /* Sections */
    section {
      padding: 8rem 4rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
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
      background: linear-gradient(90deg, var(--accent) 0%, transparent 100%);
    }

    /* About Section */
    .about {
      background: var(--bg-secondary);
    }

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }

    .about-text {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.8;
    }

    .about-highlight {
      color: var(--text-primary);
      font-weight: 500;
    }

    /* Stats Grid */
    .about-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid #1a1a1a;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: var(--accent);
      transform: translateY(-5px);
    }

    .stat-number {
      font-family: ${style.fontHeading};
      font-size: 3rem;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.85rem;
      letter-spacing: 1px;
    }

    /* LIA/Seeking Banner */
    .lia-banner {
      background: linear-gradient(135deg, rgba(255, 77, 77, 0.1) 0%, rgba(255, 77, 77, 0.05) 100%);
      border: 1px solid rgba(255, 77, 77, 0.2);
      padding: 3rem;
      margin-top: 4rem;
      position: relative;
      overflow: hidden;
    }

    .lia-title {
      font-family: ${style.fontHeading};
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
      gap: 0.25rem;
    }

    .lia-item-label {
      color: var(--accent);
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .lia-item-value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    /* Projects */
    .project-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
    }

    .project-card {
      background: var(--bg-secondary);
      border: 1px solid #1a1a1a;
      padding: 2rem;
      transition: all 0.4s ease;
    }

    .project-card:hover {
      border-color: var(--accent);
      transform: scale(1.01);
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

    .project-name {
      font-family: ${style.fontHeading};
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .project-description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.8;
    }

    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
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

    /* Skills/Stack */
    .stack-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .stack-item {
      background: var(--bg-card);
      border: 1px solid #1a1a1a;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stack-item:hover {
      border-color: var(--accent);
      transform: translateY(-5px);
    }

    .stack-name {
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .stack-tier {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* Contact */
    .contact {
      text-align: center;
      padding: 10rem 4rem;
    }

    .contact-title {
      font-family: ${style.fontHeading};
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
      color: var(--text-primary);
      text-decoration: none;
      font-size: 1.1rem;
      padding: 1rem 2rem;
      border: 1px solid #333;
      transition: all 0.3s ease;
    }

    .contact-link:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    /* Footer */
    footer {
      padding: 2rem 4rem;
      border-top: 1px solid #1a1a1a;
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    /* Floating Orbs */
    .bg-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: orbFloat 20s ease-in-out infinite;
    }

    .orb:nth-child(1) {
      width: 600px;
      height: 600px;
      background: var(--accent);
      top: -200px;
      left: -200px;
    }

    .orb:nth-child(2) {
      width: 400px;
      height: 400px;
      background: var(--accent);
      bottom: -100px;
      right: -100px;
      animation-delay: -10s;
    }

    .orb:nth-child(3) {
      width: 300px;
      height: 300px;
      background: var(--accent);
      top: 50%;
      left: 50%;
      animation-delay: -5s;
    }

    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(50px, -50px) scale(1.1); }
      50% { transform: translate(-30px, 30px) scale(0.95); }
      75% { transform: translate(40px, 40px) scale(1.05); }
    }

    /* Fade In Animation */
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease;
    }

    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      nav { padding: 1.5rem 2rem; }
      section { padding: 6rem 2rem; }
      .hero { padding: 0 2rem; }
      .hero-content { grid-template-columns: 1fr; text-align: center; }
      .about-content { grid-template-columns: 1fr; }
      .project-grid { grid-template-columns: 1fr; }
      .stack-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 768px) {
      nav { padding: 1rem 1.5rem; }
      .nav-links { display: none; }
      section { padding: 4rem 1.5rem; }
      .hero { padding: 0 1.5rem; min-height: auto; padding-top: 100px; }
      .hero-profile-image { width: 220px; height: 220px; }
      .hero-name { font-size: 3.5rem; }
      .about-stats { grid-template-columns: 1fr 1fr; }
      .stack-grid { grid-template-columns: repeat(2, 1fr); }
      .lia-details { flex-direction: column; gap: 1rem; }
      .contact-links { flex-direction: column; }
    }
  `;
}

// ============================================
// Section Renderers
// ============================================

function renderFloatingOrbs(): string {
    return `
    <div class="bg-animation">
      <div class="orb"></div>
      <div class="orb"></div>
      <div class="orb"></div>
    </div>
  `;
}

function renderNavigation(data: PortfolioData, t: typeof translations.sv): string {
    return `
    <nav>
      <div class="logo">${data.fullName.toUpperCase()}</div>
      <ul class="nav-links">
        <li><a href="#about">${t.navAbout}</a></li>
        <li><a href="#projects">${t.navProjects}</a></li>
        <li><a href="#skills">${t.navSkills}</a></li>
        <li><a href="#contact">${t.navContact}</a></li>
      </ul>
    </nav>
  `;
}

function renderHeroSection(data: PortfolioData, style: TemplateStyle, t: typeof translations.sv): string {
    const nameParts = data.fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-label">${data.title}</div>
          <h1 class="hero-name">${firstName}<br><span class="outline">${lastName}</span></h1>
          <p class="hero-title">${data.tagline}</p>
          ${data.showCV && data.cvUrl ? `
            <a href="${data.cvUrl}" class="hero-cv-link" target="_blank">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
              </svg>
              Curriculum Vitae
            </a>
          ` : ''}
          <div class="hero-meta">
            ${data.location ? `<div class="meta-item"><span class="meta-label">${t.location}</span><span class="meta-value">${data.location}</span></div>` : ''}
          </div>
        </div>
        <div class="hero-image-container">
          ${data.avatar ? `<img src="${data.avatar}" alt="${data.fullName}" class="hero-profile-image">` : `
            <div class="hero-profile-image" style="background: linear-gradient(135deg, var(--accent) 0%, var(--bg-card) 100%); display: flex; align-items: center; justify-content: center; font-family: ${style.fontHeading}; font-size: 4rem; color: var(--text-primary);">
              ${data.fullName.split(' ').map(n => n[0]).join('')}
            </div>
          `}
        </div>
      </div>
    </section>
  `;
}

function renderAboutSection(data: PortfolioData, t: typeof translations.sv): string {
    return `
    <section class="about" id="about">
      <div class="section-header">
        <span class="section-label">${t.aboutLabel}</span>
        <div class="section-line"></div>
      </div>
      <h2 class="section-title">${data.title.split(' ')[0]}<br><span class="outline">${data.title.split(' ').slice(1).join(' ') || 'PROFILE'}</span></h2>
      <div class="about-content">
        <div class="about-text">
          <p>${data.bio}</p>
        </div>
        <div class="about-stats">
          ${data.highlights.map(h => `
            <div class="stat-card fade-in">
              <div class="stat-number">${h.value}</div>
              <div class="stat-label">${h.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderSeekingSection(seeking: NonNullable<PortfolioData['seeking']>, t: typeof translations.sv): string {
    return `
    <div class="lia-banner fade-in">
      <h3 class="lia-title">${seeking.title}</h3>
      <p>${seeking.description}</p>
      <div class="lia-details">
        ${seeking.period ? `<div class="lia-item"><span class="lia-item-label">${t.period}</span><span class="lia-item-value">${seeking.period}</span></div>` : ''}
        ${seeking.location ? `<div class="lia-item"><span class="lia-item-label">${t.location}</span><span class="lia-item-value">${seeking.location}</span></div>` : ''}
        ${seeking.interests?.length ? `<div class="lia-item"><span class="lia-item-label">${t.interests}</span><span class="lia-item-value">${seeking.interests.join(' · ')}</span></div>` : ''}
      </div>
    </div>
  `;
}

function renderProjectsSection(projects: PortfolioData['projects'], t: typeof translations.sv): string {
    if (!projects.length) return '';

    return `
    <section class="projects" id="projects">
      <div class="section-header">
        <span class="section-label">${t.projectsLabel}</span>
        <div class="section-line"></div>
      </div>
      <h2 class="section-title">${t.projectsTitle.split(' ')[0]}<br><span class="outline">${t.projectsTitle.split(' ').slice(1).join(' ')}</span></h2>
      <div class="project-grid">
        ${projects.map(p => `
          <article class="project-card fade-in">
            <div class="project-info">
              ${p.tags[0] ? `<span class="project-tag">${p.tags[0]}</span>` : ''}
              <h3 class="project-name">${p.name}</h3>
              <p class="project-description">${p.description}</p>
              <div class="project-tech">
                ${p.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
              </div>
              ${p.url ? `<a href="${p.url}" class="project-link" target="_blank">${t.visitProject} →</a>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderSkillsSection(skills: string[], t: typeof translations.sv): string {
    if (!skills.length) return '';

    return `
    <section class="skills" id="skills">
      <div class="section-header">
        <span class="section-label">${t.skillsLabel}</span>
        <div class="section-line"></div>
      </div>
      <h2 class="section-title">${t.skillsTitle.split(' ')[0]}<br><span class="outline">${t.skillsTitle.split(' ').slice(1).join(' ')}</span></h2>
      <div class="stack-grid fade-in">
        ${skills.map(skill => `
          <div class="stack-item">
            <div class="stack-name">${skill}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderContactSection(data: PortfolioData, t: typeof translations.sv): string {
    return `
    <section class="contact" id="contact">
      <h2 class="contact-title">${t.contactTitle.split(' ')[0]}<br>${t.contactTitle.split(' ').slice(1).join(' ')}</h2>
      <p class="contact-subtitle">${t.contactSubtitle}</p>
      <div class="contact-links">
        <a href="mailto:${data.email}" class="contact-link">${data.email}</a>
        ${data.phone ? `<a href="tel:${data.phone}" class="contact-link">${data.phone}</a>` : ''}
        ${data.linkedin ? `<a href="${data.linkedin}" class="contact-link" target="_blank">LinkedIn</a>` : ''}
        ${data.github ? `<a href="${data.github}" class="contact-link" target="_blank">GitHub</a>` : ''}
      </div>
    </section>
  `;
}

function renderFooter(data: PortfolioData, t: typeof translations.sv): string {
    const year = new Date().getFullYear();
    return `
    <footer>
      <span>© ${year} ${data.fullName}</span>
      ${data.location ? `<span>${data.location}</span>` : ''}
    </footer>
  `;
}

// ============================================
// JavaScript Generation
// ============================================

function generateJS(data: PortfolioData): string {
    return `
    // Fade in on scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  `;
}

// ============================================
// Translations
// ============================================

const translations = {
    sv: {
        navAbout: 'Om mig',
        navProjects: 'Projekt',
        navSkills: 'Kompetens',
        navContact: 'Kontakt',
        aboutLabel: 'Om mig',
        projectsLabel: 'Projekt',
        projectsTitle: 'MINA PROJEKT',
        visitProject: 'Besök',
        skillsLabel: 'Kompetens',
        skillsTitle: 'TEKNISK KOMPETENS',
        contactTitle: 'LÅT OSS PRATA',
        contactSubtitle: 'Hör av dig för samarbete eller frågor',
        period: 'Period',
        location: 'Plats',
        interests: 'Intresse',
    },
    en: {
        navAbout: 'About',
        navProjects: 'Projects',
        navSkills: 'Skills',
        navContact: 'Contact',
        aboutLabel: 'About me',
        projectsLabel: 'Projects',
        projectsTitle: 'MY PROJECTS',
        visitProject: 'Visit',
        skillsLabel: 'Skills',
        skillsTitle: 'TECHNICAL SKILLS',
        contactTitle: 'LET\'S TALK',
        contactSubtitle: 'Get in touch for collaboration or questions',
        period: 'Period',
        location: 'Location',
        interests: 'Interest',
    },
};
