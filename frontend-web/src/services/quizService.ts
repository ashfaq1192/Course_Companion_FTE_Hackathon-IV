import apiService from './api';

interface QuizQuestion {
  id: string;
  content_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching' | 'ordering';
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  content_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  attempt_date: string;
  time_taken_seconds: number;
  answers: string; // JSON string of user's answers
}

interface QuizSubmission {
  question_id: string;
  answer: string;
}

class QuizService {
  /**
   * Get quiz questions for a content item
   */
  public async getQuizQuestions(contentId: string): Promise<QuizQuestion[]> {
    try {
      const response = await apiService.get<QuizQuestion[]>(`/quizzes/${contentId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }

  /**
   * Submit quiz answers
   */
  public async submitQuizAnswers(
    contentId: string,
    userId: string,
    answers: QuizSubmission[]
  ): Promise<QuizAttempt> {
    try {
      const response = await apiService.post<QuizAttempt>(`/quizzes/${contentId}/submit`, {
        user_id: userId,
        answers: answers
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  }

  /**
   * Get quiz attempt by ID
   */
  public async getQuizAttempt(attemptId: string): Promise<QuizAttempt> {
    try {
      const response = await apiService.get<QuizAttempt>(`/quizzes/attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Get all quiz attempts for a user
   */
  public async getQuizAttemptsForUser(userId: string): Promise<QuizAttempt[]> {
    try {
      const response = await apiService.get<QuizAttempt[]>(`/quizzes/user/${userId}/attempts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz attempts for user:', error);
      throw error;
    }
  }

  /**
   * Get all quiz attempts for a content item
   */
  public async getQuizAttemptsForContent(contentId: string): Promise<QuizAttempt[]> {
    try {
      const response = await apiService.get<QuizAttempt[]>(`/quizzes/${contentId}/attempts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz attempts for content:', error);
      throw error;
    }
  }

  /**
   * Start a new quiz attempt
   */
  public async startQuizAttempt(contentId: string, userId: string): Promise<QuizAttempt> {
    try {
      const response = await apiService.post<QuizAttempt>(`/quizzes/${contentId}/start`, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Request LLM grading for an answer (premium feature)
   */
  public async requestLLMGrading(
    attemptId: string,
    questionId: string,
    answerText: string,
    context?: any
  ): Promise<any> {
    try {
      const response = await apiService.post('/quizzes/llm-grade', {
        attempt_id: attemptId,
        question_id: questionId,
        answer_text: answerText,
        context: context
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting LLM grading:', error);
      throw error;
    }
  }

  /**
   * Get quiz statistics
   */
  public async getQuizStatistics(contentId: string): Promise<any> {
    try {
      const response = await apiService.get(`/quizzes/${contentId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      throw error;
    }
  }
}

export default new QuizService();