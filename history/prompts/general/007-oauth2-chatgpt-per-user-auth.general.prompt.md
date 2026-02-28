---
id: "007"
title: "OAuth 2.0 ChatGPT Per-User Auth"
stage: general
date: "2026-03-01"
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 002-phase1-zero-backend-llm
user: ashfaq
command: implement plan
labels: ["oauth", "chatgpt", "authentication", "per-user", "jwt"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend-full/src/api/oauth.py
  - backend-full/src/core/config.py
  - backend-full/src/main.py
  - backend-full/.env
  - chatgpt-app/gpt-instructions.md
  - chatgpt-app/README.md
  - chatgpt-app/openapi-actions.yaml
tests: []
---

## Prompt

Implement the following plan:

# Plan: Per-User OAuth 2.0 for ChatGPT App Progress Sync

The ChatGPT Custom GPT currently uses a static API key that maps every ChatGPT user to a single shared backend account (`student@example.com`). This means all users share the same progress. The fix is OAuth 2.0 Authorization Code Flow. With OAuth, ChatGPT stores a per-user token and sends it automatically on every API call, giving each student their own backend identity.

[Full plan included files to create/modify: oauth.py, config.py, main.py, .env, gpt-instructions.md, README.md, openapi-actions.yaml]

## Response

Implemented OAuth 2.0 Authorization Code Flow across 7 files:

### Created
- `backend-full/src/api/oauth.py` — Three endpoints:
  - `GET /api/v1/oauth/authorize` — serves HTML login/register page with Sign In / Register tabs, inline CSS, dark blue gradient header
  - `POST /api/v1/oauth/authorize` — validates credentials or registers new user, issues 5-min auth code, redirects to ChatGPT callback
  - `POST /api/v1/oauth/token` — validates client_secret + code, returns 7-day JWT
  - In-memory `_auth_codes` dict with expiry cleanup; reuses `authenticate_user`, `create_access_token`, `get_password_hash` from security.py

### Modified
- `backend-full/src/core/config.py` — Added `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` settings
- `backend-full/src/main.py` — Imported and registered `oauth_router` at `/api/v1`
- `backend-full/.env` — Added `OAUTH_CLIENT_ID=course-companion-fte-gpt` and `OAUTH_CLIENT_SECRET=cc-fte-oauth-2026-hackathon-secret`
- `chatgpt-app/gpt-instructions.md` — Updated Authentication section: removed static API key narrative, replaced with OAuth flow explanation
- `chatgpt-app/README.md` — Updated Step 4 from API Key auth to OAuth with all required URLs and settings
- `chatgpt-app/openapi-actions.yaml` — Added OAuth config comment block at top

### Verification
Import check passed: `oauth.py imports OK`
Router registration confirmed: `/api/v1/oauth/authorize` (GET+POST), `/api/v1/oauth/token` (POST)

### Next Step (manual)
Deploy updated backend to Railway, then in GPT Builder switch Authentication from API Key to OAuth using the documented URLs and credentials.

## Outcome

All 7 files modified/created. OAuth endpoints verified importable and registered. Static API key fallback preserved for dev/legacy use.
