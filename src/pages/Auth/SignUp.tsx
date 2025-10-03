import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

export default function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const [userType, setUserType] = useState<'client' | 'artisan'>(
    (searchParams.get('type') as 'client' | 'artisan') || 'client'
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    skills: '',
    experience: '',
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) newErrors.push('Full name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (!formData.phone.trim()) newErrors.push('Phone number is required');
    if (!formData.location) newErrors.push('Location is required');
    if (!formData.password) newErrors.push('Password is required');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');
    
    if (userType === 'artisan') {
      if (!formData.skills) newErrors.push('Primary skill is required for artisans');
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    setIsSubmitting(true);
    
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        type: userType,
        location: formData.location,
        ...(userType === 'artisan' && {
          skills: [formData.skills],
          experience: parseInt(formData.experience) || 0,
        })
      };
      
      const result = await register(userData);
      
      if (result.success && result.data.user) {
        // Get user type from the registration response
        const registeredUserType = result.data.user.type;
        
        // Redirect based on user type
        switch (registeredUserType) {
          case 'artisan':
            navigate('/artisan/dashboard');
            break;
          case 'client':
            navigate('/client/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrors([result.message || 'Registration failed. Please try again.']);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(['An error occurred during registration. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join MySharpJobs to connect with{' '}
              {userType === 'artisan' ? 'clients' : 'artisans'}
            </p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 px-4 text-center ${
                userType === 'artisan'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('artisan')}
              type="button"
            >
              I'm an Artisan
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                userType === 'client'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setUserType('client')}
              type="button"
            >
              I'm a Client
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                >
                  <option value="">Select your location</option>
                  <option value="Warri, Nigeria">Warri, Nigeria</option>
                  <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                  <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                  <option value="Port Harcourt, Nigeria">Port Harcourt, Nigeria</option>
                </select>
              </div>

              {userType === 'artisan' && (
                <>
                  <div>
                    <label htmlFor="skills" className="sr-only">
                      Primary Skill
                    </label>
                    <select
                      id="skills"
                      name="skills"
                      required
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    >
                      <option value="">Select your primary skill</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="painting">Painting</option>
                      <option value="masonry">Masonry</option>
                      <option value="welding">Welding</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="sr-only">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Years of Experience"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
