'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse, getUnit, isValidCourseId } from '@/lib/data/courses/index';
import { VisualizationWrapper } from '@/components/visualizations/VisualizationWrapper';
import TopicSections from '@/components/ui/TopicSections';
import PracticeProblems from '@/components/ui/PracticeProblems';

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

export default function UnitContent() {
  const params = useParams();
  const courseId = params.courseId as string;
  const unitId = params.unit as string;

  if (!isValidCourseId(courseId)) {
    notFound();
  }

  const course = getCourse(courseId);
  const unit = getUnit(courseId, unitId);

  if (!course || !unit) {
    notFound();
  }

  const gradient = courseGradients[courseId] || 'from-gray-500 to-gray-600';
  const accent = courseAccents[courseId] || 'text-gray-500';

  const hasContent =
    (unit.sections && unit.sections.length > 0) ||
    (unit.visualizations && unit.visualizations.length > 0) ||
    (unit.practiceProblems && unit.practiceProblems.length > 0);

  return (
    <div className="min-h-screen">
      {/* Unit Header */}
      <section className="relative overflow-hidden border-b border-edge-primary">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${gradient} opacity-[0.08] rounded-full blur-[120px]`} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-content-muted mb-6 flex-wrap"
          >
            <Link href="/" className="hover:text-content-primary transition-colors">
              Home
            </Link>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/${course.id}`} className="hover:text-content-primary transition-colors">
              {course.number}
            </Link>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-content-primary font-medium">{unit.title}</span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold ${accent} uppercase tracking-widest`}>
                {course.number}
              </span>
            </div>
            <h1 className="text-fluid-2xl sm:text-fluid-3xl font-bold text-content-primary tracking-tight mb-3">
              {unit.title}
            </h1>
            <p className="text-lg text-content-tertiary leading-relaxed max-w-2xl">
              {unit.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Topic Sections */}
        {unit.sections && unit.sections.length > 0 && (
          <TopicSections sections={unit.sections} courseNumber={course.number} />
        )}

        {/* Visualizations */}
        {unit.visualizations && unit.visualizations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-content-primary">Interactive Visualizations</h2>
                <p className="text-sm text-content-muted">Explore concepts visually</p>
              </div>
            </div>

            <div className="space-y-8">
              {unit.visualizations.map((vizName, index) => (
                <motion.div
                  key={vizName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="bg-surface-secondary rounded-2xl border border-edge-primary p-6 shadow-soft"
                >
                  <VisualizationWrapper name={vizName} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Practice Problems */}
        {unit.practiceProblems && unit.practiceProblems.length > 0 && (
          <PracticeProblems problems={unit.practiceProblems} courseNumber={course.number} />
        )}

        {/* Empty state */}
        {!hasContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface-secondary rounded-2xl border border-edge-primary p-12 text-center"
          >
            <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-content-primary mb-2">
              Content Coming Soon
            </h3>
            <p className="text-content-tertiary max-w-md mx-auto">
              This unit&apos;s detailed explanations, visualizations, and practice problems are being developed.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
