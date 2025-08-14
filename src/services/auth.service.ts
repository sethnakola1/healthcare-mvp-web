// src/services/auth.service.ts
import { ApiResponse, LoginRequest, AuthUser } from '../types';
import { apiService } from './api.service';

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      // For development, we'll use mock authentication
      // Replace this with actual API call when backend is ready
      return await this.mockLogin(credentials);

      // Real implementation would be:
      // return await apiService.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    } catch (error) {
      throw error;
    }
  }

  // Mock login for development
  private async mockLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock super admin credentials
    if (credentials.email === 'admin@healthhorizon.com' && credentials.password === 'Admin123!') {
      const mockUser: AuthUser = {
        id: 'super-admin-1',
        email: 'admin@healthhorizon.com',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN' as any,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-super-admin';

      return {
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
        message: 'Login successful',
      };
    }

    // Mock tech advisor credentials
    if (credentials.email === 'tech@healthhorizon.com' && credentials.password === 'Tech123!') {
      const mockUser: AuthUser = {
        id: 'tech-advisor-1',
        email: 'tech@healthhorizon.com',
        firstName: 'Tech',
        lastName: 'Advisor',
        role: 'TECH_ADVISOR' as any,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-tech-advisor';

      return {
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
        message: 'Login successful',
      };
    }

    // Invalid credentials
    throw new Error('Invalid email or password');
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      // await apiService.post('/api/auth/logout');

      // Clear local storage
      this.clearAuthData();
    } catch (error) {
      // Even if API call fails, clear local data
      this.clearAuthData();
      throw error;
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      return await apiService.post<ApiResponse<{ token: string }>>('/api/auth/refresh');
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      return await apiService.get<ApiResponse<AuthUser>>('/api/auth/me');
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get stored user
  getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  // Store auth data
  storeAuthData(user: AuthUser, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    apiService.setAuthToken(token);
  }

  // Clear auth data
  clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    apiService.removeAuthToken();
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await apiService.post<ApiResponse<void>>('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      return await apiService.post<ApiResponse<void>>('/api/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      return await apiService.post<ApiResponse<void>>('/api/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;