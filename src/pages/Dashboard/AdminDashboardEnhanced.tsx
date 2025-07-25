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
  ClockIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  RefreshCwIcon,
  DownloadIcon,
  Settings2Icon,
  UserIcon,
  ActivityIcon,
  HeadphonesIcon,
  ZapIcon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

// Types for enhanced admin data
interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalArtisans: number;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingVerifications: number;
  disputes: number;
  newSignups: number;
  platformFee: number;
  conversionRate: number;
  avgJobValue: number;
  userSatisfaction: number;
  responseTime: number;
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
  status: 'posted' | 'applied' | 'accepted' | 'in-progress' | 'completed' | 'disputed' | 'cancelled';
  amount: number;
  location: string;
  createdAt: string;
  lastUpdate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  duration: string;
  category: string;
  communicationCount: number;
  lastCommunication: string;
}

interface RealTimeActivity {
  id: string;
  type: 'job_posted' | 'job_applied' | 'job_started' | 'job_completed' | 'payment' | 'dispute' | 'message' | 'location_update';
  user: string;
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  jobId?: string;
  amount?: number;
}

export default function AdminDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'disputes' | 'analytics' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastUpdate');
  const [realTimeActivities, setRealTimeActivities] = useState<RealTimeActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock enhanced admin statistics
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    totalClients: 823,
    totalArtisans: 424,
    totalJobs: 2156,
    activeJobs: 89,
    completedJobs: 1834,
    totalRevenue: 45800000,
    monthlyRevenue: 3200000,
    pendingVerifications: 23,
    disputes: 7,
    newSignups: 156,
    platformFee: 2290000,
    conversionRate: 78.5,
    avgJobValue: 42500,
    userSatisfaction: 4.6,
    responseTime: 2.3
  });

  // Mock enhanced job interactions with client-artisan relationships
  const [jobInteractions] = useState<JobInteraction[]>([
    {
      id: 'int-001',
      jobTitle: 'Kitchen Cabinet Installation',
      client: {
        id: 'cli-001',
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b812292?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4.8,
        location: 'Warri, Nigeria',
        totalJobs: 12
      },
      artisan: {
        id: 'art-001',
        name: 'John Carpenter',
        email: 'john@email.com',
        image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4.9,
        verified: true,
        location: 'Warri, Nigeria',
        completedJobs: 89
      },
      status: 'in-progress',
      amount: 85000,
      location: 'Warri, Nigeria',
      createdAt: '2024-01-15',
      lastUpdate: '2024-01-20',
      priority: 'medium',
      duration: '3 days',
      category: 'Carpentry',
      communicationCount: 8,
      lastCommunication: '2 hours ago'
    },
    {
      id: 'int-002',
      jobTitle: 'Electrical Wiring Repair',
      client: {
        id: 'cli-002',
        name: 'Michael Chen',
        email: 'michael@email.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4.5,
        location: 'Lagos, Nigeria',
        totalJobs: 8
      },
      artisan: {
        id: 'art-002',
        name: 'David Electrician',
        email: 'david@email.com',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4.7,
        verified: true,
        location: 'Lagos, Nigeria',
        completedJobs: 156
      },
      status: 'disputed',
      amount: 45000,
      location: 'Lagos, Nigeria',
      createdAt: '2024-01-18',
      lastUpdate: '2024-01-21',
      priority: 'urgent',
      duration: '1 day',
      category: 'Electrical',
      communicationCount: 15,
      lastCommunication: '30 minutes ago'
    },
    {
      id: 'int-003',
      jobTitle: 'Plumbing Installation',
      client: {
        id: 'cli-003',
        name: 'Emma Wilson',
        email: 'emma@email.com',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4.9,
        location: 'Abuja, Nigeria',
        totalJobs: 23
      },
      artisan: {
        id: 'art-003',
        name: 'James Plumber',
        email: 'james@email.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4.8,
        verified: true,
        location: 'Abuja, Nigeria',
        completedJobs: 234
      },
      status: 'completed',
      amount: 67000,
      location: 'Abuja, Nigeria',
      createdAt: '2024-01-10',
      lastUpdate: '2024-01-19',
      priority: 'low',
      duration: '2 days',
      category: 'Plumbing',
      communicationCount: 12,
      lastCommunication: '1 day ago'
    }
  ]);

  // Real-time activity simulation with error handling
  useEffect(() => {
    try {
      const activities: RealTimeActivity[] = [
        {
          id: '1',
          type: 'job_posted',
          user: 'Sarah Johnson',
          description: 'Posted new job: Kitchen Cabinet Installation',
          timestamp: '2 minutes ago',
          priority: 'medium',
          jobId: 'job-001',
          amount: 85000
        },
        {
          id: '2',
          type: 'job_applied',
          user: 'John Carpenter',
          description: 'Applied for Electrical Wiring job',
          timestamp: '5 minutes ago',
          priority: 'medium',
          jobId: 'job-002'
        },
        {
          id: '3',
          type: 'payment',
          user: 'Michael Chen',
          description: 'Payment processed for completed job',
          timestamp: '8 minutes ago',
          priority: 'high',
          amount: 45000
        },
        {
          id: '4',
          type: 'dispute',
          user: 'Emma Wilson',
          description: 'Raised dispute for incomplete work',
          timestamp: '12 minutes ago',
          priority: 'high',
          jobId: 'job-003'
        },
        {
          id: '5',
          type: 'location_update',
          user: 'David Electrician',
          description: 'Updated location - En route to job site',
          timestamp: '15 minutes ago',
          priority: 'low',
          jobId: 'job-004'
        }
      ];
      setRealTimeActivities(activities);

      // Auto-refresh every 30 seconds with error handling
      const interval = setInterval(() => {
        try {
          setRealTimeActivities(prev => {
            const newActivity: RealTimeActivity = {
              id: Date.now().toString(),
              type: ['job_posted', 'job_applied', 'payment', 'message'][Math.floor(Math.random() * 4)] as any,
              user: ['John Doe', 'Jane Smith', 'Bob Wilson'][Math.floor(Math.random() * 3)],
              description: 'New activity detected',
              timestamp: 'Just now',
              priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
            };
            return [newActivity, ...prev.slice(0, 9)];
          });
        } catch (err) {
          setError('Failed to update real-time activities');
          console.error('Real-time update error:', err);
        }
      }, 30000);

      return () => {
        clearInterval(interval);
      };
    } catch (err) {
      setError('Failed to initialize real-time activities');
      console.error('Initialization error:', err);
    }
  }, []);

  // Filter and sort interactions
  const filteredInteractions = jobInteractions
    .filter(interaction => {
      const matchesSearch = interaction.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.artisan.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || interaction.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || interaction.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'lastUpdate':
        default:
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'posted': return 'bg-yellow-100 text-yellow-800';
      case 'applied': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'job_posted': return <BriefcaseIcon className="h-4 w-4" />;
      case 'job_applied': return <UserIcon className="h-4 w-4" />;
      case 'job_started': return <ZapIcon className="h-4 w-4" />;
      case 'job_completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'payment': return <DollarSignIcon className="h-4 w-4" />;
      case 'dispute': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'message': return <MessageSquareIcon className="h-4 w-4" />;
      case 'location_update': return <MapPinIcon className="h-4 w-4" />;
      default: return <ActivityIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <span className="sr-only">Dismiss</span>
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor and manage client-artisan interactions</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <Button variant="secondary" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="secondary" size="sm">
                  <Settings2Icon className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="primary" size="sm" onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    window.location.reload();
                  }, 1000);
                }}>
                  <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: BarChart3Icon },
                  { id: 'interactions', name: 'Interactions', icon: UsersIcon },
                  { id: 'disputes', name: 'Disputes', icon: AlertTriangleIcon },
                  { id: 'analytics', name: 'Analytics', icon: TrendingUpIcon },
                  { id: 'users', name: 'User Management', icon: ShieldCheckIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</dd>
                        <dd className="text-sm text-green-600 flex items-center">
                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                          +{stats.newSignups} this month
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BriefcaseIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</dd>
                        <dd className="text-sm text-gray-600">
                          {stats.completedJobs} completed
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSignIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                        <dd className="text-2xl font-semibold text-gray-900">₦{(stats.monthlyRevenue / 1000000).toFixed(1)}M</dd>
                        <dd className="text-sm text-green-600 flex items-center">
                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                          +12.5% from last month
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertTriangleIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Disputes</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.disputes}</dd>
                        <dd className="text-sm text-gray-600">
                          Needs attention
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Real-time Activity</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {realTimeActivities.map((activity, index) => (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {index !== realTimeActivities.length - 1 && (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                              )}
                              <div className="relative flex space-x-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  activity.priority === 'high' ? 'bg-red-100 text-red-600' :
                                  activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-green-100 text-green-600'
                                }`}>
                                  {getActivityIcon(activity.type)}
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-900">
                                      <span className="font-medium">{activity.user}</span>{' '}
                                      {activity.description}
                                      {activity.amount && (
                                        <span className="font-medium text-green-600">
                                          {' '}(₦{activity.amount.toLocaleString()})
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {activity.timestamp}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Health</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">User Satisfaction</span>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{stats.userSatisfaction}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Response Time</span>
                        <span className="text-sm font-medium">{stats.responseTime}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <span className="text-sm font-medium text-green-600">{stats.conversionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Job Value</span>
                        <span className="text-sm font-medium">₦{stats.avgJobValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Urgent Actions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-red-50 rounded-lg">
                        <AlertTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">{stats.disputes} Active Disputes</p>
                          <p className="text-xs text-red-700">Require immediate attention</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-yellow-600 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-900">{stats.pendingVerifications} Pending Verifications</p>
                          <p className="text-xs text-yellow-700">Artisan profile reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactions Tab - Main Focus */}
          {activeTab === 'interactions' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by job title, client, or artisan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="posted">Posted</option>
                      <option value="applied">Applied</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="disputed">Disputed</option>
                    </select>
                    
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Priority</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="lastUpdate">Latest Update</option>
                      <option value="amount">Amount</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interactions List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Client-Artisan Interactions</h3>
                  <p className="text-sm text-gray-600 mt-1">Monitor and manage all job interactions between clients and artisans</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInteractions.map((interaction) => (
                        <tr key={interaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(interaction.priority)}`}></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{interaction.jobTitle}</div>
                                <div className="text-sm text-gray-500">{interaction.category} • {interaction.duration}</div>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                  <MapPinIcon className="h-3 w-3 mr-1" />
                                  {interaction.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-8 w-8 rounded-full mr-3" src={interaction.client.image} alt={interaction.client.name} />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{interaction.client.name}</div>
                                <div className="text-sm text-gray-500">{interaction.client.email}</div>
                                <div className="flex items-center text-xs text-gray-400">
                                  <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                                  {interaction.client.rating} • {interaction.client.totalJobs} jobs
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-8 w-8 rounded-full mr-3" src={interaction.artisan.image} alt={interaction.artisan.name} />
                              <div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">{interaction.artisan.name}</span>
                                  {interaction.artisan.verified && (
                                    <ShieldCheckIcon className="h-4 w-4 text-green-500 ml-1" />
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{interaction.artisan.email}</div>
                                <div className="flex items-center text-xs text-gray-400">
                                  <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                                  {interaction.artisan.rating} • {interaction.artisan.completedJobs} jobs
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interaction.status)}`}>
                              {interaction.status.replace('-', ' ')}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Updated {interaction.lastUpdate}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₦{interaction.amount.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Job value</div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MessageSquareIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{interaction.communicationCount}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Last: {interaction.lastCommunication}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="secondary">
                                <EyeIcon className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              {interaction.status === 'disputed' && (
                                <Button size="sm" variant="danger">
                                  <HeadphonesIcon className="h-3 w-3 mr-1" />
                                  Resolve
                                </Button>
                              )}
                              <Button size="sm" variant="secondary">
                                <MessageSquareIcon className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Disputes Tab - Enhanced */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              {/* Dispute Resolution Dashboard */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Active Disputes Management</h3>
                    <p className="text-gray-600 mt-1">Resolve conflicts between clients and artisans efficiently</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-red-600">{stats.disputes}</span> active disputes
                    </div>
                    <Button variant="primary" size="sm">
                      <AlertTriangleIcon className="h-4 w-4 mr-2" />
                      Priority Queue
                    </Button>
                  </div>
                </div>
                
                {/* Dispute Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.disputes}</div>
                    <div className="text-sm text-red-700">Total Disputes</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-sm text-yellow-700">Under Review</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-blue-700">In Mediation</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15</div>
                    <div className="text-sm text-green-700">Resolved Today</div>
                  </div>
                </div>
                
                {/* Active Disputes List */}
                <div className="space-y-4">
                  {filteredInteractions.filter(i => i.status === 'disputed').map((dispute) => (
                    <div key={dispute.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <AlertTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                            <h4 className="font-semibold text-red-900">{dispute.jobTitle}</h4>
                            <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                              High Priority
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center space-x-3">
                              <img src={dispute.client.image} alt={dispute.client.name} className="h-8 w-8 rounded-full" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">Client: {dispute.client.name}</div>
                                <div className="text-xs text-gray-600">{dispute.client.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src={dispute.artisan.image} alt={dispute.artisan.name} className="h-8 w-8 rounded-full" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">Artisan: {dispute.artisan.name}</div>
                                <div className="text-xs text-gray-600">{dispute.artisan.email}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>Amount: <span className="font-medium text-gray-900">₦{dispute.amount.toLocaleString()}</span></span>
                            <span>Location: {dispute.location}</span>
                            <span>Last Updated: {dispute.lastUpdate}</span>
                            <span>Communications: {dispute.communicationCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="primary">
                            <HeadphonesIcon className="h-3 w-3 mr-1" />
                            Start Mediation
                          </Button>
                          <Button size="sm" variant="secondary">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="secondary">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            Contact Both
                          </Button>
                        </div>
                      </div>
                      
                      {/* Quick Resolution Actions */}
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-red-700">
                            Dispute Category: Payment Issue • Priority: High • SLA: 24 hours
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-xs text-red-600 hover:text-red-800 underline">
                              Escalate to Senior
                            </button>
                            <button className="text-xs text-red-600 hover:text-red-800 underline">
                              Close Dispute
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredInteractions.filter(i => i.status === 'disputed').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Disputes</h3>
                      <p className="text-gray-600">All disputes have been resolved. Great work!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dispute Resolution Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Resolution Time</span>
                      <span className="text-sm font-medium">2.3 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resolution Rate</span>
                      <span className="text-sm font-medium text-green-600">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Client Satisfaction</span>
                      <span className="text-sm font-medium">4.6/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Artisan Satisfaction</span>
                      <span className="text-sm font-medium">4.4/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Common Issues</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">Payment Delays</span>
                      <span className="text-sm font-medium text-gray-600">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">Quality Issues</span>
                      <span className="text-sm font-medium text-gray-600">30%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">Timeline Disputes</span>
                      <span className="text-sm font-medium text-gray-600">15%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">Communication Issues</span>
                      <span className="text-sm font-medium text-gray-600">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab - Enhanced */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Revenue Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analytics</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
                  <p className="text-sm text-gray-600">Total platform revenue</p>
                  <div className="mt-4 text-sm text-green-600 flex items-center">
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                    +15.3% from last quarter
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">Platform Fees: ₦{(stats.platformFee / 1000000).toFixed(1)}M</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.newSignups}</div>
                  <p className="text-sm text-gray-600">New users this month</p>
                  <div className="mt-4 text-sm text-blue-600 flex items-center">
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                    +8.7% month over month
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">Conversion Rate: {stats.conversionRate}%</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Health</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stats.userSatisfaction}/5</div>
                  <p className="text-sm text-gray-600">Average user rating</p>
                  <div className="mt-4 text-sm text-purple-600 flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Excellent rating
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">Response Time: {stats.responseTime}h avg</div>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Job Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Jobs Posted</span>
                      <span className="text-sm font-medium">{stats.totalJobs.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-green-600">{((stats.completedJobs / stats.totalJobs) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Job Value</span>
                      <span className="text-sm font-medium">₦{stats.avgJobValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Jobs</span>
                      <span className="text-sm font-medium text-blue-600">{stats.activeJobs}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <span className="text-sm font-medium">{stats.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Clients</span>
                      <span className="text-sm font-medium text-blue-600">{stats.totalClients.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Artisans</span>
                      <span className="text-sm font-medium text-green-600">{stats.totalArtisans.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Client-to-Artisan Ratio</span>
                      <span className="text-sm font-medium">{(stats.totalClients / stats.totalArtisans).toFixed(1)}:1</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Regional Analytics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Lagos State</h4>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">456</div>
                      <div className="text-sm text-blue-700">Active Jobs</div>
                      <div className="text-xs text-blue-600">65% of total volume</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Abuja FCT</h4>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">234</div>
                      <div className="text-sm text-green-700">Active Jobs</div>
                      <div className="text-xs text-green-600">25% of total volume</div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Port Harcourt</h4>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-yellow-600">123</div>
                      <div className="text-sm text-yellow-700">Active Jobs</div>
                      <div className="text-xs text-yellow-600">10% of total volume</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab - Enhanced */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500">Total Users</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500">Verified Users</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{(stats.totalUsers - stats.pendingVerifications).toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500">Pending</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.pendingVerifications}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500">New This Month</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.newSignups}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Management Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <div className="flex space-x-3">
                    <Button variant="secondary" size="sm">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                    <Button variant="primary" size="sm">
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Bulk Actions
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Management */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                      Client Management
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Total Clients</div>
                          <div className="text-xs text-gray-600">{stats.totalClients} registered</div>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{stats.totalClients}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Active This Month</div>
                          <div className="text-xs text-gray-600">Posted jobs recently</div>
                        </div>
                        <span className="text-lg font-bold text-green-600">{Math.floor(stats.totalClients * 0.7)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">High Value Clients</div>
                          <div className="text-xs text-gray-600">₦500K+ spent</div>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">{Math.floor(stats.totalClients * 0.15)}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <Button variant="secondary" size="sm" fullWidth>
                          <UsersIcon className="h-4 w-4 mr-2" />
                          Manage All Clients
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Artisan Management */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 text-green-600 mr-2" />
                      Artisan Management
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Total Artisans</div>
                          <div className="text-xs text-gray-600">{stats.totalArtisans} registered</div>
                        </div>
                        <span className="text-lg font-bold text-green-600">{stats.totalArtisans}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Verified Artisans</div>
                          <div className="text-xs text-gray-600">ID & skills verified</div>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{stats.totalArtisans - stats.pendingVerifications}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Pending Verification</div>
                          <div className="text-xs text-gray-600">Awaiting review</div>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">{stats.pendingVerifications}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <Button variant="primary" size="sm" fullWidth>
                          <ShieldCheckIcon className="h-4 w-4 mr-2" />
                          Review Verifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Activity & Growth Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth Trends</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Signups</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{stats.newSignups}</span>
                        <TrendingUpIcon className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Growth Rate</span>
                      <span className="text-sm font-medium text-green-600">+8.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="text-sm font-medium">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Session Duration</span>
                      <span className="text-sm font-medium">12.4 min</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Satisfaction</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overall Rating</span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{stats.userSatisfaction}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Client Satisfaction</span>
                      <span className="text-sm font-medium">4.7/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Artisan Satisfaction</span>
                      <span className="text-sm font-medium">4.5/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Support Response Time</span>
                      <span className="text-sm font-medium">{stats.responseTime}h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="primary" fullWidth>
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    Verify {stats.pendingVerifications} Artisans
                  </Button>
                  <Button variant="secondary" fullWidth>
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Send Announcements
                  </Button>
                  <Button variant="secondary" fullWidth>
                    <BarChart3Icon className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
