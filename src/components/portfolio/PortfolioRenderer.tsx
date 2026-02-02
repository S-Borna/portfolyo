'use client';

// ============================================
// PORTFOLYO.SE - Enterprise Portfolio Renderer
// Renders portfolios with full template support,
// advanced effects, and premium visual quality
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  getTemplateById,
  type TemplateConfig,
  colorSchemes,
  animations,
  hoverEffects,
} from '@/lib/templates';
import { Icons } from '@/components/ui';

const {
  MapPin, Mail, Phone, Globe, Github, Linkedin, ExternalLink,
  Briefcase, GraduationCap, Code, Sparkles, Calendar, ChevronRight,
  Download, Star, Zap, Award, TrendingUp, Users, Clock, ArrowRight,
  Play, Pause, Volume2, VolumeX, Menu, X, Send, Heart, Eye,
} = Icons;

// ============================================
// TYPES
// ============================================

export interface PortfolioData {
  username: string;
  templateId: string;
  profile: {
    fullName: string;
    title: string;
    tagline?: string;
    bio?: string;
    location?: string;
    avatar?: string;
  };
  lia?: {
    seeking: boolean;
    period?: string;
    location?: string;
    interests?: string[];
  };
  highlights?: {
    icon: string;
    value: string;
    label: string;
  }[];
  techStack?: {
    name: string;
    icon?: string;
    category?: string;
  }[];
  projects?: {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    image?: string;
    tags: string[];
    links: { live?: string; github?: string };
    badge?: string;
    featured?: boolean;
  }[];
  timeline?: {
    id: string;
    title: string;
    subtitle: string;
    period: string;
    description?: string;
    achievements?: string[];
    tags?: string[];
    current?: boolean;
    type?: string;
  }[];
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
}

interface PortfolioRendererProps {
  data: PortfolioData;
  isPreview?: boolean;
}

// ============================================
// FLOATING ORBS BACKGROUND
// ============================================

function FloatingOrbs({ accentColor, accentGlow }: { accentColor: string; accentGlow: string }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - top right */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
          top: '-200px',
          right: '-100px',
        }}
        animate={{
          x: [0, 50, -30, -50, 0],
          y: [0, -30, 50, -20, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb - bottom left */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
          bottom: '-100px',
          left: '-100px',
        }}
        animate={{
          x: [0, -30, 50, -20, 0],
          y: [0, 50, -30, 20, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: -7,
        }}
      />

      {/* Tertiary orb - center */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-[60px]"
        style={{
          background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
          top: '50%',
          left: '30%',
        }}
        animate={{
          x: [0, 80, -60, 40, 0],
          y: [0, -60, 40, -40, 0],
          scale: [0.8, 1, 0.85, 1.1, 0.8],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: -14,
        }}
      />
    </div>
  );
}

// ============================================
// NOISE TEXTURE OVERLAY
// ============================================

function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ============================================
// GRID PATTERN BACKGROUND
// ============================================

function GridPattern({ color }: { color: string }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-10"
      style={{
        backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }}
    />
  );
}

// ============================================
// PARTICLES BACKGROUND
// ============================================

function ParticlesBackground({ accentColor }: { accentColor: string }) {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            background: accentColor,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

function ScrollProgress({ accentColor }: { accentColor: string }) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
      style={{
        scaleX: scrollYProgress,
        backgroundColor: accentColor,
      }}
    />
  );
}

// ============================================
// CURSOR FOLLOWER
// ============================================

function CursorFollower({ accentColor }: { accentColor: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        backgroundColor: accentColor,
        x: mousePos.x - 16,
        y: mousePos.y - 16,
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 0.3,
      }}
    />
  );
}

// ============================================
// NAVIGATION
// ============================================

interface NavProps {
  username: string;
  fullName: string;
  bgPrimary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  hasTimeline: boolean;
  hasProjects: boolean;
  hasTechStack: boolean;
  isSticky?: boolean;
}

