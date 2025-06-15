'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import StatCard from '@/components/ui/stat-card';
import { organizationStats, turnoverRiskData, engagementHeatmapData } from '@/lib/dummy-data';
import { TrendingDown, TrendingUp, Users, Heart, AlertTriangle, DollarSign, Target, Award, Zap } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      {/* Modern Header - Responsive */}
      <div className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
        <div className="relative z-10 animate-slide-in-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Dashboard Overview</h1>
          <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Monitor your organization's retention metrics and employee engagement</p>
        </div>
      </div>

      {/* Enhanced Key Metrics - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: "Turnover Reduction",
            value: `${organizationStats.turnoverReduction}%`,
            change: "↓ 12% from last quarter",
            changeType: "positive",
            icon: TrendingDown,
            gradient: "from-green-500 to-emerald-600",
            bgPattern: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
          },
          {
            title: "Revenue Increase",
            value: `${organizationStats.revenueIncrease}%`,
            change: "↑ 8% from last quarter",
            changeType: "positive",
            icon: DollarSign,
            gradient: "from-blue-500 to-blue-600",
            bgPattern: "from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30"
          },
          {
            title: "Customer Satisfaction",
            value: `${organizationStats.customerSatisfactionIncrease}%`,
            change: "↑ 3% improvement",
            changeType: "positive",
            icon: Heart,
            gradient: "from-pink-500 to-rose-600",
            bgPattern: "from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30"
          },
          {
            title: "At-Risk Employees",
            value: organizationStats.riskEmployees,
            change: "↓ 5 from last month",
            changeType: "positive",
            icon: AlertTriangle,
            gradient: "from-orange-500 to-amber-600",
            bgPattern: "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30"
          }
        ].map((stat, index) => (
          <div key={stat.title} className="modern-card hover-lift overflow-hidden" style={{animationDelay: `${index * 0.1}s`}}>
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Section - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Enhanced Turnover Risk Prediction */}
        <div className="modern-card p-4 sm:p-6 lg:p-8 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Turnover Risk Prediction</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">AI-powered predictive analytics</p>
            </div>
            <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={turnoverRiskData}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#ef4444" 
                  fillOpacity={1}
                  fill="url(#riskGradient)"
                  strokeWidth={2}
                  name="Predicted Risk"
                />
                <Area
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#actualGradient)"
                  strokeWidth={2}
                  name="Actual Turnover"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Team Engagement Overview */}
        <div className="modern-card p-4 sm:p-6 lg:p-8 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Team Engagement Overview</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Real-time engagement metrics</p>
            </div>
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementHeatmapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="team" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={10}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="engagement" 
                  fill="url(#engagementGradient)" 
                  name="Engagement Score" 
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Engagement and Stress Metrics - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="modern-card p-4 sm:p-6 lg:p-8 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Average Engagement Score</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Team satisfaction metrics</p>
            </div>
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">{organizationStats.avgEngagementScore}</div>
            <div className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">out of 10</div>
          </div>
          <div className="progress-bar h-3 sm:h-4 mb-3 sm:mb-4">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(organizationStats.avgEngagementScore / 10) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">Based on {organizationStats.totalEmployees} employee responses</p>
        </div>

        <div className="modern-card p-4 sm:p-6 lg:p-8 hover-lift">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Average Stress Level</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Workplace wellness indicators</p>
            </div>
            <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-4xl sm:text-5xl font-bold text-orange-600 mb-2">{organizationStats.avgStressLevel}</div>
            <div className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">out of 10</div>
          </div>
          <div className="progress-bar h-3 sm:h-4 mb-3 sm:mb-4">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(organizationStats.avgStressLevel / 10) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">Optimal range: 2-4 (Low to Moderate)</p>
        </div>
      </div>

      {/* Enhanced Quick Actions - Responsive */}
      <div className="modern-card p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Schedule 1-on-1s",
              description: "Connect with at-risk employees",
              icon: Users,
              gradient: "from-blue-500 to-blue-600",
              action: "Schedule"
            },
            {
              title: "Send Recognition",
              description: "Boost team morale with shoutouts",
              icon: Award,
              gradient: "from-green-500 to-green-600",
              action: "Recognize"
            },
            {
              title: "Review Goals",
              description: "Check team OKR progress",
              icon: Target,
              gradient: "from-purple-500 to-purple-600",
              action: "Review"
            }
          ].map((action, index) => (
            <button key={action.title} className="modern-card p-4 sm:p-6 text-left hover-lift group w-full" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${action.gradient} text-white group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-1">{action.title}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mb-3 sm:mb-4">{action.description}</div>
                  <div className={`inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r ${action.gradient} text-white rounded-lg text-xs sm:text-sm font-semibold group-hover:shadow-lg transition-all duration-200`}>
                    {action.action}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}