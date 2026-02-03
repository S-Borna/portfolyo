import { Spinner } from '@/components/feedback';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
                <Spinner size="lg" className="text-white mx-auto mb-4" />
                <p className="text-zinc-400">Laddar onboarding...</p>
            </div>
        </div>
    );
}
