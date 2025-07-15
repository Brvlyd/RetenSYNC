'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import {
  Bell,
  Sun,
  Moon,
  MessageSquare,
  Calendar,
  Settings,
  HelpCircle,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const getPageTitle = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment || lastSegment === 'user') return 'Dashboard';

  switch (lastSegment) {
  case 'dashboard':
    return 'Dashboard';
  case 'self-assessment':
    return 'Self Assessment';
  case 'Interactions':
    return 'Team Interactions';
  case 'learning':
    return 'Learning & Development';
  case 'performance-review':
    return 'Performance Review';
  case 'profile':
    return 'My Profile';
  case '1on1':
    return '1-on-1 Meetings';
  case 'feedback':
    return 'Feedback';
  case 'shoutouts':
    return 'Team Shoutouts';
  default:
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
};

const getPageDescription = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  switch (lastSegment) {
  case 'dashboard':
    return 'Welcome back! Here&apos;s your performance overview';
  case 'self-assessment':
    return 'Complete surveys and track your development';
  case 'Interactions':
    return 'Connect, collaborate, and communicate with your team';
  case 'learning':
    return 'Explore learning resources and skill development';
  case 'performance-review':
    return 'Review your goals and track progress';
  case 'profile':
    return 'Manage your personal information and preferences';
  case '1on1':
    return 'Schedule and manage one-on-one meetings';
  case 'feedback':
    return 'Share and receive constructive feedback';
  case 'shoutouts':
    return 'Recognize and celebrate team achievements';
  default:
    return 'Navigate your personalized workspace';
  }
};

export default function HeaderNew({
  onToggleSidebar,
  isSidebarCollapsed,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const pageTitle = getPageTitle(pathname || '');
  const pageDescription = getPageDescription(pathname || '');

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  // Mock time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Page Title */}
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {pageTitle}
              </h1>
              {pageTitle === 'Dashboard' && (
                <Sparkles className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getGreeting()}, {user?.first_name || 'there'}! {pageDescription}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* Search functionality removed to prevent header/sidebar collision */}
            {/* Messages */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            </button>

            {/* Calendar */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
                      'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Employee'}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-gray-400 transition-transform duration-200',
                    isProfileOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
                        'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'user@company.com'}
                    </p>
                  </div>

                  <div className="py-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
