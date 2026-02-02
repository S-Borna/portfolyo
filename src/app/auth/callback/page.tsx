'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolyoStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { login } = usePortfolyoStore();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session?.user) {
                router.push('/login');
                return;
            }

            const user = session.user;

            login({
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
                createdAt: new Date(user.created_at),
                updatedAt: new Date(),
                plan: 'free',
                credits: 3,
                creditsUsed: 0,
            });

            router.push('/dashboard');
        };

        handleCallback();
    }, [router, login]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4" />
                <p className="text-gray-600">Loggar in...</p>
            </div>
        </div>
    );
}
