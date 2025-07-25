// Enhanced Mock data for MVP presentation - MySharpJob Platform

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'artisan' | 'client';
  avatar: string;
  location: string;
  joinedDate: string;
  isVerified: boolean;
  phone?: string;
  lastActive?: string;
}

export interface Artisan extends User {
  type: 'artisan';
  skills: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  hourlyRate: number;
  isAvailable: boolean;
  bio: string;
  certifications: string[];
  portfolioImages: string[];
  responseTime?: string;
  workingHours?: string;
  serviceRadius?: number;
  preferredCategories?: string[];
  emergencyService?: boolean;
  insuranceVerified?: boolean;
}

export interface Client extends User {
  type: 'client';
  jobsPosted: number;
  totalSpent: number;
  preferredPaymentMethod?: string;
  businessType?: string;
  companyName?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  clientId: string;
  artisanId?: string;
  createdAt: string;
  deadline?: string;
  requirements: string[];
  applicants: string[];
  completionDate?: string;
  rating?: number;
  review?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration?: string;
  materials?: string[];
  safetyRequirements?: string[];
  contactPreference?: 'phone' | 'message' | 'email';
  images?: string[];
  coordinates?: [number, number];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  jobId?: string;
  isRead: boolean;
  messageType?: 'text' | 'image' | 'file' | 'location';
  attachments?: string[];
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number;
  status: 'pending' | 'held' | 'released' | 'refunded';
  createdAt: string;
  description: string;
  method: string;
  transactionId?: string;
  escrowReleaseDate?: string;
  processingFee?: number;
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulVotes?: number;
  images?: string[];
  response?: string;
  responseDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'job_application' | 'job_update' | 'payment' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Enhanced Mock Artisans with diverse skills and backgrounds
export const mockArtisans: Artisan[] = [
  {
    id: 'art-1',
    name: 'John Carpenter',
    email: 'john.carpenter@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Warri, Nigeria',
    joinedDate: '2023-01-15',
    isVerified: true,
    phone: '+234 801 234 5678',
    lastActive: '2024-07-10T14:30:00Z',
    skills: ['Carpentry', 'Cabinet Installation', 'Furniture Making', 'Wood Finishing', 'Custom Furniture'],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 145,
    hourlyRate: 3500,
    isAvailable: true,
    bio: 'Master carpenter with 8+ years experience in bespoke furniture making and cabinet installation. Specializing in modern and traditional woodworking techniques. I take pride in delivering exceptional craftsmanship that stands the test of time.',
    certifications: ['Certified Master Carpenter', 'Safety Training Certificate', 'Advanced Woodworking Certificate'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'
    ],
    responseTime: 'Within 30 minutes',
    workingHours: '7:00 AM - 6:00 PM',
    serviceRadius: 25,
    preferredCategories: ['carpentry', 'furniture'],
    emergencyService: false,
    insuranceVerified: true
  },
  {
    id: 'art-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Lagos, Nigeria',
    joinedDate: '2022-08-20',
    isVerified: true,
    phone: '+234 802 345 6789',
    lastActive: '2024-07-10T16:45:00Z',
    skills: ['Electrical Work', 'Solar Installation', 'Home Automation', 'Industrial Wiring', 'Emergency Repairs'],
    experience: 12,
    rating: 4.8,
    reviewCount: 203,
    completedJobs: 289,
    hourlyRate: 4200,
    isAvailable: true,
    bio: 'Licensed master electrician with extensive experience in residential, commercial, and solar installations. Committed to safety, efficiency, and staying current with latest electrical codes and green energy solutions.',
    certifications: ['Licensed Master Electrician', 'Solar Installation Certificate', 'Industrial Safety Certificate', 'Smart Home Specialist'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'
    ],
    responseTime: 'Within 15 minutes',
    workingHours: '24/7 Emergency Service',
    serviceRadius: 40,
    preferredCategories: ['electrical', 'solar'],
    emergencyService: true,
    insuranceVerified: true
  },
  {
    id: 'art-3',
    name: 'David Plumber',
    email: 'david.plumber@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Abuja, Nigeria',
    joinedDate: '2023-03-10',
    isVerified: true,
    phone: '+234 803 456 7890',
    lastActive: '2024-07-10T12:20:00Z',
    skills: ['Plumbing', 'Pipe Installation', 'Water Heater Service', 'Drainage Systems', 'Bathroom Renovations'],
    experience: 6,
    rating: 4.7,
    reviewCount: 89,
    completedJobs: 156,
    hourlyRate: 3200,
    isAvailable: true,
    bio: 'Professional plumber specializing in modern plumbing systems, emergency repairs, and bathroom renovations. Known for reliable service and thorough problem-solving approach.',
    certifications: ['Licensed Plumber', 'Gas Fitting Certificate', 'Water Systems Specialist'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'
    ],
    responseTime: 'Within 1 hour',
    workingHours: '6:00 AM - 8:00 PM',
    serviceRadius: 30,
    preferredCategories: ['plumbing'],
    emergencyService: true,
    insuranceVerified: true
  },
  {
    id: 'art-4',
    name: 'Michael Painter',
    email: 'michael.painter@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Port Harcourt, Nigeria',
    joinedDate: '2022-11-05',
    isVerified: true,
    phone: '+234 804 567 8901',
    lastActive: '2024-07-10T10:15:00Z',
    skills: ['Interior Painting', 'Exterior Painting', 'Decorative Finishes', 'Color Consultation', 'Wallpaper Installation'],
    experience: 7,
    rating: 4.6,
    reviewCount: 134,
    completedJobs: 198,
    hourlyRate: 2800,
    isAvailable: true,
    bio: 'Creative painting professional with expertise in residential and commercial projects. Passionate about color theory and creating beautiful, lasting finishes.',
    certifications: ['Paint Contractor License', 'Color Theory Certificate', 'Surface Preparation Specialist'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
      'https://images.unsplash.com/photo-1556909114-3c6ac97e0c82?w=400',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'
    ],
    responseTime: 'Within 2 hours',
    workingHours: '8:00 AM - 5:00 PM',
    serviceRadius: 20,
    preferredCategories: ['painting'],
    emergencyService: false,
    insuranceVerified: true
  },
  {
    id: 'art-5',
    name: 'Ahmed Welder',
    email: 'ahmed.welder@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Kano, Nigeria',
    joinedDate: '2023-02-18',
    isVerified: true,
    phone: '+234 805 678 9012',
    lastActive: '2024-07-10T15:45:00Z',
    skills: ['Arc Welding', 'MIG Welding', 'TIG Welding', 'Metal Fabrication', 'Security Gates', 'Structural Steel'],
    experience: 10,
    rating: 4.8,
    reviewCount: 76,
    completedJobs: 123,
    hourlyRate: 3800,
    isAvailable: true,
    bio: 'Expert welder and metal fabricator with a decade of experience in structural welding, custom metalwork, and security installations. Precision and safety are my priorities.',
    certifications: ['Certified Professional Welder', 'Structural Welding Certificate', 'Safety Management Certificate'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
    ],
    responseTime: 'Within 45 minutes',
    workingHours: '7:00 AM - 6:00 PM',
    serviceRadius: 35,
    preferredCategories: ['welding', 'metalwork'],
    emergencyService: false,
    insuranceVerified: true
  },
  {
    id: 'art-6',
    name: 'Grace Mason',
    email: 'grace.mason@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Ibadan, Nigeria',
    joinedDate: '2023-04-22',
    isVerified: true,
    phone: '+234 806 789 0123',
    lastActive: '2024-07-10T13:30:00Z',
    skills: ['Brickwork', 'Stone Masonry', 'Concrete Work', 'Block Laying', 'Pointing & Repointing'],
    experience: 9,
    rating: 4.5,
    reviewCount: 58,
    completedJobs: 87,
    hourlyRate: 3000,
    isAvailable: true,
    bio: 'Skilled mason specializing in traditional and modern building techniques. Experienced in residential and commercial construction projects.',
    certifications: ['Certified Mason', 'Construction Safety Certificate'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'
    ],
    responseTime: 'Within 1 hour',
    workingHours: '6:00 AM - 5:00 PM',
    serviceRadius: 25,
    preferredCategories: ['masonry', 'construction'],
    emergencyService: false,
    insuranceVerified: false
  },
  {
    id: 'art-7',
    name: 'James Gardener',
    email: 'james.gardener@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Benin City, Nigeria',
    joinedDate: '2023-06-10',
    isVerified: true,
    phone: '+234 807 890 1234',
    lastActive: '2024-07-10T08:20:00Z',
    skills: ['Landscape Design', 'Garden Maintenance', 'Tree Pruning', 'Irrigation Systems', 'Lawn Care'],
    experience: 5,
    rating: 4.7,
    reviewCount: 92,
    completedJobs: 156,
    hourlyRate: 2500,
    isAvailable: true,
    bio: 'Passionate landscape gardener with expertise in creating and maintaining beautiful outdoor spaces. Specializing in sustainable gardening practices.',
    certifications: ['Horticulture Certificate', 'Irrigation Specialist'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400'
    ],
    responseTime: 'Within 4 hours',
    workingHours: '6:00 AM - 4:00 PM',
    serviceRadius: 20,
    preferredCategories: ['gardening', 'landscaping'],
    emergencyService: false,
    insuranceVerified: false
  },
  {
    id: 'art-8',
    name: 'Mary Cleaner',
    email: 'mary.cleaner@example.com',
    type: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Enugu, Nigeria',
    joinedDate: '2023-05-15',
    isVerified: true,
    phone: '+234 808 901 2345',
    lastActive: '2024-07-10T11:40:00Z',
    skills: ['Deep Cleaning', 'Office Cleaning', 'Post-Construction Cleanup', 'Carpet Cleaning', 'Window Cleaning'],
    experience: 4,
    rating: 4.9,
    reviewCount: 167,
    completedJobs: 234,
    hourlyRate: 2200,
    isAvailable: true,
    bio: 'Professional cleaning specialist committed to providing thorough and reliable cleaning services for homes and offices. Attention to detail is my strength.',
    certifications: ['Professional Cleaning Certificate', 'Safety Training'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400'
    ],
    responseTime: 'Within 3 hours',
    workingHours: '7:00 AM - 7:00 PM',
    serviceRadius: 15,
    preferredCategories: ['cleaning'],
    emergencyService: true,
    insuranceVerified: true
  }
];

// Enhanced Mock Clients with diverse backgrounds and needs
export const mockClientsOriginal: Client[] = [
  {
    id: 'cli-1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Warri, Nigeria',
    joinedDate: '2023-04-12',
    isVerified: true,
    phone: '+234 901 234 5678',
    lastActive: '2024-07-10T16:20:00Z',
    jobsPosted: 15,
    totalSpent: 280000,
    preferredPaymentMethod: 'Credit Card',
    businessType: 'Individual',
    companyName: undefined
  },
  {
    id: 'cli-2',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Lagos, Nigeria',
    joinedDate: '2023-01-28',
    isVerified: true,
    phone: '+234 902 345 6789',
    lastActive: '2024-07-10T14:45:00Z',
    jobsPosted: 23,
    totalSpent: 475000,
    preferredPaymentMethod: 'Bank Transfer',
    businessType: 'Small Business',
    companyName: 'Johnson Interiors Ltd.'
  },
  {
    id: 'cli-3',
    name: 'David Chen',
    email: 'david.chen@example.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Abuja, Nigeria',
    joinedDate: '2022-12-15',
    isVerified: true,
    phone: '+234 903 456 7890',
    lastActive: '2024-07-10T13:30:00Z',
    jobsPosted: 31,
    totalSpent: 650000,
    preferredPaymentMethod: 'Corporate Account',
    businessType: 'Corporation',
    companyName: 'Chen Properties Development'
  },
  {
    id: 'cli-4',
    name: 'Adaora Okafor',
    email: 'adaora.okafor@example.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Port Harcourt, Nigeria',
    joinedDate: '2023-06-08',
    isVerified: true,
    phone: '+234 904 567 8901',
    lastActive: '2024-07-10T12:15:00Z',
    jobsPosted: 7,
    totalSpent: 120000,
    preferredPaymentMethod: 'Mobile Money',
    businessType: 'Individual',
    companyName: undefined
  },
  {
    id: 'cli-5',
    name: 'Michael Thompson',
    email: 'michael.thompson@example.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Kano, Nigeria',
    joinedDate: '2023-03-22',
    isVerified: true,
    phone: '+234 905 678 9012',
    lastActive: '2024-07-10T11:30:00Z',
    jobsPosted: 19,
    totalSpent: 385000,
    preferredPaymentMethod: 'Credit Card',
    businessType: 'Small Business',
    companyName: 'Thompson Construction Services'
  },
  {
    id: 'cli-6',
    name: 'Fatima Abdullahi',
    email: 'fatima.abdullahi@example.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Ibadan, Nigeria',
    joinedDate: '2023-05-18',
    isVerified: false,
    phone: '+234 906 789 0123',
    lastActive: '2024-07-10T10:45:00Z',
    jobsPosted: 4,
    totalSpent: 75000,
    preferredPaymentMethod: 'Bank Transfer',
    businessType: 'Individual',
    companyName: undefined
  }
];

// Enhanced Mock Jobs with comprehensive details and varied statuses
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Premium Kitchen Cabinet Installation',
    description: 'Looking for an experienced carpenter to install custom-made premium kitchen cabinets in our newly renovated home. The project includes 12 upper cabinets, 10 lower cabinets, and a kitchen island. All cabinets are pre-assembled and delivered. Need professional installation with precise measurements and secure mounting. Hardware, brackets, and installation materials provided.',
    category: 'carpentry',
    budget: 35000,
    location: 'Warri, Nigeria',
    status: 'in-progress',
    clientId: 'cli-1',
    artisanId: 'art-1',
    createdAt: '2024-07-08T10:00:00Z',
    deadline: '2024-07-15T17:00:00Z',
    requirements: ['Minimum 5 years cabinet installation experience', 'Professional tools required', 'Available for weekend work', 'References from previous clients'],
    applicants: ['art-1', 'art-2', 'art-6'],
    priority: 'medium',
    estimatedDuration: '3-4 days',
    materials: ['Cabinet mounting brackets', 'Screws and fasteners', 'Shims and leveling tools'],
    safetyRequirements: ['Safety glasses', 'Work gloves', 'Non-slip shoes'],
    contactPreference: 'phone',
    images: ['https://images.unsplash.com/photo-1556909114-3c6ac97e0c82?w=600'],
    coordinates: [5.5157, 5.7546]
  },
  {
    id: 'job-2',
    title: 'Complete Office Electrical Installation',
    description: 'Comprehensive electrical installation for new 200sqm office space. Project includes installation of power outlets, lighting circuits, data cable conduits, emergency lighting, and electrical panel setup. Must comply with Nigerian electrical safety standards and building codes. Final inspection and certification required.',
    category: 'electrical',
    budget: 75000,
    location: 'Lagos, Nigeria',
    status: 'open',
    clientId: 'cli-2',
    createdAt: '2024-07-09T14:30:00Z',
    deadline: '2024-07-25T17:00:00Z',
    requirements: ['Licensed master electrician', 'Commercial electrical experience', 'Safety certification', 'Insurance coverage', 'Provide detailed materials list and cost breakdown'],
    applicants: ['art-2'],
    priority: 'high',
    estimatedDuration: '5-7 days',
    materials: ['Electrical cables and wires', 'Circuit breakers', 'Outlets and switches', 'Conduits and junction boxes', 'Emergency lighting fixtures'],
    safetyRequirements: ['Electrical safety equipment', 'Insulated tools', 'Safety harness for elevated work'],
    contactPreference: 'email',
    images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600'],
    coordinates: [6.5244, 3.3792]
  },
  {
    id: 'job-3',
    title: 'Master Bathroom Renovation - Plumbing',
    description: 'Complete plumbing renovation for master bathroom including removal of old fixtures and installation of new high-end bathroom suite. Scope includes new bathtub, walk-in shower, double vanity, toilet, and all associated plumbing connections. Bathroom is 4m x 3m with existing rough plumbing.',
    category: 'plumbing',
    budget: 28000,
    location: 'Abuja, Nigeria',
    status: 'completed',
    clientId: 'cli-3',
    artisanId: 'art-3',
    createdAt: '2024-06-28T09:00:00Z',
    completionDate: '2024-07-05T16:00:00Z',
    requirements: ['Licensed plumber', 'Bathroom renovation experience', 'Knowledge of modern fixtures', 'Clean work practices'],
    applicants: ['art-3'],
    rating: 5,
    review: 'Outstanding work! David was professional, punctual, and delivered exceptional quality. The bathroom looks amazing and everything works perfectly. Highly recommended!',
    priority: 'medium',
    estimatedDuration: '4-5 days',
    materials: ['PVC and copper pipes', 'Bathroom fixtures', 'Faucets and valves', 'Waterproofing materials'],
    safetyRequirements: ['Waterproof workwear', 'Knee protection'],
    contactPreference: 'phone',
    coordinates: [9.0579, 7.4951]
  },
  {
    id: 'job-4',
    title: 'Interior House Painting - 3 Bedroom Apartment',
    description: 'Professional interior painting for modern 3-bedroom apartment. Includes living room, dining area, kitchen, 3 bedrooms, 2 bathrooms, and hallways. Walls require light preparation, priming, and two coats of premium paint. Client wants color consultation and eco-friendly paint options. Total area approximately 150 square meters.',
    category: 'painting',
    budget: 45000,
    location: 'Port Harcourt, Nigeria',
    status: 'open',
    clientId: 'cli-4',
    createdAt: '2024-07-10T08:00:00Z',
    deadline: '2024-07-22T17:00:00Z',
    requirements: ['Professional painting experience', 'Color consultation skills', 'High-quality finish standards', 'Clean and tidy work practices', 'Provide paint samples'],
    applicants: ['art-4'],
    priority: 'medium',
    estimatedDuration: '5-6 days',
    materials: ['Premium quality paint', 'Primers and sealers', 'Brushes and rollers', 'Drop cloths and masking tape'],
    safetyRequirements: ['Ventilation masks', 'Non-slip ladder'],
    contactPreference: 'message',
    images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600'],
    coordinates: [4.8156, 7.0498]
  },
  {
    id: 'job-5',
    title: 'Custom Security Gate Fabrication & Installation',
    description: 'Design, fabricate, and install custom security gate for residential compound entrance. Gate should be 4m wide with pedestrian access, automated opening system, and modern aesthetic design. Includes concrete foundation work and electrical connections for automation. Must be galvanized and powder-coated for durability.',
    category: 'welding',
    budget: 85000,
    location: 'Kano, Nigeria',
    status: 'in-progress',
    clientId: 'cli-5',
    artisanId: 'art-5',
    createdAt: '2024-07-05T11:00:00Z',
    deadline: '2024-07-20T17:00:00Z',
    requirements: ['Advanced welding skills', 'Metal fabrication experience', 'Gate automation knowledge', 'Design capability', 'Transportation for materials'],
    applicants: ['art-5'],
    priority: 'high',
    estimatedDuration: '7-10 days',
    materials: ['Steel tubing and plates', 'Gate hardware', 'Automation system', 'Concrete and anchors', 'Paint and finishing materials'],
    safetyRequirements: ['Welding safety gear', 'Steel-toe boots', 'Safety harness'],
    contactPreference: 'phone',
    coordinates: [12.0022, 8.5919]
  },
  {
    id: 'job-6',
    title: 'Retaining Wall Construction',
    description: 'Construction of decorative retaining wall for garden landscaping project. Wall will be 25 meters long, 1.2 meters high using natural stone blocks. Includes proper foundation, drainage system, and backfill. Property has sloping terrain requiring soil stabilization.',
    category: 'masonry',
    budget: 120000,
    location: 'Ibadan, Nigeria',
    status: 'open',
    clientId: 'cli-3',
    createdAt: '2024-07-09T16:30:00Z',
    deadline: '2024-08-05T17:00:00Z',
    requirements: ['Stone masonry experience', 'Retaining wall construction knowledge', 'Heavy equipment operation', 'Drainage system understanding'],
    applicants: ['art-6'],
    priority: 'medium',
    estimatedDuration: '10-12 days',
    materials: ['Natural stone blocks', 'Concrete foundation materials', 'Drainage pipes and gravel', 'Mortar and cement'],
    safetyRequirements: ['Hard hat and safety vest', 'Steel-toe boots', 'Back support belt'],
    contactPreference: 'email',
    coordinates: [7.3775, 3.9470]
  },
  {
    id: 'job-7',
    title: 'Commercial Garden Landscaping',
    description: 'Complete landscaping design and installation for office building courtyard. Project includes soil preparation, plant selection and installation, irrigation system setup, decorative lighting, and maintenance plan. Area is 300 square meters with existing trees to preserve.',
    category: 'gardening',
    budget: 95000,
    location: 'Benin City, Nigeria',
    status: 'open',
    clientId: 'cli-2',
    createdAt: '2024-07-08T12:00:00Z',
    deadline: '2024-07-30T17:00:00Z',
    requirements: ['Landscape design experience', 'Plant knowledge for Nigerian climate', 'Irrigation system installation', 'Maintenance planning capability'],
    applicants: ['art-7'],
    priority: 'medium',
    estimatedDuration: '8-10 days',
    materials: ['Native plants and trees', 'Irrigation components', 'Soil amendments', 'Decorative stones and mulch'],
    safetyRequirements: ['Sun protection gear', 'Gloves and knee pads'],
    contactPreference: 'phone',
    coordinates: [6.3350, 5.6037]
  },
  {
    id: 'job-8',
    title: 'Post-Construction Deep Cleaning',
    description: 'Comprehensive post-construction cleaning for newly built 4-bedroom duplex. Includes removal of construction debris, dust cleaning, window washing, floor polishing, bathroom sanitization, and final inspection preparation. Property is 250 square meters over two floors.',
    category: 'cleaning',
    budget: 35000,
    location: 'Enugu, Nigeria',
    status: 'open',
    clientId: 'cli-6',
    createdAt: '2024-07-10T14:20:00Z',
    deadline: '2024-07-16T17:00:00Z',
    requirements: ['Post-construction cleaning experience', 'Professional equipment', 'Attention to detail', 'Flexible scheduling'],
    applicants: ['art-8'],
    priority: 'urgent',
    estimatedDuration: '2-3 days',
    materials: ['Industrial cleaning supplies', 'Specialized equipment', 'Safety cleaning chemicals', 'Polishing materials'],
    safetyRequirements: ['Protective clothing', 'Respiratory masks', 'Non-slip shoes'],
    contactPreference: 'message',
    coordinates: [6.2649, 7.1480]
  },
  {
    id: 'job-9',
    title: 'Furniture Repair and Restoration',
    description: 'Restore antique dining set including table and 6 chairs. Table has loose joints and surface scratches, chairs need reupholstering and structural repairs. Wood is mahogany and requires careful matching for repairs. Client wants to preserve original character while ensuring structural integrity.',
    category: 'carpentry',
    budget: 25000,
    location: 'Warri, Nigeria',
    status: 'open',
    clientId: 'cli-1',
    createdAt: '2024-07-10T15:30:00Z',
    deadline: '2024-07-25T17:00:00Z',
    requirements: ['Furniture restoration experience', 'Wood matching skills', 'Upholstery knowledge', 'Antique furniture handling'],
    applicants: ['art-1'],
    priority: 'low',
    estimatedDuration: '4-5 days',
    materials: ['Wood stain and polish', 'Wood glue and clamps', 'Upholstery fabric', 'Restoration tools'],
    safetyRequirements: ['Dust masks', 'Eye protection'],
    contactPreference: 'phone',
    coordinates: [5.5157, 5.7546]
  },
  {
    id: 'job-10',
    title: 'Solar Panel Installation - Residential',
    description: 'Installation of 5kW solar panel system for residential home. Includes roof mounting, electrical connections, inverter setup, and grid connection. Roof is concrete with good sun exposure. System should include battery backup and monitoring capabilities.',
    category: 'electrical',
    budget: 180000,
    location: 'Lagos, Nigeria',
    status: 'open',
    clientId: 'cli-2',
    createdAt: '2024-07-07T13:45:00Z',
    deadline: '2024-07-28T17:00:00Z',
    requirements: ['Solar installation certification', 'Electrical license', 'Roof work experience', 'System design capability', 'Warranty provision'],
    applicants: ['art-2'],
    priority: 'high',
    estimatedDuration: '3-4 days',
    materials: ['Solar panels and mounting', 'Inverter and batteries', 'Electrical components', 'Monitoring system'],
    safetyRequirements: ['Fall protection gear', 'Electrical safety equipment'],
    contactPreference: 'email',
    coordinates: [6.5244, 3.3792]
  },
  {
    id: 'job-11',
    title: 'Emergency Plumbing Repair - Burst Pipe',
    description: 'URGENT: Main water pipe burst in commercial building basement. Water is flooding and needs immediate attention. Requires emergency plumbing service to locate, repair, and prevent further damage. Building has 20 offices and water supply needs restoration ASAP.',
    category: 'plumbing',
    budget: 45000,
    location: 'Lagos, Nigeria',
    status: 'open',
    clientId: 'cli-6',
    createdAt: '2024-07-11T06:15:00Z',
    deadline: '2024-07-11T18:00:00Z',
    requirements: ['24/7 emergency service', 'Commercial plumbing experience', 'Quick response time', 'Professional tools and equipment'],
    applicants: ['art-3'],
    priority: 'urgent',
    estimatedDuration: '4-6 hours',
    materials: ['Emergency pipe repair kit', 'Replacement pipes', 'Sealants and fittings'],
    safetyRequirements: ['Waterproof gear', 'Emergency lighting'],
    contactPreference: 'phone',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'],
    coordinates: [6.5244, 3.3792]
  },
  {
    id: 'job-12',
    title: 'Modern Kitchen Renovation - Complete',
    description: 'Full kitchen renovation including cabinet installation, countertop fitting, plumbing connections, electrical work, and flooring. Kitchen is 4m x 3m with island. Need coordinated team or general contractor who can manage all trades. High-end finishes and modern appliances.',
    category: 'carpentry',
    budget: 850000,
    location: 'Abuja, Nigeria',
    status: 'open',
    clientId: 'cli-7',
    createdAt: '2024-07-09T11:30:00Z',
    deadline: '2024-08-15T17:00:00Z',
    requirements: ['General contracting experience', 'Kitchen renovation specialty', 'Project management skills', 'Quality craftsmanship', 'Portfolio of completed kitchens'],
    applicants: ['art-1', 'art-2', 'art-3'],
    priority: 'high',
    estimatedDuration: '15-20 days',
    materials: ['Custom cabinets', 'Quartz countertops', 'High-end appliances', 'Premium flooring'],
    safetyRequirements: ['Full PPE', 'Dust control measures'],
    contactPreference: 'email',
    images: ['https://images.unsplash.com/photo-1556909114-3c6ac97e0c82?w=600'],
    coordinates: [9.0579, 7.4951]
  },
  {
    id: 'job-13',
    title: 'Roof Repair - Storm Damage',
    description: 'Repair storm damage to residential roof including replacing damaged tiles, fixing leaks, and structural assessment. Some wooden beams may need replacement. Roof is 150 square meters, single story building. Need weather-resistant repair solution.',
    category: 'construction',
    budget: 75000,
    location: 'Port Harcourt, Nigeria',
    status: 'open',
    clientId: 'cli-4',
    createdAt: '2024-07-10T07:45:00Z',
    deadline: '2024-07-20T17:00:00Z',
    requirements: ['Roofing experience', 'Structural assessment capability', 'Weather-resistant solutions', 'Insurance claim documentation'],
    applicants: ['art-6'],
    priority: 'high',
    estimatedDuration: '5-7 days',
    materials: ['Roofing tiles', 'Waterproof membrane', 'Wooden beams', 'Sealants and flashing'],
    safetyRequirements: ['Fall protection', 'Hard hat', 'Safety harness'],
    contactPreference: 'phone',
    coordinates: [4.8156, 7.0498]
  },
  {
    id: 'job-14',
    title: 'Office Space Painting - Corporate Colors',
    description: 'Paint large corporate office space (500sqm) in company brand colors. Includes conference rooms, open office area, private offices, and reception. Need professional finish with company logo integration. Work must be completed during non-business hours.',
    category: 'painting',
    budget: 125000,
    location: 'Lagos, Nigeria',
    status: 'open',
    clientId: 'cli-2',
    createdAt: '2024-07-08T16:20:00Z',
    deadline: '2024-07-25T17:00:00Z',
    requirements: ['Commercial painting experience', 'After-hours availability', 'Brand color matching', 'Logo application skills', 'Large project management'],
    applicants: ['art-4'],
    priority: 'medium',
    estimatedDuration: '8-10 days',
    materials: ['Commercial grade paint', 'Brand color specifications', 'Logo templates', 'Professional equipment'],
    safetyRequirements: ['Non-toxic fumes', 'Proper ventilation'],
    contactPreference: 'email',
    coordinates: [6.5244, 3.3792]
  },
  {
    id: 'job-15',
    title: 'Backyard Pool Installation Support',
    description: 'Excavation and concrete work for backyard swimming pool installation. Pool size 6m x 4m x 1.5m deep. Need professional excavation, proper drainage, and concrete shell construction. Working with pool specialist but need local construction expertise.',
    category: 'construction',
    budget: 450000,
    location: 'Abuja, Nigeria',
    status: 'open',
    clientId: 'cli-3',
    createdAt: '2024-07-07T10:15:00Z',
    deadline: '2024-08-10T17:00:00Z',
    requirements: ['Excavation experience', 'Concrete work expertise', 'Pool construction knowledge', 'Heavy equipment operation', 'Drainage system installation'],
    applicants: ['art-6'],
    priority: 'medium',
    estimatedDuration: '12-15 days',
    materials: ['Concrete and rebar', 'Drainage pipes', 'Waterproof membrane', 'Excavation equipment'],
    safetyRequirements: ['Excavation safety', 'Heavy equipment operation safety'],
    contactPreference: 'phone',
    coordinates: [9.0579, 7.4951]
  },
  {
    id: 'job-16',
    title: 'Smart Home Electrical Upgrade',
    description: 'Upgrade existing home electrical system for smart home automation. Install smart switches, outlets, home automation panel, security system wiring, and integrate with existing electrical. Home is 200sqm with 4 bedrooms. Need future-proof installation.',
    category: 'electrical',
    budget: 95000,
    location: 'Warri, Nigeria',
    status: 'in-progress',
    clientId: 'cli-1',
    artisanId: 'art-2',
    createdAt: '2024-07-06T14:30:00Z',
    deadline: '2024-07-18T17:00:00Z',
    requirements: ['Smart home expertise', 'Home automation experience', 'Network and data knowledge', 'Modern electrical standards'],
    applicants: ['art-2'],
    priority: 'medium',
    estimatedDuration: '6-8 days',
    materials: ['Smart switches and outlets', 'Automation panel', 'Network cables', 'Security system components'],
    safetyRequirements: ['Electrical safety protocols', 'Network testing equipment'],
    contactPreference: 'message',
    coordinates: [5.5157, 5.7546]
  },
  {
    id: 'job-17',
    title: 'Restaurant Kitchen Deep Cleaning',
    description: 'Monthly deep cleaning service for busy restaurant kitchen. Includes equipment cleaning, grease removal, floor deep cleaning, exhaust system cleaning, and health department compliance preparation. Kitchen operates 12 hours daily, work needed after closing.',
    category: 'cleaning',
    budget: 25000,
    location: 'Lagos, Nigeria',
    status: 'open',
    clientId: 'cli-8',
    createdAt: '2024-07-10T12:30:00Z',
    deadline: '2024-07-15T06:00:00Z',
    requirements: ['Commercial kitchen cleaning', 'Health compliance knowledge', 'After-hours availability', 'Professional equipment', 'Food safety certification'],
    applicants: ['art-8'],
    priority: 'medium',
    estimatedDuration: '1 night',
    materials: ['Commercial cleaners', 'Degreasing agents', 'Sanitizing solutions', 'Professional equipment'],
    safetyRequirements: ['Chemical safety gear', 'Non-slip equipment'],
    contactPreference: 'phone',
    coordinates: [6.5244, 3.3792]
  },
  {
    id: 'job-18',
    title: 'Garden Landscape Design & Installation',
    description: 'Design and install landscape for new residential property. Front and back yard totaling 400sqm. Need plant selection suitable for Nigerian climate, irrigation design, decorative features, and maintenance plan. Property has good drainage.',
    category: 'gardening',
    budget: 180000,
    location: 'Benin City, Nigeria',
    status: 'open',
    clientId: 'cli-9',
    createdAt: '2024-07-09T08:45:00Z',
    deadline: '2024-08-05T17:00:00Z',
    requirements: ['Landscape design skills', 'Plant knowledge for Nigerian climate', 'Irrigation system design', 'Maintenance planning', 'Creative design capability'],
    applicants: ['art-7'],
    priority: 'low',
    estimatedDuration: '10-12 days',
    materials: ['Native plants and trees', 'Irrigation components', 'Decorative stones', 'Soil amendments'],
    safetyRequirements: ['Sun protection', 'Gardening safety gear'],
    contactPreference: 'email',
    coordinates: [6.3350, 5.6037]
  },
  {
    id: 'job-19',
    title: 'Metal Security Door Installation',
    description: 'Fabricate and install custom metal security door for residential entrance. Door size 2.1m x 0.9m with decorative design, multiple locking points, and powder coating finish. Need matching frame and proper installation in concrete wall.',
    category: 'welding',
    budget: 35000,
    location: 'Kano, Nigeria',
    status: 'open',
    clientId: 'cli-10',
    createdAt: '2024-07-10T13:15:00Z',
    deadline: '2024-07-22T17:00:00Z',
    requirements: ['Metal fabrication skills', 'Security door experience', 'Decorative welding capability', 'Installation expertise', 'Finishing quality'],
    applicants: ['art-5'],
    priority: 'medium',
    estimatedDuration: '4-5 days',
    materials: ['Steel bars and sheets', 'Security locks', 'Hinges and hardware', 'Powder coating materials'],
    safetyRequirements: ['Welding safety gear', 'Metal cutting safety'],
    contactPreference: 'phone',
    coordinates: [12.0022, 8.5919]
  },
  {
    id: 'job-20',
    title: 'Bathroom Tile Installation',
    description: 'Install ceramic tiles in master bathroom. Floor area 12sqm and wall area 35sqm. Includes waterproofing, tile cutting, grouting, and finishing. Client has already purchased premium ceramic tiles. Need experienced tile installer with attention to detail.',
    category: 'tiling',
    budget: 45000,
    location: 'Ibadan, Nigeria',
    status: 'completed',
    clientId: 'cli-3',
    artisanId: 'art-6',
    createdAt: '2024-06-25T09:30:00Z',
    completionDate: '2024-07-02T16:00:00Z',
    requirements: ['Ceramic tile installation experience', 'Waterproofing knowledge', 'Precision cutting skills', 'Quality finishing'],
    applicants: ['art-6'],
    rating: 4,
    review: 'Good quality work, tiles are well aligned and grouting is neat. Completed on time and within budget.',
    priority: 'medium',
    estimatedDuration: '5-6 days',
    materials: ['Tile adhesive', 'Grout and sealers', 'Waterproofing membrane', 'Tile spacers'],
    safetyRequirements: ['Knee protection', 'Dust masks'],
    contactPreference: 'phone',
    coordinates: [7.3775, 3.9470]
  }
];

