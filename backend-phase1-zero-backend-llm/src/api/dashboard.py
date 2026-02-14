"""
Dashboard-specific API endpoints.
These aggregate data from content, progress, and quiz tables
into the shapes the frontend dashboard components expect.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database.session import get_db
from ..api.deps import get_current_active_user
from ..models.user import User
from ..models.course_content import CourseContent
from ..models.progress import ProgressRecord
from ..models.quiz import QuizQuestion, QuizAttempt


router = APIRouter()


@router.get("/progress/overview")
def get_progress_overview(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Aggregated progress overview for the dashboard."""
    contents = db.query(CourseContent).filter(CourseContent.is_available == True).all()
    progress_records = (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == current_user.id)
        .all()
    )

    completed = sum(1 for p in progress_records if p.status == "completed")
    in_progress = sum(1 for p in progress_records if p.status == "in_progress")
    total_seconds = sum(p.time_spent_seconds or 0 for p in progress_records)

    return {
        "totalCourses": len(contents),
        "completedCourses": completed,
        "inProgressCourses": in_progress,
        "totalHoursLearned": round(total_seconds / 3600, 1),
        "currentStreak": 1,
        "weeklyGoal": 5,
        "weeklyProgress": completed,
        "achievements": [],
    }


@router.get("/analytics/user")
def get_user_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """User analytics metrics for the dashboard."""
    contents = db.query(CourseContent).filter(CourseContent.is_available == True).count()
    progress_records = (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == current_user.id)
        .all()
    )
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .all()
    )

    completed = sum(1 for p in progress_records if p.status == "completed")
    in_progress_count = sum(1 for p in progress_records if p.status == "in_progress")
    total_seconds = sum(p.time_spent_seconds or 0 for p in progress_records)
    completion_rate = round((completed / contents * 100) if contents else 0, 1)
    avg_score = round(
        sum(a.score or 0 for a in attempts) / len(attempts) if attempts else 0, 1
    )

    return {
        "hoursLearned": round(total_seconds / 3600, 1),
        "completionRate": completion_rate,
        "avgQuizScore": avg_score,
        "coursesInProgress": in_progress_count,
        "timeOfDayStats": {"morning": 2, "afternoon": 3, "evening": 1, "night": 0},
        "weeklyTrend": [
            {"day": "Mon", "hours": 0.5},
            {"day": "Tue", "hours": 1.0},
            {"day": "Wed", "hours": 0.0},
            {"day": "Thu", "hours": 1.5},
            {"day": "Fri", "hours": 0.5},
            {"day": "Sat", "hours": 0.0},
            {"day": "Sun", "hours": 0.0},
        ],
    }


@router.get("/progress/charts")
def get_progress_charts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Chart-formatted progress data."""
    contents = (
        db.query(CourseContent)
        .filter(CourseContent.is_available == True)
        .order_by(CourseContent.chapter_number)
        .all()
    )
    progress_records = (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == current_user.id)
        .all()
    )
    progress_map = {p.content_id: p for p in progress_records}

    course_completion = []
    for c in contents:
        p = progress_map.get(c.id)
        pct = p.completion_percentage if p else 0
        course_completion.append({"name": c.title.replace("Chapter ", "Ch"), "value": pct})

    return {
        "monthlyProgress": [
            {"name": "Week 1", "value": 10},
            {"name": "Week 2", "value": 25},
            {"name": "Week 3", "value": 40},
            {"name": "Week 4", "value": 55},
        ],
        "courseCompletion": course_completion,
        "timeSpent": [
            {"name": "Ch 1", "value": 30},
            {"name": "Ch 2", "value": 45},
            {"name": "Ch 3", "value": 20},
            {"name": "Ch 4", "value": 0},
            {"name": "Ch 5", "value": 0},
        ],
    }


@router.get("/achievements/user")
def get_user_achievements(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """User achievements for the dashboard."""
    progress_records = (
        db.query(ProgressRecord)
        .filter(ProgressRecord.user_id == current_user.id)
        .all()
    )
    completed = sum(1 for p in progress_records if p.status == "completed")

    achievements = []
    # Starter achievements everyone gets
    achievements.append(
        {
            "id": "getting-started",
            "name": "Getting Started",
            "achievements": [
                {
                    "id": "first-login",
                    "name": "First Login",
                    "description": "Logged in for the first time",
                    "earnedDate": "2026-02-08",
                    "icon": "star",
                    "rarity": "common",
                },
                {
                    "id": "enrolled",
                    "name": "Course Enrolled",
                    "description": "Enrolled in your first course",
                    "earnedDate": "2026-02-08",
                    "icon": "book",
                    "rarity": "common",
                },
            ],
        }
    )

    if completed > 0:
        achievements.append(
            {
                "id": "progress",
                "name": "Progress",
                "achievements": [
                    {
                        "id": "first-complete",
                        "name": "First Chapter Complete",
                        "description": "Completed your first chapter",
                        "earnedDate": "2026-02-08",
                        "icon": "check",
                        "rarity": "rare",
                    }
                ],
            }
        )

    return achievements
