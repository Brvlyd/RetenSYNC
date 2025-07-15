'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { feedbackData } from '@/lib/dummy-data';
import {
  MessageSquare,
  Send,
  Clock,
  Star,
  Heart,
  ThumbsUp,
  Users,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function Feedback() {
  const [activeTab, setActiveTab] = useState('received');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [formData, setFormData] = useState({
    type: 'peer',
    recipient: '',
    project: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const tabs = [
    {
      id: 'received',
      label: 'Received',
      count: feedbackData.filter(f => f.status === 'received').length,
      icon: Heart,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'sent',
      label: 'Sent',
      count: feedbackData.filter(f => f.status === 'sent').length,
      icon: Send,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'give',
      label: 'Give Feedback',
      count: 0,
      icon: Star,
      color: 'from-violet-500 to-purple-500',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
    case 'peer':
      return <Users className="h-4 w-4" />;
    case 'manager':
      return <TrendingUp className="h-4 w-4" />;
    case 'self':
      return <Award className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
    case 'peer':
      return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200';
    case 'manager':
      return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200';
    case 'self':
      return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200';
    default:
      return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipient || !formData.project || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Feedback submitted successfully!');
      setFormData({
        type: 'peer',
        recipient: '',
        project: '',
        message: '',
      });
      setShowFeedbackForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  // Add margin to top so header doesn't cut content (same as 1on1 page)
  const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
  return (
    <div className={`space-y-6 lg:space-y-8 animate-fade-in ${pageTopMargin}`}>
      {/* Modern Header - Responsive with Heartbeat Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white overflow-hidden relative"
      >
        {/* Heartbeat pulse animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.3, 1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.4, 1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />

          {/* Floating hearts */}
          <motion.div
            className="absolute top-8 right-16 text-white/20"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Heart className="h-6 w-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 left-20 text-white/15"
            animate={{
              y: [0, -8, 0],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          >
            <Heart className="h-4 w-4" />
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>

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
            Continuous Feedback
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-rose-100 text-sm sm:text-base lg:text-lg"
          >
            360° feedback system for continuous improvement
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Enhanced Tab Navigation - Responsive */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-2 border border-gray-100 dark:border-gray-700 shadow-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowFeedbackForm(tab.id === 'give');
              }}
              className={`group relative flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-lg lg:rounded-xl font-semibold text-sm transition-all duration-300 w-full sm:flex-1 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-500/25 scale-105`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                } transition-colors`}
              />
              <span className="truncate">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  } transition-all duration-300`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Feedback Form - Responsive */}
      {showFeedbackForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl lg:rounded-2xl">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Give Feedback
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Feedback Type
                </label>
                <select
                  value={formData.type}
                  onChange={e =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                >
                  <option value="peer">Peer Feedback</option>
                  <option value="manager">Upward Feedback</option>
                  <option value="self">Self Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Recipient
                </label>
                <select
                  value={formData.recipient}
                  onChange={e =>
                    setFormData({ ...formData, recipient: e.target.value })
                  }
                  className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                >
                  <option value="">Select recipient...</option>
                  <option value="Aulia">Aulia</option>
                  <option value="Tasya">Tasya</option>
                  <option value="Annisa">Annisa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Project/Context
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={e =>
                  setFormData({ ...formData, project: e.target.value })
                }
                placeholder="e.g., Q4 Product Launch"
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Feedback Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={e =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Share specific, actionable feedback..."
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl lg:rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl lg:rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Enhanced Feedback List - Responsive */}
      {!showFeedbackForm && (
        <div className="space-y-4 sm:space-y-6">
          {feedbackData
            .filter(feedback => feedback.status === activeTab)
            .map((feedback, index) => (
              <div
                key={feedback.id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  animateCards
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl lg:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                          <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                            {feedback.status === 'received'
                              ? `From: ${feedback.from}`
                              : `To: ${feedback.to}`}
                          </span>
                          <span
                            className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit ${getTypeColor(feedback.type)}`}
                          >
                            {getTypeIcon(feedback.type)}
                            <span className="ml-1">{feedback.type}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                          Project:{' '}
                          <span className="text-gray-900 dark:text-white">
                            {feedback.project}
                          </span>
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-xl lg:rounded-2xl p-3 sm:p-4 border border-gray-100 dark:border-gray-600 text-sm sm:text-base">
                          {feedback.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end space-x-4 lg:space-x-0 lg:space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group/like">
                        <ThumbsUp className="h-4 w-4 group-hover/like:scale-110 transition-transform" />
                        <span className="font-medium">Helpful</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
