'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { PortfolioTemplateConfig, CVTemplateConfig } from '@/lib/templates';
import { renderCVV2, CV_TEMPLATES_V2, type CVData, type CVTemplateConfig as CVTemplateConfigV2 } from '@/lib/templates/cv-renderer-v2';
import { renderPortfolioV2, PORTFOLIO_TEMPLATES_V2, type PortfolioDataV2 } from '@/lib/templates/portfolio-renderer-v2';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  Star,
} from 'lucide-react';

// ============ PORTFOLIO PREVIEW ============

interface PortfolioPreviewProps {
  template: PortfolioTemplateConfig;
  data: {
    fullName?: string;
    title?: string;
    tagline?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    skills?: string[];
    projects?: {
      name: string;
      description: string;
      tags: string[];
      image?: string;
    }[];
    experience?: {
      title: string;
      company: string;
      period: string;
      current?: boolean;
    }[];
    education?: {
      degree: string;
      institution: string;
      period: string;
    }[];
    seeking?: string;
  };
  className?: string;
  scale?: number;
}

export function PortfolioPreview({ template, data, className, scale = 0.4 }: PortfolioPreviewProps) {
  const { colors, fonts, layout } = template;

  const previewStyle = {
    '--primary': colors.primary,
    '--secondary': colors.secondary,
    '--accent': colors.accent,
    '--background': colors.background,
    '--text': colors.text,
    '--muted': colors.muted,
    fontFamily: fonts.body,
  } as React.CSSProperties;

  const isDark = colors.background.toLowerCase() === '#000000' ||
    colors.background.toLowerCase().startsWith('#0') ||
    colors.background.toLowerCase().startsWith('#1');

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden shadow-2xl border',
        isDark ? 'border-gray-700' : 'border-gray-200',
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      <div
        className="min-h-[1000px] w-[1200px]"
        style={{
          ...previewStyle,
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {/* Header / Hero */}
        <header
          className="px-16 py-20"
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary}20 100%)`
              : `linear-gradient(135deg, ${colors.background} 0%, ${colors.primary}10 100%)`,
          }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Profile */}
            <div className="flex items-start gap-8">
              {/* Avatar */}
              <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold"
                style={{
                  backgroundColor: colors.primary,
                  color: '#FFFFFF',
                }}
              >
                {data.fullName?.charAt(0) || 'P'}
              </div>

              <div className="flex-1">
                <h1
                  className="text-5xl font-bold mb-2"
                  style={{ fontFamily: fonts.heading }}
                >
                  {data.fullName || 'Ditt Namn'}
                </h1>
                <p
                  className="text-2xl mb-4"
                  style={{ color: colors.primary }}
                >
                  {data.title || 'Din Titel'}
                </p>
                {data.tagline && (
                  <p className="text-lg" style={{ color: colors.muted }}>
                    {data.tagline}
                  </p>
                )}

                {/* Contact row */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {data.location && (
                    <span className="flex items-center gap-2 text-sm" style={{ color: colors.muted }}>
                      <MapPin className="h-4 w-4" />
                      {data.location}
                    </span>
                  )}
                  {data.email && (
                    <span className="flex items-center gap-2 text-sm" style={{ color: colors.muted }}>
                      <Mail className="h-4 w-4" />
                      {data.email}
                    </span>
                  )}
                  {data.github && (
                    <span className="flex items-center gap-2 text-sm" style={{ color: colors.muted }}>
                      <Github className="h-4 w-4" />
                      {data.github}
                    </span>
                  )}
                  {data.linkedin && (
                    <span className="flex items-center gap-2 text-sm" style={{ color: colors.muted }}>
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {data.bio && (
              <div
                className="mt-8 p-6 rounded-xl"
                style={{
                  backgroundColor: isDark ? `${colors.primary}15` : `${colors.primary}08`,
                  borderLeft: `4px solid ${colors.primary}`,
                }}
              >
                <p className="text-lg leading-relaxed">{data.bio}</p>
              </div>
            )}

            {/* Seeking badge */}
            {data.seeking && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-6 text-sm font-medium"
                style={{
                  backgroundColor: colors.accent,
                  color: isDark ? colors.background : '#FFFFFF',
                }}
              >
                <Star className="h-4 w-4" />
                Söker: {data.seeking}
              </div>
            )}
          </div>
        </header>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="px-16 py-12 border-t" style={{ borderColor: isDark ? '#333' : '#eee' }}>
            <div className="max-w-5xl mx-auto">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: fonts.heading }}
              >
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: isDark ? `${colors.primary}20` : `${colors.primary}10`,
                      color: colors.primary,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="px-16 py-12 border-t" style={{ borderColor: isDark ? '#333' : '#eee' }}>
            <div className="max-w-5xl mx-auto">
              <h2
                className="text-2xl font-bold mb-8"
                style={{ fontFamily: fonts.heading }}
              >
                Projekt
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {data.projects.map((project, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-6 transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: isDark ? `${colors.secondary}15` : '#F8FAFC',
                      border: `1px solid ${isDark ? '#333' : '#E2E8F0'}`,
                    }}
                  >
                    <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                    <p className="text-sm mb-4" style={{ color: colors.muted }}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: colors.accent + '20',
                            color: colors.accent,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience & Education */}
        <section className="px-16 py-12 border-t" style={{ borderColor: isDark ? '#333' : '#eee' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-12">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                  style={{ fontFamily: fonts.heading }}
                >
                  <Briefcase className="h-6 w-6" style={{ color: colors.primary }} />
                  Erfarenhet
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="pl-4"
                      style={{ borderLeft: `2px solid ${colors.primary}` }}
                    >
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p style={{ color: colors.muted }}>{exp.company}</p>
                      <p className="text-sm" style={{ color: colors.muted }}>
                        {exp.period} {exp.current && '• Nuvarande'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h2
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                  style={{ fontFamily: fonts.heading }}
                >
                  <GraduationCap className="h-6 w-6" style={{ color: colors.primary }} />
                  Utbildning
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, i) => (
                    <div
                      key={i}
                      className="pl-4"
                      style={{ borderLeft: `2px solid ${colors.accent}` }}
                    >
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p style={{ color: colors.muted }}>{edu.institution}</p>
                      <p className="text-sm" style={{ color: colors.muted }}>{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="px-16 py-8 text-center text-sm"
          style={{
            backgroundColor: isDark ? `${colors.primary}10` : `${colors.primary}05`,
            color: colors.muted,
          }}
        >
          Skapad med PORTFOLYO.SE
        </footer>
      </div>
    </div>
  );
}

// ============ CV PREVIEW ============

interface CVPreviewProps {
  template: CVTemplateConfig;
  data: {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
    experience?: {
      company: string;
      title: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string;
      achievements: string[];
    }[];
    education?: {
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }[];
    skills?: {
      name: string;
      skills: string[];
    }[];
  };
  className?: string;
  scale?: number;
}

export function CVPreview({ template, data, className, scale = 0.5 }: CVPreviewProps) {
  const { colors, fonts, layout } = template;

  const isDark = colors.background.toLowerCase().startsWith('#0') ||
    colors.background.toLowerCase().startsWith('#1');

  const isTwoColumn = layout === 'two-column' || layout === 'sidebar';

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden shadow-2xl',
        isDark ? 'border border-gray-700' : 'border border-gray-200',
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
      }}
    >
      <div
        className="w-[794px] min-h-[1123px]" // A4 proportions
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: fonts.body,
        }}
      >
        {isTwoColumn ? (
          // Two-column layout
          <div className="flex h-full">
            {/* Sidebar */}
            <div
              className="w-1/3 p-8"
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF',
              }}
            >
              {/* Avatar placeholder */}
              <div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {data.fullName?.charAt(0) || 'N'}
              </div>

              <h1
                className="text-xl font-bold text-center mb-1"
                style={{ fontFamily: fonts.heading }}
              >
                {data.fullName || 'Ditt Namn'}
              </h1>
              <p className="text-center text-sm opacity-90 mb-8">
                {data.title || 'Din Titel'}
              </p>

              {/* Contact */}
              <div className="space-y-3 text-sm">
                {data.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 opacity-75" />
                    <span className="truncate">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 opacity-75" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 opacity-75" />
                    <span>{data.location}</span>
                  </div>
                )}
                {data.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 opacity-75" />
                    <span>LinkedIn</span>
                  </div>
                )}
                {data.github && (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 opacity-75" />
                    <span>{data.github}</span>
                  </div>
                )}
              </div>

              {/* Skills in sidebar */}
              {data.skills && data.skills.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-75">
                    Kompetenser
                  </h2>
                  {data.skills.map((category, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="text-sm font-medium mb-2">{category.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {category.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="flex-1 p-8">
              {/* Summary */}
              {data.summary && (
                <section className="mb-8">
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ color: colors.primary, fontFamily: fonts.heading }}
                  >
                    PROFIL
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                    {data.summary}
                  </p>
                </section>
              )}

              {/* Experience */}
              {data.experience && data.experience.length > 0 && (
                <section className="mb-8">
                  <h2
                    className="text-lg font-bold mb-4"
                    style={{ color: colors.primary, fontFamily: fonts.heading }}
                  >
                    ERFARENHET
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{exp.title}</h3>
                            <p className="text-sm" style={{ color: colors.secondary }}>
                              {exp.company}
                            </p>
                          </div>
                          <span className="text-xs" style={{ color: colors.accent }}>
                            {exp.startDate} - {exp.current ? 'Nu' : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm mt-2" style={{ color: colors.text }}>
                            {exp.description}
                          </p>
                        )}
                        {exp.achievements.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.achievements.map((a, j) => (
                              <li key={j} className="text-sm flex items-start gap-2">
                                <span style={{ color: colors.accent }}>•</span>
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
              {data.education && data.education.length > 0 && (
                <section>
                  <h2
                    className="text-lg font-bold mb-4"
                    style={{ color: colors.primary, fontFamily: fonts.heading }}
                  >
                    UTBILDNING
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-sm" style={{ color: colors.secondary }}>
                              {edu.institution}
                            </p>
                          </div>
                          <span className="text-xs" style={{ color: colors.accent }}>
                            {edu.startDate} - {edu.current ? 'Nu' : edu.endDate}
                          </span>
                        </div>
                        {edu.field && (
                          <p className="text-sm" style={{ color: colors.text }}>{edu.field}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        ) : (
          // Single-column layout
          <div className="p-12">
            {/* Header */}
            <header className="text-center pb-6 mb-6 border-b" style={{ borderColor: colors.primary }}>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: fonts.heading, color: colors.text }}
              >
                {data.fullName || 'Ditt Namn'}
              </h1>
              <p className="text-lg mb-4" style={{ color: colors.primary }}>
                {data.title || 'Din Titel'}
              </p>
              <div className="flex justify-center flex-wrap gap-4 text-sm" style={{ color: colors.text }}>
                {data.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {data.phone}
                  </span>
                )}
                {data.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {data.location}
                  </span>
                )}
              </div>
            </header>

            {/* Summary */}
            {data.summary && (
              <section className="mb-6">
                <h2
                  className="text-sm font-bold uppercase tracking-wider mb-2"
                  style={{ color: colors.primary }}
                >
                  Sammanfattning
                </h2>
                <p className="text-sm leading-relaxed">{data.summary}</p>
              </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-6">
                <h2
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: colors.primary }}
                >
                  Erfarenhet
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{exp.title}</h3>
                        <span className="text-xs" style={{ color: colors.secondary }}>
                          {exp.startDate} - {exp.current ? 'Nuvarande' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: colors.secondary }}>{exp.company}</p>
                      {exp.achievements.length > 0 && (
                        <ul className="mt-1 text-sm space-y-1">
                          {exp.achievements.map((a, j) => (
                            <li key={j}>• {a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section className="mb-6">
                <h2
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: colors.primary }}
                >
                  Utbildning
                </h2>
                <div className="space-y-2">
                  {data.education.map((edu, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm" style={{ color: colors.secondary }}>{edu.institution}</p>
                      </div>
                      <span className="text-xs" style={{ color: colors.secondary }}>
                        {edu.startDate} - {edu.current ? 'Pågående' : edu.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h2
                  className="text-sm font-bold uppercase tracking-wider mb-3"
                  style={{ color: colors.primary }}
                >
                  Kompetenser
                </h2>
                <div className="space-y-2">
                  {data.skills.map((category, i) => (
                    <div key={i}>
                      <span className="font-medium">{category.name}: </span>
                      <span className="text-sm">{category.skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ TEMPLATE CARD ============

interface TemplateCardProps {
  template: PortfolioTemplateConfig | CVTemplateConfig;
  isSelected?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function TemplateCard({ template, isSelected, isLocked, onClick, size = 'md' }: TemplateCardProps) {
  const sizes = {
    sm: 'w-32 h-40',
    md: 'w-48 h-56',
    lg: 'w-64 h-72',
  };

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      className={cn(
        'relative rounded-xl overflow-hidden transition-all',
        sizes[size],
        isSelected && 'ring-2 ring-violet-500 ring-offset-2',
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 cursor-pointer',
      )}
    >
      {/* Preview gradient */}
      <div
        className="absolute inset-0"
        style={{ background: template.preview }}
      />

      {/* Overlay with info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
        <h3 className="text-white font-semibold text-sm">{template.name}</h3>
        <p className="text-white/70 text-xs truncate">{template.description}</p>

        {/* Badges */}
        <div className="flex gap-1 mt-2">
          {template.popular && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
              Populär
            </span>
          )}
          {template.new && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
              Ny
            </span>
          )}
          {template.tier !== 'free' && (
            <span className={cn(
              'px-2 py-0.5 text-white text-xs rounded-full',
              template.tier === 'starter' ? 'bg-blue-500' : 'bg-violet-500'
            )}>
              {template.tier === 'starter' ? 'Starter' : 'Pro'}
            </span>
          )}
        </div>
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

// ============ CV PREVIEW V2 - Uses actual renderCVV2 ============

interface CVPreviewV2Props {
  templateId: string;
  data: {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary?: string;
    experience?: {
      company: string;
      title: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string;
      achievements: string[];
    }[];
    education?: {
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      current: boolean;
    }[];
    skills?: {
      name: string;
      skills: string[];
    }[];
    languages?: {
      name: string;
      level: string;
    }[];
    projects?: {
      name: string;
      description: string;
      url?: string;
    }[];
  };
  className?: string;
  scale?: number;
}

export function CVPreviewV2({ templateId, data, className, scale = 0.5 }: CVPreviewV2Props) {
  // Convert editor data to CVData format
  const cvData: CVData = useMemo(() => {
    // Split title into title/subtitle
    const titleParts = (data.title || 'Din Titel').split(' ');
    const mainTitle = titleParts[0] || data.title || 'Din';
    const subtitle = titleParts.slice(1).join(' ') || 'Titel';

    // Extract technical skills
    const technicalSkills = data.skills?.flatMap(s => s.skills).slice(0, 7) || [];

    // Convert languages
    const languages = data.languages?.map(l => ({
      name: l.name,
      level: l.level,
    })) || [{ name: 'Svenska', level: 'modersmål' }];

    // Convert education (first one)
    const firstEdu = data.education?.[0];
    const education = firstEdu?.institution ? {
      title: firstEdu.degree || 'Examen',
      institution: firstEdu.institution,
      period: `${firstEdu.startDate || '2020'}–${firstEdu.current ? 'Nu' : firstEdu.endDate || '2024'}`,
      bullets: [firstEdu.field].filter(Boolean),
    } : undefined;

    // Convert projects
    const projects = data.projects?.slice(0, 2).map(p => ({
      name: p.name,
      url: p.url,
      bullets: [p.description].filter(Boolean),
    })) || [];

    // Convert experience
    const experience = data.experience?.filter(e => e.company || e.title).slice(0, 4).map(exp => ({
      title: exp.title || 'Position',
      company: exp.company || 'Företag',
      bullets: exp.achievements?.slice(0, 2) || [exp.description].filter(Boolean),
    })) || [];

    // Build tagline from skills categories
    const tagline = data.skills?.slice(0, 3).map(s => s.name.toUpperCase()).join(' · ') || 'KOMPETENS · ERFARENHET · UTVECKLING';

    return {
      fullName: data.fullName || 'Ditt Namn',
      title: mainTitle.toUpperCase(),
      subtitle: subtitle.toUpperCase(),
      tagline: tagline,
      photoUrl: undefined,
      seeking: undefined,
      contact: {
        phone: data.phone,
        email: data.email || 'din@email.se',
        linkedin: data.linkedin,
        github: data.github,
        location: data.location,
      },
      portfolioUrl: data.website,
      technicalSkills: technicalSkills,
      leadershipSkills: [],
      languages: languages,
      references: [],
      other: [],
      profile: data.summary || '',
      education: education,
      projects: projects,
      experience: experience,
    };
  }, [data]);

  // Generate HTML using the real renderer
  const html = useMemo(() => {
    return renderCVV2(cvData, templateId, { showPhoto: false, pageSize: 'a4' });
  }, [cvData, templateId]);

  // Create a data URL for the iframe
  const iframeSrc = useMemo(() => {
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [html]);

  // Find template to check if dark
  const template = CV_TEMPLATES_V2.find(t => t.id === templateId) || CV_TEMPLATES_V2[0];
  const isDark = template.sidebarBg.toLowerCase().startsWith('#0') ||
    template.sidebarBg.toLowerCase().startsWith('#1');

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden shadow-2xl',
        isDark ? 'border border-gray-700' : 'border border-gray-200',
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
      }}
    >
      <iframe
        src={iframeSrc}
        className="w-[794px] h-[1123px] border-0"
        title="CV Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
// ============ PORTFOLIO PREVIEW V2 - Uses actual renderPortfolioV2 ============

interface PortfolioPreviewV2Props {
  templateId: string;
  data: {
    fullName?: string;
    title?: string;
    tagline?: string;
    bio?: string;
    location?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    skills?: string[];
    projects?: {
      name: string;
      description: string;
      tags: string[];
      url?: string;
      image?: string;
    }[];
    experience?: {
      title: string;
      company: string;
      period: string;
      description?: string;
      current?: boolean;
    }[];
    education?: {
      degree: string;
      institution: string;
      period: string;
    }[];
    seeking?: {
      active: boolean;
      title: string;
      period?: string;
      description?: string;
    };
    highlights?: string[];
  };
  className?: string;
  scale?: number;
}

export function PortfolioPreviewV2({ templateId, data, className, scale = 0.35 }: PortfolioPreviewV2Props) {
  // Convert editor data to PortfolioDataV2 format
  const portfolioData: PortfolioDataV2 = useMemo(() => {
    const nameParts = (data.fullName || 'Ditt Namn').split(' ');
    const firstName = nameParts[0] || 'Ditt';
    const lastName = nameParts.slice(1).join(' ') || 'Namn';

    // Convert projects
    const projects = (data.projects || []).slice(0, 5).map(p => ({
      tag: p.tags?.[0] || 'Projekt',
      badge: undefined,
      name: p.name,
      description: p.description,
      techStack: p.tags || [],
      link: {
        url: p.url || '#',
        label: 'Se projekt',
      },
      previewImageUrl: p.image,
    }));

    // Convert experience to timeline cards
    const timelineCards = (data.experience || []).slice(0, 5).map((exp, i) => ({
      period: exp.period || '2024',
      title: exp.title || 'Position',
      subtitle: exp.company || 'Företag',
      description: exp.description || '',
      highlights: exp.description ? [exp.description] : [],
      projectNote: undefined,
      badges: undefined,
      isCurrent: exp.current || i === 0,
    }));

    // Meta items
    const metaItems: { label: string; value: string }[] = [];
    if (data.location) metaItems.push({ label: 'Plats', value: data.location });
    if (data.email) metaItems.push({ label: 'Email', value: data.email });

    // Stats from highlights or defaults
    const stats = (data.highlights || []).slice(0, 4).map((h, i) => ({
      number: `${i + 1}`,
      label: h,
    }));
    if (stats.length === 0) {
      stats.push(
        { number: '5+', label: 'Projekt' },
        { number: '3+', label: 'År erfarenhet' }
      );
    }

    // Tech stack - needs tier, iconUrl, tooltip
    const techStack = (data.skills || []).map(skill => ({
      name: skill,
      tier: 'primary',
      iconUrl: '',
      tooltip: skill,
    }));

    return {
      language: 'sv' as const,
      fullName: data.fullName || 'Ditt Namn',
      firstName,
      lastName,
      title: data.title || 'Din Titel',
      tagline: data.tagline || '',
      profileImageUrl: undefined,
      cvUrl: undefined,
      metaItems,
      about: {
        paragraphs: data.bio ? [{ highlight: '', text: data.bio }] : [],
        badge: undefined,
      },
      stats,
      seeking: data.seeking?.active ? {
        active: true,
        title: data.seeking.title || 'Söker nya möjligheter',
        description: data.seeking.description || '',
        details: data.seeking.period ? [{ label: 'Period', value: data.seeking.period }] : [],
        bgText: 'ÖPPEN',
      } : undefined,
      projects,
      timeline: {
        intro: 'Min resa',
        currentPosition: 0,
        markers: timelineCards.map(c => ({ date: c.period })),
        cards: timelineCards,
      },
      techStack,
      contact: {
        title: 'Kontakt',
        subtitle: 'Hör av dig!',
        links: [
          ...(data.email ? [{ label: data.email, url: `mailto:${data.email}`, type: 'email' as const }] : []),
          ...(data.linkedin ? [{ label: 'LinkedIn', url: data.linkedin, type: 'linkedin' as const }] : []),
          ...(data.github ? [{ label: 'GitHub', url: data.github, type: 'github' as const }] : []),
          ...(data.website ? [{ label: 'Webb', url: data.website, type: 'other' as const }] : []),
        ],
      },
      footer: {
        copyright: `© ${new Date().getFullYear()} ${data.fullName || 'Portfolyo'}`,
        location: data.location || 'Sverige',
      },
    };
  }, [data]);

  // Generate HTML using the real renderer with preview mode
  const html = useMemo(() => {
    return renderPortfolioV2(portfolioData, templateId, { previewMode: true });
  }, [portfolioData, templateId]);

  // Create a data URL for the iframe
  const iframeSrc = useMemo(() => {
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [html]);

  // Find template to check if dark
  const template = PORTFOLIO_TEMPLATES_V2.find(t => t.id === templateId) || PORTFOLIO_TEMPLATES_V2[0];
  const isDark = template.bgPrimary.toLowerCase().startsWith('#0') ||
                 template.bgPrimary.toLowerCase().startsWith('#1');

  return (
    <div 
      className={cn(
        'rounded-xl overflow-hidden shadow-2xl',
        isDark ? 'border border-gray-700' : 'border border-gray-200',
        className
      )}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      <iframe
        src={iframeSrc}
        className="w-[1400px] h-[900px] border-0"
        title="Portfolio Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}