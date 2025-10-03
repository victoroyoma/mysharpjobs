import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
export default function ArtisanVerification() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'submitted', 'verified'
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus('submitted');
  };
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%231E88E5' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
      }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Artisan Verification
            </h1>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Verification Status
                </h2>
                <div className="flex items-center mb-6">
                  {verificationStatus === 'verified' ? <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Verified</span>
                    </div> : verificationStatus === 'submitted' ? <div className="flex items-center text-orange-500">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Pending Verification</span>
                    </div> : <div className="flex items-center text-red-500">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Not Verified</span>
                    </div>}
                </div>
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${verificationStatus === 'verified' ? 'bg-green-500 w-full' : verificationStatus === 'submitted' ? 'bg-orange-500 w-2/3' : 'bg-blue-600 w-1/3'}`}></div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {verificationStatus === 'verified' ? 'Congratulations! Your account has been verified. You can now receive job offers and payments.' : verificationStatus === 'submitted' ? 'Your documents have been submitted and are under review. This process typically takes 1-2 business days.' : 'To verify your account, please upload the required documents below. This helps build trust with clients and increases your chances of getting hired.'}
                </p>
              </div>
            </div>
            {verificationStatus === 'pending' && <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Upload Verification Documents
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Required Documents
                      </h3>
                      <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
                        <li>
                          Government-issued ID (National ID, Driver's License,
                          or Passport)
                        </li>
                        <li>
                          Proof of address (Utility bill not older than 3
                          months)
                        </li>
                        <li>
                          Professional certification or qualification (if
                          applicable)
                        </li>
                      </ul>
                      <div className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                        <div className="flex flex-col items-center">
                          <UploadIcon className={`h-10 w-10 ${dragActive ? 'text-blue-500' : 'text-gray-400'} mb-3`} />
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Click to upload</span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or PDF (max. 5MB)
                          </p>
                          <input type="file" multiple className="hidden" onChange={handleFileChange} id="file-upload" aria-label="Upload document" />
                          <label htmlFor="file-upload" className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Select Files
                          </label>
                        </div>
                      </div>
                    </div>
                    {uploadedFiles.length > 0 && <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Uploaded Files
                        </h3>
                        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                          {uploadedFiles.map((file, index) => <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 flex-1 truncate">
                                  {file.name}
                                </span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button type="button" onClick={() => removeFile(index)} className="font-medium text-red-600 hover:text-red-500">
                                  Remove
                                </button>
                              </div>
                            </li>)}
                        </ul>
                      </div>}
                    <div className="flex justify-end">
                      <Button type="submit" variant="primary" disabled={uploadedFiles.length === 0}>
                        Submit Documents
                      </Button>
                    </div>
                  </form>
                </div>
              </div>}
            {verificationStatus === 'submitted' && <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                    <ClockIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    Verification in Progress
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your documents are being reviewed by our team. This process
                    typically takes 1-2 business days. We'll notify you once the
                    verification is complete.
                  </p>
                  <Link to="/artisan/dashboard">
                    <Button variant="primary">Return to Dashboard</Button>
                  </Link>
                </div>
              </div>}
            {verificationStatus === 'verified' && <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    Verification Complete
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your account has been verified. You now have full access to
                    all features on MySharpJobs. Clients can see your verified
                    status, which increases trust and your chances of getting
                    hired.
                  </p>
                  <Link to="/artisan/dashboard">
                    <Button variant="primary">Return to Dashboard</Button>
                  </Link>
                </div>
              </div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}
