# Course Companion FTE - Custom GPT Setup

This directory contains the configuration files needed to create a Custom GPT in OpenAI's ChatGPT interface that serves as the Phase 1 student-facing frontend.

## Overview

In Phase 1 (Zero-Backend-LLM), the ChatGPT Custom GPT acts as the intelligent frontend while the backend remains deterministic with zero LLM calls. The GPT uses the backend's API via Actions to retrieve content, manage quizzes, and track progress — then uses its own intelligence to explain concepts, present questions engagingly, and celebrate achievements.

## Files

| File | Purpose |
|------|---------|
| `gpt-instructions.md` | System instructions for the Custom GPT |
| `openapi-actions.yaml` | OpenAPI 3.1 schema defining API Actions |

## Setup Steps

### 1. Deploy the Backend

Before creating the GPT, ensure the Phase 1 backend is running and accessible:

```bash
cd backend-phase1-zero-backend-llm/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

For production, deploy to a public URL (e.g., Railway, Render, or your preferred hosting).

### 2. Create the Custom GPT

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click your profile icon > **My GPTs** > **Create a GPT**
3. Switch to the **Configure** tab

### 3. Configure the GPT

**Name:** Course Companion FTE

**Description:** Your AI-powered learning companion. Navigate course content, take quizzes, track your progress, and get personalized explanations.

**Instructions:** Copy the contents of `gpt-instructions.md` into the Instructions field.

**Conversation Starters:**
- What course content would you like to explore today?
- Ready to test your knowledge with a quiz?
- Let's check your learning progress!
- Have a question about the course material?

### 4. Add API Actions

1. In the Configure tab, click **Create new action**
2. In the **Schema** field, paste the contents of `openapi-actions.yaml`
3. Update the `servers[0].url` in the schema to point to your deployed backend URL
4. Set **Authentication** to **API Key** with:
   - Auth Type: **Bearer**
   - Header name: `Authorization`
5. Click **Save**

### 5. Test the GPT

Test the following flows:
1. **Registration**: Ask the GPT to help you create an account
2. **Content browsing**: Ask about available course content
3. **Quiz taking**: Start a quiz and answer questions
4. **Progress checking**: Ask about your learning progress

## Architecture

```
Student <-> Custom GPT (ChatGPT) <-> Backend API (FastAPI)
                |                         |
           Intelligence              Data & Logic
          (explanations,            (content storage,
           presentation,            rule-based grading,
           encouragement)           progress tracking)
```

The key insight: ChatGPT provides the AI intelligence layer while the backend handles structured data operations with zero LLM cost.

## Troubleshooting

- **Actions not working**: Verify your backend URL is publicly accessible and CORS is configured
- **Authentication errors**: Ensure the Bearer token is being passed correctly
- **Content not found**: Seed your database with course content before testing
- **Rate limiting**: The backend has no built-in rate limiting; consider adding it for production
