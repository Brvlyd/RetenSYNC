'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees,
  Department,
  Employee,
  DepartmentListResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ApiError,
} from '@/app/api/departmentsApi';

// Custom hook for managing departments
export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
  });

  // Fetch departments list
  const fetchDepartments = useCallback(async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: DepartmentListResponse = await getDepartments(page, pageSize);
      setDepartments(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: page,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch departments';
      setError(errorMessage);
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh departments (useful after create/update/delete operations)
  const refreshDepartments = useCallback(() => {
    fetchDepartments(pagination.currentPage);
  }, [fetchDepartments, pagination.currentPage]);

  // Create a new department
  const createNewDepartment = useCallback(async (departmentData: CreateDepartmentRequest): Promise<Department | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newDepartment = await createDepartment(departmentData);
      // Refresh the list to include the new department
      await refreshDepartments();
      return newDepartment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create department';
      setError(errorMessage);
      console.error('Error creating department:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  // Update an existing department
  const updateExistingDepartment = useCallback(async (id: number, departmentData: UpdateDepartmentRequest): Promise<Department | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedDepartment = await updateDepartment(id, departmentData);
      // Update the department in the local state
      setDepartments(prev => 
        prev.map(dept => dept.id === id ? updatedDepartment : dept)
      );
      return updatedDepartment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update department';
      setError(errorMessage);
      console.error('Error updating department:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a department
  const deleteExistingDepartment = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteDepartment(id);
      // Remove the department from local state
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete department';
      setError(errorMessage);
      console.error('Error deleting department:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial departments on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    pagination,
    fetchDepartments,
    refreshDepartments,
    createNewDepartment,
    updateExistingDepartment,
    deleteExistingDepartment,
    clearError: () => setError(null),
  };
}

// Custom hook for managing a single department and its employees
export function useDepartment(departmentId: number | null) {
  const [department, setDepartment] = useState<Department | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch department details
  const fetchDepartment = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const departmentData = await getDepartmentById(id);
      setDepartment(departmentData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch department';
      setError(errorMessage);
      console.error('Error fetching department:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch department employees
  const fetchDepartmentEmployees = useCallback(async (id: number) => {
    setEmployeesLoading(true);
    
    try {
      const employeesData = await getDepartmentEmployees(id);
      setEmployees(employeesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch department employees';
      setError(errorMessage);
      console.error('Error fetching department employees:', err);
    } finally {
      setEmployeesLoading(false);
    }
  }, []);

  // Load department data when departmentId changes
  useEffect(() => {
    if (departmentId) {
      fetchDepartment(departmentId);
      fetchDepartmentEmployees(departmentId);
    } else {
      setDepartment(null);
      setEmployees([]);
    }
  }, [departmentId, fetchDepartment, fetchDepartmentEmployees]);

  return {
    department,
    employees,
    loading,
    employeesLoading,
    error,
    fetchDepartment,
    fetchDepartmentEmployees,
    clearError: () => setError(null),
  };
}
