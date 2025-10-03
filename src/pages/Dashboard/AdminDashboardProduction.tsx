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
  XCircleIcon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'disputes' | 'analytics' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastUpdate');
  
  // State for API data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobInteractions, setJobInteractions] = useState<JobInteraction[]>([]);
  const [realTimeActivities, setRealTimeActivities] = useState<RealTimeActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  
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
    }
  }, [activeTab, searchTerm, statusFilter, priorityFilter, sortBy, currentPage]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsData] = await Promise.all([
        adminApi.getDashboardStats(),
      ]);

      setStats(statsData.data);
      // Mock real-time activities for now
      setRealTimeActivities([
        {
          id: '1',
          type: 'job_posted',
          user: 'John Doe',
          description: 'Posted a new plumbing job',
          timestamp: new Date().toISOString(),
          priority: 'low'
        }
      ]);
      // Mock system health for now
      setSystemHealth({
        database: { status: 'healthy' },
        server: { status: 'healthy', uptime: 3600, memoryUsage: { used: 512 * 1024 * 1024 }, activeConnections: 42 }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
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
      // Transform jobs to job interactions format
      const interactions = response.data.data.map((job: any) => ({
        id: job.id,
        jobTitle: job.title,
        client: job.client,
        artisan: job.artisan,
        status: job.status,
        amount: job.budget,
        location: 'N/A',
        createdAt: job.created_at,
        lastUpdate: job.created_at,
        priority: 'medium',
        duration: 'N/A',
        category: 'General',
        communicationCount: 0,
        lastCommunication: job.created_at
      }));
      setJobInteractions(interactions);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job interactions');
    }
  };

  const loadActivities = async () => {
    try {
      // Mock activities for now - can be replaced when backend endpoint is ready
      setRealTimeActivities([
        {
          id: String(Date.now()),
          type: 'job_posted',
          user: 'System',
          description: 'Activity refreshed',
          timestamp: new Date().toISOString(),
          priority: 'low'
        }
      ]);
    } catch (err) {
      console.error('Failed to refresh activities:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    if (activeTab === 'interactions') {
      await loadJobInteractions();
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
              { id: 'disputes', label: 'Disputes', icon: AlertTriangleIcon },
              { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
              { id: 'users', label: 'User Management', icon: UsersIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
                {realTimeActivities.map((activity) => (
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
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              {systemHealth && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${systemHealth.database.status === 'healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}
                    `}>
                      {systemHealth.database.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${systemHealth.server.status === 'healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}
                    `}>
                      {systemHealth.server.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Uptime: {Math.floor(systemHealth.server.uptime / 3600)}h {Math.floor((systemHealth.server.uptime % 3600) / 60)}m
                    </p>
                    <p className="text-xs text-gray-500">
                      Memory: {Math.round(systemHealth.server.memoryUsage.used / 1024 / 1024)}MB
                    </p>
                    <p className="text-xs text-gray-500">
                      Active Connections: {systemHealth.server.activeConnections}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                    {jobInteractions.map((interaction) => (
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
