'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';

/**
 * 3Blue1Brown-style Euler Method Visualizer
 * Animated step-by-step demonstration of numerical ODE solving
 */

interface Point {
  x: number;
  y: number;
  slope: number;
}

type EquationType = 'exponential' | 'logistic' | 'decay' | 'custom';

const EQUATIONS: Record<EquationType, {
  name: string;
  dydt: (x: number, y: number) => number;
  exact: (x: number, y0: number) => number;
  latex: string;
}> = {
  exponential: {
    name: "Exponential Growth",
    dydt: (_, y) => y,
    exact: (x, y0) => y0 * Math.exp(x),
    latex: "dy/dx = y"
  },
  logistic: {
    name: "Logistic Growth",
    dydt: (_, y) => y * (1 - y / 10),
    exact: (x, y0) => 10 / (1 + ((10 - y0) / y0) * Math.exp(-x)),
    latex: "dy/dx = y(1 - y/10)"
  },
  decay: {
    name: "Exponential Decay",
    dydt: (_, y) => -0.5 * y,
    exact: (x, y0) => y0 * Math.exp(-0.5 * x),
    latex: "dy/dx = -0.5y"
  },
  custom: {
    name: "dy/dx = x + y",
    dydt: (x, y) => x + y,
    exact: (x, y0) => (y0 + 1) * Math.exp(x) - x - 1,
    latex: "dy/dx = x + y"
  }
};

