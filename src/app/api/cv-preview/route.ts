// ============================================
// CV Preview API - Testar nya CV-renderern
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { renderCVV2, CV_TEMPLATES_V2, type CVData } from '@/lib/templates/cv-renderer-v2';

// Testdata baserat på Said Bornas CV
const SAMPLE_CV_DATA: CVData = {
    fullName: 'Said Borna',
    title: 'DEVOPS',
    subtitle: 'ENGINEER',
    tagline: 'DEVOPS · LEDARSKAP · AI',

    photoUrl: 'https://saidborna.com/Said.jpg',

    seeking: {
        active: true,
        title: 'SÖKER LIA',
        period: 'November 2026 – Maj 2027',
        description: 'Selektiv – Söker företag där jag ser en framtid',
    },

    contact: {
        phone: '072-011 77 83',
        email: 'said.borna.lia@gmail.com',
        linkedin: 'https://linkedin.com/in/saidborna',
        github: 'https://github.com/S-Borna',
        location: 'Stockholm',
    },

    portfolioUrl: 'https://saidborna.com',

    technicalSkills: [
        'Linux/Unix',
        'Bash & Automation',
        'Docker & Containers',
        'Git & GitHub',
        'CI/CD Pipelines',
        'Python',
        'Next.js / FastAPI',
    ],

    leadershipSkills: [
        'Teamutveckling',
        'Processoptimering',
        'Rekrytering & HR',
        'Förhandling',
    ],

    languages: [
        { name: 'Svenska', level: 'modersmål' },
        { name: 'Engelska', level: 'flytande' },
        { name: 'Farsi', level: 'modersmål' },
        { name: 'Turkiska', level: 'god' },
    ],

    references: [
        'Chas Academy - DevOps',
        'Läkarleasing',
        'Studentconsulting',
        'Tele2 – Egen företagare',
    ],

    other: [
        'Körkort B',
        'Ordningsvakt (utb.)',
    ],

    profile: '15 år av att bygga team, fixa processer och leverera resultat. Nu kombinerar jag tekniken med ledarskapet – söker LIA där jag kan bidra från dag ett och ser möjlighet till fortsättning.',

    education: {
        title: 'DevOps Engineer',
        institution: 'Chas Academy',
        period: '2025–2027',
        bullets: [
            'Linux, Docker, Kubernetes, CI/CD, Bash-automation',
            'Teamledare för 5-personersgrupp',
            'Studeranderepresentant – diplomerad nov 2025',
        ],
    },

    projects: [
        {
            name: 'GinoNova',
            url: 'ginonova.com',
            bullets: [
                'AI-driven lärplattform för DevOps – 134 verktyg, 1435 flashcards',
                'Next.js, FastAPI, PostgreSQL, Docker',
            ],
        },
        {
            name: 'MakeThePlay',
            url: 'maketheplay.ai',
            bullets: [
                'NHL ML-analytics med ensemble-modellering och 70+ features',
                'Python, Scikit-learn, datapipeline från 30+ API:er',
            ],
        },
    ],

    experience: [
        {
            title: 'Konsultchef SSK',
            company: 'Läkarleasing Sverige',
            bullets: [
                '3,64 MSEK i bokade intäkter, 12 signerade direktavtal',
            ],
        },
        {
            title: 'Kundansvarig',
            company: 'StudentConsulting',
            bullets: [
                'Leveranssäkerhet: 72,5% → 93,8% på 6 månader',
                '390 konsulter, ramavtal med PostNord, Uber, Ahlsell m.fl.',
            ],
        },
        {
            title: 'Samordnare',
            company: 'Taxi Stockholm',
            bullets: [
                'Koordinerade 1 600 bilar och 6 700 förare i realtid',
            ],
        },
        {
            title: 'VD & Grundare',
            company: 'Celsium Sweden',
            bullets: [
                'Startade callcenter med 40 agenter, fullt P&L-ansvar',
            ],
        },
    ],
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get('template') || 'said-dark';
    const showPhoto = searchParams.get('photo') !== 'false';
    const showSeeking = searchParams.get('seeking') !== 'false';

    // Clone data and adjust based on params
    const cvData = { ...SAMPLE_CV_DATA };
    if (!showSeeking && cvData.seeking) {
        cvData.seeking = { ...cvData.seeking, active: false };
    }

    const html = renderCVV2(cvData, templateId, {
        showPhoto,
        pageSize: 'a4',
    });

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}

// Lista tillgängliga templates
export async function POST() {
    return NextResponse.json({
        templates: CV_TEMPLATES_V2.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
        })),
        sampleData: SAMPLE_CV_DATA,
    });
}
