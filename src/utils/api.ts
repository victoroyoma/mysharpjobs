/**
 * API Services for Laravel Backend
 * 
 * Organized API methods for different domains (Auth, Jobs, Messages, etc.)
 * All services use the Laravel API client with Sanctum authentication.
 */

import { laravelApi } from './laravelApi';

// ============================================================================
// AUTH API
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  location: string;
  type: 'client' | 'artisan';
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
}

export interface AuthResponse {
  user: any;
  token: string;
  refreshToken?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) => 
    laravelApi.post<AuthResponse>('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    laravelApi.post<AuthResponse>('/auth/register', data),
  
  logout: () => 
    laravelApi.post('/auth/logout'),
  
  getProfile: () => 
    laravelApi.get('/auth/profile'),
  
  refreshToken: (refreshToken: string) => 
    laravelApi.post<{ token: string }>('/auth/refresh', { refreshToken }),
};

// ============================================================================
// USER API
// ============================================================================

export interface UserFilters {
  skills?: string;
  location?: string;
  minRating?: number;
  available?: boolean;
  type?: 'client' | 'artisan';
}

export const userApi = {
  // Profile management
  getProfile: () => 
    laravelApi.get('/users/profile'),
  
  updateProfile: (data: any) => 
    laravelApi.put('/users/profile', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return laravelApi.upload('/users/profile/avatar', formData);
  },

  // Artisan operations
  getArtisans: (filters?: UserFilters) => 
    laravelApi.get('/users/artisans', filters),
  
  getArtisanById: (id: number) => 
    laravelApi.get(`/users/artisans/${id}`),
  
  // Location
  updateLocation: (location: { latitude: number; longitude: number; address: string }) => 
    laravelApi.put('/users/profile/location', location),
};

// ============================================================================
// JOB API
// ============================================================================

export interface JobFilters {
  status?: string;
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  urgency?: string;
  page?: number;
  limit?: number;
}

export interface CreateJobData {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget: number;
  urgency: string;
  required_skills?: string[];
  images?: string[];
  estimated_duration?: string;
}

export const jobApi = {
  // Job listing and details
  getJobs: (filters?: JobFilters) => 
    laravelApi.get('/jobs', filters),
  
  getJobById: (id: number) => 
    laravelApi.get(`/jobs/${id}`),
  
  // Job creation and management
  createJob: (data: CreateJobData) => 
    laravelApi.post('/jobs', data),
  
  updateJob: (id: number, data: Partial<CreateJobData>) => 
    laravelApi.put(`/jobs/${id}`, data),
  
  deleteJob: (id: number) => 
    laravelApi.delete(`/jobs/${id}`),
  
  // Job applications
  applyToJob: (jobId: number, data: { proposal: string; estimatedDuration: string }) => 
    laravelApi.post(`/jobs/${jobId}/apply`, data),
  
  getApplications: (jobId: number) => 
    laravelApi.get(`/jobs/${jobId}/applications`),
  
  acceptApplication: (jobId: number, applicationId: number) => 
    laravelApi.post(`/jobs/${jobId}/applications/${applicationId}/accept`),
  
  rejectApplication: (jobId: number, applicationId: number) => 
    laravelApi.post(`/jobs/${jobId}/applications/${applicationId}/reject`),
  
  // Job lifecycle
  startJob: (jobId: number) => 
    laravelApi.post(`/jobs/${jobId}/start`),
  
  completeJob: (jobId: number) => 
    laravelApi.post(`/jobs/${jobId}/complete`),
  
  cancelJob: (jobId: number, reason: string) => 
    laravelApi.post(`/jobs/${jobId}/cancel`, { reason }),
  
  // Milestones
  addMilestone: (jobId: number, data: { title: string; description: string; amount: number }) => 
    laravelApi.post(`/jobs/${jobId}/milestones`, data),
  
  completeMilestone: (jobId: number, milestoneId: number) => 
    laravelApi.post(`/jobs/${jobId}/milestones/${milestoneId}/complete`),
  
  // Reviews
  submitReview: (jobId: number, data: { rating: number; comment: string }) => 
    laravelApi.post(`/jobs/${jobId}/review`, data),
};

// ============================================================================
// MESSAGE API
// ============================================================================

export interface SendMessageData {
  recipient_id: number;
  content: string;
  message_type?: 'text' | 'image' | 'file';
  job_id?: number;
}

export const messageApi = {
  // Conversations
  getConversations: () => 
    laravelApi.get('/messages/conversations'),
  
  getConversation: (userId: number) => 
    laravelApi.get(`/messages/conversation/${userId}`),
  
  // Messages
  getMessages: (conversationId: number, page: number = 1) => 
    laravelApi.get(`/messages/${conversationId}`, { page }),
  
  sendMessage: (data: SendMessageData) => 
    laravelApi.post('/messages', data),
  
  markAsRead: (messageId: number) => 
    laravelApi.post(`/messages/${messageId}/read`),
  
  deleteMessage: (messageId: number) => 
    laravelApi.delete(`/messages/${messageId}`),
  
  // Unread count
  getUnreadCount: () => 
    laravelApi.get('/messages/unread-count'),
};

