import React from 'react';
import { Link } from 'react-router-dom';
import { User, Star, Briefcase, DollarSign } from 'lucide-react';
import Button from '../Button';

interface Artisan {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  skills: string[];
}

interface Application {
  artisan_id: number;
  proposal: string;
  amount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  artisan?: Artisan;
}

interface ApplicationCardProps {
  application: Application;
  onAccept: (artisanId: number) => void;
  onReject: (artisanId: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onAccept, onReject }) => {
  const { artisan, proposal, amount, status } = application;

  if (!artisan) {
    return <div className="bg-red-100 p-4 rounded-lg">Artisan data is missing for this application.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <img 
          src={artisan.avatar || 'https://via.placeholder.com/150'} 
          alt={artisan.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <Link to={`/artisans/${artisan.id}`} className="text-lg font-bold text-blue-600 hover:underline">
              {artisan.name}
            </Link>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">{artisan.rating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Briefcase className="w-4 h-4" />
            <span>{artisan.skills?.join(', ') || 'No skills listed'}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 my-4">{proposal}</p>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        {amount && (
          <div className="flex items-center gap-2 text-green-600">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold text-lg">₦{amount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex gap-3">
          {status === 'pending' ? (
            <>
              <Button variant="danger" size="sm" onClick={() => onReject(artisan.id)}>Reject</Button>
              <Button variant="primary" size="sm" onClick={() => onAccept(artisan.id)}>Accept</Button>
            </>
          ) : (
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
