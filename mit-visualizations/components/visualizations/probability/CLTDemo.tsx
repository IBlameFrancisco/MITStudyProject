'use client';

/**
 * Central Limit Theorem Demonstration
 * ====================================
 * Interactive visualization showing how the sample mean distribution
 * converges to a normal distribution as sample size increases.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type SourceDistribution = 'uniform' | 'exponential' | 'bernoulli' | 'dice';

export default function CLTDemo() {
  const histogramRef = useRef<SVGSVGElement>(null);
  const sourceRef = useRef<SVGSVGElement>(null);

  const [sourceDist, setSourceDist] = useState<SourceDistribution>('dice');
  const [sampleSize, setSampleSize] = useState(5);
  const [numSamples, setNumSamples] = useState(500);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Distribution parameters
  const [bernoulliP, setBernoulliP] = useState(0.3);
  const [expLambda, setExpLambda] = useState(1);

  // Generate a single sample from the source distribution
  const generateSample = useCallback((): number => {
    switch (sourceDist) {
      case 'uniform':
        return Math.random();
      case 'exponential':
        return -Math.log(Math.random()) / expLambda;
      case 'bernoulli':
        return Math.random() < bernoulliP ? 1 : 0;
      case 'dice':
        return Math.floor(Math.random() * 6) + 1;
      default:
        return Math.random();
    }
  }, [sourceDist, bernoulliP, expLambda]);

  // Source distribution statistics
  const sourceStats = useMemo(() => {
    switch (sourceDist) {
      case 'uniform':
        return { mean: 0.5, variance: 1 / 12, std: Math.sqrt(1 / 12) };
      case 'exponential':
        return { mean: 1 / expLambda, variance: 1 / (expLambda ** 2), std: 1 / expLambda };
      case 'bernoulli':
        return { mean: bernoulliP, variance: bernoulliP * (1 - bernoulliP), std: Math.sqrt(bernoulliP * (1 - bernoulliP)) };
      case 'dice':
        return { mean: 3.5, variance: 35 / 12, std: Math.sqrt(35 / 12) };
      default:
        return { mean: 0, variance: 1, std: 1 };
    }
  }, [sourceDist, bernoulliP, expLambda]);

  // Run simulation
  const runSimulation = useCallback(() => {
    const means: number[] = [];

    for (let i = 0; i < numSamples; i++) {
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        sum += generateSample();
      }
      means.push(sum / sampleSize);
    }

    setSampleMeans(means);
  }, [numSamples, sampleSize, generateSample]);

  // Animated simulation
  const animateSimulation = useCallback(() => {
    setIsRunning(true);
    setSampleMeans([]);

    let currentMeans: number[] = [];
    let count = 0;
    const batchSize = 20;

    const interval = setInterval(() => {
      for (let i = 0; i < batchSize && count < numSamples; i++, count++) {
        let sum = 0;
        for (let j = 0; j < sampleSize; j++) {
          sum += generateSample();
        }
        currentMeans.push(sum / sampleSize);
      }

      setSampleMeans([...currentMeans]);

      if (count >= numSamples) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [numSamples, sampleSize, generateSample]);

  // Reset
  const reset = () => {
    setSampleMeans([]);
    setIsRunning(false);
  };

  // Sample mean statistics
  const sampleStats = useMemo(() => {
    if (sampleMeans.length === 0) return null;

    const mean = sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
    const variance = sampleMeans.reduce((sum, x) => sum + (x - mean) ** 2, 0) / sampleMeans.length;

    return {
      mean,
      variance,
      std: Math.sqrt(variance),
      theoreticalMean: sourceStats.mean,
      theoreticalStd: sourceStats.std / Math.sqrt(sampleSize)
    };
  }, [sampleMeans, sourceStats, sampleSize]);

  // Draw source distribution
  useEffect(() => {
    if (!sourceRef.current) return;

    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const width = 200 - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const svg = d3.select(sourceRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (sourceDist === 'dice') {
      const data = [1, 2, 3, 4, 5, 6].map(v => ({ x: v, y: 1 / 6 }));
      const xScale = d3.scaleBand().domain(data.map(d => d.x.toString())).range([0, width]).padding(0.2);
      const yScale = d3.scaleLinear().domain([0, 0.2]).range([height, 0]);

      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d.x.toString()) || 0)
        .attr('y', d => yScale(d.y))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.y))
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.7)
        .attr('rx', 2);

      g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale).tickSize(0));
    } else if (sourceDist === 'bernoulli') {
      const data = [{ x: 0, y: 1 - bernoulliP }, { x: 1, y: bernoulliP }];
      const xScale = d3.scaleBand().domain(['0', '1']).range([0, width]).padding(0.3);
      const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d.x.toString()) || 0)
        .attr('y', d => yScale(d.y))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.y))
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.7)
        .attr('rx', 2);

      g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale).tickSize(0));
    } else {
      // Continuous distributions
      const data: { x: number; y: number }[] = [];
      const xMin = sourceDist === 'exponential' ? 0 : 0;
      const xMax = sourceDist === 'exponential' ? 4 / expLambda : 1;

      for (let x = xMin; x <= xMax; x += (xMax - xMin) / 50) {
        let y;
        if (sourceDist === 'uniform') {
          y = x >= 0 && x <= 1 ? 1 : 0;
        } else {
          y = expLambda * Math.exp(-expLambda * x);
        }
        data.push({ x, y });
      }

      const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);
      const yMax = d3.max(data, d => d.y) || 1;
      const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

      const area = d3.area<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y0(height)
        .y1(d => yScale(d.y));

      g.append('path')
        .datum(data)
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.3)
        .attr('d', area);

      const line = d3.line<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line);

      g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale).ticks(4));
    }
  }, [sourceDist, bernoulliP, expLambda]);

  // Draw histogram of sample means
  useEffect(() => {
    if (!histogramRef.current) return;

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 550 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(histogramRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale based on theoretical range
    const theoreticalStd = sourceStats.std / Math.sqrt(sampleSize);
    const xMin = sourceStats.mean - 4 * theoreticalStd;
    const xMax = sourceStats.mean + 4 * theoreticalStd;
    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

    if (sampleMeans.length > 0) {
      // Create histogram bins
      const histogram = d3.histogram()
        .domain([xMin, xMax])
        .thresholds(30);

      const bins = histogram(sampleMeans);
      const yMax = d3.max(bins, d => d.length) || 1;
      const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

      // Grid
      g.append('g')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

      // Bars
      g.selectAll('rect')
        .data(bins)
        .join('rect')
        .attr('x', d => xScale(d.x0 || 0) + 1)
        .attr('y', d => yScale(d.length))
        .attr('width', d => Math.max(0, xScale(d.x1 || 0) - xScale(d.x0 || 0) - 2))
        .attr('height', d => height - yScale(d.length))
        .attr('fill', '#d97706')
        .attr('fill-opacity', 0.7)
        .attr('rx', 2);

      // Normal curve overlay
      const normalPDF = (x: number) => {
        const z = (x - sourceStats.mean) / theoreticalStd;
        return Math.exp(-0.5 * z * z) / (theoreticalStd * Math.sqrt(2 * Math.PI));
      };

      const normalData: { x: number; y: number }[] = [];
      const scaleFactor = sampleMeans.length * (bins[0].x1! - bins[0].x0!);

      for (let x = xMin; x <= xMax; x += (xMax - xMin) / 100) {
        normalData.push({ x, y: normalPDF(x) * scaleFactor });
      }

      const line = d3.line<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(normalData)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '5,5')
        .attr('d', line);

      // Y axis
      g.append('g').call(d3.axisLeft(yScale).ticks(5));
    }

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Sample Mean (X̄)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Frequency');

    // Title
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-semibold fill-current text-content-primary')
      .text(`Distribution of ${sampleMeans.length} Sample Means (n = ${sampleSize})`);

  }, [sampleMeans, sourceStats, sampleSize]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Central Limit Theorem
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Watch how sample means become normally distributed regardless of the source distribution
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Histogram */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg ref={histogramRef} width="100%" height="300" viewBox="0 0 550 300" className="text-content-secondary" />
            {sampleMeans.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-content-muted">Click "Run Simulation" to start</p>
              </div>
            )}
          </div>

          {/* CLT Formula */}
          <div className="bg-gradient-to-r from-brand-50 to-red-50 dark:from-brand-900/20 dark:to-red-900/20 rounded-xl p-4 border border-brand-200 dark:border-brand-800">
            <div className="text-center">
              <p className="text-sm text-content-secondary mb-2">Central Limit Theorem:</p>
              <div className="text-brand-600 dark:text-brand-400">
                <LaTeX math="\bar{X}_n \xrightarrow{d} N\left(\mu, \frac{\sigma^2}{n}\right) \text{ as } n \to \infty" />
              </div>
              <div className="text-xs text-content-muted mt-3">
                <LaTeX math="\frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} N(0,1)" />
              </div>
            </div>
          </div>

          {/* Comparison Stats */}
          {sampleStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                <div className="text-xs text-content-muted">Observed Mean</div>
                <div className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  {sampleStats.mean.toFixed(4)}
                </div>
                <div className="text-xs text-content-muted">
                  (Theory: {sampleStats.theoreticalMean.toFixed(4)})
                </div>
              </div>
              <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                <div className="text-xs text-content-muted">Observed Std</div>
                <div className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  {sampleStats.std.toFixed(4)}
                </div>
                <div className="text-xs text-content-muted">
                  (Theory: {sampleStats.theoreticalStd.toFixed(4)})
                </div>
              </div>
              <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                <div className="text-xs text-content-muted">Sample Size (n)</div>
                <div className="text-lg font-bold text-content-primary">{sampleSize}</div>
              </div>
              <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                <div className="text-xs text-content-muted"># of Samples</div>
                <div className="text-lg font-bold text-content-primary">{sampleMeans.length}</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Source Distribution">
            <select
              value={sourceDist}
              onChange={(e) => { setSourceDist(e.target.value as SourceDistribution); reset(); }}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm mb-2"
            >
              <option value="dice">Fair Die (1-6)</option>
              <option value="uniform">Uniform(0,1)</option>
              <option value="exponential">Exponential(λ)</option>
              <option value="bernoulli">Bernoulli(p)</option>
            </select>

            <div className="mt-2">
              <p className="text-xs text-content-muted mb-1">Source Distribution:</p>
              <svg ref={sourceRef} width="200" height="120" className="text-content-secondary" />
            </div>

            {sourceDist === 'bernoulli' && (
              <Slider label="p" value={bernoulliP} onChange={(e) => setBernoulliP(Number(e.target.value))} min={0.1} max={0.9} step={0.05} />
            )}
            {sourceDist === 'exponential' && (
              <Slider label="λ" value={expLambda} onChange={(e) => setExpLambda(Number(e.target.value))} min={0.5} max={3} step={0.1} />
            )}
          </ControlPanel>

          <ControlPanel title="Simulation Parameters">
            <Slider
              label="Sample Size (n)"
              value={sampleSize}
              onChange={(e) => { setSampleSize(Number(e.target.value)); reset(); }}
              min={1}
              max={50}
              step={1}
            />
            <Slider
              label="Number of Samples"
              value={numSamples}
              onChange={(e) => setNumSamples(Number(e.target.value))}
              min={100}
              max={2000}
              step={100}
            />
          </ControlPanel>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={animateSimulation}
              disabled={isRunning}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isRunning
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-500 text-white hover:bg-brand-600'
              }`}
            >
              {isRunning ? 'Running...' : 'Run Simulation'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Key Insight
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed mb-2">
              As sample size <LaTeX math="n" /> increases, the histogram of sample means looks more like a normal distribution, even when sampling from a non-normal distribution!
            </p>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              <LaTeX math="\text{SE}(\bar{X}) = \frac{\sigma}{\sqrt{n}}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
