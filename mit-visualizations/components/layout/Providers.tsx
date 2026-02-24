'use client';

import { ThemeProvider } from '@/lib/context/ThemeContext';
import Navbar from './Navbar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh" />
      {/* Noise texture overlay for depth */}
      <div className="noise-overlay" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
