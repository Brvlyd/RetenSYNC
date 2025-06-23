'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, Variants, Transition } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import {
  BarChart3,
  MessageSquare,
  Users,
  BookOpen,
  TrendingUp,
  ClipboardList,
  Menu,
  X,
  Brain,
  LogOut,
  Sparkles,
  Building,
  User,
  UserPlus,
  Heart
} from 'lucide-react';

export default function Sidebar({ onCollapseChange }: { onCollapseChange?: (collapsed: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Navigation items for all users
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare, color: 'from-emerald-500 to-teal-500' },
    { name: 'Performance Review', href: '/performance-review', icon: ClipboardList, color: 'from-indigo-500 to-purple-500' },
    { name: 'HR Interactions', href: '/hr-interactions', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { name: 'Learning', href: '/learning', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
    { name: 'My Profile', href: '/profile', icon: User, color: 'from-emerald-500 to-teal-500' },
  ];

  // Additional navigation for admin
  const adminNavigation = [
    { name: 'Departments', href: '/departments', icon: Building, color: 'from-purple-500 to-violet-500' },
    { name: 'User Management', href: '/users', icon: UserPlus, color: 'from-blue-500 to-indigo-500' }
  ];

  // Navigation with admin section if admin
  const navigation = user?.role === 'admin'
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    onCollapseChange?.(!isSidebarExpanded);
  }, [isSidebarExpanded, onCollapseChange]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleBurgerClick = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Set collapsed width to 6rem, keep expanded at 18rem
  const sidebarVariants: Variants = {
    expanded: {
      width: "18rem",
      transition: { 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] as const
      } as Transition
    },
    collapsed: {
      width: "6rem",
      transition: { 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] as const
      } as Transition
    }
  };

  const textVariants: Variants = {
    expanded: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.15, duration: 0.3 } as Transition
    },
    collapsed: {
      opacity: 0,
      x: -15,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2 } as Transition
    }
  };

  // Only show user info section for non-admin users
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Enhanced Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="group p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:scale-105"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Modern Sidebar with Glassmorphism - Fixed Position */}
      <motion.div 
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 h-screen overflow-hidden z-40 shadow-2xl lg:translate-x-0 flex flex-col",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200/60 dark:border-gray-700/60 transition-colors duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        initial="collapsed"
        animate={isSidebarExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        // Expand sidebar on hover for desktop
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Modern Logo Section with Burger Menu */}
        <div className="h-24 flex items-center px-6 pt-4 pb-4 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="relative">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 flex items-center justify-center overflow-hidden shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <motion.div
                variants={textVariants}
                className="ml-4"
              >
                <h1 className="font-bold text-xl text-gray-900 dark:text-white">Smart-en</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Performance Platform</p>
              </motion.div>
            </div>
            {/* Burger Menu Button - Only visible on desktop when sidebar is expanded */}
            <motion.button
              variants={textVariants}
              onClick={handleBurgerClick}
              className="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* User Info Section - only show if not admin */}
        {!isAdmin && (
          <motion.div
            variants={textVariants}
            className="px-4 py-4 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.position || 'Employee'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-3">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center px-4 py-4 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon - centered when collapsed */}
                  <div className="relative flex-shrink-0">
                    <item.icon className={cn(
                      "w-6 h-6 transition-colors duration-300",
                      isActive 
                        ? "text-blue-600 dark:text-blue-400" 
                        : `${item.color.includes('blue') ? 'text-blue-600 dark:text-blue-400' : 
                            item.color.includes('emerald') ? 'text-emerald-600 dark:text-emerald-400' :
                            item.color.includes('indigo') ? 'text-indigo-600 dark:text-indigo-400' :
                            item.color.includes('violet') ? 'text-violet-600 dark:text-violet-400' :
                            item.color.includes('pink') ? 'text-pink-600 dark:text-pink-400' :
                            item.color.includes('amber') ? 'text-amber-600 dark:text-amber-400' :
                            item.color.includes('green') ? 'text-green-600 dark:text-green-400' :
                            item.color.includes('purple') ? 'text-purple-600 dark:text-purple-400' :
                            'text-red-600 dark:text-red-400'} group-hover:text-blue-600 dark:group-hover:text-blue-400`
                    )} />
                    
                    {/* Sparkle effect on hover */}
                    {hoveredItem === item.name && !isActive && (
                      <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
                    )}
                  </div>
                  
                  <motion.span
                    variants={textVariants}
                    className="ml-4 font-semibold text-sm"
                  >
                    {item.name}
                  </motion.span>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-gray-700/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced User Profile Section - Logout button */}
        <div className="p-4 mb-6 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-4 rounded-xl text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group relative overflow-hidden"
            >
              <LogOut className="w-6 h-6 transition-transform group-hover:-translate-x-1 flex-shrink-0" />
              <motion.span
                variants={textVariants}
                className="ml-4 font-semibold text-sm"
              >
                Logout
              </motion.span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/50 dark:via-red-900/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}