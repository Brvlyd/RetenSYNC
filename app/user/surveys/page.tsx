'use client';

import React from 'react';
import { FileText, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function SurveysPage() {
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
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
              <p className="text-gray-600">
                Complete surveys and provide feedback
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Surveys Feature Coming Soon
            </h2>

            <p className="text-gray-600 mb-6">
              We&apos;re developing a comprehensive survey system that will allow you
              to participate in company-wide surveys, pulse checks, and feedback
              forms.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                For now, you can use the Self Assessment feature to provide
                feedback about your performance and development needs.
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/user/self-assessment"
                className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Go to Self Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
