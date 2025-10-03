import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    
    if (!password) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }
    
    try {
      const result = await login(email, password);
      console.log('🎯 Login result:', result);
      console.log('🎯 Result.success:', result.success);
      console.log('🎯 Result.data:', result.data);
      console.log('🎯 Result.data.user:', result.data?.user);
      
      if (result.success && result.data.user) {
        // Get user type directly from the login response
        const userType = result.data.user.type;
        console.log('✅ Login successful! User type:', userType);
        
        // Redirect based on user type
        switch (userType) {
          case 'client':
            console.log('🚀 Redirecting to /client/dashboard');
            navigate('/client/dashboard');
            break;
          case 'artisan':
            console.log('🚀 Redirecting to /artisan/dashboard');
            navigate('/artisan/dashboard');
            break;
          case 'admin':
            console.log('🚀 Redirecting to /admin/dashboard');
            navigate('/admin/dashboard');
            break;
          default:
            console.log('🚀 Redirecting to /');
            navigate('/');
        }
      } else {
        console.error('❌ Login failed:', result.message);
        setError(result.message || 'Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back to MySharpJobs
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label="Login form" autoComplete="on">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    emailTouched && !validateEmail(email) ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  value={email}
                  onChange={e => { 
                    setEmail(e.target.value); 
                    setEmailTouched(true);
                    setError(''); // Clear error when user starts typing
                  }}
                  aria-label="Email address"
                  aria-invalid={emailTouched && !validateEmail(email)}
                />
                {emailTouched && !validateEmail(email) && (
                  <div className="text-xs text-red-500 mt-1">Invalid email format</div>
                )}
              </div>
              
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    passwordTouched && !password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10`}
                  placeholder="Password"
                  value={password}
                  onChange={e => { 
                    setPassword(e.target.value); 
                    setPasswordTouched(true);
                    setError(''); // Clear error when user starts typing
                  }}
                  aria-label="Password"
                  aria-invalid={passwordTouched && !password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {passwordTouched && !password && (
                  <div className="text-xs text-red-500 mt-1">Password required</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <Link 
                to="/auth/password-recovery" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-600 text-sm text-center" role="alert" aria-live="assertive">
                  {error}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
