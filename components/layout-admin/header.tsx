'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import Image from 'next/image';
import {
  Bell,
  Search,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Palette,
  Command,
  ChevronDown,
  Menu,
  User
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function Header() {
  const router = useRouter();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'New Performance Review',
      message: 'Your Q4 performance review is ready',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Goal Completed',
      message: 'You completed your learning goal',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Meeting Reminder',
      message: '1-on-1 with Dzikri in 30 minutes',
      time: '2 hours ago',
      unread: false
    }
  ];

  if (!user) return null;

  return (
    <header className="sticky top-0 h-16 sm:h-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-50">
      {/* Left Section - System Status */}
      <div className="flex items-center space-x-6">
        {/* System Status */}
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">System Online</span>
        </div>
        
        {/* Quick Stats - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Active Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">96%</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="sm:hidden h-8 w-8 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300"
        >
          <Search className="h-4 w-4" />
        </motion.button>

        {/* Theme Toggle */}
        <div className="relative">
          <motion.button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300"
          >
            {getThemeIcon()}
          </motion.button>

          {/* Theme Dropdown */}
          {isThemeOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </div>
              </div>
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor }
              ].map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value as 'light' | 'dark' | 'system');
                    setIsThemeOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                    theme === themeOption.value 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <themeOption.icon className="h-4 w-4 mr-3" />
                  {themeOption.label}
                  {theme === themeOption.value && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Mark all read
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-emerald-500' :
                        notification.type === 'warning' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* User Profile - Compact Admin Design */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#94c47d] to-[#d96f27] shadow-lg">
          <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-white/20">
            <User className="h-4 w-4 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="truncate text-sm font-semibold text-white leading-tight">{user.name}</span>
            <span className="truncate text-xs font-medium text-white/80 leading-tight">Administrator</span>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isThemeOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsThemeOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </header>
  );
}