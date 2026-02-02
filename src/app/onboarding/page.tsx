'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { PortfolioPreview, TemplateCard } from '@/components/preview';
import { usePortfolyoStore } from '@/lib/store';
import { TECH_STACK_OPTIONS } from '@/lib/types';
import { 
  ALL_PORTFOLIO_TEMPLATES, 
  getPortfolioTemplatesForTier,
  getPortfolioTemplateById,
  TEMPLATE_COUNTS,
  type PortfolioTemplateConfig,
} from '@/lib/templates';
import type { OnboardingEducation, OnboardingExperience, OnboardingProject } from '@/lib/types';
import { generateId } from '@/lib/utils';

const {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Check,
  MapPin,
  Mail,
  Phone,
  Zap,
  Eye,
  Palette,
  Star,
} = Icons;

const STEPS = ['Info', 'Bakgrund', 'Erfarenhet', 'Skills', 'Mål', 'Design'];

const SITUATIONS = [
  { value: 'student', label: 'Student' },
  { value: 'job-seeking', label: 'Arbetssökande' },
  { value: 'employed', label: 'Anställd' },
  { value: 'freelance', label: 'Frilans' },
];

const EXPERIENCE_OPTIONS = [
  { value: '0-1', label: '0-1 år' },
  { value: '1-3', label: '1-3 år' },
  { value: '3-5', label: '3-5 år' },
  { value: '5-10', label: '5-10 år' },
  { value: '10+', label: '10+ år' },
];

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'Alla' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Kreativ' },
  { id: 'professional', label: 'Professionell' },
  { id: 'bold', label: 'Modig' },
  { id: 'elegant', label: 'Elegant' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { onboarding, updateOnboarding, completeOnboarding, login, addCredits, user } = usePortfolyoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [templateCategory, setTemplateCategory] = useState('all');

  // Form states
  const [fullName, setFullName] = useState(onboarding.fullName);
  const [email, setEmail] = useState(onboarding.email);
  const [phone, setPhone] = useState(onboarding.phone || '');
  const [title, setTitle] = useState(onboarding.title);
  const [location, setLocation] = useState(onboarding.location || '');
  const [currentSituation, setCurrentSituation] = useState(onboarding.currentSituation);
  const [yearsExperience, setYearsExperience] = useState(onboarding.yearsExperience);
  const [targetRole, setTargetRole] = useState(onboarding.targetRole);
  const [educations, setEducations] = useState<OnboardingEducation[]>(onboarding.educations.length > 0 ? onboarding.educations : [{ institution: '', degree: '', field: '', startDate: '', endDate: '', current: false }]);
  const [experiences, setExperiences] = useState<OnboardingExperience[]>(onboarding.experiences);
  const [topSkills, setTopSkills] = useState<string[]>(onboarding.topSkills);
  const [learningSkills, setLearningSkills] = useState<string[]>(onboarding.learningSkills);
  const [projects, setProjects] = useState<OnboardingProject[]>(onboarding.projects);
  const [seekingType, setSeekingType] = useState(onboarding.seekingType);
  const [seekingPeriod, setSeekingPeriod] = useState(onboarding.seekingPeriod);
  const [seekingLocation, setSeekingLocation] = useState(onboarding.seekingLocation);
  const [interests, setInterests] = useState<string[]>(onboarding.interests);
  const [selectedTemplateId, setSelectedTemplateId] = useState('developer-dark');

  const userTier = user?.plan || 'free';
  
  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (templateCategory === 'all') return ALL_PORTFOLIO_TEMPLATES;
    return ALL_PORTFOLIO_TEMPLATES.filter(t => t.category === templateCategory);
  }, [templateCategory]);

  // Get selected template
  const selectedTemplate = useMemo(() => 
    getPortfolioTemplateById(selectedTemplateId) || ALL_PORTFOLIO_TEMPLATES[0],
    [selectedTemplateId]
  );

  // Check if template is available for user
  const isTemplateAvailable = (template: PortfolioTemplateConfig) => {
    const tierHierarchy = { free: 0, starter: 1, pro: 2 };
    return tierHierarchy[template.tier] <= tierHierarchy[userTier];
  };

  // Preview data that updates in real-time
  const previewData = useMemo(() => ({
    fullName,
    title,
    tagline: `${title} | ${currentSituation === 'student' ? 'Student' : targetRole || 'Professional'}`,
    bio: '',
    location,
    email,
    phone,
    skills: topSkills,
    projects: projects.map(p => ({
      name: p.name,
      description: p.description,
      tags: p.technologies,
    })),
    experience: experiences.map(e => ({
      title: e.title,
      company: e.company,
      period: `${e.startDate} - ${e.current ? 'Nu' : e.endDate}`,
      current: e.current,
    })),
    education: educations.filter(e => e.institution).map(e => ({
      degree: e.degree,
      institution: e.institution,
      period: `${e.startDate} - ${e.current ? 'Nu' : e.endDate}`,
    })),
    seeking: seekingType,
  }), [fullName, title, currentSituation, targetRole, location, email, phone, topSkills, projects, experiences, educations, seekingType]);

  const handleNext = () => {
    if (step === 0 && !fullName) {
      toast.error('Ange ditt namn');
      return;
    }
    if (step === 0 && !email) {
      toast.error('Ange din e-post');
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      { institution: '', degree: '', field: '', startDate: '', endDate: '', current: false },
    ]);
  };

  const updateEducation = (index: number, updates: Partial<OnboardingEducation>) => {
    setEducations(educations.map((edu, i) => 
      i === index ? { ...edu, ...updates } : edu
    ));
  };

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: '', title: '', startDate: '', endDate: '', current: false, description: '' },
    ]);
  };

  const updateExperience = (index: number, updates: Partial<OnboardingExperience>) => {
    setExperiences(experiences.map((exp, i) => 
      i === index ? { ...exp, ...updates } : exp
    ));
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { name: '', description: '', url: '', technologies: [] },
    ]);
  };

  const updateProject = (index: number, updates: Partial<OnboardingProject>) => {
    setProjects(projects.map((proj, i) => 
      i === index ? { ...proj, ...updates } : proj
    ));
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const toggleSkill = (skill: string, isTop: boolean) => {
    if (isTop) {
      if (topSkills.includes(skill)) {
        setTopSkills(topSkills.filter(s => s !== skill));
      } else if (topSkills.length < 12) {
        setTopSkills([...topSkills, skill]);
      }
    } else {
      if (learningSkills.includes(skill)) {
        setLearningSkills(learningSkills.filter(s => s !== skill));
      } else if (learningSkills.length < 6) {
        setLearningSkills([...learningSkills, skill]);
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Create user account
      login({
        id: generateId(),
        email,
        name: fullName,
        plan: 'free',
        credits: 3,
        creditsUsed: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      addCredits(3);

      // Update onboarding data
      updateOnboarding({
        fullName,
        email,
        phone,
        title,
        location,
        currentSituation,
        yearsExperience,
        targetRole,
        educations,
        experiences,
        topSkills,
        learningSkills,
        projects,
        seekingType,
        seekingPeriod,
        seekingLocation,
        interests,
        template: 'developer',
        primaryColor: selectedTemplate.colors.primary,
      });

      // Create portfolio
      const portfolio = completeOnboarding();
      
      toast.success('🎉 Din portfolio är skapad!');
      router.push(`/portfolio/${portfolio.id}/edit`);
    } catch (error) {
      toast.error('Något gick fel. Försök igen.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-700 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">PORTFOLYO</span>
          </Link>
          
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
              Steg {step + 1} av {STEPS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {/* Form Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 0: Basic Info */}
                {step === 0 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-violet-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Låt oss lära känna dig
                      </h2>
                      <p className="text-gray-600">
                        Grundläggande info för din portfolio
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Fullständigt namn *"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Said Borna"
                        leftIcon={<User className="h-4 w-4" />}
                      />
                      <Input
                        label="E-post *"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="said@example.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                      />
                      <Input
                        label="Telefon"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="070-123 45 67"
                        leftIcon={<Phone className="h-4 w-4" />}
                      />
                      <Input
                        label="Titel / Roll"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Fullstack Developer"
                      />
                      <Input
                        label="Plats"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Stockholm, Sverige"
                        leftIcon={<MapPin className="h-4 w-4" />}
                      />
                      <Select
                        label="Nuvarande situation"
                        value={currentSituation}
                        onChange={(e) => setCurrentSituation(e.target.value as typeof currentSituation)}
                        options={SITUATIONS}
                      />
                    </div>
                  </Card>
                )}

                {/* Step 1: Background */}
                {step === 1 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Din bakgrund
                      </h2>
                      <p className="text-gray-600">
                        Utbildning och akademisk bakgrund
                      </p>
                    </div>

                    <div className="space-y-6">
                      {educations.map((edu, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl relative">
                          {educations.length > 1 && (
                            <button
                              onClick={() => removeEducation(index)}
                              className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <div className="space-y-3">
                            <Input
                              label="Lärosäte"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, { institution: e.target.value })}
                              placeholder="Stockholms universitet"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Examen"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, { degree: e.target.value })}
                                placeholder="Kandidat"
                              />
                              <Input
                                label="Inriktning"
                                value={edu.field}
                                onChange={(e) => updateEducation(index, { field: e.target.value })}
                                placeholder="Systemutveckling"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Startdatum"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                                placeholder="Aug 2021"
                              />
                              <Input
                                label="Slutdatum"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(index, { endDate: e.target.value })}
                                placeholder="Jun 2024"
                                disabled={edu.current}
                              />
                            </div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={edu.current}
                                onChange={(e) => updateEducation(index, { current: e.target.checked })}
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
                {step === 2 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Erfarenhet & Projekt
                      </h2>
                      <p className="text-gray-600">
                        Jobb, praktik och personliga projekt
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 mb-4">Arbetslivserfarenhet</h3>
                      <div className="space-y-4">
                        {experiences.map((exp, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl relative">
                            <button
                              onClick={() => removeExperience(index)}
                              className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  label="Företag"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, { company: e.target.value })}
                                  placeholder="Tech AB"
                                />
                                <Input
                                  label="Roll"
                                  value={exp.title}
                                  onChange={(e) => updateExperience(index, { title: e.target.value })}
                                  placeholder="Developer"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  label="Start"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(index, { startDate: e.target.value })}
                                  placeholder="Jan 2023"
                                />
                                <Input
                                  label="Slut"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(index, { endDate: e.target.value })}
                                  placeholder="Dec 2023"
                                  disabled={exp.current}
                                />
                              </div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) => updateExperience(index, { current: e.target.checked })}
                                  className="rounded border-gray-300 text-violet-600"
                                />
                                <span className="text-sm text-gray-600">Pågående</span>
                              </label>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={addExperience}
                          leftIcon={<Plus className="h-4 w-4" />}
                          className="w-full"
                          size="sm"
                        >
                          Lägg till erfarenhet
                        </Button>
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Projekt</h3>
                      <div className="space-y-4">
                        {projects.map((proj, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl relative">
                            <button
                              onClick={() => removeProject(index)}
                              className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="space-y-3">
                              <Input
                                label="Projektnamn"
                                value={proj.name}
                                onChange={(e) => updateProject(index, { name: e.target.value })}
                                placeholder="Min Awesome App"
                              />
                              <Textarea
                                label="Beskrivning"
                                value={proj.description}
                                onChange={(e) => updateProject(index, { description: e.target.value })}
                                placeholder="Kort beskrivning av projektet..."
                                rows={2}
                              />
                              <Input
                                label="URL"
                                value={proj.url}
                                onChange={(e) => updateProject(index, { url: e.target.value })}
                                placeholder="https://..."
                              />
                              <Input
                                label="Teknologier (kommaseparerade)"
                                value={proj.technologies.join(', ')}
                                onChange={(e) => updateProject(index, { 
                                  technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                })}
                                placeholder="React, Node.js, PostgreSQL"
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={addProject}
                          leftIcon={<Plus className="h-4 w-4" />}
                          className="w-full"
                          size="sm"
                        >
                          Lägg till projekt
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Step 3: Skills */}
                {step === 3 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Code className="h-8 w-8 text-amber-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Dina skills
                      </h2>
                      <p className="text-gray-600">
                        Välj dina starkaste kompetenser (max 12)
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Starkaste skills ({topSkills.length}/12)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACK_OPTIONS.map((skill) => {
                          const isSelected = topSkills.includes(skill.name);
                          return (
                            <button
                              key={skill.name}
                              onClick={() => toggleSkill(skill.name, true)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                isSelected
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

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Lär dig just nu ({learningSkills.length}/6)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACK_OPTIONS.filter(s => !topSkills.includes(s.name)).map((skill) => {
                          const isSelected = learningSkills.includes(skill.name);
                          return (
                            <button
                              key={skill.name}
                              onClick={() => toggleSkill(skill.name, false)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {skill.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Step 4: Goals */}
                {step === 4 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-pink-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Vad söker du?
                      </h2>
                      <p className="text-gray-600">
                        Låt arbetsgivare veta vad du letar efter
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Select
                        label="Typ av möjlighet"
                        value={seekingType}
                        onChange={(e) => setSeekingType(e.target.value)}
                        options={[
                          { value: '', label: 'Välj...' },
                          { value: 'LIA', label: 'LIA-plats' },
                          { value: 'praktik', label: 'Praktik' },
                          { value: 'heltid', label: 'Heltidsjobb' },
                          { value: 'deltid', label: 'Deltidsjobb' },
                          { value: 'freelance', label: 'Freelance-uppdrag' },
                          { value: 'sommarjobb', label: 'Sommarjobb' },
                        ]}
                      />
                      <Input
                        label="Önskad roll"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Fullstack Developer"
                      />
                      <Input
                        label="Tidsperiod"
                        value={seekingPeriod}
                        onChange={(e) => setSeekingPeriod(e.target.value)}
                        placeholder="Februari - Juni 2026"
                      />
                      <Input
                        label="Plats / Remote"
                        value={seekingLocation}
                        onChange={(e) => setSeekingLocation(e.target.value)}
                        placeholder="Stockholm eller Remote"
                      />
                      <Select
                        label="År av erfarenhet"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        options={EXPERIENCE_OPTIONS}
                      />
                    </div>
                  </Card>
                )}

                {/* Step 5: Design / Template Selection */}
                {step === 5 && (
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Palette className="h-8 w-8 text-violet-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Välj din template
                      </h2>
                      <p className="text-gray-600">
                        {TEMPLATE_COUNTS.portfolio.free} gratis • {TEMPLATE_COUNTS.portfolio.starter} med Starter • {TEMPLATE_COUNTS.portfolio.pro} med Pro
                      </p>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {TEMPLATE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setTemplateCategory(cat.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            templateCategory === cat.id
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
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

                    {/* Upgrade prompt for locked templates */}
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
                disabled={step === 0}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Tillbaka
              </Button>

              {step < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Nästa
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  isLoading={isLoading}
                  rightIcon={<Check className="h-4 w-4" />}
                  disabled={!isTemplateAvailable(selectedTemplate)}
                >
                  Skapa min portfolio
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
                    <h3 className="font-semibold text-gray-900">Live Preview</h3>
                    <Badge variant="primary" size="sm">
                      {selectedTemplate.name}
                    </Badge>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl" style={{ height: '500px' }}>
                    <PortfolioPreview
                      template={selectedTemplate}
                      data={previewData}
                      scale={0.35}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Preview uppdateras medan du fyller i
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
