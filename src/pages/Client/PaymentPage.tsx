import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface PaymentData {
  amount: number;
  paymentMethod: 'paystack' | 'flutterwave';
  milestoneId?: string;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    paymentId: string;
    reference: string;
    authorizationUrl: string;
    accessCode: string;
    amount: number;
    fees: {
      platform: number;
      gateway: number;
      total: number;
    };
  };
  message?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  location: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
  };
  artisanId?: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  paymentStatus?: string;
  milestones?: Array<{
    _id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'paid';
  }>;
}

const EnhancedPaymentPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    paymentMethod: 'paystack'
  });
  const [showMilestones, setShowMilestones] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        showError('Invalid job ID');
        navigate('/dashboard');
        return;
      }

      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }

        const data = await response.json();
        setJob(data.data);
        setPaymentData(prev => ({ ...prev, amount: data.data.budget }));
      } catch (error) {
        console.error('Error fetching job:', error);
        showError('Failed to load job details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, navigate, showError]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) return;

    // Validate payment data
    if (paymentData.amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    if (selectedMilestone && !job.milestones?.find(m => m._id === selectedMilestone)) {
      showError('Please select a valid milestone');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobId: job._id,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          milestoneId: selectedMilestone || undefined
        })
      });

      const result: PaymentResponse = await response.json();

      if (result.success && result.data) {
        // Redirect to payment gateway
        window.location.href = result.data.authorizationUrl;
      } else {
        showError(result.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      showError('Failed to initialize payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleMilestonePayment = (milestoneId: string, amount: number) => {
    setSelectedMilestone(milestoneId);
    setPaymentData(prev => ({ ...prev, amount }));
    setShowMilestones(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The requested job could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const platformFee = Math.round(paymentData.amount * 0.05);
  const gatewayFee = Math.round(paymentData.amount * (paymentData.paymentMethod === 'paystack' ? 0.015 : 0.014));
  const totalFees = platformFee + gatewayFee;
  const totalAmount = paymentData.amount + totalFees;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Payment for Job</h1>
            <p className="text-blue-100">{job.title}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <span className="ml-2 text-gray-900">{job.title}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-900">{job.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>
                      <span className="ml-2 text-gray-900">{formatCurrency(job.budget)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Artisan:</span>
                      <span className="ml-2 text-gray-900">
                        {job.artisanId?.name || 'Not assigned'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {job.milestones && job.milestones.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Milestones</h3>
                    <div className="space-y-2">
                      {job.milestones.map((milestone) => (
                        <div
                          key={milestone._id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedMilestone === milestone._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleMilestonePayment(milestone._id, milestone.amount)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(milestone.amount)}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                                milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                milestone.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {milestone.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₦</span>
                      <input
                        type="number"
                        id="amount"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData(prev => ({ 
                          ...prev, 
                          amount: parseFloat(e.target.value) || 0 
                        }))}
                        className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        max={job.budget}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: {formatCurrency(job.budget)}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paystack"
                          checked={paymentData.paymentMethod === 'paystack'}
                          onChange={(e) => setPaymentData(prev => ({ 
                            ...prev, 
                            paymentMethod: e.target.value as 'paystack' | 'flutterwave' 
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Paystack (1.5% fee)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="flutterwave"
                          checked={paymentData.paymentMethod === 'flutterwave'}
                          onChange={(e) => setPaymentData(prev => ({ 
                            ...prev, 
                            paymentMethod: e.target.value as 'paystack' | 'flutterwave' 
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Flutterwave (1.4% fee)</span>
                      </label>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Fee Breakdown</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Job Amount:</span>
                        <span className="text-gray-900">{formatCurrency(paymentData.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee (5%):</span>
                        <span className="text-gray-900">{formatCurrency(platformFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gateway Fee:</span>
                        <span className="text-gray-900">{formatCurrency(gatewayFee)}</span>
                      </div>
                      <div className="border-t pt-1 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total Amount:</span>
                          <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing || paymentData.amount <= 0}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                      processing || paymentData.amount <= 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }`}
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      `Pay ${formatCurrency(totalAmount)}`
                    )}
                  </button>
                </form>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Secure Payment</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment will be held in escrow until you confirm job completion. 
                        This ensures your money is protected throughout the project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPaymentPage;
