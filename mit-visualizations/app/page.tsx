'use client';

import { motion } from 'framer-motion';
import { courses } from '@/lib/data/courses';
import ClassCard from '@/components/layout/ClassCard';

export default function Home() {
  const totalVisualizations = courses.reduce(
    (sum, course) => sum + course.units.reduce((uSum, unit) => uSum + unit.visualizations.length, 0),
    0
  );
  const totalUnits = courses.reduce((sum, course) => sum + course.units.length, 0);

  return (
    <div className="min-h-screen">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Hero gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full hero-badge mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-sm font-medium text-accent-primary">
                Interactive Learning Platform
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-fluid-4xl sm:text-fluid-5xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Master MIT Courses{' '}
              <br className="hidden sm:block" />
              with{' '}
              <span className="heading-gradient">Visual Intuition</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-fluid-lg text-content-tertiary leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              Interactive visualizations designed to help you understand complex
              mathematical and computational concepts taught at MIT.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-8 sm:gap-12 mb-12"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-content-primary">{courses.length}</div>
                <div className="text-xs sm:text-sm text-content-muted mt-1">Courses</div>
              </div>
              <div className="w-px h-10 bg-edge-secondary" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-content-primary">{totalUnits}</div>
                <div className="text-xs sm:text-sm text-content-muted mt-1">Units</div>
              </div>
              <div className="w-px h-10 bg-edge-secondary" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-content-primary">{totalVisualizations}+</div>
                <div className="text-xs sm:text-sm text-content-muted mt-1">Visualizations</div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#courses"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-medium text-sm shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Start Learning
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="https://github.com/IBlameFrancisco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-edge-secondary text-content-secondary font-medium text-sm hover:bg-surface-tertiary transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View Source
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gradient max-w-xl mx-auto" />

      {/* ============================================
          COURSES SECTION
          ============================================ */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-14"
        >
          <h2 className="text-fluid-3xl font-bold text-content-primary tracking-tight mb-4">
            Available Courses
          </h2>
          <p className="text-content-tertiary max-w-lg mx-auto">
            Dive into MIT-level courses with interactive visualizations
            that make complex concepts intuitive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <ClassCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gradient max-w-xl mx-auto" />

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-14"
        >
          <h2 className="text-fluid-3xl font-bold text-content-primary tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-content-tertiary max-w-lg mx-auto">
            Three simple steps to start building deep mathematical intuition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Select a Course',
              description: 'Choose from probability, algorithms, differential equations, or computational thinking.',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
            },
            {
              step: '02',
              title: 'Pick a Topic',
              description: 'Browse through units and find the concept you want to explore and visualize.',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
            },
            {
              step: '03',
              title: 'Interact & Learn',
              description: 'Adjust parameters, solve problems, and build deep mathematical intuition.',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group relative bg-surface-secondary rounded-2xl border border-edge-primary p-8 card-hover"
            >
              {/* Step number */}
              <div className="text-7xl font-black text-edge-primary absolute top-6 right-6 select-none leading-none">
                {item.step}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-accent-primary flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-content-primary mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-content-tertiary leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="border-t border-edge-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-math text-xs font-bold">&#x222B;&#x01B5;</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-content-primary">
                  <span className="font-math text-accent-primary">&#x222B;&#x211D;&#x2200;&#x2115;&#x2102;</span>i<span className="text-accent-primary">s</span><span className="font-math text-accent-primary">&#x2102;&#x2205;</span>{' '}
                  <span className="font-math text-accent-primary">&#x01B5;&#x2200;&#x03C1;&#x2200;</span>t<span className="font-math text-accent-primary">&#x2200;</span>
                </p>
                <p className="text-xs text-content-muted">Course 6-3 & 18 at MIT</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/IBlameFrancisco"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-content-muted hover:text-content-primary transition-colors"
              >
                GitHub
              </a>
              <span className="text-content-muted text-xs">
                Built with Next.js & React
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
