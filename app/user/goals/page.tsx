'use client';

import { useState, useEffect } from 'react';
import { goalsData } from '@/lib/dummy-data';
import { Target, Plus, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Award, X, Edit, Trash2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  keyResults: KeyResult[];
}

interface KeyResult {
  description: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(goalsData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [animateCards, setAnimateCards] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    keyResults: ['']
  });

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const filteredGoals = goals.filter(goal => {
    const statusMatch = filterStatus === 'all' || goal.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || goal.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.title || !newGoal.description || !newGoal.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: goals.length + 1,
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      dueDate: newGoal.dueDate,
      status: 'not-started',
      priority: newGoal.priority,
      owner: 'You',
      keyResults: newGoal.keyResults
        .filter(kr => kr.trim() !== '')
        .map(kr => ({ description: kr, completed: false }))
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      keyResults: ['']
    });
    setShowAddForm(false);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const toggleKeyResult = (goalId: number, krIndex: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedKeyResults = [...goal.keyResults];
        updatedKeyResults[krIndex].completed = !updatedKeyResults[krIndex].completed;
        
        // Calculate new progress
        const completedCount = updatedKeyResults.filter(kr => kr.completed).length;
        const newProgress = Math.round((completedCount / updatedKeyResults.length) * 100);
        
        // Update status based on progress
        let newStatus: 'completed' | 'in-progress' | 'not-started' = 'not-started';
        if (newProgress === 100) newStatus = 'completed';
        else if (newProgress > 0) newStatus = 'in-progress';

        return {
          ...goal,
          keyResults: updatedKeyResults,
          progress: newProgress,
          status: newStatus
        };
      }
      return goal;
    }));
  };

  const addKeyResult = () => {
    setNewGoal({
      ...newGoal,
      keyResults: [...newGoal.keyResults, '']
    });
  };

  const updateKeyResult = (index: number, value: string) => {
    const updated = [...newGoal.keyResults];
    updated[index] = value;
    setNewGoal({ ...newGoal, keyResults: updated });
  };

  const removeKeyResult = (index: number) => {
    setNewGoal({
      ...newGoal,
      keyResults: newGoal.keyResults.filter((_, i) => i !== index)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
      case 'in-progress': return 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
      case 'not-started': return 'text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
      case 'low': return 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    if (progress >= 75) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (progress >= 50) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const goalStats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    avgProgress: Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl lg:rounded-3xl shadow-lg">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-900 to-purple-900 dark:from-gray-100 dark:via-violet-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Goals & OKRs
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Track your objectives and key results</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="group bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-sm sm:text-base">Add Goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Goals', value: goalStats.total, icon: Target, color: 'from-violet-500 to-purple-500' },
          { label: 'Completed', value: goalStats.completed, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: 'In Progress', value: goalStats.inProgress, icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
          { label: 'Avg Progress', value: `${goalStats.avgProgress}%`, icon: Award, color: 'from-amber-500 to-orange-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Filter by Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">{goal.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(goal.priority)}`}>
                          {goal.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{goal.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">Owner: {goal.owner}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full ${getProgressBarColor(goal.progress)} shadow-lg`}
                        />
                      </div>
                    </div>

                    {/* Key Results */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Results:</h4>
                      <div className="space-y-2">
                        {goal.keyResults.map((kr, krIndex) => (
                          <div key={krIndex} className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleKeyResult(goal.id, krIndex)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                kr.completed 
                                  ? 'bg-emerald-500 border-emerald-500' 
                                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                              }`}
                            >
                              {kr.completed && <CheckCircle className="h-3 w-3 text-white" />}
                            </button>
                            <span className={`text-sm ${kr.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              {kr.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-6">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="flex items-center justify-center px-3 py-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors flex-1 lg:flex-initial"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-1 lg:flex-initial"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Target className="h-6 w-6 mr-3 text-violet-600" />
                Add New Goal
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddGoal} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter goal title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe your goal"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as 'high' | 'medium' | 'low'})}
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Results</label>
                <div className="space-y-3">
                  {newGoal.keyResults.map((kr, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={kr}
                        onChange={(e) => updateKeyResult(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter key result"
                      />
                      {newGoal.keyResults.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyResult(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addKeyResult}
                    className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Key Result
                  </button>
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
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Create Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}