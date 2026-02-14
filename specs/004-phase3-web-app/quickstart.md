# Quickstart Guide: Phase 3 - Web App

## Overview
This guide will help you set up and run the Phase 3 standalone Web App for the Course Companion FTE project. This is a Next.js/React-based frontend that provides a comprehensive learning management system with dashboard, progress visualization, admin features, and all functionality from previous phases.

## Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Access to the backend API (either local or deployed)
- Git for version control

## Project Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd course-companion-fte/frontend-web
```

### 2. Install dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the project root with the following variables:

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

## Running the Application

### 1. Development Mode
```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

The application will be available at `http://localhost:3000`

### 2. Production Build
```bash
# Build the application
npm run build

# Run the built application
npm start
```

## Key Features and Navigation

### Main Pages
- `http://localhost:3000/` - Home page with course catalog
- `http://localhost:3000/dashboard` - User dashboard with progress tracking
- `http://localhost:3000/courses/[id]` - Individual course pages
- `http://localhost:3000/admin` - Admin panel (for admin users)
- `http://localhost:3000/profile` - User profile and settings

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## API Integration

### Backend Connection
The frontend connects to the backend API at the URL specified in `NEXT_PUBLIC_API_BASE_URL`. Ensure your backend service is running before starting the frontend.

### Authentication
The application handles authentication through JWT tokens. Login credentials are sent to the backend, and the returned token is stored securely in the browser.

## Development Guidelines

### Adding New Components
1. Create new components in the appropriate directory:
   - Shared components: `src/components/ui/`
   - Feature components: `src/components/features/[feature-name]/`
   - Layout components: `src/components/layout/`

2. Follow the component structure:
   ```tsx
   // Example component structure
   import { Button } from '@/components/ui/button';
   
   interface MyComponentProps {
     // Define props interface
   }
   
   export const MyComponent = ({ ... }: MyComponentProps) => {
     return (
       <div>
         {/* Component JSX */}
       </div>
     );
   };
   ```

### API Integration
1. Create API service files in `src/services/`
2. Use React Query for data fetching and caching
3. Handle loading and error states appropriately
4. Follow consistent error handling patterns

### State Management
1. Use React hooks for component-level state
2. Use Zustand for application-level state
3. Use React Query for server state and caching
4. Follow consistent naming conventions

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y
```

### Test Structure
- Unit tests: `src/__tests__/components/`
- Integration tests: `src/__tests__/integration/`
- E2E tests: `tests/e2e/`

## Deployment

### Build Configuration
The application is configured for deployment to platforms like Vercel, Netlify, or traditional web servers.

### Environment Variables
Ensure the following environment variables are set in your deployment environment:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_WS_BASE_URL` - WebSocket URL (if applicable)

### Deployment Scripts
```bash
# Build for deployment
npm run build

# Verify build
npm run start
```

## Troubleshooting

### Common Issues
1. **API Connection Errors**: Verify that the backend service is running and the `NEXT_PUBLIC_API_BASE_URL` is correctly configured
2. **Authentication Issues**: Check that JWT tokens are properly stored and sent with requests
3. **Component Styling Problems**: Ensure Tailwind CSS is properly configured and classes are correctly applied
4. **Performance Issues**: Use React DevTools to identify performance bottlenecks

### Debugging Tips
- Use browser developer tools to inspect network requests
- Check browser console for JavaScript errors
- Use React DevTools to inspect component state and props
- Enable React Query devtools for API caching inspection