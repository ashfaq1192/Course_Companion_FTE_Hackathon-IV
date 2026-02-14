import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  test('renders with children text', () => {
    render(React.createElement(Button, null, 'Click me'));
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('applies primary variant styles by default', () => {
    render(React.createElement(Button, null, 'Primary'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-primary-600');
  });

  test('applies secondary variant styles', () => {
    render(React.createElement(Button, { variant: 'secondary' }, 'Secondary'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-secondary-500');
  });

  test('applies outline variant styles', () => {
    render(React.createElement(Button, { variant: 'outline' }, 'Outline'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('border');
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(React.createElement(Button, { size: 'sm' }, 'Small'));
    expect(screen.getByRole('button').className).toContain('h-9');

    rerender(React.createElement(Button, { size: 'lg' }, 'Large'));
    expect(screen.getByRole('button').className).toContain('h-12');
  });

  test('is disabled when disabled prop is true', () => {
    render(React.createElement(Button, { disabled: true }, 'Disabled'));
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('is disabled when isLoading is true', () => {
    render(React.createElement(Button, { isLoading: true }, 'Loading'));
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('shows loading spinner when isLoading', () => {
    render(React.createElement(Button, { isLoading: true }, 'Loading'));
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.classList.contains('animate-spin')).toBe(true);
  });

  test('does not show left/right icons when loading', () => {
    const leftIcon = React.createElement('span', { 'data-testid': 'left-icon' }, 'L');
    const rightIcon = React.createElement('span', { 'data-testid': 'right-icon' }, 'R');
    render(React.createElement(Button, { isLoading: true, leftIcon, rightIcon }, 'Loading'));
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  test('shows left and right icons when not loading', () => {
    const leftIcon = React.createElement('span', { 'data-testid': 'left-icon' }, 'L');
    const rightIcon = React.createElement('span', { 'data-testid': 'right-icon' }, 'R');
    render(React.createElement(Button, { leftIcon, rightIcon }, 'Icons'));
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(React.createElement(Button, { onClick: handleClick }, 'Click'));
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not fire click when disabled', () => {
    const handleClick = jest.fn();
    render(React.createElement(Button, { onClick: handleClick, disabled: true }, 'Click'));
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(React.createElement(Button, { ref }, 'Ref'));
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test('merges custom className', () => {
    render(React.createElement(Button, { className: 'custom-class' }, 'Custom'));
    expect(screen.getByRole('button').className).toContain('custom-class');
  });
});
