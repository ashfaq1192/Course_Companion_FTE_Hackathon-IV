# Course Companion Web App

This is the standalone web application for the Course Companion FTE project. It provides a comprehensive learning management system with dashboard, progress visualization, admin features, and all functionality from previous phases.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Security](#security)
- [Contributing](#contributing)

## Features

### Core Learning Features
- **Course Catalog**: Browse and search available courses
- **Course Content**: Access course materials with rich media support
- **Progress Tracking**: Track learning progress with visual indicators
- **Quizzes & Assessments**: Take quizzes with immediate feedback
- **Achievements**: Earn badges and track accomplishments

### Dashboard & Analytics
- **Progress Visualization**: Charts and graphs showing learning progress
- **Learning Analytics**: Insights into study habits and performance
- **Achievement Display**: Showcase earned badges and milestones
- **Weekly Goals**: Set and track weekly learning objectives

### Admin Features
- **User Management**: Manage user accounts and subscriptions
- **Course Management**: Create and manage course content
- **System Settings**: Configure system-wide settings
- **Analytics Dashboard**: View platform usage and performance metrics

### Accessibility & Responsiveness
- **WCAG 2.1 AA Compliance**: Fully accessible interface
- **Responsive Design**: Works on all device sizes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS with custom component library
- **State Management**: Zustand for global state, React Query for server state
- **UI Components**: Custom component library built on Tailwind
- **API Client**: Axios with centralized service layer
- **Testing**: Jest, React Testing Library, Playwright for E2E tests
- **Accessibility**: React ARIA, ARIA attributes, semantic HTML

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Access to the Course Companion backend API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd course-companion-web-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the project root with the following variables:
```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000

# Authentication Configuration
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Feature Flags
NEXT_PUBLIC_ENABLE_HYBRID_FEATURES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Third-party Integrations (if applicable)
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your-segment-write-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend-web/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── images/
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base components (Button, Card, etc.)
│   │   ├── layout/        # Layout components (header, sidebar, footer)
│   │   └── features/      # Feature-specific components (dashboard, course, etc.)
│   ├── pages/             # Next.js pages
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── store/             # State management (Zustand)
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── tests/                 # Test files
│   ├── unit/              # Unit tests for components
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests (Playwright/Cypress)
├── docs/                  # Documentation
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## Development

### Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint
- `npm run test` - Runs all tests
- `npm run test:unit` - Runs unit tests
- `npm run test:integration` - Runs integration tests
- `npm run test:e2e` - Runs end-to-end tests

### Component Development

Components are organized by feature and reusability:

- **UI Components** (`src/components/ui/`): Base components like Button, Card, Input
- **Layout Components** (`src/components/layout/`): Structural components like Header, Sidebar
- **Feature Components** (`src/components/features/`): Feature-specific components like Dashboard, Course, Quiz

### API Integration

API calls are handled through a centralized service layer:

```tsx
// Example API call
import { contentService } from '@/services/contentService';

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: () => contentService.getContentByCourse(courseId)
  });
  
  // Component implementation
};
```

## Testing

### Unit Tests

Unit tests are located in `tests/unit/` and test individual components and functions:

```bash
npm run test:unit
```

### Integration Tests

Integration tests are located in `tests/integration/` and test interactions between components/services:

```bash
npm run test:integration
```

### End-to-End Tests

E2E tests are located in `tests/e2e/` and test complete user workflows:

```bash
npm run test:e2e
```

## Deployment

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

### Environment Variables

Required environment variables for deployment:

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_WS_BASE_URL` - WebSocket URL (if applicable)

## API Integration

The application connects to the Course Companion backend API through a service layer that handles:
- Authentication token management
- Request/response interceptors
- Error handling
- Caching
- Retry logic

All API services follow the same pattern and are located in `src/services/`.

## Security

### Input Sanitization

All user inputs are sanitized before processing using the security utilities in `src/utils/security.ts`.

### Authentication

Authentication is handled through JWT tokens stored securely in session storage.

### Data Protection

Sensitive data is protected through:
- Client-side encryption for sensitive fields
- Secure token storage
- Input validation and sanitization
- Proper error handling to avoid information leakage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm run test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Write accessible components with proper ARIA attributes
- Use Tailwind CSS for styling
- Write tests for new functionality
- Document complex logic

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://reactjs.org/docs) - learn about React.
- [TypeScript](https://www.typescriptlang.org/docs/) - learn about TypeScript.
- [Tailwind CSS](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) - learn about Zustand state management.
- [React Query](https://tanstack.com/query/v4/docs/react/overview) - learn about React Query for server state.

## License

This project is licensed under the MIT License.