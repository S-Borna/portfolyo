'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolyoStore } from '@/lib/store';
import { generateSlug } from '@/lib/utils';

export default function NewPortfolioPage() {
    const router = useRouter();
    const { user, isAuthenticated, createPortfolio } = usePortfolyoStore();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        // Create a new portfolio and redirect to editor
        const portfolio = createPortfolio({
            userId: user.id,
            slug: generateSlug(user.name || 'portfolio'),
            template: 'developer',
            profile: {
                fullName: user.name || '',
                title: '',
                tagline: '',
                bio: '',
                location: '',
                highlights: [],
            },
            projects: [],
            timeline: [],
            techStack: [],
            contact: {
                email: user.email || '',
                showContactForm: true,
            },
            settings: {
                primaryColor: '#8B5CF6',
                accentColor: '#6366F1',
                fontFamily: 'inter',
                darkMode: false,
                showAnalytics: false,
            },
            analytics: {
                totalViews: 0,
                uniqueVisitors: 0,
                cvDownloads: 0,
                contactClicks: 0,
            },
            status: 'draft',
        });

        router.push(`/portfolio/${portfolio.id}/edit`);
    }, [isAuthenticated, user, router, createPortfolio]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
    );
}
