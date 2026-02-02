'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/ui';
import { isUsernameAvailable, createPortfolio, publishPortfolio, supabase } from '@/lib/supabase';

const { X, Check, Loader2, Globe, AlertCircle } = Icons;

interface ActivatePortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (username: string) => void;
    userId: string;
    userEmail: string;
    userName: string;
}

export default function ActivatePortfolioModal({
    isOpen,
    onClose,
    onSuccess,
    userId,
    userEmail,
    userName,
}: ActivatePortfolioModalProps) {
    const [username, setUsername] = useState('');
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generera ett förslag baserat på användarens namn
    useEffect(() => {
        if (isOpen && userName) {
            const suggested = userName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .slice(0, 20);
            setUsername(suggested);
        }
    }, [isOpen, userName]);

    // Debounce username check
    useEffect(() => {
        if (!username || username.length < 3) {
            setAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setChecking(true);
            const isAvailable = await isUsernameAvailable(username);
            setAvailable(isAvailable);
            setChecking(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const handleActivate = async () => {
        if (!available || !username || username.length < 3) return;

        setCreating(true);
        setError(null);

        try {
            // Skapa portfolio i Supabase
            const portfolio = await createPortfolio({
                user_id: userId,
                username: username.toLowerCase(),
                template_id: 'developer',
                title: userName,
                tagline: 'YH-student söker LIA',
                bio: null,
                location: null,
                email: userEmail,
                phone: null,
                website: null,
                github: null,
                linkedin: null,
                tech_stack: [],
                projects: [],
                timeline: [],
                theme: { primaryColor: '#8B5CF6' },
                is_published: true,
                is_seeking_lia: true,
                lia_period: null,
            });

            if (portfolio) {
                onSuccess(username);
            } else {
                setError('Kunde inte skapa portfolio. Försök igen.');
            }
        } catch (err) {
            console.error('Error creating portfolio:', err);
            setError('Ett fel uppstod. Försök igen.');
        } finally {
            setCreating(false);
        }
    };

    if (!isOpen) return null;

    const isValidUsername = /^[a-z0-9]+$/.test(username) && username.length >= 3;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="h-5 w-5 text-gray-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-6 w-6 text-violet-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Aktivera din portfolio</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Välj ett användarnamn för din subdomain
                    </p>
                </div>

                {/* Username input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Användarnamn
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                            placeholder="dittnamn"
                            maxLength={20}
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {checking ? (
                                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                            ) : available === true ? (
                                <Check className="h-5 w-5 text-emerald-500" />
                            ) : available === false ? (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : null}
                        </div>
                    </div>

                    {/* URL preview */}
                    <div className="mt-2 text-sm">
                        <span className="text-gray-500">Din URL: </span>
                        <span className="text-violet-600 font-medium">
                            {username || 'dittnamn'}.portfolyo.se
                        </span>
                    </div>

                    {/* Status message */}
                    {username.length > 0 && username.length < 3 && (
                        <p className="mt-2 text-sm text-amber-600">
                            Minst 3 tecken krävs
                        </p>
                    )}
                    {available === false && (
                        <p className="mt-2 text-sm text-red-600">
                            Detta användarnamn är redan taget
                        </p>
                    )}
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        onClick={handleActivate}
                        disabled={!isValidUsername || !available || creating}
                        className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {creating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Aktiverar...
                            </>
                        ) : (
                            'Aktivera'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
