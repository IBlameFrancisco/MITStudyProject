'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

/**
 * Undetermined Coefficients Method Visualizer
 * Step-by-step demonstration of finding particular solutions
 */

type ExampleType = 'polynomial' | 'exponential' | 'sinusoidal' | 'resonance';

interface Step {
  title: string;
  content: string;
  highlight?: string;
}

const EXAMPLES: Record<ExampleType, {
  name: string;
  equation: string;
  homogeneous: string;
  roots: string;
  yh: string;
  forcing: string;
  guess: string;
  explanation: string;
  steps: Step[];
  solution: string;
}> = {
  polynomial: {
    name: "Polynomial Forcing",
    equation: "y'' + 3y' + 2y = 4x + 2",
    homogeneous: "y'' + 3y' + 2y = 0",
    roots: "r² + 3r + 2 = 0 → r = -1, -2",
    yh: "yₕ = C₁e^(-x) + C₂e^(-2x)",
    forcing: "4x + 2 (polynomial degree 1)",
    guess: "yₚ = Ax + B",
    explanation: "For polynomial forcing of degree n, guess polynomial of degree n",
    steps: [
      { title: "Write the guess", content: "yₚ = Ax + B" },
      { title: "Compute derivatives", content: "y'ₚ = A\ny''ₚ = 0" },
      { title: "Substitute into ODE", content: "0 + 3(A) + 2(Ax + B) = 4x + 2\n2Ax + (3A + 2B) = 4x + 2" },
      { title: "Match coefficients", content: "x¹: 2A = 4 → A = 2\nx⁰: 3A + 2B = 2 → 6 + 2B = 2 → B = -2" },
      { title: "Particular solution", content: "yₚ = 2x - 2", highlight: "yₚ = 2x - 2" },
    ],
    solution: "y = C₁e^(-x) + C₂e^(-2x) + 2x - 2"
  },
  exponential: {
    name: "Exponential Forcing",
    equation: "y'' - 4y = e^(3x)",
    homogeneous: "y'' - 4y = 0",
    roots: "r² - 4 = 0 → r = ±2",
    yh: "yₕ = C₁e^(2x) + C₂e^(-2x)",
    forcing: "e^(3x)",
    guess: "yₚ = Ae^(3x)",
    explanation: "For e^(αx) forcing, guess Ae^(αx) (unless α is a root)",
    steps: [
      { title: "Write the guess", content: "yₚ = Ae^(3x)\n(3 is not a root, so no modification needed)" },
      { title: "Compute derivatives", content: "y'ₚ = 3Ae^(3x)\ny''ₚ = 9Ae^(3x)" },
      { title: "Substitute into ODE", content: "9Ae^(3x) - 4Ae^(3x) = e^(3x)\n5Ae^(3x) = e^(3x)" },
      { title: "Solve for A", content: "5A = 1\nA = 1/5" },
      { title: "Particular solution", content: "yₚ = (1/5)e^(3x)", highlight: "yₚ = (1/5)e^(3x)" },
    ],
    solution: "y = C₁e^(2x) + C₂e^(-2x) + (1/5)e^(3x)"
  },
  sinusoidal: {
    name: "Sinusoidal Forcing",
    equation: "y'' + y = cos(2x)",
    homogeneous: "y'' + y = 0",
    roots: "r² + 1 = 0 → r = ±i",
    yh: "yₕ = C₁cos(x) + C₂sin(x)",
    forcing: "cos(2x)",
    guess: "yₚ = Acos(2x) + Bsin(2x)",
    explanation: "For cos(ωx) or sin(ωx), guess Acos(ωx) + Bsin(ωx)",
    steps: [
      { title: "Write the guess", content: "yₚ = Acos(2x) + Bsin(2x)\n(2i is not a root, so no modification)" },
      { title: "Compute derivatives", content: "y'ₚ = -2Asin(2x) + 2Bcos(2x)\ny''ₚ = -4Acos(2x) - 4Bsin(2x)" },
      { title: "Substitute into ODE", content: "(-4A + A)cos(2x) + (-4B + B)sin(2x) = cos(2x)\n-3Acos(2x) - 3Bsin(2x) = cos(2x)" },
      { title: "Match coefficients", content: "cos(2x): -3A = 1 → A = -1/3\nsin(2x): -3B = 0 → B = 0" },
      { title: "Particular solution", content: "yₚ = -(1/3)cos(2x)", highlight: "yₚ = -(1/3)cos(2x)" },
    ],
    solution: "y = C₁cos(x) + C₂sin(x) - (1/3)cos(2x)"
  },
  resonance: {
    name: "Resonance Case",
    equation: "y'' + y = cos(x)",
    homogeneous: "y'' + y = 0",
    roots: "r² + 1 = 0 → r = ±i",
    yh: "yₕ = C₁cos(x) + C₂sin(x)",
    forcing: "cos(x) — same frequency as homogeneous!",
    guess: "yₚ = x(Acos(x) + Bsin(x))",
    explanation: "When forcing matches homogeneous solution, multiply guess by x!",
    steps: [
      { title: "Identify the problem", content: "cos(x) is already a solution to homogeneous!\nNormal guess Acos(x) + Bsin(x) would fail." },
      { title: "Modify the guess", content: "Multiply by x:\nyₚ = x(Acos(x) + Bsin(x)) = Axcos(x) + Bxsin(x)" },
      { title: "Compute derivatives", content: "y'ₚ = Acos(x) - Axsin(x) + Bsin(x) + Bxcos(x)\ny''ₚ = -2Asin(x) - Axcos(x) + 2Bcos(x) - Bxsin(x)" },
      { title: "Substitute and simplify", content: "After substitution:\n-2Asin(x) + 2Bcos(x) = cos(x)" },
      { title: "Match coefficients", content: "cos(x): 2B = 1 → B = 1/2\nsin(x): -2A = 0 → A = 0" },
      { title: "Particular solution", content: "yₚ = (1/2)xsin(x)", highlight: "yₚ = (1/2)xsin(x)" },
    ],
    solution: "y = C₁cos(x) + C₂sin(x) + (1/2)xsin(x)"
  },
};