// Enhanced Mock Clients
export const mockClients: Client[] = [
  {
    id: 'cli-1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Warri, Nigeria',
    joinedDate: '2023-08-15',
    isVerified: true,
    phone: '+234 901 234 5678',
    lastActive: '2024-07-11T08:30:00Z',
    jobsPosted: 8,
    totalSpent: 245000,
    preferredPaymentMethod: 'Bank Transfer',
    businessType: 'Individual',
    companyName: undefined
  },
  {
    id: 'cli-2',
    name: 'Adeyemi Business Center',
    email: 'admin@adeyemibusiness.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Lagos, Nigeria',
    joinedDate: '2023-03-20',
    isVerified: true,
    phone: '+234 902 345 6789',
    lastActive: '2024-07-11T14:15:00Z',
    jobsPosted: 15,
    totalSpent: 1250000,
    preferredPaymentMethod: 'Corporate Account',
    businessType: 'Office Complex',
    companyName: 'Adeyemi Business Center Ltd'
  },
  {
    id: 'cli-3',
    name: 'Dr. Michael Okonkwo',
    email: 'michael.okonkwo@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Abuja, Nigeria',
    joinedDate: '2023-01-10',
    isVerified: true,
    phone: '+234 903 456 7890',
    lastActive: '2024-07-10T19:45:00Z',
    jobsPosted: 12,
    totalSpent: 890000,
    preferredPaymentMethod: 'Online Payment',
    businessType: 'Professional',
    companyName: 'Okonkwo Medical Practice'
  },
  {
    id: 'cli-4',
    name: 'Jennifer Adeleke',
    email: 'jennifer.adeleke@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Port Harcourt, Nigeria',
    joinedDate: '2023-09-05',
    isVerified: true,
    phone: '+234 904 567 8901',
    lastActive: '2024-07-11T10:20:00Z',
    jobsPosted: 6,
    totalSpent: 320000,
    preferredPaymentMethod: 'Mobile Money',
    businessType: 'Individual',
    companyName: undefined
  },
  {
    id: 'cli-5',
    name: 'Alhaji Ibrahim Sule',
    email: 'ibrahim.sule@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Kano, Nigeria',
    joinedDate: '2023-06-12',
    isVerified: true,
    phone: '+234 905 678 9012',
    lastActive: '2024-07-10T16:30:00Z',
    jobsPosted: 9,
    totalSpent: 450000,
    preferredPaymentMethod: 'Bank Transfer',
    businessType: 'Business Owner',
    companyName: 'Sule Trading Company'
  },
  {
    id: 'cli-6',
    name: 'Lagos Tech Hub',
    email: 'facilities@lagostechhub.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Lagos, Nigeria',
    joinedDate: '2023-02-28',
    isVerified: true,
    phone: '+234 906 789 0123',
    lastActive: '2024-07-11T06:45:00Z',
    jobsPosted: 22,
    totalSpent: 1800000,
    preferredPaymentMethod: 'Corporate Account',
    businessType: 'Technology Company',
    companyName: 'Lagos Tech Hub Limited'
  },
  {
    id: 'cli-7',
    name: 'Mrs. Funmi Bakare',
    email: 'funmi.bakare@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Abuja, Nigeria',
    joinedDate: '2023-11-18',
    isVerified: true,
    phone: '+234 907 890 1234',
    lastActive: '2024-07-10T12:15:00Z',
    jobsPosted: 4,
    totalSpent: 650000,
    preferredPaymentMethod: 'Online Payment',
    businessType: 'Individual',
    companyName: undefined
  },
  {
    id: 'cli-8',
    name: 'Mama Jollof Restaurant',
    email: 'manager@mamajollof.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Lagos, Nigeria',
    joinedDate: '2023-04-08',
    isVerified: true,
    phone: '+234 908 901 2345',
    lastActive: '2024-07-11T13:20:00Z',
    jobsPosted: 18,
    totalSpent: 780000,
    preferredPaymentMethod: 'Cash',
    businessType: 'Restaurant',
    companyName: 'Mama Jollof Restaurant Ltd'
  },
  {
    id: 'cli-9',
    name: 'Chief Emmanuel Osagie',
    email: 'emmanuel.osagie@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Benin City, Nigeria',
    joinedDate: '2023-07-22',
    isVerified: true,
    phone: '+234 909 012 3456',
    lastActive: '2024-07-09T20:30:00Z',
    jobsPosted: 7,
    totalSpent: 520000,
    preferredPaymentMethod: 'Bank Transfer',
    businessType: 'Traditional Ruler',
    companyName: undefined
  },
  {
    id: 'cli-10',
    name: 'Amina Hassan',
    email: 'amina.hassan@email.com',
    type: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Kano, Nigeria',
    joinedDate: '2023-12-03',
    isVerified: true,
    phone: '+234 910 123 4567',
    lastActive: '2024-07-10T15:45:00Z',
    jobsPosted: 3,
    totalSpent: 85000,
    preferredPaymentMethod: 'Mobile Money',
    businessType: 'Individual',
    companyName: undefined
  }
];

