"""
L2 — Dapr Durable Workflows for Course Companion FTE.

Defines the `learning_path_workflow`, a multi-step durable workflow that
orchestrates adaptive learning path generation.  Uses dapr-ext-workflow
for fault-tolerant, resumable execution.

Not wired into live routes — demonstrates architectural intent for the
workflow orchestration layer.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timezone

try:
    from dapr.ext.workflow import (
        DaprWorkflowContext,
        WorkflowActivityContext,
        DaprWorkflowClient,
        WorkflowRuntime,
    )
except ImportError:
    # Dapr SDK not installed — define placeholders so the module loads
    # without the runtime dependency. Actual workflow execution requires
    # `pip install dapr dapr-ext-workflow`.
    DaprWorkflowContext = object
    WorkflowActivityContext = object
    DaprWorkflowClient = None  # type: ignore[assignment, misc]
    WorkflowRuntime = None  # type: ignore[assignment, misc]

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Workflow input / output models
# ---------------------------------------------------------------------------

@dataclass
class LearningPathInput:
    user_id: int
    course_id: str
    current_chapter: int
    quiz_score: float  # 0.0 – 1.0


@dataclass
class LearningPathResult:
    user_id: int
    recommended_path: list[str]
    difficulty_adjustment: str  # "easier" | "same" | "harder"
    generated_at: str


# ---------------------------------------------------------------------------
# Workflow activities (individual steps)
# ---------------------------------------------------------------------------

def assess_performance(ctx: WorkflowActivityContext, inp: dict) -> dict:
    """Activity 1 — Evaluate the student's recent quiz performance."""
    score = inp["quiz_score"]
    if score >= 0.8:
        level = "advanced"
        adjustment = "harder"
    elif score >= 0.5:
        level = "intermediate"
        adjustment = "same"
    else:
        level = "beginner"
        adjustment = "easier"

    logger.info("Assessed user %s: level=%s", inp["user_id"], level)
    return {
        "user_id": inp["user_id"],
        "level": level,
        "adjustment": adjustment,
    }


def generate_recommendations(ctx: WorkflowActivityContext, inp: dict) -> dict:
    """Activity 2 — Build a recommended content path based on assessed level."""
    level = inp["level"]
    chapter = inp.get("current_chapter", 1)

    if level == "advanced":
        path = [f"chapter-{chapter + 1}-advanced", f"chapter-{chapter + 2}-project"]
    elif level == "intermediate":
        path = [f"chapter-{chapter}-review", f"chapter-{chapter + 1}-standard"]
    else:
        path = [f"chapter-{chapter}-foundations", f"chapter-{chapter}-practice"]

    logger.info("Generated path for user %s: %s", inp["user_id"], path)
    return {
        "user_id": inp["user_id"],
        "recommended_path": path,
        "adjustment": inp["adjustment"],
    }


def persist_learning_path(ctx: WorkflowActivityContext, inp: dict) -> dict:
    """Activity 3 — Save the learning path (stub — would write to DB)."""
    logger.info(
        "Persisted learning path for user %s: %s",
        inp["user_id"],
        inp["recommended_path"],
    )
    return {
        **inp,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------------------------
# Durable workflow definition
# ---------------------------------------------------------------------------

def learning_path_workflow(ctx: DaprWorkflowContext, inp: dict) -> dict:
    """
    Orchestrates adaptive learning path generation as a 3-step durable workflow:
      1. Assess student performance
      2. Generate content recommendations
      3. Persist the learning path

    Each step is an independently retriable activity.
    """
    assessment = yield ctx.call_activity(
        assess_performance,
        input={**inp},
    )

    recommendations = yield ctx.call_activity(
        generate_recommendations,
        input={**assessment, "current_chapter": inp.get("current_chapter", 1)},
    )

    result = yield ctx.call_activity(
        persist_learning_path,
        input=recommendations,
    )

    return result


# ---------------------------------------------------------------------------
# Runtime registration helper
# ---------------------------------------------------------------------------

def register_workflows(runtime: WorkflowRuntime) -> None:
    """Register all workflows and activities with the Dapr workflow runtime."""
    runtime.register_workflow(learning_path_workflow)
    runtime.register_activity(assess_performance)
    runtime.register_activity(generate_recommendations)
    runtime.register_activity(persist_learning_path)
    logger.info("Registered learning_path_workflow with 3 activities")
