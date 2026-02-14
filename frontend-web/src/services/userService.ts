import apiService from './api';
import { User } from '@/types';

interface Subscription {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'premium';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
}

class UserService {
  /**
   * Get current user profile
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<User>('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   */
  public async getUserPreferences(): Promise<any> {
    try {
      const response = await apiService.get('/users/me/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  public async updateUserPreferences(preferences: any): Promise<any> {
    try {
      const response = await apiService.put('/users/me/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Get user subscription details
   */
  public async getUserSubscription(): Promise<Subscription> {
    try {
      const response = await apiService.get<Subscription>('/subscriptions/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw error;
    }
  }

  /**
   * Check if user has premium access
   */
  public async hasPremiumAccess(): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription();
      return subscription.is_active && subscription.subscription_type === 'premium';
    } catch (error) {
      console.error('Error checking premium access:', error);
      return false;
    }
  }

  /**
   * Get user achievements
   */
  public async getUserAchievements(userId: string): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/users/${userId}/achievements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }

  /**
   * Get user's learning history
   */
  public async getUserLearningHistory(userId: string): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/users/${userId}/learning-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user learning history:', error);
      throw error;
    }
  }

  /**
   * Get user's enrolled courses
   */
  public async getUserEnrolledCourses(userId: string): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/users/${userId}/enrolled-courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user enrolled courses:', error);
      throw error;
    }
  }

  /**
   * Update user's course enrollment
   */
  public async enrollInCourse(courseId: string): Promise<any> {
    try {
      const response = await apiService.post('/users/me/enrollments', { course_id: courseId });
      return response.data;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  /**
   * Unenroll from a course
   */
  public async unenrollFromCourse(courseId: string): Promise<any> {
    try {
      const response = await apiService.delete(`/users/me/enrollments/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      throw error;
    }
  }

  /**
   * Get user's bookmarked content
   */
  public async getUserBookmarks(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/users/me/bookmarks');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      throw error;
    }
  }

  /**
   * Add content to bookmarks
   */
  public async addToBookmarks(contentId: string): Promise<any> {
    try {
      const response = await apiService.post('/users/me/bookmarks', { content_id: contentId });
      return response.data;
    } catch (error) {
      console.error('Error adding to bookmarks:', error);
      throw error;
    }
  }

  /**
   * Remove content from bookmarks
   */
  public async removeFromBookmarks(contentId: string): Promise<any> {
    try {
      const response = await apiService.delete(`/users/me/bookmarks/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from bookmarks:', error);
      throw error;
    }
  }
}

export default new UserService();