// Enhanced Mock Messages with realistic conversations
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'cli-1',
    receiverId: 'art-1',
    content: 'Hi John! I saw your application for the kitchen cabinet installation. Your portfolio looks impressive. When would you be available to start? Also, do you provide a warranty on your work?',
    timestamp: '2024-07-08T10:30:00Z',
    jobId: 'job-1',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-2',
    senderId: 'art-1',
    receiverId: 'cli-1',
    content: 'Hello Sarah! Thank you for considering me. I can start this weekend and provide a 2-year warranty on installation. I have all professional tools and 8 years experience. Would you like to schedule a quick site visit first?',
    timestamp: '2024-07-08T11:15:00Z',
    jobId: 'job-1',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-3',
    senderId: 'cli-1',
    receiverId: 'art-1',
    content: 'Perfect! Saturday morning works for the site visit. Here\'s my address: 123 Maple Street, GRA, Warri. My contact is +234 901 234 5678. Looking forward to meeting you.',
    timestamp: '2024-07-08T12:45:00Z',
    jobId: 'job-1',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-4',
    senderId: 'cli-2',
    receiverId: 'art-2',
    content: 'Sarah, I reviewed your profile and I\'m impressed with your electrical expertise. Our office project is quite complex - 200sqm with specific requirements for data cabling. Are you available for a consultation this week?',
    timestamp: '2024-07-09T15:00:00Z',
    jobId: 'job-2',
    isRead: false,
    messageType: 'text'
  },
  {
    id: 'msg-5',
    senderId: 'art-2',
    receiverId: 'cli-2',
    content: 'Hello! Absolutely, I specialize in commercial electrical work and data infrastructure. I can visit tomorrow afternoon to assess the scope and provide a detailed quote. What time works best for you?',
    timestamp: '2024-07-09T16:20:00Z',
    jobId: 'job-2',
    isRead: false,
    messageType: 'text'
  },
  {
    id: 'msg-6',
    senderId: 'cli-3',
    receiverId: 'art-3',
    content: 'David, thank you for the excellent bathroom work! Everything is working perfectly. I have another project coming up - a guest bathroom. Would you be interested?',
    timestamp: '2024-07-06T18:30:00Z',
    jobId: 'job-3',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-7',
    senderId: 'art-3',
    receiverId: 'cli-3',
    content: 'Thank you so much for the kind words and 5-star review! I\'d be delighted to work on your guest bathroom. Please send me the details and we can schedule a consultation.',
    timestamp: '2024-07-06T19:15:00Z',
    jobId: 'job-3',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-8',
    senderId: 'cli-4',
    receiverId: 'art-4',
    content: 'Hi Michael! I need interior painting for my apartment. I\'m particularly interested in eco-friendly paints and modern color schemes. Can you help with color consultation?',
    timestamp: '2024-07-10T09:45:00Z',
    jobId: 'job-4',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-9',
    senderId: 'art-4',
    receiverId: 'cli-4',
    content: 'Absolutely! I specialize in eco-friendly paints and offer full color consultation. I can bring color samples and create a mood board for your space. When can we meet?',
    timestamp: '2024-07-10T10:30:00Z',
    jobId: 'job-4',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-10',
    senderId: 'cli-5',
    receiverId: 'art-5',
    content: 'Ahmed, I need a custom security gate with automation. Can you handle both fabrication and electrical work, or do you work with an electrical partner?',
    timestamp: '2024-07-05T14:20:00Z',
    jobId: 'job-5',
    isRead: true,
    messageType: 'text'
  },
  {
    id: 'msg-11',
    senderId: 'art-5',
    receiverId: 'cli-5',
    content: 'I handle the complete fabrication and have a certified electrician partner for automation systems. We\'ve done many automated gates. Would you like to see some recent projects?',
    timestamp: '2024-07-05T15:45:00Z',
    jobId: 'job-5',
    isRead: true,
    messageType: 'text',
    attachments: ['gate_project_1.jpg', 'gate_project_2.jpg']
  },
  {
    id: 'msg-12',
    senderId: 'cli-6',
    receiverId: 'art-8',
    content: 'Mary, I need urgent post-construction cleaning for a property inspection next week. Can you handle it on short notice?',
    timestamp: '2024-07-10T14:30:00Z',
    jobId: 'job-8',
    isRead: false,
    messageType: 'text'
  }
];

