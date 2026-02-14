import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';

describe('Button Accessibility', () => {
  test('renders as a button element with proper role', () => {
    render(React.createElement(Button, null, 'Click me'));
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  test('disabled button has aria-disabled behavior via disabled attribute', () => {
    render(React.createElement(Button, { disabled: true }, 'Disabled'));
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('disabled');
  });

  test('loading button is disabled and indicates loading state', () => {
    render(React.createElement(Button, { isLoading: true }, 'Loading'));
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('button is keyboard focusable when enabled', () => {
    render(React.createElement(Button, null, 'Focusable'));
    const button = screen.getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  test('disabled button has pointer-events-none class', () => {
    render(React.createElement(Button, { disabled: true }, 'Disabled'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('disabled:pointer-events-none');
  });

  test('button has visible focus ring classes', () => {
    render(React.createElement(Button, null, 'Focus'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('focus-visible:ring-2');
  });

  test('button text content is accessible', () => {
    render(React.createElement(Button, null, 'Submit Form'));
    expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
  });

  test('button with aria-label is accessible by label', () => {
    render(React.createElement(Button, { 'aria-label': 'Close dialog' }, 'X'));
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });
});
