'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { OnboardingState, CurrentSituation, SeekingType, OnboardingEducation, OnboardingExperience, OnboardingProject } from '@/lib/models';
import { TEMPLATES, getTemplatesForTier, getFamily } from '@/lib/templates/system';
import { TECH_STACK_OPTIONS } from '@/lib/models';

// ============================================
// CONFIGURATION
// ============================================

const STEPS = [
    { id: 'basics', title: 'Grundläggande', description: 'Vem är du?' },
    { id: 'content', title: 'Innehåll', description: 'Vad har du gjort?' },
    { id: 'design', title: 'Design', description: 'Hur ska det se ut?' },
] as const;

const SITUATIONS: Array<{ value: CurrentSituation; label: string; emoji: string }> = [
    { value: 'student', label: 'Student', emoji: '🎓' },
    { value: 'job-seeking', label: 'Arbetssökande', emoji: '🔍' },
    { value: 'employed', label: 'Anställd', emoji: '💼' },
    { value: 'freelance', label: 'Frilansare', emoji: '🚀' },
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
    const update = <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
        setState(prev => ({ ...prev, [key]: value }));
    };

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
        try {
            // Create portfolio in Supabase
            const { data: portfolio, error } = await supabase
                .from('portfolios')
                .insert({
                    user_id: userId,
                    template_id: state.template_id,
                    template_family: TEMPLATES.find(t => t.id === state.template_id)?.family || 'crimson',
                    title: state.full_name,
                    tagline: state.title,
                    location: state.location,
                    email: state.email,
                    phone: state.phone,
                    skills: state.skills.map(s => ({ name: s })),
                    projects: state.projects.map((p, i) => ({
                        id: crypto.randomUUID(),
                        name: p.name,
                        description: p.description,
                        tags: p.technologies,
                        links: { live: p.url, github: p.github },
                        featured: i === 0,
                        order: i,
                    })),
                    timeline: [
                        ...state.education.map((e, i) => ({
                            id: crypto.randomUUID(),
                            type: 'education',
                            title: e.degree,
                            subtitle: e.institution,
                            description: e.field,
                            period: `${e.start_date} - ${e.current ? 'Nu' : e.end_date}`,
                            current: e.current,
                            order: i,
                        })),
                        ...state.experience.map((e, i) => ({
                            id: crypto.randomUUID(),
                            type: 'work',
                            title: e.title,
                            subtitle: e.company,
                            description: e.description,
                            period: `${e.start_date} - ${e.current ? 'Nu' : e.end_date}`,
                            current: e.current,
                            order: state.education.length + i,
                        })),
                    ],
                    is_seeking: state.is_seeking,
                    seeking_type: state.is_seeking ? state.seeking_type : null,
                    seeking_period: state.seeking_period || null,
                    seeking_location: state.seeking_location || null,
                    seeking_interests: state.seeking_interests,
                    status: 'draft',
                })
                .select()
                .single();

            if (error) throw error;

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating portfolio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Render based on step
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-800 z-50">
                <motion.div
                    className="h-full bg-[#ff4d4d]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-800/50">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                        Avbryt
                    </button>
                    <div className="flex items-center gap-6">
                        {STEPS.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => i <= step && setStep(i)}
                                className={`text-sm font-medium transition-colors ${i === step
                                        ? 'text-white'
                                        : i < step
                                            ? 'text-[#ff4d4d]'
                                            : 'text-zinc-600'
                                    }`}
                            >
                                {s.title}
                            </button>
                        ))}
                    </div>
                    <div className="w-16" />
                </div>
            </header>

            {/* Main content */}
            <main className="pt-24 pb-32">
                <div className="max-w-2xl mx-auto px-6">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <StepBasics
                                key="basics"
                                state={state}
                                update={update}
                            />
                        )}
                        {step === 1 && (
                            <StepContent
                                key="content"
                                state={state}
                                update={update}
                            />
                        )}
                        {step === 2 && (
                            <StepDesign
                                key="design"
                                state={state}
                                update={update}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-zinc-800">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 0}
                        className="px-6 py-3 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Tillbaka
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className="px-8 py-3 bg-[#ff4d4d] text-white text-sm font-semibold rounded-lg hover:bg-[#ff3333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Fortsätt
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={isLoading}
                            className="px-8 py-3 bg-[#ff4d4d] text-white text-sm font-semibold rounded-lg hover:bg-[#ff3333] disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Skapar...
                                </>
                            ) : (
                                'Skapa portfolio'
                            )}
                        </button>
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Berätta om dig
                </h1>
                <p className="text-zinc-400">
                    Informationen nedan kommer visas på din portfolio.
                </p>
            </div>

            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Fullständigt namn *
                    </label>
                    <input
                        type="text"
                        value={state.full_name}
                        onChange={(e) => update('full_name', e.target.value)}
                        placeholder="Said Borna"
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff4d4d] transition-colors"
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Yrkestitel / Roll *
                    </label>
                    <input
                        type="text"
                        value={state.title}
                        onChange={(e) => update('title', e.target.value)}
                        placeholder="DevOps-student @ YH"
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff4d4d] transition-colors"
                    />
                </div>

                {/* Situation */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">
                        Nuvarande situation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {SITUATIONS.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => update('current_situation', s.value)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${state.current_situation === s.value
                                        ? 'bg-[#ff4d4d]/10 border-[#ff4d4d] text-white'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                    }`}
                            >
                                <span className="text-xl">{s.emoji}</span>
                                <span className="font-medium">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Plats
                    </label>
                    <input
                        type="text"
                        value={state.location}
                        onChange={(e) => update('location', e.target.value)}
                        placeholder="Stockholm, Sverige"
                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff4d4d] transition-colors"
                    />
                </div>

                {/* Seeking toggle */}
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="font-medium">Söker du något?</div>
                            <div className="text-sm text-zinc-500">LIA, jobb eller uppdrag</div>
                        </div>
                        <button
                            onClick={() => update('is_seeking', !state.is_seeking)}
                            className={`relative w-12 h-7 rounded-full transition-colors ${state.is_seeking ? 'bg-[#ff4d4d]' : 'bg-zinc-700'
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${state.is_seeking ? 'left-6' : 'left-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {state.is_seeking && (
                        <div className="space-y-3 pt-3 border-t border-zinc-800">
                            <div className="flex gap-2">
                                {SEEKING_TYPES.map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => update('seeking_type', t.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${state.seeking_type === t.value
                                                ? 'bg-[#ff4d4d] text-white'
                                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
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
                                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff4d4d]"
                                />
                                <input
                                    type="text"
                                    value={state.seeking_location}
                                    onChange={(e) => update('seeking_location', e.target.value)}
                                    placeholder="Plats (ex: Stockholm)"
                                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff4d4d]"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function StepContent({ state, update }: StepProps) {
    const [skillInput, setSkillInput] = useState('');
    const [newEducation, setNewEducation] = useState<OnboardingEducation>({
        institution: '', degree: '', field: '', start_date: '', end_date: '', current: false
    });
    const [newExperience, setNewExperience] = useState<OnboardingExperience>({
        company: '', title: '', start_date: '', end_date: '', current: false, description: ''
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
        }
    };

    const removeEducation = (index: number) => {
        update('education', state.education.filter((_, i) => i !== index));
    };

    const addExperience = () => {
        if (newExperience.company && newExperience.title) {
            update('experience', [...state.experience, newExperience]);
            setNewExperience({ company: '', title: '', start_date: '', end_date: '', current: false, description: '' });
        }
    };

    const removeExperience = (index: number) => {
        update('experience', state.experience.filter((_, i) => i !== index));
    };

    const addProject = () => {
        if (newProject.name && newProject.description) {
            update('projects', [...state.projects, newProject]);
            setNewProject({ name: '', description: '', technologies: [], url: '', github: '' });
        }
    };

    const removeProject = (index: number) => {
        update('projects', state.projects.filter((_, i) => i !== index));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
        >
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Ditt innehåll
                </h1>
                <p className="text-zinc-400">
                    Lägg till kompetenser, utbildning och projekt. Du kan alltid ändra senare.
                </p>
            </div>

            {/* Skills */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-sm">💡</span>
                    Kompetenser
                </h2>

                <div className="flex flex-wrap gap-2 mb-3">
                    {state.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1.5 bg-zinc-800 rounded-lg text-sm flex items-center gap-2"
                        >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="text-zinc-500 hover:text-white">
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                        placeholder="Skriv en kompetens..."
                        className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ff4d4d]"
                    />
                    <button
                        onClick={() => addSkill(skillInput)}
                        className="px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                        Lägg till
                    </button>
                </div>

                {/* Quick add suggestions */}
                <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.slice(0, 12).filter(t => !state.skills.includes(t.name)).map((tech) => (
                        <button
                            key={tech.name}
                            onClick={() => addSkill(tech.name)}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                        >
                            + {tech.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-sm">🎓</span>
                    Utbildning
                </h2>

                {state.education.map((edu, i) => (
                    <div key={i} className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 flex items-start justify-between">
                        <div>
                            <div className="font-medium">{edu.degree}</div>
                            <div className="text-sm text-zinc-400">{edu.institution}</div>
                            <div className="text-xs text-zinc-500">{edu.start_date} - {edu.current ? 'Nu' : edu.end_date}</div>
                        </div>
                        <button onClick={() => removeEducation(i)} className="text-zinc-500 hover:text-red-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                <div className="p-4 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-700 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={newEducation.institution}
                            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                            placeholder="Skola"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                        />
                        <input
                            type="text"
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                            placeholder="Program / Examen"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={newEducation.start_date}
                            onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
                            placeholder="Startår (2023)"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                        />
                        <input
                            type="text"
                            value={newEducation.end_date}
                            onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
                            placeholder="Slutår (2025)"
                            disabled={newEducation.current}
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm disabled:opacity-50"
                        />
                        <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <input
                                type="checkbox"
                                checked={newEducation.current}
                                onChange={(e) => setNewEducation({ ...newEducation, current: e.target.checked })}
                                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700"
                            />
                            Pågående
                        </label>
                    </div>
                    <button
                        onClick={addEducation}
                        disabled={!newEducation.institution || !newEducation.degree}
                        className="w-full py-2 bg-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                    >
                        Lägg till utbildning
                    </button>
                </div>
            </section>

            {/* Projects */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-sm">🚀</span>
                    Projekt
                </h2>

                {state.projects.map((proj, i) => (
                    <div key={i} className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 flex items-start justify-between">
                        <div>
                            <div className="font-medium">{proj.name}</div>
                            <div className="text-sm text-zinc-400 line-clamp-2">{proj.description}</div>
                            <div className="flex gap-2 mt-2">
                                {proj.technologies.slice(0, 3).map(t => (
                                    <span key={t} className="text-xs px-2 py-1 bg-zinc-800 rounded">{t}</span>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => removeProject(i)} className="text-zinc-500 hover:text-red-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                <div className="p-4 bg-zinc-900/50 rounded-lg border border-dashed border-zinc-700 space-y-3">
                    <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="Projektnamn"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                    />
                    <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Kort beskrivning av projektet..."
                        rows={2}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="url"
                            value={newProject.url}
                            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                            placeholder="Live URL (valfritt)"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                        />
                        <input
                            type="url"
                            value={newProject.github}
                            onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                            placeholder="GitHub (valfritt)"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                        />
                    </div>
                    <button
                        onClick={addProject}
                        disabled={!newProject.name || !newProject.description}
                        className="w-full py-2 bg-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                    >
                        Lägg till projekt
                    </button>
                </div>
            </section>
        </motion.div>
    );
}

function StepDesign({ state, update }: StepProps) {
    const templates = getTemplatesForTier('free'); // Show all free templates initially

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Välj din stil
                </h1>
                <p className="text-zinc-400">
                    Din portfolio, din personlighet. Välj en design som passar dig.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => {
                    const family = getFamily(template.family);
                    const isSelected = state.template_id === template.id;

                    return (
                        <button
                            key={template.id}
                            onClick={() => update('template_id', template.id)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                    ? 'border-[#ff4d4d] bg-[#ff4d4d]/5'
                                    : 'border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            {/* Preview */}
                            <div
                                className="aspect-[4/3] rounded-lg mb-3 overflow-hidden"
                                style={{ background: template.style.bg_primary }}
                            >
                                <div className="h-full p-3 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="w-6 h-6 rounded"
                                            style={{ background: template.style.accent }}
                                        />
                                        <div
                                            className="h-2 w-16 rounded"
                                            style={{ background: template.style.text_secondary }}
                                        />
                                    </div>
                                    <div
                                        className="h-3 w-24 rounded mb-1"
                                        style={{ background: template.style.text_primary }}
                                    />
                                    <div
                                        className="h-2 w-20 rounded"
                                        style={{ background: template.style.text_muted }}
                                    />
                                    <div className="flex-1" />
                                    <div className="flex gap-2">
                                        <div
                                            className="h-8 w-8 rounded"
                                            style={{ background: template.style.bg_card }}
                                        />
                                        <div
                                            className="h-8 w-8 rounded"
                                            style={{ background: template.style.bg_card }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-zinc-500">{family.name}</div>

                            {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-[#ff4d4d] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#ff4d4d] to-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-medium">Fler templates?</div>
                        <div className="text-sm text-zinc-400">
                            Uppgradera för att låsa upp 20+ premium-designs
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
