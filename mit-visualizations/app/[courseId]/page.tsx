import { courses } from '@/lib/data/courses';
import CourseContent from './CourseContent';

export function generateStaticParams() {
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default function CoursePage() {
  return <CourseContent />;
}
