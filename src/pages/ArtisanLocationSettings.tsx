import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  SettingsIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  SmartphoneIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  LockIcon
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function ArtisanLocationSettings() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [jobLocationSharing, setJobLocationSharing] = useState(true);
  const [profileLocationSharing, setProfileLocationSharing] = useState(false);
  const [preciseLocation, setPreciseLocation] = useState(false);
  const [locationHistory, setLocationHistory] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleLocationToggle = () => {
    if (isLocationEnabled) {
      setShowConsentModal(true);
    } else {
      setIsLocationEnabled(true);
    }
  };

  const confirmDisableLocation = () => {
    setIsLocationEnabled(false);
    setJobLocationSharing(false);
    setProfileLocationSharing(false);
    setPreciseLocation(false);
    setLocationHistory(false);
    setShowConsentModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              ← Back to dashboard
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Location Settings</h1>
                <p className="text-gray-600 mt-1">Manage how you share your location with clients</p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your Privacy Matters</p>
                <p>
                  We only share your location when necessary for job completion and with your explicit consent. 
                  You can modify these settings at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Main Location Toggle */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4">
                    <MapPinIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Location Services</h3>
                    <p className="text-sm text-gray-600">Enable location sharing for job matching and tracking</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLocationEnabled}
                      onChange={handleLocationToggle}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {!isLocationEnabled && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400">
                <div className="flex items-center">
                  <AlertTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">
                    Location services are disabled. You may miss job opportunities in your area.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Location Sharing Settings */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location Sharing Preferences</h3>
              
              {/* Job Location Sharing */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Share location during active jobs</h4>
                      <p className="text-sm text-gray-600">
                        Allow clients to track your location when you're working on their job
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobLocationSharing && isLocationEnabled}
                      onChange={(e) => setJobLocationSharing(e.target.checked)}
                      disabled={!isLocationEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  </label>
                </div>

                {/* Profile Location Sharing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                      <SmartphoneIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Show approximate location on profile</h4>
                      <p className="text-sm text-gray-600">
                        Display your general area (city/neighborhood) to potential clients
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileLocationSharing && isLocationEnabled}
                      onChange={(e) => setProfileLocationSharing(e.target.checked)}
                      disabled={!isLocationEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  </label>
                </div>

                {/* Precise Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-lg mr-4">
                      <LockIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Precise location sharing</h4>
                      <p className="text-sm text-gray-600">
                        Share exact GPS coordinates (recommended only during active jobs)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preciseLocation && isLocationEnabled}
                      onChange={(e) => setPreciseLocation(e.target.checked)}
                      disabled={!isLocationEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  </label>
                </div>

                {/* Location History */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                      <ClockIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">Save location history</h4>
                      <p className="text-sm text-gray-600">
                        Keep a record of job locations for analytics and reporting
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={locationHistory && isLocationEnabled}
                      onChange={(e) => setLocationHistory(e.target.checked)}
                      disabled={!isLocationEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Permission Status */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Browser Permissions</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-green-800">Location Access Granted</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <SettingsIcon className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Security & Privacy</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Your location data is encrypted and never stored on our servers longer than necessary</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>Location sharing can be disabled at any time, even during active jobs</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>We only share your location with clients you've accepted jobs from</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>You can view and delete your location history at any time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Disable Location Services?</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Disabling location services will:
            </p>
            
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Prevent you from receiving local job opportunities
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Disable real-time tracking for active jobs
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Remove your location from your public profile
              </li>
            </ul>
            
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                fullWidth
                onClick={() => setShowConsentModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                fullWidth
                onClick={confirmDisableLocation}
              >
                Disable
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
