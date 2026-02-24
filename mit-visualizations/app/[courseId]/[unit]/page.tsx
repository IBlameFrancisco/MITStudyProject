import { courses } from '@/lib/data/courses';
import UnitContent from './UnitContent';

export function generateStaticParams() {
  const params: { courseId: string; unit: string }[] = [];

  courses.forEach((course) => {
    course.units.forEach((unit) => {
      params.push({
        courseId: course.id,
        unit: unit.id,
      });
    });
  });

  return params;
}

export default function UnitPage() {
  return <UnitContent />;
}
