# Phase 2: Hybrid Intelligence

This directory contains the implementation of Phase 2 of the Course Companion FTE project: Hybrid Intelligence features added to the Phase 1 foundation.

## Overview

Phase 2 adds selective backend intelligence that delivers clear additional educational value, is cost-justified as a premium feature, and is cleanly isolated from Phase 1 logic. This includes features that require backend LLM calls.

## Architecture Principles

- **Selective LLM integration** - Only in specific premium features
- **Feature-scoped** - Limited to specific functionality
- **User-initiated** - Users explicitly request these features
- **Premium-gated** - Available only to paying subscribers
- **Isolated** - Separate API routes from Phase 1 functionality
- **Cost-tracked** - Monitor per-user cost of LLM usage

## Features Implemented

- Adaptive Learning Paths - Personalized recommendations using LLM analysis
- LLM-Graded Assessments - Detailed feedback on free-form answers
- Premium Feature Access Control - Proper gating for hybrid features
- Cost Tracking - Usage and cost monitoring for hybrid features

## Technologies Used

- All Phase 1 technologies
- OpenAI API integration
- Cost tracking and usage analytics
- Enhanced access control

## Setup Instructions

1. Create a virtual environment: `python -m venv venv && source venv/bin/activate`
2. Install dependencies: `pip install -r requirements.txt`
3. Set environment variables including `OPENAI_API_KEY`
4. Run the application: `uvicorn src.main:app --reload`
5. Access the API documentation at `http://localhost:8000/docs`

## Compliance

This implementation complies with the Hybrid Intelligence requirements:
- ✅ Hybrid features are feature-scoped
- ✅ Hybrid features are user-initiated
- ✅ Hybrid features are premium-gated
- ✅ Hybrid features are isolated in separate API routes
- ✅ Cost tracking implemented
- ✅ Clear separation from Phase 1 logic