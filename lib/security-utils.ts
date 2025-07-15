// Enhanced security utilities for role-based authentication
import { getAuthToken, getUserRole, removeAuthToken } from '@/lib/auth-token';

/**
 * Security Configuration
 */
export const SECURITY_CONFIG = {
  // Token settings
  TOKEN_REFRESH_BUFFER: 5, // minutes before expiration to refresh
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_COOLDOWN: 15, // minutes

  // Session settings
  SESSION_TIMEOUT: 24 * 60, // 24 hours in minutes
  IDLE_TIMEOUT: 60, // minutes of inactivity

  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
} as const;

/**
 * Role hierarchy and permissions
 */
export const ROLE_HIERARCHY = {
  admin: ['admin', 'hr', 'manager', 'user'],
  hr: ['hr', 'user'],
  manager: ['manager', 'user'],
  user: ['user'],
} as const;

export const PERMISSIONS = {
  // User management
  'user:read': ['admin', 'hr'],
  'user:write': ['admin', 'hr'],
  'user:delete': ['admin'],

  // System management
  'system:read': ['admin'],
  'system:write': ['admin'],

  // Analytics
  'analytics:read': ['admin', 'manager'],
  'analytics:write': ['admin'],

  // HR functions
  'hr:read': ['admin', 'hr'],
  'hr:write': ['admin', 'hr'],

  // Manager functions
  'manager:read': ['admin', 'hr', 'manager'],
  'manager:write': ['admin', 'manager'],

  // Profile management
  'profile:read': ['admin', 'hr', 'manager', 'user'],
  'profile:write': ['admin', 'hr', 'manager', 'user'],
} as const;

/**
 * Enhanced role checking with hierarchy support
 */
export const hasPermission = (
  permission: keyof typeof PERMISSIONS
): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;

  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles?.includes(userRole as any) || false;
};

/**
 * Check if user role has access to another role's resources
 */
export const canAccessRole = (targetRole: string): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;

  const allowedRoles = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY];
  return allowedRoles?.includes(targetRole as any) || false;
};

/**
 * Enhanced login attempt tracking
 */
class LoginAttemptTracker {
  private attempts: Map<
    string,
    { count: number; lastAttempt: number; blockedUntil?: number }
  > = new Map();

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record) return false;

    if (record.blockedUntil && Date.now() < record.blockedUntil) {
      return true;
    }

    // Clear expired block
    if (record.blockedUntil && Date.now() >= record.blockedUntil) {
      this.attempts.delete(identifier);
      return false;
    }

    return false;
  }

  recordAttempt(identifier: string, successful: boolean): void {
    if (successful) {
      this.attempts.delete(identifier);
      return;
    }

    const record = this.attempts.get(identifier) || {
      count: 0,
      lastAttempt: 0,
    };
    record.count += 1;
    record.lastAttempt = Date.now();

    if (record.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      record.blockedUntil =
        Date.now() + SECURITY_CONFIG.LOGIN_COOLDOWN * 60 * 1000;
    }

    this.attempts.set(identifier, record);
  }

  getRemainingCooldown(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record?.blockedUntil) return 0;

    const remaining = record.blockedUntil - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000 / 60)); // minutes
  }

  getAttemptCount(identifier: string): number {
    return this.attempts.get(identifier)?.count || 0;
  }
}

export const loginAttemptTracker = new LoginAttemptTracker();

/**
 * Session timeout management
 */
