from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.course_content import CourseContent
from ..core.cloudflare_r2 import r2_client


class ContentService:
    """
    Content service that provides deterministic content delivery without any processing.
    All content is served verbatim from the database as stored, with no transformations
    or intelligent processing applied.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_content_by_id(self, content_id: int) -> Optional[CourseContent]:
        """Retrieve course content by its ID"""
        return self.db.query(CourseContent).filter(CourseContent.id == content_id).first()

    def get_content_by_course(self, course_id: str, skip: int = 0, limit: int = 100) -> List[CourseContent]:
        """Retrieve all content for a specific course, ordered by chapter and section"""
        return (
            self.db.query(CourseContent)
            .filter(CourseContent.course_id == course_id)
            .filter(CourseContent.is_available == True)
            .order_by(CourseContent.chapter_number, CourseContent.section_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def search_content(self, query: str, course_id: Optional[str] = None, skip: int = 0, limit: int = 10) -> List[CourseContent]:
        """Search course content by keywords"""
        search_query = self.db.query(CourseContent).filter(
            CourseContent.content_data.contains(query) | CourseContent.title.contains(query)
        ).filter(CourseContent.is_available == True)

        if course_id:
            search_query = search_query.filter(CourseContent.course_id == course_id)

        return search_query.offset(skip).limit(limit).all()

    def get_next_content(self, current_content: CourseContent) -> Optional[CourseContent]:
        """Get the next content in the course sequence"""
        next_content = (
            self.db.query(CourseContent)
            .filter(CourseContent.course_id == current_content.course_id)
            .filter(CourseContent.chapter_number == current_content.chapter_number)
            .filter(CourseContent.section_number > current_content.section_number)
            .filter(CourseContent.is_available == True)
            .order_by(CourseContent.section_number)
            .first()
        )

        if not next_content:
            # If no next section in current chapter, get first section of next chapter
            next_content = (
                self.db.query(CourseContent)
                .filter(CourseContent.course_id == current_content.course_id)
                .filter(CourseContent.chapter_number > current_content.chapter_number)
                .filter(CourseContent.is_available == True)
                .order_by(CourseContent.chapter_number, CourseContent.section_number)
                .first()
            )

        return next_content

    def get_prev_content(self, current_content: CourseContent) -> Optional[CourseContent]:
        """Get the previous content in the course sequence"""
        prev_content = (
            self.db.query(CourseContent)
            .filter(CourseContent.course_id == current_content.course_id)
            .filter(CourseContent.chapter_number == current_content.chapter_number)
            .filter(CourseContent.section_number < current_content.section_number)
            .filter(CourseContent.is_available == True)
            .order_by(desc(CourseContent.section_number))
            .first()
        )

        if not prev_content:
            # If no previous section in current chapter, get last section of previous chapter
            prev_content = (
                self.db.query(CourseContent)
                .filter(CourseContent.course_id == current_content.course_id)
                .filter(CourseContent.chapter_number < current_content.chapter_number)
                .filter(CourseContent.is_available == True)
                .order_by(desc(CourseContent.chapter_number), desc(CourseContent.section_number))
                .first()
            )

        return prev_content