// Secure token management utility for role-based authentication
import Cookies from 'js-cookie';

// Types for token management
export interface TokenData {
  token: string;
  role: 'admin' | 'user' | 'hr' | 'manager';
  expiresAt: string;
  userId: string;
  email: string;
}

export interface StoredTokenInfo {
  isValid: boolean;
  token: string | null;
  role: string | null;
  userId: string | null;
  email: string | null;
  expiresAt: string | null;
}

// Configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const ROLE_COOKIE_NAME = 'user_role';
const USER_INFO_COOKIE_NAME = 'user_info';
const COOKIE_MAX_AGE = 7; // 7 days
const FALLBACK_STORAGE_KEY = 'retensync_auth_data';

// Cookie options for security
const getCookieOptions = (isProduction: boolean = process.env.NODE_ENV === 'production') => ({
  expires: COOKIE_MAX_AGE,
  secure: isProduction, // Only use secure cookies in production (HTTPS)
  sameSite: 'strict' as const,
  path: '/',
  domain: isProduction ? undefined : undefined, // Set domain in production if needed
});

/**
 * Safely access document and localStorage only on client side
 */
const isClient = () => typeof window !== 'undefined';

/**
 * Save authentication token and user data securely
 */
export const saveAuthToken = (tokenData: TokenData): boolean => {
  if (!isClient()) {
    console.warn('Cannot save token on server side');
    return false;
  }

  try {
    const cookieOptions = getCookieOptions();
    
    // Primary storage: HTTP-only-like cookies (as secure as possible with js-cookie)
    Cookies.set(TOKEN_COOKIE_NAME, tokenData.token, cookieOptions);
    Cookies.set(ROLE_COOKIE_NAME, tokenData.role, cookieOptions);
    
    // Store additional user info
    const userInfo = {
      userId: tokenData.userId,
      email: tokenData.email,
      expiresAt: tokenData.expiresAt,
    };
    Cookies.set(USER_INFO_COOKIE_NAME, JSON.stringify(userInfo), cookieOptions);

    // Fallback storage: localStorage (for cases where cookies might be disabled)
    try {
      const fallbackData = {
        token: tokenData.token,
        role: tokenData.role,
        userId: tokenData.userId,
        email: tokenData.email,
        expiresAt: tokenData.expiresAt,
        timestamp: Date.now(),
      };
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(fallbackData));
    } catch (storageError) {
      console.warn('localStorage not available, using cookies only:', storageError);
    }

    // Also set as backup in sessionStorage for this session
    try {
      sessionStorage.setItem(TOKEN_COOKIE_NAME, tokenData.token);
      sessionStorage.setItem(ROLE_COOKIE_NAME, tokenData.role);
    } catch (sessionError) {
      console.warn('sessionStorage not available:', sessionError);
    }

    console.log('Auth token saved successfully for role:', tokenData.role);
    return true;
  } catch (error) {
    console.error('Failed to save auth token:', error);
    return false;
  }
};

/**
 * Retrieve authentication token with validation
 */
