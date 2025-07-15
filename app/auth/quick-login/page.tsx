'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function QuickLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleQuickLogin = async (
    email: string,
    password: string,
    role: string
  ) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log(`🚀 Quick login as ${role}:`, email);

      // Use the auth context login function
      const success = await login(email, password);

      if (success) {
        setMessage(`✅ Login successful! Redirecting to ${role} dashboard...`);
        // The login function will handle the redirect automatically based on user role
      } else {
        setMessage('❌ Login failed: Invalid credentials');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loginOptions = [
    {
      role: 'Admin',
      email: 'admin@company.com',
      password: 'admin123',
      description: 'Full access to all features including analytics',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: <User className="h-5 w-5" />,
    },
    {
      role: 'User',
      email: 'user@company.com',
      password: 'user123',
      description: 'Standard user access to personal features',
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Login Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a demo account to login instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {loginOptions.map((option, index) => (
              <motion.div
                key={option.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {option.icon}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {option.role}
                    </h3>
                  </div>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {option.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Email:</strong> {option.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Password:</strong> {option.password}
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleQuickLogin(option.email, option.password, option.role)
                  }
                  disabled={isLoading}
                  className={`w-full px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 ${option.color}`}
                >
                  <span>
                    {isLoading ? 'Logging in...' : `Login as ${option.role}`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {message && (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {message}
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Or use the regular login form:
            </p>
            <a
              href="/auth/login"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Go to Login Page</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
