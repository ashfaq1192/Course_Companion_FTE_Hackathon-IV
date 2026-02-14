---
id: "002"
title: "Remaining Audit Fixes"
stage: "general"
date_iso: "2026-02-07"
surface: "agent"
model: "Claude Opus 4.6"
feature: "none"
branch: "002-phase1-zero-backend-llm"
user: "user"
command: "implement-plan"
labels:
  - "audit"
  - "fixes"
  - "frontend"
  - "backend"
  - "chatgpt-app"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "frontend-web/src/services/apiService.ts (deleted)"
  - "frontend-web/src/services/authService.ts"
  - "frontend-web/src/services/contentService.ts"
  - "frontend-web/src/services/progressService.ts"
  - "frontend-web/src/services/quizService.ts"
  - "frontend-web/src/services/userService.ts"
  - "frontend-web/.eslintrc.json"
  - "frontend-web/jest.config.js"
  - "frontend-web/package.json"
  - "frontend-web/src/services/mainService.ts"
  - "frontend-web/src/utils/security.ts"
  - "frontend-web/src/pages/auth/login.tsx"
  - "frontend-web/src/pages/dashboard.tsx"
  - "frontend-web/tests/unit/example.test.ts"
  - "frontend-web/tests/integration/example.integration.test.ts"
  - "frontend-web/tests/a11y/example.a11y.test.ts"
  - "frontend-web/tests/responsive/example.responsive.test.ts"
  - "frontend-web/tests/e2e/example.e2e.test.ts"
  - "backend-phase1-zero-backend-llm/tests/contract/test_api_contracts.py"
  - "backend-phase1-zero-backend-llm/tests/contract/test_subscription_api.py"
  - "backend-phase1-zero-backend-llm/tests/integration/test_access_control.py"
  - "chatgpt-app/gpt-instructions.md"
  - "chatgpt-app/openapi-actions.yaml"
  - "chatgpt-app/README.md"
  - "README.md"
tests_yaml:
  - "pytest backend-phase1-zero-backend-llm/tests/ - 14 passed"
  - "npx jest frontend-web/tests/ - 37 passed"
  - "npx next build - compiled successfully"
  - "npx next lint - 0 errors"
prompt_text: |
  Implement the following plan:

  # Plan: Remaining Audit Fixes

  ## Tasks
  1. Remove duplicate API service file (apiService.ts)
  2. Fix ESLint configuration
  3. Run and fix backend tests
  4. Create ChatGPT App / Custom GPT configuration
  5. Replace placeholder frontend tests with real tests
  6. Add architecture diagram to README

response_text: |
  All 6 tasks completed successfully:
  1. Deleted duplicate apiService.ts, updated 5 imports to ./api
  2. Fixed ESLint config: added plugin:@typescript-eslint/recommended, installed packages, fixed errors/warnings
  3. Fixed 5 failing backend tests (403 vs 401 for HTTPBearer), all 14 now pass
  4. Created chatgpt-app/ with gpt-instructions.md, openapi-actions.yaml, README.md
  5. Replaced all 5 placeholder tests with real component/integration tests (37 tests total)
  6. Added Mermaid architecture diagram to README.md

  Verification: next build passes, next lint 0 errors, pytest 14/14 pass, jest 37/37 pass
---
