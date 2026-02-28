---
id: "008"
title: "Migrate Railway to Render Free Tier"
stage: general
date: "2026-03-01"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 002-phase1-zero-backend-llm
user: ashfaq
command: migrate deployment platform
labels: ["deployment", "render", "railway", "docker", "hosting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend-full/render.yaml
  - backend-full/Dockerfile
  - chatgpt-app/openapi-actions.yaml
  - chatgpt-app/README.md
  - PROJECT_STATUS.md
tests: []
---

## Prompt

Railway credits are gone — migrate backend deployment to another free platform.

## Response

Selected Render (free tier). Created `backend-full/render.yaml` using existing Docker Hub image `ashfaq1192/course-companion-fte:latest`. Updated all Railway URL references to `https://course-companion-fte.onrender.com`. Dockerfile already uses `$PORT` env var — compatible with Render out of the box.

### Files Changed
- `backend-full/render.yaml` — new Render infra-as-code config (image deploy, env var stubs with sync:false for secrets)
- `backend-full/Dockerfile` — updated comment (Railway → Render/Railway)
- `chatgpt-app/openapi-actions.yaml` — replaced Railway URL with Render URL (server + OAuth comment)
- `chatgpt-app/README.md` — replaced Railway URL with Render URL in OAuth setup step
- `PROJECT_STATUS.md` — updated deployment notes

### Manual Steps Required
1. Sign up at render.com → New → Web Service → "Deploy an existing image"
2. Image: `docker.io/ashfaq1192/course-companion-fte:latest`
3. Set env vars (DATABASE_URL, SECRET_KEY, OPENAI_API_KEY, OAUTH_CLIENT_SECRET, Cloudflare vars)
4. Note the actual Render URL — update openapi-actions.yaml if it differs from `course-companion-fte.onrender.com`

## Outcome

Render config ready to deploy. All URL references updated. No code changes needed — Dockerfile already works with Render's $PORT convention.
