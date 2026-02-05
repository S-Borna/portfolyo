// ============ PORTFOLYO.SE TYPES ============

// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro';
  credits: number;
  creditsUsed: number;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  userId: string;
  slug: string;
  customDomain?: string;
  template: PortfolioTemplate;
  profile: ProfileData;
  projects: ProjectShowcase[];
  timeline: TimelineEntry[];
  techStack: TechStackItem[];
  contact: ContactInfo;
  settings: PortfolioSettings;
  analytics: PortfolioAnalytics;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type PortfolioTemplate = 'developer' | 'designer' | 'business' | 'creative';

export interface ProfileData {
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  avatar?: string;
  location?: string;
  highlights: Highlight[];
  seeking?: string;
  seekingDetails?: {
    type: string;
    period: string;
    location: string;
    interests: string[];
  };
}

export interface Highlight {
  icon: string;
  value: string;
  label: string;
}

export interface ProjectShowcase {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
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

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  period: string;
  type: 'education' | 'work' | 'project' | 'achievement';
  current: boolean;
  achievements?: string[];
  tags?: string[];
  order: number;
}

export interface TechStackItem {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  proficiency: 'learning' | 'intermediate' | 'advanced' | 'expert';
}

export interface ContactInfo {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  calendly?: string;
  showContactForm: boolean;
}

export interface PortfolioSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: 'inter' | 'poppins' | 'roboto' | 'space-grotesk';
  darkMode: boolean;
  showAnalytics: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface PortfolioAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  cvDownloads: number;
  contactClicks: number;
  lastViewedAt?: Date;
}

// CV Types
export interface CV {
  id: string;
  userId: string;
  portfolioId?: string;
  name: string;
  template: CVTemplate;
  personalInfo: CVPersonalInfo;
  summary: string;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkillCategory[];
  languages?: CVLanguage[];
  certifications?: CVCertification[];
  projects?: CVProject[];
  settings: CVSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type CVTemplate = 'modern' | 'classic' | 'minimal' | 'creative' |
  // V2 Templates (sidebar-layout)
  'said-dark' | 'said-light' | 'said-navy' | 'said-forest' |
  'tf-noir-extreme' | 'tf-oud-wood' | 'tf-tobacco-vanille' | 'tf-tuscan-leather' |
  'tf-velvet-orchid' | 'tf-black-orchid' |
  'exec-charcoal' | 'exec-midnight-blue' | 'exec-slate' |
  string; // Allow any V2 template id

export interface CVPersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  order: number;
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  gpa?: string;
  achievements?: string[];
  order: number;
}

export interface CVSkillCategory {
  name: string;
  skills: string[];
}

