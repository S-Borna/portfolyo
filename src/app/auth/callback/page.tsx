'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePortfolyoStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering - this page needs runtime env vars
export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = usePortfolyoStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check for error in URL (from OAuth or email confirmation)
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    console.error('Auth error:', errorParam, errorDescription);
                    setError(errorDescription || 'Ett fel uppstod vid inloggning');
                    setTimeout(() => router.push('/login'), 3000);
                    return;
                }

                // For OAuth and email confirmation, Supabase sets the session via URL hash
                // We need to exchange the code for a session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setError('Kunde inte hämta session');
                    setTimeout(() => router.push('/login'), 3000);
                    return;
                }

                if (!session?.user) {
                    // Try to exchange code if present
                    const code = searchParams.get('code');
                    if (code) {
                        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                        if (exchangeError) {
                            console.error('Code exchange error:', exchangeError);
                            setError('Kunde inte verifiera koden');
                            setTimeout(() => router.push('/login'), 3000);
                            return;
                        }
                        if (data.session) {
                            loginUser(data.session.user);
                            return;
                        }
                    }

                    router.push('/login');
                    return;
                }

                loginUser(session.user);
            } catch (err) {
                console.error('Callback error:', err);
                setError('Ett oväntat fel uppstod');
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        const loginUser = (user: any) => {
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
    }, [router, login, searchParams]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-gray-900 font-medium mb-2">Något gick fel</p>
                    <p className="text-gray-600 text-sm">{error}</p>
                    <p className="text-gray-400 text-xs mt-2">Omdirigerar till inloggning...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4" />
                <p className="text-gray-600">Loggar in...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4" />
                    <p className="text-gray-600">Laddar...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
