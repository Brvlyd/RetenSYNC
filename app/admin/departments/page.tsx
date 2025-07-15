'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Building,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  UserPlus,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { getDepartmentStats } from '@/app/api/usersApi';

interface Department {
  id: number;
  name: string;
  description: string;
  head: string;
  employeeCount: number;
  budget: string;
  location: string;
  performanceScore: number;
  engagementScore: number;
  satisfactionScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Position {
  id: number;
  title: string;
  department: string;
  level: string;
  description: string;
  requirements: string[];
}

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: 'Engineering',
      description: 'Software development and technical innovation',
      head: 'Bravely Dirgayuska',
      employeeCount: 45,
      budget: '$2.5M',
      location: 'Jakarta',
      performanceScore: 8.7,
      engagementScore: 8.2,
      satisfactionScore: 8.5,
      riskLevel: 'low',
    },
    {
      id: 2,
      name: 'Product',
      description: 'Product strategy and management',
      head: 'Putri Aulia Simanjuntak',
      employeeCount: 19,
      budget: '$1.2M',
      location: 'Jakarta',
      performanceScore: 8.1,
      engagementScore: 7.8,
      satisfactionScore: 8.0,
      riskLevel: 'low',
    },
    {
      id: 3,
      name: 'Design',
      description: 'User experience and visual design',
      head: 'Annisa Azalia Maulana',
      employeeCount: 12,
      budget: '$800K',
      location: 'Bandung',
      performanceScore: 8.4,
      engagementScore: 8.6,
      satisfactionScore: 8.3,
      riskLevel: 'low',
    },
    {
      id: 4,
      name: 'Marketing',
      description: 'Brand promotion and customer acquisition',
      head: 'Dzikri Razzan Athallah',
      employeeCount: 28,
      budget: '$1.8M',
      location: 'Jakarta',
      performanceScore: 7.2,
      engagementScore: 6.8,
      satisfactionScore: 7.0,
      riskLevel: 'medium',
    },
    {
      id: 5,
      name: 'Sales',
      description: 'Revenue generation and client relations',
      head: 'Tasya Salsabila',
      employeeCount: 32,
      budget: '$2.1M',
      location: 'Surabaya',
      performanceScore: 7.8,
      engagementScore: 7.5,
      satisfactionScore: 7.6,
      riskLevel: 'medium',
    },
  ]);

  const [positions, setPositions] = useState<Position[]>([
    {
      id: 1,
      title: 'Software Engineer',
      department: 'Engineering',
      level: 'Mid-level',
      description: 'Develop and maintain software applications',
      requirements: [
        'Bachelor\'s degree in Computer Science',
        '2+ years experience',
        'JavaScript/TypeScript proficiency',
      ],
    },
    {
      id: 2,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      level: 'Senior',
      description: 'Lead technical projects and mentor junior developers',
      requirements: [
        'Bachelor\'s degree in Computer Science',
        '5+ years experience',
        'Leadership skills',
        'System design expertise',
      ],
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      level: 'Senior',
      description: 'Define product strategy and roadmap',
      requirements: [
        'MBA or equivalent',
        '3+ years product management',
        'Data analysis skills',
        'Stakeholder management',
      ],
    },
    {
      id: 4,
      title: 'UX Designer',
      department: 'Design',
      level: 'Mid-level',
      description: 'Design user interfaces and experiences',
      requirements: [
        'Design degree or portfolio',
        '2+ years UX experience',
        'Figma/Sketch proficiency',
        'User research skills',
      ],
    },
    {
      id: 5,
      title: 'Marketing Specialist',
      department: 'Marketing',
      level: 'Entry-level',
      description: 'Execute marketing campaigns and strategies',
      requirements: [
        'Marketing degree',
        '1+ years experience',
        'Digital marketing knowledge',
        'Analytics tools proficiency',
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState('departments');
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [showAddPosForm, setShowAddPosForm] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingPos, setEditingPos] = useState<Position | null>(null);

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    head: '',
    budget: '',
    location: '',
  });

  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    level: '',
    description: '',
    requirements: [''],
  });

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const dept: Department = {
      id: departments.length + 1,
      ...newDepartment,
      employeeCount: 0,
      performanceScore: 7.5,
      engagementScore: 7.5,
      satisfactionScore: 7.5,
      riskLevel: 'low',
    };
    setDepartments([...departments, dept]);
    setNewDepartment({
      name: '',
      description: '',
      head: '',
      budget: '',
      location: '',
    });
    setShowAddDeptForm(false);
  };

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const pos: Position = {
      id: positions.length + 1,
      ...newPosition,
      requirements: newPosition.requirements.filter(req => req.trim() !== ''),
    };
    setPositions([...positions, pos]);
    setNewPosition({
      title: '',
      department: '',
      level: '',
      description: '',
      requirements: [''],
    });
    setShowAddPosForm(false);
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const handleDeletePosition = (id: number) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const addRequirement = () => {
    setNewPosition({
      ...newPosition,
      requirements: [...newPosition.requirements, ''],
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...newPosition.requirements];
    updated[index] = value;
    setNewPosition({ ...newPosition, requirements: updated });
  };

  const removeRequirement = (index: number) => {
    setNewPosition({
      ...newPosition,
      requirements: newPosition.requirements.filter((_, i) => i !== index),
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
    case 'low':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'medium':
      return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'high':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleViewAnalytics = (departmentId: number) => {
    // Navigate to department-specific analytics
    router.push(`/admin/analytics?department=${departmentId}`);
  };

  // Add margin to top so header doesn't cut content (same as 1on1 page)
  const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
  return (
    <div
      className={`space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
    >
      {/* Modern Header - Responsive with Building Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-slate-700 via-gray-800 to-zinc-900 text-white overflow-hidden relative"
      >
        {/* Building skyline animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/20 to-transparent" />
          <motion.div
            className="absolute bottom-0 left-8 w-8 h-16 bg-white/10 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-0 left-20 w-6 h-12 bg-white/15 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: 48 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.div
            className="absolute bottom-0 left-30 w-10 h-20 bg-white/8 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: 80 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.div
            className="absolute bottom-0 left-44 w-7 h-14 bg-white/12 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: 56 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.div
            className="absolute bottom-0 right-8 w-12 h-18 bg-white/10 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: 72 }}
            transition={{ duration: 1, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-0 right-24 w-8 h-16 bg-white/8 rounded-t-lg"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 1, delay: 1.2 }}
          />

          {/* Animated windows */}
          <motion.div
            className="absolute bottom-8 left-10 w-2 h-2 bg-yellow-400/60 rounded-sm"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-12 left-10 w-2 h-2 bg-blue-400/50 rounded-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-8 right-12 w-2 h-2 bg-green-400/40 rounded-sm"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
          >
            Departments & Positions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg"
          >
            Manage organizational structure and performance insights
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Department Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            label: 'Total Departments',
            value: departments.length,
            icon: Building,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Total Employees',
            value: departments.reduce(
              (sum, dept) => sum + dept.employeeCount,
              0
            ),
            icon: Users,
            color: 'from-emerald-500 to-teal-500',
          },
          {
            label: 'Avg Performance',
            value: (
              departments.reduce(
                (sum, dept) => sum + dept.performanceScore,
                0
              ) / departments.length
            ).toFixed(1),
            icon: TrendingUp,
            color: 'from-purple-500 to-violet-500',
          },
          {
            label: 'High Risk Depts',
            value: departments.filter(d => d.riskLevel === 'high').length,
            icon: Target,
            color: 'from-amber-500 to-orange-500',
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700 shadow-lg">
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'departments'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Building className="h-5 w-5" />
          <span>Departments</span>
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'positions'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <UserPlus className="h-5 w-5" />
          <span>Positions</span>
        </button>
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddDeptForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Department
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 lg:p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingDept(dept)}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {dept.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  {dept.description}
                </p>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {dept.performanceScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Performance
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {dept.engagementScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Engagement
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {dept.satisfactionScore}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Satisfaction
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Head:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dept.head}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Employees:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dept.employeeCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Budget:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dept.budget}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dept.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Risk Level:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRiskColor(dept.riskLevel)}`}
                    >
                      {dept.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewAnalytics(dept.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddPosForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Position
            </button>
          </div>

          <div className="space-y-4">
            {positions.map((pos, index) => (
              <div
                key={pos.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {pos.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full font-medium">
                          {pos.department}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full font-medium">
                          {pos.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPos(pos)}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePosition(pos.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {pos.description}
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Requirements:
                  </h4>
                  <ul className="space-y-1">
                    {pos.requirements.map((req, reqIndex) => (
                      <li
                        key={reqIndex}
                        className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Department
              </h3>
              <button
                onClick={() => setShowAddDeptForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={e =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newDepartment.description}
                  onChange={e =>
                    setNewDepartment({
                      ...newDepartment,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Department Head
                  </label>
                  <input
                    type="text"
                    value={newDepartment.head}
                    onChange={e =>
                      setNewDepartment({
                        ...newDepartment,
                        head: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={newDepartment.budget}
                    onChange={e =>
                      setNewDepartment({
                        ...newDepartment,
                        budget: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newDepartment.location}
                  onChange={e =>
                    setNewDepartment({
                      ...newDepartment,
                      location: e.target.value,
                    })
                  }
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDeptForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold"
                >
                  <Building className="h-5 w-5 mr-2" />
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Position Modal */}
      {showAddPosForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Position
              </h3>
              <button
                onClick={() => setShowAddPosForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddPosition} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Position Title
                </label>
                <input
                  type="text"
                  value={newPosition.title}
                  onChange={e =>
                    setNewPosition({ ...newPosition, title: e.target.value })
                  }
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    value={newPosition.department}
                    onChange={e =>
                      setNewPosition({
                        ...newPosition,
                        department: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={newPosition.level}
                    onChange={e =>
                      setNewPosition({ ...newPosition, level: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newPosition.description}
                  onChange={e =>
                    setNewPosition({
                      ...newPosition,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>
                <div className="space-y-3">
                  {newPosition.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={req}
                        onChange={e => updateRequirement(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter requirement"
                      />
                      {newPosition.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Requirement
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPosForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
