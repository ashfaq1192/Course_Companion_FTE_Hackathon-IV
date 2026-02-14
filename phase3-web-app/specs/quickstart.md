# Quickstart Guide: Phase 3 - Web App

**Feature**: Phase 3 - Web App | **Date**: 2026-02-03
**Input**: Feature specification from `/specs/spec.md`

## Overview

This guide will help you set up and run the Phase 3 standalone Web App for the Course Companion FTE project. Phase 3 provides a full web-based interface with comprehensive LMS features, including dashboards, progress visualization, and course management tools.

## Prerequisites

Before getting started with Phase 3, ensure you have:

1. **Completed Phases 1 & 2**: The Phase 1 (zero-LLM) and Phase 2 (hybrid intelligence) backends are fully operational
2. **Frontend Environment**: Node.js 18+ and npm/yarn installed
3. **Backend Environment**: Python 3.11+ installed
4. **Dependencies**: All Phase 1-2 dependencies installed and working
5. **Database**: PostgreSQL database accessible and populated with Phase 1-2 data
6. **LLM Provider Account**: An account with an LLM provider (if Phase 2 features enabled)

## Frontend Setup Instructions

### 1. Navigate to Frontend Directory

```bash
cd /path/to/hackathon-iv/phase3-web-app/frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME="Course Companion FTE Web App"
NEXT_PUBLIC_DEFAULT_THEME=light
```

### 4. Run the Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000` by default.

## Backend Setup Instructions

### 1. Navigate to Backend Directory

```bash
cd /path/to/hackathon-iv/phase3-web-app/backend
```

### 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# API Configuration
API_V1_STR=/api/v1
APP_NAME="Course Companion FTE Web App Backend"
APP_VERSION=1.0.0
DEBUG=true

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./course_companion.db
# Or for PostgreSQL: postgresql://user:password@localhost/dbname

# Cloud Storage (Cloudflare R2)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET=your_bucket_name

# LLM Configuration (for Phase 2 features)
OPENAI_API_KEY=your_openai_api_key
DEFAULT_LLM_MODEL=gpt-3.5-turbo
ENABLE_HYBRID_INTELLIGENCE=true
COST_TRACKING_ENABLED=true
USER_QUOTA_MONTHLY_REQUESTS=50
RATE_LIMIT_PER_MINUTE=10

# CORS
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:3000,http://localhost:8080

# Performance
CONTENT_API_TIMEOUT_MS=200
PROGRESS_API_TIMEOUT_MS=500

# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
```

### 4. Run the Backend Server

```bash
uvicorn src.main:app --reload
```

The backend will start on `http://localhost:8000` by default.

## API Endpoints

The backend provides the same API endpoints as Phases 1 and 2:

### Core Endpoints
- `GET /api/v1/content/{content_id}` - Get specific content
- `GET /api/v1/content/by-course/{course_id}` - Get content by course
- `GET /api/v1/content/search` - Search content
- `GET /api/v1/progress/{content_id}` - Get user progress for content
- `PUT /api/v1/progress/{content_id}` - Update user progress
- `GET /api/v1/progress/user/{user_id}` - Get all progress for user
- `POST /api/v1/quiz/{content_id}/start` - Start a quiz
- `POST /api/v1/quiz/{content_id}/submit` - Submit quiz answers
- `GET /api/v1/quiz/attempts/{attempt_id}` - Get quiz attempt details
- `GET /api/v1/subscriptions/current` - Get current user's subscription

### Hybrid Intelligence Endpoints (Phase 2 features)
- `GET /api/v1/hybrid/adaptive-path` - Get user's adaptive learning path
- `POST /api/v1/hybrid/adaptive-path` - Generate new adaptive learning path
- `POST /api/v1/hybrid/llm-grade-assessment` - Grade assessment with LLM
- `GET /api/v1/hybrid/cost-metrics` - Get cost metrics for user

### Web App Specific Endpoints
- `GET /api/v1/web/dashboard/widgets` - Get dashboard widgets for user
- `GET /api/v1/web/progress/visualization` - Get progress visualization data
- `GET /api/v1/web/admin/courses` - Get courses for admin panel
- `GET /api/v1/web/admin/users` - Get users for admin panel
- `GET /api/v1/web/responsive/layout` - Get responsive layout configuration

## Frontend Pages

The frontend provides these main pages:

- `/` - Home page with course access
- `/dashboard` - Learning dashboard with progress visualization
- `/courses` - Browse available courses
- `/progress` - Detailed progress tracking
- `/quiz` - Take quizzes and assessments
- `/admin` - Administrative functions (admin users only)

## Testing the Web App

### 1. Verify Frontend and Backend Communication

Check that the frontend can communicate with the backend:

```bash
curl http://localhost:8000/api/v1/openapi.json
```

### 2. Test Frontend Functionality

Visit the frontend at `http://localhost:3000` and verify:

- Homepage loads correctly
- Navigation works
- User can register/login
- Course content displays properly
- Progress tracking works
- Quiz functionality operates correctly

### 3. Test Phase 2 Features (if enabled)

If hybrid intelligence features are enabled, verify:

- Premium users can access adaptive learning paths
- LLM-graded assessments work for premium users
- Cost tracking functions properly

## Production Deployment

For production deployment of Phase 3:

1. Build the frontend for production:
   ```bash
   npm run build
   ```

2. Set up proper environment variables for production
3. Configure reverse proxy (nginx, Apache) to serve frontend and proxy API requests to backend
4. Set up SSL certificates for HTTPS
5. Configure proper database connection for production
6. Set up monitoring and logging
7. Implement proper backup strategies
8. Set up CI/CD pipeline for automated deployments

## Troubleshooting

### Common Issues

1. **Frontend Cannot Connect to Backend**
   - Ensure backend is running on the configured port
   - Check that NEXT_PUBLIC_API_BASE_URL is set correctly
   - Verify CORS settings in backend configuration

2. **Page Loads But Content Doesn't Display**
   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible
   - Confirm user authentication is working

3. **Slow Performance**
   - Check database connection speed
   - Verify CDN is properly configured for static assets
   - Review API response times

### Debugging Tips

Enable debug logging by setting `DEBUG=true` in your environment to get more detailed logs from both frontend and backend.