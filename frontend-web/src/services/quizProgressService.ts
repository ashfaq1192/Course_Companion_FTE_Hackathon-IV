import apiService from './api';

interface QuizProgress {
  id: string;
  userId: string;
  quizId: string;
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  timeSpent: number; // in seconds
  lastAccessed: string;
  isCompleted: boolean;
}

class QuizProgressService {
  private readonly STORAGE_KEY = 'quiz-progress';

  /**
   * Save quiz progress to local storage
   */
  public saveLocalProgress(quizId: string, progress: Omit<QuizProgress, 'id' | 'userId' | 'lastAccessed'>): void {
    try {
      const storedProgress = this.getLocalProgress();
      const updatedProgress = {
        ...storedProgress,
        [quizId]: {
          ...progress,
          lastAccessed: new Date().toISOString()
        }
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving quiz progress to local storage:', error);
    }
  }

  /**
   * Get quiz progress from local storage
   */
  public getLocalProgress(): { [key: string]: Omit<QuizProgress, 'id' | 'userId'> } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting quiz progress from local storage:', error);
      return {};
    }
  }

  /**
   * Get progress for a specific quiz from local storage
   */
  public getLocalQuizProgress(quizId: string): Omit<QuizProgress, 'id' | 'userId'> | null {
    const allProgress = this.getLocalProgress();
    return allProgress[quizId] || null;
  }

  /**
   * Remove quiz progress from local storage
   */
  public removeLocalProgress(quizId: string): void {
    try {
      const storedProgress = this.getLocalProgress();
      delete storedProgress[quizId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedProgress));
    } catch (error) {
      console.error('Error removing quiz progress from local storage:', error);
    }
  }

  /**
   * Save quiz progress to backend
   */
  public async saveProgressToBackend(progress: QuizProgress): Promise<void> {
    try {
      await apiService.put(`/quizzes/${progress.quizId}/progress`, {
        current_question_index: progress.currentQuestionIndex,
        answers: progress.answers,
        time_spent: progress.timeSpent,
        is_completed: progress.isCompleted
      });
    } catch (error) {
      console.error('Error saving quiz progress to backend:', error);
      // Fallback to saving locally if backend fails
      this.saveLocalProgress(progress.quizId, {
        quizId: progress.quizId,
        currentQuestionIndex: progress.currentQuestionIndex,
        answers: progress.answers,
        timeSpent: progress.timeSpent,
        isCompleted: progress.isCompleted
      });
      throw error;
    }
  }

  /**
   * Get quiz progress from backend
   */
  public async getProgressFromBackend(userId: string, quizId: string): Promise<QuizProgress | null> {
    try {
      const response = await apiService.get<QuizProgress>(`/quizzes/${quizId}/progress?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting quiz progress from backend:', error);
      return null;
    }
  }

  /**
   * Resume quiz progress - tries backend first, falls back to local storage
   */
  public async resumeQuizProgress(userId: string, quizId: string): Promise<Omit<QuizProgress, 'id' | 'userId'> | null> {
    // First try to get from backend
    const backendProgress = await this.getProgressFromBackend(userId, quizId);
    
    if (backendProgress) {
      // If we got progress from backend, update local storage with it
      this.saveLocalProgress(quizId, {
        quizId,
        currentQuestionIndex: backendProgress.currentQuestionIndex,
        answers: backendProgress.answers,
        timeSpent: backendProgress.timeSpent,
        isCompleted: backendProgress.isCompleted
      });
      return {
        quizId,
        currentQuestionIndex: backendProgress.currentQuestionIndex,
        answers: backendProgress.answers,
        timeSpent: backendProgress.timeSpent,
        isCompleted: backendProgress.isCompleted,
        lastAccessed: backendProgress.lastAccessed
      };
    }

    // If backend fails, try local storage
    const localProgress = this.getLocalQuizProgress(quizId);
    if (localProgress) {
      // Try to sync back to backend if possible
      this.syncLocalToBackend(userId, quizId, localProgress).catch(error => {
        console.error('Could not sync local progress to backend:', error);
      });
    }
    
    return localProgress;
  }

  /**
   * Sync local progress to backend
   */
  private async syncLocalToBackend(
    userId: string, 
    quizId: string, 
    localProgress: Omit<QuizProgress, 'id' | 'userId'>
  ): Promise<void> {
    const progressToSync: QuizProgress = {
      id: `local-${quizId}`, // Placeholder ID
      userId,
      ...localProgress,
      quizId,
    };
    
    await this.saveProgressToBackend(progressToSync);
    // After successful sync, remove from local storage
    this.removeLocalProgress(quizId);
  }

  /**
   * Clear all local quiz progress
   */
  public clearAllLocalProgress(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing all quiz progress:', error);
    }
  }

  /**
   * Get all quiz IDs with saved progress
   */
  public getQuizIdsWithProgress(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? Object.keys(JSON.parse(stored)) : [];
    } catch (error) {
      console.error('Error getting quiz IDs with progress:', error);
      return [];
    }
  }
}

export default new QuizProgressService();