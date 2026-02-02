'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui';
import { getPortfolioByUsername, trackPortfolioView, type DbPortfolio } from '@/lib/supabase';

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
  Download,
  Star,
  Zap,
} = Icons;

// Konvertera DB portfolio till frontend format
interface PortfolioDisplay {
  profile: {
    fullName: string;
    title: string;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    avatar: string | null;
  };
  lia: {
    seeking: boolean;
    period: string | null;
    location: string | null;
    interests: string[];
  };
  highlights: {
    icon: string;
    value: string;
    label: string;
  }[];
  techStack: {
    name: string;
    icon?: string;
    category?: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    image?: string;
    tags: string[];
    links: { live?: string; github?: string };
    badge?: string;
  }[];
  timeline: {
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
    email: string | null;
    phone: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
  };
}

function dbToDisplay(db: DbPortfolio): PortfolioDisplay {
  return {
    profile: {
      fullName: db.title,
      title: db.tagline || '',
      tagline: db.bio,
      bio: db.bio,
      location: db.location,
      avatar: db.avatar_url,
    },
    lia: {
      seeking: db.is_seeking_lia,
      period: db.lia_period,
      location: db.lia_location,
      interests: db.lia_interests || [],
    },
    highlights: db.highlights || [],
    techStack: (db.tech_stack || []).map((t: any) => typeof t === 'string' ? { name: t } : t),
    projects: db.projects || [],
    timeline: db.timeline || [],
    contact: {
      email: db.email,
      phone: db.phone,
      linkedin: db.linkedin,
      github: db.github,
      website: db.website,
    },
  };
}

interface PublicPortfolioPageProps {
  params: Promise<{ username: string }>;
}

