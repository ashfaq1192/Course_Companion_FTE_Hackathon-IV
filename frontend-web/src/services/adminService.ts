import apiService from './api';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  activeCourses: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface UserUpdatePayload {
  id: string;
  email?: string;
  fullName?: string;
  subscriptionType?: string;
  isActive?: boolean;
}

interface CourseUpdatePayload {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  isActive?: boolean;
}

class AdminService {
  /**
   * Get admin dashboard statistics
   */
  public async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await apiService.get<AdminStats>('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  /**
   * Get all users with optional filters
   */
  public async getUsers(
    page: number = 1,
    limit: number = 10,
    filters?: { 
      subscriptionType?: string; 
      isActive?: boolean; 
      searchTerm?: string 
    }
  ): Promise<{ users: any[]; totalCount: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.subscriptionType) params.append('subscription_type', filters.subscriptionType);
      if (filters?.isActive !== undefined) params.append('is_active', filters.isActive.toString());
      if (filters?.searchTerm) params.append('search', filters.searchTerm);

      const response = await apiService.get<{ users: any[]; totalCount: number }>(`/admin/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Update user details
   */
  public async updateUser(payload: UserUpdatePayload): Promise<any> {
    try {
      const response = await apiService.put(`/admin/users/${payload.id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  public async deleteUser(userId: string): Promise<void> {
    try {
      await apiService.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get all courses with optional filters
   */
  public async getCourses(
    page: number = 1,
    limit: number = 10,
    filters?: { 
      category?: string; 
      level?: string; 
      isActive?: boolean; 
      searchTerm?: string 
    }
  ): Promise<{ courses: any[]; totalCount: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.category) params.append('category', filters.category);
      if (filters?.level) params.append('level', filters.level);
      if (filters?.isActive !== undefined) params.append('is_active', filters.isActive.toString());
      if (filters?.searchTerm) params.append('search', filters.searchTerm);

      const response = await apiService.get<{ courses: any[]; totalCount: number }>(`/admin/courses?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  /**
   * Update course details
   */
  public async updateCourse(payload: CourseUpdatePayload): Promise<any> {
    try {
      const response = await apiService.put(`/admin/courses/${payload.id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Delete a course
   */
  public async deleteCourse(courseId: string): Promise<void> {
    try {
      await apiService.delete(`/admin/courses/${courseId}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Get system settings
   */
  public async getSystemSettings(): Promise<any> {
    try {
      const response = await apiService.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  /**
   * Update system settings
   */
  public async updateSystemSettings(settings: any): Promise<any> {
    try {
      const response = await apiService.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  /**
   * Export data
   */
  public async exportData(type: 'users' | 'courses' | 'revenue', format: 'csv' | 'json'): Promise<Blob> {
    try {
      const response = await apiService.get<Blob>(`/admin/export/${type}?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Trigger system backup
   */
  public async triggerBackup(): Promise<any> {
    try {
      const response = await apiService.post('/admin/backup');
      return response.data;
    } catch (error) {
      console.error('Error triggering backup:', error);
      throw error;
    }
  }
}

export default new AdminService();