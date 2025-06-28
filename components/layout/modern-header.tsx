'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Bell, Settings, User, Moon, Sun, 
  MessageCircle, Calendar, HelpCircle, Zap, Shield, Crown
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface ModernHeaderProps {
  isSidebarExpanded: boolean;
}

export default function ModernHeader({ isSidebarExpanded }: ModernHeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Crown,
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          textColor: 'text-purple-700 dark:text-purple-400',
          iconColor: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return {
          label: 'Employee',
          icon: User,
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          iconColor: 'text-emerald-600 dark:text-emerald-400'
        };
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-20 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-white/20 dark:border-slate-700/20 transition-all duration-300 ${
        isSidebarExpanded ? 'lg:ml-72' : 'lg:ml-20'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* System Status */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:block relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-300 text-sm"
              />
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-600 p-4"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search suggestions will appear here...
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Quick Actions"
            >
              <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              >
                {notifications}
              </motion.span>
            )}
          </motion.button>

          {/* Messages */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* User Profile with Role */}
          {user && (
            <div className="flex items-center space-x-3">
              {/* User Info and Role */}
              <div className="hidden md:flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  {/* Role Badge in Header */}
                  {user.role && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        getRoleConfig(user.role).bgColor
                      } ${getRoleConfig(user.role).textColor}`}
                    >
                      {React.createElement(getRoleConfig(user.role).icon, {
                        className: `w-3 h-3 ${getRoleConfig(user.role).iconColor}`
                      })}
                      <span>{getRoleConfig(user.role).label}</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>

              {/* Mobile Role Badge */}
              <div className="md:hidden">
                {user.role && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
                      getRoleConfig(user.role).bgColor
                    } ${getRoleConfig(user.role).textColor}`}
                  >
                    {React.createElement(getRoleConfig(user.role).icon, {
                      className: `w-3 h-3 ${getRoleConfig(user.role).iconColor}`
                    })}
                    <span className="sr-only md:not-sr-only">{getRoleConfig(user.role).label}</span>
                  </motion.div>
                )}
              </div>
              
              {/* Profile Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900" />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}