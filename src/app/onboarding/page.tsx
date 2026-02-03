'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, Card, Badge, Icons } from '@/components/ui';
import type { OnboardingState, CurrentSituation, SeekingType, OnboardingEducation, OnboardingExperience, OnboardingProject } from '@/lib/models';
import { TEMPLATES, getTemplatesForTier, getFamily } from '@/lib/templates/system';
import { TECH_STACK_OPTIONS } from '@/lib/models';

const {
    ArrowRight,
    ArrowLeft,
    Check,
    Plus,
    X,
    Briefcase,
    GraduationCap,
    Zap,
    Palette,
    User,
    MapPin,
    Mail,
    Phone,
    Globe,
    Code,
    Eye,
    Crown,
    FileText,
    Calendar,
    Star,
} = Icons;

// ============================================
// CONFIGURATION
// ============================================

const STEPS = [
    { id: 'basics', title: 'Om dig', icon: User },
    { id: 'content', title: 'Innehåll', icon: FileText },
    { id: 'design', title: 'Design', icon: Palette },
] as const;

const SITUATIONS: Array<{ value: CurrentSituation; label: string; description: string }> = [
    { value: 'student', label: 'Student', description: 'Studerar just nu' },
    { value: 'job-seeking', label: 'Arbetssökande', description: 'Letar efter jobb' },
    { value: 'employed', label: 'Anställd', description: 'Jobbar idag' },
    { value: 'freelance', label: 'Frilansare', description: 'Driver eget' },
];

const SEEKING_TYPES: Array<{ value: SeekingType; label: string }> = [
    { value: 'lia', label: 'LIA-plats' },
    { value: 'job', label: 'Anställning' },
    { value: 'freelance', label: 'Uppdrag' },
];

