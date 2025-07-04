'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, TrendingUp, AlertTriangle, CheckCircle, Target, Calendar, MessageSquare, Award } from 'lucide-react';

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

  useEffect(() => {
    // Simulate fetching employee data
    const employeeId = parseInt(id);

    // Mock data - in real app, this would come from API
    const mockEmployee: EmployeeDetail = {
      id: employeeId,
      name: 'Dzikri Razzan Athallah',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      email: 'dzikri.razzan@company.com',
      joinDate: '2023-01-15',
      performance: 7.5,
      engagement: 6.2,
      feedback: 7.8,
      satisfaction: 6.5,
      risk: 'medium',
      riskScore: 65
    };

    const mockRiskFactors: RiskFactor[] = [
      {
        factor: 'Low Engagement Score',
        impact: 'high',
        description: 'Engagement score below company average (6.2 vs 8.2)'
      },
      {
        factor: 'Limited Career Growth',
        impact: 'medium',
        description: 'No promotion in the last 18 months'
      },
      {
        factor: 'Workload Stress',
        impact: 'medium',
        description: 'High project load in recent quarters'
      },
      {
        factor: 'Team Dynamics',
        impact: 'low',
        description: 'Some friction with cross-functional teams'
      }
    ];

    const mockInterventions: Intervention[] = [
      {
        type: 'Career Development',
        priority: 'urgent',
        action: 'Schedule career development discussion and create advancement plan',
        timeline: 'Within 1 week',
        owner: 'Direct Manager'
      },
      {
        type: 'Workload Management',
        priority: 'high',
        action: 'Review current project assignments and redistribute if necessary',
        timeline: 'Within 2 weeks',
        owner: 'Project Manager'
      },
      {
        type: 'Engagement Activities',
        priority: 'medium',
        action: 'Involve in cross-team initiatives and knowledge sharing sessions',
        timeline: 'Within 1 month',
        owner: 'HR Team'
      },
      {
        type: 'Skill Development',
        priority: 'medium',
        action: 'Provide access to advanced technical training and certifications',
        timeline: 'Within 1 month',
        owner: 'Learning & Development'
      }
    ];

    setEmployee(mockEmployee);
    setRiskFactors(mockRiskFactors);
    setInterventions(mockInterventions);
  }, [id]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 pt-8 md:pt-12 xl:pt-16">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Detailed performance and risk analysis</p>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
        <div className="flex items-start space-x-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{employee.name}</h2>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-1">{employee.position}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{employee.department} • {employee.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {new Date(employee.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRiskColor(employee.risk)}`}>
              {employee.risk.toUpperCase()} RISK
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {employee.riskScore}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Performance', value: employee.performance, icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
          { label: 'Engagement', value: employee.engagement, icon: User, color: 'from-emerald-500 to-teal-500' },
          { label: 'Feedback Score', value: employee.feedback, icon: MessageSquare, color: 'from-purple-500 to-violet-500' },
          { label: 'Satisfaction', value: employee.satisfaction, icon: Award, color: 'from-amber-500 to-orange-500' }
        ].map((metric, index) => (
          <div key={metric.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}/10
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{metric.label}</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-1000`}
                style={{ width: `${(metric.value / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Risk Factors */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Factors</h3>
          </div>
          
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{factor.factor}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getImpactColor(factor.impact)}`}>
                    {factor.impact.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HR Interventions */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Interventions</h3>
          </div>
          
          <div className="space-y-4">
            {interventions.map((intervention, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{intervention.type}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(intervention.priority)}`}>
                    {intervention.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{intervention.action}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span><strong>Timeline:</strong> {intervention.timeline}</span>
                  <span><strong>Owner:</strong> {intervention.owner}</span>
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