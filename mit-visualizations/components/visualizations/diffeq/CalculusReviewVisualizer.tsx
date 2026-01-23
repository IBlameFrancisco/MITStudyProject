'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

/**
 * Calculus Prerequisites Review Visualizer
 * Interactive review of essential calculus concepts needed for differential equations
 */

type TopicType = 'derivatives' | 'integrals' | 'chain' | 'product' | 'exponential';

interface ConceptCard {
  title: string;
  formula: string;
  explanation: string;
  examples: { input: string; output: string; }[];
}

const TOPICS: Record<TopicType, {
  name: string;
  icon: string;
  concepts: ConceptCard[];
  visualFunc: (x: number, params: number[]) => { y: number; dy?: number; integral?: number };
  funcLabel: string;
  derivLabel?: string;
  integralLabel?: string;
}> = {
  derivatives: {
    name: "Basic Derivatives",
    icon: "d/dx",
    concepts: [
      {
        title: "Power Rule",
        formula: "d/dx[xⁿ] = nxⁿ⁻¹",
        explanation: "Multiply by the power, then reduce the power by 1",
        examples: [
          { input: "x³", output: "3x²" },
          { input: "x⁵", output: "5x⁴" },
          { input: "x⁻¹", output: "-x⁻²" },
        ]
      },
      {
        title: "Constant Multiple",
        formula: "d/dx[cf(x)] = c·f'(x)",
        explanation: "Constants factor out of derivatives",
        examples: [
          { input: "3x²", output: "6x" },
          { input: "5sin(x)", output: "5cos(x)" },
        ]
      },
      {
        title: "Sum Rule",
        formula: "d/dx[f+g] = f' + g'",
        explanation: "Derivative of a sum is the sum of derivatives",
        examples: [
          { input: "x² + x³", output: "2x + 3x²" },
        ]
      },
    ],
    visualFunc: (x, [n]) => ({
      y: Math.pow(x, n),
      dy: n * Math.pow(x, n - 1),
    }),
    funcLabel: "f(x) = xⁿ",
    derivLabel: "f'(x) = nxⁿ⁻¹",
  },
  integrals: {
    name: "Basic Integrals",
    icon: "∫",
    concepts: [
      {
        title: "Power Rule (Integration)",
        formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C",
        explanation: "Add 1 to power, divide by new power (n ≠ -1)",
        examples: [
          { input: "∫x²dx", output: "x³/3 + C" },
          { input: "∫x⁴dx", output: "x⁵/5 + C" },
        ]
      },
      {
        title: "Logarithm Integral",
        formula: "∫(1/x)dx = ln|x| + C",
        explanation: "Special case when n = -1",
        examples: [
          { input: "∫(1/x)dx", output: "ln|x| + C" },
          { input: "∫(3/x)dx", output: "3ln|x| + C" },
        ]
      },
      {
        title: "Constant of Integration",
        formula: "∫f'(x)dx = f(x) + C",
        explanation: "Always add C - it represents the family of antiderivatives",
        examples: [
          { input: "∫2xdx", output: "x² + C" },
        ]
      },
    ],
    visualFunc: (x, [n]) => ({
      y: Math.pow(x, n),
      integral: Math.pow(x, n + 1) / (n + 1),
    }),
    funcLabel: "f(x) = xⁿ",
    integralLabel: "∫f(x)dx = xⁿ⁺¹/(n+1)",
  },
  chain: {
    name: "Chain Rule",
    icon: "∘",
    concepts: [
      {
        title: "Chain Rule Formula",
        formula: "d/dx[f(g(x))] = f'(g(x))·g'(x)",
        explanation: "Derivative of outside × derivative of inside",
        examples: [
          { input: "(x²+1)³", output: "3(x²+1)²·2x" },
          { input: "sin(x²)", output: "cos(x²)·2x" },
          { input: "e^(3x)", output: "e^(3x)·3" },
        ]
      },
      {
        title: "Nested Functions",
        formula: "dy/dx = (dy/du)·(du/dx)",
        explanation: "Think of intermediate variable u = g(x)",
        examples: [
          { input: "√(1+x²)", output: "x/√(1+x²)" },
        ]
      },
    ],
    visualFunc: (x, [a]) => {
      const inner = a * x;
      return {
        y: Math.sin(inner),
        dy: a * Math.cos(inner),
      };
    },
    funcLabel: "f(x) = sin(ax)",
    derivLabel: "f'(x) = a·cos(ax)",
  },
  product: {
    name: "Product & Quotient",
    icon: "×÷",
    concepts: [
      {
        title: "Product Rule",
        formula: "d/dx[f·g] = f'g + fg'",
        explanation: "First times derivative of second + second times derivative of first",
        examples: [
          { input: "x²·sin(x)", output: "2x·sin(x) + x²·cos(x)" },
          { input: "e^x·x", output: "e^x·x + e^x" },
        ]
      },
      {
        title: "Quotient Rule",
        formula: "d/dx[f/g] = (f'g - fg')/g²",
        explanation: "Low d-high minus high d-low, over low squared",
        examples: [
          { input: "x/sin(x)", output: "(sin(x) - x·cos(x))/sin²(x)" },
        ]
      },
      {
        title: "Integration by Parts",
        formula: "∫u·dv = uv - ∫v·du",
        explanation: "Reverse of product rule for integration",
        examples: [
          { input: "∫x·e^x dx", output: "x·e^x - e^x + C" },
        ]
      },
    ],
    visualFunc: (x) => {
      const f = x;
      const g = Math.exp(-x * x / 4);
      return {
        y: f * g,
        dy: g + x * g * (-x / 2),
      };
    },
    funcLabel: "f(x) = x·e^(-x²/4)",
    derivLabel: "f'(x) via product rule",
  },
  exponential: {
    name: "Exponentials & Logs",
    icon: "eˣ",
    concepts: [
      {
        title: "Exponential Derivative",
        formula: "d/dx[e^x] = e^x",
        explanation: "The exponential function is its own derivative!",
        examples: [
          { input: "e^x", output: "e^x" },
          { input: "e^(2x)", output: "2e^(2x)" },
        ]
      },
      {
        title: "General Exponential",
        formula: "d/dx[a^x] = a^x·ln(a)",
        explanation: "For bases other than e, multiply by ln(base)",
        examples: [
          { input: "2^x", output: "2^x·ln(2)" },
        ]
      },
      {
        title: "Logarithm Derivative",
        formula: "d/dx[ln(x)] = 1/x",
        explanation: "Natural log has simple derivative",
        examples: [
          { input: "ln(x)", output: "1/x" },
          { input: "ln(x²)", output: "2/x" },
        ]
      },
      {
        title: "Exponential Integral",
        formula: "∫e^(ax)dx = (1/a)e^(ax) + C",
        explanation: "Divide by coefficient in exponent",
        examples: [
          { input: "∫e^(3x)dx", output: "(1/3)e^(3x) + C" },
        ]
      },
    ],
    visualFunc: (x, [a]) => ({
      y: Math.exp(a * x),
      dy: a * Math.exp(a * x),
    }),
    funcLabel: "f(x) = e^(ax)",
    derivLabel: "f'(x) = a·e^(ax)",
  },
};

