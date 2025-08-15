import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className,
}: StatCardProps) {
  // Check if className contains text-white to determine if we should use white text
  const isWhiteText = className?.includes('text-white');
  
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium',
            isWhiteText ? 'text-white/80' : 'text-gray-600 dark:text-gray-300'
          )}>{title}</p>
          <p className={cn(
            'text-3xl font-bold mt-2',
            isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
          )}>{value}</p>
          {change && (
            <p
              className={cn(
                'text-sm mt-2 flex items-center',
                isWhiteText ? 'text-white/90' : (
                  changeType === 'positive' && 'text-green-600 dark:text-green-300' ||
                  changeType === 'negative' && 'text-red-600 dark:text-red-300' ||
                  changeType === 'neutral' && 'text-gray-600 dark:text-gray-300'
                )
              )}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
