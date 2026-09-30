'use client';

import { usePathname } from 'next/navigation';
import AdminLayoutWrapper from './layout-admin/layout-wrapper';
import UserLayoutWrapper from './layout-user/layout-wrapper';
import RouteGuard from './route-guard';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current route is an auth route
  const isAuthRoute = pathname?.startsWith('/auth');
  const isAdminRoute = pathname?.startsWith('/admin');

  // Auth routes render bare; everything else gets the chrome for its area.
  // RouteGuard sits on the outside so the chrome is never mounted for a
  // visitor who is about to be redirected away.
  const content = isAuthRoute ? (
    <>{children}</>
  ) : isAdminRoute ? (
    <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
  ) : (
    <UserLayoutWrapper>{children}</UserLayoutWrapper>
  );

  return <RouteGuard>{content}</RouteGuard>;
}
