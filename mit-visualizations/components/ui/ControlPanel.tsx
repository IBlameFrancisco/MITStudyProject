'use client';

import { ReactNode } from 'react';

interface ControlPanelProps {
  title?: string;
  children: ReactNode;
}

export default function ControlPanel({ title, children }: ControlPanelProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
