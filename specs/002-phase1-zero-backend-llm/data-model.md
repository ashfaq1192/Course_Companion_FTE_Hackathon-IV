# Data Model: Phase 1 - Zero-Backend-LLM ChatGPT App

## Overview
This document defines the data model for the Phase 1 Zero-Backend-LLM ChatGPT App, including entities, relationships, and validation rules.

## Entity Definitions

### User
- **Description**: Represents a student or user of the system
- **Fields**:
  - `id` (UUID, Primary Key): Unique identifier for the user
  - `email` (String, 255, Unique, Required): User's email address
  - `hashed_password` (String, 255, Required): BCrypt hashed password
  - `full_name` (String, 255, Required): User's full name
  - `is_active` (Boolean, Default: True): Whether the account is active
  - `created_at` (DateTime, Required): Account creation timestamp
  - `updated_at` (DateTime, Required): Last update timestamp
- **Validation Rules**:
  - Email must be a valid email format
  - Password must meet minimum strength requirements
- **Relationships**:
  - One-to-many with ProgressRecord
  - One-to-many with QuizAttempt
  - One-to-one with Subscription

### CourseContent
- **Description**: Represents educational materials in structured format
- **Fields**:
  - `id` (UUID, Primary Key): Unique identifier for the content
  - `title` (String, 255, Required): Title of the content
  - `content_type` (String, 50, Required): Type of content (text, video, quiz, etc.)
  - `content_data` (Text, Required): The actual content in structured format (Markdown/JSON)
  - `course_id` (String, 100, Required): Identifier for the parent course
  - `chapter_number` (Integer, Required): Sequential number in the course
  - `section_number` (Integer, Optional): Section number within the chapter
  - `is_available` (Boolean, Default: True): Whether content is available to users
  - `created_at` (DateTime, Required): Creation timestamp
  - `updated_at` (DateTime, Required): Last update timestamp
- **Validation Rules**:
  - Content must be in valid Markdown or JSON format
  - Chapter numbers must be unique within a course
- **Relationships**:
  - Many-to-one with Course (implicit through course_id)
  - One-to-many with QuizQuestion (if content_type is quiz)

### ProgressRecord
- **Description**: Tracks user progress through course content
- **Fields**:
  - `id` (UUID, Primary Key): Unique identifier for the progress record
  - `user_id` (UUID, Foreign Key, Required): Reference to the user
  - `content_id` (UUID, Foreign Key, Required): Reference to the content
  - `status` (String, 20, Required): Status of progress (not_started, in_progress, completed)
  - `completion_percentage` (Float, Range: 0-100, Default: 0): Percentage of content completed
  - `time_spent_seconds` (Integer, Default: 0): Time spent on content in seconds
  - `last_accessed_at` (DateTime, Required): Last time content was accessed
  - `completed_at` (DateTime, Optional): Time when content was completed
  - `created_at` (DateTime, Required): Creation timestamp
  - `updated_at` (DateTime, Required): Last update timestamp
- **Validation Rules**:
  - Status must be one of the allowed values
  - Completion percentage must be between 0 and 100
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with CourseContent

### QuizQuestion
- **Description**: Represents individual quiz questions in JSON format
- **Fields**:
  - `id` (UUID, Primary Key): Unique identifier for the question
  - `content_id` (UUID, Foreign Key, Required): Reference to the parent content
  - `question_text` (Text, Required): The question text
  - `question_type` (String, 50, Required): Type of question (multiple_choice, true_false, short_answer)
  - `options` (JSON, Optional): Available options for multiple choice questions
  - `correct_answer` (Text, Required): The correct answer
  - `explanation` (Text, Optional): Explanation of the correct answer
  - `difficulty_level` (String, 20, Default: "medium"): Difficulty level (easy, medium, hard)
  - `created_at` (DateTime, Required): Creation timestamp
  - `updated_at` (DateTime, Required): Last update timestamp
- **Validation Rules**:
  - Question type must be one of the allowed values
  - For multiple choice, options must be provided
  - Correct answer must match one of the options for multiple choice questions
- **Relationships**:
  - Many-to-one with CourseContent

### QuizAttempt
- **Description**: Records user attempts at quizzes
- **Fields**:
  - `id` (UUID, Primary Key): Unique identifier for the attempt
  - `user_id` (UUID, Foreign Key, Required): Reference to the user
  - `content_id` (UUID, Foreign Key, Required): Reference to the quiz content
  - `score` (Float, Range: 0-100, Required): Score achieved on the quiz
  - `total_questions` (Integer, Required): Total number of questions in the quiz
  - `correct_answers` (Integer, Required): Number of correct answers
  - `attempt_date` (DateTime, Required): Date and time of the attempt
  - `time_taken_seconds` (Integer, Required): Time taken to complete the quiz
  - `answers` (JSON, Required): User's answers to the questions
  - `created_at` (DateTime, Required): Creation timestamp
- **Validation Rules**:
  - Score must be between 0 and 100
  - Correct answers must not exceed total questions
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with CourseContent

### Subscription
- **Description**: Manages user subscription status and access levels
- **Fields**:
  - `id` (UUID, Primary Key): Unique identifier for the subscription
  - `user_id` (UUID, Foreign Key, Unique, Required): Reference to the user
  - `subscription_type` (String, 50, Required): Type of subscription (free, premium)
  - `start_date` (Date, Required): Start date of the subscription
  - `end_date` (Date, Optional): End date of the subscription (null for ongoing)
  - `is_active` (Boolean, Default: True): Whether the subscription is currently active
  - `payment_status` (String, 20, Default: "pending"): Payment status (pending, paid, failed)
  - `created_at` (DateTime, Required): Creation timestamp
  - `updated_at` (DateTime, Required): Last update timestamp
- **Validation Rules**:
  - End date must be after start date if provided
  - Subscription type must be one of the allowed values
- **Relationships**:
  - Many-to-one with User

## Relationships

### User ↔ ProgressRecord
- One-to-many relationship
- A user can have multiple progress records
- Cascade delete: When a user is deleted, their progress records are also deleted

### User ↔ QuizAttempt
- One-to-many relationship
- A user can have multiple quiz attempts
- Cascade delete: When a user is deleted, their quiz attempts are also deleted

### User ↔ Subscription
- One-to-one relationship
- Each user has at most one subscription
- Cascade delete: When a user is deleted, their subscription is also deleted

### CourseContent ↔ ProgressRecord
- One-to-many relationship
- A piece of content can have multiple progress records from different users

### CourseContent ↔ QuizQuestion
- One-to-many relationship
- A piece of content can have multiple quiz questions (if it's a quiz)

### CourseContent ↔ QuizAttempt
- One-to-many relationship
- A piece of content can have multiple quiz attempts from different users

## Indexes

### Performance indexes to be created:
- `idx_user_email`: Index on User.email for fast login lookups
- `idx_progress_user_content`: Composite index on ProgressRecord.user_id and content_id for fast progress lookups
- `idx_content_course_chapter`: Composite index on CourseContent.course_id and chapter_number for ordered content retrieval
- `idx_quiz_attempt_user_date`: Index on QuizAttempt.user_id and attempt_date for historical analysis
- `idx_subscription_user_active`: Index on Subscription.user_id and is_active for quick access level checks

## Constraints

### Database constraints:
- Unique constraint on User.email
- Unique constraint on User.id - Subscription.user_id relationship
- Check constraint on ProgressRecord.completion_percentage (0-100 range)
- Check constraint on QuizAttempt.score (0-100 range)
- Foreign key constraints to maintain referential integrity