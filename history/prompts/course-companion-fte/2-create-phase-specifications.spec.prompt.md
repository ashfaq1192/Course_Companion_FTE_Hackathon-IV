---
id: 2
title: Create Phase Specifications
stage: spec
date: 2026-02-02
surface: agent
model: claude-3-5-sonnet-20241022
feature: course-companion-fte
branch: main
user: user
command: manual-spec-creation
labels: ["spec", "course-companion", "fte", "phases", "education"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-phase1-zero-backend-llm/spec.md
  - specs/003-phase2-hybrid-intelligence/spec.md
  - specs/004-phase3-web-app/spec.md
tests:
  - pytest tests/
---

## Prompt

```text
Will you create seperate directories for each phase? will you switch to phase1 branch for development? I am a layman you suggest me what to do in this case?
```

## Response snapshot

I recognized that the Course Companion FTE project has three distinct phases with different architectural requirements, as outlined in the hackathon document:

1. Phase 1: Zero-Backend-LLM ChatGPT App
2. Phase 2: Hybrid Intelligence (Premium Features) 
3. Phase 3: Standalone Web App

I've created separate specifications for each phase in their own directories to ensure clear separation of concerns and proper architectural compliance:

1. Created specs/002-phase1-zero-backend-llm/spec.md - focusing on the strict Zero-Backend-LLM architecture where ChatGPT handles all intelligence
2. Created specs/003-phase2-hybrid-intelligence/spec.md - detailing premium hybrid features with backend LLM calls
3. Created specs/004-phase3-web-app/spec.md - outlining the standalone web application with full LMS features

For your question about branching strategy as a layman, here's my recommendation:

1. **Start with Phase 1**: This is the foundation and has strict architectural constraints that must be followed (no backend LLM calls). Focus on getting this working correctly first.

2. **Branching Strategy**: 
   - Work on the `002-phase1-zero-backend-llm` branch initially
   - Once Phase 1 is stable, you can create the Phase 2 branch from the Phase 1 completion point
   - Phase 3 can be built after both previous phases are complete

3. **Development Approach**:
   - Begin with the core functionality: content delivery, navigation, and basic interactions
   - Implement the backend APIs that serve content deterministically
   - Create the ChatGPT App integration
   - Test extensively to ensure no LLM calls happen in the backend (critical for Phase 1)

4. **Architecture Compliance**: Pay close attention to the Zero-Backend-LLM requirement in Phase 1 - this is a disqualifying offense if violated.

The separate phase specifications will help keep the development focused on the right requirements at each stage.

## Outcome

- ✅ Impact: Created separate specifications for each phase of the Course Companion FTE project
- 🧪 Tests: No automated tests run for this spec creation
- 📁 Files: 3 new spec files created for each phase
- 🔁 Next prompts: Ready to begin Phase 1 implementation
- 🧠 Reflection: Separating specs by phase clarifies requirements and reduces confusion

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Manual spec organization
- Next experiment (smallest change to try): Begin implementation of Phase 1