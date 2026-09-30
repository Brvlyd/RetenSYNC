'use client';

import { useRouter } from 'next/navigation';
import {
  Users,
  MessageSquare,
  Award,
  ClipboardList,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface InteractionType {
  name: string;
  description: string;
  href: string;
  icon: typeof Users;
  accent: string;
}

const interactionTypes: InteractionType[] = [
  {
    name: '1-on-1 Meetings',
    description: 'Schedule and review your one-on-one sessions.',
    href: '/user/1on1',
    icon: Calendar,
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Feedback',
    description: 'Give feedback to teammates and read what you received.',
    href: '/user/feedback',
    icon: MessageSquare,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Shoutouts',
    description: 'Recognise colleagues for great work.',
    href: '/user/shoutouts',
    icon: Award,
    accent: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Surveys',
    description: 'Answer engagement and wellbeing surveys from HR.',
    href: '/user/surveys',
    icon: ClipboardList,
    accent: 'from-amber-500 to-orange-500',
  },
];

export default function InteractionsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 mt-16 sm:mt-20 lg:mt-24">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              HR Interactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Everything you exchange with HR and your team in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {interactionTypes.map(type => {
          const Icon = type.icon;

          return (
            <button
              key={type.href}
              onClick={() => router.push(type.href)}
              className="text-left bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${type.accent}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">
                {type.name}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
