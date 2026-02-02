'use client';

// ============================================
// PORTFOLYO.SE - Live Preview System
// Real-time preview with template rendering
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  getTemplateById,
  type TemplateConfig,
  getCVTemplateById,
  type CVTemplateDefinition
} from '@/lib/templates';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react';

// ============================================
// DEVICE PREVIEW FRAMES
// ============================================

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceSizes: Record<DeviceType, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
  scale: number;
}

function DeviceFrame({ device, children, scale }: DeviceFrameProps) {
  const size = deviceSizes[device];

  if (device === 'desktop') {
    return (
      <div
        className="relative"
        style={{
          width: size.width * scale,
          height: size.height * scale,
        }}
      >
        {/* Monitor frame */}
        <div className="absolute inset-0 bg-gray-900 rounded-2xl p-1">
          {/* Screen bezel */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700" />
          <div className="h-full pt-4 pb-6">
            <div className="h-full bg-white rounded-lg overflow-hidden">
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: size.width,
                  height: size.height,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
        {/* Stand */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-800 rounded-b-lg" />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-2 bg-gray-700 rounded-full" />
      </div>
    );
  }

  if (device === 'tablet') {
    return (
      <div
        className="relative bg-gray-900 rounded-[2rem] p-3"
        style={{
          width: size.width * scale + 24,
          height: size.height * scale + 24,
        }}
      >
        {/* Camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700" />
        <div className="h-full bg-white rounded-2xl overflow-hidden">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: size.width,
              height: size.height,
            }}
          >
            {children}
          </div>
        </div>
        {/* Home button */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gray-700" />
      </div>
    );
  }

  // Mobile
  return (
    <div
      className="relative bg-gray-900 rounded-[2.5rem] p-2"
      style={{
        width: size.width * scale + 16,
        height: size.height * scale + 16,
      }}
    >
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />
      <div className="h-full bg-white rounded-[2rem] overflow-hidden">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: size.width,
            height: size.height,
          }}
        >
          {children}
        </div>
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gray-600" />
    </div>
  );
}

// ============================================
// PORTFOLIO LIVE PREVIEW
// ============================================

interface PortfolioLivePreviewProps {
  templateId: string;
  data: {
    fullName?: string;
    title?: string;
    tagline?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    skills?: string[];
    projects?: { name: string; description: string; tags: string[]; image?: string }[];
    experience?: { title: string; company: string; period: string; current?: boolean }[];
    education?: { degree: string; institution: string; period: string }[];
    seeking?: string;
  };
  showDeviceFrame?: boolean;
  initialDevice?: DeviceType;
  className?: string;
  onExport?: () => void;
  onShare?: () => void;
}

export function PortfolioLivePreview({
  templateId,
  data,
  showDeviceFrame = true,
  initialDevice = 'desktop',
  className,
  onExport,
  onShare,
}: PortfolioLivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>(initialDevice);
  const [scale, setScale] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const template = getTemplateById(templateId);
  const colors = template?.colorScheme || {
    primary: '#8b5cf6',
    secondary: '#1e1b4b',
    accent: '#c084fc',
    background: '#0f0a1f',
    foreground: '#ffffff',
    muted: '#a78bfa',
  };

  const isDark = colors.background.startsWith('#0') || colors.background.startsWith('#1');

  // Auto-adjust scale based on container size
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const deviceSize = deviceSizes[device];
      const scaleX = (width - 80) / deviceSize.width;
      const scaleY = (height - 80) / deviceSize.height;
      setScale(Math.min(scaleX, scaleY, 0.8));
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [device]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          {/* Device switcher */}
          <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-1 shadow-sm">
            {([
              { type: 'desktop' as const, icon: Monitor, label: 'Desktop' },
              { type: 'tablet' as const, icon: Tablet, label: 'Tablet' },
              { type: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
            ]).map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setDevice(type)}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  device === type
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setScale(s => Math.max(0.25, s - 0.1))}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Zoom ut"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-500 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(1, s + 0.1))}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setScale(0.5)}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Återställ zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportera
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Dela
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            title={isFullscreen ? 'Avsluta helskärm' : 'Helskärm'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-auto flex items-center justify-center p-8',
          'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800',
          'bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)]',
          '[background-size:20px_20px]'
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {showDeviceFrame ? (
              <DeviceFrame device={device} scale={scale}>
                <PortfolioContent template={template} data={data} isDark={isDark} colors={colors} />
              </DeviceFrame>
            ) : (
              <div
                className="rounded-xl overflow-hidden shadow-2xl"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                  width: deviceSizes[device].width,
                  height: deviceSizes[device].height,
                }}
              >
                <PortfolioContent template={template} data={data} isDark={isDark} colors={colors} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Portfolio content renderer
function PortfolioContent({
  template,
  data,
  isDark,
  colors
}: {
  template: TemplateConfig | undefined;
  data: PortfolioLivePreviewProps['data'];
  isDark: boolean;
  colors: any;
}) {
  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: template?.typography?.bodyFont || 'Inter, sans-serif',
      }}
    >
      {/* Hero Section */}
      <header className="relative px-12 py-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          {template?.effects?.floatingOrbs && (
            <>
              <div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse"
                style={{
                  background: colors.primary,
                  top: '10%',
                  left: '10%',
                }}
              />
              <div
                className="absolute w-48 h-48 rounded-full blur-3xl opacity-20 animate-pulse"
                style={{
                  background: colors.accent,
                  top: '50%',
                  right: '10%',
                  animationDelay: '1s',
                }}
              />
            </>
          )}
          {template?.effects?.gridPattern && (
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `linear-gradient(${colors.foreground} 1px, transparent 1px), linear-gradient(90deg, ${colors.foreground} 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />
          )}
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Profile */}
          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
              style={{
                backgroundColor: colors.primary,
                color: '#fff',
              }}
            >
              {data.fullName?.charAt(0) || data.avatar || 'P'}
            </div>
            <div>
              <h1
                className="text-4xl font-black mb-2"
                style={{ fontFamily: template?.typography?.headingFont || 'Inter, sans-serif' }}
              >
                {data.fullName || 'Ditt Namn'}
              </h1>
              <p className="text-xl" style={{ color: colors.primary }}>
                {data.title || 'Din Titel'}
              </p>
            </div>
          </div>

          {/* Tagline */}
          {data.tagline && (
            <p className="text-lg mb-6" style={{ color: colors.muted }}>
              {data.tagline}
            </p>
          )}

          {/* Bio */}
          {data.bio && (
            <div
              className="p-6 rounded-xl mb-6"
              style={{
                backgroundColor: isDark ? `${colors.primary}15` : `${colors.primary}10`,
                borderLeft: `4px solid ${colors.primary}`,
              }}
            >
              <p className="leading-relaxed">{data.bio}</p>
            </div>
          )}

          {/* Seeking badge */}
          {data.seeking && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: colors.accent,
                color: isDark ? colors.background : '#fff',
              }}
            >
              <Eye className="h-4 w-4" />
              Söker: {data.seeking}
            </div>
          )}
        </div>
      </header>

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section
          className="px-12 py-12 border-t"
          style={{ borderColor: isDark ? '#333' : '#eee' }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: template?.typography?.headingFont || 'Inter, sans-serif' }}
            >
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-105"
                  style={{
                    backgroundColor: isDark ? `${colors.primary}20` : `${colors.primary}15`,
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
        <section
          className="px-12 py-12 border-t"
          style={{ borderColor: isDark ? '#333' : '#eee' }}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold mb-8"
              style={{ fontFamily: template?.typography?.headingFont || 'Inter, sans-serif' }}
            >
              Projekt
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {data.projects.slice(0, 4).map((project, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: isDark ? `${colors.secondary}20` : '#f8fafc',
                    border: `1px solid ${isDark ? '#333' : '#e2e8f0'}`,
                  }}
                >
                  <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                  <p className="text-sm mb-4" style={{ color: colors.muted }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${colors.accent}20`,
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

      {/* Footer */}
      <footer
        className="px-12 py-8 text-center text-sm"
        style={{
          backgroundColor: isDark ? `${colors.primary}10` : `${colors.primary}05`,
          color: colors.muted,
        }}
      >
        Skapad med PORTFOLYO.SE
      </footer>
    </div>
  );
}

