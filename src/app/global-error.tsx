'use client';

import { ErrorBoundary, PageError } from '@/components/feedback';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error);
    }, [error]);

    return (
        <html lang="sv">
            <body className="bg-[#0a0a0a] text-white min-h-screen">
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Ett allvarligt fel uppstod
                        </h1>
                        <p className="text-zinc-400 mb-8">
                            Vi ber om ursäkt för besväret. Försök att ladda om sidan.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={reset}
                                className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                Försök igen
                            </button>
                            <a
                                href="/"
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                            >
                                Till startsidan
                            </a>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-8 text-left">
                                <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-400">
                                    Teknisk information
                                </summary>
                                <pre className="mt-2 p-4 bg-zinc-900 rounded-lg text-xs text-red-400 overflow-auto max-h-48">
                                    {error.message}
                                    {error.digest && `\n\nDigest: ${error.digest}`}
                                    {error.stack && `\n\n${error.stack}`}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
