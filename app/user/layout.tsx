'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';

/**
 * User section layout.
 *
 * Access control lives in components/route-guard.tsx; this layout only holds
 * back the user pages until the session has been restored, so a page never
 * renders (or fires data calls) with a half-initialised auth state.
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
