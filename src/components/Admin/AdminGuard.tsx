'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-12 animate-pulse">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
            style={{
              borderColor: 'rgb(var(--border-primary))',
              borderTopColor: 'rgb(var(--accent-primary))',
            }}
          ></div>
          <p className="text-lg font-medium mt-4" style={{ color: 'rgb(var(--text-primary))' }}>
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
