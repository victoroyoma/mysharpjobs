import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, BriefcaseIcon, MessageSquareIcon, UserIcon, CreditCardIcon, BellIcon } from 'lucide-react';
import Button from '../../components/Button';
import { mockArtisans, mockJobs, getJobsByArtisan, getArtisanStats, getClientById } from '../../data/mockData';
export default function ArtisanDashboard() {
  // Using first artisan as current user for demo
  const currentArtisan = mockArtisans[0];
  const artisanJobs = getJobsByArtisan(currentArtisan.id);
  const stats = getArtisanStats(currentArtisan.id);
  const openJobs = mockJobs.filter(job => job.status === 'open' && job.artisanId !== currentArtisan.id).slice(0, 2);
  const ongoingJobs = artisanJobs.filter(job => job.status === 'in-progress');

  return <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="text-blue-600 text-xl font-bold">
            MySharpJobs
          </Link>
        </div>
        <div className="flex-grow flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link to="/artisan/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
              <HomeIcon className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/artisan/jobs" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <BriefcaseIcon className="mr-3 h-5 w-5 text-gray-400" />
              Jobs
            </Link>
            <Link to="/messages" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <MessageSquareIcon className="mr-3 h-5 w-5 text-gray-400" />
              Messages
            </Link>
            <Link to="/artisan/profile" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
              Profile
            </Link>
            <Link to="/artisan/payments" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
              <CreditCardIcon className="mr-3 h-5 w-5 text-gray-400" />
              Payments
            </Link>
          </nav>
        </div>
      </div>
      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-sm w-full fixed top-0 z-10">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="text-blue-600 text-xl font-bold">
            MySharpJobs
          </Link>
          <div className="flex items-center">
            <button className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-label="Open menu">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden h-16"></div>{' '}
        {/* Spacer for mobile header */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </div>
              </div>
              {/* Status Card */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-16 w-16 rounded-full" src={currentArtisan.avatar} alt="Profile" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentArtisan.name}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {currentArtisan.isVerified ? 'Verified' : 'Pending'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {currentArtisan.skills[0]} • {currentArtisan.experience} years experience
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        {currentArtisan.isAvailable ? 'Available for jobs' : 'Not available'}
                      </span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="toggle" defaultChecked={currentArtisan.isAvailable} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Job Offers */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Job Offers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Kitchen Cabinet Installation
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Posted 2 hours ago
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          New
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Need help installing custom kitchen cabinets in a new
                          home.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Client" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Sarah Johnson
                          </p>
                          <p className="text-xs text-gray-500">
                            Warri, Nigeria
                          </p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-sm font-medium text-gray-900">
                            ₦25,000
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                        <Button variant="secondary" size="sm">
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Furniture Repair
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Posted 5 hours ago
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          New
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Need to repair a broken dining table leg. Wood is
                          mahogany.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Client" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Michael Adams
                          </p>
                          <p className="text-xs text-gray-500">
                            Warri, Nigeria
                          </p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-sm font-medium text-gray-900">
                            ₦8,000
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <Button variant="primary" size="sm">
                          View Details
                        </Button>
                        <Button variant="secondary" size="sm">
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ongoing Jobs */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Ongoing Jobs
                </h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    <li>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              Office Desk Assembly
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Started May 10, 2023
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            In Progress
                          </span>
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="flex-shrink-0">
                            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Client" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Emma Wilson
                            </p>
                            <p className="text-xs text-gray-500">
                              Warri, Nigeria
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Button variant="primary" size="sm">
                              Update Status
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              Bookshelf Installation
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Started May 8, 2023
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            In Progress
                          </span>
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="flex-shrink-0">
                            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Client" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              David Chen
                            </p>
                            <p className="text-xs text-gray-500">
                              Warri, Nigeria
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Button variant="primary" size="sm">
                              Update Status
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>;
}