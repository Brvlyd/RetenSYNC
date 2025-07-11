'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, Eye, EyeOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { setAuthToken, getAuthToken, isAuthenticated, fetchUserProfile } from '@/app/api/authApi';

interface TokenManagerProps {
  onTokenSet?: (token: string) => void;
}

export default function TokenManager({ onTokenSet }: TokenManagerProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Check if token is already set
    const authenticated = isAuthenticated();
    if (authenticated) {
      setIsTokenSet(true);
      const existingToken = getAuthToken();
      if (existingToken) {
        setToken(existingToken);
      }
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    setIsValidating(true);
    try {
      // Set the token to test it
      setAuthToken(tokenToValidate);
      
      // Try to fetch user profile to validate the token
      await fetchUserProfile();
      
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveToken = async () => {
    if (!token.trim()) {
      setMessage('Please enter a valid token');
      return;
    }

    setMessage('Validating token...');
    
    const isValid = await validateToken(token.trim());
    
    if (isValid) {
      setIsTokenSet(true);
      setMessage('Token saved and validated successfully!');
      onTokenSet?.(token.trim());
    } else {
      setMessage('Invalid token. Please check your token and try again.');
    }
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(''), 5000);
  };

  const handleClearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('api_token');
      localStorage.removeItem('user');
    }
    setToken('');
    setIsTokenSet(false);
    setMessage('Token cleared');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Key className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          API Token Configuration
        </h3>
        {isTokenSet && (
          <CheckCircle className="h-5 w-5 text-green-600" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Authentication Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your API token here..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showToken ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3">            <button
            onClick={handleSaveToken}
            disabled={!token.trim() || isValidating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isValidating ? 'Validating...' : 'Save & Validate Token'}
          </button>
          
          {isTokenSet && (
            <button
              onClick={handleClearToken}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear Token
            </button>
          )}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-2 p-3 rounded-lg ${
              message.includes('success') || message.includes('saved')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : message.includes('Validating')
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {message.includes('success') || message.includes('saved') ? (
              <CheckCircle className="h-4 w-4" />
            ) : message.includes('Validating') ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message}</span>
          </motion.div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            How to get your API token:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Contact your system administrator for the ML Performance API token</li>
            <li>• Or check your user profile/settings for API credentials</li>
            <li>• The token should be in the format provided by your authentication system</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
