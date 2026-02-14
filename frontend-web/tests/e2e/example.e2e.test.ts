/**
 * E2E tests - intended for Playwright.
 * Run via: npx playwright test
 *
 * These tests verify API service layer behavior with mocked HTTP responses,
 * serving as a lightweight substitute until a full Playwright setup is configured.
 */
import apiService from '@/services/api';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    __mockInstance: mockAxiosInstance,
  };
});

// Access the mock instance
const axios = require('axios');
const mockAxios = axios.__mockInstance;

describe('API Service E2E-style Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET request calls axios get with correct endpoint', async () => {
    const mockResponse = { data: { id: 1, title: 'Test Content' }, status: 200 };
    mockAxios.get.mockResolvedValue(mockResponse);

    const result = await apiService.get('/content/1');
    expect(mockAxios.get).toHaveBeenCalledWith('/content/1', undefined);
    expect(result.data).toEqual({ id: 1, title: 'Test Content' });
  });

  test('POST request sends data to correct endpoint', async () => {
    const mockResponse = { data: { access_token: 'mock-jwt', token_type: 'bearer' }, status: 200 };
    mockAxios.post.mockResolvedValue(mockResponse);

    const loginData = { email: 'test@example.com', password: 'password123' };
    const result = await apiService.post('/login', loginData);

    expect(mockAxios.post).toHaveBeenCalledWith('/login', loginData, undefined);
    expect((result.data as Record<string, unknown>).access_token).toBe('mock-jwt');
  });

  test('PUT request updates resource', async () => {
    const mockResponse = { data: { status: 'completed', completion_percentage: 100 }, status: 200 };
    mockAxios.put.mockResolvedValue(mockResponse);

    const updateData = { status: 'completed', completion_percentage: 100 };
    const result = await apiService.put('/progress/1', updateData);

    expect(mockAxios.put).toHaveBeenCalledWith('/progress/1', updateData, undefined);
    expect((result.data as Record<string, unknown>).status).toBe('completed');
  });

  test('DELETE request removes resource', async () => {
    const mockResponse = { data: null, status: 204 };
    mockAxios.delete.mockResolvedValue(mockResponse);

    await apiService.delete('/users/me/bookmarks/1');
    expect(mockAxios.delete).toHaveBeenCalledWith('/users/me/bookmarks/1', undefined);
  });

  test('getBaseUrl returns API base URL', () => {
    expect(apiService.getBaseUrl()).toBe('http://localhost:8000/api/v1');
  });

  test('getWsUrl returns WebSocket URL', () => {
    expect(apiService.getWsUrl()).toBe('ws://localhost:8000');
  });
});
