'use client';

/**
 * Martingale Visualizer
 * ======================
 * Interactive visualization of martingales, random walks,
 * gambler's ruin, and the optional stopping theorem.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type VisualizationMode = 'random-walk' | 'gamblers-ruin' | 'stopping-time';

interface WalkPath {
  time: number;
  value: number;
}

export default function MartingaleVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [mode, setMode] = useState<VisualizationMode>('random-walk');
  const [p, setP] = useState(0.5); // Probability of +1
  const [numSteps, setNumSteps] = useState(100);
  const [numPaths, setNumPaths] = useState(10);
  const [paths, setPaths] = useState<WalkPath[][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Gambler's ruin parameters
  const [initialWealth, setInitialWealth] = useState(50);
  const [targetWealth, setTargetWealth] = useState(100);

  // Stopping time parameters
  const [stoppingBound, setStoppingBound] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    meanFinal: 0,
    ruinProb: 0,
    avgStoppingTime: 0,
    reachedTarget: 0,
    reachedRuin: 0,
  });

  // Generate random walk path
  const generatePath = useCallback((steps: number, startValue: number = 0): WalkPath[] => {
    const path: WalkPath[] = [{ time: 0, value: startValue }];
    let value = startValue;

    for (let t = 1; t <= steps; t++) {
      value += Math.random() < p ? 1 : -1;
      path.push({ time: t, value });
    }

    return path;
  }, [p]);

  // Generate gambler's ruin path
  const generateGamblersRuinPath = useCallback((): WalkPath[] => {
    const path: WalkPath[] = [{ time: 0, value: initialWealth }];
    let value = initialWealth;
    let t = 0;

    while (value > 0 && value < targetWealth && t < 10000) {
      t++;
      value += Math.random() < p ? 1 : -1;
      path.push({ time: t, value });
    }

    return path;
  }, [p, initialWealth, targetWealth]);

  // Generate stopping time path
  const generateStoppingTimePath = useCallback((): WalkPath[] => {
    const path: WalkPath[] = [{ time: 0, value: 0 }];
    let value = 0;
    let t = 0;

    while (Math.abs(value) < stoppingBound && t < 5000) {
      t++;
      value += Math.random() < p ? 1 : -1;
      path.push({ time: t, value });
    }

    return path;
  }, [p, stoppingBound]);

  // Run simulation
  const runSimulation = useCallback(() => {
    setIsRunning(true);
    let newPaths: WalkPath[][] = [];

    if (mode === 'random-walk') {
      for (let i = 0; i < numPaths; i++) {
        newPaths.push(generatePath(numSteps));
      }
      const finalValues = newPaths.map(path => path[path.length - 1].value);
      setStats({
        ...stats,
        meanFinal: finalValues.reduce((a, b) => a + b, 0) / numPaths,
      });
    } else if (mode === 'gamblers-ruin') {
      let ruinCount = 0;
      let targetCount = 0;
      let totalSteps = 0;

      for (let i = 0; i < numPaths; i++) {
        const path = generateGamblersRuinPath();
        newPaths.push(path);
        totalSteps += path.length - 1;

        const finalValue = path[path.length - 1].value;
        if (finalValue <= 0) ruinCount++;
        if (finalValue >= targetWealth) targetCount++;
      }

      setStats({
        ...stats,
        ruinProb: ruinCount / numPaths,
        reachedTarget: targetCount / numPaths,
        reachedRuin: ruinCount / numPaths,
        avgStoppingTime: totalSteps / numPaths,
      });
    } else if (mode === 'stopping-time') {
      let totalSteps = 0;
      let totalSquared = 0;

      for (let i = 0; i < numPaths; i++) {
        const path = generateStoppingTimePath();
        newPaths.push(path);
        const T = path.length - 1;
        totalSteps += T;
        totalSquared += path[path.length - 1].value ** 2;
      }

      setStats({
        ...stats,
        avgStoppingTime: totalSteps / numPaths,
        meanFinal: totalSquared / numPaths,
      });
    }

    setPaths(newPaths);
    setIsRunning(false);
  }, [mode, numPaths, numSteps, generatePath, generateGamblersRuinPath, generateStoppingTimePath, targetWealth, stats]);

  // Reset
  const reset = () => {
    setPaths([]);
    setStats({
      meanFinal: 0,
      ruinProb: 0,
      avgStoppingTime: 0,
      reachedTarget: 0,
      reachedRuin: 0,
    });
  };

  // Draw visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Determine scales
    let xMax = numSteps;
    let yMin = -numSteps / 2;
    let yMax = numSteps / 2;

    if (mode === 'gamblers-ruin') {
      xMax = paths.length > 0 ? Math.max(...paths.map(p => p.length)) : 500;
      yMin = 0;
      yMax = targetWealth;
    } else if (mode === 'stopping-time') {
      xMax = paths.length > 0 ? Math.max(...paths.map(p => p.length)) : 500;
      yMin = -stoppingBound - 5;
      yMax = stoppingBound + 5;
    }

    if (paths.length > 0) {
      const allValues = paths.flatMap(p => p.map(pt => pt.value));
      yMin = Math.min(yMin, d3.min(allValues) || yMin) - 5;
      yMax = Math.max(yMax, d3.max(allValues) || yMax) + 5;
    }

    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Zero line (or boundaries)
    if (mode === 'random-walk') {
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(0))
        .attr('x2', width)
        .attr('y2', yScale(0))
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5');
    } else if (mode === 'gamblers-ruin') {
      // Ruin line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(0))
        .attr('x2', width)
        .attr('y2', yScale(0))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', 5)
        .attr('y', yScale(0) + 15)
        .attr('class', 'text-xs fill-current text-red-600')
        .text('Ruin (0)');

      // Target line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(targetWealth))
        .attr('x2', width)
        .attr('y2', yScale(targetWealth))
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', 5)
        .attr('y', yScale(targetWealth) - 5)
        .attr('class', 'text-xs fill-current text-emerald-600')
        .text(`Target (${targetWealth})`);

      // Initial wealth line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(initialWealth))
        .attr('x2', width)
        .attr('y2', yScale(initialWealth))
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    } else if (mode === 'stopping-time') {
      // Stopping boundaries
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(stoppingBound))
        .attr('x2', width)
        .attr('y2', yScale(stoppingBound))
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2);

      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(-stoppingBound))
        .attr('x2', width)
        .attr('y2', yScale(-stoppingBound))
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', width - 5)
        .attr('y', yScale(stoppingBound) - 5)
        .attr('text-anchor', 'end')
        .attr('class', 'text-xs fill-current text-amber-600')
        .text(`+${stoppingBound}`);

      g.append('text')
        .attr('x', width - 5)
        .attr('y', yScale(-stoppingBound) + 15)
        .attr('text-anchor', 'end')
        .attr('class', 'text-xs fill-current text-amber-600')
        .text(`-${stoppingBound}`);

      // Zero line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(0))
        .attr('x2', width)
        .attr('y2', yScale(0))
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    }

    // Draw paths
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const line = d3.line<WalkPath>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value));

    paths.forEach((path, i) => {
      g.append('path')
        .datum(path)
        .attr('fill', 'none')
        .attr('stroke', colorScale(i.toString()))
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.7)
        .attr('d', line);

      // End point marker
      const endPoint = path[path.length - 1];
      g.append('circle')
        .attr('cx', xScale(endPoint.time))
        .attr('cy', yScale(endPoint.value))
        .attr('r', 4)
        .attr('fill', colorScale(i.toString()));
    });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10));

    g.append('g').call(d3.axisLeft(yScale).ticks(10));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Time (n)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text(mode === 'gamblers-ruin' ? 'Wealth' : 'Position Sₙ');

    // Title
    const titles = {
      'random-walk': 'Simple Random Walk (Martingale)',
      'gamblers-ruin': "Gambler's Ruin Problem",
      'stopping-time': 'Optional Stopping Theorem',
    };

    g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-content-primary')
      .text(titles[mode]);

  }, [paths, mode, numSteps, targetWealth, initialWealth, stoppingBound]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Martingales & Stopping Times
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore random walks, the gambler's ruin problem, and the optional stopping theorem
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg ref={svgRef} width="100%" height="350" viewBox="0 0 600 350" className="text-content-secondary" />
            {paths.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-content-muted">Click "Run Simulation" to generate sample paths</p>
              </div>
            )}
          </div>

          {/* Formula Display */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            {mode === 'random-walk' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-content-secondary">Martingale Property:</p>
                <div className="text-amber-700 dark:text-amber-400">
                  <LaTeX math="E[S_{n+1} | S_n, S_{n-1}, \ldots, S_0] = S_n" />
                </div>
                <div className="text-xs text-content-muted">
                  <LaTeX math={`S_n = \\sum_{i=1}^{n} X_i, \\quad X_i = \\pm 1 \\text{ with } P(+1) = ${p.toFixed(2)}`} />
                </div>
              </div>
            )}
            {mode === 'gamblers-ruin' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-content-secondary">Ruin Probability (fair game):</p>
                <div className="text-amber-700 dark:text-amber-400">
                  <LaTeX math={`P(\\text{ruin}) = 1 - \\frac{a}{b} = 1 - \\frac{${initialWealth}}{${targetWealth}} = ${(1 - initialWealth/targetWealth).toFixed(3)}`} />
                </div>
                <div className="text-xs text-content-muted">
                  <LaTeX math="E[S_T] = S_0 = a \quad \text{(by OST)}" />
                </div>
              </div>
            )}
            {mode === 'stopping-time' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-content-secondary">Optional Stopping Theorem:</p>
                <div className="text-amber-700 dark:text-amber-400">
                  <LaTeX math={`E[T] = a^2 = ${stoppingBound}^2 = ${stoppingBound ** 2}`} />
                </div>
                <div className="text-xs text-content-muted">
                  <LaTeX math="T = \min\{n : |S_n| = a\}, \quad E[S_T^2 - T] = 0" />
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {paths.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mode === 'random-walk' && (
                <>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted"># Paths</div>
                    <div className="text-lg font-bold text-brand-600">{numPaths}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Mean Final Value</div>
                    <div className="text-lg font-bold text-brand-600">{stats.meanFinal.toFixed(2)}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Expected (Theory)</div>
                    <div className="text-lg font-bold text-emerald-600">{((2*p - 1) * numSteps).toFixed(2)}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Fair Game?</div>
                    <div className="text-lg font-bold text-content-primary">{p === 0.5 ? 'Yes' : 'No'}</div>
                  </div>
                </>
              )}
              {mode === 'gamblers-ruin' && (
                <>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Observed Ruin %</div>
                    <div className="text-lg font-bold text-red-600">{(stats.reachedRuin * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Theory Ruin %</div>
                    <div className="text-lg font-bold text-red-500">{((1 - initialWealth/targetWealth) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Reached Target %</div>
                    <div className="text-lg font-bold text-emerald-600">{(stats.reachedTarget * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Avg Steps</div>
                    <div className="text-lg font-bold text-brand-600">{stats.avgStoppingTime.toFixed(0)}</div>
                  </div>
                </>
              )}
              {mode === 'stopping-time' && (
                <>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Observed <LaTeX math="E[T]" /></div>
                    <div className="text-lg font-bold text-brand-600">{stats.avgStoppingTime.toFixed(1)}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Theory <LaTeX math="E[T] = a^2" /></div>
                    <div className="text-lg font-bold text-emerald-600">{stoppingBound ** 2}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Observed <LaTeX math="E[S_T^2]" /></div>
                    <div className="text-lg font-bold text-amber-600">{stats.meanFinal.toFixed(1)}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                    <div className="text-xs text-content-muted">Theory <LaTeX math="E[S_T^2]" /></div>
                    <div className="text-lg font-bold text-amber-500">{stoppingBound ** 2}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Visualization Mode">
            <select
              value={mode}
              onChange={(e) => { setMode(e.target.value as VisualizationMode); reset(); }}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm"
            >
              <option value="random-walk">Random Walk</option>
              <option value="gamblers-ruin">Gambler's Ruin</option>
              <option value="stopping-time">Stopping Time (OST)</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            <Slider
              label="P(+1)"
              value={p}
              onChange={(e) => setP(Number(e.target.value))}
              min={0.3}
              max={0.7}
              step={0.05}
            />
            <Slider
              label="Number of Paths"
              value={numPaths}
              onChange={(e) => setNumPaths(Number(e.target.value))}
              min={1}
              max={50}
              step={1}
            />
            {mode === 'random-walk' && (
              <Slider
                label="Steps per Path"
                value={numSteps}
                onChange={(e) => setNumSteps(Number(e.target.value))}
                min={50}
                max={500}
                step={50}
              />
            )}
            {mode === 'gamblers-ruin' && (
              <>
                <Slider
                  label="Initial Wealth"
                  value={initialWealth}
                  onChange={(e) => setInitialWealth(Number(e.target.value))}
                  min={10}
                  max={90}
                  step={10}
                />
                <Slider
                  label="Target Wealth"
                  value={targetWealth}
                  onChange={(e) => setTargetWealth(Number(e.target.value))}
                  min={50}
                  max={200}
                  step={10}
                />
              </>
            )}
            {mode === 'stopping-time' && (
              <Slider
                label="Stopping Bound (a)"
                value={stoppingBound}
                onChange={(e) => setStoppingBound(Number(e.target.value))}
                min={5}
                max={30}
                step={1}
              />
            )}
          </ControlPanel>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isRunning
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-500 text-white hover:bg-brand-600'
              }`}
            >
              Run Simulation
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
              Key Insight
            </h4>
            {mode === 'random-walk' && (
              <div className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                <p>When <LaTeX math="p = 0.5" />, <LaTeX math="S_n" /> is a martingale.</p>
                <p className="mt-1"><LaTeX math="E[S_n] = 0" /> for all <LaTeX math="n" />.</p>
              </div>
            )}
            {mode === 'gamblers-ruin' && (
              <div className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                <p>By OST: <LaTeX math="E[S_T] = S_0" /></p>
                <p className="mt-1">So <LaTeX math="p \cdot b + (1-p) \cdot 0 = a" /></p>
                <p className="mt-1">Thus <LaTeX math="P(\text{win}) = a/b" /></p>
              </div>
            )}
            {mode === 'stopping-time' && (
              <div className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                <p><LaTeX math="S_n^2 - n" /> is a martingale.</p>
                <p className="mt-1">By OST: <LaTeX math="E[S_T^2 - T] = 0" /></p>
                <p className="mt-1">Since <LaTeX math="S_T = \pm a" />: <LaTeX math="E[T] = a^2" /></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
