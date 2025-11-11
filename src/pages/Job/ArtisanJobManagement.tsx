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
  Briefcase,
  X,
  Eye,
  Send,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/Button';
import ArtisanLayout from '../../components/Layout/ArtisanLayout';
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
    phone?: string;
  };
  rating?: number;
  my_application?: any;
}

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, onApply }) => {
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

  const hasApplied = job.my_application !== undefined;

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
          {hasApplied && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              Applied
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
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onViewDetails(job)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          {job.status === 'open' && !hasApplied && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onApply(job)}
            >
              <Send className="w-4 h-4 mr-1" />
              Apply
            </Button>
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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    proposal: '',
    estimatedDuration: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all available jobs (don't filter by status here - let backend handle it)
      const allJobsResponse = await jobApi.getJobs();
      console.log('All jobs response:', allJobsResponse);
      
      // Handle different response structures (paginated or direct array)
      let availableJobs = [];
      if (allJobsResponse.data?.data) {
        // Paginated response
        availableJobs = allJobsResponse.data.data;
      } else if (Array.isArray(allJobsResponse.data)) {
        // Direct array response
        availableJobs = allJobsResponse.data;
      }

      // Fetch jobs where artisan has applied (this endpoint requires authentication)
      let applications = [];
      try {
        const applicationsResponse = await jobApi.myApplications();
        console.log('Applications response:', applicationsResponse);
        applications = applicationsResponse.data?.applications || applicationsResponse.data?.data || [];
      } catch (appErr: any) {
        console.warn('Could not fetch applications:', appErr);
        // Don't fail the entire fetch if applications can't be loaded
      }

      setJobs(Array.isArray(availableJobs) ? availableJobs : []);
      setAppliedJobs(Array.isArray(applications) ? applications : []);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      console.error('Error details:', err.response);
      setError(err.response?.data?.message || 'Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    setApplicationData({ proposal: '', estimatedDuration: '' });
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowApplicationModal(false);
    setSelectedJob(null);
    setApplicationData({ proposal: '', estimatedDuration: '' });
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    
    if (!applicationData.proposal.trim()) {
      setSubmitError('Please provide a proposal');
      return;
    }
    
    if (applicationData.proposal.trim().length < 20) {
      setSubmitError('Proposal must be at least 20 characters long');
      return;
    }
    
    if (!applicationData.estimatedDuration.trim()) {
      setSubmitError('Please provide an estimated duration');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      console.log('Submitting application with data:', {
        jobId: selectedJob.id,
        proposal: applicationData.proposal,
        estimatedDuration: applicationData.estimatedDuration,
      });
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      if (!token) {
        setSubmitError('You must be logged in to apply for jobs. Please log in and try again.');
        return;
      }
      
      const response = await jobApi.applyToJob(selectedJob.id, {
        proposal: applicationData.proposal,
        estimatedDuration: applicationData.estimatedDuration,
      });
      
      console.log('Application response:', response);
      
      setSubmitSuccess(true);
      
      // Refresh jobs list
      setTimeout(() => {
        fetchJobs();
        handleCloseModals();
      }, 2000);
      
    } catch (err: any) {
      console.error('Error applying to job:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      // Show detailed error message
      let errorMessage = 'Failed to submit application. Please try again.';
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log out and log back in to continue.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errorMessage = errors.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
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
    <ArtisanLayout>
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
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onViewDetails={handleViewDetails}
                  onApply={handleApply}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Job Header */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedJob.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedJob.status}
                  </span>
                  {selectedJob.priority && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      {selectedJob.priority} priority
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {selectedJob.category}
                  </span>
                </div>
              </div>

              {/* Budget & Duration */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget</p>
                  <p className="text-2xl font-bold text-green-600">₦{selectedJob.budget.toLocaleString()}</p>
                </div>
                {selectedJob.estimated_duration && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedJob.estimated_duration}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {/* Location & Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <p className="text-gray-700">{selectedJob.location}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Client</h4>
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">{selectedJob.client?.name}</p>
                      {selectedJob.client?.phone && (
                        <p className="text-sm text-gray-600">{selectedJob.client.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              {selectedJob.required_skills && selectedJob.required_skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Posted Date */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Posted</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <p className="text-gray-700">
                    {new Date(selectedJob.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedJob.status === 'open' && !selectedJob.my_application && (
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApply(selectedJob);
                    }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Apply for this Job
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Apply for Job</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Job Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedJob.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Budget: ₦{selectedJob.budget.toLocaleString()}</span>
                  <span>•</span>
                  <span>{selectedJob.location}</span>
                </div>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Application Submitted!</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your application has been sent to the client. They will review your profile and proposal.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Error</h4>
                    <p className="text-sm text-red-700 mt-1">{submitError}</p>
                  </div>
                </div>
              )}

              {!submitSuccess && (
                <>
                  {/* Application Form */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Your Proposal *
                      </label>
                      <span className={`text-xs ${applicationData.proposal.length < 20 ? 'text-red-600' : 'text-gray-500'}`}>
                        {applicationData.proposal.length} / 20 min
                      </span>
                    </div>
                    <textarea
                      value={applicationData.proposal}
                      onChange={(e) => setApplicationData({ ...applicationData, proposal: e.target.value })}
                      placeholder="Explain why you're the best fit for this job, your relevant experience, and your approach to completing the work..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={submitting}
                    />
                    {applicationData.proposal.length > 0 && applicationData.proposal.length < 20 && (
                      <p className="text-xs text-red-600 mt-1">
                        Proposal must be at least 20 characters long
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Duration *
                    </label>
                    <input
                      type="text"
                      value={applicationData.estimatedDuration}
                      onChange={(e) => setApplicationData({ ...applicationData, estimatedDuration: e.target.value })}
                      placeholder="e.g., 3-5 days, 1 week, 2 weeks"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={submitting}
                    />
                  </div>

                  {/* Info Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your complete profile information, including your skills, experience, 
                      portfolio, and ratings will be automatically shared with the client when you submit this application.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={handleCloseModals}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleSubmitApplication}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanJobManagement;
