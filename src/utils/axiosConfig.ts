// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for managing refresh token state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && !isTokenExpired(token)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers = config.headers || {};
    config.headers['X-Request-ID'] = generateRequestId();

    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error(`❌ API Error: ${error.response?.status} ${originalRequest?.url}`, error.response?.data);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('🔄 Attempting token refresh...');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Update stored tokens
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // Update axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          console.log('✅ Token refreshed successfully');
          processQueue(null, accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);

        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error types
    handleApiError(error);
    return Promise.reject(error);
  }
);

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle API errors with user-friendly messages
function handleApiError(error: any) {
  if (!error.response) {
    // Network error
    toast.error('Network error. Please check your connection.');
    return;
  }

  const { status, data } = error.response;
  let message = 'An unexpected error occurred';

  switch (status) {
    case 400:
      message = data?.message || 'Invalid request. Please check your input.';
      break;
    case 401:
      message = 'Authentication required. Please login.';
      break;
    case 403:
      message = 'You do not have permission to perform this action.';
      break;
    case 404:
      message = 'The requested resource was not found.';
      break;
    case 409:
      message = data?.message || 'A conflict occurred. The resource may already exist.';
      break;
    case 422:
      message = data?.message || 'Validation failed. Please check your input.';
      break;
    case 429:
      message = 'Too many requests. Please wait a moment and try again.';
      break;
    case 500:
      message = 'Server error. Please try again later.';
      break;
    case 502:
    case 503:
    case 504:
      message = 'Service temporarily unavailable. Please try again later.';
      break;
    default:
      message = data?.message || `Error ${status}: ${error.message}`;
  }

  // Don't show toast for certain endpoints or if we're already showing auth errors
  const silentEndpoints = ['/auth/refresh', '/auth/validate'];
  const shouldShowToast = !silentEndpoints.some(endpoint =>
    error.config?.url?.includes(endpoint)
  ) && status !== 401;

  if (shouldShowToast) {
    toast.error(message);
  }
}

// Export configured instance
export default axiosInstance;

// Export types for use in components
// export type { AxiosRequestConfig, AxiosResponse };
export type { InternalAxiosRequestConfig as AxiosRequestConfig, AxiosResponse };