'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Slider from '@/components/ui/Slider';

/**
 * 3Blue1Brown-style Resonance and Forced Oscillation Visualizer
 * Demonstrates forced oscillations, resonance, and frequency response
 */

export default function ResonanceVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const freqResponseRef = useRef<HTMLCanvasElement>(null);

  const [omega0, setOmega0] = useState(2); // natural frequency √(c)
  const [b, setB] = useState(0.3); // damping
  const [omegaF, setOmegaF] = useState(2); // forcing frequency
  const [F0, setF0] = useState(1); // forcing amplitude
  const [time, setTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Calculate amplitude and phase of particular solution
  const getAmplitudeAndPhase = (omega: number) => {
    const denom = Math.sqrt(
      Math.pow(omega0 * omega0 - omega * omega, 2) +
      Math.pow(b * omega, 2)
    );
    const amplitude = F0 / denom;
    const phase = Math.atan2(b * omega, omega0 * omega0 - omega * omega);
    return { amplitude, phase };
  };

  // Resonant frequency (for damped system)
  const omegaRes = b < omega0 * Math.sqrt(2)
    ? Math.sqrt(omega0 * omega0 - b * b / 2)
    : 0;

  // Get solution at time t
  const getSolution = (t: number) => {
    const { amplitude, phase } = getAmplitudeAndPhase(omegaF);

    // Particular solution (steady state)
    const yp = amplitude * Math.cos(omegaF * t - phase);

    // Homogeneous solution (transient) - starts from rest
    const alpha = b / 2;
    const omegaD = Math.sqrt(Math.max(0, omega0 * omega0 - alpha * alpha));

    let yh = 0;
    if (omegaD > 0) {
      // Initial conditions for homogeneous to make total solution start at 0
      const C1 = -amplitude * Math.cos(-phase);
      const C2 = -(amplitude * omegaF * Math.sin(-phase) + alpha * C1) / omegaD;
      yh = Math.exp(-alpha * t) * (C1 * Math.cos(omegaD * t) + C2 * Math.sin(omegaD * t));
    }

    return {
      total: yp + yh,
      steady: yp,
      transient: yh,
      forcing: F0 * Math.cos(omegaF * t)
    };
  };

  // Animation
  useEffect(() => {
    if (!isAnimating) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setTime(t => t + dt);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  // Draw time-domain response
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const tMax = 30;
    const { amplitude } = getAmplitudeAndPhase(omegaF);
    const yMax = Math.max(3, amplitude * 1.5, F0 * 1.5);

    const scaleT = (t: number) => padding + (t / tMax) * (width - 2 * padding);
    const scaleY = (y: number) => height / 2 - (y / yMax) * (height / 2 - padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let t = 0; t <= tMax; t += 5) {
      ctx.beginPath();
      ctx.moveTo(scaleT(t), padding);
      ctx.lineTo(scaleT(t), height - padding);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.fillText('t', width - padding + 10, height / 2 + 15);

    // Draw forcing function (dashed)
    ctx.strokeStyle = '#6366f140';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= Math.min(time, tMax); t += 0.05) {
      const { forcing } = getSolution(t);
      if (t === 0) ctx.moveTo(scaleT(t), scaleY(forcing));
      else ctx.lineTo(scaleT(t), scaleY(forcing));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw steady state
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let t = 0; t <= Math.min(time, tMax); t += 0.05) {
      const { steady } = getSolution(t);
      if (t === 0) ctx.moveTo(scaleT(t), scaleY(steady));
      else ctx.lineTo(scaleT(t), scaleY(steady));
    }
    ctx.stroke();

    // Draw total response
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let t = 0; t <= Math.min(time, tMax); t += 0.05) {
      const { total } = getSolution(t);
      if (Math.abs(total) <= yMax * 2) {
        if (t === 0) ctx.moveTo(scaleT(t), scaleY(total));
        else ctx.lineTo(scaleT(t), scaleY(total));
      }
    }
    ctx.stroke();

    // Current point
    if (time > 0 && time <= tMax) {
      const { total } = getSolution(time);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(scaleT(time), scaleY(total), 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legend
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width - 140, 15, 12, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Total response', width - 120, 20);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(width - 140, 30, 12, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Steady state', width - 120, 35);

    ctx.fillStyle = '#6366f1';
    ctx.fillRect(width - 140, 45, 12, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Forcing (scaled)', width - 120, 50);

  }, [time, omega0, b, omegaF, F0]);

  // Draw frequency response
  useEffect(() => {
    const canvas = freqResponseRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const omegaMax = omega0 * 3;
    const ampMax = F0 / (b * omega0) * 1.5; // Approximate max amplitude

    const scaleOmega = (w: number) => padding + (w / omegaMax) * (width - 2 * padding);
    const scaleAmp = (a: number) => height - padding - (a / ampMax) * (height - 2 * padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

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
    ctx.fillText('ω', width - padding + 15, height - padding + 5);
    ctx.fillText('Amplitude', padding, padding - 10);

    // Natural frequency marker
    ctx.strokeStyle = '#f59e0b40';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(scaleOmega(omega0), padding);
    ctx.lineTo(scaleOmega(omega0), height - padding);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('ω₀', scaleOmega(omega0), height - padding + 15);

    // Resonant frequency marker (if exists)
    if (omegaRes > 0) {
      ctx.strokeStyle = '#ef444440';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(scaleOmega(omegaRes), padding);
      ctx.lineTo(scaleOmega(omegaRes), height - padding);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('ωᵣ', scaleOmega(omegaRes), height - padding + 30);
    }

    // Draw frequency response curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let w = 0.01; w <= omegaMax; w += 0.05) {
      const { amplitude } = getAmplitudeAndPhase(w);
      if (amplitude <= ampMax * 2) {
        if (w === 0.01) ctx.moveTo(scaleOmega(w), scaleAmp(amplitude));
        else ctx.lineTo(scaleOmega(w), scaleAmp(amplitude));
      }
    }
    ctx.stroke();

    // Current frequency marker
    ctx.fillStyle = '#f472b6';
    const { amplitude: currentAmp } = getAmplitudeAndPhase(omegaF);
    ctx.beginPath();
    ctx.arc(scaleOmega(omegaF), scaleAmp(Math.min(currentAmp, ampMax)), 8, 0, Math.PI * 2);
    ctx.fill();

    // Current frequency label
    ctx.fillStyle = '#f472b6';
    ctx.fillText(`ω = ${omegaF.toFixed(2)}`, scaleOmega(omegaF), scaleAmp(Math.min(currentAmp, ampMax)) - 15);

  }, [omega0, b, omegaF, F0, omegaRes]);

  const { amplitude, phase } = getAmplitudeAndPhase(omegaF);
  const isNearResonance = Math.abs(omegaF - omega0) < 0.3;

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Forced Oscillations & Resonance
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time domain */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-content-muted">
                Response y(t) vs Time
              </div>
              <canvas ref={canvasRef} width={400} height={280} className="w-full" />
            </div>

            {/* Frequency response */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="p-2 bg-slate-800 text-center text-sm text-content-muted">
                Frequency Response (Amplitude vs ω)
              </div>
              <canvas ref={freqResponseRef} width={400} height={280} className="w-full" />
            </div>
          </div>

          {/* Equation info */}
          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-900/30 p-3 rounded">
                <h4 className="text-blue-300 font-semibold text-sm">Differential Equation</h4>
                <p className="text-blue-200 font-mono mt-1">
                  y'' + {b.toFixed(2)}y' + {(omega0*omega0).toFixed(2)}y = {F0}cos({omegaF.toFixed(2)}t)
                </p>
              </div>
              <div className="bg-green-900/30 p-3 rounded">
                <h4 className="text-green-300 font-semibold text-sm">Particular Solution</h4>
                <p className="text-green-200 font-mono text-sm mt-1">
                  yₚ = {amplitude.toFixed(3)}cos({omegaF.toFixed(2)}t - {phase.toFixed(3)})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-900 p-2 rounded">
                <p className="text-content-muted text-xs">Natural Freq (ω₀)</p>
                <p className="text-amber-400 font-mono">{omega0.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900 p-2 rounded">
                <p className="text-content-muted text-xs">Forcing Freq (ω)</p>
                <p className="text-pink-400 font-mono">{omegaF.toFixed(2)}</p>
              </div>
              <div className="bg-slate-900 p-2 rounded">
                <p className="text-content-muted text-xs">Amplitude Gain</p>
                <p className={`font-mono ${amplitude > 2 ? 'text-red-400' : 'text-green-400'}`}>
                  {amplitude.toFixed(3)}
                </p>
              </div>
            </div>

            {isNearResonance && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded"
              >
                <p className="text-red-300 text-sm">
                  <strong>Near Resonance!</strong> The forcing frequency is close to the natural frequency,
                  causing large amplitude oscillations. With less damping, the amplitude would be even larger.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="System Parameters">
            <Slider
              label={`ω₀ (natural freq): ${omega0.toFixed(2)}`}
              value={omega0}
              onChange={(e) => setOmega0(Number(e.target.value))}
              min={0.5}
              max={5}
              step={0.1}
            />
            <Slider
              label={`b (damping): ${b.toFixed(2)}`}
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              min={0.05}
              max={2}
              step={0.05}
            />
          </ControlPanel>

          <ControlPanel title="Forcing Function">
            <Slider
              label={`ω (forcing freq): ${omegaF.toFixed(2)}`}
              value={omegaF}
              onChange={(e) => setOmegaF(Number(e.target.value))}
              min={0.1}
              max={omega0 * 3}
              step={0.05}
            />
            <Slider
              label={`F₀ (amplitude): ${F0.toFixed(2)}`}
              value={F0}
              onChange={(e) => setF0(Number(e.target.value))}
              min={0.1}
              max={3}
              step={0.1}
            />
            <button
              onClick={() => setOmegaF(omega0)}
              className="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
            >
              Set ω = ω₀ (Resonance!)
            </button>
          </ControlPanel>

          <ControlPanel title="Animation">
            <div className="flex gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium ${
                  isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isAnimating ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => setTime(0)}
                className="px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white"
              >
                Reset
              </button>
            </div>
          </ControlPanel>

          <ControlPanel title="Key Concepts">
            <div className="text-xs text-content-muted space-y-2">
              <p><strong className="text-white">Resonance:</strong> Maximum amplitude when ω ≈ ω₀</p>
              <p><strong className="text-white">Phase lag:</strong> Response lags forcing by φ</p>
              <p><strong className="text-white">Q factor:</strong> ω₀/b measures "sharpness" of resonance</p>
              <p><strong className="text-white">Transient:</strong> Decays as e^(-bt/2), leaving steady state</p>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
