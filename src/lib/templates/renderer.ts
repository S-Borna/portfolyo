// ============================================
// PORTFOLYO.SE - Portfolio Renderer Engine
// Generates static HTML from data + template
// ============================================

import type {
    PortfolioRenderData,
    TemplateStyle,
    Language
} from '../models';
import { getTemplate, getDefaultTemplate, styleToCssVars } from './system';

// ============================================
// TRANSLATIONS
// ============================================

const translations: Record<Language, Record<string, string>> = {
    sv: {
        about: 'Om mig',
        experience: 'Erfarenhet',
        education: 'Utbildning',
        projects: 'Projekt',
        skills: 'Kompetenser',
        contact: 'Kontakt',
        seeking: 'Söker',
        lia: 'LIA-plats',
        job: 'ny utmaning',
        freelance: 'uppdrag',
        period: 'Period',
        location: 'Plats',
        interests: 'Intressen',
        download_cv: 'Ladda ner CV',
        view_project: 'Visa projekt',
        current: 'Nuvarande',
        email_me: 'Maila mig',
        powered_by: 'Skapad med',
    },
    en: {
        about: 'About',
        experience: 'Experience',
        education: 'Education',
        projects: 'Projects',
        skills: 'Skills',
        contact: 'Contact',
        seeking: 'Seeking',
        lia: 'internship',
        job: 'new opportunity',
        freelance: 'freelance work',
        period: 'Period',
        location: 'Location',
        interests: 'Interests',
        download_cv: 'Download CV',
        view_project: 'View project',
        current: 'Current',
        email_me: 'Email me',
        powered_by: 'Built with',
    },
};

// ============================================
// MAIN RENDERER
// ============================================

/**
 * Render complete portfolio HTML
 */
export function renderPortfolio(
    data: PortfolioRenderData,
    templateId: string = 'crimson-dark'
): string {
    const template = getTemplate(templateId) || getDefaultTemplate();
    const style = template.style;
    const t = translations[data.language];
    const hasFeature = (f: string) => template.features.includes(f as any);

    return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.full_name} | ${data.title}</title>
  <meta name="description" content="${data.tagline || data.title}">

  <!-- OG Tags -->
  <meta property="og:title" content="${data.full_name} | ${data.title}">
  <meta property="og:description" content="${data.tagline || data.title}">
  <meta property="og:type" content="website">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    ${generateCSS(style)}
  </style>
</head>
<body>
  ${hasFeature('floating_orbs') ? renderFloatingOrbs(style) : ''}
  ${hasFeature('sticky_nav') ? renderNavigation(data, t) : ''}

  <main>
    ${renderHero(data, style, t)}
    ${renderAbout(data, t)}
    ${data.seeking ? renderSeeking(data, t) : ''}
    ${data.experience.length > 0 || data.education.length > 0 ? renderTimeline(data, t) : ''}
    ${data.projects.length > 0 ? renderProjects(data, style, t) : ''}
    ${data.skills.length > 0 ? renderSkills(data, t) : ''}
    ${renderContact(data, t)}
  </main>

  ${renderFooter(data, t)}

  <script>
    ${generateJS()}
  </script>
