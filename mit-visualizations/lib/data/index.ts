/**
 * MIT Study Project - Data Module Exports
 * =======================================
 * Central export point for all data-related functionality.
 */

// Types
export type {
  Course,
  Unit,
  TopicSection,
  PracticeProblem,
  CourseId,
  CourseColor,
  DistributionType,
  DistributionParams,
} from './types';

// Course data and functions
export {
  courses,
  getCourse,
  getUnit,
  getAllCourses,
  isValidCourseId,
  validCourseIds,
  getCourseMetadata,
  getAllCourseMetadata,
  getNextUnit,
  getPreviousUnit,
  getUnitIndex,
} from './courses/index';

// Visualization registry
export {
  visualizationRegistry,
  visualizationNames,
  isValidVisualization,
  getVisualization,
  getVisualizationsByCategory,
  type VisualizationName,
} from './visualizations/registry';
