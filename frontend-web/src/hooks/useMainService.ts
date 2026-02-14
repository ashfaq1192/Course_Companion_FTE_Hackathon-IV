import { useState, useEffect } from 'react';
import mainService from '@/services/mainService';
import { User } from '@/types';

export const useMainService = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await mainService.initializeApp();
        
        if (result.error) {
          setError(result.error);
        }
        
        setUser(result.user);
      } catch (err) {
        setError((err as Error).message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Function to get user dashboard data
  const getUserDashboardData = async (userId: string) => {
    try {
      return await mainService.getUserDashboardData(userId);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // Function to get user course progress
  const getUserCourseProgress = async (courseId: string, userId: string) => {
    try {
      return await mainService.getUserCourseProgress(courseId, userId);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // Function to get personalized learning path
  const getPersonalizedLearningPath = async (userId: string) => {
    try {
      return await mainService.getPersonalizedLearningPath(userId);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    getUserDashboardData,
    getUserCourseProgress,
    getPersonalizedLearningPath
  };
};