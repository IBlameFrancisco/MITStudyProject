'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse, isValidCourseId } from '@/lib/data/courses/index';

/**
 * Generic course page that handles all courses dynamically.
 * Replaces the individual course pages (18-600, 6-1210, 18-03, 6-100b).
 */
export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  // Validate course ID
  if (!isValidCourseId(courseId)) {
    notFound();
  }

  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  // Get course-specific styles based on the course color
  const getAccentColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-600': 'text-blue-600 dark:text-blue-400',
      'bg-green-600': 'text-green-600 dark:text-green-400',
      'bg-purple-600': 'text-purple-600 dark:text-purple-400',
      'bg-orange-600': 'text-orange-600 dark:text-orange-400',
    };
    return colorMap[color] || 'text-blue-600 dark:text-blue-400';
  };

  const getHoverColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-600': 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
      'bg-green-600': 'group-hover:text-green-600 dark:group-hover:text-green-400',
      'bg-purple-600': 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      'bg-orange-600': 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    };
    return colorMap[color] || 'group-hover:text-blue-600 dark:group-hover:text-blue-400';
  };

  const getBorderColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-600': 'border-blue-600',
      'bg-green-600': 'border-green-600',
      'bg-purple-600': 'border-purple-600',
      'bg-orange-600': 'border-orange-600',
    };
    return colorMap[color] || 'border-blue-600';
  };

  const accentColor = getAccentColorClass(course.color);
  const hoverColor = getHoverColorClass(course.color);
  const borderColor = getBorderColorClass(course.color);

  // Determine if this is the probability course (has special overview section)
  const isProbabilityCourse = courseId === '18-600';

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-4 py-2 rounded-lg text-white font-semibold ${course.color}`}>
            {course.number}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {course.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">
          {course.description}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {course.units.length} units covering the full semester curriculum
        </p>
      </motion.div>

      {/* Course Overview - Only for probability course */}
      {isProbabilityCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white`}
        >
          <h2 className="text-xl font-bold mb-3">Course Topics</h2>
          <p className="text-blue-100 text-sm mb-4">
            Click on any topic below to explore interactive visualizations and detailed explanations at the MIT level.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {course.units.map((unit, index) => (
              <div key={unit.id} className="bg-white/10 rounded-lg px-3 py-2 text-sm">
                <span className="text-blue-200 mr-1">{index + 1}.</span>
                <span className="text-white">{unit.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Units Grid */}
      <div className={`grid grid-cols-1 ${isProbabilityCourse ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {course.units.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <Link href={`/${course.id}/${unit.id}`}>
              <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer h-full ${isProbabilityCourse ? `border-l-4 ${borderColor}` : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center`}>
                      {isProbabilityCourse ? (
                        <span className="text-white font-bold">{index + 1}</span>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      )}
                    </div>
                    {isProbabilityCourse && (
                      <div>
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${hoverColor} transition-colors`}>
                          {unit.title}
                        </h3>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {unit.visualizations.length} viz
                  </span>
                </div>
                {!isProbabilityCourse && (
                  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white mb-2 ${hoverColor} transition-colors`}>
                    {unit.title}
                  </h3>
                )}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {unit.description}
                </p>
                {isProbabilityCourse && (
                  <div className={`flex items-center ${accentColor} text-sm font-medium group-hover:translate-x-1 transition-transform`}>
                    <span>Explore topic</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
