'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import SidebarNew from './sidebar-new';
import HeaderNew from './header-new';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Authentication checks live in components/route-guard.tsx - this component
  // is presentation only.
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f1f5f9\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'27\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'47\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'7\' cy=\'27\' r=\'1\'/%3E%3Ccircle cx=\'27\' cy=\'27\' r=\'1\'/%3E%3Ccircle cx=\'47\' cy=\'27\' r=\'1\'/%3E%3Ccircle cx=\'7\' cy=\'47\' r=\'1\'/%3E%3Ccircle cx=\'27\' cy=\'47\' r=\'1\'/%3E%3Ccircle cx=\'47\' cy=\'47\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23374151\' fill-opacity=\'0.3\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'27\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'47\' cy=\'7\' r=\'1\'/%3E%3Ccircle cx=\'7\' cy=\'27\' r=\'1\'/%3E%3Ccircle cx=\'27\' cy=\'27\' r=\'1\'/%3E%3Ccircle cx=\'47\' cy=\'27\' r=\'1\'/%3E%3Ccircle cx=\'7\' cy=\'47\' r=\'1\'/%3E%3Ccircle cx=\'27\' cy=\'47\' r=\'1\'/%3E%3Ccircle cx=\'47\' cy=\'47\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl floating pointer-events-none"></div>
      <div className="absolute top-3/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl floating-delayed pointer-events-none"></div>

      <SidebarNew
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Dim the page behind the drawer on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main content area with Header. The sidebar only reserves space from
          `lg` upwards - below that it floats over the page as a drawer. */}
      <div className={cn('flex-1 min-w-0 flex flex-col lg:ml-72')}>
        <HeaderNew onToggleSidebar={() => setIsSidebarOpen(open => !open)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="animate-fade-in max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
