'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  X,
  Save,
  AlertCircle,
  Loader,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDepartments, useDepartment } from '@/hooks/useDepartments';
import { Department, Employee, CreateDepartmentRequest, UpdateDepartmentRequest } from '@/app/api/departmentsApi';

// Main Departments Management Component
export default function DepartmentsManager() {
  const {
    departments,
    loading,
    error,
    pagination,
    fetchDepartments,
    createNewDepartment,
    updateExistingDepartment,
    deleteExistingDepartment,
    clearError,
  } = useDepartments();

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDepartment = (department: Department) => {
    setShowCreateModal(false);
    clearError();
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setShowEditModal(true);
  };

  const handleUpdateDepartment = (department: Department) => {
    setShowEditModal(false);
    setEditingDepartment(null);
    clearError();
  };

  const handleDeleteDepartment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await deleteExistingDepartment(id);
    }
  };

  const handleViewEmployees = (departmentId: number) => {
    setSelectedDepartmentId(departmentId);
    setShowEmployeesModal(true);
  };

  const handlePageChange = (page: number) => {
    fetchDepartments(page);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Department Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage departments and view their employees
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2"
        >
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={() => handleEditDepartment(department)}
              onDelete={() => handleDeleteDepartment(department.id)}
              onViewEmployees={() => handleViewEmployees(department.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.count > 10 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalCount={pagination.count}
          hasNext={!!pagination.next}
          hasPrevious={!!pagination.previous}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateDepartmentModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateDepartment}
            createDepartment={createNewDepartment}
          />
        )}

        {showEditModal && editingDepartment && (
          <EditDepartmentModal
            department={editingDepartment}
            onClose={() => {
              setShowEditModal(false);
              setEditingDepartment(null);
            }}
            onSuccess={handleUpdateDepartment}
            updateDepartment={updateExistingDepartment}
          />
        )}

        {showEmployeesModal && selectedDepartmentId && (
          <DepartmentEmployeesModal
            departmentId={selectedDepartmentId}
            onClose={() => {
              setShowEmployeesModal(false);
              setSelectedDepartmentId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Department Card Component
function DepartmentCard({
  department,
  onEdit,
  onDelete,
  onViewEmployees,
}: {
  department: Department;
  onEdit: () => void;
  onDelete: () => void;
  onViewEmployees: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {department.name}
            </h3>
            {department.employee_count !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {department.employee_count} employees
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {department.description}
      </p>

      <div className="flex space-x-2">
        <button
          onClick={onViewEmployees}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Users className="h-4 w-4" />
          <span>View</span>
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Create Department Modal
function CreateDepartmentModal({
  onClose,
  onSuccess,
  createDepartment,
}: {
  onClose: () => void;
  onSuccess: (department: Department) => void;
  createDepartment: (data: CreateDepartmentRequest) => Promise<Department | null>;
}) {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createDepartment(formData);
    if (result) {
      onSuccess(result);
    } else {
      setError('Failed to create department');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Department
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter department name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter department description"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? 'Creating...' : 'Create'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Edit Department Modal (similar to Create, but pre-filled)
function EditDepartmentModal({
  department,
  onClose,
  onSuccess,
  updateDepartment,
}: {
  department: Department;
  onClose: () => void;
  onSuccess: (department: Department) => void;
  updateDepartment: (id: number, data: UpdateDepartmentRequest) => Promise<Department | null>;
}) {
  const [formData, setFormData] = useState<UpdateDepartmentRequest>({
    name: department.name,
    description: department.description,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await updateDepartment(department.id, formData);
    if (result) {
      onSuccess(result);
    } else {
      setError('Failed to update department');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Edit Department
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? 'Updating...' : 'Update'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Department Employees Modal
function DepartmentEmployeesModal({
  departmentId,
  onClose,
}: {
  departmentId: number;
  onClose: () => void;
}) {
  const { department, employees, loading, employeesLoading, error } = useDepartment(departmentId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {department?.name || 'Department'} Employees
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {employees.length} employees in this department
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {employeesLoading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No employees in this department</p>
            </div>
          ) : (
            <div className="space-y-3">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {employee.first_name} {employee.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {employee.email}
                    </p>
                    {employee.position && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {employee.position}
                      </p>
                    )}
                  </div>
                  {employee.role && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      {employee.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalCount,
  hasNext,
  hasPrevious,
  onPageChange,
}: {
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Showing page {currentPage} of {totalPages} ({totalCount} total departments)
      </p>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="flex items-center space-x-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="flex items-center space-x-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
