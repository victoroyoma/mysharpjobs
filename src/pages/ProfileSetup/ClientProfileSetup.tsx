import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CreditCard, MapPin, User, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { laravelApi } from '../../utils/laravelApi';
import Button from '../../components/Button';
import StepIndicator from '../../components/ProfileSetup/StepIndicator';
import ProgressBar from '../../components/ProfileSetup/ProgressBar';

interface FormData {
  business_type: 'individual' | 'business' | '';
  company_name: string;
  company_registration_number: string;
  tax_id: string;
  preferred_payment_method: 'Credit Card' | 'Bank Transfer' | 'Wallet' | '';
  avatar: string;
  location: string;
}

export default function ClientProfileSetup() {
  const navigate = useNavigate();
  const { user, updateProfileLocally } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    business_type: '',
    company_name: '',
    company_registration_number: '',
    tax_id: '',
    preferred_payment_method: '',
    avatar: '',
    location: user?.location || '',
  });

  const steps = [
    { id: 1, title: 'Business Info', completed: currentStep > 1 },
    { id: 2, title: 'Contact & Location', completed: currentStep > 2 },
    { id: 3, title: 'Payment', completed: currentStep > 3 },
    { id: 4, title: 'Review', completed: false },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.business_type) {
          setError('Please select your business type');
          return false;
        }
        if (formData.business_type === 'business' && !formData.company_name.trim()) {
          setError('Company name is required for business accounts');
          return false;
        }
        return true;

      case 2:
        if (!formData.location.trim()) {
          setError('Location is required');
          return false;
        }
        return true;

      case 3:
        if (!formData.preferred_payment_method) {
          setError('Please select your preferred payment method');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError(null);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        business_type: formData.business_type,
        company_name: formData.company_name || null,
        company_registration_number: formData.company_registration_number || null,
        tax_id: formData.tax_id || null,
        preferred_payment_method: formData.preferred_payment_method,
        location: formData.location,
        avatar: formData.avatar || null,
      };

      const response = await laravelApi.post('/profile/setup/client', payload);

      if (response.data.success) {
        // Update auth context with new user data locally (no extra API call needed)
        if (response.data.data?.user) {
          updateProfileLocally(response.data.data.user);
        }

        // Show success message briefly before redirect
        console.log('✅ Profile setup completed successfully!');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/client/dashboard');
        }, 500);
      } else {
        setError(response.data.message || 'Failed to complete profile setup');
      }
    } catch (err: any) {
      console.error('Profile setup error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred while setting up your profile'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      await laravelApi.patch('/profile/skip-for-now');
      navigate('/client/dashboard');
    } catch (err) {
      console.error('Skip error:', err);
      navigate('/client/dashboard');
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    if (formData.business_type) progress += 25;
    if (formData.location) progress += 25;
    if (formData.preferred_payment_method) progress += 25;
    if (formData.business_type === 'individual' || formData.company_name) progress += 25;
    return progress;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Client Profile
          </h1>
          <p className="text-gray-600">
            Let's set up your account so you can start posting jobs
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar percentage={calculateProgress()} />
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, business_type: 'individual' }))
                    }
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.business_type === 'individual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-semibold">Individual</p>
                    <p className="text-sm text-gray-600">Personal projects</p>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, business_type: 'business' }))
                    }
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.business_type === 'business'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-semibold">Business</p>
                    <p className="text-sm text-gray-600">Company account</p>
                  </button>
                </div>
              </div>

              {formData.business_type === 'business' && (
                <>
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="company_registration_number" className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number (Optional)
                    </label>
                    <input
                      type="text"
                      id="company_registration_number"
                      name="company_registration_number"
                      value={formData.company_registration_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., RC123456"
                    />
                  </div>

                  <div>
                    <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID (Optional)
                    </label>
                    <input
                      type="text"
                      id="tax_id"
                      name="tax_id"
                      value={formData.tax_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tax identification number"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Contact & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Contact & Location</h2>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your location</option>
                  <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                  <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                  <option value="Port Harcourt, Nigeria">Port Harcourt, Nigeria</option>
                  <option value="Warri, Nigeria">Warri, Nigeria</option>
                  <option value="Ibadan, Nigeria">Ibadan, Nigeria</option>
                  <option value="Kano, Nigeria">Kano, Nigeria</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  This helps us connect you with nearby artisans
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Preferences</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'Credit Card', icon: '💳', desc: 'Pay with card' },
                    { value: 'Bank Transfer', icon: '🏦', desc: 'Direct bank transfer' },
                    { value: 'Wallet', icon: '👛', desc: 'MySharpJobs wallet' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          preferred_payment_method: method.value as any,
                        }))
                      }
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center gap-4 ${
                        formData.preferred_payment_method === method.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold">{method.value}</p>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                      {formData.preferred_payment_method === method.value && (
                        <CheckCircle className="w-6 h-6 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-semibold capitalize">{formData.business_type}</p>
                </div>

                {formData.business_type === 'business' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-semibold">{formData.company_name}</p>
                    </div>
                    {formData.company_registration_number && (
                      <div>
                        <p className="text-sm text-gray-600">Registration Number</p>
                        <p className="font-semibold">{formData.company_registration_number}</p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{formData.location}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">{formData.preferred_payment_method}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  By completing your profile, you can start posting jobs and hiring artisans immediately!
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip for Now
              </Button>
            </div>

            <div>
              {currentStep < steps.length ? (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Profile'}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact support at support@mysharpjobs.ng
        </p>
      </div>
    </div>
  );
}
