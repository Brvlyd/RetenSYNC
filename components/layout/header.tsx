'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
  Palette,
  Command,
  Calendar,
  MessageSquare,
  TrendingUp,
  ChevronDown,
  Menu
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function Header() {
  const router = useRouter();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userData = {
    name: 'Tasya Salsabila',
    email: 'tasya.salsabila@company.com',
    role: 'Senior Developer',
    avatar: null
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    // Add logout logic here
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

  const quickActions = [
    { icon: Calendar, label: 'Schedule 1-on-1', action: () => router.push('/1on1') },
    { icon: MessageSquare, label: 'Give Feedback', action: () => router.push('/feedback') },
    { icon: TrendingUp, label: 'View Analytics', action: () => router.push('/analytics') }
  ];

  return (
    <header className="h-16 sm:h-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative z-30">
      {/* Left Section */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* System Status - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">System Online</span>
        </div>

        {/* Search Bar - Responsive */}
        <div className="relative hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none lg:block hidden">
            <kbd className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs font-mono text-gray-500 dark:text-gray-400">
              <Command className="h-3 w-3 mr-1" />
              K
            </kbd>
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

        {/* Quick Actions - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 group"
              title={action.label}
            >
              <action.icon className="h-5 w-5" />
            </motion.button>
          ))}
        </div>

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
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      notification.unread ? 'bg-blue-50/50' : ''
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

        {/* User Profile */}
        <div className="relative">
          <motion.button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="relative">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">
                  {getInitials(userData.name)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{userData.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{userData.role}</p>
            </div>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 hidden sm:block" />
          </motion.button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              {/* Profile Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">
                      {getInitials(userData.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{userData.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{userData.role}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {[
                  { icon: User, label: 'My Profile', action: () => router.push('/profile') },
                  { icon: Settings, label: 'Settings', action: () => router.push('/settings') },
                  { icon: HelpCircle, label: 'Help & Support', action: () => router.push('/help') }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Log out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isThemeOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsThemeOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </header>
  );
}
