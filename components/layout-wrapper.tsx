'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayoutWrapper from './layout-admin/layout-wrapper';
import UserLayoutWrapper from './layout-user/layout-wrapper';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  // Show loading state while checking user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if current route is an auth route
  const isAuthRoute = pathname?.startsWith('/auth');
  
  // If it's an auth route, render children without layout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Route to appropriate layout based on user role and current path
  const isAdminRoute = pathname?.startsWith('/admin');
  const isUserRoute = pathname?.startsWith('/user');
  
  // If user is admin and on admin route, use admin layout
  if (user?.role === 'admin' && isAdminRoute) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
  }
  
  // If user is on user route or is not admin, use user layout
  if (isUserRoute || user?.role !== 'admin') {
    return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
  }
  
  // Default to admin layout for admin users
  if (user?.role === 'admin') {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
  }
  
  // Default to user layout
  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}