// Enhanced Mock Payments with comprehensive transaction details
export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    jobId: 'job-1',
    amount: 35000,
    status: 'held',
    createdAt: '2024-07-08T12:00:00Z',
    description: 'Premium Kitchen Cabinet Installation',
    method: 'Credit Card',
    transactionId: 'TXN-KB001-2024',
    escrowReleaseDate: '2024-07-15T17:00:00Z',
    processingFee: 1050
  },
  {
    id: 'pay-2',
    jobId: 'job-3',
    amount: 28000,
    status: 'released',
    createdAt: '2024-06-28T10:00:00Z',
    description: 'Master Bathroom Renovation - Plumbing',
    method: 'Bank Transfer',
    transactionId: 'TXN-PL003-2024',
    processingFee: 840
  },
  {
    id: 'pay-3',
    jobId: 'job-5',
    amount: 85000,
    status: 'held',
    createdAt: '2024-07-05T12:30:00Z',
    description: 'Custom Security Gate Fabrication & Installation',
    method: 'Corporate Account',
    transactionId: 'TXN-WL005-2024',
    escrowReleaseDate: '2024-07-20T17:00:00Z',
    processingFee: 2550
  },
  {
    id: 'pay-4',
    jobId: 'job-2',
    amount: 75000,
    status: 'pending',
    createdAt: '2024-07-09T16:00:00Z',
    description: 'Complete Office Electrical Installation',
    method: 'Bank Transfer',
    transactionId: 'TXN-EL002-2024',
    processingFee: 2250
  },
  {
    id: 'pay-5',
    jobId: 'job-4',
    amount: 45000,
    status: 'pending',
    createdAt: '2024-07-10T09:00:00Z',
    description: 'Interior House Painting - 3 Bedroom Apartment',
    method: 'Mobile Money',
    transactionId: 'TXN-PT004-2024',
    processingFee: 1350
  },
  {
    id: 'pay-6',
    jobId: 'job-6',
    amount: 120000,
    status: 'pending',
    createdAt: '2024-07-09T17:00:00Z',
    description: 'Retaining Wall Construction',
    method: 'Corporate Account',
    transactionId: 'TXN-MS006-2024',
    processingFee: 3600
  },
  {
    id: 'pay-7',
    jobId: 'job-7',
    amount: 95000,
    status: 'pending',
    createdAt: '2024-07-08T13:00:00Z',
    description: 'Commercial Garden Landscaping',
    method: 'Bank Transfer',
    transactionId: 'TXN-GD007-2024',
    processingFee: 2850
  },
  {
    id: 'pay-8',
    jobId: 'job-8',
    amount: 35000,
    status: 'pending',
    createdAt: '2024-07-10T15:00:00Z',
    description: 'Post-Construction Deep Cleaning',
    method: 'Bank Transfer',
    transactionId: 'TXN-CL008-2024',
    processingFee: 1050
  }
];

