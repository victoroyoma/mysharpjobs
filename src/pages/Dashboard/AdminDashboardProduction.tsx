import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  DollarSignIcon, 
  TrendingUpIcon,
  SearchIcon,
  EyeIcon,
  MessageSquareIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  RefreshCwIcon,
  DownloadIcon,
  ActivityIcon,
  XCircleIcon,
  ServerIcon,
  TagIcon,
  StarIcon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerificationTab from '../../components/VerificationTab';

// API service
import { adminApi } from '../../utils/adminApi';

// Types
interface AdminStats {
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

interface JobInteraction {
  id: string;
  jobTitle: string;
  client: {
    id: string;
    name: string;
    email: string;
    image: string;
    rating: number;
    location: string;
    totalJobs: number;
  };
  artisan: {
    id: string;
    name: string;
    email: string;
    image: string;
    rating: number;
    verified: boolean;
    location: string;
    completedJobs: number;
  };
  status: string;
  amount: number;
  location: string;
  createdAt: string;
  lastUpdate: string;
  priority: string;
  duration: string;
  category: string;
  communicationCount: number;
  lastCommunication: string;
}

interface RealTimeActivity {
  id: string;
  type: string;
  user: string;
  description: string;
  timestamp: string;
  priority: string;
  jobId?: string;
  amount?: number;
}

export default function AdminDashboardProduction() {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'disputes' | 'analytics' | 'users' | 'verifications'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastUpdate');
  
  // State for API data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobInteractions, setJobInteractions] = useState<JobInteraction[]>([]);
  const [realTimeActivities, setRealTimeActivities] = useState<RealTimeActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [disputes, setDisputes] = useState<any[]>([]);
  const [disputeStatusFilter, setDisputeStatusFilter] = useState<string>('all');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadActivities();
    }, 30000); // Refresh activities every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (activeTab === 'interactions') {
      loadJobInteractions();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'disputes') {
      loadDisputes();
    }
  }, [activeTab, searchTerm, statusFilter, priorityFilter, sortBy, currentPage, disputeStatusFilter]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsData, activitiesData, healthData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentActivities({ limit: 20 }),
        adminApi.getSystemHealth(),
      ]);

      setStats(statsData.data);
      setRealTimeActivities(activitiesData.data || []);
      setSystemHealth(healthData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      // Set fallback system health on error
      setSystemHealth(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobInteractions = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort_by: sortBy,
        search: searchTerm || undefined,
      };

      const response = await adminApi.getJobs(params);
      console.log('📊 Jobs API response:', response);
      
      // The laravelApi returns response.data which contains { status, data, message, pagination }
      // So response.data is the jobs array from Laravel's response
      const jobs = Array.isArray(response.data) ? response.data : [];
      
      if (jobs.length === 0) {
        console.log('ℹ️ No jobs found');
        setJobInteractions([]);
        setTotalPages(1);
        return;
      }
      
      // Transform jobs to job interactions format
      const interactions = jobs.map((job: any) => {
        console.log('🔄 Transforming job:', job);
        return {
          id: job.id,
          jobTitle: job.title || 'Untitled Job',
          client: job.client ? {
            id: job.client.id || 'unknown',
            name: job.client.name || 'Unknown Client',
            email: job.client.email || '',
            image: job.client.avatar || '/default-avatar.png',
            rating: job.client.rating || 0,
            location: job.client.location || 'N/A',
            totalJobs: job.client.jobs_posted || 0
          } : {
            id: 'unknown',
            name: 'Unknown Client',
            email: '',
            image: '/default-avatar.png',
            rating: 0,
            location: 'N/A',
            totalJobs: 0
          },
          artisan: job.artisan ? {
            id: job.artisan.id || 'unassigned',
            name: job.artisan.name || 'Not Assigned',
            email: job.artisan.email || '',
            image: job.artisan.avatar || '/default-avatar.png',
            rating: job.artisan.rating || 0,
            verified: job.artisan.is_verified || false,
            location: job.artisan.location || 'N/A',
            completedJobs: job.artisan.completed_jobs || 0
          } : {
            id: 'unassigned',
            name: 'Not Assigned',
            email: '',
            image: '/default-avatar.png',
            rating: 0,
            verified: false,
            location: 'N/A',
            completedJobs: 0
          },
          status: job.status || 'pending',
          amount: job.budget || 0,
          location: job.location || 'N/A',
          createdAt: job.created_at,
          lastUpdate: job.updated_at || job.created_at,
          priority: job.priority || 'medium',
          duration: job.duration || 'N/A',
          category: job.category || 'General',
          communicationCount: 0,
          lastCommunication: job.created_at
        };
      });
      
      console.log('✅ Transformed interactions:', interactions);
      setJobInteractions(interactions);
      
      // Access pagination from the response object (not response.data)
      // The response structure is { status, data, pagination, message }
      const paginationData = (response as any).pagination;
      setTotalPages(paginationData?.last_page || 1);
    } catch (err) {
      console.error('❌ Error loading job interactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load job interactions');
      setJobInteractions([]); // Set empty array on error to prevent map undefined error
    }
  };

  const loadActivities = async () => {
    try {
      const response = await adminApi.getRecentActivities({ limit: 20 });
      setRealTimeActivities(response.data || []);
    } catch (err) {
      console.error('Failed to refresh activities:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: 20,
        type: statusFilter !== 'all' ? statusFilter as 'client' | 'artisan' : undefined,
        search: searchTerm || undefined,
        sort_by: sortBy,
      };

      const response = await adminApi.getUsers(params);
      console.log('📊 Users API response:', response);
      
      // The laravelApi returns response.data which contains the users array
      const users = Array.isArray(response.data) ? response.data : [];
      setUsers(users);
      
      // Access pagination from the response object
      const paginationData = (response as any).pagination;
      setTotalPages(paginationData?.last_page || 1);
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]); // Set empty array on error
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await adminApi.getAnalytics({ period: analyticsPeriod });
      console.log('📊 Analytics API response:', response);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('❌ Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    }
  };

  const loadDisputes = async () => {
    try {
      const params = {
        page: currentPage,
        per_page: 20,
        status: disputeStatusFilter !== 'all' ? disputeStatusFilter : undefined,
      };

      const response = await adminApi.getDisputes(params);
      console.log('📊 Disputes API response:', response);
      
      const disputesData = Array.isArray(response.data) ? response.data : [];
      setDisputes(disputesData);
      
      const paginationData = (response as any).pagination;
      setTotalPages(paginationData?.last_page || 1);
    } catch (err) {
      console.error('❌ Error loading disputes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
      setDisputes([]);
    }
  };

  const handleViewUserDetails = async (userId: string) => {
    try {
      const response = await adminApi.getUserDetails(userId);
      setSelectedUser(response.data);
      setShowUserDetails(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    if (activeTab === 'interactions') {
      await loadJobInteractions();
    } else if (activeTab === 'users') {
      await loadUsers();
    } else if (activeTab === 'analytics') {
      await loadAnalytics();
    } else if (activeTab === 'disputes') {
      await loadDisputes();
    }
    setRefreshing(false);
  };

  const handleDisputeResolution = async (jobId: string, resolution: string, winner: string) => {
    try {
      await adminApi.resolveDispute(jobId, resolution, winner as 'client' | 'artisan');
      await loadJobInteractions(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve dispute');
    }
  };

  const handleExport = async (type: string, format: string = 'json') => {
    try {
      // Fetch appropriate data based on type
      let data: any;
      if (type === 'users') {
        const response = await adminApi.getUsers();
        data = response.data;
      } else if (type === 'jobs') {
        const response = await adminApi.getJobs();
        data = response.data;
      } else if (type === 'analytics') {
        const response = await adminApi.getAnalytics();
        data = response.data;
      } else {
        data = { message: 'Export type not supported yet' };
      }
      
      if (format === 'csv') {
        // Convert to CSV (simple implementation)
        const csvContent = JSON.stringify(data);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-export.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Handle JSON download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-export.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'disputed': 'bg-purple-100 text-purple-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage the MySharpJobs platform</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCwIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={() => handleExport('analytics', 'csv')}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_users.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+{stats.new_signups} this month</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_jobs.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-1">{stats.active_jobs} active</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                  <p className="text-sm text-green-600 mt-1">{formatCurrency(stats.monthly_revenue)} this month</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSignIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform Health</p>
                  <p className="text-3xl font-bold text-green-900">{stats.user_satisfaction}/5.0</p>
                  <p className="text-sm text-orange-600 mt-1">{stats.disputes} disputes</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3Icon },
              { id: 'interactions', label: 'Job Interactions', icon: BriefcaseIcon },
              { id: 'verifications', label: 'Verifications', icon: ShieldCheckIcon },
              { id: 'disputes', label: 'Disputes', icon: AlertTriangleIcon },
              { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
              { id: 'users', label: 'User Management', icon: UsersIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  // Reset filters and sort when switching tabs
                  setSearchTerm('');
                  setCurrentPage(1);
                  // Set appropriate default sort for each tab
                  if (tab.id === 'users') {
                    setSortBy('created_at');
                  } else if (tab.id === 'interactions') {
                    setSortBy('lastUpdate');
                  } else if (tab.id === 'analytics') {
                    loadAnalytics();
                  } else if (tab.id === 'disputes') {
                    loadDisputes();
                  }
                }}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-time Activities */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Real-time Activities</h3>
                <Button onClick={loadActivities} variant="secondary" size="sm">
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {realTimeActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <ActivityIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No recent activities</p>
                    <p className="text-xs text-gray-400 mt-1">Activities will appear here as users interact with the platform</p>
                  </div>
                ) : (
                  realTimeActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`
                        flex-shrink-0 h-2 w-2 rounded-full mt-2
                        ${activity.priority === 'high' ? 'bg-red-500' : 
                          activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                      `} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">by {activity.user}</p>
                        <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(activity.amount)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                {systemHealth && (
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-semibold uppercase
                    ${systemHealth.status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : systemHealth.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'}
                  `}>
                    {systemHealth.status}
                  </span>
                )}
              </div>
              {systemHealth ? (
                <div className="space-y-4">
                  {/* Database Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${
                        systemHealth.database.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Database</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {systemHealth.database.response_time}ms
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({systemHealth.database.connections} connections)
                      </span>
                    </div>
                  </div>

                  {/* Cache Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${
                        systemHealth.cache.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Cache</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {systemHealth.cache.response_time}ms
                    </span>
                  </div>

                  {/* Queue Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${
                        systemHealth.queue.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700">Queue</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {systemHealth.queue.pending_jobs} pending
                      </span>
                      {systemHealth.queue.failed_jobs > 0 && (
                        <span className="text-xs text-red-500 ml-2">
                          ({systemHealth.queue.failed_jobs} failed)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* API Performance */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">API Response</span>
                    <span className={`text-xs font-semibold ${
                      systemHealth.api.avg_response_time < 100 
                        ? 'text-green-600' 
                        : systemHealth.api.avg_response_time < 500
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {systemHealth.api.avg_response_time}ms
                    </span>
                  </div>

                  {/* Memory Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      <span className="text-xs text-gray-600">
                        {(systemHealth.server.memory_usage.used / 1024 / 1024).toFixed(0)}MB / 
                        {(systemHealth.server.memory_usage.total / 1024 / 1024).toFixed(0)}MB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          systemHealth.server.memory_usage.percentage > 90 
                            ? 'bg-red-500' 
                            : systemHealth.server.memory_usage.percentage > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(systemHealth.server.memory_usage.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {systemHealth.server.memory_usage.percentage}% used
                    </span>
                  </div>

                  {/* Disk Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                      <span className="text-xs text-gray-600">
                        {(systemHealth.server.disk_usage.used / 1024 / 1024 / 1024).toFixed(1)}GB / 
                        {(systemHealth.server.disk_usage.total / 1024 / 1024 / 1024).toFixed(1)}GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          systemHealth.server.disk_usage.percentage > 90 
                            ? 'bg-red-500' 
                            : systemHealth.server.disk_usage.percentage > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(systemHealth.server.disk_usage.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {systemHealth.server.disk_usage.percentage}% used
                    </span>
                  </div>

                  {/* Last Updated */}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                      Last updated: {new Date(systemHealth.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ServerIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">System health monitoring unavailable</p>
                  <p className="text-xs text-gray-400 mt-1">Loading system status...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <VerificationTab onRefresh={loadDashboardData} />
        )}

        {activeTab === 'interactions' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="lastUpdate">Last Update</option>
                    <option value="createdAt">Created Date</option>
                    <option value="amount">Budget</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Interactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Job Interactions</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artisan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobInteractions && jobInteractions.length > 0 ? (
                      jobInteractions.map((interaction) => (
                        <tr key={interaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {interaction.jobTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {interaction.category} • {interaction.location}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`
                                inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                ${getPriorityColor(interaction.priority)}
                              `}>
                                {interaction.priority}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(interaction.createdAt)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={interaction.client.image || '/default-avatar.png'}
                              alt={interaction.client.name}
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {interaction.client.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {interaction.client.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={interaction.artisan.image || '/default-avatar.png'}
                              alt={interaction.artisan.name}
                            />
                            <div className="ml-3">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {interaction.artisan.name}
                                </span>
                                {interaction.artisan.verified && (
                                  <ShieldCheckIcon className="ml-1 h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {interaction.artisan.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${getStatusColor(interaction.status)}
                          `}>
                            {interaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(interaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="secondary">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <MessageSquareIcon className="h-4 w-4" />
                            </Button>
                            {interaction.status === 'disputed' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleDisputeResolution(
                                  interaction.id, 
                                  'resolved', 
                                  'client'
                                )}
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-lg font-medium">No job interactions found</p>
                          <p className="text-sm">There are no jobs matching your current filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="secondary"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      variant="secondary"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, email, phone..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="client">Clients</option>
                    <option value="artisan">Artisans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="created_at">Registration Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profile_image || '/default-avatar.png'}
                              alt={user.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {user.name}
                                {user.is_verified && (
                                  <ShieldCheckIcon className="ml-1 h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.location || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${user.type === 'client' 
                              ? 'bg-blue-100 text-blue-800' 
                              : user.type === 'artisan'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'}
                          `}>
                            {user.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            {user.is_verified && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                            {user.is_suspended && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Suspended
                              </span>
                            )}
                            {user.profile_completed && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Profile Complete
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleViewUserDetails(user.id)}
                              variant="secondary"
                              size="sm"
                              className="flex items-center space-x-1"
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                            <Button
                              onClick={() => {/* Handle user actions */}}
                              variant="secondary"
                              size="sm"
                            >
                              <MessageSquareIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="secondary"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      variant="secondary"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Time Period:</span>
                <div className="flex space-x-2">
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setAnalyticsPeriod(period);
                        loadAnalytics();
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        analyticsPeriod === period
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {analyticsData ? (
              <div className="space-y-6">
                {/* User Growth Chart */}
                {analyticsData.user_growth && analyticsData.user_growth.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-500" />
                      User Growth
                    </h3>
                    <div className="space-y-2">
                      {analyticsData.user_growth.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600">{item.date}</span>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Clients:</span>
                              <span className="text-sm font-semibold text-blue-600">{item.client_count}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Artisans:</span>
                              <span className="text-sm font-semibold text-orange-600">{item.artisan_count}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Total:</span>
                              <span className="text-sm font-bold text-gray-900">{item.total}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Statistics */}
                {analyticsData.job_stats && analyticsData.job_stats.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 mr-2 text-green-500" />
                      Job Distribution by Status
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {analyticsData.job_stats.map((stat: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 capitalize">{stat.status}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Revenue Chart */}
                {analyticsData.revenue_by_day && analyticsData.revenue_by_day.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSignIcon className="h-5 w-5 mr-2 text-green-500" />
                      Revenue Trend
                    </h3>
                    <div className="space-y-2">
                      {analyticsData.revenue_by_day.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-600">{item.date}</span>
                          <span className="text-sm font-semibold text-green-600">
                            ${parseFloat(item.total_revenue).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Statistics */}
                {analyticsData.category_stats && analyticsData.category_stats.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TagIcon className="h-5 w-5 mr-2 text-purple-500" />
                      Jobs by Category
                    </h3>
                    <div className="space-y-3">
                      {analyticsData.category_stats.map((cat: any, idx: number) => {
                        const maxCount = Math.max(...analyticsData.category_stats.map((c: any) => c.count));
                        const percentage = (cat.count / maxCount) * 100;
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">{cat.category || 'Uncategorized'}</span>
                              <span className="text-gray-600">{cat.count} jobs</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Top Performers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Artisans */}
                  {analyticsData.top_artisans && analyticsData.top_artisans.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        Top Artisans
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.top_artisans.map((artisan: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{idx + 1}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{artisan.name}</p>
                                <p className="text-xs text-gray-500">{artisan.completed_jobs} jobs completed</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {parseFloat(artisan.avg_rating).toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Clients */}
                  {analyticsData.top_clients && analyticsData.top_clients.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Top Clients
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.top_clients.map((client: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-semibold">{idx + 1}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                                <p className="text-xs text-gray-500">{client.jobs_posted} jobs posted</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-600">
                                ${parseFloat(client.total_spent).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                <TrendingUpIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Loading analytics data...</p>
              </div>
            )}
          </div>
        )}

        {/* Disputes Tab */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex space-x-2">
                  {['all', 'raised', 'investigating', 'resolved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setDisputeStatusFilter(status);
                        setCurrentPage(1);
                        // Reload disputes with new filter
                        setTimeout(() => loadDisputes(), 0);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        disputeStatusFilter === status
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Disputes List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {disputes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artisan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Raised
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disputes.map((dispute: any) => (
                        <tr key={dispute.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {dispute.job?.title || 'N/A'}
                              </div>
                              <div className="text-gray-500">
                                Job #{dispute.job?.id || dispute.job_id}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {dispute.currency} {parseFloat(dispute.amount).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {dispute.client?.name || 'N/A'}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {dispute.client?.email || ''}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {dispute.artisan?.name || 'N/A'}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {dispute.artisan?.email || ''}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              dispute.dispute_status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : dispute.dispute_status === 'investigating'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {dispute.dispute_status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {dispute.dispute_reason || 'No reason provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dispute.dispute_date 
                              ? new Date(dispute.dispute_date).toLocaleDateString()
                              : dispute.dispute_raised_at
                              ? new Date(dispute.dispute_raised_at).toLocaleDateString()
                              : 'N/A'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {dispute.dispute_status !== 'resolved' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Resolve dispute in favor of client (refund)?')) {
                                      try {
                                        await adminApi.resolveDispute(dispute.id, 'refund', 'client');
                                        await loadDisputes();
                                      } catch (err) {
                                        setError('Failed to resolve dispute');
                                      }
                                    }
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Refund to Client"
                                >
                                  <XCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Resolve dispute in favor of artisan (release payment)?')) {
                                      try {
                                        await adminApi.resolveDispute(dispute.id, 'release', 'artisan');
                                        await loadDisputes();
                                      } catch (err) {
                                        setError('Failed to resolve dispute');
                                      }
                                    }
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Release to Artisan"
                                >
                                  <CheckCircleIcon className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                            {dispute.dispute_status === 'resolved' && (
                              <span className="text-gray-400">Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        variant="secondary"
                        size="sm"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        variant="secondary"
                        size="sm"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <AlertTriangleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No disputes found</p>
                  <p className="text-sm text-gray-400">
                    {disputeStatusFilter !== 'all' 
                      ? `No ${disputeStatusFilter} disputes at the moment`
                      : 'All disputes will appear here'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => {
                    setShowUserDetails(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedUser.profile_image || '/default-avatar.png'}
                    alt={selectedUser.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                      {selectedUser.is_verified && (
                        <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <p className="text-gray-600">{selectedUser.phone || 'No phone'}</p>
                    <div className="mt-2 flex space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.type === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {selectedUser.type}
                      </span>
                      {selectedUser.is_suspended && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {selectedUser.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedUser.stats).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {typeof value === 'number' && (key.includes('earnings') || key.includes('spent')) 
                            ? formatCurrency(value) 
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Jobs */}
                {selectedUser.recent_jobs && selectedUser.recent_jobs.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Jobs</h4>
                    <div className="space-y-2">
                      {selectedUser.recent_jobs.slice(0, 5).map((job: any) => (
                        <div key={job.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-600">Status: {job.status}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(job.budget)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Payments */}
                {selectedUser.recent_payments && selectedUser.recent_payments.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Payments</h4>
                    <div className="space-y-2">
                      {selectedUser.recent_payments.slice(0, 5).map((payment: any) => (
                        <div key={payment.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                            <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account Info */}
                {selectedUser.account_info && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Verified</p>
                        <p className="font-medium">{selectedUser.account_info.is_verified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Profile Completed</p>
                        <p className="font-medium">{selectedUser.account_info.profile_completed ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Login</p>
                        <p className="font-medium">{selectedUser.account_info.last_login ? formatDate(selectedUser.account_info.last_login) : 'Never'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Suspended</p>
                        <p className="font-medium">{selectedUser.account_info.is_suspended ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { type: 'users', label: 'Users Data' },
              { type: 'jobs', label: 'Jobs Data' },
              { type: 'payments', label: 'Payments Data' },
              { type: 'analytics', label: 'Analytics Report' }
            ].map((export_option) => (
              <div key={export_option.type} className="flex space-x-2">
                <Button
                  onClick={() => handleExport(export_option.type, 'json')}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  {export_option.label} (JSON)
                </Button>
                <Button
                  onClick={() => handleExport(export_option.type, 'csv')}
                  variant="secondary"
                  size="sm"
                >
                  CSV
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
