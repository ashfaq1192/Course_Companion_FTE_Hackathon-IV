# Course Companion FTE API Documentation

## Overview

The Course Companion FTE backend provides a Zero-Backend-LLM architecture where all intelligent processing happens in ChatGPT, while the backend handles deterministic operations like content delivery, progress tracking, quiz grading, and access control.

## Base URL

All API endpoints are prefixed with `/api/v1/`

## Authentication

The API uses JWT-based authentication. To access protected endpoints:

1. First, obtain a token by calling the `/api/v1/login` endpoint
2. Include the token in the Authorization header as `Bearer {token}`

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Authentication

#### POST /api/v1/register
Register a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2026-02-02T10:00:00Z",
  "updated_at": "2026-02-02T10:00:00Z"
}
```

#### POST /api/v1/login
Authenticate user and return access token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Content Management

#### GET /api/v1/content/{content_id}
Retrieve specific course content by ID

**Headers:**
- Authorization: Bearer {token}

**Parameters:**
- content_id (path): UUID of the content to retrieve

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Introduction to Python",
  "content_type": "text",
  "content_data": "# Introduction to Python...",
  "course_id": "python-basics",
  "chapter_number": 1,
  "section_number": 1,
  "is_available": true,
  "created_at": "2026-02-02T10:00:00Z",
  "updated_at": "2026-02-02T10:00:00Z"
}
```

#### GET /api/v1/content/by-course/{course_id}
Retrieve all content for a specific course

**Headers:**
- Authorization: Bearer {token}

**Parameters:**
- course_id (path): ID of the course
- skip (query, optional): Number of items to skip (default: 0)
- limit (query, optional): Maximum number of items to return (default: 100, max: 100)

**Response:**
```json
{
  "items": [...],
  "total": 10,
  "skip": 0,
  "limit": 100
}
```

#### GET /api/v1/content/search
Search course content by keywords

**Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- q (required): Search query
- course_id (optional): Limit search to specific course
- skip (optional): Number of items to skip (default: 0)
- limit (optional): Max items to return (default: 10, max: 50)

**Response:**
```json
{
  "items": [...],
  "total": 5,
  "skip": 0,
  "limit": 10
}
```

### Progress Tracking

#### GET /api/v1/progress/{content_id}
Get user progress for specific content

**Headers:**
- Authorization: Bearer {token}

**Parameters:**
- content_id (path): ID of the content

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "456e7890-f123-4567-b890-123456789abc",
  "content_id": "789a0123-b456-7890-c123-456789abcdef",
  "status": "in_progress",
  "completion_percentage": 50.0,
  "time_spent_seconds": 1200,
  "last_accessed_at": "2026-02-02T10:00:00Z",
  "completed_at": null,
  "created_at": "2026-02-02T09:00:00Z",
  "updated_at": "2026-02-02T10:00:00Z"
}
```

#### PUT /api/v1/progress/{content_id}
Update user progress for specific content

**Headers:**
- Authorization: Bearer {token}

**Parameters:**
- content_id (path): ID of the content

**Request Body:**
```json
{
  "status": "in_progress",
  "completion_percentage": 75.0,
  "time_spent_seconds": 1800
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "456e7890-f123-4567-b890-123456789abc",
  "content_id": "789a0123-b456-7890-c123-456789abcdef",
  "status": "in_progress",
  "completion_percentage": 75.0,
  "time_spent_seconds": 1800,
  "last_accessed_at": "2026-02-02T10:00:00Z",
  "completed_at": null,
  "created_at": "2026-02-02T09:00:00Z",
  "updated_at": "2026-02-02T10:00:00Z"
}
```

### Quiz Functionality

#### POST /api/v1/quiz/{content_id}/start
Start a quiz attempt

**Headers:**
- Authorization: Bearer {token}

**Parameters:**
- content_id (path): ID of the quiz content

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "456e7890-f123-4567-b890-123456789abc",
  "content_id": "789a0123-b456-7890-c123-456789abcdef",
  "score": 0.0,
  "total_questions": 10,
  "correct_answers": 0,
  "attempt_date": "2026-02-02T10:00:00Z",
  "time_taken_seconds": 0,
  "answers": "[]",
  "created_at": "2026-02-02T10:00:00Z"
}
```

#### POST /api/v1/quiz/{content_id}/submit
Submit quiz answers for grading

**Headers:**
- Authorization: Bearer {token}

**Parameters:**
- content_id (path): ID of the quiz content

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "question-uuid-1",
      "answer": "option-a"
    },
    {
      "question_id": "question-uuid-2", 
      "answer": "Correct answer text"
    }
  ]
}
```

**Response:**
```json
{
  "attempt": {...},
  "questions": [...],
  "results": [
    {
      "question_id": "question-uuid-1",
      "user_answer": "option-a",
      "is_correct": true,
      "explanation": "Explanation of the correct answer"
    }
  ]
}
```

### Subscription Management

#### GET /api/v1/subscriptions/current
Get current user's subscription information

**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "456e7890-f123-4567-b890-123456789abc",
  "subscription_type": "premium",
  "start_date": "2026-02-01",
  "end_date": "2026-03-01",
  "is_active": true,
  "payment_status": "paid",
  "created_at": "2026-02-01T10:00:00Z",
  "updated_at": "2026-02-01T10:00:00Z"
}
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request - Invalid request parameters or body
- `401`: Unauthorized - Invalid or missing authentication token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource does not exist
- `422`: Validation Error - Request validation failed
- `500`: Internal Server Error - Unexpected server error

Error responses follow this format:
```json
{
  "detail": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Anonymous users are limited to 100 requests per hour, while authenticated users are limited to 1000 requests per hour.

## Performance Expectations

- Content API calls: <200ms response time
- Progress API calls: <500ms response time
- Availability: 99.9% uptime