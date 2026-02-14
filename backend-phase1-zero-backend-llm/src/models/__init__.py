from sqlalchemy import Integer
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import Column, DateTime, func


@as_declarative()
class Base:
    __allow_unmapped__ = True  # Allow unmapped attributes for datetime columns

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Import all models to ensure they are registered with SQLAlchemy
from .user import User  # noqa: F401
from .course_content import CourseContent  # noqa: F401
from .progress import ProgressRecord  # noqa: F401
from .quiz import QuizQuestion, QuizAttempt  # noqa: F401
from .subscription import Subscription  # noqa: F401
