'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, Variants, Transition } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import {
  BarChart3,
  MessageSquare,
  Users,
  BookOpen,
  TrendingUp,
  ClipboardList,
  Menu,
  X,
  LogOut,
  Sparkles,
  Building,
  User,
  UserPlus,
  Heart,
  Award,
  Calendar,
  FileText
} from 'lucide-react';

export default function Sidebar({ onCollapseChange }: { onCollapseChange?: (collapsed: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Define navigation item type to include optional isParent and isChild
  type NavigationItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    color: string;
    isParent?: boolean;
    isChild?: boolean;
  };
  
  // Base navigation items
  const baseNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/user/dashboard', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { name: 'Performance Review', href: '/user/performance-review', icon: ClipboardList, color: 'from-indigo-500 to-purple-500' },
    { name: 'Self Assessment', href: '/user/self-assessment', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { name: 'Learning', href: '/user/learning', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
  ];
  
  // Admin-only navigation items
  const adminNavigation: NavigationItem[] = [
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
    { name: 'User Management', href: '/admin/users', icon: UserPlus, color: 'from-blue-500 to-indigo-500' },
    { name: 'Departments', href: '/admin/departments', icon: Building, color: 'from-purple-500 to-violet-500' },
  ];
  
  // HR Interactions section (updated to use correct paths)
  const hrInteractions: NavigationItem[] = [
    { name: 'HR Interactions', href: '/user/Interactions', icon: Heart, color: 'from-pink-500 to-rose-500', isParent: true },
    { name: 'Peer Recognition', href: '/user/shoutouts', icon: Award, color: 'from-amber-500 to-orange-500', isChild: true },
    { name: '1-on-1 Meetings', href: '/user/1on1', icon: Calendar, color: 'from-blue-500 to-cyan-500', isChild: true },
    { name: 'Feedback', href: '/user/feedback', icon: MessageSquare, color: 'from-emerald-500 to-teal-500', isChild: true },
  ];
  
  // User-only navigation items
  const userNavigation: NavigationItem[] = [
    { name: 'My Profile', href: '/user/profile', icon: User, color: 'from-emerald-500 to-teal-500' },
  ];

  // Combine navigation based on user role
  const navigation = [
    ...baseNavigation,
    ...(user?.role === 'admin' ? adminNavigation : []),
    ...hrInteractions,
    ...(user?.role !== 'admin' ? userNavigation : [])
  ];

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

  const sidebarVariants: Variants = {
    expanded: {
      width: "18rem",
      transition: { 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] as const
      } as Transition
    },
    collapsed: {
      width: "5rem",
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
          "fixed left-0 top-0 h-screen overflow-hidden z-30 shadow-2xl lg:translate-x-0 flex flex-col",
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
        <div className="h-20 flex items-center px-6 pt-4 pb-4 border-b border-gray-200/60 dark:border-gray-700/60 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="relative">
                <div className="rounded-xl w-12 h-12 overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                  <Image
                    src="/assets/Logo.png"
                    alt="RetenSYNC Logo"
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <motion.div
                variants={textVariants}
                className="ml-4"
              >
                <h1 className="font-bold text-xl text-gray-900 dark:text-white">RetenSYNC</h1>
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

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            const isParentActive = item.isParent && hrInteractions.some(child => child.isChild && pathname === child.href);
            
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
                    "flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                    item.isChild ? "ml-4 py-2" : "",
                    isActive || isParentActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  {/* Active indicator */}
                  {(isActive || isParentActive) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon - centered when collapsed */}
                  <div className="relative flex-shrink-0">
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      item.isChild ? "w-4 h-4" : "",
                      isActive || isParentActive
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
                    {hoveredItem === item.name && !isActive && !isParentActive && (
                      <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 animate-pulse" />
                    )}
                  </div>
                  
                  <motion.span
                    variants={textVariants}
                    className={cn(
                      "ml-4 font-semibold text-sm",
                      item.isChild ? "text-xs" : ""
                    )}
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
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}