function Navigation({
  username,
  fullName,
  bgPrimary,
  textPrimary,
  textSecondary,
  accent,
  hasTimeline,
  hasProjects,
  hasTechStack,
  isSticky = true,
}: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'Om mig', show: true },
    { href: '#timeline', label: 'Timeline', show: hasTimeline },
    { href: '#projects', label: 'Projekt', show: hasProjects },
    { href: '#stack', label: 'Tech Stack', show: hasTechStack },
    { href: '#contact', label: 'Kontakt', show: true },
  ].filter(link => link.show);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky ? (scrolled ? 'backdrop-blur-xl' : '') : ''
      }`}
      style={{
        backgroundColor: scrolled ? `${bgPrimary}e6` : 'transparent',
        borderBottom: scrolled ? `1px solid ${textSecondary}20` : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href={`/p/${username}`} className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
              color: bgPrimary,
            }}
          >
            {fullName.charAt(0)}
          </div>
          <span
            className="font-bold text-lg tracking-tight hidden sm:block"
            style={{ color: textPrimary }}
          >
            {username.toUpperCase()}
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:opacity-100"
              style={{
                color: textSecondary,
                opacity: 0.8,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = accent}
              onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg"
          style={{ color: textPrimary }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: bgPrimary }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 rounded-lg text-sm font-medium"
                  style={{
                    color: textSecondary,
                    backgroundColor: `${accent}10`,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============================================
// HERO SECTION
// ============================================

interface HeroProps {
  profile: PortfolioData['profile'];
  lia?: PortfolioData['lia'];
  highlights?: PortfolioData['highlights'];
  contact: PortfolioData['contact'];
  template: TemplateConfig;
}

function HeroSection({ profile, lia, highlights, contact, template }: HeroProps) {
  const { colorScheme, typography, layout, animations: templateAnimations } = template;
  const { fullName, title, tagline, bio, location, avatar } = profile;

  const isDark = colorScheme.bgPrimary.includes('#0') ||
                 colorScheme.bgPrimary.includes('#1') ||
                 colorScheme.bgPrimary.includes('linear-gradient');

  // Split name for styling
  const nameParts = fullName.toUpperCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <header className="relative pt-24 pb-20 overflow-hidden min-h-[80vh] flex items-center">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${colorScheme.bgPrimary} 0%, ${colorScheme.bgSecondary} 100%)`
            : `linear-gradient(135deg, ${colorScheme.bgPrimary} 0%, ${colorScheme.accent}08 100%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Pre-title label */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="h-px w-12"
              style={{ backgroundColor: colorScheme.accent }}
            />
            <span
              className="text-sm uppercase tracking-[0.2em] font-medium"
              style={{ color: colorScheme.textSecondary }}
            >
              {title}
            </span>
          </motion.div>

          {/* Main heading */}
          <h1
            className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight mb-6"
            style={{
              fontFamily: typography.headingFont,
              fontWeight: typography.headingWeight,
              letterSpacing: typography.headingLetterSpacing,
            }}
          >
            {typography.useOutlineText ? (
              <>
                <span
                  style={{
                    WebkitTextStroke: `2px ${colorScheme.textPrimary}`,
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {firstName}
                </span>
                <span style={{ color: colorScheme.accent }}>{lastName}</span>
              </>
            ) : (
              <>
                <span style={{ color: colorScheme.textPrimary }}>{firstName}</span>
                <span style={{ color: colorScheme.accent }}>{lastName}</span>
              </>
            )}
          </h1>

          {/* Tagline */}
          {tagline && (
            <motion.p
              className="text-xl sm:text-2xl mb-8 max-w-2xl"
              style={{
                color: colorScheme.textSecondary,
                fontFamily: typography.bodyFont,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {tagline}
            </motion.p>
          )}

          {/* LIA Banner */}
          {lia?.seeking && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-4 rounded-2xl p-5 mb-10"
              style={{
                backgroundColor: `${colorScheme.accent}15`,
                border: `1px solid ${colorScheme.accent}40`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: colorScheme.accent }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: colorScheme.accent }}
                  />
                </span>
                <span
                  className="font-semibold"
                  style={{ color: colorScheme.accent }}
                >
                  Söker LIA-plats
                </span>
              </div>
              <div
                className="h-6 w-px"
                style={{ backgroundColor: colorScheme.textMuted }}
              />
              <div className="text-sm" style={{ color: colorScheme.textSecondary }}>
                {lia.period && (
                  <span className="mr-4">
                    <span style={{ color: colorScheme.textMuted }}>PERIOD </span>
                    {lia.period}
                  </span>
                )}
                {lia.location && (
                  <span className="mr-4">
                    <span style={{ color: colorScheme.textMuted }}>PLATS </span>
                    {lia.location}
                  </span>
                )}
                {lia.interests && lia.interests.length > 0 && (
                  <span>
                    <span style={{ color: colorScheme.textMuted }}>INTRESSE </span>
                    {lia.interests.join(' · ')}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Content grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mt-8">
            {/* Left: Avatar + Contact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Avatar */}
              {avatar ? (
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-48 h-48 rounded-2xl object-cover mb-6"
                  style={{
                    border: `3px solid ${colorScheme.textMuted}30`,
                    boxShadow: `0 25px 60px ${colorScheme.accent}20`,
                  }}
                />
              ) : (
                <div
                  className="w-48 h-48 rounded-2xl flex items-center justify-center text-6xl font-bold mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.accent}, ${colorScheme.accent}80)`,
                    color: colorScheme.bgPrimary,
                    boxShadow: `0 25px 60px ${colorScheme.accent}30`,
                  }}
                >
                  {fullName.charAt(0)}
                </div>
              )}

              {/* Location */}
              {location && (
                <div
                  className="flex items-center gap-2 mb-6 text-sm"
                  style={{ color: colorScheme.textSecondary }}
                >
                  <MapPin className="h-4 w-4" style={{ color: colorScheme.accent }} />
                  {location}
                </div>
              )}

              {/* Contact links */}
              <div className="flex flex-wrap gap-3">
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${colorScheme.textMuted}20`,
                      color: colorScheme.textPrimary,
                    }}
                  >
                    <Linkedin className="h-4 w-4" style={{ color: colorScheme.accent }} />
                    LinkedIn
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${colorScheme.textMuted}20`,
                      color: colorScheme.textPrimary,
                    }}
                  >
                    <Github className="h-4 w-4" style={{ color: colorScheme.accent }} />
                    GitHub
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${colorScheme.textMuted}20`,
                      color: colorScheme.textPrimary,
                    }}
                  >
                    <Mail className="h-4 w-4" style={{ color: colorScheme.accent }} />
                    Email
                  </a>
                )}
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${colorScheme.textMuted}20`,
                      color: colorScheme.textPrimary,
                    }}
                  >
                    <Globe className="h-4 w-4" style={{ color: colorScheme.accent }} />
                    Hemsida
                  </a>
                )}
              </div>
            </motion.div>

            {/* Right: Highlights */}
            {highlights && highlights.length > 0 && (
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                {highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="rounded-2xl p-6 text-center transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${colorScheme.bgCard || colorScheme.bgSecondary}`,
                      border: `1px solid ${colorScheme.textMuted}30`,
                    }}
                  >
                    <div
                      className="text-4xl font-bold mb-1"
                      style={{
                        color: colorScheme.accent,
                        fontFamily: typography.headingFont,
                      }}
                    >
                      {h.value}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: colorScheme.textMuted }}
                    >
                      {h.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}

