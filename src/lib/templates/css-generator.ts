// ============================================
// PORTFOLYO.SE - CSS Generator
// Genererar CSS baserat på template-konfiguration
// ============================================

import type { TemplateConfig } from './templates';

export function generateTemplateCSS(template: TemplateConfig): string {
    const { colorScheme, typography, layout, backgroundPattern, animations } = template;

    return `
/* ============================================
   ${template.name} - Generated CSS
   Category: ${template.category}
   ============================================ */

:root {
  --bg-primary: ${typeof colorScheme.bgPrimary === 'string' && colorScheme.bgPrimary.includes('gradient') ? colorScheme.bgPrimary : colorScheme.bgPrimary};
  --bg-secondary: ${colorScheme.bgSecondary};
  --bg-card: ${colorScheme.bgCard};
  --accent: ${colorScheme.accent};
  --accent-glow: ${colorScheme.accentGlow};
  --text-primary: ${colorScheme.textPrimary};
  --text-secondary: ${colorScheme.textSecondary};
  --text-muted: ${colorScheme.textMuted};

  --font-heading: ${typography.headingFont};
  --font-body: ${typography.bodyFont};
  --heading-weight: ${typography.headingWeight};
  --heading-letter-spacing: ${typography.headingLetterSpacing};
}

/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Background Animation */
.bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

${generateBackgroundAnimationCSS(animations.background)}

/* Background Pattern Overlay */
${backgroundPattern.css ? `
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${backgroundPattern.css}
  pointer-events: none;
  z-index: 1000;
}
` : ''}

/* Typography */
h1, h2, h3, .heading {
  font-family: var(--font-heading);
  font-weight: var(--heading-weight);
  letter-spacing: var(--heading-letter-spacing);
  line-height: 1.1;
}

${typography.useOutlineText ? `
.outline-text {
  -webkit-text-stroke: 2px var(--text-primary);
  -webkit-text-fill-color: transparent;
}
` : ''}

/* Hero Layout */
${generateHeroLayoutCSS(layout)}

/* Animations */
${animations.entrance.css}

.fade-in {
  opacity: 0;
  animation: ${animations.entrance.id.replace(/([A-Z])/g, '-$1').toLowerCase()} ${animations.entrance.duration} ${animations.entrance.easing} forwards;
}

/* Hover Effects */
.hover-effect {
  transition: ${animations.hover.transition};
}

.hover-effect:hover {
  transform: ${animations.hover.transform};
  box-shadow: ${animations.hover.shadow};
  ${animations.hover.border ? `border: ${animations.hover.border};` : ''}
  ${animations.hover.borderRadius ? `border-radius: ${animations.hover.borderRadius};` : ''}
}

/* Navigation */
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
  font-family: var(--font-heading);
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

/* Cards */
.card {
  background: var(--bg-card);
  border: 1px solid var(--text-muted);
  padding: 2rem;
  transition: all 0.4s ease;
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Stats */
.stat-number {
  font-family: var(--font-heading);
  font-size: 3rem;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Timeline */
.timeline-item {
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid var(--accent);
  margin-bottom: 2rem;
}

.timeline-dot {
  position: absolute;
  left: -8px;
  top: 0;
  width: 14px;
  height: 14px;
  background: var(--accent);
  border-radius: 50%;
  border: 3px solid var(--bg-primary);
}

/* Tech Stack Grid */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.stack-item {
  background: var(--bg-card);
  border: 1px solid var(--text-muted);
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.stack-item:hover {
  border-color: var(--accent);
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px var(--accent-glow);
}

/* Project Cards */
.project-card {
  background: var(--bg-secondary);
  border: 1px solid var(--text-muted);
  transition: all 0.4s ease;
  overflow: hidden;
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
}

/* LIA Banner */
.lia-banner {
  background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 80%, black) 100%);
  padding: 4rem;
  position: relative;
  overflow: hidden;
}

.lia-banner::before {
  content: 'LIA';
  position: absolute;
  right: -50px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-heading);
  font-size: 20rem;
  opacity: 0.1;
  line-height: 1;
}

/* Contact Section */
.contact {
  text-align: center;
  padding: 10rem 4rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  text-decoration: none;
  padding: 1rem 2rem;
  border: 1px solid var(--text-muted);
  transition: all 0.3s ease;
}

.contact-link:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg-primary);
}

/* CTA Button */
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
  box-shadow: 0 10px 40px var(--accent-glow);
  transition: all 0.3s ease;
  z-index: 50;
}

.cta-button:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 50px var(--accent-glow);
}

/* Responsive */
@media (max-width: 768px) {
  nav {
    padding: 1rem 1.5rem;
  }

  section {
    padding: 4rem 1.5rem;
  }

  .nav-links {
    display: none;
  }

  .stack-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-button {
    width: 65px;
    height: 65px;
    font-size: 0.55rem;
  }
}
`;
}

