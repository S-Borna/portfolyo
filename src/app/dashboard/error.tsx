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
        <PageError
            title="Kunde inte ladda dashboard"
            message="Ett fel uppstod när vi försökte ladda din dashboard. Försök igen."
            onRetry={reset}
        />
    );
}
