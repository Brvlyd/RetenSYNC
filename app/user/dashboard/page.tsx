'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Award, BarChart3, UserPlus, Settings,
  MessageSquare, Calendar, Clock, Star, Activity, Zap,
  BookOpen, Heart, Target, Coffee, Bell, ChevronRight,
  Sparkles, Sun, Moon, Cloud, Briefcase, CheckCircle,
  User, Globe
} from 'lucide-react';
import WelcomeCard from '@/components/ui/welcome-card';
import QuickActionCard from '@/components/ui/quick-action-card';
import StatCard from '@/components/ui/stat-card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const slideIn = {
  hidden: { x: -100, opacity: 0 },
  show: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  }
};

export default function UserDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect admin users
      if (parsedUser.role === 'user') {
        router.push('/user/dashboard');
        return;
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const userStats = {
    tasksCompleted: 12,
    performanceScore: 94,
    upcomingMeetings: 3
  };

  // Dummy organization stats for demonstration
  const organizationStats = {
    totalEmployees: 120,
    turnoverReduction: 12,
    avgSatisfaction: 4.5,
    activeProjects: 8
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }


  // User Dashboard
  if (user?.role === 'user') {
    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 p-6"
      >
        {/* Welcome Section */}
        <motion.div variants={item}>
          <WelcomeCard 
            user={user} 
            stats={userStats}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <QuickActionCard
              title="Manage Users"
              description="Add, edit, or remove employee accounts"
              icon={UserPlus}
              gradient="from-blue-500 to-cyan-500"
              bgGradient="from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30"
              onClick={() => window.location.href = '/admin/users'}
            />
            <QuickActionCard
              title="View Reports"
              description="Access detailed analytics and insights"
              icon={BarChart3}
              gradient="from-emerald-500 to-teal-500"
              bgGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
              onClick={() => window.location.href = '/admin/analytics'}
            />
            <QuickActionCard
              title="System Settings"
              description="Configure platform preferences"
              icon={Settings}
              gradient="from-purple-500 to-violet-500"
              bgGradient="from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30"
              onClick={() => window.location.href = '/settings'}
            />
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={item}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-500" />
            Organization Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Total Employees"
              value={organizationStats.totalEmployees}
              change="↑ 12 new hires this month"
              changeType="positive"
              icon={<Users className="w-6 h-6 text-blue-500" />}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-700"
            />
            <StatCard
              title="Turnover Reduction"
              value={`${organizationStats.turnoverReduction}%`}
              change="↓ 12% from last quarter"
              changeType="positive"
              icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-700"
            />
            <StatCard
              title="Avg Satisfaction"
              value={`${organizationStats.avgSatisfaction}/5`}
              change="↑ 0.3 from last month"
              changeType="positive"
              icon={<Star className="w-6 h-6 text-yellow-500" />}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-700"
            />
            <StatCard
              title="Active Projects"
              value={organizationStats.activeProjects}
              change="3 completed this week"
              changeType="positive"
              icon={<Activity className="w-6 h-6 text-purple-500" />}
              className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-700"
            />
          </div>
        </motion.div>

        {/* Charts and Analytics would go here */}
      </motion.div>
    );
  }

  // Employee Dashboard - Fresh, Modern, and User-Friendly
  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 space-y-8 p-6 max-w-7xl mx-auto"
      >
        {/* Modern Header Section */}
        <motion.div variants={item} className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Welcome back, {user.name}!
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4"
          >
            Your Workspace
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Track your progress, connect with your team, and grow your skills in one beautiful place.
          </motion.p>
        </motion.div>

        {/* Enhanced Welcome Card */}
        <motion.div variants={item}>
          <WelcomeCard 
            user={user} 
            stats={userStats}
          />
        </motion.div>

        {/* Today's Focus - New Section */}
        <motion.div variants={item}>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Focus</h2>
                <p className="text-slate-600 dark:text-slate-300">Let's make today productive!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Complete Tasks</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">{userStats.tasksCompleted}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">tasks completed today</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Meetings</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{userStats.upcomingMeetings}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">scheduled today</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-pink-200 dark:border-pink-700">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-pink-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Performance</span>
                  </div>
                  <p className="text-3xl font-bold text-pink-600 mb-2">{userStats.performanceScore}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">this month</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Redesigned */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              <p className="text-slate-600 dark:text-slate-300">Everything you need, just one click away</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-xl cursor-pointer"
                   onClick={() => window.location.href = '/user/performance-review'}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Hub</h3>
                    <p className="text-slate-600 dark:text-slate-300">Track your growth</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  View feedback, set goals, and monitor your professional development
                </p>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-xl cursor-pointer"
                   onClick={() => window.location.href = '/user/learning'}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Learning Center</h3>
                    <p className="text-slate-600 dark:text-slate-300">Expand your skills</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Access courses, tutorials, and resources to boost your expertise
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span>Start Learning</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    New!
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-xl cursor-pointer"
                   onClick={() => window.location.href = '/user/feedback'}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Feedback Hub</h3>
                    <p className="text-slate-600 dark:text-slate-300">Share your voice</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Give feedback, make suggestions, and help shape our workplace
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                    <span>Give Feedback</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                    3 pending
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-xl cursor-pointer"
                   onClick={() => window.location.href = '/user/Interactions'}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">HR Connect</h3>
                    <p className="text-slate-600 dark:text-slate-300">Get support</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Schedule meetings, get assistance, and connect with HR team
                </p>
                <div className="flex items-center text-rose-600 dark:text-rose-400 font-medium">
                  <span>Connect Now</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-xl cursor-pointer"
                   onClick={() => window.location.href = '/user/goals'}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Goal Tracker</h3>
                    <p className="text-slate-600 dark:text-slate-300">Achieve more</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Set objectives, track progress, and celebrate your achievements
                </p>
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                  <span>View Goals</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-xl cursor-pointer"
                   onClick={() => window.location.href = '/user/profile'}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h3>
                    <p className="text-slate-600 dark:text-slate-300">Personal space</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Update your information, preferences, and account settings
                </p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>Edit Profile</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Performance Insights - Redesigned */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Insights</h2>
              <p className="text-slate-600 dark:text-slate-300">Your progress at a glance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tasks Done</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">This week</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{userStats.tasksCompleted}</span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">+3</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Monthly score</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userStats.performanceScore}%</span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">+5%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${userStats.performanceScore}%` }} />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meetings</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Today</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{userStats.upcomingMeetings}</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">scheduled</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Next: 2:00 PM Today
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Learning</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Progress</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">85%</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Activity and Schedule */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Your latest achievements</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { action: 'Completed project milestone', time: '2 hours ago', type: 'success', icon: CheckCircle },
                  { action: 'Received feedback from manager', time: '1 day ago', type: 'info', icon: MessageSquare },
                  { action: 'Started new learning course', time: '2 days ago', type: 'success', icon: BookOpen },
                  { action: 'Attended team meeting', time: '3 days ago', type: 'info', icon: Users }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'success' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Your upcoming events</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: 'Daily Standup', time: '9:00 AM', status: 'completed' },
                  { title: 'Project Review', time: '2:00 PM', status: 'upcoming' },
                  { title: '1-on-1 with Manager', time: '4:00 PM', status: 'upcoming' },
                  { title: 'Team Social Hour', time: '5:30 PM', status: 'optional' }
                ].map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        event.status === 'completed' ? 'bg-green-500' :
                        event.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {event.time}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      event.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}