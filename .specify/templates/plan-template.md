# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: Python 3.11+ (for FastAPI backend), TypeScript (for Next.js frontend)
**Primary Dependencies**: FastAPI, Pydantic, OpenAI SDK, Next.js, React
**Storage**: Cloudflare R2 (course content), PostgreSQL-compatible (Neon/Supabase for progress/data)
**Testing**: pytest with contract and integration test frameworks
**Target Platform**: Linux server (backend), Web browsers (frontend)
**Project Type**: Dual-frontend architecture (ChatGPT App + Web App) with shared backend
**Performance Goals**: <200ms p95 for deterministic backend operations, 99.9% availability
**Constraints**: Zero LLM calls in backend during Phase 1, cost-efficient scaling to 100K+ users
**Scale/Scope**: Support 100K+ concurrent users, 99%+ consistency in educational delivery

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Compliance Verification:**
- [ ] Zero-Backend-LLM Architecture: No LLM calls in backend during Phase 1
- [ ] Deterministic Backend Services: Using FastAPI for content, navigation, quiz, progress APIs
- [ ] Test-First Development: Tests written before implementation
- [ ] Dual-Frontend Architecture: Separate codebases for ChatGPT App and Web App
- [ ] Hybrid Intelligence Justification: If Phase 2 features added, properly scoped and justified
- [ ] Agent Skills-First Design: Educational functionality through SKILL.md files

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
