'use client';

import React, { useState, useEffect } from 'react';
import { learningData } from '@/lib/dummy-data';
import { BookOpen, Clock, CheckCircle, ThumbsUp, Play, Star, TrendingUp, Award, Zap } from 'lucide-react';

export default function Learning() {
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [animateStats, setAnimateStats] = useState(false);
  
  useEffect(() => {
    setAnimateStats(true);
  }, []);

  const handleComplete = (id: number) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Modern Header with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 dark:from-gray-100 dark:via-purple-100 dark:to-violet-100 bg-clip-text text-transparent">
                    Skills Coach
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Personalized micro-learning for continuous growth</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl">🚀</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Level Up</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Learning Progress with Animations */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 rounded-3xl opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 mr-3" />
              Your Learning Journey
            </h3>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="h-4 w-4" />
              <span className="font-medium">Streak: 7 days</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Items Completed This Week', value: 7, icon: Award, color: 'from-emerald-400 to-cyan-400' },
              { label: 'Time Invested', value: '23min', icon: Clock, color: 'from-orange-400 to-pink-400' },
              { label: 'Weekly Goal Progress', value: '85%', icon: Zap, color: 'from-violet-400 to-purple-400' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      {React.createElement(stat.icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    <div className={`text-3xl font-bold transition-all duration-1000 ${animateStats ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Weekly Progress</span>
              <span className="text-sm font-medium text-white">85% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full transition-all duration-1000 shadow-lg" 
                style={{ width: animateStats ? '85%' : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Recommendations Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Zap className="h-6 w-6 mr-3 text-violet-600" />
            Today's Recommendations
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Live updates</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningData.map((item, index) => {
            const isCompleted = completedItems.includes(item.id) || item.completed;
            
            return (
              <div 
                key={item.id} 
                className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25' 
                          : 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/25'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            item.type === 'micro-learning' 
                              ? 'bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700'
                              : 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-700'
                          }`}>
                            {item.type}
                          </span>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
                            <Clock className="h-3 w-3 mr-2" />
                            {item.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="animate-bounce">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{item.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {!isCompleted ? (
                        <button
                          onClick={() => handleComplete(item.id)}
                          className="group/btn bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Play className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Start Learning
                        </button>
                      ) : (
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-200 px-6 py-3 rounded-2xl flex items-center text-sm font-semibold border border-emerald-200 dark:border-emerald-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </div>
                      )}
                    </div>
                    
                    {isCompleted && (
                      <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group/thumb">
                        <ThumbsUp className="h-4 w-4 group-hover/thumb:scale-110 transition-transform" />
                        <span className="font-medium">Helpful ({item.helpful})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Learning Categories */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Award className="h-6 w-6 mr-3 text-violet-600" />
          Learning Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Leadership', count: 12, color: 'from-blue-500 to-cyan-500', emoji: '👑' },
            { name: 'Technical Skills', count: 18, color: 'from-emerald-500 to-teal-500', emoji: '⚡' },
            { name: 'Communication', count: 8, color: 'from-purple-500 to-violet-500', emoji: '💬' },
            { name: 'Project Management', count: 15, color: 'from-orange-500 to-amber-500', emoji: '📊' },
          ].map((category, index) => (
            <div 
              key={category.name} 
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {category.emoji}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {category.count}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${category.color} text-white shadow-lg`}>
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Weekly Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Star className="h-6 w-6 mr-3 text-violet-600" />
          This Week's Learning Goals
        </h3>
        <div className="space-y-6">
          {[
            { goal: 'Complete 5 micro-learning modules', progress: 80, current: 4, total: 5, color: 'from-violet-500 to-purple-500' },
            { goal: 'Spend 30 minutes on skill development', progress: 76, current: 23, total: 30, color: 'from-emerald-500 to-teal-500' },
            { goal: 'Share feedback on 3 learning items', progress: 66, current: 2, total: 3, color: 'from-orange-500 to-amber-500' },
          ].map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {item.goal}
                </span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
                  {item.current}/{item.total}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden`}
                  style={{ width: `${item.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}