// ============================================
// CV LIVE PREVIEW
// ============================================

interface CVLivePreviewProps {
  templateId: string;
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
  onPrint?: () => void;
  onExport?: () => void;
}

export function CVLivePreview({
  templateId,
  data,
  className,
  onPrint,
  onExport,
}: CVLivePreviewProps) {
  const [scale, setScale] = useState(0.6);
  const containerRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLDivElement>(null);

  const template = getCVTemplateById(templateId);
  const colors = template?.colors || {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    background: '#ffffff',
    text: '#1f2937',
    muted: '#6b7280',
  };

  const layout = template?.layout || 'two-column';
  const fonts = template?.fonts || { heading: 'Inter, sans-serif', body: 'Inter, sans-serif' };

  // Auto-scale
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const scaleX = (width - 80) / 794;
      const scaleY = (height - 80) / 1123;
      setScale(Math.min(scaleX, scaleY, 0.8));
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handlePrint = () => {
    if (cvRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>CV - ${data.fullName || 'CV'}</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; font-family: ${fonts.body}; }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${cvRef.current.outerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
    onPrint?.();
  };

  const isTwoColumn = layout === 'two-column' || layout === 'sidebar';
  const isDark = colors.background.startsWith('#0') || colors.background.startsWith('#1');

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            A4 Förhandsvisning
          </span>
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-500 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(1, s + 0.1))}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Ladda ner PDF
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Exportera
            </button>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-auto flex items-center justify-center p-8',
          'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800'
        )}
      >
        <div
          ref={cvRef}
          className="shadow-2xl"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            width: 794,
            minHeight: 1123,
            backgroundColor: colors.background,
            color: colors.text,
            fontFamily: fonts.body,
          }}
        >
          {isTwoColumn ? (
            <div className="flex h-full min-h-[1123px]">
              {/* Sidebar */}
              <div
                className="w-1/3 p-8"
                style={{ backgroundColor: colors.primary, color: '#fff' }}
              >
                {/* Avatar */}
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
                  {data.email && <div className="truncate">{data.email}</div>}
                  {data.phone && <div>{data.phone}</div>}
                  {data.location && <div>{data.location}</div>}
                </div>

                {/* Skills */}
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
                    <p className="text-sm leading-relaxed">{data.summary}</p>
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
                          {exp.achievements.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {exp.achievements.slice(0, 3).map((a, j) => (
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
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          ) : (
            // Single column layout
            <div className="p-12">
              {/* Header */}
              <header className="text-center pb-6 mb-6 border-b" style={{ borderColor: colors.primary }}>
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: fonts.heading }}
                >
                  {data.fullName || 'Ditt Namn'}
                </h1>
                <p className="text-lg mb-4" style={{ color: colors.primary }}>
                  {data.title || 'Din Titel'}
                </p>
                <div className="flex justify-center flex-wrap gap-4 text-sm">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>{data.phone}</span>}
                  {data.location && <span>{data.location}</span>}
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
    </div>
  );
}

// ============================================
// TEMPLATE PREVIEW THUMBNAIL
// ============================================

interface TemplatePreviewThumbnailProps {
  templateId: string;
  type: 'portfolio' | 'cv';
  isSelected?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TemplatePreviewThumbnail({
  templateId,
  type,
  isSelected,
  isLocked,
  onClick,
  className,
}: TemplatePreviewThumbnailProps) {
  const template = type === 'portfolio'
    ? getTemplateById(templateId)
    : getCVTemplateById(templateId);

  if (!template) return null;

  const colors = type === 'portfolio'
    ? (template as TemplateConfig).colorScheme
    : (template as CVTemplateDefinition).colors;

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      className={cn(
        'relative w-full aspect-[3/4] rounded-xl overflow-hidden transition-all',
        isSelected && 'ring-2 ring-violet-500 ring-offset-2',
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 cursor-pointer',
        className
      )}
    >
      {/* Mini preview */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primary}20 100%)`,
        }}
      >
        {/* Header bar */}
        <div
          className="h-4 w-full"
          style={{ backgroundColor: colors.primary }}
        />

        {/* Content preview */}
        <div className="p-3 space-y-2">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: colors.primary }}
          />
          <div className="space-y-1">
            <div
              className="h-2 w-16 rounded"
              style={{ backgroundColor: colors.primary + '40' }}
            />
            <div
              className="h-1.5 w-12 rounded"
              style={{ backgroundColor: colors.muted + '40' }}
            />
          </div>
          <div className="flex gap-1 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1.5 w-6 rounded"
                style={{ backgroundColor: colors.accent + '60' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overlay with info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
        <h3 className="text-white font-semibold text-xs truncate">{template.name}</h3>
        <p className="text-white/70 text-[10px] truncate">{template.description}</p>
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default PortfolioLivePreview;
