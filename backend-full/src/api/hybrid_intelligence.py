from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

from ..database.session import get_db
from ..api.deps import get_current_active_user, require_premium_access
from ..models.user import User
from ..services.hybrid_intelligence_service import HybridIntelligenceService
from ..models.hybrid_intelligence import AdaptiveLearningPath, LLMGradeAssessment, CostMetric


router = APIRouter()


@router.get("/hybrid/adaptive-path", response_model=dict)
def get_current_adaptive_path(
    current_user: User = Depends(require_premium_access),
    db: Session = Depends(get_db)
):
    """
    Get the current adaptive learning path for the user.
    Requires premium subscription.
    """
    service = HybridIntelligenceService(db)
    path = service.get_current_adaptive_path(current_user.id)
    
    if not path:
        raise HTTPException(
            status_code=404,
            detail="No active adaptive learning path found for user"
        )
    
    # Convert the path to a dictionary response
    return {
        "id": str(path.id),
        "user_id": str(path.user_id),
        "generated_at": path.generated_at.isoformat(),
        "recommended_courses": json.loads(path.recommended_courses),
        "reasoning": path.reasoning,
        "valid_until": path.valid_until.isoformat() if path.valid_until else None,
        "is_active": path.is_active,
        "cost_usd": float(path.cost_usd) if path.cost_usd else 0.0
    }


@router.post("/hybrid/adaptive-path", response_model=dict)
async def generate_new_adaptive_path(
    user_preferences: dict,
    current_user: User = Depends(require_premium_access),
    db: Session = Depends(get_db)
):
    """
    Generate a new adaptive learning path based on user preferences.
    Requires premium subscription.
    """
    # Validate required fields in user_preferences
    required_fields = ["learning_style", "pace"]
    for field in required_fields:
        if field not in user_preferences:
            raise HTTPException(
                status_code=422,
                detail=f"Missing required field: {field}"
            )
    
    service = HybridIntelligenceService(db)
    path = await service.generate_adaptive_learning_path(
        user_id=current_user.id,
        user_preferences=user_preferences
    )
    
    # Convert the path to a dictionary response
    return {
        "id": str(path.id),
        "user_id": str(path.user_id),
        "generated_at": path.generated_at.isoformat(),
        "recommended_courses": json.loads(path.recommended_courses),
        "reasoning": path.reasoning,
        "valid_until": path.valid_until.isoformat() if path.valid_until else None,
        "is_active": path.is_active,
        "cost_usd": float(path.cost_usd) if path.cost_usd else 0.0
    }


@router.post("/hybrid/llm-grade-assessment", response_model=dict)
async def grade_assessment_with_llm(
    request_data: dict,
    current_user: User = Depends(require_premium_access),
    db: Session = Depends(get_db)
):
    """
    Submit a free-form answer for LLM-based grading and feedback.
    Requires premium subscription.
    """
    # Validate required fields
    required_fields = ["quiz_attempt_id", "question_id", "answer_text"]
    for field in required_fields:
        if field not in request_data:
            raise HTTPException(
                status_code=422,
                detail=f"Missing required field: {field}"
            )
    
    service = HybridIntelligenceService(db)
    assessment = await service.grade_assessment_with_llm(
        user_id=current_user.id,
        quiz_attempt_id=int(request_data["quiz_attempt_id"]),
        question_id=request_data["question_id"],
        answer_text=request_data["answer_text"],
        context=request_data.get("context")
    )
    
    # Parse the LLM grade for response
    llm_grade = json.loads(assessment.llm_grade)
    
    # Convert the assessment to a dictionary response
    return {
        "id": str(assessment.id),
        "user_id": str(assessment.user_id),
        "quiz_attempt_id": str(assessment.quiz_attempt_id),
        "question_id": assessment.question_id,
        "original_response": assessment.original_response,
        "llm_grade": llm_grade,
        "graded_at": assessment.graded_at.isoformat(),
        "cost_usd": float(assessment.cost_usd) if assessment.cost_usd else 0.0,
        "is_valid": assessment.is_valid
    }


@router.post("/hybrid/agent-orchestrate", response_model=dict)
async def agent_orchestrate(
    request_data: dict,
    current_user: User = Depends(require_premium_access),
):
    """
    Route a task to the appropriate OpenAI Agent (L4 — Agents SDK).
    Accepts {"task": "<natural language request>"} and returns the agent's response.
    Requires premium subscription.
    """
    task = request_data.get("task")
    if not task:
        raise HTTPException(status_code=422, detail="Missing required field: task")

    from ..core.agents import run_orchestrator

    try:
        result = await run_orchestrator(task)
        return {
            "agent": result.last_agent.name if result.last_agent else "unknown",
            "response": result.final_output,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


@router.post("/hybrid/claude-agent", response_model=dict)
async def claude_agent_endpoint(
    request_data: dict,
    current_user: User = Depends(require_premium_access),
):
    """
    Route a task to the Claude Agent (L5 — Claude Agent SDK).
    Accepts {"task": "<natural language request>"} and returns Claude's response.
    Requires premium subscription.
    """
    task = request_data.get("task")
    if not task:
        raise HTTPException(status_code=422, detail="Missing required field: task")

    from ..core.claude_agents import run_claude_agent

    try:
        result = await run_claude_agent(task)
        return {
            "provider": "anthropic",
            "model": result.get("model", "claude"),
            "result": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claude agent error: {str(e)}")


@router.get("/hybrid/cost-metrics", response_model=List[dict])
def get_cost_metrics(
    period_start: Optional[str] = None,
    period_end: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),  # Note: not requiring premium for viewing costs
    db: Session = Depends(get_db)
):
    """
    Get cost metrics for the user.
    Available to all users to see their usage/costs.
    """
    # Convert string dates to datetime objects if provided
    start_date = None
    end_date = None
    
    if period_start:
        try:
            start_date = datetime.fromisoformat(period_start.replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Invalid format for period_start. Use ISO format (YYYY-MM-DDTHH:MM:SS.ffffff)"
            )
    
    if period_end:
        try:
            end_date = datetime.fromisoformat(period_end.replace('Z', '+00:00'))
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Invalid format for period_end. Use ISO format (YYYY-MM-DDTHH:MM:SS.ffffff)"
            )
    
    service = HybridIntelligenceService(db)
    metrics = service.get_cost_metrics(
        user_id=current_user.id,
        period_start=start_date,
        period_end=end_date
    )
    
    # Convert metrics to dictionary responses
    result = []
    for metric in metrics:
        result.append({
            "id": str(metric.id),
            "user_id": str(metric.user_id),
            "metric_period_start": metric.metric_period_start.isoformat(),
            "metric_period_end": metric.metric_period_end.isoformat(),
            "total_cost_usd": float(metric.total_cost_usd),
            "total_tokens": metric.total_tokens,
            "feature_breakdown": json.loads(metric.feature_breakdown),
            "calculated_at": metric.calculated_at.isoformat()
        })
    
    return result