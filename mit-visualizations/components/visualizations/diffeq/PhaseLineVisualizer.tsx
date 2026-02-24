'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

/**
 * 3Blue1Brown-style Phase Line Visualizer
 * For analyzing autonomous first-order ODEs dy/dt = f(y)
 */

type ExampleType = 'logistic' | 'bistable' | 'harvesting' | 'custom';

interface Equilibrium {
  y: number;
  stability: 'stable' | 'unstable' | 'semi-stable';
}

const EXAMPLES: Record<ExampleType, {
  name: string;
  latex: string;
  description: string;
  f: (y: number, params: number[]) => number;
  equilibria: (params: number[]) => Equilibrium[];
  paramLabels: string[];
  defaultParams: number[];
  paramRanges: [number, number][];
  yRange: [number, number];
}> = {
  logistic: {
    name: "Logistic Growth",
    latex: "dy/dt = ry(1 - y/K)",
    description: "Population with carrying capacity",
    f: (y, [r, K]) => r * y * (1 - y / K),
    equilibria: (params) => [
      { y: 0, stability: 'unstable' },
      { y: params[1], stability: 'stable' }
    ],
    paramLabels: ['r (growth rate)', 'K (capacity)'],
    defaultParams: [1, 10],
    paramRanges: [[0.1, 2], [5, 20]],
    yRange: [-2, 15],
  },
  bistable: {
    name: "Bistable System",
    latex: "dy/dt = y(1-y)(y-a)",
    description: "Two stable states with threshold",
    f: (y, [a]) => y * (1 - y) * (y - a),
    equilibria: ([a]) => [
      { y: 0, stability: 'stable' },
      { y: a, stability: 'unstable' },
      { y: 1, stability: 'stable' }
    ],
    paramLabels: ['a (threshold)'],
    defaultParams: [0.3],
    paramRanges: [[0.1, 0.9]],
    yRange: [-0.5, 1.5],
  },
  harvesting: {
    name: "Harvesting Model",
    latex: "dy/dt = ry(1-y/K) - H",
    description: "Logistic with constant harvesting",
    f: (y, [r, K, H]) => r * y * (1 - y / K) - H,
    equilibria: ([r, K, H]) => {
      const disc = r * r * K * K - 4 * r * K * H;
      if (disc < 0) return [];
      if (disc === 0) {
        return [{ y: K / 2, stability: 'semi-stable' }];
      }
      const y1 = (r * K - Math.sqrt(disc)) / (2 * r);
      const y2 = (r * K + Math.sqrt(disc)) / (2 * r);
      return [
        { y: y1, stability: 'unstable' },
        { y: y2, stability: 'stable' }
      ];
    },
    paramLabels: ['r (growth)', 'K (capacity)', 'H (harvest)'],
    defaultParams: [1, 10, 2],
    paramRanges: [[0.5, 2], [5, 20], [0, 5]],
    yRange: [-2, 15],
  },
  custom: {
    name: "Cubic",
    latex: "dy/dt = -y³ + y",
    description: "y³ - y has three equilibria",
    f: (y) => -y * y * y + y,
    equilibria: () => [
      { y: -1, stability: 'stable' },
      { y: 0, stability: 'unstable' },
      { y: 1, stability: 'stable' }
    ],
    paramLabels: [],
    defaultParams: [],
    paramRanges: [],
    yRange: [-2, 2],
  },
};

