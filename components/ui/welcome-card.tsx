'use client';

import { motion } from 'framer-motion';
import { User, Award, TrendingUp, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeCardProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
    department?: string;
    joinDate?: string;
  };
  stats?: {
    tasksCompleted: number;
    performanceScore: number;
    upcomingMeetings: number;
  };
  className?: string;
}

export default function WelcomeCard({ user, stats, className }: WelcomeCardProps) {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isAdmin = user.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-8 text-white",
        isAdmin 
          ? "bg-gradient-to-br from-[#5e0e8b] via-purple-600 to-[#5e0e8b]"
          : "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white transform -translate-x-16 translate-y-16" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              </div>
            </div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold"
              >
                {getGreeting()}, {user.name}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-lg"
              >
                {isAdmin ? 'Welcome to your admin dashboard' : 'Ready to make today amazing?'}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-2 mt-1"
              >
                <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                {user.department && (
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">
                    {user.department}
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* Time */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-right"
          >
            <div className="text-2xl font-bold">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-white/80 text-sm">
              {new Date().toLocaleDateString([], { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.performanceScore}%</div>
              <div className="text-sm text-white/80">Performance</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
              <div className="text-sm text-white/80">Meetings</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}