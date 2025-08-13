'use client';

import { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, MapPin, Target, Flame } from 'lucide-react';
import { Opportunity, Stage } from '@/types';
import territories from '@/config/territories.json';

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity?: Opportunity | null;
  onSave: (opportunity: Partial<Opportunity>) => void;
}

const stages: Stage[] = ['Prospect', 'Qualify', 'Develop', 'Propose', 'CloseWon', 'CloseLost'];

export default function OpportunityModal({
  isOpen,
  onClose,
  opportunity,
  onSave
}: OpportunityModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    stage: 'Prospect' as Stage,
    amount: '',
    closeDate: '',
    state: '',
    heatScore: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (opportunity) {
      setFormData({
        name: opportunity.name || '',
        stage: opportunity.stage || 'Prospect',
        amount: opportunity.amount ? (opportunity.amount / 1000000).toString() : '',
        closeDate: opportunity.closeDate || '',
        state: opportunity.state || '',
        heatScore: opportunity.heatScore?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        stage: 'Prospect',
        amount: '',
        closeDate: '',
        state: '',
        heatScore: ''
      });
    }
    setErrors({});
  }, [opportunity]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'Territory is required';
    }
    
    if (!formData.heatScore || parseInt(formData.heatScore) < 0 || parseInt(formData.heatScore) > 100) {
      newErrors.heatScore = 'Heat score must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const opportunityData: Partial<Opportunity> = {
      name: formData.name.trim(),
      stage: formData.stage,
      amount: parseFloat(formData.amount) * 1000000,
      closeDate: formData.closeDate || undefined,
      state: formData.state,
      heatScore: parseInt(formData.heatScore)
    };
    
    onSave(opportunityData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-large w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-section text-foreground">
            {opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Opportunity Name */}
          <div>
            <label className="block text-body-sm font-medium text-foreground mb-2">
              Opportunity Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter opportunity name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Stage and Amount Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-foreground mb-2">
                Stage *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="input-field pl-10"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-foreground mb-2">
                Amount (M) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`input-field pl-10 ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Close Date and Territory Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-foreground mb-2">
                Close Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => handleInputChange('closeDate', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-foreground mb-2">
                Territory *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`input-field pl-10 ${errors.state ? 'border-red-300 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select territory</option>
                  {territories.states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Heat Score */}
          <div>
            <label className="block text-body-sm font-medium text-foreground mb-2">
              Heat Score (0-100) *
            </label>
            <div className="relative">
              <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="number"
                min="0"
                max="100"
                value={formData.heatScore}
                onChange={(e) => handleInputChange('heatScore', e.target.value)}
                className={`input-field pl-10 ${errors.heatScore ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="0-100"
              />
            </div>
            {errors.heatScore && (
              <p className="mt-1 text-sm text-red-500">{errors.heatScore}</p>
            )}
            <p className="mt-1 text-caption text-foreground-muted">
              Higher scores indicate higher priority opportunities
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {opportunity ? 'Update' : 'Create'} Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
