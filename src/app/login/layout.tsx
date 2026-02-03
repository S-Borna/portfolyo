import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
    title: 'Logga in',
    description: 'Logga in på ditt PORTFOLYO-konto för att hantera din professionella portfolio och CV.',
    path: '/login',
    noIndex: true,
});

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
