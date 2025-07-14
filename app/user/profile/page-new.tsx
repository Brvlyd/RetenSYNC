'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Award, Target, TrendingUp, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [enhancedUser, setEnhancedUser] = useState<any>(null);
  const [editedUser, setEditedUser] = useState<any>({});

  useEffect(() => {
    if (user) {
      // Enhanced user data with additional fields
      const enhanced = {
        ...user,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone_number || '+62 815-6789-0123',
        location: user.address || 'Jakarta, Indonesia',
        joinDate: user.hire_date || '2022-11-05',
        employeeId: `EMP${String(user.id).padStart(3, '0')}`,
        department: user.department === 1 ? 'Engineering' : 'Other Department',
        manager: 'Bravely Dirgayuska',
        bio: user.bio || 'Passionate software developer with expertise in modern web technologies. Love creating efficient and scalable solutions.',
        skills: user.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        achievements: [
          { title: 'Employee of the Month', date: 'December 2023', description: 'Outstanding performance in Q4 projects' },
          { title: 'Innovation Award', date: 'September 2023', description: 'Led successful migration to new tech stack' },
          { title: 'Team Leadership', date: 'June 2023', description: 'Successfully mentored 3 junior developers' }
        ]
      };
      setEnhancedUser(enhanced);
      setEditedUser(enhanced);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(enhancedUser);
    setIsEditing(false);
  };

  if (!enhancedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const inputChange = (field: string, value: string) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                  {enhancedUser.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{enhancedUser.name}</h2>
                <p className="text-blue-100 font-semibold mb-1">{enhancedUser.position}</p>
                <p className="text-blue-200 text-sm mb-4">{enhancedUser.department}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-blue-100">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{enhancedUser.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{enhancedUser.phone}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{enhancedUser.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">Joined {new Date(enhancedUser.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => inputChange('name', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee ID</label>
                    <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.employeeId}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => inputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => inputChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.location}
                        onChange={(e) => inputChange('location', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.location}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manager</label>
                    <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.manager}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biography</h3>
              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => inputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{enhancedUser.bio}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {enhancedUser.skills?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {enhancedUser.achievements?.map((achievement: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">{achievement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
