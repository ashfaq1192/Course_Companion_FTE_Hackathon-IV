import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApiQuery } from '@/hooks/useApiQuery';

interface AnalyticsData {
  hoursLearned: number;
  completionRate: number;
  avgQuizScore: number;
  coursesInProgress: number;
  timeOfDayStats: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  weeklyTrend: {
    day: string;
    hours: number;
  }[];
}

export const AnalyticsWidgets: React.FC = () => {
  const { data: analytics, isLoading, error } = useApiQuery<AnalyticsData>(
    ['user-analytics'],
    '/analytics/user' // Hypothetical endpoint
  );

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div>Error loading analytics: {(error as Error).message}</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  // Calculate time of day stats
  const timeOfDayMax = Math.max(
    analytics.timeOfDayStats.morning,
    analytics.timeOfDayStats.afternoon,
    analytics.timeOfDayStats.evening,
    analytics.timeOfDayStats.night
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Hours Learned Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.hoursLearned}</div>
          <p className="text-xs text-gray-500">This month</p>
        </CardContent>
      </Card>

      {/* Completion Rate Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.completionRate}%</div>
          <p className="text-xs text-gray-500">Course completion rate</p>
        </CardContent>
      </Card>

      {/* Avg Quiz Score Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Quiz Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.avgQuizScore}%</div>
          <p className="text-xs text-gray-500">Average score on quizzes</p>
        </CardContent>
      </Card>

      {/* Courses in Progress Widget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Courses in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.coursesInProgress}</div>
          <p className="text-xs text-gray-500">Active courses</p>
        </CardContent>
      </Card>

      {/* Best Learning Time Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Best Learning Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Morning</span>
              <span>{analytics.timeOfDayStats.morning}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${timeOfDayMax > 0 ? (analytics.timeOfDayStats.morning / timeOfDayMax) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between">
              <span>Afternoon</span>
              <span>{analytics.timeOfDayStats.afternoon}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-600 h-1.5 rounded-full" 
                style={{ width: `${timeOfDayMax > 0 ? (analytics.timeOfDayStats.afternoon / timeOfDayMax) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between">
              <span>Evening</span>
              <span>{analytics.timeOfDayStats.evening}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-yellow-600 h-1.5 rounded-full" 
                style={{ width: `${timeOfDayMax > 0 ? (analytics.timeOfDayStats.evening / timeOfDayMax) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between">
              <span>Night</span>
              <span>{analytics.timeOfDayStats.night}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-600 h-1.5 rounded-full" 
                style={{ width: `${timeOfDayMax > 0 ? (analytics.timeOfDayStats.night / timeOfDayMax) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Weekly Learning Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.weeklyTrend.map((day, index) => (
              <div key={index} className="flex items-center">
                <span className="w-16 text-sm">{day.day}</span>
                <div className="flex-1 ml-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${Math.min(100, day.hours * 10)}%` }} // Assuming max 10 hours per day
                    ></div>
                  </div>
                </div>
                <span className="w-10 text-right text-sm">{day.hours}h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};