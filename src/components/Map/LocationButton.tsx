'use client';

import { LocateFixed, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LocationButtonProps {
  onLocationClick: () => void;
  isGettingLocation?: boolean;
}

export default function LocationButton({ onLocationClick, isGettingLocation = false }: LocationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onLocationClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isGettingLocation}
      className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: isHovered ? 'var(--gradient-primary)' : 'rgb(var(--bg-tertiary))',
        border: '2px solid rgb(var(--border-primary))',
      }}
      aria-label="Go to my location"
      title="Go to my location"
    >
      {isGettingLocation ? (
        <Loader2 
          size={24} 
          className="animate-spin text-primary-600 dark:text-primary-400" 
        />
      ) : (
        <LocateFixed 
          size={24}
          className={`transition-colors duration-300 ${
            isHovered 
              ? 'text-white' 
              : 'text-gray-700 dark:text-gray-200'
          }`}
        />
      )}
      
      {/* Pulse effect when active */}
      {!isGettingLocation && (
        <div 
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'var(--gradient-primary)',
            filter: 'blur(10px)',
            zIndex: -1,
          }}
        />
      )}
    </button>
  );
}
