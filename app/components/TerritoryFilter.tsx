'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';

interface TerritoryFilterProps {
  territories: string[];
  selectedTerritories: string[];
  onTerritoryChange: (territories: string[]) => void;
  className?: string;
}

export default function TerritoryFilter({
  territories,
  selectedTerritories,
  onTerritoryChange,
  className = ''
}: TerritoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTerritory = (territory: string) => {
    if (selectedTerritories.includes(territory)) {
      onTerritoryChange(selectedTerritories.filter(t => t !== territory));
    } else {
      onTerritoryChange([...selectedTerritories, territory]);
    }
  };

  const selectAll = () => {
    onTerritoryChange([...territories]);
  };

  const clearAll = () => {
    onTerritoryChange([]);
  };

  const selectedCount = selectedTerritories.length;
  const totalCount = territories.length;

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-neutral-50 transition-colors duration-200"
      >
        <MapPin className="w-4 h-4 text-foreground-muted" />
        <span className="text-body-sm font-medium text-foreground">
          {selectedCount === 0 
            ? 'All Territories' 
            : selectedCount === totalCount 
              ? 'All Territories' 
              : `${selectedCount} of ${totalCount} Territories`
          }
        </span>
        <ChevronDown className={`w-4 h-4 text-foreground-muted transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-large z-50 max-h-80 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-neutral-50">
            <div className="flex items-center justify-between">
              <h3 className="text-body-sm font-medium text-foreground">Filter Territories</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-caption text-accent-600 hover:text-accent-700 font-medium"
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="text-caption text-foreground-muted hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Territory List */}
          <div className="max-h-60 overflow-y-auto">
            {territories.map((territory) => (
              <label
                key={territory}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer transition-colors duration-150"
              >
                <input
                  type="checkbox"
                  checked={selectedTerritories.includes(territory)}
                  onChange={() => toggleTerritory(territory)}
                  className="w-4 h-4 text-accent-500 border-border rounded focus:ring-accent-500 focus:ring-2 focus:ring-offset-0"
                />
                <span className="text-body-sm text-foreground">{territory}</span>
              </label>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t bg-neutral-50">
            <div className="flex items-center justify-between text-caption text-foreground-muted">
              <span>{selectedCount} selected</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Territories Pills */}
      {selectedCount > 0 && selectedCount < totalCount && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTerritories.map((territory) => (
            <div
              key={territory}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-50 text-accent-700 text-body-sm rounded-xl border border-accent-200"
            >
              <MapPin className="w-3 h-3" />
              {territory}
              <button
                onClick={() => toggleTerritory(territory)}
                className="ml-1 hover:bg-accent-100 rounded-lg p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
