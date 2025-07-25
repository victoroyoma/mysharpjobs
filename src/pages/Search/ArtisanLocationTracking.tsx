import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  MessageSquareIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  XIcon,
  BriefcaseIcon,
  StarIcon,
  ArrowRightIcon,
  CalendarIcon,
  DollarSignIcon
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for markers
const artisanIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'artisan-marker'
});

const jobIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMTBCOTgxIiBzdHJva2U9IiMwNTk2NjkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: 'job-marker'
});

interface MockJob {
  id: string;
  title: string;
  location: string;
  category: string;
  budget: number;
  status: 'open' | 'in-progress' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeline: string;
  coordinates: [number, number];
  artisan: {
    name: string;
    image: string;
    phone: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
}

const mockJobs: MockJob[] = [
  {
    id: 'job-1',
    title: 'Luxury Kitchen Cabinet Installation',
    location: '123 Victoria Island, Lagos, Nigeria',
    category: 'Carpentry',
    budget: 125000,
    status: 'open',
    priority: 'high',
    timeline: '2-3 days',
    coordinates: [6.4281, 3.4219],
    artisan: {
      name: 'John Carpenter',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 801 234 5678',
      verified: true,
      rating: 4.9,
      reviews: 156
    }
  },
  {
    id: 'job-2',
    title: 'AC Repair & Maintenance',
    location: '45 Garki District, Abuja, Nigeria',
    category: 'HVAC',
    budget: 35000,
    status: 'in-progress',
    priority: 'urgent',
    timeline: '4-6 hours',
    coordinates: [9.0579, 7.4951],
    artisan: {
      name: 'Mike HVAC Expert',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 802 345 6789',
      verified: true,
      rating: 4.7,
      reviews: 203
    }
  },
  {
    id: 'job-3',
    title: 'Bathroom Tile Installation',
    location: '78 New GRA, Port Harcourt, Nigeria',
    category: 'Tiling',
    budget: 75000,
    status: 'scheduled',
    priority: 'medium',
    timeline: '1-2 days',
    coordinates: [4.8156, 7.0498],
    artisan: {
      name: 'David Tiler',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 803 456 7890',
      verified: true,
      rating: 4.8,
      reviews: 189
    }
  },
  {
    id: 'job-4',
    title: 'Electrical Wiring & Panel Upgrade',
    location: '92 Ring Road, Ibadan, Nigeria',
    category: 'Electrical',
    budget: 95000,
    status: 'open',
    priority: 'high',
    timeline: '2-3 days',
    coordinates: [7.3775, 3.9470],
    artisan: {
      name: 'Samuel Electrician',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 804 567 8901',
      verified: true,
      rating: 4.6,
      reviews: 198
    }
  },
  {
    id: 'job-5',
    title: 'Security Gate Fabrication',
    location: '89 Ahmadu Bello Way, Kano, Nigeria',
    category: 'Welding',
    budget: 55000,
    status: 'in-progress',
    priority: 'high',
    timeline: '4-5 hours',
    coordinates: [12.0022, 8.5919],
    artisan: {
      name: 'Ahmed Welder',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 805 678 9012',
      verified: true,
      rating: 4.8,
      reviews: 123
    }
  },
  {
    id: 'job-6',
    title: 'Garden Landscaping Project',
    location: '34 Independence Layout, Enugu, Nigeria',
    category: 'Gardening',
    budget: 85000,
    status: 'scheduled',
    priority: 'medium',
    timeline: '3-4 days',
    coordinates: [6.2649, 7.1480],
    artisan: {
      name: 'Grace Gardener',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 806 789 0123',
      verified: true,
      rating: 4.5,
      reviews: 87
    }
  },
  {
    id: 'job-7',
    title: 'Deep House Cleaning Service',
    location: '56 Awolowo Road, Ikoyi, Lagos, Nigeria',
    category: 'Cleaning',
    budget: 25000,
    status: 'in-progress',
    priority: 'urgent',
    timeline: '4-6 hours',
    coordinates: [6.4474, 3.4539],
    artisan: {
      name: 'Mary Cleaner',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 807 890 1234',
      verified: true,
      rating: 4.9,
      reviews: 245
    }
  },
  {
    id: 'job-8',
    title: 'Roof Repair & Waterproofing',
    location: '12 Government House Road, Abeokuta, Nigeria',
    category: 'Roofing',
    budget: 150000,
    status: 'open',
    priority: 'urgent',
    timeline: '3-5 days',
    coordinates: [7.1475, 3.3619],
    artisan: {
      name: 'Peter Roofer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: '+234 808 901 2345',
      verified: true,
      rating: 4.7,
      reviews: 134
    }
  }
];

// Component to update map center when artisan moves
const MapUpdater: React.FC<{ artisanLocation: [number, number]; jobLocation: [number, number] }> = (_props) => {
  // Using props without destructuring avoids the "unused destructured elements" error
  return null;
};

const ArtisanLocationTracking: React.FC = () => {
  const [showJobList, setShowJobList] = useState(true);
  const [selectedJob, setSelectedJob] = useState<MockJob | null>(null);
  const [status, setStatus] = useState<'assigned' | 'en-route' | 'arrived' | 'in-progress' | 'completed'>('assigned');
  const [artisanLocation, setArtisanLocation] = useState<[number, number]>([6.4281, 3.4219]);
  const [jobLocation, setJobLocation] = useState<[number, number]>([6.4531, 3.3958]);
  const [distance, setDistance] = useState(5.2);
  const [eta, setEta] = useState(15);

  const startJobTracking = (job: MockJob) => {
    setSelectedJob(job);
    setShowJobList(false);
    setJobLocation(job.coordinates);
    setArtisanLocation([job.coordinates[0] + 0.01, job.coordinates[1] + 0.01]); // Start nearby
    setStatus('assigned');
    setDistance(1.5);
    setEta(8);
  };

  // Simulate real-time location updates
  useEffect(() => {
    if (!selectedJob || status === 'completed') return;

    const interval = setInterval(() => {
      if (status === 'assigned') {
        setStatus('en-route');
      } else if (status === 'en-route') {
        setArtisanLocation(prev => {
          const newLat = prev[0] + (jobLocation[0] - prev[0]) * 0.1;
          const newLng = prev[1] + (jobLocation[1] - prev[1]) * 0.1;
          const newDistance = Math.sqrt(Math.pow(jobLocation[0] - newLat, 2) + Math.pow(jobLocation[1] - newLng, 2)) * 111; // Rough km conversion
          setDistance(newDistance);
          setEta(Math.max(1, Math.round(newDistance * 60 / 30))); // Assuming 30 km/h average speed
          
          if (newDistance < 0.1) {
            setStatus('arrived');
          }
          
          return [newLat, newLng];
        });
      } else if (status === 'arrived') {
        setTimeout(() => setStatus('in-progress'), 2000);
      }
    }, 3000); // Update every 3 seconds for demo

    return () => clearInterval(interval);
  }, [status, jobLocation, selectedJob]);

  const getStatusColor = () => {
    switch (status) {
      case 'assigned': return 'border-yellow-300 bg-yellow-50 text-yellow-800';
      case 'en-route': return 'border-blue-300 bg-blue-50 text-blue-800';
      case 'arrived': return 'border-green-300 bg-green-50 text-green-800';
      case 'in-progress': return 'border-purple-300 bg-purple-50 text-purple-800';
      case 'completed': return 'border-gray-300 bg-gray-50 text-gray-800';
      default: return 'border-gray-300 bg-gray-50 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'assigned': return 'Job Assigned';
      case 'en-route': return 'Artisan En Route';
      case 'arrived': return 'Artisan Arrived';
      case 'in-progress': return 'Work in Progress';
      case 'completed': return 'Job Completed';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="min-h-[calc(100vh-200px)]">
          {showJobList ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Available Jobs for Demo
                </h1>
                <p className="text-lg text-gray-600">
                  Click on any job card to start the real-time tracking simulation
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockJobs.map((job) => (
                  <div 
                    key={job.id}
                    onClick={() => startJobTracking(job)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.priority === 'urgent' 
                            ? 'bg-red-100 text-red-800' 
                            : job.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          job.status === 'open' 
                            ? 'bg-blue-100 text-blue-800'
                            : job.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Job Title & Category */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </div>

                      {/* Budget & Timing */}
                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center text-green-600">
                          <DollarSignIcon className="h-4 w-4 mr-1" />
                          <span className="font-medium">₦{job.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{job.timeline}</span>
                        </div>
                      </div>

                      {/* Artisan Info */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={job.artisan.image} 
                              alt={job.artisan.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">{job.artisan.name}</p>
                              <div className="flex items-center">
                                <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">{job.artisan.rating}</span>
                                <span className="text-xs text-gray-500 ml-1">({job.artisan.reviews})</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Select any job above to start the real-time tracking demonstration
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button 
                  onClick={() => setShowJobList(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  ← Back to job listings
                </button>
              </div>

              {/* Job Header */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                <div className="bg-blue-600 p-4 md:p-6 text-white">
                  <h1 className="text-xl md:text-2xl font-bold">{selectedJob?.title}</h1>
                  <div className="flex items-center mt-2 text-blue-100">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <p className="text-sm">{selectedJob?.location}</p>
                  </div>
                </div>
                
                {/* Artisan Info */}
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img className="h-12 w-12 rounded-full" src={selectedJob?.artisan.image} alt={selectedJob?.artisan.name} />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h2 className="text-lg font-medium text-gray-900">{selectedJob?.artisan.name}</h2>
                          {selectedJob?.artisan.verified && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <a href={`tel:${selectedJob?.artisan.phone}`} aria-label="Call artisan">
                        <Button variant="secondary" size="sm">
                          <PhoneIcon className="h-4 w-4" />
                        </Button>
                      </a>
                      <Link to="/messages" aria-label="Message artisan">
                        <Button variant="primary" size="sm">
                          <MessageSquareIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                        {getStatusText()}
                      </span>
                    </div>
                    {status === 'en-route' && (
                      <div className="text-sm text-gray-600 flex items-center" aria-live="polite">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <span>ETA: {eta} minutes • {distance.toFixed(1)} km away</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time Map */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 relative h-[400px] md:h-[500px]">
                <div className="h-full w-full z-10 relative">
                  <MapContainer 
                    center={[(artisanLocation[0] + jobLocation[0]) / 2, (artisanLocation[1] + jobLocation[1]) / 2]} 
                    zoom={14} 
                    style={{ height: '100%', width: '100%' }} 
                    attributionControl={false} 
                    zoomControl={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {/* Job location marker (green pin) */}
                    <Marker position={jobLocation} icon={jobIcon}>
                      <Popup>
                        <div className="text-center">
                          <div className="font-medium">Job Site</div>
                          <div className="text-sm text-gray-600">{selectedJob?.location}</div>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Artisan location marker (blue pin, updated every 10 seconds) */}
                    <Marker position={artisanLocation} icon={artisanIcon}>
                      <Popup>
                        <div className="text-center">
                          <img src={selectedJob?.artisan.image} alt={selectedJob?.artisan.name} className="h-10 w-10 rounded-full mx-auto mb-2" />
                          <div className="font-medium">{selectedJob?.artisan.name}</div>
                          <div className="text-xs text-gray-500">{distance.toFixed(1)} km away</div>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Line connecting artisan and job location */}
                    <Polyline 
                      positions={[artisanLocation, jobLocation]} 
                      color="#1E88E5" 
                      weight={4} 
                      opacity={0.7} 
                      dashArray="10, 10" 
                    />
                    
                    <MapUpdater artisanLocation={artisanLocation} jobLocation={jobLocation} />
                  </MapContainer>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {status === 'completed' ? (
                    <div className="text-center w-full">
                      <div className="text-green-600 mb-4">
                        <CheckCircleIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-medium">Job Completed Successfully!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="success" 
                        fullWidth
                        onClick={() => setStatus('completed')}
                        className="sm:flex-1"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </Button>
                      <Button 
                        variant="danger" 
                        fullWidth
                        className="sm:flex-1"
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        Cancel Job
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Emergency Contact */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <AlertCircleIcon className="h-4 w-4 mr-1" />
                    <span>Need help? Contact support: </span>
                    <a href="tel:+2348000000000" className="text-blue-600 hover:text-blue-800 ml-1">
                      +234 800 000 0000
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtisanLocationTracking;
