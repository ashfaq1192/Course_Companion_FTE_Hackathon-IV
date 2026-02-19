import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock authService before importing AuthContext
jest.mock('@/services/authService', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn().mockReturnValue(false),
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  },
}));

import { AuthProvider, useAuth } from '@/context/AuthContext';
import authService from '@/services/authService';

const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Test component that uses the auth context
function AuthConsumer() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  return React.createElement('div', null,
    React.createElement('span', { 'data-testid': 'loading' }, String(isLoading)),
    React.createElement('span', { 'data-testid': 'authenticated' }, String(isAuthenticated)),
    React.createElement('span', { 'data-testid': 'user' }, user ? user.email : 'none'),
    React.createElement('button', { 'data-testid': 'login-btn', onClick: () => login('test@example.com', 'password') }, 'Login'),
    React.createElement('button', { 'data-testid': 'logout-btn', onClick: logout }, 'Logout')
  );
}

function renderWithAuth() {
  return render(
    React.createElement(AuthProvider, null,
      React.createElement(AuthConsumer)
    )
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedAuthService.isAuthenticated.mockReturnValue(false);
  });

  test('provides initial unauthenticated state', async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  test('useAuth throws when used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(React.createElement(AuthConsumer));
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  test('login updates state with user data', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      subscriptionType: 'free' as const,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    mockedAuthService.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });
    mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);
    mockedAuthService.isAuthenticated.mockReturnValue(true);

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });
  });

  test('logout clears user state', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      isActive: true,
      subscriptionType: 'free' as const,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    mockedAuthService.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });
    mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);
    mockedAuthService.isAuthenticated.mockReturnValue(true);

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });

    mockedAuthService.isAuthenticated.mockReturnValue(false);
    await user.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('none');
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });
  });
});
