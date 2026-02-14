// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Content
  async getContent(contentId) {
    return this.request(`/content/${contentId}`);
  }

  async getContentByCourse(courseId) {
    return this.request(`/content/by-course/${courseId}`);
  }

  async searchContent(query) {
    return this.request(`/content/search?q=${encodeURIComponent(query)}`);
  }

  // Progress
  async getProgress(contentId) {
    return this.request(`/progress/${contentId}`);
  }

  async updateProgress(contentId, status, completionPercentage, timeSpentSeconds) {
    return this.request(`/progress/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        completion_percentage: completionPercentage,
        time_spent_seconds: timeSpentSeconds,
      }),
    });
  }

  async getUserProgress(userId) {
    return this.request(`/progress/user/${userId}`);
  }

  // Quiz
  async startQuiz(contentId) {
    return this.request(`/quiz/${contentId}/start`, {
      method: 'POST',
    });
  }

  async submitQuiz(contentId, answers) {
    return this.request(`/quiz/${contentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  }

  async getQuizAttempt(attemptId) {
    return this.request(`/quiz/attempts/${attemptId}`);
  }

  // Subscription
  async getCurrentSubscription() {
    return this.request('/subscriptions/current');
  }
}

export default new ApiClient();