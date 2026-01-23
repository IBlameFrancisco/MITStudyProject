'use client';

/**
 * LaTeX Component
 * ================
 * Renders mathematical expressions using KaTeX.
 *
 * USAGE:
 * - Inline math: <LaTeX math="x^2 + y^2 = z^2" />
 * - Block math: <LaTeX math="\\int_0^1 x^2 dx" block />
 * - Parse mixed text: parseLatex("The formula $E = mc^2$ is famous")
 *
 * LATEX SYNTAX:
 * - Use $...$ for inline math in text
 * - Use $$...$$ for block (display) math in text
 * - Escape backslashes in JavaScript strings: \\frac, \\sum, etc.
 */

import katex from 'katex';
import { useMemo, type ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface LaTeXProps {
  /** The LaTeX math expression to render */
  math: string;
  /** Whether to render as block (display) mode */
  block?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// KATEX MACROS
// =============================================================================

const KATEX_MACROS = {
  // Common sets
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\Q": "\\mathbb{Q}",
  "\\C": "\\mathbb{C}",

  // Probability/Statistics
  "\\E": "\\mathbb{E}",
  "\\P": "\\mathbb{P}",
  "\\Var": "\\text{Var}",
  "\\Cov": "\\text{Cov}",
  "\\Corr": "\\text{Corr}",
  "\\iid": "\\overset{\\text{iid}}{\\sim}",
  "\\ind": "\\perp\\!\\!\\!\\perp",

  // Common operators
  "\\argmax": "\\operatorname{argmax}",
  "\\argmin": "\\operatorname{argmin}",
};

// =============================================================================
// LATEX COMPONENT
// =============================================================================

export function LaTeX({ math, block = false, className = '' }: LaTeXProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: true,
        macros: KATEX_MACROS,
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      // Return the original math in a styled span to indicate error
      return `<span class="text-red-500 font-mono text-sm">${math}</span>`;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`my-4 overflow-x-auto text-center ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// =============================================================================
// LATEX TEXT PARSER
// =============================================================================

/**
 * Parse text containing LaTeX math delimiters and return React nodes.
 *
 * @param text - Text containing $...$ (inline) and $$...$$ (block) math
 * @returns Array of React nodes with LaTeX components
 *
 * @example
 * parseLatex("The equation $E = mc^2$ shows that...")
 * // Returns: ["The equation ", <LaTeX math="E = mc^2" />, " shows that..."]
 */
export function parseLatex(text: string): ReactNode[] {
  if (!text) return [];

  const result: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Regex to match both block ($$...$$) and inline ($...$) LaTeX
  // Block must come first to avoid $$ being matched as two $ $
  const regex = /\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore) {
        result.push(textBefore);
      }
    }

    if (match[1] !== undefined) {
      // Block LaTeX ($$...$$)
      result.push(<LaTeX key={key++} math={match[1].trim()} block />);
    } else if (match[2] !== undefined) {
      // Inline LaTeX ($...$)
      result.push(<LaTeX key={key++} math={match[2]} />);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default LaTeX;
