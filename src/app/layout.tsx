import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'PORTFOLYO.SE — Professionell portfolio & CV, hostat åt dig',
  description: 'En premiumplattform som skapar, hostar och håller din portfolio & CV uppdaterade. Enkelt, tryggt och redo att dela på portfolyo.se/{username}.',
  keywords: ['portfolio', 'CV', 'karriär', 'professionell', 'hostad', 'Sverige'],
  authors: [{ name: 'PORTFOLYO.SE' }],
  openGraph: {
    title: 'PORTFOLYO.SE — Professionell portfolio & CV, hostat åt dig',
    description: 'Premium portfolio & CV med hosting, uppdateringar och support inkluderat.',
    url: 'https://portfolyo.se',
    siteName: 'PORTFOLYO.SE',
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PORTFOLYO.SE',
    description: 'Premium portfolio & CV med hosting, uppdateringar och support inkluderat.',
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
      <body className="min-h-screen bg-white text-slate-900">
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
