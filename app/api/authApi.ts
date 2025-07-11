// Authentication API service for user profile and logout
import { User } from '@/types/auth';

export interface UserProfile {
  id: number;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  marital_status: string;
  education_level: string;
  address: string;
  position: string;
  department: number;
  department_name: string;
  hire_date: string;
  role: string;
  is_admin: boolean;
  is_manager: boolean;
  is_hr: boolean;
  is_active: boolean;
  created_at: string;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL = 'https://turnover-api-hd7ze.ondigitalocean.app/api';

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || localStorage.getItem('api_token');
  }
  return null;
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('api_token', token); // Keep compatibility with existing code
  }
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('api_token');
    localStorage.removeItem('user');
  }
};

// Fetch user profile
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const result: ApiResponse<UserProfile> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch profile');
    }

    // Update token in localStorage if new token is provided
    if (result.data.token && result.data.token !== token) {
      setAuthToken(result.data.token);
    }

    // Store user data in localStorage for other components
    if (typeof window !== 'undefined') {
      const userData = {
        id: result.data.id,
        name: result.data.full_name,
        email: result.data.email,
        employeeId: result.data.employee_id,
        position: result.data.position,
        department: result.data.department_name,
        phone: result.data.phone_number,
        role: result.data.role,
        isAdmin: result.data.is_admin,
        isManager: result.data.is_manager,
        isHr: result.data.is_hr,
        isActive: result.data.is_active,
        hireDate: result.data.hire_date,
        dateOfBirth: result.data.date_of_birth,
        gender: result.data.gender,
        maritalStatus: result.data.marital_status,
        educationLevel: result.data.education_level,
        address: result.data.address,
        createdAt: result.data.created_at
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Dispatch custom event for components listening to user data changes
      window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  const token = getAuthToken();
  
  if (!token) {
    // If no token, just clear local storage
    removeAuthToken();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Clear local storage regardless of API response
    removeAuthToken();

    if (!response.ok) {
      console.warn(`Logout API returned ${response.status}, but local storage cleared`);
      return;
    }

    const result = await response.json();
    console.log('Logout successful:', result.message || 'User logged out');
  } catch (error) {
    console.error('Error during logout:', error);
    // Still clear local storage even if API call fails
    removeAuthToken();
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Get current user data from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Refresh user profile data
export const refreshUserProfile = async (): Promise<UserProfile> => {
  try {
    const profile = await fetchUserProfile();
    return profile;
  } catch (error) {
    console.error('Error refreshing user profile:', error);
    throw error;
  }
};

// Initialize auth - call this on app startup
export const initializeAuth = async (): Promise<UserProfile | null> => {
  try {
    if (!isAuthenticated()) {
      return null;
    }
    
    const profile = await fetchUserProfile();
    return profile;
  } catch (error) {
    console.error('Error initializing auth:', error);
    // If authentication fails, clear tokens
    removeAuthToken();
    return null;
  }
};
