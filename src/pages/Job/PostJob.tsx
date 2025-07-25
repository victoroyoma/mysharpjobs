import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
export default function PostJob() {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Post a New Job
          </h1>
          <div className="bg-white shadow rounded-lg p-6">
            <form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input type="text" id="title" name="title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Kitchen Cabinet Installation" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <textarea id="description" name="description" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Describe what you need done..." required></textarea>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select id="category" name="category" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
                  <option value="">Select a category</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="painting">Painting</option>
                  <option value="masonry">Masonry</option>
                  <option value="welding">Welding</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget (₦)
                </label>
                <input type="number" id="budget" name="budget" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 25000" required />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select id="location" name="location" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
                  <option value="">Select location</option>
                  <option value="warri">Warri, Nigeria</option>
                  <option value="lagos">Lagos, Nigeria</option>
                  <option value="abuja">Abuja, Nigeria</option>
                  <option value="port-harcourt">Port Harcourt, Nigeria</option>
                </select>
              </div>
              <div>
                <Button type="submit" variant="primary" fullWidth>
                  Post Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}