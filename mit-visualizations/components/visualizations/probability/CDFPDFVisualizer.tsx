'use client';

/**
 * CDF/PDF Visualizer
 * ===================
 * Interactive visualization showing the relationship between
 * Probability Density Functions and Cumulative Distribution Functions.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type Distribution = 'uniform' | 'exponential' | 'normal';

export default function CDFPDFVisualizer() {
  const pdfRef = useRef<SVGSVGElement>(null);
  const cdfRef = useRef<SVGSVGElement>(null);

  const [distribution, setDistribution] = useState<Distribution>('normal');
  const [queryPoint, setQueryPoint] = useState(0);

  // Distribution parameters
  const [uniformA, setUniformA] = useState(0);
  const [uniformB, setUniformB] = useState(1);
  const [expLambda, setExpLambda] = useState(1);
  const [normalMean, setNormalMean] = useState(0);
  const [normalStd, setNormalStd] = useState(1);

  // Calculate PDF value at x
  const pdf = (x: number): number => {
    if (distribution === 'uniform') {
      return x >= uniformA && x <= uniformB ? 1 / (uniformB - uniformA) : 0;
    } else if (distribution === 'exponential') {
      return x >= 0 ? expLambda * Math.exp(-expLambda * x) : 0;
    } else {
      // Normal distribution
      const z = (x - normalMean) / normalStd;
      return Math.exp(-0.5 * z * z) / (normalStd * Math.sqrt(2 * Math.PI));
    }
  };

  // Calculate CDF value at x
  const cdf = (x: number): number => {
    if (distribution === 'uniform') {
      if (x < uniformA) return 0;
      if (x > uniformB) return 1;
      return (x - uniformA) / (uniformB - uniformA);
    } else if (distribution === 'exponential') {
      return x >= 0 ? 1 - Math.exp(-expLambda * x) : 0;
    } else {
      // Normal distribution CDF using error function approximation
      const z = (x - normalMean) / normalStd;
      return 0.5 * (1 + erf(z / Math.sqrt(2)));
    }
  };

  // Error function approximation
  const erf = (x: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  };

  // Get x-axis domain based on distribution
  const getXDomain = (): [number, number] => {
    if (distribution === 'uniform') {
      return [uniformA - 0.5, uniformB + 0.5];
    } else if (distribution === 'exponential') {
      return [0, 5 / expLambda];
    } else {
      return [normalMean - 4 * normalStd, normalMean + 4 * normalStd];
    }
  };

  // Statistics
  const stats = useMemo(() => {
    if (distribution === 'uniform') {
      const mean = (uniformA + uniformB) / 2;
      const variance = Math.pow(uniformB - uniformA, 2) / 12;
      return { mean, variance, std: Math.sqrt(variance) };
    } else if (distribution === 'exponential') {
      return { mean: 1 / expLambda, variance: 1 / Math.pow(expLambda, 2), std: 1 / expLambda };
    } else {
      return { mean: normalMean, variance: Math.pow(normalStd, 2), std: normalStd };
    }
  }, [distribution, uniformA, uniformB, expLambda, normalMean, normalStd]);

  // Draw PDF
  useEffect(() => {
    if (!pdfRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(pdfRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = getXDomain();
    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);

    // Generate PDF data
    const step = (xDomain[1] - xDomain[0]) / 200;
    const data: { x: number; y: number }[] = [];
    for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
      data.push({ x, y: pdf(x) });
    }

    const yMax = d3.max(data, (d) => d.y) || 1;
    const yScale = d3.scaleLinear().domain([0, yMax * 1.1]).range([height, 0]);

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
      .attr('class', 'text-content-secondary');

    // Y axis
    g.append('g').call(d3.axisLeft(yScale).ticks(5));

    // Area under curve up to query point
    const areaData = data.filter((d) => d.x <= queryPoint);
    if (areaData.length > 0) {
      const area = d3
        .area<{ x: number; y: number }>()
        .x((d) => xScale(d.x))
        .y0(height)
        .y1((d) => yScale(d.y));

      g.append('path')
        .datum(areaData)
        .attr('fill', 'rgba(217, 119, 6, 0.3)')
        .attr('d', area);
    }

    // PDF curve
    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#d97706')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Query point line
    if (queryPoint >= xDomain[0] && queryPoint <= xDomain[1]) {
      g.append('line')
        .attr('x1', xScale(queryPoint))
        .attr('x2', xScale(queryPoint))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      // Point on curve
      g.append('circle')
        .attr('cx', xScale(queryPoint))
        .attr('cy', yScale(pdf(queryPoint)))
        .attr('r', 5)
        .attr('fill', '#ef4444');
    }

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('x');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('f(x)');
  }, [distribution, uniformA, uniformB, expLambda, normalMean, normalStd, queryPoint]);

  // Draw CDF
  useEffect(() => {
    if (!cdfRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(cdfRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = getXDomain();
    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1.1]).range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Y axis
    g.append('g').call(d3.axisLeft(yScale).ticks(5));

    // Generate CDF data
    const step = (xDomain[1] - xDomain[0]) / 200;
    const data: { x: number; y: number }[] = [];
    for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
      data.push({ x, y: cdf(x) });
    }

    // CDF curve
    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Query point
    if (queryPoint >= xDomain[0] && queryPoint <= xDomain[1]) {
      const cdfValue = cdf(queryPoint);

      // Vertical line to curve
      g.append('line')
        .attr('x1', xScale(queryPoint))
        .attr('x2', xScale(queryPoint))
        .attr('y1', height)
        .attr('y2', yScale(cdfValue))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      // Horizontal line from curve to y-axis
      g.append('line')
        .attr('x1', 0)
        .attr('x2', xScale(queryPoint))
        .attr('y1', yScale(cdfValue))
        .attr('y2', yScale(cdfValue))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      // Point on curve
      g.append('circle')
        .attr('cx', xScale(queryPoint))
        .attr('cy', yScale(cdfValue))
        .attr('r', 5)
        .attr('fill', '#ef4444');
    }

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('x');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('F(x)');
  }, [distribution, uniformA, uniformB, expLambda, normalMean, normalStd, queryPoint]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        PDF and CDF Relationship
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore how the area under the PDF equals the CDF value
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* PDF Chart */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-content-primary">
                Probability Density Function (PDF)
              </h3>
              <span className="text-xs text-content-muted font-mono">
                f({queryPoint.toFixed(2)}) = {pdf(queryPoint).toFixed(4)}
              </span>
            </div>
            <svg ref={pdfRef} width="100%" height="200" viewBox="0 0 500 200" className="text-content-secondary" />
          </div>

          {/* CDF Chart */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-content-primary">
                Cumulative Distribution Function (CDF)
              </h3>
              <span className="text-xs text-content-muted font-mono">
                F({queryPoint.toFixed(2)}) = P(X ≤ {queryPoint.toFixed(2)}) = {cdf(queryPoint).toFixed(4)}
              </span>
            </div>
            <svg ref={cdfRef} width="100%" height="200" viewBox="0 0 500 200" className="text-content-secondary" />
          </div>

          {/* Key Relationship */}
          <div className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-brand-200 dark:border-brand-800">
            <div className="text-center">
              <p className="text-sm text-content-secondary mb-2">
                The shaded area under the PDF equals the CDF value:
              </p>
              <div className="text-brand-600 dark:text-brand-400">
                <LaTeX math={`F(x) = \\int_{-\\infty}^{x} f(t)\\,dt = ${cdf(queryPoint).toFixed(4)}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Distribution">
            <select
              value={distribution}
              onChange={(e) => setDistribution(e.target.value as Distribution)}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm"
            >
              <option value="normal">Normal</option>
              <option value="uniform">Uniform</option>
              <option value="exponential">Exponential</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Query Point">
            <Slider
              label="x value"
              value={queryPoint}
              onChange={(e) => setQueryPoint(Number(e.target.value))}
              min={getXDomain()[0]}
              max={getXDomain()[1]}
              step={0.01}
            />
          </ControlPanel>

          <ControlPanel title="Parameters">
            {distribution === 'uniform' && (
              <>
                <Slider label="a (min)" value={uniformA} onChange={(e) => setUniformA(Number(e.target.value))} min={-2} max={0} step={0.1} />
                <Slider label="b (max)" value={uniformB} onChange={(e) => setUniformB(Number(e.target.value))} min={0.5} max={3} step={0.1} />
              </>
            )}
            {distribution === 'exponential' && (
              <Slider label="λ (rate)" value={expLambda} onChange={(e) => setExpLambda(Number(e.target.value))} min={0.1} max={3} step={0.1} />
            )}
            {distribution === 'normal' && (
              <>
                <Slider label="μ (mean)" value={normalMean} onChange={(e) => setNormalMean(Number(e.target.value))} min={-3} max={3} step={0.1} />
                <Slider label="σ (std)" value={normalStd} onChange={(e) => setNormalStd(Number(e.target.value))} min={0.5} max={2} step={0.1} />
              </>
            )}
          </ControlPanel>

          <ControlPanel title="Statistics">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-content-secondary">Mean E[X]:</span>
                <span className="font-mono text-content-primary">{stats.mean.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Variance:</span>
                <span className="font-mono text-content-primary">{stats.variance.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Std Dev:</span>
                <span className="font-mono text-content-primary">{stats.std.toFixed(3)}</span>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
