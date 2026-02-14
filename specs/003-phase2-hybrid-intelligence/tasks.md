---
description: "Task list for Phase 2 - Hybrid Intelligence"
---

# Tasks: Phase 2 - Hybrid Intelligence

**Input**: Design documents from `/specs/003-phase2-hybrid-intelligence/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- Paths shown below assume backend structure - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for hybrid features

- [X] T001 Update requirements.txt with LLM dependencies (openai, etc.) in backend/requirements.txt
- [X] T002 [P] Create LLM client abstraction in backend/src/core/llm_client.py
- [X] T003 Configure LLM API keys in backend/src/core/config.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create HybridIntelligence models in backend/src/models/hybrid_intelligence.py
- [X] T005 [P] Create CostTracking model in backend/src/models/hybrid_intelligence.py
- [X] T006 Setup database migration for new hybrid intelligence tables in backend/alembic/
- [X] T007 Update access control middleware to handle premium feature checks in backend/src/api/deps.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Adaptive Learning Path (Priority: P1)

**Goal**: Premium subscribers can access adaptive learning paths that analyze their learning patterns and generate personalized recommendations. The backend uses LLMs to analyze data and create customized learning experiences.

**Independent Test**: Can be fully tested by having a premium subscriber interact with the system and receive personalized learning recommendations based on their progress and performance patterns.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [X] T008 [P] [US1] Contract test for adaptive learning path endpoint in backend/tests/contract/test_adaptive_learning_api.py
- [X] T009 [P] [US1] Integration test for adaptive learning flow in backend/tests/integration/test_adaptive_learning_flow.py

### Implementation for User Story 1

- [X] T010 [US1] Implement AdaptiveLearningService in backend/src/services/hybrid_intelligence_service.py
- [X] T011 [US1] Implement adaptive learning path endpoint in backend/src/api/hybrid_intelligence.py
- [X] T012 [US1] Add validation and error handling for adaptive learning endpoints
- [X] T013 [US1] Add logging and cost tracking for adaptive learning operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - LLM-Graded Assessments (Priority: P1)

**Goal**: Premium subscribers can submit free-form written answers to assessments and receive detailed feedback. The backend uses LLMs to evaluate responses that rule-based systems cannot assess.

**Independent Test**: Can be fully tested by having a premium subscriber submit written answers and receive detailed feedback from the LLM-grading system.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T014 [P] [US2] Contract test for LLM grading endpoint in backend/tests/contract/test_llm_grading_api.py
- [X] T015 [P] [US2] Integration test for LLM grading flow in backend/tests/integration/test_llm_grading_flow.py

### Implementation for User Story 2

- [X] T016 [US2] Enhance QuizService with LLM grading capability in backend/src/services/quiz_service.py
- [X] T017 [US2] Implement LLM grading endpoint in backend/src/api/hybrid_intelligence.py
- [X] T018 [US2] Add validation and error handling for LLM grading endpoints
- [X] T019 [US2] Add logging and cost tracking for LLM grading operations

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Premium Feature Access Control (Priority: P2)

**Goal**: The system must enforce access control to ensure hybrid intelligence features are only available to premium subscribers. The backend must properly gate these features.

**Independent Test**: Can be fully tested by verifying that free users cannot access hybrid features while premium subscribers can.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T020 [P] [US3] Contract test for access control in backend/tests/contract/test_access_control_api.py
- [X] T021 [P] [US3] Integration test for premium access flow in backend/tests/integration/test_premium_access_flow.py

### Implementation for User Story 3

- [X] T022 [US3] Implement premium access decorator in backend/src/api/deps.py
- [X] T023 [US3] Add premium checks to hybrid intelligence endpoints in backend/src/api/hybrid_intelligence.py
- [X] T024 [US3] Update SubscriptionService with helper methods for access control in backend/src/services/subscription_service.py

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Cost Tracking for Hybrid Features (Priority: P3)

**Goal**: The system must track usage and cost of hybrid intelligence features per user to ensure economic viability of the premium offerings.

**Independent Test**: Can be fully tested by monitoring cost tracking for hybrid feature usage.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [X] T025 [P] [US4] Contract test for cost tracking endpoint in backend/tests/contract/test_cost_tracking_api.py
- [X] T026 [P] [US4] Integration test for cost tracking flow in backend/tests/integration/test_cost_tracking_flow.py

### Implementation for User Story 4

- [X] T027 [US4] Implement CostTrackingService in backend/src/services/hybrid_intelligence_service.py
- [X] T028 [US4] Implement cost tracking endpoint in backend/src/api/hybrid_intelligence.py
- [X] T029 [US4] Update LLM client to log cost metrics in backend/src/core/llm_client.py
- [X] T030 [US4] Add cost calculation logic for different LLM operations

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: API Integration and Routing

**Goal**: Integrate new hybrid intelligence features into the main application

### Implementation for API Integration

- [X] T031 Create hybrid intelligence API router in backend/src/api/hybrid_intelligence.py
- [X] T032 Mount hybrid intelligence router in backend/src/main.py
- [X] T033 Update OpenAPI documentation to include hybrid intelligence endpoints

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Documentation updates for hybrid intelligence features in backend/docs/
- [X] T035 Code cleanup and refactoring for new hybrid features
- [X] T036 Performance optimization for LLM-dependent operations
- [X] T037 [P] Additional unit tests for hybrid intelligence services in backend/tests/unit/
- [X] T038 Security hardening for premium feature access
- [X] T039 Run quickstart.md validation for Phase 2 features

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
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - May integrate with other stories but should be independently testable

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
Task: "Contract test for adaptive learning path endpoint in backend/tests/contract/test_adaptive_learning_api.py"
Task: "Integration test for adaptive learning flow in backend/tests/integration/test_adaptive_learning_flow.py"

# Launch implementation for User Story 1:
Task: "Implement AdaptiveLearningService in backend/src/services/hybrid_intelligence_service.py"
Task: "Implement adaptive learning path endpoint in backend/src/api/hybrid_intelligence.py"
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
6. Each story adds value without breaking previous stories

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