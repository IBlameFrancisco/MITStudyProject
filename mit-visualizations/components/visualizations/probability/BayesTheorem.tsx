'use client';

/**
 * Bayes' Theorem Calculator
 * ==========================
 * Interactive visualization demonstrating Bayes' theorem with a medical test example.
 * Shows the relationship between prior probability, likelihood, and posterior probability.
 */

import { useState, useMemo } from 'react';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

export default function BayesTheorem() {
  // Prior probability P(Disease)
  const [prevalence, setPrevalence] = useState(0.01);
  // Sensitivity P(Positive | Disease) - True Positive Rate
  const [sensitivity, setSensitivity] = useState(0.95);
  // Specificity P(Negative | No Disease) - True Negative Rate
  const [specificity, setSpecificity] = useState(0.90);

  // Calculate all probabilities using Bayes' theorem
  const calculations = useMemo(() => {
    const pDisease = prevalence;
    const pNoDisease = 1 - prevalence;

    // P(Positive | Disease) = sensitivity
    const pPosGivenDisease = sensitivity;
    // P(Negative | Disease) = 1 - sensitivity (False Negative Rate)
    const pNegGivenDisease = 1 - sensitivity;

    // P(Negative | No Disease) = specificity
    const pNegGivenNoDisease = specificity;
    // P(Positive | No Disease) = 1 - specificity (False Positive Rate)
    const pPosGivenNoDisease = 1 - specificity;

    // Law of Total Probability: P(Positive)
    const pPositive = pPosGivenDisease * pDisease + pPosGivenNoDisease * pNoDisease;
    const pNegative = 1 - pPositive;

    // Bayes' Theorem: P(Disease | Positive)
    const pDiseaseGivenPos = (pPosGivenDisease * pDisease) / pPositive;
    // P(No Disease | Positive)
    const pNoDiseaseGivenPos = 1 - pDiseaseGivenPos;

    // P(Disease | Negative)
    const pDiseaseGivenNeg = (pNegGivenDisease * pDisease) / pNegative;
    // P(No Disease | Negative)
    const pNoDiseaseGivenNeg = 1 - pDiseaseGivenNeg;

    // Joint probabilities for visualization
    const truePositive = pPosGivenDisease * pDisease;
    const falseNegative = pNegGivenDisease * pDisease;
    const falsePositive = pPosGivenNoDisease * pNoDisease;
    const trueNegative = pNegGivenNoDisease * pNoDisease;

    return {
      pDisease,
      pNoDisease,
      pPositive,
      pNegative,
      pDiseaseGivenPos,
      pNoDiseaseGivenPos,
      pDiseaseGivenNeg,
      pNoDiseaseGivenNeg,
      truePositive,
      falseNegative,
      falsePositive,
      trueNegative,
      sensitivity,
      specificity,
    };
  }, [prevalence, sensitivity, specificity]);

  const formatPercent = (val: number) => (val * 100).toFixed(2) + '%';
  const formatDecimal = (val: number) => val.toFixed(4);

  // Visual bar component
  const ProbabilityBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-content-secondary">{label}</span>
        <span className="font-mono text-content-primary">{formatPercent(value)}</span>
      </div>
      <div className="h-3 bg-surface-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(value * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Bayes' Theorem Calculator
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore the base rate fallacy with a medical testing example
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Visualization */}
        <div className="lg:col-span-3 space-y-6">
          {/* Confusion Matrix Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-6 border border-edge-primary">
            <h3 className="text-sm font-semibold text-content-primary mb-4">Population Breakdown (per 10,000 people)</h3>

            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              {/* Header */}
              <div></div>
              <div className="font-semibold text-content-primary py-2">Has Disease</div>
              <div className="font-semibold text-content-primary py-2">No Disease</div>

              {/* Test Positive Row */}
              <div className="font-semibold text-content-primary py-4 text-right pr-4">Test +</div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-4 border-2 border-emerald-500">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(calculations.truePositive * 10000)}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">True Positive</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-2 border-red-400">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {Math.round(calculations.falsePositive * 10000)}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">False Positive</div>
              </div>

              {/* Test Negative Row */}
              <div className="font-semibold text-content-primary py-4 text-right pr-4">Test −</div>
              <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-2 border-red-400">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {Math.round(calculations.falseNegative * 10000)}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">False Negative</div>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-4 border-2 border-emerald-500">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(calculations.trueNegative * 10000)}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">True Negative</div>
              </div>
            </div>
          </div>

          {/* Key Result - Posterior Probability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-brand-50 to-orange-50 dark:from-brand-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-brand-200 dark:border-brand-800">
              <h4 className="text-sm font-semibold text-brand-800 dark:text-brand-200 mb-3">
                If Test is POSITIVE
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-content-secondary text-sm">P(Disease | +)</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 text-lg">
                    {formatPercent(calculations.pDiseaseGivenPos)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary text-sm">P(Healthy | +)</span>
                  <span className="font-medium text-content-primary">
                    {formatPercent(calculations.pNoDiseaseGivenPos)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-brand-200 dark:border-brand-700">
                <p className="text-xs text-brand-700 dark:text-brand-300">
                  {calculations.pDiseaseGivenPos < 0.5
                    ? "⚠️ Most positive tests are false positives!"
                    : "✓ Positive test is likely a true positive"}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">
                If Test is NEGATIVE
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-content-secondary text-sm">P(Healthy | −)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                    {formatPercent(calculations.pNoDiseaseGivenNeg)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary text-sm">P(Disease | −)</span>
                  <span className="font-medium text-content-primary">
                    {formatPercent(calculations.pDiseaseGivenNeg)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {calculations.pNoDiseaseGivenNeg > 0.99
                    ? "✓ Negative test is highly reliable"
                    : "⚠️ Consider retesting if high risk"}
                </p>
              </div>
            </div>
          </div>

          {/* Bayes Formula */}
          <div className="bg-surface-secondary rounded-xl p-5 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">Bayes' Theorem Formula</h4>
            <div className="bg-surface-tertiary rounded-lg p-4 text-center overflow-x-auto">
              <div className="mb-3">
                <LaTeX math="P(D|+) = \frac{P(+|D) \cdot P(D)}{P(+)}" />
              </div>
              <div className="text-brand-600 dark:text-brand-400">
                <LaTeX math={`${formatDecimal(calculations.pDiseaseGivenPos)} = \\frac{${formatDecimal(sensitivity)} \\times ${formatDecimal(prevalence)}}{${formatDecimal(calculations.pPositive)}}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Disease Parameters">
            <Slider
              label="Prevalence P(D)"
              value={prevalence}
              onChange={(e) => setPrevalence(Number(e.target.value))}
              min={0.001}
              max={0.2}
              step={0.001}
            />
            <p className="text-xs text-content-muted mt-1">
              How common is the disease?
            </p>
          </ControlPanel>

          <ControlPanel title="Test Accuracy">
            <Slider
              label="Sensitivity (TPR)"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              min={0.5}
              max={0.999}
              step={0.001}
            />
            <p className="text-xs text-content-muted mt-1 mb-3">
              P(+ | Disease) - catches sick people
            </p>

            <Slider
              label="Specificity (TNR)"
              value={specificity}
              onChange={(e) => setSpecificity(Number(e.target.value))}
              min={0.5}
              max={0.999}
              step={0.001}
            />
            <p className="text-xs text-content-muted mt-1">
              P(− | Healthy) - clears healthy people
            </p>
          </ControlPanel>

          <ControlPanel title="Probability Breakdown">
            <ProbabilityBar
              value={calculations.pDisease}
              label="Prior P(Disease)"
              color="bg-purple-500"
            />
            <ProbabilityBar
              value={calculations.pPositive}
              label="P(Test Positive)"
              color="bg-blue-500"
            />
            <ProbabilityBar
              value={calculations.pDiseaseGivenPos}
              label="Posterior P(D|+)"
              color="bg-brand-500"
            />
          </ControlPanel>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Base Rate Fallacy
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              When a disease is rare, even accurate tests produce many false positives.
              The posterior probability can be surprisingly low!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
