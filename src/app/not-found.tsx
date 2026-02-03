import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="text-8xl font-bold text-zinc-800 mb-4">404</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Sidan hittades inte
                </h1>
                <p className="text-zinc-400 mb-8">
                    Sidan du letar efter finns inte eller har flyttats.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                >
                    Till startsidan
                </Link>
            </div>
        </div>
    );
}
