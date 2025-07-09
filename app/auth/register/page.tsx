'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building, Briefcase, Hash, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
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
    hire_date: '',
    salary: '',
    salary_amount: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
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
    { value: 'F', label: 'Female' }
  ];
  const maritalStatuses = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ];
  const educationLevels = [
    { value: 'highschool', label: 'High School' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'master', label: 'Master' },
    { value: 'doctorate', label: 'Doctorate' }
  ];
  const salaryTypes = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    } else if (!/^([a-zA-Z0-9_.+-]+)@company\.com$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid @company.com address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.password_confirm) {
      newErrors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
    if (!formData.education_level) newErrors.education_level = 'Education level is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    if (!formData.salary) newErrors.salary = 'Salary type is required';
    if (!formData.salary_amount) newErrors.salary_amount = 'Salary amount is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Prepare payload for the external API
    const payload = {
      email: formData.email,
      password: formData.password,
      password_confirm: formData.password_confirm,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      marital_status: formData.marital_status,
      education_level: formData.education_level,
      address: formData.address,
      position: formData.position,
      department: Number(formData.department),
      hire_date: formData.hire_date,
      salary: formData.salary,
      salary_amount: Number(formData.salary_amount)
    };

    try {
      // Call the external API directly (with trailing slash)
      const response = await fetch('https://turnover-api-hd7ze.ondigitalocean.app/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(prev => ({
          ...prev,
          general: data.error || data.message || 'Registration failed'
        }));
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        router.push('/user/dashboard');
      }, 2000);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: 'Registration failed. Please try again.'
      }));
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex items-center justify-center p-2 overflow-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#23232a] rounded-xl sm:rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] p-4 sm:p-6 text-center max-w-md w-full"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#d96f27] dark:text-[#94c47d] mb-2">Registration Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
            Your account has been created successfully. Redirecting to dashboard...
          </p>
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#d96f27] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex flex-col items-center justify-start p-2 relative pt-8 pb-16">
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
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gradient-to-br from-[#d96f27]/30 via-[#fff7e6]/20 to-[#94c47d]/30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#94c47d]/30 via-[#fff7e6]/20 to-[#d96f27]/30 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-[#fff7e6]/40 via-[#d96f27]/20 to-[#94c47d]/30 rounded-full blur-2xl animate-blob3" style={{transform:'translate(-50%,-50%)'}} />
      </div>
      
      {/* Logo Container - Separate shape at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-96 h-24 bg-white dark:bg-[#23232a] bg-gradient-to-br from-[#fff7e6] via-white to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] flex items-center justify-center mb-4 relative z-10"
      >
        {/* Subtle animated gradient accent at the top */}
        <div className="pointer-events-none absolute left-0 top-0 w-full h-3 rounded-t-2xl bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] dark:from-[#d96f27] dark:via-[#23281a] dark:to-[#94c47d] opacity-60 animate-gradient-x" />
        <Image
          src={require('../../../assets/RetenSYNC.png')}
          alt="RetenSYNC Logo"
          width={140}
          height={60}
          className="object-contain w-[400px] h-[60px]"
          priority
        />
      </motion.div>

      <div className="w-full max-w-full relative z-10 flex justify-center items-start mb-16" style={{height:'100%'}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-start w-full"
          style={{ height: '100%' }}
        >
          {/* Register Card - vertical, scrollable, responsive form */}
          <div
            className="relative bg-white dark:bg-[#23232a] bg-gradient-to-br from-[#fff7e6] via-white to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] p-1 sm:p-4 flex flex-col items-center max-w-md w-full mx-auto z-10 group transition-transform duration-300 custom-scrollbar"
            style={{ 
              maxHeight: '75vh', 
              minHeight: '400px', 
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'thin',
              scrollbarColor: '#9ca3af transparent'
            }}
          >
          {/* Subtle animated gradient accent at the top */}
          <div className="pointer-events-none absolute left-0 top-0 w-full h-3 rounded-t-[2.5rem] bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] dark:from-[#d96f27] dark:via-[#23281a] dark:to-[#94c47d] opacity-60 animate-gradient-x" />
          
          <p className="text-[#d96f27] dark:text-[#94c47d] bg-[#fff7e6]/70 dark:bg-[#23281a]/70 px-2 py-1 rounded-lg inline-block shadow-sm animate-fade-in text-sm sm:text-base font-semibold mb-3 mt-3">Create your account</p>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-full mx-0 text-xs sm:text-sm flex flex-col gap-2 flex-1"
            style={{ minHeight: '350px', paddingRight: '2px', flexGrow: 1 }}
          >
            {/* Show general error message if exists */}
            {errors.general && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 rounded-lg px-3 py-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Organized Form Sections */}
            <div className="space-y-4">
              {/* Personal Information Section */}
              <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-sm font-bold text-[#d96f27] dark:text-[#94c47d] mb-3 flex items-center">
                  <span className="w-5 h-5 bg-[#d96f27] dark:bg-[#94c47d] rounded-full text-white dark:text-[#23232a] flex items-center justify-center text-xs mr-2">1</span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                        placeholder="email@company.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>

                  {/* Name Fields - Side by Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                      <input 
                        type="text" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.first_name ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                        placeholder="First name" 
                      />
                      {errors.first_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.last_name ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                        placeholder="Last name" 
                      />
                      {errors.last_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>}
                    </div>
                  </div>

                  {/* Phone and Date of Birth - Side by Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        name="phone_number" 
                        value={formData.phone_number} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.phone_number ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                        placeholder="Phone number" 
                      />
                      {errors.phone_number && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone_number}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth *</label>
                      <input 
                        type="date" 
                        name="date_of_birth" 
                        value={formData.date_of_birth} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.date_of_birth ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                      />
                      {errors.date_of_birth && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>}
                    </div>
                  </div>

                  {/* Gender and Marital Status - Side by Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.gender ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                      >
                        <option value="">Select gender</option>
                        {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                      </select>
                      {errors.gender && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Marital Status *</label>
                      <select 
                        name="marital_status" 
                        value={formData.marital_status} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.marital_status ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                      >
                        <option value="">Select status</option>
                        {maritalStatuses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                      {errors.marital_status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.marital_status}</p>}
                    </div>
                  </div>

                  {/* Education Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Education Level *</label>
                    <select 
                      name="education_level" 
                      value={formData.education_level} 
                      onChange={handleInputChange} 
                      className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.education_level ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                    >
                      <option value="">Select education level</option>
                      {educationLevels.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                    {errors.education_level && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.education_level}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.address ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                      placeholder="Enter your address" 
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Account Security Section */}
              <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-sm font-bold text-[#d96f27] dark:text-[#94c47d] mb-3 flex items-center">
                  <span className="w-5 h-5 bg-[#d96f27] dark:bg-[#94c47d] rounded-full text-white dark:text-[#23232a] flex items-center justify-center text-xs mr-2">2</span>
                  Account Security
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                        placeholder="Enter password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.password_confirm ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                        placeholder="Confirm password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
                      </button>
                    </div>
                    {errors.password_confirm && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirm}</p>}
                  </div>
                </div>
              </div>

              {/* Work Information Section */}
              <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-sm font-bold text-[#d96f27] dark:text-[#94c47d] mb-3 flex items-center">
                  <span className="w-5 h-5 bg-[#d96f27] dark:bg-[#94c47d] rounded-full text-white dark:text-[#23232a] flex items-center justify-center text-xs mr-2">3</span>
                  Work Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* Position and Department - Side by Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Position *</label>
                      <select 
                        name="position" 
                        value={formData.position} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.position ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                      >
                        <option value="">Select position</option>
                        {positions.map(position => <option key={position} value={position}>{position}</option>)}
                      </select>
                      {errors.position && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Department *</label>
                      <select 
                        name="department" 
                        value={formData.department} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.department ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                      </select>
                      {errors.department && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>}
                    </div>
                  </div>

                  {/* Hire Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hire Date *</label>
                    <input 
                      type="date" 
                      name="hire_date" 
                      value={formData.hire_date} 
                      onChange={handleInputChange} 
                      className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.hire_date ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                    />
                    {errors.hire_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hire_date}</p>}
                  </div>

                  {/* Salary Information - Side by Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salary Type *</label>
                      <select 
                        name="salary" 
                        value={formData.salary} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.salary ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                      >
                        <option value="">Select type</option>
                        {salaryTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      {errors.salary && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salary}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salary Amount *</label>
                      <input 
                        type="number" 
                        name="salary_amount" 
                        value={formData.salary_amount} 
                        onChange={handleInputChange} 
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white ${errors.salary_amount ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} 
                        placeholder="Amount" 
                        min="0" 
                      />
                      {errors.salary_amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salary_amount}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Help Text */}
            <div className="mt-4 mb-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fields marked with <span className="text-red-500">*</span> are required
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#d96f27] hover:bg-[#b95a1f] dark:bg-[#94c47d] dark:hover:bg-[#7ea864] text-white dark:text-[#23232a] py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base tracking-wide border-2 border-[#f7cfa6] dark:border-[#23281a]"
              style={{ minHeight: '48px' }}
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
                  className="text-[#94c47d] dark:text-[#d96f27] hover:text-[#b95a1f] dark:hover:text-[#b0e09a] font-bold underline underline-offset-2 transition-colors"
                >
                  Sign in here
                </button>
              </p>
              {/* Large visible margin below the login link, always visible */}
              <div style={{ height: '48px', width: '100%' }} aria-hidden="true"></div>
            </div>
          </form>
          </div> {/* End of card */}
        </motion.div> {/* End of motion.div for card animation */}
      </div>
    </div>
  );
}