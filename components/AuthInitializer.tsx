'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/app/api/demoAuth';

export default function AuthInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if we're on an auth route
        if (pathname?.startsWith('/auth')) {
          setIsInitialized(true);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('User not authenticated, redirecting to login');
          // Add a small delay to prevent flashing
          setTimeout(() => {
            router.push('/auth/login');
          }, 100);
          return;
        }

        // Initialize auth to refresh user data
        const authenticated = isAuthenticated();
        
        if (!authenticated) {
          console.log('User not authenticated, redirecting to login');
          setTimeout(() => {
            router.push('/auth/login');
          }, 100);
          return;
        }
        
        console.log('Auth initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Only redirect to login if we're not already on an auth route
        if (!pathname?.startsWith('/auth')) {
          setTimeout(() => {
            router.push('/auth/login');
          }, 100);
        }
        setIsInitialized(true);
      }
    };

    // Only initialize after a short delay to prevent race conditions
    const timer = setTimeout(initialize, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, router]);

  return null; // This component doesn't render anything
}
