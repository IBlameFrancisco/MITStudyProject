/**
 * MIT Study Project - Validation Utilities
 * ========================================
 * Type guards and validation functions for runtime safety.
 */

import type { Course, Unit, TopicSection, PracticeProblem, CourseId } from '@/lib/data/types';

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Check if a value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Check if a value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a non-empty string
 */
function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

/**
 * Check if a value is an array
 */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// =============================================================================
// COURSE ID VALIDATION
// =============================================================================

/**
 * Valid course IDs
 */
const VALID_COURSE_IDS: readonly CourseId[] = ['18-600', '6-1210', '18-03', '6-100b'] as const;

/**
 * Check if a string is a valid course ID
 */
export function isCourseId(id: unknown): id is CourseId {
  return isString(id) && VALID_COURSE_IDS.includes(id as CourseId);
}

/**
 * Validate and return course ID, or null if invalid
 */
export function validateCourseId(id: unknown): CourseId | null {
  return isCourseId(id) ? id : null;
}

// =============================================================================
// DATA VALIDATION
// =============================================================================

/**
 * Validate that data matches the PracticeProblem interface
 */
export function validatePracticeProblem(data: unknown): data is PracticeProblem {
  if (!isObject(data)) return false;

  return (
    isNonEmptyString(data.id) &&
    isNonEmptyString(data.problem) &&
    isNonEmptyString(data.solution)
  );
}

/**
 * Validate that data matches the TopicSection interface
 */
export function validateTopicSection(data: unknown): data is TopicSection {
  if (!isObject(data)) return false;

  return (
    isNonEmptyString(data.title) &&
    isNonEmptyString(data.content)
  );
}

/**
 * Validate that data matches the Unit interface
 */
export function validateUnit(data: unknown): data is Unit {
  if (!isObject(data)) return false;

  // Check required fields
  if (!isNonEmptyString(data.id)) return false;
  if (!isNonEmptyString(data.title)) return false;
  if (!isNonEmptyString(data.description)) return false;
  if (!isArray(data.visualizations)) return false;

  // Validate visualizations array (should be strings)
  const visualizations = data.visualizations as unknown[];
  if (!visualizations.every(isString)) return false;

  // Validate optional sections
  if (data.sections !== undefined) {
    if (!isArray(data.sections)) return false;
    const sections = data.sections as unknown[];
    if (!sections.every(validateTopicSection)) return false;
  }

  // Validate optional practice problems
  if (data.practiceProblems !== undefined) {
    if (!isArray(data.practiceProblems)) return false;
    const practiceProblems = data.practiceProblems as unknown[];
    if (!practiceProblems.every(validatePracticeProblem)) return false;
  }

  return true;
}

/**
 * Validate that data matches the Course interface
 */
export function validateCourse(data: unknown): data is Course {
  if (!isObject(data)) return false;

  // Check required fields
  if (!isNonEmptyString(data.id)) return false;
  if (!isNonEmptyString(data.number)) return false;
  if (!isNonEmptyString(data.title)) return false;
  if (!isNonEmptyString(data.description)) return false;
  if (!isNonEmptyString(data.color)) return false;
  if (!isArray(data.units)) return false;

  // Validate all units
  const units = data.units as unknown[];
  return units.every(validateUnit);
}

// =============================================================================
// SAFE GETTERS
// =============================================================================

/**
 * Safely get a course, returning null if invalid
 */
export function safeGetCourse(getCourse: (id: string) => Course | undefined, id: string): Course | null {
  if (!isCourseId(id)) return null;

  const course = getCourse(id);
  if (!course) return null;

  return validateCourse(course) ? course : null;
}

/**
 * Safely get a unit, returning null if invalid
 */
export function safeGetUnit(
  getUnit: (courseId: string, unitId: string) => Unit | undefined,
  courseId: string,
  unitId: string
): Unit | null {
  if (!isCourseId(courseId)) return null;
  if (!isNonEmptyString(unitId)) return null;

  const unit = getUnit(courseId, unitId);
  if (!unit) return null;

  return validateUnit(unit) ? unit : null;
}

// =============================================================================
// ERROR MESSAGES
// =============================================================================

/**
 * Get a user-friendly error message for invalid course ID
 */
export function getInvalidCourseIdMessage(id: string): string {
  return `Course "${id}" not found. Valid courses are: ${VALID_COURSE_IDS.join(', ')}`;
}

/**
 * Get a user-friendly error message for invalid unit ID
 */
export function getInvalidUnitIdMessage(courseId: string, unitId: string): string {
  return `Unit "${unitId}" not found in course "${courseId}".`;
}
