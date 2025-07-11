// Types for user data and authentication
export interface User {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  position: string;
  department: string;
  phone: string;
  role: string;
  isAdmin: boolean;
  isManager: boolean;
  isHr: boolean;
  isActive: boolean;
  hireDate: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  maritalStatus: string;
  educationLevel: string;
  address: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
