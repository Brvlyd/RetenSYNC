'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Zap } from 'lucide-react';
import { isAuthenticated } from '../app/api/auth';

interface QuickLoginBannerProps {
  className?: string;
  position?: 'top' | 'bottom';
}

export default function QuickLoginBanner({ 
  className = '',
  position = 'bottom' 
}: QuickLoginBannerProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show if already on auth pages or if user is authenticated
  if (pathname?.startsWith('/auth') || isAuthenticated()) {
    return null;
  }

  const handleQuickLogin = () => {
    router.push('/auth/quick-login');
  };

  return (
    <motion.div
      className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-50 ${className}`}
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 2 }}
    >
      <motion.button
        onClick={handleQuickLogin}
        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        <LogIn className="h-5 w-5" />
        <span className="text-sm font-medium">Try Demo Login</span>
        <motion.div
          className="w-2 h-2 bg-yellow-400 rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      </motion.button>
    </motion.div>
  );
}
