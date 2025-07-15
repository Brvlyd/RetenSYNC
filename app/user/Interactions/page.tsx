'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InteractionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the hr-interactions page since this seems to be the intended behavior
    router.replace('/user/hr-interactions');
  }, [router]);

  // Return a simple loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to HR Interactions...</p>
      </div>
    </div>
  );
}
