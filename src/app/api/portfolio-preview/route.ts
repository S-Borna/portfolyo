/**
 * Portfolio Preview API
 *
 * GET /api/portfolio-preview
 * GET /api/portfolio-preview?template=said-midnight
 * GET /api/portfolio-preview?lang=en
 */

import { NextResponse } from 'next/server';
import { renderPortfolioV2, PortfolioDataV2 } from '@/lib/templates/portfolio-renderer-v2';

// Sample data - EXAKT som saidborna.com
const SAMPLE_DATA_SV: PortfolioDataV2 = {
    language: 'sv',

    // Hero
    fullName: 'Said Borna',
    firstName: 'Said',
    lastName: 'Borna',
    title: 'DevOps Engineer',
    tagline: 'Jag automatiserar, övervakar och optimerar. Med en passion för CI/CD pipelines och infrastructure as code, bygger jag broar mellan utveckling och drift.',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    cvUrl: '/api/cv-preview?template=said-dark&profile=said',

    metaItems: [
        { label: 'Baserad i', value: 'Malmö, Sverige' },
        { label: 'Tillgänglighet', value: 'LIA 2025' },
    ],

    // About
    about: {
        paragraphs: [
            {
                highlight: 'Är det verkligen jag som ska beskriva mig själv?',
                text: 'Det känns ju lite väl egocentrisk att hylla mig själv... Men okej, jag chansar — verkar ändå fungera för folk på LinkedIn.'
            },
            {
                highlight: 'Med en bakgrund inom nätverksteknik',
                text: 'bestämde jag mig för att ta steget in i DevOps-världen. Jag har insett att min verkliga passion ligger i att automatisera processer, övervaka systemhälsa och kontinuerligt förbättra utvecklingsflöden.'
            },
            {
                highlight: 'Mina nyckelkompetenser inkluderar',
                text: 'implementation av CI/CD-pipelines, containerisering med Docker och Kubernetes, samt infrastructure as code med verktyg som Terraform och Ansible. Jag trivs bäst när jag får lösa komplexa problem och se direkta resultat av mitt arbete.'
            },
            {
                highlight: 'Min ambition är',
                text: 'att överbrygga gapet mellan utveckling och drift, skapa effektiva och säkra utvecklingsmiljöer, och bidra till en kultur av kontinuerlig förbättring inom organisationer.'
            }
        ],
        badge: {
            icon: '🎓',
            text: 'Studerar DevOps Engineer på Yrgo, Göteborg',
            link: {
                url: 'https://www.yrgo.se',
                label: 'Se utbildningen'
            }
        }
    },

    // Stats
    stats: [
        { number: '15+', label: 'Projekt slutförda' },
        { number: '500+', label: 'Commits på GitHub' },
        { number: '10+', label: 'Teknologier behärskade' },
        { number: '∞', label: 'Koppar kaffe druckna' },
    ],

    // LIA Seeking
    seeking: {
        active: true,
        title: '🔎 Söker LIA 2025',
        description: 'Jag söker en LIA-plats där jag kan tillämpa mina kunskaper inom DevOps och fortsätta utvecklas. Är du intresserad av att ha mig med i ert team?',
        details: [
            { label: 'Period', value: 'VT 2025' },
            { label: 'Omfattning', value: '10 veckor' },
            { label: 'Plats', value: 'Flexibel / Remote' },
        ],
        bgText: 'LIA',
    },

    // Projects
    projects: [
        {
            tag: 'DevOps',
            badge: 'Pågående',
            name: 'PORTFOLYO.SE',
            description: 'En plattform för att skapa professionella portfolios och CVs med AI-assistans. Byggd med Next.js, Supabase och Cloudflare.',
            techStack: ['Next.js', 'TypeScript', 'Supabase', 'Cloudflare Pages', 'AI'],
            link: { url: 'https://portfolyo.se', label: 'Besök sidan' },
            previewImageUrl: '/projects/portfolyo-preview.png',
        },
        {
            tag: 'Infrastructure',
            name: 'K8S HOMELAB',
            description: 'Ett komplett Kubernetes-kluster för hemmabruk med automatiserad deployment, monitoring och logging.',
            techStack: ['Kubernetes', 'Helm', 'Prometheus', 'Grafana', 'ArgoCD'],
            link: { url: 'https://github.com/saidborna/homelab', label: 'Visa på GitHub' },
        },
        {
            tag: 'Automation',
            name: 'CI/CD TEMPLATE',
            description: 'Återanvändbar GitHub Actions pipeline-template för Node.js-projekt med automatisk testing, building och deployment.',
            techStack: ['GitHub Actions', 'Docker', 'Node.js', 'Jest'],
            link: { url: 'https://github.com/saidborna/cicd-template', label: 'Visa på GitHub' },
        },
        {
            tag: 'Monitoring',
            name: 'ALERT SYSTEM',
            description: 'Proaktivt övervakningssystem med Slack-integrering för realtidsnotifikationer vid systemavvikelser.',
            techStack: ['Prometheus', 'Alertmanager', 'Slack API', 'Python'],
            link: { url: 'https://github.com/saidborna/alert-system', label: 'Visa på GitHub' },
        },
    ],

    // Timeline
    timeline: {
        intro: 'Från nätverkstekniker till DevOps — en resa fylld med lärande, utmaningar och oändligt mycket konfigurationsfiler.',
        currentPosition: 4,
        markers: [
            { date: 'AUG 2024' },
            { date: 'OKT 2024' },
            { date: 'JAN 2025' },
            { date: 'MAR 2025' },
            { date: 'MAJ 2025' },
            { date: 'JUN 2025' },
        ],
        cards: [
            {
                period: 'Aug - Okt 2024',
                title: 'Linux & Scripting',
                subtitle: 'Kurs 1',
                description: 'Fundament inom Linux-administration och bash-scripting.',
                highlights: ['Linux-kommandon', 'Bash scripting', 'Filsystem', 'Processer'],
                projectNote: 'Automatiserat backup-script för servrar',
            },
            {
                period: 'Okt - Dec 2024',
                title: 'Git & CI/CD',
                subtitle: 'Kurs 2',
                description: 'Versionshantering och kontinuerlig integration/deployment.',
                highlights: ['Git workflows', 'GitHub Actions', 'Jenkins', 'GitLab CI'],
                projectNote: 'CI/CD pipeline för webbapplikation',
            },
            {
                period: 'Jan - Feb 2025',
                title: 'Containers & Orchestration',
                subtitle: 'Kurs 3',
                description: 'Containerisering och orkestrering i produktion.',
                highlights: ['Docker', 'Kubernetes', 'Helm', 'Container security'],
                projectNote: 'Microservices-deployment i K8s',
            },
            {
                period: 'Mar - Apr 2025',
                title: 'IaC & Cloud',
                subtitle: 'Kurs 4',
                description: 'Infrastructure as Code och molntjänster.',
                highlights: ['Terraform', 'Ansible', 'AWS/Azure', 'CloudFormation'],
                projectNote: 'Multi-cloud infrastruktur med Terraform',
                isCurrent: true,
            },
            {
                period: 'Apr - Maj 2025',
                title: 'LIA Period 1',
                subtitle: '5 veckor praktik',
                description: 'Första praktikperioden hos företag.',
                highlights: ['Verklig DevOps-miljö', 'Teamarbete', 'Agila metoder'],
            },
            {
                period: 'Maj - Jun 2025',
                title: 'Monitoring & Security',
                subtitle: 'Kurs 5',
                description: 'Övervakning, loggning och DevSecOps.',
                highlights: ['Prometheus', 'Grafana', 'ELK Stack', 'Security scanning'],
                badges: ['KOMMANDE'],
            },
        ],
    },

    // Tech Stack
    techStack: [
        { name: 'Docker', tier: 'Daglig användning', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', tooltip: 'Containerisering och lokala dev-miljöer' },
        { name: 'Kubernetes', tier: 'Avancerad', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', tooltip: 'Orkestrering av containerbaserade applikationer' },
        { name: 'GitHub Actions', tier: 'Daglig användning', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', tooltip: 'CI/CD pipelines och automation' },
        { name: 'Terraform', tier: 'Produktionsnivå', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', tooltip: 'Infrastructure as Code' },
        { name: 'Linux', tier: 'Daglig användning', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', tooltip: 'Ubuntu, CentOS, Debian' },
        { name: 'AWS', tier: 'Grundläggande', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', tooltip: 'EC2, S3, Lambda, EKS' },
        { name: 'Python', tier: 'Scripting', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', tooltip: 'Automation och scripting' },
        { name: 'Git', tier: 'Daglig användning', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', tooltip: 'Versionshantering' },
        { name: 'Prometheus', tier: 'Monitoring', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg', tooltip: 'Metriker och alerting' },
        { name: 'Grafana', tier: 'Visualization', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg', tooltip: 'Dashboards och visualisering' },
        { name: 'Ansible', tier: 'Automation', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', tooltip: 'Configuration management' },
        { name: 'Node.js', tier: 'Grundläggande', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', tooltip: 'Backend och tooling' },
    ],

    // Contact
    contact: {
        title: "LET'S\nCONNECT",
        subtitle: 'Har du ett spännande projekt eller letar efter en DevOps-praktikant? Jag skulle gärna höra från dig!',
        links: [
            { label: 'Email', url: 'said@example.com', type: 'email' },
            { label: 'LinkedIn', url: 'https://linkedin.com/in/saidborna', type: 'linkedin' },
            { label: 'GitHub', url: 'https://github.com/saidborna', type: 'github' },
        ],
    },

    // Footer
    footer: {
        copyright: '© 2025 Said Borna. Alla rättigheter förbehållna.',
        location: 'Malmö, Sverige',
    },
};

// English version
const SAMPLE_DATA_EN: PortfolioDataV2 = {
    ...SAMPLE_DATA_SV,
    language: 'en',
    tagline: "I automate, monitor, and optimize. With a passion for CI/CD pipelines and infrastructure as code, I build bridges between development and operations.",

    metaItems: [
        { label: 'Based in', value: 'Malmö, Sweden' },
        { label: 'Availability', value: 'Internship 2025' },
    ],

    about: {
        paragraphs: [
            {
                highlight: "Am I really supposed to describe myself?",
                text: "It feels a bit egocentric to praise myself... But okay, I'll give it a shot — seems to work for people on LinkedIn."
            },
            {
                highlight: 'With a background in network technology',
                text: "I decided to take the leap into the DevOps world. I've realized that my true passion lies in automating processes, monitoring system health, and continuously improving development workflows."
            },
            {
                highlight: 'My key competencies include',
                text: 'implementing CI/CD pipelines, containerization with Docker and Kubernetes, and infrastructure as code with tools like Terraform and Ansible. I thrive when solving complex problems and seeing direct results of my work.'
            },
            {
                highlight: 'My ambition is',
                text: 'to bridge the gap between development and operations, create efficient and secure development environments, and contribute to a culture of continuous improvement within organizations.'
            }
        ],
        badge: {
            icon: '🎓',
            text: 'Studying DevOps Engineer at Yrgo, Gothenburg',
            link: {
                url: 'https://www.yrgo.se',
                label: 'View program'
            }
        }
    },

    stats: [
        { number: '15+', label: 'Projects completed' },
        { number: '500+', label: 'GitHub commits' },
        { number: '10+', label: 'Technologies mastered' },
        { number: '∞', label: 'Cups of coffee consumed' },
    ],

    seeking: {
        active: true,
        title: '🔎 Seeking Internship 2025',
        description: "I'm looking for an internship where I can apply my DevOps knowledge and continue to grow. Interested in having me on your team?",
        details: [
            { label: 'Period', value: 'Spring 2025' },
            { label: 'Duration', value: '10 weeks' },
            { label: 'Location', value: 'Flexible / Remote' },
        ],
        bgText: 'LIA',
    },

    projects: SAMPLE_DATA_SV.projects.map(p => ({
        ...p,
        description: p.name === 'PORTFOLYO.SE'
            ? 'A platform for creating professional portfolios and CVs with AI assistance. Built with Next.js, Supabase and Cloudflare.'
            : p.name === 'K8S HOMELAB'
                ? 'A complete Kubernetes cluster for home use with automated deployment, monitoring and logging.'
                : p.name === 'CI/CD TEMPLATE'
                    ? 'Reusable GitHub Actions pipeline template for Node.js projects with automatic testing, building and deployment.'
                    : 'Proactive monitoring system with Slack integration for real-time notifications on system anomalies.',
        link: {
            url: p.link.url,
            label: p.link.label.includes('Besök') ? 'Visit site' : 'View on GitHub'
        }
    })),

    timeline: {
        ...SAMPLE_DATA_SV.timeline,
        intro: 'From network technician to DevOps — a journey filled with learning, challenges, and endless configuration files.',
    },

    contact: {
        title: "LET'S\nCONNECT",
        subtitle: 'Have an exciting project or looking for a DevOps intern? I would love to hear from you!',
        links: SAMPLE_DATA_SV.contact.links,
    },

    footer: {
        copyright: '© 2025 Said Borna. All rights reserved.',
        location: 'Malmö, Sweden',
    },
};

// Fiktiva tech-profiler för preview - med högupplösta stockfoton
const TECH_GURU_PROFILES: Record<string, { fullName: string; firstName: string; lastName: string; title: string; tagline: string; profileImageUrl: string }> = {
    'said': {
        fullName: 'Said Borna',
        firstName: 'Said',
        lastName: 'Borna',
        title: 'DevOps Engineer',
        tagline: 'Jag automatiserar, övervakar och optimerar. Med en passion för CI/CD pipelines och infrastructure as code.',
        profileImageUrl: 'https://saidborna.com/Said.jpg',
    },
    'alex': {
        fullName: 'Alex Lindqvist',
        firstName: 'Alex',
        lastName: 'Lindqvist',
        title: 'Full Stack Developer',
        tagline: 'Från databas till användargränssnitt. Jag bygger skalbara lösningar med moderna ramverk.',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face',
    },
    'maya': {
        fullName: 'Maya Eriksson',
        firstName: 'Maya',
        lastName: 'Eriksson',
        title: 'UX/UI Designer',
        tagline: 'Design är inte hur det ser ut - det är hur det fungerar. Användaren först, alltid.',
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop&crop=face',
    },
    'omar': {
        fullName: 'Omar Johansson',
        firstName: 'Omar',
        lastName: 'Johansson',
        title: 'ML Engineer',
        tagline: 'Data är den nya oljan. Jag bygger AI-modeller som löser verkliga problem.',
        profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop&crop=face',
    },
    'sofia': {
        fullName: 'Sofia Andersson',
        firstName: 'Sofia',
        lastName: 'Andersson',
        title: 'Cloud Architect',
        tagline: 'Infrastruktur som kod, säkerhet som standard. Molnet är framtiden.',
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop&crop=face',
    },
    'erik': {
        fullName: 'Erik Nilsson',
        firstName: 'Erik',
        lastName: 'Nilsson',
        title: 'Security Engineer',
        tagline: 'Säkerhet är inte en produkt, det är en process. Jag skyddar det digitala.',
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face',
    },
    'lin': {
        fullName: 'Lin Bergström',
        firstName: 'Lin',
        lastName: 'Bergström',
        title: 'Frontend Specialist',
        tagline: 'Pixelperfekt kod med tillgänglighet i fokus. React, Vue, och allt däremellan.',
        profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop&crop=face',
    },
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'said-dark';
    const lang = searchParams.get('lang') || 'sv';
    const profile = searchParams.get('profile') || 'said';

    const baseData = lang === 'en' ? SAMPLE_DATA_EN : SAMPLE_DATA_SV;
    
    // Applicera profil om den finns
    const guruProfile = TECH_GURU_PROFILES[profile] || TECH_GURU_PROFILES['said'];
    const data: PortfolioDataV2 = {
        ...baseData,
        fullName: guruProfile.fullName,
        firstName: guruProfile.firstName,
        lastName: guruProfile.lastName,
        title: guruProfile.title,
        tagline: guruProfile.tagline,
        profileImageUrl: guruProfile.profileImageUrl,
        // Point CV link to the CV preview API instead of a static file
        cvUrl: `/api/cv-preview?template=said-dark&profile=${profile}`,
    };

    // Rendera portfolion med previewMode för kompakta sektioner
    const html = renderPortfolioV2(data, template, { previewMode: true });

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}
