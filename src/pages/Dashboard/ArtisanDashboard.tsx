import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, BriefcaseIcon, MessageSquareIcon, UserIcon, CreditCardIcon, BellIcon } from 'lucide-react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { profileApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function ArtisanDashboardEnhanced() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const dashResponse = await profileApi.getArtisanDashboard();
        
        setDashboardData(dashResponse.data);
        setAvailableJobs(dashResponse.data.available_jobs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.type === 'artisan') {
      fetchDashboard();
    }
  }, [user]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load dashboard data'}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const currentArtisan = dashboardData.user;
  const artisanJobs = dashboardData.active_jobs || [];
  const stats = dashboardData.stats || {};
  const ongoingJobs = artisanJobs.filter((job: any) => job.status === 'in-progress');
  const openJobs = availableJobs.slice(0, 2);

  return <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="text-blue-600 text-xl font-bold">
            MySharpJobs
          </Link>
        </div>
        <div className="flex-grow flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link to="/artisan/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/artisan/jobs" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <BriefcaseIcon className="mr-3 h-5 w-5 text-gray-400" />
              Jobs
            </Link>
            <Link to="/messages" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <MessageSquareIcon className="mr-3 h-5 w-5 text-gray-400" />
              Messages
            </Link>
            <Link to="/artisan/profile" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
              Profile
            </Link>
            <Link to="/artisan/payments" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <CreditCardIcon className="mr-3 h-5 w-5 text-gray-400" />
              Payments
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-sm w-full fixed top-0 z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="text-blue-600 text-xl font-bold">
            MySharpJobs
          </Link>
          <div className="flex items-center">
            <button className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-label="Open menu">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-16 w-16 rounded-full" src={currentArtisan.avatar} alt="Profile" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentArtisan.name}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {currentArtisan.isVerified ? 'Verified' : 'Pending'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {currentArtisan.skills[0]} • {currentArtisan.experience} years experience
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">{currentArtisan.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({currentArtisan.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.completedJobs}</div>
                    <div className="text-sm text-gray-500">Completed Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.inProgressJobs}</div>
                    <div className="text-sm text-gray-500">Active Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₦{stats.totalEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">₦{currentArtisan.hourlyRate.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Hourly Rate</div>
                  </div>
                </div>
              </div>

              {/* Job Offers */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Available Job Offers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openJobs.map((job: any) => {
                    const client = job.client || { name: 'Unknown Client', location: 'N/A' };
                    return (
                      <div key={job.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {job.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              New
                            </span>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">
                              {job.description.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="mt-4 flex items-center">
                            <div className="flex-shrink-0">
                              <img className="h-8 w-8 rounded-full" src={client?.avatar} alt="Client" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {client?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {job.location}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <p className="text-sm font-medium text-gray-900">
                                ₦{job.budget.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <Link to={`/job/${job.id}`}>
                              <Button variant="primary" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Button variant="secondary" size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ongoing Jobs */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Your Active Jobs
                </h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {ongoingJobs.map((job: any) => {
                      const client = job.client || { name: 'Unknown Client', phone: 'N/A' };
                      return (
                        <li key={job.id}>
                          <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  Started {new Date(job.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                In Progress
                              </span>
                            </div>
                            <div className="mt-2 flex items-center">
                              <div className="flex-shrink-0">
                                <img className="h-8 w-8 rounded-full" src={client?.avatar} alt="Client" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {client?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {job.location}
                                </p>
                              </div>
                              <div className="ml-auto">
                                <Link to={`/job/${job.id}/track`}>
                                  <Button variant="primary" size="sm">
                                    Track Progress
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    {ongoingJobs.length === 0 && (
                      <li>
                        <div className="px-6 py-8 text-center">
                          <p className="text-gray-500">No active jobs at the moment</p>
                          <Link to="/search" className="mt-2 inline-block text-blue-600 hover:text-blue-500">
                            Browse available jobs
                          </Link>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>;
}
