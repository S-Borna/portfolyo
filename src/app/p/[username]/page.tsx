'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePortfolyoStore } from '@/lib/store';
import { Icons } from '@/components/ui';
import type { Portfolio } from '@/lib/types';

const {
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code,
  Sparkles,
  Calendar,
  ChevronRight,
} = Icons;

interface PublicPortfolioPageProps {
  params: Promise<{ username: string }>;
}

export default function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const [username, setUsername] = useState<string>('');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { portfolios } = usePortfolyoStore();

  useEffect(() => {
    params.then((p) => {
      setUsername(p.username);
    });
  }, [params]);

  useEffect(() => {
    if (!username) return;

    // Hitta portfolio baserat på slug
    const found = portfolios.find(
      (p) => p.slug.toLowerCase() === username.toLowerCase() && p.status === 'published'
    );

    if (found) {
      setPortfolio(found);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [username, portfolios]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (notFound || !portfolio) {
    return <NotFoundPage username={username} />;
  }

  return <PortfolioView portfolio={portfolio} />;
}

// 404 sida
function NotFoundPage({ username }: { username: string }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio hittades inte</h1>
        <p className="text-gray-400 mb-6">
          Användaren <span className="text-violet-400 font-mono">@{username}</span> finns inte eller har inte publicerat sin portfolio än.
        </p>
        <Link
          href="https://portfolyo.se"
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
        >
          <Sparkles className="h-5 w-5" />
          Skapa din egen portfolio
        </Link>
      </div>
    </div>
  );
}

// Huvudportfolio-vyn
function PortfolioView({ portfolio }: { portfolio: Portfolio }) {
  const { profile, projects, timeline, techStack, contact } = portfolio;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Gradient bakgrund */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-gray-950 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Avatar */}
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-800 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-5xl font-bold">
                {profile.fullName.charAt(0)}
              </div>
            )}

            {/* Namn & Titel */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">{profile.fullName}</h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-4">{profile.title}</p>

            {/* Tagline */}
            {profile.tagline && (
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">{profile.tagline}</p>
            )}

            {/* Söker LIA badge */}
            {profile.seeking && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full mb-6"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                {profile.seeking}
              </motion.div>
            )}

            {/* Plats & Kontakt-info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 text-sm">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-violet-400 transition-colors">
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-violet-400 transition-colors">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-violet-400 transition-colors">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Om mig */}
      {profile.bio && (
        <section className="max-w-3xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </span>
              Om mig
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">{profile.bio}</p>
          </motion.div>
        </section>
      )}

      {/* Skills */}
      {techStack.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <Code className="h-4 w-4 text-violet-400" />
              </span>
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:border-violet-500/50 hover:bg-gray-800 transition-all"
                >
                  {tech.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Projekt */}
      {projects.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-violet-400" />
              </span>
              Projekt
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-violet-500/50 transition-all"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Timeline (Erfarenhet & Utbildning) */}
      {timeline.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-violet-400" />
              </span>
              Erfarenhet & Utbildning
            </h2>
            
            <div className="space-y-6">
              {timeline.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8 border-l-2 border-gray-800"
                >
                  {/* Dot */}
                  <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                    entry.current
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-gray-900 border-gray-600'
                  }`} />
                  
                  <div className="pb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="h-3 w-3" />
                      {entry.period}
                      {entry.current && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          Nu
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                    <p className="text-violet-400">{entry.subtitle}</p>
                    {entry.description && (
                      <p className="text-gray-400 mt-2">{entry.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Kontakt CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 rounded-3xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Intresserad av att samarbeta?</h2>
          <p className="text-gray-400 mb-6">
            {profile.seekingDetails?.type
              ? `Jag söker ${profile.seekingDetails.type} ${profile.seekingDetails.period || ''}`
              : 'Jag är öppen för nya möjligheter'}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Kontakta mig
              </a>
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <a
            href="https://portfolyo.se"
            className="flex items-center gap-1 hover:text-violet-400 transition-colors"
          >
            Skapad med
            <span className="text-violet-400 font-semibold">PORTFOLYO</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
