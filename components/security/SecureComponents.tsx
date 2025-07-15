'use client';

import React, { useState, useEffect } from 'react';
import {
  hasPermission,
  canAccessRole,
  PERMISSIONS,
  securityAuditor,
  useSecurityContext,
  getSecurityStatus,
  createSecureComponent,
} from '@/lib/security-utils';

/**
 * Higher-order component for secure route protection
 */
export const withSecureAccess = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission?: keyof typeof PERMISSIONS,
  requiredRole?: string
) => {
  return function SecureComponent(props: P) {
    const { isAuthenticated } = useSecurityContext();
    const secureCheck = createSecureComponent(requiredPermission, requiredRole);
    const accessResult = secureCheck.checkAccess();

    if (!isAuthenticated || !accessResult.hasAccess) {
      return <AccessDeniedComponent accessResult={accessResult} />;
    }

    return <WrappedComponent {...props} />;
  };
};

/**
 * Access Denied Component
 */
interface AccessDeniedComponentProps {
  accessResult: {
    hasAccess: boolean;
    reason?: string;
    requiredPermission?: string;
    requiredRole?: string;
  };
}

const AccessDeniedComponent: React.FC<AccessDeniedComponentProps> = ({
  accessResult,
}) => {
  const getErrorMessage = () => {
    switch (accessResult.reason) {
    case 'not_authenticated':
      return {
        title: 'Authentication Required',
        message: 'Please log in to access this page.',
        showLogin: true,
      };
    case 'insufficient_permission':
      return {
        title: 'Access Denied',
        message: 'You don\'t have permission to access this resource.',
        detail: `Required permission: ${accessResult.requiredPermission}`,
        showLogin: false,
      };
    case 'insufficient_role':
      return {
        title: 'Access Denied',
        message: 'You don\'t have the required role to access this resource.',
        detail: `Required role: ${accessResult.requiredRole}`,
        showLogin: false,
      };
    default:
      return {
        title: 'Access Denied',
        message: 'You don\'t have access to this resource.',
        showLogin: false,
      };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {errorInfo.title}
        </h2>
        <p className="text-gray-600 mb-4">{errorInfo.message}</p>
        {errorInfo.detail && (
          <p className="text-sm text-gray-500 mb-6 bg-gray-100 px-3 py-2 rounded">
            {errorInfo.detail}
          </p>
        )}
        {errorInfo.showLogin ? (
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        ) : (
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Security Status Component
 */
export const SecurityStatusComponent: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState(() =>
    getSecurityStatus()
  );

  useEffect(() => {
    const updateSecurityStatus = () => {
      setSecurityStatus(getSecurityStatus());
    };

    const interval = setInterval(updateSecurityStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isValid: boolean) =>
    isValid ? 'text-green-600' : 'text-red-600';
  const getStatusBg = (isValid: boolean) =>
    isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Security Status
      </h3>

      <div className="space-y-3">
        {/* Token Status */}
        <div
          className={`p-3 rounded-lg border ${getStatusBg(securityStatus.tokenValid)}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Token Status</span>
            <span
              className={`text-sm font-semibold ${getStatusColor(securityStatus.tokenValid)}`}
            >
              {securityStatus.tokenValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
        </div>

        {/* Session Status */}
        <div
          className={`p-3 rounded-lg border ${getStatusBg(securityStatus.sessionActive)}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Session Status</span>
            <span
              className={`text-sm font-semibold ${getStatusColor(securityStatus.sessionActive)}`}
            >
              {securityStatus.sessionActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Session Time</div>
            <div className="font-semibold">{securityStatus.sessionTime}m</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Idle Time</div>
            <div
              className={`font-semibold ${securityStatus.idleTime > 30 ? 'text-orange-600' : 'text-gray-900'}`}
            >
              {securityStatus.idleTime}m
            </div>
          </div>
        </div>

        {/* Security Issues */}
        {securityStatus.securityIssues &&
          securityStatus.securityIssues.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-2">
                Security Issues:
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {securityStatus.securityIssues.map((issue, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-600 rounded-full"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Events */}
        {securityStatus.recentEvents.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">
              Recent Security Events ({securityStatus.recentEvents.length})
            </div>
            <div className="space-y-1">
              {securityStatus.recentEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className="text-xs text-blue-700 flex justify-between"
                >
                  <span className="capitalize">
                    {event.type.replace('_', ' ')}
                  </span>
                  <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Permission-based Component
 */
interface PermissionGuardProps {
  permission: keyof typeof PERMISSIONS;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback,
  children,
}) => {
  const hasAccess = hasPermission(permission);

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

/**
 * Role-based Component
 */
interface RoleGuardProps {
  role: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  role,
  fallback,
  children,
}) => {
  const hasAccess = canAccessRole(role);

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

/**
 * Combined Security Guard Component
 */
interface SecurityGuardProps {
  permission?: keyof typeof PERMISSIONS;
  role?: string;
  requireAll?: boolean; // If true, both permission and role are required
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const SecurityGuard: React.FC<SecurityGuardProps> = ({
  permission,
  role,
  requireAll = false,
  fallback,
  children,
}) => {
  const hasPermissionAccess = permission ? hasPermission(permission) : true;
  const hasRoleAccess = role ? canAccessRole(role) : true;

  const hasAccess = requireAll
    ? hasPermissionAccess && hasRoleAccess
    : hasPermissionAccess || hasRoleAccess;

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

/**
 * Example Secure Components
 */
export const SecureAdminPanel = withSecureAccess(
  ({ children }: { children: React.ReactNode }) => (
    <div className="admin-panel">
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-red-800 font-medium">Admin Access Granted</span>
        </div>
      </div>
      {children}
    </div>
  ),
  'system:read',
  'admin'
);

export const SecureHRPanel = withSecureAccess(
  ({ children }: { children: React.ReactNode }) => (
    <div className="hr-panel">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span className="text-blue-800 font-medium">HR Access Granted</span>
        </div>
      </div>
      {children}
    </div>
  ),
  'hr:read'
);

export const SecureManagerPanel = withSecureAccess(
  ({ children }: { children: React.ReactNode }) => (
    <div className="manager-panel">
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-green-800 font-medium">
            Manager Access Granted
          </span>
        </div>
      </div>
      {children}
    </div>
  ),
  'manager:read'
);

/**
 * Security Context Hook for Components
 */
export const useComponentSecurity = () => {
  const { isAuthenticated, userRole } = useSecurityContext();
  const [securityStatus, setSecurityStatus] = useState(() =>
    getSecurityStatus()
  );

  useEffect(() => {
    const updateStatus = () => setSecurityStatus(getSecurityStatus());
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    isAuthenticated,
    userRole,
    securityStatus,
    hasPermission: (permission: keyof typeof PERMISSIONS) =>
      hasPermission(permission),
    canAccessRole: (role: string) => canAccessRole(role),
    PermissionGuard,
    RoleGuard,
    SecurityGuard,
    SecurityStatusComponent: () => <SecurityStatusComponent />,
    createSecureComponent: (
      permission?: keyof typeof PERMISSIONS,
      role?: string
    ) => createSecureComponent(permission, role),
  };
};