// ============================================
// ABOUT SECTION
// ============================================

interface AboutProps {
  profile: PortfolioData['profile'];
  template: TemplateConfig;
}

function AboutSection({ profile, template }: AboutProps) {
  const { colorScheme, typography } = template;

  if (!profile.bio) return null;

  return (
    <section
      id="about"
      className="py-24"
      style={{
        borderTop: `1px solid ${colorScheme.textMuted}20`,
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section label */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: colorScheme.textMuted }}
            >
              {profile.fullName.toUpperCase()}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: colorScheme.textMuted + '30' }}
            />
          </div>

          {/* Title */}
          <h2
            className="text-4xl font-bold mb-8"
            style={{
              color: colorScheme.accent,
              fontFamily: typography.headingFont,
            }}
          >
            OM MIG
          </h2>

          {/* Bio */}
          <div
            className="prose prose-lg max-w-none"
            style={{
              color: colorScheme.textSecondary,
              fontFamily: typography.bodyFont,
            }}
          >
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TIMELINE SECTION
// ============================================

interface TimelineProps {
  timeline: PortfolioData['timeline'];
  profile: PortfolioData['profile'];
  template: TemplateConfig;
}

function TimelineSection({ timeline, profile, template }: TimelineProps) {
  const { colorScheme, typography } = template;

  if (!timeline || timeline.length === 0) return null;

  return (
    <section
      id="timeline"
      className="py-24"
      style={{
        borderTop: `1px solid ${colorScheme.textMuted}20`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: colorScheme.textMuted }}
            >
              {profile.fullName.toUpperCase()}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: colorScheme.textMuted + '30' }}
            />
          </div>

          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: colorScheme.accent,
              fontFamily: typography.headingFont,
            }}
          >
            RESAN
          </h2>

          <p
            className="mb-12 max-w-2xl"
            style={{ color: colorScheme.textSecondary }}
          >
            Min professionella och akademiska resa med konkreta resultat och lärdomar.
          </p>

          {/* Timeline items */}
          <div className="space-y-8">
            {timeline.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex gap-6">
                  {/* Timeline dot & line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                      style={{
                        backgroundColor: entry.current ? colorScheme.accent : colorScheme.bgPrimary,
                        borderColor: colorScheme.accent,
                      }}
                    />
                    {i < timeline.length - 1 && (
                      <div
                        className="w-0.5 flex-1 mt-2"
                        style={{ backgroundColor: colorScheme.textMuted + '30' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs uppercase tracking-wider"
                        style={{ color: colorScheme.textMuted }}
                      >
                        {entry.period}
                      </span>
                      {entry.current && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: colorScheme.accent + '20',
                            color: colorScheme.accent,
                          }}
                        >
                          Pågående
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ color: colorScheme.textPrimary }}
                    >
                      {entry.title}
                    </h3>

                    <p
                      className="mb-3"
                      style={{ color: colorScheme.accent }}
                    >
                      {entry.subtitle}
                    </p>

                    {entry.description && (
                      <p
                        className="mb-4"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        {entry.description}
                      </p>
                    )}

                    {entry.achievements && entry.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {entry.achievements.map((a, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm"
                            style={{ color: colorScheme.textSecondary }}
                          >
                            <ArrowRight
                              className="h-4 w-4 mt-0.5 flex-shrink-0"
                              style={{ color: colorScheme.accent }}
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-lg text-xs"
                            style={{
                              backgroundColor: colorScheme.bgCard || colorScheme.textMuted + '20',
                              color: colorScheme.textSecondary,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// PROJECTS SECTION
// ============================================

interface ProjectsProps {
  projects: PortfolioData['projects'];
  profile: PortfolioData['profile'];
  template: TemplateConfig;
}

function ProjectsSection({ projects, profile, template }: ProjectsProps) {
  const { colorScheme, typography, animations: templateAnimations } = template;

  if (!projects || projects.length === 0) return null;

  return (
    <section
      id="projects"
      className="py-24"
      style={{
        borderTop: `1px solid ${colorScheme.textMuted}20`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: colorScheme.textMuted }}
            >
              {profile.fullName.toUpperCase()}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: colorScheme.textMuted + '30' }}
            />
          </div>

          <h2
            className="text-4xl font-bold mb-12"
            style={{
              color: colorScheme.accent,
              fontFamily: typography.headingFont,
            }}
          >
            PROJEKT
          </h2>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  backgroundColor: colorScheme.bgCard || colorScheme.bgSecondary,
                  border: `1px solid ${colorScheme.textMuted}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.accent + '60';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${colorScheme.accent}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.textMuted + '30';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Project image */}
                {project.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Badge */}
                  {project.badge && (
                    <span
                      className="text-xs uppercase tracking-wider mb-3 block"
                      style={{ color: colorScheme.accent }}
                    >
                      {project.badge}
                    </span>
                  )}

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-3 transition-colors"
                    style={{ color: colorScheme.textPrimary }}
                  >
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm mb-4"
                    style={{ color: colorScheme.textSecondary }}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg text-xs"
                        style={{
                          backgroundColor: colorScheme.accent + '15',
                          color: colorScheme.accent,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: colorScheme.accent }}
                      >
                        Besök sajt
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm transition-colors"
                        style={{ color: colorScheme.textSecondary }}
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// TECH STACK SECTION
// ============================================

interface TechStackProps {
  techStack: PortfolioData['techStack'];
  profile: PortfolioData['profile'];
  template: TemplateConfig;
}

function TechStackSection({ techStack, profile, template }: TechStackProps) {
  const { colorScheme, typography } = template;

  if (!techStack || techStack.length === 0) return null;

  return (
    <section
      id="stack"
      className="py-24"
      style={{
        borderTop: `1px solid ${colorScheme.textMuted}20`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: colorScheme.textMuted }}
            >
              {profile.fullName.toUpperCase()}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: colorScheme.textMuted + '30' }}
            />
          </div>

          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: colorScheme.accent,
              fontFamily: typography.headingFont,
            }}
          >
            TEKNISK KOMPETENS
          </h2>

          <p
            className="mb-12 max-w-2xl"
            style={{ color: colorScheme.textSecondary }}
          >
            Verktyg och teknologier jag arbetat med under utbildning och egna projekt.
          </p>

          {/* Tech grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all cursor-pointer"
                style={{
                  backgroundColor: colorScheme.bgCard || colorScheme.textMuted + '10',
                  border: `1px solid ${colorScheme.textMuted}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.accent + '60';
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 15px 30px ${colorScheme.accent}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.textMuted + '20';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {tech.icon ? (
                  <img
                    src={`https://cdn.simpleicons.org/${tech.icon}`}
                    alt={tech.name}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Code
                    className="w-8 h-8"
                    style={{ color: colorScheme.accent }}
                  />
                )}
                <span
                  className="text-xs text-center font-medium"
                  style={{ color: colorScheme.textSecondary }}
                >
                  {tech.name}
                </span>
                {tech.category && (
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: colorScheme.textMuted }}
                  >
                    {tech.category}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT SECTION
// ============================================

interface ContactProps {
  contact: PortfolioData['contact'];
  profile: PortfolioData['profile'];
  lia?: PortfolioData['lia'];
  template: TemplateConfig;
}

function ContactSection({ contact, profile, lia, template }: ContactProps) {
  const { colorScheme, typography } = template;

  return (
    <section
      id="contact"
      className="py-24"
      style={{
        borderTop: `1px solid ${colorScheme.textMuted}20`,
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: colorScheme.textMuted }}
            >
              {profile.fullName.toUpperCase()}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: colorScheme.textMuted + '30' }}
            />
          </div>

          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: colorScheme.accent,
              fontFamily: typography.headingFont,
            }}
          >
            LÅT OSS PRATA
          </h2>

          <p
            className="mb-10"
            style={{ color: colorScheme.textSecondary }}
          >
            {lia?.seeking
              ? 'Hör av dig om LIA eller samarbete. Jag svarar inom 24 timmar.'
              : 'Intresserad av att samarbeta? Hör av dig!'}
          </p>

          {/* Contact grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-4 p-5 rounded-2xl transition-all"
                style={{
                  backgroundColor: colorScheme.bgCard || colorScheme.textMuted + '10',
                  border: `1px solid ${colorScheme.textMuted}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.accent + '60';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.textMuted + '20';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Mail className="h-5 w-5" style={{ color: colorScheme.accent }} />
                <span style={{ color: colorScheme.textPrimary }}>{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-4 p-5 rounded-2xl transition-all"
                style={{
                  backgroundColor: colorScheme.bgCard || colorScheme.textMuted + '10',
                  border: `1px solid ${colorScheme.textMuted}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.accent + '60';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.textMuted + '20';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Phone className="h-5 w-5" style={{ color: colorScheme.accent }} />
                <span style={{ color: colorScheme.textPrimary }}>{contact.phone}</span>
              </a>
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl transition-all"
                style={{
                  backgroundColor: colorScheme.bgCard || colorScheme.textMuted + '10',
                  border: `1px solid ${colorScheme.textMuted}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.accent + '60';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.textMuted + '20';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Linkedin className="h-5 w-5" style={{ color: colorScheme.accent }} />
                <span style={{ color: colorScheme.textPrimary }}>LinkedIn</span>
              </a>
            )}
            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl transition-all"
                style={{
                  backgroundColor: colorScheme.bgCard || colorScheme.textMuted + '10',
                  border: `1px solid ${colorScheme.textMuted}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.accent + '60';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorScheme.textMuted + '20';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Github className="h-5 w-5" style={{ color: colorScheme.accent }} />
                <span style={{ color: colorScheme.textPrimary }}>GitHub</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================

interface FooterProps {
  profile: PortfolioData['profile'];
  template: TemplateConfig;
}

function Footer({ profile, template }: FooterProps) {
  const { colorScheme } = template;

  return (
    <footer
      className="py-8"
      style={{
        borderTop: `1px solid ${colorScheme.textMuted}20`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-sm"
          style={{ color: colorScheme.textMuted }}
        >
          © {new Date().getFullYear()} {profile.fullName}
        </p>
        <a
          href="https://portfolyo.se"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: colorScheme.textMuted }}
          onMouseEnter={(e) => e.currentTarget.style.color = colorScheme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = colorScheme.textMuted}
        >
          Skapad med
          <span
            className="font-semibold"
            style={{ color: colorScheme.accent }}
          >
            PORTFOLYO
          </span>
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}

// ============================================
// CTA BUTTON (Fixed)
// ============================================

interface CTAButtonProps {
  contact: PortfolioData['contact'];
  template: TemplateConfig;
}

function CTAButton({ contact, template }: CTAButtonProps) {
  const { colorScheme } = template;

  if (!contact.email) return null;

  return (
    <motion.a
      href={`mailto:${contact.email}`}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex flex-col items-center justify-center z-50 transition-all"
      style={{
        backgroundColor: colorScheme.accent,
        color: colorScheme.bgPrimary,
        boxShadow: `0 10px 40px ${colorScheme.accentGlow}`,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <Send className="h-5 w-5" />
      <span className="text-[8px] font-bold uppercase mt-1">Kontakt</span>
    </motion.a>
  );
}

// ============================================
// MAIN PORTFOLIO RENDERER
// ============================================

export function PortfolioRenderer({ data, isPreview = false }: PortfolioRendererProps) {
  // Get template configuration
  const template = getTemplateById(data.templateId);

  // Fallback to default template if not found
  const activeTemplate: TemplateConfig = template || {
    id: 'dev-crimson-bold',
    name: 'DevOps Crimson',
    description: 'Default template',
    category: 'developer',
    colorScheme: colorSchemes.crimson,
    typography: {
      id: 'modern',
      name: 'Modern Bold',
      headingFont: "'Bebas Neue', sans-serif",
      bodyFont: "'Space Grotesk', sans-serif",
      headingWeight: '400',
      headingLetterSpacing: '-2px',
      useOutlineText: true,
    },
    layout: {
      id: 'splitHero',
      name: 'Split Hero',
      heroLayout: 'grid',
      heroColumns: '1fr 1fr',
      imagePosition: 'right',
      imageShape: 'circle',
      contentAlignment: 'left',
    },
    backgroundPattern: { id: 'noise', name: 'Noise', css: '' },
    animations: {
      background: animations.floatingOrbs,
      entrance: animations.fadeInUp,
      hover: hoverEffects.lift,
    },
    features: ['floatingOrbs', 'noiseTexture', 'stickyNav'],
    preview: '',
    popularity: 100,
    tags: [],
  };

  // Apply custom theme colors if provided
  if (data.theme?.primaryColor) {
    activeTemplate.colorScheme = {
      ...activeTemplate.colorScheme,
      accent: data.theme.primaryColor,
      accentGlow: `${data.theme.primaryColor}40`,
    };
  }

  const { colorScheme, features } = activeTemplate;

  // Check which features are enabled
  const hasFloatingOrbs = features.includes('floatingOrbs');
  const hasNoiseTexture = features.includes('noiseTexture');
  const hasParticles = features.includes('particlesBg');
  const hasGridBg = features.includes('gradientBg') || activeTemplate.backgroundPattern.id === 'grid';
  const hasStickyNav = features.includes('stickyNav');
  const hasScrollProgress = features.includes('scrollProgress');
  const hasCursorFollower = features.includes('cursorFollower');

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: colorScheme.bgPrimary,
        color: colorScheme.textPrimary,
        fontFamily: activeTemplate.typography.bodyFont,
      }}
    >
      {/* Background effects */}
      {hasFloatingOrbs && (
        <FloatingOrbs
          accentColor={colorScheme.accent}
          accentGlow={colorScheme.accentGlow}
        />
      )}
      {hasNoiseTexture && <NoiseOverlay />}
      {hasParticles && <ParticlesBackground accentColor={colorScheme.accent} />}
      {hasGridBg && <GridPattern color={colorScheme.accent} />}

      {/* UI overlays */}
      {hasScrollProgress && <ScrollProgress accentColor={colorScheme.accent} />}
      {hasCursorFollower && !isPreview && <CursorFollower accentColor={colorScheme.accent} />}

      {/* Navigation */}
      <Navigation
        username={data.username}
        fullName={data.profile.fullName}
        bgPrimary={colorScheme.bgPrimary}
        textPrimary={colorScheme.textPrimary}
        textSecondary={colorScheme.textSecondary}
        accent={colorScheme.accent}
        hasTimeline={!!data.timeline?.length}
        hasProjects={!!data.projects?.length}
        hasTechStack={!!data.techStack?.length}
        isSticky={hasStickyNav}
      />

      {/* Main content */}
      <main className="relative z-10">
        <HeroSection
          profile={data.profile}
          lia={data.lia}
          highlights={data.highlights}
          contact={data.contact}
          template={activeTemplate}
        />

        <AboutSection
          profile={data.profile}
          template={activeTemplate}
        />

        <TimelineSection
          timeline={data.timeline}
          profile={data.profile}
          template={activeTemplate}
        />

        <ProjectsSection
          projects={data.projects}
          profile={data.profile}
          template={activeTemplate}
        />

        <TechStackSection
          techStack={data.techStack}
          profile={data.profile}
          template={activeTemplate}
        />

        <ContactSection
          contact={data.contact}
          profile={data.profile}
          lia={data.lia}
          template={activeTemplate}
        />

        <Footer
          profile={data.profile}
          template={activeTemplate}
        />
      </main>

      {/* CTA Button */}
      {!isPreview && (
        <CTAButton
          contact={data.contact}
          template={activeTemplate}
        />
      )}
    </div>
  );
}

export default PortfolioRenderer;
