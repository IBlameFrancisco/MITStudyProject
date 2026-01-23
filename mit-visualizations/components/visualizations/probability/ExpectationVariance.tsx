'use client';

/**
 * Expectation and Variance Visualization
 * ========================================
 * Interactive demonstration of expected value as the "balance point"
 * and variance as a measure of spread.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

interface DataPoint {
  value: number;
  probability: number;
}

export default function ExpectationVariance() {
  const svgRef = useRef<SVGSVGElement>(null);

  // Custom discrete distribution (dice-like)
  const [probs, setProbs] = useState<number[]>([1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]);
  const [showDeviation, setShowDeviation] = useState(true);

  // Normalize probabilities
  const normalizedProbs = useMemo(() => {
    const sum = probs.reduce((a, b) => a + b, 0);
    return probs.map((p) => p / sum);
  }, [probs]);

  // Create data points
  const data: DataPoint[] = useMemo(() => {
    return normalizedProbs.map((p, i) => ({
      value: i + 1,
      probability: p,
    }));
  }, [normalizedProbs]);

  // Calculate Expected Value
  const expectedValue = useMemo(() => {
    return data.reduce((sum, d) => sum + d.value * d.probability, 0);
  }, [data]);

  // Calculate Variance using E[X^2] - (E[X])^2
  const variance = useMemo(() => {
    const eX2 = data.reduce((sum, d) => sum + d.value * d.value * d.probability, 0);
    return eX2 - expectedValue * expectedValue;
  }, [data, expectedValue]);

  // Standard Deviation
  const stdDev = Math.sqrt(variance);

  // Update a single probability
  const updateProb = (index: number, newValue: number) => {
    const newProbs = [...probs];
    newProbs[index] = newValue;
    setProbs(newProbs);
  };

  // Reset to uniform
  const resetToUniform = () => {
    setProbs([1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]);
  };

  // Set to example distributions
  const setSkewedRight = () => {
    setProbs([0.4, 0.3, 0.15, 0.1, 0.04, 0.01]);
  };

  const setSkewedLeft = () => {
    setProbs([0.01, 0.04, 0.1, 0.15, 0.3, 0.4]);
  };

  const setBimodal = () => {
    setProbs([0.35, 0.1, 0.05, 0.05, 0.1, 0.35]);
  };

  // Draw visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 30, right: 30, bottom: 60, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.value.toString()))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear().domain([0, Math.max(...data.map((d) => d.probability)) * 1.2]).range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('class', 'text-sm');

    // Y axis
    g.append('g').call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.2f')));

    // Bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.value.toString()) || 0)
      .attr('y', (d) => yScale(d.probability))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.probability))
      .attr('fill', '#f59e0b')
      .attr('fill-opacity', 0.7)
      .attr('rx', 4);

    // Expected value line (balance point)
    const meanX = margin.left + (expectedValue - 0.5) * (width / 6);

    // Draw balance point triangle
    g.append('path')
      .attr('d', `M ${(expectedValue - 1) * (width / 5.5) + xScale.bandwidth() / 2} ${height + 15} l 8 15 l -16 0 Z`)
      .attr('fill', '#ef4444');

    // Mean line
    g.append('line')
      .attr('x1', (expectedValue - 1) * (width / 5.5) + xScale.bandwidth() / 2)
      .attr('x2', (expectedValue - 1) * (width / 5.5) + xScale.bandwidth() / 2)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Mean label
    g.append('text')
      .attr('x', (expectedValue - 1) * (width / 5.5) + xScale.bandwidth() / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs fill-current')
      .attr('fill', '#ef4444')
      .text(`E[X] = ${expectedValue.toFixed(3)}`);

    // Deviation brackets if enabled
    if (showDeviation && stdDev > 0) {
      const leftBound = (expectedValue - stdDev - 1) * (width / 5.5) + xScale.bandwidth() / 2;
      const rightBound = (expectedValue + stdDev - 1) * (width / 5.5) + xScale.bandwidth() / 2;

      // Shaded region for ±1 std dev
      g.append('rect')
        .attr('x', Math.max(0, leftBound))
        .attr('y', 0)
        .attr('width', Math.min(width, rightBound) - Math.max(0, leftBound))
        .attr('height', height)
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.1);

      // Left boundary
      if (leftBound > 0) {
        g.append('line')
          .attr('x1', leftBound)
          .attr('x2', leftBound)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3,3');
      }

      // Right boundary
      if (rightBound < width) {
        g.append('line')
          .attr('x1', rightBound)
          .attr('x2', rightBound)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3,3');
      }

      // σ label
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 45)
        .attr('text-anchor', 'middle')
        .attr('class', 'text-xs fill-current')
        .attr('fill', '#3b82f6')
        .text(`±1σ region (σ = ${stdDev.toFixed(3)})`);
    }

    // Axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Outcome (x)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('P(X = x)');
  }, [data, expectedValue, stdDev, showDeviation]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Expectation & Variance Explorer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Adjust probabilities and see how mean and variance change
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Chart */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg ref={svgRef} width="100%" height="300" viewBox="0 0 600 300" className="text-content-secondary" />
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Expected Value</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {expectedValue.toFixed(3)}
              </div>
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                <LaTeX math="E[X] = \sum_x x \cdot P(x)" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Variance</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {variance.toFixed(3)}
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                <LaTeX math="E[X^2] - (E[X])^2" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Std Deviation</div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {stdDev.toFixed(3)}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                <LaTeX math="\sigma = \sqrt{\text{Var}(X)}" />
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-content-muted">E[X²] = </span>
                <span className="font-mono text-content-primary">
                  {data.reduce((sum, d) => sum + d.value * d.value * d.probability, 0).toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-content-muted">E[X]² = </span>
                <span className="font-mono text-content-primary">
                  {(expectedValue * expectedValue).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Probability Distribution">
            {probs.map((prob, i) => (
              <Slider
                key={i}
                label={`P(X=${i + 1})`}
                value={prob}
                onChange={(e) => updateProb(i, Number(e.target.value))}
                min={0.01}
                max={1}
                step={0.01}
              />
            ))}
          </ControlPanel>

          <ControlPanel title="Presets">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={resetToUniform}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
              >
                Uniform
              </button>
              <button
                onClick={setSkewedRight}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
              >
                Right Skew
              </button>
              <button
                onClick={setSkewedLeft}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
              >
                Left Skew
              </button>
              <button
                onClick={setBimodal}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
              >
                Bimodal
              </button>
            </div>
          </ControlPanel>

          <ControlPanel title="Display Options">
            <div className="flex items-center justify-between">
              <span className="text-sm text-content-secondary">Show ±1σ region</span>
              <button
                onClick={() => setShowDeviation(!showDeviation)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  showDeviation ? 'bg-brand-500' : 'bg-surface-tertiary border border-edge-primary'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                    showDeviation ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </ControlPanel>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Intuition
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              The expected value E[X] is like a "balance point" - if you placed weights proportional to probabilities, the distribution would balance at E[X].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
