# Quickstart Guide: Phase 2 - Hybrid Intelligence

**Feature**: Phase 2 - Hybrid Intelligence | **Date**: 2026-02-03
**Input**: Feature specification from `/specs/003-phase2-hybrid-intelligence/spec.md`

## Overview

This guide will help you set up and run the Phase 2 hybrid intelligence features for the Course Companion FTE project. Phase 2 adds selective backend intelligence that delivers clear additional educational value, is cost-justified as a premium feature, and is cleanly isolated from Phase 1 logic.

## Prerequisites

Before getting started with Phase 2, ensure you have:

1. **Completed Phase 1**: The Phase 1 backend (zero-LLM) is fully operational
2. **Environment**: Python 3.11+ installed
3. **Dependencies**: All Phase 1 dependencies installed and working
4. **LLM Provider Account**: An account with an LLM provider (OpenAI recommended initially)
5. **Database**: PostgreSQL database accessible and populated with Phase 1 data

## Setup Instructions

### 1. Clone and Navigate to Backend Directory

```bash
cd /path/to/hackathon-iv/backend
```

### 2. Install Phase 2 Dependencies

Add the new LLM-related dependencies to your environment:

```bash
pip install openai
```

Or if updating from requirements.txt:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Add the following environment variables to your `.env` file:

```bash
# LLM Provider Configuration
OPENAI_API_KEY=your_openai_api_key_here
LLM_PROVIDER=openai  # or anthropic, gemini, etc.

# Hybrid Intelligence Feature Flags
ENABLE_HYBRID_INTELLIGENCE=true
DEFAULT_LLM_MODEL=gpt-4-turbo  # or gpt-3.5-turbo for lower cost

# Cost Management
COST_TRACKING_ENABLED=true
USER_QUOTA_MONTHLY_REQUESTS=50  # Requests per user per month for hybrid features
RATE_LIMIT_PER_MINUTE=10  # Requests per minute per user for hybrid features
```

### 4. Database Migrations

Run the database migrations to create the new tables for hybrid intelligence features:

```bash
alembic upgrade head
```

This will create the tables for:
- AdaptiveLearningPath
- LLMGradeAssessment
- HybridFeatureUsage
- CostMetric

### 5. Run the Application

Start the backend server:

```bash
cd /path/to/hackathon-iv/backend
source venv/bin/activate  # if using virtual environment
uvicorn src.main:app --reload
```

The server will start on `http://localhost:8000` by default.

## API Endpoints

Once running, the following new hybrid intelligence endpoints will be available:

### Adaptive Learning Path
- `GET /api/v1/hybrid/adaptive-path` - Get personalized learning recommendations (Premium only)
- `POST /api/v1/hybrid/adaptive-path/regenerate` - Regenerate adaptive learning path (Premium only)

### LLM-Graded Assessments
- `POST /api/v1/hybrid/llm-grade-assessment` - Submit free-form answer for LLM grading (Premium only)

### Cost Tracking
- `GET /api/v1/hybrid/cost-metrics` - Get cost metrics for user (Premium only)

### Access Control
- All hybrid intelligence endpoints require valid authentication and premium subscription status

## Testing the Features

### 1. Verify Hybrid Intelligence Endpoints

Check that the new endpoints are available:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/v1/hybrid/adaptive-path
```

### 2. Test Adaptive Learning Path (Requires Premium Subscription)

```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_PREMIUM_USER_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"user_preferences": {"learning_style": "visual", "pace": "moderate"}}' \
     http://localhost:8000/api/v1/hybrid/adaptive-path
```

### 3. Test LLM Grading (Requires Premium Subscription)

```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_PREMIUM_USER_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"quiz_attempt_id": "123", "question_id": "456", "answer_text": "My detailed answer..."}' \
     http://localhost:8000/api/v1/hybrid/llm-grade-assessment
```

## Cost Management

### Monitoring Usage

Track your LLM usage and costs:

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
     http://localhost:8000/api/v1/hybrid/cost-metrics?user_id=SOME_USER_ID
```

### Setting Up Alerts

Configure alerts for when costs exceed thresholds by implementing webhook callbacks or scheduled checks against the cost metrics endpoint.

## Troubleshooting

### Common Issues

1. **401 Unauthorized on Hybrid Endpoints**
   - Ensure your JWT token is valid and corresponds to a premium user
   - Verify that the subscription is active

2. **500 Internal Server Error on LLM Calls**
   - Check that your LLM provider API key is valid and has sufficient quota
   - Verify that the LLM provider service is accessible

3. **Rate Limiting Errors**
   - Check that you're within the configured rate limits
   - Verify your user has not exceeded their monthly quota

### Debugging Tips

Enable debug logging by setting `DEBUG=true` in your environment to get more detailed logs about LLM interactions and cost tracking.

## Next Steps

1. Integrate the hybrid intelligence features with your frontend applications
2. Monitor cost metrics to optimize LLM usage
3. Gather user feedback on the value of adaptive learning paths and LLM-graded assessments
4. Consider expanding to additional hybrid intelligence features based on user demand and cost-effectiveness

## Production Deployment

For production deployment of Phase 2 features:

1. Ensure proper secrets management for LLM API keys
2. Set up monitoring and alerting for cost tracking
3. Implement proper load balancing and scaling for LLM-dependent operations
4. Plan for potential rate limiting from LLM providers
5. Set up proper backup and recovery for the new hybrid intelligence data