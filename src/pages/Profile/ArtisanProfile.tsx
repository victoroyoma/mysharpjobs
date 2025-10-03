import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, StarIcon, CheckCircleIcon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
export default function ArtisanProfile() {
  const [isAvailable, setIsAvailable] = useState(true);
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 h-32 relative">
            {/* Background Pattern - Simplified */}
            <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E\")"
          }} />
          </div>
          {/* Profile content will go here */}
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 -mt-16">
                  <img className="h-24 w-24 rounded-full border-4 border-white" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                </div>
                <div className="ml-4 -mt-12">
                  <h2 className="text-2xl font-bold text-gray-900">
                    John Carpenter
                  </h2>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                    <p className="text-sm text-gray-600">Warri, Nigeria</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:-mt-12 flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  Available for jobs
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" name="toggle" id="toggle" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" />
                  <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Additional profile content can be added here */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skills Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Carpentry
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Furniture Making
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Cabinet Installation
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Wood Finishing
              </span>
            </div>
          </div>
          {/* Experience Section */}
          <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Experience
            </h3>
            <p className="text-gray-600 mb-4">
              Professional carpenter with 5+ years of experience specializing in
              custom furniture, cabinet installation, and general woodworking.
              Skilled in both traditional and modern techniques.
            </p>
            <div className="mt-4">
              <h4 className="text-base font-medium text-gray-900">
                Certifications
              </h4>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">
                    Advanced Woodworking - Lagos Craftsman Guild
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">
                    Furniture Design Certificate - National Institute
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}
