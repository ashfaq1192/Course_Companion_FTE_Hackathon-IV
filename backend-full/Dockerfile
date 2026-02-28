FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Default port 7860 for HF Spaces; override via $PORT env var for other platforms
ENV PORT=7860

# Run the application
CMD uvicorn src.main:app --host 0.0.0.0 --port $PORT