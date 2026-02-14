import apiService from './api';

interface Content {
  id: string;
  title: string;
  content_type: string;
  content_data: string;
  course_id: string;
  chapter_number: number;
  section_number: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

class ContentService {
  /**
   * Get all content for a specific course
   */
  public async getContentByCourse(courseId: string): Promise<Content[]> {
    try {
      const response = await apiService.get<Content[]>(`/content/by-course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content by course:', error);
      throw error;
    }
  }

  /**
   * Get specific content by ID
   */
  public async getContentById(contentId: string): Promise<Content> {
    try {
      const response = await apiService.get<Content>(`/content/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  }

  /**
   * Search content by keywords
   */
  public async searchContent(query: string, courseId?: string): Promise<Content[]> {
    try {
      const params = new URLSearchParams({ q: query });
      if (courseId) params.append('course_id', courseId);
      
      const response = await apiService.get<Content[]>(`/content/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }

  /**
   * Get next content in sequence
   */
  public async getNextContent(contentId: string): Promise<Content> {
    try {
      const response = await apiService.get<Content>(`/content/${contentId}/next`);
      return response.data;
    } catch (error) {
      console.error('Error fetching next content:', error);
      throw error;
    }
  }

  /**
   * Get previous content in sequence
   */
  public async getPrevContent(contentId: string): Promise<Content> {
    try {
      const response = await apiService.get<Content>(`/content/${contentId}/prev`);
      return response.data;
    } catch (error) {
      console.error('Error fetching previous content:', error);
      throw error;
    }
  }

  /**
   * Get content for grounded Q&A
   */
  public async getGroundedQAContent(query: string, courseId?: string): Promise<Content[]> {
    try {
      const params = new URLSearchParams({ query });
      if (courseId) params.append('course_id', courseId);
      
      const response = await apiService.post<Content[]>('/content/grounded-qna', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching grounded QA content:', error);
      throw error;
    }
  }
}

export default new ContentService();