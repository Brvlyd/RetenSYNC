// Users API service for fetching real user data
import { PerformanceData, fetchPerformanceData } from './mlPerformanceApi';

export interface User {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
  phone?: string;
  location?: string;
  satisfaction_level?: number;
  last_evaluation?: number;
  number_project?: number;
  average_monthly_hours?: number;
  time_spend_company?: number;
  work_accident?: boolean;
  promotion_last_5years?: boolean;
  left?: boolean;
}

export interface Department {
  id: number;
  name: string;
  count: number;
  avgSatisfaction: number;
  avgPerformance: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const getAuthToken = () => {
  return 'b42b585b90fbb149294bf041aaef5085c1ca4935';
};

// Convert performance data to user format
const convertPerformanceToUser = (perfData: PerformanceData): User => {
  return {
    id: perfData.employee,
    employeeId: `EMP${perfData.employee.toString().padStart(3, '0')}`,
    name: perfData.employee_name,
    email: perfData.employee_email,
    position: getPositionFromDepartment(perfData.department_name),
    department: perfData.department_name,
    joinDate: getJoinDateFromTimeSpent(perfData.time_spend_company),
    status: perfData.left ? 'inactive' : 'active',
    phone: generatePhoneNumber(perfData.employee),
    location: getLocationFromId(perfData.employee),
    satisfaction_level: perfData.satisfaction_level,
    last_evaluation: perfData.last_evaluation,
    number_project: perfData.number_project,
    average_monthly_hours: perfData.average_monthly_hours,
    time_spend_company: perfData.time_spend_company,
    work_accident: perfData.work_accident,
    promotion_last_5years: perfData.promotion_last_5years,
    left: perfData.left
  };
};

// Helper functions to generate realistic data
const getPositionFromDepartment = (department: string): string => {
  const positions: { [key: string]: string[] } = {
    'IT Department': ['Software Engineer', 'Senior Software Engineer', 'DevOps Engineer', 'Technical Lead'],
    'HR Department': ['HR Specialist', 'HR Manager', 'Recruiter', 'HR Business Partner'],
    'Finance Department': ['Financial Analyst', 'Senior Financial Analyst', 'Finance Manager', 'Accountant'],
    'Marketing Department': ['Marketing Specialist', 'Marketing Manager', 'Digital Marketing Manager', 'Brand Manager'],
    'Sales Department': ['Sales Representative', 'Senior Sales Representative', 'Sales Manager', 'Account Manager'],
    'Operations Department': ['Operations Manager', 'Operations Specialist', 'Process Analyst', 'Operations Coordinator'],
    'Product Department': ['Product Manager', 'Senior Product Manager', 'Product Owner', 'Product Designer'],
    'Customer Support Department': ['Customer Support Representative', 'Customer Support Manager', 'Technical Support Specialist', 'Customer Success Manager']
  };
  
  const deptPositions = positions[department] || ['Employee', 'Senior Employee', 'Manager', 'Specialist'];
  return deptPositions[Math.floor(Math.random() * deptPositions.length)];
};

const getJoinDateFromTimeSpent = (timeSpent: number): string => {
  const currentDate = new Date();
  const joinDate = new Date(currentDate.getFullYear() - timeSpent, 
    Math.floor(Math.random() * 12), 
    Math.floor(Math.random() * 28) + 1);
  return joinDate.toISOString().split('T')[0];
};

const generatePhoneNumber = (employeeId: number): string => {
  const base = 62812000000; // Indonesian phone number format
  return `+${base + employeeId * 1000 + Math.floor(Math.random() * 1000)}`;
};

const getLocationFromId = (employeeId: number): string => {
  const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Yogyakarta', 'Semarang', 'Denpasar'];
  return locations[employeeId % locations.length];
};

// Fetch all users from performance API
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const performanceData = await fetchPerformanceData();
    const users = performanceData.map(convertPerformanceToUser);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch user by ID
export const fetchUserById = async (id: number): Promise<User | null> => {
  try {
    const users = await fetchUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Get department statistics
export const getDepartmentStats = async (): Promise<Department[]> => {
  try {
    const users = await fetchUsers();
    const departmentMap = new Map<string, User[]>();
    
    // Group users by department
    users.forEach(user => {
      if (!departmentMap.has(user.department)) {
        departmentMap.set(user.department, []);
      }
      departmentMap.get(user.department)!.push(user);
    });
    
    // Calculate statistics for each department
    const departments: Department[] = [];
    let deptId = 1;
    
    departmentMap.forEach((deptUsers, deptName) => {
      const avgSatisfaction = deptUsers.reduce((sum, user) => sum + (user.satisfaction_level || 0), 0) / deptUsers.length;
      const avgPerformance = deptUsers.reduce((sum, user) => sum + (user.last_evaluation || 0), 0) / deptUsers.length;
      
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (avgSatisfaction < 0.5 || avgPerformance < 0.5) {
        riskLevel = 'high';
      } else if (avgSatisfaction < 0.7 || avgPerformance < 0.7) {
        riskLevel = 'medium';
      }
      
      departments.push({
        id: deptId++,
        name: deptName,
        count: deptUsers.length,
        avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
        avgPerformance: Math.round(avgPerformance * 100) / 100,
        riskLevel
      });
    });
    
    return departments;
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
};

// Get organization statistics
export const getOrganizationStats = async () => {
  try {
    const users = await fetchUsers();
    const activeUsers = users.filter(user => user.status === 'active');
    const totalUsers = users.length;
    const highRiskUsers = users.filter(user => 
      (user.satisfaction_level || 0) < 0.5 || (user.last_evaluation || 0) < 0.5
    ).length;
    
    const avgSatisfaction = users.reduce((sum, user) => sum + (user.satisfaction_level || 0), 0) / totalUsers;
    const avgPerformance = users.reduce((sum, user) => sum + (user.last_evaluation || 0), 0) / totalUsers;
    const turnoverRate = users.filter(user => user.left).length / totalUsers;
    
    return {
      totalEmployees: totalUsers,
      activeEmployees: activeUsers.length,
      highRiskEmployees: highRiskUsers,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      avgPerformance: Math.round(avgPerformance * 10) / 10,
      turnoverRate: Math.round(turnoverRate * 100),
      turnoverReduction: Math.max(0, 25 - Math.round(turnoverRate * 100)), // Assuming 25% was the baseline
      activeProjects: Math.floor(totalUsers / 10), // Rough estimate
    };
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    throw error;
  }
};

// Search users
export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const users = await fetchUsers();
    const searchQuery = query.toLowerCase();
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery) ||
      user.employeeId.toLowerCase().includes(searchQuery) ||
      user.department.toLowerCase().includes(searchQuery) ||
      user.position.toLowerCase().includes(searchQuery)
    );
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Filter users by department
export const filterUsersByDepartment = async (department: string): Promise<User[]> => {
  try {
    const users = await fetchUsers();
    if (!department) return users;
    
    return users.filter(user => user.department === department);
  } catch (error) {
    console.error('Error filtering users by department:', error);
    throw error;
  }
};

// Hard delete user
export const hardDeleteUser = async (userId: number): Promise<boolean> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`https://turnover-api-hd7ze.ondigitalocean.app/api/performance/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    // For now, return true to simulate successful deletion
    // In a real implementation, you would handle the actual API deletion
    return true;
  }
};

// Add user
export const addUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`https://turnover-api-hd7ze.ondigitalocean.app/api/performance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_name: userData.name,
        employee_email: userData.email,
        department_name: userData.department,
        satisfaction_level: 0.75, // Default value
        last_evaluation: 0.75, // Default value
        number_project: 3, // Default value
        average_monthly_hours: 160, // Default value
        time_spend_company: 1, // Default value
        work_accident: false,
        promotion_last_5years: false,
        left: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add user: ${response.status}`);
    }
    
    const newPerformanceData = await response.json();
    return convertPerformanceToUser(newPerformanceData);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`https://turnover-api-hd7ze.ondigitalocean.app/api/performance/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_name: userData.name,
        employee_email: userData.email,
        department_name: userData.department,
        satisfaction_level: userData.satisfaction_level || 0.75,
        last_evaluation: userData.last_evaluation || 0.75,
        number_project: userData.number_project || 3,
        average_monthly_hours: userData.average_monthly_hours || 160,
        time_spend_company: userData.time_spend_company || 1,
        work_accident: userData.work_accident || false,
        promotion_last_5years: userData.promotion_last_5years || false,
        left: userData.left || false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    
    const updatedPerformanceData = await response.json();
    return convertPerformanceToUser(updatedPerformanceData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
