import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const success = await login(email, password);
      if (success) {
        if (email === 'client@demo.com') {
          navigate('/client/dashboard');
        } else if (email === 'artisan@demo.com') {
          navigate('/artisan/dashboard');
        } else if (email === 'admin@demo.com') {
          navigate('/admin/dashboard/enhanced');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
              Demo: Use <span className="font-semibold">client@demo.com</span> or <span className="font-semibold">artisan@demo.com</span>.<br />
              Password can be anything.<br />
              <span className="text-xs text-gray-400">For admin demo, use <span className="font-semibold">admin@demo.com</span>.</span>
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Demo Accounts:</h3>
              <ul className="text-sm text-blue-800">
                <li>Client: client@demo.com</li>
                <li>Artisan: artisan@demo.com</li>
                <li>Admin: admin@demo.com</li>
              </ul>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} aria-label="Login form" autoComplete="on">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${emailTouched && !validateEmail(email) ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailTouched(true); }}
                  aria-label="Email address"
                  aria-invalid={emailTouched && !validateEmail(email)}
                />
                {emailTouched && !validateEmail(email) && (
                  <div className="text-xs text-red-500 mt-1">Invalid email format</div>
                )}
              </div>
              <div className="mt-4 relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${passwordTouched && !password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordTouched(true); }}
                  aria-label="Password"
                  aria-invalid={passwordTouched && !password}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-xs text-blue-600 hover:underline focus:outline-none"
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
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="/auth/password-recovery" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
            </div>
            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center mt-2" role="alert" aria-live="assertive">{error}</div>
            )}
            <div className="mt-6">
              <div className="flex flex-col gap-2">
                <button type="button" className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12.18V13.9H17.7C17.3 15.7 15.6 17.1 12.18 17.1C9.13 17.1 6.6 14.57 6.6 11.52C6.6 8.47 9.13 5.94 12.18 5.94C13.7 5.94 15.04 6.5 16.01 7.41L18.13 5.29C16.5 3.81 14.47 2.9 12.18 2.9C7.61 2.9 4 6.51 4 11.08C4 15.65 7.61 19.26 12.18 19.26C16.75 19.26 20.36 15.65 20.36 11.08C20.36 10.5 20.3 9.94 20.18 9.41H12.18V11.1H21.35Z" /></svg>
                  Sign in with Google (Demo)
                </button>
                <button type="button" className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 2h-11C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h11c1.38 0 2.5-1.12 2.5-2.5v-15C20 3.12 18.88 2 17.5 2zm-5.5 17c-.83 0-1.5-.67-1.5-1.5S11.17 16 12 16s1.5.67 1.5 1.5S12.83 19 12 19zm5-4H7V7h10v8z" /></svg>
                  Sign in with Microsoft (Demo)
                </button>
              </div>
            </div>
          </form>
          <div className="text-sm text-center mt-4">
            <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">Don't have an account? Sign Up</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}