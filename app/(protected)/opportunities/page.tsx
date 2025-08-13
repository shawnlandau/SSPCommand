'use client';

import { useState } from 'react';
import { Plus, Filter, Search, Download, Eye, Edit, Trash2, Calendar, DollarSign, MapPin, Building, CheckCircle } from 'lucide-react';
import { Opportunity, Stage } from '@/types';
import CSVUpload from '@/app/components/CSVUpload';
import DataTable from '@/app/components/DataTable';
import OpportunityModal from '@/app/components/OpportunityModal';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import StageFilter from '@/app/components/StageFilter';

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
  Prospect: 'bg-neutral-100 text-neutral-700',
  Qualify: 'bg-accent-50 text-accent-700',
  Develop: 'bg-amber-50 text-amber-700',
  Propose: 'bg-orange-50 text-orange-700',
  CloseWon: 'bg-green-50 text-green-700',
  CloseLost: 'bg-red-50 text-red-700'
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingOpportunityId, setDeletingOpportunityId] = useState<string | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleCSVUpload = (data: CSVData) => {
    setCsvData(data);
    setShowCSVUpload(false);
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
    // TODO: Process CSV data and convert to opportunities
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesStage = selectedStages.length === 0 || selectedStages.includes(opp.stage);
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
    setEditingOpportunity(null);
    setShowOpportunityModal(true);
  };

  const handleEditOpportunity = (id: string) => {
    const opportunity = opportunities.find(opp => opp.id === id);
    setEditingOpportunity(opportunity || null);
    setShowOpportunityModal(true);
  };

  const handleDeleteOpportunity = (id: string) => {
    setDeletingOpportunityId(id);
    setShowDeleteConfirm(true);
  };

  const handleSaveOpportunity = (opportunityData: Partial<Opportunity>) => {
    if (editingOpportunity) {
      // Update existing opportunity
      setOpportunities(opps => opps.map(opp => 
        opp.id === editingOpportunity.id 
          ? { ...opp, ...opportunityData, updatedAt: new Date().toISOString() }
          : opp
      ));
    } else {
      // Create new opportunity
      const newOpportunity: Opportunity = {
        id: Date.now().toString(),
        accountId: 'acc' + Date.now(),
        ...opportunityData,
        coSell: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Opportunity;
      setOpportunities(opps => [...opps, newOpportunity]);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingOpportunityId) {
      setOpportunities(opps => opps.filter(opp => opp.id !== deletingOpportunityId));
      setDeletingOpportunityId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-hero text-foreground">Opportunities</h1>
          <p className="text-body text-foreground-secondary">
            Manage and track your sales opportunities across all territories with comprehensive insights
          </p>
        </div>

        {/* CSV Upload Section */}
        {!csvData && (
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200 rounded-2xl p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-accent-100 rounded-2xl">
                  <Building className="w-10 h-10 text-accent-600" />
                </div>
              </div>
              <div>
                <h2 className="text-section text-foreground">
                  Import Opportunity Data
                </h2>
                <p className="text-body text-foreground-secondary mt-2">
                  Upload your CSV file to import opportunities and accounts for comprehensive tracking
                </p>
              </div>
              <button
                onClick={() => setShowCSVUpload(true)}
                className="btn-primary inline-flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Import CSV Data
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
                <p className="text-body-sm font-medium text-green-800">Import Successful!</p>
                <p className="text-caption text-green-600">Your opportunity data has been imported and is ready for analysis</p>
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
                  <h2 className="text-section text-foreground">Import Opportunity Data</h2>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-body-sm text-foreground-muted">Total Pipeline</p>
                <p className="text-hero font-bold text-foreground">${(totalPipeline / 1_000_000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-100 rounded-xl">
                <Building className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <p className="text-body-sm text-foreground-muted">Active Opportunities</p>
                <p className="text-hero font-bold text-foreground">{filteredOpportunities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-body-sm text-foreground-muted">Avg Heat Score</p>
                <p className="text-hero font-bold text-foreground">{Math.round(avgHeatScore)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stage Filter */}
            <StageFilter
              selectedStages={selectedStages}
              onStageChange={setSelectedStages}
            />

            {/* Search */}
            <div>
              <label className="block text-body-sm font-medium text-foreground mb-2">
                Search Opportunities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Search by name or territory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleAddOpportunity}
                className="btn-primary w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </button>
            </div>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-neutral-50">
            <h3 className="text-section text-foreground">Opportunities</h3>
            <p className="text-body-sm text-foreground-muted mt-1">
              {filteredOpportunities.length} opportunities found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Opportunity</th>
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Stage</th>
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Amount</th>
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Close Date</th>
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Territory</th>
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Heat Score</th>
                  <th className="px-6 py-3 text-left text-body-sm font-medium text-foreground-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="border-b hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{opportunity.name}</p>
                        {opportunity.coSell && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-100 text-accent-700 text-caption rounded-full mt-1">
                            Co-sell
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-body-sm font-medium rounded-xl ${stageColors[opportunity.stage]}`}>
                        {opportunity.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">${(opportunity.amount / 1_000_000).toFixed(2)}M</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-foreground-muted" />
                        <span className="text-body-sm">
                          {opportunity.closeDate ? new Date(opportunity.closeDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-foreground-muted" />
                        <span className="text-body-sm">{opportunity.state}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-neutral-100 rounded-full h-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${opportunity.heatScore || 0}%` }}
                          />
                        </div>
                        <span className="text-body-sm font-medium">{opportunity.heatScore || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOpportunity(opportunity.id)}
                          className="p-2 text-foreground-muted hover:text-foreground hover:bg-neutral-100 rounded-xl transition-colors duration-200"
                          aria-label="Edit opportunity"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                          className="p-2 text-foreground-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                          aria-label="Delete opportunity"
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
              <Building className="w-5 h-5 text-accent-600" />
              <h2 className="text-section text-foreground">Imported Data</h2>
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

      {/* Opportunity Modal */}
      <OpportunityModal
        isOpen={showOpportunityModal}
        onClose={() => {
          setShowOpportunityModal(false);
          setEditingOpportunity(null);
        }}
        opportunity={editingOpportunity}
        onSave={handleSaveOpportunity}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingOpportunityId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Opportunity"
        message="Are you sure you want to delete this opportunity? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}



