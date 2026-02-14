import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from src.services.content_service import ContentService
from src.models.course_content import CourseContent


@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)


@pytest.fixture
def content_service(mock_db):
    return ContentService(db=mock_db)


def test_get_content_by_id_found(content_service, mock_db):
    # Arrange
    content_id = 1
    expected_content = CourseContent(id=content_id, title="Test Content")
    mock_db.query.return_value.filter.return_value.first.return_value = expected_content

    # Act
    result = content_service.get_content_by_id(content_id)

    # Assert
    assert result == expected_content
    mock_db.query.assert_called_once_with(CourseContent)
    mock_db.query.return_value.filter.assert_called_once()
    mock_db.query.return_value.filter.return_value.first.assert_called_once()


def test_get_content_by_id_not_found(content_service, mock_db):
    # Arrange
    content_id = 999
    mock_db.query.return_value.filter.return_value.first.return_value = None

    # Act
    result = content_service.get_content_by_id(content_id)

    # Assert
    assert result is None