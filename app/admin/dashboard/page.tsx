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
  // Admin dashboard only, no user-based dashboard
  const organizationStats = {
    totalEmployees: 247,
    turnoverReduction: 23,
    avgSatisfaction: 4.2,
    activeProjects: 18
  };

  return (
    <>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Modern Quick Actions */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 mr-3 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </span>
              Quick Actions
            </h2>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mr-3 shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </span>
              Organization Overview
            </h2>
            <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Last updated: 2 min ago
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 mr-3 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Modern Employee Growth Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Employee Growth</h3>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">+12% YoY</span>
              </div>
              <EmployeeGrowthChart />
            </div>
            {/* Modern Satisfaction Chart */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Satisfaction Overview</h3>
                <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">4.2/5 Avg</span>
              </div>
              <SatisfactionPieChart />
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
  return <Line data={data} options={options} height={192} />;
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
  return <Pie data={data} options={options} height={60} />;
}

