'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { saveAuthToken, updateAuthToken, TokenData } from '@/lib/auth-token';

/**
 * Enhanced Login Hook with Role Switching Support
 */
export const useEnhancedAuth = () => {
  const { login: baseLogin, logout, user, userRole, isLoading } = useAuth();
  const [switchingRole, setSwitchingRole] = useState(false);

  /**
   * Login with automatic role detection
   */
  const loginWithRole = async (email: string, password: string, preferredRole?: string) => {
    try {
      // Try the base login first
      const success = await baseLogin(email, password);
      if (success) {
        return { success: true, role: userRole };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  /**
   * Switch user role (for demo/testing purposes)
   */
  const switchRole = async (newRole: 'admin' | 'hr' | 'manager' | 'user') => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setSwitchingRole(true);
    try {
      // Create new token data with different role
      const newTokenData: TokenData = {
        token: `demo-token-${newRole}-${Date.now()}`,
        role: newRole,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        userId: user.id,
        email: user.email
      };

      // Update the token with new role
      const updated = updateAuthToken(newTokenData);
      
      if (updated) {
        // Force a page reload to update the auth context
        window.location.reload();
        return { success: true, newRole };
      } else {
        return { success: false, error: 'Failed to update token' };
      }
    } catch (error) {
      console.error('Role switch failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Role switch failed' 
      };
    } finally {
      setSwitchingRole(false);
    }
  };

  /**
   * Login as specific demo user
   */
  const loginAsDemo = async (demoRole: 'admin' | 'hr' | 'manager' | 'user') => {
    const demoCredentials = {
      admin: { email: 'admin@retensync.com', password: 'admin123' },
      hr: { email: 'hr@retensync.com', password: 'hr123' },
      manager: { email: 'manager@retensync.com', password: 'manager123' },
      user: { email: 'employee@retensync.com', password: 'user123' }
    };

    const credentials = demoCredentials[demoRole];
    return await loginWithRole(credentials.email, credentials.password, demoRole);
  };

  return {
    loginWithRole,
    loginAsDemo,
    switchRole,
    logout,
    user,
    userRole,
    isLoading,
    switchingRole
  };
};

/**
 * Role Switching Component
 */
export const RoleSwitchComponent: React.FC = () => {
  const { switchRole, user, userRole, switchingRole } = useEnhancedAuth();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'hr' | 'manager' | 'user'>('user');

  const roles = [
    { value: 'admin' as const, label: 'Admin', color: 'bg-red-500', description: 'Full system access' },
    { value: 'hr' as const, label: 'HR', color: 'bg-blue-500', description: 'HR management' },
    { value: 'manager' as const, label: 'Manager', color: 'bg-green-500', description: 'Team management' },
    { value: 'user' as const, label: 'Employee', color: 'bg-gray-500', description: 'Standard user' }
  ];

  const handleRoleSwitch = async () => {
    const result = await switchRole(selectedRole);
    if (!result.success) {
      alert(`Failed to switch role: ${result.error}`);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please log in to switch roles</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Switch User Role</h3>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-700">
          <strong>Current Role:</strong> <span className="capitalize">{userRole}</span>
        </div>
        <div className="text-sm text-blue-600">
          <strong>User:</strong> {user.email}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select New Role:
        </label>
        {roles.map((role) => (
          <label key={role.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="role"
              value={role.value}
              checked={selectedRole === role.value}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              disabled={switchingRole}
            />
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
              <span className="text-sm font-medium text-gray-900">{role.label}</span>
              <span className="text-xs text-gray-500">({role.description})</span>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleRoleSwitch}
        disabled={switchingRole || selectedRole === userRole}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {switchingRole ? 'Switching Role...' : `Switch to ${roles.find(r => r.value === selectedRole)?.label}`}
      </button>

      <p className="mt-3 text-xs text-gray-500">
        Note: Switching roles will reload the page to update your permissions.
      </p>
    </div>
  );
};

/**
 * Quick Login Component for Demo Users
 */
export const QuickLoginComponent: React.FC = () => {
  const { loginAsDemo, isLoading } = useEnhancedAuth();
  const [loginStatus, setLoginStatus] = useState<{ [key: string]: 'idle' | 'loading' | 'success' | 'error' }>({});

  const demoUsers = [
    {
      role: 'admin' as const,
      label: 'Admin User',
      description: 'Full administrative access',
      color: 'border-red-200 bg-red-50 hover:bg-red-100',
      icon: '🛡️'
    },
    {
      role: 'hr' as const,
      label: 'HR Specialist',
      description: 'HR management capabilities',
      color: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
      icon: '👥'
    },
    {
      role: 'manager' as const,
      label: 'Team Manager',
      description: 'Team and performance management',
      color: 'border-green-200 bg-green-50 hover:bg-green-100',
      icon: '📊'
    },
    {
      role: 'user' as const,
      label: 'Employee',
      description: 'Standard employee access',
      color: 'border-gray-200 bg-gray-50 hover:bg-gray-100',
      icon: '👤'
    }
  ];

  const handleQuickLogin = async (role: 'admin' | 'hr' | 'manager' | 'user') => {
    setLoginStatus(prev => ({ ...prev, [role]: 'loading' }));
    
    try {
      const result = await loginAsDemo(role);
      if (result.success) {
        setLoginStatus(prev => ({ ...prev, [role]: 'success' }));
        // The auth context will handle the redirect
      } else {
        setLoginStatus(prev => ({ ...prev, [role]: 'error' }));
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      setLoginStatus(prev => ({ ...prev, [role]: 'error' }));
      console.error('Quick login failed:', error);
    }
  };

  const getButtonState = (role: string) => {
    const status = loginStatus[role] || 'idle';
    switch (status) {
      case 'loading':
        return { text: 'Logging in...', disabled: true };
      case 'success':
        return { text: 'Redirecting...', disabled: true };
      case 'error':
        return { text: 'Try Again', disabled: false };
      default:
        return { text: 'Quick Login', disabled: false };
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Demo Login</h3>
      <p className="text-sm text-gray-600 mb-6">
        Click any button below to quickly log in as a demo user with different role permissions:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {demoUsers.map((user) => {
          const buttonState = getButtonState(user.role);
          
          return (
            <button
              key={user.role}
              onClick={() => handleQuickLogin(user.role)}
              disabled={buttonState.disabled || isLoading}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${user.color} ${
                buttonState.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{user.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 mb-1">{user.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{user.description}</div>
                  <div className="text-xs font-medium text-gray-800 bg-white bg-opacity-50 px-2 py-1 rounded">
                    {buttonState.text}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><strong>Admin:</strong> admin@retensync.com / admin123</div>
          <div><strong>HR:</strong> hr@retensync.com / hr123</div>
          <div><strong>Manager:</strong> manager@retensync.com / manager123</div>
          <div><strong>Employee:</strong> employee@retensync.com / user123</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Complete Authentication Demo Component
 */
export const AuthenticationDemo: React.FC = () => {
  const { user, userRole, logout } = useEnhancedAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Role-Based Authentication Demo
        </h1>
        <p className="text-gray-600">
          Explore different user roles and their permissions in the RetenSYNC system
        </p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current User Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current User</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{userRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user.first_name} {user.last_name}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Role Switching */}
          <RoleSwitchComponent />
        </div>
      ) : (
        <QuickLoginComponent />
      )}
    </div>
  );
};
