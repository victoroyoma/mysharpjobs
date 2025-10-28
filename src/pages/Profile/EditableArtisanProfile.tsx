import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CheckCircleIcon, 
  EditIcon, 
  SaveIcon, 
  XIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  CameraIcon,
  PhoneIcon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { profileApi } from '../../utils/api';
import { laravelApi } from '../../utils/laravelApi';

interface Skill {
  name: string;
  level: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  file?: string;
}

interface ProfileData {
  name: string;
  phone: string;
  location: string;
  bio: string;
  skills: Skill[];
  experience: number;
  hourly_rate: number;
  certifications: Certification[];
  portfolio_images: string[];
  avatar: string;
  is_available: boolean;
  service_radius: number;
}

// Helper function to construct full image URLs
const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return 'https://via.placeholder.com/150';
  
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

export default function EditableArtisanProfile() {
  const { user, updateProfile } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience: 0,
    hourly_rate: 0,
    certifications: [],
    portfolio_images: [],
    avatar: '',
    is_available: true,
    service_radius: 10,
  });

  // States for adding new items
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' });
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });
  const [showCertificationForm, setShowCertificationForm] = useState(false);

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
          // Simple reverse geocoding using a free API (replace with a better one for production)
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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await laravelApi.get('/profiles/me');
      
      if (response.data.status === 'success') {
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
          location: locationStr,
          bio: String(userData.bio || ''),
          skills: Array.isArray(userData.skills) ? userData.skills : [],
          experience: Number(userData.experience) || 0,
          hourly_rate: Number(userData.hourly_rate) || 0,
          certifications: Array.isArray(userData.certifications) ? userData.certifications : [],
          portfolio_images: Array.isArray(userData.portfolio_images) ? userData.portfolio_images : [],
          avatar: String(userData.avatar || ''),
          is_available: userData.is_available !== undefined ? Boolean(userData.is_available) : true,
          service_radius: Number(userData.service_radius) || 10,
        });
        
        console.log('✅ Profile data normalized and set');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      showError('Failed to load profile data');
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
      
      // Ensure all data types are correct before sending
      // Only send non-empty fields
      const updateData: any = {};
      
      // Required fields
      if (profileData.name && profileData.name.trim()) {
        updateData.name = String(profileData.name).trim();
      }
      
      if (profileData.location && profileData.location.trim()) {
        updateData.location = String(profileData.location).trim();
      }
      
      // Optional fields - only send if not empty
      if (profileData.phone && profileData.phone.trim()) {
        updateData.phone = String(profileData.phone).trim();
      }
      
      if (profileData.bio && profileData.bio.trim()) {
        updateData.bio = String(profileData.bio).trim();
      }
      
      // Always send these fields (they have defaults)
      updateData.skills = Array.isArray(profileData.skills) ? profileData.skills : [];
      updateData.experience = Number(profileData.experience) || 0;
      updateData.hourly_rate = Number(profileData.hourly_rate) || 0;
      updateData.certifications = Array.isArray(profileData.certifications) ? profileData.certifications : [];
      updateData.is_available = Boolean(profileData.is_available);
      updateData.service_radius = Number(profileData.service_radius) || 10;

      console.log('📤 Sending profile update:', updateData);
      console.log('Data types:', {
        name: typeof updateData.name,
        phone: typeof updateData.phone,
        location: typeof updateData.location,
        bio: typeof updateData.bio,
        skills: Array.isArray(updateData.skills) ? 'array' : typeof updateData.skills,
        experience: typeof updateData.experience,
        hourly_rate: typeof updateData.hourly_rate,
        certifications: Array.isArray(updateData.certifications) ? 'array' : typeof updateData.certifications,
        is_available: typeof updateData.is_available,
        service_radius: typeof updateData.service_radius,
      });

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
          navigate('/artisan/dashboard', { replace: true });
        }, 500); // Small delay to show success message
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('❌ Full error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message,
        errors: error.response?.data?.errors
      });
      
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

  const handlePortfolioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file count
    if (profileData.portfolio_images.length + files.length > 10) {
      showError('Maximum 10 portfolio images allowed');
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
          showError(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} is not a valid image`);
          continue;
        }

        const formData = new FormData();
        formData.append('images[]', file);
        
        const response = await laravelApi.upload('/profiles/portfolio', formData);
        
        if (response.data.status === 'success') {
          setProfileData(prev => ({
            ...prev,
            portfolio_images: response.data.data.portfolio_images
          }));
        }
      }
      
      showSuccess('Portfolio images uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading portfolio:', error);
      showError('Failed to upload portfolio images');
    }
  };

  const handleDeletePortfolioImage = async (index: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await laravelApi.delete(`/profiles/portfolio/${index}`);
      
      if (response.data.status === 'success') {
        setProfileData(prev => ({
          ...prev,
          portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
        }));
        showSuccess('Portfolio image deleted');
      }
    } catch (error: any) {
      console.error('Error deleting portfolio image:', error);
      showError('Failed to delete image');
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      showError('Please enter a skill name');
      return;
    }

    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: newSkill.name.trim(), level: newSkill.level }]
    }));
    
    setNewSkill({ name: '', level: 'Intermediate' });
    setShowSkillForm(false);
  };

  const handleRemoveSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    if (!newCertification.name.trim() || !newCertification.issuer.trim()) {
      showError('Please fill in all certification fields');
      return;
    }

    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...newCertification }]
    }));
    
    setNewCertification({ name: '', issuer: '', date: '' });
    setShowCertificationForm(false);
  };

  const handleRemoveCertification = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleToggleAvailability = async () => {
    try {
      const newAvailability = !profileData.is_available;
      
      const response = await profileApi.updateAvailability(newAvailability);
      
      if (response.data.status === 'success') {
        setProfileData(prev => ({ ...prev, is_available: newAvailability }));
        showSuccess(
          newAvailability ? 'You are now available for jobs' : 'You are now unavailable'
        );
      }
    } catch (error) {
      showError('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
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
            <p className="text-gray-600">Manage your professional information</p>
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
            <div className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E\")"
              }}
            />
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
                
                {/* Name, Location, Phone - Now with proper spacing */}
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
              
              {/* Availability Toggle */}
              <div className="flex items-center bg-white px-4 py-2.5 rounded-full shadow-md border border-gray-200 self-start sm:self-auto">
                <span className={`text-sm font-semibold mr-3 transition-colors ${profileData.is_available ? 'text-green-600' : 'text-gray-500'}`}>
                  {profileData.is_available ? '🟢 Available' : '🔴 Unavailable'}
                </span>
                <label className="relative inline-block w-14 h-7 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.is_available}
                    onChange={handleToggleAvailability}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                </label>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                {editMode ? (
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-2">Experience (years)</label>
                    <input
                      type="number"
                      value={profileData.experience}
                      onChange={(e) => setProfileData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 w-20 text-center bg-transparent"
                      min="0"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-blue-600">{profileData.experience}</p>
                    <p className="text-xs text-gray-700 font-medium mt-1">Years Experience</p>
                  </>
                )}
              </div>
              
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm">
                {editMode ? (
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-2">Hourly Rate (₦)</label>
                    <input
                      type="number"
                      value={profileData.hourly_rate}
                      onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) || 0 }))}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-green-400 focus:outline-none focus:border-green-600 w-24 text-center bg-transparent"
                      min="0"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-green-600">₦{profileData.hourly_rate}</p>
                    <p className="text-xs text-gray-700 font-medium mt-1">Hourly Rate</p>
                  </>
                )}
              </div>
              
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm">
                <p className="text-3xl font-bold text-purple-600">{profileData.skills.length}</p>
                <p className="text-xs text-gray-700 font-medium mt-1">Skills</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm">
                {editMode ? (
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-2">Service Radius (km)</label>
                    <input
                      type="number"
                      value={profileData.service_radius}
                      onChange={(e) => setProfileData(prev => ({ ...prev, service_radius: parseInt(e.target.value) || 0 }))}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-orange-400 focus:outline-none focus:border-orange-600 w-20 text-center bg-transparent"
                      min="5"
                      max="100"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-orange-600">{profileData.service_radius}km</p>
                    <p className="text-xs text-gray-700 font-medium mt-1">Service Radius</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
            <h3 className="text-2xl font-bold text-gray-900">About Me</h3>
          </div>
          {editMode ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-inner transition-all"
              rows={6}
              placeholder="Tell clients about your experience, expertise, and what makes you the best choice for their project..."
            />
          ) : (
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {profileData.bio || 'No bio added yet. Click Edit Profile to add one.'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skills Section */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Skills</h3>
              {editMode && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSkillForm(!showSkillForm)}
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
              )}
            </div>

            {showSkillForm && editMode && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Skill name"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddSkill} fullWidth>
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowSkillForm(false);
                      setNewSkill({ name: '', level: 'Intermediate' });
                    }}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {profileData.skills.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No skills added yet</p>
              ) : (
                profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-xs bg-blue-300 px-2 py-0.5 rounded-full text-blue-900">
                      {skill.level}
                    </span>
                    {editMode && (
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-1 text-blue-700 hover:text-red-600 transition-colors"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="md:col-span-2 bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
              {editMode && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCertificationForm(!showCertificationForm)}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>

            {showCertificationForm && editMode && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Certification name"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                  placeholder="Issuing organization"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={newCertification.date}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddCertification} fullWidth>
                    Add Certification
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowCertificationForm(false);
                      setNewCertification({ name: '', issuer: '', date: '' });
                    }}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {profileData.certifications.length === 0 ? (
              <p className="text-gray-500">No certifications added yet</p>
            ) : (
              <ul className="space-y-3">
                {profileData.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start justify-between border-b pb-3 last:border-b-0">
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-900 font-medium">{cert.name}</span>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        {cert.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Issued: {new Date(cert.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {editMode && (
                      <button
                        onClick={() => handleRemoveCertification(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mt-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Portfolio Gallery</h3>
              <p className="text-sm text-gray-500">Showcase your best work</p>
            </div>
            {editMode && (
              <label className="cursor-pointer inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePortfolioUpload}
                />
              </label>
            )}
          </div>

          {profileData.portfolio_images.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <UploadIcon className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">No portfolio images yet</p>
              {editMode && (
                <p className="text-sm text-gray-500">Click "Upload Images" to showcase your work</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {profileData.portfolio_images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <img
                      src={getImageUrl(image)}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {editMode && (
                    <button
                      onClick={() => handleDeletePortfolioImage(index)}
                      className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-lg"
                      title="Delete image"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
