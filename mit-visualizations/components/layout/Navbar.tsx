'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/context/ThemeContext';
import { courses } from '@/lib/data/courses';

interface SearchResult {
  type: 'course' | 'unit';
  title: string;
  subtitle: string;
  href: string;
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    courses.forEach(course => {
      if (course.title.toLowerCase().includes(query) ||
          course.number.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)) {
        results.push({
          type: 'course',
          title: course.number,
          subtitle: course.title,
          href: `/${course.id}`,
        });
      }

      course.units.forEach(unit => {
        if (unit.title.toLowerCase().includes(query)) {
          results.push({
            type: 'unit',
            title: unit.title,
            subtitle: course.number,
            href: `/${course.id}/${unit.id}`,
          });
        }
      });
    });

    setSearchResults(results.slice(0, 6));
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-edge-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-math text-sm font-bold">
                &#x222B;&#x01B5;
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-content-primary tracking-tight">
                MIT Visualizations
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'text-accent-primary bg-brand-500/10'
                  : 'text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary'
              }`}
            >
              Home
            </Link>
            {courses.map((course) => {
              const isActive = pathname.startsWith(`/${course.id}`);
              return (
                <Link
                  key={course.id}
                  href={`/${course.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent-primary bg-brand-500/10'
                      : 'text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary'
                  }`}
                >
                  {course.number}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative hidden sm:block">
              <motion.div
                animate={{ width: isSearchFocused ? 300 : 200 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full px-4 py-2 pl-9 rounded-xl border border-edge-primary bg-surface-tertiary/50 text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-edge-accent transition-all duration-200 text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-content-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (searchResults.length > 0 || searchQuery.trim()) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 glass-strong border border-edge-primary rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {searchResults.length > 0 ? (
                      <div className="py-1">
                        {searchResults.map((result, index) => (
                          <Link
                            key={`${result.href}-${index}`}
                            href={result.href}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-tertiary transition-colors"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              result.type === 'course'
                                ? 'bg-brand-500/10 text-brand-500'
                                : 'bg-cyan-500/10 text-cyan-500'
                            }`}>
                              {result.type === 'course' ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-content-primary truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-content-muted truncate">
                                {result.subtitle}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-content-muted">No results for &ldquo;{searchQuery}&rdquo;</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-tertiary transition-all duration-200 group"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-[18px] h-[18px] text-content-tertiary group-hover:text-content-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px] text-content-tertiary group-hover:text-content-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/IBlameFrancisco"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-tertiary transition-all duration-200 group"
              aria-label="View on GitHub"
            >
              <svg className="w-[18px] h-[18px] text-content-tertiary group-hover:text-content-primary" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 flex md:hidden items-center justify-center rounded-xl hover:bg-surface-tertiary transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-[18px] h-[18px] text-content-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-edge-primary overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'text-accent-primary bg-brand-500/10'
                    : 'text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary'
                }`}
              >
                Home
              </Link>
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/${course.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith(`/${course.id}`)
                      ? 'text-accent-primary bg-brand-500/10'
                      : 'text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary'
                  }`}
                >
                  {course.number} &mdash; {course.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
