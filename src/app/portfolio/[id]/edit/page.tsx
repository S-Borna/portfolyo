'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { PortfolioPreviewV2 } from '@/components/preview';
import { usePortfolyoStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { TECH_STACK_OPTIONS, CREDIT_COSTS } from '@/lib/types';
import type { ProjectShowcase, TimelineEntry, TechStackItem } from '@/lib/types';
import { generateId, getPortfolioUrl } from '@/lib/utils';
import { PORTFOLIO_TEMPLATES_V2 } from '@/lib/templates/portfolio-renderer-v2';

const {
  ArrowLeft,
  ArrowRight,
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
  FileText,
  Download,
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
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [customSkill, setCustomSkill] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState('said-dark');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCvText, setImportCvText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [userCvs, setUserCvs] = useState<any[]>([]);

  // Find portfolio from store
  const storePortfolio = portfolios.find(p => p.id === portfolioId);
  const [portfolio, setPortfolioState] = useState(storePortfolio);
  const [loadingFromDb, setLoadingFromDb] = useState(!storePortfolio);

  // If not in store, fetch from Supabase
  useEffect(() => {
    if (!storePortfolio && mounted) {
      const fetchFromDb = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', portfolioId)
          .eq('user_id', session.user.id)
          .single();
        if (data) {
          // Convert DB format to store format (same as sync.ts)
          const converted = {
            id: data.id,
            userId: data.user_id,
            slug: data.username || '',
            template: data.template_id || 'developer',
            profile: {
              fullName: data.title || '',
              title: data.tagline || '',
              tagline: data.tagline || '',
              bio: data.bio || '',
              avatar: data.avatar_url || undefined,
              location: data.location || undefined,
              highlights: data.highlights || [],
              seeking: data.is_seeking ? (data.seeking_type || 'lia') : undefined,
              seekingDetails: data.is_seeking ? {
                type: data.seeking_type || 'lia',
                period: data.seeking_period || '',
                location: data.seeking_location || '',
                interests: data.seeking_interests || [],
              } : undefined,
            },
            projects: (data.projects || []).map((proj: any) => ({
              id: proj.id || generateId(),
              name: proj.name || '',
              description: proj.description || '',
              tags: proj.tags || [],
              links: proj.links || {},
              featured: proj.featured || false,
              order: proj.order || 0,
            })),
            timeline: (data.timeline || []).map((t: any) => ({
              id: t.id || generateId(),
              title: t.title || '',
              subtitle: t.subtitle || '',
              description: t.description || '',
              period: t.period || '',
              type: t.type || 'education',
              current: t.current || false,
              achievements: t.achievements || [],
              tags: t.tags || [],
              order: t.order || 0,
            })),
            techStack: (data.skills || data.tech_stack || []).map((s: any) =>
              typeof s === 'string'
                ? { name: s, icon: s.toLowerCase(), category: 'tools', proficiency: 'intermediate' }
                : s
            ),
            contact: {
              email: data.email || '',
              phone: data.phone || undefined,
              linkedin: data.linkedin || undefined,
              github: data.github || undefined,
              website: data.website || undefined,
              showContactForm: true,
            },
            settings: {
              primaryColor: data.theme?.accent_color || '#8B5CF6',
              accentColor: data.theme?.accent_color || '#6366F1',
              fontFamily: 'inter' as const,
              darkMode: data.theme?.dark_mode !== false,
              showAnalytics: false,
            },
            status: data.status || 'draft',
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          };
          setPortfolioState(converted as any);
        }
        setLoadingFromDb(false);
      };
      fetchFromDb();
    } else if (storePortfolio) {
      // Ensure store portfolio has required nested fields
      const safePortfolio = {
        ...storePortfolio,
        profile: storePortfolio.profile || { fullName: '', title: '', tagline: '', bio: '', highlights: [] },
        projects: storePortfolio.projects || [],
        timeline: storePortfolio.timeline || [],
        techStack: storePortfolio.techStack || [],
        contact: storePortfolio.contact || { email: '', showContactForm: true },
        settings: storePortfolio.settings || { primaryColor: '#8B5CF6', accentColor: '#6366F1', fontFamily: 'inter' as const, darkMode: true, showAnalytics: false },
      };
      setPortfolioState(safePortfolio);
      setLoadingFromDb(false);
    }
  }, [storePortfolio, mounted, portfolioId]);

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
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (portfolio) {
      setProfile(portfolio.profile || {
        fullName: '',
        title: '',
        tagline: '',
        bio: '',
        highlights: [],
        seeking: '',
        seekingDetails: undefined,
      });
      setProjects(portfolio.projects || []);
      setTimeline(portfolio.timeline || []);
      setTechStack(portfolio.techStack || []);
      setContact(portfolio.contact || {
        email: '',
        showContactForm: true,
      });
      setSettings(portfolio.settings || {
        primaryColor: '#8B5CF6',
        accentColor: '#6366F1',
        fontFamily: 'inter' as const,
        darkMode: true,
        showAnalytics: false,
      });
    }
  }, [portfolio]);

  // Preview data that updates in real-time - MUST be before early returns!
  const previewData = useMemo(() => ({
    fullName: profile.fullName,
    title: profile.title,
    tagline: profile.tagline,
    bio: profile.bio,
    location: profile.location,
    email: contact.email,
    phone: contact.phone,
    linkedin: contact.linkedin,
    github: contact.github,
    website: contact.website,
    skills: techStack.map(t => t.name),
    projects: projects.map(p => ({
      name: p.name,
      description: p.description,
      tags: p.tags,
      url: p.links?.live || p.links?.github || '#',
      image: p.image,
    })),
    experience: timeline.filter(t => t.type === 'work').map(t => ({
      title: t.title,
      company: t.subtitle,
      period: t.period,
      description: t.description,
      current: t.current,
    })),
    education: timeline.filter(t => t.type === 'education').map(t => ({
      degree: t.title,
      institution: t.subtitle,
      period: t.period,
    })),
    seeking: profile.seeking ? {
      active: true,
      title: profile.seeking,
      period: profile.seekingDetails?.period,
      description: '',
    } : undefined,
    highlights: Array.isArray(profile.highlights)
      ? profile.highlights.map(h =>
          typeof h === 'string' ? h : (h?.label || h?.value || '')
        ).filter(Boolean)
      : [],
  }), [profile, projects, timeline, techStack, contact]);

  if (!mounted || !isAuthenticated || loadingFromDb) {
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
      // Update local store
      updatePortfolio(portfolioId, {
        profile,
        projects,
        timeline,
        techStack,
        contact,
        settings,
      });

      // Persist to Supabase
      const { error } = await supabase
        .from('portfolios')
        .update({
          title: profile.fullName,
          tagline: profile.tagline || profile.title,
          bio: profile.bio,
          location: profile.location,
          avatar_url: profile.avatar,
          email: contact.email,
          phone: contact.phone,
          linkedin: contact.linkedin,
          github: contact.github,
          website: contact.website,
          skills: techStack.map(t => ({ name: t.name, icon: t.icon, category: t.category, proficiency: t.proficiency })),
          projects: projects.map(p => ({ id: p.id, name: p.name, description: p.description, tags: p.tags, links: p.links, featured: p.featured, image: p.image, order: p.order })),
          timeline: timeline.map(t => ({ id: t.id, title: t.title, subtitle: t.subtitle, description: t.description, period: t.period, type: t.type, current: t.current, achievements: t.achievements, tags: t.tags, order: t.order })),
          highlights: profile.highlights,
          is_seeking: !!profile.seeking,
          seeking_type: profile.seekingDetails?.type,
          seeking_period: profile.seekingDetails?.period,
          seeking_location: profile.seekingDetails?.location,
          theme: {
            accent_color: settings.primaryColor,
            dark_mode: settings.darkMode,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolioId);

      if (error) {
        console.error('Save to DB error:', error);
        toast.error('Sparat lokalt men inte i databasen');
      } else {
        toast.success('Portfolio sparad!');
      }
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

  const handleGenerateProjectDesc = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if (credits < CREDIT_COSTS.bio) {
      toast.error('Inte tillräckligt med credits');
      return;
    }
    setGeneratingFor(projectId);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'project-description',
          context: {
            projectName: project.name,
            technologies: project.tags,
            description: project.description,
          },
        }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      updateProject(projectId, { description: data.content });
      useCredits(CREDIT_COSTS.bio);
      toast.success('Beskrivning genererad!');
    } catch (error) {
      toast.error('Kunde inte generera beskrivning');
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGenerateTimelineDesc = async (entryId: string) => {
    const entry = timeline.find(e => e.id === entryId);
    if (!entry) return;
    if (credits < CREDIT_COSTS.bio) {
      toast.error('Inte tillräckligt med credits');
      return;
    }
    setGeneratingFor(entryId);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'timeline-description',
          context: {
            type: entry.type,
            title: entry.title,
            subtitle: entry.subtitle,
            period: entry.period,
          },
        }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      updateTimelineEntry(entryId, { description: data.content });
      useCredits(CREDIT_COSTS.bio);
      toast.success('Beskrivning genererad!');
    } catch (error) {
      toast.error('Kunde inte generera beskrivning');
    } finally {
      setGeneratingFor(null);
    }
  };

  const addCustomSkill = () => {
    const name = customSkill.trim();
    if (!name) return;
    if (techStack.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Redan tillagd');
      return;
    }
    setTechStack([...techStack, { name, icon: name.toLowerCase().replace(/[.\s]/g, ''), category: 'tools', proficiency: 'intermediate' }]);
    setCustomSkill('');
  };

  const tabOrder = ['profile', 'projects', 'timeline', 'skills', 'contact', 'settings'];
  const nextTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1]);
  };
  const prevTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx > 0) setActiveTab(tabOrder[idx - 1]);
  };

  // Fetch user's CVs from Supabase for import
  useEffect(() => {
    if (!mounted) return;
    const fetchCvs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', session.user.id);
      if (data && data.length > 0) setUserCvs(data);
    };
    fetchCvs();
  }, [mounted]);

  // Import from an existing CV in the database
  const handleImportFromCv = (cv: any) => {
    const pi = cv.personal_info || cv.personalInfo || {};
    const exp = cv.experience || [];
    const edu = cv.education || [];
    const sk = cv.skills || [];
    const pr = cv.projects || [];

    setProfile({
      ...profile,
      fullName: pi.fullName || pi.full_name || profile.fullName,
      title: pi.title || profile.title,
      tagline: pi.title || profile.tagline,
      bio: cv.summary || profile.bio,
      location: pi.location || profile.location,
    });

    if (exp.length > 0) {
      setTimeline(prev => [
        ...prev.filter(t => t.type !== 'work'),
        ...exp.map((e: any, i: number) => ({
          id: generateId(),
          title: e.title || '',
          subtitle: e.company || '',
          description: e.description || (e.achievements || []).join('. '),
          period: e.startDate && e.endDate ? `${e.startDate} – ${e.endDate}` : (e.startDate || ''),
          type: 'work' as const,
          current: e.current || false,
          achievements: e.achievements || [],
          tags: [],
          order: i,
        })),
      ]);
    }

    if (edu.length > 0) {
      setTimeline(prev => [
        ...prev.filter(t => t.type !== 'education'),
        ...edu.map((e: any, i: number) => ({
          id: generateId(),
          title: e.degree || e.field || '',
          subtitle: e.institution || '',
          description: e.description || '',
          period: e.startDate && e.endDate ? `${e.startDate} – ${e.endDate}` : (e.startDate || ''),
          type: 'education' as const,
          current: e.current || false,
          achievements: e.achievements || [],
          tags: [],
          order: i,
        })),
      ]);
    }

    if (sk.length > 0) {
      const allSkills: string[] = sk.flatMap((cat: any) =>
        typeof cat === 'string' ? [cat] : (cat.skills || [])
      );
      const newTech = allSkills
        .filter(s => !techStack.some(t => t.name.toLowerCase() === s.toLowerCase()))
        .map(s => ({
          name: s,
          icon: s.toLowerCase().replace(/[.\s]/g, ''),
          category: 'tools' as const,
          proficiency: 'intermediate' as const,
        }));
      setTechStack(prev => [...prev, ...newTech]);
    }

    if (pr.length > 0) {
      const newProjects = pr.map((p: any, i: number) => ({
        id: generateId(),
        name: p.name || '',
        description: p.description || '',
        tags: p.technologies || [],
        links: { live: p.url || '' },
        featured: i === 0,
        order: i,
      }));
      setProjects(prev => [...prev, ...newProjects]);
    }

    setContact({
      ...contact,
      email: pi.email || contact.email,
      phone: pi.phone || contact.phone,
      linkedin: pi.linkedin || contact.linkedin,
      github: pi.github || contact.github,
      website: pi.website || contact.website,
    });

    setShowImportModal(false);
    toast.success('CV-data importerad! Granska och justera fälten.');
  };

  // Parse pasted CV text with AI and populate fields
  const handleParseCvText = async () => {
    if (!importCvText.trim()) {
      toast.error('Klistra in din CV-text först');
      return;
    }
    setIsImporting(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'parse-cv',
          context: { text: importCvText },
        }),
      });
      if (!response.ok) throw new Error('Parse failed');
      const data = await response.json();

      // The AI returns JSON as the content string — parse it
      let parsed;
      try {
        parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      } catch {
        toast.error('Kunde inte tolka AI-svaret. Försök igen.');
        return;
      }

      // Map parsed data into editor state
      setProfile({
        ...profile,
        fullName: parsed.fullName || profile.fullName,
        title: parsed.title || profile.title,
        tagline: parsed.title || profile.tagline,
        bio: parsed.bio || profile.bio,
        location: parsed.location || profile.location,
      });

      if (parsed.experience?.length > 0) {
        setTimeline(prev => [
          ...prev.filter(t => t.type !== 'work'),
          ...parsed.experience.map((e: any, i: number) => ({
            id: generateId(),
            title: e.title || '',
            subtitle: e.company || '',
            description: e.description || '',
            period: e.period || '',
            type: 'work' as const,
            current: e.current || false,
            achievements: [],
            tags: [],
            order: i,
          })),
        ]);
      }

      if (parsed.education?.length > 0) {
        setTimeline(prev => [
          ...prev.filter(t => t.type !== 'education'),
          ...parsed.education.map((e: any, i: number) => ({
            id: generateId(),
            title: e.degree || '',
            subtitle: e.institution || '',
            description: e.description || '',
            period: e.period || '',
            type: 'education' as const,
            current: false,
            achievements: [],
            tags: [],
            order: i,
          })),
        ]);
      }

      if (parsed.skills?.length > 0) {
        const newTech = parsed.skills
          .filter((s: string) => !techStack.some(t => t.name.toLowerCase() === s.toLowerCase()))
          .map((s: string) => ({
            name: s,
            icon: s.toLowerCase().replace(/[.\s]/g, ''),
            category: 'tools' as const,
            proficiency: 'intermediate' as const,
          }));
        setTechStack(prev => [...prev, ...newTech]);
      }

      if (parsed.projects?.length > 0) {
        const newProjects = parsed.projects.map((p: any, i: number) => ({
          id: generateId(),
          name: p.name || '',
          description: p.description || '',
          tags: p.tags || [],
          links: { live: p.url || '' },
          featured: i === 0,
          order: i,
        }));
        setProjects(prev => [...prev, ...newProjects]);
      }

      setContact({
        ...contact,
        email: parsed.email || contact.email,
        phone: parsed.phone || contact.phone,
        linkedin: parsed.linkedin || contact.linkedin,
        github: parsed.github || contact.github,
        website: parsed.website || contact.website,
      });

      setShowImportModal(false);
      setImportCvText('');
      toast.success('CV analyserad och importerad! 🎉 Granska alla fält.');
    } catch (error) {
      toast.error('Kunde inte analysera CV-texten. Försök igen.');
    } finally {
      setIsImporting(false);
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
    <div className="min-h-screen bg-gray-100" data-testid="portfolio-editor">
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              leftIcon={<Eye className="h-4 w-4" />}
            >
              {showPreview ? 'Dölj preview' : 'Visa preview'}
            </Button>

            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>
                Öppna
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

      {/* Content - Two column layout */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-[1fr,400px]' : ''}`}>
          {/* Left column - Form */}
          <div>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Import from CV Banner */}
                <Card className="p-5 border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Download className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Importera från CV</h3>
                        <p className="text-sm text-gray-600">
                          {userCvs.length > 0
                            ? 'Fyll i portfolion med data från ditt befintliga CV'
                            : 'Klistra in din CV-text så fyller vi i automatiskt med AI'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImportModal(true)}
                      leftIcon={<FileText className="h-4 w-4" />}
                    >
                      Importera
                    </Button>
                  </div>
                </Card>

                {/* Import Modal */}
                {showImportModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-gray-900">Importera CV-data</h2>
                          <button
                            onClick={() => { setShowImportModal(false); setImportCvText(''); }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Option 1: Import from existing CV */}
                        {userCvs.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Från ditt sparade CV</h3>
                            <div className="space-y-2">
                              {userCvs.map((cv) => (
                                <button
                                  key={cv.id}
                                  onClick={() => handleImportFromCv(cv)}
                                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all text-left"
                                >
                                  <FileText className="h-5 w-5 text-violet-600 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {cv.personal_info?.fullName || cv.name || 'CV'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {cv.personal_info?.title || 'Ingen titel'} • Uppdaterad {new Date(cv.updated_at).toLocaleDateString('sv-SE')}
                                    </p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-gray-400" />
                                </button>
                              ))}
                            </div>

                            <div className="relative my-6">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                              </div>
                              <div className="relative flex justify-center">
                                <span className="px-3 bg-white text-sm text-gray-500">eller</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Option 2: Paste CV text */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Klistra in CV-text</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Kopiera texten från ditt CV (PDF, Word, LinkedIn) och klistra in nedan.
                            AI:n analyserar och fyller i alla fält automatiskt.
                          </p>
                          <Textarea
                            value={importCvText}
                            onChange={(e) => setImportCvText(e.target.value)}
                            placeholder={`Klistra in din CV-text här...\n\nExempel:\nSaid Borna\nDevOps Engineer\nStockholm, Sverige\n\nErfarenhet:\n• Cloud Engineer på Company AB (2024 – Pågående)\n  Arbetade med AWS, Terraform, Kubernetes...\n\nUtbildning:\n• Systemutvecklare .NET, Chas Academy (2023 – 2025)\n\nSkills: Docker, Kubernetes, AWS, Python, CI/CD`}
                            rows={10}
                            className="font-mono text-sm"
                          />
                          <div className="flex justify-end mt-3">
                            <Button
                              onClick={handleParseCvText}
                              isLoading={isImporting}
                              leftIcon={<Sparkles className="h-4 w-4" />}
                              disabled={!importCvText.trim()}
                            >
                              {isImporting ? 'Analyserar...' : 'Analysera med AI'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Vad söker du?</h2>
                  </div>

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

                {/* Navigation */}
                <div className="flex justify-end pt-2">
                  <Button onClick={nextTab} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Nästa: Projekt
                  </Button>
                </div>
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

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Beskrivning</label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateProjectDesc(project.id)}
                              isLoading={generatingFor === project.id}
                              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                              disabled={credits < CREDIT_COSTS.bio || !project.name}
                            >
                              AI-generera
                            </Button>
                          </div>
                          <Textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, { description: e.target.value })}
                            rows={3}
                            placeholder="Beskriv projektet, tekniska utmaningar och lösningar..."
                          />
                        </div>

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

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prevTab} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Profil
                  </Button>
                  <Button onClick={nextTab} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Nästa: Timeline
                  </Button>
                </div>
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
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                          {[
                            { value: 'education', label: '🎓 Utbildning' },
                            { value: 'work', label: '💼 Arbete' },
                            { value: 'project', label: '🚀 Projekt' },
                            { value: 'achievement', label: '🏆 Prestation' },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateTimelineEntry(entry.id, { type: opt.value as TimelineEntry['type'] })}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${entry.type === opt.value
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
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
                          placeholder={entry.type === 'education' ? 'T.ex. Systemutvecklare .NET' : 'T.ex. Frontend Developer'}
                        />
                        <Input
                          label="Organisation"
                          value={entry.subtitle}
                          onChange={(e) => updateTimelineEntry(entry.id, { subtitle: e.target.value })}
                          placeholder={entry.type === 'education' ? 'T.ex. Chas Academy' : 'T.ex. Företag AB'}
                        />
                        <Input
                          label="Period"
                          value={entry.period}
                          onChange={(e) => updateTimelineEntry(entry.id, { period: e.target.value })}
                          placeholder="Sep 2025 – Pågående"
                        />
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Beskrivning</label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateTimelineDesc(entry.id)}
                              isLoading={generatingFor === entry.id}
                              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                              disabled={credits < CREDIT_COSTS.bio || !entry.title}
                            >
                              AI-generera
                            </Button>
                          </div>
                          <Textarea
                            value={entry.description}
                            onChange={(e) => updateTimelineEntry(entry.id, { description: e.target.value })}
                            rows={2}
                            placeholder="Beskriv dina ansvarsområden, kurser eller achievements..."
                          />
                        </div>
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

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prevTab} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Projekt
                  </Button>
                  <Button onClick={nextTab} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Nästa: Skills
                  </Button>
                </div>
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
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isSelected
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Lägg till egen skill</h2>
                  <div className="flex gap-2">
                    <Input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="T.ex. Terraform, Figma, Agile..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    />
                    <Button onClick={addCustomSkill} disabled={!customSkill.trim()}>
                      Lägg till
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Valda skills ({techStack.length})</h2>
                  {techStack.length === 0 ? (
                    <p className="text-gray-500 text-sm">Välj skills ovan eller lägg till egna</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech) => (
                        <button
                          key={tech.name}
                          onClick={() => setTechStack(techStack.filter(t => t.name !== tech.name))}
                          className="group flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-medium hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          {tech.name}
                          <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prevTab} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Timeline
                  </Button>
                  <Button onClick={nextTab} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Nästa: Kontakt
                  </Button>
                </div>
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

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prevTab} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Skills
                  </Button>
                  <Button onClick={nextTab} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Nästa: Design
                  </Button>
                </div>
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
                            className={`w-10 h-10 rounded-full transition-all ${settings.primaryColor === color
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

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prevTab} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Kontakt
                  </Button>
                  <Button onClick={handleSave} leftIcon={<Save className="h-4 w-4" />} isLoading={isSaving}>
                    Spara portfolio
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Live Preview */}
          {showPreview && (
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">Live Preview</h3>
                      <span className="text-sm text-gray-500">•</span>
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="text-sm font-medium text-violet-600 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0 pr-6"
                      >
                        {PORTFOLIO_TEMPLATES_V2.slice(0, 15).map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl">
                    <PortfolioPreviewV2
                      templateId={selectedTemplateId}
                      data={previewData}
                      scale={0.32}
                    />
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Preview uppdateras medan du redigerar
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
