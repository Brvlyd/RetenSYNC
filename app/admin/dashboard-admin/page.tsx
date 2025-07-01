'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Award, BarChart3, UserPlus, Settings,
  MessageSquare, Calendar, Clock, Star, Activity, Zap,
  BookOpen, Heart, Target, Coffee
} from 'lucide-react';
import WelcomeCard from '@/components/ui/welcome-card';
import QuickActionCard from '@/components/ui/quick-action-card';
import StatCard from '@/components/ui/stat-card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const organizationStats = {
    totalEmployees: 247,
    turnoverReduction: 23,
    avgSatisfaction: 4.2,
    activeProjects: 18
  };

  const userStats = {
    tasksCompleted: 12,
    performanceScore: 94,
    upcomingMeetings: 3
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
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
              onClick={() => window.location.href = '/users'}
            />
            <QuickActionCard
              title="View Reports"
              description="Access detailed analytics and insights"
              icon={BarChart3}
              gradient="from-emerald-500 to-teal-500"
              bgGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
              onClick={() => window.location.href = '/analytics'}
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

  // Employee Dashboard - More Personal and Friendly
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

      {/* Quick Actions - More Personal */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Coffee className="w-6 h-6 mr-2 text-orange-500" />
          What would you like to do today?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <QuickActionCard
            title="My Performance"
            description="View feedback and track your progress"
            icon={Award}
            gradient="from-emerald-500 to-teal-500"
            bgGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
            onClick={() => window.location.href = '/performance-review'}
          />
          <QuickActionCard
            title="Give Feedback"
            description="Share your thoughts and help improve our workplace"
            icon={MessageSquare}
            gradient="from-purple-500 to-pink-500"
            bgGradient="from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
            onClick={() => window.location.href = '/feedback'}
            badge="3"
          />
          <QuickActionCard
            title="Learning Hub"
            description="Explore new courses and develop your skills"
            icon={BookOpen}
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
            onClick={() => window.location.href = '/learning'}
            isNew
          />
          <QuickActionCard
            title="HR Connect"
            description="Schedule 1-on-1s and connect with HR"
            icon={Heart}
            gradient="from-pink-500 to-rose-500"
            bgGradient="from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30"
            onClick={() => window.location.href = '/hr-interactions'}
          />
          <QuickActionCard
            title="My Goals"
            description="Track your objectives and milestones"
            icon={Target}
            gradient="from-blue-500 to-indigo-500"
            bgGradient="from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30"
            onClick={() => window.location.href = '/goals'}
          />
          <QuickActionCard
            title="My Profile"
            description="Update your information and preferences"
            icon={Users}
            gradient="from-cyan-500 to-blue-500"
            bgGradient="from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30"
            onClick={() => window.location.href = '/profile'}
          />
        </div>
      </motion.div>

      {/* Personal Insights */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Star className="w-6 h-6 mr-2 text-yellow-500" />
          Your Performance at a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Tasks Completed"
            value={userStats.tasksCompleted}
            change="↑ 3 this week"
            changeType="positive"
            icon={<Target className="w-6 h-6 text-emerald-500" />}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-700"
          />
          <StatCard
            title="Performance Score"
            value={`${userStats.performanceScore}%`}
            change="↑ 5% from last month"
            changeType="positive"
            icon={<Award className="w-6 h-6 text-blue-500" />}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-700"
          />
          <StatCard
            title="Upcoming Meetings"
            value={userStats.upcomingMeetings}
            change="Next: 2:00 PM Today"
            changeType="neutral"
            icon={<Calendar className="w-6 h-6 text-purple-500" />}
            className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-700"
          />
          <StatCard
            title="Learning Progress"
            value="85%"
            change="2 courses in progress"
            changeType="positive"
            icon={<BookOpen className="w-6 h-6 text-green-500" />}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700"
          />
        </div>
      </motion.div>

      {/* Recent Activity and Upcoming */}
      <motion.div variants={item}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Completed project milestone', time: '2 hours ago', type: 'success' },
                { action: 'Received feedback from manager', time: '1 day ago', type: 'info' },
                { action: 'Started new learning course', time: '2 days ago', type: 'success' },
                { action: 'Attended team meeting', time: '3 days ago', type: 'info' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Calendar className="w-5 h-5 text-white" />
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
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.status === 'completed' ? 'bg-green-500' :
                      event.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.time}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
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
  );
}