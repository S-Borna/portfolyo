import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
    title: 'Skapa konto',
    description: 'Skapa ett gratis PORTFOLYO-konto och bygg din professionella portfolio på minuter.',
    path: '/register',
    keywords: ['registrera', 'skapa konto', 'gratis portfolio'],
});

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
