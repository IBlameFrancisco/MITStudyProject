'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Slider from '@/components/ui/Slider';

/**
 * 3Blue1Brown-style Second-Order ODE Visualizer
 * Visualizes solutions to y'' + by' + cy = 0 with different damping conditions
 */

type DampingType = 'underdamped' | 'critically' | 'overdamped' | 'undamped';

interface RootInfo {
  type: DampingType;
  roots: string[];
  solution: string;
  description: string;
}

export default function SecondOrderVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseCanvasRef = useRef<HTMLCanvasElement>(null);

  const [b, setB] = useState(1); // damping coefficient
  const [c, setC] = useState(4); // spring constant
  const [y0, setY0] = useState(2); // initial position
  const [v0, setV0] = useState(0); // initial velocity
  const [showPhase, setShowPhase] = useState(true);
  const [time, setTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Calculate discriminant and root type
  const discriminant = b * b - 4 * c;

  const getRootInfo = (): RootInfo => {
    if (c <= 0) {
      return {
        type: 'overdamped',
        roots: ['Real roots (unstable)'],
        solution: 'Exponential growth',
        description: 'System is unstable'
      };
    }

    if (Math.abs(discriminant) < 0.001) {
      const r = -b / 2;
      return {
        type: 'critically',
        roots: [`r = ${r.toFixed(2)} (repeated)`],
        solution: `y = (C₁ + C₂t)e^{${r.toFixed(2)}t}`,
        description: 'Fastest decay without oscillation'
      };
    } else if (discriminant < 0) {
      const alpha = -b / 2;
      const beta = Math.sqrt(-discriminant) / 2;
      return {
        type: b === 0 ? 'undamped' : 'underdamped',
        roots: [`r = ${alpha.toFixed(2)} ± ${beta.toFixed(2)}i`],
        solution: b === 0
          ? `y = C₁cos(${beta.toFixed(2)}t) + C₂sin(${beta.toFixed(2)}t)`
          : `y = e^{${alpha.toFixed(2)}t}[C₁cos(${beta.toFixed(2)}t) + C₂sin(${beta.toFixed(2)}t)]`,
        description: b === 0 ? 'Pure oscillation (no energy loss)' : 'Decaying oscillation'
      };
    } else {
      const r1 = (-b + Math.sqrt(discriminant)) / 2;
      const r2 = (-b - Math.sqrt(discriminant)) / 2;
      return {
        type: 'overdamped',
        roots: [`r₁ = ${r1.toFixed(2)}`, `r₂ = ${r2.toFixed(2)}`],
        solution: `y = C₁e^{${r1.toFixed(2)}t} + C₂e^{${r2.toFixed(2)}t}`,
        description: 'Slow return without oscillation'
      };
    }
  };

  // Calculate solution at time t
  const getSolution = (t: number): { y: number; v: number } => {
    if (c <= 0) {
      return { y: y0 * Math.exp(t), v: y0 * Math.exp(t) };
    }

    if (Math.abs(discriminant) < 0.001) {
      // Critically damped
      const r = -b / 2;
      const C1 = y0;
      const C2 = v0 - r * y0;
      const y = (C1 + C2 * t) * Math.exp(r * t);
      const v = (C2 + r * (C1 + C2 * t)) * Math.exp(r * t);
      return { y, v };
    } else if (discriminant < 0) {
      // Underdamped or undamped
      const alpha = -b / 2;
      const omega = Math.sqrt(-discriminant) / 2;
      const C1 = y0;
      const C2 = (v0 - alpha * y0) / omega;
      const y = Math.exp(alpha * t) * (C1 * Math.cos(omega * t) + C2 * Math.sin(omega * t));
      const v = Math.exp(alpha * t) * (
        (alpha * C1 + omega * C2) * Math.cos(omega * t) +
        (alpha * C2 - omega * C1) * Math.sin(omega * t)
      );
      return { y, v };
    } else {
      // Overdamped
      const r1 = (-b + Math.sqrt(discriminant)) / 2;
      const r2 = (-b - Math.sqrt(discriminant)) / 2;
      const C2 = (v0 - r1 * y0) / (r2 - r1);
      const C1 = y0 - C2;
      const y = C1 * Math.exp(r1 * t) + C2 * Math.exp(r2 * t);
      const v = C1 * r1 * Math.exp(r1 * t) + C2 * r2 * Math.exp(r2 * t);
      return { y, v };
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setTime(t => t + dt * 0.5);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  // Draw time-domain solution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Scale
    const tMax = 15;
    const yMax = Math.max(3, Math.abs(y0) * 1.5);

    const scaleT = (t: number) => padding + (t / tMax) * (width - 2 * padding);
    const scaleY = (y: number) => height / 2 - (y / yMax) * (height / 2 - padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let t = 0; t <= tMax; t += 2) {
      ctx.beginPath();
      ctx.moveTo(scaleT(t), padding);
      ctx.lineTo(scaleT(t), height - padding);
      ctx.stroke();
    }

    for (let y = -yMax; y <= yMax; y += 1) {
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(y));
      ctx.lineTo(width - padding, scaleY(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('t', width - padding + 15, height / 2 + 5);
    ctx.fillText('y(t)', padding, padding - 10);

    // Draw envelope for underdamped
    const rootInfo = getRootInfo();
    if (rootInfo.type === 'underdamped') {
      const alpha = -b / 2;
      const omega = Math.sqrt(-discriminant) / 2;
      const C1 = y0;
      const C2 = (v0 - alpha * y0) / omega;
      const A = Math.sqrt(C1 * C1 + C2 * C2);

      ctx.strokeStyle = '#ef444460';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Upper envelope
      ctx.beginPath();
      for (let t = 0; t <= tMax; t += 0.05) {
        const env = A * Math.exp(alpha * t);
        if (t === 0) ctx.moveTo(scaleT(t), scaleY(env));
        else ctx.lineTo(scaleT(t), scaleY(env));
      }
      ctx.stroke();

      // Lower envelope
      ctx.beginPath();
      for (let t = 0; t <= tMax; t += 0.05) {
        const env = -A * Math.exp(alpha * t);
        if (t === 0) ctx.moveTo(scaleT(t), scaleY(env));
        else ctx.lineTo(scaleT(t), scaleY(env));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw solution curve
    const colors: Record<DampingType, string> = {
      undamped: '#22c55e',
      underdamped: '#3b82f6',
      critically: '#f59e0b',
      overdamped: '#ef4444'
    };

    ctx.strokeStyle = colors[rootInfo.type];
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let t = 0; t <= Math.min(time, tMax); t += 0.02) {
      const { y } = getSolution(t);
      if (Math.abs(y) <= yMax * 2) {
        if (t === 0) ctx.moveTo(scaleT(t), scaleY(y));
        else ctx.lineTo(scaleT(t), scaleY(y));
      }
    }
    ctx.stroke();

    // Current point
    if (time > 0 && time <= tMax) {
      const { y } = getSolution(time);
      if (Math.abs(y) <= yMax * 2) {
        ctx.fillStyle = colors[rootInfo.type];
        ctx.beginPath();
        ctx.arc(scaleT(time), scaleY(y), 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Legend
    ctx.fillStyle = colors[rootInfo.type];
    ctx.font = '14px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(rootInfo.type.charAt(0).toUpperCase() + rootInfo.type.slice(1), width - 120, 30);

  }, [b, c, y0, v0, time, discriminant]);

  // Draw phase portrait
  useEffect(() => {
    if (!showPhase) return;

    const canvas = phaseCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const range = Math.max(3, Math.abs(y0) * 1.5, Math.abs(v0) * 1.5);

    const scaleX = (x: number) => width / 2 + (x / range) * (width / 2 - padding);
    const scaleY = (y: number) => height / 2 - (y / range) * (height / 2 - padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = -range; x <= range; x += 1) {
      ctx.beginPath();
      ctx.moveTo(scaleX(x), padding);
      ctx.lineTo(scaleX(x), height - padding);
      ctx.stroke();
    }

    for (let y = -range; y <= range; y += 1) {
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(y));
      ctx.lineTo(width - padding, scaleY(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2, padding);
    ctx.lineTo(width / 2, height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('y', width - padding + 15, height / 2 - 10);
    ctx.fillText("y'", width / 2 + 15, padding - 5);

    // Draw trajectory
    const rootInfo = getRootInfo();
    const colors: Record<DampingType, string> = {
      undamped: '#22c55e',
      underdamped: '#3b82f6',
      critically: '#f59e0b',
      overdamped: '#ef4444'
    };

    ctx.strokeStyle = colors[rootInfo.type];
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxT = rootInfo.type === 'undamped' ? 20 : 15;
    for (let t = 0; t <= Math.min(time, maxT); t += 0.02) {
      const { y, v } = getSolution(t);
      if (Math.abs(y) <= range * 2 && Math.abs(v) <= range * 2) {
        if (t === 0) ctx.moveTo(scaleX(y), scaleY(v));
        else ctx.lineTo(scaleX(y), scaleY(v));
      }
    }
    ctx.stroke();

    // Current point
    if (time > 0) {
      const { y, v } = getSolution(time);
      if (Math.abs(y) <= range * 2 && Math.abs(v) <= range * 2) {
        ctx.fillStyle = colors[rootInfo.type];
        ctx.beginPath();
        ctx.arc(scaleX(y), scaleY(v), 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initial point
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(scaleX(y0), scaleY(v0), 5, 0, Math.PI * 2);
    ctx.fill();

    // Origin (equilibrium)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(scaleX(0), scaleY(0), 4, 0, Math.PI * 2);
    ctx.fill();

  }, [b, c, y0, v0, time, showPhase, discriminant]);

  const rootInfo = getRootInfo();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Second-Order ODE: Damped Oscillator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time domain */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-gray-300">
                Solution y(t) vs Time
              </div>
              <canvas ref={canvasRef} width={400} height={300} className="w-full" />
            </div>

            {/* Phase portrait */}
            {showPhase && (
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <div className="p-2 bg-slate-800 text-center text-sm text-gray-300">
                  Phase Portrait (y vs y')
                </div>
                <canvas ref={phaseCanvasRef} width={400} height={300} className="w-full" />
              </div>
            )}
          </div>

          {/* Equation info */}
          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/30 p-3 rounded">
                <h4 className="text-blue-300 font-semibold text-sm">Differential Equation</h4>
                <p className="text-blue-200 font-mono mt-1">
                  y'' + {b}y' + {c}y = 0
                </p>
              </div>
              <div className="bg-purple-900/30 p-3 rounded">
                <h4 className="text-purple-300 font-semibold text-sm">Characteristic Equation</h4>
                <p className="text-purple-200 font-mono mt-1">
                  r² + {b}r + {c} = 0
                </p>
                <p className="text-purple-300 text-xs mt-1">
                  Δ = {discriminant.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-900/30 p-3 rounded">
                <h4 className="text-green-300 font-semibold text-sm">Roots</h4>
                {rootInfo.roots.map((r, i) => (
                  <p key={i} className="text-green-200 font-mono text-sm">{r}</p>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={rootInfo.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-slate-900 rounded"
              >
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">{rootInfo.type.charAt(0).toUpperCase() + rootInfo.type.slice(1)}:</strong>{' '}
                  {rootInfo.description}
                </p>
                <p className="text-gray-400 font-mono text-sm mt-2">
                  {rootInfo.solution}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Equation Parameters">
            <Slider
              label={`b (damping): ${b.toFixed(1)}`}
              value={b}
              onChange={(e) => { setB(Number(e.target.value)); setTime(0); }}
              min={0}
              max={6}
              step={0.1}
            />
            <Slider
              label={`c (spring): ${c.toFixed(1)}`}
              value={c}
              onChange={(e) => { setC(Number(e.target.value)); setTime(0); }}
              min={0.1}
              max={10}
              step={0.1}
            />
          </ControlPanel>

          <ControlPanel title="Initial Conditions">
            <Slider
              label={`y(0): ${y0.toFixed(1)}`}
              value={y0}
              onChange={(e) => { setY0(Number(e.target.value)); setTime(0); }}
              min={-3}
              max={3}
              step={0.1}
            />
            <Slider
              label={`y'(0): ${v0.toFixed(1)}`}
              value={v0}
              onChange={(e) => { setV0(Number(e.target.value)); setTime(0); }}
              min={-3}
              max={3}
              step={0.1}
            />
          </ControlPanel>

          <ControlPanel title="Animation">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isAnimating ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => setTime(0)}
                className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-medium"
              >
                Reset
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="showPhase"
                checked={showPhase}
                onChange={(e) => setShowPhase(e.target.checked)}
              />
              <label htmlFor="showPhase" className="text-sm text-gray-300">
                Show phase portrait
              </label>
            </div>
          </ControlPanel>

          <ControlPanel title="Damping Cases">
            <div className="text-xs text-gray-400 space-y-2">
              <p><strong className="text-green-400">Undamped (b=0):</strong> Pure oscillation</p>
              <p><strong className="text-blue-400">Underdamped (Δ{'<'}0):</strong> Decaying oscillation</p>
              <p><strong className="text-amber-400">Critical (Δ=0):</strong> Fastest non-oscillating decay</p>
              <p><strong className="text-red-400">Overdamped (Δ{'>'}0):</strong> Slow exponential decay</p>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
