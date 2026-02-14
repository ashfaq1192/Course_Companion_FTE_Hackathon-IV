import { User } from '@/types';
import progressService from './progressService';
import quizService from './quizService';
import userService from './userService';
import { secureTokenStorage } from '@/utils/security';

class MainService {
  /**
   * Initialize the application with user data
   */
  public async initializeApp(): Promise<{ user: User | null; error?: string }> {
    try {
      // Check if user is already authenticated
      const token = secureTokenStorage.getToken();
      if (!token) {
        return { user: null };
      }

      // Verify token is still valid
      if (!this.isValidToken(token)) {
        secureTokenStorage.removeToken();
        secureTokenStorage.removeRefreshToken();
        return { user: null };
      }

      // Fetch user data
      const user = await userService.getCurrentUser();
      return { user };
    } catch (error) {
      console.error('Error initializing app:', error);
      return { user: null, error: (error as Error).message };
    }
  }

  /**
   * Check if token is valid (not expired)
   */
  private isValidToken(token: string): boolean {
    try {
      // Decode the token to check expiration
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired (with 5 minute buffer)
      return payload.exp > currentTime + 300;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Get user's course progress
   */
  public async getUserCourseProgress(courseId: string, userId: string) {
    try {
      // Get all progress records for the user in this course
      const progressRecords = await progressService.getCourseProgress(courseId, userId);
      
      // Calculate overall course progress
      const totalContents = progressRecords.length;
      const completedContents = progressRecords.filter(record => record.status === 'completed').length;
      const progressPercentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

      return {
        totalContents,
        completedContents,
        progressPercentage,
        details: progressRecords
      };
    } catch (error) {
      console.error('Error getting user course progress:', error);
      throw error;
    }
  }

  /**
   * Get personalized learning path for a user
   */
  public async getPersonalizedLearningPath(userId: string) {
    try {
      // Get user's progress data
      const allProgress = await progressService.getAllProgressForUser(userId);
      
      // Get user's quiz attempts
      const quizAttempts = await quizService.getQuizAttemptsForUser(userId);
      
      // Calculate recommendations based on progress and quiz performance
      const recommendations = this.calculateLearningRecommendations(allProgress, quizAttempts);
      
      return recommendations;
    } catch (error) {
      console.error('Error getting personalized learning path:', error);
      throw error;
    }
  }

  /**
   * Calculate learning recommendations based on progress and quiz performance
   */
  private calculateLearningRecommendations(progress: any[], quizAttempts: any[]) {
    // This is a simplified algorithm - in a real app, this would be more sophisticated
    const recommendations = [];
    
    // Find areas where user struggled (low quiz scores)
    const lowPerformingAreas = quizAttempts
      .filter(attempt => attempt.score < 70) // Below 70% threshold
      .map(attempt => attempt.content_id);
    
    // Suggest revisiting low-performing areas
    for (const contentId of lowPerformingAreas) {
      recommendations.push({
        type: 'review',
        contentId,
        reason: 'Low quiz score indicates need for review',
        priority: 'high'
      });
    }
    
    // Find incomplete content
    const incompleteContent = progress
      .filter(record => record.status !== 'completed')
      .map(record => record.content_id);
    
    // Suggest completing incomplete content
    for (const contentId of incompleteContent) {
      recommendations.push({
        type: 'continue',
        contentId,
        reason: 'Content not yet completed',
        priority: 'medium'
      });
    }
    
    // If user has been inactive, suggest starting with recent content
    if (progress.length > 0) {
      const mostRecent = progress.reduce((latest, current) => 
        new Date(current.last_accessed_at) > new Date(latest.last_accessed_at) ? current : latest
      );
      
      recommendations.push({
        type: 'resume',
        contentId: mostRecent.content_id,
        reason: 'Resume from where you left off',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  /**
   * Get user's dashboard data
   */
  public async getUserDashboardData(userId: string) {
    try {
      // Get user's progress
      const allProgress = await progressService.getAllProgressForUser(userId);
      
      // Get user's quiz attempts
      const quizAttempts = await quizService.getQuizAttemptsForUser(userId);
      
      // Get user's achievements
      const achievements = await userService.getUserAchievements(userId);
      
      // Calculate dashboard metrics
      const totalCourses = new Set(allProgress.map(p => p.content_id)).size;
      const completedCourses = allProgress.filter(p => p.status === 'completed').length;
      const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
      
      // Calculate hours learned (approximate)
      const totalHours = Math.round(
        allProgress.reduce((sum, record) => sum + (record.time_spent_seconds || 0), 0) / 3600
      );
      
      // Calculate current streak
      const streak = await progressService.getLearningStreak(userId);
      
      // Get recent achievements
      const recentAchievements = achievements.slice(0, 3);
      
      return {
        totalCourses,
        completedCourses,
        completionRate,
        totalHours,
        streak,
        recentAchievements,
        progress: allProgress,
        quizAttempts
      };
    } catch (error) {
      console.error('Error getting user dashboard data:', error);
      throw error;
    }
  }
}

export default new MainService();