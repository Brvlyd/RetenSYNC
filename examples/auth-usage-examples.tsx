// Complete examples of how to use the role-based authentication system
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  getAuthToken,
  getUserRole,
  hasRole,
  isAdmin,
  getTokenExpirationTime,
  isTokenExpired,
} from '@/lib/auth-token';
import {
  get,
  post,
  put,
  del,
  adminRequest,
  roleBasedRequest,
  getUserProfile,
  updateUserProfile,
} from '@/lib/api-client';

/**
 * Example 1: Protected Component with Role-based Access
 */
export const AdminOnlyComponent: React.FC = () => {
  const { user, userRole, isAdminUser } = useAuth();

  if (!isAdminUser) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Access Denied: Admin privileges required</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800">Admin Panel</h3>
      <p className="text-green-700">
        Welcome, {user?.first_name}! You have admin access.
      </p>
    </div>
  );
};

/**
 * Example 2: Multi-role Component
 */
export const RoleBasedDashboard: React.FC = () => {
  const { user, userRole } = useAuth();

  const renderDashboardContent = () => {
    switch (userRole) {
    case 'admin':
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <h3 className="font-semibold">User Management</h3>
              <p>Manage all users and permissions</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <h3 className="font-semibold">Analytics</h3>
              <p>View system-wide analytics</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-lg">
              <h3 className="font-semibold">Settings</h3>
              <p>Configure system settings</p>
            </div>
          </div>
        </div>
      );
    case 'hr':
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">HR Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-100 rounded-lg">
              <h3 className="font-semibold">Employee Management</h3>
              <p>Manage employee records</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg">
              <h3 className="font-semibold">Recruitment</h3>
              <p>Handle recruitment processes</p>
            </div>
          </div>
        </div>
      );
    case 'manager':
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Manager Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-teal-100 rounded-lg">
              <h3 className="font-semibold">Team Performance</h3>
              <p>View team metrics and KPIs</p>
            </div>
            <div className="p-4 bg-indigo-100 rounded-lg">
              <h3 className="font-semibold">Goals Management</h3>
              <p>Set and track team goals</p>
            </div>
          </div>
        </div>
      );
    case 'user':
    default:
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">User Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">My Performance</h3>
              <p>View your performance metrics</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <h3 className="font-semibold">My Goals</h3>
              <p>Track your personal goals</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
        <p className="text-sm text-gray-600">
          Logged in as: <span className="font-semibold">{user?.email}</span>(
          {<span className="capitalize">{userRole}</span>})
        </p>
      </div>
      {renderDashboardContent()}
    </div>
  );
};

/**
 * Example 3: API Request Examples with Authentication
 */
