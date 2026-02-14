# Testing Strategy for Course Companion FTE Backend

## Overview

This document outlines the testing strategy for the Course Companion FTE backend, which follows a Zero-Backend-LLM architecture where all intelligent processing happens in ChatGPT while the backend handles deterministic operations.

## Test Levels

### Unit Tests
Located in `tests/unit/`
- Test individual functions and classes in isolation
- Mock all external dependencies (database, external APIs)
- Fast execution, high coverage of business logic
- Example: Testing service layer functions with mocked database sessions

### Integration Tests
Located in `tests/integration/`
- Test interactions between multiple components
- Use real database connections (with test database)
- Verify API endpoints work with actual database
- Example: Testing that API endpoints correctly call service functions

### Contract Tests
Located in `tests/contract/`
- Verify API contracts match OpenAPI specification
- Ensure backward compatibility of API endpoints
- Test that responses match expected schemas
- Example: Verifying that authentication API returns expected response format

### End-to-End Tests
Located in `tests/e2e/`
- Test complete user workflows
- Use real database and external services
- Verify complete functionality from user perspective
- Example: Register user, login, access content, track progress

## Testing Tools & Frameworks

- **pytest**: Primary testing framework
- **pytest-asyncio**: For testing asynchronous code
- **httpx**: For API testing (asynchronous alternative to requests)
- **pytest-mock**: For mocking dependencies
- **factory-boy**: For creating test data
- **coverage**: For measuring test coverage

## Test Organization

### Naming Convention
- `test_{unit_name}.py` for unit tests
- `test_{feature}_integration.py` for integration tests
- `test_{api_endpoint}_contract.py` for contract tests

### Structure
```
tests/
├── unit/
│   ├── test_auth_service.py
│   ├── test_content_service.py
│   └── test_progress_service.py
├── integration/
│   ├── test_auth_api.py
│   ├── test_content_api.py
│   └── test_progress_api.py
├── contract/
│   └── test_api_contracts.py
└── conftest.py  # Shared fixtures
```

## Test Data Management

### Fixtures
Use pytest fixtures for common test objects:

```python
@pytest.fixture
def mock_user():
    return User(
        id=1,
        email="test@example.com",
        full_name="Test User",
        is_active=True
    )

@pytest.fixture
def client():
    from main import app
    from fastapi.testclient import TestClient
    return TestClient(app)
```

### Test Database
- Use separate test database (sqlite in-memory for unit tests)
- Clean database between test runs
- Use transactions that rollback after each test

## Testing Best Practices

### Unit Tests
- Test one function/method per test
- Use descriptive test names: `test_{function_name}_{scenario}`
- Mock all external dependencies
- Aim for 90%+ coverage of business logic

### API Tests
- Test all HTTP methods for each endpoint
- Test both success and failure cases
- Verify response status codes and data structure
- Test authentication and authorization

### Security Tests
- Test for unauthorized access
- Test input validation
- Test rate limiting (when implemented)
- Test SQL injection prevention

## Running Tests

### All Tests
```bash
pytest
```

### Specific Test Level
```bash
# Unit tests only
pytest tests/unit/

# Integration tests only
pytest tests/integration/

# With coverage
pytest --cov=src --cov-report=html
```

### Continuous Integration
Tests run automatically in CI pipeline:
- All tests must pass before merge
- Coverage must not decrease
- Security tests included

## Quality Gates

### Test Coverage
- Minimum 80% line coverage for new features
- Critical paths should have 95%+ coverage
- Coverage measured on each PR

### Performance Tests
- API endpoints should respond within specified SLAs:
  - Content APIs: <200ms
  - Progress APIs: <500ms
- Load testing for 1000+ concurrent users

## Test Maintenance

### Adding New Tests
1. Identify the test level (unit, integration, contract)
2. Follow existing naming conventions
3. Write clear, descriptive test names
4. Test both positive and negative cases
5. Include proper assertions

### Updating Tests
- Update tests when changing functionality
- Maintain backward compatibility in APIs
- Update test data when models change

## Special Considerations for Zero-Backend-LLM Architecture

### Deterministic Testing
- Since backend is deterministic, tests can be highly predictable
- Focus on testing data flow rather than AI processing
- Verify that content is delivered correctly without modification

### External Service Testing
- Mock ChatGPT API calls in unit tests
- Integration tests may include real ChatGPT API calls in staging
- Verify that proper content is sent to ChatGPT for processing

### Performance Testing
- Focus on measuring deterministic operations
- Verify that no LLM calls are made from backend
- Test that content delivery meets performance requirements

## Test Reporting

### CI Reports
- Test results with detailed failure messages
- Coverage reports highlighting gaps
- Performance metrics for API endpoints

### Local Development
- Fast feedback during development
- Ability to run specific tests during debugging
- Clear error messages for failed tests

## Future Enhancements

### Security Testing
- Add automated security scanning
- Include penetration testing in release process
- Add security-specific test cases

### Performance Testing
- Automated load testing
- Performance regression detection
- Stress testing for high-traffic scenarios

### Chaos Engineering
- Test resilience to service failures
- Verify graceful degradation
- Test retry mechanisms and circuit breakers