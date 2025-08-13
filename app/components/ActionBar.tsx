'use client';

import { useState } from 'react';
import { Plus, FileText, Package, Search, Filter, Download } from 'lucide-react';

interface ActionBarProps {
  onAddOpportunity?: () => void;
  onLogNote?: () => void;
  onPrepPack?: () => void;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  className?: string;
}

export default function ActionBar({
  onAddOpportunity,
  onLogNote,
  onPrepPack,
  onSearch,
  onExport,
  className = ''
}: ActionBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  return (
    <div className={`sticky bottom-4 z-30 ${className}`}>
      <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-large p-4">
        <div className="flex items-center gap-3">
          {/* Primary Actions */}
          <div className="flex items-center gap-2">
            {onAddOpportunity && (
              <button
                onClick={onAddOpportunity}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Opportunity
              </button>
            )}
            
            {onLogNote && (
              <button
                onClick={onLogNote}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Log Note
              </button>
            )}
            
            {onPrepPack && (
              <button
                onClick={onPrepPack}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Prep Pack
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-neutral-200" />

          {/* Search */}
          {onSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Search opportunities, accounts, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      onSearch('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Secondary Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-colors duration-200 ${
                showFilters 
                  ? 'bg-accent-500 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            
            {onExport && (
              <button
                onClick={onExport}
                className="p-2.5 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 hover:text-neutral-800 transition-colors duration-200"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-3 pt-3 border-t border-neutral-200/50">
          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <span>Press <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs">/</kbd> to search</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs">N</kbd> to add opportunity</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs">Esc</kbd> to clear search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
