import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function PasswordRecovery() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const step = resetToken ? 'reset' : 'request';
  
  // Request reset state
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Reset password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      if (response.data.status === 'success') {
        setEmailSent(true);
      } else {
        setError(response.data.message || 'Failed to send reset email');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        resetToken,
        newPassword
      });
      
      if (response.data.status === 'success') {
        setResetSuccess(true);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          {step === 'request' ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  {emailSent ? 'Check Your Email' : 'Recover Password'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {emailSent 
                    ? 'We\'ve sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.'
                    : 'Enter your email address and we\'ll send you a link to reset your password'
                  }
                </p>
              </div>

              {!emailSent ? (
                <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="text-red-600 text-sm">{error}</div>
                    </div>
                  )}

                  <div className="rounded-md shadow-sm">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                        placeholder="Email address" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Recovery Link'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-8">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-800">Email sent successfully!</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button 
                      onClick={() => setEmailSent(false)}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      try again
                    </button>
                  </p>
                </div>
              )}

              <div className="text-sm text-center">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Log in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  {resetSuccess ? 'Password Reset Successful' : 'Reset Password'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {resetSuccess 
                    ? 'Your password has been reset successfully. You can now log in with your new password.'
                    : 'Enter your new password below'
                  }
                </p>
              </div>

              {!resetSuccess ? (
                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="text-red-600 text-sm">{error}</div>
                    </div>
                  )}

                  <div className="rounded-md shadow-sm space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="sr-only">
                        New Password
                      </label>
                      <input 
                        id="newPassword" 
                        name="newPassword" 
                        type="password" 
                        autoComplete="new-password" 
                        required 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                        placeholder="New password (min 6 characters)" 
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                        placeholder="Confirm new password" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mt-8">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-800">Password reset successful!</span>
                    </div>
                  </div>
                  
                  <Link to="/login">
                    <Button variant="primary" fullWidth>
                      Go to Login
                    </Button>
                  </Link>
                </div>
              )}

              <div className="text-sm text-center">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Log in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
