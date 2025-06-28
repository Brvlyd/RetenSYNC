'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Plus, Calendar, Clock, CheckCircle, AlertCircle, 
  Users, TrendingUp, BarChart3, X, Send, Eye, Edit, Trash2
} from 'lucide-react';

interface Survey {
  id: number;
  title: string;
  description: string;
  type: 'engagement' | 'feedback' | 'pulse' | 'custom';
  status: 'draft' | 'active' | 'completed';
  dueDate: string;
  responses: number;
  totalTargets: number;
  createdBy: string;
  createdAt: string;
  questions: SurveyQuestion[];
}

interface SurveyQuestion {
  id: number;
  type: 'multiple-choice' | 'rating' | 'text' | 'yes-no';
  question: string;
  options?: string[];
  required: boolean;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'assigned' | 'created'>('assigned');
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    description: '',
    type: 'pulse' as Survey['type'],
    dueDate: '',
    questions: [] as SurveyQuestion[]
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock survey data
    setSurveys([
      {
        id: 1,
        title: 'Q4 Employee Engagement Survey',
        description: 'Annual comprehensive survey to measure employee satisfaction and engagement levels.',
        type: 'engagement',
        status: 'active',
        dueDate: '2024-12-31',
        responses: 156,
        totalTargets: 200,
        createdBy: 'HR Team',
        createdAt: '2024-11-01',
        questions: [
          {
            id: 1,
            type: 'rating',
            question: 'How satisfied are you with your current role?',
            required: true
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'What motivates you most at work?',
            options: ['Career growth', 'Recognition', 'Work-life balance', 'Compensation'],
            required: true
          }
        ]
      },
      {
        id: 2,
        title: 'Team Collaboration Feedback',
        description: 'Quick pulse survey about team dynamics and collaboration effectiveness.',
        type: 'pulse',
        status: 'completed',
        dueDate: '2024-11-15',
        responses: 45,
        totalTargets: 45,
        createdBy: 'Team Lead',
        createdAt: '2024-11-01',
        questions: [
          {
            id: 1,
            type: 'yes-no',
            question: 'Do you feel comfortable sharing ideas with your team?',
            required: true
          }
        ]
      }
    ]);
  }, []);

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSurvey.title || !newSurvey.description || !newSurvey.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const survey: Survey = {
      id: surveys.length + 1,
      ...newSurvey,
      status: 'draft',
      responses: 0,
      totalTargets: 0,
      createdBy: user?.name || 'You',
      createdAt: new Date().toISOString().split('T')[0],
      questions: newSurvey.questions.length > 0 ? newSurvey.questions : [
        {
          id: 1,
          type: 'rating',
          question: 'Sample question - please edit',
          required: true
        }
      ]
    };

    setSurveys([survey, ...surveys]);
    setNewSurvey({
      title: '',
      description: '',
      type: 'pulse',
      dueDate: '',
      questions: []
    });
    setShowCreateForm(false);
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: newSurvey.questions.length + 1,
      type: 'rating',
      question: '',
      required: true
    };
    setNewSurvey({
      ...newSurvey,
      questions: [...newSurvey.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, field: keyof SurveyQuestion, value: any) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewSurvey({ ...newSurvey, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    setNewSurvey({
      ...newSurvey,
      questions: newSurvey.questions.filter((_, i) => i !== index)
    });
  };

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
      case 'completed': return 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
      case 'draft': return 'text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeColor = (type: Survey['type']) => {
    switch (type) {
      case 'engagement': return 'text-purple-600 bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700';
      case 'feedback': return 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700';
      case 'pulse': return 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
      case 'custom': return 'text-amber-600 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const assignedSurveys = surveys.filter(survey => survey.createdBy !== user?.name);
  const createdSurveys = surveys.filter(survey => survey.createdBy === user?.name);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl lg:rounded-3xl shadow-lg">
                <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Surveys
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Gather insights and feedback from your team</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-sm sm:text-base">Create Survey</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Surveys', value: surveys.length, icon: ClipboardList, color: 'from-indigo-500 to-purple-500' },
          { label: 'Active Surveys', value: surveys.filter(s => s.status === 'active').length, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
          { label: 'Total Responses', value: surveys.reduce((sum, s) => sum + s.responses, 0), icon: Users, color: 'from-blue-500 to-cyan-500' },
          { label: 'Completion Rate', value: '78%', icon: BarChart3, color: 'from-amber-500 to-orange-500' }
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

      {/* Tabs */}
      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700 shadow-lg">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'assigned'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <ClipboardList className="h-5 w-5" />
          <span>Assigned to Me ({assignedSurveys.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('created')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'created'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Plus className="h-5 w-5" />
          <span>Created by Me ({createdSurveys.length})</span>
        </button>
      </div>

      {/* Surveys List */}
      <div className="space-y-6">
        <AnimatePresence>
          {(activeTab === 'assigned' ? assignedSurveys : createdSurveys).map((survey, index) => (
            <motion.div
              key={survey.id}
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">{survey.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(survey.status)}`}>
                          {survey.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(survey.type)}`}>
                          {survey.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{survey.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Due: {new Date(survey.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">Responses: {survey.responses}/{survey.totalTargets}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        <span className="text-sm">{survey.questions.length} Questions</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {survey.totalTargets > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Response Progress</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {Math.round((survey.responses / survey.totalTargets) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(survey.responses / survey.totalTargets) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-6">
                    {activeTab === 'assigned' && survey.status === 'active' && (
                      <button className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium flex-1 lg:flex-initial">
                        <Send className="h-4 w-4 mr-2" />
                        Take Survey
                      </button>
                    )}
                    
                    {activeTab === 'created' && (
                      <>
                        <button className="flex items-center justify-center px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-300 text-sm font-medium flex-1 lg:flex-initial">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 text-sm font-medium flex-1 lg:flex-initial">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Survey Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <ClipboardList className="h-6 w-6 mr-3 text-indigo-600" />
                Create New Survey
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSurvey} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Survey Title</label>
                <input
                  type="text"
                  value={newSurvey.title}
                  onChange={(e) => setNewSurvey({...newSurvey, title: e.target.value})}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter survey title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({...newSurvey, description: e.target.value})}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe the purpose of this survey"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Survey Type</label>
                  <select
                    value={newSurvey.type}
                    onChange={(e) => setNewSurvey({...newSurvey, type: e.target.value as Survey['type']})}
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pulse">Pulse Survey</option>
                    <option value="engagement">Engagement Survey</option>
                    <option value="feedback">Feedback Survey</option>
                    <option value="custom">Custom Survey</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newSurvey.dueDate}
                    onChange={(e) => setNewSurvey({...newSurvey, dueDate: e.target.value})}
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold"
                >
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Create Survey
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}