// Enhanced Mock Reviews with detailed feedback and responses
export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    jobId: 'job-3',
    reviewerId: 'cli-3',
    revieweeId: 'art-3',
    rating: 5,
    comment: 'Outstanding work! David transformed our master bathroom completely. He was professional, punctual, and extremely knowledgeable. The plumbing work is flawless, and he even suggested improvements that saved us money. The bathroom fixtures were installed perfectly, and there have been no issues since completion. Highly recommend for any plumbing work!',
    createdAt: '2024-07-05T18:00:00Z',
    helpfulVotes: 12,
    images: ['bathroom_before.jpg', 'bathroom_after.jpg'],
    response: 'Thank you so much David! It was a pleasure working on your bathroom renovation. I always strive to provide the best value and quality for my clients. Looking forward to working on your guest bathroom project!',
    responseDate: '2024-07-05T20:30:00Z'
  },
  {
    id: 'rev-2',
    jobId: 'job-1',
    reviewerId: 'cli-1',
    revieweeId: 'art-1',
    rating: 5,
    comment: 'John exceeded all expectations! The kitchen cabinet installation was flawless. He arrived on time every day, worked efficiently, and paid attention to every detail. The cabinets are perfectly aligned and secure. His craftsmanship is top-notch, and he left the workspace clean each day. Will definitely hire again for future projects.',
    createdAt: '2024-07-13T16:30:00Z',
    helpfulVotes: 8,
    response: 'Thank you Sarah! Your kitchen turned out beautifully. It was a pleasure working with such well-designed cabinets. I appreciate your trust in my work.',
    responseDate: '2024-07-13T18:00:00Z'
  },
  {
    id: 'rev-3',
    jobId: 'job-2',
    reviewerId: 'cli-2',
    revieweeId: 'art-2',
    rating: 4,
    comment: 'Sarah did excellent electrical work for our office. Very knowledgeable about commercial wiring and safety codes. The job was completed on schedule and passed inspection on first try. Only minor issue was communication could have been better regarding material delivery schedules.',
    createdAt: '2024-07-25T14:00:00Z',
    helpfulVotes: 6,
    response: 'Thank you for the feedback! I\'m glad the electrical installation met your standards. I\'ll work on improving communication for future projects. It was great working with your team.',
    responseDate: '2024-07-25T16:15:00Z'
  },
  {
    id: 'rev-4',
    jobId: 'job-5',
    reviewerId: 'cli-5',
    revieweeId: 'art-5',
    rating: 5,
    comment: 'Ahmed delivered exactly what we wanted! The custom security gate is beautiful and functions perfectly. His attention to detail in both fabrication and installation was impressive. The automation system works smoothly, and he provided thorough training on operation and maintenance. Excellent value for money.',
    createdAt: '2024-07-22T10:15:00Z',
    helpfulVotes: 15,
    images: ['gate_final_1.jpg', 'gate_automation.jpg'],
    response: 'Thank you! I really enjoyed this project - the design came out exactly as we envisioned. I\'m glad you\'re happy with both the craftsmanship and automation. Don\'t hesitate to call if you need any adjustments.',
    responseDate: '2024-07-22T12:30:00Z'
  },
  {
    id: 'rev-5',
    jobId: 'job-4',
    reviewerId: 'cli-4',
    revieweeId: 'art-4',
    rating: 4,
    comment: 'Michael did a great job painting our apartment. The color consultation was very helpful, and he suggested perfect eco-friendly paint options. The finish quality is excellent throughout. Work was completed on time and within budget. The only minor issue was some paint smell that lasted longer than expected.',
    createdAt: '2024-07-24T15:45:00Z',
    helpfulVotes: 4,
    response: 'Thank you for the review! I\'m pleased you love the colors we chose together. Regarding the paint smell, eco-friendly paints sometimes take a bit longer to fully cure, but they\'re much safer long-term. Thanks for choosing sustainable options!',
    responseDate: '2024-07-24T17:20:00Z'
  },
  {
    id: 'rev-6',
    jobId: 'job-7',
    reviewerId: 'cli-2',
    revieweeId: 'art-7',
    rating: 5,
    comment: 'James created a stunning office courtyard that exceeded our expectations. His plant knowledge and design skills are exceptional. The irrigation system is well-planned, and he provided a comprehensive maintenance guide. Our employees love the new outdoor space. Professional service throughout.',
    createdAt: '2024-08-02T11:30:00Z',
    helpfulVotes: 9,
    images: ['courtyard_before.jpg', 'courtyard_after.jpg', 'plants_detail.jpg'],
    response: 'Thank you! Creating beautiful, functional outdoor spaces is my passion. I\'m thrilled that your team enjoys the courtyard. The plants should continue to flourish with the care plan we discussed.',
    responseDate: '2024-08-02T13:45:00Z'
  },
  {
    id: 'rev-7',
    jobId: 'job-8',
    reviewerId: 'cli-6',
    revieweeId: 'art-8',
    rating: 5,
    comment: 'Mary\'s post-construction cleaning service was absolutely thorough! She arrived with professional equipment and worked systematically through every room. The house was spotless and ready for our move-in inspection. Very reliable and detail-oriented. Worth every naira spent.',
    createdAt: '2024-07-17T09:20:00Z',
    helpfulVotes: 7,
    response: 'Thank you Fatima! Post-construction cleaning requires attention to detail, and I\'m glad I could help you prepare for your inspection. Wishing you happiness in your new home!',
    responseDate: '2024-07-17T11:00:00Z'
  },
  {
    id: 'rev-8',
    jobId: 'job-9',
    reviewerId: 'cli-1',
    revieweeId: 'art-1',
    rating: 5,
    comment: 'John restored our antique dining set beautifully! His expertise with mahogany wood and attention to preserving the original character was impressive. The furniture looks like new while maintaining its vintage charm. The reupholstering work was also excellent. Highly skilled craftsman.',
    createdAt: '2024-07-28T14:20:00Z',
    helpfulVotes: 11,
    images: ['dining_set_before.jpg', 'dining_set_restored.jpg'],
    response: 'Thank you Sarah! Antique furniture restoration is one of my favorite types of work. Your dining set is a beautiful piece, and I\'m honored to have helped preserve it for future generations.',
    responseDate: '2024-07-28T16:00:00Z'
  }
];

