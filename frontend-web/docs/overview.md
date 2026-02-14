# Course Companion Web App - Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Components](#components)
4. [API Integration](#api-integration)
5. [State Management](#state-management)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Access to the backend API

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
frontend-web/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base components (Button, Card, etc.)
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── pages/             # Next.js pages
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── store/             # State management (Zustand)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── styles/            # Global styles
├── tests/                 # Test files
├── docs/                  # Documentation
└── package.json
```

## Components

### UI Components
Located in `src/components/ui/`, these are the base components used throughout the application:
- Button
- Card
- Input
- And others...

### Feature Components
Located in `src/components/features/`, these components implement specific functionality:
- Course components
- Dashboard components
- Quiz components
- Admin components
- And others...

## API Integration

The application uses a service layer pattern for API integration. Each service handles specific domain functionality:
- `contentService` - Content delivery and search
- `progressService` - Progress tracking
- `quizService` - Quiz functionality
- `userService` - User management

All API calls go through the central `apiService` which handles authentication, error handling, and caching.

## State Management

The application uses multiple state management solutions:
- React hooks for component-level state
- Zustand for global application state
- React Query for server state and caching

## Testing

The application includes:
- Unit tests for components and services
- Integration tests for API integration
- End-to-end tests for critical user flows
- Accessibility tests
- Responsive design tests

## Deployment

The application is built with Next.js and can be deployed to various platforms:
- Vercel (recommended)
- Netlify
- Traditional web servers