'use client';

import { useState, useEffect } from 'react';
import { performanceReviewData, goalsData } from '@/lib/dummy-data';
import { Star, Clock, Edit3, TrendingUp, Award, Target, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react';

export default function PerformanceReview() {
  const [currentRating, setCurrentRating] = useState(4.2);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    setAnimateProgress(true);
  }, []);

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
    { id: 'self', label: 'Self Assessment', icon: Target },
    { id: 'manager', label: 'Manager Review', icon: Award },
    { id: 'goals', label: 'Goals & OKRs', icon: Target },
    { id: 'history', label: 'History', icon: Clock },
  ];

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

  return (
    <div className="space-y-8">
      {/* Modern Header with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-lg">
              <Award className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                Performance Review
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">Annual performance review and goal management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-100 dark:border-gray-700 shadow-lg">
        {sections.map((section) => (
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
                activeSection === section.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              } transition-colors`}
            />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Enhanced Current Review Status */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2024 Annual Review</h3>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-700">
                In Progress
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: 'Self-Review Complete',
                  value: 85,
                  color: 'from-emerald-500 to-teal-500',
                  bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30',
                },
                {
                  label: 'Peer Reviews Received',
                  value: 60,
                  display: '3/5',
                  color: 'from-blue-500 to-cyan-500',
                  bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
                },
                {
                  label: 'Manager Calibration',
                  value: 0,
                  display: 'Pending',
                  color: 'from-orange-500 to-amber-500',
                  bgColor: 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30',
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`group relative bg-gradient-to-r ${item.bgColor} rounded-2xl p-6 border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.display || `${item.value}%`}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{item.label}</div>
                    {typeof item.value === 'number' && item.value > 0 && (
                      <div className="w-full bg-white/50 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000 shadow-sm`}
                          style={{ width: animateProgress ? `${item.value}%` : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Rating Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Performance Rating</h3>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex">{renderStars(performanceReviewData.managerFeedback.rating, 'large')}</div>
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {performanceReviewData.managerFeedback.rating}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-700">
                  <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">Exceeds</div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">4.5 - 5.0</div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                  <div className="text-lg font-bold text-blue-800 dark:text-blue-200">Meets</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">3.5 - 4.4</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-4 border border-orange-200 dark:border-orange-700">
                  <div className="text-lg font-bold text-orange-800 dark:text-orange-200">Needs Improvement</div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Below 3.5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Self Assessment Section with Goals */}
      {activeSection === 'self' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Self Assessment</h3>
              </div>
              <button className="group text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center text-sm bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 px-4 py-2 rounded-xl transition-all duration-300">
                <Edit3 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Edit Assessment
              </button>
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200">Key Achievements</h4>
                </div>
                <ul className="space-y-3">
                  {performanceReviewData.selfReview.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-emerald-800 dark:text-emerald-200 leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manager's Goal Recommendations</h3>
            </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <h4 className="font-bold text-orange-900 dark:text-orange-200">Areas for Growth</h4>
                </div>
                <ul className="space-y-3">
                  {performanceReviewData.selfReview.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-orange-800 dark:text-orange-200 leading-relaxed">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-blue-900 dark:text-blue-200">Goals for Next Year</h4>
                </div>
                <ul className="space-y-3">
                  {performanceReviewData.selfReview.goals.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-blue-800 dark:text-blue-200 leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Goals & OKRs Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Current Goals & OKRs</h3>
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
                <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{goal.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{goal.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{goal.progress}%</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(goal.progress)} shadow-lg`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Key Results:</h5>
                    {goal.keyResults.map((kr, krIndex) => (
                      <div key={krIndex} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${kr.completed ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className={kr.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                          {kr.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Goal Modal */}
          {showAddGoalForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Goal</h3>
                <form onSubmit={handleAddGoal} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
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

      {/* Manager Assessment Section with Goals */}
      {activeSection === 'manager' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Assessment</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-lg">Overall Rating</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex">{renderStars(performanceReviewData.managerFeedback.rating)}</div>
                    <span className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                      {performanceReviewData.managerFeedback.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Key Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {performanceReviewData.managerFeedback.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/50 dark:to-teal-800/50 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-semibold border border-emerald-300 dark:border-emerald-600 shadow-sm"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                  <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Development Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {performanceReviewData.managerFeedback.improvements.map((improvement, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-800/50 dark:to-amber-800/50 text-orange-800 dark:text-orange-200 rounded-full text-sm font-semibold border border-orange-300 dark:border-orange-600 shadow-sm"
                      >
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manager's Goal Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manager's Goal Recommendations</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Technical Leadership Development",
                  description: "Focus on developing technical leadership skills to guide junior team members",
                  priority: "high",
                  timeline: "Q1 2025"
                },
                {
                  title: "Cross-functional Collaboration",
                  description: "Improve collaboration with product and design teams for better project outcomes",
                  priority: "medium",
                  timeline: "Q2 2025"
                },
                {
                  title: "Public Speaking & Presentation",
                  description: "Develop presentation skills for technical talks and stakeholder meetings",
                  priority: "medium",
                  timeline: "Q3 2025"
                }
              ].map((goal, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {goal.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{goal.description}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    Target: {goal.timeline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review History Section */}
      {activeSection === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Review History</h3>
          </div>

          <div className="space-y-4">
            {[
              { year: '2024', status: 'In Progress', rating: null, color: 'from-blue-500 to-cyan-500' },
              { year: '2023', status: 'Completed', rating: 4.1, color: 'from-emerald-500 to-teal-500' },
              { year: '2022', status: 'Completed', rating: 3.8, color: 'from-emerald-500 to-teal-500' },
              { year: '2021', status: 'Completed', rating: 3.9, color: 'from-emerald-500 to-teal-500' },
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
                    <div className="font-bold text-gray-900 dark:text-white text-lg">{review.year} Annual Review</div>
                    <div
                      className={`text-sm font-medium ${
                        review.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {review.status}
                    </div>
                  </div>
                </div>
                {review.rating && (
                  <div className="flex items-center space-x-3">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{review.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Goal Modal (keep outside sections so it will appear above everything) */}
      {showAddGoalForm && activeSection === 'goals' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
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
  );
}