// src/services/api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getTokenFromStorage();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshTokenFromStorage();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;

              this.setTokenInStorage(accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;

              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message ||
                     error.response.data?.error ||
                     `HTTP ${error.response.status}: ${error.response.statusText}`;

      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }

  // Token management
  private getTokenFromStorage(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshTokenFromStorage(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokenInStorage(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private setRefreshTokenInStorage(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  }

  // Refresh token
  private async refreshToken(refreshToken: string): Promise<AxiosResponse> {
    return this.api.post('/api/auth/refresh', { refreshToken });
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch(url, data, config);
    return response.data;
  }

  // File upload
  async uploadFile<T = any>(url: string, file: File, additionalData?: any): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Public methods for token management
  public setAuthTokens(accessToken: string, refreshToken: string): void {
    this.setTokenInStorage(accessToken);
    this.setRefreshTokenInStorage(refreshToken);
  }

  public clearAuthTokens(): void {
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    return !!this.getTokenFromStorage();
  }
}

export default ApiService.getInstance();