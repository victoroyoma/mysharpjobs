import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Award, DollarSign, Image, CreditCard, ArrowLeft, ArrowRight, CheckCircle, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { laravelApi } from '../../utils/laravelApi';
import Button from '../../components/Button';
import StepIndicator from '../../components/ProfileSetup/StepIndicator';
import ProgressBar from '../../components/ProfileSetup/ProgressBar';

interface FormData {
  bio: string;
  skills: string[];
  hourly_rate: string;
  service_radius: string;
  portfolio_images: string[];
  certifications: string[];
  bank_details: {
    account_name: string;
    account_number: string;
    bank_name: string;
  };
}

export default function ArtisanProfileSetup() {
  const navigate = useNavigate();
  const { updateProfileLocally } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bio: '',
    skills: [],
    hourly_rate: '',
    service_radius: '10',
    portfolio_images: [],
    certifications: [],
    bank_details: {
      account_name: '',
      account_number: '',
      bank_name: '',
    },
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCert, setCurrentCert] = useState('');

  const steps = [
    { id: 1, title: 'Professional Info', completed: currentStep > 1 },
    { id: 2, title: 'Skills & Experience', completed: currentStep > 2 },
    { id: 3, title: 'Rates & Availability', completed: currentStep > 3 },
    { id: 4, title: 'Portfolio', completed: currentStep > 4 },
    { id: 5, title: 'Payment Details', completed: false },
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

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [name]: value,
      },
    }));
    setError(null);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addCertification = () => {
    if (currentCert.trim() && !formData.certifications.includes(currentCert.trim())) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, currentCert.trim()],
      }));
      setCurrentCert('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const removePortfolioImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((img) => img !== url),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.bio.trim() || formData.bio.length < 100) {
          setError('Please provide a bio with at least 100 characters');
          return false;
        }
        return true;

      case 2:
        if (formData.skills.length < 3) {
          setError('Please add at least 3 skills');
          return false;
        }
        return true;

      case 3:
        if (!formData.hourly_rate || parseFloat(formData.hourly_rate) <= 0) {
          setError('Please enter a valid hourly rate');
          return false;
        }
        if (!formData.service_radius || parseFloat(formData.service_radius) <= 0) {
          setError('Please enter a valid service radius');
          return false;
        }
        return true;

      case 4:
        if (formData.portfolio_images.length < 3) {
          setError('Please add at least 3 portfolio images');
          return false;
        }
        return true;

      case 5:
        if (!formData.bank_details.account_name.trim()) {
          setError('Account name is required');
          return false;
        }
        if (!formData.bank_details.account_number.trim() || formData.bank_details.account_number.length !== 10) {
          setError('Please enter a valid 10-digit account number');
          return false;
        }
        if (!formData.bank_details.bank_name) {
          setError('Please select your bank');
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
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        bio: formData.bio,
        skills: formData.skills,
        hourly_rate: parseFloat(formData.hourly_rate),
        service_radius: parseFloat(formData.service_radius),
        portfolio_images: formData.portfolio_images,
        certifications: formData.certifications.length > 0 ? formData.certifications : undefined,
        bank_details: formData.bank_details,
      };

      const response = await laravelApi.post('/profile/setup/artisan', payload);

      if (response.data.success) {
        // Update auth context with new user data locally (no extra API call needed)
        if (response.data.data?.user) {
          updateProfileLocally(response.data.data.user);
        }

        // Show success message briefly before redirect
        console.log('✅ Profile setup completed successfully!');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/artisan/dashboard');
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
      navigate('/artisan/dashboard');
    } catch (err) {
      console.error('Skip error:', err);
      navigate('/artisan/dashboard');
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    if (formData.bio.length >= 100) progress += 15;
    if (formData.skills.length >= 3) progress += 15;
    if (parseFloat(formData.hourly_rate) > 0) progress += 15;
    if (formData.portfolio_images.length >= 3) progress += 20;
    if (formData.bank_details.account_name && formData.bank_details.account_number && formData.bank_details.bank_name) progress += 15;
    if (parseFloat(formData.service_radius) > 0) progress += 10;
    if (formData.certifications.length > 0) progress += 10;
    return Math.min(progress, 100);
  };

  const nigerianBanks = [
    'Access Bank', 'Citibank', 'Ecobank', 'Fidelity Bank', 'First Bank of Nigeria',
    'First City Monument Bank (FCMB)', 'Guaranty Trust Bank (GTBank)', 'Heritage Bank',
    'Keystone Bank', 'Polaris Bank', 'Providus Bank', 'Stanbic IBTC Bank',
    'Standard Chartered Bank', 'Sterling Bank', 'Union Bank', 'United Bank for Africa (UBA)',
    'Unity Bank', 'Wema Bank', 'Zenith Bank',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Artisan Profile
          </h1>
          <p className="text-gray-600">
            Let's showcase your skills and experience to potential clients
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

          {/* Step 1: Professional Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell clients about your experience, specialties, and what makes you great at what you do... (minimum 100 characters)"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {formData.bio.length}/100 characters minimum
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Skills & Experience</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Skills <span className="text-red-500">*</span> (Add at least 3)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Plumbing, Electrical Work, Carpentry"
                  />
                  <Button onClick={addSkill} disabled={!currentSkill.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentCert}
                    onChange={(e) => setCurrentCert(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Licensed Electrician, NVQ Level 3"
                  />
                  <Button onClick={addCertification} disabled={!currentCert.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {cert}
                      <button
                        onClick={() => removeCertification(cert)}
                        className="hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Rates & Availability */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Rates & Availability</h2>
              </div>

              <div>
                <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="hourly_rate"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5000"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Set your standard hourly rate. You can negotiate per project.
                </p>
              </div>

              <div>
                <label htmlFor="service_radius" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Radius (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="service_radius"
                  name="service_radius"
                  value={formData.service_radius}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  How far are you willing to travel for jobs?
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Portfolio */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Images <span className="text-red-500">*</span> (Add 3-10 images)
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  For now, please enter image URLs. Upload feature coming soon!
                </p>
                <div className="space-y-2">
                  {[...Array(Math.max(3, formData.portfolio_images.length + 1))].map((_, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="url"
                        value={formData.portfolio_images[idx] || ''}
                        onChange={(e) => {
                          const newImages = [...formData.portfolio_images];
                          if (e.target.value) {
                            newImages[idx] = e.target.value;
                          } else {
                            newImages.splice(idx, 1);
                          }
                          setFormData((prev) => ({ ...prev, portfolio_images: newImages }));
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Image URL ${idx + 1}`}
                      />
                      {formData.portfolio_images[idx] && (
                        <Button
                          variant="danger"
                          onClick={() => removePortfolioImage(formData.portfolio_images[idx])}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {formData.portfolio_images.length}/10 images (minimum 3 required)
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Payment Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  This information is required to receive payments from clients. Your banking details are securely encrypted.
                </p>
              </div>

              <div>
                <label htmlFor="account_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="account_name"
                  name="account_name"
                  value={formData.bank_details.account_name}
                  onChange={handleBankDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account name"
                />
              </div>

              <div>
                <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="account_number"
                  name="account_number"
                  value={formData.bank_details.account_number}
                  onChange={handleBankDetailsChange}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10-digit account number"
                />
              </div>

              <div>
                <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_details.bank_name}
                  onChange={handleBankDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your bank</option>
                  {nigerianBanks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
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
