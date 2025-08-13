'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    period: string;
  };
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  className = ''
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-accent-200 bg-accent-50';
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      case 'danger':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-accent-600';
      case 'warning':
        return 'text-amber-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-accent-500';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="w-4 h-4 text-accent-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-foreground-muted" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) return 'text-accent-600';
    if (trend.value < 0) return 'text-red-500';
    return 'text-foreground-muted';
  };

  return (
    <div className={`card p-6 transition-all duration-300 hover:shadow-medium ${getVariantStyles()} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-body-sm font-medium text-foreground-muted mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-caption text-foreground-muted">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-neutral-100 ${getIconColor()}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-hero font-bold text-foreground">
          {value}
        </div>
      </div>

      {trend && (
        <div className={`flex items-center gap-2 text-body-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-medium">
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-foreground-muted">vs {trend.period}</span>
        </div>
      )}
    </div>
  );
}
