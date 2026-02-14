import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useMainService } from '@/hooks/useMainService';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressOverview } from '@/components/features/dashboard/ProgressOverview';
import { AnalyticsWidgets } from '@/components/features/analytics/AnalyticsWidgets';
import { AchievementDisplay } from '@/components/features/achievements/AchievementDisplay';
import { ProgressCharts } from '@/components/features/charts/ProgressCharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const Dashboard: NextPage = () => {
  const { user, isLoading, error, getUserDashboardData } = useMainService();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load dashboard data when component mounts
      getUserDashboardData(user.id).catch(console.error);
    }
  }, [isAuthenticated, user, getUserDashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
            <Link
              href="/auth/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
            >
              Go to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <ProgressOverview />
        <AnalyticsWidgets />
        <ProgressCharts />
        <AchievementDisplay />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;