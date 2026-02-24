import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'MIT Visualizations | Francisco Zapata',
  description: 'Interactive visualizations for mastering MIT mathematics and computer science courses. Built by Francisco Zapata.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-surface-primary text-content-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
