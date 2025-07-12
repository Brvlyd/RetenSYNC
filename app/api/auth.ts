// Simple authentication system
'use client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_admin: boolean;
    token: string;
  };
}

// Demo users
const DEMO_USERS = {
  'admin@company.com': {
    id: 1,
    email: 'admin@company.com',
    full_name: 'System Administrator',
    role: 'admin',
    is_admin: true,
    token: 'admin-token-12345',
    password: 'AdminPass123!'
  },
  'user@company.com': {
    id: 2,
    email: 'user@company.com',
    full_name: 'Test User',
    role: 'employee',
    is_admin: false,
    token: 'user-token-67890',
    password: 'UserPass123!'
  }
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('🔐 Login attempt:', credentials.email);
  
  const user = Object.values(DEMO_USERS).find(u => 
    u.email.toLowerCase() === credentials.email.toLowerCase() && 
    u.password === credentials.password
  );
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', user.token);
    localStorage.setItem('user_data', JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_admin: user.is_admin,
      token: user.token
    }));
    console.log('✅ User logged in:', user.email);
  }
  
  return {
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_admin: user.is_admin,
      token: user.token
    }
  };
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    console.log('🚪 User logged out');
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  return !!(token && userData);
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.is_admin || false;
};