// ============================================================================
// PAYMENT API
// ============================================================================

export interface PaymentData {
  job_id: number;
  amount: number;
  gateway: 'paystack' | 'flutterwave';
  email?: string;
  phone?: string;
}

export const paymentApi = {
  // Initialize payment
  initializePayment: (data: PaymentData) => 
    laravelApi.post('/payments/initialize', data),
  
  // Verify payment
  verifyPayment: (reference: string) => 
    laravelApi.get(`/payments/verify/${reference}`),
  
  // Payment history
  getPayments: (filters?: { status?: string; job_id?: number }) => 
    laravelApi.get('/payments', filters),
  
  getPaymentById: (id: number) => 
    laravelApi.get(`/payments/${id}`),
  
  // Escrow operations
  releasePayment: (paymentId: number) => 
    laravelApi.post(`/payments/${paymentId}/release`),
  
  requestRefund: (paymentId: number, reason: string) => 
    laravelApi.post(`/payments/${paymentId}/refund`, { reason }),
  
  // Disputes
  createDispute: (paymentId: number, data: { reason: string; description: string }) => 
    laravelApi.post(`/payments/${paymentId}/dispute`, data),
  
  resolveDispute: (disputeId: number, resolution: string) => 
    laravelApi.post(`/payments/disputes/${disputeId}/resolve`, { resolution }),
};

// ============================================================================
// SEARCH API
// ============================================================================

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  minRating?: number;
  type?: 'jobs' | 'artisans';
}

export const searchApi = {
  // Advanced search
  search: (filters: SearchFilters) => 
    laravelApi.post('/search', filters),
  
  // AI-powered matching
  getRecommendations: (type: 'jobs' | 'artisans', limit: number = 10) => 
    laravelApi.get('/search/recommendations', { type, limit }),
  
  // Location-based search
  searchNearby: (latitude: number, longitude: number, radius: number = 10) => 
    laravelApi.get('/search/nearby', { latitude, longitude, radius }),
};

// ============================================================================
// ADMIN API
// ============================================================================

export const adminApi = {
  // Dashboard
  getDashboardStats: () => 
    laravelApi.get('/admin/dashboard'),
  
  // User management
  getUsers: (filters?: { type?: string; status?: string; page?: number }) => 
    laravelApi.get('/admin/users', filters),
  
  getUserById: (id: number) => 
    laravelApi.get(`/admin/users/${id}`),
  
  updateUser: (id: number, data: any) => 
    laravelApi.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: number) => 
    laravelApi.delete(`/admin/users/${id}`),
  
  verifyUser: (id: number) => 
    laravelApi.post(`/admin/users/${id}/verify`),
  
  suspendUser: (id: number, reason: string) => 
    laravelApi.post(`/admin/users/${id}/suspend`, { reason }),
  
  // Job management
  getJobsAdmin: (filters?: any) => 
    laravelApi.get('/admin/jobs', filters),
  
  deleteJobAdmin: (id: number) => 
    laravelApi.delete(`/admin/jobs/${id}`),
  
  // Payment management
  getPaymentsAdmin: (filters?: any) => 
    laravelApi.get('/admin/payments', filters),
  
  resolveDisputeAdmin: (disputeId: number, resolution: string, amount: number) => 
    laravelApi.post(`/admin/payments/disputes/${disputeId}/resolve`, { resolution, amount }),
  
  // Analytics
  getAnalytics: (startDate?: string, endDate?: string) => 
    laravelApi.get('/admin/analytics', { start_date: startDate, end_date: endDate }),
};

// ============================================================================
// PROFILE API
// ============================================================================

export const profileApi = {
  // Portfolio
  uploadPortfolioImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return laravelApi.upload('/profiles/portfolio', formData);
  },
  
  deletePortfolioImage: (imageId: number) => 
    laravelApi.delete(`/profiles/portfolio/${imageId}`),
  
  // Certifications
  addCertification: (data: { name: string; issuer: string; date: string; file?: File }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('issuer', data.issuer);
    formData.append('date', data.date);
    if (data.file) formData.append('file', data.file);
    return laravelApi.upload('/profiles/certifications', formData);
  },
  
  deleteCertification: (id: number) => 
    laravelApi.delete(`/profiles/certifications/${id}`),
  
  // Availability
  updateAvailability: (isAvailable: boolean) => 
    laravelApi.put('/profiles/availability', { is_available: isAvailable }),
  
  // Dashboard data
  getClientDashboard: () => 
    laravelApi.get('/dashboard/client'),
  
  getArtisanDashboard: () => 
    laravelApi.get('/dashboard/artisan'),
};

// Export all as default for convenience
export default {
  auth: authApi,
  user: userApi,
  job: jobApi,
  message: messageApi,
  payment: paymentApi,
  search: searchApi,
  admin: adminApi,
  profile: profileApi,
};
