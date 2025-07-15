'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  User,
  fetchUsers,
  getDepartmentStats,
  searchUsers,
  filterUsersByDepartment,
  hardDeleteUser,
  addUser,
  updateUser,
} from '@/app/api/usersApi';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newUser, setNewUser] = useState({
    employeeId: '',
    name: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    location: '',
  });

  const positions = [
    'Software Engineer',
    'Senior Software Engineer',
    'Team Lead',
    'Product Manager',
    'UX Designer',
    'Marketing Specialist',
    'Sales Representative',
    'HR Specialist',
    'DevOps Engineer',
    'Technical Lead',
    'HR Manager',
    'Recruiter',
    'Financial Analyst',
    'Marketing Manager',
    'Account Manager',
    'Operations Manager',
    'Product Designer',
  ];

  // Load users and departments on component mount
  useEffect(() => {
    loadUsers();
    loadDepartments();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const deptStats = await getDepartmentStats();
      setDepartments(deptStats.map(dept => dept.name));
    } catch (err) {
      console.error('Error loading departments:', err);
      // Fallback to basic departments
      setDepartments([
        'IT Department',
        'HR Department',
        'Finance Department',
        'Marketing Department',
      ]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    await loadDepartments();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (!query.trim()) {
      loadUsers();
      return;
    }

    try {
      const searchResults = await searchUsers(query);
      setUsers(searchResults);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleDepartmentFilter = async (department: string) => {
    setFilterDepartment(department);

    try {
      const filteredUsers = await filterUsersByDepartment(department);
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Error filtering users:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === '' || user.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdUser = await addUser(newUser);
      await loadUsers(); // Refresh the user list
      setShowAddForm(false);
      setNewUser({
        employeeId: '',
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        location: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, editingUser);
      await loadUsers(); // Refresh the user list
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await hardDeleteUser(userToDelete.id);
      await loadUsers(); // Refresh the user list to update all components
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 mt-16 sm:mt-20 lg:mt-24">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 mt-16 sm:mt-20 lg:mt-24">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Users className="h-16 w-16 mx-auto mb-2" />
            <p className="text-lg font-semibold">Error loading users</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No top margin for this page
  const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
  return (
    <div
      className={`space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
    >
      {/* Modern Header - Responsive with Slide Animation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white overflow-hidden relative"
      >
        {/* Sliding panels animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-100, 400] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [400, -100] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
            animate={{ y: [-100, 200] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
          />
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
            >
              User Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-emerald-100 text-sm sm:text-base lg:text-lg"
            >
              Manage employee accounts and information
            </motion.p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="group bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start backdrop-blur-sm"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold text-sm sm:text-base">Add User</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <select
              value={filterDepartment}
              onChange={e => handleDepartmentFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-200"
            >
              <RefreshCw
                className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Department
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {user.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {user.employeeId}
                        </div>
                        <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.position} • {user.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.position}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 whitespace-nowrap">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
                Add New User
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors self-end sm:self-auto"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={newUser.employeeId}
                    onChange={e =>
                      setNewUser({ ...newUser, employeeId: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={e =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <select
                    value={newUser.position}
                    onChange={e =>
                      setNewUser({ ...newUser, position: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    value={newUser.department}
                    onChange={e =>
                      setNewUser({ ...newUser, department: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={e =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newUser.location}
                    onChange={e =>
                      setNewUser({ ...newUser, location: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Edit className="h-6 w-6 mr-3 text-blue-600" />
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={editingUser.employeeId}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        employeeId: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={e =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={e =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <select
                    value={editingUser.position}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        position: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {positions.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    value={editingUser.department}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        department: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingUser.phone || ''}
                    onChange={e =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingUser.location || ''}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        location: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to permanently delete this user? This
                action cannot be undone.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {userToDelete.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {userToDelete.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {userToDelete.employeeId} • {userToDelete.department}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                ⚠️ This will permanently remove the user and all associated data
                from the system.
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
