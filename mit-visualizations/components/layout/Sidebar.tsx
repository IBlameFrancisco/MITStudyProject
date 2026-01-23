'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { courses } from '@/lib/data/courses';

/**
 * Stylized Name Component
 * Renders "Francisco Zapata" with math symbols:
 * - F → ∫ (integral)
 * - r → ℝ (real numbers)
 * - a → ∀ (for all)
 * - n → ℕ (natural numbers)
 * - c → ℂ (complex numbers)
 * - i → i (imaginary unit)
 * - s → σ (sigma)
 * - o → ∅ (empty set)
 * - Z → Σ (summation)
 * - p → π (pi)
 * - t → τ (tau)
 */
function StylizedName() {
  return (
    <div className="flex flex-col">
      <div className="text-base font-semibold tracking-tight text-content-primary">
        <span className="font-math text-brand-500">∫</span>
        <span className="font-math text-brand-500">ℝ</span>
        <span className="font-math text-brand-500">∀</span>
        <span className="font-math text-brand-500">ℕ</span>
        <span className="font-math text-brand-500">ℂ</span>
        <span className="font-math text-brand-500">i</span>
        <span className="font-math text-brand-500">σ</span>
        <span className="font-math text-brand-500">ℂ</span>
        <span className="font-math text-brand-500">∅</span>
      </div>
      <div className="text-base font-semibold tracking-tight text-content-primary -mt-1">
        <span className="font-math text-brand-500">Σ</span>
        <span className="font-math text-brand-500">∀</span>
        <span className="font-math text-brand-500">π</span>
        <span className="font-math text-brand-500">∀</span>
        <span className="font-math text-brand-500">τ</span>
        <span className="font-math text-brand-500">∀</span>
      </div>
    </div>
  );
}

/**
 * Logo Icon - Mathematical symbol composition
 */
function LogoIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-soft">
      <span className="text-white font-math text-lg font-bold">∫Σ</span>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-secondary border-r border-edge-primary flex flex-col">
      {/* Brand Header */}
      <div className="p-5 border-b border-edge-primary">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <LogoIcon />
          </motion.div>
          <StylizedName />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            pathname === '/'
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 shadow-inner-soft'
              : 'text-content-secondary hover:bg-surface-tertiary hover:text-content-primary'
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Courses Section */}
        <div className="pt-6">
          <p className="px-4 text-xs font-semibold text-content-muted uppercase tracking-wider mb-3">
            Courses
          </p>
          <div className="space-y-1">
            {courses.map((course, index) => {
              const isActive = pathname.startsWith(`/${course.id}`);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/${course.id}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 shadow-inner-soft'
                        : 'text-content-secondary hover:bg-surface-tertiary hover:text-content-primary'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${
                      isActive ? 'bg-brand-500 scale-125' : 'bg-content-muted group-hover:bg-brand-400'
                    }`} />
                    <span className="text-sm font-medium">{course.number}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-edge-primary">
        <div className="flex items-center justify-center gap-2 text-xs text-content-muted">
          <span>MIT Course 6-3 & 18</span>
        </div>
      </div>
    </aside>
  );
}
