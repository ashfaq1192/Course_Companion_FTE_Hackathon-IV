# API Integration Guide

## Overview

The Course Companion Web App communicates with the backend API through a service layer that handles all API interactions. This document describes the API integration approach and available services.

## Service Layer Architecture

The application uses a service layer pattern to abstract API interactions:

```
Component
    ↓
Hook/Controller
    ↓
Service Layer (e.g., contentService, quizService)
    ↓
apiService (central HTTP client)
    ↓
Backend API
```

## Available Services

### Content Service (`contentService.ts`)
Handles all content-related API interactions:
- Fetching course content
- Searching content
- Navigation between content items
- Grounded Q&A functionality

Key methods:
- `getContentByCourse(courseId)`
- `getContentById(contentId)`
- `searchContent(query, courseId?)`
- `getNextContent(contentId)`
- `getPrevContent(contentId)`

### Progress Service (`progressService.ts`)
Manages user progress tracking:
- Getting/setting content progress
- Calculating completion percentages
- Managing learning streaks

Key methods:
- `getProgress(contentId, userId)`
- `updateProgress(...)`
- `markAsCompleted(contentId, userId)`
- `getLearningStreak(userId)`

### Quiz Service (`quizService.ts`)
Handles quiz functionality:
- Fetching quiz questions
- Submitting quiz answers
- Getting quiz results
- LLM grading (premium feature)

Key methods:
- `getQuizQuestions(contentId)`
- `submitQuizAnswers(...)`
- `startQuizAttempt(...)`
- `requestLLMGrading(...)`

### User Service (`userService.ts`)
Manages user-related functionality:
- Profile management
- Subscription details
- Achievements
- Bookmarks

Key methods:
- `getCurrentUser()`
- `updateUserProfile(...)`
- `getUserSubscription()`
- `getUserAchievements(userId)`

## Central API Service (`apiService.ts`)

The `apiService` is the central HTTP client that handles:
- Authentication token management
- Request/response interceptors
- Error handling
- Base URL configuration

### Configuration
The API service reads the base URL from environment variables:
- `NEXT_PUBLIC_API_BASE_URL` - Base URL for API requests

### Authentication
The service automatically includes the authentication token in requests if available in local storage.

## Error Handling

API errors are handled through the `errorHandler.ts` service which:
- Formats error messages for user display
- Logs errors for monitoring
- Handles authentication errors (redirects to login)
- Provides retry mechanisms

## Caching

API responses are cached using the `cacheService.ts` to:
- Reduce redundant API calls
- Improve performance
- Handle offline scenarios
- Respect cache expiration times

## Environment Variables

Required environment variables for API integration:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_WS_BASE_URL` - WebSocket base URL (if applicable)

## Best Practices

1. Always use the service layer instead of making direct API calls
2. Handle errors appropriately using the error handler
3. Use React Query for server state management when possible
4. Implement proper loading and error states in components
5. Validate response data before using it
6. Follow the same patterns across all services