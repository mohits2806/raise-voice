'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-400" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong!</h2>
        <p className="text-white/80 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <button
          onClick={reset}
          className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
