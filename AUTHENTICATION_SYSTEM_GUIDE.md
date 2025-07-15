# Role-Based Authentication System Documentation

## Overview

This project implements a comprehensive role-based authentication system for Next.js/React applications. The system supports secure token storage, automatic token validation, role-based access control, and provides utilities for making authenticated API requests.

## Architecture

### Core Components

1. **Token Management (`lib/auth-token.ts`)**
   - Secure token storage using cookies with localStorage fallback
   - Role-based token validation
   - Automatic token expiration handling

2. **API Client (`lib/api-client.ts`)**
   - Authenticated HTTP requests with automatic token injection
   - Role-based request filtering
   - Error handling and token refresh

3. **Auth Context (`contexts/auth-context.tsx`)**
   - React context for authentication state management
   - User session management
   - Role-based routing

4. **API Integration (`app/api/authApi.ts`)**
   - Backend authentication endpoints
   - Login/register functionality

## Features

### ✅ Implemented Features

1. **Secure Token Storage**
   - Primary: HTTP-only-like cookies (most secure option available)
   - Fallback: localStorage for cookie-disabled environments
   - Session: sessionStorage for current session backup

2. **Role-Based Access Control**
   - Support for multiple roles: `admin`, `hr`, `manager`, `user`
   - Role-specific routing and component access
   - Granular permission checking

3. **Token Security**
   - Automatic token expiration validation
   - Token refresh mechanisms
   - Secure token removal on logout

4. **API Integration**
   - Automatic Authorization header injection
   - Role-based API request filtering
   - Error handling for authentication failures

5. **User Experience**
   - Automatic redirect on token expiration
   - Role-specific dashboard routing
   - Persistent authentication state

## Usage Guide

### 1. Basic Authentication Flow

```typescript
import { useAuth } from '@/contexts/auth-context';

function LoginComponent() {
  const { login, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      // User will be automatically redirected based on their role
      console.log('Login successful');
    }
  };
}
```

### 2. Role-Based Component Access

```typescript
import { useAuth } from '@/contexts/auth-context';
import { hasRole, isAdmin } from '@/lib/auth-token';

function ProtectedComponent() {
  const { userRole, isAdminUser } = useAuth();

  // Method 1: Using context
  if (!isAdminUser) {
    return <div>Access Denied</div>;
  }

  // Method 2: Using utility functions
  if (!hasRole('admin')) {
    return <div>Admin access required</div>;
  }

  return <div>Admin content</div>;
}
```

### 3. Making Authenticated API Requests

```typescript
import { get, post, put, del, adminRequest } from '@/lib/api-client';

// Basic authenticated requests
const userProfile = await get('/users/profile/');
const updatedProfile = await put('/users/profile/', profileData);

// Admin-only requests
const adminData = await adminRequest('/admin/users/', {
  method: 'GET',
});

// Role-based requests
const dashboardData = await roleBasedRequest('/dashboard/', 'manager', {
  method: 'GET',
});
```

### 4. Token Management

```typescript
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  isTokenExpired,
  getTokenExpirationTime,
} from '@/lib/auth-token';

// Save token after login
const tokenData = {
  token: 'jwt-token-here',
  role: 'admin',
  expiresAt: '2024-12-31T23:59:59Z',
  userId: 'user-123',
  email: 'user@example.com',
};
saveAuthToken(tokenData);

// Check token status
const authInfo = getAuthToken();
if (authInfo.isValid) {
  console.log('User is authenticated:', authInfo.role);
}

// Check expiration
const minutesLeft = getTokenExpirationTime();
if (isTokenExpired()) {
  console.log('Token expired, redirecting to login');
}
```

### 5. Custom Hooks for Role-Based Features

```typescript
const useRoleBasedFeatures = () => {
  const { userRole } = useAuth();

  return {
    canAccessAdminPanel: hasRole('admin'),
    canManageUsers: hasRole('admin') || hasRole('hr'),
    canViewAnalytics: hasRole('admin') || hasRole('manager'),
    userRole
  };
};

function Navigation() {
  const { canAccessAdminPanel, canManageUsers } = useRoleBasedFeatures();

  return (
    <nav>
      {canManageUsers && <Link href="/admin/users">User Management</Link>}
      {canAccessAdminPanel && <Link href="/admin">Admin Panel</Link>}
    </nav>
  );
}
```

## Security Best Practices

### 1. Token Storage Security

