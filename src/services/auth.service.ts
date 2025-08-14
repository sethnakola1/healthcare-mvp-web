// src/services/auth.service.ts
import apiService from './api.service';
import { LoginRequest, LoginResponse, RefreshTokenRequest, ChangePasswordRequest, UserInfo } from '../types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/api/auth/login', credentials);

    if (response.success) {
      // Store tokens and user info
      apiService.setAuthTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify({
        userId: response.data.userId,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role,
        loginTime: response.data.loginTime
      }));
    }

    return response.data;
  }

  async getCurrentUser(): Promise<UserInfo> {
    const response = await apiService.get<UserInfo>('/api/auth/me');
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/api/auth/refresh', { refreshToken });

    if (response.success) {
      apiService.setAuthTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await apiService.post('/api/auth/change-password', passwordData);
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed, continuing with local logout');
    } finally {
      apiService.clearAuthTokens();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await apiService.get('/api/auth/validate');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Helper methods
  getUserFromStorage(): UserInfo | null {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated() && !!this.getUserFromStorage();
  }

  getUserRole(): string | null {
    const user = this.getUserFromStorage();
    return user?.role || null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
}

export default new AuthService();