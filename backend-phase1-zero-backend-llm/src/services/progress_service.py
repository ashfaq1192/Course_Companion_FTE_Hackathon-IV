from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.progress import ProgressRecord
from ..models.user import User
from ..models.course_content import CourseContent


class ProgressService:
    def __init__(self, db: Session):
        self.db = db

    def get_progress_by_user_and_content(self, user_id: int, content_id: int) -> Optional[ProgressRecord]:
        """Get user progress for specific content"""
        return (
            self.db.query(ProgressRecord)
            .filter(ProgressRecord.user_id == user_id)
            .filter(ProgressRecord.content_id == content_id)
            .first()
        )

    def get_all_progress_for_user(self, user_id: int, course_id: Optional[str] = None) -> List[ProgressRecord]:
        """Get all progress records for a specific user"""
        query = self.db.query(ProgressRecord).filter(ProgressRecord.user_id == user_id)

        if course_id:
            # Join with CourseContent to filter by course_id
            query = query.join(CourseContent).filter(CourseContent.course_id == course_id)

        return query.all()

    def create_or_update_progress(self, user_id: int, content_id: int, status: str, 
                                 completion_percentage: float = 0.0, 
                                 time_spent_seconds: int = 0) -> ProgressRecord:
        """Create or update user progress for specific content"""
        progress = self.get_progress_by_user_and_content(user_id, content_id)
        
        if progress:
            # Update existing progress
            progress.status = status
            progress.completion_percentage = completion_percentage
            progress.time_spent_seconds = time_spent_seconds
        else:
            # Create new progress record
            progress = ProgressRecord(
                user_id=user_id,
                content_id=content_id,
                status=status,
                completion_percentage=completion_percentage,
                time_spent_seconds=time_spent_seconds
            )
            self.db.add(progress)

        self.db.commit()
        self.db.refresh(progress)
        return progress

    def get_completed_content_count(self, user_id: int, course_id: Optional[str] = None) -> int:
        """Get the count of completed content for a user"""
        query = self.db.query(ProgressRecord).filter(
            ProgressRecord.user_id == user_id,
            ProgressRecord.status == "completed"
        )

        if course_id:
            # Join with CourseContent to filter by course_id
            query = query.join(CourseContent).filter(CourseContent.course_id == course_id)

        return query.count()

    def get_completion_percentage_for_course(self, user_id: int, course_id: str) -> float:
        """Get overall completion percentage for a course"""
        total_content = self.db.query(CourseContent).filter(
            CourseContent.course_id == course_id,
            CourseContent.is_available == True
        ).count()

        if total_content == 0:
            return 0.0

        completed_content = self.db.query(ProgressRecord).join(CourseContent).filter(
            ProgressRecord.user_id == user_id,
            ProgressRecord.status == "completed",
            CourseContent.course_id == course_id
        ).count()

        return (completed_content / total_content) * 100.0