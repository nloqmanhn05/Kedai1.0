import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon?: string; // Material symbol name
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  trend, 
  trendType = 'neutral', 
  icon, 
  className = '' 
}: StatCardProps) {
  const trendColor = trendType === 'up' 
    ? 'text-primary' 
    : trendType === 'down' 
    ? 'text-error' 
    : 'text-outline';

  const trendIcon = trendType === 'up'
    ? 'arrow_upward'
    : trendType === 'down'
    ? 'arrow_downward'
    : 'horizontal_rule';

  return (
    <Card padding="p-6" className={`bg-surface-container-lowest flex items-start justify-between ${className}`}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span className="font-mono text-2xl md:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-1 mt-1 ${trendColor}`}>
            <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
            {trend}
          </span>
        )}
      </div>

      {icon && (
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px] lg:text-[24px]">
            {icon}
          </span>
        </div>
      )}
    </Card>
  );
}
