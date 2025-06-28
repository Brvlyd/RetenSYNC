'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Home, Users, BarChart3, MessageSquare, ClipboardList, 
  Heart, BookOpen, UserPlus, Building, User, Settings, 
  LogOut, Menu, X, Bell, Search, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  color: string;
  badge?: number;
  isNew?: boolean;
}

export default function ModernSidebar({ 
  isSidebarExpanded, 
  setIsSidebarExpanded, 
  onCollapseChange 
}: ModernSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Navigation items based on user role
  const baseNavigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare, color: 'from-emerald-500 to-teal-500', badge: 3 },
    { name: 'Performance', href: '/performance-review', icon: ClipboardList, color: 'from-indigo-500 to-purple-500' },
    { name: 'HR Connect', href: '/hr-interactions', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { name: 'Learning', href: '/learning', icon: BookOpen, color: 'from-green-500 to-emerald-500', isNew: true },
  ];

  const adminNavigation: NavItem[] = [
    { name: 'Users', href: '/users', icon: UserPlus, color: 'from-blue-500 to-indigo-500' },
    { name: 'Departments', href: '/departments', icon: Building, color: 'from-purple-500 to-violet-500' },
  ];

  const userNavigation: NavItem[] = [
    { name: 'My Profile', href: '/profile', icon: User, color: 'from-emerald-500 to-teal-500' },
  ];

  const navigation = [
    ...baseNavigation,
    ...(user?.role === 'admin' ? adminNavigation : userNavigation)
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const sidebarVariants: Variants = {
    expanded: { 
      width: 280, 
      transition: { 
        duration: 0.3, 
        ease: [0.23, 1, 0.32, 1]
      } 
    },
    collapsed: { 
      width: 80, 
      transition: { 
        duration: 0.3, 
        ease: [0.23, 1, 0.32, 1]
      } 
    }
  };

  const textVariants: Variants = {
    expanded: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        delay: 0.1,
        duration: 0.2,
        ease: "easeOut"
      } 
    },
    collapsed: { 
      opacity: 0, 
      x: -10, 
      transition: { 
        duration: 0.1,
        ease: "easeIn"
      } 
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarExpanded ? 'expanded' : 'collapsed'}
        className="hidden lg:flex fixed left-0 top-0 h-full z-30"
      >
        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-white/20 dark:border-slate-700/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.div
                      variants={textVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      <h1 className="font-bold text-xl text-gray-900 dark:text-white">Smart-en</h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Employee Hub</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* User Info */}
          <AnimatePresence>
            {isSidebarExpanded && user && (
              <motion.div
                variants={textVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="p-6 border-b border-gray-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  <AnimatePresence>
                    {isSidebarExpanded && (
                      <motion.div
                        variants={textVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="flex-1 flex items-center justify-between"
                      >
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center space-x-1">
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          {item.isNew && (
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50 dark:border-slate-700/50 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    variants={textVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="font-medium"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    variants={textVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="font-medium"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 h-full w-80 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/20 dark:border-slate-700/20"
          >
            {/* Same content as desktop but always expanded */}
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-gray-900 dark:text-white">Smart-en</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Employee Hub</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-6 border-b border-gray-200/50 dark:border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-6 space-y-2">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-200",
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center space-x-1">
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          {item.isNew && (
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full" />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200/50 dark:border-slate-700/50 space-y-2">
                <button
                  onClick={() => {
                    router.push('/settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}