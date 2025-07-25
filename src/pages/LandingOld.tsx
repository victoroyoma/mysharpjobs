import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, LockIcon, BadgeCheckIcon, HomeIcon, BriefcaseIcon, StarIcon, UsersIcon, ShieldCheckIcon, ClockIcon, TrendingUpIcon, PlayCircleIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 opacity-20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 opacity-15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-6">
                <TrendingUpIcon className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">Trusted by 10,000+ professionals</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Connect with Local 
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"> Artisans</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Find skilled carpenters, electricians, plumbers, and more in your area. 
                Get your projects done by verified professionals with real-time tracking.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup?type=client" className="group">
                  <Button variant="warning" size="lg" className="w-full sm:w-auto group-hover:scale-105 transition-transform duration-200 shadow-2xl">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    Hire Professionals
                  </Button>
                </Link>
                <Link to="/signup?type=artisan" className="group">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto group-hover:scale-105 transition-transform duration-200 shadow-xl">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    Join as Artisan
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-blue-200">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-blue-200">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl blur-xl opacity-30 scale-110"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Professional artisan at work" 
                  className="relative rounded-2xl shadow-2xl max-w-full h-auto max-h-96 object-cover" 
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose MySharpJobs?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with proven processes to deliver 
              exceptional results for both clients and artisans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Local Matching */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPinIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-blue-500 rounded-2xl w-16 h-16 opacity-20 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Local Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered algorithm connects you with the best artisans in your area, 
                considering skills, availability, and proximity for optimal matches.
              </p>
            </div>

            {/* Feature 2 - Secure Payments */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-green-500 rounded-2xl w-16 h-16 opacity-20 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Secure Escrow System
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-level security with milestone-based payments. Your money is protected 
                until each project phase is completed to your satisfaction.
              </p>
            </div>

            {/* Feature 3 - Verified Artisans */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BadgeCheckIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-orange-500 rounded-2xl w-16 h-16 opacity-20 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Verified Professionals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every artisan undergoes thorough background checks, skill verification, 
                and customer review validation before joining our platform.
              </p>
            </div>

            {/* Feature 4 - Real-time Tracking */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ClockIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-purple-500 rounded-2xl w-16 h-16 opacity-20 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Live Project Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor progress in real-time with GPS tracking, photo updates, 
                and milestone notifications throughout your project.
              </p>
            </div>

            {/* Feature 5 - Quality Assurance */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-red-500 rounded-2xl w-16 h-16 opacity-20 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quality Guarantee
              </h3>
              <p className="text-gray-600 leading-relaxed">
                100% satisfaction guarantee with quality assurance checks, 
                customer support, and project completion warranties.
              </p>
            </div>

            {/* Feature 6 - Community */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-indigo-500 rounded-2xl w-16 h-16 opacity-20 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Thriving Community
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of satisfied customers and skilled artisans 
                building lasting relationships and growing together.
              </p>
            </div>
          </div>
        </div>
      </section>
      </section>
      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect artisans with clients for successful
              projects.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Artisans */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <div className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  For Artisans
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      Create Your Profile
                    </h4>
                    <p className="text-gray-600">
                      Showcase your skills, experience, and portfolio to stand
                      out.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      Get Verified
                    </h4>
                    <p className="text-gray-600">
                      Complete our verification process to build trust with
                      clients.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      Receive Job Offers
                    </h4>
                    <p className="text-gray-600">
                      Get notified when clients are looking for your skills in
                      your area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* For Clients */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <HomeIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  For Clients
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-orange-500 font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      Post a Job
                    </h4>
                    <p className="text-gray-600">
                      Describe what you need, set your budget, and specify your
                      location.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-orange-500 font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      Review Artisans
                    </h4>
                    <p className="text-gray-600">
                      Browse profiles, reviews, and portfolios to find the
                      perfect match.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <span className="text-orange-500 font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      Hire and Pay Securely
                    </h4>
                    <p className="text-gray-600">
                      Use our secure platform to communicate and pay for
                      completed work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join MySharpJobs today and connect with skilled artisans or find new
            clients for your services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup?type=artisan">
              <Button variant="secondary" size="lg">
                Sign Up as Artisan
              </Button>
            </Link>
            <Link to="/signup?type=client">
              <Button variant="warning" size="lg">
                Sign Up as Client
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}