'use client';

import { useState } from 'react';
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

  const kpis: KPI = {
    pipelineUSD: 2750000,
    coverageRatio: 2.3,
    winRate: 0.28,
    coSellCount: 7,
  };

  const handleTerritoryChange = (territories: string[]) => {
    setSelectedTerritories(territories);
  };

  const handleCSVUpload = (data: CSVData) => {
    setCsvData(data);
    setShowCSVUpload(false);
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
  };

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

  // Sample chart data
  const pipelineByStateData = generateBarChartData(
    ['CA', 'TX', 'NY', 'FL', 'IL'],
    [850, 720, 680, 590, 520]
  );

  const heatScoreData = generatePieChartData(
    ['High (80-100)', 'Medium (60-79)', 'Low (40-59)', 'Very Low (0-39)'],
    [35, 40, 20, 5]
  );

  const winRateTrendData = generateLineChartData(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [22, 25, 28, 26, 30, 28]
  );

  const territoryPerformanceData = generateBarChartData(
    ['West', 'Central', 'East', 'South'],
    [1200, 980, 1100, 850]
  );

  const stageDistributionData = generatePieChartData(
    ['Prospect', 'Qualify', 'Develop', 'Propose', 'Close'],
    [25, 20, 30, 15, 10]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-hero text-foreground">
            Territory Command Center
          </h1>
          <p className="text-body text-foreground-secondary">
            Manage your SSP territory pipeline and opportunities with data-driven insights
          </p>
        </div>

        {/* CSV Upload Section */}
        {!csvData && (
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200 rounded-2xl p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-accent-100 rounded-2xl">
                  <Database className="w-10 h-10 text-accent-600" />
                </div>
              </div>
              <div>
                <h2 className="text-section text-foreground">
                  Get Started with Your Data
                </h2>
                <p className="text-body text-foreground-secondary mt-2">
                  Upload your CSV file to begin analyzing your territory data and unlock powerful insights
                </p>
              </div>
              <button
                onClick={() => setShowCSVUpload(true)}
                className="btn-primary inline-flex items-center gap-3"
              >
                <Upload className="w-5 h-5" />
                Upload CSV Data
              </button>
            </div>
          </div>
        )}

        {/* Upload Success Toast */}
        {showUploadSuccess && (
          <div className="fixed top-6 right-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow-medium z-50">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-body-sm font-medium text-green-800">Upload Successful!</p>
                <p className="text-caption text-green-600">Your data has been processed and is ready for analysis</p>
              </div>
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
        {showCSVUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-large w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-section text-foreground">Upload CSV Data</h2>
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

        {/* Territory Filter */}
        <div className="flex items-center justify-between">
          <TerritoryFilter
            territories={territories.states}
            selectedTerritories={selectedTerritories}
            onTerritoryChange={handleTerritoryChange}
          />
          
          {csvData && (
            <div className="flex items-center gap-2 text-body-sm text-foreground-muted">
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
              <h2 className="text-section text-foreground">Your Data</h2>
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
            data={pipelineByStateData}
            height={400}
          />
          <Chart
            type="pie"
            title="Heat Score Distribution"
            subtitle="Opportunity scoring and prioritization"
            data={heatScoreData}
            height={400}
          />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Chart
            type="line"
            title="Win Rate Trends"
            subtitle="Monthly win rate progression"
            data={winRateTrendData}
            height={300}
          />
          <Chart
            type="bar"
            title="Territory Performance"
            subtitle="Revenue by territory comparison"
            data={territoryPerformanceData}
            height={300}
          />
          <Chart
            type="pie"
            title="Stage Distribution"
            subtitle="Opportunities by sales stage"
            data={stageDistributionData}
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



