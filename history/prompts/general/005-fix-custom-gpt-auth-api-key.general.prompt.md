---
id: "005"
title: "Fix Custom GPT Auth with Static API Key"
stage: general
date: "2026-02-19"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 002-phase1-zero-backend-llm
user: ashfaq1192
command: continue
labels: ["authentication", "custom-gpt", "railway", "api-key", "deployment"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend-full/src/core/config.py
  - backend-full/src/core/security.py
  - chatgpt-app/gpt-instructions.md
tests: []
---

## Prompt

(Continued from previous session) Custom GPT tested and showing authentication errors on all protected endpoints. Screenshots s1/s2/s3 showed:
- s1: registerUser works
- s2/s3: All protected endpoints fail with "Not authenticated" / "Authentication Required"

## Response

Root cause: Custom GPTs are **stateless** — they cannot persist JWT tokens between action calls. The GPT called loginUser, got a token, but couldn't attach it to subsequent calls.

### Fix Applied: Static API Key Authentication

1. **`config.py`**: Added `GPT_API_KEY` and `GPT_API_KEY_USER_EMAIL` settings
2. **`security.py`**: Modified `get_current_user` to check if Bearer token matches static `GPT_API_KEY`. If so, return the configured demo user (student@example.com, premium) directly — bypassing JWT decode entirely
3. **`gpt-instructions.md`**: Updated auth section to tell GPT it's pre-authenticated, do NOT call login first
4. **Railway env var**: Set `GPT_API_KEY=NaONj1PwC8QMZ4N7r-zYIh8YfxoI9xWjAofVUOJNnbM` via Railway CLI
5. **Docker image**: Rebuilt and pushed `ashfaq1192/course-companion-fte:latest`, triggered redeploy via GraphQL `serviceInstanceRedeploy`

### Verification

All endpoints tested with static API key:
- `/auth/me` → Demo Student (student@example.com) ✓
- `/content/by-course/gen-ai-fundamentals` → 5 chapters listed ✓
- `/subscriptions/current` → premium, active ✓
- `/quiz/1/start` → attempt_id returned, 3 questions ✓
- `/progress/1` → record returned ✓

### Custom GPT Actions Configuration Required

In the Custom GPT Actions editor, under Authentication:
- **Auth Type**: API Key
- **API Key**: `NaONj1PwC8QMZ4N7r-zYIh8YfxoI9xWjAofVUOJNnbM`
- **Auth Type in header**: Bearer

This makes OpenAI automatically include `Authorization: Bearer <key>` in every request.

## Outcome

✅ Static API key working on live Railway deployment
✅ All 5 core endpoint categories verified
✅ GPT instructions updated to skip login
✅ Code committed and pushed to GitHub
