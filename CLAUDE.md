# Claude Code Rules

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architext to build products.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title
   - 3–7 words; create a slug for the filename.

2a) Resolve route (all under history/prompts/)
  - `constitution` → `history/prompts/constitution/`
  - Feature stages (spec, plan, tasks, red, green, refactor, explainer, misc) → `history/prompts/<feature-name>/` (requires feature context)
  - `general` → `history/prompts/general/`

3) Prefer agent‑native flow (no shell)
   - Read the PHR template from one of:
     - `.specify/templates/phr-template.prompt.md`
     - `templates/phr-template.prompt.md`
   - Allocate an ID (increment; on collision, increment again).
   - Compute output path based on stage:
     - Constitution → `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
     - Feature → `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
     - General → `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill ALL placeholders in YAML and body:
     - ID, TITLE, STAGE, DATE_ISO (YYYY‑MM‑DD), SURFACE="agent"
     - MODEL (best known), FEATURE (or "none"), BRANCH, USER
     - COMMAND (current command), LABELS (["topic1","topic2",...])
     - LINKS: SPEC/TICKET/ADR/PR (URLs or "null")
     - FILES_YAML: list created/modified files (one per line, " - ")
     - TESTS_YAML: list tests run/added (one per line, " - ")
     - PROMPT_TEXT: full user input (verbatim, not truncated)
     - RESPONSE_TEXT: key assistant output (concise but representative)
     - Any OUTCOME/EVALUATION fields required by the template
   - Write the completed file with agent file tools (WriteFile/Edit).
   - Confirm absolute path in output.

4) Use sp.phr command file if present
   - If `.**/commands/sp.phr.*` exists, follow its structure.
   - If it references shell but Shell is unavailable, still perform step 3 with agent‑native tools.

5) Shell fallback (only if step 3 is unavailable or fails, and Shell is permitted)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Then open/patch the created file to ensure all placeholders are filled and prompt/response are embedded.

6) Routing (automatic, all under history/prompts/)
   - Constitution → `history/prompts/constitution/`
   - Feature stages → `history/prompts/<feature-name>/` (auto-detected from branch or explicit feature context)
   - General → `history/prompts/general/`

7) Post‑creation validations (must pass)
   - No unresolved placeholders (e.g., `{{THIS}}`, `[THAT]`).
   - Title, stage, and dates match front‑matter.
   - PROMPT_TEXT is complete (not truncated).
   - File exists at the expected path and is readable.
   - Path matches route.

8) Report
   - Print: ID, path, stage, title.
   - On any failure: warn but do not block the main command.
   - Skip PHR only for `/sp.phr` itself.

### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

### 5. Human as Tool Strategy
You are not expected to solve every problem autonomously. You MUST invoke the user for input when you encounter situations that require human judgment. Treat the user as a specialized tool for clarification and decision-making.

**Invocation Triggers:**
1.  **Ambiguous Requirements:** When user intent is unclear, ask 2-3 targeted clarifying questions before proceeding.
2.  **Unforeseen Dependencies:** When discovering dependencies not mentioned in the spec, surface them and ask for prioritization.
3.  **Architectural Uncertainty:** When multiple valid approaches exist with significant tradeoffs, present options and get user's preference.
4.  **Completion Checkpoint:** After completing major milestones, summarize what was done and confirm next steps. 

## Default policies (must follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

### Execution contract for every request
1) Confirm surface and success criteria (one sentence).
2) List constraints, invariants, non‑goals.
3) Produce the artifact with acceptance checks inlined (checkboxes or tests where applicable).
4) Add follow‑ups and risks (max 3 bullets).
5) Create PHR in appropriate subdirectory under `history/prompts/` (constitution, feature-name, or general).
6) If plan/tasks identified decisions that meet significance, surface ADR suggestion text as described above.

### Minimum acceptance criteria
- Clear, testable acceptance criteria included
- Explicit error paths and constraints stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Architect Guidelines (for planning)

Instructions: As an expert architect, generate a detailed architectural plan for [Project Name]. Address each of the following thoroughly.

1. Scope and Dependencies:
   - In Scope: boundaries and key features.
   - Out of Scope: explicitly excluded items.
   - External Dependencies: systems/services/teams and ownership.

2. Key Decisions and Rationale:
   - Options Considered, Trade-offs, Rationale.
   - Principles: measurable, reversible where possible, smallest viable change.

3. Interfaces and API Contracts:
   - Public APIs: Inputs, Outputs, Errors.
   - Versioning Strategy.
   - Idempotency, Timeouts, Retries.
   - Error Taxonomy with status codes.

4. Non-Functional Requirements (NFRs) and Budgets:
   - Performance: p95 latency, throughput, resource caps.
   - Reliability: SLOs, error budgets, degradation strategy.
   - Security: AuthN/AuthZ, data handling, secrets, auditing.
   - Cost: unit economics.

5. Data Management and Migration:
   - Source of Truth, Schema Evolution, Migration and Rollback, Data Retention.

6. Operational Readiness:
   - Observability: logs, metrics, traces.
   - Alerting: thresholds and on-call owners.
   - Runbooks for common tasks.
   - Deployment and Rollback strategies.
   - Feature Flags and compatibility.

7. Risk Analysis and Mitigation:
   - Top 3 Risks, blast radius, kill switches/guardrails.

8. Evaluation and Validation:
   - Definition of Done (tests, scans).
   - Output Validation for format/requirements/safety.

9. Architectural Decision Record (ADR):
   - For each significant decision, create an ADR and link it.

### Architecture Decision Records (ADR) - Intelligent Suggestion

After design/architecture work, test for ADR significance:

- Impact: long-term consequences? (e.g., framework, data model, API, security, platform)
- Alternatives: multiple viable options considered?
- Scope: cross‑cutting and influences system design?

If ALL true, suggest:
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`

