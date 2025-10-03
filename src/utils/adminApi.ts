/**
 * Admin API Services
 * 
 * API calls for admin dashboard and management features
 */

import { laravelApi } from './laravelApi';

export interface AdminStats {
  total_users: number;
  total_clients: number;
  total_artisans: number;
  total_jobs: number;
  active_jobs: number;
  completed_jobs: number;
  total_revenue: number;
  monthly_revenue: number;
  pending_verifications: number;
  disputes: number;
  new_signups: number;
  platform_fee: number;
  conversion_rate: number;
  avg_job_value: number;
  user_satisfaction: number;
  response_time: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: 'client' | 'artisan' | 'admin';
  location: string;
  is_verified: boolean;
  created_at: string;
  last_active: string;
}

export interface AdminJob {
  id: string;
  title: string;
  client: {
    id: string;
    name: string;
  };
  artisan?: {
    id: string;
    name: string;
  };
  status: string;
  budget: number;
  created_at: string;
}

export interface Analytics {
  users_over_time: Array<{ date: string; count: number }>;
  revenue_over_time: Array<{ date: string; revenue: number }>;
  jobs_by_category: Array<{ category: string; count: number }>;
  top_artisans: Array<{ id: string; name: string; completed_jobs: number; rating: number }>;
  top_clients: Array<{ id: string; name: string; jobs_posted: number; total_spent: number }>;
}

export const adminApi = {
  /**
   * Get admin dashboard statistics
   */
  getDashboardStats: () => 
    laravelApi.get<AdminStats>('/admin/dashboard'),

  /**
   * Get all users with filters
   */
  getUsers: (params?: { 
    type?: 'client' | 'artisan';
    is_verified?: boolean;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }) => 
    laravelApi.get<{ data: AdminUser[]; pagination: any }>('/admin/users', params),

  /**
   * Get all jobs with filters
   */
  getJobs: (params?: {
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }) => 
    laravelApi.get<{ data: AdminJob[]; pagination: any }>('/admin/jobs', params),

  /**
   * Get pending verifications
   */
  getPendingVerifications: () => 
    laravelApi.get('/admin/verifications/pending'),

  /**
   * Approve user verification
   */
  approveVerification: (userId: string) => 
    laravelApi.post(`/admin/verifications/${userId}/approve`),

  /**
   * Reject user verification
   */
  rejectVerification: (userId: string, reason: string) => 
    laravelApi.post(`/admin/verifications/${userId}/reject`, { reason }),

  /**
   * Get disputes
   */
  getDisputes: (params?: {
    status?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) => 
    laravelApi.get('/admin/disputes', params),

  /**
   * Resolve a dispute
   */
  resolveDispute: (disputeId: string, resolution: string, winner: 'client' | 'artisan') => 
    laravelApi.post(`/admin/disputes/${disputeId}/resolve`, { resolution, winner }),

  /**
   * Suspend user
   */
  suspendUser: (userId: string, reason: string, duration?: number) => 
    laravelApi.put(`/admin/users/${userId}/suspend`, { reason, duration }),

  /**
   * Unsuspend user
   */
  unsuspendUser: (userId: string) => 
    laravelApi.put(`/admin/users/${userId}/unsuspend`),

  /**
   * Delete user
   */
  deleteUser: (userId: string) => 
    laravelApi.delete(`/admin/users/${userId}`),

  /**
   * Get analytics data
   */
  getAnalytics: (params?: {
    period?: 'week' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
  }) => 
    laravelApi.get<Analytics>('/admin/analytics', params),
};
