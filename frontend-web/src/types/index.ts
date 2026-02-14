
// Global types for the Course Companion Web App

export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  subscriptionType: 'free' | 'premium' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
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

export interface ProgressRecord {
  id: string;
  user_id: string;
  content_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  time_spent_seconds: number;
  last_accessed_at: string;
  completed_at?: string;
}

export interface QuizQuestion {
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

export interface QuizAttempt {
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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned_date: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Subscription {
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

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}