class SessionManager {
  private lastActivity: number = Date.now();
  private sessionStart: number = Date.now();
  private timeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.resetActivity();
    this.startIdleCheck();
  }

  resetActivity(): void {
    this.lastActivity = Date.now();
    this.restartIdleCheck();
  }

  private startIdleCheck(): void {
    this.timeoutId = setInterval(() => {
      const idleTime = Date.now() - this.lastActivity;
      const sessionTime = Date.now() - this.sessionStart;

      // Check idle timeout
      if (idleTime > SECURITY_CONFIG.IDLE_TIMEOUT * 60 * 1000) {
        this.handleTimeout('idle');
        return;
      }

      // Check session timeout
      if (sessionTime > SECURITY_CONFIG.SESSION_TIMEOUT * 60 * 1000) {
        this.handleTimeout('session');
        return;
      }
    }, 60000); // Check every minute
  }

  private restartIdleCheck(): void {
    if (this.timeoutId) {
      clearInterval(this.timeoutId);
    }
    this.startIdleCheck();
  }

  private handleTimeout(type: 'idle' | 'session'): void {
    console.warn(`Session timeout (${type}), logging out user`);
    removeAuthToken();

    if (typeof window !== 'undefined') {
      const message =
        type === 'idle'
          ? 'Your session has expired due to inactivity. Please log in again.'
          : 'Your session has expired. Please log in again.';

      alert(message);
      window.location.href = '/auth/login';
    }
  }

  getIdleTime(): number {
    return Date.now() - this.lastActivity;
  }

  getSessionTime(): number {
    return Date.now() - this.sessionStart;
  }

  destroy(): void {
    if (this.timeoutId) {
      clearInterval(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

let sessionManager: SessionManager | null = null;

export const initializeSessionManager = (): SessionManager => {
  if (typeof window !== 'undefined' && !sessionManager) {
    sessionManager = new SessionManager();

    // Track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    const resetActivity = () => sessionManager?.resetActivity();

    events.forEach(event => {
      document.addEventListener(event, resetActivity, true);
    });
  }

  return sessionManager as SessionManager;
};

/**
 * Security audit logging
 */
interface SecurityEvent {
  type:
    | 'login'
    | 'logout'
    | 'permission_denied'
    | 'token_expired'
    | 'suspicious_activity';
  timestamp: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
  role?: string;
  details?: any;
}

class SecurityAuditor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent:
        typeof window !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', securityEvent);
    }

    // In production, you would send this to your logging service
    this.sendToLoggingService(securityEvent);
  }

  private sendToLoggingService(event: SecurityEvent): void {
    // Implementation for sending to your logging service
    // This could be sent to your backend API, analytics service, etc.
    if (typeof window !== 'undefined') {
      // Example: send to backend
      fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(error => console.warn('Failed to log security event:', error));
    }
  }

  getRecentEvents(type?: SecurityEvent['type']): SecurityEvent[] {
    const recent = this.events.filter(
      event => Date.now() - event.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    if (type) {
      return recent.filter(event => event.type === type);
    }

    return recent;
  }

  getSuspiciousActivity(): SecurityEvent[] {
    return this.getRecentEvents('suspicious_activity');
  }
}

export const securityAuditor = new SecurityAuditor();

/**
 * Token validation with additional security checks
 */
export const validateTokenSecurity = (): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const authInfo = getAuthToken();
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!authInfo.isValid) {
    issues.push('Token is invalid or missing');
    recommendations.push('User should log in again');
    return { isValid: false, issues, recommendations };
  }

  // Check token age
  if (authInfo.expiresAt) {
    const expirationTime = new Date(authInfo.expiresAt).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    const bufferTime = SECURITY_CONFIG.TOKEN_REFRESH_BUFFER * 60 * 1000;

    if (timeUntilExpiry < bufferTime) {
      issues.push('Token is near expiration');
      recommendations.push('Token should be refreshed');
    }
  }

  // Check session duration
  const sessionManager = initializeSessionManager();
  const sessionTime = sessionManager.getSessionTime();
  const maxSessionTime = SECURITY_CONFIG.SESSION_TIMEOUT * 60 * 1000;

  if (sessionTime > maxSessionTime) {
    issues.push('Session has exceeded maximum duration');
    recommendations.push('User should log in again');
  }

  // Check idle time
  const idleTime = sessionManager.getIdleTime();
  const maxIdleTime = SECURITY_CONFIG.IDLE_TIMEOUT * 60 * 1000;

  if (idleTime > maxIdleTime) {
    issues.push('User has been idle too long');
    recommendations.push('User should log in again');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
};

/**
 * Secure API request wrapper with additional security features
 */
export const secureApiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // Validate token security before making request
  const securityCheck = validateTokenSecurity();
  if (!securityCheck.isValid) {
    const error = new Error(
      `Security validation failed: ${securityCheck.issues.join(', ')}`
    );
    securityAuditor.logEvent({
      type: 'suspicious_activity',
      details: { securityIssues: securityCheck.issues, url },
    });
    throw error;
  }

  // Add security headers
  const secureHeaders = {
    ...SECURITY_CONFIG.SECURITY_HEADERS,
    ...options.headers,
  };

  // Track API request
  sessionManager?.resetActivity();

  try {
    const response = await fetch(url, {
      ...options,
      headers: secureHeaders,
    });

    if (!response.ok) {
      securityAuditor.logEvent({
        type: 'suspicious_activity',
        details: {
          action: 'api_request_failed',
          url,
          status: response.status,
          statusText: response.statusText,
        },
      });
    }

    return response.json();
  } catch (error) {
    securityAuditor.logEvent({
      type: 'suspicious_activity',
      details: {
        action: 'api_request_error',
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
    throw error;
  }
};

/**
 * Security utilities for components
 */
export const useSecurityContext = () => {
  const authInfo = getAuthToken();
  const securityValidation = validateTokenSecurity();

  return {
    isAuthenticated: authInfo.isValid,
    userRole: authInfo.role,
    hasPermission,
    canAccessRole,
    securityValidation,
    sessionManager: initializeSessionManager(),
    securityAuditor,
    loginAttemptTracker,
  };
};

/**
 * Component factory for secure route protection
 * Note: This should be used in .tsx files for JSX support
 */
export const createSecureComponent = (
  requiredPermission?: keyof typeof PERMISSIONS,
  requiredRole?: string
) => {
  return {
    checkAccess: () => {
      const authInfo = getAuthToken();

      if (!authInfo.isValid) {
        return { hasAccess: false, reason: 'not_authenticated' };
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        securityAuditor.logEvent({
          type: 'permission_denied',
          details: { requiredPermission },
        });
        return {
          hasAccess: false,
          reason: 'insufficient_permission',
          requiredPermission,
        };
      }

      if (requiredRole && !canAccessRole(requiredRole)) {
        securityAuditor.logEvent({
          type: 'permission_denied',
          details: { requiredRole },
        });
        return { hasAccess: false, reason: 'insufficient_role', requiredRole };
      }

      return { hasAccess: true };
    },
  };
};

/**
 * Security monitoring utilities
 */
export const getSecurityStatus = () => {
  const validation = validateTokenSecurity();
  const sessionMgr = initializeSessionManager();
  const recentEvents = securityAuditor.getRecentEvents();

  return {
    tokenValid: validation.isValid,
    sessionActive: validation.isValid,
    idleTime: Math.floor(sessionMgr.getIdleTime() / 1000 / 60), // minutes
    sessionTime: Math.floor(sessionMgr.getSessionTime() / 1000 / 60), // minutes
    recentEvents,
    securityIssues: validation.issues,
    recommendations: validation.recommendations,
  };
};
