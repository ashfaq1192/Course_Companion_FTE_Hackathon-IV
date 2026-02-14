# Data Model: Phase 3 - Web App

**Feature**: Phase 3 - Web App | **Date**: 2026-02-03
**Input**: Feature specification from `/specs/spec.md`

## Overview

Data model extensions for the standalone Web App in the Course Companion FTE project. This includes new entities for dashboard widgets, progress visualization, admin panels, and responsive web components that build upon the existing Phase 1-2 data models.

## Entity Relationships

```
[User] 1 ---- * [DashboardWidget] 1 ---- * [WidgetConfiguration]
[User] 1 ---- * [ProgressVisualization] 
[User] 1 ---- * [AdminActionLog]

[Course] 1 ---- * [AdminCourseAnalytics]
[User] 1 ---- * [AdminUserAnalytics]

[DashboardWidget] * ---- * [WidgetDataMapping]
[ResponsiveLayout] 1 ---- * [DeviceProfile]
```

## Detailed Entity Descriptions

### 1. DashboardWidget
- **Description**: Represents a configurable widget on the user dashboard
- **Attributes**:
  - `id` (UUID, Primary Key): Unique identifier for the widget
  - `user_id` (UUID, Foreign Key): Reference to the user this widget belongs to
  - `widget_type` (String, 50, Required): Type of widget (progress_chart, recent_activity, upcoming_deadlines, achievements)
  - `title` (String, 100, Required): Display title for the widget
  - `config` (JSON, Optional): Widget-specific configuration settings
  - `position_x` (Integer, Required): X coordinate position in dashboard grid
  - `position_y` (Integer, Required): Y coordinate position in dashboard grid
  - `width` (Integer, Required): Width of the widget in grid units
  - `height` (Integer, Required): Height of the widget in grid units
  - `data_source` (String, 200, Required): API endpoint for the widget's data
  - `created_at` (DateTime, Required): Timestamp when the widget was created
  - `updated_at` (DateTime, Optional): Timestamp when the widget was last updated

- **Constraints**:
  - `user_id` must reference an existing user
  - `widget_type` must be one of the allowed values
  - `position_x` and `position_y` must be non-negative
  - `width` and `height` must be positive integers
  - `created_at` must be in the past

- **Indexes**:
  - `idx_dashboard_widget_user`: Index on user_id for quick user dashboard retrieval
  - `idx_dashboard_widget_type`: Index on widget_type for widget type queries

- **Relationships**:
  - Belongs to one User
  - Links to data source endpoints

### 2. ProgressVisualization
- **Description**: Stores formatted data for progress visualization in the web app
- **Attributes**:
  - `id` (UUID, Primary Key): Unique identifier for the visualization data
  - `user_id` (UUID, Foreign Key): Reference to the user this visualization is for
  - `time_series_data` (JSON, Required): Time-series data for progress charts
  - `course_breakdown` (JSON, Required): Breakdown of progress by course
  - `achievement_badges` (JSON, Optional): List of user's achievement badges
  - `overall_stats` (JSON, Required): Overall statistics summary
  - `time_range` (String, 20, Required): Time range for the visualization (week, month, quarter, year)
  - `generated_at` (DateTime, Required): Timestamp when the visualization was generated
  - `is_cached` (Boolean, Default: True): Whether this is cached data

- **Constraints**:
  - `user_id` must reference an existing user
  - `time_range` must be one of the allowed values
  - `generated_at` must be in the past
  - `time_series_data` must contain valid time series format

- **Indexes**:
  - `idx_progress_viz_user`: Index on user_id for quick user visualization retrieval
  - `idx_progress_viz_range`: Index on time_range for time-based queries

- **Relationships**:
  - Belongs to one User
  - References multiple ProgressRecords for data

### 3. AdminCourseAnalytics
- **Description**: Stores analytics data for courses in the admin panel
- **Attributes**:
  - `id` (UUID, Primary Key): Unique identifier for the analytics record
  - `course_id` (String, 100, Required): Reference to the course
  - `enrollment_count` (Integer, Required): Number of students enrolled
  - `completion_count` (Integer, Required): Number of students who completed
  - `completion_rate` (Float, Required): Percentage of students who completed
  - `avg_rating` (Float, Optional): Average rating for the course
  - `avg_time_to_complete` (Integer, Optional): Average time to complete in minutes
  - `recent_activity` (JSON, Optional): Recent activity data
  - `created_at` (DateTime, Required): Timestamp when the analytics were calculated
  - `updated_at` (DateTime, Optional): Timestamp when the analytics were last updated

- **Constraints**:
  - `course_id` must reference an existing course
  - `enrollment_count` must be non-negative
  - `completion_rate` must be between 0 and 1
  - `avg_rating` must be between 1 and 5 if provided

- **Indexes**:
  - `idx_admin_analytics_course`: Index on course_id for course analytics retrieval
  - `idx_admin_analytics_updated`: Index on updated_at for freshness queries

- **Relationships**:
  - References Course content
  - Links to multiple User progress records

