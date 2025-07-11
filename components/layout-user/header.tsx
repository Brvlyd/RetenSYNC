'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Bell,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Palette,
  ChevronDown,
  User,
  Settings,
  Target,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function Header() {
  const router = useRouter();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    // Initial load
    updateUserData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        updateUserData();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleUserUpdate = () => {
      updateUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataUpdated', handleUserUpdate);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserUpdate);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, [currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
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
      title: 'New Performance Review',
      message: 'Your Q4 performance review is ready',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Goal Completed',
      message: 'You completed your learning goal',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Meeting Reminder',
      message: '1-on-1 with Manager in 30 minutes',
      time: '2 hours ago',
      unread: false
    }
  ];

  if (!user) return null;

  return (
    <header className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Greeting */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 rounded-xl overflow-hidden transition-transform group-hover:scale-110">
                  <Image
                    src="/assets/RetenSYNC.png"
                    alt="RetenSYNC Logo"
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Greeting and Time */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {greeting}, {user?.name?.split(' ')[0] || 'User'}!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(currentTime)} • {formatTime(currentTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Clean Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions - Simplified */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/user/goals"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Target className="w-4 h-4" />
                <span>Goals</span>
              </Link>
              
              <Link
                href="/user/feedback"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Feedback</span>
              </Link>
            </div>

            {/* Theme Toggle - Simplified */}
            <div className="relative">
              <motion.button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300"
              >
                {getThemeIcon()}
              </motion.button>

              {/* Theme Dropdown */}
              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
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
                          setTheme(themeOption.value as Theme);
                          setIsThemeOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center px-4 py-2 text-sm transition-colors",
                          theme === themeOption.value
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        <themeOption.icon className="h-4 w-4 mr-3" />
                        {themeOption.label}
                        {theme === themeOption.value && (
                          <CheckCircle className="h-4 w-4 ml-auto text-blue-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300"
              >
                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {getInitials(user?.name || 'User')}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-blue-100">
                    {user?.role || 'Employee'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/80" />
              </motion.button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {getInitials(user?.name || 'User')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/user/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        href="/user/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="lg:hidden px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {greeting}, {user?.name?.split(' ')[0] || 'User'}!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(currentTime)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/user/goals"
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Target className="w-4 h-4" />
              </Link>
              <Link
                href="/user/feedback"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isThemeOpen || isNotificationOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsThemeOpen(false);
            setIsNotificationOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
}
