'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center animate-bounce-in">
        {/* 404 Icon with Pulse Animation */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
            style={{
              backgroundColor: 'rgba(var(--accent-warning), 0.1)',
              boxShadow: '0 0 30px rgba(var(--accent-warning), 0.3)',
            }}
          >
            <Search 
              size={40} 
              style={{ color: 'rgb(var(--accent-warning))' }}
            />
          </div>
        </div>

        {/* 404 Message */}
        <h1 
          className="text-6xl font-bold font-display mb-2 text-gradient"
        >
          404
        </h1>
        <h2 
          className="text-2xl sm:text-3xl font-bold font-display mb-3"
          style={{ color: 'rgb(var(--text-primary))' }}
        >
          Page Not Found
        </h2>
        
        <p 
          className="text-sm sm:text-base mb-8 leading-relaxed"
          style={{ color: 'rgb(var(--text-secondary))' }}
        >
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            <Home size={18} />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex-1"
            style={{
              backgroundColor: 'rgb(var(--bg-tertiary))',
              border: '2px solid rgb(var(--border-primary))',
              color: 'rgb(var(--text-primary))',
            }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgb(var(--border-primary))' }}>
          <p className="text-xs font-medium" style={{ color: 'rgb(var(--text-tertiary))' }}>
            RaiseVoice
          </p>
        </div>
      </div>
    </div>
  );
}
