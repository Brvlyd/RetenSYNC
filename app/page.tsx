'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardPathForRole } from '@/contexts/auth-context';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Wait for the stored session to be restored before deciding where to go,
    // otherwise a signed-in user is bounced to the login screen on every visit.
    if (isLoading) return;

    router.replace(
      isAuthenticated ? getDashboardPathForRole(user?.role) : '/auth/login'
    );
  }, [isLoading, isAuthenticated, user?.role, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading RetenSYNC...</p>
      </div>
    </div>
  );
}