export default function PhaseLineVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [example, setExample] = useState<ExampleType>('logistic');
  const [params, setParams] = useState<number[]>(EXAMPLES.logistic.defaultParams);
  const [selectedY, setSelectedY] = useState<number | null>(null);
  const [trajectories, setTrajectories] = useState<{ y0: number; points: number[] }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState(0);

  const ex = EXAMPLES[example];

  // Change example
  useEffect(() => {
    setParams(ex.defaultParams);
    setTrajectories([]);
    setSelectedY(null);
    setTime(0);
  }, [example]);

  // Calculate equilibria
  const equilibria = ex.equilibria(params);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(t => t + dt);
      setTrajectories(prev =>
        prev.map(traj => {
          const lastY = traj.points[traj.points.length - 1];
          const dydt = ex.f(lastY, params);
          const newY = lastY + dydt * dt * 0.5;
          return {
            ...traj,
            points: [...traj.points, Math.max(ex.yRange[0], Math.min(ex.yRange[1], newY))]
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, params, ex]);

  // Draw phase line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const [yMin, yMax] = ex.yRange;
    const yScale = (y: number) => padding + ((yMax - y) / (yMax - yMin)) * (height - 2 * padding);
    const fScale = (f: number) => width / 2 + f * 50;

    // Draw f(y) curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let y = yMin; y <= yMax; y += 0.02) {
      const fVal = ex.f(y, params);
      const clampedF = Math.max(-3, Math.min(3, fVal));
      if (y === yMin) {
        ctx.moveTo(fScale(clampedF), yScale(y));
      } else {
        ctx.lineTo(fScale(clampedF), yScale(y));
      }
    }
    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    // Vertical y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, padding);
    ctx.lineTo(width / 2, height - padding);
    ctx.stroke();

    // Horizontal f(y) axis
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('f(y) > 0', width - padding - 40, height / 2 - 10);
    ctx.fillText('f(y) < 0', padding + 40, height / 2 - 10);
    ctx.fillText('y', width / 2, padding - 10);

    // Y-axis tick marks
    ctx.font = '11px system-ui';
    const yStep = (yMax - yMin) / 8;
    for (let y = yMin; y <= yMax; y += yStep) {
      ctx.fillText(y.toFixed(1), width / 2 - 25, yScale(y) + 4);
      ctx.beginPath();
      ctx.moveTo(width / 2 - 5, yScale(y));
      ctx.lineTo(width / 2 + 5, yScale(y));
      ctx.stroke();
    }

    // Draw equilibrium points
    equilibria.forEach(eq => {
      const yPos = yScale(eq.y);

      // Draw point
      ctx.beginPath();
      ctx.arc(width / 2, yPos, 10, 0, Math.PI * 2);

      if (eq.stability === 'stable') {
        ctx.fillStyle = '#22c55e';
        ctx.fill();
      } else if (eq.stability === 'unstable') {
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      }

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(`y* = ${eq.y.toFixed(2)} (${eq.stability})`, width / 2 + 20, yPos + 4);
    });

    // Draw flow arrows on phase line
    ctx.lineWidth = 2;
    const arrowSpacing = (yMax - yMin) / 20;

    for (let y = yMin + arrowSpacing / 2; y < yMax; y += arrowSpacing) {
      // Skip near equilibria
      const nearEq = equilibria.some(eq => Math.abs(eq.y - y) < arrowSpacing * 0.8);
      if (nearEq) continue;

      const fVal = ex.f(y, params);
      const yPos = yScale(y);

      if (Math.abs(fVal) < 0.01) continue;

      ctx.strokeStyle = fVal > 0 ? '#22c55e' : '#ef4444';
      ctx.beginPath();

      const arrowSize = 8;
      if (fVal > 0) {
        // Arrow pointing up
        ctx.moveTo(width / 2 - arrowSize, yPos + arrowSize);
        ctx.lineTo(width / 2, yPos - arrowSize);
        ctx.lineTo(width / 2 + arrowSize, yPos + arrowSize);
      } else {
        // Arrow pointing down
        ctx.moveTo(width / 2 - arrowSize, yPos - arrowSize);
        ctx.lineTo(width / 2, yPos + arrowSize);
        ctx.lineTo(width / 2 + arrowSize, yPos - arrowSize);
      }
      ctx.stroke();
    }

    // Draw selected point
    if (selectedY !== null) {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(width / 2, yScale(selectedY), 8, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [example, params, equilibria, selectedY, ex]);

  // Draw timeline
  useEffect(() => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const [yMin, yMax] = ex.yRange;
    const tMax = Math.max(10, time);

    const scaleT = (t: number) => padding + (t / tMax) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let t = 0; t <= tMax; t += Math.ceil(tMax / 10)) {
      ctx.beginPath();
      ctx.moveTo(scaleT(t), padding);
      ctx.lineTo(scaleT(t), height - padding);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('t', width - padding + 15, height - padding + 5);
    ctx.fillText('y(t)', padding, padding - 10);

    // Equilibrium lines
    ctx.setLineDash([5, 5]);
    equilibria.forEach(eq => {
      ctx.strokeStyle = eq.stability === 'stable' ? '#22c55e40' : '#ef444440';
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(eq.y));
      ctx.lineTo(width - padding, scaleY(eq.y));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Trajectories
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    trajectories.forEach((traj, idx) => {
      ctx.strokeStyle = colors[idx % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();

      traj.points.forEach((y, i) => {
        const t = i * 0.5 * (1 / 60); // Approximate time
        if (i === 0) {
          ctx.moveTo(scaleT(t), scaleY(y));
        } else {
          ctx.lineTo(scaleT(t * 60), scaleY(y));
        }
      });
      ctx.stroke();

      // Current point
      if (traj.points.length > 0) {
        const lastY = traj.points[traj.points.length - 1];
        ctx.fillStyle = colors[idx % colors.length];
        ctx.beginPath();
        ctx.arc(scaleT(time), scaleY(lastY), 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

  }, [trajectories, time, equilibria, ex]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const height = canvas.height;
    const padding = 60;

    const [yMin, yMax] = ex.yRange;
    const y = yMax - ((clickY - padding) / (height - 2 * padding)) * (yMax - yMin);

    if (y >= yMin && y <= yMax) {
      setSelectedY(y);
      setTrajectories(prev => [...prev.slice(-5), { y0: y, points: [y] }]);
    }
  }, [ex.yRange]);

  const clearTrajectories = () => {
    setTrajectories([]);
    setSelectedY(null);
    setTime(0);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Phase Line Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase line */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-content-muted">
                Phase Line (click to add trajectory)
              </div>
              <canvas
                ref={canvasRef}
                width={350}
                height={400}
                className="w-full cursor-pointer"
                onClick={handleCanvasClick}
              />
            </div>

            {/* Timeline */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-content-muted">
                y(t) vs Time
              </div>
              <canvas
                ref={timelineCanvasRef}
                width={350}
                height={400}
                className="w-full"
              />
            </div>
          </div>

          {/* Equation and equilibria info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg">
              <h4 className="text-blue-300 font-semibold mb-2">Differential Equation</h4>
              <p className="text-xl font-mono text-blue-200 text-center">
                {ex.latex}
              </p>
              <p className="text-sm text-content-muted mt-2 text-center">
                {ex.description}
              </p>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg">
              <h4 className="text-green-300 font-semibold mb-2">Equilibria</h4>
              <div className="space-y-1">
                {equilibria.length === 0 ? (
                  <p className="text-content-muted text-center">No equilibria exist</p>
                ) : (
                  equilibria.map((eq, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="font-mono text-content-muted">y* = {eq.y.toFixed(2)}</span>
                      <span className={`text-sm px-2 py-0.5 rounded ${
                        eq.stability === 'stable' ? 'bg-green-900/50 text-green-300' :
                        eq.stability === 'unstable' ? 'bg-red-900/50 text-red-300' :
                        'bg-amber-900/50 text-amber-300'
                      }`}>
                        {eq.stability}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="System">
            <select
              value={example}
              onChange={(e) => setExample(e.target.value as ExampleType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </ControlPanel>

          {ex.paramLabels.length > 0 && (
            <ControlPanel title="Parameters">
              {ex.paramLabels.map((label, idx) => (
                <div key={idx} className="mb-3">
                  <label className="block text-sm text-content-muted mb-1">
                    {label}: {params[idx]?.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min={ex.paramRanges[idx][0]}
                    max={ex.paramRanges[idx][1]}
                    step={(ex.paramRanges[idx][1] - ex.paramRanges[idx][0]) / 50}
                    value={params[idx] || 0}
                    onChange={(e) => {
                      const newParams = [...params];
                      newParams[idx] = Number(e.target.value);
                      setParams(newParams);
                    }}
                    className="w-full"
                  />
                </div>
              ))}
            </ControlPanel>
          )}

          <ControlPanel title="Simulation">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setIsAnimating(!isAnimating)}
                variant={isAnimating ? 'secondary' : 'primary'}
              >
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={clearTrajectories} variant="secondary">
                Clear All
              </Button>
            </div>
            <p className="text-xs text-content-muted mt-2">
              Time: {time.toFixed(1)}s | Trajectories: {trajectories.length}
            </p>
          </ControlPanel>

          <ControlPanel title="Stability Rules">
            <div className="text-sm text-content-muted space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Stable: f'(y*) {'<'} 0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-red-500"></div>
                <span>Unstable: f'(y*) {'>'} 0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span>Semi-stable: f'(y*) = 0</span>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
