import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, MailIcon, PhoneIcon, ClockIcon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
export default function ClientProfile() {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 h-32 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 -mt-16">
                  <img className="h-24 w-24 rounded-full border-4 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                </div>
                <div className="ml-4 -mt-12">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sarah Johnson
                  </h2>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                    <p className="text-sm text-gray-600">Warri, Nigeria</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:-mt-12">
                <Button variant="warning" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Profile Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">
                  sarah.johnson@example.com
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">+234 801 234 5678</span>
              </li>
              <li className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">
                  Member since January 2023
                </span>
              </li>
            </ul>
          </div>
          {/* Job History */}
          <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Job History
            </h3>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200" role="list" aria-label="Job history list">
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Kitchen Cabinet Installation
                      </h4>
                      <div className="mt-1 flex items-center">
                        <p className="text-sm text-gray-600 mr-2">
                          John Carpenter
                        </p>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          In Progress
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₦25,000
                      </p>
                      <p className="text-xs text-gray-500">May 10, 2023</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link to="/job/1">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </li>
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Dining Table Repair
                      </h4>
                      <div className="mt-1 flex items-center">
                        <p className="text-sm text-gray-600 mr-2">
                          Michael Carpenter
                        </p>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₦8,000
                      </p>
                      <p className="text-xs text-gray-500">April 25, 2023</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link to="/job/2">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </li>
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Electrical Wiring
                      </h4>
                      <div className="mt-1 flex items-center">
                        <p className="text-sm text-gray-600 mr-2">
                          David Electrician
                        </p>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₦15,000
                      </p>
                      <p className="text-xs text-gray-500">March 15, 2023</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link to="/job/3">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}