# Deployment Guide for Course Companion FTE Backend

## Overview

This guide provides instructions for deploying the Course Companion FTE backend to various environments. The backend follows a Zero-Backend-LLM architecture where all intelligent processing happens in ChatGPT, while the backend handles deterministic operations.

## Prerequisites

### System Requirements
- Linux server (Ubuntu 20.04+ recommended)
- Python 3.11+
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL 12+ database
- Cloudflare R2 account for content storage

### Infrastructure Requirements
- Minimum 2GB RAM (4GB+ recommended)
- 10GB available disk space
- Stable internet connection
- SSL certificate for production (Let's Encrypt recommended)

## Environment Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Application Settings
SECRET_KEY=your-super-secret-and-long-random-string-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=false
PROJECT_NAME="Course Companion FTE Backend"
VERSION=1.0.0

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/course_companion_fte

# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_SECRET_ACCESS_KEY=your-r2-secret-access-key
CLOUDFLARE_R2_BUCKET=your-r2-bucket-name

# Security
BACKEND_CORS_ORIGINS=http://localhost,http://localhost:3000,https://yourdomain.com

# Performance
CONTENT_API_TIMEOUT_MS=200
PROGRESS_API_TIMEOUT_MS=500
```

## Deployment Methods

### Method 1: Docker Compose (Recommended for Production)

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/course-companion-fte.git
cd course-companion-fte
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your specific configuration
```

3. **Build and deploy:**
```bash
docker-compose up --build -d
```

4. **Run database migrations:**
```bash
docker-compose exec backend alembic upgrade head
```

### Method 2: Direct Installation (Development/Testing)

1. **Install system dependencies:**
```bash
sudo apt-get update
sudo apt-get install python3.11 python3.11-venv python3.11-dev postgresql-client
```

2. **Set up Python virtual environment:**
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

3. **Set environment variables:**
```bash
export $(grep -v '^#' .env | xargs)
```

4. **Run database migrations:**
```bash
alembic upgrade head
```

5. **Start the application:**
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Method 3: Kubernetes (Production)

1. **Prepare Kubernetes manifests:**
```bash
kubectl apply -f k8s/secrets.yaml  # Create secrets from .env
kubectl apply -f k8s/postgres.yaml  # Deploy database
kubectl apply -f k8s/backend.yaml   # Deploy backend
```

## Database Setup

### Initial Setup
The application uses Alembic for database migrations:

```bash
# Upgrade to latest version
alembic upgrade head

# Check current version
alembic current

# Show migration history
alembic history --verbose
```

### Backup and Restore
```bash
# Backup
pg_dump -h hostname -U username -d database_name > backup.sql

# Restore
psql -h hostname -U username -d database_name < backup.sql
```

## Cloudflare R2 Configuration

### Setup Instructions
1. Create a Cloudflare R2 bucket for course content
2. Generate R2 access keys in Cloudflare dashboard
3. Configure CORS settings to allow your frontend domains
4. Set up appropriate IAM permissions

### Content Structure
Course content should be organized in R2 as:
```
course-content/
├── course-id/
│   ├── chapter-1/
│   │   ├── lesson-1.md
│   │   ├── lesson-2.md
│   │   └── quiz.json
│   └── chapter-2/
│       ├── lesson-1.md
│       └── resources/
│           ├── image1.png
│           └── video1.mp4
```

## Security Configuration

### HTTPS Setup
Use nginx as a reverse proxy with SSL termination:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Configuration
```bash
# Allow HTTP/HTTPS and SSH
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Monitoring and Logging

### Application Logs
Logs are written to standard output and can be viewed with:
```bash
# Docker logs
docker-compose logs -f backend

# Systemd logs (if running as service)
journalctl -u course-companion-fte -f
```

### Health Checks
The application provides health check endpoints:
- `/health` - Basic health check
- `/api/v1/health` - API health check

### Metrics
Application metrics are exposed at `/metrics` endpoint (when Prometheus integration is added).

## Scaling Configuration

### Horizontal Scaling
The application is stateless and can be scaled horizontally:
```bash
# With Docker Compose
docker-compose up --scale backend=3

# With Kubernetes
kubectl scale deployment backend --replicas=3
```

### Database Scaling
Consider the following for scaling:
- Connection pooling (SQLAlchemy has built-in pooling)
- Read replicas for read-heavy operations
- Proper indexing for performance

## Zero-Backend-LLM Architecture Verification

### Verification Steps
1. Monitor for any LLM API calls in logs
2. Verify that all intelligent processing happens in ChatGPT
3. Confirm that backend only performs deterministic operations
4. Check that no RAG or prompt orchestration happens in backend

### Audit Trail
The system should maintain logs to verify no LLM calls are made by the backend:
```bash
# Check for any LLM API calls in logs
grep -i "openai\|llm\|gpt\|anthropic" logs/app.log
```

## Backup and Recovery

### Daily Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U user course_companion_fte > backups/ccfte_$DATE.sql
aws s3 cp backups/ccfte_$DATE.sql s3://your-backup-bucket/
find backups/ -name "*.sql" -mtime +30 -delete
```

### Disaster Recovery
1. Restore database from latest backup
2. Deploy latest application version
3. Verify content in Cloudflare R2 is intact
4. Test all functionality

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if database is running
docker-compose ps db

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

#### Performance Issues
```bash
# Check application logs
docker-compose logs backend | grep -i error

# Monitor resource usage
docker stats
```

#### Authentication Issues
- Verify SECRET_KEY is consistent across all instances
- Check that tokens are not expired
- Ensure clock synchronization across servers

### Diagnostic Commands
```bash
# Check application status
curl -X GET http://localhost:8000/health

# Check API endpoints
curl -X GET http://localhost:8000/api/v1/docs

# Verify database connectivity
docker-compose exec backend python -c "from src.database.session import engine; engine.connect()"
```

## Rollback Procedure

1. **Stop current deployment:**
```bash
docker-compose down
```

2. **Deploy previous version:**
```bash
git checkout previous-tag
docker-compose up -d
```

3. **Verify rollback:**
```bash
curl http://localhost:8000/health
```

## Maintenance Tasks

### Regular Maintenance
- Update dependencies monthly
- Rotate secrets quarterly
- Review access logs weekly
- Clean up old logs daily

### Database Maintenance
- Run ANALYZE and VACUUM regularly
- Update statistics
- Check for index fragmentation

## Zero-Downtime Deployment

For zero-downtime deployments, use a load balancer with multiple instances:

1. Deploy new version to secondary instance
2. Test functionality on secondary instance
3. Update load balancer to route traffic to new instance
4. Terminate old instance

## Environment-Specific Configurations

### Development
- DEBUG=true
- In-memory SQLite database (optional)
- Less restrictive CORS settings
- Detailed error messages

### Staging
- DEBUG=false
- Real PostgreSQL database
- Restricted CORS to staging domains
- Standard error messages

### Production
- DEBUG=false
- Production PostgreSQL cluster
- CORS restricted to production domains
- Minimal error information exposed
- Performance optimizations enabled