// Enhanced Mock Notifications for comprehensive user engagement
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'art-1',
    type: 'job_application',
    title: 'New Job Application',
    message: 'You have successfully applied for "Premium Kitchen Cabinet Installation"',
    isRead: true,
    createdAt: '2024-07-08T10:00:00Z',
    actionUrl: '/job/job-1',
    priority: 'medium'
  },
  {
    id: 'notif-2',
    userId: 'cli-1',
    type: 'job_application',
    title: 'New Application Received',
    message: 'John Carpenter applied for your "Premium Kitchen Cabinet Installation" job',
    isRead: true,
    createdAt: '2024-07-08T10:05:00Z',
    actionUrl: '/job/job-1',
    priority: 'high'
  },
  {
    id: 'notif-3',
    userId: 'art-1',
    type: 'job_update',
    title: 'Job Awarded!',
    message: 'Congratulations! You have been selected for "Premium Kitchen Cabinet Installation"',
    isRead: false,
    createdAt: '2024-07-08T15:30:00Z',
    actionUrl: '/job/job-1',
    priority: 'high'
  },
  {
    id: 'notif-4',
    userId: 'cli-3',
    type: 'job_update',
    title: 'Job Completed',
    message: 'David Plumber has marked "Master Bathroom Renovation" as completed',
    isRead: true,
    createdAt: '2024-07-05T16:00:00Z',
    actionUrl: '/job/job-3',
    priority: 'medium'
  },
  {
    id: 'notif-5',
    userId: 'art-3',
    type: 'payment',
    title: 'Payment Released',
    message: '₦28,000 has been released for "Master Bathroom Renovation"',
    isRead: true,
    createdAt: '2024-07-05T17:00:00Z',
    actionUrl: '/payment/pay-2',
    priority: 'high'
  },
  {
    id: 'notif-6',
    userId: 'art-3',
    type: 'review',
    title: 'New Review Received',
    message: 'David Chen left you a 5-star review for "Master Bathroom Renovation"',
    isRead: false,
    createdAt: '2024-07-05T18:30:00Z',
    actionUrl: '/profile/reviews',
    priority: 'medium'
  },
  {
    id: 'notif-7',
    userId: 'art-2',
    type: 'message',
    title: 'New Message',
    message: 'Emma Johnson sent you a message about "Complete Office Electrical Installation"',
    isRead: false,
    createdAt: '2024-07-09T16:25:00Z',
    actionUrl: '/messages',
    priority: 'medium'
  },
  {
    id: 'notif-8',
    userId: 'cli-6',
    type: 'job_application',
    title: 'New Application Received',
    message: 'Mary Cleaner applied for your "Post-Construction Deep Cleaning" job',
    isRead: false,
    createdAt: '2024-07-10T15:30:00Z',
    actionUrl: '/job/job-8',
    priority: 'high'
  },
  {
    id: 'notif-9',
    userId: 'art-5',
    type: 'job_update',
    title: 'Job Deadline Reminder',
    message: 'Reminder: "Custom Security Gate Installation" is due in 3 days',
    isRead: false,
    createdAt: '2024-07-17T08:00:00Z',
    actionUrl: '/job/job-5',
    priority: 'high'
  },
  {
    id: 'notif-10',
    userId: 'cli-2',
    type: 'system',
    title: 'Account Verification Complete',
    message: 'Your business account verification has been approved. You can now post unlimited jobs.',
    isRead: true,
    createdAt: '2024-07-01T12:00:00Z',
    actionUrl: '/profile',
    priority: 'medium'
  }
];

