import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
export default function SignUp() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [userType, setUserType] = useState(searchParams.get('type') || 'client');
  return <div className="min-h-screen flex flex-col">
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
          <div className="flex border-b border-gray-200">
            <button className={`flex-1 py-2 px-4 text-center ${userType === 'artisan' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setUserType('artisan')}>
              I'm an Artisan
            </button>
            <button className={`flex-1 py-2 px-4 text-center ${userType === 'client' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setUserType('client')}>
              I'm a Client
            </button>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input id="name" name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Full Name" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <input id="phone" name="phone" type="tel" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Phone Number" />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <select id="location" name="location" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm">
                  <option value="" disabled selected>
                    Select your location
                  </option>
                  <option value="warri">Warri, Nigeria</option>
                  <option value="lagos">Lagos, Nigeria</option>
                  <option value="abuja">Abuja, Nigeria</option>
                  <option value="port-harcourt">Port Harcourt, Nigeria</option>
                </select>
              </div>
              {userType === 'artisan' && <>
                  <div className="mb-4">
                    <label htmlFor="skills" className="sr-only">
                      Primary Skill
                    </label>
                    <select id="skills" name="skills" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm">
                      <option value="" disabled selected>
                        Select your primary skill
                      </option>
                      <option value="carpentry">Carpentry</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="painting">Painting</option>
                      <option value="masonry">Masonry</option>
                      <option value="welding">Welding</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="experience" className="sr-only">
                      Years of Experience
                    </label>
                    <input id="experience" name="experience" type="number" min="0" className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Years of Experience" />
                  </div>
                </>}
              <div className="mb-4">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input id="password" name="password" type="password" autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Confirm Password" />
              </div>
            </div>
            <div>
              <Button type="submit" variant="primary" fullWidth>
                Create Account
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
    </div>;
}