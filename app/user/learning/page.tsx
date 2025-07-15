'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  BookOpen,
  Play,
  Clock,
  Star,
  TrendingUp,
  Award,
  Users,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  BarChart3,
  Target,
  Bookmark,
  Download,
  Video,
  FileText,
  Headphones,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  type: 'video' | 'article' | 'podcast' | 'interactive';
  progress: number;
  rating: number;
  enrolled: number;
  thumbnail: string;
  tags: string[];
  status: 'not-started' | 'in-progress' | 'completed';
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Leadership in the Digital Age',
    description: 'Master modern leadership skills for remote and hybrid teams.',
    instructor: 'Dr. Sarah Johnson',
    duration: '4h 30m',
    level: 'intermediate',
    category: 'Leadership',
    type: 'video',
    progress: 65,
    rating: 4.8,
    enrolled: 1250,
    thumbnail: '/api/placeholder/300/200',
    tags: ['leadership', 'remote work', 'management'],
    status: 'in-progress',
  },
  {
    id: '2',
    title: 'Effective Communication Strategies',
    description: 'Improve your communication skills for better collaboration.',
    instructor: 'Michael Chen',
    duration: '3h 15m',
    level: 'beginner',
    category: 'Communication',
    type: 'video',
    progress: 100,
    rating: 4.6,
    enrolled: 890,
    thumbnail: '/api/placeholder/300/200',
    tags: ['communication', 'teamwork', 'presentation'],
    status: 'completed',
  },
  {
    id: '3',
    title: 'Data Analysis Fundamentals',
    description: 'Learn the basics of data analysis and visualization.',
    instructor: 'Emma Rodriguez',
    duration: '6h 45m',
    level: 'beginner',
    category: 'Technical',
    type: 'interactive',
    progress: 0,
    rating: 4.9,
    enrolled: 2100,
    thumbnail: '/api/placeholder/300/200',
    tags: ['data', 'analytics', 'excel'],
    status: 'not-started',
  },
  {
    id: '4',
    title: 'Time Management Mastery',
    description:
      'Optimize your productivity with proven time management techniques.',
    instructor: 'David Kim',
    duration: '2h 20m',
    level: 'beginner',
    category: 'Productivity',
    type: 'article',
    progress: 30,
    rating: 4.7,
    enrolled: 1500,
    thumbnail: '/api/placeholder/300/200',
    tags: ['productivity', 'planning', 'efficiency'],
    status: 'in-progress',
  },
  {
    id: '5',
    title: 'Advanced Project Management',
    description: 'Take your project management skills to the next level.',
    instructor: 'Lisa Wang',
    duration: '8h 10m',
    level: 'advanced',
    category: 'Management',
    type: 'video',
    progress: 0,
    rating: 4.8,
    enrolled: 750,
    thumbnail: '/api/placeholder/300/200',
    tags: ['project management', 'agile', 'leadership'],
    status: 'not-started',
  },
  {
    id: '6',
    title: 'Mindfulness at Work',
    description: 'Reduce stress and improve focus with mindfulness practices.',
    instructor: 'Alex Thompson',
    duration: '1h 45m',
    level: 'beginner',
    category: 'Wellbeing',
    type: 'podcast',
    progress: 100,
    rating: 4.5,
    enrolled: 950,
    thumbnail: '/api/placeholder/300/200',
    tags: ['mindfulness', 'stress management', 'wellbeing'],
    status: 'completed',
  },
];

const categories = [
  'All',
  'Leadership',
  'Communication',
  'Technical',
  'Productivity',
  'Management',
  'Wellbeing',
];

const getTypeIcon = (type: string) => {
  switch (type) {
  case 'video':
    return Video;
  case 'article':
    return FileText;
  case 'podcast':
    return Headphones;
  case 'interactive':
    return Play;
  default:
    return BookOpen;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
  case 'beginner':
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  case 'intermediate':
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
  case 'advanced':
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  default:
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function LearningPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const stats = [
    {
      title: 'Courses Completed',
      value: '12',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Hours Learned',
      value: '48h',
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      title: 'Certificates Earned',
      value: '8',
      icon: Award,
      color: 'text-yellow-600',
    },
    {
      title: 'Learning Streak',
      value: '15 days',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  const learningPaths = [
    {
      title: 'Leadership Development Track',
      courses: 4,
      progress: 75,
      description: 'Comprehensive leadership training program',
    },
    {
      title: 'Technical Skills Bootcamp',
      courses: 6,
      progress: 45,
      description: 'Essential technical skills for your role',
    },
    {
      title: 'Communication Excellence',
      courses: 3,
      progress: 100,
      description: 'Master professional communication',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Learning & Development
              </h1>
              <p className="text-emerald-100 text-lg">
                Expand your skills and advance your career with personalized
                learning
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-12 h-12 text-white" />
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
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Your Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learningPaths.map((path, index) => (
            <div
              key={path.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {path.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{path.courses} courses</span>
                  <span>{path.progress}% complete</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${path.progress}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, skills, or topics..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const TypeIcon = getTypeIcon(course.type);
          return (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <TypeIcon className="w-12 h-12 text-white opacity-80" />
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getLevelColor(course.level)
                    )}
                  >
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
                {course.status === 'in-progress' && course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  {course.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="font-medium">{course.instructor}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {course.enrolled} enrolled
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {course.category}
                  </span>
                </div>

                {course.status === 'in-progress' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {course.status === 'not-started' && (
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Start Course
                    </button>
                  )}
                  {course.status === 'in-progress' && (
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Continue
                    </button>
                  )}
                  {course.status === 'completed' && (
                    <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      Review
                    </button>
                  )}
                  <button className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
