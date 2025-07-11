'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Plus, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  Edit,
  Eye,
  X
} from 'lucide-react';
import { 
  fetchPerformanceData, 
  createPerformanceData, 
  calculateRiskLevel, 
  predictTurnoverRisk,
  type PerformanceData, 
  type CreatePerformanceData 
} from '@/app/api/mlPerformanceApi';

// Add margin to top so header doesn't cut content (same as analytics page)
const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';

export default function MLPerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PerformanceData | null>(null);
  // const [showTokenManager, setShowTokenManager] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreatePerformanceData>({
    employee: 0,
    satisfaction_level: 0.5,
    last_evaluation: 0.5,
    number_project: 1,
    average_monthly_hours: 160,
    time_spend_company: 1,
    work_accident: false,
    promotion_last_5years: false,
    left: false
  });
  const [predictionResult, setPredictionResult] = useState<any | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<CreatePerformanceData | null>(null);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPerformanceData();
      setPerformanceData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // If it's an authentication error, you could handle it here if needed
      setPerformanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerformanceData = async (data: CreatePerformanceData) => {
    try {
      await createPerformanceData(data);
      await loadPerformanceData(); // Refresh the list
      setShowCreateModal(false);
      resetCreateForm();
      setError(null);
      setSuccessMessage('Performance data created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create performance data';
      setError(errorMessage);
      setSuccessMessage(null);
    }
  };

  // const handleTokenSet = (token: string) => {
  //   setShowTokenManager(false);
  //   setError(null);
  //   // Retry loading data with new token
  //   loadPerformanceData();
  // };

  const resetCreateForm = () => {
    setCreateFormData({
      employee: 0,
      satisfaction_level: 0.5,
      last_evaluation: 0.5,
      number_project: 1,
      average_monthly_hours: 160,
      time_spend_company: 1,
      work_accident: false,
      promotion_last_5years: false,
      left: false
    });
  };

  const filteredData = performanceData.filter(item =>
    (item.employee_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.employee_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.department_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Predict ML for selected employee
  const handlePredict = async (employeeId: number) => {
    setPredicting(true);
    setPredictionResult(null);
    try {
      const result = await predictTurnoverRisk(employeeId);
      setPredictionResult(result.data);
    } catch (err) {
      setPredictionResult({ error: err instanceof Error ? err.message : 'Prediction failed' });
    } finally {
      setPredicting(false);
    }
  };

  // Start editing
  const handleEdit = () => {
    if (selectedEmployee) {
      setEditFormData({
        employee: selectedEmployee.employee,
        satisfaction_level: selectedEmployee.satisfaction_level,
        last_evaluation: selectedEmployee.last_evaluation,
        number_project: selectedEmployee.number_project,
        average_monthly_hours: selectedEmployee.average_monthly_hours,
        time_spend_company: selectedEmployee.time_spend_company,
        work_accident: selectedEmployee.work_accident,
        promotion_last_5years: selectedEmployee.promotion_last_5years,
        left: selectedEmployee.left
      });
      setEditMode(true);
    }
  };

  // Save edit (workaround: use create API)
  const handleEditSave = async () => {
    if (!editFormData) return;
    try {
      await createPerformanceData(editFormData);
      setEditMode(false);
      setSelectedEmployee(null);
      setEditFormData(null);
      await loadPerformanceData();
      setError(null);
      setSuccessMessage('Performance data updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update performance data');
      setSuccessMessage(null);
    }
  };

  // Export data as CSV
  const handleExportData = () => {
    if (filteredData.length === 0) {
      setError('No data to export');
      setSuccessMessage(null);
      return;
    }

    try {
      // Define CSV headers
      const headers = [
        'Employee ID',
        'Employee Name',
        'Employee Email',
        'Department',
        'Satisfaction Level',
        'Last Evaluation',
        'Number of Projects',
        'Average Monthly Hours',
        'Time in Company (years)',
        'Work Accident',
        'Promotion Last 5 Years',
        'Risk Level',
        'Has Left Company'
      ];

      // Convert data to CSV format
      const csvData = filteredData.map(employee => {
        const risk = calculateRiskLevel(employee);
        return [
          employee.employee,
          employee.employee_name,
          employee.employee_email,
          employee.department_name,
          (employee.satisfaction_level * 100).toFixed(1) + '%',
          (employee.last_evaluation * 100).toFixed(1) + '%',
          employee.number_project,
          employee.average_monthly_hours,
          employee.time_spend_company,
          employee.work_accident ? 'Yes' : 'No',
          employee.promotion_last_5years ? 'Yes' : 'No',
          risk.level,
          employee.left ? 'Yes' : 'No'
        ];
      });

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            // Escape fields that contain commas or quotes
            const fieldStr = String(field);
            if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
              return `"${fieldStr.replace(/"/g, '""')}"`;
            }
            return fieldStr;
          }).join(',')
        )
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ml-performance-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message and clear errors
      setError(null);
      setSuccessMessage(`Successfully exported ${filteredData.length} records to CSV file`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6`}>
      <div className={`space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in ${pageTopMargin}`}>
        {/* Modern Header - Responsive with Brain Circuit Animation */}
        <motion.div 
          initial={{ opacity: 0, rotateX: -15 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 text-white overflow-hidden relative mb-4 sm:mb-6 lg:mb-8"
        >
          {/* Animated Neural Network Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-12 left-16 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
            <div className="absolute top-16 left-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
            <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-24 left-8 w-2 h-2 bg-white rounded-full animate-pulse delay-400"></div>
            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-16 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-600"></div>
            <div className="absolute top-12 right-20 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-20 right-16 w-1 h-1 bg-white rounded-full animate-pulse delay-800"></div>
            
            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
              <g className="stroke-white stroke-1 fill-none opacity-30">
                <motion.path
                  d="M32 32 L64 48 L48 64 L80 80 L32 96"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
                />
                <motion.path
                  d="M368 32 L336 48 L352 64 L320 80 L368 96"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                />
              </g>
            </svg>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
            >
              ML Performance
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-purple-100 text-sm sm:text-base lg:text-lg"
            >
              Machine learning-powered employee performance and risk analytics
            </motion.p>
          </motion.div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">

        {/* API Status Notice */}
        {performanceData.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  No data found
                </p>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  No performance data available. Please add data or check your API connection.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Token Manager */}
        {/* Token Manager removed: API token is now hardcoded */}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{performanceData.length}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Satisfaction</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {performanceData.length > 0 ? (performanceData.reduce((acc, curr) => acc + curr.satisfaction_level, 0) / performanceData.length * 100).toFixed(1) : 0}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">High Risk</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {performanceData.filter(emp => calculateRiskLevel(emp).level === 'High').length}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Promoted</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {performanceData.filter(emp => emp.promotion_last_5years).length}
                </p>
              </div>
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm mb-4 sm:mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Add Performance Data</span>
                <span className="sm:hidden">Add Data</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                Filter
              </button>
              <button 
                onClick={handleExportData}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Performance Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Satisfaction
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Evaluation
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Monthly Hours
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 sm:px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      {searchTerm ? 'No employees found matching your search.' : 'No performance data available.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((employee) => {
                    const risk = calculateRiskLevel(employee);
                    return (
                      <tr key={employee.employee} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.employee_name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {employee.employee_email}
                          </div>
                          <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {employee.department_name}
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.department_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${employee.satisfaction_level * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {(employee.satisfaction_level * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${employee.last_evaluation * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {(employee.last_evaluation * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.number_project}
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.average_monthly_hours}h
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                          {risk.level}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button 
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEditFormData({
                                employee: employee.employee,
                                satisfaction_level: employee.satisfaction_level,
                                last_evaluation: employee.last_evaluation,
                                number_project: employee.number_project,
                                average_monthly_hours: employee.average_monthly_hours,
                                time_spend_company: employee.time_spend_company,
                                work_accident: employee.work_accident,
                                promotion_last_5years: employee.promotion_last_5years,
                                left: employee.left
                              });
                              setEditMode(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create Performance Data Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add Performance Data
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreatePerformanceData(createFormData);
              }}>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="number"
                      value={createFormData.employee}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setCreateFormData({...createFormData, employee: value});
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Satisfaction Level (0-1)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={createFormData.satisfaction_level}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setCreateFormData({...createFormData, satisfaction_level: value});
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Evaluation (0-1)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={createFormData.last_evaluation}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setCreateFormData({...createFormData, last_evaluation: value});
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of Projects
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={createFormData.number_project}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setCreateFormData({...createFormData, number_project: value});
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Average Monthly Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={createFormData.average_monthly_hours}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setCreateFormData({...createFormData, average_monthly_hours: value});
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time Spent in Company (years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={createFormData.time_spend_company}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setCreateFormData({...createFormData, time_spend_company: value});
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={createFormData.work_accident}
                        onChange={(e) => setCreateFormData({...createFormData, work_accident: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Work Accident</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={createFormData.promotion_last_5years}
                        onChange={(e) => setCreateFormData({...createFormData, promotion_last_5years: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Promoted Last 5 Years</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetCreateForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Employee Performance Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    setPredictionResult(null);
                    setEditMode(false);
                    setEditFormData(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              {!editMode ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.employee_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white truncate">{selectedEmployee.employee_email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.department_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Satisfaction Level</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{(selectedEmployee.satisfaction_level * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Evaluation</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{(selectedEmployee.last_evaluation * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Projects</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.number_project}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Hours</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.average_monthly_hours}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Time in Company</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.time_spend_company} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Accident</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.work_accident ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Promotion Last 5 Years</p>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedEmployee.promotion_last_5years ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm sm:text-base rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                      onClick={() => handlePredict(selectedEmployee.employee)}
                      disabled={predicting}
                    >
                      {predicting ? (
                        <>
                          <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full inline-block"></span>
                          Predicting...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 sm:h-5 sm:w-5" /> Predict ML
                        </>
                      )}
                    </button>
                  </div>
                  {predictionResult && (
                    <div className="mt-4 p-3 sm:p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm sm:text-base text-gray-900 dark:text-white">
                      {predictionResult.error ? (
                        <span>{predictionResult.error}</span>
                      ) : (
                        <>
                          <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold">Risk Level:</span>
                            {predictionResult.prediction?.risk_level ? (
                              <span
                                className={
                                  predictionResult.prediction.risk_level === 'high'
                                    ? 'inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-xs'
                                    : predictionResult.prediction.risk_level === 'medium'
                                    ? 'inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 font-bold text-xs'
                                    : predictionResult.prediction.risk_level === 'low'
                                    ? 'inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-xs'
                                    : ''
                                }
                              >
                                {predictionResult.prediction.risk_level.charAt(0).toUpperCase() + predictionResult.prediction.risk_level.slice(1)}
                              </span> 
                            ) : (
                              '-'
                            )}
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Will Leave:</span> {predictionResult.prediction?.will_leave === true ? 'Yes' : predictionResult.prediction?.will_leave === false ? 'No' : '-'}
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Probability:</span> {typeof predictionResult.prediction?.probability === 'number' ? (predictionResult.prediction.probability * 100).toFixed(1) + '%' : '-'}
                          </div>
                          {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
                            <div className="mb-2">
                              <span className="font-semibold">Recommendations:</span>
                              <ul className="list-disc ml-6 mt-1">
                                {predictionResult.recommendations.map((rec: any, idx: number) => (
                                  <li key={idx} className="mb-1">
                                    <span className="font-medium">[{rec.category}]</span> <span className="italic">{rec.issue}</span>: {rec.recommendation} <span className="text-xs text-gray-500">(Priority: {rec.priority})</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleEditSave();
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                      <input type="number" value={editFormData?.employee ?? ''} disabled className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Satisfaction Level (0-1)</label>
                      <input type="number" step="0.01" min="0" max="1" value={editFormData?.satisfaction_level ?? ''} onChange={e => setEditFormData(f => f ? { ...f, satisfaction_level: parseFloat(e.target.value) } : f)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Evaluation (0-1)</label>
                      <input type="number" step="0.01" min="0" max="1" value={editFormData?.last_evaluation ?? ''} onChange={e => setEditFormData(f => f ? { ...f, last_evaluation: parseFloat(e.target.value) } : f)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Projects</label>
                      <input type="number" min="0" value={editFormData?.number_project ?? ''} onChange={e => setEditFormData(f => f ? { ...f, number_project: parseInt(e.target.value) } : f)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Monthly Hours</label>
                      <input type="number" min="0" value={editFormData?.average_monthly_hours ?? ''} onChange={e => setEditFormData(f => f ? { ...f, average_monthly_hours: parseInt(e.target.value) } : f)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Spent in Company (years)</label>
                      <input type="number" min="0" value={editFormData?.time_spend_company ?? ''} onChange={e => setEditFormData(f => f ? { ...f, time_spend_company: parseInt(e.target.value) } : f)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 col-span-full">
                      <label className="flex items-center">
                        <input type="checkbox" checked={!!editFormData?.work_accident} onChange={e => setEditFormData(f => f ? { ...f, work_accident: e.target.checked } : f)} className="mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Work Accident</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={!!editFormData?.promotion_last_5years} onChange={e => setEditFormData(f => f ? { ...f, promotion_last_5years: e.target.checked } : f)} className="mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Promoted Last 5 Years</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 text-sm sm:text-base rounded-lg transition-colors">Save</button>
                    <button type="button" onClick={() => { setEditMode(false); setEditFormData(null); }} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 text-sm sm:text-base rounded-lg transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 max-w-md bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Export Successful</p>
                <p className="text-sm opacity-90">{successMessage}</p>
              </div>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="text-white hover:text-gray-200 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 max-w-md bg-red-500 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-white hover:text-gray-200 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}
