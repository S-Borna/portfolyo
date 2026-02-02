/**
 * PORTFOLYO UI PRIMITIVES
 * Base components implementing design tokens
 *
 * These components enforce the UX Specification.
 * All UI should be built from these primitives.
 */

'use client';

import React, { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// BUTTON
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: React.ReactNode;
}

const buttonStyles = {
    base: 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed',
    variants: {
        primary: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 disabled:opacity-50',
        secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 focus-visible:ring-zinc-500 disabled:opacity-50',
        ghost: 'bg-transparent text-zinc-400 hover:text-white focus-visible:ring-zinc-500',
    },
    sizes: {
        sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
        md: 'h-10 px-4 text-sm rounded-lg gap-2',
        lg: 'h-12 px-6 text-base rounded-xl gap-2',
    },
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'secondary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    buttonStyles.base,
                    buttonStyles.variants[variant],
                    buttonStyles.sizes[size],
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Spinner size={size === 'sm' ? 14 : 16} />
                        <span className="sr-only">Laddar...</span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = 'Button';

// ============================================================================
// INPUT
// ============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const inputStyles = {
    wrapper: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-white',
    input: 'w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 transition-colors focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
    error: 'text-sm text-red-500',
    hint: 'text-sm text-zinc-500',
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className, id, required, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

        return (
            <div className={cn(inputStyles.wrapper, className)}>
                {label && (
                    <label htmlFor={inputId} className={inputStyles.label}>
                        {label}
                        {required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(inputStyles.input, error && 'border-red-500')}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    required={required}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className={inputStyles.error} role="alert">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${inputId}-hint`} className={inputStyles.hint}>
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

// ============================================================================
// TEXTAREA
// ============================================================================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const textareaStyles = {
    textarea: 'w-full min-h-[100px] px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 transition-colors focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none',
} as const;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className, id, required, ...props }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

        return (
            <div className={cn(inputStyles.wrapper, className)}>
                {label && (
                    <label htmlFor={textareaId} className={inputStyles.label}>
                        {label}
                        {required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(textareaStyles.textarea, error && 'border-red-500')}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
                    required={required}
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className={inputStyles.error} role="alert">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${textareaId}-hint`} className={inputStyles.hint}>
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

// ============================================================================
// CARD
// ============================================================================

interface CardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    onClick?: () => void;
}

const cardStyles = {
    base: 'bg-zinc-900 border border-zinc-800 rounded-2xl',
    interactive: 'cursor-pointer transition-transform hover:-translate-y-1',
    padding: 'p-6',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, interactive = false, onClick, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    cardStyles.base,
                    cardStyles.padding,
                    interactive && cardStyles.interactive,
                    className
                )}
                onClick={onClick}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';

// ============================================================================
// STATUS BADGE
// ============================================================================

type StatusType = 'live' | 'draft';

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const statusStyles = {
    live: {
        container: 'bg-emerald-500/5 border-emerald-500/20',
        dot: 'bg-emerald-500 animate-pulse',
        text: 'text-emerald-500',
        label: 'Live',
    },
    draft: {
        container: 'bg-amber-500/5 border-amber-500/20',
        dot: 'bg-amber-500',
        text: 'text-amber-500',
        label: 'Utkast',
    },
} as const;

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const styles = statusStyles[status];

    return (
        <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border',
            styles.container,
            className
        )}>
            <span className={cn('w-2 h-2 rounded-full', styles.dot)} />
            <span className={cn('text-sm font-medium', styles.text)}>
                {styles.label}
            </span>
        </div>
    );
}

// ============================================================================
// SPINNER
// ============================================================================

interface SpinnerProps {
    size?: number;
    className?: string;
}

export function Spinner({ size = 20, className }: SpinnerProps) {
    return (
        <svg
            className={cn('animate-spin', className)}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

// ============================================================================
// STAT CARD (Analytics)
// ============================================================================

interface StatCardProps {
    icon: React.ReactNode;
    value: number | string | null;
    label: string;
    className?: string;
}

export function StatCard({ icon, value, label, className }: StatCardProps) {
    return (
        <div className={cn(
            'flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-xl',
            className
        )}>
            <div className="text-zinc-500">{icon}</div>
            <div className="text-2xl font-bold text-white">
                {value ?? '—'}
            </div>
            <div className="text-sm text-zinc-500">{label}</div>
        </div>
    );
}

// ============================================================================
// PROGRESS BAR (Onboarding)
// ============================================================================

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className={cn('w-full', className)}>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-sm text-zinc-500">
                    Steg {currentStep} av {totalSteps}
                </span>
            </div>
        </div>
    );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center text-center py-16 px-4',
            className
        )}>
            <div className="text-zinc-600 mb-4" style={{ fontSize: 64 }}>
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-zinc-500 max-w-md mb-6">{description}</p>
            {action && (
                <Button variant="primary" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}

// ============================================================================
// TOAST
// ============================================================================

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

const toastStyles = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-zinc-700',
} as const;

export function Toast({ type, message, onClose }: ToastProps) {
    return (
        <div className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
            'text-white text-sm',
            toastStyles[type]
        )}>
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Stäng"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                </svg>
            </button>
        </div>
    );
}

// ============================================================================
// MODAL
// ============================================================================

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md';
}

export function Modal({ isOpen, onClose, title, description, children, size = 'sm' }: ModalProps) {
    // Handle escape key
    React.useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className={cn(
                        'relative w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8',
                        size === 'sm' ? 'max-w-md' : 'max-w-xl'
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                        aria-label="Stäng"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>

                    {/* Header */}
                    <h2 id="modal-title" className="text-xl font-bold text-white mb-2">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-zinc-400 mb-6">{description}</p>
                    )}

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SECTION HEADER (for forms)
// ============================================================================

interface SectionHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
    return (
        <div className={cn('mb-6', className)}>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && (
                <p className="text-sm text-zinc-500 mt-1">{description}</p>
            )}
        </div>
    );
}

// ============================================================================
// DIVIDER
// ============================================================================

interface DividerProps {
    className?: string;
}

export function Divider({ className }: DividerProps) {
    return <hr className={cn('border-zinc-800', className)} />;
}
