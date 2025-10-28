import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign, 
  Search, 
  CheckCircle, 
  Star,
  Briefcase
} from 'lucide-react';
import Button from '../../components/Button';
import { jobApi } from '../../utils/api';

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  priority?: string;
  urgency?: string;
  estimated_duration?: string;
  required_skills?: string[];
  images?: string[];
  client_id: number;
  artisan_id?: number;
  created_at: string;
  updated_at: string;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  rating?: number;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{job.client?.name || 'Unknown Client'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
            {job.status.replace('-', ' ')}
          </span>
          {job.priority && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}>
              {job.priority}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <DollarSign className="w-4 h-4" />
            <span>₦{job.budget.toLocaleString()}</span>
          </div>
          {job.estimated_duration && (
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{job.estimated_duration}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {job.status === 'open' && (
            <Button variant="primary" size="sm">Apply</Button>
          )}
          {job.status === 'in-progress' && (
            <Button variant="secondary" size="sm">View Progress</Button>
          )}
          {job.status === 'completed' && job.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm">{job.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArtisanJobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch artisan's assigned jobs
      const myJobsResponse = await jobApi.myJobs();
      const myJobs = myJobsResponse.data?.data || [];

      // Fetch jobs where artisan has applied
      const applicationsResponse = await jobApi.myApplications();
      const applications = applicationsResponse.data?.data || [];

      setJobs(myJobs);
      setAppliedJobs(applications);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Combine all jobs for display
  const allJobs = [...jobs, ...appliedJobs];

  const filteredJobs = allJobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: allJobs.length,
    open: allJobs.filter(j => j.status === 'open').length,
    'in-progress': allJobs.filter(j => j.status === 'in-progress').length,
    completed: allJobs.filter(j => j.status === 'completed').length,
    cancelled: allJobs.filter(j => j.status === 'cancelled').length,
  };

  // Calculate stats from actual jobs data
  const stats = {
    totalJobs: jobs.length,
    inProgressJobs: jobs.filter(j => j.status === 'in-progress').length,
    completionRate: jobs.length > 0 
      ? Math.round((jobs.filter(j => j.status === 'completed').length / jobs.length) * 100)
      : 0,
    averageRating: jobs.filter(j => j.rating).length > 0
      ? (jobs.filter(j => j.rating).reduce((sum, j) => sum + (j.rating || 0), 0) / jobs.filter(j => j.rating).length).toFixed(1)
      : 'N/A',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Management</h1>
        <p className="text-gray-600">Manage your job applications, active projects, and completed work</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error Loading Jobs</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchJobs}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{stats.totalJobs}</h3>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{stats.inProgressJobs}</h3>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{stats.completionRate}%</h3>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{stats.averageRating}</h3>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('-', ' ')} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No jobs match the selected filters'}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArtisanJobManagement;
