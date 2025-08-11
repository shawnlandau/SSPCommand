'use client';

import { useState } from 'react';
import { DollarSign, Target, TrendingUp, Users, Upload, Database, Table } from 'lucide-react';
import { KPI } from '@/types';
import territories from '@/config/territories.json';
import KPICard from '@/app/components/KPICard';
import TerritoryFilter from '@/app/components/TerritoryFilter';
import ActionBar from '@/app/components/ActionBar';
import ChartPlaceholder from '@/app/components/ChartPlaceholder';
import CSVUpload from '@/app/components/CSVUpload';
import DataTable from '@/app/components/DataTable';

interface CSVData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

export default function DashboardPage() {
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [showCSVUpload, setShowCSVUpload] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Territory Command Center
          </h1>
          <p className="text-muted-foreground">
            Manage your SSP territory pipeline and opportunities
          </p>
        </div>

        {/* CSV Upload Section */}
        {!csvData && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Database className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Get Started with Your Data
                </h2>
                <p className="text-muted-foreground mt-1">
                  Upload your CSV file to begin analyzing your territory data
                </p>
              </div>
              <button
                onClick={() => setShowCSVUpload(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload CSV Data
              </button>
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
        {showCSVUpload && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Upload CSV Data</h2>
                  <button
                    onClick={() => setShowCSVUpload(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              <Table className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Data</h2>
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
          <ChartPlaceholder
            title="Pipeline by State"
            subtitle="Monthly pipeline distribution across territories"
            type="bar"
            height={400}
          />
          <ChartPlaceholder
            title="Heat Score Distribution"
            subtitle="Opportunity scoring and prioritization"
            type="pie"
            height={400}
          />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartPlaceholder
            title="Win Rate Trends"
            subtitle="Monthly win rate progression"
            type="line"
            height={300}
          />
          <ChartPlaceholder
            title="Territory Performance"
            subtitle="Revenue by territory comparison"
            type="bar"
            height={300}
          />
          <ChartPlaceholder
            title="Stage Distribution"
            subtitle="Opportunities by sales stage"
            type="pie"
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



