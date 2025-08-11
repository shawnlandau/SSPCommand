'use client';

import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

interface ChartPlaceholderProps {
  title: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: number;
  className?: string;
}

export default function ChartPlaceholder({
  title,
  subtitle,
  type = 'bar',
  height = 340,
  className = ''
}: ChartPlaceholderProps) {
  const getChartIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-8 h-8" />;
      case 'line':
        return <TrendingUp className="w-8 h-8" />;
      case 'pie':
        return <PieChart className="w-8 h-8" />;
      case 'area':
        return <Activity className="w-8 h-8" />;
      default:
        return <BarChart3 className="w-8 h-8" />;
    }
  };

  const getChartTypeName = () => {
    switch (type) {
      case 'bar':
        return 'Bar Chart';
      case 'line':
        return 'Line Chart';
      case 'pie':
        return 'Pie Chart';
      case 'area':
        return 'Area Chart';
      default:
        return 'Chart';
    }
  };

  return (
    <div 
      className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {getChartTypeName()}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-6">
        <div className="h-full flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="mb-4 p-4 bg-muted/50 rounded-full text-muted-foreground">
            {getChartIcon()}
          </div>
          
          {/* Message */}
          <h4 className="text-lg font-medium text-card-foreground mb-2">
            Chart Coming Soon
          </h4>
          <p className="text-sm text-muted-foreground max-w-xs">
            This chart will display {title.toLowerCase()} data. 
            Upload your CSV data to see visualizations.
          </p>
          
          {/* Mock Data Preview */}
          <div className="mt-6 w-full max-w-sm">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="w-16">
                    <div className="h-2 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Data will be visualized here</span>
          <span>CSV Upload Required</span>
        </div>
      </div>
    </div>
  );
}
