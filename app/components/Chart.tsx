'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  subtitle?: string;
  data: ChartData<'bar' | 'line' | 'pie' | 'doughnut'>;
  height?: number;
  className?: string;
}

export default function Chart({
  type,
  title,
  subtitle,
  data,
  height = 400,
  className = ''
}: ChartProps) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
            size: 12
          },
          color: '#4D4D4D'
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#262626',
        bodyColor: '#4D4D4D',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: 600
        },
        bodyFont: {
          family: 'Inter',
          size: 12
        }
      }
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        const barOptions: ChartOptions<'bar'> = {
          ...baseOptions,
          scales: {
            x: {
              grid: {
                color: '#F0F0F0'
              },
              ticks: {
                color: '#666666',
                font: {
                  family: 'Inter',
                  size: 11
                }
              }
            },
            y: {
              grid: {
                color: '#F0F0F0'
              },
              ticks: {
                color: '#666666',
                font: {
                  family: 'Inter',
                  size: 11
                }
              }
            }
          }
        };
        return <Bar data={data as ChartData<'bar'>} options={barOptions} />;
      
      case 'line':
        const lineOptions: ChartOptions<'line'> = {
          ...baseOptions,
          scales: {
            x: {
              grid: {
                color: '#F0F0F0'
              },
              ticks: {
                color: '#666666',
                font: {
                  family: 'Inter',
                  size: 11
                }
              }
            },
            y: {
              grid: {
                color: '#F0F0F0'
              },
              ticks: {
                color: '#666666',
                font: {
                  family: 'Inter',
                  size: 11
                }
              }
            }
          }
        };
        return <Line data={data as ChartData<'line'>} options={lineOptions} />;
      
      case 'pie':
        return <Pie data={data as ChartData<'pie'>} options={baseOptions} />;
      
      case 'doughnut':
        return <Doughnut data={data as ChartData<'doughnut'>} options={baseOptions} />;
      
      default:
        return <Bar data={data as ChartData<'bar'>} options={baseOptions} />;
    }
  };

  return (
    <div className={`card ${className}`} style={{ height }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
        <div>
          <h3 className="text-2xl font-semibold text-neutral-800">{title}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6 h-full">
        <div style={{ height: height - 120 }}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
}

// Sample data generators for different chart types
export const generateBarChartData = (labels: string[], values: number[]): ChartData<'bar'> => ({
  labels,
  datasets: [
    {
      label: 'Value',
      data: values,
      backgroundColor: values.map((_, index) => 
        index === 0 ? '#627D98' : '#BCCCDC'
      ),
      borderColor: values.map((_, index) => 
        index === 0 ? '#486581' : '#9FB3C8'
      ),
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }
  ]
});

export const generateLineChartData = (labels: string[], values: number[]): ChartData<'line'> => ({
  labels,
  datasets: [
    {
      label: 'Trend',
      data: values,
      borderColor: '#627D98',
      backgroundColor: 'rgba(98, 125, 152, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#627D98',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
    }
  ]
});

export const generatePieChartData = (labels: string[], values: number[]): ChartData<'pie'> => ({
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: [
        '#627D98',
        '#BCCCDC',
        '#9FB3C8',
        '#D9E2EC',
        '#F0F4F8'
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }
  ]
});
