import type { NextPage } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProgressOverview } from '@/components/features/dashboard/ProgressOverview';
import { ProgressCharts } from '@/components/features/charts/ProgressCharts';

const Progress: NextPage = () => {
  return (
    <DashboardLayout title="Progress">
      <div className="space-y-8">
        <ProgressOverview />
        <ProgressCharts />
      </div>
    </DashboardLayout>
  );
};

export default Progress;
