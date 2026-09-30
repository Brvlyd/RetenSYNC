'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy path kept for old links/bookmarks.
 * The canonical page is /user/Interactions - this redirect is one way only.
 * (Both pages used to redirect to each other, which hung the browser.)
 */
export default function HRInteractionsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/user/Interactions');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Taking you to HR Interactions...
        </p>
      </div>
    </div>
  );
}
