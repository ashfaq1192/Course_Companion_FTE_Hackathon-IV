import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApiQuery } from '@/hooks/useApiQuery';

interface ProgressData {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHoursLearned: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  achievements: {
    id: string;
    name: string;
    description: string;
    earnedDate: string;
    icon: string;
  }[];
}

export const ProgressOverview: React.FC = () => {
  const { data: progress, isLoading, error } = useApiQuery<ProgressData>(
    ['user-progress-overview'],
    '/progress/overview' // Hypothetical endpoint
  );

  if (isLoading) {
    return <div>Loading progress overview...</div>;
  }

  if (error) {
    return <div>Error loading progress: {(error as Error).message}</div>;
  }

  if (!progress) {
    return <div>No progress data available</div>;
  }

  const completionPercentage = progress.totalCourses > 0 
    ? Math.round((progress.completedCourses / progress.totalCourses) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.totalCourses}</div>
          <p className="text-xs text-gray-500">All courses in your library</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.completedCourses}</div>
          <p className="text-xs text-gray-500">{completionPercentage}% of total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Learning Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.currentStreak} days</div>
          <p className="text-xs text-gray-500">Keep it up!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Hours Learned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.totalHoursLearned}</div>
          <p className="text-xs text-gray-500">Time spent learning</p>
        </CardContent>
      </Card>

      {/* Weekly Progress Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Learning Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Hours this week</span>
            <span className="text-sm font-medium">
              {progress.weeklyProgress} / {progress.weeklyGoal} hrs
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (progress.weeklyProgress / progress.weeklyGoal) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progress.weeklyGoal - progress.weeklyProgress > 0 
              ? `${progress.weeklyGoal - progress.weeklyProgress} hours left to reach your goal`
              : 'Goal achieved! Great job!'}
          </p>
        </CardContent>
      </Card>

      {/* Recent Achievements Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.achievements.length > 0 ? (
            <div className="space-y-3">
              {progress.achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center p-2 bg-gray-50 rounded">
                  <div className="mr-3 text-xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No achievements yet. Keep learning!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};