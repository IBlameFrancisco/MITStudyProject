'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Slider from '@/components/ui/Slider';

/**
 * 3Blue1Brown-style Fourier Series Visualizer
 * Animated demonstration of Fourier series approximations
 */

type WaveformType = 'square' | 'sawtooth' | 'triangle' | 'pulse';

const WAVEFORMS: Record<WaveformType, {
  name: string;
  coefficients: (n: number) => { a: number; b: number };
  formula: string;
  description: string;
}> = {
  square: {
    name: 'Square Wave',
    coefficients: (n) => ({
      a: 0,
      b: n % 2 === 1 ? 4 / (n * Math.PI) : 0
    }),
    formula: 'f(x) = (4/π)[sin(x) + sin(3x)/3 + sin(5x)/5 + ...]',
    description: 'Only odd harmonics with 1/n decay'
  },
  sawtooth: {
    name: 'Sawtooth Wave',
    coefficients: (n) => ({
      a: 0,
      b: 2 * Math.pow(-1, n + 1) / (n * Math.PI)
    }),
    formula: 'f(x) = (2/π)[sin(x) - sin(2x)/2 + sin(3x)/3 - ...]',
    description: 'All harmonics with alternating signs'
  },
  triangle: {
    name: 'Triangle Wave',
    coefficients: (n) => ({
      a: 0,
      b: n % 2 === 1 ? 8 * Math.pow(-1, (n - 1) / 2) / (n * n * Math.PI * Math.PI) : 0
    }),
    formula: 'f(x) = (8/π²)[sin(x) - sin(3x)/9 + sin(5x)/25 - ...]',
    description: 'Odd harmonics with 1/n² decay (smoother)'
  },
  pulse: {
    name: 'Pulse Train',
    coefficients: (n) => ({
      a: Math.sin(n * Math.PI / 4) / (n * Math.PI / 4) * 0.5,
      b: 0
    }),
    formula: 'f(x) = d + Σ(2/nπ)sin(nπd)cos(nx)',
    description: 'Duty cycle d = 1/4, contains cosines'
  }
};

