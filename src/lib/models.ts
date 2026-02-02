// ============================================
// PORTFOLYO.SE - Unified Type System
// Single source of truth for all data models
// ============================================

// ============================================
// DATABASE TYPES (matches Supabase schema)
// ============================================

export interface DbProfile {
    id: string;
    username: string | null;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    tier: Tier;
    credits: number;
    stripe_customer_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbPortfolio {
    id: string;
    user_id: string;
    username: string | null;
    template_id: string;
    template_family: string;
    title: string;
    tagline: string | null;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
    calendly: string | null;
    highlights: DbHighlight[];
    skills: DbSkill[];
    projects: DbProject[];
    timeline: DbTimelineEntry[];
    is_seeking: boolean;
    seeking_type: SeekingType | null;
    seeking_title: string | null;
    seeking_description: string | null;
    seeking_period: string | null;
    seeking_location: string | null;
    seeking_interests: string[];
    theme: DbTheme;
    language: Language;
    show_cv_download: boolean;
    seo_title: string | null;
    seo_description: string | null;
    og_image: string | null;
    status: PortfolioStatus;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbCV {
    id: string;
    user_id: string;
    portfolio_id: string | null;
    template_id: string;
    name: string;
    full_name: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
    summary: string | null;
    experience: DbCVExperience[];
    education: DbCVEducation[];
    skills: DbCVSkillCategory[];
    languages: DbCVLanguage[];
    certifications: DbCVCertification[];
    projects: DbCVProject[];
    settings: DbCVSettings;
    created_at: string;
    updated_at: string;
}

export interface DbAnalytics {
    id: string;
    portfolio_id: string;
    total_views: number;
    unique_visitors: number;
    cv_downloads: number;
    contact_clicks: number;
    last_viewed_at: string | null;
    created_at: string;
}

// ============================================
// JSONB FIELD TYPES
// ============================================

export interface DbHighlight {
    icon: string;
    value: string;
    label: string;
}

export interface DbSkill {
    name: string;
    icon?: string;
    category?: SkillCategory;
    proficiency?: Proficiency;
}

export interface DbProject {
    id: string;
    name: string;
    description: string;
    long_description?: string;
    image?: string;
    tags: string[];
    links: {
        live?: string;
        github?: string;
        demo?: string;
    };
    featured: boolean;
    order: number;
}

export interface DbTimelineEntry {
    id: string;
    type: TimelineType;
    title: string;
    subtitle: string;
    description: string;
    period: string;
    current: boolean;
    achievements?: string[];
    tags?: string[];
    order: number;
}

export interface DbTheme {
    accent_color?: string;
    font_heading?: string;
    font_body?: string;
    dark_mode?: boolean;
}

export interface DbCVExperience {
    id: string;
    company: string;
    title: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
    achievements: string[];
    order: number;
}

export interface DbCVEducation {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
    gpa?: string;
    achievements?: string[];
    order: number;
}

export interface DbCVSkillCategory {
    name: string;
    skills: string[];
}

export interface DbCVLanguage {
    language: string;
    level: LanguageLevel;
}

export interface DbCVCertification {
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export interface DbCVProject {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
}

export interface DbCVSettings {
    primary_color: string;
    show_photo: boolean;
    page_size: PageSize;
    font_size: FontSize;
}

// ============================================
// ENUMS & UNIONS
// ============================================

export type Tier = 'free' | 'standard' | 'premium';
export type PortfolioStatus = 'draft' | 'published' | 'archived';
export type Language = 'sv' | 'en';
export type SeekingType = 'lia' | 'job' | 'freelance';
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'design' | 'other';
export type Proficiency = 'learning' | 'intermediate' | 'advanced' | 'expert';
export type TimelineType = 'education' | 'work' | 'project' | 'achievement';
export type LanguageLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
export type PageSize = 'a4' | 'letter';
export type FontSize = 'small' | 'medium' | 'large';

// ============================================
// TEMPLATE TYPES
// ============================================

export type TemplateFamily =
    | 'crimson'    // Original saidborna.com - dark, crimson accent, floating orbs
    | 'arctic'     // Light, clean, blue accents
    | 'noir'       // Pure black, minimal, white text
    | 'forest'     // Dark green, nature-inspired
    | 'studio'     // Creative, asymmetric, bold colors
    | 'corporate'; // Professional, navy/gray, traditional

export interface TemplateDefinition {
    id: string;
    family: TemplateFamily;
    name: string;
    description: string;
    style: TemplateStyle;
    features: TemplateFeature[];
    tier: Tier;
    preview_url: string;
}

export interface TemplateStyle {
    // Colors
    bg_primary: string;
    bg_secondary: string;
    bg_card: string;
    accent: string;
    accent_glow: string;
    text_primary: string;
    text_secondary: string;
    text_muted: string;

    // Typography
    font_heading: string;
    font_body: string;

    // Layout
    hero_layout: 'split' | 'centered' | 'asymmetric';
    project_layout: 'grid' | 'list' | 'masonry';

    // Effects
    has_floating_orbs: boolean;
    has_noise_texture: boolean;
    has_gradient_bg: boolean;
    has_sticky_nav: boolean;
}

export type TemplateFeature =
    | 'timeline'
    | 'stats'
    | 'tech_stack'
    | 'seeking_banner'
    | 'cv_download'
    | 'project_grid'
    | 'contact_form'
    | 'language_switch'
    | 'dark_mode'
    | 'floating_orbs'
    | 'noise_texture'
    | 'particles_bg'
    | 'gradient_bg'
    | 'sticky_nav'
    | 'scroll_progress';

// ============================================
// RENDERER TYPES
// ============================================

export interface PortfolioRenderData {
    // Identity
    full_name: string;
    title: string;
    tagline: string;
    bio: string;
    avatar?: string;
    location: string;

    // Contact
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;

    // Content
    highlights: DbHighlight[];
    skills: string[];
    projects: Array<{
        name: string;
        description: string;
        tags: string[];
        url?: string;
        image?: string;
    }>;
    experience: Array<{
        title: string;
        company: string;
        period: string;
        description?: string;
        current?: boolean;
    }>;
    education: Array<{
        degree: string;
        institution: string;
        period: string;
    }>;

    // Seeking
    seeking?: {
        type: SeekingType;
        title: string;
        description: string;
        period?: string;
        location?: string;
        interests?: string[];
    };

    // Settings
    language: Language;
    show_cv: boolean;
    cv_url?: string;
}

export interface CVRenderData {
    full_name: string;
    title: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary: string;
    experience: DbCVExperience[];
    education: DbCVEducation[];
    skills: DbCVSkillCategory[];
    languages: DbCVLanguage[];
    certifications: DbCVCertification[];
    projects: DbCVProject[];
}

// ============================================
// ONBOARDING TYPES
// ============================================

export interface OnboardingState {
    step: number;
    completed: boolean;

    // Basic info
    full_name: string;
    email: string;
    phone: string;
    title: string;
    location: string;

    // Background
    current_situation: CurrentSituation;
    years_experience: YearsExperience;

    // Content
    education: OnboardingEducation[];
    experience: OnboardingExperience[];
    skills: string[];
    projects: OnboardingProject[];

    // Seeking
    is_seeking: boolean;
    seeking_type: SeekingType;
    seeking_period: string;
    seeking_location: string;
    seeking_interests: string[];

    // Design
    template_id: string;
}

export type CurrentSituation = 'student' | 'job-seeking' | 'employed' | 'freelance';
export type YearsExperience = '0-1' | '1-3' | '3-5' | '5-10' | '10+';

export interface OnboardingEducation {
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    current: boolean;
}

export interface OnboardingExperience {
    company: string;
    title: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
}

export interface OnboardingProject {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PublishRequest {
    portfolio_id: string;
    username: string;
}

export interface PublishResponse {
    success: boolean;
    url?: string;
    error?: string;
}

// ============================================
// PRICING & LIMITS
// ============================================

export const TIER_LIMITS = {
    free: {
        portfolios: 1,
        cvs: 1,
        templates: 3,
        ai_credits: 3,
        custom_domain: false,
        analytics: false,
    },
    standard: {
        portfolios: 3,
        cvs: 5,
        templates: 20,
        ai_credits: 25,
        custom_domain: false,
        analytics: true,
    },
    premium: {
        portfolios: 10,
        cvs: 25,
        templates: 100,
        ai_credits: 100,
        custom_domain: true,
        analytics: true,
    },
} as const;

export const PRICING = {
    standard: {
        monthly: 79,
        yearly: 59,
        name: 'Standard',
        description: 'För den som vill sticka ut',
    },
    premium: {
        monthly: 149,
        yearly: 119,
        name: 'Premium',
        description: 'För proffs och ambitiösa',
    },
} as const;

// ============================================
// TECH STACK OPTIONS
// ============================================

export const TECH_STACK_OPTIONS: Array<{
    name: string;
    icon: string;
    category: SkillCategory;
}> = [
        // Frontend
        { name: 'React', icon: 'react', category: 'frontend' },
        { name: 'Next.js', icon: 'nextdotjs', category: 'frontend' },
        { name: 'Vue.js', icon: 'vuedotjs', category: 'frontend' },
        { name: 'TypeScript', icon: 'typescript', category: 'frontend' },
        { name: 'JavaScript', icon: 'javascript', category: 'frontend' },
        { name: 'TailwindCSS', icon: 'tailwindcss', category: 'frontend' },
        { name: 'HTML5', icon: 'html5', category: 'frontend' },
        { name: 'CSS3', icon: 'css3', category: 'frontend' },
        { name: 'Angular', icon: 'angular', category: 'frontend' },
        { name: 'Svelte', icon: 'svelte', category: 'frontend' },

        // Backend
        { name: 'Python', icon: 'python', category: 'backend' },
        { name: 'Node.js', icon: 'nodedotjs', category: 'backend' },
        { name: 'FastAPI', icon: 'fastapi', category: 'backend' },
        { name: 'Django', icon: 'django', category: 'backend' },
        { name: 'Express', icon: 'express', category: 'backend' },
        { name: 'Java', icon: 'openjdk', category: 'backend' },
        { name: 'C#', icon: 'csharp', category: 'backend' },
        { name: 'Go', icon: 'go', category: 'backend' },
        { name: 'Rust', icon: 'rust', category: 'backend' },
        { name: 'Ruby', icon: 'ruby', category: 'backend' },

        // Database
        { name: 'PostgreSQL', icon: 'postgresql', category: 'database' },
        { name: 'MySQL', icon: 'mysql', category: 'database' },
        { name: 'MongoDB', icon: 'mongodb', category: 'database' },
        { name: 'Redis', icon: 'redis', category: 'database' },
        { name: 'SQLite', icon: 'sqlite', category: 'database' },
        { name: 'Supabase', icon: 'supabase', category: 'database' },
        { name: 'Firebase', icon: 'firebase', category: 'database' },

        // DevOps
        { name: 'Docker', icon: 'docker', category: 'devops' },
        { name: 'Kubernetes', icon: 'kubernetes', category: 'devops' },
        { name: 'GitHub Actions', icon: 'githubactions', category: 'devops' },
        { name: 'AWS', icon: 'amazonwebservices', category: 'devops' },
        { name: 'Azure', icon: 'microsoftazure', category: 'devops' },
        { name: 'GCP', icon: 'googlecloud', category: 'devops' },
        { name: 'Linux', icon: 'linux', category: 'devops' },
        { name: 'Terraform', icon: 'terraform', category: 'devops' },
        { name: 'Ansible', icon: 'ansible', category: 'devops' },
        { name: 'Jenkins', icon: 'jenkins', category: 'devops' },

        // Tools
        { name: 'Git', icon: 'git', category: 'tools' },
        { name: 'GitHub', icon: 'github', category: 'tools' },
        { name: 'GitLab', icon: 'gitlab', category: 'tools' },
        { name: 'VS Code', icon: 'visualstudiocode', category: 'tools' },
        { name: 'Figma', icon: 'figma', category: 'tools' },
        { name: 'Jira', icon: 'jira', category: 'tools' },
        { name: 'Postman', icon: 'postman', category: 'tools' },
        { name: 'Notion', icon: 'notion', category: 'tools' },
    ];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert DB portfolio to render data
 */
export function toRenderData(portfolio: DbPortfolio): PortfolioRenderData {
    return {
        full_name: portfolio.title,
        title: portfolio.tagline || '',
        tagline: portfolio.tagline || '',
        bio: portfolio.bio || '',
        avatar: portfolio.avatar_url || undefined,
        location: portfolio.location || '',
        email: portfolio.email || '',
        phone: portfolio.phone || undefined,
        linkedin: portfolio.linkedin || undefined,
        github: portfolio.github || undefined,
        website: portfolio.website || undefined,
        highlights: portfolio.highlights || [],
        skills: (portfolio.skills || []).map(s => s.name),
        projects: (portfolio.projects || []).map(p => ({
            name: p.name,
            description: p.description,
            tags: p.tags,
            url: p.links?.live,
            image: p.image,
        })),
        experience: (portfolio.timeline || [])
            .filter(t => t.type === 'work')
            .map(t => ({
                title: t.title,
                company: t.subtitle,
                period: t.period,
                description: t.description,
                current: t.current,
            })),
        education: (portfolio.timeline || [])
            .filter(t => t.type === 'education')
            .map(t => ({
                degree: t.title,
                institution: t.subtitle,
                period: t.period,
            })),
        seeking: portfolio.is_seeking ? {
            type: portfolio.seeking_type || 'job',
            title: portfolio.seeking_title || '',
            description: portfolio.seeking_description || '',
            period: portfolio.seeking_period || undefined,
            location: portfolio.seeking_location || undefined,
            interests: portfolio.seeking_interests || [],
        } : undefined,
        language: portfolio.language,
        show_cv: portfolio.show_cv_download,
    };
}

/**
 * Convert CV to render data
 */
export function toCVRenderData(cv: DbCV): CVRenderData {
    return {
        full_name: cv.full_name,
        title: cv.title || '',
        email: cv.email || '',
        phone: cv.phone || undefined,
        location: cv.location || undefined,
        linkedin: cv.linkedin || undefined,
        github: cv.github || undefined,
        website: cv.website || undefined,
        summary: cv.summary || '',
        experience: cv.experience || [],
        education: cv.education || [],
        skills: cv.skills || [],
        languages: cv.languages || [],
        certifications: cv.certifications || [],
        projects: cv.projects || [],
    };
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Slugify username
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
