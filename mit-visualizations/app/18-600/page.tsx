'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse } from '@/lib/data/courses';

export default function ProbabilityPage() {
  const course = getCourse('18-600');

  if (!course) return null;

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

      {/* Course Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {course.units.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <Link href={`/${course.id}/${unit.id}`}>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer h-full border-l-4 border-blue-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center`}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {unit.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {unit.visualizations.length} viz
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {unit.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  <span>Explore topic</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
