'use client';

import React, { Suspense, ComponentType, lazy, useMemo } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { visualizationRegistry, isValidVisualization, type VisualizationName } from '@/lib/data/visualizations/registry';

interface VisualizationWrapperProps {
  name: string;
  className?: string;
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading visualization...</p>
      </div>
    </div>
  );
}

/**
 * Not found fallback component
 */
function NotFoundFallback({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
      <div className="flex flex-col items-center space-y-2 text-center px-4">
        <svg
          className="h-8 w-8 text-amber-600 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Visualization not found
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-300">
          "{name}" is not a registered visualization
        </p>
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
function ErrorFallback({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="flex flex-col items-center space-y-2 text-center px-4">
        <svg
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          Failed to load visualization
        </p>
        <p className="text-xs text-red-600 dark:text-red-300">
          "{name}" encountered an error
        </p>
      </div>
    </div>
  );
}

/**
 * Cache for lazy-loaded components
 */
const componentCache = new Map<VisualizationName, ComponentType>();

/**
 * Get or create a lazy component for a visualization
 */
function getLazyComponent(name: VisualizationName): ComponentType {
  if (!componentCache.has(name)) {
    const LazyComponent = lazy(async () => {
      const importFn = visualizationRegistry[name];
      const module = await importFn();
      return { default: module.default };
    });
    componentCache.set(name, LazyComponent);
  }
  return componentCache.get(name)!;
}

/**
 * Wrapper component for visualizations.
 * Handles lazy loading, error boundaries, and fallbacks.
 */
export function VisualizationWrapper({ name, className = '' }: VisualizationWrapperProps) {
  // Check if visualization exists
  if (!isValidVisualization(name)) {
    return <NotFoundFallback name={name} />;
  }

  // Get the lazy component
  const LazyVisualization = useMemo(() => getLazyComponent(name), [name]);

  return (
    <ErrorBoundary fallback={<ErrorFallback name={name} />}>
      <Suspense fallback={<LoadingFallback />}>
        <div className={className}>
          <LazyVisualization />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default VisualizationWrapper;
