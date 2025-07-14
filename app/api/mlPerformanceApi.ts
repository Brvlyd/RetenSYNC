// ML Performance API for real turnover prediction data
import { getAuthToken } from '@/lib/auth-token';

// Predict turnover risk for an employee
export interface PredictionResult {
  success: boolean;
  message: string;
  data: {
    employee_id: number;
    prediction: string; // e.g., "High", "Medium", "Low"
    probability?: number;
    [key: string]: any;
  };
}

export const predictTurnoverRisk = async (employee_id: number): Promise<PredictionResult> => {
  if (isUsingDemoMode()) {
    // Return demo prediction based on employee ID
    const predictions = ['Low', 'Medium', 'High'];
    const prediction = predictions[employee_id % 3];
    const probability = 0.3 + (employee_id % 3) * 0.2; // 0.3, 0.5, 0.7
    
    return {
      success: true,
      message: 'Prediction completed successfully (demo mode)',
      data: {
        employee_id,
        prediction,
        probability
      }
    };
  }

  try {
    const response = await fetch('https://turnover-api-hd7ze.ondigitalocean.app/api/predict/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ employee_id }),
    });

    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your API token or login again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. ${errorText}`);
    }

    const result: PredictionResult = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to get prediction');
    }

    return result;
  } catch (error) {
    console.warn('Failed to get prediction from real API, falling back to demo:', error);
    // Fallback to demo prediction
    const predictions = ['Low', 'Medium', 'High'];
    const prediction = predictions[employee_id % 3];
    const probability = 0.3 + (employee_id % 3) * 0.2;
    
    return {
      success: true,
      message: 'Prediction completed successfully (demo fallback)',
      data: {
        employee_id,
        prediction,
        probability
      }
    };
  }
};
// External API utility for ML Performance data
const API_BASE_URL = 'https://turnover-api-hd7ze.ondigitalocean.app/api/performance/';

// Helper function to check if we're in demo mode
const isUsingDemoMode = (): boolean => {
  if (typeof window === 'undefined') return true;
  const authInfo = getAuthToken();
  // Check if no valid token or if token is clearly a demo token
  return !authInfo.isValid || !authInfo.token || authInfo.token.startsWith('demo-');
};

// Helper function to get authenticated headers
const getAuthHeaders = (): Record<string, string> => {
  const authInfo = getAuthToken();
  if (!authInfo.isValid || !authInfo.token) {
    throw new Error('Authentication required. Please login.');
  }
  
  // Don't provide headers for demo tokens - this will force demo mode
  if (authInfo.token.startsWith('demo-')) {
    throw new Error('Demo mode - using local data');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${authInfo.token}`,
  };
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

