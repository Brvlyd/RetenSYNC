'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { fetchUsers } from '@/app/api/usersApi';
import { calculateRiskLevel } from '@/app/api/mlPerformanceApi';

// Custom tooltip for Risk Trend
function CustomRiskTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { month, risk, actual } = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="font-semibold text-gray-900 dark:text-white mb-1">
          {month}
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          Predicted Risk: {risk}
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          Actual Turnover: {actual}
        </div>
      </div>
    );
  }
  return null;
}

// Custom tooltip for Engagement Heatmap
function CustomEngagementTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { engagement, stress } = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="font-semibold text-gray-900 dark:text-white mb-1">
          Engagement: {engagement}
        </div>
        <div className="text-gray-600 dark:text-gray-300">Stress: {stress}</div>
      </div>
    );
  }
  return null;
}

// Add margin to top so header doesn't cut content (same as 1on1 page)
const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
export default function Analytics() {
  const { user } = useAuth();
  const router = useRouter();
  const [animateProgress, setAnimateProgress] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [turnoverData, setTurnoverData] = useState<any[]>([]);
  const [organizationMetrics, setOrganizationMetrics] = useState({
    teamEngagement: 0,
    activeEmployees: 0,
    atRiskCount: 0,
    goalCompletion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAnimateProgress(true);

    // Check if user is logged in and is admin
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/user/dashboard');
      return;
    }

    loadPerformanceData();
  }, [router, user]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();

      // Convert to performance analytics format
      const analyticsData = data.map(user => ({
        id: user.id,
        name: user.name,
        performance: Math.round((user.last_evaluation || 0) * 100) / 10,
        engagement: Math.round((user.satisfaction_level || 0) * 100) / 10,
        feedback:
          Math.round(
            ((user.last_evaluation || 0) + (user.satisfaction_level || 0)) * 50
          ) / 10,
        satisfaction: Math.round((user.satisfaction_level || 0) * 100) / 10,
        department: user.department,
        risk: calculateRiskLevel({
          satisfaction_level: user.satisfaction_level || 0,
          last_evaluation: user.last_evaluation || 0,
          work_accident: user.work_accident || false,
          promotion_last_5years: user.promotion_last_5years || false,
          employee: user.id,
          employee_name: user.name,
          employee_email: user.email,
          department_name: user.department,
          number_project: user.number_project || 0,
          average_monthly_hours: user.average_monthly_hours || 0,
          time_spend_company: user.time_spend_company || 0,
          left: user.left || false,
          created_at: '',
          updated_at: '',
        }).level.toLowerCase(),
      }));

      setPerformanceData(analyticsData);

      // Generate engagement heatmap data by department
      const departmentMap = new Map();
      analyticsData.forEach(emp => {
        const dept = emp.department;
        if (!departmentMap.has(dept)) {
          departmentMap.set(dept, {
            team: dept,
            engagementTotal: 0,
            stressTotal: 0,
            count: 0,
          });
        }
        const deptData = departmentMap.get(dept);
        deptData.engagementTotal += emp.engagement;
        deptData.stressTotal += (10 - emp.satisfaction) * 0.5; // Convert satisfaction to stress
        deptData.count += 1;
      });

      const engagementHeatmap = Array.from(departmentMap.values()).map(
        dept => ({
          team: dept.team,
          engagement: Math.round((dept.engagementTotal / dept.count) * 10) / 10,
          stress: Math.round((dept.stressTotal / dept.count) * 10) / 10,
          size: dept.count,
        })
      );

      setEngagementData(engagementHeatmap);

      // Generate turnover risk trend data
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const riskData = months.map(month => {
        const riskCount = analyticsData.filter(
          emp => emp.risk === 'high'
        ).length;
        const baseRisk = riskCount + Math.floor(Math.random() * 5);
        const actualTurnover =
          Math.floor(baseRisk * 0.7) + Math.floor(Math.random() * 3);
        return {
          month,
          risk: baseRisk,
          actual: actualTurnover,
        };
      });

      setTurnoverData(riskData);

      // Calculate organization metrics
      const totalEmployees = analyticsData.length;
      const avgEngagement =
        analyticsData.reduce((sum, emp) => sum + emp.engagement, 0) /
        totalEmployees;
      const atRiskCount = analyticsData.filter(
        emp => emp.risk === 'high'
      ).length;
      const goalCompletion = 70 + Math.random() * 20; // Simulated goal completion

      setOrganizationMetrics({
        teamEngagement: Math.round(avgEngagement * 10) / 10,
        activeEmployees: totalEmployees,
        atRiskCount,
        goalCompletion: Math.round(goalCompletion),
      });
    } catch (err) {
      console.error('Error loading performance data:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPerformanceData();
  };

  // Don't render anything for non-admin users
  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div
        className={`space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
      >
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
            <p className="text-lg font-semibold">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
    case 'low':
      return '#10b981';
    case 'medium':
      return '#f59e0b';
    case 'high':
      return '#ef4444';
    default:
      return '#6b7280';
    }
  };

  const handleEmployeeClick = (employee: any) => {
    router.push(`/admin/analytics/employee/${employee.id}`);
  };

  return (
    <div
      className={`space-y-6 lg:space-y-8 animate-fade-in p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
    >
      {/* Modern Header - Responsive with Wave Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="modern-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-700 text-white overflow-hidden relative"
      >
        {/* Animated wave pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
            <defs>
              <linearGradient
                id="wave-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,200 Q200,150 400,200 T800,200 V400 H0 Z"
              fill="url(#wave-gradient)"
              initial={{ d: 'M0,200 Q200,150 400,200 T800,200 V400 H0 Z' }}
              animate={{
                d: [
                  'M0,200 Q200,150 400,200 T800,200 V400 H0 Z',
                  'M0,200 Q200,250 400,200 T800,200 V400 H0 Z',
                  'M0,200 Q200,150 400,200 T800,200 V400 H0 Z',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.path
              d="M0,220 Q200,180 400,220 T800,220 V400 H0 Z"
              fill="rgba(255,255,255,0.1)"
              initial={{ d: 'M0,220 Q200,180 400,220 T800,220 V400 H0 Z' }}
              animate={{
                d: [
                  'M0,220 Q200,180 400,220 T800,220 V400 H0 Z',
                  'M0,220 Q200,260 400,220 T800,220 V400 H0 Z',
                  'M0,220 Q200,180 400,220 T800,220 V400 H0 Z',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </svg>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
          >
            Performance Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-blue-100 text-sm sm:text-base lg:text-lg"
          >
            Advanced analytics and team engagement intelligence
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Enhanced Key Metrics - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            title: 'Team Engagement',
            value: `${organizationMetrics.teamEngagement}/10`,
            change: '↑ 0.3 from last month',
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-600',
            bgGradient:
              'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
          },
          {
            title: 'Active Employees',
            value: organizationMetrics.activeEmployees.toString(),
            change: '98.4% participation',
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient:
              'from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30',
          },
          {
            title: 'At-Risk Count',
            value: organizationMetrics.atRiskCount.toString(),
            change: `${Math.round((organizationMetrics.atRiskCount / organizationMetrics.activeEmployees) * 100)}% of workforce`,
            icon: AlertTriangle,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient:
              'from-orange-50 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/30',
          },
          {
            title: 'Goal Completion',
            value: `${organizationMetrics.goalCompletion}%`,
            change: 'Above target',
            icon: Target,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient:
              'from-purple-50 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/30',
          },
        ].map((metric, index) => (
          <div
            key={metric.title}
            className="modern-card hover-lift overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`h-1 bg-gradient-to-r ${metric.gradient}`}></div>
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center justify-between lg:block">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {metric.title}
                    </p>
                    <p className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 lg:mt-2">
                      {metric.value}
                    </p>
                  </div>
                  <div className="lg:hidden">
                    <div
                      className={`p-2 sm:p-3 rounded-xl lg:rounded-2xl bg-gradient-to-r ${metric.gradient} text-white shadow-lg`}
                    >
                      <metric.icon className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div
                    className={`p-3 lg:p-4 rounded-2xl bg-gradient-to-r ${metric.gradient} text-white shadow-lg`}
                  >
                    <metric.icon className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 lg:mt-1">
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Enhanced Team Engagement Heatmap - Responsive */}
        <div className="modern-card p-4 sm:p-6 lg:p-8 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Team Engagement vs Stress
            </h3>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
          <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={engagementData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  name="Engagement Score"
                  domain={[0, 10]}
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  dataKey="stress"
                  name="Stress Level"
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={CustomEngagementTooltip} />
                <Scatter dataKey="engagement">
                  {engagementData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.stress > 3.5
                          ? '#ef4444'
                          : entry.engagement > 8
                            ? '#10b981'
                            : '#f59e0b'
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Risk Prediction Trend - Responsive */}
        <div className="modern-card p-4 sm:p-6 lg:p-8 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Monthly Risk Trend
            </h3>
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
          <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turnoverData.slice(-6)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={CustomRiskTooltip} />
                <Bar
                  dataKey="risk"
                  fill="url(#riskGradient)"
                  name="Predicted Risk"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  fill="url(#actualGradient)"
                  name="Actual Turnover"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <linearGradient
                    id="actualGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Performance Table - Responsive */}
      <div className="modern-card overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            Individual Performance Matrix
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Click on any employee to view detailed analytics
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <tr>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Performance
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Engagement
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Satisfaction
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {performanceData.map((employee, index) => (
                <tr
                  key={employee.name}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {employee.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          {employee.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Team Member
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {employee.performance}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(employee.performance / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap hidden md:table-cell">
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {employee.engagement}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(employee.engagement / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {employee.satisfaction}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(employee.satisfaction / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 whitespace-nowrap">
                    <span
                      className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor: getRiskColor(employee.risk) + '20',
                        color: getRiskColor(employee.risk),
                        borderColor: getRiskColor(employee.risk) + '30',
                      }}
                    >
                      {employee.risk.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