export default function FourierSeriesVisualizer() {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const circleCanvasRef = useRef<HTMLCanvasElement>(null);

  const [waveform, setWaveform] = useState<WaveformType>('square');
  const [numTerms, setNumTerms] = useState(5);
  const [time, setTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showComponents, setShowComponents] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const animationRef = useRef<number | null>(null);

  const wave = WAVEFORMS[waveform];

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setTime(t => (t + dt * animationSpeed) % (2 * Math.PI));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, animationSpeed]);

  // Calculate Fourier sum at a point
  const getFourierSum = (x: number, terms: number): number => {
    let sum = waveform === 'pulse' ? 0.25 : 0; // DC offset for pulse
    for (let n = 1; n <= terms; n++) {
      const { a, b } = wave.coefficients(n);
      sum += a * Math.cos(n * x) + b * Math.sin(n * x);
    }
    return sum;
  };

  // Get target waveform value
  const getTargetValue = (x: number): number => {
    const xMod = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    switch (waveform) {
      case 'square':
        return xMod < Math.PI ? 1 : -1;
      case 'sawtooth':
        return 1 - xMod / Math.PI;
      case 'triangle':
        return xMod < Math.PI ? -1 + 2 * xMod / Math.PI : 3 - 2 * xMod / Math.PI;
      case 'pulse':
        return xMod < Math.PI / 2 ? 1 : 0;
      default:
        return 0;
    }
  };

  // Draw main waveform
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const xMin = -Math.PI;
    const xMax = 3 * Math.PI;
    const yMin = -1.5;
    const yMax = 1.5;

    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const scaleY = (y: number) => height / 2 - (y / yMax) * (height / 2 - padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = -Math.PI; x <= 3 * Math.PI; x += Math.PI / 2) {
      ctx.beginPath();
      ctx.moveTo(scaleX(x), padding);
      ctx.lineTo(scaleX(x), height - padding);
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
    ctx.moveTo(scaleX(0), padding);
    ctx.lineTo(scaleX(0), height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('-π', scaleX(-Math.PI), height / 2 + 15);
    ctx.fillText('0', scaleX(0), height / 2 + 15);
    ctx.fillText('π', scaleX(Math.PI), height / 2 + 15);
    ctx.fillText('2π', scaleX(2 * Math.PI), height / 2 + 15);

    // Draw individual components
    if (showComponents) {
      const componentColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
      for (let n = 1; n <= Math.min(numTerms, 6); n++) {
        const { a, b } = wave.coefficients(n);
        if (Math.abs(a) < 0.001 && Math.abs(b) < 0.001) continue;

        ctx.strokeStyle = componentColors[(n - 1) % componentColors.length] + '60';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let x = xMin; x <= xMax; x += 0.02) {
          const y = a * Math.cos(n * x) + b * Math.sin(n * x);
          if (x === xMin) ctx.moveTo(scaleX(x), scaleY(y));
          else ctx.lineTo(scaleX(x), scaleY(y));
        }
        ctx.stroke();
      }
    }

    // Draw target waveform (dashed)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    let lastY = getTargetValue(xMin);
    ctx.moveTo(scaleX(xMin), scaleY(lastY));

    for (let x = xMin; x <= xMax; x += 0.01) {
      const y = getTargetValue(x);
      if (Math.abs(y - lastY) > 1) {
        ctx.moveTo(scaleX(x), scaleY(y));
      } else {
        ctx.lineTo(scaleX(x), scaleY(y));
      }
      lastY = y;
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Fourier approximation
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = xMin; x <= xMax; x += 0.02) {
      const y = getFourierSum(x, numTerms);
      if (x === xMin) ctx.moveTo(scaleX(x), scaleY(y));
      else ctx.lineTo(scaleX(x), scaleY(y));
    }
    ctx.stroke();

    // Current time marker
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(scaleX(time), scaleY(getFourierSum(time, numTerms)), 6, 0, Math.PI * 2);
    ctx.fill();

    // Legend
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Target', width - 100, 25);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`Fourier (n=${numTerms})`, width - 100, 40);

  }, [waveform, numTerms, time, showComponents, wave]);

  // Draw rotating circles visualization
  useEffect(() => {
    const canvas = circleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const scale = 80;
    let x = centerX;
    let y = centerY;

    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

    // Draw circles for each harmonic
    for (let n = 1; n <= numTerms; n++) {
      const { a, b } = wave.coefficients(n);
      const radius = Math.sqrt(a * a + b * b) * scale;

      if (radius < 1) continue;

      const phase = Math.atan2(b, a);
      const angle = n * time + phase;

      // Draw circle
      ctx.strokeStyle = colors[(n - 1) % colors.length] + '40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw radius
      ctx.strokeStyle = colors[(n - 1) % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const newX = x + radius * Math.cos(angle);
      const newY = y - radius * Math.sin(angle);
      ctx.lineTo(newX, newY);
      ctx.stroke();

      // Small circle at end
      ctx.fillStyle = colors[(n - 1) % colors.length];
      ctx.beginPath();
      ctx.arc(newX, newY, 3, 0, Math.PI * 2);
      ctx.fill();

      x = newX;
      y = newY;
    }

    // Final point
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal line to show value
    ctx.strokeStyle = '#f472b680';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Value indicator
    ctx.fillStyle = '#f472b6';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`y = ${((centerY - y) / scale).toFixed(3)}`, width - 80, y - 10);

  }, [waveform, numTerms, time, wave]);

  // Calculate coefficients for display
  const displayCoeffs = [];
  for (let n = 1; n <= Math.min(numTerms, 8); n++) {
    const { a, b } = wave.coefficients(n);
    if (Math.abs(a) > 0.001 || Math.abs(b) > 0.001) {
      displayCoeffs.push({ n, a: a.toFixed(4), b: b.toFixed(4) });
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Fourier Series Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main waveform */}
            <div className="md:col-span-2 bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-gray-300">
                Fourier Approximation
              </div>
              <canvas ref={mainCanvasRef} width={500} height={300} className="w-full" />
            </div>

            {/* Rotating circles */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-gray-300">
                Epicycles
              </div>
              <canvas ref={circleCanvasRef} width={250} height={300} className="w-full" />
            </div>
          </div>

          {/* Formula and coefficients */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-blue-300 font-semibold mb-2">Fourier Series Formula</h4>
              <p className="text-blue-200 font-mono text-sm">{wave.formula}</p>
              <p className="text-gray-400 text-xs mt-2">{wave.description}</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-green-300 font-semibold mb-2">Coefficients</h4>
              <div className="overflow-x-auto">
                <table className="text-xs text-gray-300 w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-2 py-1">n</th>
                      <th className="px-2 py-1">aₙ</th>
                      <th className="px-2 py-1">bₙ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCoeffs.slice(0, 5).map(c => (
                      <tr key={c.n} className="border-b border-slate-700/50">
                        <td className="px-2 py-1 text-center">{c.n}</td>
                        <td className="px-2 py-1 font-mono">{c.a}</td>
                        <td className="px-2 py-1 font-mono">{c.b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Waveform">
            <select
              value={waveform}
              onChange={(e) => setWaveform(e.target.value as WaveformType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(WAVEFORMS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </ControlPanel>

          <ControlPanel title="Approximation">
            <Slider
              label={`Terms: ${numTerms}`}
              value={numTerms}
              onChange={(e) => setNumTerms(Number(e.target.value))}
              min={1}
              max={30}
              step={1}
            />
            <Slider
              label={`Speed: ${animationSpeed.toFixed(1)}x`}
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              min={0.2}
              max={3}
              step={0.1}
            />
          </ControlPanel>

          <ControlPanel title="Display">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showComponents}
                  onChange={(e) => setShowComponents(e.target.checked)}
                />
                <span className="text-sm text-gray-300">Show harmonics</span>
              </label>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`w-full px-3 py-2 rounded-lg font-medium ${
                  isAnimating ? 'bg-red-600' : 'bg-blue-600'
                } text-white`}
              >
                {isAnimating ? 'Pause' : 'Play'}
              </button>
            </div>
          </ControlPanel>

          <ControlPanel title="Key Concepts">
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Any periodic function = sum of sines & cosines</p>
              <p>• More terms = better approximation</p>
              <p>• Gibbs phenomenon at discontinuities</p>
              <p>• Circles represent rotating phasors</p>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
