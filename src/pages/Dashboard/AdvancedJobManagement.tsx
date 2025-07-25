import { useState } from 'react';

// Type for progress photo
type ProgressPhoto = { url: string };
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  DollarSignIcon,
  FilterIcon,
  SearchIcon,
  SortAscIcon
} from 'lucide-react';
import Button from '../../components/Button';
import { Job } from '../../data/mockData';

interface JobTrackingProps {
  job: Job;
  artisan?: any;
}

const JobTrackingCard: React.FC<JobTrackingProps> = ({ job, artisan }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);

  // Dummy photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => ({ url: URL.createObjectURL(file) }));
      setProgressPhotos(prev => [...prev, ...newPhotos]);
      setActionFeedback({ type: 'success', message: 'Photos uploaded!' });
      setTimeout(() => setActionFeedback(null), 2000);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
              {job.status === 'in-progress' ? 'In Progress' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
            {job.priority === 'urgent' && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                <AlertTriangleIcon className="w-3 h-3 mr-1" />
                URGENT
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-3">{job.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <DollarSignIcon className="w-4 h-4 mr-2" />
              <span>{formatPrice(job.budget)}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>{job.deadline}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <Button size="sm" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'View Details'}
          </Button>
          {job.status === 'in-progress' && artisan && (
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" onClick={() => setShowChat(true)}>
                <MessageCircleIcon className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowCall(true)}>
                <PhoneIcon className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          )}
          {/* Feedback for actions */}
          {actionFeedback && (
            <div className={`mt-2 text-sm text-center ${actionFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{actionFeedback.message}</div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Progress */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Progress Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Job Posted</p>
                    <p className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Artisan Info Card */}
            {artisan && (
              <div className="bg-gray-50 rounded-lg p-4 shadow">
                <h4 className="font-medium text-gray-900 mb-3">Assigned Artisan</h4>
                <div className="flex items-center space-x-4">
                  <img src={artisan.avatarUrl} alt={artisan.name} className="w-12 h-12 rounded-full border" />
                  <div>
                    <p className="font-semibold text-gray-900">{artisan.name}</p>
                    <p className="text-xs text-gray-500">Verified <span className="text-green-600">✔</span></p>
                    <p className="text-xs text-yellow-600">Rating: {artisan.rating} ⭐</p>
                    <p className="text-xs text-gray-500">Contact: {artisan.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Job Photos/Updates */}
          {job.status === 'in-progress' && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Upload Progress Photos</h4>
              <input type="file" multiple accept="image/*" className="mb-2" onChange={handlePhotoUpload} />
              <div className="flex flex-wrap gap-2">
                {progressPhotos.map((photo, idx) => (
                  <img key={idx} src={photo.url} alt={`Progress ${idx + 1}`} className="w-20 h-20 object-cover rounded border" />
                ))}
              </div>
            </div>
          )}
          {/* Dummy Chat/Call UI */}
          {showChat && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h4 className="font-semibold mb-2">Chat with Artisan</h4>
                <div className="border rounded p-2 h-32 mb-2 overflow-y-auto">Demo chat window...</div>
                <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Type a message..." />
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => setShowChat(false)}>Close</Button>
                  <Button size="sm" variant="primary">Send</Button>
                </div>
              </div>
            </div>
          )}
          {showCall && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
                <h4 className="font-semibold mb-2">Calling Artisan...</h4>
                <PhoneIcon className="w-10 h-10 mx-auto text-blue-600 mb-4 animate-pulse" />
                <Button size="sm" onClick={() => setShowCall(false)}>End Call</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
  
  // Main Dashboard Component
  const AdvancedJobManagement: React.FC = () => {
    // Dummy jobs data
    const jobs: Job[] = [
      {
        id: '1',
        title: 'Plumbing Repair',
        description: 'Fix leaking kitchen sink',
        budget: 15000,
        location: 'Lagos',
        createdAt: new Date().toISOString(),
        deadline: '2024-07-01',
        status: 'in-progress',
        priority: 'urgent',
        category: 'Plumbing',
        clientId: 'client-1',
        requirements: ['Pipe replacement', 'Leak fixing'],
        applicants: [],
      },
      {
        id: '2',
        title: 'Electrical Wiring',
        description: 'Install new wiring in living room',
        budget: 25000,
        location: 'Abuja',
        createdAt: new Date().toISOString(),
        deadline: '2024-07-10',
        status: 'open',
        priority: 'medium',
        category: 'Electrical',
        clientId: 'client-2',
        requirements: ['Wiring', 'Safety check'],
        applicants: [],
      },
      {
        id: '3',
        title: 'Painting',
        description: 'Paint the exterior walls',
        budget: 30000,
        location: 'Port Harcourt',
        createdAt: new Date().toISOString(),
        deadline: '2024-07-15',
        status: 'completed',
        priority: 'medium',
        category: 'Painting',
        clientId: 'client-3',
        requirements: ['Exterior paint', 'Scaffolding'],
        applicants: [],
      },
    ];
  
    // Dummy artisan data
    const artisan = {
      name: 'John Doe',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      phone: '08012345678',
    };
  
    // State for dashboard stats
    const jobStats = {
      active: jobs.filter(j => j.status === 'in-progress').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      pending: jobs.filter(j => j.status === 'open').length,
      totalSpent: jobs.reduce((sum, j) => sum + (j.status === 'completed' ? j.budget : 0), 0),
    };
  
    // State for filters and search
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [searchTerm, setSearchTerm] = useState('');
  
    // Filter and sort jobs
    let filteredJobs = jobs.filter(job => {
      if (filterStatus !== 'all' && job.status !== filterStatus) return false;
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  
    let sortedJobs = [...filteredJobs];
    if (sortBy === 'recent') {
      sortedJobs.sort((a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'budget') {
      sortedJobs.sort((a: Job, b: Job) => b.budget - a.budget);
    } else if (sortBy === 'status') {
      sortedJobs.sort((a: Job, b: Job) => a.status.localeCompare(b.status));
    }
  
    return (
      <div className="space-y-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-900">{jobStats.active}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{jobStats.completed}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{jobStats.pending}</p>
              </div>
              <AlertTriangleIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 0,
                  }).format(jobStats.totalSpent)}
                </p>
              </div>
              <DollarSignIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
  
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <SortAscIcon className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="budget">Highest Budget</option>
                  <option value="status">By Status</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SearchIcon className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
              />
            </div>
          </div>
        </div>
  
        {/* Jobs List */}
        <div className="space-y-6">
          {sortedJobs.map(job => (
            <JobTrackingCard key={job.id} job={job} artisan={artisan} />
          ))}
        </div>
      </div>
    );
  };
  
  export default AdvancedJobManagement;
