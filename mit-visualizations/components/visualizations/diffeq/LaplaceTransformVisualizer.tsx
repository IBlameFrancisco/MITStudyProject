'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

/**
 * Laplace Transform Visualizer
 * Interactive demonstration of transforms and inverse transforms
 */

type TransformType = 'exponential' | 'sine' | 'step' | 'delta' | 'polynomial' | 'damped-sine';

interface TransformPair {
  name: string;
  timeDomain: string;
  sDomain: string;
  timeFunc: (t: number, params: number[]) => number;
  condition: string;
  params: { name: string; default: number; min: number; max: number }[];
}

const TRANSFORMS: Record<TransformType, TransformPair> = {
  exponential: {
    name: 'Exponential',
    timeDomain: 'f(t) = e^{at}',
    sDomain: 'F(s) = 1/(s-a)',
    timeFunc: (t, [a]) => t >= 0 ? Math.exp(a * t) : 0,
    condition: 's > a',
    params: [{ name: 'a', default: -1, min: -3, max: 1 }]
  },
  sine: {
    name: 'Sine',
    timeDomain: 'f(t) = sin(ωt)',
    sDomain: 'F(s) = ω/(s² + ω²)',
    timeFunc: (t, [omega]) => t >= 0 ? Math.sin(omega * t) : 0,
    condition: 's > 0',
    params: [{ name: 'ω', default: 2, min: 0.5, max: 5 }]
  },
  step: {
    name: 'Unit Step',
    timeDomain: 'u(t) = { 0, t<0; 1, t≥0 }',
    sDomain: 'F(s) = 1/s',
    timeFunc: (t) => t >= 0 ? 1 : 0,
    condition: 's > 0',
    params: []
  },
  delta: {
    name: 'Delta Function',
    timeDomain: 'δ(t-a)',
    sDomain: 'F(s) = e^{-as}',
    timeFunc: (t, [a]) => Math.abs(t - a) < 0.05 ? 10 : 0,
    condition: 'all s',
    params: [{ name: 'a', default: 1, min: 0, max: 3 }]
  },
  polynomial: {
    name: 'Power Function',
    timeDomain: 'f(t) = t^n',
    sDomain: 'F(s) = n!/s^{n+1}',
    timeFunc: (t, [n]) => t >= 0 ? Math.pow(t, n) : 0,
    condition: 's > 0',
    params: [{ name: 'n', default: 2, min: 1, max: 4 }]
  },
  'damped-sine': {
    name: 'Damped Sine',
    timeDomain: 'f(t) = e^{at}sin(ωt)',
    sDomain: 'F(s) = ω/((s-a)² + ω²)',
    timeFunc: (t, [a, omega]) => t >= 0 ? Math.exp(a * t) * Math.sin(omega * t) : 0,
    condition: 's > a',
    params: [
      { name: 'a', default: -0.5, min: -2, max: 0 },
      { name: 'ω', default: 3, min: 1, max: 6 }
    ]
  }
};

interface Step {
  title: string;
  equation: string;
  explanation: string;
}

const ODE_EXAMPLE: Step[] = [
  { title: 'Original ODE', equation: "y'' + 3y' + 2y = e^{-3t}, y(0)=1, y'(0)=0", explanation: 'Second-order IVP to solve' },
  { title: 'Apply Laplace Transform', equation: 'L{y\'\'} + 3L{y\'} + 2L{y} = L{e^{-3t}}', explanation: 'Transform each term' },
  { title: 'Use Derivative Property', equation: 's²Y - sy(0) - y\'(0) + 3(sY - y(0)) + 2Y = 1/(s+3)', explanation: 'L{y\'\'} = s²Y - sy(0) - y\'(0)' },
  { title: 'Substitute ICs', equation: 's²Y - s - 0 + 3sY - 3 + 2Y = 1/(s+3)', explanation: 'y(0)=1, y\'(0)=0' },
  { title: 'Solve for Y(s)', equation: 'Y(s) = (s+3)/((s+3)(s²+3s+2)) + (s+3)/(s²+3s+2)', explanation: 'Collect terms' },
  { title: 'Partial Fractions', equation: 'Y(s) = A/(s+1) + B/(s+2) + C/(s+3)', explanation: 'Decompose for inverse' },
  { title: 'Inverse Transform', equation: 'y(t) = Ae^{-t} + Be^{-2t} + Ce^{-3t}', explanation: 'L⁻¹ of each term' },
];

