import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  SearchIcon, 
  FilterIcon, 
  MapPinIcon, 
  StarIcon, 
  CheckCircleIcon, 
  ChevronDownIcon, 
  NavigationIcon, 
  Maximize2Icon,
  Minimize2Icon
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Custom icons for client and artisans
const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const artisanIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map
function SetViewOnLoad({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
}

export default function MapSearchEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [radius, setRadius] = useState(10);
  const [minRating, setMinRating] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([6.5244, 3.3792]); // Default to Lagos
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  // Mock data for nearby artisans with enhanced information
  const nearbyArtisans = [
    {
      id: 1,
      name: 'John Carpenter',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skill: 'Carpentry',
      skills: ['Carpentry', 'Furniture Making', 'Door Installation'],
      experience: 5,
      rating: 4.0,
      reviews: 26,
      distance: 1.2,
      location: [6.5324, 3.3792] as [number, number],
      verified: true,
      phone: '+234 801 234 5678',
      isOnline: true,
      eta: '15 mins',
      hourlyRate: '₦5,000'
    },
    {
      id: 2,
      name: 'Michael Electrician',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skill: 'Electrical',
      skills: ['Electrical Wiring', 'Solar Installation', 'Appliance Repair'],
      experience: 7,
      rating: 5.0,
      reviews: 42,
      distance: 2.5,
      location: [6.5244, 3.3892] as [number, number],
      verified: true,
      phone: '+234 802 345 6789',
      isOnline: true,
      eta: '25 mins',
      hourlyRate: '₦6,500'
    },
    {
      id: 3,
      name: 'David Plumber',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skill: 'Plumbing',
      skills: ['Pipe Installation', 'Leak Repair', 'Drain Cleaning'],
      experience: 3,
      rating: 4.2,
      reviews: 18,
      distance: 3.8,
      location: [6.5144, 3.3722] as [number, number],
      verified: true,
      phone: '+234 803 456 7890',
      isOnline: false,
      eta: '45 mins',
      hourlyRate: '₦4,500'
    },
    {
      id: 4,
      name: 'Sarah Painter',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skill: 'Painting',
      skills: ['Interior Painting', 'Exterior Painting', 'Wall Decoration'],
      experience: 4,
      rating: 4.7,
      reviews: 31,
      distance: 4.2,
      location: [6.5044, 3.3692] as [number, number],
      verified: true,
      phone: '+234 804 567 8901',
      isOnline: true,
      eta: '35 mins',
      hourlyRate: '₦3,500'
    }
  ];

  const [filteredArtisans, setFilteredArtisans] = useState(nearbyArtisans);

  // Get user location on component mount and filter artisans
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLocationEnabled(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocationEnabled(false);
        }
      );
    }
  }, []);

  // Filter artisans based on search criteria
  useEffect(() => {
    let filtered = nearbyArtisans;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(artisan => 
        artisan.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        artisan.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(artisan => 
        artisan.skill.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by distance
    filtered = filtered.filter(artisan => artisan.distance <= radius);

    // Filter by rating
    if (minRating) {
      filtered = filtered.filter(artisan => artisan.rating >= parseFloat(minRating));
    }

    setFilteredArtisans(filtered);
  }, [searchTerm, selectedCategory, radius, minRating, nearbyArtisans]);

  const handleSearch = () => {
    console.log('Searching for:', { searchTerm, selectedCategory, radius, minRating });
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLocationEnabled(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocationEnabled(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header with sticky navigation and Find Artisans CTA */}
      <Header />
      
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Find Skilled Artisans Near You
            </h1>
            <p className="text-gray-600 mt-1">
              Discover verified professionals in your area with real-time location tracking
            </p>
          </div>

          {/* Enhanced Search and Filters - Mobile responsive */}
          <div className="sticky top-16 z-20 bg-white shadow-md rounded-lg mb-6">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Search Bar */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    placeholder="Search for artisans by skill (e.g., plumber, electrician)" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    aria-label="Search for artisans by skill" 
                  />
                </div>

                {/* Location Input */}
                <div className="relative min-w-0 lg:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    placeholder="Location (auto-detected)" 
                    value={locationInput} 
                    onChange={(e) => setLocationInput(e.target.value)} 
                  />
                  <button 
                    onClick={handleLocationDetect}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-500 ${
                      isLocationEnabled ? 'text-green-500' : 'text-gray-400'
                    }`}
                    aria-label="Detect current location"
                    title={isLocationEnabled ? 'Location detected' : 'Click to detect location'}
                  >
                    <NavigationIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Filter Toggle - Mobile collapsible */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
                    className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filters
                    <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isFiltersOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {/* Search Button - Blue #1E88E5 */}
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Collapsible Advanced Filters */}
              {isFiltersOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Skills Category
                    </label>
                    <select 
                      id="category" 
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="painting">Painting</option>
                      <option value="masonry">Masonry</option>
                      <option value="welding">Welding</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                      Search Radius
                    </label>
                    <select 
                      id="radius" 
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                      value={radius} 
                      onChange={(e) => setRadius(Number(e.target.value))}
                    >
                      <option value="5">5 km</option>
                      <option value="10">10 km</option>
                      <option value="20">20 km</option>
                      <option value="50">50 km</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Rating
                    </label>
                    <select 
                      id="rating" 
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                    >
                      <option value="">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Map Container with wave pattern background */}
          <div className={`bg-white shadow rounded-lg overflow-hidden mb-6 relative ${
            isMapExpanded ? 'h-[600px] lg:h-[700px]' : 'h-[300px] md:h-[400px] lg:h-[450px]'
          }`}>
            {/* Wave pattern background - MagicPattern's wave pattern (#E3F2FD) */}
            <div 
              className="absolute inset-0 bg-blue-50 opacity-10 z-0" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.24.19 1.64.39 1.84.39.78 0 1.76-.48 2.54-.65.46-.08 1.13.53 1.67.64.95.13 1.55-.53 2.28-.56.42-.01.8.16 1.26.33.37.13.77.33 1.22.3.45-.03.85-.35 1.25-.34.34.01.62.2.92.3.42.12.75-.13 1.07-.13.37 0 .72.3 1.07.28.39-.02.65-.32 1.03-.28.42.04.64.27 1.03.27.5 0 .8-.29 1.28-.3.4-.01.76.17 1.14.25.36.07.76.17 1.14.17.36 0 .7-.08 1.03-.17.36-.1.68-.18 1.16-.2.42-.01.75.18 1.1.19.63.01 1-.43 1.57-.5.4-.05.77.2 1.18.15.29-.04.58-.15.85-.23.57-.16 1.13-.3 1.68-.46.57-.16 1.13-.34 1.7-.46.5-.1 1.1-.34 1.62-.3.29.02.47.15.72.14.77-.04 1.46-.55 2.22-.53.86.03 1.72.38 2.6.48.79.09 1.62.04 2.36-.22.55-.19.98-.42 1.59-.5.3-.04.64.04.96.09.29.04.58.07.89.05.22-.02.4-.09.59-.15.4-.12.8-.3 1.2-.41.1-.03.21-.05.3-.1.38-.21.75-.46 1.22-.5.47-.03.93.12 1.37.17.34.04.68.05 1.01.08.84.1 1.72.14 2.62.25.37.05.72.16 1.1.15.45-.01.82-.26 1.29-.23.47.02.89.27 1.36.24.32-.02.6-.13.84-.27.67-.36 1.39-.64 1.9-1.19.22-.23.51-.4.79-.58.36-.21.72-.34 1.1-.49.66-.27 1.28-.48 1.95-.77.35-.16.7-.33 1.05-.48.2-.09.38-.21.58-.29.28-.12.58-.19.87-.31.19-.08.35-.19.55-.27.59-.24 1.21-.43 1.82-.64.18-.07.38-.13.55-.22.35-.18.64-.43 1.02-.59.18-.08.38-.11.58-.17.35-.11.67-.32 1.04-.36.29-.03.61.02.91.01.29-.01.6-.08.89-.08.33.01.65.04.98.08.21.02.43.05.64.09.91.17 1.83.32 2.63.3.52-.01 1.05-.13 1.58-.12.28 0 .55.05.82.1.23.05.45.11.68.11.24 0 .46-.09.7-.09.2 0 .4.05.6.11.4.12.85.09 1.26.17.29.06.54.21.82.29.5.14 1.08.11 1.62.16.19.02.4.08.58.11.22.04.43.02.64.05.41.06.85.12 1.27.13.47.01.92-.08 1.39-.04.33.02.65.11.98.12.38.01.76-.1 1.15-.05.26.03.5.15.76.16.34.01.66-.11 1-.1.31.01.61.1.93.12.67.04 1.32-.13 1.97-.1.36.02.71.1 1.07.11.32.01.61-.05.92-.01.36.06.69.18 1.08.14.58-.06 1.1-.35 1.71-.28.35.04.7.12 1.04.13.46.01.9-.1 1.36-.09.33.01.65.04.98.08.5.06 1.03.04 1.55.08.31.02.61.05.93.05.36-.01.72-.06 1.07-.14.2-.05.42-.14.63-.14.28 0 .55.1.83.1.32 0 .65-.1.96-.1.24 0 .47.06.71.1.47.08.93.02 1.4.1.35.06.72.09 1.07.16.2.04.36.16.56.14.67-.07 1.32-.19 1.97-.35.36-.09.74-.14 1.1-.23.44-.11.86-.27 1.31-.34.32-.05.64-.05.96-.13.19-.05.39-.1.58-.15.82-.22 1.65-.43 2.47-.66.27-.08.53-.18.8-.22.04-.01.09-.01.13-.02.59-.17 1.18-.34 1.76-.52.04-.01.09-.01.14-.02.25-.06.51-.1.76-.16.17-.04.32-.12.49-.15.84-.15 1.68-.32 2.52-.48.26-.05.53-.07.79-.13.2-.04.38-.12.58-.15.28-.04.56-.02.84-.05.06-.01.12-.02.18-.02.25-.03.51-.05.76-.09.13-.02.26-.06.39-.08.32-.04.65-.03.96-.1.42-.1.85-.2 1.29-.15.56.07 1.07.26 1.64.27.58.01 1.13-.15 1.7-.12.42.02.84.19 1.28.16.93-.06 1.84-.21 2.74-.46.21-.06.41-.15.62-.19.41-.08.81-.01 1.22-.1.24-.05.47-.14.72-.17.41-.05.84.02 1.25-.04.1-.01.2-.05.31-.05.52-.02 1.04.08 1.56.08.53-.01 1.04-.15 1.56-.12.35.02.7.1 1.05.11.25.01.49-.04.74-.05.36-.02.71.03 1.07.03.31 0 .62-.04.92-.1.17-.03.32-.1.49-.11.45-.03.92.12 1.38.11.62-.01 1.21-.19 1.82-.11.34.05.66.2 1.02.18.25-.01.49-.1.74-.11.42-.01.85.11 1.28.1.84-.03 1.65-.36 2.5-.3.35.03.7.11 1.04.19.24.06.47.16.72.19.64.08 1.28-.01 1.92 0 .29 0 .57.05.86.08.25.02.5.09.76.04.2-.04.36-.16.56-.18.67-.07 1.32.18 1.99.14.38-.02.76-.15 1.14-.13.28.01.55.09.83.12.49.05.97.14 1.46.09.12-.01.25 0 .37-.03.15-.03.27-.13.43-.14.34-.01.67.1 1.01.09.85-.03 1.71-.22 2.56-.14.38.03.75.17 1.13.16.45-.01.91-.13 1.36-.09.32.03.62.18.94.15.32-.03.61-.17.92-.18.36-.01.72.09 1.08.08.31-.01.62-.1.92-.05.47.07.89.32 1.38.28.32-.03.65-.1.96-.2.72-.23 1.41-.42 2.2-.36.35.03.68.14 1.02.19.25.04.52.01.78.06.36.07.7.2 1.07.2.45 0 .8-.25 1.24-.17.29.05.53.2.8.24.38.06.76 0 1.14.05.61.08 1.21.19 1.84.19.74.01 1.45-.25 2.18-.19.46.04.92.2 1.4.11.3-.06.54-.28.86-.27.14 0 .28.05.42.08.33.06.66.1.99.13.42.04.83.12 1.26.06.38-.05.72-.27 1.09-.4.13-.04.28-.04.42-.08.29-.07.57-.17.87-.24.49-.12 1-.2 1.51-.29.25-.04.49-.1.74-.11.5-.03.98.14 1.48.11.2-.01.41-.06.61-.08.28-.03.57-.02.85-.05.12-.01.24-.05.36-.05.32 0 .63.05.94.08.73.06 1.47.14 2.21.15.87.01 1.74-.11 2.61-.11.19 0 .37.03.56.03.73 0 1.46-.08 2.19-.08.54 0 1.07.07 1.61.06.73-.02 1.46-.12 2.19-.09.34.01.67.06 1.01.09.85.08 1.72.11 2.57.06.37-.02.73-.1 1.1-.08.41.03.82.18 1.23.18.52-.01 1.04-.14 1.56-.13.31.01.61.09.92.08.47-.01.92-.16 1.38-.21.29-.03.59-.02.88-.06.35-.05.68-.17 1.04-.17.7 0 1.36.29 2.05.28.84-.01 1.68-.26 2.52-.23.42.02.84.12 1.26.18.36.05.71.17 1.07.15.54-.03 1.07-.2 1.61-.19.39.01.79.12 1.18.11.54-.01 1.07-.2 1.61-.14.29.03.57.14.85.21.82.22 1.69.29 2.53.33.31.01.62-.02.92.01.14.01.27.05.41.06.35.02.7-.01 1.04.04.12.02.23.05.35.08.36.08.72.17 1.07.26.31.08.61.18.92.21.52.05 1.03-.12 1.56-.05.26.03.49.15.74.18.32.04.64-.01.96.01.96.07 1.91.19 2.86.39.32.07.62.21.94.25.64.09 1.28-.1 1.93-.02.29.03.57.11.86.16.83.14 1.68.2 2.52.25.3.02.59.03.88.08.16.03.31.08.47.1.35.04.7.02 1.04.08.25.04.49.14.74.15.31.01.61-.09.92-.07.5.03 1 .18 1.5.14.37-.03.71-.19 1.07-.27.27-.06.54-.09.81-.15.25-.06.49-.13.74-.18.57-.12 1.15-.21 1.72-.33.28-.06.55-.14.83-.19.45-.08.91-.09 1.36-.2.26-.07.49-.19.76-.22.54-.06 1.07.1 1.61.03.41-.05.78-.25 1.19-.28.49-.04.98.11 1.47.09.35-.01.69-.11 1.04-.09.27.02.52.13.79.13.34 0 .69-.08 1.03-.12.54-.06 1.07-.13 1.61-.16.31-.02.61.03.92.03.47 0 .93-.09 1.4-.04.26.03.49.15.75.18.2.02.42-.03.62-.03.83-.02 1.66.06 2.48.11.32.02.63.08.94.08.41 0 .83-.05 1.23-.12.24-.04.46-.14.7-.13.33.02.63.16.96.16.45 0 .85-.22 1.29-.23.58-.01 1.14.19 1.71.12.34-.04.65-.17.98-.26.29-.08.57-.19.87-.22.37-.04.74.02 1.1-.04.27-.05.51-.17.78-.21.36-.05.73-.01 1.09-.06.21-.03.41-.09.61-.14.62-.16 1.22-.38 1.85-.49.19-.03.39-.02.58-.06.27-.06.51-.2.78-.25.29-.05.58-.02.87-.08.07-.01.13-.04.2-.05.35-.06.7-.08 1.05-.15.18-.04.34-.12.52-.14.62-.07 1.24.08 1.87.01.19-.02.38-.07.56-.12.24-.06.48-.15.73-.18.43-.05.86.05 1.28.01.3-.03.58-.15.88-.16.41-.01.82.11 1.23.1.41-.01.82-.1 1.23-.11.43-.01.85.09 1.28.08.58-.02 1.15-.15 1.73-.09.32.03.62.16.94.13.64-.06 1.27-.24 1.91-.28.32-.02.64.04.96.03.35-.02.7-.1 1.04-.06.27.03.52.15.79.18.34.04.68-.02 1.02.01.85.08 1.72.03 2.55-.19.21-.06.43-.09.64-.17.22-.08.41-.2.64-.26.64-.17 1.3-.13 1.95-.24.29-.05.56-.16.84-.23.41-.1.83-.19 1.24-.29.4-.1.79-.21 1.19-.29.76-.14 1.52-.2 2.29-.32.32-.05.62-.16.94-.19.45-.04.91.04 1.36 0 .32-.03.62-.14.94-.14.79 0 1.57.24 2.35.15.33-.04.64-.16.96-.23.24-.05.47-.13.71-.14.65-.04 1.31.19 1.96.12.32-.03.62-.15.94-.16.34-.01.67.08 1.01.08.85 0 1.67-.24 2.52-.19.41.03.81.14 1.22.14.76 0 1.5-.24 2.25-.24.38 0 .76.09 1.14.09.83 0 1.67-.19 2.5-.19.42 0 .84.08 1.26.08.79 0 1.57-.19 2.35-.14.33.02.64.13.97.13.66 0 1.31-.2 1.97-.17.32.02.62.11.94.13.35.02.7-.04 1.05-.02.35.02.69.1 1.04.08.42-.02.82-.15 1.24-.17.63-.03 1.26.12 1.89.09.34-.02.67-.11 1.01-.1.34.01.68.07 1.02.07.83 0 1.66-.16 2.49-.16.83 0 1.67.16 2.5.16.42 0 .84-.08 1.26-.08.21 0 .41.05.62.05.42 0 .84-.09 1.26-.09.21 0 .41.05.62.05.21 0 .41-.05.62-.05.41 0 .83.08 1.24.08.62 0 1.24-.12 1.87-.12.31 0 .62.06.93.06.62 0 1.25-.12 1.87-.12.31 0 .62.06.93.06.93 0 1.86-.18 2.79-.18.31 0 .62.06.93.06.62 0 1.25-.12 1.87-.12.52 0 1.03.1 1.55.1.21 0 .41-.04.62-.04.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.72 0 1.45.14 2.17.14.52 0 1.03-.1 1.55-.1.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.52 0 1.03.1 1.55.1.1 0 .21-.02.31-.02.31 0 .62.06.93.06.52 0 1.03-.1 1.55-.1.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.72 0 1.45.14 2.17.14.31 0 .62-.06.93-.06.41 0 .83.08 1.24.08.1 0 .21-.02.31-.02.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.1 0 .21.02.31.02.31 0 .62-.06.93-.06.72 0 1.45.14 2.17.14.41 0 .83-.08 1.24-.08.1 0 .21.02.31.02.31 0 .62-.06.93-.06.31 0 .62.06.93.06.72 0 1.45-.14 2.17-.14.31 0 .62.06.93.06.31 0 .62-.06.93-.06.31 0 .62.06.93.06.31 0 .62-.06.93-.06.31 0 .62.06.93.06.31 0 .62-.06.93-.06.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.1 0 .21.02.31.02.31 0 .62-.06.93-.06.1 0 .21.02.31.02.41 0 .83-.08 1.24-.08.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.21 0 .41-.04.62-.04.31 0 .62.06.93.06.41 0 .83-.08 1.24-.08.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06.21 0 .41.04.62.04.31 0 .62-.06.93-.06' fill='%231E88E5' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
              }}
            ></div>
            
            <div className="h-full w-full z-10 relative">
              <MapContainer 
                center={userLocation} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }} 
                attributionControl={false} 
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* Client marker (green pin) */}
                <Marker position={userLocation} icon={clientIcon}>
                  <Popup>Your location</Popup>
                </Marker>
                
                {/* Artisan markers (blue pins with names) */}
                {filteredArtisans.map(artisan => (
                  <Marker key={artisan.id} position={artisan.location} icon={artisanIcon}>
                    <Popup>
                      <div className="text-center p-2">
                        <img src={artisan.image} alt={artisan.name} className="h-12 w-12 rounded-full mx-auto mb-2" />
                        <div className="font-medium text-gray-900">{artisan.name}</div>
                        <div className="text-sm text-gray-600">{artisan.skill}</div>
                        <div className="text-xs text-gray-500">{artisan.distance} km away</div>
                        <div className="text-xs text-green-600 font-medium">₹{artisan.hourlyRate}/hour</div>
                        <div className="mt-2">
                          <Link to={`/artisan/profile/${artisan.id}`}>
                            <Button variant="primary" size="sm">
                              Contact
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                <SetViewOnLoad coords={userLocation} />
              </MapContainer>
            </div>
            
            {/* Map controls */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
              <button 
                onClick={() => setIsMapExpanded(!isMapExpanded)} 
                className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                aria-label={isMapExpanded ? 'Collapse map' : 'Expand map'}
              >
                {isMapExpanded ? (
                  <Minimize2Icon className="h-5 w-5 text-gray-600" />
                ) : (
                  <Maximize2Icon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Results List - Card-based with grid pattern */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Found {filteredArtisans.length} Artisans Near You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredArtisans.map(artisan => (
              <div 
                key={artisan.id} 
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5F5F5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat'
                }}
              >
                <div className="p-6 bg-white bg-opacity-95">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <img className="h-16 w-16 rounded-full border-2 border-gray-200" src={artisan.image} alt={artisan.name} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{artisan.name}</h3>
                        {artisan.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{artisan.skill} • {artisan.experience} years experience</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {artisan.isOnline && (
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                            <span className="text-xs text-green-600">Online</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">ETA: {artisan.eta}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(artisan.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {artisan.rating} ({artisan.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{artisan.distance} km away</span>
                    </div>
                    
                    <div className="text-lg font-semibold text-blue-600">
                      {artisan.hourlyRate}/hour
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link to={`/artisan/profile/${artisan.id}`} className="flex-1">
                      <Button variant="primary" size="sm" fullWidth className="bg-blue-600 hover:bg-blue-700">
                        Contact
                      </Button>
                    </Link>
                    <Link to={`/messages?artisan=${artisan.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" fullWidth>
                        Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredArtisans.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <SearchIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">No artisans found matching your criteria</p>
                <p className="text-sm">Try adjusting your search filters or expanding your search radius</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
