# Testing Guide

## Overview

The Course Companion Web App follows a comprehensive testing strategy to ensure quality, reliability, and maintainability. This document outlines the testing approach and available tools.

## Testing Strategy

Our testing strategy follows the testing pyramid:
- Unit tests (majority) - Test individual components and functions
- Integration tests - Test interactions between components/services
- End-to-end tests - Test complete user workflows
- Accessibility tests - Ensure the app is usable by everyone
- Performance tests - Verify app performance under load

## Unit Testing

Unit tests verify the behavior of individual components, functions, and modules in isolation.

### Tools Used
- Jest - JavaScript testing framework
- React Testing Library - DOM testing utilities
- @testing-library/jest-dom - Custom matchers

### Writing Unit Tests

```tsx
// Example unit test for a component
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('disables when isLoading is true', () => {
    render(<Button isLoading={true}>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Hooks

```tsx
// Example unit test for a custom hook
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter Hook', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(0));
    expect(result.current.count).toBe(0);
  });

  it('increments the count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## Integration Testing

Integration tests verify that multiple components or services work together correctly.

### API Service Testing

```tsx
// Example integration test for an API service
import { contentService } from '@/services/contentService';

// Mock the apiService
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import apiService from '@/services/api';

describe('Content Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches content by course ID', async () => {
    const mockData = [{ id: '1', title: 'Test Content' }];
    (apiService.get as jest.MockedFunction<any>).mockResolvedValue({ data: mockData });

    const result = await contentService.getContentByCourse('course-1');
    
    expect(apiService.get).toHaveBeenCalledWith('/content/by-course/course-1');
    expect(result).toEqual(mockData);
  });
});
```

## End-to-End Testing

End-to-end tests verify complete user workflows in a real browser environment.

### Tools Used
- Playwright - Browser automation and testing framework

### Writing E2E Tests

```tsx
// Example E2E test
import { test, expect } from '@playwright/test';

test.describe('Course Learning Flow', () => {
  test('user can navigate through course content', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Login
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to a course
    await page.click('text="Introduction to Programming"');
    
    // Navigate through content
    await page.click('text="Chapter 1: Basics"');
    await expect(page.locator('h1')).toContainText('Programming Basics');
    
    // Complete content
    await page.click('text="Mark Complete"');
    
    // Verify progress updated
    await expect(page.locator('[data-testid="progress-bar"]')).toContainText('100%');
  });
});
```

## Accessibility Testing

Accessibility tests ensure the app is usable by people with disabilities.

### Tools Used
- @axe-core/playwright - Accessibility testing with Playwright
- react-axe - Accessibility testing in development

### Writing Accessibility Tests

```tsx
// Example accessibility test
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/courses');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## Performance Testing

Performance tests ensure the app meets performance requirements.

### Tools Used
- Lighthouse - Automated auditing tool
- Web Vitals - Core web performance metrics

## Running Tests

### Unit Tests
```bash
npm run test:unit
# or
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Accessibility Tests
```bash
npm run test:a11y
```

## Test Organization

Tests are organized in the following structure:
```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── services/
├── integration/
│   ├── api/
│   └── features/
└── e2e/
    ├── auth/
    ├── courses/
    └── dashboard/
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Use meaningful test names**: Tests should read like specifications
3. **Follow the AAA pattern**: Arrange, Act, Assert
4. **Test edge cases**: Consider error states, empty states, and boundary conditions
5. **Keep tests independent**: Each test should be able to run in isolation
6. **Use realistic test data**: Use data that resembles production data
7. **Mock external dependencies**: Don't make real API calls in unit tests
8. **Maintain test coverage**: Aim for high coverage but prioritize critical paths
9. **Run tests regularly**: Integrate testing into your development workflow
10. **Keep tests fast**: Slow tests discourage running them frequently