import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Portfolio, CV, OnboardingData, PortfolioTemplate } from './types';
import { generateId, generateSlug } from './utils';

interface PortfolyoStore {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Portfolios & CVs
  portfolios: Portfolio[];
  cvs: CV[];
  activePortfolioId: string | null;
  activeCVId: string | null;
  
  // Onboarding
  onboarding: OnboardingData;
  
  // Credits
  credits: number;
  creditsUsed: number;
  
  // Actions - Auth
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Actions - Credits
  useCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  
  // Actions - Portfolios
  createPortfolio: (data: Partial<Portfolio>) => Portfolio;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string | null) => void;
  publishPortfolio: (id: string) => void;
  
  // Actions - CVs
  createCV: (data: Partial<CV>) => CV;
  updateCV: (id: string, updates: Partial<CV>) => void;
  deleteCV: (id: string) => void;
  setActiveCV: (id: string | null) => void;
  
  // Actions - Onboarding
  updateOnboarding: (updates: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  completeOnboarding: () => Portfolio;
}

const initialOnboarding: OnboardingData = {
  step: 0,
  source: 'manual',
  fullName: '',
  email: '',
  title: '',
  location: '',
  currentSituation: 'student',
  yearsExperience: '0-1',
  targetRole: '',
  educations: [],
  experiences: [],
  topSkills: [],
  learningSkills: [],
  projects: [],
  seekingType: '',
  seekingPeriod: '',
  seekingLocation: '',
  interests: [],
  template: 'developer',
  primaryColor: '#8B5CF6',
};

export const usePortfolyoStore = create<PortfolyoStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      portfolios: [],
      cvs: [],
      activePortfolioId: null,
      activeCVId: null,
      onboarding: initialOnboarding,
      credits: 0,
      creditsUsed: 0,

      // Auth Actions
      login: (user) => set({ 
        user, 
        isAuthenticated: true,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        portfolios: [],
        cvs: [],
        activePortfolioId: null,
        activeCVId: null,
        credits: 0,
        creditsUsed: 0,
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates, updatedAt: new Date() } : null,
      })),

      // Credit Actions
      useCredits: (amount) => {
        const { credits } = get();
        if (credits < amount) return false;
        set((state) => ({
          credits: state.credits - amount,
          creditsUsed: state.creditsUsed + amount,
        }));
        return true;
      },
      
      addCredits: (amount) => set((state) => ({
        credits: state.credits + amount,
      })),

      // Portfolio Actions
      createPortfolio: (data) => {
        const id = generateId();
        const slug = data.profile?.fullName 
          ? generateSlug(data.profile.fullName) 
          : generateSlug('portfolio-' + id.slice(0, 6));
        
        const portfolio: Portfolio = {
          id,
          userId: get().user?.id || '',
          slug,
          template: 'developer',
          profile: {
            fullName: '',
            title: '',
            tagline: '',
            bio: '',
            highlights: [],
          },
          projects: [],
          timeline: [],
          techStack: [],
          contact: {
            email: '',
            showContactForm: true,
          },
          settings: {
            primaryColor: '#8B5CF6',
            accentColor: '#6366F1',
            fontFamily: 'inter',
            darkMode: true,
            showAnalytics: false,
          },
          analytics: {
            totalViews: 0,
            uniqueVisitors: 0,
            cvDownloads: 0,
            contactClicks: 0,
          },
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };

        set((state) => ({
          portfolios: [...state.portfolios, portfolio],
          activePortfolioId: id,
        }));

        return portfolio;
      },

      updatePortfolio: (id, updates) => set((state) => ({
        portfolios: state.portfolios.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
      })),

      deletePortfolio: (id) => set((state) => ({
        portfolios: state.portfolios.filter((p) => p.id !== id),
        activePortfolioId: state.activePortfolioId === id ? null : state.activePortfolioId,
      })),

      setActivePortfolio: (id) => set({ activePortfolioId: id }),

      publishPortfolio: (id) => set((state) => ({
        portfolios: state.portfolios.map((p) =>
          p.id === id 
            ? { ...p, status: 'published' as const, publishedAt: new Date(), updatedAt: new Date() } 
            : p
        ),
      })),

      // CV Actions
      createCV: (data) => {
        const id = generateId();
        
        const cv: CV = {
          id,
          userId: get().user?.id || '',
          name: 'Nytt CV',
          template: 'modern',
          personalInfo: {
            fullName: '',
            title: '',
            email: '',
          },
          summary: '',
          experience: [],
          education: [],
          skills: [],
          settings: {
            primaryColor: '#8B5CF6',
            showPhoto: false,
            pageSize: 'a4',
            fontSize: 'medium',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };

        set((state) => ({
          cvs: [...state.cvs, cv],
          activeCVId: id,
        }));

        return cv;
      },

      updateCV: (id, updates) => set((state) => ({
        cvs: state.cvs.map((cv) =>
          cv.id === id ? { ...cv, ...updates, updatedAt: new Date() } : cv
        ),
      })),

      deleteCV: (id) => set((state) => ({
        cvs: state.cvs.filter((cv) => cv.id !== id),
        activeCVId: state.activeCVId === id ? null : state.activeCVId,
      })),

      setActiveCV: (id) => set({ activeCVId: id }),

      // Onboarding Actions
      updateOnboarding: (updates) => set((state) => ({
        onboarding: { ...state.onboarding, ...updates },
      })),

      resetOnboarding: () => set({ onboarding: initialOnboarding }),

      completeOnboarding: () => {
        const { onboarding, createPortfolio } = get();
        
        const portfolio = createPortfolio({
          template: onboarding.template as PortfolioTemplate,
          profile: {
            fullName: onboarding.fullName,
            title: onboarding.title,
            tagline: `${onboarding.title} | ${onboarding.currentSituation === 'student' ? 'Student' : onboarding.targetRole}`,
            bio: '',
            location: onboarding.location,
            highlights: [],
            seeking: onboarding.seekingType,
            seekingDetails: {
              type: onboarding.seekingType,
              period: onboarding.seekingPeriod,
              location: onboarding.seekingLocation,
              interests: onboarding.interests,
            },
          },
          timeline: onboarding.educations.map((edu, index) => ({
            id: generateId(),
            title: edu.degree,
            subtitle: edu.institution,
            description: edu.field,
            period: `${edu.startDate} - ${edu.current ? 'Pågående' : edu.endDate}`,
            type: 'education' as const,
            current: edu.current,
            order: index,
          })),
          techStack: onboarding.topSkills.map((skill) => ({
            name: skill,
            icon: skill.toLowerCase().replace(/[.\s]/g, ''),
            category: 'tools' as const,
            proficiency: 'intermediate' as const,
          })),
          contact: {
            email: onboarding.email,
            phone: onboarding.phone,
            showContactForm: true,
          },
          settings: {
            primaryColor: onboarding.primaryColor,
            accentColor: '#6366F1',
            fontFamily: 'inter',
            darkMode: true,
            showAnalytics: false,
          },
        });

        set({ onboarding: initialOnboarding });
        
        return portfolio;
      },
    }),
    {
      name: 'portfolyo-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        portfolios: state.portfolios,
        cvs: state.cvs,
        credits: state.credits,
        creditsUsed: state.creditsUsed,
        onboarding: state.onboarding,
      }),
    }
  )
);
