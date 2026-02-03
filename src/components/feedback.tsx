'use client';

import React from 'react';

// ============================================
// ERROR BOUNDARY
// ============================================

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Något gick fel
                        </h2>
                        <p className="text-zinc-400 mb-6">
                            Ett oväntat fel uppstod. Försök att ladda om sidan.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Ladda om sidan
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-400">
                                    Visa feldetaljer
                                </summary>
                                <pre className="mt-2 p-4 bg-zinc-900 rounded-lg text-xs text-red-400 overflow-auto">
                                    {this.state.error.message}
                                    {'\n\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ============================================
// LOADING COMPONENTS
// ============================================

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-10 h-10',
    };

    return (
        <svg
            className={`animate-spin ${sizeClasses[size]} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Laddar..."
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Laddar...' }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
                <Spinner size="lg" className="text-white mx-auto mb-4" />
                <p className="text-white text-lg">{message}</p>
            </div>
        </div>
    );
}

// ============================================
// SKELETON COMPONENTS
// ============================================

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-zinc-800 rounded ${className}`}
            aria-hidden="true"
        />
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
                />
            ))}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <SkeletonText lines={2} />
            <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function SkeletonPortfolioCard() {
    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}

export function SkeletonDashboard() {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                ))}
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonPortfolioCard key={i} />
                ))}
            </div>
        </div>
    );
}

// ============================================
// PAGE ERROR COMPONENT
// ============================================

interface PageErrorProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function PageError({
    title = 'Något gick fel',
    message = 'Vi kunde inte ladda innehållet. Försök igen.',
    onRetry
}: PageErrorProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
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
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-zinc-400 mb-8">{message}</p>
                <div className="flex gap-4 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Försök igen
                        </button>
                    )}
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                        Gå tillbaka
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// NOT FOUND COMPONENT
// ============================================

export function NotFound({
    title = 'Sidan hittades inte',
    message = 'Sidan du letar efter finns inte eller har flyttats.'
}: { title?: string; message?: string }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-zinc-800 mb-4">404</div>
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-zinc-400 mb-8">{message}</p>
                <a
                    href="/"
                    className="inline-block px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                >
                    Till startsidan
                </a>
            </div>
        </div>
    );
}
