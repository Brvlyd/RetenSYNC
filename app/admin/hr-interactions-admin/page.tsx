'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Award, MessageSquare, Calendar, TrendingUp, Heart } from 'lucide-react';

export default function HRInteractionsPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const interactionTypes = [
    {
      id: 'shoutouts',
      title: 'Peer Recognition',
      description: 'Celebrate achievements and recognize great work across teams',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
      stats: [
        { label: 'Total Recognitions', value: '156' },
        { label: 'This Month', value: '24' },
        { label: 'Team Participation', value: '89%' }
      ],
      features: [
        'Company values alignment',
        'Peer-to-peer recognition',
        'Team celebrations',
        'Achievement tracking'
      ],
      route: '/shoutouts'
    },
    {
      id: 'meetings',
      title: '1-on-1 Meetings',
      description: 'Build stronger relationships through meaningful conversations',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
      stats: [
        { label: 'Scheduled Meetings', value: '48' },
        { label: 'Completion Rate', value: '96%' },
        { label: 'Avg Duration', value: '45min' }
      ],
      features: [
        'Career development discussions',
        'Performance feedback',
        'Goal setting and tracking',
        'Personal growth planning'
      ],
      route: '/1on1'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-teal-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl lg:rounded-3xl shadow-lg">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 dark:from-gray-100 dark:via-purple-100 dark:to-blue-100 bg-clip-text text-transparent">
                HR Interactions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Foster engagement through recognition and meaningful conversations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Type Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {interactionTypes.map((type, index) => (
          <div
            key={type.id}
            className={`group relative bg-gradient-to-r ${type.bgColor} rounded-2xl lg:rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-105`}
            style={{ animationDelay: `${index * 200}ms` }}
            onMouseEnter={() => setHoveredCard(type.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => router.push(type.route)}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${type.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {type.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white">Key Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full bg-gradient-to-r ${type.color} text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center space-x-2`}
              >
                <span>Access {type.title}</span>
                <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </button>
            </div>

            {/* Hover Effect Indicator */}
            {hoveredCard === type.id && (
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Interaction Impact</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Employee Satisfaction', value: '94%', change: '+5%', icon: Heart, color: 'from-pink-500 to-rose-500' },
            { label: 'Engagement Score', value: '8.7/10', change: '+0.4', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
            { label: 'Retention Rate', value: '96%', change: '+3%', icon: Users, color: 'from-emerald-500 to-teal-500' },
            { label: 'Team Collaboration', value: '91%', change: '+7%', icon: MessageSquare, color: 'from-purple-500 to-violet-500' }
          ].map((metric, index) => (
            <div key={metric.label} className="text-center">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg mx-auto w-fit mb-3`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {metric.change} this quarter
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}