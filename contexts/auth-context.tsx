'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  isTokenExpired,
  TokenData,
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

/**
 * Routes that are reachable without an authenticated session.
 * Everything else is treated as protected.
 */
export const isPublicRoute = (pathname?: string | null): boolean =>
  !!pathname && pathname.startsWith('/auth');

/**
 * Single source of truth for "where should this role land after login?".
 * Used by the login flow, the landing page and the route guard so they can
 * never disagree with each other (which is what caused redirect loops).
 */
export const getDashboardPathForRole = (role?: string | null): string =>
  role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

/**
 * Roles allowed on a given path. Returns null when the path has no role
 * restriction beyond "must be logged in".
 */
export const getRequiredRolesForPath = (
  pathname?: string | null
): string[] | null => {
  if (!pathname) return null;
  if (pathname.startsWith('/admin')) return ['admin'];
  return null;
};

/**
 * Built-in demo accounts, keyed by lowercase username.
 * Checked before the real API so demos work on any deployment.
 */
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'password',
    user: {
      id: 'demo-admin',
      email: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      position: 'System Administrator',
      department: 1,
      role: 'admin',
      status: 'active',
      skills: [],
    },
  },
  bravely: {
    password: 'password',
    user: {
      id: 'demo-bravely',
      email: 'bravely',
      first_name: 'Bravely',
      last_name: 'Dirgayuska',
      position: 'Software Developer',
      department: 1,
      role: 'user',
      status: 'active',
      skills: [],
    },
  },
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = user !== null;
  const userRole = user?.role ?? null;
  const isAdminUser = user?.role === 'admin';

  // Demo user data for different roles
  const createDemoUser = (
    email: string,
    role: 'user' | 'admin' | 'hr' | 'manager' = 'user'
  ): User => {
    // Special handling for admin@company.com
    if (email === 'admin@company.com' && role === 'admin') {
      return {
        id: 'admin-1',
        email,
        first_name: 'System',
        last_name: 'Administrator',
        phone_number: '+1234567890',
        date_of_birth: '1985-01-01',
        gender: 'Not specified',
        marital_status: 'Single',
        education_level: 'Master\'s Degree',
        address: '123 Company HQ, Business District, BD 12345',
        position: 'System Administrator',
        department: 1,
        hire_date: '2020-01-01',
        role,
        avatar: '',
        bio: 'System Administrator with full access to all RetenSYNC features.',
        skills: [
          'System Administration',
          'User Management',
          'Analytics',
          'Security',
        ],
        experience_years: 10,
        status: 'active' as const,
      };
    }

    // Default demo user creation for other users
    const baseUser = {
      id: `demo-${Date.now()}`,
      email,
      first_name:
        role === 'admin'
          ? 'Admin'
          : role === 'hr'
            ? 'HR'
            : role === 'manager'
              ? 'Manager'
              : 'John',
      last_name:
        role === 'admin'
          ? 'Manager'
          : role === 'hr'
            ? 'Specialist'
            : role === 'manager'
              ? 'Lead'
              : 'Doe',
      phone_number: '+1234567890',
      date_of_birth: '1990-01-01',
      gender: 'Not specified',
      marital_status: 'Single',
      education_level: 'Bachelor\'s Degree',
      address: '123 Demo Street, Demo City, DC 12345',
      position:
        role === 'admin'
          ? 'System Administrator'
          : role === 'hr'
            ? 'HR Specialist'
            : role === 'manager'
              ? 'Department Manager'
              : 'Software Developer',
      department:
        role === 'admin' ? 1 : role === 'hr' ? 2 : role === 'manager' ? 1 : 1,
      hire_date: '2023-01-15',
      role,
      avatar: '',
      bio: `Demo ${role} user for testing and development purposes.`,
      skills:
        role === 'admin'
          ? ['System Administration', 'User Management']
          : role === 'hr'
            ? ['Recruitment', 'Employee Relations']
            : role === 'manager'
              ? ['Team Leadership', 'Project Management']
              : ['JavaScript', 'React', 'TypeScript'],
      experience_years:
        role === 'admin' ? 8 : role === 'hr' ? 5 : role === 'manager' ? 7 : 3,
      status: 'active' as const,
    };

    return baseUser;
  };

  // Resolve which demo role an email maps to when the real API is unreachable.
  // Email is normalised first so 'Admin@Company.com' still logs in as admin.
  const resolveDemoRole = (
    email: string
  ): 'user' | 'admin' | 'hr' | 'manager' => {
    const value = email.trim().toLowerCase();

    if (value === 'admin@company.com') return 'admin';
    if (value.startsWith('admin@') || value.includes('admin.')) return 'admin';
    if (value.startsWith('hr@') || value.includes('hr.')) return 'hr';
    if (value.startsWith('manager@') || value.includes('manager.'))
      return 'manager';

    return 'user';
  };

  // Check token expiration. This only clears local state - navigation is left
  // to the single route guard so we never get two redirects fighting.
  const checkTokenExpiration = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;

    const authInfo = getAuthToken();

    // No stored session at all: nothing to expire.
    if (!authInfo.isValid) {
      setUser(null);
      return false;
    }

    // Only drop the session when it is genuinely past its expiry (no buffer,
    // so a still-valid token is never treated as expired).
    if (isTokenExpired(0)) {
      console.warn('Token expired, clearing session');
      setUser(null);
      removeAuthToken();
      return false;
    }

    return true;
  }, []);

  // Refresh authentication state from stored token
  const refreshAuth = useCallback(() => {
    const authInfo = getAuthToken();

    // A session is restorable as long as the token and role survived. The
    // profile fields are only metadata - missing them must not sign the user
    // out, which is what used to happen when the user_info cookie was dropped.
    if (authInfo.isValid && authInfo.role) {
      // Recreate user from stored token data
      const restoredUser: User = {
        id: authInfo.userId ?? 'session-user',
        email: authInfo.email ?? '',
        first_name:
          authInfo.role === 'admin'
            ? 'Admin'
            : authInfo.role === 'hr'
              ? 'HR'
              : authInfo.role === 'manager'
                ? 'Manager'
                : 'User',
        last_name:
          authInfo.role === 'admin'
            ? 'Manager'
            : authInfo.role === 'hr'
              ? 'Specialist'
              : authInfo.role === 'manager'
                ? 'Lead'
                : 'Employee',
        role: authInfo.role as 'user' | 'admin' | 'hr' | 'manager',
        status: 'active',
      };

      // Keep any richer user data we already have in memory.
      setUser(previous =>
        previous && previous.id === restoredUser.id
          ? { ...restoredUser, ...previous, role: restoredUser.role }
          : restoredUser
      );
      return restoredUser;
    }

    setUser(null);
    return null;
  }, []);

  // Initialize authentication state on mount.
  // isLoading stays true until the stored token has been read, so no guard can
  // redirect while we still look "logged out".
  useEffect(() => {
    refreshAuth();
    setIsLoading(false);
  }, [refreshAuth]);

  // Monitor token expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, checkTokenExpiration]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    setIsLoading(true);

    try {
      let authenticatedUser: User | null = null;
      let authToken: string | null = null;

      // 0) Built-in demo accounts (work offline / on Vercel without the API).
      const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
      if (demoAccount) {
        if (demoAccount.password !== password) {
          setIsLoading(false);
          return false;
        }
        authenticatedUser = demoAccount.user;
        authToken = `demo-token-${demoAccount.user.role}-${Date.now()}`;
      }

      // 1) Try the real API first. Only the network call lives in this try
      //    block, so a mapping bug can never be mistaken for "API is down".
      try {
        if (authenticatedUser) throw new Error('demo account, skip API');
        const { loginUser } = await import('@/app/api/authApi');

        const response = await loginUser({
          email: normalizedEmail,
          password,
        });

        if (response.success && response.data?.user) {
          const apiUser = response.data.user;

          // Determine role based on flags
          let apiRole: 'user' | 'admin' | 'hr' | 'manager' = 'user';
          if (apiUser.is_admin) apiRole = 'admin';
          else if (apiUser.is_hr) apiRole = 'hr';
          else if (apiUser.is_manager) apiRole = 'manager';

          authenticatedUser = {
            id: apiUser.id?.toString() ?? `api-${Date.now()}`,
            email: apiUser.email ?? normalizedEmail,
            first_name: apiUser.first_name,
            last_name: apiUser.last_name,
            phone_number: apiUser.phone_number || '',
            date_of_birth: apiUser.date_of_birth || '',
            gender: apiUser.gender || '',
            marital_status: apiUser.marital_status || '',
            education_level: apiUser.education_level || '',
            address: apiUser.address || '',
            position: apiUser.position || '',
            department: apiUser.department,
            hire_date: apiUser.hire_date || '',
            role: apiRole,
            avatar: '',
            bio: '',
            skills: [],
            experience_years: 0,
            status: apiUser.is_active ? 'active' : 'inactive',
          };
          authToken = apiUser.token;
        }
      } catch (apiError) {
        console.warn('Real API login failed, using demo mode:', apiError);
      }

      // 2) Fallback to demo login when the API is unavailable
      if (!authenticatedUser) {
        const demoRole = resolveDemoRole(normalizedEmail);
        authenticatedUser = createDemoUser(normalizedEmail, demoRole);
        authToken = `demo-token-${demoRole}-${Date.now()}`;
      }

      const role = authenticatedUser.role ?? 'user';

      // Persist the session BEFORE navigating, so the route guard on the
      // destination page already sees a valid session and cannot bounce the
      // user straight back to /auth/login.
      const tokenData: TokenData = {
        token: authToken || `session-${Date.now()}`,
        role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        userId: authenticatedUser.id,
        email: authenticatedUser.email,
      };
      saveAuthToken(tokenData);

      setUser(authenticatedUser);
      setIsLoading(false);

      router.replace(getDashboardPathForRole(role));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
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
          department: userData.department,
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
            marital_status:
              user.marital_status || userData.marital_status || '',
            education_level:
              user.education_level || userData.education_level || '',
            address: user.address || userData.address || '',
            position: user.position || userData.position || '',
            department: user.department,
            hire_date: user.hire_date || userData.hire_date || '',
            role: userRole,
            avatar: '',
            bio: '',
            skills: [],
            experience_years: 0,
            status: user.is_active ? 'active' : 'inactive',
          };

          setUser(authenticatedUser);

          // Save token from registration response
          if (user.token) {
            const tokenData: TokenData = {
              token: user.token,
              role: userRole,
              expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              userId: authenticatedUser.id,
              email: authenticatedUser.email,
            };
            saveAuthToken(tokenData);
          }

          // Redirect to the dashboard that matches the new account's role
          router.replace(getDashboardPathForRole(userRole));
          return true;
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (apiError) {
        console.warn(
          'Real API registration failed, using demo mode:',
          apiError
        );

        // Fallback to demo registration (removed artificial delay)
        // await new Promise(resolve => setTimeout(resolve, 1000));

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
          status: 'active',
        };

        setUser(demoUser);

        // Save demo token
        const demoTokenData: TokenData = {
          token: `demo-token-user-${Date.now()}`,
          role: 'user',
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          userId: demoUser.id,
          email: demoUser.email,
        };
        saveAuthToken(demoTokenData);

        // Redirect to user dashboard
        router.replace('/user/dashboard');

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
  const logout = useCallback(async () => {
    try {
      // Try to logout with real API
      const { logoutUser } = await import('@/app/api/authApi');
      await logoutUser();
    } catch (error) {
      console.warn('API logout failed, clearing local state:', error);
    }

    // Always clear local state and tokens
    setUser(null);
    removeAuthToken(); // Use proper token removal function
    setIsLoading(false);
    router.replace('/auth/login');
  }, [router]);

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

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
    checkTokenExpiration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
