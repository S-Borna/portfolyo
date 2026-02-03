import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
    title: 'Dashboard',
    description: 'Hantera dina portfolios och CVs från din personliga dashboard.',
    path: '/dashboard',
    noIndex: true,
});

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
