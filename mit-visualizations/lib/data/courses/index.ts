/**
 * MIT Study Project - Course Data Aggregator
 * ==========================================
 * Central export point for all course data and helper functions.
 */

import type { Course, Unit, CourseId } from '../types';

// Import course data from the original file
// TODO: Once courses are split into separate files, import from individual course files
import { courses as allCourses, getCourse as getCourseOriginal, getUnit as getUnitOriginal, getAllCourses as getAllCoursesOriginal } from '../courses';

// =============================================================================
// COURSE ID VALIDATION
// =============================================================================

/**
 * Valid course IDs
 */
export const validCourseIds: CourseId[] = ['18-600', '6-1210', '18-03', '6-100b'];

/**
 * Check if a string is a valid course ID
 */
export function isValidCourseId(id: string): id is CourseId {
  return validCourseIds.includes(id as CourseId);
}

// =============================================================================
// COURSE DATA ACCESS
// =============================================================================

/**
 * All available courses
 */
export const courses: Course[] = allCourses;

/**
 * Get a course by its ID with type safety
 */
export function getCourse(id: string): Course | undefined {
  if (!isValidCourseId(id)) {
    console.warn(`Invalid course ID: ${id}`);
    return undefined;
  }
  return getCourseOriginal(id);
}

/**
 * Get a unit by course ID and unit ID
 */
export function getUnit(courseId: string, unitId: string): Unit | undefined {
  if (!isValidCourseId(courseId)) {
    console.warn(`Invalid course ID: ${courseId}`);
    return undefined;
  }
  return getUnitOriginal(courseId, unitId);
}

/**
 * Get all courses
 */
export function getAllCourses(): Course[] {
  return getAllCoursesOriginal();
}

/**
 * Get course metadata (without full unit content) for listing
 */
export function getCourseMetadata(id: string): Omit<Course, 'units'> & { unitCount: number } | undefined {
  const course = getCourse(id);
  if (!course) return undefined;

  return {
    id: course.id,
    number: course.number,
    title: course.title,
    description: course.description,
    color: course.color,
    unitCount: course.units.length,
  };
}

/**
 * Get all course metadata for listing
 */
export function getAllCourseMetadata(): (Omit<Course, 'units'> & { unitCount: number })[] {
  return courses.map(course => ({
    id: course.id,
    number: course.number,
    title: course.title,
    description: course.description,
    color: course.color,
    unitCount: course.units.length,
  }));
}

// =============================================================================
// COURSE NAVIGATION HELPERS
// =============================================================================

/**
 * Get the next unit in a course
 */
export function getNextUnit(courseId: string, currentUnitId: string): Unit | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;

  const currentIndex = course.units.findIndex(u => u.id === currentUnitId);
  if (currentIndex === -1 || currentIndex >= course.units.length - 1) return undefined;

  return course.units[currentIndex + 1];
}

/**
 * Get the previous unit in a course
 */
export function getPreviousUnit(courseId: string, currentUnitId: string): Unit | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;

  const currentIndex = course.units.findIndex(u => u.id === currentUnitId);
  if (currentIndex <= 0) return undefined;

  return course.units[currentIndex - 1];
}

/**
 * Get unit index in a course (1-based)
 */
export function getUnitIndex(courseId: string, unitId: string): number {
  const course = getCourse(courseId);
  if (!course) return 0;

  const index = course.units.findIndex(u => u.id === unitId);
  return index === -1 ? 0 : index + 1;
}
