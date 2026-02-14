---
id: 4
title: Plan Phase 1 Implementation
stage: plan
date: 2026-02-02
surface: agent
model: claude-3-5-sonnet-20241022
feature: phase1-zero-backend-llm
branch: 002-phase1-zero-backend-llm
user: user
command: sp.plan
labels: ["plan", "phase1", "backend", "course-companion"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-phase1-zero-backend-llm/plan.md
  - specs/002-phase1-zero-backend-llm/research.md
  - specs/002-phase1-zero-backend-llm/data-model.md
  - specs/002-phase1-zero-backend-llm/quickstart.md
  - specs/002-phase1-zero-backend-llm/contracts/openapi.yaml
tests:
  - pytest tests/
---

## Prompt

```text
---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs: 
  - label: Create Tasks
    agent: sp.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: sp.checklist
    prompt: Create a checklist for the following domain...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/bash/setup-plan.sh --json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Agent context update**:
   - Run `.specify/scripts/bash/update-agent-context.sh qwen`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

**Output**: data-model.md, /contracts/*, quickstart.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
```

## Response snapshot

I've successfully completed the implementation planning for Phase 1 of the Course Companion FTE project. The following artifacts have been created:

1. **Implementation Plan** (`plan.md`): Detailed technical plan with architecture decisions and project structure
2. **Research Summary** (`research.md`): Technology decisions and best practices for the implementation
3. **Data Model** (`data-model.md`): Complete entity definitions with relationships and validation rules
4. **API Contracts** (`contracts/openapi.yaml`): OpenAPI specification for all backend APIs
5. **Quickstart Guide** (`quickstart.md`): Comprehensive guide for setting up and running the application

The plan ensures compliance with the Course Companion FTE Constitution, particularly the Zero-Backend-LLM Architecture principle for Phase 1. All backend services are designed to be deterministic, with no LLM calls, supporting the core requirement that ChatGPT handles all intelligent processing.

The architecture uses FastAPI with PostgreSQL, OAuth 2.0/JWT authentication, and Cloudflare R2 for content storage, meeting the performance requirements of <200ms for content APIs and <500ms for progress APIs.

## Outcome

- ✅ Impact: Created comprehensive technical plan for Phase 1 backend
- 🧪 Tests: No automated tests run for this planning phase
- 📁 Files: 5 design artifacts created (plan, research, data model, contracts, quickstart)
- 🔁 Next prompts: Ready to proceed to task breakdown phase
- 🧠 Reflection: Plan aligns with constitutional requirements and technical constraints

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard planning workflow
- Next experiment (smallest change to try): Break plan into implementation tasks