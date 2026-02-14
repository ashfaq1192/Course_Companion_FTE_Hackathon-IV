# Implementation Plan: Phase 3 - Web App

**Branch**: `003-phase3-web-app` | **Date**: 2026-02-03 | **Spec**: [link to spec.md]
**Input**: Feature specification from `/specs/003-phase3-web-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Phase 3 of the Course Companion FTE project implements a full standalone Web App with comprehensive LMS features. This provides a complete web-based interface separate from the ChatGPT App, offering rich dashboards, progress visualization, and course management tools. The implementation builds upon the backend services from Phases 1 and 2 while adding web-specific frontend functionality.

## Technical Context

**Frontend Language/Version**: JavaScript/TypeScript with React 18+, Next.js 14+
**Backend Language/Version**: Python 3.11+ (extending existing FastAPI backend from Phases 1-2)
**Frontend Libraries**: Next.js, React, Tailwind CSS, Chart.js for visualizations
**Backend Libraries**: FastAPI, Pydantic, SQLAlchemy (extending from Phases 1-2)
**Storage**: PostgreSQL (user data, progress tracking), Cloudflare R2 (course content)
**Testing**: Jest/React Testing Library for frontend, pytest for backend
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) with responsive design
**Project Type**: Standalone Web App with comprehensive LMS features
**Performance Goals**: <3s initial load, <1s page transitions, 99.9% availability
**Constraints**: Must integrate with existing backend APIs from Phases 1-2, responsive design for all screen sizes
**Scale/Scope**: Support 100K+ concurrent users with responsive web interface

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Compliance Verification:**
- [x] Zero-Backend-LLM Architecture: Backend from Phase 1 still applies to core functionality
- [x] Deterministic Backend Services: Using FastAPI for content, navigation, quiz, progress APIs
- [x] Test-First Development: Tests written before implementation
- [x] Dual-Frontend Architecture: Separate codebases for ChatGPT App and Web App (fulfilled)
- [x] Hybrid Intelligence Justification: Phase 2 features available to premium users via web app
- [x] Agent Skills-First Design: Educational functionality through SKILL.md files (extended for web app)

**Post-Design Verification:**
- [ ] All web app UI components follow accessibility standards (WCAG 2.1 AA)
- [ ] Responsive design works across all targeted device sizes
- [ ] Integration with Phase 1-2 backend APIs functions correctly
- [ ] Performance goals met for web app experience
- [ ] Admin panel provides comprehensive course management tools

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

### Source Code (dual frontend with shared backend)

```text
frontend/
├── pages/
│   ├── index.js
│   ├── dashboard.js
│   ├── courses.js
│   ├── progress.js
│   ├── quiz.js
│   └── admin/
├── components/
│   ├── Header.js
│   ├── ProgressBar.js
│   ├── DashboardWidgets/
│   └── QuizComponents/
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── utils/
│   └── api.js
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js

backend/
├── src/
│   ├── models/
│   ├── services/
│   ├── api/
│   ├── database/
│   └── core/
├── requirements.txt
└── main.py

tests/
├── frontend/
│   ├── __tests__/
│   └── setup/
└── backend/
    ├── unit/
    ├── integration/
    └── contract/
```

**Structure Decision**: Maintain separate frontend and backend codebases with shared backend services. Frontend uses Next.js for SSR/SSG capabilities and optimal SEO/performance. Backend extends existing services from Phases 1-2 to support web-specific features.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual frontend architecture | Constitution explicitly requires separate codebases for ChatGPT App and Web App | Would limit reach to single platform only |
| Extending existing backend | Need to leverage existing functionality from Phases 1-2 | Would duplicate effort and create maintenance overhead |