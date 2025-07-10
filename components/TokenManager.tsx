'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface TokenManagerProps {
  onTokenSet?: (token: string) => void;
}

export default function TokenManager({ onTokenSet }: TokenManagerProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if token is already set
    const existingToken = localStorage.getItem('api_token') || localStorage.getItem('authToken');
    if (existingToken && existingToken !== 'your-api-token-here') {
      setIsTokenSet(true);
      setToken(existingToken);
    }
  }, []);

  const handleSaveToken = () => {
    if (!token.trim()) {
      setMessage('Please enter a valid token');
      return;
    }

    try {
      localStorage.setItem('api_token', token.trim());
      setIsTokenSet(true);
      setMessage('Token saved successfully!');
      onTokenSet?.(token.trim());
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save token');
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('authToken');
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
            ML Performance API Token
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

        <div className="flex gap-3">
          <button
            onClick={handleSaveToken}
            disabled={!token.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Token
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
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            {message.includes('success') || message.includes('saved') ? (
              <CheckCircle className="h-4 w-4" />
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
