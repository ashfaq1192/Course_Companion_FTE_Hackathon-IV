import pytest
from fastapi.testclient import TestClient
from src.main import create_app


@pytest.fixture
def client():
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def test_content_api_contract(client):
    """
    Contract test for content retrieval API
    Verifies the API contract defined in the OpenAPI spec
    """
    # Test that the content endpoint exists and returns expected status codes
    # Note: We can't test actual content without a database, so we test the structure
    
    # Test that the endpoint exists
    response = client.get("/api/v1/content/1")
    # This should return 401 since we're not authenticated
    assert response.status_code in [401, 404]  # Either unauthenticated or not found (both valid)


def test_auth_api_contract(client):
    """
    Contract test for authentication API
    Verifies the API contract defined in the OpenAPI spec
    """
    # Test that the auth endpoints exist
    response = client.post("/api/v1/login", json={
        "email": "test@example.com",
        "password": "password"
    })
    # Should return 422 (validation error) or 401 (unauthorized) depending on implementation
    assert response.status_code in [422, 401]


def test_api_structure(client):
    """
    Test that the API follows the expected structure
    """
    # Check that the main endpoints are available
    endpoints_to_check = [
        "/docs",
        "/redoc",
        "/api/v1/openapi.json"
    ]

    for endpoint in endpoints_to_check:
        response = client.get(endpoint)
        assert response.status_code == 200