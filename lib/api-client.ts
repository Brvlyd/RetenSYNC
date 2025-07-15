// Authenticated API utility using role-based tokens
import {
  getAuthHeaders,
  getTokenForAPI,
  getUserRole,
  isTokenExpired,
  removeAuthToken,
} from '@/lib/auth-token';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://turnover-api-hd7ze.ondigitalocean.app/api';

/**
 * Custom fetch wrapper with automatic token handling
 */
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Check if token is expired before making request
  if (isTokenExpired()) {
    console.warn('Token is expired, redirecting to login');
    removeAuthToken();
    // Redirect to login - you can customize this based on your routing
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Authentication token has expired');
  }

  const token = getTokenForAPI();

  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  // Merge headers with authentication
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  // Construct full URL
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle authentication errors
  if (response.status === 401) {
    console.warn('Authentication failed, removing invalid token');
    removeAuthToken();

    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }

    throw new Error('Authentication failed. Please login again.');
  }

  return response;
};

/**
 * Generic API request handler with error handling
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await authenticatedFetch(endpoint, options);

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        message:
          data.message ||
          data.detail ||
          `Request failed with status ${response.status}`,
        status: response.status,
        code: data.code || 'UNKNOWN_ERROR',
      };
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * GET request with authentication
 */
export const get = <T = any>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> => {
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return apiRequest<T>(url.toString(), {
    method: 'GET',
  });
};

/**
 * POST request with authentication
 */
export const post = <T = any>(endpoint: string, data?: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request with authentication
 */
export const put = <T = any>(endpoint: string, data?: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH request with authentication
 */
export const patch = <T = any>(endpoint: string, data?: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request with authentication
 */
export const del = <T = any>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
};

/**
 * Upload file with authentication
 */
export const uploadFile = async <T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<T> => {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const token = getTokenForAPI();
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  const response = await authenticatedFetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Token ${token}`,
      // Don't set Content-Type for FormData, let browser set it with boundary
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || 'File upload failed');
  }

  return response.json();
};

/**
 * Role-based request - only execute if user has required role
 */
export const roleBasedRequest = async <T = any>(
  endpoint: string,
  requiredRole: string,
  options: RequestInit = {}
): Promise<T> => {
  const userRole = getUserRole();

  if (!userRole) {
    throw new Error('User role not found. Please login.');
  }

  if (userRole !== requiredRole && requiredRole !== 'any') {
    throw new Error(
      `Access denied. Required role: ${requiredRole}, your role: ${userRole}`
    );
  }

  return apiRequest<T>(endpoint, options);
};

/**
 * Admin-only request
 */
export const adminRequest = <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  return roleBasedRequest<T>(endpoint, 'admin', options);
};

/**
 * Example usage functions
 */

// Example: Get user profile
export const getUserProfile = async (): Promise<any> => {
  return get('/users/profile/');
};

// Example: Update user profile
export const updateUserProfile = async (profileData: any): Promise<any> => {
  return put('/users/profile/', profileData);
};

// Example: Get departments (admin only)
export const getDepartments = async (): Promise<any> => {
  return adminRequest('/departments/');
};

// Example: Create department (admin only)
export const createDepartment = async (departmentData: any): Promise<any> => {
  return adminRequest('/departments/', {
    method: 'POST',
    body: JSON.stringify(departmentData),
  });
};

// Example: Get performance data
export const getPerformanceData = async (): Promise<any> => {
  return get('/performance/');
};

// Example: Role-based data access
export const getRoleSpecificData = async (): Promise<any> => {
  const userRole = getUserRole();

  switch (userRole) {
  case 'admin':
    return get('/admin/dashboard-data/');
  case 'hr':
    return get('/hr/dashboard-data/');
  case 'manager':
    return get('/manager/dashboard-data/');
  case 'user':
    return get('/user/dashboard-data/');
  default:
    throw new Error('Unknown user role');
  }
};

/**
 * Batch requests with authentication
 */
export const batchRequest = async <T = any>(
  requests: Array<{ endpoint: string; options?: RequestInit }>
): Promise<T[]> => {
  const promises = requests.map(({ endpoint, options = {} }) =>
    apiRequest<T>(endpoint, options)
  );

  return Promise.all(promises);
};

/**
 * Request with retry logic for network failures
 */
export const requestWithRetry = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error: any) {
      // Don't retry on authentication errors
      if (error.status === 401 || error.status === 403) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw error;
      }

      console.warn(
        `Request attempt ${attempt} failed, retrying in ${retryDelay}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 2; // Exponential backoff
    }
  }

  throw new Error('Max retries exceeded');
};