### 4. AdminUserAnalytics
- **Description**: Stores analytics data for users in the admin panel
- **Attributes**:
  - `id` (UUID, Primary Key): Unique identifier for the analytics record
  - `user_id` (UUID, Foreign Key): Reference to the user
  - `courses_enrolled` (Integer, Required): Number of courses the user is enrolled in
  - `courses_completed` (Integer, Required): Number of courses completed
  - `total_hours_learned` (Float, Required): Total hours spent learning
  - `avg_quiz_score` (Float, Optional): Average score on quizzes
  - `current_streak_days` (Integer, Optional): Current learning streak in days
  - `last_activity_date` (Date, Required): Date of last activity
  - `engagement_score` (Float, Optional): Calculated engagement score
  - `created_at` (DateTime, Required): Timestamp when the analytics were calculated
  - `updated_at` (DateTime, Optional): Timestamp when the analytics were last updated

- **Constraints**:
  - `user_id` must reference an existing user
  - `courses_enrolled` and `courses_completed` must be non-negative
  - `total_hours_learned` must be non-negative
  - `avg_quiz_score` must be between 0 and 100 if provided
  - `current_streak_days` must be non-negative

- **Indexes**:
  - `idx_admin_user_analytics_user`: Index on user_id for user analytics retrieval
  - `idx_admin_user_analytics_engagement`: Index on engagement_score for sorting

- **Relationships**:
  - Belongs to one User
  - References multiple ProgressRecords and QuizAttempts

### 5. ResponsiveLayout
- **Description**: Stores responsive layout configurations for different devices
- **Attributes**:
  - `id` (UUID, Primary Key): Unique identifier for the layout configuration
  - `device_type` (String, 50, Required): Type of device (mobile, tablet, desktop, tv)
  - `breakpoints` (JSON, Required): Breakpoint definitions for responsive design
  - `grid_columns` (Integer, Required): Number of grid columns for this layout
  - `component_configs` (JSON, Required): Configuration for different components
  - `navigation_style` (String, 50, Required): Navigation style (sidebar, topbar, hamburger)
  - `theme_config` (JSON, Optional): Theme-specific configurations
  - `created_at` (DateTime, Required): Timestamp when the layout was created
  - `updated_at` (DateTime, Optional): Timestamp when the layout was last updated

- **Constraints**:
  - `device_type` must be one of the allowed values
  - `grid_columns` must be a positive integer
  - `breakpoints` must contain valid breakpoint definitions
  - `navigation_style` must be one of the allowed values

- **Indexes**:
  - `idx_responsive_layout_device`: Index on device_type for device-specific layouts

- **Relationships**:
  - Links to multiple DeviceProfiles

### 6. AdminActionLog
- **Description**: Logs administrative actions for audit and security purposes
- **Attributes**:
  - `id` (UUID, Primary Key): Unique identifier for the log entry
  - `admin_user_id` (UUID, Foreign Key): Reference to the admin user who performed the action
  - `action_type` (String, 100, Required): Type of administrative action (user_modify, course_create, content_edit)
  - `target_entity_type` (String, 50, Required): Type of entity affected (user, course, content)
  - `target_entity_id` (String, 100, Required): ID of the entity affected
  - `action_details` (JSON, Required): Details about the action performed
  - `ip_address` (String, 45, Optional): IP address of the admin user
  - `user_agent` (Text, Optional): User agent string of the admin's browser
  - `timestamp` (DateTime, Required): When the action was performed
  - `success` (Boolean, Required): Whether the action was successful

- **Constraints**:
  - `admin_user_id` must reference an existing user with admin privileges
  - `action_type` must be one of the allowed values
  - `target_entity_type` must be one of the allowed values
  - `timestamp` must be in the past

- **Indexes**:
  - `idx_admin_log_admin`: Index on admin_user_id for admin-specific logs
  - `idx_admin_log_timestamp`: Index on timestamp for chronological queries
  - `idx_admin_log_action_type`: Index on action_type for action-specific queries

- **Relationships**:
  - Belongs to one Admin User
  - References target entities (users, courses, content)

## Migration Strategy

### Phase 1: Schema Creation
1. Create new tables for DashboardWidget, ProgressVisualization, AdminCourseAnalytics, AdminUserAnalytics, ResponsiveLayout, and AdminActionLog
2. Add necessary indexes for performance
3. Establish foreign key relationships with existing entities

### Phase 2: Data Population
1. Populate ResponsiveLayout with default configurations for common device types
2. Generate initial analytics for existing courses and users
3. Create default dashboard layouts for new users

### Phase 3: Integration
1. Connect new models to services and API endpoints
2. Implement caching strategies for visualization data
3. Add audit logging for administrative actions

## Performance Considerations

- Use UUIDs for primary keys to ensure global uniqueness across distributed systems
- Implement proper indexing on frequently queried fields
- Consider partitioning large tables (like AdminActionLog) by date
- Cache frequently accessed visualization data with appropriate expiration
- Archive older analytics data to separate tables for performance

## Security Considerations

- Ensure all user data is properly linked to prevent cross-user data access
- Implement proper access controls at the database level for admin functions
- Encrypt sensitive data if required by privacy regulations
- Log all administrative actions for audit purposes
- Implement proper row-level security for admin analytics