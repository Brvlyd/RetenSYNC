'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  useAuth,
  isPublicRoute,
  getDashboardPathForRole,
  getRequiredRolesForPath,
} from '@/contexts/auth-context';

function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Checking your session...
        </p>
      </div>
    </div>
  );
}

/**
 * The single place in the app that is allowed to redirect based on auth state.
 *
 * Rules:
 *  - While the stored session is still being restored, nothing is redirected.
 *    (Redirecting during that window is what kicked users out on refresh.)
 *  - Auth pages are only redirected away from when a session already exists.
 *  - Protected pages send anonymous visitors to /auth/login.
 *  - A logged-in user on a page their role cannot access is sent to their own
 *    dashboard - never back to the login page, which would drop their session.
 */
export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role ?? null;
  const publicRoute = isPublicRoute(pathname);
  const requiredRoles = getRequiredRolesForPath(pathname);
  const hasRequiredRole =
    !requiredRoles || (!!role && requiredRoles.includes(role));

  useEffect(() => {
    // Session not resolved yet - stay put.
    if (isLoading) return;

    if (publicRoute) {
      // Already signed in? Go to the dashboard for this role.
      if (isAuthenticated) {
        router.replace(getDashboardPathForRole(role));
      }
      return;
    }

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (!hasRequiredRole) {
      router.replace(getDashboardPathForRole(role));
    }
  }, [
    isLoading,
    isAuthenticated,
    publicRoute,
    hasRequiredRole,
    role,
    pathname,
    router,
  ]);

  if (isLoading) {
    return <AuthLoader />;
  }

  if (publicRoute) {
    // Render the login/register screen unless we are on our way out of it.
    return isAuthenticated ? <AuthLoader /> : <>{children}</>;
  }

  if (!isAuthenticated || !hasRequiredRole) {
    return <AuthLoader />;
  }

  return <>{children}</>;
}
