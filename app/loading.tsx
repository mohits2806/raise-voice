export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-sm w-full text-center">
        {/* Animated Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'rgb(var(--border-primary))',
              borderTopColor: 'rgb(var(--accent-primary))',
              boxShadow: '0 0 20px rgba(var(--accent-primary), 0.3)',
            }}
          ></div>
        </div>

        {/* Loading Text */}
        <h2 
          className="text-xl sm:text-2xl font-bold font-display mb-3"
          style={{ color: 'rgb(var(--text-primary))' }}
        >
          Loading
          <span className="inline-flex ml-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </h2>
        
        <p 
          className="text-sm"
          style={{ color: 'rgb(var(--text-secondary))' }}
        >
          Please wait while we prepare everything for you
        </p>

        {/* Progress Bar */}
        <div 
          className="mt-6 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgb(var(--border-primary))' }}
        >
          <div 
            className="h-full rounded-full animate-shimmer"
            style={{
              backgroundColor: 'rgb(var(--accent-primary))',
              width: '60%',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
