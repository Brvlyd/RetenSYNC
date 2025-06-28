'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import StatCard from '@/components/ui/stat-card';
import { organizationStats, turnoverRiskData, engagementHeatmapData } from '@/lib/dummy-data';
import { TrendingDown, TrendingUp, Users, Heart, AlertTriangle, DollarSign, Target, Award, Zap, UserPlus, Settings, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Admin Dashboard
  if (user?.role === 'admin') {
    return (
      <div className="space-y-6 lg:space-y-8 animate-fade-in">
        {/* Admin Header */}
        <div className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-purple-600 via-blue-700 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
          <div className="relative z-10 animate-slide-in-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Welcome back, {user.name}! Monitor your organization's performance</p>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <button className="modern-card p-4 sm:p-6 text-left hover-lift group w-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white group-hover:scale-110 transition-transform duration-200">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">Manage Users</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Add, edit, or remove employees</div>
              </div>
            </div>
          </button>

          <button className="modern-card p-4 sm:p-6 text-left hover-lift group w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="h-6 w-6" />
              </div>a
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">View Reports</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Detailed analytics and insights</div>
              </div>
            </div>
          </button>

          <button className="modern-card p-4 sm:p-6 text-left hover-lift group w-full bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white group-hover:scale-110 transition-transform duration-200">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">System Settings</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Configure system preferences</div>
              </div>
            </div>
          </button>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: "Total Employees",
              value: organizationStats.totalEmployees,
              change: "↑ 12 new hires this month",
              changeType: "positive",
              icon: Users,
              gradient: "from-blue-500 to-cyan-500",
              bgPattern: "from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30"
            },
            {
              title: "Turnover Reduction",
              value: `${organizationStats.turnoverReduction}%`,
              change: "↓ 12% from last quarter",
              changeType: "positive",
              icon: TrendingDown,
              gradient: "from-emerald-500 to-teal-500",
              bgPattern: "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
            },
            {
              title: "Revenue Increase",
              value: `${organizationStats.revenueIncrease}%`,
              change: "↑ 8% from last quarter",
              changeType: "positive",
              icon: DollarSign,
              gradient: "from-green-500 to-emerald-500",
              bgPattern: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30"
            },
            {
              title: "At-Risk Employees",
              value: organizationStats.riskEmployees,
              change: "↓ 5 from last month",
              changeType: "positive",
              icon: AlertTriangle,
              gradient: "from-orange-500 to-amber-500",
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Turnover Risk Prediction */}
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

          {/* Team Engagement Overview */}
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
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      {/* User Header */}
      <div className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
        <div className="relative z-10 animate-slide-in-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">My Dashboard</h1>
          <p className="text-emerald-100 text-sm sm:text-base lg:text-lg">Welcome back, {user?.name || 'User'}! Track your performance and goals</p>
        </div>
      </div>

      {/* User Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <button className="modern-card p-4 sm:p-6 text-left hover-lift group w-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white group-hover:scale-110 transition-transform duration-200">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-lg">My Goals</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Track your objectives and progress</div>
            </div>
          </div>
        </button>

        <button className="modern-card p-4 sm:p-6 text-left hover-lift group w-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white group-hover:scale-110 transition-transform duration-200">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-lg">My Performance</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">View feedback and reviews</div>
            </div>
          </div>
        </button>
      </div>

      {/* User Personal Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: "Goals Completed",
            value: "8/12",
            change: "67% completion rate",
            changeType: "positive",
            icon: Target,
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            title: "Feedback Received",
            value: "15",
            change: "This month",
            changeType: "neutral",
            icon: Heart,
            gradient: "from-emerald-500 to-teal-500",
          },
          {
            title: "Learning Hours",
            value: "24h",
            change: "This quarter",
            changeType: "positive",
            icon: Award,
            gradient: "from-purple-500 to-violet-500",
          },
          {
            title: "Performance Score",
            value: "4.2/5",
            change: "Above average",
            changeType: "positive",
            icon: TrendingUp,
            gradient: "from-orange-500 to-amber-500",
          }
        ].map((stat, index) => (
          <div key={stat.title} className="modern-card hover-lift overflow-hidden" style={{animationDelay: `${index * 0.1}s`}}>
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="modern-card p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-yellow-500" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: "Completed goal: Improve team collaboration", time: "2 hours ago", type: "success" },
            { action: "Received feedback from Bravely Dirgayuska", time: "1 day ago", type: "info" },
            { action: "Started learning module: Leadership Skills", time: "3 days ago", type: "learning" },
            { action: "Attended 1-on-1 meeting with manager", time: "1 week ago", type: "meeting" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'info' ? 'bg-blue-500' :
                activity.type === 'learning' ? 'bg-purple-500' :
                'bg-orange-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}