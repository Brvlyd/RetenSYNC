'use client';

import { useAuth } from '@/contexts/auth-context';
import {
  ClipboardList,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: number;
  period: string;
  reviewer: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  date: string;
  score?: number;
  summary: string;
}

const reviews: Review[] = [
  {
    id: 1,
    period: 'Q4 2024',
    reviewer: 'Department Manager',
    status: 'in-progress',
    date: '2024-12-20',
    summary:
      'Quarterly review covering delivery quality, collaboration and goal progress.',
  },
  {
    id: 2,
    period: 'Q3 2024',
    reviewer: 'Department Manager',
    status: 'completed',
    date: '2024-09-28',
    score: 4.5,
    summary:
      'Strong delivery on project milestones and consistent peer collaboration.',
  },
  {
    id: 3,
    period: 'Q2 2024',
    reviewer: 'Department Manager',
    status: 'completed',
    date: '2024-06-27',
    score: 4.2,
    summary:
      'Met all core objectives; recommended focus on cross-team communication.',
  },
];

const statusStyles: Record<Review['status'], string> = {
  completed:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'in-progress':
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  scheduled:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const statusIcons: Record<Review['status'], typeof CheckCircle> = {
  completed: CheckCircle,
  'in-progress': Clock,
  scheduled: Calendar,
};

export default function PerformanceReviewPage() {
  const { user } = useAuth();

  const completed = reviews.filter(r => r.status === 'completed');
  const averageScore = completed.length
    ? (
      completed.reduce((total, r) => total + (r.score ?? 0), 0) /
        completed.length
    ).toFixed(1)
    : '-';

  return (
    <div className="space-y-6 mt-16 sm:mt-20 lg:mt-24">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Review
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {user?.first_name
                ? `Review history and upcoming cycles for ${user.first_name}`
                : 'Your review history and upcoming cycles'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Average score
            </span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {averageScore}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Completed reviews
            </span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {completed.length}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              In progress
            </span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {reviews.filter(r => r.status === 'in-progress').length}
          </p>
        </div>
      </div>

      {/* Review list */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Review history
        </h2>

        <div className="space-y-3">
          {reviews.map(review => {
            const StatusIcon = statusIcons[review.status];

            return (
              <div
                key={review.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.period}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        statusStyles[review.status]
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {review.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {review.summary}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Reviewer: {review.reviewer} &middot; {review.date}
                  </p>
                </div>

                {typeof review.score === 'number' && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Score
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {review.score.toFixed(1)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
