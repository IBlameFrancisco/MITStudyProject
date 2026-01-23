'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse, getUnit, isValidCourseId } from '@/lib/data/courses/index';
import { VisualizationWrapper } from '@/components/visualizations/VisualizationWrapper';
import TopicSections from '@/components/ui/TopicSections';
import PracticeProblems from '@/components/ui/PracticeProblems';

/**
 * Generic unit page that handles all units across all courses dynamically.
 * Replaces the individual unit pages for each course.
 */
export default function UnitPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const unitId = params.unit as string;

  // Validate course ID
  if (!isValidCourseId(courseId)) {
    notFound();
  }

  const course = getCourse(courseId);
  const unit = getUnit(courseId, unitId);

  if (!course || !unit) {
    notFound();
  }

  // Get course-specific accent color class for hover effects
  const getHoverColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-600': 'hover:text-blue-600',
      'bg-green-600': 'hover:text-green-600',
      'bg-purple-600': 'hover:text-purple-600',
      'bg-orange-600': 'hover:text-orange-600',
    };
    return colorMap[color] || 'hover:text-blue-600';
  };

  const hoverColor = getHoverColorClass(course.color);

  // Check if content is available
  const hasContent =
    (unit.sections && unit.sections.length > 0) ||
    (unit.visualizations && unit.visualizations.length > 0) ||
    (unit.practiceProblems && unit.practiceProblems.length > 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className={`${hoverColor} transition-colors`}>
            Home
          </Link>
          <span>/</span>
          <Link href={`/${course.id}`} className={`${hoverColor} transition-colors`}>
            {course.number}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{unit.title}</span>
        </div>

        {/* Title */}
        <div className="flex items-center space-x-4 mb-4">
          <span className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${course.color}`}>
            {course.number}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {unit.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          {unit.description}
        </p>
      </motion.div>

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
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Visualizations</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Explore concepts visually</p>
            </div>
          </div>

          <div className="space-y-8">
            {unit.visualizations.map((vizName, index) => (
              <motion.div
                key={vizName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
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

      {/* Empty state for units without full content yet */}
      {!hasContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 border border-amber-200 dark:border-amber-800 text-center"
        >
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Content Coming Soon
          </h3>
          <p className="text-amber-700 dark:text-amber-300 max-w-md mx-auto">
            This unit's detailed explanations, visualizations, and practice problems are being developed.
            Check back soon for MIT-level content!
          </p>
        </motion.div>
      )}
    </div>
  );
}
