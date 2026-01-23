'use client';

/**
 * Asymptotic Notation Visualizer
 * ==============================
 * Interactive visualization comparing growth rates of common complexity functions.
 * Demonstrates O(1), O(log n), O(n), O(n log n), O(n²), O(2^n) growth patterns.
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

interface ComplexityFunction {
  name: string;
  latex: string;
  fn: (n: number) => number;
  color: string;
  enabled: boolean;
}

export default function AsymptoticNotation() {
  const chartRef = useRef<SVGSVGElement>(null);
  const [maxN, setMaxN] = useState(50);
  const [logScale, setLogScale] = useState(false);
  const [selectedN, setSelectedN] = useState<number | null>(null);

  const [functions, setFunctions] = useState<ComplexityFunction[]>([
    { name: 'O(1)', latex: 'O(1)', fn: () => 1, color: '#10b981', enabled: true },
    { name: 'O(log n)', latex: 'O(\\log n)', fn: (n) => Math.log2(Math.max(1, n)), color: '#3b82f6', enabled: true },
    { name: 'O(n)', latex: 'O(n)', fn: (n) => n, color: '#8b5cf6', enabled: true },
    { name: 'O(n log n)', latex: 'O(n \\log n)', fn: (n) => n * Math.log2(Math.max(1, n)), color: '#f59e0b', enabled: true },
    { name: 'O(n²)', latex: 'O(n^2)', fn: (n) => n * n, color: '#ef4444', enabled: true },
    { name: 'O(2^n)', latex: 'O(2^n)', fn: (n) => Math.pow(2, n), color: '#ec4899', enabled: false },
  ]);

  const toggleFunction = (index: number) => {
    setFunctions(prev => prev.map((f, i) =>
      i === index ? { ...f, enabled: !f.enabled } : f
    ));
  };

  // Generate data points
  const dataPoints = useMemo(() => {
    const points: { n: number; values: number[] }[] = [];
    for (let n = 1; n <= maxN; n++) {
      points.push({
        n,
        values: functions.map(f => f.fn(n)),
      });
    }
    return points;
  }, [maxN, functions]);

  // Calculate comparison table values
  const comparisonValues = useMemo(() => {
    const ns = [10, 100, 1000, 10000];
    return ns.map(n => ({
      n,
      values: functions.map(f => f.fn(n)),
    }));
  }, [functions]);

  // Draw the chart
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Find max Y value among enabled functions
    const enabledFunctions = functions.filter(f => f.enabled);
    const maxY = d3.max(dataPoints, d =>
      d3.max(enabledFunctions.map((f, i) => functions.indexOf(f)).map(i => d.values[i])) || 0
    ) || 100;

    // Scales
    const xScale = d3.scaleLinear().domain([1, maxN]).range([0, width]);
    const yScale = logScale
      ? d3.scaleLog().domain([1, maxY]).range([height, 0]).clamp(true)
      : d3.scaleLinear().domain([0, maxY * 1.1]).range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .append('text')
      .attr('fill', 'currentColor')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-content-secondary')
      .text('Input Size (n)');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(logScale ? 5 : 10).tickFormat(d3.format('.0s')))
      .append('text')
      .attr('fill', 'currentColor')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-content-secondary')
      .text('Operations');

    // Draw lines for each enabled function
    functions.forEach((func, funcIndex) => {
      if (!func.enabled) return;

      const line = d3.line<{ n: number; values: number[] }>()
        .x(d => xScale(d.n))
        .y(d => {
          const val = d.values[funcIndex];
          if (logScale && val <= 0) return height;
          return yScale(Math.max(logScale ? 1 : 0, val));
        })
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(dataPoints)
        .attr('fill', 'none')
        .attr('stroke', func.color)
        .attr('stroke-width', 2.5)
        .attr('d', line);
    });

    // Interactive vertical line
    const verticalLine = g.append('line')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('y1', 0)
      .attr('y2', height)
      .attr('opacity', 0);

    const tooltip = g.append('g').attr('opacity', 0);

    tooltip.append('rect')
      .attr('fill', 'rgba(0,0,0,0.8)')
      .attr('rx', 6)
      .attr('width', 120)
      .attr('height', 20 + enabledFunctions.length * 18);

    // Mouse interaction
    svg.on('mousemove', (event) => {
      const [mouseX] = d3.pointer(event);
      const adjustedX = mouseX - margin.left;

      if (adjustedX >= 0 && adjustedX <= width) {
        const n = Math.round(xScale.invert(adjustedX));
        if (n >= 1 && n <= maxN) {
          setSelectedN(n);

          verticalLine
            .attr('x1', xScale(n))
            .attr('x2', xScale(n))
            .attr('opacity', 0.5);
        }
      }
    });

    svg.on('mouseleave', () => {
      setSelectedN(null);
      verticalLine.attr('opacity', 0);
    });

  }, [dataPoints, functions, maxN, logScale]);

  const formatNumber = (num: number): string => {
    if (num >= 1e15) return '> 10¹⁵';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(1);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Asymptotic Growth Rates
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Compare how different complexity functions grow as input size increases
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg ref={chartRef} width="100%" height="350" viewBox="0 0 600 350" />
          </div>

          {/* Values at selected N */}
          {selectedN !== null && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-3">
                Values at n = {selectedN}
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {functions.map((func, idx) => (
                  <div
                    key={func.name}
                    className={`p-3 rounded-lg border ${
                      func.enabled
                        ? 'bg-surface-tertiary border-edge-primary'
                        : 'bg-surface-accent border-edge-secondary opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: func.color }}
                      />
                      <span className="text-xs text-content-muted">{func.name}</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-content-primary">
                      {formatNumber(func.fn(selectedN))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary overflow-x-auto">
            <h4 className="text-sm font-semibold text-content-primary mb-3">
              Growth Comparison Table
            </h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge-primary">
                  <th className="text-left py-2 px-3 text-content-muted font-medium">n</th>
                  {functions.filter(f => f.enabled).map((func) => (
                    <th key={func.name} className="text-right py-2 px-3">
                      <span className="flex items-center justify-end gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: func.color }}
                        />
                        <LaTeX math={func.latex} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonValues.map((row) => (
                  <tr key={row.n} className="border-b border-edge-secondary last:border-0">
                    <td className="py-2 px-3 font-mono font-semibold text-content-primary">
                      {row.n.toLocaleString()}
                    </td>
                    {functions.filter(f => f.enabled).map((func, i) => {
                      const funcIdx = functions.indexOf(func);
                      return (
                        <td key={func.name} className="text-right py-2 px-3 font-mono text-content-secondary">
                          {formatNumber(row.values[funcIdx])}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Display Options">
            <Slider
              label="Max Input Size (n)"
              value={maxN}
              onChange={(e) => setMaxN(Number(e.target.value))}
              min={10}
              max={100}
              step={10}
            />
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logScale}
                  onChange={(e) => setLogScale(e.target.checked)}
                  className="rounded border-edge-primary text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-content-secondary">Logarithmic Y-axis</span>
              </label>
              <p className="text-xs text-content-muted mt-1">
                Useful for comparing fast vs slow growth
              </p>
            </div>
          </ControlPanel>

          <ControlPanel title="Complexity Functions">
            <div className="space-y-2">
              {functions.map((func, idx) => (
                <label
                  key={func.name}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={func.enabled}
                    onChange={() => toggleFunction(idx)}
                    className="rounded border-edge-primary"
                    style={{ accentColor: func.color }}
                  />
                  <div
                    className="w-4 h-1 rounded-full"
                    style={{ backgroundColor: func.color }}
                  />
                  <span className="text-sm text-content-primary">
                    <LaTeX math={func.latex} />
                  </span>
                </label>
              ))}
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Key Insight
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              For large <LaTeX math="n" />, the dominant term determines growth.
              Constants and lower-order terms become negligible.
            </p>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              <LaTeX math="3n^2 + 5n + 2 = \Theta(n^2)" />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Practical Impact
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              At <LaTeX math="n = 1000" />: <LaTeX math="O(n^2)" /> does 1M operations while <LaTeX math="O(n \log n)" /> does only ~10K.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
