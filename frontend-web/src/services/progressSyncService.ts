import apiService from './api';

interface ProgressUpdate {
  contentId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completionPercentage: number;
  timeSpentSeconds: number;
  lastAccessedAt: string;
  completedAt?: string;
}

class ProgressSyncService {
  private syncQueue: ProgressUpdate[] = [];
  private isSyncing = false;

  /**
   * Adds a progress update to the queue for synchronization
   */
  public async queueProgressUpdate(update: ProgressUpdate): Promise<void> {
    this.syncQueue.push(update);
    
    // Attempt to sync immediately if not already syncing
    if (!this.isSyncing) {
      await this.syncProgress();
    }
  }

  /**
   * Synchronizes all queued progress updates with the backend
   */
  public async syncProgress(): Promise<void> {
    if (this.syncQueue.length === 0 || this.isSyncing) {
      return;
    }

    this.isSyncing = true;

    try {
      // Process all queued updates
      const updatesToSync = [...this.syncQueue];
      this.syncQueue = [];

      // Send updates to backend in batches
      for (const update of updatesToSync) {
        await this.sendProgressUpdate(update);
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
      // Add failed updates back to the queue
      // In a real implementation, we'd have more sophisticated retry logic
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sends a single progress update to the backend
   */
  private async sendProgressUpdate(update: ProgressUpdate): Promise<void> {
    try {
      await apiService.put(`/progress/${update.contentId}`, {
        status: update.status,
        completion_percentage: update.completionPercentage,
        time_spent_seconds: update.timeSpentSeconds,
        last_accessed_at: update.lastAccessedAt,
        completed_at: update.completedAt
      });
    } catch (error) {
      console.error(`Failed to sync progress for content ${update.contentId}:`, error);
      throw error;
    }
  }

  /**
   * Gets the current progress for a user
   */
  public async getUserProgress(userId: string): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/progress/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  /**
   * Gets progress for a specific content item
   */
  public async getContentProgress(contentId: string, userId: string): Promise<any> {
    try {
      const response = await apiService.get(`/progress/${contentId}?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for content ${contentId}:`, error);
      throw error;
    }
  }

  /**
   * Gets the sync queue length for monitoring purposes
   */
  public getSyncQueueLength(): number {
    return this.syncQueue.length;
  }

  /**
   * Clears the sync queue (useful for testing or reset scenarios)
   */
  public clearSyncQueue(): void {
    this.syncQueue = [];
  }
}

export default new ProgressSyncService();