export default function LaplaceTransformVisualizer() {
  const timeCanvasRef = useRef<HTMLCanvasElement>(null);
  const sPlaneCanvasRef = useRef<HTMLCanvasElement>(null);

  const [transform, setTransform] = useState<TransformType>('exponential');
  const [params, setParams] = useState<number[]>([-1]);
  const [showODEExample, setShowODEExample] = useState(false);
  const [odeStep, setOdeStep] = useState(0);

  const currentTransform = TRANSFORMS[transform];

  // Update params when transform changes
  useEffect(() => {
    setParams(currentTransform.params.map(p => p.default));
  }, [transform]);

  // Draw time domain
  useEffect(() => {
    const canvas = timeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const tMin = -1;
    const tMax = 5;
    let yMax = 2;

    // Adjust scale based on transform
    if (transform === 'polynomial') yMax = Math.pow(tMax, params[0]) * 0.3;
    if (transform === 'exponential' && params[0] > 0) yMax = Math.exp(params[0] * 3);

    const scaleX = (t: number) => padding + ((t - tMin) / (tMax - tMin)) * (width - 2 * padding);
    const scaleY = (y: number) => height / 2 - (y / yMax) * (height / 2 - padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let t = 0; t <= tMax; t += 1) {
      ctx.beginPath();
      ctx.moveTo(scaleX(t), padding);
      ctx.lineTo(scaleX(t), height - padding);
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
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('t', width - padding + 15, height / 2 + 5);
    ctx.fillText('f(t)', scaleX(0) + 20, padding - 5);

    // Draw function
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let t = tMin; t <= tMax; t += 0.02) {
      const y = currentTransform.timeFunc(t, params);
      const scaledY = scaleY(Math.max(-yMax, Math.min(yMax, y)));

      if (t === tMin) ctx.moveTo(scaleX(t), scaledY);
      else ctx.lineTo(scaleX(t), scaledY);
    }
    ctx.stroke();

    // t=0 line
    ctx.strokeStyle = '#f59e0b40';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(scaleX(0), padding);
    ctx.lineTo(scaleX(0), height - padding);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [transform, params, currentTransform]);

  // Draw s-plane
  useEffect(() => {
    const canvas = sPlaneCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const scale = 30;
    const range = 4;

    const scaleX = (x: number) => centerX + x * scale;
    const scaleY = (y: number) => centerY - y * scale;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = -range; x <= range; x++) {
      ctx.beginPath();
      ctx.moveTo(scaleX(x), 0);
      ctx.lineTo(scaleX(x), height);
      ctx.stroke();
    }
    for (let y = -range; y <= range; y++) {
      ctx.beginPath();
      ctx.moveTo(0, scaleY(y));
      ctx.lineTo(width, scaleY(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Re(s)', width - 25, centerY - 10);
    ctx.fillText('Im(s)', centerX + 25, 15);

    // ROC shading
    ctx.fillStyle = '#22c55e15';
    let rocStart = -range;
    if (transform === 'exponential' || transform === 'damped-sine') {
      rocStart = params[0];
    } else if (transform === 'sine' || transform === 'step' || transform === 'polynomial') {
      rocStart = 0;
    }

    ctx.fillRect(scaleX(rocStart), 0, width - scaleX(rocStart), height);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(scaleX(rocStart), 0);
    ctx.lineTo(scaleX(rocStart), height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw poles
    ctx.fillStyle = '#ef4444';
    if (transform === 'exponential') {
      ctx.beginPath();
      ctx.arc(scaleX(params[0]), scaleY(0), 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scaleX(params[0]) - 5, scaleY(0) - 5);
      ctx.lineTo(scaleX(params[0]) + 5, scaleY(0) + 5);
      ctx.moveTo(scaleX(params[0]) - 5, scaleY(0) + 5);
      ctx.lineTo(scaleX(params[0]) + 5, scaleY(0) - 5);
      ctx.stroke();
    } else if (transform === 'sine') {
      const omega = params[0];
      [omega, -omega].forEach(im => {
        ctx.beginPath();
        ctx.arc(scaleX(0), scaleY(im), 6, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else if (transform === 'damped-sine') {
      const [a, omega] = params;
      [[a, omega], [a, -omega]].forEach(([re, im]) => {
        ctx.beginPath();
        ctx.arc(scaleX(re), scaleY(im), 6, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else if (transform === 'step' || transform === 'polynomial') {
      ctx.beginPath();
      ctx.arc(scaleX(0), scaleY(0), 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Legend
    ctx.fillStyle = '#22c55e';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('ROC: ' + currentTransform.condition, 10, height - 10);

  }, [transform, params, currentTransform]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Laplace Transform Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {!showODEExample ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time domain */}
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <div className="p-2 bg-slate-800 text-center text-sm text-content-muted">
                    Time Domain: f(t)
                  </div>
                  <canvas ref={timeCanvasRef} width={400} height={280} className="w-full" />
                </div>

                {/* S-plane */}
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <div className="p-2 bg-slate-800 text-center text-sm text-content-muted">
                    S-Plane (Poles & ROC)
                  </div>
                  <canvas ref={sPlaneCanvasRef} width={400} height={280} className="w-full" />
                </div>
              </div>

              {/* Transform pair display */}
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                    <h4 className="text-blue-300 text-sm mb-2">Time Domain</h4>
                    <p className="text-2xl font-mono text-blue-200">{currentTransform.timeDomain}</p>
                  </div>
                  <div className="bg-green-900/30 p-4 rounded-lg text-center">
                    <h4 className="text-green-300 text-sm mb-2">S-Domain (Laplace)</h4>
                    <p className="text-2xl font-mono text-green-200">{currentTransform.sDomain}</p>
                  </div>
                </div>
                <p className="text-center text-content-muted text-sm mt-3">
                  Region of Convergence: <span className="text-green-400">{currentTransform.condition}</span>
                </p>
              </div>
            </>
          ) : (
            /* ODE Example */
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Solving ODEs with Laplace Transform</h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={odeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-h-[200px]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {odeStep + 1}
                    </span>
                    <h4 className="text-white font-semibold">{ODE_EXAMPLE[odeStep].title}</h4>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg mb-4">
                    <p className="text-xl font-mono text-green-300 text-center">
                      {ODE_EXAMPLE[odeStep].equation}
                    </p>
                  </div>

                  <p className="text-content-muted">{ODE_EXAMPLE[odeStep].explanation}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-6">
                <Button
                  onClick={() => setOdeStep(s => Math.max(0, s - 1))}
                  variant="secondary"
                  disabled={odeStep === 0}
                >
                  Previous
                </Button>
                <span className="text-content-muted">Step {odeStep + 1} / {ODE_EXAMPLE.length}</span>
                <Button
                  onClick={() => setOdeStep(s => Math.min(ODE_EXAMPLE.length - 1, s + 1))}
                  variant="secondary"
                  disabled={odeStep === ODE_EXAMPLE.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <ControlPanel title="Transform Pair">
            <select
              value={transform}
              onChange={(e) => setTransform(e.target.value as TransformType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(TRANSFORMS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </ControlPanel>

          {currentTransform.params.length > 0 && (
            <ControlPanel title="Parameters">
              {currentTransform.params.map((p, idx) => (
                <div key={p.name} className="mb-2">
                  <label className="block text-sm text-content-muted mb-1">
                    {p.name} = {params[idx]?.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={0.1}
                    value={params[idx] ?? p.default}
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

          <ControlPanel title="ODE Example">
            <Button
              onClick={() => { setShowODEExample(!showODEExample); setOdeStep(0); }}
              variant={showODEExample ? 'secondary' : 'primary'}
              className="w-full"
            >
              {showODEExample ? 'Show Transforms' : 'Solve ODE Example'}
            </Button>
          </ControlPanel>

          <ControlPanel title="Key Properties">
            <div className="text-xs text-content-muted space-y-1">
              <p>• L{'{f\'}'} = sF(s) - f(0)</p>
              <p>• L{'{f\'\'}'} = s²F - sf(0) - f'(0)</p>
              <p>• L{'{e^{at}f}'} = F(s-a)</p>
              <p>• L{'{tf}'} = -F'(s)</p>
              <p>• L{'{f*g}'} = F(s)G(s)</p>
            </div>
          </ControlPanel>

          <ControlPanel title="S-Plane Legend">
            <div className="text-xs text-content-muted space-y-1">
              <p><span className="text-red-400">×</span> = Poles (where F(s) → ∞)</p>
              <p><span className="text-green-400">Shaded</span> = Region of Convergence</p>
              <p>Poles in left half-plane → stable</p>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
