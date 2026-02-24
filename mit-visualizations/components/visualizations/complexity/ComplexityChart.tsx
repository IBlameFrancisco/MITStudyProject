'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

interface ComplexityFunction {
  name: string;
  label: string;
  fn: (n: number) => number;
  color: string;
  enabled: boolean;
}

export default function ComplexityChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [maxN, setMaxN] = useState(50);
  const [logScale, setLogScale] = useState(false);

  const [complexities, setComplexities] = useState<ComplexityFunction[]>([
    { name: 'O(1)', label: 'O(1) - Constant', fn: () => 1, color: '#22c55e', enabled: true },
    { name: 'O(log n)', label: 'O(log n) - Logarithmic', fn: (n) => Math.log2(Math.max(1, n)), color: '#3b82f6', enabled: true },
    { name: 'O(n)', label: 'O(n) - Linear', fn: (n) => n, color: '#f59e0b', enabled: true },
    { name: 'O(n log n)', label: 'O(n log n) - Linearithmic', fn: (n) => n * Math.log2(Math.max(1, n)), color: '#8b5cf6', enabled: true },
    { name: 'O(n²)', label: 'O(n²) - Quadratic', fn: (n) => n * n, color: '#ef4444', enabled: true },
    { name: 'O(2^n)', label: 'O(2^n) - Exponential', fn: (n) => Math.pow(2, n), color: '#ec4899', enabled: false },
  ]);

  const toggleComplexity = (index: number) => {
    const updated = [...complexities];
    updated[index].enabled = !updated[index].enabled;
    setComplexities(updated);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 100, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate data
    const enabledComplexities = complexities.filter((c) => c.enabled);
    const data: { n: number; values: { name: string; value: number }[] }[] = [];

    for (let n = 1; n <= maxN; n++) {
      const values = enabledComplexities.map((c) => ({
        name: c.name,
        value: c.fn(n),
      }));
      data.push({ n, values });
    }

    // Scales
    const xScale = d3.scaleLinear().domain([1, maxN]).range([0, width]);

    let maxY = d3.max(data, (d) =>
      d3.max(d.values.filter((v) => !v.name.includes('2^n') || maxN <= 10), (v) => v.value)
    ) || 100;

    // Cap exponential for display
    if (enabledComplexities.some((c) => c.name === 'O(2^n)' && maxN > 10)) {
      maxY = Math.min(maxY, Math.pow(2, 10));
    }

    const yScale = logScale
      ? d3.scaleLog().domain([1, maxY]).range([height, 0]).clamp(true)
      : d3.scaleLinear().domain([0, maxY]).range([height, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Input Size (n)');

    g.append('g')
      .call(
        logScale
          ? d3.axisLeft(yScale).ticks(5, '.0e')
          : d3.axisLeft(yScale).ticks(5)
      )
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Operations');

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => '')
      );

    // Lines
    enabledComplexities.forEach((complexity) => {
      const lineData = data.map((d) => ({
        n: d.n,
        value: d.values.find((v) => v.name === complexity.name)?.value || 0,
      }));

      const line = d3
        .line<{ n: number; value: number }>()
        .x((d) => xScale(d.n))
        .y((d) => {
          const val = Math.min(d.value, maxY);
          return yScale(logScale ? Math.max(1, val) : val);
        })
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', complexity.color)
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // Legend
    const legend = g
      .append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    enabledComplexities.forEach((complexity, i) => {
      const legendItem = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendItem
        .append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 10)
        .attr('y2', 10)
        .attr('stroke', complexity.color)
        .attr('stroke-width', 2);

      legendItem
        .append('text')
        .attr('x', 25)
        .attr('y', 14)
        .attr('font-size', '12px')
        .attr('fill', 'currentColor')
        .text(complexity.name);
    });

  }, [complexities, maxN, logScale]);

  const examples = [
    { complexity: 'O(1)', example: 'Array access, hash table lookup' },
    { complexity: 'O(log n)', example: 'Binary search' },
    { complexity: 'O(n)', example: 'Linear search, single loop' },
    { complexity: 'O(n log n)', example: 'Merge sort, heap sort' },
    { complexity: 'O(n²)', example: 'Bubble sort, nested loops' },
    { complexity: 'O(2^n)', example: 'Recursive Fibonacci, subset enumeration' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Big-O Complexity Comparison
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4">
            <svg
              ref={svgRef}
              width="100%"
              height="400"
              viewBox="0 0 600 400"
              className="text-content-secondary"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {examples.map((ex) => (
              <div
                key={ex.complexity}
                className="p-3 bg-surface-secondary rounded-lg shadow-sm"
              >
                <span
                  className="font-mono font-bold"
                  style={{
                    color: complexities.find((c) => c.name === ex.complexity)?.color,
                  }}
                >
                  {ex.complexity}
                </span>
                <p className="text-xs text-content-tertiary mt-1">
                  {ex.example}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Display Options">
            <Slider
              label="Max n"
              value={maxN}
              onChange={(e) => setMaxN(Number(e.target.value))}
              min={10}
              max={100}
              step={10}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="logScale"
                checked={logScale}
                onChange={(e) => setLogScale(e.target.checked)}
                className="rounded border-edge-secondary"
              />
              <label htmlFor="logScale" className="text-sm text-content-secondary">
                Logarithmic Y-axis
              </label>
            </div>
          </ControlPanel>

          <ControlPanel title="Complexities">
            <div className="space-y-2">
              {complexities.map((c, i) => (
                <div key={c.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`complexity-${i}`}
                    checked={c.enabled}
                    onChange={() => toggleComplexity(i)}
                    className="rounded border-edge-secondary"
                  />
                  <div
                    className="w-4 h-1 rounded"
                    style={{ backgroundColor: c.color }}
                  />
                  <label
                    htmlFor={`complexity-${i}`}
                    className="text-sm text-content-secondary"
                  >
                    {c.name}
                  </label>
                </div>
              ))}
            </div>
          </ControlPanel>

          <ControlPanel title="What This Shows">
            <p className="text-sm text-content-tertiary">
              Big-O notation describes how an algorithm&apos;s runtime grows as input
              size increases. Lower curves are more efficient for large inputs.
            </p>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
