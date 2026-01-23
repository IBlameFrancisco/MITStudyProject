'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCourse, getUnit } from '@/lib/data/courses';
import SlopeField from '@/components/visualizations/diffeq/SlopeField';
import PhasePortrait from '@/components/visualizations/diffeq/PhasePortrait';
import FunctionPlot from '@/components/visualizations/diffeq/FunctionPlot';

const visualizationMap: Record<string, React.ComponentType> = {
  SlopeField,
  PhasePortrait,
  FunctionPlot,
};

export default function DiffEqUnitPage() {
  const params = useParams();
  const unitId = params.unit as string;

  const course = getCourse('18-03');
  const unit = getUnit('18-03', unitId);

  if (!course || !unit) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Unit not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href={`/${course.id}`} className="hover:text-blue-600">{course.number}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{unit.title}</span>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${course.color}`}>
            {course.number}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {unit.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {unit.description}
        </p>
      </motion.div>

      <div className="space-y-8">
        {unit.visualizations.map((vizName, index) => {
          const VisualizationComponent = visualizationMap[vizName];
          if (!VisualizationComponent) return null;

          return (
            <motion.div
              key={vizName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
            >
              <VisualizationComponent />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
