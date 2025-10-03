import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { jobApi } from '../../utils/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Subscribe to real-time job updates
  useWebSocket(user?.id ? Number(user.id) : null, {
    onJobUpdated: (data) => {
      if (data.job_id === Number(id)) {
        console.log('Job updated in real-time:', data);
        setJob((prev: any) => ({ ...prev, ...data }));
      }
    }
  });

  useEffect(() => {
    if (id) {
      fetchJob();
      fetchApplications();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobApi.getJobById(Number(id));
      setJob(response.data);
    } catch (error: any) {
      console.error('Failed to fetch job:', error);
      alert('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await jobApi.getApplications(Number(id));
      setApplications(response.data);
    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleApplyForJob = async () => {
    if (!user) {
      alert('Please login to apply for jobs');
      navigate('/auth/login');
      return;
    }

    try {
      setSubmitting(true);
      await jobApi.applyToJob(Number(id), {
        proposal: 'I am interested in this job and have the required skills.',
        estimatedDuration: job.estimated_duration || '1-2 days'
      });
      alert('Application submitted successfully!');
      fetchApplications();
    } catch (error: any) {
      console.error('Failed to apply for job:', error);
      alert(error.message || 'Failed to apply for job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptApplication = async (applicationId: number) => {
    try {
      setSubmitting(true);
      await jobApi.acceptApplication(Number(id), applicationId);
      alert('Application accepted!');
      fetchJob();
      fetchApplications();
    } catch (error: any) {
      console.error('Failed to accept application:', error);
      alert(error.message || 'Failed to accept application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteJob = async () => {
    try {
      setSubmitting(true);
      await jobApi.completeJob(Number(id));
      alert('Job marked as complete!');
      fetchJob();
    } catch (error: any) {
      console.error('Failed to complete job:', error);
      alert(error.message || 'Failed to complete job');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Job not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const userType = (user as any)?.user_type || 'client';
  const isOwner = user?.id === job.client_id;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link 
              to={userType === 'client' ? '/client/dashboard' : '/artisan/dashboard'} 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              ← Back to dashboard
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  job.status === 'open' ? 'bg-green-100 text-green-800' :
                  job.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                  job.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {job.estimated_duration || 'Duration not specified'}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {job.location}
                </div>
              </div>              {/* Job Location Map */}
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Job Location
                </h2>
                <div 
                  className="h-[200px] rounded-lg overflow-hidden relative" 
                  style={{
                    backgroundColor: '#f0f4f8',
                    backgroundImage: 'linear-gradient(to right, #e6f0fd 1px, transparent 1px), linear-gradient(to bottom, #e6f0fd 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Map view of job location</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Job Description
                </h2>
                <p className="text-gray-600">
                  {job.description}
                </p>
              </div>

              {/* Job Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Job Details
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Budget:</span>
                      <span>₦{job.budget?.toLocaleString()}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Category:</span>
                      <span className="capitalize">{job.category}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Urgency:</span>
                      <span className="capitalize">{job.urgency || 'Normal'}</span>
                    </li>
                    {job.estimated_duration && (
                      <li className="flex items-center">
                        <span className="font-medium mr-2">Duration:</span>
                        <span>{job.estimated_duration}</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Client Information
                  </h3>
                  <div className="flex items-center">
                    <img 
                      className="h-10 w-10 rounded-full mr-3" 
                      src={job.client?.avatar || 'https://via.placeholder.com/40'} 
                      alt="Client" 
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.client?.name || 'Unknown Client'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Member since {job.client?.created_at ? new Date(job.client.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications Section (for job owners) */}
              {isOwner && applications.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Applications ({applications.length})
                  </h3>
                  <div className="space-y-3">
                    {applications.map((application: any) => (
                      <div key={application.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full mr-3" 
                            src={application.artisan?.avatar || 'https://via.placeholder.com/40'} 
                            alt={application.artisan?.name} 
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {application.artisan?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Applied {new Date(application.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {application.status === 'pending' && (
                          <Button 
                            variant="primary" 
                            onClick={() => handleAcceptApplication(application.id)}
                            disabled={submitting}
                          >
                            {submitting ? 'Accepting...' : 'Accept'}
                          </Button>
                        )}
                        {application.status === 'accepted' && (
                          <span className="text-green-600 text-sm font-medium">Accepted</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {userType === 'artisan' && !isOwner ? (
                  <>
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={handleApplyForJob}
                      disabled={submitting || job.status !== 'open'}
                    >
                      {submitting ? 'Applying...' : job.status === 'open' ? 'Apply for This Job' : 'Not Available'}
                    </Button>
                    <Button variant="secondary" fullWidth>
                      Save Job
                    </Button>
                  </>
                ) : isOwner ? (
                  <>
                    {job.status === 'in_progress' && (
                      <Button 
                        variant="primary" 
                        fullWidth 
                        onClick={handleCompleteJob}
                        disabled={submitting}
                      >
                        {submitting ? 'Completing...' : 'Mark as Complete'}
                      </Button>
                    )}
                    <Link to={`/messages?user=${job.artisan_id}`}>
                      <Button variant="secondary" fullWidth>
                        Message Artisan
                      </Button>
                    </Link>
                    {job.artisan_id && (
                      <Link to={`/job/${id}/track`}>
                        <Button variant="secondary" fullWidth>
                          Track Artisan
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    You can only view this job
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
