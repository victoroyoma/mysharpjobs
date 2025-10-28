import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobApi } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ApplicationCard from '../../components/Job/ApplicationCard';
import { Briefcase, Calendar, DollarSign, MapPin, User } from 'lucide-react';

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
  proposal: string;
  amount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  artisan?: any;
}

const ClientJobView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      showError('Failed to load applications.');
    }
  };

  const handleAccept = async (artisanId: number) => {
    if (!id) return;
    try {
      await jobApi.acceptApplication(Number(id), artisanId);
      showSuccess('Application accepted successfully!');
      fetchApplications(id); // Refresh applications
    } catch (error) {
      showError('Failed to accept application.');
    }
  };

  const handleReject = async (artisanId: number) => {
    if (!id) return;
    try {
      await jobApi.rejectApplication(Number(id), artisanId);
      showSuccess('Application rejected.');
      fetchApplications(id); // Refresh applications
    } catch (error) {
      showError('Failed to reject application.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!job) {
    return <div className="text-center py-10">Job not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-4">
          <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {job.category}</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</div>
          <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> ₦{job.budget.toLocaleString()}</div>
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(job.created_at).toLocaleDateString()}</div>
        </div>
        <p className="text-gray-700">{job.description}</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Applications ({applications.length})</h2>
      
      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => (
            <ApplicationCard 
              key={app.artisan_id} 
              application={app}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No applications received for this job yet.</p>
        </div>
      )}
    </div>
  );
};

export default ClientJobView;
