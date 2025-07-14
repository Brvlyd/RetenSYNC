'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  TrendingUp,
  Award,
  Target,
  Calendar,
  Clock,
  Star,
  BookOpen,
  MessageSquare,
  CheckCircle,
  ArrowUpRight,
  Users,
  Zap,
  Brain,
  Trophy,
  Activity,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    title: 'Complete Assessment',
    description: 'Take your monthly self-assessment',
    icon: CheckCircle,
    href: '/user/self-assessment',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    urgent: true
  },
  {
    title: 'Schedule 1-on-1',
    description: 'Book time with your manager',
    icon: Calendar,
    href: '/user/1on1',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500'
  },
  {
    title: 'Learning Path',
    description: 'Continue your development',
    icon: BookOpen,
    href: '/user/learning',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    title: 'Give Feedback',
    description: 'Share insights with teammates',
    icon: MessageSquare,
    href: '/user/feedback',
    color: 'bg-gradient-to-r from-orange-500 to-red-500'
  }
];

const stats = [
  {
    title: 'Performance Score',
    value: '92%',
    change: '+5%',
    icon: TrendingUp,
    positive: true
  },
  {
    title: 'Goals Completed',
    value: '8/12',
    change: '+2 this month',
    icon: Target,
    positive: true
  },
  {
    title: 'Learning Hours',
    value: '24h',
    change: '+6h this week',
    icon: Brain,
    positive: true
  },
  {
    title: 'Team Recognition',
    value: '15',
    change: '+3 new',
    icon: Trophy,
    positive: true
  }
];

const recentActivities = [
  {
    title: 'Completed leadership assessment',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    title: 'Received feedback from Sarah',
    time: '1 day ago',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    title: 'Joined team meeting discussion',
    time: '2 days ago',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    title: 'Updated learning goals',
    time: '3 days ago',
    icon: Target,
    color: 'text-purple-500'
  }
];

const upcomingEvents = [
  {
    title: 'Quarterly Review with Manager',
    date: 'Tomorrow, 2:00 PM',
    type: 'meeting'
  },
  {
    title: 'Team Skills Workshop',
    date: 'Friday, 10:00 AM',
    type: 'training'
  },
  {
    title: 'Monthly Assessment Due',
    date: 'Next Monday',
    type: 'task'
  }
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {user?.first_name || 'there'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to make today productive? Let's check your progress.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={action.title}
              className="group cursor-pointer"
              onClick={() => window.location.href = action.href}
            >
              <div className={cn(
                "relative p-6 rounded-xl text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl",
                action.color
              )}>
                {action.urgent && (
                  <div className="absolute top-3 right-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                <action.icon className="w-8 h-8 mb-4" />
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90 mb-4">{action.description}</p>
                <ArrowUpRight className="w-5 h-5 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Your Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  stat.positive ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                  <stat.icon className={cn(
                    "w-6 h-6",
                    stat.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )} />
                </div>
                <div className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  stat.positive 
                    ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
                    : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                )}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {stat.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700",
                  activity.color.includes('green') && "bg-green-100 dark:bg-green-900/30",
                  activity.color.includes('yellow') && "bg-yellow-100 dark:bg-yellow-900/30",
                  activity.color.includes('blue') && "bg-blue-100 dark:bg-blue-900/30",
                  activity.color.includes('purple') && "bg-purple-100 dark:bg-purple-900/30"
                )}>
                  <activity.icon className={cn("w-4 h-4", activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  event.type === 'meeting' && "bg-blue-500",
                  event.type === 'training' && "bg-green-500",
                  event.type === 'task' && "bg-orange-500"
                )}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {event.date}
                  </p>
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}