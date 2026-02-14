# Deployment Guide

## Overview

This document provides instructions for deploying the Course Companion Web App to various platforms. The app is built with Next.js and can be deployed as a static site or server-side rendered application.

## Prerequisites

Before deploying, ensure you have:
- Built the application (`npm run build`)
- Set all required environment variables
- Configured your backend API endpoints
- Validated all security measures

## Environment Variables

The following environment variables must be set in your deployment environment:

### Required Variables
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (e.g., `https://api.example.com/api/v1`)
- `NEXT_PUBLIC_WS_BASE_URL` - WebSocket URL (if applicable, e.g., `wss://api.example.com`)

### Optional Variables
- `NEXT_PUBLIC_ENABLE_HYBRID_FEATURES` - Enable/disable hybrid intelligence features
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics tracking
- `NEXT_PUBLIC_SEGMENT_WRITE_KEY` - Segment write key (if using analytics)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (if using error tracking)

## Build Configuration

The application is configured for deployment in `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Using the new app directory
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_WS_BASE_URL: process.env.NEXT_PUBLIC_WS_BASE_URL,
  },
  images: {
    domains: ['localhost', 'your-backend-domain.com'],
  },
}

module.exports = nextConfig
```

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

#### Manual Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to configure your project
4. Set environment variables in the Vercel dashboard

#### Git Integration
1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Development Command: `npm run dev`

#### Environment Variables in Vercel
Set environment variables in the Vercel dashboard under Settings > Environment Variables.

### Netlify

#### Build Settings
- Build Command: `npm run build`
- Publish Directory: `out` (for static export) or `.next` (for SSR)

#### Environment Variables
Set environment variables in Netlify under Site Settings > Build & Deploy > Environment.

### Traditional Web Server (Static Export)

To deploy as a static site:

1. Configure static export in `next.config.js`:
```js
const nextConfig = {
  output: 'export', // Enable static exports
  // Other config...
}

module.exports = nextConfig
```

2. Build the application:
```bash
npm run build
```

3. Deploy the `out/` directory to your web server.

### Node.js Server (SSR)

To deploy as a server-side rendered application:

1. Build the application:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

The application will be available on the port specified in your environment (default is 3000).

## Docker Deployment

The application can be deployed using Docker:

### Dockerfile
```Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM base AS runtime
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
      - NEXT_PUBLIC_WS_BASE_URL=${NEXT_PUBLIC_WS_BASE_URL}
    restart: unless-stopped
```

## Security Considerations

### HTTPS
Always serve the application over HTTPS in production.

### Content Security Policy
The application implements a Content Security Policy to prevent XSS attacks.

### Environment Variables
Never commit sensitive environment variables to version control.

### Authentication
Ensure proper authentication and authorization mechanisms are in place.

## Performance Optimization

### Image Optimization
The application uses Next.js Image component for optimized image delivery.

### Bundle Optimization
- Code splitting at route level
- Dynamic imports for heavy components
- Tree shaking to eliminate dead code

### Caching
- Static assets are cached with long expiry
- API responses are cached appropriately
- Service worker for offline functionality (if implemented)

## Monitoring and Analytics

### Error Tracking
Configure error tracking with Sentry or similar service.

### Performance Monitoring
Monitor Core Web Vitals and other performance metrics.

### User Analytics
Track user interactions and engagement metrics.

## Troubleshooting

### Common Issues
1. **Environment Variables Not Set**: Ensure all required environment variables are set in the deployment environment
2. **API Connection Errors**: Verify that the backend API is accessible from the deployed frontend
3. **Asset Loading Issues**: Check that static assets are properly served
4. **CORS Errors**: Configure proper CORS settings on the backend

### Debugging Tips
- Check browser console for JavaScript errors
- Verify network requests in browser dev tools
- Review server logs for SSR errors
- Test on different browsers and devices

## Rollback Strategy

Always have a rollback plan:
1. Keep previous versions of your application
2. Use feature flags to disable problematic features
3. Monitor application health after deployment
4. Have a quick rollback procedure ready