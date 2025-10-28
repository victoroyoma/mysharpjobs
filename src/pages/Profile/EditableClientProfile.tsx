import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  EditIcon, 
  SaveIcon, 
  XIcon,
  CameraIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  BriefcaseIcon,
  CalendarIcon,
  DollarSignIcon,
  CheckCircleIcon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { laravelApi } from '../../utils/laravelApi';

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
  member_since: string;
}

// Helper function to construct full image URLs
const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get base URL from environment
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
};

export default function EditableClientProfile() {
  const { user, updateProfile } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    phone: '',
    email: '',
    location: '',
    bio: '',
    avatar: '',
    member_since: '',
  });

  const [locationStatus, setLocationStatus] = useState('idle');

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const address = data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
          
          setProfileData(prev => ({ ...prev, location: address }));
          showSuccess('Location fetched successfully!');
          setLocationStatus('success');
        } catch (error) {
          showError('Could not fetch address from coordinates.');
          setLocationStatus('error');
        }
      },
      (error) => {
        showError(`Error getting location: ${error.message}`);
        setLocationStatus('error');
      }
    );
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      console.log('❌ No user found, redirecting to login...');
      showError('Please log in to view your profile');
      navigate('/auth/login');
      return;
    }
    
    console.log('✅ User authenticated:', user);
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching profile from /profiles/me...');
      
      const response = await laravelApi.get('/profiles/me');
      console.log('📡 API Response:', response);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        const userData = response.data.data;
        
        console.log('📥 Received profile data:', userData);
        
        // Extract location as string
        let locationStr = '';
        if (typeof userData.location === 'string') {
          locationStr = userData.location;
        } else if (userData.location && typeof userData.location === 'object') {
          locationStr = userData.location.address || userData.location.city || '';
        }
        
        setProfileData({
          name: String(userData.name || ''),
          phone: String(userData.phone || ''),
          email: String(userData.email || ''),
          location: locationStr,
          bio: String(userData.bio || ''),
          avatar: String(userData.avatar || ''),
          member_since: String(userData.created_at || new Date().toISOString()),
        });
        
        // Fetch recent jobs if available
        if (userData.recent_jobs) {
          setRecentJobs(userData.recent_jobs);
        }
        
        console.log('✅ Profile data normalized and set');
      } else {
        console.error('❌ Unexpected API response format:', response.data);
        showError('Unexpected response format from server');
      }
    } catch (error: any) {
      console.error('❌ Error fetching profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        showError('Please log in to view your profile');
        navigate('/auth/login');
      } else if (error.response?.status === 404) {
        showError('Profile not found. Please complete your profile setup.');
        navigate('/client/profile-setup');
      } else {
        showError(error.response?.data?.message || 'Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!profileData.name || profileData.name.trim() === '') {
        showError('Name is required');
        setSaving(false);
        return;
      }
      
      if (!profileData.location || profileData.location.trim() === '') {
        showError('Location is required');
        setSaving(false);
        return;
      }
      
      // Prepare update data
      const updateData: any = {
        name: String(profileData.name).trim(),
        location: String(profileData.location).trim(),
      };
      
      // Optional fields
      if (profileData.phone && profileData.phone.trim()) {
        updateData.phone = String(profileData.phone).trim();
      }
      
      if (profileData.bio && profileData.bio.trim()) {
        updateData.bio = String(profileData.bio).trim();
      }

      console.log('📤 Sending profile update:', updateData);

      const response = await laravelApi.put('/profiles/me', updateData);
      
      if (response.data.status === 'success') {
        showSuccess('Profile updated successfully!');
        setEditMode(false);
        
        // Update user in auth context  
        if (updateProfile) {
          await updateProfile(response.data.data);
        }
        
        // Auto-redirect to dashboard after successful save
        console.log('✅ Profile saved, redirecting to dashboard...');
        setTimeout(() => {
          navigate('/client/dashboard', { replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Show specific validation errors if available
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
          return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
        }).join('\n');
        showError(`Validation errors:\n${errorMessages}`);
      } else {
        showError(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please upload a valid image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await laravelApi.upload('/profiles/avatar', formData);
      
      if (response.data.status === 'success') {
        setProfileData(prev => ({ ...prev, avatar: response.data.data.avatar }));
        showSuccess('Profile picture updated!');
        
        if (updateProfile && user) {
          await updateProfile({ ...user, avatar: response.data.data.avatar });
        }
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      showError('Failed to upload profile picture');
    }
  };

  const formatMemberSince = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (error) {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditMode(false);
                    fetchProfile(); // Reset data
                  }}
                  disabled={saving}
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setEditMode(true)}>
                <EditIcon className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 h-40 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="px-6 pb-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Avatar and Profile Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 -mt-20 relative">
                  <img 
                    className="h-32 w-32 rounded-full border-4 border-white shadow-xl object-cover ring-4 ring-blue-100" 
                    src={getImageUrl(profileData.avatar)} 
                    alt="Profile" 
                  />
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
                      <CameraIcon className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  )}
                </div>
                
                {/* Name, Location, Phone */}
                <div className="flex-1 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                  {editMode ? (
                    <div className="w-full">
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name *"
                        required
                        className="w-full text-2xl font-bold text-gray-900 border-b-2 border-blue-600 focus:outline-none bg-white px-2 py-1 rounded-t mb-2"
                      />
                      {!profileData.name && (
                        <p className="text-xs text-red-500 mt-1 mb-2">* Name is required</p>
                      )}
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name || 'No name set'}</h2>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    {editMode ? (
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter your location *"
                            required
                            className="w-full text-sm text-gray-700 border-b border-gray-300 focus:outline-none focus:border-blue-600 bg-white px-1 py-1 pr-10"
                          />
                          <button
                            type="button"
                            onClick={handleFetchLocation}
                            className="absolute right-0 top-0 text-blue-600 hover:text-blue-800"
                            title="Get current location"
                          >
                            <MapPinIcon className="w-5 h-5" />
                          </button>
                        </div>
                        {!profileData.location && (
                          <p className="text-xs text-red-500 mt-1">* Location is required</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 font-medium">{profileData.location || 'No location set'}</p>
                    )}
                  </div>
                  
                  {(editMode || profileData.phone) && (
                    <div className="flex items-center gap-2 mt-2">
                      <PhoneIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      {editMode ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="flex-1 text-sm text-gray-700 border-b border-gray-300 focus:outline-none focus:border-blue-600 bg-white px-1 py-1"
                          placeholder="Phone number"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 font-medium">{profileData.phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Client Badge */}
              <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg self-start sm:self-auto">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold">Client Account</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                <p className="text-3xl font-bold text-blue-600">{recentJobs.length}</p>
                <p className="text-xs text-gray-700 font-medium mt-1">Jobs Posted</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm">
                <p className="text-3xl font-bold text-green-600">
                  {recentJobs.filter((j: any) => j.status === 'completed').length}
                </p>
                <p className="text-xs text-gray-700 font-medium mt-1">Completed</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm">
                <p className="text-3xl font-bold text-orange-600">
                  {recentJobs.filter((j: any) => j.status === 'in-progress').length}
                </p>
                <p className="text-xs text-gray-700 font-medium mt-1">In Progress</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm">
                <ClockIcon className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-700 font-medium">{formatMemberSince(profileData.member_since)}</p>
                <p className="text-xs text-gray-500 mt-1">Member Since</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact & About Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <MailIcon className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MailIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                    <p className="text-sm text-gray-900 break-all">{profileData.email}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{profileData.phone || 'Not provided'}</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-sm text-gray-900">{profileData.location}</p>
                  </div>
                </li>
              </ul>

              {/* Bio Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">About Me</h4>
                {editMode ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {profileData.bio || 'No bio provided yet. Click Edit Profile to add one.'}
                  </p>
                )}
                {editMode && (
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    {profileData.bio.length}/500 characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Jobs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Jobs
                </h3>
                {recentJobs.length > 0 && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => navigate('/client/dashboard')}
                  >
                    View All
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {recentJobs.length > 0 ? (
                  recentJobs.slice(0, 5).map((job: any) => (
                    <div 
                      key={job.id} 
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-2">
                            {job.title}
                          </h4>
                          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                            {job.artisan_name && (
                              <span className="flex items-center">
                                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                                {job.artisan_name}
                              </span>
                            )}
                            <span className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              job.status === 'completed' ? 'bg-green-100 text-green-800' :
                              job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status === 'in-progress' ? 'In Progress' : 
                               job.status === 'completed' ? 'Completed' :
                               job.status === 'pending' ? 'Pending' : job.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center text-lg font-bold text-gray-900">
                            <DollarSignIcon className="w-5 h-5 text-green-600" />
                            {job.budget?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BriefcaseIcon className="w-12 h-12 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h4>
                    <p className="text-gray-600 mb-6">Start by posting your first job to find skilled artisans</p>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/client/post-job')}
                    >
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
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
