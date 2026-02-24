'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

/**
 * 3Blue1Brown-style Separable Equations Visualizer
 * Visual demonstration of separation of variables technique
 */

type ExampleType = 'exponential' | 'logistic' | 'decay' | 'sqrt';

interface Step {
  title: string;
  left: string;
  right: string;
  explanation: string;
}

const EXAMPLES: Record<ExampleType, {
  name: string;
  original: string;
  gOfY: (y: number) => number;
  fOfX: (x: number) => number;
  solution: (x: number, C: number) => number;
  implicitSolution: string;
  explicitSolution: string;
  steps: Step[];
}> = {
  exponential: {
    name: "Exponential Growth",
    original: "dy/dx = ky",
    gOfY: (y) => y,
    fOfX: () => 1,
    solution: (x, C) => C * Math.exp(x),
    implicitSolution: "ln|y| = x + C",
    explicitSolution: "y = Ce^x",
    steps: [
      { title: "Original Equation", left: "dy/dx", right: "y", explanation: "Start with dy/dx = y (k=1 for simplicity)" },
      { title: "Separate Variables", left: "dy/y", right: "dx", explanation: "Move all y's to left, x's to right" },
      { title: "Integrate Both Sides", left: "∫(1/y)dy", right: "∫dx", explanation: "Add integral signs to both sides" },
      { title: "Evaluate Integrals", left: "ln|y|", right: "x + C", explanation: "∫(1/y)dy = ln|y|, ∫dx = x + C" },
      { title: "Solve for y", left: "y", right: "Ce^x", explanation: "Exponentiate: y = e^(x+C) = e^C·e^x = Ce^x" },
    ]
  },
  logistic: {
    name: "Logistic Equation",
    original: "dy/dx = y(1-y)",
    gOfY: (y) => y * (1 - y),
    fOfX: () => 1,
    solution: (x, C) => 1 / (1 + C * Math.exp(-x)),
    implicitSolution: "ln|y/(1-y)| = x + C",
    explicitSolution: "y = 1/(1 + Ce^{-x})",
    steps: [
      { title: "Original Equation", left: "dy/dx", right: "y(1-y)", explanation: "Logistic growth with carrying capacity 1" },
      { title: "Separate Variables", left: "dy/[y(1-y)]", right: "dx", explanation: "Divide both sides by y(1-y)" },
      { title: "Partial Fractions", left: "(1/y + 1/(1-y))dy", right: "dx", explanation: "Decompose 1/[y(1-y)] = 1/y + 1/(1-y)" },
      { title: "Integrate Both Sides", left: "ln|y| - ln|1-y|", right: "x + C", explanation: "Note: ∫1/(1-y)dy = -ln|1-y|" },
      { title: "Solve for y", left: "y", right: "1/(1 + Ce^{-x})", explanation: "After algebraic manipulation" },
    ]
  },
  decay: {
    name: "Newton's Cooling",
    original: "dT/dt = -k(T-A)",
    gOfY: (y) => y - 20,
    fOfX: () => -0.5,
    solution: (x, C) => 20 + C * Math.exp(-0.5 * x),
    implicitSolution: "ln|T-A| = -kt + C",
    explicitSolution: "T = A + Ce^{-kt}",
    steps: [
      { title: "Original Equation", left: "dT/dt", right: "-k(T-A)", explanation: "Temperature T approaches ambient A" },
      { title: "Separate Variables", left: "dT/(T-A)", right: "-k dt", explanation: "Let A=20, k=0.5 for visualization" },
      { title: "Integrate Both Sides", left: "∫dT/(T-A)", right: "∫-k dt", explanation: "Integrate with respect to each variable" },
      { title: "Evaluate Integrals", left: "ln|T-A|", right: "-kt + C", explanation: "Standard logarithm integral" },
      { title: "Solve for T", left: "T", right: "A + Ce^{-kt}", explanation: "T approaches ambient temperature A" },
    ]
  },
  sqrt: {
    name: "Square Root",
    original: "dy/dx = √y",
    gOfY: (y) => Math.sqrt(Math.max(0, y)),
    fOfX: () => 1,
    solution: (x, C) => Math.pow((x + C) / 2, 2),
    implicitSolution: "2√y = x + C",
    explicitSolution: "y = ((x+C)/2)²",
    steps: [
      { title: "Original Equation", left: "dy/dx", right: "√y", explanation: "dy/dx = y^(1/2)" },
      { title: "Separate Variables", left: "dy/√y", right: "dx", explanation: "Rewrite as y^(-1/2)dy = dx" },
      { title: "Integrate Both Sides", left: "∫y^{-1/2}dy", right: "∫dx", explanation: "Power rule on left side" },
      { title: "Evaluate Integrals", left: "2y^{1/2}", right: "x + C", explanation: "∫y^(-1/2)dy = 2y^(1/2)" },
      { title: "Solve for y", left: "y", right: "((x+C)/2)²", explanation: "Square both sides" },
    ]
  },
};

