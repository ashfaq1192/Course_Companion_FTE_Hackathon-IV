<!-- SYNC IMPACT REPORT
Version change: N/A -> 1.0.0
Modified principles: N/A (new constitution)
Added sections: All sections
Removed sections: N/A
Templates requiring updates: 
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated  
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/sp.constitution.md ✅ updated
Follow-up TODOs: None
-->

# Course Companion FTE Constitution

## Core Principles

### I. Zero-Backend-LLM Architecture (NON-NEGOTIABLE)
Backend implementations MUST perform zero LLM inference in Phase 1. ChatGPT handles ALL reasoning, explanation, and tutoring. Backend is purely deterministic - serving content, tracking progress, and enforcing rules. This ensures near-zero marginal cost per user and predictable scaling.

### II. Deterministic Backend Services
Backend services MUST be built with FastAPI (Python) and implement only deterministic operations: content delivery, navigation, rule-based quiz grading, progress tracking, and access control. No generative AI or complex reasoning in backend code.

### III. Test-First Development (NON-NEGOTIABLE)
TDD is mandatory: Tests written → Requirements validated → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. Each user story must be independently testable before implementation begins.

### IV. Dual-Frontend Architecture
Both ChatGPT App (Phase 1/2) and Web App (Phase 3) MUST be developed with separate codebases but shared backend features. ChatGPT App uses OpenAI Apps SDK; Web App uses Next.js/React. Both must provide consistent educational experiences.

### V. Hybrid Intelligence Justification
Any Phase 2 hybrid features (backend LLM calls) MUST be feature-scoped, user-initiated, premium-gated, isolated in separate API routes, and cost-tracked. Hybrid features are only acceptable when zero-LLM design is insufficient and value is demonstrably proven.

### VI. Agent Skills-First Design
Educational functionality MUST be implemented through declarative SKILL.md files that define procedural knowledge. Each skill defines metadata, purpose, workflow, response templates, and key principles. This ensures consistent educational delivery across all interactions.

## Additional Constraints

### Technology Stack Requirements
- Backend: FastAPI (Python 3.11+) with async/await patterns
- ChatGPT Frontend: OpenAI Apps SDK
- Web Frontend: Next.js/React (TypeScript)
- Storage: Cloudflare R2 for course content
- Database: PostgreSQL-compatible (Neon/Supabase)
- Containerization: Docker for consistent deployments

### Performance Standards
- Response times: <200ms p95 for deterministic backend operations
- Availability: 99.9% uptime commitment
- Scalability: Support 100K+ concurrent users without linear cost increase
- Consistency: 99%+ consistency in educational delivery

## Development Workflow

### Phased Implementation Approach
- Phase 1: Zero-Backend-LLM ChatGPT App with deterministic backend
- Phase 2: Selective hybrid intelligence for premium features only
- Phase 3: Full standalone Web App with comprehensive LMS features

### Quality Gates
- Architecture correctness verified: zero backend LLM calls in Phase 1
- All 6 required features implemented (content, nav, Q&A, quizzes, progress, freemium)
- Cost efficiency validated: predictable cost model maintained
- User experience validated: intuitive educational interactions

### Review Process
- All PRs must verify compliance with Zero-Backend-LLM architecture in Phase 1
- Hybrid features require explicit justification and cost analysis
- Agent skills must follow standardized SKILL.md template
- API contracts validated against requirements

## Governance

This constitution supersedes all other development practices for the Course Companion FTE project. All amendments require documentation of impact on architecture principles, approval from project leadership, and migration plan for existing code. All pull requests and code reviews must verify compliance with these principles. Complexity must be justified with clear educational value and cost-benefit analysis.

**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02