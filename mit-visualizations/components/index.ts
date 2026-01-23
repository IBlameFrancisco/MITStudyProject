/**
 * MIT Study Project - Components
 * ===============================
 * Central export file for all components.
 *
 * COMPONENT STRUCTURE:
 * - /layout      - Page layout components (Navbar, Sidebar, etc.)
 * - /ui          - Reusable UI components (Button, Slider, LaTeX, etc.)
 * - /course      - Course-specific components (TopicSections, PracticeProblems)
 * - /visualizations - Interactive visualizations by subject
 */

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================
export { default as Navbar } from './layout/Navbar';
export { default as Sidebar } from './layout/Sidebar';
export { default as ClassCard } from './layout/ClassCard';

// =============================================================================
// UI COMPONENTS
// =============================================================================
export { default as Button } from './ui/Button';
export { default as Slider } from './ui/Slider';
export { default as ControlPanel } from './ui/ControlPanel';
export { LaTeX, parseLatex } from './ui/LaTeX';

// =============================================================================
// COURSE COMPONENTS
// =============================================================================
export { default as TopicSections } from './ui/TopicSections';
export { default as PracticeProblems } from './ui/PracticeProblems';

// =============================================================================
// PROBABILITY VISUALIZATIONS
// =============================================================================
export { default as DistributionPlot } from './visualizations/probability/DistributionPlot';
export { default as MonteCarloSim } from './visualizations/probability/MonteCarloSim';
export { default as ProbabilityTree } from './visualizations/probability/ProbabilityTree';

// =============================================================================
// ALGORITHM VISUALIZATIONS
// =============================================================================
export { default as SortingVisualizer } from './visualizations/algorithms/SortingVisualizer';
export { default as GraphVisualizer } from './visualizations/algorithms/GraphVisualizer';
export { default as TreeVisualizer } from './visualizations/algorithms/TreeVisualizer';

// =============================================================================
// DIFFERENTIAL EQUATIONS VISUALIZATIONS
// =============================================================================
export { default as SlopeField } from './visualizations/diffeq/SlopeField';
export { default as PhasePortrait } from './visualizations/diffeq/PhasePortrait';
export { default as FunctionPlot } from './visualizations/diffeq/FunctionPlot';

// =============================================================================
// COMPLEXITY VISUALIZATIONS
// =============================================================================
export { default as ComplexityChart } from './visualizations/complexity/ComplexityChart';
export { default as OptimizationPlot } from './visualizations/complexity/OptimizationPlot';
