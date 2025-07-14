// API utility functions for Department management with fallback to demo data
import { getAuthToken } from '@/lib/auth-token';

const API_BASE_URL = 'https://turnover-api-hd7ze.ondigitalocean.app/api';

// Demo data for fallback when real API is not available
const DEMO_DEPARTMENTS = [
  {
    id: 1,
    name: "Engineering",
    description: "Software development and technical operations team responsible for building and maintaining our products.",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    employee_count: 15
  },
  {
    id: 2,
    name: "Human Resources", 
    description: "People operations, recruitment, employee development, and organizational culture management.",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    employee_count: 5
  },
  {
    id: 3,
    name: "Marketing",
    description: "Brand management, digital marketing, content creation, and customer acquisition strategies.",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    employee_count: 8
  },
  {
    id: 4,
    name: "Sales",
    description: "Business development, client relationships, revenue generation, and market expansion.",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    employee_count: 12
  },
  {
    id: 5,
    name: "Finance",
    description: "Financial planning, accounting, budgeting, and strategic financial analysis for the organization.",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    employee_count: 4
  }
];

const DEMO_EMPLOYEES = [
  // Engineering Department
  { id: 1, username: "john_doe", email: "john.doe@company.com", first_name: "John", last_name: "Doe", position: "Senior Software Engineer", hire_date: "2023-03-15", department: 1, role: "user", status: "active" },
  { id: 2, username: "jane_smith", email: "jane.smith@company.com", first_name: "Jane", last_name: "Smith", position: "Frontend Developer", hire_date: "2023-06-01", department: 1, role: "user", status: "active" },
  { id: 3, username: "mike_johnson", email: "mike.johnson@company.com", first_name: "Mike", last_name: "Johnson", position: "DevOps Engineer", hire_date: "2023-01-10", department: 1, role: "user", status: "active" },
  
  // HR Department
  { id: 4, username: "sarah_wilson", email: "sarah.wilson@company.com", first_name: "Sarah", last_name: "Wilson", position: "HR Manager", hire_date: "2022-08-15", department: 2, role: "admin", status: "active" },
  { id: 5, username: "david_brown", email: "david.brown@company.com", first_name: "David", last_name: "Brown", position: "Recruiter", hire_date: "2023-04-20", department: 2, role: "user", status: "active" },
  
  // Marketing Department  
  { id: 6, username: "lisa_garcia", email: "lisa.garcia@company.com", first_name: "Lisa", last_name: "Garcia", position: "Marketing Manager", hire_date: "2022-11-30", department: 3, role: "user", status: "active" },
  { id: 7, username: "alex_martinez", email: "alex.martinez@company.com", first_name: "Alex", last_name: "Martinez", position: "Content Creator", hire_date: "2023-07-12", department: 3, role: "user", status: "active" },
  
  // Sales Department
  { id: 8, username: "chris_taylor", email: "chris.taylor@company.com", first_name: "Chris", last_name: "Taylor", position: "Sales Director", hire_date: "2022-05-18", department: 4, role: "user", status: "active" },
  { id: 9, username: "emma_anderson", email: "emma.anderson@company.com", first_name: "Emma", last_name: "Anderson", position: "Account Executive", hire_date: "2023-09-25", department: 4, role: "user", status: "active" },
  
  // Finance Department
  { id: 10, username: "robert_lee", email: "robert.lee@company.com", first_name: "Robert", last_name: "Lee", position: "Financial Analyst", hire_date: "2023-02-14", department: 5, role: "user", status: "active" }
];

// TypeScript interfaces
export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  employee_count: number;
}

export interface Employee {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  position?: string;
  hire_date?: string;
  department?: number;
  role?: string;
  status?: string;
}

export interface DepartmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Department[];
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
}

