import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';

describe('Button Responsive Behavior', () => {
  test('small button uses compact sizing classes', () => {
    render(React.createElement(Button, { size: 'sm' }, 'Small'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-9');
    expect(button.className).toContain('text-sm');
  });

  test('medium button uses default sizing classes', () => {
    render(React.createElement(Button, { size: 'md' }, 'Medium'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-10');
  });

  test('large button uses expanded sizing classes', () => {
    render(React.createElement(Button, { size: 'lg' }, 'Large'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-12');
    expect(button.className).toContain('text-lg');
  });

  test('button uses inline-flex for flexible layout', () => {
    render(React.createElement(Button, null, 'Flex'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('inline-flex');
    expect(button.className).toContain('items-center');
    expect(button.className).toContain('justify-center');
  });

  test('button accepts custom classes for responsive overrides', () => {
    render(React.createElement(Button, { className: 'w-full md:w-auto' }, 'Responsive'));
    const button = screen.getByRole('button');
    expect(button.className).toContain('w-full');
    expect(button.className).toContain('md:w-auto');
  });
});
