import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
    title: 'Templates — 70+ professionella mallar',
    description: 'Utforska vår samling av 70+ professionella portfolio- och CV-mallar. Designade för svenska yrkesverksamma.',
    path: '/templates',
    keywords: ['templates', 'mallar', 'portfolio design', 'CV design'],
});

export default function TemplatesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
