import { networkMonitor } from './performanceMonitor';

// Enhanced API service with caching, retry, and performance monitoring
class EnhancedAPIService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue = new Map<string, Promise<any>>();
  private retryAttempts = 3;
  private baseURL: string;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000/api') {
    this.baseURL = baseURL;
  }

  // Cache management
  private getCacheKey(url: string, params?: any): string {
    return `${url}_${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCache(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }

  // Request deduplication
  private async deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const promise = requestFn();
    this.requestQueue.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  // Enhanced fetch with retry logic
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<Response> {
    const tracker = networkMonitor.trackAPICall(url, options.method);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      tracker.onSuccess();
      return response;
    } catch (error) {
      tracker.onError(error);
      
      if (retryCount < this.retryAttempts && this.isRetriableError(error)) {
        console.warn(`🔄 Retrying request to ${url} (attempt ${retryCount + 1}/${this.retryAttempts})`);
        await this.delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
        return this.fetchWithRetry(url, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  private isRetriableError(error: any): boolean {
    // Retry on network errors, 5xx errors, or timeouts
    return (
      error instanceof TypeError ||
      (error.message && error.message.includes('5')) ||
      error.name === 'TimeoutError'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main API methods
  async get<T>(
    endpoint: string,
    params?: any,
    options: {
      cache?: boolean;
      cacheTTL?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const { cache = true, cacheTTL = 5, timeout = 10000 } = options;
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, params);

    // Check cache first
    if (cache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log(`💾 Cache hit for ${endpoint}`);
        return cached;
      }
    }

    return this.deduplicateRequest(cacheKey, async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        const response = await this.fetchWithRetry(`${url}${queryString}`, {
          method: 'GET',
          signal: controller.signal,
          headers: this.getAuthHeaders(),
        });

        const data = await response.json();
        
        if (cache) {
          this.setCache(cacheKey, data, cacheTTL);
        }

        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    });
  }

  async post<T>(endpoint: string, body: any, options: { timeout?: number } = {}): Promise<T> {
    const { timeout = 15000 } = options;
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        signal: controller.signal,
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      // Invalidate related cache entries
      this.invalidateCache(endpoint);
      
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T>(endpoint: string, body: any, options: { timeout?: number } = {}): Promise<T> {
    const { timeout = 15000 } = options;
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'PUT',
        signal: controller.signal,
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      // Invalidate related cache entries
      this.invalidateCache(endpoint);
      
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async delete<T>(endpoint: string, options: { timeout?: number } = {}): Promise<T> {
    const { timeout = 10000 } = options;
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'DELETE',
        signal: controller.signal,
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      // Invalidate related cache entries
      this.invalidateCache(endpoint);
      
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Utility methods
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private invalidateCache(endpoint: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key] of this.cache) {
      if (key.includes(endpoint)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🗑️ Invalidated ${keysToDelete.length} cache entries for ${endpoint}`);
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache cleared');
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }

  // Prefetch data for better UX
  async prefetch(endpoints: string[]): Promise<void> {
    console.log(`🚀 Prefetching ${endpoints.length} endpoints`);
    
    const prefetchPromises = endpoints.map(endpoint => 
      this.get(endpoint).catch(error => {
        console.warn(`⚠️ Prefetch failed for ${endpoint}:`, error);
      })
    );
    
    await Promise.allSettled(prefetchPromises);
    console.log('✅ Prefetch complete');
  }
}

// Singleton instance
export const apiService = new EnhancedAPIService();

// Specialized API services for different domains
export class JobAPI {
  static async getJobs(filters?: any) {
    return apiService.get('/jobs', filters, { cacheTTL: 2 });
  }

  static async getJobById(id: string) {
    return apiService.get(`/jobs/${id}`, null, { cacheTTL: 10 });
  }

  static async createJob(jobData: any) {
    return apiService.post('/jobs', jobData);
  }

  static async updateJob(id: string, updates: any) {
    return apiService.put(`/jobs/${id}`, updates);
  }

  static async deleteJob(id: string) {
    return apiService.delete(`/jobs/${id}`);
  }

  static async applyToJob(jobId: string, applicationData: any) {
    return apiService.post(`/jobs/${jobId}/apply`, applicationData);
  }
}

export class UserAPI {
  static async getProfile() {
    return apiService.get('/users/profile', null, { cacheTTL: 15 });
  }

  static async updateProfile(updates: any) {
    return apiService.put('/users/profile', updates);
  }

  static async getArtisans(filters?: any) {
    return apiService.get('/users/artisans', filters, { cacheTTL: 5 });
  }

  static async getArtisanById(id: string) {
    return apiService.get(`/users/artisans/${id}`, null, { cacheTTL: 10 });
  }
}

export class MessageAPI {
  static async getConversations() {
    return apiService.get('/messages/conversations', null, { cache: false });
  }

  static async getMessages(conversationId: string) {
    return apiService.get(`/messages/${conversationId}`, null, { cache: false });
  }

  static async sendMessage(conversationId: string, message: any) {
    return apiService.post(`/messages/${conversationId}`, message);
  }
}

export class PaymentAPI {
  static async getPaymentHistory() {
    return apiService.get('/payments/history', null, { cacheTTL: 30 });
  }

  static async processPayment(paymentData: any) {
    return apiService.post('/payments/process', paymentData);
  }

  static async getPaymentStatus(paymentId: string) {
    return apiService.get(`/payments/${paymentId}/status`, null, { cache: false });
  }
}

// Export performance utility for the API service
export const apiPerformance = {
  getCacheStats: () => apiService.getCacheStats(),
  clearCache: () => apiService.clearCache(),
  prefetchCommonData: async () => {
    const commonEndpoints = [
      '/users/profile',
      '/jobs?limit=10&status=open',
      '/messages/conversations'
    ];
    await apiService.prefetch(commonEndpoints);
  }
};
