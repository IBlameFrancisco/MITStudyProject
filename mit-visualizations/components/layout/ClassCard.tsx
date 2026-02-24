'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/data/courses';

interface ClassCardProps {
  course: Course;
  index: number;
}

const courseThemes: Record<string, {
  gradient: string;
  gradientSubtle: string;
  glow: string;
  icon: string;
  accent: string;
}> = {
  '18-600': {
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    gradientSubtle: 'from-amber-500/10 to-red-500/5',
    glow: 'course-glow-probability',
    icon: 'P(X)',
    accent: 'text-amber-500',
  },
  '6-1210': {
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    gradientSubtle: 'from-emerald-500/10 to-cyan-500/5',
    glow: 'course-glow-algorithms',
    icon: 'O(n)',
    accent: 'text-emerald-500',
  },
  '18-03': {
    gradient: 'from-indigo-500 via-violet-500 to-purple-500',
    gradientSubtle: 'from-indigo-500/10 to-purple-500/5',
    glow: 'course-glow-diffeq',
    icon: "y'",
    accent: 'text-indigo-500',
  },
  '6-100b': {
    gradient: 'from-pink-500 via-rose-500 to-violet-500',
    gradientSubtle: 'from-pink-500/10 to-violet-500/5',
    glow: 'course-glow-complexity',
    icon: 'NP',
    accent: 'text-pink-500',
  },
};

const defaultTheme = {
  gradient: 'from-gray-500 to-gray-600',
  gradientSubtle: 'from-gray-500/10 to-gray-500/5',
  glow: '',
  icon: '...',
  accent: 'text-gray-500',
};

export default function ClassCard({ course, index }: ClassCardProps) {
  const theme = courseThemes[course.id] || defaultTheme;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <Link href={`/${course.id}`}>
        <div className={`group relative bg-surface-secondary rounded-2xl border border-edge-primary overflow-hidden cursor-pointer card-hover card-shine ${theme.glow}`}>
          {/* Gradient accent bar */}
          <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />

          {/* Subtle gradient background on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientSubtle} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative p-6">
            {/* Header row */}
            <div className="flex items-start justify-between mb-5">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-mono text-xs font-bold tracking-tight">
                  {theme.icon}
                </span>
              </div>

              {/* Unit count */}
              <span className="text-xs font-medium text-content-muted px-2.5 py-1 rounded-full border border-edge-primary bg-surface-tertiary/50">
                {course.units.length} units
              </span>
            </div>

            {/* Course number */}
            <div className={`text-xs font-bold ${theme.accent} uppercase tracking-widest mb-2`}>
              {course.number}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-content-primary mb-3 tracking-tight group-hover:text-accent-primary transition-colors duration-300">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-content-tertiary leading-relaxed line-clamp-2 mb-6">
              {course.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-edge-primary">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {course.units.slice(0, 5).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${theme.gradient} opacity-60`}
                  />
                ))}
                {course.units.length > 5 && (
                  <span className="text-xs text-content-muted ml-1">
                    +{course.units.length - 5}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm font-medium text-content-muted group-hover:text-accent-primary transition-all duration-300">
                <span>Explore</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
