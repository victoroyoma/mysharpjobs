import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { jobApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    urgency: 'normal',
    estimated_duration: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to post a job');
      navigate('/auth/login');
      return;
    }

    try {
      setLoading(true);
      
      const response = await jobApi.createJob({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        budget: Number(formData.budget),
        urgency: formData.urgency,
        estimated_duration: formData.estimated_duration || undefined
      });

      console.log('Job created:', response.data);
      alert('Job posted successfully!');
      navigate(`/jobs/${response.data.id}`);
    } catch (error: any) {
      console.error('Failed to create job:', error);
      alert(error.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Post a New Job
          </h1>
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="e.g., Kitchen Cabinet Installation" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                  rows={4} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="Describe what you need done..." 
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select 
                  id="category" 
                  name="category" 
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  required
                >
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
                <input 
                  type="number" 
                  id="budget" 
                  name="budget" 
                  value={formData.budget}
                  onChange={handleChange}
                  min="0" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="e.g., 25000" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="e.g., Warri, Nigeria" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Urgency
                  </label>
                  <select 
                    id="urgency" 
                    name="urgency" 
                    value={formData.urgency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estimated_duration" className="block text-sm font-medium text-gray-700">
                    Estimated Duration
                  </label>
                  <input 
                    type="text" 
                    id="estimated_duration" 
                    name="estimated_duration" 
                    value={formData.estimated_duration}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    placeholder="e.g., 2-3 hours" 
                  />
                </div>
              </div>
              <div>
                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading ? 'Posting Job...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}