export default function EulerMethodVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [equation, setEquation] = useState<EquationType>('exponential');
  const [stepSize, setStepSize] = useState(0.5);
  const [y0, setY0] = useState(1);
  const [numSteps, setNumSteps] = useState(8);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExact, setShowExact] = useState(true);
  const [eulerPoints, setEulerPoints] = useState<Point[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);

  const eq = EQUATIONS[equation];

  // Calculate Euler points
  const calculateEuler = useCallback(() => {
    const points: Point[] = [];
    let x = 0;
    let y = y0;

    for (let i = 0; i <= numSteps; i++) {
      const slope = eq.dydt(x, y);
      points.push({ x, y, slope });
      y = y + stepSize * slope;
      x = x + stepSize;
    }
    return points;
  }, [equation, stepSize, y0, numSteps, eq]);

  useEffect(() => {
    setEulerPoints(calculateEuler());
    setCurrentStep(0);
    setAnimationProgress(0);
  }, [calculateEuler]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setAnimationProgress(prev => {
        const next = prev + 0.02;
        if (next >= 1) {
          if (currentStep < numSteps - 1) {
            setCurrentStep(s => s + 1);
            return 0;
          } else {
            setIsAnimating(false);
            return 1;
          }
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, currentStep, numSteps]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Scale
    const xMax = stepSize * numSteps + 1;
    const yMax = Math.max(10, ...eulerPoints.map(p => Math.abs(p.y))) * 1.2;
    const yMin = -yMax * 0.1;

    const scaleX = (x: number) => padding + (x / xMax) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical grid lines
    for (let x = 0; x <= xMax; x += stepSize) {
      ctx.beginPath();
      ctx.moveTo(scaleX(x), padding);
      ctx.lineTo(scaleX(x), height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    const yStep = yMax / 5;
    for (let y = 0; y <= yMax; y += yStep) {
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(y));
      ctx.lineTo(width - padding, scaleY(y));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, scaleY(0));
    ctx.lineTo(width - padding, scaleY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(scaleX(0), padding);
    ctx.lineTo(scaleX(0), height - padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 20, scaleY(0) + 5);
    ctx.fillText('y', scaleX(0) - 5, padding - 10);

    // Tick labels
    ctx.font = '12px system-ui';
    for (let x = 0; x <= xMax; x += stepSize * 2) {
      ctx.fillText(x.toFixed(1), scaleX(x), scaleY(0) + 20);
    }
    for (let y = 0; y <= yMax; y += yStep) {
      ctx.fillText(y.toFixed(1), scaleX(0) - 25, scaleY(y) + 4);
    }

    // Exact solution curve
    if (showExact) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= xMax; x += 0.01) {
        const y = eq.exact(x, y0);
        if (x === 0) {
          ctx.moveTo(scaleX(x), scaleY(y));
        } else {
          ctx.lineTo(scaleX(x), scaleY(y));
        }
      }
      ctx.stroke();
    }

    // Euler steps (already completed)
    const visibleSteps = currentStep + (isAnimating ? 0 : 1);

    for (let i = 0; i < Math.min(visibleSteps, eulerPoints.length - 1); i++) {
      const p1 = eulerPoints[i];
      const p2 = eulerPoints[i + 1];

      // Tangent line segment (the step)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scaleX(p1.x), scaleY(p1.y));
      ctx.lineTo(scaleX(p2.x), scaleY(p2.y));
      ctx.stroke();

      // Point marker
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(scaleX(p1.x), scaleY(p1.y), 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Current animating step
    if (isAnimating && currentStep < eulerPoints.length - 1) {
      const p1 = eulerPoints[currentStep];
      const p2 = eulerPoints[currentStep + 1];

      const currentX = p1.x + animationProgress * stepSize;
      const currentY = p1.y + animationProgress * stepSize * p1.slope;

      // Animated tangent line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scaleX(p1.x), scaleY(p1.y));
      ctx.lineTo(scaleX(currentX), scaleY(currentY));
      ctx.stroke();

      // Current point
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(scaleX(currentX), scaleY(currentY), 8, 0, Math.PI * 2);
      ctx.fill();

      // Slope indicator
      ctx.strokeStyle = '#f59e0b40';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const slopeLen = 1.5;
      ctx.moveTo(scaleX(p1.x - slopeLen/2), scaleY(p1.y - p1.slope * slopeLen/2));
      ctx.lineTo(scaleX(p1.x + slopeLen/2), scaleY(p1.y + p1.slope * slopeLen/2));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Final point after animation
    if (!isAnimating && eulerPoints.length > 0) {
      const lastIdx = Math.min(visibleSteps, eulerPoints.length - 1);
      const lastPoint = eulerPoints[lastIdx];
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(scaleX(lastPoint.x), scaleY(lastPoint.y), 6, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [eulerPoints, currentStep, animationProgress, isAnimating, showExact, stepSize, numSteps, y0, eq]);

  const startAnimation = () => {
    setCurrentStep(0);
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationProgress(0);
  };

  const stepForward = () => {
    if (currentStep < numSteps - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  // Calculate error at final point
  const calculateError = () => {
    if (eulerPoints.length === 0) return 0;
    const lastPoint = eulerPoints[eulerPoints.length - 1];
    const exactVal = eq.exact(lastPoint.x, y0);
    return Math.abs(lastPoint.y - exactVal);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Euler's Method Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative bg-slate-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={700}
              height={450}
              className="w-full"
            />

            {/* Legend overlay */}
            <div className="absolute top-4 right-4 bg-slate-800/90 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-blue-400">Euler Approximation</span>
              </div>
              {showExact && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-green-500 rounded"></div>
                  <span className="text-green-400">Exact Solution</span>
                </div>
              )}
            </div>
          </div>

          {/* Current step info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-slate-800 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-900/30 p-3 rounded-lg">
                  <h4 className="text-blue-300 font-semibold mb-1">Current Point</h4>
                  {eulerPoints[currentStep] && (
                    <p className="text-blue-200 font-mono">
                      ({eulerPoints[currentStep].x.toFixed(2)}, {eulerPoints[currentStep].y.toFixed(4)})
                    </p>
                  )}
                </div>
                <div className="bg-amber-900/30 p-3 rounded-lg">
                  <h4 className="text-amber-300 font-semibold mb-1">Slope at Point</h4>
                  {eulerPoints[currentStep] && (
                    <p className="text-amber-200 font-mono">
                      dy/dx = {eulerPoints[currentStep].slope.toFixed(4)}
                    </p>
                  )}
                </div>
                <div className="bg-green-900/30 p-3 rounded-lg">
                  <h4 className="text-green-300 font-semibold mb-1">Accumulated Error</h4>
                  <p className="text-green-200 font-mono">
                    |error| = {calculateError().toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
                <h4 className="text-purple-300 font-semibold mb-2">Euler's Formula</h4>
                <p className="text-purple-200 font-mono text-center text-lg">
                  y<sub>n+1</sub> = y<sub>n</sub> + h · f(x<sub>n</sub>, y<sub>n</sub>)
                </p>
                {eulerPoints[currentStep] && currentStep < eulerPoints.length - 1 && (
                  <p className="text-purple-300 font-mono text-center mt-2">
                    y<sub>{currentStep + 1}</sub> = {eulerPoints[currentStep].y.toFixed(3)} + {stepSize} × {eulerPoints[currentStep].slope.toFixed(3)} = {eulerPoints[currentStep + 1]?.y.toFixed(3)}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Differential Equation">
            <select
              value={equation}
              onChange={(e) => setEquation(e.target.value as EquationType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(EQUATIONS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
            <div className="mt-2 p-2 bg-slate-700 rounded text-center">
              <span className="text-purple-300 font-mono">{eq.latex}</span>
            </div>
          </ControlPanel>

          <ControlPanel title="Parameters">
            <Slider
              label="Step Size (h)"
              value={stepSize}
              onChange={(e) => setStepSize(Number(e.target.value))}
              min={0.1}
              max={1}
              step={0.1}
            />
            <Slider
              label="Initial Value y(0)"
              value={y0}
              onChange={(e) => setY0(Number(e.target.value))}
              min={0.5}
              max={5}
              step={0.5}
            />
            <Slider
              label="Number of Steps"
              value={numSteps}
              onChange={(e) => setNumSteps(Number(e.target.value))}
              min={4}
              max={20}
              step={1}
            />
          </ControlPanel>

          <ControlPanel title="Animation">
            <div className="flex flex-col gap-2">
              <Button onClick={startAnimation} variant="primary" disabled={isAnimating}>
                {isAnimating ? 'Animating...' : 'Start Animation'}
              </Button>
              <Button onClick={stepForward} variant="secondary" disabled={isAnimating || currentStep >= numSteps - 1}>
                Step Forward
              </Button>
              <Button onClick={resetAnimation} variant="secondary">
                Reset
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="showExact"
                checked={showExact}
                onChange={(e) => setShowExact(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="showExact" className="text-sm text-content-muted">
                Show exact solution
              </label>
            </div>
          </ControlPanel>

          <ControlPanel title="Key Insight">
            <p className="text-sm text-content-muted">
              Euler's method approximates the solution by following the tangent line
              at each point. Smaller step sizes give better accuracy but require
              more computation.
            </p>
            <p className="text-sm text-amber-400 mt-2">
              Notice how the error accumulates with each step!
            </p>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
