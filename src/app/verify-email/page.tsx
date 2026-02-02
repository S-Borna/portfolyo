'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button, Card, Icons } from '@/components/ui';
import { supabase } from '@/lib/supabase';

const { Mail, ArrowRight, Sparkles, Loader2 } = Icons;

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [isResending, setIsResending] = useState(false);

    const handleResendEmail = async () => {
        if (!email) {
            toast.error('E-postadress saknas');
            return;
        }

        setIsResending(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) {
                toast.error('Kunde inte skicka om e-post: ' + error.message);
            } else {
                toast.success('Bekräftelselänk skickad!');
            }
        } catch (err) {
            console.error('Resend error:', err);
            toast.error('Ett fel uppstod');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">PORTFOLYO</span>
                </Link>

                <Card className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="h-8 w-8 text-violet-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Bekräfta din e-post
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                        Vi har skickat en bekräftelselänk till:
                    </p>

                    {email && (
                        <p className="text-violet-600 font-medium mb-6">
                            {email}
                        </p>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-900 mb-2">
                            📬 Kolla din inkorg och klicka på bekräftelselänken
                        </p>
                        <p className="text-xs text-blue-700">
                            Kom ihåg att kolla i skräpposten om du inte hittar mailet
                        </p>
                    </div>

                    {/* Resend button */}
                    {email && (
                        <div className="space-y-4">
                            <Button
                                onClick={handleResendEmail}
                                disabled={isResending}
                                variant="outline"
                                className="w-full"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Skickar...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Skicka om bekräftelselänk
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-gray-500">
                                Tog inte emot något mail? Kontrollera att e-postadressen är korrekt
                            </p>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                    </div>

                    {/* Back to login */}
                    <Link
                        href="/login"
                        className="text-sm text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-1"
                    >
                        Tillbaka till inloggning
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Redan bekräftat?{' '}
                    <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                        Logga in
                    </Link>
                </p>
            </div>
        </div>
    );
}
