'use client';

// ============================================
// PORTFOLYO.SE - Enterprise CV Renderer
// 50 Professional CV Templates with ATS Support
// Print-ready PDF generation
// ============================================

import React, { forwardRef, useRef } from 'react';
import {
  Mail, Phone, MapPin, Linkedin, Github, Globe,
  Calendar, Briefcase, GraduationCap, Award, Languages,
  Star, CheckCircle, ExternalLink,
} from 'lucide-react';
import { ALL_CV_TEMPLATES, type CVTemplate } from '@/lib/templates';

// ============================================
// TYPES
// ============================================

export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    photo?: string;
  };
  summary?: string;
  experience: {
    id: string;
    company: string;
    title: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    gpa?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  languages?: {
    language: string;
    level: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
}

interface CVRendererProps {
  data: CVData;
  templateId: string;
  scale?: number;
  showGuides?: boolean;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getLanguageLevelText(level: string): string {
  const levels: Record<string, string> = {
    native: 'Modersmål',
    fluent: 'Flytande',
    advanced: 'Avancerad',
    intermediate: 'Mellan',
    basic: 'Grundläggande',
  };
  return levels[level] || level;
}

function getLanguageLevelWidth(level: string): number {
  const widths: Record<string, number> = {
    native: 100,
    fluent: 90,
    advanced: 75,
    intermediate: 50,
    basic: 25,
  };
  return widths[level] || 50;
}

// ============================================
// MODERN TWO-COLUMN LAYOUT
// ============================================

interface ModernTwoColumnProps {
  data: CVData;
  template: CVTemplate;
}

function ModernTwoColumn({ data, template }: ModernTwoColumnProps) {
  const { colors, fonts } = template;
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;

  return (
    <div className="flex h-full" style={{ fontFamily: fonts.body }}>
      {/* Sidebar */}
      <div
        className="w-[35%] p-8 flex flex-col"
        style={{ backgroundColor: colors.primary, color: '#ffffff' }}
      >
        {/* Photo placeholder */}
        {personalInfo.photo ? (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 border-white/20"
          />
        ) : (
          <div className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold bg-white/20">
            {personalInfo.fullName.charAt(0)}
          </div>
        )}

        {/* Name & Title */}
        <h1
          className="text-2xl font-bold text-center mb-1"
          style={{ fontFamily: fonts.heading }}
        >
          {personalInfo.fullName}
        </h1>
        <p className="text-center text-sm opacity-90 mb-8">
          {personalInfo.title}
        </p>

        {/* Contact */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-3">
            Kontakt
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 opacity-70 flex-shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 opacity-70 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 opacity-70 flex-shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-3 text-sm">
              <Linkedin className="h-4 w-4 opacity-70 flex-shrink-0" />
              <span className="truncate">LinkedIn</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-3 text-sm">
              <Github className="h-4 w-4 opacity-70 flex-shrink-0" />
              <span className="truncate">{personalInfo.github}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-4">
              Kompetenser
            </h3>
            {skills.map((category, i) => (
              <div key={i} className="mb-4">
                <h4 className="text-sm font-semibold mb-2 opacity-90">{category.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((skill, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-1 rounded bg-white/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-4">
              Språk
            </h3>
            <div className="space-y-3">
              {languages.map((lang, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{lang.language}</span>
                    <span className="opacity-70">{getLanguageLevelText(lang.level)}</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/60 rounded-full"
                      style={{ width: `${getLanguageLevelWidth(lang.level)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-4">
              Certifieringar
            </h3>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <div key={i} className="text-sm">
                  <div className="font-semibold">{cert.name}</div>
                  <div className="opacity-70 text-xs">{cert.issuer}</div>
                  <div className="opacity-50 text-xs">{cert.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-8"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <h2
              className="text-lg font-bold mb-4 pb-2 border-b-2"
              style={{ color: colors.primary, borderColor: colors.primary, fontFamily: fonts.heading }}
            >
              PROFIL
            </h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-lg font-bold mb-4 pb-2 border-b-2"
              style={{ color: colors.primary, borderColor: colors.primary, fontFamily: fonts.heading }}
            >
              ARBETSLIVSERFARENHET
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold">{exp.title}</h3>
                      <p className="text-sm" style={{ color: colors.secondary }}>
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                      {exp.startDate} - {exp.current ? 'Nu' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2" style={{ color: colors.muted }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span style={{ color: colors.accent }}>•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-lg font-bold mb-4 pb-2 border-b-2"
              style={{ color: colors.primary, borderColor: colors.primary, fontFamily: fonts.heading }}
            >
              UTBILDNING
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{edu.degree}</h3>
                      <p className="text-sm" style={{ color: colors.secondary }}>
                        {edu.institution}
                        {edu.field && ` • ${edu.field}`}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                      {edu.startDate} - {edu.current ? 'Pågående' : edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-xs mt-1" style={{ color: colors.muted }}>
                      Betyg: {edu.gpa}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-sm mt-2" style={{ color: colors.muted }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2
              className="text-lg font-bold mb-4 pb-2 border-b-2"
              style={{ color: colors.primary, borderColor: colors.primary, fontFamily: fonts.heading }}
            >
              PROJEKT
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{project.name}</h3>
                    {project.url && (
                      <ExternalLink className="h-3 w-3" style={{ color: colors.accent }} />
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.muted }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================
// CLASSIC SINGLE-COLUMN LAYOUT
// ATS-optimized for scanning
// ============================================

function ClassicSingleColumn({ data, template }: ModernTwoColumnProps) {
  const { colors, fonts } = template;
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;

  return (
    <div
      className="p-10"
      style={{ backgroundColor: colors.background, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: colors.primary }}>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: fonts.heading, color: colors.text }}
        >
          {personalInfo.fullName}
        </h1>
        <p className="text-lg mb-4" style={{ color: colors.primary }}>
          {personalInfo.title}
        </p>

        {/* Contact row */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm" style={{ color: colors.muted }}>
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              LinkedIn
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" style={{ color: colors.primary }} />
              GitHub
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Profil
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: colors.primary }}
          >
            Arbetslivserfarenhet
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-xs" style={{ color: colors.muted }}>
                    {exp.startDate} - {exp.current ? 'Nu' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  {exp.company}
                  {exp.location && ` | ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="text-sm">• {a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: colors.primary }}
          >
            Utbildning
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm" style={{ color: colors.secondary }}>
                    {edu.institution}
                    {edu.field && ` • ${edu.field}`}
                  </p>
                </div>
                <span className="text-xs" style={{ color: colors.muted }}>
                  {edu.startDate} - {edu.current ? 'Pågående' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-3"
            style={{ color: colors.primary }}
          >
            Kompetenser
          </h2>
          <div className="space-y-2">
            {skills.map((category, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold">{category.category}: </span>
                <span style={{ color: colors.muted }}>{category.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two-column footer: Languages & Certifications */}
      {((languages && languages.length > 0) || (certifications && certifications.length > 0)) && (
        <div className="grid grid-cols-2 gap-8">
          {languages && languages.length > 0 && (
            <section>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Språk
              </h2>
              <div className="space-y-1 text-sm">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <span className="font-medium">{lang.language}</span>
                    <span style={{ color: colors.muted }}> - {getLanguageLevelText(lang.level)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Certifieringar
              </h2>
              <div className="space-y-1 text-sm">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <span className="font-medium">{cert.name}</span>
                    <span style={{ color: colors.muted }}> - {cert.issuer} ({cert.date})</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// MINIMAL CLEAN LAYOUT
// ============================================

function MinimalClean({ data, template }: ModernTwoColumnProps) {
  const { colors, fonts } = template;
  const { personalInfo, summary, experience, education, skills, languages } = data;

  return (
    <div
      className="p-12"
      style={{ backgroundColor: colors.background, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Header - Simple and clean */}
      <header className="mb-10">
        <h1
          className="text-4xl font-light mb-1 tracking-tight"
          style={{ fontFamily: fonts.heading }}
        >
          {personalInfo.fullName}
        </h1>
        <p className="text-lg" style={{ color: colors.muted }}>
          {personalInfo.title}
        </p>

        {/* Contact - Minimal */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: colors.muted }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-10">
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-medium uppercase tracking-[0.2em] mb-6"
            style={{ color: colors.muted }}
          >
            Erfarenhet
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-xs" style={{ color: colors.muted }}>
                    {exp.startDate} — {exp.current ? 'Nu' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm" style={{ color: colors.muted }}>{exp.company}</p>
                {exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="text-sm" style={{ color: colors.text }}>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-medium uppercase tracking-[0.2em] mb-6"
            style={{ color: colors.muted }}
          >
            Utbildning
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm" style={{ color: colors.muted }}>{edu.institution}</p>
                </div>
                <span className="text-xs" style={{ color: colors.muted }}>
                  {edu.endDate || 'Pågående'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills - Inline */}
      {skills.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
            style={{ color: colors.muted }}
          >
            Kompetenser
          </h2>
          <p className="text-sm" style={{ color: colors.text }}>
            {skills.flatMap(c => c.items).join(' • ')}
          </p>
        </section>
      )}

      {/* Languages - Inline */}
      {languages && languages.length > 0 && (
        <section>
          <h2
            className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
            style={{ color: colors.muted }}
          >
            Språk
          </h2>
          <p className="text-sm" style={{ color: colors.text }}>
            {languages.map(l => `${l.language} (${getLanguageLevelText(l.level)})`).join(' • ')}
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================
// CREATIVE SIDEBAR LAYOUT
// ============================================

function CreativeSidebar({ data, template }: ModernTwoColumnProps) {
  const { colors, fonts } = template;
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;

  return (
    <div className="flex h-full" style={{ fontFamily: fonts.body }}>
      {/* Left sidebar - thin accent */}
      <div
        className="w-2"
        style={{ background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})` }}
      />

      {/* Content sidebar */}
      <div
        className="w-[30%] p-6"
        style={{ backgroundColor: colors.background === '#ffffff' ? '#f8f9fa' : `${colors.primary}08` }}
      >
        {/* Photo */}
        {personalInfo.photo ? (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className="w-full aspect-square object-cover rounded-lg mb-6"
          />
        ) : (
          <div
            className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center text-5xl font-bold"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, color: '#fff' }}
          >
            {personalInfo.fullName.charAt(0)}
          </div>
        )}

        {/* Contact */}
        <div className="space-y-3 mb-8 text-sm">
          {personalInfo.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
              <span className="break-all" style={{ color: colors.text }}>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" style={{ color: colors.primary }} />
              <span style={{ color: colors.text }}>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: colors.primary }} />
              <span style={{ color: colors.text }}>{personalInfo.location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: colors.primary }}
            >
              Kompetenser
            </h3>
            {skills.map((category, i) => (
              <div key={i} className="mb-4">
                <h4 className="text-xs font-semibold mb-2" style={{ color: colors.muted }}>
                  {category.category}
                </h4>
                <div className="space-y-1.5">
                  {category.items.map((skill, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <span className="text-xs" style={{ color: colors.text }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: colors.primary }}
            >
              Språk
            </h3>
            <div className="space-y-2">
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span style={{ color: colors.text }}>{lang.language}</span>
                  <span style={{ color: colors.muted }}>{getLanguageLevelText(lang.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        className="flex-1 p-8"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        {/* Header */}
        <header className="mb-8">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: fonts.heading, color: colors.primary }}
          >
            {personalInfo.fullName}
          </h1>
          <p className="text-lg" style={{ color: colors.muted }}>
            {personalInfo.title}
          </p>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <div
              className="h-1 w-12 mb-4"
              style={{ backgroundColor: colors.accent }}
            />
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: colors.primary }}
            >
              Erfarenhet
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: colors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.title}</h3>
                      <p className="text-sm" style={{ color: colors.secondary }}>{exp.company}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
                    >
                      {exp.startDate} - {exp.current ? 'Nu' : exp.endDate}
                    </span>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-1 flex-shrink-0" style={{ color: colors.accent }} />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: colors.primary }}
            >
              Utbildning
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-sm" style={{ color: colors.secondary }}>{edu.institution}</p>
                  </div>
                  <span className="text-xs" style={{ color: colors.muted }}>
                    {edu.endDate || 'Pågående'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN CV RENDERER
// ============================================

export const CVRenderer = forwardRef<HTMLDivElement, CVRendererProps>(
  function CVRenderer({ data, templateId, scale = 1, showGuides = false }, ref) {
    // Get template configuration
    const template = ALL_CV_TEMPLATES.find(t => t.id === templateId) || ALL_CV_TEMPLATES[0];

    // Select layout based on template
    const renderLayout = () => {
      switch (template.layout) {
        case 'two-column':
          return <ModernTwoColumn data={data} template={template} />;
        case 'sidebar':
          return <CreativeSidebar data={data} template={template} />;
        case 'single-column':
          if (template.category === 'minimal') {
            return <MinimalClean data={data} template={template} />;
          }
          return <ClassicSingleColumn data={data} template={template} />;
        case 'classic':
          return <ClassicSingleColumn data={data} template={template} />;
        default:
          return <ModernTwoColumn data={data} template={template} />;
      }
    };

    return (
      <div
        ref={ref}
        className="cv-document shadow-2xl"
        style={{
          width: '794px', // A4 width at 96 DPI
          minHeight: '1123px', // A4 height at 96 DPI
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundColor: template.colors.background,
          position: 'relative',
        }}
      >
        {/* Print guides overlay */}
        {showGuides && (
          <div className="absolute inset-0 pointer-events-none z-50">
            <div className="absolute top-0 left-0 right-0 h-[1cm] border-b border-dashed border-red-300 opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 h-[1cm] border-t border-dashed border-red-300 opacity-50" />
            <div className="absolute top-0 bottom-0 left-0 w-[1cm] border-r border-dashed border-red-300 opacity-50" />
            <div className="absolute top-0 bottom-0 right-0 w-[1cm] border-l border-dashed border-red-300 opacity-50" />
          </div>
        )}

        {/* CV Content */}
        {renderLayout()}
      </div>
    );
  }
);

export default CVRenderer;
