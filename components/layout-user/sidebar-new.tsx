'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  TrendingUp,
  User,
  LogOut,
  Home,
  Target,
  Star,
  Award,
  Users,
  Settings,
  Bell,
  Calendar,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/user/dashboard',
    icon: LayoutDashboard,
    description: 'Your personal overview',
  },
  {
    name: 'Self Assessment',
    href: '/user/self-assessment',
    icon: ClipboardCheck,
    description: 'Complete surveys and assessments',
  },
  {
    name: 'Interactions',
    href: '/user/Interactions',
    icon: MessageSquare,
    description: 'Connect and collaborate',
  },
  {
    name: 'Learning',
    href: '/user/learning',
    icon: BookOpen,
    description: 'Grow your skills',
  },
  {
    name: 'Performance Review',
    href: '/user/performance-review',
    icon: TrendingUp,
    description: 'Track your progress',
  },
  {
    name: 'Profile',
    href: '/user/profile',
    icon: User,
    description: 'Manage your account',
  },
];

const quickActions = [
  {
    name: '1-on-1 Meetings',
    href: '/user/1on1',
    icon: Calendar,
    description: 'Schedule meetings',
  },
  {
    name: 'Feedback',
    href: '/user/feedback',
    icon: Star,
    description: 'Give and receive feedback',
  },
  {
    name: 'Shoutouts',
    href: '/user/shoutouts',
    icon: Award,
    description: 'Recognize teammates',
  },
];

export default function SidebarNew() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-full bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ease-in-out z-20 flex flex-col',
        'w-72', // Always use full width
        'shadow-xl shadow-black/5 dark:shadow-black/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/assets/Logo.png"
              alt="RetenSYNC Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RetenSYNC
            </h1>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 transition-all duration-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
                'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@company.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map(item => {
            const active = isActive(item.href);
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative',
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors duration-200',
                    active
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  )}
                />
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p
                    className={cn(
                      'text-xs truncate',
                      active
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Active indicator */}
                {active && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-1">
            {quickActions.map(item => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group',
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
