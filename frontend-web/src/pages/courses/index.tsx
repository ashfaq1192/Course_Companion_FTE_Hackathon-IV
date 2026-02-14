import type { NextPage } from 'next';
import { CourseCatalog } from '@/components/features/course/CourseCatalog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const Courses: NextPage = () => {
  return (
    <DashboardLayout title="Courses">
      <div className="space-y-8">
        <CourseCatalog />
      </div>
    </DashboardLayout>
  );
};

export default Courses;