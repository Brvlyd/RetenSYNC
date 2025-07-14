'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building, Briefcase, Hash, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    education_level: '',
    address: '',
    position: '',
    department: '',
    hire_date: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);

  // These should ideally come from the API, but for demo purposes:
  const departments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Sales' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'HR' },
    { id: 5, name: 'Finance' },
    { id: 6, name: 'Operations' },
    { id: 7, name: 'Product' },
    { id: 8, name: 'Customer Support' }
  ];
  const positions = [
    'Software Developer',
    'Senior Software Engineer',
    'Team Lead',
    'Project Manager',
    'Product Manager',
    'Sales Representative',
    'Marketing Specialist',
    'HR Specialist',
    'Financial Analyst',
    'Operations Manager',
    'Customer Support Representative',
    'Designer',
    'Data Analyst',
    'DevOps Engineer'
  ];
  const genders = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' }
  ];
  const maritalStatuses = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ];
  const educationLevels = [
    { value: 'high_school', label: 'High School' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' }
  ];
  const salaryTypes = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone_number') {
      let formattedValue = value;
      
      // Remove any non-digit characters except + and space
      formattedValue = formattedValue.replace(/[^\d+\s-]/g, '');
      
      // If user starts typing without +62 or 08, auto-add +62
      if (formattedValue.length === 1 && formattedValue !== '+' && formattedValue !== '0') {
        formattedValue = '+62' + formattedValue;
      }
      
      // If user types 08, keep it as is
      if (formattedValue.startsWith('08')) {
        // Format: 08XX-XXXX-XXXX
        formattedValue = formattedValue.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
      }
      // If user types +62, format accordingly
      else if (formattedValue.startsWith('+62')) {
        // Remove +62 temporarily for formatting
        const numberPart = formattedValue.substring(3);
        if (numberPart.length > 0) {
          // Format: +62 XXX-XXXX-XXXX
          const formatted = numberPart.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
          formattedValue = '+62 ' + formatted;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error if field is being corrected
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^([a-zA-Z0-9_.+-]+)@company\.com$/.test(formData.email)) {
      newErrors.email = 'Email must use @company.com domain';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation validation
    if (!formData.password_confirm) {
      newErrors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }
    
    // Name validation
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    
    // Phone number validation
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else {
      // Remove any non-digit characters except + for validation
      const cleanPhone = formData.phone_number.replace(/[^\d+]/g, '');
      const indonesianPhoneRegex = /^(\+62|62|08)\d{8,13}$/;
      
      // Check total digit count (10-15 digits)
      const digitCount = cleanPhone.replace(/[^\d]/g, '').length;
      if (!indonesianPhoneRegex.test(cleanPhone) || digitCount < 10 || digitCount > 15) {
        newErrors.phone_number = 'Phone number must start with +62 or 08 and contain 10-15 digits';
      }
    }
    
    // Date of birth and age validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Check if birthday has passed this year
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      
      if (actualAge < 21) {
        newErrors.date_of_birth = 'You must be at least 21 years old to register';
      }
    }
    
    // Other field validations
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
    if (!formData.education_level) newErrors.education_level = 'Education level is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.position || formData.position === '') newErrors.position = 'Position is required';
    if (!formData.department || formData.department === '') {
      newErrors.department = 'Department is required';
    } else if (isNaN(Number(formData.department)) || Number(formData.department) <= 0) {
      newErrors.department = 'Department must be selected';
    }
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Prepare payload with form data
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      password_confirm: formData.password_confirm.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone_number: formData.phone_number.trim(),
      date_of_birth: formData.date_of_birth.trim(),
      gender: formData.gender.trim(),
      marital_status: formData.marital_status.trim(),
      education_level: formData.education_level.trim(),
      address: formData.address.trim(),
      position: formData.position.trim(),
      department: parseInt(formData.department, 10),
      hire_date: formData.hire_date.trim()
    };

    // Final validation check
    if (
      !payload.email ||
      !payload.password ||
      !payload.password_confirm ||
      !payload.first_name ||
      !payload.last_name ||
      !payload.phone_number ||
      !payload.date_of_birth ||
      !payload.gender ||
      !payload.marital_status ||
      !payload.education_level ||
      !payload.address ||
      !payload.position ||
      !payload.hire_date ||
      isNaN(payload.department) || payload.department <= 0
    ) {
      setErrors(prev => ({
        ...prev,
        general: 'Please fill all fields correctly.'
      }));
      return;
    }

    try {
      console.log('Register payload:', payload);
      
      const success = await register(payload);
      
      if (success) {
        setSuccess(true);
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Registration failed. Please try again.'
        }));
      }
    } catch (err) {
      console.error('Register error:', err);
      setErrors(prev => ({
        ...prev,
        general: 'Registration failed. Please try again.'
      }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex items-center justify-center p-3 sm:p-4 overflow-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#23232a] rounded-xl sm:rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] p-4 sm:p-6 text-center max-w-sm sm:max-w-md w-full"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#d96f27] dark:text-[#94c47d] mb-2">Registration Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base px-2">
            Your account has been created successfully. Redirecting to dashboard...
          </p>
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#d96f27] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex flex-col items-center justify-start p-3 sm:p-4 relative pt-6 sm:pt-8 pb-12 sm:pb-16">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      {/* Vibrant animated blurred shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated accent blobs - new color scheme */}
        <div className="absolute -top-12 sm:-top-24 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-[#d96f27]/30 via-[#fff7e6]/20 to-[#94c47d]/30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-[30rem] sm:h-[30rem] bg-gradient-to-tr from-[#94c47d]/30 via-[#fff7e6]/20 to-[#d96f27]/30 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-br from-[#fff7e6]/40 via-[#d96f27]/20 to-[#94c47d]/30 rounded-full blur-2xl animate-blob3" style={{transform:'translate(-50%,-50%)'}} />
      </div>
      
      {/* Logo Container - Separate shape at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-16 sm:h-20 lg:h-24 bg-white dark:bg-[#23232a] bg-gradient-to-br from-[#fff7e6] via-white to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] rounded-xl sm:rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] flex items-center justify-center mb-3 sm:mb-4 relative z-10"
      >
        {/* Subtle animated gradient accent at the top */}
        <div className="pointer-events-none absolute left-0 top-0 w-full h-2 sm:h-3 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] dark:from-[#d96f27] dark:via-[#23281a] dark:to-[#94c47d] opacity-60 animate-gradient-x" />
        <Image
          src={require('../../../assets/RetenSYNC.png')}
          alt="RetenSYNC Logo"
          width={140}
          height={60}
          className="object-contain w-48 h-12 sm:w-64 sm:h-14 lg:w-[400px] lg:h-[60px]"
          priority
        />
      </motion.div>

      <div className="w-full max-w-full relative z-10 flex justify-center items-start mb-12 sm:mb-16" style={{height:'100%'}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-start w-full"
          style={{ height: '100%' }}
        >
          {/* Register Card - vertical, scrollable, responsive form */}
          <div
            className="relative bg-white/90 dark:bg-[#23232a]/90 bg-gradient-to-br from-[#fff7e6]/90 via-white/95 to-[#f0f4e8]/90 dark:from-[#23232a]/90 dark:via-[#23281a]/90 dark:to-[#23281a]/90 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#f7cfa6]/60 dark:border-[#23281a]/60 p-3 sm:p-4 lg:p-5 flex flex-col items-center max-w-sm sm:max-w-md w-full mx-auto z-10 group transition-transform duration-300 custom-scrollbar backdrop-blur-lg"
            style={{ 
              maxHeight: '70vh',
              minHeight: '400px', 
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'thin',
              scrollbarColor: '#9ca3af transparent'
            }}
          >
          {/* Subtle animated gradient accent at the top */}
          <div className="pointer-events-none absolute left-0 top-0 w-full h-3 sm:h-4 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] dark:from-[#d96f27] dark:via-[#23281a] dark:to-[#94c47d] opacity-70 animate-gradient-x shadow-sm" />
          
          <p className="text-[#d96f27] dark:text-[#94c47d] bg-[#fff7e6]/70 dark:bg-[#23281a]/70 px-2 py-1 rounded-lg inline-block shadow-sm animate-fade-in text-sm sm:text-base font-semibold mb-3 mt-3 text-center">Create your account</p>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-full mx-0 text-xs sm:text-sm flex flex-col gap-2 flex-1"
            style={{ minHeight: '350px', paddingRight: '2px', flexGrow: 1 }}
          >
            {/* Show general error message if exists */}
            {errors.general && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 rounded-lg px-3 py-2 mb-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{errors.general}</span>
              </div>
            )}

            {/* Organized Form Sections */}
            <div className="space-y-3 sm:space-y-4">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-700/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/60 dark:border-gray-600/50 shadow-lg backdrop-blur-sm">
                <h3 className="text-sm font-bold text-[#d96f27] dark:text-[#94c47d] mb-3 sm:mb-4 flex items-center">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#d96f27] to-[#b95a1f] dark:from-[#94c47d] dark:to-[#7ea864] rounded-full text-white dark:text-[#23232a] flex items-center justify-center text-xs mr-2 sm:mr-3 shadow-lg">1</span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.email ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        placeholder="email@company.com"
                        style={{ minHeight: '48px' }}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>

                  {/* Name Fields - Side by Side on larger screens, stacked on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">First Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.first_name ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`} 
                        placeholder="First name"
                        style={{ minHeight: '48px' }}
                      />
                      {errors.first_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Last Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.last_name ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`} 
                        placeholder="Last name"
                        style={{ minHeight: '48px' }}
                      />
                      {errors.last_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.last_name}</p>}
                    </div>
                  </div>

                  {/* Phone and Date of Birth - Stacked on mobile, side by side on larger screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="tel" 
                          name="phone_number" 
                          value={formData.phone_number} 
                          onChange={handleInputChange} 
                          className={`w-full pl-10 pr-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.phone_number ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`} 
                          placeholder="+62 812-3456-7890" 
                          maxLength={25}
                          style={{ minHeight: '48px' }}
                        />
                      </div>
                      {errors.phone_number && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone_number}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Date of Birth <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        name="date_of_birth" 
                        value={formData.date_of_birth} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.date_of_birth ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        style={{ minHeight: '48px' }}
                      />
                      {errors.date_of_birth && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.date_of_birth}</p>}
                    </div>
                  </div>

                  {/* Gender and Marital Status - Stacked on mobile, side by side on larger screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Gender <span className="text-red-500">*</span></label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.gender ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        style={{ minHeight: '48px' }}
                      >
                        <option value="">Select gender</option>
                        {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                      {errors.gender && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Marital Status <span className="text-red-500">*</span></label>
                      <select 
                        name="marital_status" 
                        value={formData.marital_status} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.marital_status ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        style={{ minHeight: '48px' }}
                      >
                        <option value="">Select status</option>
                        {maritalStatuses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                      {errors.marital_status && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.marital_status}</p>}
                    </div>
                  </div>

                  {/* Education Level */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Education Level <span className="text-red-500">*</span></label>
                    <select 
                      name="education_level" 
                      value={formData.education_level} 
                      onChange={handleInputChange} 
                      className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.education_level ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                      style={{ minHeight: '48px' }}
                    >
                      <option value="">Select education level</option>
                      {educationLevels.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                    {errors.education_level && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.education_level}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Address <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.address ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`} 
                      placeholder="Enter your address"
                      style={{ minHeight: '48px' }}
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Account Security Section */}
              <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-700/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/60 dark:border-gray-600/50 shadow-lg backdrop-blur-sm">
                <h3 className="text-sm font-bold text-[#d96f27] dark:text-[#94c47d] mb-3 sm:mb-4 flex items-center">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#d96f27] to-[#b95a1f] dark:from-[#94c47d] dark:to-[#7ea864] rounded-full text-white dark:text-[#23232a] flex items-center justify-center text-xs mr-2 sm:mr-3 shadow-lg">2</span>
                  Account Security
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.password ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        placeholder="Enter password"
                        style={{ minHeight: '48px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                        style={{ minHeight: '48px', minWidth: '48px' }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.password_confirm ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        placeholder="Confirm password"
                        style={{ minHeight: '48px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                        style={{ minHeight: '48px', minWidth: '48px' }}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
                      </button>
                    </div>
                    {errors.password_confirm && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password_confirm}</p>}
                  </div>
                </div>
              </div>

              {/* Work Information Section */}
              <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-700/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/60 dark:border-gray-600/50 shadow-lg backdrop-blur-sm">
                <h3 className="text-sm font-bold text-[#d96f27] dark:text-[#94c47d] mb-3 sm:mb-4 flex items-center">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#d96f27] to-[#b95a1f] dark:from-[#94c47d] dark:to-[#7ea864] rounded-full text-white dark:text-[#23232a] flex items-center justify-center text-xs mr-2 sm:mr-3 shadow-lg">3</span>
                  Work Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Position and Department - Stacked on mobile, side by side on larger screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Position <span className="text-red-500">*</span></label>
                      <select 
                        name="position" 
                        value={formData.position} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.position ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        style={{ minHeight: '48px' }}
                      >
                        <option value="">Select position</option>
                        {positions.map(position => <option key={position} value={position}>{position}</option>)}
                      </select>
                      {errors.position && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.position}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Department <span className="text-red-500">*</span></label>
                      <select 
                        name="department" 
                        value={formData.department} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.department ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                        style={{ minHeight: '48px' }}
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                      </select>
                      {errors.department && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.department}</p>}
                    </div>
                  </div>

                  {/* Hire Date */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Hire Date <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      name="hire_date" 
                      value={formData.hire_date} 
                      onChange={handleInputChange} 
                      className={`w-full px-3 py-3 sm:py-3 bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl focus:ring-2 focus:ring-[#d96f27]/50 dark:focus:ring-[#94c47d]/50 focus:border-[#d96f27] dark:focus:border-[#94c47d] transition-all duration-300 text-gray-900 dark:text-white shadow-sm backdrop-blur-sm text-sm touch-manipulation ${errors.hire_date ? 'border-red-400 dark:border-red-500' : 'border-gray-300/60 dark:border-gray-600/60 hover:border-gray-400 dark:hover:border-gray-500'}`}
                      style={{ minHeight: '48px' }}
                    />
                    {errors.hire_date && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.hire_date}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Help Text */}
            <div className="mt-3 sm:mt-4 mb-2 sm:mb-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fields marked with <span className="text-red-500 font-bold">*</span> are required
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#d96f27] to-[#b95a1f] hover:from-[#b95a1f] hover:to-[#d96f27] dark:from-[#94c47d] dark:to-[#7ea864] dark:hover:from-[#7ea864] dark:hover:to-[#94c47d] text-white dark:text-[#23232a] py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base tracking-wide border-2 border-[#f7cfa6]/50 dark:border-[#23281a]/50 backdrop-blur-sm touch-manipulation"
              style={{ minHeight: '52px' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Create Account</>
              )}
            </motion.button>
            
            {/* Login Link directly below the Create Account button */}
            <div className="mt-2 text-center">
              <p className="text-sm text-[#d96f27] dark:text-[#94c47d] font-medium">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-[#94c47d] dark:text-[#d96f27] hover:text-[#b95a1f] dark:hover:text-[#b0e09a] font-bold underline underline-offset-2 transition-colors touch-manipulation"
                  style={{ minHeight: '44px', paddingTop: '8px', paddingBottom: '8px' }}
                >
                  Sign in here
                </button>
              </p>
              {/* Large visible margin below the login link, always visible */}
              <div style={{ height: '32px', width: '100%' }} aria-hidden="true"></div>
            </div>
          </form>
          </div> {/* End of card */}
        </motion.div> {/* End of motion.div for card animation */}
      </div>
    </div>
  );
}