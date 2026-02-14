# Quickstart Guide: Phase 1 - Zero-Backend-LLM ChatGPT App

## Overview
This guide will help you set up and run the Phase 1 backend for the Course Companion FTE project. This is a FastAPI-based backend that provides deterministic services for content delivery, progress tracking, quiz functionality, and subscription management without any LLM calls.

## Prerequisites
- Python 3.11+
- PostgreSQL 12+
- Docker and Docker Compose (optional, for containerized deployment)
- Cloudflare R2 account for content storage

## Environment Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd course-companion-fte/backend
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost/dbname

# JWT Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET=your-bucket-name

# Application Configuration
APP_ENV=development
DEBUG=True
```

## Database Setup

### 1. Initialize the database
```bash
# Using Alembic for database migrations
alembic upgrade head
```

### 2. (Alternative) Create tables directly
If not using Alembic, you can create tables directly:
```bash
python -c "from src.database.database import engine; from src.models import Base; Base.metadata.create_all(bind=engine)"
```

## Running the Application

### Option 1: Direct execution
```bash
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Using Docker
```bash
docker-compose up --build
```

### Option 3: Using uvicorn with gunicorn (production)
```bash
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Documentation
Once the application is running, you can access:
- Interactive API documentation at `http://localhost:8000/docs`
- Alternative API documentation at `http://localhost:8000/redoc`
- Raw OpenAPI schema at `http://localhost:8000/openapi.json`

## Testing

### Running tests
```bash
# Run all tests
pytest

# Run unit tests
pytest tests/unit/

# Run integration tests
pytest tests/integration/

# Run with coverage
pytest --cov=src
```

## Key Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Content Management
- `GET /content/{content_id}` - Retrieve specific content
- `GET /content/by-course/{course_id}` - Retrieve content by course
- `GET /content/search` - Search content

### Progress Tracking
- `GET /progress/{content_id}` - Get user progress for content
- `PUT /progress/{content_id}` - Update user progress
- `GET /progress/user/{user_id}` - Get all progress for user

### Quiz Functionality
- `POST /quiz/{content_id}/start` - Start a quiz
- `POST /quiz/{content_id}/submit` - Submit quiz answers
- `GET /quiz/attempts/{attempt_id}` - Get quiz attempt details

### Subscriptions
- `GET /subscriptions/current` - Get current user's subscription

## Development Guidelines

### Adding New Endpoints
1. Define the endpoint in the appropriate router file in `src/api/`
2. Create or update Pydantic models in `src/models/`
3. Implement business logic in `src/services/`
4. Add tests in the `tests/` directory
5. Update the OpenAPI contract if needed

### Database Models
- Define all database models in `src/models/`
- Use SQLAlchemy ORM with Pydantic integration
- Follow the existing patterns for relationships and constraints

### Service Layer
- Place business logic in `src/services/`
- Keep API handlers thin by delegating to services
- Use dependency injection for database sessions and other dependencies

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Verify your DATABASE_URL is correct and the database is running
2. **JWT Secret Missing**: Ensure SECRET_KEY is set in your environment
3. **Cloudflare R2 Access**: Verify your R2 credentials are correct

### Debugging Tips
- Enable DEBUG mode in your environment for more detailed error messages
- Check the application logs for detailed error information
- Use the interactive API documentation to test endpoints directly

## Deployment

### Production Deployment
1. Set `APP_ENV=production` and `DEBUG=False`
2. Use a production WSGI server like Gunicorn
3. Set up a reverse proxy (nginx) for static files and SSL
4. Ensure your database and R2 credentials are properly secured

### Docker Deployment
Update the docker-compose.yml with your production settings and run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Architecture Notes

This backend strictly follows the Zero-Backend-LLM principle for Phase 1:
- No LLM API calls are made from the backend
- All intelligent processing happens in ChatGPT
- The backend provides deterministic services: content delivery, progress tracking, quiz grading, and access control
- All data operations are synchronous and predictable