// Platform Analytics and Statistics for MVP Dashboard
export const platformStats = {
  totalUsers: 1247,
  totalArtisans: 892,
  totalClients: 355,
  totalJobs: 3456,
  completedJobs: 2891,
  activeJobs: 234,
  totalTransactions: 8945000, // in Naira
  averageJobValue: 45000,
  topCategories: [
    { category: 'electrical', jobCount: 789, percentage: 22.8 },
    { category: 'carpentry', jobCount: 654, percentage: 18.9 },
    { category: 'plumbing', jobCount: 543, percentage: 15.7 },
    { category: 'painting', jobCount: 432, percentage: 12.5 },
    { category: 'cleaning', jobCount: 298, percentage: 8.6 }
  ],
  monthlyGrowth: {
    users: 15.3,
    jobs: 22.1,
    revenue: 18.7
  },
  satisfactionRate: 4.7,
  responseTime: '2.3 hours',
  platformFee: 3.0 // percentage
};

// Recent Activity for real-time dashboard
export const recentActivity = [
  {
    id: 'activity-1',
    type: 'job_posted',
    user: 'Emma Johnson',
    description: 'posted a new job "Office Electrical Installation"',
    timestamp: '2024-07-10T16:30:00Z',
    value: 75000
  },
  {
    id: 'activity-2',
    type: 'job_completed',
    user: 'David Plumber',
    description: 'completed "Master Bathroom Renovation"',
    timestamp: '2024-07-10T15:45:00Z',
    value: 28000
  },
  {
    id: 'activity-3',
    type: 'user_joined',
    user: 'Grace Mason',
    description: 'joined as a Mason specialist',
    timestamp: '2024-07-10T14:20:00Z',
    value: null
  },
  {
    id: 'activity-4',
    type: 'payment_released',
    user: 'Sarah Wilson',
    description: 'released payment for "Kitchen Cabinet Installation"',
    timestamp: '2024-07-10T13:15:00Z',
    value: 35000
  },
  {
    id: 'activity-5',
    type: 'review_posted',
    user: 'Michael Thompson',
    description: 'left a 5-star review for Ahmed Welder',
    timestamp: '2024-07-10T12:30:00Z',
    value: null
  }
];

// Top performing artisans for leaderboard
export const topArtisans = [
  {
    id: 'art-2',
    name: 'Sarah Johnson',
    category: 'Electrical',
    rating: 4.8,
    completedJobs: 289,
    earnings: 1245000,
    badgeLevel: 'Master Craftsman'
  },
  {
    id: 'art-1',
    name: 'John Carpenter',
    category: 'Carpentry',
    rating: 4.9,
    completedJobs: 145,
    earnings: 987000,
    badgeLevel: 'Expert'
  },
  {
    id: 'art-8',
    name: 'Mary Cleaner',
    category: 'Cleaning',
    rating: 4.9,
    completedJobs: 234,
    earnings: 654000,
    badgeLevel: 'Professional'
  },
  {
    id: 'art-4',
    name: 'Michael Painter',
    category: 'Painting',
    rating: 4.6,
    completedJobs: 198,
    earnings: 543000,
    badgeLevel: 'Professional'
  },
  {
    id: 'art-3',
    name: 'David Plumber',
    category: 'Plumbing',
    rating: 4.7,
    completedJobs: 156,
    earnings: 478000,
    badgeLevel: 'Skilled'
  }
];

// Geographic distribution for market analysis
export const geographicStats = [
  { state: 'Lagos', userCount: 356, jobCount: 1234, revenue: 2340000 },
  { state: 'Abuja', userCount: 234, jobCount: 789, revenue: 1560000 },
  { state: 'Port Harcourt', userCount: 187, jobCount: 456, revenue: 980000 },
  { state: 'Kano', userCount: 123, jobCount: 345, revenue: 765000 },
  { state: 'Ibadan', userCount: 109, jobCount: 289, revenue: 645000 },
  { state: 'Warri', userCount: 98, jobCount: 234, revenue: 534000 },
  { state: 'Benin City', userCount: 87, jobCount: 198, revenue: 456000 },
  { state: 'Enugu', userCount: 76, jobCount: 167, revenue: 389000 }
];

// Enhanced Helper Functions for comprehensive data management
export const getArtisanById = (id: string): Artisan | undefined => {
  return mockArtisans.find(artisan => artisan.id === id);
};

export const getClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id);
};

export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};

export const getJobsByArtisan = (artisanId: string): Job[] => {
  return mockJobs.filter(job => job.artisanId === artisanId);
};

export const getJobsByClient = (clientId: string): Job[] => {
  return mockJobs.filter(job => job.clientId === clientId);
};

export const getJobsByCategory = (category: string): Job[] => {
  return mockJobs.filter(job => job.category === category);
};

export const getJobsByLocation = (location: string): Job[] => {
  return mockJobs.filter(job => job.location.includes(location));
};

export const getJobsByStatus = (status: Job['status']): Job[] => {
  return mockJobs.filter(job => job.status === status);
};

export const getMessagesBetweenUsers = (user1Id: string, user2Id: string): Message[] => {
  return mockMessages.filter(message => 
    (message.senderId === user1Id && message.receiverId === user2Id) ||
    (message.senderId === user2Id && message.receiverId === user1Id)
  );
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getUnreadNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => 
    notification.userId === userId && !notification.isRead
  );
};

export const getPaymentsByUser = (userId: string): Payment[] => {
  const userJobs = mockJobs.filter(job => job.clientId === userId || job.artisanId === userId);
  const jobIds = userJobs.map(job => job.id);
  return mockPayments.filter(payment => jobIds.includes(payment.jobId));
};

export const getReviewsForArtisan = (artisanId: string): Review[] => {
  return mockReviews.filter(review => review.revieweeId === artisanId);
};

export const getReviewsByClient = (clientId: string): Review[] => {
  return mockReviews.filter(review => review.reviewerId === clientId);
};

