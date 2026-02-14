# Data Model: Phase 3 - Web App

**Feature**: Phase 3 - Web App | **Date**: 2026-02-04
**Input**: Feature specification from `/specs/004-phase3-web-app/spec.md`

## Overview

Data model for the standalone Web App frontend. The frontend will consume data from the existing backend services, but we'll define the client-side data structures and state management patterns needed for the web application.

## Client-Side State Structure

### 1. User State
- **currentUser**: Current authenticated user information
  - `id` (string): User identifier
  - `email` (string): User email
  - `fullName` (string): User's full name
  - `isActive` (boolean): Account status
  - `subscriptionType` (string): Free/premium status
  - `preferences` (object): User preferences and settings

- **authState**: Authentication-related state
  - `isLoggedIn` (boolean): Authentication status
  - `token` (string): Authentication token
  - `loading` (boolean): Auth operation status
  - `error` (string|null): Auth error message

### 2. Course Content State
- **courses**: Course catalog and content
  - `id` (string): Course identifier
  - `title` (string): Course title
  - `description` (string): Course description
  - `chapters` (array): Array of chapter objects
    - `id` (string): Chapter identifier
    - `title` (string): Chapter title
    - `sections` (array): Array of section objects
      - `id` (string): Section identifier
      - `title` (string): Section title
      - `contentType` (string): Type of content (text, video, quiz)
      - `contentData` (string): The actual content
      - `isAvailable` (boolean): Availability status

### 3. Progress State
- **progress**: User progress tracking
  - `userId` (string): Associated user
  - `contentId` (string): Content being tracked
  - `status` (string): Progress status (not_started, in_progress, completed)
  - `completionPercentage` (number): Completion percentage
  - `timeSpentSeconds` (number): Time spent on content
  - `lastAccessedAt` (date): Last access timestamp
  - `completedAt` (date|null): Completion timestamp

### 4. Quiz State
- **quizzes**: Quiz and assessment data
  - `quizId` (string): Quiz identifier
  - `contentId` (string): Associated content
  - `questions` (array): Array of question objects
    - `id` (string): Question identifier
    - `questionText` (string): The question text
    - `questionType` (string): Type (multiple_choice, true_false, short_answer)
    - `options` (array): Available options for multiple choice
    - `correctAnswer` (string): The correct answer
    - `explanation` (string): Explanation of correct answer
  - `attempts` (array): User's quiz attempts
    - `attemptId` (string): Attempt identifier
    - `userId` (string): User identifier
    - `score` (number): Score achieved (0-100)
    - `totalQuestions` (number): Total questions in quiz
    - `correctAnswers` (number): Number of correct answers
    - `attemptDate` (date): Date of attempt
    - `timeTakenSeconds` (number): Time taken to complete
    - `answers` (array): User's answers

### 5. Dashboard State
- **analytics**: Dashboard and analytics data
  - `userId` (string): Associated user
  - `period` (string): Time period (weekly, monthly, quarterly)
  - `totalCoursesCompleted` (number): Number of completed courses
  - `totalHoursLearned` (number): Total hours spent learning
  - `averageQuizScore` (number): Average quiz score
  - `currentStreak` (number): Current learning streak
  - `achievements` (array): Array of earned achievements
  - `upcomingDeadlines` (array): Array of upcoming deadlines

### 6. Admin State
- **adminData**: Administrative data (for admin users)
  - `userManagement` (object): User management data
    - `users` (array): List of users
    - `filters` (object): Applied filters
    - `pagination` (object): Pagination state
  - `courseManagement` (object): Course management data
    - `courses` (array): List of courses
    - `editMode` (boolean): Whether in edit mode
  - `analytics` (object): System analytics
    - `activeUsers` (number): Number of active users
    - `courseCompletions` (number): Number of course completions
    - `revenueMetrics` (object): Revenue-related metrics

## Client-Side Storage Strategy

### 1. In-Memory State (React State/Zustand)
- User session data
- UI state (modals, loading states, etc.)
- Temporary form data
- Navigation state

### 2. Local Storage
- User preferences
- Theme settings
- Offline content cache
- Authentication tokens (securely stored)

### 3. IndexedDB (for complex data)
- Large content caches
- Offline progress data
- Large datasets that need querying

## API Data Mapping

### Backend to Frontend Transformation
The frontend will transform backend API responses to suit client-side needs:

1. **Course Content**: Backend provides raw content, frontend organizes into hierarchical structure
2. **Progress Tracking**: Backend provides raw progress records, frontend aggregates for dashboard
3. **Quiz Results**: Backend provides attempt data, frontend calculates analytics
4. **User Data**: Backend provides user details, frontend combines with preferences

## Performance Considerations

### 1. Data Normalization
- Normalize data to reduce duplication
- Use unique IDs for relationships
- Denormalize for read performance where appropriate

### 2. Caching Strategy
- Cache API responses with React Query
- Implement stale-while-revalidate pattern
- Cache expensive computations
- Invalidate cache appropriately

### 3. Pagination
- Implement infinite scrolling for large lists
- Use cursor-based pagination where possible
- Preload next pages for better UX

## Security Considerations

### 1. Data Protection
- Sanitize all data before rendering
- Validate data structure before processing
- Protect against XSS through proper escaping
- Securely store sensitive data in client storage

### 2. Privacy
- Minimize data stored locally
- Implement data retention policies
- Allow users to clear local data
- Comply with privacy regulations

## Sync Strategy

### 1. Real-time Updates
- WebSocket connections for live updates
- Polling for critical data
- Event-driven updates for progress tracking

### 2. Offline Capability
- Queue operations when offline
- Sync when connection restored
- Conflict resolution for concurrent changes
- Notify users of sync status