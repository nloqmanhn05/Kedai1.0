import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: 'p-0' | 'p-4' | 'p-6' | 'p-8';
  className?: string;
  onClick?: () => void;
}

export function Card({ children, padding = 'p-6', className = '', onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border border-outline-variant/30 shadow-sm ${padding} ${className} ${onClick ? 'cursor-pointer hover:bg-surface-container-low transition-all duration-200' : ''}`}
    >
      {children}
    </div>
  );
}
