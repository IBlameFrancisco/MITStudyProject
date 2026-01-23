'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/data/courses';

interface ClassCardProps {
  course: Course;
  index: number;
}

// Course-specific accent colors
const courseColors: Record<string, { gradient: string; badge: string; glow: string }> = {
  '18-600': {
    gradient: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    glow: 'group-hover:shadow-amber-500/20',
  },
  '18-03': {
    gradient: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    glow: 'group-hover:shadow-blue-500/20',
  },
  '6-1210': {
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  '6-100b': {
    gradient: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    glow: 'group-hover:shadow-purple-500/20',
  },
};

const defaultColors = {
  gradient: 'from-gray-500 to-gray-600',
  badge: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
  glow: 'group-hover:shadow-gray-500/20',
};

export default function ClassCard({ course, index }: ClassCardProps) {
  const colors = courseColors[course.id] || defaultColors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/${course.id}`}>
        <div className={`group bg-surface-secondary rounded-2xl border border-edge-primary overflow-hidden cursor-pointer transition-all duration-300 hover:border-edge-secondary hover:shadow-soft-lg ${colors.glow}`}>
          {/* Gradient Header */}
          <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />

          <div className="p-6">
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${colors.badge}`}>
                {course.number}
              </span>
              <span className="text-xs text-content-muted font-medium">
                {course.units.length} {course.units.length === 1 ? 'unit' : 'units'}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-content-primary mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-content-tertiary leading-relaxed line-clamp-2 mb-4">
              {course.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-edge-primary">
              <div className="flex items-center gap-1.5">
                {course.units.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colors.gradient}`}
                  />
                ))}
                {course.units.length > 3 && (
                  <span className="text-xs text-content-muted ml-1">
                    +{course.units.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all duration-200">
                <span>Explore</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
