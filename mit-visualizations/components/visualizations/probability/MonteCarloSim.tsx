'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

interface Point {
  x: number;
  y: number;
  inside: boolean;
}

export default function MonteCarloSim() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [sampleSize, setSampleSize] = useState(1000);
  const [speed, setSpeed] = useState(50);
  const [running, setRunning] = useState(false);
  const [piEstimate, setPiEstimate] = useState(0);
  const [insideCount, setInsideCount] = useState(0);
  const runningRef = useRef(false);

  const drawVisualization = useCallback(() => {
    if (!svgRef.current) return;

    const size = 400;
    const padding = 10;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${padding}, ${padding})`);

    // Draw square
    g.append('rect')
      .attr('width', size - 2 * padding)
      .attr('height', size - 2 * padding)
      .attr('fill', '#f3f4f6')
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    // Draw circle (quarter circle scaled to full view)
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', size - 2 * padding)
      .attr('r', size - 2 * padding)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Draw points
    const scale = size - 2 * padding;

    points.forEach((point) => {
      g.append('circle')
        .attr('cx', point.x * scale)
        .attr('cy', (1 - point.y) * scale)
        .attr('r', 2)
        .attr('fill', point.inside ? '#22c55e' : '#ef4444')
        .attr('opacity', 0.6);
    });

  }, [points]);

  useEffect(() => {
    drawVisualization();
  }, [drawVisualization]);

  const isInsideCircle = (x: number, y: number): boolean => {
    return x * x + y * y <= 1;
  };

  const runSimulation = async () => {
    setRunning(true);
    runningRef.current = true;
    setPoints([]);
    setInsideCount(0);
    setPiEstimate(0);

    const newPoints: Point[] = [];
    let inside = 0;
    const batchSize = Math.max(1, Math.floor(sampleSize / 100));
    const delay = Math.max(1, 101 - speed);

    for (let i = 0; i < sampleSize && runningRef.current; i += batchSize) {
      const batch: Point[] = [];
      for (let j = 0; j < batchSize && i + j < sampleSize; j++) {
        const x = Math.random();
        const y = Math.random();
        const isInside = isInsideCircle(x, y);
        if (isInside) inside++;
        batch.push({ x, y, inside: isInside });
      }

      newPoints.push(...batch);
      setPoints([...newPoints]);
      setInsideCount(inside);
      setPiEstimate((4 * inside) / newPoints.length);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setRunning(false);
    runningRef.current = false;
  };

  const stopSimulation = () => {
    runningRef.current = false;
    setRunning(false);
  };

  const reset = () => {
    stopSimulation();
    setPoints([]);
    setInsideCount(0);
    setPiEstimate(0);
  };

  const error = piEstimate > 0 ? Math.abs(piEstimate - Math.PI) : 0;
  const errorPercent = piEstimate > 0 ? ((error / Math.PI) * 100).toFixed(3) : '0';

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Monte Carlo Pi Estimation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 flex justify-center">
            <svg ref={svgRef} width="400" height="400" viewBox="0 0 400 400" />
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              How it works
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Random points are placed in a unit square. The ratio of points inside the quarter
              circle (distance from origin ≤ 1) to total points approximates π/4.
              Multiply by 4 to estimate π.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Controls">
            <Slider
              label="Sample Size"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              min={100}
              max={10000}
              step={100}
              disabled={running}
            />

            <Slider
              label="Speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              min={1}
              max={100}
            />

            <div className="flex flex-col space-y-2">
              {running ? (
                <Button onClick={stopSimulation} variant="primary">
                  Stop
                </Button>
              ) : (
                <Button onClick={runSimulation} variant="primary">
                  Run Simulation
                </Button>
              )}
              <Button onClick={reset} disabled={running} variant="secondary">
                Reset
              </Button>
            </div>
          </ControlPanel>

          <ControlPanel title="Results">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Points:</span>
                <span className="font-medium text-gray-900 dark:text-white">{points.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Inside circle:</span>
                <span className="font-medium text-green-600">{insideCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Outside circle:</span>
                <span className="font-medium text-red-600">{points.length - insideCount}</span>
              </div>
              <hr className="border-gray-200 dark:border-slate-600" />
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">π estimate:</span>
                <span className="font-bold text-blue-600 text-lg">
                  {piEstimate.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Actual π:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.PI.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Error:</span>
                <span className="font-medium text-orange-600">{errorPercent}%</span>
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="Legend">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600 dark:text-gray-300">Inside</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-gray-600 dark:text-gray-300">Outside</span>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