export const getAuthToken = (): StoredTokenInfo => {
  if (!isClient()) {
    return {
      isValid: false,
      token: null,
      role: null,
      userId: null,
      email: null,
      expiresAt: null,
    };
  }

  try {
    // Try to get from cookies first (most secure)
    let token = Cookies.get(TOKEN_COOKIE_NAME);
    let role = Cookies.get(ROLE_COOKIE_NAME);
    let userInfoStr = Cookies.get(USER_INFO_COOKIE_NAME);

    let userId: string | null = null;
    let email: string | null = null;
    let expiresAt: string | null = null;

    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        userId = userInfo.userId;
        email = userInfo.email;
        expiresAt = userInfo.expiresAt;
      } catch (parseError) {
        console.warn('Failed to parse user info from cookies:', parseError);
      }
    }

    // Fallback to localStorage if cookies are empty
    if (!token || !role) {
      try {
        const fallbackData = localStorage.getItem(FALLBACK_STORAGE_KEY);
        if (fallbackData) {
          const parsed = JSON.parse(fallbackData);
          token = token || parsed.token;
          role = role || parsed.role;
          userId = userId || parsed.userId;
          email = email || parsed.email;
          expiresAt = expiresAt || parsed.expiresAt;
        }
      } catch (fallbackError) {
        console.warn('Failed to retrieve from localStorage:', fallbackError);
      }
    }

    // Final fallback to sessionStorage
    if (!token || !role) {
      try {
        token = token || sessionStorage.getItem(TOKEN_COOKIE_NAME);
        role = role || sessionStorage.getItem(ROLE_COOKIE_NAME);
      } catch (sessionError) {
        console.warn('Failed to retrieve from sessionStorage:', sessionError);
      }
    }

    // Validate token expiration
    if (expiresAt && new Date(expiresAt) < new Date()) {
      console.warn('Token has expired, clearing auth data');
      removeAuthToken();
      return {
        isValid: false,
        token: null,
        role: null,
        userId: null,
        email: null,
        expiresAt: null,
      };
    }

    const isValid = !!(token && role);

    return {
      isValid,
      token,
      role,
      userId,
      email,
      expiresAt,
    };
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return {
      isValid: false,
      token: null,
      role: null,
      userId: null,
      email: null,
      expiresAt: null,
    };
  }
};

/**
 * Get just the token string for API requests
 */
export const getTokenForAPI = (): string | null => {
  const authInfo = getAuthToken();
  return authInfo.isValid ? authInfo.token : null;
};

/**
 * Get user role for authorization checks
 */
export const getUserRole = (): string | null => {
  const authInfo = getAuthToken();
  return authInfo.isValid ? authInfo.role : null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole: string): boolean => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Remove authentication token and all related data
 */
export const removeAuthToken = (): void => {
  if (!isClient()) {
    console.warn('Cannot remove token on server side');
    return;
  }

  try {
    // Remove from cookies
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
    Cookies.remove(ROLE_COOKIE_NAME, { path: '/' });
    Cookies.remove(USER_INFO_COOKIE_NAME, { path: '/' });

    // Remove from localStorage
    try {
      localStorage.removeItem(FALLBACK_STORAGE_KEY);
      localStorage.removeItem('authToken'); // Legacy cleanup
      localStorage.removeItem('token'); // Legacy cleanup
    } catch (storageError) {
      console.warn('Failed to clear localStorage:', storageError);
    }

    // Remove from sessionStorage
    try {
      sessionStorage.removeItem(TOKEN_COOKIE_NAME);
      sessionStorage.removeItem(ROLE_COOKIE_NAME);
    } catch (sessionError) {
      console.warn('Failed to clear sessionStorage:', sessionError);
    }

    console.log('Auth token removed successfully');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

/**
 * Update token if user logs in with different role
 */
export const updateAuthToken = (newTokenData: TokenData): boolean => {
  const currentAuth = getAuthToken();
  
  // If user is switching roles, log the change
  if (currentAuth.isValid && currentAuth.role !== newTokenData.role) {
    console.log(`Role changed from ${currentAuth.role} to ${newTokenData.role}`);
  }

  // Remove old token data and save new one
  removeAuthToken();
  return saveAuthToken(newTokenData);
};

/**
 * Create authorization headers for API requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getTokenForAPI();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  return headers;
};

/**
 * Check if token is expired or near expiration
 */
export const isTokenExpired = (bufferMinutes: number = 5): boolean => {
  const authInfo = getAuthToken();
  
  if (!authInfo.isValid || !authInfo.expiresAt) {
    return true;
  }

  const expirationTime = new Date(authInfo.expiresAt).getTime();
  const currentTime = Date.now();
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds

  return currentTime >= (expirationTime - bufferTime);
};

/**
 * Get time until token expires (in minutes)
 */
export const getTokenExpirationTime = (): number | null => {
  const authInfo = getAuthToken();
  
  if (!authInfo.isValid || !authInfo.expiresAt) {
    return null;
  }

  const expirationTime = new Date(authInfo.expiresAt).getTime();
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;

  return Math.max(0, Math.floor(timeUntilExpiration / (1000 * 60))); // Convert to minutes
};
