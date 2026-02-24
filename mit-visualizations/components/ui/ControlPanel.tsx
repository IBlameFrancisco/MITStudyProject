'use client';

import { ReactNode } from 'react';

interface ControlPanelProps {
  title?: string;
  children: ReactNode;
}

export default function ControlPanel({ title, children }: ControlPanelProps) {
  return (
    <div className="bg-surface-tertiary/50 rounded-2xl p-5 border border-edge-primary">
      {title && (
        <h3 className="text-sm font-semibold text-content-primary mb-4 tracking-tight">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
