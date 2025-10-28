import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { initializeEcho, disconnectEcho } from '../config/echo';
import { authApi } from '../utils/api';
import { laravelApi } from '../utils/laravelApi';
import { transformUser } from '../utils/transformers';

// Enhanced User Interface
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  avatar?: string;
  type: 'client' | 'artisan' | 'admin';
  isVerified: boolean;
  isAvailable?: boolean;
  
  // Profile completion fields
  profileCompleted?: boolean;
  profileCompletionPercentage?: number;
  profileCompletedAt?: string;
  
  // Artisan fields
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  bio?: string;
  certifications?: string[];
  portfolioImages?: string[];
  responseTime?: string;
  serviceRadius?: number;
  emergencyService?: boolean;
  insuranceVerified?: boolean;
  
  // Client fields
  companyName?: string;
  preferredPaymentMethod?: string;
  
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

// Action Types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { token: string } };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: null
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'REFRESH_TOKEN_SUCCESS':
      return { ...state, token: action.payload.token };
    
    default:
      return state;
  }
};

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken')
};

// Auth Response Interface
interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message?: string;
}

// Context Interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  updateProfileLocally: (userData: User) => void;
  refreshAuthToken: () => Promise<boolean>;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location: string;
  type: 'client' | 'artisan';
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        laravelApi.setToken(token);
        // Initialize Echo with token for real-time features
        initializeEcho(token);
        // Optionally fetch and update user profile
        try {
          const response = await authApi.getProfile();
          if (response.data) {
            // Transform user object from snake_case to camelCase
            const user = transformUser(response.data);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                token,
                refreshToken: localStorage.getItem('refreshToken') || ''
              }
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token
  useEffect(() => {
    if (state.token) {
      const interval = setInterval(() => {
        refreshAuthToken();
      }, 14 * 60 * 1000); // Refresh every 14 minutes

      return () => clearInterval(interval);
    }
  }, [state.token]);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authApi.login({ email, password });
      console.log('🔍 Full login response:', response);
      console.log('🔍 Response.data:', response.data);
      
      // Laravel returns: { status, message, data: { user, token, refreshToken } }
      // laravelApi.post returns response.data, so we access data.data for the actual payload
      let { user, token, refreshToken } = response.data;
      
      // Transform user object from snake_case to camelCase
      user = transformUser(user);
      
      console.log('🔍 Extracted user:', user);
      console.log('🔍 Extracted token:', token);
      console.log('🔍 Extracted refreshToken:', refreshToken);
      
      if (!user || !token) {
        throw new Error('Invalid response: missing user or token');
      }
      
      laravelApi.setToken(token);
      localStorage.setItem('refreshToken', refreshToken || '');
      
      // Initialize Echo with new token for real-time features
      initializeEcho(token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token, refreshToken: refreshToken || '' }
      });

      return { success: true, data: { user, token, refreshToken: refreshToken || '' }, message: response.message };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const message = error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      return { success: false, data: {} as any, message };
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const registerData = {
        ...userData,
        password_confirmation: userData.password
      };
      const response = await authApi.register(registerData);
      // Laravel returns: { status, message, data: { user, token, refreshToken } }
      // laravelApi.post returns response.data, so we access data.data for the actual payload
      let { user, token, refreshToken } = response.data;
      
      // Transform user object from snake_case to camelCase
      user = transformUser(user);
      
      laravelApi.setToken(token);
      localStorage.setItem('refreshToken', refreshToken || '');
      
      // Initialize Echo with new token for real-time features
      initializeEcho(token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token, refreshToken: refreshToken || '' }
      });

      return { success: true, data: { user, token, refreshToken: refreshToken || '' }, message: response.message };
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      return { success: false, data: {} as any, message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    laravelApi.setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Disconnect Echo when logging out
    disconnectEcho();
    
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await laravelApi.put('/profiles/me', data);
      
      if (response.data) {
        // Transform user object from snake_case to camelCase
        const user = transformUser(response.data);
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: user
        });
      }

      return { success: true, data: response.data, message: response.message };
    } catch (error: any) {
      return { success: false, data: {} as any, message: error.message };
    }
  };

  // Update user profile locally without API call (used after profile setup)
  const updateProfileLocally = (userData: User) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: userData
    });
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    // Laravel Sanctum tokens don't expire by default
    // This function can be used to verify token validity
    try {
      const response = await authApi.getProfile();
      if (response.data) {
        return true;
      }
      return false;
    } catch (error) {
      logout();
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    updateProfileLocally,
    refreshAuthToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
