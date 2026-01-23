'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

/**
 * 3Blue1Brown-style Integrating Factor Method Visualizer
 * Step-by-step animated demonstration of solving first-order linear ODEs
 */

type ExampleType = 'basic' | 'growth' | 'mixing' | 'rc';

interface Step {
  title: string;
  equation: string;
  explanation: string;
  highlight: 'p' | 'q' | 'mu' | 'solution' | null;
}

const EXAMPLES: Record<ExampleType, {
  name: string;
  description: string;
  p: string;
  q: string;
  pFunc: (x: number) => number;
  qFunc: (x: number) => number;
  muFunc: (x: number) => number;
  solution: (x: number, C: number) => number;
  solutionLatex: string;
  steps: Step[];
}> = {
  basic: {
    name: "Basic Example",
    description: "dy/dx + 2y = x",
    p: "2",
    q: "x",
    pFunc: () => 2,
    qFunc: (x) => x,
    muFunc: (x) => Math.exp(2 * x),
    solution: (x, C) => (x/2 - 1/4) + C * Math.exp(-2*x),
    solutionLatex: "y = (x/2 - 1/4) + Ce^{-2x}",
    steps: [
      { title: "Standard Form", equation: "dy/dx + 2y = x", explanation: "Identify P(x) = 2 and Q(x) = x", highlight: null },
      { title: "Integrating Factor", equation: "μ(x) = e^{∫2dx} = e^{2x}", explanation: "Calculate μ(x) = e^{∫P(x)dx}", highlight: 'mu' },
      { title: "Multiply Both Sides", equation: "e^{2x}dy/dx + 2e^{2x}y = xe^{2x}", explanation: "Left side becomes d/dx[μ·y]", highlight: null },
      { title: "Recognize Derivative", equation: "d/dx[e^{2x}y] = xe^{2x}", explanation: "Product rule in reverse!", highlight: null },
      { title: "Integrate Both Sides", equation: "e^{2x}y = ∫xe^{2x}dx", explanation: "Use integration by parts", highlight: null },
      { title: "Final Solution", equation: "y = (x/2 - 1/4) + Ce^{-2x}", explanation: "Divide by μ(x) and add constant", highlight: 'solution' },
    ]
  },
  growth: {
    name: "Population Model",
    description: "dy/dx - y = e^{2x}",
    p: "-1",
    q: "e^{2x}",
    pFunc: () => -1,
    qFunc: (x) => Math.exp(2*x),
    muFunc: (x) => Math.exp(-x),
    solution: (x, C) => Math.exp(2*x) + C * Math.exp(x),
    solutionLatex: "y = e^{2x} + Ce^{x}",
    steps: [
      { title: "Standard Form", equation: "dy/dx + (-1)y = e^{2x}", explanation: "P(x) = -1, Q(x) = e^{2x}", highlight: null },
      { title: "Integrating Factor", equation: "μ(x) = e^{∫-1dx} = e^{-x}", explanation: "μ(x) = e^{-x}", highlight: 'mu' },
      { title: "Multiply Both Sides", equation: "e^{-x}dy/dx - e^{-x}y = e^{x}", explanation: "Simplify: e^{-x}·e^{2x} = e^{x}", highlight: null },
      { title: "Recognize Derivative", equation: "d/dx[e^{-x}y] = e^{x}", explanation: "Left side is derivative of product", highlight: null },
      { title: "Integrate Both Sides", equation: "e^{-x}y = e^{x} + C", explanation: "∫e^{x}dx = e^{x} + C", highlight: null },
      { title: "Final Solution", equation: "y = e^{2x} + Ce^{x}", explanation: "Multiply through by e^{x}", highlight: 'solution' },
    ]
  },
  mixing: {
    name: "Mixing Tank",
    description: "dy/dx + y/10 = 5",
    p: "1/10",
    q: "5",
    pFunc: () => 0.1,
    qFunc: () => 5,
    muFunc: (x) => Math.exp(0.1 * x),
    solution: (x, C) => 50 + C * Math.exp(-0.1*x),
    solutionLatex: "y = 50 + Ce^{-x/10}",
    steps: [
      { title: "Standard Form", equation: "dy/dx + (1/10)y = 5", explanation: "P(x) = 1/10, Q(x) = 5", highlight: null },
      { title: "Integrating Factor", equation: "μ(x) = e^{∫(1/10)dx} = e^{x/10}", explanation: "μ(x) = e^{x/10}", highlight: 'mu' },
      { title: "Multiply Both Sides", equation: "e^{x/10}dy/dx + (1/10)e^{x/10}y = 5e^{x/10}", explanation: "Standard multiplication", highlight: null },
      { title: "Recognize Derivative", equation: "d/dx[e^{x/10}y] = 5e^{x/10}", explanation: "Product rule verification", highlight: null },
      { title: "Integrate Both Sides", equation: "e^{x/10}y = 50e^{x/10} + C", explanation: "∫5e^{x/10}dx = 50e^{x/10}", highlight: null },
      { title: "Final Solution", equation: "y = 50 + Ce^{-x/10}", explanation: "Approaches equilibrium y = 50", highlight: 'solution' },
    ]
  },
  rc: {
    name: "RC Circuit",
    description: "dV/dt + V/RC = E/RC",
    p: "1/RC",
    q: "E/RC",
    pFunc: () => 1,
    qFunc: () => 5,
    muFunc: (x) => Math.exp(x),
    solution: (x, C) => 5 + C * Math.exp(-x),
    solutionLatex: "V = E + Ce^{-t/RC}",
    steps: [
      { title: "Standard Form", equation: "dV/dt + (1/RC)V = E/RC", explanation: "P(t) = 1/RC, Q(t) = E/RC", highlight: null },
      { title: "Integrating Factor", equation: "μ(t) = e^{∫(1/RC)dt} = e^{t/RC}", explanation: "Using RC = 1 for simplicity", highlight: 'mu' },
      { title: "Multiply Both Sides", equation: "e^{t/RC}dV/dt + (1/RC)e^{t/RC}V = (E/RC)e^{t/RC}", explanation: "Standard procedure", highlight: null },
      { title: "Recognize Derivative", equation: "d/dt[e^{t/RC}V] = (E/RC)e^{t/RC}", explanation: "Left side is exact derivative", highlight: null },
      { title: "Integrate Both Sides", equation: "e^{t/RC}V = Ee^{t/RC} + C", explanation: "Integrate right side", highlight: null },
      { title: "Final Solution", equation: "V = E + Ce^{-t/RC}", explanation: "Capacitor charges to voltage E", highlight: 'solution' },
    ]
  },
};

