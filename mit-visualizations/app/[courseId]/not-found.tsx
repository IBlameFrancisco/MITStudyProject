'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-surface-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-content-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-content-primary mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-content-tertiary mb-8 max-w-md">
          The course or unit you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl hover:from-brand-500 hover:to-brand-600 transition-all font-medium text-sm shadow-glow"
          >
            Go to Home
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-surface-tertiary text-content-secondary rounded-xl hover:bg-surface-elevated border border-edge-primary transition-all font-medium text-sm"
          >
            Browse Courses
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
