import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock, User, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SearchFilters {
  keyword: string;
  category: string;
  location: {
    coordinates: [number, number];
    radius: number;
    name: string;
  } | null;
  budgetRange: {
    min: number;
    max: number;
  } | null;
  rating: {
    min: number;
  } | null;
  skills: string[];
  availability: 'available' | 'busy' | 'offline' | '';
  verification: 'verified' | 'unverified' | '';
  sortBy: 'relevance' | 'rating' | 'price_low' | 'price_high' | 'distance' | 'newest';
}

interface SearchResult {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  bio?: string;
  category?: string;
  budget?: number;
  location?: string;
  rating?: number;
  userType?: 'client' | 'artisan';
  isVerified?: boolean;
  availability?: string;
  skills?: Array<{ name: string; level: string }>;
  distance?: number;
  createdAt?: string;
  profilePicture?: string;
  completedJobs?: number;
  totalJobs?: number;
}

interface SearchResponse {
  success: boolean;
  data: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  suggestions?: string[];
  facets?: any;
  searchTime: number;
}

const EnhancedSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  
  const [searchType, setSearchType] = useState<'jobs' | 'artisans'>('jobs');
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: null,
    budgetRange: null,
    rating: null,
    skills: [],
    availability: '',
    verification: '',
    sortBy: 'relevance'
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchFilters: SearchFilters, page: number = 1) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchFilters, page);
    }, 300);
  }, []);

  // Perform search API call
  const performSearch = async (searchFilters: SearchFilters, page: number = 1) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      
      // Add search parameters
      if (searchFilters.keyword) params.append('keyword', searchFilters.keyword);
      if (searchFilters.category) params.append('category', searchFilters.category);
      if (searchFilters.sortBy) params.append('sortBy', searchFilters.sortBy);
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());
      
      // Add location parameters
      if (searchFilters.location) {
        params.append('lat', searchFilters.location.coordinates[0].toString());
        params.append('lng', searchFilters.location.coordinates[1].toString());
        params.append('radius', searchFilters.location.radius.toString());
      }
      
      // Add budget range for jobs
      if (searchType === 'jobs' && searchFilters.budgetRange) {
        params.append('minBudget', searchFilters.budgetRange.min.toString());
        params.append('maxBudget', searchFilters.budgetRange.max.toString());
      }
      
      // Add rating filter for artisans
      if (searchType === 'artisans' && searchFilters.rating) {
        params.append('minRating', searchFilters.rating.min.toString());
      }
      
      // Add skills
      if (searchFilters.skills.length > 0) {
        params.append('skills', searchFilters.skills.join(','));
      }
      
      // Add artisan-specific filters
      if (searchType === 'artisans') {
        if (searchFilters.availability) params.append('availability', searchFilters.availability);
        if (searchFilters.verification) params.append('verification', searchFilters.verification);
      }

      const endpoint = searchType === 'jobs' ? '/api/search/jobs' : '/api/search/artisans';
      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data: SearchResponse = await response.json();
      
      if (data.success) {
        setResults(page === 1 ? data.data : [...results, ...data.data]);
        setPagination(data.pagination);
        setSuggestions(data.suggestions || []);
        setSearchTime(data.searchTime);
        
        // Update URL with search parameters
        const newParams = new URLSearchParams();
        if (searchFilters.keyword) newParams.set('q', searchFilters.keyword);
        if (searchFilters.category) newParams.set('category', searchFilters.category);
        setSearchParams(newParams);
      } else {
        showError('Search failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Search error:', error);
      showError('Search failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, keyword: value }));
    debouncedSearch({ ...filters, keyword: value });
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  // Handle search type change
  const handleSearchTypeChange = (type: 'jobs' | 'artisans') => {
    setSearchType(type);
    setResults([]);
    setPagination({ page: 1, limit: 20, total: 0, pages: 0 });
    debouncedSearch(filters);
  };

  // Load more results
  const loadMore = () => {
    if (pagination.page < pagination.pages && !loading) {
      performSearch(filters, pagination.page + 1);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format distance
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
  };

  // Initial search on mount
  useEffect(() => {
    if (filters.keyword || searchParams.get('q')) {
      performSearch(filters);
    }
  }, [searchType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Type Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleSearchTypeChange('jobs')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'jobs'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Briefcase className="inline w-4 h-4 mr-2" />
                Find Jobs
              </button>
              <button
                onClick={() => handleSearchTypeChange('artisans')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'artisans'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <User className="inline w-4 h-4 mr-2" />
                Find Artisans
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={`Search for ${searchType}...`}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Quick Stats */}
          {results.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Found {pagination.total} {searchType} in {searchTime}ms
              </span>
              {suggestions.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>Suggestions:</span>
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchChange(suggestion)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="painting">Painting</option>
                    <option value="welding">Welding</option>
                    <option value="masonry">Masonry</option>
                    <option value="gardening">Gardening</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="automobile">Automobile</option>
                    <option value="tailoring">Tailoring</option>
                  </select>
                </div>

                {/* Budget Range (for jobs) */}
                {searchType === 'jobs' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.budgetRange?.min || ''}
                        onChange={(e) => handleFilterChange('budgetRange', {
                          ...filters.budgetRange,
                          min: parseInt(e.target.value) || 0
                        })}
                        className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.budgetRange?.max || ''}
                        onChange={(e) => handleFilterChange('budgetRange', {
                          ...filters.budgetRange,
                          max: parseInt(e.target.value) || Number.MAX_SAFE_INTEGER
                        })}
                        className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Rating Filter (for artisans) */}
                {searchType === 'artisans' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating?.min || ''}
                      onChange={(e) => handleFilterChange('rating', 
                        e.target.value ? { min: parseFloat(e.target.value) } : null
                      )}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>
                )}

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                    {searchType === 'jobs' && (
                      <>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                      </>
                    )}
                    <option value="distance">Distance</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="flex-1">
            {loading && results.length === 0 ? (
              <div className="flex justify-center items-center py-16">
                <LoadingSpinner />
              </div>
            ) : results.length === 0 && filters.keyword ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((result) => (
                  <div
                    key={result._id}
                    onClick={() => navigate(
                      searchType === 'jobs' 
                        ? `/jobs/${result._id}` 
                        : `/artisans/${result._id}`
                    )}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {result.title || result.name}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {result.description || result.bio}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {result.category && (
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {result.category}
                            </span>
                          )}
                          
                          {result.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {result.location}
                              {result.distance && ` (${formatDistance(result.distance)})`}
                            </span>
                          )}
                          
                          {result.rating && (
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              {result.rating.toFixed(1)}
                            </span>
                          )}
                          
                          {result.createdAt && (
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(result.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        {result.budget && (
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {formatCurrency(result.budget)}
                          </div>
                        )}
                        
                        {result.isVerified && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            ✓ Verified
                          </span>
                        )}
                        
                        {result.availability && (
                          <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                            result.availability === 'available' 
                              ? 'bg-green-100 text-green-800'
                              : result.availability === 'busy'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {result.availability}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {pagination.page < pagination.pages && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Loading...</span>
                        </div>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchPage;
