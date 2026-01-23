'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse, getUnit } from '@/lib/data/courses';
import DistributionPlot from '@/components/visualizations/probability/DistributionPlot';
import MonteCarloSim from '@/components/visualizations/probability/MonteCarloSim';
import ProbabilityTree from '@/components/visualizations/probability/ProbabilityTree';
import TopicSections from '@/components/ui/TopicSections';
import PracticeProblems from '@/components/ui/PracticeProblems';

const visualizationMap: Record<string, React.ComponentType> = {
  DistributionPlot,
  MonteCarloSim,
  ProbabilityTree,
};

export default function ProbabilityUnitPage() {
  const params = useParams();
  const unitId = params.unit as string;

  const course = getCourse('18-600');
  const unit = getUnit('18-600', unitId);

  if (!course || !unit) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Unit not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${course.id}`} className="hover:text-blue-600 transition-colors">{course.number}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{unit.title}</span>
        </div>

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
        <TopicSections sections={unit.sections} />
      )}

      {/* Visualizations */}
      {unit.visualizations.length > 0 && (
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
            {unit.visualizations.map((vizName, index) => {
              const VisualizationComponent = visualizationMap[vizName];
              if (!VisualizationComponent) return null;

              return (
                <motion.div
                  key={vizName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
                >
                  <VisualizationComponent />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Practice Problems */}
      {unit.practiceProblems && unit.practiceProblems.length > 0 && (
        <PracticeProblems problems={unit.practiceProblems} />
      )}
    </div>
  );
}
