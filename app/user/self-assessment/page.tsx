'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  ClipboardList,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Play,
  BarChart3,
  Target,
  Award,
  ArrowRight,
  FileText,
  Users,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Assessment {
  id: number;
  title: string;
  description: string;
  type: 'quarterly' | 'monthly' | 'annual' | 'project';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  completedDate?: string;
  score?: number;
  category: string;
  estimatedTime: string;
  questions: number;
}

interface AssessmentResult {
  category: string;
  score: number;
  maxScore: number;
  improvement: number;
}

export default function SelfAssessmentPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const assessments: Assessment[] = [
    {
      id: 1,
      title: 'Q4 2024 Performance Review',
      description: 'Comprehensive quarterly performance self-evaluation covering goals, achievements, and development areas.',
      type: 'quarterly',
      status: 'pending',
      dueDate: '2024-12-31',
      category: 'Performance',
      estimatedTime: '45 minutes',
      questions: 25
    },
    {
      id: 2,
      title: 'Leadership Skills Assessment',
      description: 'Evaluate your leadership capabilities, communication skills, and team management abilities.',
      type: 'monthly',
      status: 'in-progress',
      dueDate: '2024-11-30',
      category: 'Leadership',
      estimatedTime: '30 minutes',
      questions: 20
    },
    {
      id: 3,
      title: 'Technical Competency Review',
      description: 'Assessment of technical skills, problem-solving abilities, and knowledge in your domain.',
      type: 'quarterly',
      status: 'completed',
      dueDate: '2024-11-15',
      completedDate: '2024-11-10',
      score: 87,
      category: 'Technical',
      estimatedTime: '60 minutes',
      questions: 35
    },
    {
      id: 4,
      title: 'Team Collaboration Assessment',
      description: 'Evaluate your collaboration skills, teamwork, and contribution to team dynamics.',
      type: 'monthly',
      status: 'completed',
      dueDate: '2024-10-31',
      completedDate: '2024-10-28',
      score: 92,
      category: 'Collaboration',
      estimatedTime: '25 minutes',
      questions: 15
    },
    {
      id: 5,
      title: 'Annual Development Planning',
      description: 'Comprehensive review of career goals, learning objectives, and professional development plans.',
      type: 'annual',
      status: 'overdue',
      dueDate: '2024-10-15',
      category: 'Development',
      estimatedTime: '90 minutes',
      questions: 50
    },
    {
      id: 6,
      title: 'Project X Retrospective',
      description: 'Reflect on your contributions, learnings, and experiences from the recent project.',
      type: 'project',
      status: 'pending',
      dueDate: '2024-12-05',
      category: 'Project',
      estimatedTime: '40 minutes',
      questions: 22
    }
  ];

  const assessmentResults: AssessmentResult[] = [
    {
      category: 'Technical Skills',
      score: 87,
      maxScore: 100,
      improvement: 5
    },
    {
      category: 'Leadership',
      score: 78,
      maxScore: 100,
      improvement: 12
    },
    {
      category: 'Collaboration',
      score: 92,
      maxScore: 100,
      improvement: 3
    },
    {
      category: 'Communication',
      score: 85,
      maxScore: 100,
      improvement: 8
    },
    {
      category: 'Problem Solving',
      score: 90,
      maxScore: 100,
      improvement: 7
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quarterly': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'monthly': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'annual': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'project': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    
    if (activeTab === 'available') {
      return matchesSearch && matchesType && matchesStatus && ['pending', 'in-progress', 'overdue'].includes(assessment.status);
    } else {
      return matchesSearch && matchesType && matchesStatus && assessment.status === 'completed';
    }
  });

  const tabs = [
    { id: 'available', label: 'Available Assessments', count: assessments.filter(a => ['pending', 'in-progress', 'overdue'].includes(a.status)).length },
    { id: 'completed', label: 'Completed', count: assessments.filter(a => a.status === 'completed').length },
    { id: 'results', label: 'Results & Analytics', count: assessmentResults.length }
  ];

  const stats = [
    {
      title: 'Completed This Quarter',
      value: '6',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: '2',
      icon: Play,
      color: 'text-blue-600'
    },
    {
      title: 'Average Score',
      value: '87%',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Improvement',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Self Assessment</h1>
              <p className="text-purple-100 text-lg">
                Track your progress and reflect on your professional development
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ClipboardList className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.title}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      {(activeTab === 'available' || activeTab === 'completed') && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="project">Project</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {(activeTab === 'available' || activeTab === 'completed') && (
        <div className="space-y-6">
          {filteredAssessments.map((assessment) => {
            const StatusIcon = getStatusIcon(assessment.status);
            return (
              <div
                key={assessment.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {assessment.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                            {assessment.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(assessment.type)}`}>
                            {assessment.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {assessment.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {assessment.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        {assessment.questions} questions
                      </div>
                      {assessment.score && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Score: {assessment.score}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {assessment.status === 'completed' && assessment.score && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {assessment.score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Completed {assessment.completedDate && new Date(assessment.completedDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    
                    {assessment.status !== 'completed' && (
                      <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        {assessment.status === 'in-progress' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </button>
                    )}
                    
                    {assessment.status === 'completed' && (
                      <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <FileText className="w-4 h-4 mr-2" />
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No assessments found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-8">
          {/* Performance Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Performance Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessmentResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {result.category}
                    </h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {result.score}%
                      </div>
                      <div className={cn(
                        "text-xs font-medium",
                        result.improvement > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {result.improvement > 0 ? '+' : ''}{result.improvement}% from last
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Progress</span>
                      <span>{result.score}/{result.maxScore}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Assessment Trends
                </h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-semibold text-gray-900 dark:text-white">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Improvement</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time Investment</span>
                  <span className="font-semibold text-gray-900 dark:text-white">15h/month</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Development Areas
                </h3>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {[
                  { area: 'Leadership Skills', priority: 'High', color: 'text-red-600' },
                  { area: 'Technical Writing', priority: 'Medium', color: 'text-yellow-600' },
                  { area: 'Public Speaking', priority: 'Medium', color: 'text-yellow-600' },
                  { area: 'Data Analysis', priority: 'Low', color: 'text-green-600' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">{item.area}</span>
                    <span className={`text-xs font-medium ${item.color}`}>{item.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
