/**
 * Laravel API Client
 * 
 * Axios-based API client configured for Laravel Sanctum authentication
 * and seamless communication with the Laravel backend.
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 15000; // 15 seconds

// Response interface - matches Laravel response structure
interface ApiResponse<T = any> {
  status?: string;
  data: T;
  message?: string;
  success?: boolean;
}

// Error response interface
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Laravel API Client Class
 * 
 * Handles all HTTP requests to the Laravel backend with proper
 * Sanctum authentication and error handling.
 */
class LaravelApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // Important for Sanctum
    });

    // Load token from localStorage
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthHeader(this.token);
    }

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh token
          const refreshed = await this.refreshToken();
          
          if (refreshed && originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${this.token}`;
            return this.client(originalRequest);
          }

          // If refresh failed, redirect to login
          this.clearAuth();
          window.location.href = '/auth/login';
        }

        // Log error in development
        if (import.meta.env.DEV) {
          console.error(`❌ ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - ${error.response?.status}`, error.response?.data);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
      this.setAuthHeader(token);
    } else {
      this.clearAuth();
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Set authorization header
   */
  private setAuthHeader(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication
   */
  private clearAuth(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await axios.post<ApiResponse<{ token: string }>>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      );

      if (response.data.data?.token) {
        this.setToken(response.data.data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError<ApiErrorResponse>): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      const validationErrors = error.response.data?.errors;

      if (validationErrors) {
        // Laravel validation errors
        const firstError = Object.values(validationErrors)[0];
        return new Error(firstError[0] || message);
      }

      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.');
    } else {
      // Error setting up request
      return new Error(error.message || 'Request failed');
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(endpoint, { params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(endpoint);
    return response.data;
  }

  /**
   * Upload file
   */
  async upload<T = any>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// Singleton instance
export const laravelApi = new LaravelApiClient();

// Export for use in other files
export default laravelApi;
