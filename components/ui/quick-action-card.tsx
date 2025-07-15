'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  bgGradient: string;
  onClick?: () => void;
  badge?: string;
  isNew?: boolean;
  className?: string;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  gradient,
  bgGradient,
  onClick,
  badge,
  isNew,
  className,
}: QuickActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative p-6 text-left w-full rounded-2xl border border-white/20 dark:border-slate-700/20 transition-all duration-300 hover:shadow-xl overflow-hidden',
        `bg-gradient-to-br ${bgGradient}`,
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-8 -translate-y-8" />
      </div>

      {/* Badge */}
      {(badge || isNew) && (
        <div className="absolute top-4 right-4">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-start space-x-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={cn(
            'p-3 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300',
            `bg-gradient-to-r ${gradient}`
          )}
        >
          <Icon className="w-6 h-6" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </motion.button>
  );
}
