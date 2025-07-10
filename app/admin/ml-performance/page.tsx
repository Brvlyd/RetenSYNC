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
  TrendingDown,
  Users,
  Clock,
  Award,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  X,
  Key
} from 'lucide-react';
import { 
  fetchPerformanceData, 
  createPerformanceData, 
  calculateRiskLevel, 
  mockPerformanceData,
  type PerformanceData, 
  type CreatePerformanceData 
} from '@/app/api/mlPerformanceApi';
import TokenManager from '@/components/TokenManager';

export default function MLPerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PerformanceData | null>(null);
  const [showTokenManager, setShowTokenManager] = useState(false);
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
      
      // If it's an authentication error, suggest showing token manager
      if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
        setShowTokenManager(true);
      }
      
      // Use mock data as fallback
      setPerformanceData(mockPerformanceData);
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
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create performance data';
      setError(errorMessage);
      
      // If it's an authentication error, suggest showing token manager
      if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
        setShowTokenManager(true);
      }
    }
  };

  const handleTokenSet = (token: string) => {
    setShowTokenManager(false);
    setError(null);
    // Retry loading data with new token
    loadPerformanceData();
  };

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
    item.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employee_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-600" />
                ML Performance Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Analyze employee performance data using machine learning insights
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTokenManager(!showTokenManager)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Key className="h-5 w-5" />
                API Setup
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Performance Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* API Status Notice */}
        {performanceData.length === mockPerformanceData.length && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  Using Mock Data
                </p>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  The system is currently displaying sample data. Configure your API token to connect to the ML Performance API.
                </p>
              </div>
              <button
                onClick={() => setShowTokenManager(true)}
                className="ml-auto bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Setup API
              </button>
            </div>
          </motion.div>
        )}

        {/* Token Manager */}
        {showTokenManager && (
          <TokenManager onTokenSet={handleTokenSet} />
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{performanceData.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(performanceData.reduce((acc, curr) => acc + curr.satisfaction_level, 0) / performanceData.length * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Risk</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {performanceData.filter(emp => calculateRiskLevel(emp).level === 'High').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Promoted</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {performanceData.filter(emp => emp.promotion_last_5years).length}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-5 w-5" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Performance Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Satisfaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Evaluation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Monthly Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((employee) => {
                  const risk = calculateRiskLevel(employee);
                  return (
                    <tr key={employee.employee} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.employee_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.employee_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.department_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${employee.satisfaction_level * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {(employee.satisfaction_level * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${employee.last_evaluation * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {(employee.last_evaluation * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.number_project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.average_monthly_hours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                          {risk.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create Performance Data Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add Performance Data
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreatePerformanceData(createFormData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="number"
                      value={createFormData.employee}
                      onChange={(e) => setCreateFormData({...createFormData, employee: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Satisfaction Level (0-1)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={createFormData.satisfaction_level}
                      onChange={(e) => setCreateFormData({...createFormData, satisfaction_level: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Evaluation (0-1)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={createFormData.last_evaluation}
                      onChange={(e) => setCreateFormData({...createFormData, last_evaluation: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                      onChange={(e) => setCreateFormData({...createFormData, number_project: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                      onChange={(e) => setCreateFormData({...createFormData, average_monthly_hours: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                      onChange={(e) => setCreateFormData({...createFormData, time_spend_company: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
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
                
                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetCreateForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Employee Performance Details
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.employee_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.employee_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.department_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Satisfaction Level</p>
                  <p className="text-gray-900 dark:text-white">{(selectedEmployee.satisfaction_level * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Evaluation</p>
                  <p className="text-gray-900 dark:text-white">{(selectedEmployee.last_evaluation * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Projects</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.number_project}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Hours</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.average_monthly_hours}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Time in Company</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.time_spend_company} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Accident</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.work_accident ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Promotion Last 5 Years</p>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.promotion_last_5years ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
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
                {error.includes('Authentication') && (
                  <button
                    onClick={() => setShowTokenManager(true)}
                    className="mt-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded transition-colors"
                  >
                    Configure API Token
                  </button>
                )}
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
  );
}
