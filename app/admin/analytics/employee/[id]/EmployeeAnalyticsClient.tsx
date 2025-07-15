'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  MessageSquare,
  Award,
} from 'lucide-react';
import {
  fetchPerformanceData,
  predictTurnoverRisk,
  PerformanceData,
} from '@/app/api/mlPerformanceApi';

interface EmployeeDetail {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  joinDate: string;
  performance: number;
  engagement: number;
  feedback: number;
  satisfaction: number;
  risk: 'low' | 'medium' | 'high';
  riskScore: number;
  avatar?: string;
  workAccident: boolean;
  promotionLast5Years: boolean;
  numberOfProjects: number;
  averageMonthlyHours: number;
  timeSpendCompany: number;
  lastEvaluation: number;
}

interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

interface Intervention {
  type: string;
  priority: 'urgent' | 'high' | 'medium';
  action: string;
  timeline: string;
  owner: string;
}

export default function EmployeeAnalyticsClient({ id }: { id: string }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to convert performance data to employee detail
  const convertToEmployeeDetail = (data: PerformanceData): EmployeeDetail => {
    // Calculate derived metrics based on real data
    const performance = data.last_evaluation * 10; // Convert 0-1 to 0-10 scale
    const engagement = Math.max(
      1,
      Math.min(
        10,
        data.satisfaction_level * 10 + (data.promotion_last_5years ? 1 : 0)
      )
    ); // Enhanced by promotion
    const feedback = Math.max(
      1,
      Math.min(
        10,
        data.last_evaluation * 10 + (data.number_project > 3 ? 1 : 0)
      )
    ); // Enhanced by projects
    const satisfaction = data.satisfaction_level * 10;

    // Calculate risk score based on multiple factors
    let riskScore = 0;

    // Low satisfaction increases risk
    if (satisfaction < 5) riskScore += 30;
    else if (satisfaction < 7) riskScore += 15;

    // No promotion in 5 years increases risk
    if (!data.promotion_last_5years && data.time_spend_company >= 2)
      riskScore += 20;

    // High working hours increases risk
    if (data.average_monthly_hours > 200) riskScore += 25;
    else if (data.average_monthly_hours > 160) riskScore += 10;

    // Work accident increases risk
    if (data.work_accident) riskScore += 15;

    // Low evaluation increases risk
    if (data.last_evaluation < 0.5) riskScore += 20;
    else if (data.last_evaluation < 0.7) riskScore += 10;

    // Too many or too few projects
    if (data.number_project > 6) riskScore += 10;
    else if (data.number_project < 2) riskScore += 15;

    // Determine risk level
    let risk: 'low' | 'medium' | 'high' = 'low';
    if (riskScore >= 60) risk = 'high';
    else if (riskScore >= 30) risk = 'medium';

    return {
      id: data.employee,
      name: data.employee_name,
      position: 'Employee', // This could be derived from department or set generically
      department: data.department_name,
      email: data.employee_email,
      joinDate: data.created_at,
      performance,
      engagement,
      feedback,
      satisfaction,
      risk,
      riskScore,
      workAccident: data.work_accident,
      promotionLast5Years: data.promotion_last_5years,
      numberOfProjects: data.number_project,
      averageMonthlyHours: data.average_monthly_hours,
      timeSpendCompany: data.time_spend_company,
      lastEvaluation: data.last_evaluation,
    };
  };

  // Generate risk factors based on real data
  const generateRiskFactors = (employeeData: EmployeeDetail): RiskFactor[] => {
    const factors: RiskFactor[] = [];

    if (employeeData.satisfaction < 6) {
      factors.push({
        factor: 'Low Satisfaction Score',
        impact: 'high',
        description: `Satisfaction score below average (${employeeData.satisfaction.toFixed(1)} vs 7.0 company average)`,
      });
    }

    if (employeeData.engagement < 6) {
      factors.push({
        factor: 'Low Engagement Score',
        impact: 'high',
        description: `Engagement score below company average (${employeeData.engagement.toFixed(1)} vs 8.2)`,
      });
    }

    if (
      !employeeData.promotionLast5Years &&
      employeeData.timeSpendCompany >= 2
    ) {
      factors.push({
        factor: 'Limited Career Growth',
        impact: 'medium',
        description: `No promotion in the last 5 years despite ${employeeData.timeSpendCompany} years in company`,
      });
    }

    if (employeeData.averageMonthlyHours > 200) {
      factors.push({
        factor: 'High Workload',
        impact: 'high',
        description: `Working ${employeeData.averageMonthlyHours} hours per month (above 200 hour threshold)`,
      });
    } else if (employeeData.averageMonthlyHours > 160) {
      factors.push({
        factor: 'Moderate Workload Stress',
        impact: 'medium',
        description: `Working ${employeeData.averageMonthlyHours} hours per month (above standard 160 hours)`,
      });
    }

    if (employeeData.workAccident) {
      factors.push({
        factor: 'Workplace Safety Incident',
        impact: 'medium',
        description:
          'Has experienced a work-related accident, may affect morale and safety perception',
      });
    }

    if (employeeData.lastEvaluation < 0.5) {
      factors.push({
        factor: 'Low Performance Evaluation',
        impact: 'high',
        description: `Recent evaluation score is ${(employeeData.lastEvaluation * 100).toFixed(1)}% - below expectations`,
      });
    }

    if (employeeData.numberOfProjects > 6) {
      factors.push({
        factor: 'Project Overload',
        impact: 'medium',
        description: `Currently handling ${employeeData.numberOfProjects} projects - may lead to burnout`,
      });
    } else if (employeeData.numberOfProjects < 2) {
      factors.push({
        factor: 'Low Project Engagement',
        impact: 'low',
        description: `Only ${employeeData.numberOfProjects} active projects - may indicate underutilization`,
      });
    }

    return factors;
  };

  // Generate interventions based on risk factors
  const generateInterventions = (
    employeeData: EmployeeDetail,
    riskFactors: RiskFactor[]
  ): Intervention[] => {
    const interventions: Intervention[] = [];

    // High priority interventions for high-risk factors
    const highRiskFactors = riskFactors.filter(f => f.impact === 'high');

    if (
      highRiskFactors.some(
        f =>
          f.factor.includes('Satisfaction') || f.factor.includes('Engagement')
      )
    ) {
      interventions.push({
        type: 'Engagement & Satisfaction',
        priority: 'urgent',
        action:
          'Schedule immediate 1-on-1 discussion to understand concerns and create engagement plan',
        timeline: 'Within 3 days',
        owner: 'Direct Manager',
      });
    }

    if (
      !employeeData.promotionLast5Years &&
      employeeData.timeSpendCompany >= 2
    ) {
      interventions.push({
        type: 'Career Development',
        priority: 'urgent',
        action:
          'Create clear career advancement roadmap and discuss promotion opportunities',
        timeline: 'Within 1 week',
        owner: 'HR & Direct Manager',
      });
    }

    if (employeeData.averageMonthlyHours > 200) {
      interventions.push({
        type: 'Workload Management',
        priority: 'urgent',
        action: 'Immediate workload assessment and redistribution of tasks',
        timeline: 'Within 1 week',
        owner: 'Project Manager',
      });
    }

    if (employeeData.lastEvaluation < 0.5) {
      interventions.push({
        type: 'Performance Improvement',
        priority: 'high',
        action:
          'Develop performance improvement plan with clear goals and support',
        timeline: 'Within 2 weeks',
        owner: 'Direct Manager',
      });
    }

    // Medium priority interventions
    if (employeeData.numberOfProjects > 6) {
      interventions.push({
        type: 'Project Management',
        priority: 'medium',
        action:
          'Review and prioritize project portfolio, delegate or postpone non-critical projects',
        timeline: 'Within 2 weeks',
        owner: 'Project Manager',
      });
    }

    if (employeeData.workAccident) {
      interventions.push({
        type: 'Safety & Wellbeing',
        priority: 'medium',
        action:
          'Provide additional safety training and psychological support if needed',
        timeline: 'Within 1 month',
        owner: 'Safety Officer & HR',
      });
    }

    // General interventions for all employees
    interventions.push({
      type: 'Skill Development',
      priority: 'medium',
      action:
        'Provide access to relevant training programs and professional development opportunities',
      timeline: 'Within 1 month',
      owner: 'Learning & Development',
    });

    return interventions;
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all performance data
        const performanceData = await fetchPerformanceData();

        // Find the specific employee
        const targetEmployee = performanceData.find(
          emp => emp.employee === parseInt(id)
        );

        if (!targetEmployee) {
          setError('Employee not found');
          return;
        }

        // Convert to employee detail format
        const employeeDetail = convertToEmployeeDetail(targetEmployee);

        // Generate risk factors and interventions based on real data
        const riskFactors = generateRiskFactors(employeeDetail);
        const interventions = generateInterventions(
          employeeDetail,
          riskFactors
        );

        setEmployee(employeeDetail);
        setRiskFactors(riskFactors);
        setInterventions(interventions);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
    case 'low':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'medium':
      return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'high':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading employee data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Employee Not Found
            </h3>
            <p className="text-yellow-600 dark:text-yellow-400 mb-4">
              The requested employee could not be found.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add margin to top so header doesn't cut content (same as 1on1 page)
  const pageTopMargin = 'mt-16 sm:mt-20 lg:mt-24';
  return (
    <div
      className={`space-y-6 lg:space-y-8 pt-8 md:pt-12 xl:pt-16 p-3 sm:p-4 md:p-6 ${pageTopMargin}`}
    >
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employee Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed performance and risk analysis
          </p>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
        <div className="flex items-start space-x-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {employee.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {employee.name}
            </h2>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-1">
              {employee.position}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {employee.department} • {employee.email}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {new Date(employee.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {employee.timeSpendCompany} years in company
              </div>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(employee.risk)}`}
            >
              {employee.risk.toUpperCase()} RISK
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {employee.riskScore}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Risk Score
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Performance',
            value: employee.performance,
            icon: TrendingUp,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Engagement',
            value: employee.engagement,
            icon: User,
            color: 'from-emerald-500 to-teal-500',
          },
          {
            label: 'Feedback Score',
            value: employee.feedback,
            icon: MessageSquare,
            color: 'from-purple-500 to-violet-500',
          },
          {
            label: 'Satisfaction',
            value: employee.satisfaction,
            icon: Award,
            color: 'from-amber-500 to-orange-500',
          },
        ].map((metric, index) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}
              >
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}/10
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {metric.label}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000`}
                style={{ width: `${(metric.value / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Employee Details */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Employee Details
            </h3>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Projects
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {employee.numberOfProjects}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Monthly Hours
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {employee.averageMonthlyHours}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Evaluation
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {(employee.lastEvaluation * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Time in Company
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {employee.timeSpendCompany} years
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Status Indicators
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Work Accident
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      employee.workAccident
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    }`}
                  >
                    {employee.workAccident ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Promotion (Last 5 Years)
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      employee.promotionLast5Years
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                    }`}
                  >
                    {employee.promotionLast5Years ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Risk Factors
            </h3>
          </div>

          <div className="space-y-4">
            {riskFactors.length > 0 ? (
              riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {factor.factor}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getImpactColor(factor.impact)}`}
                    >
                      {factor.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {factor.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No significant risk factors identified
                </p>
              </div>
            )}
          </div>
        </div>

        {/* HR Interventions */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommended Interventions
            </h3>
          </div>

          <div className="space-y-4">
            {interventions.map((intervention, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {intervention.type}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(intervention.priority)}`}
                  >
                    {intervention.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {intervention.action}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    <strong>Timeline:</strong> {intervention.timeline}
                  </span>
                  <span>
                    <strong>Owner:</strong> {intervention.owner}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105">
          <MessageSquare className="h-5 w-5 mr-2" />
          Schedule 1-on-1
        </button>
        <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105">
          <Award className="h-5 w-5 mr-2" />
          Give Recognition
        </button>
        <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105">
          <Target className="h-5 w-5 mr-2" />
          Create Action Plan
        </button>
      </div>
    </div>
  );
}
