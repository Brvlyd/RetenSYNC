'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';

/**
 * Admin section layout.
 *
 * The actual access control (redirect to login / redirect a non-admin to their
 * own dashboard) is handled once, in components/route-guard.tsx. This layout
 * only makes sure nothing admin-specific renders for a non-admin while that
 * redirect is in flight.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
