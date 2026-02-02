// ============================================
// PORTFOLYO.SE - CV Renderer
// Generates PDF-ready HTML for CVs
// ============================================

import type { CVRenderData, DbCVSettings } from '../models';

// ============================================
// CV TEMPLATES
// ============================================

export type CVTemplateId = 'modern-dark' | 'modern-light' | 'classic' | 'minimal';

interface CVTemplate {
    id: CVTemplateId;
    name: string;
    description: string;
    style: CVStyle;
}

interface CVStyle {
    bg: string;
    text: string;
    accent: string;
    muted: string;
    border: string;
    font: string;
}

export const CV_TEMPLATES: CVTemplate[] = [
    {
        id: 'modern-dark',
        name: 'Modern Dark',
        description: 'Mörk, professionell design',
        style: {
            bg: '#0a0a0a',
            text: '#ffffff',
            accent: '#ff4d4d',
            muted: '#666666',
            border: '#222222',
            font: "'Space Grotesk', sans-serif",
        },
    },
    {
        id: 'modern-light',
        name: 'Modern Light',
        description: 'Ljus, ren design',
        style: {
            bg: '#ffffff',
            text: '#1a1a1a',
            accent: '#0066ff',
            muted: '#666666',
            border: '#e5e5e5',
            font: "'Inter', sans-serif",
        },
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Tidlös, traditionell design',
        style: {
            bg: '#ffffff',
            text: '#1a1a1a',
            accent: '#1a1a1a',
            muted: '#555555',
            border: '#cccccc',
            font: "'Georgia', serif",
        },
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Extremt ren och enkel',
        style: {
            bg: '#ffffff',
            text: '#1a1a1a',
            accent: '#1a1a1a',
            muted: '#888888',
            border: '#f0f0f0',
            font: "'Inter', sans-serif",
        },
    },
];

export function getCVTemplate(id: CVTemplateId): CVTemplate {
    return CV_TEMPLATES.find(t => t.id === id) || CV_TEMPLATES[0];
}

// ============================================
// CV RENDERER
// ============================================

