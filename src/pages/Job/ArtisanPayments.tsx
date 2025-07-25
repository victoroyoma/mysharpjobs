import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CreditCard, 
  Download,
  Search,
  CheckCircle,
  AlertCircle,
  Briefcase,
  User
} from 'lucide-react';
import { 
  getPaymentsByUser, 
  getJobById,
  getClientById,
  Payment,
  Job
} from '../../data/mockData';
import Button from '../../components/Button';

interface PaymentCardProps {
  payment: Payment;
  job?: Job;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, job }) => {
  const client = job ? getClientById(job.clientId) : null;
  
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'held': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'released': return 'bg-green-100 text-green-800 border-green-200';
      case 'refunded': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'held': return <AlertCircle className="w-4 h-4" />;
      case 'released': return <CheckCircle className="w-4 h-4" />;
      case 'refunded': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              ${payment.amount.toLocaleString()}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(payment.status)}`}>
              {getStatusIcon(payment.status)}
              {payment.status}
            </span>
          </div>
          
          {job && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{job.title}</span>
              </div>
              {client && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{client.name}</span>
                </div>
              )}
            </div>
          )}
          
          <p className="text-gray-700 text-sm">{payment.description}</p>
        </div>
        
        <div className="text-right text-sm text-gray-600">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span>{payment.method}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          {payment.transactionId && (
            <span>Transaction ID: {payment.transactionId}</span>
          )}
          {payment.processingFee && (
            <span className="ml-4">Fee: ${payment.processingFee}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Receipt
          </Button>
          {payment.status === 'held' && (
            <Button variant="primary" size="sm">
              Request Release
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ArtisanPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  // Mock artisan ID - in real app, this would come from auth context
  const artisanId = 'art-1';

  useEffect(() => {
    // Get artisan's payments
    const artisanPayments = getPaymentsByUser(artisanId);
    setPayments(artisanPayments);
  }, [artisanId]);

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.method.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      
      switch (timeFilter) {
        case 'week':
          matchesTime = (now.getTime() - paymentDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesTime = (now.getTime() - paymentDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case 'quarter':
          matchesTime = (now.getTime() - paymentDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesStatus && matchesSearch && matchesTime;
  });

  const statusCounts = {
    all: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    held: payments.filter(p => p.status === 'held').length,
    released: payments.filter(p => p.status === 'released').length,
    refunded: payments.filter(p => p.status === 'refunded').length,
  };

  const totalEarnings = payments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingEarnings = payments
    .filter(p => p.status === 'held')
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthEarnings = payments
    .filter(p => {
      const paymentDate = new Date(p.createdAt);
      const now = new Date();
      return p.status === 'released' && 
             paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Track your earnings, payment history, and financial analytics</p>
      </div>

      {/* Financial Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Earned</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${pendingEarnings.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Pending Earnings</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${thisMonthEarnings.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{payments.length}</h3>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search payments by description, transaction ID, or method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="secondary">
            Request Payout
          </Button>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'No payments match the selected filters'}
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => {
            const job = getJobById(payment.jobId);
            return (
              <PaymentCard 
                key={payment.id} 
                payment={payment} 
                job={job}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ArtisanPayments;
