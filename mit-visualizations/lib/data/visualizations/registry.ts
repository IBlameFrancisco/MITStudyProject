/**
 * MIT Study Project - Visualization Component Registry
 * ====================================================
 * Centralized registry for all visualization components with type safety.
 */

import type { ComponentType } from 'react';

// =============================================================================
// VISUALIZATION REGISTRY
// =============================================================================

/**
 * Typed registry mapping visualization names to dynamic imports.
 * All visualizations are lazy-loaded for optimal bundle size.
 */
export const visualizationRegistry = {
  // Probability Visualizations (18-600)
  PascalTriangle: () => import('@/components/visualizations/probability/PascalTriangle'),
  ProbabilityTree: () => import('@/components/visualizations/probability/ProbabilityTree'),
  BayesTheorem: () => import('@/components/visualizations/probability/BayesTheorem'),
  CDFPDFVisualizer: () => import('@/components/visualizations/probability/CDFPDFVisualizer'),
  DistributionPlot: () => import('@/components/visualizations/probability/DistributionPlot'),
  ExpectationVariance: () => import('@/components/visualizations/probability/ExpectationVariance'),
  JointDistribution: () => import('@/components/visualizations/probability/JointDistribution'),
  ConvolutionVisualizer: () => import('@/components/visualizations/probability/ConvolutionVisualizer'),
  CLTDemo: () => import('@/components/visualizations/probability/CLTDemo'),
  MarkovChain: () => import('@/components/visualizations/probability/MarkovChain'),
  EntropyVisualizer: () => import('@/components/visualizations/probability/EntropyVisualizer'),
  MartingaleVisualizer: () => import('@/components/visualizations/probability/MartingaleVisualizer'),
  BlackScholesVisualizer: () => import('@/components/visualizations/probability/BlackScholesVisualizer'),
  MonteCarloSim: () => import('@/components/visualizations/probability/MonteCarloSim'),

  // Algorithm Visualizations (6-1210)
  SortingVisualizer: () => import('@/components/visualizations/algorithms/SortingVisualizer'),
  GraphVisualizer: () => import('@/components/visualizations/algorithms/GraphVisualizer'),
  TreeVisualizer: () => import('@/components/visualizations/algorithms/TreeVisualizer'),
  AsymptoticNotation: () => import('@/components/visualizations/algorithms/AsymptoticNotation'),
  SequenceDataStructures: () => import('@/components/visualizations/algorithms/SequenceDataStructures'),
  MergeSortVisualizer: () => import('@/components/visualizations/algorithms/MergeSortVisualizer'),
  HashTableVisualizer: () => import('@/components/visualizations/algorithms/HashTableVisualizer'),
  LinearSortingVisualizer: () => import('@/components/visualizations/algorithms/LinearSortingVisualizer'),
  BSTVisualizer: () => import('@/components/visualizations/algorithms/BSTVisualizer'),
  AVLTreeVisualizer: () => import('@/components/visualizations/algorithms/AVLTreeVisualizer'),
  HeapVisualizer: () => import('@/components/visualizations/algorithms/HeapVisualizer'),
  BFSVisualizer: () => import('@/components/visualizations/algorithms/BFSVisualizer'),
  DFSVisualizer: () => import('@/components/visualizations/algorithms/DFSVisualizer'),
  WeightedGraphVisualizer: () => import('@/components/visualizations/algorithms/WeightedGraphVisualizer'),
  BellmanFordVisualizer: () => import('@/components/visualizations/algorithms/BellmanFordVisualizer'),
  DijkstraVisualizer: () => import('@/components/visualizations/algorithms/DijkstraVisualizer'),
  JohnsonVisualizer: () => import('@/components/visualizations/algorithms/JohnsonVisualizer'),
  DPVisualizer: () => import('@/components/visualizations/algorithms/DPVisualizer'),

  // Differential Equations Visualizations (18-03)
  SlopeField: () => import('@/components/visualizations/diffeq/SlopeField'),
  PhasePortrait: () => import('@/components/visualizations/diffeq/PhasePortrait'),
  FunctionPlot: () => import('@/components/visualizations/diffeq/FunctionPlot'),
  EulerMethodVisualizer: () => import('@/components/visualizations/diffeq/EulerMethodVisualizer'),
  IntegratingFactorVisualizer: () => import('@/components/visualizations/diffeq/IntegratingFactorVisualizer'),
  SeparableEquationVisualizer: () => import('@/components/visualizations/diffeq/SeparableEquationVisualizer'),
  PhaseLineVisualizer: () => import('@/components/visualizations/diffeq/PhaseLineVisualizer'),
  CalculusReviewVisualizer: () => import('@/components/visualizations/diffeq/CalculusReviewVisualizer'),
  SecondOrderVisualizer: () => import('@/components/visualizations/diffeq/SecondOrderVisualizer'),
  ResonanceVisualizer: () => import('@/components/visualizations/diffeq/ResonanceVisualizer'),
  UndeterminedCoefficientsVisualizer: () => import('@/components/visualizations/diffeq/UndeterminedCoefficientsVisualizer'),
  FourierSeriesVisualizer: () => import('@/components/visualizations/diffeq/FourierSeriesVisualizer'),
  LaplaceTransformVisualizer: () => import('@/components/visualizations/diffeq/LaplaceTransformVisualizer'),

  // Complexity/Data Science Visualizations (6-100b)
  ComplexityChart: () => import('@/components/visualizations/complexity/ComplexityChart'),
  OptimizationPlot: () => import('@/components/visualizations/complexity/OptimizationPlot'),
} as const;