export interface CVLanguage {
  language: string;
  level: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

export interface CVCertification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CVProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface CVSettings {
  primaryColor: string;
  showPhoto: boolean;
  pageSize: 'a4' | 'letter';
  fontSize: 'small' | 'medium' | 'large';
}

// Onboarding Types
export interface OnboardingData {
  step: number;
  source: 'linkedin' | 'manual' | 'github';
  linkedInUrl?: string;
  githubUsername?: string;
  fullName: string;
  email: string;
  phone?: string;
  title: string;
  location?: string;
  currentSituation: 'student' | 'job-seeking' | 'employed' | 'freelance';
  yearsExperience: string;
  targetRole: string;
  educations: OnboardingEducation[];
  experiences: OnboardingExperience[];
  topSkills: string[];
  learningSkills: string[];
  projects: OnboardingProject[];
  seekingType: string;
  seekingPeriod: string;
  seekingLocation: string;
  interests: string[];
  template: PortfolioTemplate;
  primaryColor: string;
}

export interface OnboardingEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface OnboardingExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
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

// AI Generation Types
export interface AIGenerationRequest {
  type: 'bio' | 'project-description' | 'achievement' | 'cv-summary' | 'full-portfolio' | 'rewrite';
  context: Record<string, unknown>;
  tone?: 'professional' | 'friendly' | 'confident' | 'humble';
  length?: 'short' | 'medium' | 'long';
}

export interface AIGenerationResponse {
  content: string;
  alternatives?: string[];
  creditsUsed: number;
}

// Pricing - Ny modell: Engångsavgift + credits
export const PRICING = {
  oneTime: {
    name: 'Publicering',
    price: 49,
    description: 'Engångsavgift – betala en gång, hostat för alltid',
    includes: [
      'Portfolio eller CV publicerat live',
      'Hosting 24/7 på portfolyo.se/{username}',
      '1 CV-generering ingår',
      'PDF-export av CV',
      'Inkludera CV i din portfolio',
    ],
  },
  credits: {
    name: 'Credits',
    pricePerCredit: 14.99,
    description: 'Köp credits för ändringar och tillägg',
    tiers: [
      { credits: 1, label: 'Ändring på befintligt CV' },
      { credits: 2, label: 'Nytt CV eller ändring på portfolio' },
      { credits: 4, label: 'Ny portfolio' },
    ],
    bundles: [
      { credits: 4, price: 39, savings: '35%' },
      { credits: 10, price: 79, savings: '47%' },
    ],
  },
} as const;

export const CREDIT_PACKS = [
  { credits: 10, price: 29 },
  { credits: 25, price: 59 },
  { credits: 100, price: 199 },
] as const;

export const CREDIT_COSTS = {
  'bio': 1,
  'project-description': 1,
  'achievement': 1,
  'cv-summary': 1,
  'full-portfolio': 3,
  'rewrite': 1,
} as const;

// Learning Resources
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'course' | 'tool' | 'guide' | 'template';
  category: 'sql' | 'devops' | 'prompting' | 'career' | 'interview';
  icon: string;
  featured: boolean;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'sql-arena',
    title: 'SQL Arena',
    description: 'Interaktiv SQL-lärplattform med 70+ övningar i 6 nivåer',
    url: 'https://sql.saidborna.com',
    type: 'course',
    category: 'sql',
    icon: '🎯',
    featured: true,
  },
  {
    id: 'ginonova',
    title: 'GinoNova',
    description: 'AI-driven lärplattform för DevOps-ingenjörer med 1435 flashcards',
    url: 'https://www.ginonova.com',
    type: 'course',
    category: 'devops',
    icon: '🧠',
    featured: true,
  },
  {
    id: 'prompt-guide',
    title: 'Prompt Guide',
    description: 'Lär dig skriva effektiva AI-prompts för bättre resultat',
    url: '/guides/prompting',
    type: 'guide',
    category: 'prompting',
    icon: '📝',
    featured: true,
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description: 'Förbered dig för tekniska intervjuer med övningar och tips',
    url: '/guides/interview',
    type: 'guide',
    category: 'interview',
    icon: '💼',
    featured: false,
  },
];

export const TECH_STACK_OPTIONS = [
  { name: 'React', icon: 'react', category: 'frontend' },
  { name: 'Next.js', icon: 'nextdotjs', category: 'frontend' },
  { name: 'Vue.js', icon: 'vuedotjs', category: 'frontend' },
  { name: 'TypeScript', icon: 'typescript', category: 'frontend' },
  { name: 'JavaScript', icon: 'javascript', category: 'frontend' },
  { name: 'TailwindCSS', icon: 'tailwindcss', category: 'frontend' },
  { name: 'HTML5', icon: 'html5', category: 'frontend' },
  { name: 'CSS3', icon: 'css3', category: 'frontend' },
  { name: 'Python', icon: 'python', category: 'backend' },
  { name: 'Node.js', icon: 'nodedotjs', category: 'backend' },
  { name: 'FastAPI', icon: 'fastapi', category: 'backend' },
  { name: 'Django', icon: 'django', category: 'backend' },
  { name: 'Express', icon: 'express', category: 'backend' },
  { name: 'Java', icon: 'openjdk', category: 'backend' },
  { name: 'C#', icon: 'csharp', category: 'backend' },
  { name: 'Go', icon: 'go', category: 'backend' },
  { name: 'PostgreSQL', icon: 'postgresql', category: 'database' },
  { name: 'MySQL', icon: 'mysql', category: 'database' },
  { name: 'MongoDB', icon: 'mongodb', category: 'database' },
  { name: 'Redis', icon: 'redis', category: 'database' },
  { name: 'SQLite', icon: 'sqlite', category: 'database' },
  { name: 'Supabase', icon: 'supabase', category: 'database' },
  { name: 'Docker', icon: 'docker', category: 'devops' },
  { name: 'Kubernetes', icon: 'kubernetes', category: 'devops' },
  { name: 'GitHub Actions', icon: 'githubactions', category: 'devops' },
  { name: 'AWS', icon: 'amazonwebservices', category: 'devops' },
  { name: 'Linux', icon: 'linux', category: 'devops' },
  { name: 'Terraform', icon: 'terraform', category: 'devops' },
  { name: 'Git', icon: 'git', category: 'tools' },
  { name: 'GitHub', icon: 'github', category: 'tools' },
  { name: 'VS Code', icon: 'visualstudiocode', category: 'tools' },
  { name: 'Figma', icon: 'figma', category: 'tools' },
  { name: 'Jira', icon: 'jira', category: 'tools' },
] as const;
