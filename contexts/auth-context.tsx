'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Types for our authentication system
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  education_level?: string;
  address?: string;
  position?: string;
  department?: number;
  hire_date?: string;
  role?: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  status?: 'active' | 'inactive';
}

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = user !== null;

  // Demo user data for different roles
  const createDemoUser = (email: string, role: 'user' | 'admin' = 'user'): User => {
    const baseUser = {
      id: `demo-${Date.now()}`,
      email,
      first_name: role === 'admin' ? 'Admin' : 'John',
      last_name: role === 'admin' ? 'Manager' : 'Doe',
      phone_number: '+62 812-3456-7890',
      date_of_birth: '1990-01-01',
      gender: 'M',
      marital_status: 'single',
      education_level: 'bachelor',
      address: '123 Demo Street, Jakarta',
      position: role === 'admin' ? 'HR Manager' : 'Software Engineer',
      department: 1,
      hire_date: '2023-01-01',
      role,
      avatar: '',
      bio: role === 'admin' ? 'Experienced HR manager' : 'Full-stack developer passionate about creating great user experiences',
      skills: role === 'admin' ? ['Management', 'HR', 'Leadership'] : ['React', 'TypeScript', 'Node.js'],
      experience_years: role === 'admin' ? 8 : 3,
      status: 'active' as const
    };
    return baseUser;
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try to login with real API first
      try {
        const { loginUser } = await import('@/app/api/authApi');
        
        const response = await loginUser({
          username: email, // Use email as username
          password: password
        });
        
        // Create user object from API response
        const authenticatedUser: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          phone_number: '',
          date_of_birth: '',
          gender: '',
          marital_status: '',
          education_level: '',
          address: '',
          position: '',
          department: 1,
          hire_date: '',
          role: response.user.role === 'admin' ? 'admin' : 'user',
          avatar: '',
          bio: '',
          skills: [],
          experience_years: 0,
          status: 'active'
        };
        
        setUser(authenticatedUser);
        
        // Token is already stored by loginUser function
        // Redirect based on role
        const redirectPath = authenticatedUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        router.push(redirectPath);
        
        return true;
      } catch (apiError) {
        console.warn('Real API login failed, falling back to demo mode:', apiError);
        
        // Fallback to demo login logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password) {
          // Determine role based on email or other criteria
          const isAdmin = email.includes('admin') || email.includes('manager');
          const role = isAdmin ? 'admin' : 'user';
          
          const demoUser = createDemoUser(email, role);
          setUser(demoUser);
          
          // Store demo authentication token for API fallback
          const demoToken = `demo-token-${role}-${Date.now()}`;
          localStorage.setItem('authToken', demoToken);
          
          // Redirect based on role
          const redirectPath = role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
          router.push(redirectPath);
          
          return true;
        }
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user from registration data
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        date_of_birth: userData.date_of_birth,
        gender: userData.gender,
        marital_status: userData.marital_status,
        education_level: userData.education_level,
        address: userData.address,
        position: userData.position,
        department: userData.department,
        hire_date: userData.hire_date,
        role: 'user', // Default to user role
        avatar: '',
        bio: '',
        skills: [],
        experience_years: 0,
        status: 'active'
      };
      
      setUser(newUser);
      
      // Redirect to user dashboard after registration
      router.push('/user/dashboard');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Try to logout with real API
      const { logoutUser } = await import('@/app/api/authApi');
      await logoutUser();
    } catch (error) {
      console.warn('API logout failed, clearing local state:', error);
      // Always clear local state even if API fails
      localStorage.removeItem('authToken');
    }
    
    setUser(null);
    router.push('/auth/login');
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    const isAuthPage = pathname?.startsWith('/auth');
    
    if (!isAuthenticated && !isAuthPage) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, pathname, router]);

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
