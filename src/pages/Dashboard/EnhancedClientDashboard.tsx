import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUpIcon, 
  DollarSignIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  UserIcon,
  StarIcon,
  MessageCircleIcon,
  BellIcon,
  PlusCircleIcon,
  SearchIcon,
  CreditCardIcon,
  MessageSquareIcon,
  MapPinIcon,
  HeartIcon,
  ExternalLinkIcon
} from 'lucide-react';
import Button from '../../components/Button';
import { 
  mockClients, 
  getJobsByClient, 
  getNotificationsByUser, 
  getArtisansByLocation 
} from '../../data/mockData';

export default function EnhancedClientDashboard() {
  const [favoriteArtisans, setFavoriteArtisans] = useState<string[]>([]);
  
  // Get current client (using first client for demo)
  const currentClient = mockClients[0];
  const clientJobs = getJobsByClient(currentClient.id);
  const clientNotifications = getNotificationsByUser(currentClient.id);
  const nearbyArtisans = getArtisansByLocation(currentClient.location);
  const unreadNotifications = clientNotifications.filter(n => !n.isRead).length;
  
  // Filter urgent notifications
  const urgentNotifications = clientNotifications.filter(n => n.priority === 'high' && !n.isRead);
  
  // Budget calculations
  const totalBudgetSpent = clientJobs
    .filter(j => j.status === 'completed')
    .reduce((sum, job) => sum + job.budget, 0);
  
  const pendingBudget = clientJobs
    .filter(j => j.status === 'in-progress')
    .reduce((sum, job) => sum + job.budget, 0);
  
  const monthlySpending = clientJobs
    .filter(j => {
      const jobDate = new Date(j.createdAt);
      const now = new Date();
      return jobDate.getMonth() === now.getMonth() && 
             jobDate.getFullYear() === now.getFullYear() &&
             j.status === 'completed';
    })
    .reduce((sum, job) => sum + job.budget, 0);

  const toggleFavorite = (artisanId: string) => {
    setFavoriteArtisans(prev => 
      prev.includes(artisanId) 
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    );
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentClient.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            {urgentNotifications.length > 0 && (
              <Button variant="danger" size="sm">
                <AlertTriangleIcon className="w-4 h-4 mr-2" />
                {urgentNotifications.length} Urgent
              </Button>
            )}
            <Button variant="secondary" size="sm">
              <BellIcon className="w-4 h-4 mr-2" />
              Notifications ({unreadNotifications})
            </Button>
            <Link to="/post-job">
              <Button>
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Budget & Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalBudgetSpent)}</p>
              </div>
              <DollarSignIcon className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(pendingBudget)}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">{clientJobs.filter(j => j.status === 'in-progress').length} active jobs</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(monthlySpending)}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-600">
                {clientJobs.filter(j => new Date(j.createdAt).getMonth() === new Date().getMonth()).length} jobs this month
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((clientJobs.filter(j => j.status === 'completed').length / clientJobs.length) * 100)}%
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-purple-600">{clientJobs.filter(j => j.status === 'completed').length} completed jobs</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/post-job" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <BriefcaseIcon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-900">Post Job</span>
                  <span className="text-xs text-gray-500 mt-1">Create new project</span>
                </Link>
                <Link to="/search" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <SearchIcon className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-900">Find Artisans</span>
                  <span className="text-xs text-gray-500 mt-1">Browse skilled professionals</span>
                </Link>
                <Link to="/messages" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group relative">
                  <MessageSquareIcon className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-900">Messages</span>
                  <span className="text-xs text-gray-500 mt-1">Chat with artisans</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </Link>
                <Link to="/payment" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <CreditCardIcon className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-900">Payments</span>
                  <span className="text-xs text-gray-500 mt-1">Manage transactions</span>
                </Link>
              </div>
            </div>

            {/* Enhanced Active Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{clientJobs.length} total jobs</span>
                  <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {clientJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          {job.priority === 'urgent' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">URGENT</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <DollarSignIcon className="w-4 h-4 mr-1" />
                            {formatPrice(job.budget)}
                          </span>
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status === 'in-progress' ? 'In Progress' : 
                           job.status === 'completed' ? 'Completed' :
                           'Open'}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary">
                            <MessageCircleIcon className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm">
                            <ExternalLinkIcon className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Artisan Discovery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recommended Artisans</h2>
                <Button variant="secondary" size="sm">
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyArtisans.slice(0, 4).map((artisan) => (
                  <div key={artisan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{artisan.name}</h3>
                          <p className="text-sm text-gray-600">{artisan.skills[0] || 'General Services'}</p>
                          <div className="flex items-center mt-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{artisan.rating}</span>
                            <span className="text-xs text-gray-500 ml-2">({artisan.completedJobs} jobs)</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(artisan.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favoriteArtisans.includes(artisan.id)
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <HeartIcon className={`w-4 h-4 ${favoriteArtisans.includes(artisan.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {artisan.location}
                      </span>
                      <span className="text-green-600 font-medium">{formatPrice(artisan.hourlyRate)}/hour</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          Chat
                        </Button>
                      </div>
                      <Button size="sm">Hire Now</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Discover More Artisans →
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Performance Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Job Completion</span>
                  <span className="font-medium text-gray-900">7.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction Rate</span>
                  <span className="font-medium text-green-600">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Repeat Bookings</span>
                  <span className="font-medium text-blue-600">74%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '96%'}}></div>
                </div>
                <p className="text-xs text-gray-500">Based on {clientJobs.length} total jobs</p>
              </div>
            </div>

            {/* Enhanced Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <div className="flex items-center space-x-2">
                  {unreadNotifications > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{unreadNotifications} new</span>
                  )}
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {clientNotifications.slice(0, 8).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      notification.isRead
                        ? 'border-gray-200 bg-white'
                        : notification.priority === 'high' 
                          ? 'border-red-200 bg-red-50'
                          : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                          {notification.priority === 'high' && (
                            <AlertTriangleIcon className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" fullWidth>
                Mark All as Read
              </Button>
            </div>

            {/* Enhanced Account Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Jobs Posted</span>
                  </div>
                  <span className="font-medium text-gray-900">{clientJobs.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {clientJobs.filter(j => j.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {clientJobs.filter(j => j.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Total Investment</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatPrice(totalBudgetSpent)}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Profile */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium text-gray-900">{currentClient.name}</h3>
                <p className="text-sm text-gray-600">{currentClient.email}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  {currentClient.location}
                </p>
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <StarIcon key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">5.0</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="secondary">
                    Edit Profile
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ChartBarIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
