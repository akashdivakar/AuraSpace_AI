import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import PageTransition from '../components/PageTransition';

export const metadata: Metadata = {
  title: 'AuraSpace AI | Interior Design Studio',
  description: 'AI-powered interior design and virtual staging with role-based access',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300 min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
