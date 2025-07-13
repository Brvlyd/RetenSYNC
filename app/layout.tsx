import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/theme-context';
import LayoutWrapper from '@/components/layout-wrapper';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RetenSYNC - Modern Employee Experience Platform',
  description: 'ML-powered platform for predicting and preventing employee turnover with modern design',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        url: '/assets/Logo.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/assets/Logo.png',
        sizes: '32x32',
        type: 'image/png',
      }
    ],
    shortcut: '/favicon.ico',
    apple: '/assets/Logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full overflow-hidden`}>
        <ErrorBoundary>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}