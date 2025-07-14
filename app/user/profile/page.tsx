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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl lg:rounded-3xl shadow-lg">
                <User className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 dark:from-gray-100 dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Manage your personal information and preferences</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start"
              >
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-sm sm:text-base">Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2 w-full lg:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex-1 lg:flex-initial px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 lg:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 lg:p-8">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {enhancedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{enhancedUser.name}</h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1">{enhancedUser.position}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{enhancedUser.department}</p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{user.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-emerald-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Employee ID</label>
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.employeeId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.location}
                    onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.location}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Manager</label>
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.manager}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2 text-emerald-600" />
              Skills & Expertise
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-semibold border border-emerald-200 dark:border-emerald-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-emerald-600" />
              Recent Achievements
            </h3>
            
            <div className="space-y-4">
              {user.achievements.map((achievement: any, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{achievement.description}</p>
                    <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}