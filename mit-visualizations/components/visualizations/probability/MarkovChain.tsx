'use client';

/**
 * Markov Chain Visualizer
 * ========================
 * Interactive visualization of discrete-time Markov chains with
 * state diagrams, transition matrix, and stationary distribution.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

interface State {
  id: number;
  name: string;
  x: number;
  y: number;
}

export default function MarkovChain() {
  const diagramRef = useRef<SVGSVGElement>(null);
  const histogramRef = useRef<SVGSVGElement>(null);

  // 3-state Markov chain
  const [p00, setP00] = useState(0.7); // P(0→0)
  const [p01, setP01] = useState(0.2); // P(0→1)
  const [p11, setP11] = useState(0.5); // P(1→1)
  const [p12, setP12] = useState(0.3); // P(1→2)
  const [p22, setP22] = useState(0.4); // P(2→2)
  const [p20, setP20] = useState(0.4); // P(2→0)

  const [currentState, setCurrentState] = useState(0);
  const [stateHistory, setStateHistory] = useState<number[]>([0]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Derived probabilities (rows must sum to 1)
  const transitionMatrix = useMemo(() => {
    const p02 = Math.max(0, 1 - p00 - p01);
    const p10 = Math.max(0, 1 - p11 - p12);
    const p21 = Math.max(0, 1 - p22 - p20);

    return [
      [p00, p01, p02],
      [p10, p11, p12],
      [p20, p21, p22],
    ];
  }, [p00, p01, p11, p12, p22, p20]);

  // Calculate stationary distribution (solve π = πP)
  const stationaryDist = useMemo(() => {
    // For a 3x3 matrix, solve the system:
    // π0 = π0*p00 + π1*p10 + π2*p20
    // π1 = π0*p01 + π1*p11 + π2*p21
    // π0 + π1 + π2 = 1

    // Using matrix method: (P^T - I)π = 0 with normalization
    const P = transitionMatrix;

    // Power iteration method for simplicity
    let pi = [1 / 3, 1 / 3, 1 / 3];
    for (let iter = 0; iter < 100; iter++) {
      const newPi = [0, 0, 0];
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
          newPi[j] += pi[i] * P[i][j];
        }
      }
      pi = newPi;
    }

    return pi;
  }, [transitionMatrix]);

  // State visit frequencies
  const visitFrequencies = useMemo(() => {
    const counts = [0, 0, 0];
    stateHistory.forEach((s) => counts[s]++);
    const total = stateHistory.length;
    return counts.map((c) => c / total);
  }, [stateHistory]);

  // Take a single step
  const step = useCallback(() => {
    const probs = transitionMatrix[currentState];
    const rand = Math.random();
    let cumulative = 0;
    let nextState = 0;

    for (let i = 0; i < probs.length; i++) {
      cumulative += probs[i];
      if (rand < cumulative) {
        nextState = i;
        break;
      }
    }

    setCurrentState(nextState);
    setStateHistory((prev) => [...prev, nextState]);
  }, [currentState, transitionMatrix]);

  // Run simulation
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(step, speed);
    return () => clearInterval(interval);
  }, [isRunning, step, speed]);

  // Reset
  const reset = () => {
    setIsRunning(false);
    setCurrentState(0);
    setStateHistory([0]);
  };

  // State positions for diagram
  const states: State[] = [
    { id: 0, name: 'S₀', x: 100, y: 100 },
    { id: 1, name: 'S₁', x: 250, y: 200 },
    { id: 2, name: 'S₂', x: 100, y: 200 },
  ];

  // Draw state diagram
  useEffect(() => {
    if (!diagramRef.current) return;

    const svg = d3.select(diagramRef.current);
    svg.selectAll('*').remove();

    const width = 350;
    const height = 280;

    // Arrow marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#78716c');

    // Draw edges (transitions)
    const drawEdge = (from: State, to: State, prob: number, curved: boolean = false) => {
      if (prob <= 0.001) return;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (from.id === to.id) {
        // Self loop
        const loopRadius = 25;
        const cx = from.x + (from.id === 1 ? 30 : -30);
        const cy = from.y + (from.id === 2 ? 30 : -30);

        svg.append('path')
          .attr('d', `M ${from.x + 15} ${from.y - 10} A ${loopRadius} ${loopRadius} 0 1 1 ${from.x - 10} ${from.y + 15}`)
          .attr('fill', 'none')
          .attr('stroke', currentState === from.id ? '#d97706' : '#a8a29e')
          .attr('stroke-width', currentState === from.id ? 2.5 : 1.5)
          .attr('marker-end', 'url(#arrowhead)');

        svg.append('text')
          .attr('x', cx)
          .attr('y', cy)
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('font-weight', '500')
          .attr('class', 'fill-current text-content-secondary')
          .text(prob.toFixed(2));
      } else {
        // Regular edge
        const offset = curved ? 15 : 0;
        const midX = (from.x + to.x) / 2 + (curved ? offset * (dy / dist) : 0);
        const midY = (from.y + to.y) / 2 + (curved ? -offset * (dx / dist) : 0);

        const path = curved
          ? `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
          : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

        svg.append('path')
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke', currentState === from.id ? '#d97706' : '#a8a29e')
          .attr('stroke-width', currentState === from.id ? 2.5 : 1.5)
          .attr('marker-end', 'url(#arrowhead)');

        svg.append('text')
          .attr('x', midX + (curved ? 10 : 0))
          .attr('y', midY + (curved ? 0 : -8))
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('font-weight', '500')
          .attr('class', 'fill-current text-content-secondary')
          .text(prob.toFixed(2));
      }
    };

    // Draw all edges
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const needsCurve = (i === 0 && j === 1) || (i === 1 && j === 0);
        drawEdge(states[i], states[j], transitionMatrix[i][j], needsCurve);
      }
    }

    // Draw state nodes
    states.forEach((state) => {
      const isActive = currentState === state.id;

      // Glow for active state
      if (isActive) {
        svg.append('circle')
          .attr('cx', state.x)
          .attr('cy', state.y)
          .attr('r', 28)
          .attr('fill', 'rgba(217, 119, 6, 0.3)');
      }

      svg.append('circle')
        .attr('cx', state.x)
        .attr('cy', state.y)
        .attr('r', 22)
        .attr('fill', isActive ? '#d97706' : '#f5f5f4')
        .attr('stroke', isActive ? '#b45309' : '#d6d3d1')
        .attr('stroke-width', 2);

      svg.append('text')
        .attr('x', state.x)
        .attr('y', state.y + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('fill', isActive ? 'white' : '#1c1917')
        .text(state.name);
    });

  }, [transitionMatrix, currentState, states]);

  // Draw frequency histogram
  useEffect(() => {
    if (!histogramRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 200 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    const svg = d3.select(histogramRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(['S₀', 'S₁', 'S₂'])
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Bars for observed frequencies
    visitFrequencies.forEach((freq, i) => {
      g.append('rect')
        .attr('x', xScale(['S₀', 'S₁', 'S₂'][i]) || 0)
        .attr('y', yScale(freq))
        .attr('width', xScale.bandwidth() / 2 - 2)
        .attr('height', height - yScale(freq))
        .attr('fill', '#d97706')
        .attr('fill-opacity', 0.7)
        .attr('rx', 2);
    });

    // Bars for stationary distribution
    stationaryDist.forEach((prob, i) => {
      g.append('rect')
        .attr('x', (xScale(['S₀', 'S₁', 'S₂'][i]) || 0) + xScale.bandwidth() / 2)
        .attr('y', yScale(prob))
        .attr('width', xScale.bandwidth() / 2 - 2)
        .attr('height', height - yScale(prob))
        .attr('fill', '#3b82f6')
        .attr('fill-opacity', 0.7)
        .attr('rx', 2);
    });

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    // Y axis
    g.append('g').call(d3.axisLeft(yScale).ticks(4));

    // Legend
    const legend = g.append('g').attr('transform', `translate(${width - 60}, -15)`);

    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 10).attr('height', 10).attr('fill', '#d97706');
    legend.append('text').attr('x', 15).attr('y', 9).attr('font-size', '9px').attr('class', 'fill-current text-content-muted').text('Observed');

    legend.append('rect').attr('x', 0).attr('y', 15).attr('width', 10).attr('height', 10).attr('fill', '#3b82f6');
    legend.append('text').attr('x', 15).attr('y', 24).attr('font-size', '9px').attr('class', 'fill-current text-content-muted').text('Stationary');

  }, [visitFrequencies, stationaryDist]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Markov Chain Simulator
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Visualize state transitions and convergence to stationary distribution
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Diagram */}
            <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
              <h3 className="text-sm font-semibold text-content-primary mb-2">State Transition Diagram</h3>
              <svg ref={diagramRef} width="100%" height="280" viewBox="0 0 350 280" />
            </div>

            {/* Frequency Comparison */}
            <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
              <h3 className="text-sm font-semibold text-content-primary mb-2">
                Frequency vs Stationary Distribution
              </h3>
              <svg ref={histogramRef} width="200" height="150" />

              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="font-medium text-content-muted">State</div>
                  <div className="font-medium text-content-muted">Observed</div>
                  <div className="font-medium text-content-muted">Stationary π</div>
                  <div className="font-medium text-content-muted">|Error|</div>
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 text-xs">
                    <div className="font-medium text-content-primary">S{i}</div>
                    <div className="font-mono text-brand-600 dark:text-brand-400">{visitFrequencies[i].toFixed(3)}</div>
                    <div className="font-mono text-blue-600 dark:text-blue-400">{stationaryDist[i].toFixed(3)}</div>
                    <div className="font-mono text-content-muted">
                      {Math.abs(visitFrequencies[i] - stationaryDist[i]).toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transition Matrix Display */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h3 className="text-sm font-semibold text-content-primary mb-3">
              Transition Matrix <LaTeX math="P" />
            </h3>
            <div className="flex justify-center">
              <div className="inline-block">
                <table className="text-sm">
                  <thead>
                    <tr>
                      <th className="w-12"></th>
                      <th className="w-16 text-center text-content-muted font-medium">S₀</th>
                      <th className="w-16 text-center text-content-muted font-medium">S₁</th>
                      <th className="w-16 text-center text-content-muted font-medium">S₂</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transitionMatrix.map((row, i) => (
                      <tr key={i}>
                        <td className="text-content-muted font-medium">S{i}</td>
                        {row.map((p, j) => (
                          <td
                            key={j}
                            className={`text-center font-mono py-1 ${
                              i === currentState
                                ? 'text-brand-600 dark:text-brand-400 font-semibold'
                                : 'text-content-primary'
                            }`}
                          >
                            {p.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Steps Counter */}
          <div className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-brand-200 dark:border-brand-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-content-secondary">Current State: </span>
                <span className="font-bold text-brand-600 dark:text-brand-400 text-lg">S{currentState}</span>
              </div>
              <div>
                <span className="text-sm text-content-secondary">Steps: </span>
                <span className="font-bold text-content-primary text-lg">{stateHistory.length - 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Simulation">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-3 py-2 rounded-xl font-medium text-sm transition-colors ${
                  isRunning
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {isRunning ? 'Pause' : 'Run'}
              </button>
              <button
                onClick={step}
                disabled={isRunning}
                className="px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                Step
              </button>
            </div>
            <button
              onClick={reset}
              className="w-full px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors"
            >
              Reset
            </button>

            <div className="mt-4">
              <Slider
                label="Speed (ms)"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                min={100}
                max={1000}
                step={100}
              />
            </div>
          </ControlPanel>

          <ControlPanel title="Transition Probabilities">
            <Slider label="P(0→0)" value={p00} onChange={(e) => setP00(Number(e.target.value))} min={0} max={0.95} step={0.05} />
            <Slider label="P(0→1)" value={p01} onChange={(e) => setP01(Number(e.target.value))} min={0} max={1 - p00} step={0.05} />
            <Slider label="P(1→1)" value={p11} onChange={(e) => setP11(Number(e.target.value))} min={0} max={0.95} step={0.05} />
            <Slider label="P(1→2)" value={p12} onChange={(e) => setP12(Number(e.target.value))} min={0} max={1 - p11} step={0.05} />
            <Slider label="P(2→2)" value={p22} onChange={(e) => setP22(Number(e.target.value))} min={0} max={0.95} step={0.05} />
            <Slider label="P(2→0)" value={p20} onChange={(e) => setP20(Number(e.target.value))} min={0} max={1 - p22} step={0.05} />
          </ControlPanel>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Ergodic Theorem
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed mb-2">
              For an irreducible, aperiodic Markov chain, the long-run frequency converges to the stationary distribution <LaTeX math="\pi" />.
            </p>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              <LaTeX math="\pi = \pi P" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
