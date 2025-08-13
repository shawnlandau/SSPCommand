'use client';

import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Target, TrendingUp, Users, Upload, Database, Table, CheckCircle } from 'lucide-react';
import { KPI } from '@/types';
import territories from '@/config/territories.json';
import KPICard from '@/app/components/KPICard';
import TerritoryFilter from '@/app/components/TerritoryFilter';
import ActionBar from '@/app/components/ActionBar';
import Chart from '@/app/components/Chart';
import CSVUpload from '@/app/components/CSVUpload';
import DataTable from '@/app/components/DataTable';
import { generateBarChartData, generateLineChartData, generatePieChartData } from '@/app/components/Chart';

interface CSVData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

export default function DashboardPage() {
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  // Process CSV data to generate dynamic KPIs and charts
  const processedData = useMemo(() => {
    if (!csvData) return null;

    try {
      // Find relevant column indices
      const valueIndex = csvData.headers.findIndex(h => 
        h.toLowerCase().includes('value') || h.toLowerCase().includes('amount') || h.toLowerCase().includes('revenue')
      );
      const stageIndex = csvData.headers.findIndex(h => 
        h.toLowerCase().includes('stage') || h.toLowerCase().includes('status')
      );
      const territoryIndex = csvData.headers.findIndex(h => 
        h.toLowerCase().includes('territory') || h.toLowerCase().includes('state') || h.toLowerCase().includes('region')
      );
      const scoreIndex = csvData.headers.findIndex(h => 
        h.toLowerCase().includes('score') || h.toLowerCase().includes('heat') || h.toLowerCase().includes('priority')
      );
      const dateIndex = csvData.headers.findIndex(h => 
        h.toLowerCase().includes('date') || h.toLowerCase().includes('created') || h.toLowerCase().includes('updated')
      );

      // Calculate KPIs
      let totalValue = 0;
      let closedWonCount = 0;
      let totalCount = 0;
      const territoryValues: { [key: string]: number } = {};
      const stageCounts: { [key: string]: number } = {};
      const scoreRanges: { [key: string]: number } = { 'High (80-100)': 0, 'Medium (60-79)': 0, 'Low (40-59)': 0, 'Very Low (0-39)': 0 };
      const monthlyData: { [key: string]: number } = {};

      csvData.rows.forEach(row => {
        // Calculate total value
        if (valueIndex >= 0 && row[valueIndex]) {
          const value = parseFloat(row[valueIndex].replace(/[$,]/g, ''));
          if (!isNaN(value)) {
            totalValue += value;
          }
        }

        // Count by stage
        if (stageIndex >= 0 && row[stageIndex]) {
          const stage = row[stageIndex].toLowerCase();
          stageCounts[stage] = (stageCounts[stage] || 0) + 1;
          if (stage.includes('won') || stage.includes('closed')) {
            closedWonCount++;
          }
          totalCount++;
        }

        // Aggregate by territory
        if (territoryIndex >= 0 && row[territoryIndex] && valueIndex >= 0 && row[valueIndex]) {
          const territory = row[territoryIndex];
          const value = parseFloat(row[valueIndex].replace(/[$,]/g, ''));
          if (!isNaN(value)) {
            territoryValues[territory] = (territoryValues[territory] || 0) + value;
          }
        }

        // Categorize by score
        if (scoreIndex >= 0 && row[scoreIndex]) {
          const score = parseFloat(row[scoreIndex]);
          if (!isNaN(score)) {
            if (score >= 80) scoreRanges['High (80-100)']++;
            else if (score >= 60) scoreRanges['Medium (60-79)']++;
            else if (score >= 40) scoreRanges['Low (40-59)']++;
            else scoreRanges['Very Low (0-39)']++;
          }
        }

        // Aggregate by month
        if (dateIndex >= 0 && row[dateIndex] && valueIndex >= 0 && row[valueIndex]) {
          try {
            const date = new Date(row[dateIndex]);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            const value = parseFloat(row[valueIndex].replace(/[$,]/g, ''));
            if (!isNaN(value)) {
              monthlyData[monthKey] = (monthlyData[monthKey] || 0) + value;
            }
          } catch (e) {
            // Skip invalid dates
          }
        }
      });

      // Generate dynamic KPIs
      const kpis: KPI = {
        pipelineUSD: totalValue,
        coverageRatio: totalValue > 0 ? (totalValue / 1000000) : 0, // Assuming 1M quota
        winRate: totalCount > 0 ? closedWonCount / totalCount : 0,
        coSellCount: Math.floor(totalCount * 0.3), // Estimate 30% are co-sell
      };

      // Generate dynamic chart data
      const territoryLabels = Object.keys(territoryValues);
      const territoryValuesArray = Object.values(territoryValues);
      
      const stageLabels = Object.keys(stageCounts);
      const stageValues = Object.values(stageCounts);
      
      const scoreLabels = Object.keys(scoreRanges);
      const scoreValues = Object.values(scoreRanges);
      
      const monthLabels = Object.keys(monthlyData).sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a) - months.indexOf(b);
      });
      const monthValues = monthLabels.map(month => monthlyData[month] || 0);

      return {
        kpis,
        charts: {
          pipelineByState: generateBarChartData(territoryLabels, territoryValuesArray),
          stageDistribution: generatePieChartData(stageLabels, stageValues),
          heatScoreDistribution: generatePieChartData(scoreLabels, scoreValues),
          winRateTrends: generateLineChartData(monthLabels, monthValues),
          territoryPerformance: generateBarChartData(territoryLabels, territoryValuesArray),
        }
      };
    } catch (error) {
      console.error('Error processing CSV data:', error);
      return null;
    }
  }, [csvData]);

  // Use processed data or fallback to sample data
  const kpis = processedData?.kpis || {
    pipelineUSD: 2750000,
    coverageRatio: 2.3,
    winRate: 0.28,
    coSellCount: 7,
  };

  const chartData = processedData?.charts || {
    pipelineByState: generateBarChartData(['CA', 'TX', 'NY', 'FL', 'IL'], [850, 720, 680, 590, 520]),
    stageDistribution: generatePieChartData(['Prospect', 'Qualify', 'Develop', 'Propose', 'Close'], [25, 20, 30, 15, 10]),
    heatScoreDistribution: generatePieChartData(['High (80-100)', 'Medium (60-79)', 'Low (40-59)', 'Very Low (0-39)'], [35, 40, 20, 5]),
    winRateTrends: generateLineChartData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], [22, 25, 28, 26, 30, 28]),
    territoryPerformance: generateBarChartData(['West', 'Central', 'East', 'South'], [1200, 980, 1100, 850]),
  };

  const handleTerritoryChange = (territories: string[]) => {
    setSelectedTerritories(territories);
  };

  const handleCSVUpload = (data: CSVData) => {
    setCsvData(data);
    setShowCSVUpload(false);
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('ssp-csv-data', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  // Load CSV data from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ssp-csv-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCsvData(parsed);
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }, []);

  const handleAddOpportunity = () => {
    // TODO: Implement add opportunity modal
    console.log('Add opportunity clicked');
  };

  const handleLogNote = () => {
    // TODO: Implement log note modal
    console.log('Log note clicked');
  };

  const handlePrepPack = () => {
    // TODO: Implement prep pack modal
    console.log('Prep pack clicked');
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked');
  };

  const handleClearData = () => {
    setCsvData(null);
    localStorage.removeItem('ssp-csv-data');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900">
            Territory Command Center
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl">
            Manage your SSP territory pipeline and opportunities with data-driven insights and comprehensive analytics
          </p>
        </div>

        {/* CSV Upload Section */}
        {!csvData && (
          <div className="bg-gradient-accent border border-accent-200 rounded-3xl p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-accent-100 rounded-2xl">
                  <Database className="w-12 h-12 text-accent-600" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-neutral-900">
                  Get Started with Your Data
                </h2>
                <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
                  Upload your CSV file to begin analyzing your territory data and unlock powerful insights for better decision making
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowCSVUpload(true)}
                  className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
                >
                  <Upload className="w-6 h-6" />
                  Upload CSV Data
                </button>
                <a
                  href="/sample-data.csv"
                  download
                  className="btn-secondary inline-flex items-center gap-3 text-lg px-8 py-4"
                >
                  <Database className="w-6 h-6" />
                  Download Sample Data
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Upload Success Toast */}
        {showUploadSuccess && (
          <div className="toast toast-success">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <div>
                <p className="text-sm font-medium text-success-800">Upload Successful!</p>
                <p className="text-xs text-success-600">Your data has been processed and is ready for analysis</p>
              </div>
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
        {showCSVUpload && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-neutral-900">Upload CSV Data</h2>
                  <button
                    onClick={() => setShowCSVUpload(false)}
                    className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CSVUpload onDataUpload={handleCSVUpload} />
              </div>
            </div>
          </div>
        )}

        {/* Data Management Section */}
        {csvData && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-accent-600" />
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Data Loaded Successfully</h3>
                  <p className="text-sm text-neutral-600">
                    {csvData.rows.length} opportunities • {csvData.headers.length} columns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCSVUpload(true)}
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Update Data
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 text-sm text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-xl transition-colors"
                >
                  Clear Data
                </button>
              </div>
            </div>
            
            {/* Data Preview */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    {csvData.headers.slice(0, 6).map((header, index) => (
                      <th key={index} className="px-3 py-2 text-left text-neutral-600 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-neutral-100 hover:bg-neutral-50">
                      {row.slice(0, 6).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-neutral-800">
                          {cell || <span className="text-neutral-400">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Territory Filter */}
        <div className="flex items-center justify-between">
          <TerritoryFilter
            territories={territories.states}
            selectedTerritories={selectedTerritories}
            onTerritoryChange={handleTerritoryChange}
          />
          
          {csvData && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Database className="w-4 h-4" />
              <span>{csvData.rows.length} rows loaded</span>
            </div>
          )}
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Pipeline Value"
            value={`$${(kpis.pipelineUSD / 1_000_000).toFixed(2)}M`}
            subtitle="Total opportunity value"
            icon={<DollarSign className="w-5 h-5" />}
            trend={{ value: 12.5, period: 'last month' }}
            variant="success"
          />
          <KPICard
            title="Coverage Ratio"
            value={`${kpis.coverageRatio.toFixed(1)}x`}
            subtitle="Pipeline to quota ratio"
            icon={<Target className="w-5 h-5" />}
            trend={{ value: -2.1, period: 'last month' }}
            variant="warning"
          />
          <KPICard
            title="Win Rate"
            value={`${Math.round(kpis.winRate * 100)}%`}
            subtitle="Closed won opportunities"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 5.3, period: 'last month' }}
            variant="success"
          />
          <KPICard
            title="Co-sell Opportunities"
            value={kpis.coSellCount.toString()}
            subtitle="Active co-sell deals"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 15.2, period: 'last month' }}
            variant="default"
          />
        </div>

        {/* Data Table - Show when CSV data is available */}
        {csvData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-accent-600" />
              <h2 className="text-2xl font-semibold text-neutral-900">Your Data</h2>
            </div>
            <DataTable
              data={csvData.rows}
              headers={csvData.headers}
              title="CSV Data Analysis"
              subtitle={`${csvData.rows.length} rows of data uploaded successfully`}
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            type="bar"
            title="Pipeline by State"
            subtitle="Monthly pipeline distribution across territories"
            data={chartData.pipelineByState}
            height={400}
          />
          <Chart
            type="pie"
            title="Heat Score Distribution"
            subtitle="Opportunity scoring and prioritization"
            data={chartData.heatScoreDistribution}
            height={400}
          />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Chart
            type="line"
            title="Win Rate Trends"
            subtitle="Monthly win rate progression"
            data={chartData.winRateTrends}
            height={300}
          />
          <Chart
            type="bar"
            title="Territory Performance"
            subtitle="Revenue by territory comparison"
            data={chartData.territoryPerformance}
            height={300}
          />
          <Chart
            type="pie"
            title="Stage Distribution"
            subtitle="Opportunities by sales stage"
            data={chartData.stageDistribution}
            height={300}
          />
        </div>
      </div>

      {/* Action Bar */}
      <ActionBar
        onAddOpportunity={handleAddOpportunity}
        onLogNote={handleLogNote}
        onPrepPack={handlePrepPack}
        onSearch={handleSearch}
        onExport={handleExport}
      />
    </div>
  );
}



