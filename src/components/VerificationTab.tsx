import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon
} from 'lucide-react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { adminApi } from '../utils/adminApi';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: string;
  created_at: string;
  verification_documents?: {
    id_card?: string;
    certificate?: string;
    proof_of_address?: string;
  };
}

interface VerificationTabProps {
  onRefresh?: () => void;
}

export default function VerificationTab({ onRefresh }: VerificationTabProps) {
  const [pendingVerifications, setPendingVerifications] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load pending verifications
  useEffect(() => {
    loadPendingVerifications();
  }, []);

  const loadPendingVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getPendingVerifications();
      setPendingVerifications(response.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending verifications');
      console.error('Error loading verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to approve ${userName}'s verification?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      setError(null);
      await adminApi.approveVerification(userId);
      
      // Show success message
      setSuccessMessage(`${userName} has been successfully verified!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh list
      await loadPendingVerifications();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to approve verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(selectedUser.id);
      setError(null);
      await adminApi.rejectVerification(selectedUser.id, rejectionReason);
      
      // Show success message
      setSuccessMessage(`${selectedUser.name}'s verification has been rejected.`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Close modal and reset
      setShowRejectModal(false);
      setSelectedUser(null);
      setRejectionReason('');
      
      // Refresh list
      await loadPendingVerifications();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to reject verification');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (user: PendingUser) => {
    setSelectedUser(user);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDocumentCount = (documents: any) => {
    if (!documents) return 0;
    return Object.keys(documents).filter(key => documents[key]).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Verifications</h2>
          <p className="text-gray-600 mt-1">
            Review and approve artisan verification requests
          </p>
        </div>
        <Button onClick={loadPendingVerifications} variant="secondary">
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
          <p className="text-green-800">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-3xl font-bold text-gray-900">{pendingVerifications.length}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Awaiting admin review</p>
            <p className="text-xs text-gray-400 mt-1">Process within 24-48 hours</p>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      {pendingVerifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ShieldCheckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Verifications</h3>
          <p className="text-gray-600">All verification requests have been processed!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingVerifications.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* User Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{user.type}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MailIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {user.location || 'Location not specified'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Submitted: {formatDate(user.created_at)}
                </div>
              </div>

              {/* Documents */}
              {user.verification_documents && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700">
                    <FileTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">
                      {getDocumentCount(user.verification_documents)} document(s) uploaded
                    </span>
                  </div>
                  {user.verification_documents.id_card && (
                    <p className="text-xs text-gray-500 ml-6 mt-1">• ID Card</p>
                  )}
                  {user.verification_documents.certificate && (
                    <p className="text-xs text-gray-500 ml-6">• Certificate</p>
                  )}
                  {user.verification_documents.proof_of_address && (
                    <p className="text-xs text-gray-500 ml-6">• Proof of Address</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {user.verification_documents && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(Object.values(user.verification_documents || {})[0] as string, '_blank')}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Docs
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(user.id, user.name)}
                  disabled={actionLoading === user.id}
                >
                  {actionLoading === user.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={() => openRejectModal(user)}
                  disabled={actionLoading === user.id}
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Verification</h3>
            </div>

            <p className="text-gray-600 mb-4">
              You are about to reject <strong>{selectedUser.name}</strong>'s verification request.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be sent to the user via email.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedUser(null);
                  setRejectionReason('');
                }}
                disabled={actionLoading === selectedUser.id}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleReject}
                disabled={actionLoading === selectedUser.id || !rejectionReason.trim()}
              >
                {actionLoading === selectedUser.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Confirm Reject'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
