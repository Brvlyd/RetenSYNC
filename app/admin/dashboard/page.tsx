'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect non-admin users
      if (parsedUser.role !== 'admin') {
        router.push('/user/dashboard');
        return;
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

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

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

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
    </motion.div>
  );
}