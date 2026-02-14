import apiService from './api';

interface ProgressRecord {
  id: string;
  user_id: string;
  content_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  time_spent_seconds: number;
  last_accessed_at: string;
  completed_at?: string;
}

class ProgressService {
  /**
   * Get progress for a specific content item
   */
  public async getProgress(contentId: string, userId: string): Promise<ProgressRecord> {
    try {
      const response = await apiService.get<ProgressRecord>(`/progress/${contentId}?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  /**
   * Get all progress for a user
   */
  public async getAllProgressForUser(userId: string): Promise<ProgressRecord[]> {
    try {
      const response = await apiService.get<ProgressRecord[]>(`/progress/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all progress for user:', error);
      throw error;
    }
  }

  /**
   * Update progress for a content item
   */
  public async updateProgress(
    contentId: string,
    userId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    completionPercentage: number,
    timeSpentSeconds: number
  ): Promise<ProgressRecord> {
    try {
      const response = await apiService.put<ProgressRecord>(`/progress/${contentId}`, {
        user_id: userId,
        status,
        completion_percentage: completionPercentage,
        time_spent_seconds: timeSpentSeconds,
        last_accessed_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Mark content as completed
   */
  public async markAsCompleted(contentId: string, userId: string): Promise<ProgressRecord> {
    try {
      const response = await apiService.put<ProgressRecord>(`/progress/${contentId}`, {
        user_id: userId,
        status: 'completed',
        completion_percentage: 100,
        time_spent_seconds: 0, // This would be calculated in a real implementation
        last_accessed_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error marking content as completed:', error);
      throw error;
    }
  }

  /**
   * Get user's course progress
   */
  public async getCourseProgress(courseId: string, userId: string): Promise<ProgressRecord[]> {
    try {
      const response = await apiService.get<ProgressRecord[]>(`/progress/course/${courseId}?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw error;
    }
  }

  /**
   * Get user's learning streak
   */
  public async getLearningStreak(userId: string): Promise<number> {
    try {
      const response = await apiService.get<{ streak: number }>(`/progress/streak/${userId}`);
      return response.data.streak;
    } catch (error) {
      console.error('Error fetching learning streak:', error);
      throw error;
    }
  }
}

export default new ProgressService();