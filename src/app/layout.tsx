import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'PORTFOLYO.SE - Skapa din professionella portfolio & CV',
  description: 'AI-driven portfolio- och CV-builder för studenter och nyexaminerade. Skapa imponerande portfolios som saidborna.com på minuter.',
  keywords: ['portfolio', 'CV', 'student', 'karriär', 'jobb', 'AI', 'Sverige'],
  authors: [{ name: 'PORTFOLYO.SE' }],
  openGraph: {
    title: 'PORTFOLYO.SE - Skapa din professionella portfolio & CV',
    description: 'AI-driven portfolio- och CV-builder för studenter och nyexaminerade.',
    url: 'https://portfolyo.se',
    siteName: 'PORTFOLYO.SE',
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PORTFOLYO.SE',
    description: 'AI-driven portfolio- och CV-builder för studenter och nyexaminerade.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-gray-50">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#18181B',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
