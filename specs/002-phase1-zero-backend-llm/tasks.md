---
description: "Task list for Phase 1 - Zero-Backend-LLM ChatGPT App"
---

# Tasks: Phase 1 - Zero-Backend-LLM ChatGPT App

**Input**: Design documents from `/specs/002-phase1-zero-backend-llm/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- Paths shown below assume backend structure - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in backend/
- [x] T002 Initialize Python project with FastAPI dependencies in backend/requirements.txt
- [x] T003 [P] Configure linting and formatting tools (black, flake8, mypy) in backend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [x] T004 Setup database schema and migrations framework with Alembic in backend/alembic/
- [x] T005 [P] Implement authentication/authorization framework with JWT in backend/src/core/security.py
- [x] T006 [P] Setup API routing and middleware structure in backend/src/main.py
- [x] T007 Create base models/entities that all stories depend on in backend/src/models/
- [x] T008 Configure error handling and logging infrastructure in backend/src/core/
- [x] T009 Setup environment configuration management in backend/src/core/config.py
- [x] T010 [P] Implement content storage integration with Cloudflare R2 in backend/src/core/cloudflare_r2.py
- [x] T011 Setup database connection and session management in backend/src/database/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Student Learns Course Content via ChatGPT (Priority: P1) 🎯 MVP

**Goal**: Student interacts with the ChatGPT App to learn course materials. The ChatGPT interface provides personalized explanations of concepts at their level of understanding, while the backend only serves content verbatim without any LLM processing.

**Independent Test**: Can be fully tested by having a student interact with the ChatGPT App to learn a concept and receive appropriate explanations from ChatGPT. The backend only serves content without any intelligence.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [x] T012 [P] [US1] Contract test for content retrieval in backend/tests/contract/test_content_api.py
- [x] T013 [P] [US1] Integration test for content delivery flow in backend/tests/integration/test_content_flow.py

### Implementation for User Story 1

- [x] T014 [P] [US1] Create CourseContent model in backend/src/models/course_content.py
- [x] T015 [P] [US1] Create User model in backend/src/models/user.py
- [x] T016 [US1] Implement ContentService in backend/src/services/content_service.py (depends on T014)
- [x] T017 [US1] Implement content retrieval endpoint in backend/src/api/content.py
- [x] T018 [US1] Add validation and error handling for content endpoints
- [x] T019 [US1] Add logging for content retrieval operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Deterministic Content Delivery (Priority: P1)

**Goal**: Backend serves course content deterministically without any LLM processing. The system provides content APIs, navigation APIs, and search capabilities without performing any intelligent processing.

**Independent Test**: Can be fully tested by verifying that all backend APIs return content verbatim without any intelligent processing or LLM calls.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [x] T020 [P] [US2] Contract test for content search in backend/tests/contract/test_search_api.py
- [x] T021 [P] [US2] Integration test for search functionality in backend/tests/integration/test_search_flow.py

### Implementation for User Story 2

- [x] T022 [P] [US2] Create indexes for content search in backend/src/models/course_content.py
- [x] T023 [US2] Enhance ContentService with search functionality in backend/src/services/content_service.py
- [x] T024 [US2] Implement content search endpoint in backend/src/api/content.py
- [x] T025 [US2] Implement content by course endpoint in backend/src/api/content.py
- [x] T026 [US2] Add search validation and error handling

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Rule-Based Quiz Functionality (Priority: P2)

**Goal**: Student can engage with quizzes to test their understanding. The backend grades quizzes using rule-based evaluation without any LLM processing, while ChatGPT presents and explains quiz content.

**Independent Test**: Can be fully tested by having a student complete a quiz and receive grading from the rule-based system while ChatGPT provides explanations.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [x] T027 [P] [US3] Contract test for quiz endpoints in backend/tests/contract/test_quiz_api.py
- [x] T028 [P] [US3] Integration test for quiz flow in backend/tests/integration/test_quiz_flow.py

### Implementation for User Story 3

- [x] T029 [P] [US3] Create QuizQuestion model in backend/src/models/quiz.py
- [x] T030 [P] [US3] Create QuizAttempt model in backend/src/models/quiz.py
- [x] T031 [US3] Implement QuizService in backend/src/services/quiz_service.py
- [x] T032 [US3] Implement quiz start endpoint in backend/src/api/quiz.py
- [x] T033 [US3] Implement quiz submission endpoint in backend/src/api/quiz.py
- [x] T034 [US3] Implement quiz grading logic with rule-based evaluation
- [x] T035 [US3] Integrate with User and CourseContent models (if needed)

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Progress Tracking (Priority: P2)

**Goal**: Student can track their learning progress. The backend stores completion data and streaks without intelligent processing, while ChatGPT motivates and celebrates achievements.

**Independent Test**: Can be fully tested by having a student complete course activities and verify that progress is accurately stored and retrieved without intelligent processing.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [x] T036 [P] [US4] Contract test for progress endpoints in backend/tests/contract/test_progress_api.py
- [x] T037 [P] [US4] Integration test for progress tracking flow in backend/tests/integration/test_progress_flow.py

### Implementation for User Story 4

- [x] T038 [P] [US4] Create ProgressRecord model in backend/src/models/progress.py
- [x] T039 [US4] Implement ProgressService in backend/src/services/progress_service.py
- [x] T040 [US4] Implement progress retrieval endpoint in backend/src/api/progress.py
- [x] T041 [US4] Implement progress update endpoint in backend/src/api/progress.py
- [x] T042 [US4] Implement user progress endpoint in backend/src/api/progress.py
- [x] T043 [US4] Integrate with User and CourseContent models

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Freemium Access Control (Priority: P3)

**Goal**: Students can access basic course content for free, but premium features require a subscription. The backend enforces access controls deterministically based on user subscription status.

**Independent Test**: Can be fully tested by verifying that backend only checks subscription status without intelligent decision-making.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [x] T044 [P] [US5] Contract test for subscription endpoints in backend/tests/contract/test_subscription_api.py
- [x] T045 [P] [US5] Integration test for access control flow in backend/tests/integration/test_access_control.py

### Implementation for User Story 5

- [x] T046 [P] [US5] Create Subscription model in backend/src/models/subscription.py
- [x] T047 [US5] Implement SubscriptionService in backend/src/services/subscription_service.py
- [x] T048 [US5] Implement subscription retrieval endpoint in backend/src/api/subscriptions.py
- [x] T049 [US5] Implement access control middleware in backend/src/api/deps.py
- [x] T050 [US5] Add subscription checks to content and quiz endpoints
- [x] T051 [US5] Integrate with User model

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Authentication & User Management

**Goal**: Implement user authentication and registration functionality

### Implementation for Authentication

- [x] T052 [P] Create authentication endpoints in backend/src/api/auth.py
- [x] T053 [P] Implement AuthService in backend/src/services/auth_service.py
- [x] T054 Implement user registration endpoint
- [x] T055 Implement user login endpoint
- [x] T056 Add password hashing and verification

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T057 [P] Documentation updates in backend/docs/
- [x] T058 Code cleanup and refactoring
- [x] T059 Performance optimization across all stories
- [x] T060 [P] Additional unit tests (if requested) in backend/tests/unit/
- [x] T061 Security hardening
- [x] T062 Run quickstart.md validation

---

## Phase Z: Agent Skills Implementation

**Goal**: Implement the agent skills system to guide ChatGPT's educational interactions

### Implementation for Agent Skills

- [x] T063 [P] Create skills directory structure in backend/skills/
- [x] T064 Create standard SKILL.md template in backend/skills/TEMPLATE.md
- [x] T065 Implement COURSE_EXPLANATION skill in backend/skills/COURSE_EXPLANATION_SKILL.md
- [x] T066 Implement QUIZ_GUIDANCE skill in backend/skills/QUIZ_GUIDANCE_SKILL.md
- [x] T067 Implement PROGRESS_CELEBRATION skill in backend/skills/PROGRESS_CELEBRATION_SKILL.md
- [x] T068 Create README documentation for skills system in backend/skills/README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - May integrate with other stories but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for content retrieval in backend/tests/contract/test_content_api.py"
Task: "Integration test for content delivery flow in backend/tests/integration/test_content_flow.py"

# Launch all models for User Story 1 together:
Task: "Create CourseContent model in backend/src/models/course_content.py"
Task: "Create User model in backend/src/models/user.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence