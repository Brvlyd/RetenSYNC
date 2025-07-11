// Standalone demo authentication system
// This works completely offline until your real API is ready

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: any;
  };
  error?: string;
}

// Demo user database (replace with real API when ready)
const DEMO_USERS = [
  {
    email: 'admin@company.com',
    password: 'AdminPass123!',
    token: 'demo-admin-token-19b7ffb6ddf5cae6a3fd733fefa814904489d167',
    user: {
      id: 25,
      employee_id: "EMP20250025",
      email: "admin@company.com",
      first_name: "Admin",
      last_name: "User",
      full_name: "Admin User",
      phone_number: "+6281234567890",
      date_of_birth: "1990-05-15",
      gender: "M",
      marital_status: "single",
      education_level: "master",
      address: "Admin Office Jakarta",
      position: "System Administrator",
      department: 1,
      department_name: "IT",
      hire_date: "2024-01-15",
      role: "admin",
      is_admin: true,
      is_manager: true,
      is_hr: false,
      is_active: true,
      created_at: "2025-07-04T17:25:56.169457",
      token: "demo-admin-token-19b7ffb6ddf5cae6a3fd733fefa814904489d167"
    }
  },
  {
    email: 'user@company.com',
    password: 'UserPass123!',
    token: 'demo-user-token-12345',
    user: {
      id: 26,
      employee_id: "EMP20250026",
      email: "user@company.com",
      first_name: "Regular",
      last_name: "User",
      full_name: "Regular User",
      phone_number: "+6281234567891",
      date_of_birth: "1992-08-20",
      gender: "F",
      marital_status: "married",
      education_level: "bachelor",
      address: "User Street Jakarta",
      position: "Employee",
      department: 2,
      department_name: "HR",
      hire_date: "2024-03-01",
      role: "user",
      is_admin: false,
      is_manager: false,
      is_hr: false,
      is_active: true,
      created_at: "2025-07-04T17:25:56.169457",
      token: "demo-user-token-12345"
    }
  }
];

// Store authentication data in localStorage
const storeAuthData = (token: string, user: any) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(user));
  
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: user }));
};

// Demo login function - works completely offline
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    console.log('🔍 Attempting demo login for:', credentials.email);
    
    // Find user in demo database
    const demoUser = DEMO_USERS.find(user => 
      user.email.toLowerCase() === credentials.email.toLowerCase() && 
      user.password === credentials.password
    );
    
    if (!demoUser) {
      console.log('❌ Invalid credentials');
      return {
        success: false,
        message: 'Invalid email or password',
        error: 'Authentication failed'
      };
    }
    
    // Store auth data
    storeAuthData(demoUser.token, demoUser.user);
    
    console.log('✅ Demo login successful:', demoUser.user);
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        token: demoUser.token,
        user: demoUser.user
      }
    };
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Alternative login function (for backward compatibility)
export const demoLogin = loginUser;

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  return !!(token && userData);
};

// Get current user
export const getCurrentUser = (): any | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Logout function
export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  
  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: null }));
  
  console.log('🚪 User logged out');
};

// Get stored token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};
