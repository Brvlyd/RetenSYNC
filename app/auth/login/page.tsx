'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrors({});
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      
      const success = await login(formData.email, formData.password);
      
      if (!success) {
        setErrors({ general: 'Invalid email or password' });
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ general: 'Login failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex items-center justify-center p-3 sm:p-4 pt-8 sm:pt-12 relative overflow-hidden">
      {/* Vibrant animated blurred shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated accent blobs - new color scheme */}
        <div className="absolute -top-12 sm:-top-24 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-[#d96f27]/30 via-[#fff7e6]/20 to-[#94c47d]/30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-[30rem] sm:h-[30rem] bg-gradient-to-tr from-[#94c47d]/30 via-[#fff7e6]/20 to-[#d96f27]/30 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-br from-[#fff7e6]/40 via-[#d96f27]/20 to-[#94c47d]/30 rounded-full blur-2xl animate-blob3" style={{transform:'translate(-50%,-50%)'}} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl xl:max-w-4xl relative z-10 flex justify-center items-center"
      >
        {/* Login Card - Clean, subtle gradient accent, lighter dark mode */}
        <div className="relative bg-white dark:bg-[#23232a] bg-gradient-to-br from-[#fff7e6] via-white to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] p-4 sm:p-6 md:p-10 lg:p-14 flex flex-col md:flex-row gap-4 md:gap-0 items-stretch justify-center min-h-[500px] sm:min-h-[600px] max-w-6xl mx-auto w-full z-10 overflow-hidden group transition-transform duration-300 hover:scale-[1.01] sm:hover:scale-[1.025]"
          style={{boxShadow:'0 8px 48px 0 rgba(217,111,39,0.10), 0 0 0 4px rgba(148,196,125,0.10)'}}
        >
          {/* Subtle animated gradient accent at the top */}
          <div className="pointer-events-none absolute left-0 top-0 w-full h-2 sm:h-3 rounded-t-2xl sm:rounded-t-[2.5rem] bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] dark:from-[#d96f27] dark:via-[#23281a] dark:to-[#94c47d] opacity-60 animate-gradient-x" />
          
          {/* Left: Logo and Welcome */}
          <div className="flex flex-col items-start justify-center md:w-1/2 w-full px-2 py-4 md:py-0 border-b md:border-b-0 md:border-r border-blue-100 dark:border-blue-900 relative z-30 md:order-1">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-start justify-start mb-2 drop-shadow-2xl"
              style={{ position: 'relative', zIndex: 30, marginLeft: '-20px' }}
            >
              <span className="relative flex items-start justify-start">
                <span className="absolute w-72 h-20 sm:w-[420px] sm:h-[110px] rounded-xl sm:rounded-[2.5rem] bg-[#fff7e6] dark:bg-[#23281a] border-2 border-[#f7cfa6] dark:border-[#23281a] shadow-lg z-10" style={{filter:'blur(0.5px)', transform: 'translateX(-30px)'}}></span>
                <Image
                  src="/assets/RetenSYNC.png"
                  alt="RetenSYNC Logo"
                  width={180}
                  height={180}
                  className="object-contain w-64 h-16 sm:w-96 sm:h-28 relative z-20"
                  style={{ transform: 'translateX(0px)' }}
                  priority
                />
              </span>
            </motion.div>
            <p className="text-sm sm:text-base lg:text-lg mt-2 font-semibold text-[#d96f27] dark:text-[#94c47d] bg-[#fff7e6]/70 dark:bg-[#23281a]/70 px-3 py-1 rounded-xl shadow-sm animate-fade-in text-left" style={{ marginLeft: '-20px' }}>Welcome! Please sign in</p>
            
            {/* Demo Credentials (mobile only) */}
            <div className="block md:hidden mt-4 w-full px-2" style={{ marginLeft: '-20px' }}>
              <div className="p-3 bg-[#fdfaf6] dark:bg-[#23281a] border-2 border-[#f7cfa6] dark:border-[#23281a] rounded-xl shadow-sm flex flex-col items-start">
                <p className="text-sm font-semibold text-[#d96f27] dark:text-[#94c47d] mb-1">Demo Credentials</p>
                <div className="flex flex-col gap-1 text-[#d96f27] dark:text-[#94c47d] text-xs text-left">
                  <span><strong>Email:</strong> any@email.com</span>
                  <span><strong>Password:</strong> any password</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form and Info */}
          <div className="flex flex-col justify-center items-center md:w-1/2 w-full px-2 py-4 md:py-0 relative z-30 md:order-2">
            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl flex items-center space-x-3 w-full max-w-sm mx-auto"
              >
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span className="text-red-700 dark:text-red-300 text-sm">{errors.general}</span>
              </motion.div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm mx-auto">
              {/* Email Field */}
              <div className="bg-[#fdfaf6] dark:bg-[#23281a] rounded-xl p-3 pb-2 shadow-sm">
                <label className="block text-sm font-semibold text-[#d96f27] dark:text-[#94c47d] mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#d96f27] dark:text-[#94c47d]" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 sm:py-3 bg-transparent border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27] focus:border-[#d96f27] dark:focus:ring-[#94c47d] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white text-sm font-medium ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-[#f7cfa6] dark:border-[#23281a]'}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                    style={{ minHeight: '48px' }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div className="bg-[#fdfaf6] dark:bg-[#23281a] rounded-xl p-3 pb-2 shadow-sm">
                <label className="block text-sm font-semibold text-[#d96f27] dark:text-[#94c47d] mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#d96f27] dark:text-[#94c47d]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 sm:py-3 bg-transparent border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27] focus:border-[#d96f27] dark:focus:ring-[#94c47d] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white text-sm font-medium ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-[#f7cfa6] dark:border-[#23281a]'}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ minHeight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                    style={{ minHeight: '48px', minWidth: '48px' }}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#d96f27] hover:text-[#94c47d] dark:text-[#94c47d] dark:hover:text-[#d96f27]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#d96f27] hover:text-[#94c47d] dark:text-[#94c47d] dark:hover:text-[#d96f27]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#d96f27] hover:bg-[#b95a1f] dark:bg-[#94c47d] dark:hover:bg-[#7ea864] text-white dark:text-[#23232a] py-3 sm:py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base tracking-wide border-2 border-[#f7cfa6] dark:border-[#23281a] touch-manipulation"
                style={{ minHeight: '52px' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Sign In</>
                )}
              </motion.button>
            </form>
            
            {/* Register Link */}
            <div className="mt-5 text-center w-full">
              <p className="text-sm text-[#d96f27] dark:text-[#94c47d] font-medium">
                Don't have an account?
                <button
                  onClick={() => router.push('/auth/register')}
                  className="ml-1 text-[#94c47d] dark:text-[#d96f27] hover:text-[#b95a1f] dark:hover:text-[#b0e09a] font-bold underline underline-offset-2 transition-colors touch-manipulation"
                  style={{ minHeight: '44px', paddingTop: '8px', paddingBottom: '8px' }}
                >
                  Register here
                </button>
              </p>
            </div>
            
            {/* Demo Credentials (desktop only) */}
            <div className="hidden md:block mt-6 w-full">
              <div className="p-3 bg-[#fdfaf6] dark:bg-[#23281a] border-2 border-[#f7cfa6] dark:border-[#23281a] rounded-xl shadow-sm flex flex-col items-start">
                <p className="text-sm font-semibold text-[#d96f27] dark:text-[#94c47d] mb-1">Demo Credentials</p>
                <div className="flex flex-col gap-1 text-[#d96f27] dark:text-[#94c47d] text-xs">
                  <span><strong>Email:</strong> any@email.com</span>
                  <span><strong>Password:</strong> any password</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}