'use client';

/**
 * TopicSections Component
 * ========================
 * Displays course topic sections with clear visual delineation.
 * Each section has a colored header and renders LaTeX math content.
 */

import { motion } from 'framer-motion';
import { LaTeX } from './LaTeX';
import type { TopicSection } from '@/lib/data/courses';

// =============================================================================
// TYPES
// =============================================================================

interface TopicSectionsProps {
  sections: TopicSection[];
}

// =============================================================================
// COLOR SCHEMES - Modern, warm palette
// =============================================================================

const SECTION_COLORS = [
  {
    gradient: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50/50 dark:bg-amber-900/10',
    border: 'border-amber-200/50 dark:border-amber-800/30',
    accent: 'text-amber-600 dark:text-amber-400',
  },
  {
    gradient: 'from-blue-500 to-indigo-500',
    light: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  {
    gradient: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    border: 'border-emerald-200/50 dark:border-emerald-800/30',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    gradient: 'from-purple-500 to-pink-500',
    light: 'bg-purple-50/50 dark:bg-purple-900/10',
    border: 'border-purple-200/50 dark:border-purple-800/30',
    accent: 'text-purple-600 dark:text-purple-400',
  },
  {
    gradient: 'from-rose-500 to-red-500',
    light: 'bg-rose-50/50 dark:bg-rose-900/10',
    border: 'border-rose-200/50 dark:border-rose-800/30',
    accent: 'text-rose-600 dark:text-rose-400',
  },
];

// =============================================================================
// CONTENT RENDERER
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
            <div key={idx} className="my-5 overflow-x-auto py-3 px-4 bg-surface-tertiary/50 rounded-xl border border-edge-primary">
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
    <div className="mb-4 last:mb-0">
      {lines.map((line, lIdx) => (
        <LineRenderer key={lIdx} line={line} />
      ))}
    </div>
  );
}

function LineRenderer({ line }: { line: string }) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('### ')) {
    return (
      <h4 className="font-semibold text-content-primary mt-5 mb-3 text-base">
        <InlineRenderer text={trimmed.slice(4)} />
      </h4>
    );
  }

  const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (numberedMatch) {
    return (
      <div className="flex items-start ml-4 my-2.5">
        <span className="text-brand-600 dark:text-brand-400 font-semibold mr-3 mt-0.5 min-w-[1.5rem]">
          {numberedMatch[1]}.
        </span>
        <span className="text-content-secondary leading-relaxed">
          <InlineRenderer text={numberedMatch[2]} />
        </span>
      </div>
    );
  }

  if (trimmed.startsWith('- ')) {
    return (
      <div className="flex items-start ml-4 my-2">
        <span className="text-brand-500 mr-3 mt-1.5 text-xs">●</span>
        <span className="text-content-secondary leading-relaxed">
          <InlineRenderer text={trimmed.slice(2)} />
        </span>
      </div>
    );
  }

  return (
    <p className="text-content-secondary leading-relaxed">
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
// SECTION CARD COMPONENT
// =============================================================================

function SectionCard({ section, index }: { section: TopicSection; index: number }) {
  const colorScheme = SECTION_COLORS[index % SECTION_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`rounded-2xl overflow-hidden border ${colorScheme.border} bg-surface-secondary`}
    >
      {/* Section Header */}
      <div className={`bg-gradient-to-r ${colorScheme.gradient} px-6 py-4`}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">{index + 1}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        </div>
      </div>

      {/* Section Content */}
      <div className={`${colorScheme.light} p-6`}>
        <ContentRenderer content={section.content} />
      </div>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function TopicSections({ sections }: TopicSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-10"
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center mr-4 shadow-soft">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-content-primary">Topics in This Unit</h2>
          <p className="text-sm text-content-muted">MIT 18.600 Level Content</p>
        </div>
      </div>

      {/* Section Cards */}
      <div className="space-y-5">
        {sections.map((section, index) => (
          <SectionCard key={section.title} section={section} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
