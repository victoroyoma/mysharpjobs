import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CalendarIcon, ClockIcon, MapPinIcon, CheckCircleIcon, MessageSquareIcon, ThumbsUpIcon, ThumbsDownIcon, Navigation2Icon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
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
export default function JobDetails() {
  const {
    id
  } = useParams();
  const [userType, setUserType] = useState('client'); // For demo: 'client' or 'artisan'
  const [shareLocation, setShareLocation] = useState(false);
  // Mock job location
  const jobLocation: [number, number] = [6.5244, 3.3892]; // Example coordinates in Lagos
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to={userType === 'client' ? '/client/dashboard' : '/artisan/dashboard'} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              ← Back to dashboard
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">
                  Kitchen Cabinet Installation
                </h1>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  In Progress
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Posted on May 10, 2023
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Expires in 6 days
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                  Warri, Nigeria
                </div>
              </div>
              {/* Job Location Map */}
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Job Location
                </h2>
                <div className="h-[200px] rounded-lg overflow-hidden relative" style={{
                backgroundColor: '#f0f4f8',
                backgroundImage: 'linear-gradient(to right, #e6f0fd 1px, transparent 1px), linear-gradient(to bottom, #e6f0fd 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}>
                  {/* Map would be rendered here */}
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
                  Need help installing custom kitchen cabinets in my new home.
                  The cabinets are already assembled and need to be mounted
                  securely to the wall. There are 10 upper cabinets and 8 lower
                  cabinets to install. All hardware and tools will be provided.
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
                      <span>₦25,000</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Duration:</span>
                      <span>1-2 days</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium mr-2">Start Date:</span>
                      <span>May 15, 2023</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Client Information
                  </h3>
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full mr-3" src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Client" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Sarah Johnson
                      </p>
                      <p className="text-xs text-gray-500">
                        Member since Jan 2023
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {userType === 'artisan' ? <>
                    <Button variant="primary" fullWidth>
                      Apply for This Job
                    </Button>
                    <Button variant="secondary" fullWidth>
                      Save Job
                    </Button>
                  </> : <>
                    <Link to="/job/1/track">
                      <Button variant="primary" fullWidth>
                        Track Artisan
                      </Button>
                    </Link>
                    <Link to="/messages">
                      <Button variant="secondary" fullWidth>
                        Message Artisan
                      </Button>
                    </Link>
                  </>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}