export default function UndeterminedCoefficientsVisualizer() {
  const [example, setExample] = useState<ExampleType>('polynomial');
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const ex = EXAMPLES[example];

  // Auto-advance animation
  const startAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  // Animation effect
  useState(() => {
    if (!isAnimating) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= ex.steps.length - 1) {
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Method of Undetermined Coefficients
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Equation Display */}
          <div className="bg-slate-900 p-6 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Solve the differential equation:</p>
              <p className="text-2xl font-mono text-blue-300">{ex.equation}</p>
            </div>
          </div>

          {/* Setup info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-purple-300 font-semibold mb-2">Homogeneous Solution</h4>
              <p className="text-gray-400 text-sm mb-1">{ex.homogeneous}</p>
              <p className="text-gray-400 text-sm mb-2">{ex.roots}</p>
              <p className="text-purple-200 font-mono">{ex.yh}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-amber-300 font-semibold mb-2">Forcing Term Analysis</h4>
              <p className="text-gray-300 text-sm mb-2">g(x) = {ex.forcing}</p>
              <p className="text-amber-200 font-mono">Guess: {ex.guess}</p>
              <p className="text-gray-400 text-xs mt-2">{ex.explanation}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Solution Steps</h3>
              <span className="text-gray-400 text-sm">
                Step {currentStep + 1} of {ex.steps.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1 mb-6">
              {ex.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    idx <= currentStep ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Current step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="min-h-[200px]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {currentStep + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {ex.steps[currentStep].title}
                    </h4>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg">
                  <pre className="text-green-300 font-mono whitespace-pre-wrap text-sm">
                    {ex.steps[currentStep].content}
                  </pre>
                  {ex.steps[currentStep].highlight && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded"
                    >
                      <p className="text-green-300 font-mono text-lg text-center">
                        {ex.steps[currentStep].highlight}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                variant="secondary"
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(s => Math.min(ex.steps.length - 1, s + 1))}
                variant="secondary"
                disabled={currentStep === ex.steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Final solution */}
          {currentStep === ex.steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg"
            >
              <h4 className="text-white font-semibold mb-2">General Solution</h4>
              <p className="text-xl font-mono text-blue-200 text-center">
                {ex.solution}
              </p>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <ControlPanel title="Select Example">
            <select
              value={example}
              onChange={(e) => { setExample(e.target.value as ExampleType); setCurrentStep(0); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
            >
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </ControlPanel>

          <ControlPanel title="Animation">
            <Button onClick={startAnimation} variant="primary" className="w-full">
              Auto Play Steps
            </Button>
          </ControlPanel>

          <ControlPanel title="Guess Rules">
            <div className="text-xs text-gray-400 space-y-2">
              <div className="p-2 bg-slate-900 rounded">
                <p className="text-blue-300 font-semibold">Polynomial xⁿ</p>
                <p>→ Guess: Aₙxⁿ + ... + A₁x + A₀</p>
              </div>
              <div className="p-2 bg-slate-900 rounded">
                <p className="text-green-300 font-semibold">Exponential e^(αx)</p>
                <p>→ Guess: Ae^(αx)</p>
              </div>
              <div className="p-2 bg-slate-900 rounded">
                <p className="text-amber-300 font-semibold">sin(ωx) or cos(ωx)</p>
                <p>→ Guess: Acos(ωx) + Bsin(ωx)</p>
              </div>
              <div className="p-2 bg-slate-900 rounded">
                <p className="text-red-300 font-semibold">Resonance Case</p>
                <p>→ Multiply guess by x</p>
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="Key Rule">
            <p className="text-sm text-gray-300">
              If your guess duplicates a homogeneous solution,
              multiply by <strong className="text-red-400">x</strong> until it doesn't!
            </p>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
