/**
 * PORTFOLYO INTERACTION HOOKS
 * Reusable logic for complex interactions
 *
 * These hooks enforce the UX contract:
 * - No auto-save
 * - Explicit state management
 * - Predictable navigation
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ============================================================================
// TOAST SYSTEM
// ============================================================================

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
}

const toastDurations = {
    success: 3000,
    error: 5000,
    info: 4000,
} as const;

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const show = useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).slice(2, 9);
        const toast: ToastItem = { id, type, message };

        setToasts(prev => [...prev, toast]);

        // Auto-dismiss
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, toastDurations[type]);

        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message: string) => show('success', message), [show]);
    const error = useCallback((message: string) => show('error', message), [show]);
    const info = useCallback((message: string) => show('info', message), [show]);

    return { toasts, show, dismiss, success, error, info };
}

// ============================================================================
// UNSAVED CHANGES
// ============================================================================

export function useUnsavedChanges(hasChanges: boolean) {
    useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);
}

// ============================================================================
// FORM STATE (with change detection)
// ============================================================================

export function useFormState<T extends Record<string, unknown>>(initialState: T) {
    const [state, setState] = useState<T>(initialState);
    const [hasChanges, setHasChanges] = useState(false);
    const initialRef = useRef(JSON.stringify(initialState));

    const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
        setState(prev => {
            const next = { ...prev, [field]: value };
            setHasChanges(JSON.stringify(next) !== initialRef.current);
            return next;
        });
    }, []);

    const reset = useCallback(() => {
        setState(JSON.parse(initialRef.current));
        setHasChanges(false);
    }, []);

    const markSaved = useCallback(() => {
        initialRef.current = JSON.stringify(state);
        setHasChanges(false);
    }, [state]);

    return { state, updateField, hasChanges, reset, markSaved };
}

// ============================================================================
// DEBOUNCED VALUE
// ============================================================================

export function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// ============================================================================
// USERNAME VALIDATION
// ============================================================================

interface UsernameValidationResult {
    isValid: boolean;
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
}

const USERNAME_REGEX = /^[a-z0-9-]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

export function useUsernameValidation(
    username: string,
    checkAvailability: (username: string) => Promise<boolean>
): UsernameValidationResult {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const debouncedUsername = useDebouncedValue(username.toLowerCase().trim(), 300);

    useEffect(() => {
        // Reset state
        setIsAvailable(null);
        setError(null);

        if (!debouncedUsername) {
            return;
        }

        // Client-side validation
        if (debouncedUsername.length < MIN_LENGTH) {
            setError(`Minst ${MIN_LENGTH} tecken`);
            return;
        }

        if (debouncedUsername.length > MAX_LENGTH) {
            setError(`Max ${MAX_LENGTH} tecken`);
            return;
        }

        if (!USERNAME_REGEX.test(debouncedUsername)) {
            setError('Endast små bokstäver, siffror och bindestreck');
            return;
        }

        // Server-side availability check
        setIsChecking(true);
        checkAvailability(debouncedUsername)
            .then(available => {
                setIsAvailable(available);
                if (!available) {
                    setError('Detta användarnamn är upptaget');
                }
            })
            .catch(() => {
                setError('Kunde inte kontrollera tillgänglighet');
            })
            .finally(() => {
                setIsChecking(false);
            });
    }, [debouncedUsername, checkAvailability]);

    const isValid = !error && isAvailable === true;

    return { isValid, isChecking, isAvailable, error };
}

// ============================================================================
// STEP NAVIGATION (Onboarding)
// ============================================================================

interface StepConfig {
    validate?: () => boolean;
}

export function useStepNavigation(totalSteps: number, configs: StepConfig[] = []) {
    const [currentStep, setCurrentStep] = useState(1);

    const canGoNext = useCallback(() => {
        const config = configs[currentStep - 1];
        if (config?.validate) {
            return config.validate();
        }
        return true;
    }, [currentStep, configs]);

    const goNext = useCallback(() => {
        if (currentStep < totalSteps && canGoNext()) {
            setCurrentStep(prev => prev + 1);
            return true;
        }
        return false;
    }, [currentStep, totalSteps, canGoNext]);

    const goBack = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            return true;
        }
        return false;
    }, [currentStep]);

    const goTo = useCallback((step: number) => {
        if (step >= 1 && step <= currentStep) {
            setCurrentStep(step);
            return true;
        }
        return false;
    }, [currentStep]);

    return {
        currentStep,
        totalSteps,
        isFirst: currentStep === 1,
        isLast: currentStep === totalSteps,
        canGoNext,
        goNext,
        goBack,
        goTo,
    };
}

// ============================================================================
// MODAL STATE
// ============================================================================

export function useModal(initialOpen = false) {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    return { isOpen, open, close, toggle };
}

// ============================================================================
// LOADING STATE
// ============================================================================

export function useLoading(initialLoading = false) {
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <T>(
        promise: Promise<T>,
        options?: { errorMessage?: string }
    ): Promise<T | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await promise;
            return result;
        } catch (e) {
            const message = options?.errorMessage ||
                (e instanceof Error ? e.message : 'Något gick fel');
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { isLoading, error, execute, clearError };
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================

interface ConfirmOptions {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
}

export function useConfirm() {
    const [config, setConfig] = useState<ConfirmOptions | null>(null);
    const resolveRef = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        setConfig(options);
        return new Promise<boolean>(resolve => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        resolveRef.current?.(true);
        setConfig(null);
    }, []);

    const handleCancel = useCallback(() => {
        resolveRef.current?.(false);
        setConfig(null);
    }, []);

    return {
        isOpen: !!config,
        config,
        confirm,
        handleConfirm,
        handleCancel
    };
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

type KeyHandler = (e: KeyboardEvent) => void;

export function useKeyboardShortcut(
    key: string,
    handler: KeyHandler,
    options?: { ctrl?: boolean; shift?: boolean; enabled?: boolean }
) {
    const { ctrl = false, shift = false, enabled = true } = options || {};

    useEffect(() => {
        if (!enabled) return;

        function handleKeyDown(e: KeyboardEvent) {
            const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : true;
            const shiftMatch = shift ? e.shiftKey : true;

            if (e.key.toLowerCase() === key.toLowerCase() && ctrlMatch && shiftMatch) {
                handler(e);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, handler, ctrl, shift, enabled]);
}

// ============================================================================
// MEDIA QUERY
// ============================================================================

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);

        function listener(e: MediaQueryListEvent) {
            setMatches(e.matches);
        }

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}

export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 640px)');
}

export function useIsTablet(): boolean {
    return useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
}

export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1025px)');
}

// ============================================================================
// REDUCED MOTION
// ============================================================================

export function usePrefersReducedMotion(): boolean {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}
