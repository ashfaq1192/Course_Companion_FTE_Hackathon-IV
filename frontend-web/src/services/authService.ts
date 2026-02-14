import apiService from './api';
import { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface BackendLoginResponse {
  access_token: string;
  token_type: string;
}

interface LoginResponse {
  user: User | null;
  token: string;
}

class AuthService {
  /**
   * Login user
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<BackendLoginResponse>('/auth/login', credentials);
      const token = response.data.access_token;

      // Store token in localStorage
      localStorage.setItem('token', token);

      return { user: null, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  public async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      // Backend expects full_name (snake_case)
      await apiService.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
      });

      // Auto-login after registration
      return this.login({ email: userData.email, password: userData.password });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<User> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiService.get<any>('/auth/me');
      const d = response.data;
      return {
        id: String(d.id),
        email: d.email,
        fullName: d.full_name,
        isActive: d.is_active,
        subscriptionType: 'free',
        createdAt: d.created_at,
        updatedAt: d.updated_at || d.created_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // Decode token to check expiration
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired (with 5 minute buffer)
      return payload.exp > currentTime + 300;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  public async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<{ token: string; refreshToken: string }>('/auth/refresh', {
        refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      // Update tokens in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout the user
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();