Wait for consent; never auto-create ADRs. Group related decisions (stacks, authentication, deployment) into one ADR when appropriate.

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/spec.md` — Feature requirements
- `specs/<feature>/plan.md` — Architecture decisions
- `specs/<feature>/tasks.md` — Testable tasks with cases
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/` — SpecKit Plus templates and scripts

## Code Standards
See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles.

## Project Audit (Claude Code Review — 2026-02-07)

### Codebase Overview
- **Phase 1 Backend** (`backend-phase1-zero-backend-llm/`): 27 Python source files — FastAPI, SQLAlchemy, Pydantic, JWT auth, Alembic migrations
- **Phase 2 Backend** (`backend-full/`): 30 Python source files — Extends Phase 1 with hybrid intelligence (LLM client, adaptive path, LLM grading)
- **Phase 3 Frontend** (`frontend-web/`): 55 TypeScript/TSX files — Next.js 14, React 18, Tailwind CSS, Zustand, React Query, Recharts
- **Specs**: 4 feature specs under `specs/` (001 through 004) with spec.md, plan.md, tasks.md, data-model.md, research.md, quickstart.md

### Code Quality Assessment
The implementations are **substantive and well-structured** — not stubs. Each backend service has real business logic (content navigation, rule-based quiz grading, progress tracking, subscription management). The frontend has real React components with state management, form handling, API service layers, auth context, and responsive UI.

### Critical Issues Found
1. **SECURITY: Hardcoded OpenAI API key in `frontend-web/.env.local`** — Must be rotated immediately and removed from version control
2. **Phase 1 ships `openai==1.3.5` in requirements.txt** — The OpenAI package should NOT be in Phase 1 dependencies (disqualification risk under strict judging)
3. **Phase 1 `config.py` has `OPENAI_API_KEY` and `DEFAULT_LLM_MODEL` settings** — Config leakage from Phase 2 concerns
4. **Phase 1 `quiz_service.py:169` has `enhance_with_llm_grading` stub** — While it's just `pass`, its presence in Phase 1 code is architecturally inappropriate
5. **`user_service.py` line 1 has `//` JS comment syntax** — Python file with JavaScript comment
6. **Frontend never installed** — No `node_modules/`, no `package-lock.json` — app has never been built or run
7. **Frontend tests are all placeholders** — Every test file under `tests/` is a generic "example" test (e.g., `expect(1+1).toBe(2)`)
8. **Duplicate `get_db` function** — Defined in both `database/database.py` and `database/session.py`
9. **SQLite used locally** — `course_companion.db` present, but spec requires PostgreSQL (Neon/Supabase)
10. **No actual course content loaded** — Database exists but no seed data or content pipeline

### Missing Hackathon Deliverables
| Deliverable | Status |
|---|---|
| ChatGPT App / OpenAI Apps SDK Frontend | Missing entirely |
| Architecture Diagram (PNG/PDF) | Missing |
| Demo Video (5 min MP4) | Missing |
| ChatGPT App Manifest (YAML) | Missing |
| API Documentation (OpenAPI/Swagger) | Partially exists (FastAPI auto-generates, but not verified running) |
| Cost Analysis Document | Inline in README only, not standalone |
| Cloudflare R2 Integration | boto3 in deps but no working R2 configuration |

### Phase Compliance Verdicts
- **Phase 1 (Zero-Backend-LLM)**: ~70% — Core architecture is correct (no actual LLM calls execute), but contaminated with OpenAI dependency, config, and stub method. The 6 required features have implementations but are untested in a running state.
- **Phase 2 (Hybrid Intelligence)**: ~60% — Properly isolated in `backend-full/` with `hybrid_intelligence_service.py` and separate API routes. Cost tracking exists. But uses synchronous `generate_completion` call on an async method, and has never been run against a real LLM.
- **Phase 3 (Web App)**: ~50% — 55 source files with real UI components, but the app has never been installed (`npm install`), built, or tested. No working deployment.

### Recommendations Priority Order
1. **P0 — Rotate the exposed OpenAI API key** (`.env.local` committed with real key)
2. **P0 — Remove `openai` from Phase 1 `requirements.txt`** and clean config.py/quiz_service.py of LLM references
3. **P0 — Run `npm install && npm run build`** in frontend-web to verify it actually compiles
4. **P1 — Build the ChatGPT App frontend** (Phase 1 required deliverable, currently missing entirely)
5. **P1 — Set up PostgreSQL** (Neon free tier) and run Alembic migrations with seed data
6. **P1 — Configure Cloudflare R2** with actual course content
7. **P1 — Write real tests** — Replace placeholder frontend tests; add integration tests for backend
8. **P2 — Create architecture diagram, cost analysis doc, demo video**
9. **P2 — Fix `backend-full/` async/sync mismatch** in hybrid_intelligence_service.py (calls async LLM client from sync methods)
10. **P2 — Add `.gitignore` entry for `.env.local`** and ensure no secrets in repo
