'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  Badge,
  StepIndicator,
  Icons,
} from '@/components/ui';
import { CVPreview, CVPreviewV2, TemplateCard } from '@/components/preview';
import { usePortfolyoStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { TECH_STACK_OPTIONS } from '@/lib/types';
import {
  CV_TEMPLATES_V2,
  getCVTemplateV2,
  TEMPLATE_COUNTS,
  type CVTemplateConfigV2,
} from '@/lib/templates';

const {
  ArrowLeft,
  ArrowRight,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Palette,
  Plus,
  X,
  Eye,
  Check,
  Zap,
  Mail,
  Phone,
  MapPin,
  Globe,
} = Icons;

const STEPS = ['Info', 'Utbildning', 'Erfarenhet', 'Skills', 'Design'];

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'Alla' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Kreativ' },
  { id: 'professional', label: 'Professionell' },
  { id: 'bold', label: 'Modig' },
  { id: 'elegant', label: 'Elegant' },
];

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface SkillCategory {
  name: string;
  skills: string[];
}

function NewCVPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createCV, isAuthenticated, user } = usePortfolyoStore();

  // Get template from URL if provided
  const urlTemplate = searchParams.get('template');

  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [templateCategory, setTemplateCategory] = useState('all');

  // Personal info state
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [summary, setSummary] = useState('');

  // Education state
  const [education, setEducation] = useState<EducationEntry[]>([
    { id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false },
  ]);

  // Experience state
  const [experience, setExperience] = useState<ExperienceEntry[]>([
    { id: generateId(), company: '', title: '', startDate: '', endDate: '', current: false, description: '', achievements: [] },
  ]);

  // Skills state
  const [skills, setSkills] = useState<SkillCategory[]>([
    { name: 'Programmering', skills: [] },
    { name: 'Verktyg & Ramverk', skills: [] },
    { name: 'Språk', skills: [] },
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Template state - default to said-dark
  const [selectedTemplateId, setSelectedTemplateId] = useState('said-dark');

  const userTier = user?.plan || 'free';

  // Sync template from URL parameter
  useEffect(() => {
    if (urlTemplate && CV_TEMPLATES_V2.some(t => t.id === urlTemplate)) {
      setSelectedTemplateId(urlTemplate);
    }
  }, [urlTemplate]);

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (templateCategory === 'all') return CV_TEMPLATES_V2;
    return CV_TEMPLATES_V2.filter(t => t.category === templateCategory);
  }, [templateCategory]);

  // Get selected template
  const selectedTemplate = useMemo(() =>
    getCVTemplateV2(selectedTemplateId),
    [selectedTemplateId]
  );

  // Check if template is available
  const isTemplateAvailable = (template: CVTemplateConfigV2) => {
    const tierHierarchy = { free: 0, starter: 1, pro: 2 };
    return tierHierarchy[template.tier] <= tierHierarchy[userTier];
  };

  // Preview data that updates in real-time
  const previewData = useMemo(() => ({
    fullName,
    title,
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    summary,
    education: education.filter(e => e.institution).map(e => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field,
      startDate: e.startDate,
      endDate: e.current ? 'Nu' : e.endDate,
      current: e.current,
      gpa: e.gpa,
    })),
    experience: experience.filter(e => e.company || e.title).map(e => ({
      company: e.company,
      title: e.title,
      startDate: e.startDate,
      endDate: e.current ? 'Nu' : e.endDate,
      current: e.current,
      description: e.description,
      achievements: e.achievements,
    })),
    skills: skills.filter(s => s.skills.length > 0).map(s => ({
      name: s.name,
      skills: s.skills,
    })),
    allSkills: selectedSkills,
  }), [fullName, title, email, phone, location, linkedin, github, website, summary, education, experience, skills, selectedSkills]);

  const handleNext = () => {
    if (currentStep === 0 && !fullName) {
      toast.error('Ange ditt namn');
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Education helpers
  const addEducation = () => {
    setEducation([
      ...education,
      { id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false },
    ]);
  };

  const updateEducation = (id: string, updates: Partial<EducationEntry>) => {
    setEducation(education.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(e => e.id !== id));
    }
  };

  // Experience helpers
  const addExperience = () => {
    setExperience([
      ...experience,
      { id: generateId(), company: '', title: '', startDate: '', endDate: '', current: false, description: '', achievements: [] },
    ]);
  };

  const updateExperience = (id: string, updates: Partial<ExperienceEntry>) => {
    setExperience(experience.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeExperience = (id: string) => {
    if (experience.length > 1) {
      setExperience(experience.filter(e => e.id !== id));
    }
  };

  // Skills helpers
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 20) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const updateSkillCategory = (index: number, newSkills: string[]) => {
    setSkills(skills.map((s, i) => i === index ? { ...s, skills: newSkills } : s));
  };

  const handleCreate = async () => {
    if (!fullName) {
      toast.error('Ange ditt namn');
      return;
    }

    if (!isTemplateAvailable(selectedTemplate)) {
      toast.error('Uppgradera för att använda denna template');
      return;
    }

    setIsCreating(true);
    try {
      const cv = createCV({
        name: `${fullName}s CV`,
        template: selectedTemplate.id as 'modern' | 'classic' | 'minimal' | 'creative',
        personalInfo: {
          fullName,
          title,
          email,
          phone: phone || undefined,
          location: location || undefined,
          linkedin: linkedin || undefined,
          github: github || undefined,
        },
        summary,
        experience: experience
          .filter(e => e.company || e.title)
          .map((e, i) => ({
            id: e.id,
            company: e.company,
            title: e.title,
            startDate: e.startDate,
            endDate: e.current ? undefined : e.endDate,
            current: e.current,
            description: e.description,
            achievements: e.achievements,
            order: i,
          })),
        education: education
          .filter(e => e.institution || e.degree)
          .map((e, i) => ({
            id: e.id,
            institution: e.institution,
            degree: e.degree,
            field: e.field,
            startDate: e.startDate,
            endDate: e.current ? undefined : e.endDate,
            current: e.current,
            order: i,
          })),
        skills: skills
          .filter(s => s.skills.length > 0)
          .map(s => ({
            name: s.name,
            skills: s.skills,
          })),
        settings: {
          primaryColor: selectedTemplate.accent,
          showPhoto: false,
          pageSize: 'a4',
          fontSize: 'medium',
        },
      });

      toast.success('🎉 CV skapat!');
      router.push(`/cv/${cv.id}/edit`);
    } catch (error) {
      toast.error('Kunde inte skapa CV');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FileText className="h-12 w-12 text-violet-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Skapa konto först</h2>
          <p className="text-gray-600 mb-4">Du behöver ett konto för att skapa CV:n</p>
          <Link href="/onboarding">
            <Button>Kom igång gratis</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Tillbaka</span>
          </Link>

          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-violet-600" />
            <span className="font-bold text-gray-900">Nytt CV</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              leftIcon={<Eye className="h-4 w-4" />}
            >
              {showPreview ? 'Dölj' : 'Visa'} preview
            </Button>
            <span className="text-sm text-gray-500">
              Steg {currentStep + 1} av {STEPS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 0: Personal Info */}
                {currentStep === 0 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-violet-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Personlig information
                      </h2>
                      <p className="text-gray-600">
                        Grundläggande info för ditt CV
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Fullständigt namn *"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Anna Andersson"
                        leftIcon={<User className="h-4 w-4" />}
                      />
                      <Input
                        label="Titel / Roll"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Fullstack Developer"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="E-post"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="anna@example.com"
                          leftIcon={<Mail className="h-4 w-4" />}
                        />
                        <Input
                          label="Telefon"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="070-123 45 67"
                          leftIcon={<Phone className="h-4 w-4" />}
                        />
                      </div>
                      <Input
                        label="Plats"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Stockholm, Sverige"
                        leftIcon={<MapPin className="h-4 w-4" />}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="LinkedIn"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/anna"
                        />
                        <Input
                          label="GitHub"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="github.com/anna"
                        />
                      </div>
                      <Input
                        label="Webbplats"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="anna.se"
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                      <Textarea
                        label="Sammanfattning / Profil"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="En kort sammanfattning av dig och din bakgrund..."
                        rows={3}
                      />
                    </div>
                  </Card>
                )}

                {/* Step 1: Education */}
                {currentStep === 1 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Utbildning
                      </h2>
                      <p className="text-gray-600">
                        Din akademiska bakgrund
                      </p>
                    </div>

                    <div className="space-y-6">
                      {education.map((edu, index) => (
                        <div key={edu.id} className="p-4 bg-gray-50 rounded-xl relative">
                          {education.length > 1 && (
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <div className="space-y-3">
                            <Input
                              label="Lärosäte"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                              placeholder="Stockholms universitet"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Examen"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                placeholder="Kandidatexamen"
                              />
                              <Input
                                label="Inriktning"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                                placeholder="Systemutveckling"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Start"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                placeholder="Aug 2021"
                              />
                              <Input
                                label="Slut"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                placeholder="Jun 2024"
                                disabled={edu.current}
                              />
                            </div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={edu.current}
                                onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                                className="rounded border-gray-300 text-violet-600"
                              />
                              <span className="text-sm text-gray-600">Pågående</span>
                            </label>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={addEducation}
                        leftIcon={<Plus className="h-4 w-4" />}
                        className="w-full"
                      >
                        Lägg till utbildning
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Step 2: Experience */}
                {currentStep === 2 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Arbetslivserfarenhet
                      </h2>
                      <p className="text-gray-600">
                        Jobb, praktik och relevanta erfarenheter
                      </p>
                    </div>

                    <div className="space-y-6">
                      {experience.map((exp, index) => (
                        <div key={exp.id} className="p-4 bg-gray-50 rounded-xl relative">
                          {experience.length > 1 && (
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Företag"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                placeholder="Tech AB"
                              />
                              <Input
                                label="Roll / Titel"
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                                placeholder="Developer"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Start"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                placeholder="Jan 2023"
                              />
                              <Input
                                label="Slut"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                placeholder="Dec 2023"
                                disabled={exp.current}
                              />
                            </div>
                            <Textarea
                              label="Beskrivning"
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                              placeholder="Beskriv dina huvudsakliga ansvarsområden och uppgifter..."
                              rows={3}
                            />
                            <Input
                              label="Nyckelresultat (separera med komma)"
                              value={exp.achievements.join(', ')}
                              onChange={(e) => updateExperience(exp.id, {
                                achievements: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                              })}
                              placeholder="Ökade konvertering med 25%, Ledde team på 5 personer"
                            />
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                                className="rounded border-gray-300 text-violet-600"
                              />
                              <span className="text-sm text-gray-600">Nuvarande position</span>
                            </label>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={addExperience}
                        leftIcon={<Plus className="h-4 w-4" />}
                        className="w-full"
                      >
                        Lägg till erfarenhet
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Step 3: Skills */}
                {currentStep === 3 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-amber-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Kompetenser
                      </h2>
                      <p className="text-gray-600">
                        Välj dina starkaste färdigheter (max 20)
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Välj skills ({selectedSkills.length}/20)
                        </h3>
                        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                          {TECH_STACK_OPTIONS.map((skill) => {
                            const isSelected = selectedSkills.includes(skill.name);
                            return (
                              <button
                                key={skill.name}
                                onClick={() => toggleSkill(skill.name)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isSelected
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {skill.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom skill categories */}
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Kategoriserade skills (valfritt)
                        </h3>
                        <div className="space-y-4">
                          {skills.map((category, index) => (
                            <div key={index} className="space-y-2">
                              <Input
                                label={`Kategori ${index + 1}`}
                                value={category.name}
                                onChange={(e) => {
                                  const newSkills = [...skills];
                                  newSkills[index].name = e.target.value;
                                  setSkills(newSkills);
                                }}
                                placeholder="T.ex. Programmering"
                              />
                              <Input
                                value={category.skills.join(', ')}
                                onChange={(e) => updateSkillCategory(index,
                                  e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                )}
                                placeholder="Python, JavaScript, React (separera med komma)"
                              />
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSkills([...skills, { name: '', skills: [] }])}
                            leftIcon={<Plus className="h-4 w-4" />}
                          >
                            Lägg till kategori
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Step 4: Design / Template Selection */}
                {currentStep === 4 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Palette className="h-8 w-8 text-violet-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Välj CV-template
                      </h2>
                      <p className="text-gray-600">
                        {TEMPLATE_COUNTS.cv.free} gratis • {TEMPLATE_COUNTS.cv.starter} med Starter • {TEMPLATE_COUNTS.cv.pro} med Pro
                      </p>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {TEMPLATE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setTemplateCategory(cat.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${templateCategory === cat.id
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* ATS badge info */}
                    <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-700">
                        <strong>💡 Tips:</strong> Templates markerade med "ATS" är optimerade för automatiska rekryteringssystem.
                      </p>
                    </div>

                    {/* Template grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
                      {filteredTemplates.slice(0, 30).map((template) => {
                        const available = isTemplateAvailable(template);
                        return (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={selectedTemplateId === template.id}
                            isLocked={!available}
                            onClick={() => available && setSelectedTemplateId(template.id)}
                            size="sm"
                          />
                        );
                      })}
                    </div>

                    {filteredTemplates.length > 30 && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        +{filteredTemplates.length - 30} fler templates tillgängliga med Pro
                      </p>
                    )}

                    {/* Upgrade prompt */}
                    {selectedTemplate && !isTemplateAvailable(selectedTemplate) && (
                      <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-200">
                        <p className="text-sm text-violet-700 mb-2">
                          <strong>{selectedTemplate.name}</strong> kräver {selectedTemplate.tier === 'starter' ? 'Starter' : 'Pro'}-plan
                        </p>
                        <Button
                          size="sm"
                          onClick={() => router.push('/upgrade')}
                          rightIcon={<Zap className="h-4 w-4" />}
                        >
                          Uppgradera för att låsa upp
                        </Button>
                      </div>
                    )}
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Tillbaka
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Nästa
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  isLoading={isCreating}
                  rightIcon={<Check className="h-4 w-4" />}
                  disabled={!isTemplateAvailable(selectedTemplate)}
                >
                  Skapa mitt CV
                </Button>
              )}
            </div>
          </div>

          {/* Live Preview Section */}
          {showPreview && (
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">Live Preview</h3>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm font-medium text-violet-600">{selectedTemplate.name}</span>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl bg-white">
                    <CVPreviewV2
                      templateId={selectedTemplateId}
                      data={previewData}
                      scale={0.55}
                    />
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Preview uppdateras medan du fyller i • A4-format
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

export default function NewCVPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <NewCVPageContent />
    </Suspense>
  );
}
