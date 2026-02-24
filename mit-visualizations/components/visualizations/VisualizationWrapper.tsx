'use client';

import React, { Suspense, ComponentType, lazy, useMemo } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { visualizationRegistry, isValidVisualization, type VisualizationName } from '@/lib/data/visualizations/registry';

interface VisualizationWrapperProps {
  name: string;
  className?: string;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64 bg-surface-tertiary/30 rounded-2xl border border-edge-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
        <p className="text-sm text-content-muted">Loading visualization...</p>
      </div>
    </div>
  );
}

function NotFoundFallback({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-surface-tertiary/30 rounded-2xl border border-edge-primary">
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">Visualization not found</p>
          <p className="text-xs text-content-muted mt-1">&ldquo;{name}&rdquo; is not registered</p>
        </div>
      </div>
    </div>
  );
}

function ErrorFallback({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-surface-tertiary/30 rounded-2xl border border-red-500/20">
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">Failed to load</p>
          <p className="text-xs text-content-muted mt-1">&ldquo;{name}&rdquo; encountered an error</p>
        </div>
      </div>
    </div>
  );
}

const componentCache = new Map<VisualizationName, ComponentType>();

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

export function VisualizationWrapper({ name, className = '' }: VisualizationWrapperProps) {
  if (!isValidVisualization(name)) {
    return <NotFoundFallback name={name} />;
  }

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
