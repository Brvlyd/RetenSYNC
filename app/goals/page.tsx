'use client';

import { useState, useEffect } from 'react';
import { goalsData, Goal, KeyResult } from '@/lib/dummy-data';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, User, Award, BarChart3, X } from 'lucide-react';

export default function Goals() {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2024');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    setAnimateProgress(true);
  }, []);

  const getTypeColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) {
      return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    } else if (progress >= 75) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    } else if (progress >= 50) {
      return 'bg-gradient-to-r from-amber-500 to-orange-500';
    } else {
      return 'bg-gradient-to-r from-red-500 to-pink-500';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Goal created successfully!');
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
      setShowAddForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Modern Header with Glassmorphism - Responsive */}
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
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Track progress and achieve meaningful objectives</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg lg:rounded-xl text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                <option>Q4 2024</option>
                <option>Q3 2024</option>
                <option>Q2 2024</option>
              </select>
              <button 
                onClick={() => setShowAddForm(true)}
                className="group bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-sm sm:text-base">Add Goal</span>
              </button>
            
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-violet-600" />
                Add New Goal
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter goal title"
                  className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your goal..."
                  className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Target className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Progress Overview - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          { label: 'Total Goals', value: 12, icon: Target, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30' },
          { label: 'Completed', value: 8, icon: CheckCircle, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30' },
          { label: 'In Progress', value: 3, icon: Clock, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30' },
          { label: 'Achievement Rate', value: '85%', icon: Award, color: 'from-violet-500 to-purple-500', bgColor: 'from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30' },
        ].map((stat, index) => (
          <div 
            key={stat.label} 
            className={`group relative bg-gradient-to-r ${stat.bgColor} rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 lg:space-y-4">
              <div className={`p-2 sm:p-3 rounded-lg lg:rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Goals List - Responsive */}
      <div className="space-y-4 sm:space-y-6">
        {goalsData.map((goal, index) => (
          <div 
            key={goal.id} 
            className={`group bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
              animateProgress ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl lg:rounded-3xl"></div>
            
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 sm:mb-6 space-y-4 xl:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{goal.title}</h3>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit ${getTypeColor(goal.status)}`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm sm:text-base">{goal.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">Owner: {goal.owner}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 sm:col-span-2 lg:col-span-1">
                      <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className={`text-sm font-medium ${getPriorityColor(goal.priority)}`}>
                        Priority: {goal.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row xl:flex-col items-center xl:items-end space-x-4 xl:space-x-0 xl:space-y-2">
                  <div className="text-center xl:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {goal.progress}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Complete</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar - Responsive */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(goal.progress)} shadow-lg relative overflow-hidden`}
                    style={{ width: animateProgress ? `${goal.progress}%` : '0%' }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Key Results - Responsive */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center text-sm sm:text-base">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Key Results
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {goal.keyResults.map((kr: KeyResult, krIndex: number) => (
                    <div key={krIndex} className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg lg:rounded-xl">
                      <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        kr.completed ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm sm:text-base ${
                          kr.completed 
                            ? 'text-gray-900 dark:text-white line-through' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {kr.description}
                        </span>
                        {kr.completed && (
                          <div className="mt-1">
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                              Complete
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}