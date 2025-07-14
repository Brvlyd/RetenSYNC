'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  saveAuthToken, 
  getAuthToken, 
  removeAuthToken, 
  updateAuthToken,
  getUserRole,
  isAdmin,
  isTokenExpired,
  TokenData 
} from '@/lib/auth-token';

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
  role?: 'user' | 'admin' | 'hr' | 'manager';
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  status?: 'active' | 'inactive';
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'admin' | 'hr' | 'manager';
  };
  expires_at: string;
}

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  isAdminUser: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshAuth: () => void;
  checkTokenExpiration: () => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = user !== null;
  const userRole = getUserRole();
  const isAdminUser = isAdmin();

  // Demo user data for different roles
  const createDemoUser = (email: string, role: 'user' | 'admin' | 'hr' | 'manager' = 'user'): User => {
    const baseUser = {
      id: `demo-${Date.now()}`,
      email,
      first_name: role === 'admin' ? 'Admin' : role === 'hr' ? 'HR' : role === 'manager' ? 'Manager' : 'John',
      last_name: role === 'admin' ? 'Manager' : role === 'hr' ? 'Specialist' : role === 'manager' ? 'Lead' : 'Doe',
      phone_number: '+1234567890',
      date_of_birth: '1990-01-01',
      gender: 'Not specified',
      marital_status: 'Single',
      education_level: 'Bachelor\'s Degree',
      address: '123 Demo Street, Demo City, DC 12345',
      position: role === 'admin' ? 'System Administrator' : role === 'hr' ? 'HR Specialist' : role === 'manager' ? 'Department Manager' : 'Software Developer',
      department: role === 'admin' ? 1 : role === 'hr' ? 2 : role === 'manager' ? 1 : 1,
      hire_date: '2023-01-15',
      role,
      avatar: '',
      bio: `Demo ${role} user for testing and development purposes.`,
      skills: role === 'admin' ? ['System Administration', 'User Management'] : role === 'hr' ? ['Recruitment', 'Employee Relations'] : role === 'manager' ? ['Team Leadership', 'Project Management'] : ['JavaScript', 'React', 'TypeScript'],
      experience_years: role === 'admin' ? 8 : role === 'hr' ? 5 : role === 'manager' ? 7 : 3,
      status: 'active' as const
    };

    return baseUser;
  };

  // Check token expiration and refresh authentication state
  const checkTokenExpiration = (): boolean => {
    if (isTokenExpired()) {
      console.warn('Token expired, logging out user');
      logout();
      return false;
    }
    return true;
  };

  // Refresh authentication state from stored token
  const refreshAuth = () => {
    const authInfo = getAuthToken();
    
    if (authInfo.isValid && authInfo.userId && authInfo.email && authInfo.role) {
      // Recreate user from stored token data
      const restoredUser: User = {
        id: authInfo.userId,
        email: authInfo.email,
        first_name: authInfo.role === 'admin' ? 'Admin' : authInfo.role === 'hr' ? 'HR' : authInfo.role === 'manager' ? 'Manager' : 'User',
        last_name: authInfo.role === 'admin' ? 'Manager' : authInfo.role === 'hr' ? 'Specialist' : authInfo.role === 'manager' ? 'Lead' : 'Employee',
        role: authInfo.role as 'user' | 'admin' | 'hr' | 'manager',
        status: 'active'
      };
      
      setUser(restoredUser);
      console.log('Authentication restored from token');
    } else {
      setUser(null);
      console.log('No valid authentication found');
    }
  };

  // Initialize authentication state on mount
  useEffect(() => {
    setIsLoading(true);
    
    // Check for existing valid authentication
    refreshAuth();
    
    setIsLoading(false);
  }, []);

  // Monitor token expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setUser(null);

    try {
      // Try real API login first
      const authApi = await import('@/app/api/authApi');
      const response = await authApi.loginUser({
        email: email,
        password: password
      });
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        
        // Determine role based on flags
        let userRole: 'user' | 'admin' | 'hr' | 'manager' = 'user';
        if (user.is_admin) userRole = 'admin';
        else if (user.is_hr) userRole = 'hr';
        else if (user.is_manager) userRole = 'manager';
        
        // Create token data
        const tokenData: TokenData = {
          token: user.token,
          role: userRole,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days default
          userId: user.id.toString(),
          email: user.email
        };
        
        // Save token securely
        const saved = saveAuthToken(tokenData);
        
        if (saved) {
          // Create authenticated user
          const authenticatedUser: User = {
            id: user.id.toString(),
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number || '',
            date_of_birth: user.date_of_birth || '',
            gender: user.gender || '',
            marital_status: user.marital_status || '',
            education_level: user.education_level || '',
            address: user.address || '',
            position: user.position || '',
            department: user.department,
            hire_date: user.hire_date || '',
            role: userRole,
            avatar: '',
            bio: '',
            skills: [],
            experience_years: 0,
            status: user.is_active ? 'active' : 'inactive'
          };
          
          setUser(authenticatedUser);
          
          // Redirect based on role
          const redirectPath = userRole === 'admin' ? '/admin/dashboard' 
                            : userRole === 'hr' ? '/hr/dashboard'
                            : userRole === 'manager' ? '/manager/dashboard'
                            : '/user/dashboard';
          router.push(redirectPath);
          
          return true;
        }
      }
    } catch (apiError) {
      console.warn('Real API login failed, falling back to demo mode:', apiError);
    }
    
    // Fallback to demo login logic
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        // Determine role based on email or other criteria
        let role: 'user' | 'admin' | 'hr' | 'manager' = 'user';
        
        if (email.includes('admin')) {
          role = 'admin';
        } else if (email.includes('hr')) {
          role = 'hr';
        } else if (email.includes('manager')) {
          role = 'manager';
        }
        
        const demoUser = createDemoUser(email, role);
        setUser(demoUser);
        
        // Create demo token data
        const demoTokenData: TokenData = {
          token: `demo-token-${role}-${Date.now()}`,
          role,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          userId: demoUser.id,
          email: demoUser.email
        };
        
        // Save demo token
        saveAuthToken(demoTokenData);
        
        // Redirect based on role
        const redirectPath = role === 'admin' ? '/admin/dashboard' 
                          : role === 'hr' ? '/hr/dashboard'
                          : role === 'manager' ? '/manager/dashboard'
                          : '/user/dashboard';
        router.push(redirectPath);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Demo login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try to register with real API first
      try {
        const { registerUser } = await import('@/app/api/authApi');
        
        const response = await registerUser({
          email: userData.email,
          password: userData.password,
          password_confirm: userData.password_confirm,
          first_name: userData.first_name,
          last_name: userData.last_name,
          department: userData.department
        });
        
        if (response.success && response.data?.user) {
          const user = response.data.user;
          
          // Determine role based on flags
          let userRole: 'user' | 'admin' | 'hr' | 'manager' = 'user';
          if (user.is_admin) userRole = 'admin';
          else if (user.is_hr) userRole = 'hr';
          else if (user.is_manager) userRole = 'manager';
          
          // Create user object from API response
          const authenticatedUser: User = {
            id: user.id.toString(),
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number || userData.phone_number || '',
            date_of_birth: user.date_of_birth || userData.date_of_birth || '',
            gender: user.gender || userData.gender || '',
            marital_status: user.marital_status || userData.marital_status || '',
            education_level: user.education_level || userData.education_level || '',
            address: user.address || userData.address || '',
            position: user.position || userData.position || '',
            department: user.department,
            hire_date: user.hire_date || userData.hire_date || '',
            role: userRole,
            avatar: '',
            bio: '',
            skills: [],
            experience_years: 0,
            status: user.is_active ? 'active' : 'inactive'
          };
          
          setUser(authenticatedUser);
          
          // Save token from registration response
          if (user.token) {
            const tokenData: TokenData = {
              token: user.token,
              role: userRole,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              userId: authenticatedUser.id,
              email: authenticatedUser.email
            };
            saveAuthToken(tokenData);
          }
          
          // Redirect to user dashboard for new registrations
          router.push('/user/dashboard');
          return true;
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (apiError) {
        console.warn('Real API registration failed, using demo mode:', apiError);
        
        // Fallback to demo registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create demo user from registration data
        const demoUser: User = {
          id: `demo-user-${Date.now()}`,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone_number: userData.phone_number || '',
          date_of_birth: userData.date_of_birth || '',
          gender: userData.gender || '',
          marital_status: userData.marital_status || '',
          education_level: userData.education_level || '',
          address: userData.address || '',
          position: userData.position || '',
          department: userData.department || 1,
          hire_date: userData.hire_date || '',
          role: 'user', // Default to user role
          avatar: '',
          bio: '',
          skills: [],
          experience_years: 0,
          status: 'active'
        };
        
        setUser(demoUser);
        
        // Save demo token
        const demoTokenData: TokenData = {
          token: `demo-token-user-${Date.now()}`,
          role: 'user',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          userId: demoUser.id,
          email: demoUser.email
        };
        saveAuthToken(demoTokenData);
        
        // Redirect to user dashboard
        router.push('/user/dashboard');
        
        return true;
      }
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
    userRole,
    isAdminUser,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
    checkTokenExpiration
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
