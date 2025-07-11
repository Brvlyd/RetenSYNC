// Login API service
import { setAuthToken, fetchUserProfile } from './authApi';

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

const API_BASE_URL = 'https://turnover-api-hd7ze.ondigitalocean.app/api';

// Login user with email and password
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Login failed with status ${response.status}`,
        error: errorData.error || 'Network error'
      };
    }

    const result: LoginResponse = await response.json();
    
    if (result.success && result.data?.token) {
      // Store the token
      setAuthToken(result.data.token);
      
      try {
        // Fetch user profile to get complete user data
        const userProfile = await fetchUserProfile();
        
        return {
          success: true,
          message: 'Login successful',
          data: {
            token: result.data.token,
            user: userProfile
          }
        };
      } catch (profileError) {
        console.error('Error fetching profile after login:', profileError);
        // Even if profile fetch fails, login was successful
        return result;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Demo login function (fallback if API doesn't exist)
export const demoLogin = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Demo credentials
  const demoUsers = [
    {
      email: 'admin@company.com',
      password: 'AdminPass123!',
      token: '19b7ffb6ddf5cae6a3fd733fefa814904489d167',
      user: {
        id: 25,
        employee_id: "EMP20250025",
        email: "admin@company.com",
        first_name: "Admin",
        last_name: "User",
        full_name: "Admin User",
        phone_number: "+6281234567890",
        date_of_birth: "1990-05-15",
        gender: "M" as const,
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
        token: "19b7ffb6ddf5cae6a3fd733fefa814904489d167"
      }
    },
    {
      email: 'user@company.com',
      password: 'UserPass123!',
      token: 'user-token-demo-12345',
      user: {
        id: 26,
        employee_id: "EMP20250026",
        email: "user@company.com",
        first_name: "Regular",
        last_name: "User",
        full_name: "Regular User",
        phone_number: "+6281234567891",
        date_of_birth: "1992-03-20",
        gender: "F" as const,
        marital_status: "single",
        education_level: "bachelor",
        address: "User Address Jakarta",
        position: "Software Engineer",
        department: 1,
        department_name: "IT",
        hire_date: "2024-06-15",
        role: "employee",
        is_admin: false,
        is_manager: false,
        is_hr: false,
        is_active: true,
        created_at: "2025-07-04T17:25:56.169457",
        token: "user-token-demo-12345"
      }
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = demoUsers.find(u => 
    u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    // Store the token and user data
    setAuthToken(user.token);
    
    // Store user data in the format expected by the app
    const userData = {
      id: user.user.id,
      name: user.user.full_name,
      email: user.user.email,
      employeeId: user.user.employee_id,
      position: user.user.position,
      department: user.user.department_name,
      phone: user.user.phone_number,
      role: user.user.role,
      isAdmin: user.user.is_admin,
      isManager: user.user.is_manager,
      isHr: user.user.is_hr,
      isActive: user.user.is_active,
      hireDate: user.user.hire_date,
      dateOfBirth: user.user.date_of_birth,
      gender: user.user.gender,
      maritalStatus: user.user.marital_status,
      educationLevel: user.user.education_level,
      address: user.user.address,
      createdAt: user.user.created_at
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        token: user.token,
        user: userData
      }
    };
  } else {
    return {
      success: false,
      message: 'Invalid email or password',
      error: 'Authentication failed'
    };
  }
};