export default function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
  const [username, setUsername] = useState<string>('');
  const [portfolio, setPortfolio] = useState<PortfolioDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setUsername(p.username);
    });
  }, [params]);

  useEffect(() => {
    if (!username) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      const dbPortfolio = await getPortfolioByUsername(username);

      if (dbPortfolio) {
        setPortfolio(dbToDisplay(dbPortfolio));
        // Track view (fire and forget)
        trackPortfolioView(dbPortfolio.id);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchPortfolio();
  }, [username]);

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

  return <PortfolioView portfolio={portfolio} username={username} />;
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

// Huvudportfolio-vyn - inspirerad av saidborna.com
function PortfolioView({ portfolio, username }: { portfolio: PortfolioDisplay; username: string }) {
  const { profile, lia, highlights, projects, timeline, techStack, contact } = portfolio;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/p/${username}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{profile.fullName.charAt(0)}</span>
            </div>
            <span className="font-bold text-lg tracking-tight">{username.toUpperCase()}</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">Om mig</a>
            <a href="#timeline" className="text-gray-400 hover:text-white transition-colors">Timeline</a>
            <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projekt</a>
            <a href="#stack" className="text-gray-400 hover:text-white transition-colors">Tech Stack</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-16 overflow-hidden">
        {/* Gradient bakgrund */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-gray-950 to-gray-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top labels */}
            <div className="flex items-center gap-3 mb-6 text-sm">
              <span className="text-gray-500 uppercase tracking-wider">DevOps Student</span>
            </div>

            {/* Name & Title */}
            <h1 className="text-5xl sm:text-7xl font-black mb-2 tracking-tight">
              {profile.fullName.toUpperCase().split(' ')[0]}
              <span className="text-violet-400">{profile.fullName.toUpperCase().split(' ').slice(1).join('')}</span>
            </h1>

            <h2 className="text-2xl sm:text-3xl text-gray-400 font-medium mb-6">
              {profile.title}
            </h2>

            {/* LIA Badge */}
            {lia.seeking && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-8"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-semibold">Söker LIA-plats</span>
                </div>
                <div className="h-6 w-px bg-gray-700"></div>
                <div className="text-sm text-gray-400">
                  {lia.period && <span className="mr-3"><span className="text-gray-500">PERIOD</span> {lia.period}</span>}
                  {lia.location && <span className="mr-3"><span className="text-gray-500">PLATS</span> {lia.location}</span>}
                  {lia.interests.length > 0 && (
                    <span><span className="text-gray-500">INTRESSE</span> {lia.interests.join(' · ')}</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Avatar & Highlights Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left: Avatar + Quick links */}
              <div>
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-48 h-48 rounded-2xl object-cover border-2 border-gray-800 mb-6"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-6xl font-bold mb-6">
                    {profile.fullName.charAt(0)}
                  </div>
                )}

                {/* Quick contact links */}
                <div className="flex flex-wrap gap-2">
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl text-sm hover:bg-gray-800 transition-colors">
                      <Linkedin className="h-4 w-4 text-violet-400" />
                      LinkedIn
                    </a>
                  )}
                  {contact.github && (
                    <a href={contact.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl text-sm hover:bg-gray-800 transition-colors">
                      <Github className="h-4 w-4 text-violet-400" />
                      GitHub
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl text-sm hover:bg-gray-800 transition-colors">
                      <Mail className="h-4 w-4 text-violet-400" />
                      Email
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Highlights */}
              {highlights.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-center"
                    >
                      <div className="text-3xl font-bold text-white">{h.value}</div>
                      <div className="text-sm text-gray-500">{h.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Om mig Section */}
      {profile.bio && (
        <section id="about" className="py-20 border-t border-gray-800/50">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">{profile.fullName.toUpperCase()}</h2>
              <h3 className="text-3xl font-bold mb-8 text-violet-400">{profile.title}</h3>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">{profile.bio}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {timeline.length > 0 && (
        <section id="timeline" className="py-20 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">{profile.fullName.toUpperCase()}</h2>
              <h3 className="text-3xl font-bold mb-4 text-violet-400">JOURNEY</h3>
              <p className="text-gray-400 mb-12 max-w-2xl">
                Följ min resa genom utbildningen, där varje kurs lett till konkreta projekt och verkliga resultat.
              </p>

              {/* Timeline Items */}
              <div className="space-y-8">
                {timeline.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="flex gap-6">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${entry.current
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'bg-gray-900 border-violet-500'
                          }`} />
                        {i < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-800 mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">{entry.period}</span>
                          {entry.current && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                              Pågående
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{entry.title}</h4>
                        <p className="text-violet-400 mb-3">{entry.subtitle}</p>
                        {entry.description && (
                          <p className="text-gray-400 mb-4">{entry.description}</p>
                        )}
                        {entry.achievements && entry.achievements.length > 0 && (
                          <ul className="space-y-1">
                            {entry.achievements.map((a, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                                <span className="text-violet-400 mt-1">→</span>
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {entry.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-lg">
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
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">{profile.fullName.toUpperCase()}</h2>
              <h3 className="text-3xl font-bold mb-12 text-violet-400">PROJEKT</h3>

              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all"
                  >
                    {/* Project Image */}
                    {project.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Badge */}
                      {project.badge && (
                        <span className="text-xs text-violet-400 uppercase tracking-wider mb-2 block">
                          {project.badge}
                        </span>
                      )}

                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">
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
                            Besök sajt →
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
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tech Stack Section */}
      {techStack.length > 0 && (
        <section id="stack" className="py-20 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">{profile.fullName.toUpperCase()}</h2>
              <h3 className="text-3xl font-bold mb-4 text-violet-400">TEKNISK KOMPETENS</h3>
              <p className="text-gray-400 mb-12 max-w-2xl">
                Verktyg och teknologier jag arbetat med under utbildning och egna projekt.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-violet-500/50 transition-colors"
                  >
                    {tech.icon ? (
                      <img src={tech.icon} alt={tech.name} className="w-8 h-8" />
                    ) : (
                      <Code className="w-8 h-8 text-violet-400" />
                    )}
                    <span className="text-xs text-gray-400 text-center">{tech.name}</span>
                    {tech.category && (
                      <span className="text-[10px] text-gray-600 uppercase">{tech.category}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">{profile.fullName.toUpperCase()}</h2>
            <h3 className="text-3xl font-bold mb-4 text-violet-400">LÅT OSS PRATA</h3>
            <p className="text-gray-400 mb-8">
              {lia.seeking
                ? 'Hör av dig om LIA eller samarbete. Jag svarar inom 24 timmar.'
                : 'Intresserad av att samarbeta? Hör av dig!'}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-violet-500/50 transition-colors"
                >
                  <Mail className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-violet-500/50 transition-colors"
                >
                  <Phone className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">{contact.phone}</span>
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-violet-500/50 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">LinkedIn</span>
                </a>
              )}
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-violet-500/50 transition-colors"
                >
                  <Github className="h-5 w-5 text-violet-400" />
                  <span className="text-gray-300">GitHub</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
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
