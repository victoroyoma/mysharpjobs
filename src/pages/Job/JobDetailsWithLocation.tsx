import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPinIcon, 
  PhoneIcon, 
  MessageSquareIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  CalendarIcon,
  DollarSignIcon,
  ShareIcon,
  EyeOffIcon,
  SettingsIcon,
  AlertCircleIcon,
  StarIcon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Custom icon for job location
const jobIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function JobDetailsWithLocation() {
  const { id } = useParams();
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(true);
  const [preciseLocationSharing, setPreciseLocationSharing] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);

  // Mock job data
  const jobData = {
    id: id || '1',
    title: 'Kitchen Cabinet Installation',
    description: 'Install 8 custom kitchen cabinets with soft-close hinges and drawer slides. Includes upper and lower cabinets with crown molding.',
    client: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b812292?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 4.8,
      phone: '+234 801 234 5678',
      verified: true
    },
    location: {
      address: '123 Main Street, Warri, Nigeria',
      coordinates: [6.5244, 3.3792] as [number, number]
    },
    price: '₦85,000',
    timeline: '2-3 days',
    scheduledDate: '2024-01-20',
    status: 'pending', // 'pending', 'accepted', 'in-progress', 'completed'
    requirements: [
      'Bring own tools and equipment',
      'Work to be completed during business hours (8 AM - 6 PM)',
      'Clean up work area after completion',
      'Provide 1-year warranty on installation'
    ],
    skills: ['Carpentry', 'Cabinet Installation', 'Woodworking']
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              ← Back to jobs
            </Link>
          </div>

          {/* Job Header */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="bg-blue-600 p-4 md:p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold mb-2">{jobData.title}</h1>
                  <div className="flex items-center text-blue-100">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <p className="text-sm">{jobData.location.address}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-2xl font-bold">{jobData.price}</div>
                  <div className="text-blue-100 text-sm">{jobData.timeline}</div>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Pending Response
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Scheduled: {new Date(jobData.scheduledDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src={jobData.client.image} alt={jobData.client.name} />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-gray-900">{jobData.client.name}</h2>
                      {jobData.client.verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{jobData.client.rating} rating</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a href={`tel:${jobData.client.phone}`} aria-label="Call client">
                    <Button variant="secondary" size="sm">
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/messages" aria-label="Message client">
                    <Button variant="primary" size="sm">
                      <MessageSquareIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Job Location Map - 200px height as specified */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Job Location</h3>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowLocationSettings(!showLocationSettings)}
                >
                  <SettingsIcon className="h-4 w-4 mr-1" />
                  Location Settings
                </Button>
              </div>
              
              {/* Location Sharing Controls - Toggle */}
              {showLocationSettings && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Share your location with client</h4>
                        <p className="text-xs text-gray-600">Allow client to track your progress to the job site</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={locationSharingEnabled}
                          onChange={(e) => setLocationSharingEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Precise location sharing</h4>
                        <p className="text-xs text-gray-600">Share exact GPS coordinates instead of approximate location</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preciseLocationSharing && locationSharingEnabled}
                          onChange={(e) => setPreciseLocationSharing(e.target.checked)}
                          disabled={!locationSharingEnabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                  </div>
                  
                  {!locationSharingEnabled && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircleIcon className="h-4 w-4 text-yellow-600 mr-2" />
                        <p className="text-xs text-yellow-800">
                          Location sharing is disabled. The client won't be able to track your progress.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Small Map - 200px height */}
            <div 
              className="h-[200px] w-full relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.24.19 1.64.39 1.84.39.78 0 1.76-.48 2.54-.65.46-.08 1.13.53 1.67.64.95.13 1.55-.53 2.28-.56.42-.01.8.16 1.26.33.37.13.77.33 1.22.3.45-.03.85-.35 1.25-.34.34.01.62.2.92.3.42.12.75-.13 1.07-.13.37 0 .72.3 1.07.28.39-.02.65-.32 1.03-.28.42.04.64.27 1.03.27.5 0 .8-.29 1.28-.3.4-.01.76.17 1.14.25.36.07.76.17 1.14.17.36 0 .7-.08 1.03-.17.36-.1.68-.18 1.16-.2.42-.01.75.18 1.1.19.63.01 1-.43 1.57-.5.4-.05.77.2 1.18.15.29-.04.58-.15.85-.23.57-.16 1.13-.3 1.68-.46.57-.16 1.13-.34 1.7-.46.5-.1 1.1-.34 1.62-.3.29.02.47.15.72.14.77-.04 1.46-.55 2.22-.53.86.03 1.72.38 2.6.48.79.09 1.62.04 2.36-.22.55-.19.98-.42 1.59-.5.3-.04.64.04.96.09.29.04.58.07.89.05.22-.02.4-.09.59-.15.4-.12.8-.3 1.2-.41.1-.03.21-.05.3-.1.38-.21.75-.46 1.22-.5.47-.03.93.12 1.37.17.34.04.68.05 1.01.08.84.1 1.72.14 2.62.25.37.05.72.16 1.1.15.45-.01.82-.26 1.29-.23.47.02.89.27 1.36.24.32-.02.6-.13.84-.27.67-.36 1.39-.64 1.9-1.19.22-.23.51-.4.79-.58.36-.21.72-.34 1.1-.49.66-.27 1.28-.48 1.95-.77.35-.16.7-.33 1.05-.48.2-.09.38-.21.58-.29.28-.12.58-.19.87-.31.19-.08.35-.19.55-.27.59-.24 1.21-.43 1.82-.64.18-.07.38-.13.55-.22.35-.18.64-.43 1.02-.59.18-.08.38-.11.58-.17.35-.11.67-.32 1.04-.36.29-.03.61.02.91.01.29-.01.6-.08.89-.08.33.01.65.04.98.08.21.02.43.05.64.09.91.17 1.83.32 2.63.3.52-.01 1.05-.13 1.58-.12.28 0 .55.05.82.1.23.05.45.11.68.11.24 0 .46-.09.7-.09.2 0 .4.05.6.11.4.12.85.09 1.26.17.29.06.54.21.82.29.5.14 1.08.11 1.62.16.19.02.4.08.58.11.22.04.43.02.64.05.41.06.85.12 1.27.13.47.01.92-.08 1.39-.04.33.02.65.11.98.12.38.01.76-.1 1.15-.05.26.03.5.15.76.16.34.01.66-.11 1-.1.31.01.61.1.93.12.67.04 1.32-.13 1.97-.1.36.02.71.1 1.07.11.32.01.61-.05.92-.01.36.06.69.18 1.08.14.58-.06 1.1-.35 1.71-.28.35.04.7.12 1.04.13.46.01.9-.1 1.36-.09.33.01.65.04.98.08.5.06 1.03.04 1.55.08.31.02.61.05.93.05.36-.01.72-.06 1.07-.14.2-.05.42-.14.63-.14.28 0 .55.1.83.1.32 0 .65-.1.96-.1.24 0 .47.06.71.1.47.08.93.02 1.4.1.35.06.72.09 1.07.16.2.04.36.16.56.14.67-.07 1.32-.19 1.97-.35.36-.09.74-.14 1.1-.23.44-.11.86-.27 1.31-.34.32-.05.64-.05.96-.13.19-.05.39-.1.58-.15.82-.22 1.65-.43 2.47-.66.27-.08.53-.18.8-.22.04-.01.09-.01.13-.02.59-.17 1.18-.34 1.76-.52.04-.01.09-.01.14-.02.25-.06.51-.1.76-.16.17-.04.32-.12.49-.15.84-.15 1.68-.32 2.52-.48.26-.05.53-.07.79-.13.2-.04.38-.12.58-.15.28-.04.56-.02.84-.05.06-.01.12-.02.18-.02.25-.03.51-.05.76-.09.13-.02.26-.06.39-.08.32-.04.65-.03.96-.1.42-.1.85-.2 1.29-.15.56.07 1.07.26 1.64.27.58.01 1.13-.15 1.7-.12.42.02.84.19 1.28.16.93-.06 1.84-.21 2.74-.46.21-.06.41-.15.62-.19.41-.08.81-.01 1.22-.1.24-.05.47-.14.72-.17.41-.05.84.02 1.25-.04.1-.01.2-.05.31-.05.52-.02 1.04.08 1.56.08.53-.01 1.04-.15 1.56-.12.35.02.7.1 1.05.11.25.01.49-.04.74-.05.36-.02.71.03 1.07.03.31 0 .62-.04.92-.1.17-.03.32-.1.49-.11.45-.03.92.12 1.38.11.62-.01 1.21-.19 1.82-.11.34.05.66.2 1.02.18.25-.01.49-.1.74-.11.42-.01.85.11 1.28.1.84-.03 1.65-.36 2.5-.3.35.03.7.11 1.04.19.24.06.47.16.72.19.64.08 1.28-.01 1.92 0 .29 0 .57.05.86.08.25.02.5.09.76.04.2-.04.36-.16.56-.18.67-.07 1.32.18 1.99.14.38-.02.76-.15 1.14-.13.28.01.55.09.83.12.49.05.97.14 1.46.09.12-.01.25 0 .37-.03.15-.03.27-.13.43-.14.34-.01.67.1 1.01.09.85-.03 1.71-.22 2.56-.14.38.03.75.17 1.13.16.45-.01.91-.13 1.36-.09.32.03.62.18.94.15.32-.03.61-.17.92-.18.36-.01.72.09 1.08.08.31-.01.62-.1.92-.05.47.07.89.32 1.38.28.32-.03.65-.1.96-.2.72-.23 1.41-.42 2.2-.36.35.03.68.14 1.02.19.25.04.52.01.78.06.36.07.7.2 1.07.2.45 0 .8-.25 1.24-.17.29.05.53.2.8.24.38.06.76 0 1.14.05.61.08 1.21.19 1.84.19.74.01 1.45-.25 2.18-.19.46.04.92.2 1.4.11.3-.06.54-.28.86-.27.14 0 .28.05.42.08.33.06.66.1.99.13.42.04.83.12 1.26.06.38-.05.72-.27 1.09-.4.13-.04.28-.04.42-.08.29-.07.57-.17.87-.24.49-.12 1-.2 1.51-.29.25-.04.49-.1.74-.11.5-.03.98.14 1.48.11.2-.01.41-.06.61-.08.28-.03.57-.02.85-.05.12-.01.24-.05.36-.05.32 0 .63.05.94.08.73.06 1.47.14 2.21.15.87.01 1.74-.11 2.61-.11.19 0 .37.03.56.03.73 0 1.46-.08 2.19-.08.54 0 1.07.07 1.61.06.73-.02 1.46-.12 2.19-.09.34.01.67.06 1.01.09.85.08 1.72.11 2.57.06.37-.02.73-.1 1.1-.08.41.03.82.18 1.23.18.52-.01 1.04-.14 1.56-.13.31.01.61.09.92.08.47-.01.92-.16 1.38-.21.29-.03.59-.02.88-.06.35-.05.68-.17 1.04-.17.7 0 1.36.29 2.05.28.84-.01 1.68-.26 2.52-.23.42.02.84.12 1.26.18.36.05.71.17 1.07.15.54-.03 1.07-.2 1.61-.19.39.01.79.12 1.18.11.54-.01 1.07-.2 1.61-.14.29.03.57.14.85.21.82.22 1.69.29 2.53.33.31.01.62-.02.92.01.14.01.27.05.41.06.35.02.7-.01 1.04.04.12.02.23.05.35.08.36.08.72.17 1.07.26.31.08.61.18.92.21.52.05 1.03-.12 1.56-.05.26.03.49.15.74.18.32.04.64-.01.96.01.96.07 1.91.19 2.86.39.32.07.62.21.94.25.64.09 1.28-.1 1.93-.02.29.03.57.11.86.16.83.14 1.68.2 2.52.25.3.02.59.03.88.08.16.03.31.08.47.1.35.04.7.02 1.04.08.25.04.49.14.74.15.31.01.61-.09.92-.07.5.03 1 .18 1.5.14.37-.03.71-.19 1.07-.27.27-.06.54-.09.81-.15.25-.06.49-.13.74-.18.57-.12 1.15-.21 1.72-.33.28-.06.55-.14.83-.19.45-.08.91-.09 1.36-.2.26-.07.49-.19.76-.22.54-.06 1.07.1 1.61.03.41-.05.78-.25 1.19-.28.49-.04.98.11 1.47.09.35-.01.69-.11 1.04-.09.27.02.52.13.79.13.34 0 .69-.08 1.03-.12.54-.06 1.07-.13 1.61-.16.31-.02.61.03.92.03.47 0 .93-.09 1.4-.04.26.03.49.15.75.18.2.02.42-.03.62-.03.83-.02 1.66.06 2.48.11.32.02.63.08.94.08.41 0 .83-.05 1.23-.12.24-.04.46-.14.7-.13.33.02.63.16.96.16.45 0 .85-.22 1.29-.23.58-.01 1.14.19 1.71.12.34-.04.65-.17.98-.26.29-.08.57-.19.87-.22.37-.04.74.02 1.1-.04.27-.05.51-.17.78-.21.36-.05.73-.01 1.09-.06.21-.03.41-.09.61-.14.62-.16 1.22-.38 1.85-.49.19-.03.39-.02.58-.06.27-.06.51-.2.78-.25.29-.05.58-.02.87-.08.07-.01.13-.04.2-.05.35-.06.7-.08 1.05-.15.18-.04.34-.12.52-.14.62-.07 1.24.08 1.87.01.19-.02.38-.07.56-.12.24-.06.48-.15.73-.18.43-.05.86.05 1.28.01.3-.03.58-.15.88-.16.41-.01.82.11 1.23.1.41-.01.82-.1 1.23-.11.43-.01.85.09 1.28.08.58-.02 1.15-.15 1.73-.09.32.03.62.16.94.13.64-.06 1.27-.24 1.91-.28.32-.02.64.04.96.03.35-.02.7-.1 1.04-.06.27.03.52.15.79.18.34.04.68-.02 1.02.01.85.08 1.72.03 2.55-.19.21-.06.43-.09.64-.17.22-.08.41-.2.64-.26.64-.17 1.3-.13 1.95-.24.29-.05.56-.16.84-.23.41-.1.83-.19 1.24-.29.4-.1.79-.21 1.19-.29.76-.14 1.52-.2 2.29-.32.32-.05.62-.16.94-.19.45-.04.91.04 1.36 0 .32-.03.62-.14.94-.14.79 0 1.57.24 2.35.15.33-.04.64-.16.96-.23.24-.05.47-.13.71-.14.65-.04 1.31.19 1.96.12.32-.03.62-.15.94-.16.34-.01.67.08 1.01.08.85 0 1.67-.24 2.52-.19.41.03.81.14 1.22.14.76 0 1.5-.24 2.25-.24.38 0 .76.09 1.14.09.83 0 1.67-.19 2.5-.19.42 0 .84.08 1.26.08.79 0 1.57-.19 2.35-.14.33.02.64.13.97.13.66 0 1.31-.2 1.97-.17.32.02.62.11.94.13.35.02.7-.04 1.05-.02.35.02.69.1 1.04.08.42-.02.82-.15 1.24-.17.63-.03 1.26.12 1.89.09.34-.02.67-.11 1.01-.1.34.01.68.07 1.02.07.83 0 1.66-.16 2.49-.16.83 0 1.67.16 2.5.16.42 0 .84-.08 1.26-.08.21 0 .41.05.62.05.42 0 .84-.09 1.26-.09.21 0 .41.05.62.05.21 0 .41-.05.62-.05.41 0 .83.08 1.24.08.62 0 1.24-.12 1.87-.12.31 0 .62.06.93.06.62 0 1.25-.12 1.87-.12.31 0 .62.06.93.06.93 0 1.86-.18 2.79-.18.31 0 .62.06.93.06.62 0 1.25-.12 1.87-.12.52 0 1.03.1 1.55.1.21 0 .41-.04.62-.04.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.72 0 1.45.14 2.17.14.52 0 1.03-.1 1.55-.1.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.52 0 1.03.1 1.55.1.1 0 .21-.02.31-.02.31 0 .62.06.93.06.52 0 1.03-.1 1.55-.1.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.72 0 1.45.14 2.17.14.31 0 .62-.06.93-.06.41 0 .83.08 1.24.08.1 0 .21-.02.31-.02.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.1 0 .21.02.31.02.31 0 .62-.06.93-.06.72 0 1.45.14 2.17.14.41 0 .83-.08 1.24-.08.1 0 .21.02.31.02.31 0 .62-.06.93-.06.31 0 .62.06.93.06.72 0 1.45-.14 2.17-.14.31 0 .62.06.93.06.31 0 .62-.06.93-.06.31 0 .62.06.93.06.31 0 .62-.06.93-.06.31 0 .62.06.93.06.31 0 .62-.06.93-.06.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.1 0 .21.02.31.02.31 0 .62-.06.93-.06.1 0 .21.02.31.02.41 0 .83-.08 1.24-.08.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06' fill='%23F5F5F5' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
              }}
            >
              <MapContainer 
                center={jobData.location.coordinates} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }} 
                attributionControl={false} 
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                <Marker position={jobData.location.coordinates} icon={jobIcon}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-medium">{jobData.title}</div>
                      <div className="text-sm text-gray-600">{jobData.location.address}</div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            <div className="p-4 flex items-center justify-between bg-gray-50">
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{jobData.location.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                {locationSharingEnabled ? (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    <ShareIcon className="h-3 w-3 mr-1" />
                    Sharing Location
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    <EyeOffIcon className="h-3 w-3 mr-1" />
                    Location Private
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
              <p className="text-gray-700 mb-6">{jobData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobData.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Budget & Timeline</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSignIcon className="h-4 w-4 mr-1" />
                      <span>{jobData.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{jobData.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                <ul className="space-y-1">
                  {jobData.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="success" fullWidth>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Accept Job
              </Button>
              <Button variant="secondary" fullWidth>
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="danger" fullWidth>
                Decline Job
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
