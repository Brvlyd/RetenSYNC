'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Users, Shield, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { isTokenExpired, getTokenExpirationTime } from '@/lib/auth-token';

interface DemoUser {
  email: string;
  password: string;
  role: 'admin' | 'hr' | 'manager' | 'user';
  description: string;
  permissions: string[];
}

const demoUsers: DemoUser[] = [
  {
    email: 'admin@retensync.com',
    password: 'admin123',
    role: 'admin',
    description: 'Full system access with all administrative privileges',
    permissions: ['User Management', 'System Settings', 'Analytics', 'All Features']
  },
  {
    email: 'hr@retensync.com',
    password: 'hr123',
    role: 'hr',
    description: 'HR specialist with employee management capabilities',
    permissions: ['Employee Management', 'Recruitment', 'Performance Reviews', 'Reports']
  },
  {
    email: 'manager@retensync.com',
    password: 'manager123',
    role: 'manager',
    description: 'Team manager with performance and goal tracking',
    permissions: ['Team Management', 'Performance Tracking', 'Goal Setting', 'Team Reports']
  },
  {
    email: 'employee@retensync.com',
    password: 'user123',
    role: 'user',
    description: 'Regular employee with personal dashboard access',
    permissions: ['Personal Profile', 'Own Performance', 'Personal Goals', 'Feedback']
  }
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return <Shield className="w-5 h-5 text-red-500" />;
    case 'hr': return <Users className="w-5 h-5 text-blue-500" />;
    case 'manager': return <Settings className="w-5 h-5 text-green-500" />;
    case 'user': return <User className="w-5 h-5 text-gray-500" />;
    default: return <User className="w-5 h-5 text-gray-500" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'border-red-200 bg-red-50 hover:bg-red-100';
    case 'hr': return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    case 'manager': return 'border-green-200 bg-green-50 hover:bg-green-100';
    case 'user': return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    default: return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
  }
};

export default function EnhancedLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, userRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<DemoUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isTokenExpired()) {
      const redirectPath = userRole === 'admin' ? '/admin/dashboard' 
                        : userRole === 'hr' ? '/hr/dashboard'
                        : userRole === 'manager' ? '/manager/dashboard'
                        : '/user/dashboard';
      router.push(redirectPath);
    }
  }, [isAuthenticated, userRole, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDemoUserSelect = (demoUser: DemoUser) => {
    setSelectedDemo(demoUser);
    setFormData({
      email: demoUser.email,
      password: demoUser.password
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setErrors({});
    setLoginSuccess(false);
    
    try {
      console.log('Attempting login with:', { 
        email: formData.email, 
        role: selectedDemo?.role || 'unknown' 
      });
      
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setLoginSuccess(true);
        // Success feedback will be shown briefly before redirect
        setTimeout(() => {
          const redirectPath = selectedDemo?.role === 'admin' ? '/admin/dashboard' 
                            : selectedDemo?.role === 'hr' ? '/hr/dashboard'
                            : selectedDemo?.role === 'manager' ? '/manager/dashboard'
                            : '/user/dashboard';
          router.push(redirectPath);
        }, 1500);
      } else {
        setErrors({ general: 'Invalid email or password. Please try the demo credentials.' });
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      setErrors({ 
        general: 'Login failed. Please try again or use the demo credentials below.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gradient-to-br from-[#d96f27]/30 via-[#fff7e6]/20 to-[#94c47d]/30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#94c47d]/30 via-[#fff7e6]/20 to-[#d96f27]/30 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-[#fff7e6]/40 via-[#d96f27]/20 to-[#94c47d]/30 rounded-full blur-2xl animate-blob3" style={{transform:'translate(-50%,-50%)'}} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <div className="bg-white dark:bg-[#23232a] bg-gradient-to-br from-[#fff7e6] via-white to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] p-8 relative overflow-hidden"
            style={{boxShadow:'0 8px 48px 0 rgba(217,111,39,0.10), 0 0 0 4px rgba(148,196,125,0.10)'}}>
            
            {/* Gradient accent */}
            <div className="absolute left-0 top-0 w-full h-3 rounded-t-2xl bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] opacity-60 animate-gradient-x" />
            
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#d96f27] to-[#94c47d] rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your RetenSYNC account
              </p>
            </div>

            {/* Success Message */}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-green-800 font-medium">Login Successful!</p>
                  <p className="text-green-600 text-sm">
                    Redirecting to your {selectedDemo?.role} dashboard...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Messages */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{errors.general}</p>
              </motion.div>
            )}

            {/* Selected Demo User Info */}
            {selectedDemo && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {getRoleIcon(selectedDemo.role)}
                  <span className="font-medium text-blue-800 capitalize">
                    {selectedDemo.role} Login Selected
                  </span>
                </div>
                <p className="text-blue-700 text-sm mb-2">{selectedDemo.description}</p>
                <div className="flex flex-wrap gap-1">
                  {selectedDemo.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                  {selectedDemo.permissions.length > 3 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      +{selectedDemo.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d96f27] focus:border-transparent transition-colors ${
                      errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#d96f27] focus:border-transparent transition-colors ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#d96f27] to-[#94c47d] text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          </div>

          {/* Demo Users Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#23232a] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Demo Access
                </h2>
                <button
                  onClick={() => setShowDemoUsers(!showDemoUsers)}
                  className="text-[#d96f27] hover:text-[#b85a1f] font-medium text-sm"
                >
                  {showDemoUsers ? 'Hide' : 'Show'} Demo Users
                </button>
              </div>
              
              {showDemoUsers && (
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Try different user roles to see how the authentication system works:
                  </p>
                  
                  {demoUsers.map((user) => (
                    <motion.button
                      key={user.email}
                      onClick={() => handleDemoUserSelect(user)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                        selectedDemo?.email === user.email 
                          ? 'border-[#d96f27] bg-orange-50 dark:bg-orange-900/20' 
                          : getRoleColor(user.role)
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getRoleIcon(user.role)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {user.role}
                            </span>
                            {selectedDemo?.email === user.email && (
                              <CheckCircle className="w-4 h-4 text-[#d96f27]" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {user.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.slice(0, 2).map((permission) => (
                              <span
                                key={permission}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                              >
                                {permission}
                              </span>
                            ))}
                            {user.permissions.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                +{user.permissions.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Security Features */}
            <div className="bg-white dark:bg-[#23232a] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Security Features
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure token storage in cookies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Role-based access control</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Automatic token expiration handling</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure API request authentication</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