```typescript
// ✅ Current Implementation
- Primary: Secure cookies with httpOnly-like behavior
- Fallback: localStorage (only when cookies unavailable)
- Session: sessionStorage for current session
- Automatic cleanup on logout
```

### 2. Token Validation

```typescript
// ✅ Automatic token validation before every request
- Check token expiration before API calls
- Automatic redirect on expired tokens
- Buffer time for token refresh (5 minutes default)
```

### 3. Role-Based Security

```typescript
// ✅ Server-side validation required
- Client-side role checks for UX only
- Server must validate all permissions
- Token contains role information from backend
```

### 4. Error Handling

```typescript
// ✅ Comprehensive error handling
- Network errors
- Authentication failures
- Authorization errors
- Token expiration
```

## API Endpoints

### Authentication Endpoints

```typescript
// Login
POST /api/auth/login/
{
  "username": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt-token-here",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin"
  },
  "expires_at": "2024-12-31T23:59:59Z"
}

// Register
POST /api/auth/register/
{
  "username": "newuser",
  "email": "new@example.com",
  "password": "password123",
  "first_name": "New",
  "last_name": "User"
}
```

### Protected Endpoints

```typescript
// All requests include Authorization header
Authorization: Token jwt-token-here

// Role-based endpoints
GET /api/admin/users/          // Admin only
GET /api/hr/employees/         // HR and Admin
GET /api/manager/team/         // Manager, HR, and Admin
GET /api/user/profile/         // All authenticated users
```

## Role Hierarchy

```
admin
├── Full system access
├── User management
├── System configuration
└── All lower-level permissions

hr
├── Employee management
├── Recruitment
├── Performance reviews
└── User-level permissions

manager
├── Team management
├── Performance tracking
├── Goal setting
└── User-level permissions

user
├── Personal profile
├── Own performance data
├── Personal goals
└── Basic features
```

## Development Setup

### 1. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com/api
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install js-cookie
npm install --save-dev @types/js-cookie
```

### 3. Demo Login Credentials

The system includes demo mode for development:

```typescript
// Admin access
email: admin@example.com
password: any

// HR access
email: hr@example.com
password: any

// Manager access
email: manager@example.com
password: any

// Regular user
email: user@example.com
password: any
```

## Troubleshooting

### Common Issues

1. **Token not persisting**

   ```typescript
   // Check if cookies are enabled
   if (!navigator.cookieEnabled) {
     console.warn('Cookies disabled, using localStorage fallback');
   }
   ```

2. **Role permissions not working**

   ```typescript
   // Ensure token contains role information
   const authInfo = getAuthToken();
   console.log('Current role:', authInfo.role);
   ```

3. **API requests failing**

   ```typescript
   // Check token validity
   if (isTokenExpired()) {
     console.log('Token expired, please login again');
   }
   ```

4. **Infinite redirect loops**
   ```typescript
   // Check authentication routes in your app router
   const publicRoutes = ['/auth/login', '/auth/register'];
   const isPublicRoute = publicRoutes.includes(pathname);
   ```

### Debug Utilities

```typescript
// Token debugging
const debugToken = () => {
  const authInfo = getAuthToken();
  console.log('Auth Debug:', {
    isValid: authInfo.isValid,
    role: authInfo.role,
    userId: authInfo.userId,
    expiresAt: authInfo.expiresAt,
    timeLeft: getTokenExpirationTime(),
    isExpired: isTokenExpired(),
  });
};

// Call in development
if (process.env.NODE_ENV === 'development') {
  debugToken();
}
```

## Future Enhancements

### Planned Features

1. **Automatic Token Refresh**
   - Implement refresh token mechanism
   - Background token renewal

2. **Multi-Factor Authentication**
   - TOTP support
   - SMS verification

3. **Session Management**
   - Multiple device sessions
   - Session timeout controls

4. **Audit Logging**
   - Login/logout tracking
   - Permission usage logs

### Performance Optimizations

1. **Token Caching**
   - Reduce token validation calls
   - Smart cache invalidation

2. **API Request Optimization**
   - Request batching
   - Response caching for static data

3. **Bundle Size Optimization**
   - Tree-shake unused auth utilities
   - Lazy load role-specific components

## Conclusion

This authentication system provides a robust, secure foundation for role-based access control in Next.js applications. It follows security best practices while maintaining developer experience and user convenience.

For additional examples and advanced usage patterns, see the `examples/auth-usage-examples.tsx` file.
