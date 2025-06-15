'use client';

import { useState, useEffect } from 'react';
import { oneOnOneData } from '@/lib/dummy-data';
import { Calendar, Clock, User, Plus, Video, MessageSquare, Target, TrendingUp, Users, X } from 'lucide-react';

export default function OneOnOne() {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Modern Header with Glassmorphism - Responsive */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl lg:rounded-3xl shadow-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-gray-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                  1-on-1 Meetings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Build stronger relationships through meaningful conversations</p>
              </div>
            </div>
            <button
              onClick={() => setShowScheduleForm(true)}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-sm sm:text-base">Schedule Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Schedule Form Modal - Responsive */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-md lg:max-w-2xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-2 sm:mr-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <span className="hidden sm:inline">Schedule 1-on-1 Meeting</span>
                <span className="sm:hidden">Schedule Meeting</span>
              </h3>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                    Feedback Type
                  </label>
                  <select className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base">
                    <option>Peer Feedback</option>
                    <option>Upward Feedback</option>
                    <option>Self Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                    Recipient
                  </label>
                  <select className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base">
                    <option>Select recipient...</option>
                    <option>Aulia</option>
                    <option>Tasya</option>
                    <option>Annisa</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Project/Context
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q4 Product Launch"
                  className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Meeting Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Share agenda and talking points..."
                  className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl lg:rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl lg:rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Meetings List - Responsive */}
      <div className="space-y-4 sm:space-y-6">
        {oneOnOneData.map((meeting, index) => (
          <div 
            key={meeting.id} 
            className={`group bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
              animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl lg:rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">
                        {meeting.with}
                      </h3>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        meeting.status === 'completed' 
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700'
                          : meeting.status === 'upcoming'
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                          : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{new Date(meeting.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{meeting.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 sm:col-span-2 lg:col-span-1">
                        <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{meeting.agenda && meeting.agenda.length > 0 ? meeting.agenda[0] : 'No topic'}</span>
                      </div>
                    </div>

                    {meeting.notes && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl lg:rounded-2xl p-3 sm:p-4 border border-gray-100 dark:border-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Meeting Notes:</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{meeting.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 w-full lg:w-auto">
                  {meeting.status === 'upcoming' && (
                    <button className="group/btn flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 text-sm font-medium flex-1 lg:flex-initial">
                      <Video className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      <span>Join</span>
                    </button>
                  )}
                  <button className="group/btn flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-300 text-sm font-medium flex-1 lg:flex-initial">
                    <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Notes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Meeting Stats - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl lg:rounded-2xl">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Meeting Insights</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[
            { label: 'Total Meetings', value: 24, icon: Calendar, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30' },
            { label: 'This Month', value: 8, icon: Users, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30' },
            { label: 'Avg Duration', value: '45min', icon: Clock, color: 'from-purple-500 to-violet-500', bgColor: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30' },
            { label: 'Satisfaction', value: '96%', icon: Target, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30' },
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className={`group relative bg-gradient-to-r ${stat.bgColor} rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 lg:space-y-4">
                <div className={`p-2 sm:p-3 rounded-lg lg:rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}