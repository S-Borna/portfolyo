'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  Badge,
  Tabs,
  CreditDisplay,
  Icons,
} from '@/components/ui';
import { CVLivePreview } from '@/components/preview/LivePreview';
import { TemplateGallery } from '@/components/TemplateGallery';
import { CV_TEMPLATES, getCVTemplateById, getCVTemplatesForTier } from '@/lib/templates';
import { usePortfolyoStore } from '@/lib/store';
import { CREDIT_COSTS } from '@/lib/types';
import type { CVExperience, CVEducation, CVSkillCategory, CV, CVTemplate } from '@/lib/types';
import { generateId } from '@/lib/utils';

const {
  ArrowLeft,
  Save,
  Download,
  Plus,
  X,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Trash2,
  Eye,
  Grid,
} = Icons;

// Get popular templates for quick selection
const QUICK_CV_TEMPLATES = CV_TEMPLATES.filter(t => t.tier === 'free' || t.popular).slice(0, 8);

export default function CVEditorPage() {
  const router = useRouter();
  const params = useParams();
  const cvId = params.id as string;

  const {
    cvs,
    updateCV,
    credits,
    useCredits,
    isAuthenticated,
  } = usePortfolyoStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const cv = cvs.find(c => c.id === cvId);

  // Local state
  const [name, setName] = useState(cv?.name || 'Nytt CV');
  const [template, setTemplate] = useState<CVTemplate>(cv?.template || 'modern');
  const [selectedTemplateId, setSelectedTemplateId] = useState('cv-professional-blue');
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(cv?.personalInfo || {
    fullName: '',
    title: '',
    email: '',
  });
  const [summary, setSummary] = useState(cv?.summary || '');
  const [experience, setExperience] = useState<CVExperience[]>(cv?.experience || []);
  const [education, setEducation] = useState<CVEducation[]>(cv?.education || []);
  const [skills, setSkills] = useState<CVSkillCategory[]>(cv?.skills || []);
  const [settings, setSettings] = useState(cv?.settings || {
    primaryColor: '#8B5CF6',
    showPhoto: false,
    pageSize: 'a4' as const,
    fontSize: 'medium' as const,
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
    if (cv) {
      setName(cv.name);
      setTemplate(cv.template);
      setPersonalInfo(cv.personalInfo);
      setSummary(cv.summary);
      setExperience(cv.experience);
      setEducation(cv.education);
      setSkills(cv.skills);
      setSettings(cv.settings);
    }
  }, [cv]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">CV hittades inte</h2>
          <p className="text-gray-600 mb-4">CV:t du letar efter finns inte.</p>
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
      updateCV(cvId, {
        name,
        template,
        personalInfo,
        summary,
        experience,
        education,
        skills,
        settings,
      });
      toast.success('CV sparat!');
    } catch (error) {
      toast.error('Kunde inte spara');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (credits < CREDIT_COSTS['cv-summary']) {
      toast.error('Inte tillräckligt med credits');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cv-summary',
          context: {
            name: personalInfo.fullName,
            title: personalInfo.title,
            experience: experience,
            education: education,
            skills: skills,
          },
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setSummary(data.content);
      useCredits(CREDIT_COSTS['cv-summary']);
      toast.success('Sammanfattning genererad!');
    } catch (error) {
      toast.error('Kunde inte generera sammanfattning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    toast.success('PDF-export kommer snart!');
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: generateId(),
        company: '',
        title: '',
        startDate: '',
        current: false,
        description: '',
        achievements: [],
        order: experience.length,
      },
    ]);
  };

  const updateExperienceItem = (id: string, updates: Partial<CVExperience>) => {
    setExperience(experience.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(e => e.id !== id));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: generateId(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        current: false,
        order: education.length,
      },
    ]);
  };

  const updateEducationItem = (id: string, updates: Partial<CVEducation>) => {
    setEducation(education.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const addSkillCategory = () => {
    setSkills([
      ...skills,
      {
        name: '',
        skills: [],
      },
    ]);
  };

  const updateSkillCategory = (index: number, updates: Partial<CVSkillCategory>) => {
    setSkills(skills.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  const removeSkillCategory = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'info', label: 'Info', icon: <User className="h-4 w-4" /> },
    { id: 'experience', label: 'Erfarenhet', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'education', label: 'Utbildning', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'skills', label: 'Skills', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'design', label: 'Design', icon: <Eye className="h-4 w-4" /> },
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
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-semibold text-gray-900 border-0 p-0 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditDisplay credits={credits} />

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
              onClick={handleDownloadPDF}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Ladda ner PDF
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <>
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personlig information</h2>

                  <div className="grid gap-4">
                    <Input
                      label="Fullständigt namn"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    />
                    <Input
                      label="Titel"
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                    />
                    <Input
                      label="E-post"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      leftIcon={<Mail className="h-4 w-4" />}
                    />
                    <Input
                      label="Telefon"
                      value={personalInfo.phone || ''}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      leftIcon={<Phone className="h-4 w-4" />}
                    />
                    <Input
                      label="Plats"
                      value={personalInfo.location || ''}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      leftIcon={<MapPin className="h-4 w-4" />}
                    />
                    <Input
                      label="LinkedIn"
                      value={personalInfo.linkedin || ''}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                      leftIcon={<Linkedin className="h-4 w-4" />}
                    />
                    <Input
                      label="GitHub"
                      value={personalInfo.github || ''}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                      leftIcon={<Github className="h-4 w-4" />}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Sammanfattning</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSummary}
                      isLoading={isGenerating}
                      leftIcon={<Sparkles className="h-4 w-4" />}
                      disabled={credits < CREDIT_COSTS['cv-summary']}
                    >
                      AI-generera (1 credit)
                    </Button>
                  </div>

                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="En kort sammanfattning om dig själv och din karriär..."
                    rows={4}
                  />
                </Card>
              </>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Arbetslivserfarenhet</h2>
                  <Button onClick={addExperience} leftIcon={<Plus className="h-4 w-4" />}>
                    Lägg till
                  </Button>
                </div>

                {experience.map((exp, index) => (
                  <Card key={exp.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">Erfarenhet {index + 1}</Badge>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Företag"
                          value={exp.company}
                          onChange={(e) => updateExperienceItem(exp.id, { company: e.target.value })}
                        />
                        <Input
                          label="Titel"
                          value={exp.title}
                          onChange={(e) => updateExperienceItem(exp.id, { title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Startdatum"
                          value={exp.startDate}
                          onChange={(e) => updateExperienceItem(exp.id, { startDate: e.target.value })}
                          placeholder="Jan 2023"
                        />
                        <Input
                          label="Slutdatum"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperienceItem(exp.id, { endDate: e.target.value })}
                          placeholder="Dec 2024"
                          disabled={exp.current}
                        />
                      </div>
                      <Textarea
                        label="Beskrivning"
                        value={exp.description}
                        onChange={(e) => updateExperienceItem(exp.id, { description: e.target.value })}
                        rows={3}
                      />
                      <Textarea
                        label="Achievements (en per rad)"
                        value={exp.achievements.join('\n')}
                        onChange={(e) => updateExperienceItem(exp.id, {
                          achievements: e.target.value.split('\n').filter(Boolean)
                        })}
                        rows={3}
                        placeholder="• Ökade försäljningen med 25%&#10;• Ledde team om 5 personer"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperienceItem(exp.id, { current: e.target.checked })}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-700">Nuvarande jobb</span>
                      </label>
                    </div>
                  </Card>
                ))}

                {experience.length === 0 && (
                  <Card className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Ingen erfarenhet tillagd</h3>
                    <p className="text-gray-600 mb-4">Lägg till din arbetslivserfarenhet</p>
                    <Button onClick={addExperience} leftIcon={<Plus className="h-4 w-4" />}>
                      Lägg till erfarenhet
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Utbildning</h2>
                  <Button onClick={addEducation} leftIcon={<Plus className="h-4 w-4" />}>
                    Lägg till
                  </Button>
                </div>

                {education.map((edu, index) => (
                  <Card key={edu.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">Utbildning {index + 1}</Badge>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4">
                      <Input
                        label="Lärosäte"
                        value={edu.institution}
                        onChange={(e) => updateEducationItem(edu.id, { institution: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Examen"
                          value={edu.degree}
                          onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                        />
                        <Input
                          label="Inriktning"
                          value={edu.field}
                          onChange={(e) => updateEducationItem(edu.id, { field: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Startdatum"
                          value={edu.startDate}
                          onChange={(e) => updateEducationItem(edu.id, { startDate: e.target.value })}
                        />
                        <Input
                          label="Slutdatum"
                          value={edu.endDate || ''}
                          onChange={(e) => updateEducationItem(edu.id, { endDate: e.target.value })}
                          disabled={edu.current}
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducationItem(edu.id, { current: e.target.checked })}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-700">Pågående</span>
                      </label>
                    </div>
                  </Card>
                ))}

                {education.length === 0 && (
                  <Card className="p-12 text-center">
                    <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Ingen utbildning tillagd</h3>
                    <p className="text-gray-600 mb-4">Lägg till din utbildning</p>
                    <Button onClick={addEducation} leftIcon={<Plus className="h-4 w-4" />}>
                      Lägg till utbildning
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Kompetenser</h2>
                  <Button onClick={addSkillCategory} leftIcon={<Plus className="h-4 w-4" />}>
                    Lägg till kategori
                  </Button>
                </div>

                {skills.map((category, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Input
                        value={category.name}
                        onChange={(e) => updateSkillCategory(index, { name: e.target.value })}
                        placeholder="Kategorinamn (t.ex. Programmering)"
                        className="font-semibold"
                      />
                      <button
                        onClick={() => removeSkillCategory(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Input
                      value={category.skills.join(', ')}
                      onChange={(e) => updateSkillCategory(index, {
                        skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Python, JavaScript, React, Node.js"
                      hint="Separera med komma"
                    />
                  </Card>
                ))}

                {skills.length === 0 && (
                  <Card className="p-12 text-center">
                    <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Inga kompetenser tillagda</h3>
                    <p className="text-gray-600 mb-4">Lägg till dina kompetenser kategoriserade</p>
                    <Button onClick={addSkillCategory} leftIcon={<Plus className="h-4 w-4" />}>
                      Lägg till kategori
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* Template Selection */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">CV-mall</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTemplateGallery(true)}
                      leftIcon={<Grid className="h-4 w-4" />}
                    >
                      Se alla 50 mallar
                    </Button>
                  </div>

                  {/* Current template info */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-16 rounded-lg"
                        style={{
                          background: getCVTemplateById(selectedTemplateId)?.colors?.primary || '#1e40af'
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getCVTemplateById(selectedTemplateId)?.name || 'Professional Blue'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getCVTemplateById(selectedTemplateId)?.description || 'Klassisk professionell stil'}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {getCVTemplateById(selectedTemplateId)?.atsOptimized && (
                            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                              ATS-optimerad
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick template selection */}
                  <div className="grid grid-cols-4 gap-3">
                    {QUICK_CV_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplateId(t.id)}
                        className={`relative p-3 rounded-xl border-2 text-left transition-all ${selectedTemplateId === t.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div
                          className="w-full h-8 rounded mb-2"
                          style={{ background: t.colors.primary }}
                        />
                        <h4 className="font-medium text-xs text-gray-900 truncate">{t.name}</h4>
                        {t.tier !== 'free' && (
                          <span className="absolute top-1 right-1 text-[8px] px-1 py-0.5 bg-violet-500 text-white rounded">
                            {t.tier === 'starter' ? 'S' : 'P'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Färg</h2>
                  <div className="flex gap-3">
                    {['#8B5CF6', '#6366F1', '#3B82F6', '#14B8A6', '#10B981', '#F59E0B', '#EF4444', '#1F2937'].map((color) => (
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
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Inställningar</h2>
                  <div className="space-y-4">
                    <Select
                      label="Textstorlek"
                      value={settings.fontSize}
                      onChange={(e) => setSettings({ ...settings, fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                      options={[
                        { value: 'small', label: 'Liten' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Stor' },
                      ]}
                    />
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Live Preview Panel */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <Card className="overflow-hidden h-[calc(100vh-180px)]">
                <CVLivePreview
                  templateId={selectedTemplateId}
                  data={{
                    fullName: personalInfo.fullName,
                    title: personalInfo.title,
                    email: personalInfo.email,
                    phone: personalInfo.phone,
                    location: personalInfo.location,
                    linkedin: personalInfo.linkedin,
                    github: personalInfo.github,
                    summary: summary,
                    experience: experience.map(exp => ({
                      company: exp.company,
                      title: exp.title,
                      startDate: exp.startDate,
                      endDate: exp.endDate,
                      current: exp.current,
                      description: exp.description,
                      achievements: exp.achievements,
                    })),
                    education: education.map(edu => ({
                      institution: edu.institution,
                      degree: edu.degree,
                      field: edu.field,
                      startDate: edu.startDate,
                      endDate: edu.endDate,
                      current: edu.current,
                    })),
                    skills: skills.map(cat => ({
                      name: cat.name,
                      skills: cat.skills,
                    })),
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Template Gallery Modal */}
      {showTemplateGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Välj CV-mall</h2>
                <p className="text-sm text-gray-500">50 professionella mallar att välja mellan</p>
              </div>
              <button
                onClick={() => setShowTemplateGallery(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
              <TemplateGallery
                type="cv"
                selectedId={selectedTemplateId}
                userTier="free"
                onSelect={(templateId) => {
                  setSelectedTemplateId(templateId);
                  setShowTemplateGallery(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
