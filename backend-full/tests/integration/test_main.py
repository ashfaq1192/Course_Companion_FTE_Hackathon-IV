import pytest
from fastapi.testclient import TestClient
from src.main import create_app


@pytest.fixture
def client():
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Course Companion FTE Backend API"}


def test_api_docs_available(client):
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_json_available(client):
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    assert "Course Companion FTE Backend" in str(response.content) or "Course Companion FTE Backend API" in str(response.content)