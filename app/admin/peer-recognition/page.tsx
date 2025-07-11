'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { shoutoutsData } from '@/lib/dummy-data';
import { Award, Heart, Send, Slack, MessageSquare, Target, TrendingUp, Users, X, Sparkles, Zap } from 'lucide-react';

const companyValues = [
  'Excellence', 'Collaboration', 'Innovation', 'Customer Focus', 
  'Integrity', 'Teamwork', 'Leadership', 'Growth Mindset'
];

const emojiOptions = ['🌟', '🚀', '💪', '🎯', '👏', '🔥', '💡', '🏆'];

// Add margin to top so header doesn't cut content (same as 1on1 page)
const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
export default function Shoutouts() {
  const [showShoutoutForm, setShowShoutoutForm] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('🌟');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [animateCards, setAnimateCards] = useState(false);
  const [likedShoutouts, setLikedShoutouts] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    recipient: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const handleValueToggle = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleLike = (shoutoutId: number) => {
    setLikedShoutouts(prev => 
      prev.includes(shoutoutId)
        ? prev.filter(id => id !== shoutoutId)
        : [...prev, shoutoutId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipient || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert('Shoutout sent successfully!');
      setFormData({
        recipient: '',
        message: ''
      });
      setSelectedValues([]);
      setSelectedEmoji('🌟');
      setShowShoutoutForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className={`space-y-8 animate-fade-in ${pageTopMargin}`}>
      {/* Modern Header - Responsive with Sparkling Animation */}
      <motion.div
        initial={{ opacity: 0, rotateY: -15 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white overflow-hidden relative"
      >
        {/* Sparkling stars animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-8 left-12 text-white/30"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <motion.div
            className="absolute top-16 right-20 text-white/25"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-16 text-white/20"
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 270, 540],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 right-12 text-white/15"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, -180],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            <Sparkles className="h-3 w-3" />
          </motion.div>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
            >
              Peer Recognition
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-orange-100 text-sm sm:text-base lg:text-lg"
            >
              Celebrate and recognize great work
            </motion.p>
          </div>
          <button
            onClick={() => setShowShoutoutForm(true)}
            className="group bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start backdrop-blur-sm"
          >
            <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold text-sm sm:text-base">Give Shoutout</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Enhanced Integration Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="group flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <Slack className="h-5 w-5 mr-3 text-purple-600 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Share to Slack</span>
        </button>
        <button className="group flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <MessageSquare className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Share to Teams</span>
        </button>
        <button className="group flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <Sparkles className="h-5 w-5 mr-3 text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Public Board</span>
        </button>
      </div>

      {/* Enhanced Shoutout Form Modal */}
      {showShoutoutForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl mr-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Give a Shoutout
              </h3>
              <button
                onClick={() => setShowShoutoutForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recognize</label>
                <select 
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="">Select person or team...</option>
                  <option value="Bravely">Bravely</option>
                  <option value="Dzikri">Dzikri</option>
                  <option value="Engineering Team">Engineering Team</option>
                  <option value="Marketing Team">Marketing Team</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Choose Emoji</label>
                <div className="grid grid-cols-8 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`p-3 rounded-2xl text-2xl transition-all duration-300 hover:scale-110 ${
                        selectedEmoji === emoji 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 scale-110' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Company Values</label>
                <div className="grid grid-cols-2 gap-3">
                  {companyValues.map((value) => (
                    <label 
                      key={value} 
                      className={`flex items-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedValues.includes(value)
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300 dark:border-amber-600 shadow-md'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(value)}
                        onChange={() => handleValueToggle(value)}
                        className="rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500 mr-3"
                      />
                      <span className={`text-sm font-medium ${
                        selectedValues.includes(value) ? 'text-amber-800 dark:text-amber-200' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Share what made their work exceptional..."
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowShoutoutForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Shoutout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Shoutouts Feed */}
      <div className="space-y-6">
        {shoutoutsData.map((shoutout, index) => {
          const isLiked = likedShoutouts.includes(shoutout.id);
          
          return (
            <div 
              key={shoutout.id} 
              className={`group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              
              <div className="relative p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                      {shoutout.emoji}
                      <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{shoutout.from}</span>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">recognized</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{shoutout.to}</span>
                      <div className="flex-1"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
                        {new Date(shoutout.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed bg-gradient-to-r from-gray-50 to-amber-50/50 dark:from-gray-700 dark:to-amber-900/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-600">
                      {shoutout.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {shoutout.values.map((value) => (
                          <span
                            key={value}
                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-700 shadow-sm"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => handleLike(shoutout.id)}
                        className={`group/like flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          isLiked 
                            ? 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-700'
                        }`}
                      >
                        <Heart className={`h-4 w-4 group-hover/like:scale-110 transition-transform ${
                          isLiked ? 'fill-current' : ''
                        }`} />
                        <span className="font-medium">
                          {isLiked ? shoutout.likes + 1 : shoutout.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Recognition Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recognition Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Shoutouts Given', value: 48, icon: Send, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30' },
            { label: 'Shoutouts Received', value: 32, icon: Award, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30' },
            { label: 'Total Likes', value: 156, icon: Heart, color: 'from-red-500 to-pink-500', bgColor: 'from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30' },
            { label: 'Team Participation', value: '89%', icon: Users, color: 'from-purple-500 to-violet-500', bgColor: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30' },
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className={`group relative bg-gradient-to-r ${stat.bgColor} rounded-2xl p-6 border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}