export function renderCV(
    data: CVRenderData,
    templateId: CVTemplateId = 'modern-dark',
    settings: Partial<DbCVSettings> = {}
): string {
    const template = getCVTemplate(templateId);
    const style = template.style;

    // Override accent if custom color provided
    if (settings.primary_color) {
        style.accent = settings.primary_color;
    }

    return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${data.full_name}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    ${generateCVCSS(style, settings)}
  </style>
</head>
<body>
  <div class="cv">
    ${renderHeader(data, style)}

    <div class="content">
      ${data.summary ? renderSummary(data.summary) : ''}
      ${data.experience.length > 0 ? renderExperience(data.experience) : ''}
      ${data.education.length > 0 ? renderEducation(data.education) : ''}
      ${data.skills.length > 0 ? renderSkills(data.skills) : ''}
      ${data.languages.length > 0 ? renderLanguages(data.languages) : ''}
      ${data.certifications.length > 0 ? renderCertifications(data.certifications) : ''}
      ${data.projects.length > 0 ? renderProjects(data.projects) : ''}
    </div>
  </div>
</body>
</html>`;
}

// ============================================
// CSS GENERATION
// ============================================

function generateCVCSS(style: CVStyle, settings: Partial<DbCVSettings>): string {
    const fontSize = settings.font_size === 'small' ? '9pt' : settings.font_size === 'large' ? '11pt' : '10pt';
    const pageSize = settings.page_size === 'letter' ? '8.5in 11in' : '210mm 297mm';

    return `
    @page {
      size: ${pageSize};
      margin: 0.75in;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      font-size: ${fontSize};
    }

    body {
      font-family: ${style.font};
      background: ${style.bg};
      color: ${style.text};
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cv {
      max-width: 100%;
      padding: 0;
    }

    /* Header */
    .header {
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom: none;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .name {
      font-size: 2.75rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .title {
      font-size: 1.125rem;
      color: ${style.muted};
      margin-top: 0.375rem;
    }

    .accent-line {
      width: 2.5rem;
      height: 2px;
      background: ${style.accent};
      margin-top: 0.75rem;
    }

    .contact {
      margin-top: 1rem;
      font-size: 0.8125rem;
      color: ${style.muted};
      line-height: 1.6;
    }

    .contact-item a {
      color: inherit;
      text-decoration: none;
    }

    .contact-item a:hover {
      color: ${style.accent};
    }

    /* Content */
    .content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Section */
    .section {
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: ${style.accent};
      margin-bottom: 0.625rem;
      padding-bottom: 0.375rem;
      border-bottom: 1px solid ${style.border};
    }

    /* Summary */
    .summary-text {
      font-size: 0.9375rem;
      color: ${style.muted};
      line-height: 1.6;
    }

    /* Experience & Education entries */
    .entry {
      margin-bottom: 1rem;
      page-break-inside: avoid;
    }

    .entry:last-child {
      margin-bottom: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.25rem;
    }

    .entry-title {
      font-size: 1rem;
      font-weight: 600;
    }

    .entry-period {
      font-size: 0.875rem;
      color: ${style.muted};
      white-space: nowrap;
    }

    .entry-subtitle {
      font-size: 0.9375rem;
      color: ${style.muted};
      margin-bottom: 0.375rem;
    }

    .entry-description {
      font-size: 0.875rem;
      color: ${style.muted};
      margin-bottom: 0.5rem;
    }

    .achievements {
      margin: 0;
      padding-left: 1.25rem;
    }

    .achievements li {
      font-size: 0.875rem;
      color: ${style.text};
      margin-bottom: 0.25rem;
    }

    /* Skills */
    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .skill-category {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .skill-category-name {
      font-weight: 600;
      font-size: 0.9375rem;
      min-width: 100px;
    }

    .skill-list {
      font-size: 0.875rem;
      color: ${style.muted};
    }

    /* Languages */
    .languages-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .language-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .language-name {
      font-weight: 500;
    }

    .language-level {
      font-size: 0.875rem;
      color: ${style.muted};
    }

    /* Certifications */
    .certifications-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .certification-item {
      display: flex;
      justify-content: space-between;
    }

    .certification-name {
      font-weight: 500;
    }

    .certification-issuer {
      font-size: 0.875rem;
      color: ${style.muted};
    }

    .certification-date {
      font-size: 0.875rem;
      color: ${style.muted};
    }

    /* Projects */
    .project-item {
      margin-bottom: 0.75rem;
    }

    .project-name {
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .project-description {
      font-size: 0.875rem;
      color: ${style.muted};
      margin-top: 0.125rem;
    }

    .project-tech {
      font-size: 0.75rem;
      color: ${style.accent};
      margin-top: 0.25rem;
    }

    /* Print styles */
    @media print {
      body {
        background: ${style.bg};
      }

      .cv {
        width: 100%;
        max-width: none;
      }
    }
  `;
}

// ============================================
// SECTION RENDERERS
// ============================================

function renderHeader(data: CVRenderData, style: CVStyle): string {
    const contactItems = [
        data.email && { value: data.email, href: `mailto:${data.email}` },
        data.phone && { value: data.phone, href: `tel:${data.phone}` },
        data.location && { value: data.location, href: undefined },
        data.linkedin && { value: 'LinkedIn', href: data.linkedin },
        data.github && { value: 'GitHub', href: data.github },
    ].filter((item): item is { value: string; href: string | undefined } => Boolean(item));

    return `
    <header class="header">
      <div class="header-main">
        <div>
          <h1 class="name">${data.full_name}</h1>
          ${data.title ? `<p class="title">${data.title}</p>` : ''}
          <div class="accent-line"></div>
        </div>
      </div>
      <div class="contact">
        ${contactItems.map(item => `
          <span class="contact-item">
            ${item.href
            ? `<a href="${item.href}">${item.value}</a>`
            : item.value
        }
          </span>
        `).join(' · ')}
      </div>
    </header>
  `;
}

function renderSummary(summary: string): string {
    return `
    <section class="section">
      <h2 class="section-title">Profil</h2>
      <p class="summary-text">${summary}</p>
    </section>
  `;
}

function renderExperience(experience: CVRenderData['experience']): string {
    return `
    <section class="section">
      <h2 class="section-title">Erfarenhet</h2>
      ${experience.map(exp => `
        <div class="entry">
          <div class="entry-header">
            <h3 class="entry-title">${exp.title}</h3>
            <span class="entry-period">${exp.start_date} - ${exp.current ? 'Nu' : exp.end_date || ''}</span>
          </div>
          <p class="entry-subtitle">${exp.company}${exp.location ? ` · ${exp.location}` : ''}</p>
          ${exp.description ? `<p class="entry-description">${exp.description}</p>` : ''}
          ${exp.achievements && exp.achievements.length > 0 ? `
            <ul class="achievements">
              ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </section>
  `;
}

function renderEducation(education: CVRenderData['education']): string {
    return `
    <section class="section">
      <h2 class="section-title">Utbildning</h2>
      ${education.map(edu => `
        <div class="entry">
          <div class="entry-header">
            <h3 class="entry-title">${edu.degree}</h3>
            <span class="entry-period">${edu.start_date} - ${edu.current ? 'Nu' : edu.end_date || ''}</span>
          </div>
          <p class="entry-subtitle">${edu.institution}${edu.field ? ` · ${edu.field}` : ''}${edu.location ? ` · ${edu.location}` : ''}</p>
          ${edu.description ? `<p class="entry-description">${edu.description}</p>` : ''}
          ${edu.gpa ? `<p class="entry-description">GPA: ${edu.gpa}</p>` : ''}
        </div>
      `).join('')}
    </section>
  `;
}

function renderSkills(skills: CVRenderData['skills']): string {
    return `
    <section class="section">
      <h2 class="section-title">Kompetenser</h2>
      <div class="skills-grid">
        ${skills.map(category => `
          <div class="skill-category">
            <span class="skill-category-name">${category.name}</span>
            <span class="skill-list">${category.skills.join(' · ')}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLanguages(languages: CVRenderData['languages']): string {
    const levelLabels: Record<string, string> = {
        native: 'Modersmål',
        fluent: 'Flytande',
        advanced: 'Avancerad',
        intermediate: 'Mellan',
        basic: 'Grundläggande',
    };

    return `
    <section class="section">
      <h2 class="section-title">Språk</h2>
      <div class="languages-grid">
        ${languages.map(lang => `
          <div class="language-item">
            <span class="language-name">${lang.language}</span>
            <span class="language-level">(${levelLabels[lang.level] || lang.level})</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCertifications(certifications: CVRenderData['certifications']): string {
    return `
    <section class="section">
      <h2 class="section-title">Certifieringar</h2>
      <div class="certifications-list">
        ${certifications.map(cert => `
          <div class="certification-item">
            <div>
              <span class="certification-name">${cert.name}</span>
              <span class="certification-issuer"> · ${cert.issuer}</span>
            </div>
            <span class="certification-date">${cert.date}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderProjects(projects: CVRenderData['projects']): string {
    return `
    <section class="section">
      <h2 class="section-title">Projekt</h2>
      ${projects.map(project => `
        <div class="project-item">
          <span class="project-name">${project.name}</span>
          ${project.url ? `<a href="${project.url}" target="_blank"> ↗</a>` : ''}
          <p class="project-description">${project.description}</p>
          ${project.technologies.length > 0 ? `
            <p class="project-tech">${project.technologies.join(' · ')}</p>
          ` : ''}
        </div>
      `).join('')}
    </section>
  `;
}

// CV_TEMPLATES is already exported at declaration
