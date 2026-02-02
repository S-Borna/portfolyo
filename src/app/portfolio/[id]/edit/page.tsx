'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Button,
  Input,
  Textarea,
  Card,
  Badge,
  Tabs,
  TechBadge,
  CreditDisplay,
  Icons,
} from '@/components/ui';
import { usePortfolyoStore } from '@/lib/store';
import { TECH_STACK_OPTIONS, CREDIT_COSTS } from '@/lib/types';
import type { ProjectShowcase, TimelineEntry, TechStackItem } from '@/lib/types';
import { generateId, getPortfolioUrl } from '@/lib/utils';

const {
  ArrowLeft,
  Save,
  Eye,
  ExternalLink,
  Plus,
  X,
  Sparkles,
  User,
  Briefcase,
  Code,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  MapPin,
  GraduationCap,
  Zap,
  Trash2,
  Edit3,
  Check,
} = Icons;

export default function PortfolioEditorPage() {
  const router = useRouter();
  const params = useParams();
  const portfolioId = params.id as string;

  const { 
    portfolios, 
    updatePortfolio, 
    publishPortfolio,
    credits,
    useCredits,
    isAuthenticated,
  } = usePortfolyoStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Find portfolio
  const portfolio = portfolios.find(p => p.id === portfolioId);

  // Local state for editing
  const [profile, setProfile] = useState(portfolio?.profile || {
    fullName: '',
    title: '',
    tagline: '',
    bio: '',
    highlights: [],
    seeking: '',
    seekingDetails: undefined,
  });
  const [projects, setProjects] = useState<ProjectShowcase[]>(portfolio?.projects || []);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(portfolio?.timeline || []);
  const [techStack, setTechStack] = useState<TechStackItem[]>(portfolio?.techStack || []);
  const [contact, setContact] = useState(portfolio?.contact || {
    email: '',
    showContactForm: true,
  });
  const [settings, setSettings] = useState(portfolio?.settings || {
    primaryColor: '#8B5CF6',
    accentColor: '#6366F1',
    fontFamily: 'inter' as const,
    darkMode: true,
    showAnalytics: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/onboarding');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (portfolio) {
      setProfile(portfolio.profile);
      setProjects(portfolio.projects);
      setTimeline(portfolio.timeline);
      setTechStack(portfolio.techStack);
      setContact(portfolio.contact);
      setSettings(portfolio.settings);
    }
  }, [portfolio]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Portfolio hittades inte</h2>
          <p className="text-gray-600 mb-4">Portfolion du letar efter finns inte.</p>
          <Link href="/dashboard">
            <Button>Tillbaka till dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updatePortfolio(portfolioId, {
        profile,
        projects,
        timeline,
        techStack,
        contact,
        settings,
      });
      toast.success('Portfolio sparad!');
    } catch (error) {
      toast.error('Kunde inte spara');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      updatePortfolio(portfolioId, {
        profile,
        projects,
        timeline,
        techStack,
        contact,
        settings,
      });
      publishPortfolio(portfolioId);
      toast.success('Portfolio publicerad! 🎉');
    } catch (error) {
      toast.error('Kunde inte publicera');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (credits < CREDIT_COSTS.bio) {
      toast.error('Inte tillräckligt med credits');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bio',
          context: {
            name: profile.fullName,
            title: profile.title,
            experience: timeline,
            skills: techStack.map(t => t.name),
            seeking: profile.seeking,
          },
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setProfile({ ...profile, bio: data.content });
      useCredits(CREDIT_COSTS.bio);
      toast.success('Bio genererad!');
    } catch (error) {
      toast.error('Kunde inte generera bio');
    } finally {
      setIsGenerating(false);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: generateId(),
        name: '',
        description: '',
        tags: [],
        links: {},
        featured: false,
        order: projects.length,
      },
    ]);
  };

  const updateProject = (id: string, updates: Partial<ProjectShowcase>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const addTimelineEntry = () => {
    setTimeline([
      ...timeline,
      {
        id: generateId(),
        title: '',
        subtitle: '',
        description: '',
        period: '',
        type: 'education',
        current: false,
        order: timeline.length,
      },
    ]);
  };

  const updateTimelineEntry = (id: string, updates: Partial<TimelineEntry>) => {
    setTimeline(timeline.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTimelineEntry = (id: string) => {
    setTimeline(timeline.filter(t => t.id !== id));
  };

  const toggleTechStack = (tech: typeof TECH_STACK_OPTIONS[number]) => {
    const exists = techStack.find(t => t.name === tech.name);
    if (exists) {
      setTechStack(techStack.filter(t => t.name !== tech.name));
    } else {
      setTechStack([...techStack, {
        name: tech.name,
        icon: tech.icon,
        category: tech.category as TechStackItem['category'],
        proficiency: 'intermediate',
      }]);
    }
  };

  const portfolioUrl = getPortfolioUrl(portfolio.slug, portfolio.customDomain);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User className="h-4 w-4" /> },
    { id: 'projects', label: 'Projekt', icon: <Code className="h-4 w-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'skills', label: 'Skills', icon: <Zap className="h-4 w-4" /> },
    { id: 'contact', label: 'Kontakt', icon: <Mail className="h-4 w-4" /> },
    { id: 'settings', label: 'Design', icon: <Edit3 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900">Redigera Portfolio</h1>
              <p className="text-sm text-gray-500">{portfolio.slug}.portfolyo.se</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditDisplay credits={credits} />
            
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                Förhandsgranska
              </Button>
            </a>

            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Spara
            </Button>

            <Button 
              size="sm" 
              onClick={handlePublish}
              isLoading={isSaving}
              leftIcon={<Globe className="h-4 w-4" />}
            >
              {portfolio.status === 'published' ? 'Uppdatera' : 'Publicera'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Grundläggande information</h2>
              
              <div className="grid gap-4">
                <Input
                  label="Fullständigt namn"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
                
                <Input
                  label="Titel"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="DevOps Engineer, Frontend Developer, etc."
                />

                <Input
                  label="Tagline"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  placeholder="En kort beskrivning som syns under ditt namn"
                />

                <Input
                  label="Plats"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Stockholm, Sverige"
                  leftIcon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Om mig</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateBio}
                  isLoading={isGenerating}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  disabled={credits < CREDIT_COSTS.bio}
                >
                  AI-generera (1 credit)
                </Button>
              </div>
              
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Berätta om dig själv, din bakgrund och vad som driver dig..."
                rows={6}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vad söker du?</h2>
              
              <div className="grid gap-4">
                <Input
                  label="Typ"
                  value={profile.seeking || ''}
                  onChange={(e) => setProfile({ ...profile, seeking: e.target.value })}
                  placeholder="LIA-plats, Junior-roll, Trainee, etc."
                />

                {profile.seekingDetails && (
                  <>
                    <Input
                      label="Period"
                      value={profile.seekingDetails.period}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        seekingDetails: { ...profile.seekingDetails!, period: e.target.value }
                      })}
                    />
                    <Input
                      label="Plats"
                      value={profile.seekingDetails.location}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        seekingDetails: { ...profile.seekingDetails!, location: e.target.value }
                      })}
                    />
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Projekt</h2>
              <Button onClick={addProject} leftIcon={<Plus className="h-4 w-4" />}>
                Lägg till projekt
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-12 text-center">
                <Code className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Inga projekt än</h3>
                <p className="text-gray-600 mb-4">Visa upp dina bästa projekt</p>
                <Button onClick={addProject} leftIcon={<Plus className="h-4 w-4" />}>
                  Lägg till ditt första projekt
                </Button>
              </Card>
            ) : (
              projects.map((project, index) => (
                <Card key={project.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline">Projekt {index + 1}</Badge>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4">
                    <Input
                      label="Projektnamn"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    />

                    <Textarea
                      label="Beskrivning"
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Live URL"
                        value={project.links.live || ''}
                        onChange={(e) => updateProject(project.id, { 
                          links: { ...project.links, live: e.target.value }
                        })}
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                      <Input
                        label="GitHub URL"
                        value={project.links.github || ''}
                        onChange={(e) => updateProject(project.id, { 
                          links: { ...project.links, github: e.target.value }
                        })}
                        leftIcon={<Github className="h-4 w-4" />}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teknologier
                      </label>
                      <Input
                        value={project.tags.join(', ')}
                        onChange={(e) => updateProject(project.id, { 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })}
                        placeholder="Next.js, TypeScript, TailwindCSS"
                        hint="Separera med komma"
                      />
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) => updateProject(project.id, { featured: e.target.checked })}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">Featured projekt (visas först)</span>
                    </label>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
              <Button onClick={addTimelineEntry} leftIcon={<Plus className="h-4 w-4" />}>
                Lägg till
              </Button>
            </div>

            {timeline.length === 0 ? (
              <Card className="p-12 text-center">
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Ingen timeline än</h3>
                <p className="text-gray-600 mb-4">Visa din resa och erfarenhet</p>
                <Button onClick={addTimelineEntry} leftIcon={<Plus className="h-4 w-4" />}>
                  Lägg till första posten
                </Button>
              </Card>
            ) : (
              timeline.map((entry, index) => (
                <Card key={entry.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <select
                      value={entry.type}
                      onChange={(e) => updateTimelineEntry(entry.id, { 
                        type: e.target.value as TimelineEntry['type'] 
                      })}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-sm"
                    >
                      <option value="education">🎓 Utbildning</option>
                      <option value="work">💼 Arbete</option>
                      <option value="project">🚀 Projekt</option>
                      <option value="achievement">🏆 Achievement</option>
                    </select>
                    <button
                      onClick={() => removeTimelineEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4">
                    <Input
                      label="Titel"
                      value={entry.title}
                      onChange={(e) => updateTimelineEntry(entry.id, { title: e.target.value })}
                    />
                    <Input
                      label="Undertitel"
                      value={entry.subtitle}
                      onChange={(e) => updateTimelineEntry(entry.id, { subtitle: e.target.value })}
                      placeholder="Företag, skola, etc."
                    />
                    <Input
                      label="Period"
                      value={entry.period}
                      onChange={(e) => updateTimelineEntry(entry.id, { period: e.target.value })}
                      placeholder="Sep 2025 - Pågående"
                    />
                    <Textarea
                      label="Beskrivning"
                      value={entry.description}
                      onChange={(e) => updateTimelineEntry(entry.id, { description: e.target.value })}
                      rows={2}
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={entry.current}
                        onChange={(e) => updateTimelineEntry(entry.id, { current: e.target.checked })}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">Pågående</span>
                    </label>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tech Stack</h2>
              <p className="text-gray-600 text-sm mb-4">
                Välj de teknologier du kan. De visas som badges på din portfolio.
              </p>

              {['frontend', 'backend', 'database', 'devops', 'tools'].map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.filter(t => t.category === category).map((tech) => {
                      const isSelected = techStack.some(t => t.name === tech.name);
                      return (
                        <button
                          key={tech.name}
                          onClick={() => toggleTechStack(tech)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {tech.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Valda skills ({techStack.length})</h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <TechBadge key={tech.name} name={tech.name} icon={tech.icon} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontaktinformation</h2>
              
              <div className="grid gap-4">
                <Input
                  label="E-post"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="Telefon (valfritt)"
                  type="tel"
                  value={contact.phone || ''}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  leftIcon={<Phone className="h-4 w-4" />}
                />
                <Input
                  label="LinkedIn"
                  value={contact.linkedin || ''}
                  onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                  leftIcon={<Linkedin className="h-4 w-4" />}
                  placeholder="https://linkedin.com/in/dittnamn"
                />
                <Input
                  label="GitHub"
                  value={contact.github || ''}
                  onChange={(e) => setContact({ ...contact, github: e.target.value })}
                  leftIcon={<Github className="h-4 w-4" />}
                  placeholder="https://github.com/dittnamn"
                />
                <Input
                  label="Webbplats (valfritt)"
                  value={contact.website || ''}
                  onChange={(e) => setContact({ ...contact, website: e.target.value })}
                  leftIcon={<Globe className="h-4 w-4" />}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inställningar</h2>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={contact.showContactForm}
                  onChange={(e) => setContact({ ...contact, showContactForm: e.target.checked })}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Visa kontaktformulär på portfolion</span>
              </label>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Färger</h2>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primärfärg</label>
                  <div className="flex gap-3">
                    {['#8B5CF6', '#6366F1', '#3B82F6', '#14B8A6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSettings({ ...settings, primaryColor: color })}
                        className={`w-10 h-10 rounded-full transition-all ${
                          settings.primaryColor === color
                            ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tema</h2>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm text-gray-700">Mörkt tema</span>
              </label>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
              
              <div className="grid gap-4">
                <Input
                  label="SEO-titel"
                  value={settings.seoTitle || ''}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  placeholder={`${profile.fullName} - ${profile.title}`}
                />
                <Textarea
                  label="SEO-beskrivning"
                  value={settings.seoDescription || ''}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                  rows={2}
                  placeholder="En kort beskrivning som visas i sökresultat"
                />
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
