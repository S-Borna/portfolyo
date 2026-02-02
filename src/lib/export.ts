// ============================================
// PORTFOLYO.SE - Export Utilities
// HTML export for portfolio hosting
// PDF export for professional CVs
// ============================================

import { getTemplateById, type TemplateConfig } from './templates';
import { generateTemplateCSS } from './templates/css-generator';
import type { PortfolioData } from '@/components/portfolio/PortfolioRenderer';
import type { CVData } from '@/components/cv/CVRenderer';

// ============================================
// HTML PORTFOLIO EXPORT
// Generates a complete static HTML file
// ============================================

export interface HTMLExportOptions {
  minify?: boolean;
  includeAnalytics?: boolean;
  customDomain?: string;
}

export function generatePortfolioHTML(
  data: PortfolioData,
  options: HTMLExportOptions = {}
): string {
  const { minify = false, includeAnalytics = true, customDomain } = options;

  const template = getTemplateById(data.templateId);
  const colorScheme = template?.colorScheme || {
    bgPrimary: '#0a0a0a',
    bgSecondary: '#111111',
    bgCard: '#161616',
    accent: '#ff4d4d',
    accentGlow: 'rgba(255, 77, 77, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#888888',
    textMuted: '#555555',
  };

  const typography = template?.typography || {
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    headingWeight: '700',
    headingLetterSpacing: '-1px',
    useOutlineText: false,
  };

  const features = template?.features || [];

  // Generate CSS
  const css = template ? generateTemplateCSS(template) : '';

  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${data.profile.tagline || `${data.profile.fullName} - ${data.profile.title}`}">
  <meta property="og:title" content="${data.profile.fullName} | Portfolio">
  <meta property="og:description" content="${data.profile.tagline || data.profile.title}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${customDomain || `https://${data.username}.portfolyo.se`}">
  <meta name="twitter:card" content="summary_large_image">
  <title>${data.profile.fullName} | Portfolio</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    /* CSS Variables */
    :root {
      --bg-primary: ${colorScheme.bgPrimary};
      --bg-secondary: ${colorScheme.bgSecondary};
      --bg-card: ${colorScheme.bgCard};
      --accent: ${colorScheme.accent};
      --accent-glow: ${colorScheme.accentGlow};
      --text-primary: ${colorScheme.textPrimary};
      --text-secondary: ${colorScheme.textSecondary};
      --text-muted: ${colorScheme.textMuted};
      --font-heading: ${typography.headingFont};
      --font-body: ${typography.bodyFont};
    }

    body {
      font-family: var(--font-body);
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Floating Orbs */
    .orbs {
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 20s ease-in-out infinite;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      top: -200px;
      right: -100px;
    }

    .orb-2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      bottom: -100px;
      left: -100px;
      animation-delay: -7s;
    }

    .orb-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      top: 50%;
      left: 30%;
      animation-delay: -14s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(50px, -30px) scale(1.1); }
      50% { transform: translate(-30px, 50px) scale(0.9); }
      75% { transform: translate(-50px, -20px) scale(1.05); }
    }

    /* Noise Overlay */
    .noise {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }

    /* Navigation */
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1rem 2rem;
      background: linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%);
      transition: background 0.3s;
    }

    nav.scrolled {
      background: var(--bg-primary);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .nav-inner {
      max-width: 72rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
    }

    .logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, var(--accent), var(--accent-glow));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--bg-primary);
    }

    .logo-text {
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--accent);
    }

    /* Content */
    main {
      position: relative;
      z-index: 10;
    }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 8rem 2rem 4rem;
    }

    .hero-inner {
      max-width: 72rem;
      margin: 0 auto;
      width: 100%;
    }

    .hero-label {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .hero-label-line {
      height: 1px;
      width: 3rem;
      background: var(--accent);
    }

    .hero-label-text {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--text-secondary);
    }

    .hero-name {
      font-family: var(--font-heading);
      font-size: clamp(3rem, 10vw, 8rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
    }

    .hero-name-first {
      ${typography.useOutlineText ? `
        -webkit-text-stroke: 2px var(--text-primary);
        -webkit-text-fill-color: transparent;
      ` : `
        color: var(--text-primary);
      `}
    }

    .hero-name-last {
      color: var(--accent);
    }

    .hero-tagline {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 40rem;
      margin-bottom: 2rem;
    }

    /* LIA Banner */
    .lia-banner {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: rgba(var(--accent), 0.1);
      border: 1px solid rgba(var(--accent), 0.3);
      border-radius: 1rem;
      margin-bottom: 2rem;
    }

    .lia-dot {
      width: 0.75rem;
      height: 0.75rem;
      background: var(--accent);
      border-radius: 50%;
      position: relative;
    }

    .lia-dot::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      border-radius: 50%;
      animation: ping 1.5s ease-out infinite;
    }

    @keyframes ping {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }

    .lia-text {
      font-weight: 600;
      color: var(--accent);
    }

    .lia-details {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    /* Grid layout */
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr; }
    }

    .avatar {
      width: 12rem;
      height: 12rem;
      border-radius: 1rem;
      object-fit: cover;
      border: 3px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    }

    .avatar-placeholder {
      width: 12rem;
      height: 12rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, var(--accent), var(--accent-glow));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      font-weight: 700;
      color: var(--bg-primary);
    }

    .contact-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.08);
      border-radius: 0.75rem;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .contact-link:hover {
      background: rgba(255,255,255,0.15);
      transform: translateY(-2px);
    }

    .contact-link svg {
      width: 1rem;
      height: 1rem;
      color: var(--accent);
    }

    /* Highlights grid */
    .highlights {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .highlight {
      background: var(--bg-card);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s;
    }

    .highlight:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }

    .highlight-value {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent);
    }

    .highlight-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* Sections */
    section {
      padding: 6rem 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .section-inner {
      max-width: 72rem;
      margin: 0 auto;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .section-label-text {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      color: var(--text-muted);
    }

    .section-label-line {
      height: 1px;
      flex: 1;
      background: rgba(255,255,255,0.1);
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 1rem;
    }

    .section-description {
      color: var(--text-secondary);
      max-width: 40rem;
      margin-bottom: 3rem;
    }

    /* Timeline */
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .timeline-item {
      display: flex;
      gap: 1.5rem;
    }

    .timeline-dot-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .timeline-dot {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 2px solid var(--accent);
      background: var(--bg-primary);
      flex-shrink: 0;
    }

    .timeline-dot.current {
      background: var(--accent);
    }

    .timeline-line {
      width: 2px;
      flex: 1;
      background: rgba(255,255,255,0.1);
      margin-top: 0.5rem;
    }

    .timeline-content {
      flex: 1;
      padding-bottom: 2rem;
    }

    .timeline-period {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .timeline-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(var(--accent), 0.2);
      color: var(--accent);
      font-size: 0.75rem;
      border-radius: 9999px;
      margin-left: 0.5rem;
    }

    .timeline-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .timeline-subtitle {
      color: var(--accent);
      margin-bottom: 0.75rem;
    }

    .timeline-description {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .timeline-achievements {
      list-style: none;
    }

    .timeline-achievements li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .timeline-achievements li::before {
      content: '→';
      color: var(--accent);
    }

    .timeline-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .timeline-tag {
      padding: 0.25rem 0.75rem;
      background: rgba(255,255,255,0.05);
      color: var(--text-muted);
      font-size: 0.75rem;
      border-radius: 0.5rem;
    }

    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .projects-grid { grid-template-columns: 1fr; }
    }

    .project-card {
      background: var(--bg-card);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s;
    }

    .project-card:hover {
      border-color: var(--accent);
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    .project-image {
      aspect-ratio: 16/9;
      background: var(--bg-secondary);
      overflow: hidden;
    }

    .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .project-card:hover .project-image img {
      transform: scale(1.1);
    }

    .project-content {
      padding: 1.5rem;
    }

    .project-badge {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .project-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .project-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .project-tag {
      padding: 0.25rem 0.75rem;
      background: rgba(var(--accent), 0.15);
      color: var(--accent);
      font-size: 0.75rem;
      border-radius: 0.5rem;
    }

    .project-links {
      display: flex;
      gap: 1rem;
    }

    .project-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--accent);
      text-decoration: none;
    }

    .project-link:hover {
      text-decoration: underline;
    }

    /* Tech Stack */
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 1rem;
    }

    .tech-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--bg-card);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 0.75rem;
      transition: all 0.3s;
    }

    .tech-item:hover {
      border-color: var(--accent);
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }

    .tech-icon {
      width: 2rem;
      height: 2rem;
    }

    .tech-name {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-align: center;
    }

    /* Contact */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .contact-grid { grid-template-columns: 1fr; }
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg-card);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.3s;
    }

    .contact-item:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }

    .contact-item svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--accent);
    }

    /* Footer */
    footer {
      padding: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .footer-inner {
      max-width: 72rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-copyright {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      text-decoration: none;
    }

    .footer-brand:hover {
      color: var(--accent);
    }

    .footer-brand-name {
      font-weight: 600;
      color: var(--accent);
    }

    /* CTA Button */
    .cta-button {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: var(--accent);
      color: var(--bg-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      box-shadow: 0 10px 40px var(--accent-glow);
      transition: all 0.3s;
      z-index: 50;
    }

    .cta-button:hover {
      transform: scale(1.1);
    }

    .cta-button svg {
      width: 1.25rem;
      height: 1.25rem;
      margin-bottom: 0.25rem;
    }
  </style>
</head>
<body>
  ${features.includes('floatingOrbs') ? `
  <div class="orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
  ` : ''}

  ${features.includes('noiseTexture') ? '<div class="noise"></div>' : ''}

  <nav id="nav">
    <div class="nav-inner">
      <a href="#" class="logo">
        <div class="logo-icon">${data.profile.fullName.charAt(0)}</div>
        <span class="logo-text">${data.username.toUpperCase()}</span>
      </a>
      <ul class="nav-links">
        <li><a href="#about">Om mig</a></li>
        ${data.timeline?.length ? '<li><a href="#timeline">Timeline</a></li>' : ''}
        ${data.projects?.length ? '<li><a href="#projects">Projekt</a></li>' : ''}
        ${data.techStack?.length ? '<li><a href="#stack">Tech Stack</a></li>' : ''}
        <li><a href="#contact">Kontakt</a></li>
      </ul>
    </div>
  </nav>

  <main>
    <header class="hero">
      <div class="hero-inner">
        <div class="hero-label">
          <div class="hero-label-line"></div>
          <span class="hero-label-text">${data.profile.title}</span>
        </div>

        <h1 class="hero-name">
          <span class="hero-name-first">${data.profile.fullName.split(' ')[0].toUpperCase()}</span>
          <span class="hero-name-last">${data.profile.fullName.split(' ').slice(1).join(' ').toUpperCase()}</span>
        </h1>

        ${data.profile.tagline ? `<p class="hero-tagline">${data.profile.tagline}</p>` : ''}

        ${data.lia?.seeking ? `
        <div class="lia-banner">
          <div class="lia-dot"></div>
          <span class="lia-text">Söker LIA-plats</span>
          <div class="lia-details">
            ${data.lia.period ? `<span>Period: ${data.lia.period}</span>` : ''}
            ${data.lia.location ? `<span>Plats: ${data.lia.location}</span>` : ''}
          </div>
        </div>
        ` : ''}

        <div class="hero-grid">
          <div>
            ${data.profile.avatar
              ? `<img src="${data.profile.avatar}" alt="${data.profile.fullName}" class="avatar">`
              : `<div class="avatar-placeholder">${data.profile.fullName.charAt(0)}</div>`
            }

            ${data.profile.location ? `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; color: var(--text-secondary); font-size: 0.875rem;">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${data.profile.location}
            </div>
            ` : ''}

            <div class="contact-links">
              ${data.contact.linkedin ? `
              <a href="${data.contact.linkedin}" class="contact-link" target="_blank">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
              ` : ''}
              ${data.contact.github ? `
              <a href="${data.contact.github}" class="contact-link" target="_blank">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              ` : ''}
              ${data.contact.email ? `
              <a href="mailto:${data.contact.email}" class="contact-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
              ` : ''}
            </div>
          </div>

          ${data.highlights?.length ? `
          <div class="highlights">
            ${data.highlights.map(h => `
            <div class="highlight">
              <div class="highlight-value">${h.value}</div>
              <div class="highlight-label">${h.label}</div>
            </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </div>
    </header>

    ${data.profile.bio ? `
    <section id="about">
      <div class="section-inner">
        <div class="section-label">
          <span class="section-label-text">${data.profile.fullName.toUpperCase()}</span>
          <div class="section-label-line"></div>
        </div>
        <h2 class="section-title">OM MIG</h2>
        <p style="color: var(--text-secondary); line-height: 1.8; white-space: pre-line;">${data.profile.bio}</p>
      </div>
    </section>
    ` : ''}

    ${data.timeline?.length ? `
    <section id="timeline">
      <div class="section-inner">
        <div class="section-label">
          <span class="section-label-text">${data.profile.fullName.toUpperCase()}</span>
          <div class="section-label-line"></div>
        </div>
        <h2 class="section-title">RESAN</h2>
        <p class="section-description">Min professionella och akademiska resa med konkreta resultat och lärdomar.</p>

        <div class="timeline">
          ${data.timeline.map((entry, i) => `
          <div class="timeline-item">
            <div class="timeline-dot-container">
              <div class="timeline-dot ${entry.current ? 'current' : ''}"></div>
              ${i < data.timeline!.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
              <div class="timeline-period">
                ${entry.period}
                ${entry.current ? '<span class="timeline-badge">Pågående</span>' : ''}
              </div>
              <h3 class="timeline-title">${entry.title}</h3>
              <p class="timeline-subtitle">${entry.subtitle}</p>
              ${entry.description ? `<p class="timeline-description">${entry.description}</p>` : ''}
              ${entry.achievements?.length ? `
              <ul class="timeline-achievements">
                ${entry.achievements.map(a => `<li>${a}</li>`).join('')}
              </ul>
              ` : ''}
              ${entry.tags?.length ? `
              <div class="timeline-tags">
                ${entry.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
              </div>
              ` : ''}
            </div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    ${data.projects?.length ? `
    <section id="projects">
      <div class="section-inner">
        <div class="section-label">
          <span class="section-label-text">${data.profile.fullName.toUpperCase()}</span>
          <div class="section-label-line"></div>
        </div>
        <h2 class="section-title">PROJEKT</h2>

        <div class="projects-grid">
          ${data.projects.map(project => `
          <div class="project-card">
            ${project.image ? `
            <div class="project-image">
              <img src="${project.image}" alt="${project.name}">
            </div>
            ` : ''}
            <div class="project-content">
              ${project.badge ? `<div class="project-badge">${project.badge}</div>` : ''}
              <h3 class="project-title">${project.name}</h3>
              <p class="project-description">${project.description}</p>
              <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
              </div>
              <div class="project-links">
                ${project.links.live ? `<a href="${project.links.live}" class="project-link" target="_blank">Besök sajt →</a>` : ''}
                ${project.links.github ? `<a href="${project.links.github}" class="project-link" target="_blank">GitHub</a>` : ''}
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    ${data.techStack?.length ? `
    <section id="stack">
      <div class="section-inner">
        <div class="section-label">
          <span class="section-label-text">${data.profile.fullName.toUpperCase()}</span>
          <div class="section-label-line"></div>
        </div>
        <h2 class="section-title">TEKNISK KOMPETENS</h2>
        <p class="section-description">Verktyg och teknologier jag arbetat med under utbildning och egna projekt.</p>

        <div class="tech-grid">
          ${data.techStack.map(tech => `
          <div class="tech-item">
            ${tech.icon
              ? `<img src="https://cdn.simpleicons.org/${tech.icon}" alt="${tech.name}" class="tech-icon">`
              : `<svg class="tech-icon" fill="var(--accent)" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`
            }
            <span class="tech-name">${tech.name}</span>
          </div>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    <section id="contact">
      <div class="section-inner" style="max-width: 48rem;">
        <div class="section-label">
          <span class="section-label-text">${data.profile.fullName.toUpperCase()}</span>
          <div class="section-label-line"></div>
        </div>
        <h2 class="section-title">LÅT OSS PRATA</h2>
        <p class="section-description">
          ${data.lia?.seeking
            ? 'Hör av dig om LIA eller samarbete. Jag svarar inom 24 timmar.'
            : 'Intresserad av att samarbeta? Hör av dig!'}
        </p>

        <div class="contact-grid">
          ${data.contact.email ? `
          <a href="mailto:${data.contact.email}" class="contact-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            ${data.contact.email}
          </a>
          ` : ''}
          ${data.contact.phone ? `
          <a href="tel:${data.contact.phone}" class="contact-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            ${data.contact.phone}
          </a>
          ` : ''}
          ${data.contact.linkedin ? `
          <a href="${data.contact.linkedin}" class="contact-item" target="_blank">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            LinkedIn
          </a>
          ` : ''}
          ${data.contact.github ? `
          <a href="${data.contact.github}" class="contact-item" target="_blank">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          ` : ''}
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-inner">
      <span class="footer-copyright">© ${new Date().getFullYear()} ${data.profile.fullName}</span>
      <a href="https://portfolyo.se" class="footer-brand" target="_blank">
        Skapad med <span class="footer-brand-name">PORTFOLYO</span> →
      </a>
    </div>
  </footer>

  ${data.contact.email ? `
  <a href="mailto:${data.contact.email}" class="cta-button">
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    Kontakt
  </a>
  ` : ''}

  <script>
    // Scroll effect for nav
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('nav');
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  </script>
  ${includeAnalytics ? `
  <!-- Portfolio Analytics -->
  <script>
    // Track page view
    if (typeof fetch !== 'undefined') {
      fetch('https://portfolyo.se/api/analytics/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: '${data.username}' })
      }).catch(() => {});
    }
  </script>
  ` : ''}
</body>
</html>`;

  return minify ? html.replace(/\s+/g, ' ').replace(/>\s+</g, '><') : html;
}

// ============================================
// DOWNLOAD HTML FILE
// ============================================

export function downloadPortfolioHTML(data: PortfolioData, filename?: string): void {
  const html = generatePortfolioHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${data.username}-portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// CV PDF GENERATION
// Uses browser print API for high-quality output
// ============================================

export function printCV(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CV - Export</title>
      <style>
        ${styles}
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body { margin: 0; }
          .cv-document { box-shadow: none !important; }
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

export default {
  generatePortfolioHTML,
  downloadPortfolioHTML,
  printCV,
};
