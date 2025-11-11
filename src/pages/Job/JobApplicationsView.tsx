import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { jobApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Mail, 
  Phone, 
  Star, 
  CheckCircle, 
  XCircle,
  Clock,
  Award,
  Briefcase as BriefcaseIcon,
  ArrowLeft
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  client: {
    name: string;
  };
  created_at: string;
}

interface Application {
  artisan_id: number;
  artisan_name: string;
  artisan_email: string;
  artisan_phone: string;
  artisan_avatar: string;
  artisan_bio: string;
  artisan_skills: string[];
  artisan_experience: string;
  artisan_rating: number;
  artisan_review_count: number;
  artisan_completed_jobs: number;
  artisan_hourly_rate: number;
  artisan_location: string;
  artisan_portfolio_images: string[];
  proposal: string;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
}

const JobApplicationsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
      fetchApplications(id);
    }
  }, [id]);

  const fetchJobDetails = async (jobId: string) => {
    try {
      const response = await jobApi.getJobById(Number(jobId));
      if (response.data.status === 'success') {
        setJob(response.data.data.job);
      }
    } catch (error) {
      showError('Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      const response = await jobApi.getApplications(Number(jobId));
      if (response.data.status === 'success') {
        setApplications(response.data.data.applications);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to load applications.');
    }
  };

  const handleAccept = async (artisanId: number) => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to accept this application? This will reject all other applications and mark the job as in-progress.')) {
      return;
    }

    setProcessingId(artisanId);
    try {
      const response = await jobApi.acceptApplication(Number(id), artisanId);
      if (response.data.status === 'success') {
        showSuccess('Application accepted successfully! The job is now in progress.');
        // Refresh data
        await fetchJobDetails(id);
        await fetchApplications(id);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to accept application.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (artisanId: number) => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    setProcessingId(artisanId);
    try {
      await jobApi.rejectApplication(Number(id), artisanId);
      showSuccess('Application rejected.');
      fetchApplications(id); // Refresh applications
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to reject application.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Button onClick={() => navigate('/client/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        </div>

        {/* Job Details Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {job.category}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {formatPrice(job.budget)}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {job.status === 'in-progress' ? 'In Progress' : 
                 job.status === 'completed' ? 'Completed' :
                 job.status === 'cancelled' ? 'Cancelled' :
                 'Open'}
              </span>
            </div>
          </div>
        </div>

        {/* Applications Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Applications Received ({applications.length})
          </h2>
          {job.status === 'in-progress' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Job assigned - Application accepted
              </p>
            </div>
          )}
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((app) => (
              <div 
                key={app.artisan_id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
                  app.status === 'accepted' ? 'ring-2 ring-green-500' :
                  app.status === 'rejected' ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  {/* Artisan Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {app.artisan_avatar ? (
                          <img src={app.artisan_avatar} alt={app.artisan_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          app.artisan_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      {/* Artisan Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{app.artisan_name}</h3>
                          {app.status === 'accepted' && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accepted
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </span>
                          )}
                          {app.status === 'pending' && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-medium">{app.artisan_rating || 0}</span>
                            <span className="ml-1">({app.artisan_review_count || 0} reviews)</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-green-600 mr-1" />
                            <span>{app.artisan_completed_jobs || 0} completed jobs</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-blue-600 mr-1" />
                            <span className="font-medium">{formatPrice(app.artisan_hourly_rate || 0)}/hr</span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {app.artisan_email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {app.artisan_phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {app.artisan_location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {app.artisan_bio && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                      <p className="text-gray-700 text-sm">{app.artisan_bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {app.artisan_skills && app.artisan_skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {app.artisan_skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Proposal */}
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Proposal</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        Est. Duration: <span className="font-medium ml-1">{app.estimated_duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{app.proposal}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied on {new Date(app.applied_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  {job.status === 'open' && app.status === 'pending' && (
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                      <Button
                        variant="secondary"
                        onClick={() => handleReject(app.artisan_id)}
                        disabled={processingId === app.artisan_id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleAccept(app.artisan_id)}
                        disabled={processingId === app.artisan_id}
                      >
                        {processingId === app.artisan_id ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept & Assign Job
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 mb-6">
              No artisans have applied for this job yet. Check back later!
            </p>
            <Button onClick={() => navigate('/client/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsView;
