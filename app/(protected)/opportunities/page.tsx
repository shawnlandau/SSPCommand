'use client';

import { useState } from 'react';
import { Plus, Filter, Search, Download, Eye, Edit, Trash2, Calendar, DollarSign, MapPin, Building } from 'lucide-react';
import { Opportunity, Stage } from '@/types';
import CSVUpload from '@/app/components/CSVUpload';
import DataTable from '@/app/components/DataTable';

interface CSVData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

// Mock data for demonstration
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    accountId: 'acc1',
    name: 'Enterprise Cloud Migration',
    amount: 2500000,
    stage: 'Develop',
    closeDate: '2024-06-30',
    coSell: true,
    state: 'IL',
    heatScore: 85,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    accountId: 'acc2',
    name: 'Data Analytics Platform',
    amount: 1800000,
    stage: 'Propose',
    closeDate: '2024-05-15',
    coSell: false,
    state: 'GA',
    heatScore: 72,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    accountId: 'acc3',
    name: 'Security Infrastructure',
    amount: 3200000,
    stage: 'Qualify',
    closeDate: '2024-08-30',
    coSell: true,
    state: 'TN',
    heatScore: 65,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  }
];

const stageColors: Record<Stage, string> = {
  Prospect: 'bg-gray-100 text-gray-800',
  Qualify: 'bg-blue-100 text-blue-800',
  Develop: 'bg-yellow-100 text-yellow-800',
  Propose: 'bg-orange-100 text-orange-800',
  CloseWon: 'bg-green-100 text-green-800',
  CloseLost: 'bg-red-100 text-red-800'
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [csvData, setCsvData] = useState<CSVData | null>(null);

  const handleCSVUpload = (data: CSVData) => {
    setCsvData(data);
    setShowCSVUpload(false);
    // TODO: Process CSV data and convert to opportunities
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesStage = selectedStage === 'all' || opp.stage === selectedStage;
    const matchesSearch = searchQuery === '' || 
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalPipeline = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgHeatScore = filteredOpportunities.length > 0 
    ? filteredOpportunities.reduce((sum, opp) => sum + (opp.heatScore || 0), 0) / filteredOpportunities.length
    : 0;

  const handleAddOpportunity = () => {
    // TODO: Implement add opportunity modal
    console.log('Add opportunity clicked');
  };

  const handleEditOpportunity = (id: string) => {
    // TODO: Implement edit opportunity modal
    console.log('Edit opportunity:', id);
  };

  const handleDeleteOpportunity = (id: string) => {
    // TODO: Implement delete confirmation
    setOpportunities(opps => opps.filter(opp => opp.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">
            Manage and track your sales opportunities across all territories
          </p>
        </div>

        {/* CSV Upload Section */}
        {!csvData && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Building className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Import Opportunity Data
                </h2>
                <p className="text-muted-foreground mt-1">
                  Upload your CSV file to import opportunities and accounts
                </p>
              </div>
              <button
                onClick={() => setShowCSVUpload(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Import CSV Data
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
                  <h2 className="text-xl font-semibold">Import Opportunity Data</h2>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pipeline</p>
                <p className="text-2xl font-bold">${(totalPipeline / 1_000_000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Opportunities</p>
                <p className="text-2xl font-bold">{filteredOpportunities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Heat Score</p>
                <p className="text-2xl font-bold">{Math.round(avgHeatScore)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Stage Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Stage Filter
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as Stage | 'all')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Stages</option>
                <option value="Prospect">Prospect</option>
                <option value="Qualify">Qualify</option>
                <option value="Develop">Develop</option>
                <option value="Propose">Propose</option>
                <option value="CloseWon">Close Won</option>
                <option value="CloseLost">Close Lost</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleAddOpportunity}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Opportunity
              </button>
            </div>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold">Opportunities</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredOpportunities.length} opportunities found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Opportunity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Stage</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Close Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Territory</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Heat Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="border-b hover:bg-muted/20 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{opportunity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.coSell && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Co-sell
                            </span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stageColors[opportunity.stage]}`}>
                        {opportunity.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">${(opportunity.amount / 1_000_000).toFixed(2)}M</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {opportunity.closeDate ? new Date(opportunity.closeDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{opportunity.state}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${opportunity.heatScore || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{opportunity.heatScore || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOpportunity(opportunity.id)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV Data Table - Show when CSV data is available */}
        {csvData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Imported Data</h2>
            </div>
            <DataTable
              data={csvData.rows}
              headers={csvData.headers}
              title="CSV Opportunity Data"
              subtitle={`${csvData.rows.length} rows of opportunity data imported`}
            />
          </div>
        )}
      </div>
    </div>
  );
}



