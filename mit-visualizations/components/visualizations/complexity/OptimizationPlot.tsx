'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

type OptimizationType = 'gradient' | 'newton' | 'annealing';

interface Point {
  x: number;
  y: number;
  fx: number;
}

export default function OptimizationPlot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [optimizationType, setOptimizationType] = useState<OptimizationType>('gradient');
  const [running, setRunning] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);
  const [temperature, setTemperature] = useState(100);
  const [path, setPath] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [iteration, setIteration] = useState(0);
  const runningRef = useRef(false);

  // Function to optimize: f(x) = x^4 - 3x^3 + 2x (has local and global minima)
  const f = (x: number): number => {
    return Math.pow(x, 4) - 3 * Math.pow(x, 3) + 2 * x;
  };

  // Derivative: f'(x) = 4x^3 - 9x^2 + 2
  const fPrime = (x: number): number => {
    return 4 * Math.pow(x, 3) - 9 * Math.pow(x, 2) + 2;
  };

  // Second derivative: f''(x) = 12x^2 - 18x
  const fDoublePrime = (x: number): number => {
    return 12 * Math.pow(x, 2) - 18 * x;
  };

  const drawVisualization = useCallback(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate function data
    const xDomain: [number, number] = [-1, 3.5];
    const data: { x: number; y: number }[] = [];
    for (let x = xDomain[0]; x <= xDomain[1]; x += 0.02) {
      data.push({ x, y: f(x) });
    }

    const yMin = d3.min(data, (d) => d.y) || -5;
    const yMax = d3.max(data, (d) => d.y) || 5;

    const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
    const yScale = d3.scaleLinear().domain([yMin - 1, yMax + 1]).range([height, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('x');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('f(x)');

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Function curve
    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Optimization path
    if (path.length > 1) {
      const pathLine = d3
        .line<Point>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.fx));

      g.append('path')
        .datum(path)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('d', pathLine);

      // Path points
      g.selectAll('.path-point')
        .data(path)
        .join('circle')
        .attr('class', 'path-point')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.fx))
        .attr('r', 3)
        .attr('fill', '#ef4444')
        .attr('opacity', 0.5);
    }

    // Current point
    if (currentPoint) {
      g.append('circle')
        .attr('cx', xScale(currentPoint.x))
        .attr('cy', yScale(currentPoint.fx))
        .attr('r', 8)
        .attr('fill', '#22c55e')
        .attr('stroke', '#166534')
        .attr('stroke-width', 2);

      // Tangent line for gradient descent
      if (optimizationType === 'gradient' || optimizationType === 'newton') {
        const slope = fPrime(currentPoint.x);
        const x1 = currentPoint.x - 0.5;
        const x2 = currentPoint.x + 0.5;
        const y1 = currentPoint.fx + slope * (x1 - currentPoint.x);
        const y2 = currentPoint.fx + slope * (x2 - currentPoint.x);

        g.append('line')
          .attr('x1', xScale(x1))
          .attr('y1', yScale(y1))
          .attr('x2', xScale(x2))
          .attr('y2', yScale(y2))
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '3,3');
      }
    }

  }, [path, currentPoint, optimizationType]);

  useEffect(() => {
    drawVisualization();
  }, [drawVisualization]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runOptimization = async () => {
    setRunning(true);
    runningRef.current = true;
    setPath([]);
    setIteration(0);

    // Random starting point
    let x = Math.random() * 3 - 0.5;
    let newPath: Point[] = [];

    const maxIterations = 100;

    for (let i = 0; i < maxIterations && runningRef.current; i++) {
      const fx = f(x);
      const point: Point = { x, y: 0, fx };
      newPath.push(point);
      setPath([...newPath]);
      setCurrentPoint(point);
      setIteration(i + 1);

      await sleep(100);

      // Check convergence
      if (Math.abs(fPrime(x)) < 0.001 && i > 5) break;

      // Update step based on optimization type
      switch (optimizationType) {
        case 'gradient':
          x = x - learningRate * fPrime(x);
          break;
        case 'newton':
          const secondDeriv = fDoublePrime(x);
          if (Math.abs(secondDeriv) > 0.01) {
            x = x - fPrime(x) / secondDeriv;
          } else {
            x = x - learningRate * fPrime(x);
          }
          break;
        case 'annealing':
          const currentTemp = temperature * Math.pow(0.95, i);
          const delta = (Math.random() - 0.5) * 2;
          const newX = x + delta;
          const newFx = f(newX);
          const deltaE = newFx - fx;

          if (deltaE < 0 || Math.random() < Math.exp(-deltaE / currentTemp)) {
            x = newX;
          }
          break;
      }

      // Clamp to domain
      x = Math.max(-1, Math.min(3.5, x));
    }

    setRunning(false);
    runningRef.current = false;
  };

  const stopOptimization = () => {
    runningRef.current = false;
    setRunning(false);
  };

  const reset = () => {
    stopOptimization();
    setPath([]);
    setCurrentPoint(null);
    setIteration(0);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Optimization Algorithm Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4">
            <svg
              ref={svgRef}
              width="100%"
              height="350"
              viewBox="0 0 600 350"
              className="text-content-secondary"
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Function
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
              f(x) = x⁴ - 3x³ + 2x
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              This function has multiple local minima - watch how different algorithms find them!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Algorithm">
            <select
              value={optimizationType}
              onChange={(e) => setOptimizationType(e.target.value as OptimizationType)}
              disabled={running}
              className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
            >
              <option value="gradient">Gradient Descent</option>
              <option value="newton">Newton&apos;s Method</option>
              <option value="annealing">Simulated Annealing</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            {(optimizationType === 'gradient' || optimizationType === 'newton') && (
              <Slider
                label="Learning Rate"
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                min={0.01}
                max={0.5}
                step={0.01}
                disabled={running}
              />
            )}
            {optimizationType === 'annealing' && (
              <Slider
                label="Initial Temperature"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                min={10}
                max={500}
                step={10}
                disabled={running}
              />
            )}
          </ControlPanel>

          <ControlPanel title="Controls">
            <div className="flex flex-col space-y-2">
              {running ? (
                <Button onClick={stopOptimization} variant="primary">
                  Stop
                </Button>
              ) : (
                <Button onClick={runOptimization} variant="primary">
                  Run Optimization
                </Button>
              )}
              <Button onClick={reset} disabled={running} variant="secondary">
                Reset
              </Button>
            </div>
          </ControlPanel>

          <ControlPanel title="Status">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-content-tertiary">Iteration:</span>
                <span className="font-medium text-content-primary">{iteration}</span>
              </div>
              {currentPoint && (
                <>
                  <div className="flex justify-between">
                    <span className="text-content-tertiary">Current x:</span>
                    <span className="font-medium text-content-primary">
                      {currentPoint.x.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-tertiary">f(x):</span>
                    <span className="font-medium text-green-600">
                      {currentPoint.fx.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-content-tertiary">f&apos;(x):</span>
                    <span className="font-medium text-orange-600">
                      {fPrime(currentPoint.x).toFixed(4)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </ControlPanel>

          <ControlPanel title="Legend">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-500 rounded" />
                <span className="text-content-secondary">Function</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-content-secondary">Current point</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-red-500 rounded" style={{ borderStyle: 'dashed' }} />
                <span className="text-content-secondary">Path</span>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
