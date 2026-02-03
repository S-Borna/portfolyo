'use client';

import { PageError } from '@/components/feedback';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <PageError
                title="Något gick fel"
                message="Vi kunde inte ladda onboarding-sidan. Försök igen."
                onRetry={reset}
            />
        </div>
    );
}
