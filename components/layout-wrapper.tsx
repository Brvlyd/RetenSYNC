'use client';

import { usePathname } from 'next/navigation';
import AdminLayoutWrapper from './layout-admin/layout-wrapper';
import UserLayoutWrapper from './layout-user/layout-wrapper';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current route is an auth route
  const isAuthRoute = pathname?.startsWith('/auth');

  // If it's an auth route, render children without layout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Route to appropriate layout based on current path
  const isAdminRoute = pathname?.startsWith('/admin');
  const isUserRoute = pathname?.startsWith('/user');

  // Use admin layout for admin routes
  if (isAdminRoute) {
    return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
  }

  // Use user layout for user routes or default
  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}
