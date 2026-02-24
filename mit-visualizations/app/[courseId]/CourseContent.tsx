'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse, isValidCourseId } from '@/lib/data/courses/index';

const courseGradients: Record<string, string> = {
  '18-600': 'from-amber-500 via-orange-500 to-red-500',
  '6-1210': 'from-emerald-400 via-teal-500 to-cyan-500',
  '18-03': 'from-indigo-500 via-violet-500 to-purple-500',
  '6-100b': 'from-pink-500 via-rose-500 to-violet-500',
};

const courseAccents: Record<string, string> = {
  '18-600': 'text-amber-500',
  '6-1210': 'text-emerald-500',
  '18-03': 'text-indigo-500',
  '6-100b': 'text-pink-500',
};

const courseGlows: Record<string, string> = {
  '18-600': 'hover:shadow-[0_20px_60px_-12px_rgba(245,158,11,0.2)]',
  '6-1210': 'hover:shadow-[0_20px_60px_-12px_rgba(16,185,129,0.2)]',
  '18-03': 'hover:shadow-[0_20px_60px_-12px_rgba(99,102,241,0.2)]',
  '6-100b': 'hover:shadow-[0_20px_60px_-12px_rgba(236,72,153,0.2)]',
};

export default function CourseContent() {
  const params = useParams();
  const courseId = params.courseId as string;

  if (!isValidCourseId(courseId)) {
    notFound();
  }

  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  const gradient = courseGradients[courseId] || 'from-gray-500 to-gray-600';
  const accent = courseAccents[courseId] || 'text-gray-500';
  const glow = courseGlows[courseId] || '';

  return (
    <div className="min-h-screen">
      {/* Course Header */}
      <section className="relative overflow-hidden border-b border-edge-primary">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-[120px]`} />
          <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-[80px]`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-content-muted mb-8"
          >
            <Link href="/" className="hover:text-content-primary transition-colors">
              Home
            </Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-content-primary font-medium">{course.number}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-mono text-sm font-bold">{course.number.split('.')[0]}</span>
              </div>
              <div>
                <div className={`text-xs font-bold ${accent} uppercase tracking-widest mb-1`}>
                  {course.number}
                </div>
                <h1 className="text-fluid-3xl font-bold text-content-primary tracking-tight">
                  {course.title}
                </h1>
              </div>
            </div>

            <p className="text-lg text-content-tertiary leading-relaxed max-w-2xl mb-2">
              {course.description}
            </p>
            <p className="text-sm text-content-muted">
              {course.units.length} units covering the full semester curriculum
            </p>
          </motion.div>
        </div>
      </section>

      {/* Units Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-xl font-bold text-content-primary">Course Units</h2>
          <span className="text-sm text-content-muted">{course.units.length} units</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {course.units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.15 + index * 0.05,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <Link href={`/${course.id}/${unit.id}`}>
                <div className={`group relative bg-surface-secondary rounded-2xl border border-edge-primary overflow-hidden cursor-pointer card-hover ${glow}`}>
                  <div className={`h-0.5 bg-gradient-to-r ${gradient}`} />

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-xs text-content-muted px-2 py-1 rounded-full border border-edge-primary bg-surface-tertiary/50">
                        {unit.visualizations.length} viz
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-content-primary mb-2 tracking-tight group-hover:text-accent-primary transition-colors duration-300">
                      {unit.title}
                    </h3>

                    <p className="text-sm text-content-tertiary leading-relaxed line-clamp-2 mb-4">
                      {unit.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-sm font-medium text-content-muted group-hover:text-accent-primary transition-all duration-300">
                      <span>Explore topic</span>
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
