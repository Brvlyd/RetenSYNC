// Authentication API utility functions
const API_BASE_URL = 'https://turnover-api-hd7ze.ondigitalocean.app/api';

// TypeScript interfaces for authentication
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role?: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Helper function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `Request failed with status ${response.status}`;
  let errorDetails = null;

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
    errorDetails = errorData;
  } catch {
    // If response is not JSON, use the status text
    errorMessage = response.statusText || errorMessage;
  }

  const error: ApiError = {
    message: errorMessage,
    status: response.status,
    details: errorDetails,
  };

  throw error;
};

// Login function
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      throw error;
    }
    throw new Error('Failed to login due to network error');
  }
};

// Register function
export const registerUser = async (userData: RegisterRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      throw error;
    }
    throw new Error('Failed to register due to network error');
  }
};

// Logout function
export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Already logged out
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    // Don't throw error if logout fails on server side
    // Always clear local token
  } catch (error) {
    console.warn('Logout request failed, but clearing local token:', error);
  } finally {
    // Always clear the token locally
    localStorage.removeItem('authToken');
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<LoginResponse['user']> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      throw error;
    }
    throw new Error('Failed to get user profile due to network error');
  }
};

// Validate token
export const validateToken = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    localStorage.removeItem('authToken');
    return false;
  }
};
