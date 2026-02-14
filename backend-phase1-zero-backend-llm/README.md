# Course Companion FTE - Phase 1 Backend

This is the Phase 1 backend for the Course Companion FTE (Full-Time Equivalent Educational Tutor) project. It implements a Zero-Backend-LLM architecture where the backend performs zero LLM inference and ChatGPT handles ALL explanation, tutoring, and adaptation.

## Architecture Overview

The Course Companion FTE follows a Zero-Backend-LLM architecture for Phase 1:

- **Backend**: Performs only deterministic operations (content delivery, progress tracking, quiz grading, access control)
- **ChatGPT**: Handles all intelligent processing (explanations, tutoring, adaptation)
- **Cost Efficiency**: Near-zero marginal cost per user due to no backend LLM calls
- **Scalability**: Scales to 100K+ users without linear cost increase

## Features

- **Content Delivery**: Serve course content verbatim from Cloudflare R2 storage
- **Progress Tracking**: Track user progress and maintain learning streaks
- **Quiz Functionality**: Rule-based quiz grading without LLM calls
- **Freemium Access**: Subscription-based access control for premium features
- **Search**: Keyword-based search of course content
- **Authentication**: JWT-based authentication with OAuth 2.0
- **API Documentation**: Auto-generated with Swagger UI and ReDoc

## Tech Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL (with SQLAlchemy ORM)
- **Authentication**: JWT tokens with OAuth 2.0
- **Content Storage**: Cloudflare R2 (S3-compatible)
- **Containerization**: Docker & Docker Compose
- **Testing**: pytest with multiple test levels

## Prerequisites

- Python 3.11+
- Docker and Docker Compose
- PostgreSQL (if running without Docker)
- Cloudflare R2 account for content storage

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/course-companion-fte.git
cd course-companion-fte
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Set up environment variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
# Edit .env with your specific configuration
```

Required environment variables:
- `SECRET_KEY`: A long, random secret key for JWT signing
- `DATABASE_URL`: PostgreSQL connection string
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_ACCESS_KEY_ID`: Your R2 access key ID
- `CLOUDFLARE_SECRET_ACCESS_KEY`: Your R2 secret access key
- `CLOUDFLARE_R2_BUCKET`: Your R2 bucket name

### 5. Set up the database

```bash
# Run database migrations
alembic upgrade head
```

## Running the Application

### Development Mode

```bash
# Activate virtual environment
source venv/bin/activate

# Run the application
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- Documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

## API Endpoints

### Authentication
- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - Login and get access token

### Content Management
- `GET /api/v1/content/{content_id}` - Get specific content
- `GET /api/v1/content/by-course/{course_id}` - Get all content for a course
- `GET /api/v1/content/search` - Search content by keywords

### Progress Tracking
- `GET /api/v1/progress/{content_id}` - Get user progress for content
- `PUT /api/v1/progress/{content_id}` - Update user progress

### Quiz Functionality
- `POST /api/v1/quiz/{content_id}/start` - Start a quiz
- `POST /api/v1/quiz/{content_id}/submit` - Submit quiz answers

### Subscription Management
- `GET /api/v1/subscriptions/current` - Get current user's subscription

## Testing

### Run all tests
```bash
pytest
```

### Run specific test types
```bash
# Unit tests
pytest tests/unit/

# Integration tests
pytest tests/integration/

# Contract tests
pytest tests/contract/

# With coverage
pytest --cov=src --cov-report=html
```

## Project Structure

```
course-companion-fte/
├── src/                    # Source code
│   ├── main.py            # Application entry point
│   ├── api/               # API route definitions
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   ├── database/          # Database configuration
│   ├── core/              # Core utilities and configuration
│   └── utils/             # Utility functions
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── contract/          # API contract tests
├── docs/                  # Documentation
├── alembic/               # Database migrations
├── requirements.txt       # Python dependencies
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── .env.example           # Environment variables example
```

## Zero-Backend-LLM Architecture Verification

This implementation strictly follows the Zero-Backend-LLM principle for Phase 1:

- ✅ No LLM API calls made by the backend
- ✅ All intelligent processing happens in ChatGPT
- ✅ Backend performs only deterministic operations
- ✅ Content served verbatim without processing
- ✅ Quiz grading done with rule-based evaluation
- ✅ Progress tracking without intelligent analysis

To verify compliance, check application logs for any LLM API calls.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the full test suite (`pytest`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| SECRET_KEY | Secret key for JWT signing | Yes |
| ALGORITHM | JWT algorithm (default: HS256) | No |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | No (default: 30) |
| DATABASE_URL | PostgreSQL connection string | Yes |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare account ID | Yes |
| CLOUDFLARE_ACCESS_KEY_ID | R2 access key ID | Yes |
| CLOUDFLARE_SECRET_ACCESS_KEY | R2 secret access key | Yes |
| CLOUDFLARE_R2_BUCKET | R2 bucket name | Yes |
| DEBUG | Enable debug mode | No (default: false) |

## Performance Benchmarks

- Content API calls: <200ms response time
- Progress API calls: <500ms response time
- System availability: 99.9%+
- Concurrent users supported: 100,000+

## Security

- Passwords are hashed using bcrypt
- JWT tokens with configurable expiration
- Input validation with Pydantic
- SQL injection prevention via SQLAlchemy ORM
- Rate limiting (to be implemented)

## Deployment

See [Deployment Guide](docs/deployment-guide.md) for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.