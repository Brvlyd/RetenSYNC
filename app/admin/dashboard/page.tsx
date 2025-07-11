'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Award, BarChart3, UserPlus, Settings,
  MessageSquare, Calendar, Clock, Star, Activity, Zap,
  BookOpen, Heart, Target, Coffee, ClipboardList
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

export default function AdminDashboardPage() {
  const organizationStats = {
    totalEmployees: 247,
    turnoverReduction: 23,
    avgSatisfaction: 4.2,
    activeProjects: 18
  };

  const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';

  return (
    <>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className={`space-y-6 sm:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
      >
        {/* Modern Header - Responsive with Floating Elements Animation */}
        <motion.div variants={item}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white overflow-hidden relative"
          >
            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-4 left-8 w-12 h-12 bg-white/10 rounded-lg rotate-45"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [45, 135, 45]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-16 right-12 w-8 h-8 bg-white/15 rounded-full"
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div 
                className="absolute bottom-8 left-16 w-6 h-6 bg-white/20 rounded-full"
                animate={{ 
                  y: [0, -8, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div 
                className="absolute bottom-4 right-8 w-10 h-10 bg-white/10 rounded-lg"
                animate={{ 
                  rotate: [0, 180, 360],
                  scale: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10"
            >
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
              >
                Admin Dashboard
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-orange-100 text-sm sm:text-base lg:text-lg"
              >
                Organization overview and quick actions
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Modern Quick Actions */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 mr-2 sm:mr-3 shadow-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </span>
              Quick Actions
            </h2>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <QuickActionCard
              title="Manage Users"
              description="Add, edit, or remove employee accounts"
              icon={UserPlus}
              gradient="from-blue-500 to-cyan-500"
              bgGradient="from-blue-50/80 to-cyan-50/80 dark:from-blue-900/40 dark:to-cyan-900/40 backdrop-blur-sm"
              onClick={() => window.location.href = '/admin/users'}
            />
            <QuickActionCard
              title="Departments & Positions"
              description="Manage departments and job roles"
              icon={Users}
              gradient="from-purple-500 to-violet-500"
              bgGradient="from-purple-50/80 to-violet-50/80 dark:from-purple-900/40 dark:to-violet-900/40 backdrop-blur-sm"
              onClick={() => window.location.href = '/admin/departments'}
            />
            <QuickActionCard
              title="Analytics & Reports"
              description="View advanced analytics and insights"
              icon={BarChart3}
              gradient="from-emerald-500 to-teal-500"
              bgGradient="from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/40 dark:to-teal-900/40 backdrop-blur-sm"
              onClick={() => window.location.href = '/admin/analytics'}
            />
            <QuickActionCard
              title="Performance Reviews"
              description="Oversee employee performance reviews"
              icon={ClipboardList}
              gradient="from-indigo-500 to-purple-500"
              bgGradient="from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/40 dark:to-purple-900/40 backdrop-blur-sm"
              onClick={() => window.location.href = '/admin/performance-review'}
            />
            <QuickActionCard
              title="Goals"
              description="Track and manage organizational goals"
              icon={Target}
              gradient="from-blue-500 to-indigo-500"
              bgGradient="from-blue-50/80 to-indigo-50/80 dark:from-blue-900/40 dark:to-indigo-900/40 backdrop-blur-sm"
              onClick={() => window.location.href = '/admin/goals'}
            />
            <QuickActionCard
              title="HR Interactions"
              description="Schedule 1-on-1s and connect with HR"
              icon={Heart}
              gradient="from-pink-500 to-rose-500"
              bgGradient="from-pink-50/80 to-rose-50/80 dark:from-pink-900/40 dark:to-rose-900/40 backdrop-blur-sm"
              onClick={() => window.location.href = '/admin/hr-interactions'}
            />
          </div>
        </motion.div>

        {/* Modern Key Metrics */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-2 sm:mr-3 shadow-lg">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </span>
              Organization Overview
            </h2>
            <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Last updated: 2 min ago
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Employees"
              value={organizationStats.totalEmployees}
              change="↑ 12 new hires this month"
              changeType="positive"
              icon={<Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
              className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-900/80 dark:to-cyan-900/80 border-blue-200/50 dark:border-blue-700/50 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <StatCard
              title="Turnover Reduction"
              value={`${organizationStats.turnoverReduction}%`}
              change="↓ 12% from last quarter"
              changeType="positive"
              icon={<TrendingUp className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />}
              className="bg-gradient-to-br from-emerald-50/90 to-teal-50/90 dark:from-emerald-900/80 dark:to-teal-900/80 border-emerald-200/50 dark:border-emerald-700/50 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <StatCard
              title="Avg Satisfaction"
              value={`${organizationStats.avgSatisfaction}/5`}
              change="↑ 0.3 from last month"
              changeType="positive"
              icon={<Star className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />}
              className="bg-gradient-to-br from-yellow-50/90 to-orange-50/90 dark:from-yellow-900/80 dark:to-orange-900/80 border-yellow-200/50 dark:border-yellow-700/50 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <StatCard
              title="Active Projects"
              value={organizationStats.activeProjects}
              change="3 completed this week"
              changeType="positive"
              icon={<Activity className="w-6 h-6 text-purple-500 dark:text-purple-400" />}
              className="bg-gradient-to-br from-purple-50/90 to-violet-50/90 dark:from-purple-900/80 dark:to-violet-900/80 border-purple-200/50 dark:border-purple-700/50 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Modern Charts Section */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 mr-2 sm:mr-3 shadow-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </span>
              Organization Trends
            </h2>
            <div className="hidden sm:flex items-center space-x-4">
              <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Modern Employee Growth Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Employee Growth</h3>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">+12% YoY</span>
              </div>
              <div className="h-48 sm:h-64 lg:h-48">
                <EmployeeGrowthChart />
              </div>
            </div>
            {/* Modern Satisfaction Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Satisfaction Overview</h3>
                <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">4.2/5 Avg</span>
              </div>
              <div className="h-48 sm:h-64 lg:h-48">
                <SatisfactionPieChart />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// Chart.js components for real charts
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function EmployeeGrowthChart() {
  const data = {
    labels: [
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'
    ],
    datasets: [
      {
        label: 'Employees',
        data: [210, 215, 220, 225, 230, 235, 238, 240, 242, 245, 246, 247],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: false, ticks: { color: '#64748b' } },
      x: { ticks: { color: '#64748b' } },
    },
  };
  return <Line data={data} options={options} height={window.innerWidth < 640 ? 120 : 192} />;
}

function SatisfactionPieChart() {
  const data = {
    labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied'],
    datasets: [
      {
        data: [48, 32, 15, 5],
        backgroundColor: [
          '#f59e42', // orange
          '#3b82f6', // blue
          '#a3a3a3', // gray
          '#ef4444', // red
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#64748b', font: { size: 14 } },
      },
      title: { display: false },
    },
  };
  return <Pie data={data} options={options} height={window.innerWidth < 640 ? 40 : 60} />;
}

