'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

type Distribution = 'normal' | 'binomial' | 'poisson';

export default function DistributionPlot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [distribution, setDistribution] = useState<Distribution>('normal');

  // Normal distribution parameters
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);

  // Binomial distribution parameters
  const [trials, setTrials] = useState(20);
  const [probability, setProbability] = useState(0.5);

  // Poisson distribution parameters
  const [lambda, setLambda] = useState(5);

  // Normal distribution PDF
  const normalPDF = (x: number, mu: number, sigma: number): number => {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  };

  // Binomial PMF
  const binomialPMF = (k: number, n: number, p: number): number => {
    const coefficient = factorial(n) / (factorial(k) * factorial(n - k));
    return coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  // Poisson PMF
  const poissonPMF = (k: number, lam: number): number => {
    return (Math.pow(lam, k) * Math.exp(-lam)) / factorial(k);
  };

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let data: { x: number; y: number }[] = [];
    let xDomain: [number, number];
    let xLabel: string;
    let yLabel: string = 'Probability';

    if (distribution === 'normal') {
      xDomain = [mean - 4 * stdDev, mean + 4 * stdDev];
      xLabel = 'x';
      const step = (xDomain[1] - xDomain[0]) / 200;
      for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
        data.push({ x, y: normalPDF(x, mean, stdDev) });
      }
    } else if (distribution === 'binomial') {
      xDomain = [0, trials];
      xLabel = 'k (successes)';
      for (let k = 0; k <= trials; k++) {
        data.push({ x: k, y: binomialPMF(k, trials, probability) });
      }
    } else {
      const maxK = Math.max(20, Math.ceil(lambda + 4 * Math.sqrt(lambda)));
      xDomain = [0, maxK];
      xLabel = 'k (events)';
      for (let k = 0; k <= maxK; k++) {
        data.push({ x: k, y: poissonPMF(k, lambda) });
      }
    }

    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
    const yMax = d3.max(data, (d) => d.y) || 1;
    const yScale = d3.scaleLinear().domain([0, yMax * 1.1]).range([height, 0]);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text(xLabel);

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text(yLabel);

    if (distribution === 'normal') {
      // Draw line for continuous distribution
      const line = d3.line<{ x: number; y: number }>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', line);

      // Fill area under curve
      const area = d3.area<{ x: number; y: number }>()
        .x((d) => xScale(d.x))
        .y0(height)
        .y1((d) => yScale(d.y))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.2)
        .attr('d', area);
    } else {
      // Draw bars for discrete distribution
      const barWidth = width / data.length * 0.8;

      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => xScale(d.x) - barWidth / 2)
        .attr('y', (d) => yScale(d.y))
        .attr('width', barWidth)
        .attr('height', (d) => height - yScale(d.y))
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.7);
    }

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

  }, [distribution, mean, stdDev, trials, probability, lambda]);

  const getStatistics = () => {
    if (distribution === 'normal') {
      return {
        mean: mean.toFixed(2),
        variance: (stdDev ** 2).toFixed(2),
        stdDev: stdDev.toFixed(2),
      };
    } else if (distribution === 'binomial') {
      return {
        mean: (trials * probability).toFixed(2),
        variance: (trials * probability * (1 - probability)).toFixed(2),
        stdDev: Math.sqrt(trials * probability * (1 - probability)).toFixed(2),
      };
    } else {
      return {
        mean: lambda.toFixed(2),
        variance: lambda.toFixed(2),
        stdDev: Math.sqrt(lambda).toFixed(2),
      };
    }
  };

  const stats = getStatistics();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Probability Distribution Plotter
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
            <svg
              ref={svgRef}
              width="100%"
              height="300"
              viewBox="0 0 600 300"
              className="text-gray-600 dark:text-gray-300"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {distribution === 'normal' && 'Normal Distribution'}
              {distribution === 'binomial' && 'Binomial Distribution'}
              {distribution === 'poisson' && 'Poisson Distribution'}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {distribution === 'normal' &&
                `X ~ N(μ=${mean}, σ²=${(stdDev ** 2).toFixed(2)})`}
              {distribution === 'binomial' &&
                `X ~ Bin(n=${trials}, p=${probability.toFixed(2)})`}
              {distribution === 'poisson' && `X ~ Pois(λ=${lambda})`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Distribution">
            <select
              value={distribution}
              onChange={(e) => setDistribution(e.target.value as Distribution)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="binomial">Binomial</option>
              <option value="poisson">Poisson</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            {distribution === 'normal' && (
              <>
                <Slider
                  label="Mean (μ)"
                  value={mean}
                  onChange={(e) => setMean(Number(e.target.value))}
                  min={-5}
                  max={5}
                  step={0.1}
                />
                <Slider
                  label="Std Dev (σ)"
                  value={stdDev}
                  onChange={(e) => setStdDev(Number(e.target.value))}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
              </>
            )}

            {distribution === 'binomial' && (
              <>
                <Slider
                  label="Trials (n)"
                  value={trials}
                  onChange={(e) => setTrials(Number(e.target.value))}
                  min={1}
                  max={50}
                />
                <Slider
                  label="Probability (p)"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  min={0.01}
                  max={0.99}
                  step={0.01}
                />
              </>
            )}

            {distribution === 'poisson' && (
              <Slider
                label="Lambda (λ)"
                value={lambda}
                onChange={(e) => setLambda(Number(e.target.value))}
                min={0.1}
                max={20}
                step={0.1}
              />
            )}
          </ControlPanel>

          <ControlPanel title="Statistics">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mean:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.mean}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Variance:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.variance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Std Dev:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.stdDev}</span>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
