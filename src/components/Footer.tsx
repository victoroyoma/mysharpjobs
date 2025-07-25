import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer className="bg-white border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              MySharpJobs
            </h3>
            <p className="text-gray-600 text-sm">
              Connecting skilled artisans with clients for localized services.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-blue-600 text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-blue-600 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} MySharpJobs. All rights reserved.
          </p>
        </div>
      </div>
      {/* Feedback Button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg" aria-label="Give feedback">
          Feedback
        </button>
      </div>
    </footer>;
}