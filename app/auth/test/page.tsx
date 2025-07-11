'use client';

import { useState } from 'react';
import { loginUser, demoLogin } from '@/app/api/loginApi';
import { logoutUser, getCurrentUser, isAuthenticated } from '@/app/api/authApi';

export default function AuthTestPage() {
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<any>(null);

  const testDemoLogin = async () => {
    setStatus('Testing demo login...');
    try {
      const result = await demoLogin({
        email: 'admin@company.com',
        password: 'AdminPass123!'
      });
      
      if (result.success) {
        setStatus('✅ Demo login successful!');
        setUser(getCurrentUser());
      } else {
        setStatus(`❌ Demo login failed: ${result.message}`);
      }
    } catch (error) {
      setStatus(`❌ Demo login error: ${error}`);
    }
  };

  const testRealLogin = async () => {
    setStatus('Testing real API login...');
    try {
      const result = await loginUser({
        email: 'test.user@smarten.com',
        password: 'your-password'
      });
      
      if (result.success) {
        setStatus('✅ Real API login successful!');
        setUser(getCurrentUser());
      } else {
        setStatus(`❌ Real API login failed: ${result.message}`);
      }
    } catch (error) {
      setStatus(`❌ Real API login error: ${error}`);
    }
  };

  const testLogout = async () => {
    setStatus('Testing logout...');
    try {
      await logoutUser();
      setStatus('✅ Logout successful!');
      setUser(null);
    } catch (error) {
      setStatus(`❌ Logout error: ${error}`);
    }
  };

  const checkAuthStatus = () => {
    const authenticated = isAuthenticated();
    const currentUser = getCurrentUser();
    setStatus(`Auth status: ${authenticated ? '✅ Authenticated' : '❌ Not authenticated'}`);
    setUser(currentUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test Controls
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={testDemoLogin}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Test Demo Login (Admin)
              </button>
              
              <button
                onClick={testRealLogin}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Test Real API Login
              </button>
              
              <button
                onClick={testLogout}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Test Logout
              </button>
              
              <button
                onClick={checkAuthStatus}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Check Auth Status
              </button>
            </div>
          </div>

          {/* Status and User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Status & User Info
            </h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Status:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{status || 'No tests run yet'}</p>
              </div>
              
              {user && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current User:</h3>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Demo Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Admin User:</h4>
              <p className="text-blue-700 dark:text-blue-300">Email: admin@company.com</p>
              <p className="text-blue-700 dark:text-blue-300">Password: AdminPass123!</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400">Regular User:</h4>
              <p className="text-blue-700 dark:text-blue-300">Email: user@company.com</p>
              <p className="text-blue-700 dark:text-blue-300">Password: UserPass123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