// ============================================
// COMPONENT
// ============================================

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // State
    const [state, setState] = useState<OnboardingState>({
        step: 0,
        completed: false,
        full_name: '',
        email: '',
        phone: '',
        title: '',
        location: '',
        current_situation: 'student',
        years_experience: '0-1',
        education: [],
        experience: [],
        skills: [],
        projects: [],
        is_seeking: true,
        seeking_type: 'lia',
        seeking_period: '',
        seeking_location: '',
        seeking_interests: [],
        template_id: 'crimson-dark',
    });

    // Check auth
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUserId(user.id);
            setState(prev => ({
                ...prev,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || '',
            }));
        };
        checkAuth();
    }, [router]);

    // Update state helper
    const update = useCallback(<K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
        setState(prev => ({ ...prev, [key]: value }));
    }, []);

    // Navigation
    const canProceed = useMemo(() => {
        if (step === 0) {
            return state.full_name.trim().length > 0 && state.title.trim().length > 0;
        }
        return true;
    }, [step, state.full_name, state.title]);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    // Submit
    const handleComplete = async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const baseUsername = state.full_name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .slice(0, 20) || 'user';
            const username = `${baseUsername}${Date.now().toString(36)}`;

            const { data: portfolio, error } = await supabase
                .from('portfolios')
                .insert({
                    user_id: userId,
                    username: username,
                    template_id: state.template_id,
                    title: state.full_name,
                    tagline: state.title,
                    location: state.location,
                    email: state.email,
                    phone: state.phone,
                    tech_stack: state.skills,
                    projects: state.projects.map((p, i) => ({
                        id: crypto.randomUUID(),
                        name: p.name,
                        description: p.description,
                        tags: p.technologies,
                        url: p.url,
                        github: p.github,
                        featured: i === 0,
                        order: i,
                    })),
                    timeline: [
                        ...state.education.map((e) => ({
                            id: crypto.randomUUID(),
                            type: 'education',
                            title: e.degree,
                            organization: e.institution,
                            description: e.field,
                            startDate: e.start_date,
                            endDate: e.current ? null : e.end_date,
                            current: e.current,
                        })),
                        ...state.experience.map((e) => ({
                            id: crypto.randomUUID(),
                            type: 'work',
                            title: e.title,
                            organization: e.company,
                            description: e.description,
                            startDate: e.start_date,
                            endDate: e.current ? null : e.end_date,
                            current: e.current,
                        })),
                    ],
                    is_seeking_lia: state.is_seeking,
                    lia_period: state.seeking_period || null,
                    lia_location: state.seeking_location || null,
                    lia_interests: state.seeking_interests,
                    is_published: false,
                })
                .select()
                .single();

            if (error) {
                console.error('Supabase error:', error);
                throw new Error(error.message || 'Kunde inte skapa portfolio');
            }

            router.push('/dashboard');
        } catch (err: any) {
            console.error('Error creating portfolio:', err);
            setError(err.message || 'Något gick fel. Försök igen.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-porcelain">
            {/* Error toast */}
            {error && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                    <span className="text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="hover:opacity-70">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-sm text-slate-500 hover:text-ink transition-colors"
                        >
                            ← Avbryt
                        </button>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2">
                            {STEPS.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <button
                                        onClick={() => i <= step && setStep(i)}
                                        disabled={i > step}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${i === step
                                                ? 'bg-ink text-white'
                                                : i < step
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-400'
                                            }`}
                                    >
                                        {i < step ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <s.icon className="w-4 h-4" />
                                        )}
                                        <span className="hidden sm:inline">{s.title}</span>
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="w-16" />
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-4xl mx-auto px-6 py-10">
                {step === 0 && (
                    <StepBasics state={state} update={update} />
                )}
                {step === 1 && (
                    <StepContent state={state} update={update} />
                )}
                {step === 2 && (
                    <StepDesign state={state} update={update} />
                )}
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 0}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Tillbaka
                    </Button>

                    {step < STEPS.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className="gap-2"
                        >
                            Fortsätt
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleComplete}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Skapar...
                                </>
                            ) : (
                                <>
                                    <Star className="w-4 h-4" />
                                    Skapa portfolio
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </footer>
        </div>
    );
}

// ============================================
// STEP COMPONENTS
// ============================================

interface StepProps {
    state: OnboardingState;
    update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
}

function StepBasics({ state, update }: StepProps) {
    return (
        <div className="space-y-8 pb-24">
            <div>
                <h1 className="text-3xl font-semibold text-ink mb-2">Berätta om dig</h1>
                <p className="text-slate-500">Denna information visas på din portfolio.</p>
            </div>

            <div className="grid gap-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                        Fullständigt namn *
                    </label>
                    <input
                        type="text"
                        value={state.full_name}
                        onChange={(e) => update('full_name', e.target.value)}
                        placeholder="Said Borna"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all"
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                        Yrkestitel / Roll *
                    </label>
                    <input
                        type="text"
                        value={state.title}
                        onChange={(e) => update('title', e.target.value)}
                        placeholder="DevOps Engineer"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all"
                    />
                </div>

                {/* Situation */}
                <div>
                    <label className="block text-sm font-medium text-ink mb-3">Nuvarande situation</label>
                    <div className="grid grid-cols-2 gap-3">
                        {SITUATIONS.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => update('current_situation', s.value)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${state.current_situation === s.value
                                        ? 'border-ink bg-slate-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <span className="font-medium text-ink">{s.label}</span>
                                <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-ink mb-2">Plats</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={state.location}
                            onChange={(e) => update('location', e.target.value)}
                            placeholder="Stockholm, Sverige"
                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">E-post</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                value={state.email}
                                onChange={(e) => update('email', e.target.value)}
                                placeholder="namn@exempel.se"
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-ink mb-2">Telefon</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="tel"
                                value={state.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                placeholder="070-123 45 67"
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Seeking toggle */}
                <Card className="p-5 bg-white border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="font-medium text-ink">Söker du något?</p>
                            <p className="text-sm text-slate-500">LIA, jobb eller uppdrag</p>
                        </div>
                        <button
                            onClick={() => update('is_seeking', !state.is_seeking)}
                            className={`relative w-12 h-7 rounded-full transition-colors ${state.is_seeking ? 'bg-ink' : 'bg-slate-200'
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${state.is_seeking ? 'left-6' : 'left-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {state.is_seeking && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex gap-2">
                                {SEEKING_TYPES.map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => update('seeking_type', t.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${state.seeking_type === t.value
                                                ? 'bg-ink text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={state.seeking_period}
                                    onChange={(e) => update('seeking_period', e.target.value)}
                                    placeholder="Period (ex: Mars - Maj 2025)"
                                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-ink"
                                />
                                <input
                                    type="text"
                                    value={state.seeking_location}
                                    onChange={(e) => update('seeking_location', e.target.value)}
                                    placeholder="Plats (ex: Stockholm)"
                                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-ink"
                                />
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

function StepContent({ state, update }: StepProps) {
    const [skillInput, setSkillInput] = useState('');
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [newEducation, setNewEducation] = useState<OnboardingEducation>({
        institution: '', degree: '', field: '', start_date: '', end_date: '', current: false
    });
    const [newProject, setNewProject] = useState<OnboardingProject>({
        name: '', description: '', technologies: [], url: '', github: ''
    });

    const addSkill = (skill: string) => {
        if (skill && !state.skills.includes(skill)) {
            update('skills', [...state.skills, skill]);
        }
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        update('skills', state.skills.filter(s => s !== skill));
    };

    const addEducation = () => {
        if (newEducation.institution && newEducation.degree) {
            update('education', [...state.education, newEducation]);
            setNewEducation({ institution: '', degree: '', field: '', start_date: '', end_date: '', current: false });
            setShowEducationForm(false);
        }
    };

    const removeEducation = (index: number) => {
        update('education', state.education.filter((_, i) => i !== index));
    };

    const addProject = () => {
        if (newProject.name && newProject.description) {
            update('projects', [...state.projects, newProject]);
            setNewProject({ name: '', description: '', technologies: [], url: '', github: '' });
            setShowProjectForm(false);
        }
    };

    const removeProject = (index: number) => {
        update('projects', state.projects.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-10 pb-24">
            <div>
                <h1 className="text-3xl font-semibold text-ink mb-2">Ditt innehåll</h1>
                <p className="text-slate-500">Lägg till kompetenser, utbildning och projekt.</p>
            </div>

            {/* Skills */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold text-ink">Kompetenser</h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {state.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm flex items-center gap-2"
                        >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>

                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                        placeholder="Skriv en kompetens..."
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-ink"
                    />
                    <Button variant="secondary" onClick={() => addSkill(skillInput)}>
                        Lägg till
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.slice(0, 10).filter(t => !state.skills.includes(t.name)).map((tech) => (
                        <button
                            key={tech.name}
                            onClick={() => addSkill(tech.name)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 hover:text-ink hover:border-slate-300 transition-colors"
                        >
                            + {tech.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-slate-600" />
                        <h2 className="text-lg font-semibold text-ink">Utbildning</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEducationForm(true)}
                        className="gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        Lägg till
                    </Button>
                </div>

                <div className="space-y-3">
                    {state.education.map((edu, i) => (
                        <Card key={i} className="p-4 bg-white border-slate-200">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium text-ink">{edu.degree}</p>
                                    <p className="text-sm text-slate-500">{edu.institution}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {edu.start_date} – {edu.current ? 'Nu' : edu.end_date}
                                    </p>
                                </div>
                                <button onClick={() => removeEducation(i)} className="text-slate-400 hover:text-red-500 h-fit">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}

                    {showEducationForm && (
                        <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={newEducation.institution}
                                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                    placeholder="Skola"
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink"
                                />
                                <input
                                    type="text"
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                    placeholder="Program / Examen"
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    value={newEducation.start_date}
                                    onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
                                    placeholder="Start (2023)"
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink"
                                />
                                <input
                                    type="text"
                                    value={newEducation.end_date}
                                    onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
                                    placeholder="Slut (2025)"
                                    disabled={newEducation.current}
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink disabled:opacity-50"
                                />
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={newEducation.current}
                                        onChange={(e) => setNewEducation({ ...newEducation, current: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-300"
                                    />
                                    Pågående
                                </label>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => setShowEducationForm(false)}>
                                    Avbryt
                                </Button>
                                <Button size="sm" onClick={addEducation} disabled={!newEducation.institution || !newEducation.degree}>
                                    Spara
                                </Button>
                            </div>
                        </Card>
                    )}

                    {state.education.length === 0 && !showEducationForm && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            Ingen utbildning tillagd ännu
                        </div>
                    )}
                </div>
            </section>

            {/* Projects */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-slate-600" />
                        <h2 className="text-lg font-semibold text-ink">Projekt</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowProjectForm(true)}
                        className="gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        Lägg till
                    </Button>
                </div>

                <div className="space-y-3">
                    {state.projects.map((proj, i) => (
                        <Card key={i} className="p-4 bg-white border-slate-200">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium text-ink">{proj.name}</p>
                                    <p className="text-sm text-slate-500 line-clamp-1">{proj.description}</p>
                                    <div className="flex gap-1.5 mt-2">
                                        {proj.technologies.slice(0, 3).map(t => (
                                            <span key={t} className="text-xs px-2 py-0.5 bg-slate-100 rounded">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => removeProject(i)} className="text-slate-400 hover:text-red-500 h-fit">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}

                    {showProjectForm && (
                        <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
                            <input
                                type="text"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                placeholder="Projektnamn"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink"
                            />
                            <textarea
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                placeholder="Kort beskrivning..."
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink resize-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="url"
                                    value={newProject.url}
                                    onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                                    placeholder="Live URL (valfritt)"
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink"
                                />
                                <input
                                    type="url"
                                    value={newProject.github}
                                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                                    placeholder="GitHub (valfritt)"
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-ink"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => setShowProjectForm(false)}>
                                    Avbryt
                                </Button>
                                <Button size="sm" onClick={addProject} disabled={!newProject.name || !newProject.description}>
                                    Spara
                                </Button>
                            </div>
                        </Card>
                    )}

                    {state.projects.length === 0 && !showProjectForm && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            Inga projekt tillagda ännu
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function StepDesign({ state, update }: StepProps) {
    const allTemplates = TEMPLATES;
    const selectedTemplate = allTemplates.find(t => t.id === state.template_id);

    return (
        <div className="pb-24">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-ink mb-2">Välj din stil</h1>
                <p className="text-slate-500">Din portfolio, din personlighet.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Template Grid */}
                <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">
                        {allTemplates.length} Templates
                    </h3>
                    <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                        {allTemplates.map((template) => {
                            const family = getFamily(template.family);
                            const isSelected = state.template_id === template.id;
                            const isLocked = template.tier !== 'free';

                            return (
                                <button
                                    key={template.id}
                                    onClick={() => !isLocked && update('template_id', template.id)}
                                    className={`relative p-3 rounded-xl border-2 text-left transition-all ${isSelected
                                            ? 'border-ink ring-2 ring-ink/20'
                                            : isLocked
                                                ? 'border-slate-200 opacity-60'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {/* Mini Preview */}
                                    <div
                                        className="aspect-[4/3] rounded-lg mb-2 overflow-hidden"
                                        style={{ background: template.style.bg_primary }}
                                    >
                                        <div className="h-full p-2.5 flex flex-col">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ background: template.style.accent }}
                                                />
                                                <div
                                                    className="h-1.5 w-10 rounded"
                                                    style={{ background: template.style.text_secondary }}
                                                />
                                            </div>
                                            <div
                                                className="h-2 w-14 rounded mb-0.5"
                                                style={{ background: template.style.text_primary }}
                                            />
                                            <div
                                                className="h-1.5 w-12 rounded"
                                                style={{ background: template.style.text_muted }}
                                            />
                                        </div>
                                    </div>

                                    <p className="font-medium text-sm text-ink truncate">{template.name}</p>
                                    <p className="text-xs text-slate-500">{family.name}</p>

                                    {isLocked && (
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="outline" className="text-xs gap-1">
                                                <Crown className="w-3 h-3" />
                                                {template.tier === 'premium' ? 'Premium' : 'Pro'}
                                            </Badge>
                                        </div>
                                    )}

                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-ink rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Live Preview */}
                <div className="lg:sticky lg:top-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">
                        Förhandsvisning
                    </h3>
                    <Card className="overflow-hidden border-slate-200">
                        <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                            {/* Small iframe preview - intentionally small to prevent screenshot abuse */}
                            <iframe
                                src={`/api/portfolio-preview?template=${state.template_id}&name=${encodeURIComponent(state.full_name || 'Ditt Namn')}&title=${encodeURIComponent(state.title || 'Din Titel')}&preview=true`}
                                className="absolute inset-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                                style={{ border: 'none' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-ink">{selectedTemplate?.name}</p>
                                    <p className="text-xs text-slate-500">{selectedTemplate ? getFamily(selectedTemplate.family).description : ''}</p>
                                </div>
                                <Badge variant="primary" className="gap-1">
                                    <Eye className="w-3 h-3" />
                                    Preview
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <Card className="mt-4 p-4 bg-amber-50 border-amber-100">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-amber-900 text-sm">Vill du ha fler val?</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    Uppgradera för att låsa upp alla {allTemplates.filter(t => t.tier !== 'free').length} premium templates.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