export const ApiExamplesComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useAuth();

  // Example: GET request
  const handleGetUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getUserProfile();
      setData(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Example: POST request
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await updateUserProfile({
        first_name: 'Updated',
        last_name: 'Name',
      });
      setData(updatedProfile);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Example: Admin-only request
  const handleAdminAction = async () => {
    if (!hasRole('admin')) {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const adminData = await adminRequest('/admin/system-stats/');
      setData(adminData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // Example: Role-based request
  const handleRoleBasedRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      switch (userRole) {
      case 'admin':
        endpoint = '/admin/dashboard-data/';
        break;
      case 'hr':
        endpoint = '/hr/dashboard-data/';
        break;
      case 'manager':
        endpoint = '/manager/dashboard-data/';
        break;
      default:
        endpoint = '/user/dashboard-data/';
      }

      const roleData = await get(endpoint);
      setData(roleData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch role-specific data');
    } finally {
      setLoading(false);
    }
  };

  // Example: File upload
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Using the uploadFile utility
      const { uploadFile } = await import('@/lib/api-client');
      const result = await uploadFile('/upload/avatar/', file, {
        description: 'Profile avatar',
      });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">API Request Examples</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleGetUserProfile}
          disabled={loading}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Get User Profile
        </button>

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Update Profile
        </button>

        <button
          onClick={handleAdminAction}
          disabled={loading || !isAdmin()}
          className="p-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Admin Only Action
        </button>

        <button
          onClick={handleRoleBasedRequest}
          disabled={loading}
          className="p-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Role-based Request
        </button>
      </div>

      {/* File upload example */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">
          Upload File Example:
        </label>
        <input
          type="file"
          onChange={e =>
            e.target.files?.[0] && handleFileUpload(e.target.files[0])
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Display results */}
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-700">Loading...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800 mb-2">Response:</h4>
          <pre className="text-sm text-green-700 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

/**
 * Example 4: Token Management Component
 */
export const TokenInfoComponent: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const updateTokenInfo = () => {
      const authInfo = getAuthToken();
      const expirationTime = getTokenExpirationTime();
      const expired = isTokenExpired();

      setTokenInfo({
        ...authInfo,
        expirationTime,
        expired,
      });
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  if (!tokenInfo) return null;

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Token Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              tokenInfo.isValid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {tokenInfo.isValid ? 'Valid' : 'Invalid'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span className="capitalize">{tokenInfo.role || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">User ID:</span>
          <span>{tokenInfo.userId || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{tokenInfo.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Expires In:</span>
          <span
            className={`${
              tokenInfo.expirationTime !== null && tokenInfo.expirationTime < 60
                ? 'text-red-600 font-semibold'
                : 'text-gray-700'
            }`}
          >
            {tokenInfo.expirationTime !== null
              ? `${tokenInfo.expirationTime} minutes`
              : 'Unknown'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Expired:</span>
          <span
            className={tokenInfo.expired ? 'text-red-600' : 'text-green-600'}
          >
            {tokenInfo.expired ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Example 5: Custom Hook for Role-based Features
 */
export const useRoleBasedFeatures = () => {
  const { userRole } = useAuth();

  const canAccessAdminPanel = hasRole('admin');
  const canManageUsers = hasRole('admin') || hasRole('hr');
  const canViewAnalytics = hasRole('admin') || hasRole('manager');
  const canEditProfile = true; // All users can edit their own profile

  const getAvailableFeatures = () => {
    const features = ['profile'];

    if (canViewAnalytics) features.push('analytics');
    if (canManageUsers) features.push('user-management');
    if (canAccessAdminPanel) features.push('admin-panel');

    return features;
  };

  return {
    userRole,
    canAccessAdminPanel,
    canManageUsers,
    canViewAnalytics,
    canEditProfile,
    availableFeatures: getAvailableFeatures(),
  };
};

/**
 * Example 6: Component using the custom hook
 */
export const FeatureBasedNavigation: React.FC = () => {
  const {
    userRole,
    canAccessAdminPanel,
    canManageUsers,
    canViewAnalytics,
    availableFeatures,
  } = useRoleBasedFeatures();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">
        Available Features for {userRole}
      </h3>
      <div className="space-y-2">
        {availableFeatures.map(feature => (
          <div
            key={feature}
            className="p-2 bg-white border border-gray-200 rounded flex items-center justify-between"
          >
            <span className="capitalize">{feature.replace('-', ' ')}</span>
            <span className="text-green-600 text-sm">✓ Available</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Role-based permissions:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Admin Panel: {canAccessAdminPanel ? '✓' : '✗'}</li>
          <li>User Management: {canManageUsers ? '✓' : '✗'}</li>
          <li>Analytics: {canViewAnalytics ? '✓' : '✗'}</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * Example 7: Complete App Component showing all examples
 */
export const AuthExamplesApp: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please log in to view examples
        </h2>
        <p className="text-gray-600">
          You need to be authenticated to see the role-based features.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Auth System Examples
            </h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Token Information</h2>
              <TokenInfoComponent />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Role-based Access</h2>
              <AdminOnlyComponent />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Feature Navigation</h2>
              <FeatureBasedNavigation />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                Role-based Dashboard
              </h2>
              <RoleBasedDashboard />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">API Examples</h2>
              <ApiExamplesComponent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
