'use client';

import { courses } from '@/lib/data/courses';
import ClassCard from '@/components/layout/ClassCard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
            Interactive Learning Platform
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-content-primary mb-4 tracking-tight">
          Master MIT Courses with{' '}
          <span className="heading-gradient">Visual Intuition</span>
        </h1>

        <p className="text-lg text-content-secondary leading-relaxed mb-8">
          Interactive visualizations designed to help you understand complex mathematical
          and computational concepts taught at MIT.
        </p>

        {/* Author Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-surface-secondary border border-edge-primary shadow-soft"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span className="text-white font-math text-sm font-bold">∫Σ</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-content-primary">
              <span className="font-math text-brand-500">∫ℝ∀ℕℂiσℂ∅</span>{' '}
              <span className="font-math text-brand-500">Σ∀π∀τ∀</span>
            </p>
            <p className="text-xs text-content-muted">Course 6-3 & 18 at MIT</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Course Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-content-primary">Available Courses</h2>
          <span className="text-sm text-content-muted">{courses.length} courses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course, index) => (
            <ClassCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Getting Started Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-surface-secondary rounded-2xl border border-edge-primary p-8"
      >
        <h2 className="text-xl font-semibold text-content-primary mb-6">How to Get Started</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Select a Course',
              description: 'Choose from probability, algorithms, differential equations, or computational thinking.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              ),
            },
            {
              step: '02',
              title: 'Pick a Topic',
              description: 'Browse through units and find the concept you want to explore and visualize.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              ),
            },
            {
              step: '03',
              title: 'Interact & Learn',
              description: 'Adjust parameters, solve problems, and build deep mathematical intuition.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              ),
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <span className="text-xs font-bold text-brand-500">{item.step}</span>
              </div>
              <h3 className="font-semibold text-content-primary mb-1">{item.title}</h3>
              <p className="text-sm text-content-tertiary leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
