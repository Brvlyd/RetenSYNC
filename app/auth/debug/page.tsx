'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from '@/app/api/authApi';

export default function LoginDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    updateDebugInfo();
  }, []);

  const updateDebugInfo = () => {
    const token = localStorage.getItem('authToken');
    const user = getCurrentUser();
    const authenticated = isAuthenticated();
    
    setDebugInfo({
      token: token || 'No token found',
      user: user || 'No user data',
      authenticated,
      localStorage: {
        authToken: localStorage.getItem('authToken'),
        userData: localStorage.getItem('userData'),
        allKeys: Object.keys(localStorage)
      },
      timestamp: new Date().toISOString()
    });
  };

  const performAutoLogin = async () => {
    setAutoLogin(true);
    try {
      const { demoLogin } = await import('@/app/api/loginApi');
      
      console.log('Attempting demo login...');
      const result = await demoLogin({
        email: 'admin@company.com',
        password: 'AdminPass123!'
      });
      
      console.log('Demo login result:', result);
      
      if (result.success) {
        console.log('✅ Auto-login successful!');
        updateDebugInfo();
      } else {
        console.log('❌ Auto-login failed:', result.message);
      }
    } catch (error) {
      console.error('Auto-login error:', error);
    }
    setAutoLogin(false);
  };

  const clearStorage = () => {
    localStorage.clear();
    updateDebugInfo();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Login Debug Information
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Debug Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Debug Controls
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={performAutoLogin}
                disabled={autoLogin}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {autoLogin ? 'Auto-Login in Progress...' : 'Auto-Login as Admin'}
              </button>
              
              <button
                onClick={updateDebugInfo}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Refresh Debug Info
              </button>
              
              <button
                onClick={clearStorage}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear Storage
              </button>
              
              <a
                href="/auth/login"
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors inline-block text-center"
              >
                Go to Login Page
              </a>
            </div>
          </div>

          {/* Debug Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current State
            </h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Authentication Status:
                </h3>
                <p className={`text-sm font-medium ${
                  debugInfo.authenticated ? 'text-green-600' : 'text-red-600'
                }`}>
                  {debugInfo.authenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Token Status:
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 break-all">
                  {typeof debugInfo.token === 'string' ? debugInfo.token : 'No token'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Debug Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Detailed Debug Information
          </h2>
          
          <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-96 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {/* Login Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Manual Login Instructions
          </h3>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <p>1. Go to <strong>/auth/login</strong></p>
            <p>2. Enter email: <strong>admin@company.com</strong></p>
            <p>3. Enter password: <strong>AdminPass123!</strong></p>
            <p>4. Click Login button</p>
            <p>5. Check browser console for any errors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