function generateBackgroundAnimationCSS(animation: TemplateConfig['animations']['background']): string {
    if (animation.id === 'floatingOrbs') {
        return `
.bg-animation .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float-orb ${animation.duration} ${animation.easing} infinite;
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
`;
    }

    if (animation.id === 'particleFloat') {
        return `
.bg-animation .particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  animation: particle-float ${animation.duration} ${animation.easing} infinite;
}

@keyframes particle-float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
}
`;
    }

    return `
.bg-animation {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  background-size: 400% 400%;
  animation: gradient-shift ${animation.duration} ${animation.easing} infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
}

function generateHeroLayoutCSS(layout: TemplateConfig['layout']): string {
    switch (layout.id) {
        case 'splitHero':
            return `
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 4rem;
}

.hero-content {
  display: grid;
  grid-template-columns: ${layout.heroColumns};
  gap: 4rem;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.hero-image {
  ${layout.imageShape === 'circle' ? 'border-radius: 50%;' : layout.imageShape === 'rounded' ? 'border-radius: 20px;' : ''}
  width: 320px;
  height: 320px;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-image {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
}
`;

        case 'centeredHero':
            return `
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 4rem;
}

.hero-image {
  ${layout.imageShape === 'circle' ? 'border-radius: 50%;' : layout.imageShape === 'rounded' ? 'border-radius: 20px;' : ''}
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin-bottom: 2rem;
  border: 4px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
}
`;

        case 'fullscreenImage':
            return `
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8));
  z-index: 1;
}

.hero-bg {
  position: absolute;
  inset: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.hero-content {
  position: relative;
  z-index: 2;
}
`;

        case 'asymmetric':
            return `
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 4rem;
}

.hero-content {
  display: grid;
  grid-template-columns: ${layout.heroColumns};
  gap: 4rem;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.hero-image {
  ${layout.imageShape === 'rounded' ? 'border-radius: 20px;' : ''}
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3/4;
  object-fit: cover;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
  }
}
`;

        default:
            return `
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 4rem;
}
`;
    }
}

// Export CSS som Tailwind-kompatibla klasser
export function generateTailwindConfig(template: TemplateConfig) {
    const { colorScheme } = template;

    return {
        theme: {
            extend: {
                colors: {
                    'bg-primary': colorScheme.bgPrimary,
                    'bg-secondary': colorScheme.bgSecondary,
                    'bg-card': colorScheme.bgCard,
                    'accent': colorScheme.accent,
                    'text-primary': colorScheme.textPrimary,
                    'text-secondary': colorScheme.textSecondary,
                    'text-muted': colorScheme.textMuted,
                },
                fontFamily: {
                    heading: [template.typography.headingFont],
                    body: [template.typography.bodyFont],
                },
                animation: {
                    'float-orb': 'float-orb 20s ease-in-out infinite',
                    'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                    'gradient-shift': 'gradient-shift 8s ease infinite',
                },
                keyframes: {
                    'float-orb': {
                        '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                        '25%': { transform: 'translate(50px, -30px) scale(1.1)' },
                        '50%': { transform: 'translate(-30px, 50px) scale(0.9)' },
                        '75%': { transform: 'translate(-50px, -20px) scale(1.05)' },
                    },
                    'fade-in-up': {
                        from: { opacity: '0', transform: 'translateY(30px)' },
                        to: { opacity: '1', transform: 'translateY(0)' },
                    },
                    'gradient-shift': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' },
                    },
                },
            },
        },
    };
}
