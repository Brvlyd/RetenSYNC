// Shared data store for departments and employees
// In a real application, this would be replaced with a database

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

// Demo departments data
export let departments: Department[] = [
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

// Demo employees data
export const employees: Employee[] = [
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

// Helper functions for managing data
export function getAllDepartments(): Department[] {
  return departments;
}

export function getDepartmentById(id: number): Department | undefined {
  return departments.find(dept => dept.id === id);
}

export function createDepartment(data: { name: string; description: string }): Department {
  const newDepartment: Department = {
    id: Math.max(...departments.map(d => d.id)) + 1,
    name: data.name,
    description: data.description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    employee_count: 0
  };
  
  departments.push(newDepartment);
  return newDepartment;
}

export function updateDepartment(id: number, data: { name: string; description: string }): Department | null {
  const index = departments.findIndex(dept => dept.id === id);
  if (index === -1) return null;
  
  departments[index] = {
    ...departments[index],
    name: data.name,
    description: data.description,
    updated_at: new Date().toISOString()
  };
  
  return departments[index];
}

export function deleteDepartment(id: number): boolean {
  const index = departments.findIndex(dept => dept.id === id);
  if (index === -1) return false;
  
  departments.splice(index, 1);
  return true;
}

export function getEmployeesByDepartment(departmentId: number): Employee[] {
  return employees.filter(emp => emp.department === departmentId);
}

// Helper function to check if department exists
export function departmentExists(id: number): boolean {
  return departments.some(dept => dept.id === id);
}

// Helper function to check if department name is taken (excluding specific ID)
export function isDepartmentNameTaken(name: string, excludeId?: number): boolean {
  return departments.some(dept => 
    dept.name.toLowerCase() === name.toLowerCase() && dept.id !== excludeId
  );
}
