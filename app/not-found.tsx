'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Icon */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">404</span>
        </div>
        
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Page Not Found
          </h1>
          
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or is temporarily unavailable.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/user/dashboard"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
        
        {/* Help Text */}
        <div className="text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
