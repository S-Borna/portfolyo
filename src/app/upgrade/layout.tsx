import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
    title: 'Uppgradera — Premium funktioner',
    description: 'Lås upp fler templates, AI-funktioner och analytics med PORTFOLYO Premium.',
    path: '/upgrade',
    keywords: ['premium', 'uppgradera', 'pro'],
});

export default function UpgradeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
