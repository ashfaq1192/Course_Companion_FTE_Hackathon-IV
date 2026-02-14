# Security Hardening Guide

## Overview

This document outlines the security measures implemented in the Course Companion Web App to protect against common web vulnerabilities and ensure secure handling of user data.

## Security Principles

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Users and components have minimal necessary permissions
3. **Secure by Default**: Security measures are enabled by default
4. **Fail Securely**: Systems default to secure state when errors occur

## Input Sanitization

### HTML Content
All user-generated content is sanitized before rendering to prevent XSS attacks:

```tsx
// Example of safe content rendering
import DOMPurify from 'isomorphic-dompurify';

const SafeContent = ({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};
```

### Form Inputs
Form inputs are validated both client-side and server-side:

```tsx
// Example of input validation
const validateInput = (input: string, type: 'email' | 'text' | 'password') => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'password':
      return input.length >= 8;
    default:
      return true;
  }
};
```

## Authentication Security

### Token Storage
Authentication tokens are stored securely:

```tsx
// Secure token storage
const storeToken = (token: string) => {
  // Store in httpOnly cookie if possible, otherwise in memory
  // Avoid storing sensitive tokens in localStorage
  sessionStorage.setItem('token', token);
};

const getToken = () => {
  return sessionStorage.getItem('token');
};
```

### Token Refresh
Implement secure token refresh mechanisms:

```tsx
// Token refresh logic
const refreshAuthToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const { token, refreshToken: newRefreshToken } = await response.json();
    
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refreshToken', newRefreshToken);
    
    return token;
  } catch (error) {
    // Handle refresh failure - possibly redirect to login
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};
```

## API Security

### Request Validation
All API requests are validated:

```tsx
// Example API service with validation
class SecureApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    // Ensure we're making requests to the correct origin
    if (!endpoint.startsWith('/')) {
      throw new Error('Invalid endpoint');
    }
    
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response;
  }
}
```

### Rate Limiting
API calls are subject to rate limiting on the backend.

## Content Security Policy (CSP)

The application implements a Content Security Policy to prevent XSS attacks:

```tsx
// Example CSP header configuration (usually in next.config.js or server setup)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL};
  frame-ancestors 'none';
  object-src 'none';
`;
```

## Data Protection

### Sensitive Information
Avoid exposing sensitive information in client-side code:

```tsx
// Do not expose sensitive data in client-side code
// Instead, fetch from secure backend endpoints
const fetchUserData = async () => {
  const response = await apiService.get('/users/me');
  // Only return necessary data to the client
  return {
    id: response.data.id,
    email: response.data.email,
    fullName: response.data.fullName,
    subscriptionType: response.data.subscriptionType
    // Do not return sensitive fields like passwords, tokens, etc.
  };
};
```

## Secure Communication

### HTTPS Enforcement
All communications are encrypted using HTTPS.

### Secure Headers
The application sets appropriate security headers:

```tsx
// Example of setting security headers (in _app.tsx or middleware)
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Prevent iframe embedding
    if (window.self !== window.top) {
      document.documentElement.style.display = 'none';
      window.open('about:blank', '_self')?.close();
    }
  }, []);

  return null;
};
```

## Error Handling Security

### Error Messages
Error messages do not expose sensitive system information:

```tsx
// Secure error handling
const handleError = (error: any) => {
  // Log full error details on the client for debugging
  console.error('Error details:', error);
  
  // Show generic message to user
  const userMessage = error.status === 500 
    ? 'An error occurred. Please try again later.' 
    : error.message || 'An error occurred.';
  
  return userMessage;
};
```

## Dependency Security

### Regular Updates
Keep dependencies updated to patch known vulnerabilities:

```bash
# Regularly update dependencies
npm audit
npm audit fix
```

### Trusted Sources
Only use dependencies from trusted sources and maintain an inventory of dependencies.

## Session Management

### Session Expiration
Implement proper session expiration:

```tsx
// Session timeout implementation
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

let lastActivity = Date.now();

const resetTimeout = () => {
  lastActivity = Date.now();
};

const checkTimeout = () => {
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    // Logout user due to inactivity
    handleLogout();
  }
};

// Set up activity listeners
window.addEventListener('mousemove', resetTimeout);
window.addEventListener('keypress', resetTimeout);
window.addEventListener('click', resetTimeout);

// Check timeout periodically
setInterval(checkTimeout, 60000); // Check every minute
```

## Testing Security Measures

### Security Testing
Regularly test security measures:
- Penetration testing
- Vulnerability scanning
- Code reviews for security issues
- Dependency vulnerability checks

### Automated Security Checks
Include security checks in CI/CD pipeline:
- Dependency vulnerability scanning
- Static code analysis
- Security configuration validation

## Incident Response

### Logging
Log security-relevant events:
- Failed login attempts
- Access to sensitive resources
- Configuration changes
- Error conditions

### Monitoring
Monitor for suspicious activities:
- Unusual traffic patterns
- Multiple failed login attempts
- Access from unexpected locations
- Unexpected API usage patterns

## Best Practices

1. **Never trust client-side data**: Always validate on the server
2. **Use parameterized queries**: Prevent SQL injection
3. **Implement proper access controls**: Verify permissions for each request
4. **Keep software updated**: Apply security patches promptly
5. **Follow security guidelines**: Adhere to OWASP Top 10 and similar standards
6. **Regular security training**: Keep the team updated on security threats
7. **Incident response plan**: Have procedures for handling security incidents