export default function IntegratingFactorVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [example, setExample] = useState<ExampleType>('basic');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [C, setC] = useState(1);
  const [showSolutionFamily, setShowSolutionFamily] = useState(true);

  const ex = EXAMPLES[example];

  // Auto-advance animation
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      if (currentStep < ex.steps.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        setIsAnimating(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, ex.steps.length]);

  // Draw solution curves
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
    const xMin = -0.5, xMax = 5;
    const yMin = -2, yMax = example === 'mixing' ? 80 : 15;

    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    for (let x = 0; x <= xMax; x += 1) {
      ctx.beginPath();
      ctx.moveTo(scaleX(x), padding);
      ctx.lineTo(scaleX(x), height - padding);
      ctx.stroke();
    }

    const yStep = (yMax - yMin) / 8;
    for (let y = yMin; y <= yMax; y += yStep) {
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(y));
      ctx.lineTo(width - padding, scaleY(y));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, scaleY(0));
    ctx.lineTo(width - padding, scaleY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(scaleX(0), padding);
    ctx.lineTo(scaleX(0), height - padding);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - padding + 15, scaleY(0) + 5);
    ctx.fillText('y', scaleX(0), padding - 10);

    // Family of solutions (different C values)
    if (showSolutionFamily && currentStep === ex.steps.length - 1) {
      const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
      const cValues = [-2, -1, 0, 1, 2];

      cValues.forEach((cVal, idx) => {
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = cVal === 0 ? 3 : 2;
        ctx.globalAlpha = cVal === 0 ? 1 : 0.6;
        ctx.beginPath();

        for (let x = xMin; x <= xMax; x += 0.02) {
          const y = ex.solution(x, cVal);
          if (y > yMin - 5 && y < yMax + 5) {
            if (x === xMin) {
              ctx.moveTo(scaleX(x), scaleY(y));
            } else {
              ctx.lineTo(scaleX(x), scaleY(y));
            }
          }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Legend
      ctx.font = '11px system-ui';
      cValues.forEach((cVal, idx) => {
        ctx.fillStyle = colors[idx];
        ctx.fillText(`C = ${cVal}`, width - padding - 30, padding + 20 + idx * 18);
      });
    }

    // Single solution with current C
    if (currentStep >= ex.steps.length - 1) {
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let x = xMin; x <= xMax; x += 0.02) {
        const y = ex.solution(x, C);
        if (y > yMin - 5 && y < yMax + 5) {
          if (x === xMin) {
            ctx.moveTo(scaleX(x), scaleY(y));
          } else {
            ctx.lineTo(scaleX(x), scaleY(y));
          }
        }
      }
      ctx.stroke();
    }

    // Draw integrating factor curve if at that step
    if (currentStep >= 1 && currentStep < ex.steps.length - 1) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      for (let x = 0; x <= xMax; x += 0.02) {
        const mu = ex.muFunc(x);
        const scaledMu = mu / ex.muFunc(xMax) * (yMax - yMin) * 0.5;
        if (x === 0) {
          ctx.moveTo(scaleX(x), scaleY(scaledMu));
        } else {
          ctx.lineTo(scaleX(x), scaleY(scaledMu));
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#fbbf24';
      ctx.font = '14px system-ui';
      ctx.fillText('μ(x) (scaled)', width - padding - 50, padding + 30);
    }

  }, [example, currentStep, C, showSolutionFamily, ex]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const resetSteps = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Integrating Factor Method
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={700}
              height={400}
              className="w-full"
            />
          </div>

          {/* Step display */}
          <div className="mt-4 space-y-4">
            {/* Progress bar */}
            <div className="flex gap-2">
              {ex.steps.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`flex-1 h-2 rounded-full ${
                    idx <= currentStep ? 'bg-blue-500' : 'bg-slate-700'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {/* Current step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentStep + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    {ex.steps[currentStep].title}
                  </h3>
                </div>

                <div className="text-center py-4 bg-slate-900 rounded-lg mb-4">
                  <p className="text-2xl font-mono text-blue-300">
                    {ex.steps[currentStep].equation}
                  </p>
                </div>

                <p className="text-gray-300">
                  {ex.steps[currentStep].explanation}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                variant="secondary"
                disabled={currentStep === 0 || isAnimating}
              >
                Previous
              </Button>

              <span className="text-gray-400">
                Step {currentStep + 1} of {ex.steps.length}
              </span>

              <Button
                onClick={() => setCurrentStep(s => Math.min(ex.steps.length - 1, s + 1))}
                variant="secondary"
                disabled={currentStep === ex.steps.length - 1 || isAnimating}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Select Example">
            <select
              value={example}
              onChange={(e) => {
                setExample(e.target.value as ExampleType);
                setCurrentStep(0);
                setIsAnimating(false);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-purple-300 font-mono text-center">
              {ex.description}
            </p>
          </ControlPanel>

          <ControlPanel title="Animation">
            <div className="flex flex-col gap-2">
              <Button onClick={startAnimation} variant="primary" disabled={isAnimating}>
                {isAnimating ? 'Playing...' : 'Auto Play Steps'}
              </Button>
              <Button onClick={resetSteps} variant="secondary">
                Reset
              </Button>
            </div>
          </ControlPanel>

          {currentStep === ex.steps.length - 1 && (
            <ControlPanel title="Solution Parameter">
              <div className="space-y-3">
                <label className="block text-sm text-gray-300">
                  Constant C: {C.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={C}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showFamily"
                    checked={showSolutionFamily}
                    onChange={(e) => setShowSolutionFamily(e.target.checked)}
                  />
                  <label htmlFor="showFamily" className="text-sm text-gray-300">
                    Show solution family
                  </label>
                </div>
              </div>
            </ControlPanel>
          )}

          <ControlPanel title="Method Summary">
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong className="text-white">Standard Form:</strong></p>
              <p className="font-mono text-blue-300 text-center">dy/dx + P(x)y = Q(x)</p>
              <p className="mt-2"><strong className="text-white">Integrating Factor:</strong></p>
              <p className="font-mono text-amber-300 text-center">μ(x) = e^{'{∫P(x)dx}'}</p>
              <p className="mt-2"><strong className="text-white">Solution:</strong></p>
              <p className="font-mono text-green-300 text-center text-xs">y = (1/μ)∫μQ dx + C/μ</p>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
