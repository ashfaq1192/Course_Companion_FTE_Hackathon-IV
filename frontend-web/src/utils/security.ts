
/**
 * Security utilities for the Course Companion Web App
 */

// Input sanitization functions
export const sanitizeInput = (input: string, type: 'text' | 'html' | 'url' | 'email' = 'text'): string => {
  if (!input) return '';

  switch (type) {
    case 'html':
      // Remove potentially dangerous HTML tags and attributes
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+="[^"]*"/gi, '');
    
    case 'url':
      // Validate URL format
      try {
        new URL(input);
        return input;
      } catch {
        return '';
      }
    
    case 'email':
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) ? input : '';
    
    case 'text':
    default:
      // Remove potentially dangerous characters
      return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
  }
};

// Token storage with additional security
export const secureTokenStorage = {
  setToken: (token: string) => {
    // Store in memory for this session (more secure than localStorage)
    sessionStorage.setItem('auth_token', token);
  },

  getToken: (): string | null => {
    return sessionStorage.getItem('auth_token');
  },

  removeToken: () => {
    sessionStorage.removeItem('auth_token');
  },

  setRefreshToken: (token: string) => {
    // For refresh tokens, we might use httpOnly cookies in a real app
    // But for this implementation, we'll store in sessionStorage
    sessionStorage.setItem('refresh_token', token);
  },

  getRefreshToken: (): string | null => {
    return sessionStorage.getItem('refresh_token');
  },

  removeRefreshToken: () => {
    sessionStorage.removeItem('refresh_token');
  }
};

// Validate JWT token format
export const isValidJwt = (token: string): boolean => {
  if (!token) return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Decode header and payload
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    
    // Check algorithm (should be RS256 or HS256, not none)
    if (header.alg === 'none') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Generate CSRF token
export const generateCsrfToken = (): string => {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Validate CSRF token
export const validateCsrfToken = (token: string, expected: string): boolean => {
  return token === expected;
};

// Check for malicious content in strings
export const hasMaliciousContent = (content: string): boolean => {
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /data:/gi,
    /file:/gi,
    /&#x/i,
    /&#(\d+);/,
    /expression/i,
    /eval\(/i,
    /alert\(/i
  ];

  return maliciousPatterns.some(pattern => pattern.test(content));
};

// Sanitize user-generated content
export const sanitizeUserContent = (content: string): string => {
  if (hasMaliciousContent(content)) {
    // In a real app, you might want to log this as a potential attack
    console.warn('Potentially malicious content detected and sanitized');
  }

  // Use a more robust sanitizer in production
  // This is a basic implementation
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, 'javascript_')
    .replace(/vbscript:/gi, 'vbscript_')
    .replace(/on\w+\s*=/gi, 'on_')
    .replace(/<[^>]*>/g, (match) => {
      // Allow only safe tags
      const safeTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      const tagMatch = match.match(/<\/?([^>\s]+)/i);
      if (tagMatch && safeTags.includes(tagMatch[1].toLowerCase())) {
        return match;
      }
      return '';
    });
};

// Validate password strength
export const isPasswordStrong = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate secure random string
export const generateSecureRandomString = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Hash sensitive data client-side (for privacy, not security)
export const hashSensitiveData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};