/**
 * Type representing all valid visualization names
 */
export type VisualizationName = keyof typeof visualizationRegistry;

/**
 * Array of all visualization names for validation
 */
export const visualizationNames = Object.keys(visualizationRegistry) as VisualizationName[];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a string is a valid visualization name
 */
export function isValidVisualization(name: string): name is VisualizationName {
  return name in visualizationRegistry;
}

/**
 * Type-safe getter for visualization components with error handling.
 * Returns null if the visualization is not found.
 */
export async function getVisualization(name: string): Promise<ComponentType | null> {
  if (!isValidVisualization(name)) {
    console.error(`Visualization "${name}" not found in registry`);
    return null;
  }

  try {
    const module = await visualizationRegistry[name]();
    return module.default;
  } catch (error) {
    console.error(`Failed to load visualization "${name}":`, error);
    return null;
  }
}

/**
 * Get all visualization names for a specific course category
 */
export function getVisualizationsByCategory(category: 'probability' | 'algorithms' | 'diffeq' | 'complexity'): VisualizationName[] {
  const categoryMap: Record<string, VisualizationName[]> = {
    probability: [
      'PascalTriangle', 'ProbabilityTree', 'BayesTheorem', 'CDFPDFVisualizer',
      'DistributionPlot', 'ExpectationVariance', 'JointDistribution',
      'ConvolutionVisualizer', 'CLTDemo', 'MarkovChain', 'EntropyVisualizer',
      'MartingaleVisualizer', 'BlackScholesVisualizer', 'MonteCarloSim'
    ],
    algorithms: [
      'SortingVisualizer', 'GraphVisualizer', 'TreeVisualizer', 'AsymptoticNotation',
      'SequenceDataStructures', 'MergeSortVisualizer', 'HashTableVisualizer',
      'LinearSortingVisualizer', 'BSTVisualizer', 'AVLTreeVisualizer', 'HeapVisualizer',
      'BFSVisualizer', 'DFSVisualizer', 'WeightedGraphVisualizer',
      'BellmanFordVisualizer', 'DijkstraVisualizer', 'JohnsonVisualizer', 'DPVisualizer'
    ],
    diffeq: [
      'SlopeField', 'PhasePortrait', 'FunctionPlot', 'EulerMethodVisualizer',
      'IntegratingFactorVisualizer', 'SeparableEquationVisualizer',
      'PhaseLineVisualizer', 'CalculusReviewVisualizer', 'SecondOrderVisualizer',
      'ResonanceVisualizer', 'UndeterminedCoefficientsVisualizer',
      'FourierSeriesVisualizer', 'LaplaceTransformVisualizer'
    ],
    complexity: ['ComplexityChart', 'OptimizationPlot'],
  };

  return categoryMap[category] || [];
}
