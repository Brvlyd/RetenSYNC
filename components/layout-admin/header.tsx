'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import {
  Bell,
  LogOut,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Menu,
  User,
  Settings,
  Shield,
  Activity,
  Users,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function AdminHeader({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleNotificationClick = (type: 'meetings' | 'feedback') => {
    setIsNotificationMenuOpen(false);
    if (type === 'meetings') {
      router.push('/admin/1on1');
    } else {
      router.push('/admin/feedback');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 h-16 flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Admin Badge */}
        <div className="hidden sm:flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Admin Panel</span>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>127 Users</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Theme Toggle */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center space-x-1"
          >
            {getThemeIcon()}
            <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400 hidden sm:block" />
          </motion.button>

          {isThemeMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              <button
                onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </button>
              <button
                onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </button>
              <button
                onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>

          {isNotificationMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              {/* Notification Header */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Navigate to important sections</p>
              </div>

              {/* Notification Items */}
              <div className="py-1">
                <button
                  onClick={() => handleNotificationClick('meetings')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">1-on-1 Meetings</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage employee meetings</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleNotificationClick('feedback')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Feedback Reviews</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Review employee feedback</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                {user ? user.first_name : 'Admin'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400 hidden sm:block" />
          </motion.button>

          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'admin@company.com'}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Shield className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
