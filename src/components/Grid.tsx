import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols: 1 | 2 | 3 | 4 | 12;
  gap?: string;
  className?: string;
}

export function Grid({ children, cols, gap = 'gap-4 md:gap-4 lg:gap-6', className = '' }: GridProps) {
  const colClassMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    12: 'grid-cols-12',
  };

  return (
    <div className={`grid ${colClassMap[cols]} ${gap} ${className}`}>
      {children}
    </div>
  );
}