export default function CalculusReviewVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topic, setTopic] = useState<TopicType>('derivatives');
  const [conceptIndex, setConceptIndex] = useState(0);
  const [showDerivative, setShowDerivative] = useState(true);
  const [param, setParam] = useState(2);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentTopic = TOPICS[topic];
  const currentConcept = currentTopic.concepts[conceptIndex];

  // Draw visualization
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
    const xMin = -3, xMax = 3;
    let yMin = -5, yMax = 5;

    if (topic === 'exponential') {
      yMin = -1;
      yMax = param > 0 ? 10 : 5;
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

    for (let y = Math.ceil(yMin); y <= yMax; y++) {
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

    // Draw function
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = xMin; x <= xMax; x += 0.02) {
      const result = currentTopic.visualFunc(x, [param]);
      const y = result.y;
      if (y >= yMin - 2 && y <= yMax + 2 && isFinite(y)) {
        if (x === xMin) {
          ctx.moveTo(scaleX(x), scaleY(y));
        } else {
          ctx.lineTo(scaleX(x), scaleY(y));
        }
      }
    }
    ctx.stroke();

    // Draw derivative if enabled
    if (showDerivative && currentTopic.derivLabel) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = xMin; x <= xMax; x += 0.02) {
        const result = currentTopic.visualFunc(x, [param]);
        const y = result.dy;
        if (y !== undefined && y >= yMin - 2 && y <= yMax + 2 && isFinite(y)) {
          if (x === xMin) {
            ctx.moveTo(scaleX(x), scaleY(y));
          } else {
            ctx.lineTo(scaleX(x), scaleY(y));
          }
        }
      }
      ctx.stroke();
    }

    // Draw integral if available
    if (currentTopic.integralLabel && !showDerivative) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = xMin; x <= xMax; x += 0.02) {
        const result = currentTopic.visualFunc(x, [param]);
        const y = result.integral;
        if (y !== undefined && y >= yMin - 2 && y <= yMax + 2 && isFinite(y)) {
          if (x === xMin) {
            ctx.moveTo(scaleX(x), scaleY(y));
          } else {
            ctx.lineTo(scaleX(x), scaleY(y));
          }
        }
      }
      ctx.stroke();
    }

    // Legend
    ctx.font = '12px system-ui';
    ctx.textAlign = 'left';

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width - 150, 15, 15, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(currentTopic.funcLabel, width - 130, 20);

    if (showDerivative && currentTopic.derivLabel) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(width - 150, 35, 15, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(currentTopic.derivLabel, width - 130, 40);
    }

    if (currentTopic.integralLabel && !showDerivative) {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(width - 150, 35, 15, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(currentTopic.integralLabel, width - 130, 40);
    }

  }, [topic, param, showDerivative, currentTopic]);

  const handleQuizSubmit = () => {
    // Simple check - in real app would be more sophisticated
    const correct = quizAnswer.toLowerCase().includes(currentConcept.examples[0].output.toLowerCase().replace(/\s/g, '').slice(0, 5));
    setQuizFeedback(correct ? 'correct' : 'incorrect');
    setTimeout(() => setQuizFeedback(null), 2000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Calculus Prerequisites Review
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Topic tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {Object.entries(TOPICS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setTopic(key as TopicType); setConceptIndex(0); }}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  topic === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <span className="mr-2 font-mono">{val.icon}</span>
                {val.name}
              </button>
            ))}
          </div>

          {/* Visualization */}
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={700}
              height={350}
              className="w-full"
            />
          </div>

          {/* Concept card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${topic}-${conceptIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-6 bg-slate-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {currentConcept.title}
                </h3>
                <div className="flex gap-1">
                  {currentTopic.concepts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setConceptIndex(idx)}
                      className={`w-2 h-2 rounded-full ${
                        idx === conceptIndex ? 'bg-blue-500' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Formula box */}
              <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg mb-4">
                <p className="text-2xl font-mono text-center text-blue-200">
                  {currentConcept.formula}
                </p>
              </div>

              <p className="text-gray-300 mb-4">
                {currentConcept.explanation}
              </p>

              {/* Examples */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400">Examples:</h4>
                {currentConcept.examples.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-2 bg-slate-900 rounded">
                    <span className="font-mono text-blue-300">{ex.input}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-mono text-green-300">{ex.output}</span>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => setConceptIndex(i => Math.max(0, i - 1))}
                  variant="secondary"
                  disabled={conceptIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setConceptIndex(i => Math.min(currentTopic.concepts.length - 1, i + 1))}
                  variant="secondary"
                  disabled={conceptIndex === currentTopic.concepts.length - 1}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quiz mode */}
          {quizMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg"
            >
              <h4 className="text-purple-300 font-semibold mb-2">Quick Practice</h4>
              <p className="text-gray-300 mb-3">
                Find the derivative: <span className="font-mono text-blue-300">{currentConcept.examples[0].input}</span>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quizAnswer}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                />
                <Button onClick={handleQuizSubmit} variant="primary">
                  Check
                </Button>
              </div>
              {quizFeedback && (
                <p className={`mt-2 ${quizFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                  {quizFeedback === 'correct' ? 'Correct!' : `Try again. Answer: ${currentConcept.examples[0].output}`}
                </p>
              )}
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <ControlPanel title="Visualization">
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Parameter: {param.toFixed(1)}
                </label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={param}
                  onChange={(e) => setParam(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showDeriv"
                  checked={showDerivative}
                  onChange={(e) => setShowDerivative(e.target.checked)}
                />
                <label htmlFor="showDeriv" className="text-sm text-gray-300">
                  Show derivative/integral
                </label>
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="Practice Mode">
            <Button
              onClick={() => setQuizMode(!quizMode)}
              variant={quizMode ? 'secondary' : 'primary'}
              className="w-full"
            >
              {quizMode ? 'Hide Quiz' : 'Practice Quiz'}
            </Button>
          </ControlPanel>

          <ControlPanel title="Why This Matters">
            <p className="text-sm text-gray-400">
              These calculus techniques are fundamental for solving differential equations:
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>• <strong>Integration</strong> - finding antiderivatives</li>
              <li>• <strong>Chain rule</strong> - for substitution methods</li>
              <li>• <strong>Product rule</strong> - for integrating factors</li>
              <li>• <strong>Exponentials</strong> - appear in most solutions</li>
            </ul>
          </ControlPanel>

          <ControlPanel title="Common Integrals">
            <div className="text-xs font-mono text-gray-400 space-y-1">
              <p>∫e^(ax)dx = (1/a)e^(ax)</p>
              <p>∫sin(x)dx = -cos(x)</p>
              <p>∫cos(x)dx = sin(x)</p>
              <p>∫(1/x)dx = ln|x|</p>
              <p>∫x^n dx = x^(n+1)/(n+1)</p>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
