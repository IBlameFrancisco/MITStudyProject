'use client';

/**
 * Pascal's Triangle Visualization
 * ================================
 * Interactive visualization of Pascal's Triangle showing binomial coefficients.
 * Demonstrates the relationship between combinations and the binomial theorem.
 */

import { useState, useMemo } from 'react';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

export default function PascalTriangle() {
  const [numRows, setNumRows] = useState(8);
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightDiagonal, setHighlightDiagonal] = useState<number | null>(null);
  const [showSums, setShowSums] = useState(false);

  // Calculate binomial coefficient C(n, k)
  const binomial = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  };

  // Generate Pascal's Triangle data
  const triangle = useMemo(() => {
    const rows: number[][] = [];
    for (let n = 0; n < numRows; n++) {
      const row: number[] = [];
      for (let k = 0; k <= n; k++) {
        row.push(binomial(n, k));
      }
      rows.push(row);
    }
    return rows;
  }, [numRows]);

  // Calculate row sums (should be 2^n)
  const rowSums = useMemo(() => {
    return triangle.map((row, n) => ({
      sum: row.reduce((a, b) => a + b, 0),
      expected: Math.pow(2, n)
    }));
  }, [triangle]);

  // Check if a cell should be highlighted
  const isHighlighted = (row: number, col: number): boolean => {
    if (highlightRow !== null && row === highlightRow) return true;
    if (highlightDiagonal !== null && col === highlightDiagonal) return true;
    return false;
  };

  // Get cell color based on value and highlight state
  const getCellStyle = (row: number, col: number, value: number) => {
    const isActive = isHighlighted(row, col);
    const maxVal = Math.max(...triangle.flat());
    const intensity = Math.log(value + 1) / Math.log(maxVal + 1);

    if (isActive) {
      return {
        backgroundColor: `rgba(217, 119, 6, ${0.3 + intensity * 0.5})`,
        color: '#1c1917',
        borderColor: 'rgb(217, 119, 6)',
        transform: 'scale(1.1)',
        zIndex: 10,
      };
    }

    return {
      backgroundColor: `rgba(245, 158, 11, ${intensity * 0.2})`,
      borderColor: 'rgba(217, 119, 6, 0.3)',
    };
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Pascal's Triangle
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore binomial coefficients C(n,k) and their properties
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Triangle Display */}
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-2xl p-6 border border-edge-primary overflow-x-auto">
            <div className="flex flex-col items-center min-w-fit">
              {triangle.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center justify-center gap-1 my-0.5"
                >
                  {/* Row label */}
                  <span className="text-xs text-content-muted w-8 text-right mr-2 font-mono">
                    n={rowIndex}
                  </span>

                  {/* Triangle cells */}
                  {row.map((value, colIndex) => (
                    <div
                      key={colIndex}
                      className="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-110"
                      style={getCellStyle(rowIndex, colIndex, value)}
                      onMouseEnter={() => {
                        setHighlightRow(rowIndex);
                        setHighlightDiagonal(colIndex);
                      }}
                      onMouseLeave={() => {
                        setHighlightRow(null);
                        setHighlightDiagonal(null);
                      }}
                      title={`C(${rowIndex}, ${colIndex}) = ${value}`}
                    >
                      <span className="text-content-primary">{value}</span>
                    </div>
                  ))}

                  {/* Row sum */}
                  {showSums && (
                    <span className="text-xs text-brand-600 dark:text-brand-400 w-12 text-left ml-2 font-mono">
                      = {rowSums[rowIndex].sum}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Formula Display */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-2">
                Binomial Coefficient
              </h4>
              <div className="text-center py-2">
                <LaTeX math="\binom{n}{k} = \frac{n!}{k!(n-k)!}" />
              </div>
              {highlightRow !== null && highlightDiagonal !== null && (
                <div className="text-center text-sm text-brand-600 dark:text-brand-400 mt-2">
                  <LaTeX math={`\\binom{${highlightRow}}{${highlightDiagonal}} = ${binomial(highlightRow, highlightDiagonal)}`} />
                </div>
              )}
            </div>

            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-2">
                Pascal's Identity
              </h4>
              <div className="text-center py-2">
                <LaTeX math="\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}" />
              </div>
              <div className="text-center text-xs text-content-muted mt-2">
                Each number is the sum of the two above it
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Display Options">
            <Slider
              label="Number of Rows"
              value={numRows}
              onChange={(e) => setNumRows(Number(e.target.value))}
              min={3}
              max={12}
              step={1}
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-content-secondary">Show Row Sums</span>
              <button
                onClick={() => setShowSums(!showSums)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  showSums
                    ? 'bg-brand-500'
                    : 'bg-surface-tertiary border border-edge-primary'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                    showSums ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </ControlPanel>

          <ControlPanel title="Properties">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Row Sum:</span>
                <LaTeX math="2^n" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Symmetry:</span>
                <LaTeX math="\binom{n}{k} = \binom{n}{n-k}" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Hockey Stick:</span>
                <LaTeX math="\sum_{i=k}^{n}\binom{i}{k} = \binom{n+1}{k+1}" />
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="Binomial Theorem">
            <div className="text-xs text-content-secondary leading-relaxed">
              <p className="mb-2">
                The n-th row gives coefficients for:
              </p>
              <div className="bg-surface-tertiary rounded-lg p-3 text-center overflow-x-auto">
                <LaTeX math="(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^k b^{n-k}" />
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