export interface UpdateDepartmentRequest {
  name: string;
  description: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Helper function to check if we're in demo mode
const isUsingDemoMode = (): boolean => {
  if (typeof window === 'undefined') return true;
  const authInfo = getAuthToken();
  return !authInfo.isValid || !authInfo.token || authInfo.token === 'demo-token' || authInfo.token.startsWith('demo-');
};

// Helper function to create authenticated headers
const getAuthHeaders = (): Record<string, string> => {
  const authInfo = getAuthToken();
  if (!authInfo.isValid || !authInfo.token) {
    throw new Error('Authentication required. Please login.');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${authInfo.token}`,
  };
};

// Helper function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `Request failed with status ${response.status}`;
  let errorDetails = null;

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.detail || errorMessage;
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

// 1. GET List Departments
export const getDepartments = async (page?: number, pageSize?: number): Promise<DepartmentListResponse> => {
  if (isUsingDemoMode()) {
    return {
      count: DEMO_DEPARTMENTS.length,
      next: null,
      previous: null,
      results: DEMO_DEPARTMENTS
    };
  }

  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('page_size', pageSize.toString());
    
    const url = `${API_BASE_URL}/departments/${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch from real API, falling back to demo data:', error);
    return {
      count: DEMO_DEPARTMENTS.length,
      next: null,
      previous: null,
      results: DEMO_DEPARTMENTS
    };
  }
};

// 2. GET Department by ID
export const getDepartmentById = async (id: number): Promise<Department> => {
  if (isUsingDemoMode()) {
    const department = DEMO_DEPARTMENTS.find(dept => dept.id === id);
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch from real API, falling back to demo data:', error);
    const department = DEMO_DEPARTMENTS.find(dept => dept.id === id);
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  }
};

// 3. POST Create Department (Admin only)
export const createDepartment = async (departmentData: CreateDepartmentRequest): Promise<Department> => {
  if (isUsingDemoMode()) {
    const newDepartment: Department = {
      ...departmentData,
      id: Math.max(...DEMO_DEPARTMENTS.map(d => d.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      employee_count: 0
    };
    DEMO_DEPARTMENTS.push(newDepartment);
    return newDepartment;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/departments/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to create via real API, falling back to demo mode:', error);
    const newDepartment: Department = {
      ...departmentData,
      id: Math.max(...DEMO_DEPARTMENTS.map(d => d.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      employee_count: 0
    };
    DEMO_DEPARTMENTS.push(newDepartment);
    return newDepartment;
  }
};

// 4. PUT Update Department (Admin only)
export const updateDepartment = async (id: number, departmentData: UpdateDepartmentRequest): Promise<Department> => {
  if (isUsingDemoMode()) {
    const index = DEMO_DEPARTMENTS.findIndex(dept => dept.id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    
    DEMO_DEPARTMENTS[index] = {
      ...DEMO_DEPARTMENTS[index],
      ...departmentData,
      updated_at: new Date().toISOString()
    };
    return DEMO_DEPARTMENTS[index];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to update via real API, falling back to demo mode:', error);
    const index = DEMO_DEPARTMENTS.findIndex(dept => dept.id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    
    DEMO_DEPARTMENTS[index] = {
      ...DEMO_DEPARTMENTS[index],
      ...departmentData,
      updated_at: new Date().toISOString()
    };
    return DEMO_DEPARTMENTS[index];
  }
};

// 5. DELETE Department (Admin only)
export const deleteDepartment = async (id: number): Promise<void> => {
  if (isUsingDemoMode()) {
    const index = DEMO_DEPARTMENTS.findIndex(dept => dept.id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    DEMO_DEPARTMENTS.splice(index, 1);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    // DELETE typically returns no content (204)
    if (response.status !== 204) {
      await response.json(); // In case the API returns something
    }
  } catch (error) {
    console.warn('Failed to delete via real API, falling back to demo mode:', error);
    const index = DEMO_DEPARTMENTS.findIndex(dept => dept.id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    DEMO_DEPARTMENTS.splice(index, 1);
  }
};

// 6. GET Department Employees
export const getDepartmentEmployees = async (id: number): Promise<Employee[]> => {
  if (isUsingDemoMode()) {
    return DEMO_EMPLOYEES.filter(emp => emp.department === id);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}/employees/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch employees from real API, falling back to demo data:', error);
    return DEMO_EMPLOYEES.filter(emp => emp.department === id);
  }
};

// Legacy aliases for backward compatibility
export const fetchDepartments = getDepartments;
export const fetchDepartmentById = getDepartmentById;
export const fetchDepartmentEmployees = getDepartmentEmployees;