export const getArtisansBySkill = (skill: string): Artisan[] => {
  return mockArtisans.filter(artisan => 
    artisan.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
};

export const getArtisansByLocation = (location: string): Artisan[] => {
  return mockArtisans.filter(artisan => artisan.location.includes(location));
};

export const getAvailableArtisans = (): Artisan[] => {
  return mockArtisans.filter(artisan => artisan.isAvailable);
};

export const getVerifiedArtisans = (): Artisan[] => {
  return mockArtisans.filter(artisan => artisan.isVerified);
};

// Statistics and metrics with enhanced calculations
export const getArtisanStats = (artisanId: string) => {
  const artisan = getArtisanById(artisanId);
  const jobs = getJobsByArtisan(artisanId);
  const reviews = getReviewsForArtisan(artisanId);
  const payments = getPaymentsByUser(artisanId);
  
  return {
    totalJobs: jobs.length,
    completedJobs: jobs.filter(job => job.status === 'completed').length,
    inProgressJobs: jobs.filter(job => job.status === 'in-progress').length,
    pendingJobs: jobs.filter(job => job.status === 'open' && job.applicants.includes(artisanId)).length,
    averageRating: artisan?.rating || 0,
    totalReviews: reviews.length,
    totalEarnings: payments
      .filter(payment => payment.status === 'released')
      .reduce((sum, payment) => sum + payment.amount, 0),
    pendingEarnings: payments
      .filter(payment => payment.status === 'held')
      .reduce((sum, payment) => sum + payment.amount, 0),
    responseTime: artisan?.responseTime || 'N/A',
    completionRate: jobs.length > 0 ? 
      (jobs.filter(job => job.status === 'completed').length / jobs.length * 100).toFixed(1) : '0',
    repeatClientRate: calculateRepeatClientRate(artisanId)
  };
};

export const getClientStats = (clientId: string) => {
  const client = getClientById(clientId);
  const jobs = getJobsByClient(clientId);
  
  return {
    totalJobsPosted: jobs.length,
    activeJobs: jobs.filter(job => job.status === 'in-progress').length,
    completedJobs: jobs.filter(job => job.status === 'completed').length,
    openJobs: jobs.filter(job => job.status === 'open').length,
    cancelledJobs: jobs.filter(job => job.status === 'cancelled').length,
    totalSpent: client?.totalSpent || 0,
    averageJobValue: jobs.length > 0 ? 
      jobs.reduce((sum, job) => sum + job.budget, 0) / jobs.length : 0,
    preferredCategories: getClientPreferredCategories(clientId),
    satisfactionGiven: calculateClientSatisfactionGiven(clientId)
  };
};

// Advanced analytics functions
export const calculateRepeatClientRate = (artisanId: string): string => {
  const jobs = getJobsByArtisan(artisanId);
  const clients = [...new Set(jobs.map(job => job.clientId))];
  const totalJobs = jobs.length;
  const uniqueClients = clients.length;
  
  if (uniqueClients === 0) return '0';
  const repeatRate = ((totalJobs - uniqueClients) / totalJobs * 100);
  return repeatRate.toFixed(1);
};

export const getClientPreferredCategories = (clientId: string): string[] => {
  const jobs = getJobsByClient(clientId);
  const categoryCounts = jobs.reduce((acc, job) => {
    acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);
};

export const calculateClientSatisfactionGiven = (clientId: string): number => {
  const reviews = getReviewsByClient(clientId);
  if (reviews.length === 0) return 0;
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return parseFloat(averageRating.toFixed(1));
};

export const searchJobs = (query: string, filters?: {
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: Job['status'];
}): Job[] => {
  let results = mockJobs;
  
  // Text search in title and description
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply filters
  if (filters) {
    if (filters.category) {
      results = results.filter(job => job.category === filters.category);
    }
    if (filters.location) {
      results = results.filter(job => job.location.includes(filters.location!));
    }
    if (filters.minBudget !== undefined) {
      results = results.filter(job => job.budget >= filters.minBudget!);
    }
    if (filters.maxBudget !== undefined) {
      results = results.filter(job => job.budget <= filters.maxBudget!);
    }
    if (filters.status) {
      results = results.filter(job => job.status === filters.status);
    }
  }
  
  return results;
};

export const searchArtisans = (query: string, filters?: {
  skills?: string[];
  location?: string;
  minRating?: number;
  maxRate?: number;
  available?: boolean;
  verified?: boolean;
}): Artisan[] => {
  let results = mockArtisans;
  
  // Text search in name, bio, and skills
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(artisan => 
      artisan.name.toLowerCase().includes(searchTerm) ||
      artisan.bio.toLowerCase().includes(searchTerm) ||
      artisan.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply filters
  if (filters) {
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(artisan => 
        filters.skills!.some(skill => 
          artisan.skills.some(artisanSkill => 
            artisanSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    if (filters.location) {
      results = results.filter(artisan => artisan.location.includes(filters.location!));
    }
    if (filters.minRating !== undefined) {
      results = results.filter(artisan => artisan.rating >= filters.minRating!);
    }
    if (filters.maxRate !== undefined) {
      results = results.filter(artisan => artisan.hourlyRate <= filters.maxRate!);
    }
    if (filters.available !== undefined) {
      results = results.filter(artisan => artisan.isAvailable === filters.available);
    }
    if (filters.verified !== undefined) {
      results = results.filter(artisan => artisan.isVerified === filters.verified);
    }
  }
  
  return results;
};

// Enhanced Categories with comprehensive skill areas
export const jobCategories = [
  { id: 'carpentry', name: 'Carpentry & Woodwork', icon: '🔨', description: 'Furniture making, cabinet installation, structural carpentry' },
  { id: 'electrical', name: 'Electrical Services', icon: '⚡', description: 'Wiring, solar installation, electrical repairs, home automation' },
  { id: 'plumbing', name: 'Plumbing & Water Systems', icon: '🔧', description: 'Pipe installation, bathroom renovation, water heater service' },
  { id: 'painting', name: 'Painting & Decoration', icon: '🎨', description: 'Interior/exterior painting, decorative finishes, color consultation' },
  { id: 'welding', name: 'Welding & Metal Fabrication', icon: '🔥', description: 'Custom metalwork, security gates, structural welding' },
  { id: 'masonry', name: 'Masonry & Construction', icon: '🧱', description: 'Brickwork, stone work, concrete construction' },
  { id: 'gardening', name: 'Landscaping & Gardening', icon: '🌱', description: 'Garden design, maintenance, irrigation systems' },
  { id: 'cleaning', name: 'Cleaning Services', icon: '🧹', description: 'Deep cleaning, post-construction cleanup, maintenance cleaning' },
  { id: 'roofing', name: 'Roofing & Waterproofing', icon: '🏠', description: 'Roof installation, repairs, waterproofing solutions' },
  { id: 'tiling', name: 'Tiling & Flooring', icon: '⬛', description: 'Ceramic tiles, marble installation, floor finishing' },
  { id: 'hvac', name: 'HVAC & Ventilation', icon: '❄️', description: 'Air conditioning, ventilation systems, heating solutions' },
  { id: 'security', name: 'Security Systems', icon: '🛡️', description: 'CCTV installation, alarm systems, access control' }
];

// Comprehensive Nigerian locations with major cities and states
export const nigerianStates = [
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  'Port Harcourt, Nigeria',
  'Warri, Nigeria',
  'Kano, Nigeria',
  'Ibadan, Nigeria',
  'Benin City, Nigeria',
  'Enugu, Nigeria',
  'Kaduna, Nigeria',
  'Jos, Nigeria',
  'Calabar, Nigeria',
  'Uyo, Nigeria',
  'Aba, Nigeria',
  'Onitsha, Nigeria',
  'Ilorin, Nigeria',
  'Osogbo, Nigeria',
  'Abeokuta, Nigeria',
  'Akure, Nigeria',
  'Bauchi, Nigeria',
  'Gombe, Nigeria',
  'Maiduguri, Nigeria',
  'Yola, Nigeria',
  'Lafia, Nigeria',
  'Makurdi, Nigeria',
  'Lokoja, Nigeria',
  'Minna, Nigeria',
  'Sokoto, Nigeria',
  'Kebbi, Nigeria',
  'Gusau, Nigeria',
  'Katsina, Nigeria'
];

// Skill tags for enhanced searching and categorization
export const skillTags = [
  'Carpentry', 'Cabinet Installation', 'Furniture Making', 'Wood Finishing',
  'Electrical Wiring', 'Solar Installation', 'Home Automation', 'Industrial Electrical',
  'Plumbing', 'Bathroom Renovation', 'Water Heater Service', 'Pipe Installation',
  'Interior Painting', 'Exterior Painting', 'Decorative Finishes', 'Color Consultation',
  'Arc Welding', 'MIG Welding', 'TIG Welding', 'Metal Fabrication', 'Security Gates',
  'Brickwork', 'Stone Masonry', 'Concrete Work', 'Block Laying',
  'Landscape Design', 'Garden Maintenance', 'Irrigation Systems', 'Tree Pruning',
  'Deep Cleaning', 'Post-Construction Cleanup', 'Office Cleaning', 'Carpet Cleaning',
  'Roof Installation', 'Roof Repairs', 'Waterproofing', 'Gutter Installation',
  'Ceramic Tiling', 'Marble Installation', 'Floor Polishing', 'Tile Repairs',
  'Air Conditioning', 'Ventilation Systems', 'Heating Installation', 'HVAC Maintenance',
  'CCTV Installation', 'Alarm Systems', 'Access Control', 'Security Consultation'
];
