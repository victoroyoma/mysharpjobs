import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, MapPinIcon, StarIcon, CheckCircleIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Find Skilled Artisans
          </h1>
          {/* Search and Filter Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search by skill or keyword" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              {/* Category Filter */}
              <div>
                <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="painting">Painting</option>
                  <option value="masonry">Masonry</option>
                  <option value="welding">Welding</option>
                </select>
              </div>
              {/* Location Filter */}
              <div>
                <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="">All Locations</option>
                  <option value="warri">Warri, Nigeria</option>
                  <option value="lagos">Lagos, Nigeria</option>
                  <option value="abuja">Abuja, Nigeria</option>
                  <option value="port-harcourt">Port Harcourt, Nigeria</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Advanced Filters</span>
              </div>
              <Button variant="primary" size="sm">
                Search
              </Button>
            </div>
          </div>
          {/* Search Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Artisan Card 1 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Artisan" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        John Carpenter
                      </h2>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Carpentry • 5 years experience
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      4.0 (26 reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>Warri, Nigeria</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Cabinets
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Furniture Repair
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Custom Woodwork
                  </span>
                </div>
                <div className="mt-5 flex space-x-3">
                  <Link to="/artisan/profile/1" className="flex-1">
                    <Button variant="primary" size="sm" fullWidth>
                      View Profile
                    </Button>
                  </Link>
                  <Link to="/post-job" className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth>
                      Hire Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* Artisan Card 2 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Artisan" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        Michael Electrician
                      </h2>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Electrical • 7 years experience
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      5.0 (42 reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>Warri, Nigeria</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Wiring
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Lighting
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Electrical Repairs
                  </span>
                </div>
                <div className="mt-5 flex space-x-3">
                  <Link to="/artisan/profile/2" className="flex-1">
                    <Button variant="primary" size="sm" fullWidth>
                      View Profile
                    </Button>
                  </Link>
                  <Link to="/post-job" className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth>
                      Hire Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* Artisan Card 3 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Artisan" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        David Plumber
                      </h2>
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Plumbing • 3 years experience
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      4.2 (18 reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>Warri, Nigeria</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Pipe Fitting
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Bathroom Fixtures
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Leak Repairs
                  </span>
                </div>
                <div className="mt-5 flex space-x-3">
                  <Link to="/artisan/profile/3" className="flex-1">
                    <Button variant="primary" size="sm" fullWidth>
                      View Profile
                    </Button>
                  </Link>
                  <Link to="/post-job" className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth>
                      Hire Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </a>
              <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                2
              </a>
              <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium">
                3
              </a>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                8
              </a>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}