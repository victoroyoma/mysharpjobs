
import { Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
export default function Verification() {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Account Verification
          </h1>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your email has been successfully verified.
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Phone Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your phone number has been successfully verified.
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    ID Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    Please upload a government-issued ID to verify your
                    identity.
                  </p>
                  <div className="mt-4">
                    <Button variant="secondary" size="sm">
                      Upload ID
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircleIcon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Skills Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your skills verification is in progress. We'll notify you
                    once it's complete.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Verification progress: 2/4 complete
                  </p>
                  <div className="mt-2 w-48 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{
                    width: '50%'
                  }}></div>
                  </div>
                </div>
                <Button variant="primary">Continue Verification</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}
