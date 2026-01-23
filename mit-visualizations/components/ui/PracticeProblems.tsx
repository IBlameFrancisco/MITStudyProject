'use client';

/**
 * PracticeProblems Component
 * ===========================
 * Displays MIT-level practice problems with animated solution reveals.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LaTeX } from './LaTeX';
import type { PracticeProblem } from '@/lib/data/courses';

// =============================================================================
// TYPES
// =============================================================================

interface PracticeProblemsProps {
  problems: PracticeProblem[];
}

// =============================================================================
// CONTENT RENDERER (same logic as TopicSections)
// =============================================================================

function ContentRenderer({ content }: { content: string }) {
  const segments: { type: 'text' | 'blockmath'; content: string }[] = [];
  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
  let lastIndex = 0;
  let match;

  while ((match = blockMathRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'blockmath', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return (
    <>
      {segments.map((segment, idx) => {
        if (segment.type === 'blockmath') {
          return (
            <div key={idx} className="my-4 overflow-x-auto py-3 px-4 bg-surface-tertiary/50 rounded-xl border border-edge-primary">
              <LaTeX math={segment.content} block />
            </div>
          );
        }
        return <TextRenderer key={idx} text={segment.content} />;
      })}
    </>
  );
}

function TextRenderer({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return (
    <>
      {paragraphs.map((paragraph, pIdx) => (
        <ParagraphRenderer key={pIdx} paragraph={paragraph} />
      ))}
    </>
  );
}

function ParagraphRenderer({ paragraph }: { paragraph: string }) {
  const lines = paragraph.split('\n');
  return (
    <div className="mb-3 last:mb-0">
      {lines.map((line, lIdx) => (
        <LineRenderer key={lIdx} line={line} />
      ))}
    </div>
  );
}

function LineRenderer({ line }: { line: string }) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('- ')) {
    return (
      <div className="flex items-start ml-4 my-1.5">
        <span className="text-brand-500 mr-2 mt-1.5 text-xs">●</span>
        <span className="text-content-secondary text-sm leading-relaxed">
          <InlineRenderer text={trimmed.slice(2)} />
        </span>
      </div>
    );
  }

  const partMatch = trimmed.match(/^\*\*\(([a-z])\)\*\*\s*(.*)$/);
  if (partMatch) {
    return (
      <div className="mt-3 mb-1">
        <strong className="text-content-primary">({partMatch[1]})</strong>{' '}
        <span className="text-content-secondary text-sm">
          <InlineRenderer text={partMatch[2]} />
        </span>
      </div>
    );
  }

  return (
    <p className="text-content-secondary text-sm leading-relaxed">
      <InlineRenderer text={line} />
    </p>
  );
}

function InlineRenderer({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let key = 0;
  const regex = /(\*\*[^*]+\*\*)|(\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      const boldContent = match[1].slice(2, -2);
      parts.push(
        <strong key={key++} className="font-semibold text-content-primary">
          <InlineRenderer text={boldContent} />
        </strong>
      );
    } else if (match[2]) {
      const mathContent = match[2].slice(1, -1);
      parts.push(<LaTeX key={key++} math={mathContent} />);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

// =============================================================================
// PROBLEM CARD COMPONENT
// =============================================================================

function ProblemCard({ problem, index }: { problem: PracticeProblem; index: number }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-surface-secondary rounded-2xl border border-edge-primary overflow-hidden"
    >
      {/* Problem Header */}
      <div className="bg-gradient-to-r from-surface-tertiary to-surface-accent px-6 py-4 border-b border-edge-primary">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center mr-3 shadow-soft">
            <span className="text-white font-bold text-sm">{index + 1}</span>
          </div>
          <span className="font-semibold text-content-primary">
            Problem {index + 1}
          </span>
        </div>
      </div>

      {/* Problem Content */}
      <div className="p-6">
        <div className="mb-6">
          <ContentRenderer content={problem.problem} />
        </div>

        {/* Reveal Solution Button */}
        <button
          onClick={() => setShowSolution(!showSolution)}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            showSolution
              ? 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-soft hover:shadow-soft-lg'
          }`}
        >
          <motion.svg
            animate={{ rotate: showSolution ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
          {showSolution ? 'Hide Solution' : 'Reveal Solution'}
        </button>

        {/* Solution (Animated) */}
        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-edge-primary">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Solution</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-5 border border-emerald-200/50 dark:border-emerald-800/30"
                >
                  <ContentRenderer content={problem.solution} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PracticeProblems({ problems }: PracticeProblemsProps) {
  if (!problems || problems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-10"
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-soft">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-content-primary">Practice Problems</h2>
          <p className="text-sm text-content-muted">MIT 18.600 Level Exercises</p>
        </div>
      </div>

      {/* Problem Cards */}
      <div className="space-y-5">
        {problems.map((problem, index) => (
          <ProblemCard key={problem.id} problem={problem} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
