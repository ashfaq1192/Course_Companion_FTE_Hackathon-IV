# Phase 3: Web App

This directory contains the implementation of Phase 3 of the Course Companion FTE project: a full standalone Web App with comprehensive LMS features.

## Overview

Phase 3 implements a full standalone Web App with comprehensive LMS features. This provides a complete web-based interface separate from the ChatGPT App. It includes all features from Phase 1 and Phase 2, with additional web-specific functionality.

## Features Implemented

- Full LMS dashboard
- Progress visualization
- Admin features
- Comprehensive course management
- Standalone authentication and authorization
- Rich user interfaces for all educational features
- Web-specific UI components
- Responsive design for all device sizes

## Tech Stack

### Frontend
- Next.js / React
- Tailwind CSS
- Responsive design

### Backend
- FastAPI (Python) with LLM capabilities
- SQLAlchemy (PostgreSQL)
- Cloudflare R2 for content storage

## Setup Instructions

### Frontend Setup
1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access the app at `http://localhost:3000`

### Backend Setup
1. Navigate to `backend/` directory
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn src.main:app --reload`
6. Access the API documentation at `http://localhost:8000/docs`

## API Integration

The frontend communicates with the backend through the API client located at `utils/api.js`. All API endpoints from Phases 1 and 2 are available.

## Architecture

This implementation combines:
- Phase 1: Zero-Backend-LLM architecture for core functionality
- Phase 2: Hybrid Intelligence for premium features
- Phase 3: Full web application with comprehensive UI/UX