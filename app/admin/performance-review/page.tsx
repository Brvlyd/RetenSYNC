'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { performanceReviewData, goalsData } from '@/lib/dummy-data';
import {
  Star,
  Clock,
  Edit3,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Calendar,
  Trophy,
} from 'lucide-react';

export default function PerformanceReview() {
  const [currentRating, setCurrentRating] = useState(4.2);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'overview' | 'goals' | 'history'
  >('overview');
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    setAnimateProgress(true);

    // Get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Moved renderStars to top-level scope so it's available everywhere
  const renderStars = (rating: number, size = 'normal') => {
    const starSize = size === 'large' ? 'h-8 w-8' : 'h-5 w-5';
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} transition-all duration-300 ${
          i < Math.floor(rating)
            ? 'text-amber-400 fill-current drop-shadow-sm'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  // Insert new section for goals
  const sections = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'goals', label: 'Goals & OKRs', icon: Target },
    { id: 'history', label: 'History', icon: Clock },
  ] as const;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle goal creation logic here
    console.log('New goal:', newGoal);
    setShowAddGoalForm(false);
    setNewGoal({ title: '', description: '', dueDate: '', priority: 'medium' });
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    if (progress >= 75) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (progress >= 50) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  // User-specific performance data
  const userPerformanceData = {
    currentRating: 4.2,
    achievements: [
      'Completed 5 major projects this quarter',
      'Mentored 2 junior team members',
      'Improved code quality metrics by 25%',
      'Led successful client presentation',
    ],
    areasForGrowth: [
      'Time management during peak periods',
      'Cross-team communication',
      'Technical documentation',
    ],
    goals: [
      'Complete AWS certification by Q2',
      'Lead cross-functional project',
      'Improve presentation skills',
    ],
  };

  // Add margin to top so header doesn't cut content (same as 1on1 page)
  const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
  return (
    <div
      className={`space-y-6 sm:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
    >
      {/* Modern Header - Responsive with Trophy Animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 text-white overflow-hidden relative"
      >
        {/* Trophy and achievement icons floating animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-6 right-12 text-white/20"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Trophy className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="absolute top-20 left-16 text-white/15"
            animate={{
              y: [0, -8, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <Award className="h-6 w-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-20 text-white/25"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          >
            <Target className="h-7 w-7" />
          </motion.div>
          <motion.div
            className="absolute bottom-16 left-8 text-white/20"
            animate={{
              y: [0, -6, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          >
            <Star className="h-5 w-5" />
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
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
            Performance Review
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-indigo-100 text-sm sm:text-base lg:text-lg"
          >
            Track progress and achievements
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-100 dark:border-gray-700 shadow-lg">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <section.icon
              className={`h-5 w-5 ${
                activeSection === section.id
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400'
              } transition-colors`}
            />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Current Performance Rating */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Current Performance Rating
                </h3>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex">
                  {renderStars(userPerformanceData.currentRating, 'large')}
                </div>
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {userPerformanceData.currentRating}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-700">
                  <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                    Exceeds
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    4.5 - 5.0
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                  <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    Meets
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    3.5 - 4.4
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-4 border border-orange-200 dark:border-orange-700">
                  <div className="text-lg font-bold text-orange-800 dark:text-orange-200">
                    Needs Improvement
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Below 3.5
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                  Key Achievements
                </h4>
              </div>
              <ul className="space-y-3">
                {userPerformanceData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h4 className="font-bold text-orange-900 dark:text-orange-200">
                  Areas for Growth
                </h4>
              </div>
              <ul className="space-y-3">
                {userPerformanceData.areasForGrowth.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-orange-800 dark:text-orange-200 leading-relaxed">
                      {area}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-bold text-blue-900 dark:text-blue-200">
                  Current Goals
                </h4>
              </div>
              <ul className="space-y-3">
                {userPerformanceData.goals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {goal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Goals & OKRs Section */}
      {activeSection === 'goals' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Goals & OKRs
              </h3>
            </div>
            <button
              onClick={() => setShowAddGoalForm(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </button>
          </div>

          <div className="space-y-6">
            {goalsData.slice(0, 3).map((goal, index) => (
              <div
                key={goal.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {goal.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {goal.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {goal.progress}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Complete
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(goal.progress)} shadow-lg`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Key Results:
                  </h5>
                  {goal.keyResults.map((kr, krIndex) => (
                    <div
                      key={krIndex}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <CheckCircle
                        className={`h-4 w-4 ${kr.completed ? 'text-emerald-500' : 'text-gray-400'}`}
                      />
                      <span
                        className={
                          kr.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-700 dark:text-gray-300'
                        }
                      >
                        {kr.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Goal Modal */}
          {showAddGoalForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Add New Goal
                </h3>
                <form onSubmit={handleAddGoal} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Goal Title
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={e =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={newGoal.description}
                      onChange={e =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                      className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newGoal.dueDate}
                        onChange={e =>
                          setNewGoal({ ...newGoal, dueDate: e.target.value })
                        }
                        className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newGoal.priority}
                        onChange={e =>
                          setNewGoal({ ...newGoal, priority: e.target.value })
                        }
                        className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddGoalForm(false)}
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
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review History Section */}
      {activeSection === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review History
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                year: '2024',
                status: 'In Progress',
                rating: null,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                year: '2023',
                status: 'Completed',
                rating: 4.1,
                color: 'from-emerald-500 to-teal-500',
              },
              {
                year: '2022',
                status: 'Completed',
                rating: 3.8,
                color: 'from-emerald-500 to-teal-500',
              },
              {
                year: '2021',
                status: 'Completed',
                rating: 3.9,
                color: 'from-emerald-500 to-teal-500',
              },
            ].map((review, index) => (
              <div
                key={review.year}
                className="group flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-102"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${review.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {review.year} Annual Review
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        review.status === 'Completed'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {review.status}
                    </div>
                  </div>
                </div>
                {review.rating && (
                  <div className="flex items-center space-x-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      {review.rating}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
