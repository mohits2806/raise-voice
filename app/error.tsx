'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center animate-bounce-in">
        {/* Error Icon with Pulse Animation */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
            style={{
              backgroundColor: 'rgba(var(--accent-error), 0.1)',
              boxShadow: '0 0 30px rgba(var(--accent-error), 0.3)',
            }}
          >
            <AlertTriangle 
              size={40} 
              style={{ color: 'rgb(var(--accent-error))' }}
            />
          </div>
        </div>

        {/* Error Message */}
        <h2 
          className="text-2xl sm:text-3xl font-bold font-display mb-3"
          style={{ color: 'rgb(var(--text-primary))' }}
        >
          Oops! Something Went Wrong
        </h2>
        
        <p 
          className="text-sm sm:text-base mb-6 leading-relaxed"
          style={{ color: 'rgb(var(--text-secondary))' }}
        >
          We encountered an unexpected error. Don&apos;t worry, these things happen! 
          Try refreshing the page or go back to the home page.
        </p>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div 
            className="mb-6 p-4 rounded-xl text-left text-xs sm:text-sm font-mono overflow-auto max-h-32"
            style={{
              backgroundColor: 'rgba(var(--accent-error), 0.05)',
              border: '1px solid rgba(var(--accent-error), 0.2)',
              color: 'rgb(var(--text-secondary))',
            }}
          >
            <p className="font-semibold mb-1" style={{ color: 'rgb(var(--accent-error))' }}>
              Error Message:
            </p>
            <p className="break-words">{error.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex-1"
            style={{
              backgroundColor: 'rgb(var(--bg-tertiary))',
              border: '2px solid rgb(var(--border-primary))',
              color: 'rgb(var(--text-primary))',
            }}
          >
            <Home size={18} />
            Go Home
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgb(var(--border-primary))' }}>
          <p className="text-xs" style={{ color: 'rgb(var(--text-tertiary))' }}>
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}
