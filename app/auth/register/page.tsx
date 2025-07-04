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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7fa] via-[#fff7e6] to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] flex items-start justify-center p-2 relative overflow-auto">
      {/* Vibrant animated blurred shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated accent blobs - new color scheme */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gradient-to-br from-[#d96f27]/30 via-[#fff7e6]/20 to-[#94c47d]/30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#94c47d]/30 via-[#fff7e6]/20 to-[#d96f27]/30 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-[#fff7e6]/40 via-[#d96f27]/20 to-[#94c47d]/30 rounded-full blur-2xl animate-blob3" style={{transform:'translate(-50%,-50%)'}} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg sm:max-w-xl relative z-10 flex justify-center items-start"
      >
        {/* Register Card - vertical layout, longer */}
        <div className="relative bg-white dark:bg-[#23232a] bg-gradient-to-br from-[#fff7e6] via-white to-[#f0f4e8] dark:from-[#23232a] dark:via-[#23281a] dark:to-[#23281a] rounded-2xl shadow-2xl border border-[#f7cfa6] dark:border-[#23281a] p-4 sm:p-6 flex flex-col items-center max-w-lg sm:max-w-xl mx-auto w-full z-10 overflow-hidden group transition-transform duration-300"
        >
          {/* Subtle animated gradient accent at the top */}
          <div className="pointer-events-none absolute left-0 top-0 w-full h-3 rounded-t-[2.5rem] bg-gradient-to-r from-[#d96f27] via-[#fff7e6] to-[#94c47d] dark:from-[#d96f27] dark:via-[#23281a] dark:to-[#94c47d] opacity-60 animate-gradient-x" />
          {/* Logo and Welcome */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-3 drop-shadow-2xl"
            style={{ position: 'relative', zIndex: 30 }}
          >
            <span className="relative flex items-center justify-center">
              <span className="absolute w-[220px] h-[70px] rounded-2xl bg-[#fff7e6] dark:bg-[#23281a] border border-[#f7cfa6] dark:border-[#23281a] shadow-lg z-10" style={{filter:'blur(1px)'}}></span>
              <Image
                src={require('../../../assets/Group 15.png')}
                alt="RetenSYNC Logo"
                width={140}
                height={60}
                className="object-contain w-[200px] h-[60px] relative z-20"
                priority
              />
            </span>
          </motion.div>
          <p className="text-[#d96f27] dark:text-[#94c47d] bg-[#fff7e6]/70 dark:bg-[#23281a]/70 px-2 py-1 rounded-lg inline-block shadow-sm animate-fade-in text-sm sm:text-base font-semibold mb-3">Create your account</p>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full mx-0 text-sm sm:text-base">
            {/* Show general error message if exists */}
            {errors.general && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 rounded-lg px-3 py-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.general}</span>
              </div>
            )}
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                  placeholder="name@smarten.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>
            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.password_confirm ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}
                    placeholder="Confirm password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />}
                  </button>
                </div>
                {errors.password_confirm && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password_confirm}</p>}
              </div>
            </div>
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.first_name ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} placeholder="Enter first name" />
                {errors.first_name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.last_name ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} placeholder="Enter last name" />
                {errors.last_name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>}
              </div>
            </div>
            {/* Phone, DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.phone_number ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} placeholder="e.g. +6281234567890" />
                {errors.phone_number && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone_number}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.date_of_birth ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} />
                {errors.date_of_birth && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>}
              </div>
            </div>
            {/* Gender, Marital Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.gender ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
                  <option value="">Select gender</option>
                  {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
                {errors.gender && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Marital Status</label>
                <select name="marital_status" value={formData.marital_status} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.marital_status ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
                  <option value="">Select status</option>
                  {maritalStatuses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                {errors.marital_status && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.marital_status}</p>}
              </div>
            </div>
            {/* Education, Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Education Level</label>
                <select name="education_level" value={formData.education_level} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.education_level ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
                  <option value="">Select education</option>
                  {educationLevels.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                {errors.education_level && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.education_level}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.address ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} placeholder="Enter address" />
                {errors.address && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
              </div>
            </div>
            {/* Position, Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Position</label>
                <select name="position" value={formData.position} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.position ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
                  <option value="">Select position</option>
                  {positions.map(position => <option key={position} value={position}>{position}</option>)}
                </select>
                {errors.position && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.position}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.department ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
                  <option value="">Select department</option>
                  {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                </select>
                {errors.department && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.department}</p>}
              </div>
            </div>
            {/* Hire Date, Salary Type, Salary Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hire Date</label>
                <input type="date" name="hire_date" value={formData.hire_date} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.hire_date ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} />
                {errors.hire_date && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.hire_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salary Type</label>
                <select name="salary" value={formData.salary} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.salary ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`}>
                  <option value="">Select type</option>
                  {salaryTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {errors.salary && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.salary}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salary Amount</label>
                <input type="number" name="salary_amount" value={formData.salary_amount} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base ${errors.salary_amount ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'}`} placeholder="e.g. 15000000" min="0" />
                {errors.salary_amount && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.salary_amount}</p>}
              </div>
            </div>
            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#d96f27] hover:bg-[#b95a1f] dark:bg-[#94c47d] dark:hover:bg-[#7ea864] text-white dark:text-[#23232a] py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base tracking-wide border-2 border-[#f7cfa6] dark:border-[#23281a]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Create Account</>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center w-full">
            <p className="text-sm text-[#d96f27] dark:text-[#94c47d] font-medium">
              Already have an account?
              <button
                onClick={() => router.push('/auth/login')}
                className="ml-1 text-[#94c47d] dark:text-[#d96f27] hover:text-[#b95a1f] dark:hover:text-[#b0e09a] font-bold underline underline-offset-2 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div> {/* End of card */}
      </motion.div> {/* End of motion.div for card animation */}
    </div>
  );
}