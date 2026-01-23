/**
 * MIT Study Project - Canonical Type Definitions
 * ==============================================
 * Single source of truth for all course-related types.
 */

// =============================================================================
// COURSE DATA TYPES
// =============================================================================

/**
 * A practice problem with problem statement and solution
 */
export interface PracticeProblem {
  id: string;
  problem: string;
  solution: string;
}

/**
 * A topic section within a unit
 */
export interface TopicSection {
  title: string;
  content: string;
}

/**
 * A unit within a course (e.g., "Counting and Basic Probability")
 */
export interface Unit {
  id: string;
  title: string;
  description: string;
  sections?: TopicSection[];
  practiceProblems?: PracticeProblem[];
  visualizations: string[];
}

/**
 * A course (e.g., "18.600 Probability and Random Variables")
 */
export interface Course {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  units: Unit[];
}

/**
 * Valid course IDs
 */
export type CourseId = '18-600' | '6-1210' | '18-03' | '6-100b';

/**
 * Course color mapping type
 */
export type CourseColor = 'bg-blue-600' | 'bg-green-600' | 'bg-purple-600' | 'bg-orange-600';

// =============================================================================
// VISUALIZATION TYPES
// =============================================================================

/**
 * Distribution types for probability visualizations
 */
export type DistributionType = 'normal' | 'binomial' | 'poisson' | 'exponential' | 'uniform';

/**
 * Parameters for different distribution types
 */
export interface DistributionParams {
  normal: { mean: number; stdDev: number };
  binomial: { n: number; p: number };
  poisson: { lambda: number };
  exponential: { lambda: number };
  uniform: { a: number; b: number };
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';
