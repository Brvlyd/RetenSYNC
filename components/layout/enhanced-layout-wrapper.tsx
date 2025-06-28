'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ModernSidebar from './modern-sidebar';
import ModernHeader from './modern-header';
import { Toaster } from '@/components/ui/toaster';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function EnhancedLayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Don't show layout on auth pages
  const isAuthPage = pathname?.startsWith('/auth');

  useEffect(() => {
    // Simulate loading time for smooth transitions
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart-en</h2>
          <p className="text-gray-600 dark:text-gray-400">Loading your workspace...</p>
        </motion.div>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <ModernSidebar
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ModernHeader isSidebarExpanded={isSidebarExpanded} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className={`transition-all duration-300 ${
            isSidebarExpanded ? 'lg:ml-0' : 'lg:ml-0'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-full"
              >
                <div className="container-padding py-6">
                  {children}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}