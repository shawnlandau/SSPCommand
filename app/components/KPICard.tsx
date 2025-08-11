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
        return 'border-green-200 bg-green-50 text-green-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-border bg-card text-card-foreground';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trend.value < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.value > 0) return 'text-green-600';
    if (trend.value < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${getVariantStyles()} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-3">
          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
        </div>

        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-2 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-muted-foreground">vs {trend.period}</span>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
    </div>
  );
}