export default function SeparableEquationVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [example, setExample] = useState<ExampleType>('exponential');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [C, setC] = useState(1);

  const ex = EXAMPLES[example];

  // Auto animation
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      if (currentStep < ex.steps.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        setIsAnimating(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, ex.steps.length]);

  // Draw visualization
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
    const xMin = -1, xMax = 5;
    let yMin = -1, yMax = 5;

    if (example === 'decay') {
      yMin = 0;
      yMax = 80;
    } else if (example === 'logistic') {
      yMin = -0.2;
      yMax = 1.5;
    }

    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      ctx.beginPath();
      ctx.moveTo(scaleX(x), padding);
      ctx.lineTo(scaleX(x), height - padding);
      ctx.stroke();
    }

    const yStep = (yMax - yMin) / 6;
    for (let y = yMin; y <= yMax; y += yStep) {
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(y));
      ctx.lineTo(width - padding, scaleY(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
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

    // Draw slope field if at early steps
    if (currentStep < 3) {
      const gridSize = 15;
      const arrowLen = 12;

      ctx.strokeStyle = '#3b82f640';
      ctx.lineWidth = 1;

      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          const x = xMin + (xMax - xMin) * (i / gridSize);
          const y = yMin + (yMax - yMin) * (j / gridSize);

          if (y <= 0 && example !== 'decay') continue;

          const slope = ex.fOfX(x) * ex.gOfY(y);
          if (!isFinite(slope) || Math.abs(slope) > 100) continue;

          const angle = Math.atan(slope);
          const dx = arrowLen * Math.cos(angle) / 2;
          const dy = arrowLen * Math.sin(angle) / 2;

          ctx.beginPath();
          ctx.moveTo(scaleX(x) - dx, scaleY(y) + dy);
          ctx.lineTo(scaleX(x) + dx, scaleY(y) - dy);
          ctx.stroke();
        }
      }
    }

    // Draw solution curves
    if (currentStep >= 3) {
      // Family of solutions
      const cValues = example === 'logistic'
        ? [0.1, 0.5, 1, 2, 5]
        : example === 'decay'
        ? [10, 30, 50, 70, 90]
        : [0.5, 1, 2, 3, 4];

      const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

      cValues.forEach((cVal, idx) => {
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();

        let started = false;
        for (let x = xMin; x <= xMax; x += 0.02) {
          const y = ex.solution(x, cVal);
          if (y >= yMin && y <= yMax && isFinite(y)) {
            if (!started) {
              ctx.moveTo(scaleX(x), scaleY(y));
              started = true;
            } else {
              ctx.lineTo(scaleX(x), scaleY(y));
            }
          }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    // Highlighted solution with current C
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let started = false;
    for (let x = xMin; x <= xMax; x += 0.01) {
      const y = ex.solution(x, C);
      if (y >= yMin - 1 && y <= yMax + 1 && isFinite(y)) {
        if (!started) {
          ctx.moveTo(scaleX(x), scaleY(y));
          started = true;
        } else {
          ctx.lineTo(scaleX(x), scaleY(y));
        }
      }
    }
    ctx.stroke();

    // Initial point marker
    const y0 = ex.solution(0, C);
    if (y0 >= yMin && y0 <= yMax) {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(scaleX(0), scaleY(y0), 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f472b6';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`(0, ${y0.toFixed(2)})`, scaleX(0) + 10, scaleY(y0) - 10);
    }

  }, [example, currentStep, C, ex]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Separation of Variables
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

          {/* Step animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-6 bg-slate-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Step {currentStep + 1}: {ex.steps[currentStep].title}
                </h3>
                <span className="text-sm text-content-muted">
                  {currentStep + 1} / {ex.steps.length}
                </span>
              </div>

              {/* Visual equation */}
              <div className="flex items-center justify-center gap-4 py-6 bg-slate-900 rounded-lg mb-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl font-mono text-blue-400"
                >
                  {ex.steps[currentStep].left}
                </motion.div>

                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl text-content-muted"
                >
                  =
                </motion.span>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl font-mono text-green-400"
                >
                  {ex.steps[currentStep].right}
                </motion.div>
              </div>

              <p className="text-content-muted text-center">
                {ex.steps[currentStep].explanation}
              </p>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-4">
                {ex.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentStep(idx); setIsAnimating(false); }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentStep ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Key insight box */}
          {currentStep === ex.steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg"
            >
              <h4 className="text-purple-300 font-semibold mb-2">General Solution</h4>
              <p className="text-center text-xl font-mono text-purple-200">
                {ex.explicitSolution}
              </p>
              <p className="text-sm text-purple-400 mt-2 text-center">
                The constant C is determined by initial conditions
              </p>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <ControlPanel title="Select Equation">
            <select
              value={example}
              onChange={(e) => {
                setExample(e.target.value as ExampleType);
                setCurrentStep(0);
                setIsAnimating(false);
                setC(example === 'decay' ? 50 : 1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-amber-300 font-mono text-center">
              {ex.original}
            </p>
          </ControlPanel>

          <ControlPanel title="Animation">
            <div className="flex flex-col gap-2">
              <Button onClick={startAnimation} variant="primary" disabled={isAnimating}>
                {isAnimating ? 'Playing...' : 'Play Animation'}
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                  variant="secondary"
                  disabled={isAnimating}
                  className="flex-1"
                >
                  Prev
                </Button>
                <Button
                  onClick={() => setCurrentStep(s => Math.min(ex.steps.length - 1, s + 1))}
                  variant="secondary"
                  disabled={isAnimating}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="Initial Condition">
            <label className="block text-sm text-content-muted mb-2">
              C = {C.toFixed(1)} (controls y(0))
            </label>
            <input
              type="range"
              min={example === 'decay' ? 10 : example === 'logistic' ? 0.1 : 0.5}
              max={example === 'decay' ? 80 : example === 'logistic' ? 5 : 4}
              step={example === 'decay' ? 5 : 0.1}
              value={C}
              onChange={(e) => setC(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-content-muted mt-2">
              Adjust to see different solution curves
            </p>
          </ControlPanel>

          <ControlPanel title="Key Concept">
            <div className="text-sm text-content-muted space-y-2">
              <p><strong className="text-white">Separable Form:</strong></p>
              <p className="font-mono text-center text-blue-300">dy/dx = f(x)·g(y)</p>
              <p className="mt-3"><strong className="text-white">Method:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Move y terms to left side</li>
                <li>Move x terms to right side</li>
                <li>Integrate both sides</li>
                <li>Solve for y (if possible)</li>
              </ol>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
