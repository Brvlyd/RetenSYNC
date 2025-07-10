// External API utility for ML Performance data
const API_BASE_URL = 'https://turnover-api-hd7ze.ondigitalocean.app/api/performance/';

// You should replace this with actual token from your authentication system
const getAuthToken = () => {
  // This is a placeholder - replace with your actual token retrieval logic
  const token = localStorage.getItem('api_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
  
  if (!token || token === 'your-api-token-here') {
    console.warn('No valid API token found. Please set a valid token in localStorage or update the getAuthToken function.');
    return null;
  }
  
  return token;
};

export interface PerformanceData {
  employee: number;
  employee_name: string;
  employee_email: string;
  department_name: string;
  satisfaction_level: number;
  last_evaluation: number;
  number_project: number;
  average_monthly_hours: number;
  time_spend_company: number;
  work_accident: boolean;
  promotion_last_5years: boolean;
  left: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePerformanceData {
  employee: number;
  satisfaction_level: number;
  last_evaluation: number;
  number_project: number;
  average_monthly_hours: number;
  time_spend_company: number;
  work_accident: boolean;
  promotion_last_5years: boolean;
  left: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

// Fetch all performance data
export const fetchPerformanceData = async (): Promise<PerformanceData[]> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login or set a valid API token.');
    }

    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your API token or login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const result: ApiResponse<PerformanceData[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch performance data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

// Create new performance data
export const createPerformanceData = async (data: CreatePerformanceData): Promise<PerformanceData> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login or set a valid API token.');
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your API token or login again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const result: ApiResponse<{
      employee_name: string;
      performance_data: PerformanceData;
    }> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create performance data');
    }

    return result.data.performance_data;
  } catch (error) {
    console.error('Error creating performance data:', error);
    throw error;
  }
};

// Calculate risk level based on performance metrics
export const calculateRiskLevel = (data: PerformanceData) => {
  const riskScore = (1 - data.satisfaction_level) * 0.4 + 
                   (1 - data.last_evaluation) * 0.3 + 
                   (data.work_accident ? 0.2 : 0) +
                   (!data.promotion_last_5years ? 0.1 : 0);
  
  if (riskScore > 0.6) {
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', score: riskScore };
  } else if (riskScore > 0.3) {
    return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', score: riskScore };
  }
  return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', score: riskScore };
};

// Mock data for development/fallback
export const mockPerformanceData: PerformanceData[] = [
  {
    employee: 1,
    employee_name: "John Doe",
    employee_email: "john.doe@company.com",
    department_name: "IT Department",
    satisfaction_level: 0.8,
    last_evaluation: 0.9,
    number_project: 5,
    average_monthly_hours: 160,
    time_spend_company: 3,
    work_accident: false,
    promotion_last_5years: true,
    left: false,
    created_at: "2025-07-04T17:47:36.033560",
    updated_at: "2025-07-04T17:47:36.033586"
  },
  {
    employee: 2,
    employee_name: "Jane Smith",
    employee_email: "jane.smith@company.com",
    department_name: "HR Department",
    satisfaction_level: 0.6,
    last_evaluation: 0.7,
    number_project: 3,
    average_monthly_hours: 140,
    time_spend_company: 2,
    work_accident: true,
    promotion_last_5years: false,
    left: false,
    created_at: "2025-07-04T17:47:36.033560",
    updated_at: "2025-07-04T17:47:36.033586"
  },
  {
    employee: 3,
    employee_name: "Mike Johnson",
    employee_email: "mike.johnson@company.com",
    department_name: "Finance Department",
    satisfaction_level: 0.9,
    last_evaluation: 0.95,
    number_project: 7,
    average_monthly_hours: 180,
    time_spend_company: 5,
    work_accident: false,
    promotion_last_5years: true,
    left: false,
    created_at: "2025-07-04T17:47:36.033560",
    updated_at: "2025-07-04T17:47:36.033586"
  }
];
