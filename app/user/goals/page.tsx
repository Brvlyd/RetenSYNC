'use client';

import React from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/user/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
              <p className="text-gray-600">
                Set and track your professional goals
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Goals Feature Coming Soon
            </h2>

            <p className="text-gray-600 mb-6">
              We&apos;re working on an amazing goals tracking system that will help
              you set, monitor, and achieve your professional objectives. Stay
              tuned!
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                In the meantime, you can explore other features like Performance
                Review and Self Assessment from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