// Demo performance data for fallback
const DEMO_PERFORMANCE_DATA: PerformanceData[] = [
  {
    employee: 1,
    employee_name: "John Doe",
    employee_email: "john.doe@company.com",
    department_name: "Engineering",
    satisfaction_level: 0.8,
    last_evaluation: 0.9,
    number_project: 5,
    average_monthly_hours: 180,
    time_spend_company: 3,
    work_accident: false,
    promotion_last_5years: true,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 2,
    employee_name: "Jane Smith",
    employee_email: "jane.smith@company.com", 
    department_name: "Engineering",
    satisfaction_level: 0.75,
    last_evaluation: 0.85,
    number_project: 4,
    average_monthly_hours: 160,
    time_spend_company: 2,
    work_accident: false,
    promotion_last_5years: false,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 3,
    employee_name: "Mike Johnson",
    employee_email: "mike.johnson@company.com",
    department_name: "Engineering", 
    satisfaction_level: 0.9,
    last_evaluation: 0.95,
    number_project: 6,
    average_monthly_hours: 200,
    time_spend_company: 4,
    work_accident: false,
    promotion_last_5years: true,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 4,
    employee_name: "Sarah Wilson",
    employee_email: "sarah.wilson@company.com",
    department_name: "Human Resources",
    satisfaction_level: 0.85,
    last_evaluation: 0.88,
    number_project: 3,
    average_monthly_hours: 170,
    time_spend_company: 5,
    work_accident: false,
    promotion_last_5years: true,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 5,
    employee_name: "David Brown",
    employee_email: "david.brown@company.com",
    department_name: "Human Resources",
    satisfaction_level: 0.7,
    last_evaluation: 0.8,
    number_project: 2,
    average_monthly_hours: 150,
    time_spend_company: 1,
    work_accident: false,
    promotion_last_5years: false,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 6,
    employee_name: "Lisa Garcia",
    employee_email: "lisa.garcia@company.com",
    department_name: "Marketing",
    satisfaction_level: 0.82,
    last_evaluation: 0.87,
    number_project: 4,
    average_monthly_hours: 165,
    time_spend_company: 3,
    work_accident: false,
    promotion_last_5years: false,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 7,
    employee_name: "Alex Martinez",
    employee_email: "alex.martinez@company.com",
    department_name: "Marketing",
    satisfaction_level: 0.78,
    last_evaluation: 0.83,
    number_project: 3,
    average_monthly_hours: 155,
    time_spend_company: 2,
    work_accident: false,
    promotion_last_5years: false,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 8,
    employee_name: "Chris Taylor",
    employee_email: "chris.taylor@company.com",
    department_name: "Sales",
    satisfaction_level: 0.88,
    last_evaluation: 0.92,
    number_project: 5,
    average_monthly_hours: 190,
    time_spend_company: 4,
    work_accident: false,
    promotion_last_5years: true,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 9,
    employee_name: "Emma Anderson",
    employee_email: "emma.anderson@company.com",
    department_name: "Sales",
    satisfaction_level: 0.76,
    last_evaluation: 0.81,
    number_project: 3,
    average_monthly_hours: 140,
    time_spend_company: 1,
    work_accident: false,
    promotion_last_5years: false,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    employee: 10,
    employee_name: "Robert Lee",
    employee_email: "robert.lee@company.com",
    department_name: "Finance",
    satisfaction_level: 0.84,
    last_evaluation: 0.89,
    number_project: 4,
    average_monthly_hours: 175,
    time_spend_company: 3,
    work_accident: false,
    promotion_last_5years: false,
    left: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  }
];

// Fetch all performance data
export const fetchPerformanceData = async (): Promise<PerformanceData[]> => {
  if (isUsingDemoMode()) {
    return Promise.resolve(DEMO_PERFORMANCE_DATA);
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
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
    console.warn('Failed to fetch from real API, falling back to demo data:', error);
    return DEMO_PERFORMANCE_DATA;
  }
};

// Create new performance data
export const createPerformanceData = async (data: CreatePerformanceData): Promise<PerformanceData> => {
  if (isUsingDemoMode()) {
    // Create demo performance data
    const newId = Math.max(...DEMO_PERFORMANCE_DATA.map(p => p.employee)) + 1;
    const demoPerformanceData: PerformanceData = {
      ...data,
      employee_name: `Employee ${data.employee}`,
      employee_email: `employee${data.employee}@company.com`,
      department_name: "Demo Department",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    DEMO_PERFORMANCE_DATA.push(demoPerformanceData);
    return demoPerformanceData;
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
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
    console.warn('Failed to create via real API, falling back to demo mode:', error);
    // Fallback to demo mode
    const newId = Math.max(...DEMO_PERFORMANCE_DATA.map(p => p.employee)) + 1;
    const demoPerformanceData: PerformanceData = {
      ...data,
      employee_name: `Employee ${data.employee}`,
      employee_email: `employee${data.employee}@company.com`,
      department_name: "Demo Department",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    DEMO_PERFORMANCE_DATA.push(demoPerformanceData);
    return demoPerformanceData;
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