</body>
</html>`;
}

// ============================================
// CSS GENERATION
// ============================================

function generateCSS(style: TemplateStyle): string {
    return `
    :root {
      ${styleToCssVars(style)}
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: 80px;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

    /* Typography */
    h1, h2, h3, h4, h5 {
      font-family: var(--font-heading);
      font-weight: 400;
      letter-spacing: 0.02em;
      line-height: 1.1;
    }

    .display {
      font-size: clamp(3rem, 10vw, 7rem);
      font-weight: 400;
      line-height: 0.95;
    }

    .section-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      margin-bottom: 2rem;
    }

    /* Layout */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    section {
      padding: 5rem 0;
    }

    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: ${style.bg_primary}ee;
      backdrop-filter: blur(20px);
      border-bottom: 1px solid ${style.bg_card};
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
    }

    .nav-logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, var(--accent), ${style.accent}aa);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .nav-logo-text {
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: none;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--text-primary);
    }

    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }

    /* Hero */
    .hero {
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      padding-top: 0;
      position: relative;
    }

    .hero-grid {
      display: grid;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 768px) {
      .hero-grid {
        grid-template-columns: ${style.hero_layout === 'split' ? '1fr 1fr' : '1fr'};
        gap: 4rem;
      }
    }

    .hero-content {
      text-align: ${style.hero_layout === 'centered' ? 'center' : 'left'};
    }

    .hero-label {
      display: inline-block;
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    .hero-name {
      margin-bottom: 0.5rem;
    }

    .hero-name .outline {
      color: transparent;
      -webkit-text-stroke: 1px var(--accent);
    }

    .hero-title {
      font-family: var(--font-body);
      font-size: clamp(1.125rem, 2.5vw, 1.5rem);
      color: var(--text-secondary);
      margin-bottom: 0;
      margin-top: 1.5rem;
      font-weight: 400;
      max-width: 500px;
    }

    .hero-image {
      display: flex;
      justify-content: ${style.hero_layout === 'centered' ? 'center' : 'flex-end'};
    }

    .avatar {
      width: 280px;
      height: 280px;
      border-radius: 1rem;
      object-fit: cover;
      border: 2px solid var(--bg-card);
    }

    .avatar-placeholder {
      width: 280px;
      height: 280px;
      border-radius: 1rem;
      background: linear-gradient(135deg, var(--accent), ${style.accent}88);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6rem;
      font-family: var(--font-heading);
      color: var(--text-primary);
    }

    /* Highlights */
    .highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-top: 2.5rem;
    }

    .highlight {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .highlight-value {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-heading);
    }

    .highlight-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }

    /* Seeking Banner */
    .seeking {
      background: ${style.accent}15;
      border: 1px solid ${style.accent}30;
      border-radius: 1rem;
      padding: 1.5rem 2rem;
      margin-bottom: 3rem;
    }

    .seeking-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .seeking-pulse {
      position: relative;
      width: 12px;
      height: 12px;
    }

    .seeking-pulse::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .seeking-pulse::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      border-radius: 50%;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(2); opacity: 0; }
    }

    .seeking-title {
      font-weight: 600;
      color: var(--accent);
      font-size: 1.125rem;
    }

    .seeking-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .seeking-meta span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .seeking-meta .label {
      color: var(--text-muted);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    /* About */
    .about-content {
      max-width: 680px;
    }

    .about-bio {
      font-size: 1.0625rem;
      color: var(--text-secondary);
      line-height: 1.75;
    }

    .about-bio + .about-bio {
      margin-top: 1.5rem;
    }

    /* Timeline */
    .timeline {
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--bg-card);
    }

    .timeline-item {
      position: relative;
      padding-left: 2rem;
      padding-bottom: 2.5rem;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -4px;
      top: 0.5rem;
      width: 9px;
      height: 9px;
      background: var(--accent);
      border-radius: 50%;
    }

    .timeline-item.current::before {
      box-shadow: 0 0 0 4px ${style.accent}30;
    }

    .timeline-period {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .timeline-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .timeline-subtitle {
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .timeline-description {
      font-size: 0.9375rem;
      color: var(--text-secondary);
    }

    /* Projects */
    .projects-grid {
      display: grid;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .projects-grid {
        grid-template-columns: ${style.project_layout === 'list' ? '1fr' : 'repeat(2, 1fr)'};
      }
    }

    .project-card {
      background: var(--bg-card);
      border-radius: 1rem;
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -20px ${style.accent}20;
    }

    .project-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      background: var(--bg-secondary);
    }

    .project-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .project-description {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      border-radius: 9999px;
    }

    /* Skills */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-tag {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      background: var(--bg-card);
      color: var(--text-primary);
      border-radius: 0.5rem;
      font-weight: 500;
    }

    /* Contact */
    .contact-grid {
      display: grid;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .contact-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: var(--bg-card);
      border-radius: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
      transition: background 0.2s;
    }

    .contact-link:hover {
      background: var(--bg-secondary);
    }

    .contact-icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent);
      border-radius: 0.5rem;
    }

    .contact-icon svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-primary);
    }

    .contact-label {
      font-weight: 600;
    }

    .contact-value {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    /* Footer */
    footer {
      padding: 3rem 0;
      text-align: center;
    }

    .footer-content {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }

    .footer-content a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-content a:hover {
      color: var(--text-secondary);
    }

    /* Floating Orbs */
    .orbs {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 20s infinite ease-in-out;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: var(--accent);
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: ${style.accent}88;
      bottom: 20%;
      left: -100px;
      animation-delay: -5s;
    }

    .orb-3 {
      width: 200px;
      height: 200px;
      background: ${style.accent}66;
      top: 50%;
      right: 20%;
      animation-delay: -10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.05); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(20px, 10px) scale(1.02); }
    }

    /* Noise Texture */
    ${style.has_noise_texture ? `
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.03;
      pointer-events: none;
      z-index: 1000;
    }
    ` : ''}

    /* Utilities */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    /* Animations */
    @media (prefers-reduced-motion: no-preference) {
      .fade-in {
        animation: fadeIn 0.6s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    }
  `;
}

// ============================================
// SECTION RENDERERS
// ============================================

function renderFloatingOrbs(style: TemplateStyle): string {
    return `
    <div class="orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
  `;
}

function renderNavigation(data: PortfolioRenderData, t: Record<string, string>): string {
    return `
    <nav class="nav">
      <div class="nav-inner">
        <a href="#" class="nav-logo">
          <div class="nav-logo-icon">${data.full_name.charAt(0)}</div>
          <span class="nav-logo-text">${data.full_name.split(' ')[0].toUpperCase()}</span>
        </a>
        <ul class="nav-links">
          <li><a href="#about">${t.about}</a></li>
          ${data.experience.length > 0 || data.education.length > 0 ? `<li><a href="#timeline">${t.experience}</a></li>` : ''}
          ${data.projects.length > 0 ? `<li><a href="#projects">${t.projects}</a></li>` : ''}
          ${data.skills.length > 0 ? `<li><a href="#skills">${t.skills}</a></li>` : ''}
          <li><a href="#contact">${t.contact}</a></li>
        </ul>
      </div>
    </nav>
  `;
}

function renderHero(data: PortfolioRenderData, style: TemplateStyle, t: Record<string, string>): string {
    const nameParts = data.full_name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join('');

    return `
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in">
          <span class="hero-label">${data.title}</span>
          <h1 class="hero-name display">${firstName.toUpperCase()}${lastName ? `<span class="outline">${lastName.toUpperCase()}</span>` : ''}</h1>
          ${data.tagline ? `<p class="hero-title">${data.tagline}</p>` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderSeeking(data: PortfolioRenderData, t: Record<string, string>): string {
    if (!data.seeking) return '';

    const seekingLabel = t[data.seeking.type] || t.job;

    return `
    <section id="seeking">
      <div class="container">
        <div class="seeking">
          <div class="seeking-header">
            <div class="seeking-pulse"></div>
            <span class="seeking-title">${t.seeking} ${seekingLabel}</span>
          </div>
          <div class="seeking-meta">
            ${data.seeking.period ? `<span><span class="label">${t.period}</span> ${data.seeking.period}</span>` : ''}
            ${data.seeking.location ? `<span><span class="label">${t.location}</span> ${data.seeking.location}</span>` : ''}
            ${data.seeking.interests && data.seeking.interests.length > 0
            ? `<span><span class="label">${t.interests}</span> ${data.seeking.interests.join(' · ')}</span>`
            : ''
        }
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAbout(data: PortfolioRenderData, t: Record<string, string>): string {
    if (!data.bio) return '';

    return `
    <section id="about">
      <div class="container">
        <h2 class="section-title">${t.about.toUpperCase()}</h2>
        <div class="about-content">
          <p class="about-bio">${data.bio}</p>
        </div>
      </div>
    </section>
  `;
}

function renderTimeline(data: PortfolioRenderData, t: Record<string, string>): string {
    const items = [
        ...data.experience.map(e => ({ ...e, type: 'work' as const })),
        ...data.education.map(e => ({
            title: e.degree,
            company: e.institution,
            period: e.period,
            type: 'education' as const,
            current: false,
        })),
    ].sort((a, b) => {
        // Sort by most recent first
        if (a.current) return -1;
        if (b.current) return 1;
        return 0;
    });

    if (items.length === 0) return '';

    return `
    <section id="timeline">
      <div class="container">
        <h2 class="section-title">${t.experience.toUpperCase()}</h2>
        <div class="timeline">
          ${items.map(item => `
            <div class="timeline-item ${item.current ? 'current' : ''}">
              <div class="timeline-period">${item.period}${item.current ? ` · ${t.current}` : ''}</div>
              <h3 class="timeline-title">${item.title}</h3>
              <div class="timeline-subtitle">${item.company}</div>
              ${item.type === 'work' && (item as any).description
            ? `<p class="timeline-description">${(item as any).description}</p>`
            : ''
        }
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderProjects(data: PortfolioRenderData, style: TemplateStyle, t: Record<string, string>): string {
    if (data.projects.length === 0) return '';

    return `
    <section id="projects">
      <div class="container">
        <h2 class="section-title">${t.projects.toUpperCase()}</h2>
        <div class="projects-grid">
          ${data.projects.map(project => `
            <article class="project-card">
              ${project.image ? `<img src="${project.image}" alt="${project.name}" class="project-image">` : ''}
              <h3 class="project-name">${project.name}</h3>
              <p class="project-description">${project.description}</p>
              <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderSkills(data: PortfolioRenderData, t: Record<string, string>): string {
    if (data.skills.length === 0) return '';

    return `
    <section id="skills">
      <div class="container">
        <h2 class="section-title">${t.skills.toUpperCase()}</h2>
        <div class="skills-grid">
          ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderContact(data: PortfolioRenderData, t: Record<string, string>): string {
    const links = [
        data.email && { icon: 'mail', label: 'Email', value: data.email, href: `mailto:${data.email}` },
        data.linkedin && { icon: 'linkedin', label: 'LinkedIn', value: 'LinkedIn', href: data.linkedin },
        data.github && { icon: 'github', label: 'GitHub', value: 'GitHub', href: data.github },
        data.website && { icon: 'globe', label: 'Website', value: data.website, href: data.website },
    ].filter((link): link is { icon: string; label: string; value: string; href: string } => Boolean(link));

    if (links.length === 0) return '';

    const icons: Record<string, string> = {
        mail: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
        linkedin: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
        github: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        globe: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>',
    };

    return `
    <section id="contact">
      <div class="container">
        <h2 class="section-title">${t.contact.toUpperCase()}</h2>
        <div class="contact-grid">
          ${links.map(link => `
            <a href="${link.href}" class="contact-link" target="${link.icon === 'mail' ? '_self' : '_blank'}" rel="noopener noreferrer">
              <div class="contact-icon">${icons[link.icon]}</div>
              <div>
                <div class="contact-label">${link.label}</div>
                <div class="contact-value">${link.value}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderFooter(data: PortfolioRenderData, t: Record<string, string>): string {
    const location = data.seeking?.location || '';
    return `
    <footer>
      <div class="container">
        <p class="footer-content">
          © ${new Date().getFullYear()} ${data.full_name}${location ? ` · ${location}` : ''}
        </p>
      </div>
    </footer>
  `;
}

// ============================================
// JAVASCRIPT GENERATION
// ============================================

function generateJS(): string {
    return `
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Fade in sections on scroll
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
      });
    }
  `;
}

// ============================================
// EXPORTS
// ============================================

export { translations };
