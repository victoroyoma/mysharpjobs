import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon, CreditCardIcon, LockIcon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
export default function PaymentPage() {
  const {
    id
  } = useParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
    }, 1500);
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E88E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <Link to="/job/1" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                ← Back to job details
              </Link>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {!paymentSuccess ? <>
                  <div className="bg-blue-600 px-6 py-4">
                    <h1 className="text-xl font-bold text-white">
                      Payment for Job
                    </h1>
                    <p className="text-blue-100 text-sm">
                      Secure payment processing
                    </p>
                  </div>
                  <div className="p-6">
                    {/* Job Summary */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Job Summary
                      </h2>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Job Title:</span>
                        <span className="text-gray-900 font-medium">
                          Kitchen Cabinet Installation
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Artisan:</span>
                        <span className="text-gray-900 font-medium">
                          John Carpenter
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="text-gray-900">May 15, 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="text-gray-900 font-bold">₦25,000</span>
                      </div>
                    </div>
                    {/* Payment Form */}
                    <form onSubmit={handlePayment}>
                      <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Payment Method
                      </h2>
                      <div className="mb-5">
                        <div className="flex items-center mb-4">
                          <input id="payment-card" name="payment-method" type="radio" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <label htmlFor="payment-card" className="ml-3 flex items-center">
                            <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">
                              Credit/Debit Card
                            </span>
                          </label>
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                          <div>
                            <label htmlFor="card-number" className="sr-only">
                              Card number
                            </label>
                            <input id="card-number" name="card-number" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Card number" aria-label="Card number" />
                          </div>
                          <div className="flex">
                            <div className="w-1/2">
                              <label htmlFor="expiration-date" className="sr-only">
                                Expiration date
                              </label>
                              <input id="expiration-date" name="expiration-date" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="MM / YY" aria-label="Expiration date" />
                            </div>
                            <div className="w-1/2">
                              <label htmlFor="cvc" className="sr-only">
                                CVC
                              </label>
                              <input id="cvc" name="cvc" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-br-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="CVC" aria-label="CVC security code" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="flex items-center">
                          <LockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="text-xs text-gray-500">
                            Your payment information is secure. We use Paystack
                            for secure payment processing.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Total: <span className="font-bold">₦25,000</span>
                        </p>
                        <Button type="submit" variant="success" size="lg">
                          Pay Now
                        </Button>
                      </div>
                    </form>
                  </div>
                </> : <div className="p-8 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-green-600 font-medium mb-4">
                    Payment Held in Escrow
                  </p>
                  <p className="text-gray-600 mb-6">
                    Your payment of ₦25,000 has been successfully processed and
                    is being held in escrow. The funds will be released to the
                    artisan once you confirm that the job has been completed
                    satisfactorily.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Link to="/job/1">
                      <Button variant="primary" fullWidth>
                        View Job Details
                      </Button>
                    </Link>
                    <Link to="/client/dashboard">
                      <Button variant="secondary" fullWidth>
                        Return to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}