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
        return 'border-success-200 bg-success-50';
      case 'warning':
        return 'border-warning-200 bg-warning-50';
      case 'danger':
        return 'border-danger-200 bg-danger-50';
      default:
        return 'border-neutral-200 bg-white';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success-600';
      case 'warning':
        return 'text-warning-600';
      case 'danger':
        return 'text-danger-600';
      default:
        return 'text-accent-600';
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'success':
        return 'bg-success-100';
      case 'warning':
        return 'bg-warning-100';
      case 'danger':
        return 'bg-danger-100';
      default:
        return 'bg-accent-100';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="w-4 h-4 text-success-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="w-4 h-4 text-danger-600" />;
    } else {
      return <Minus className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) return 'text-success-600';
    if (trend.value < 0) return 'text-danger-600';
    return 'text-neutral-500';
  };

  return (
    <div className={`card-elevated p-6 transition-all duration-300 hover:shadow-large ${getVariantStyles()} ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-neutral-600 mb-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-neutral-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${getIconBg()} ${getIconColor()}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-neutral-900">
          {value}
        </div>
      </div>

      {trend && (
        <div className={`flex items-center gap-2 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-medium">
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-neutral-500">vs {trend.period}</span>
        </div>
      )}
    </div>
  );
}
