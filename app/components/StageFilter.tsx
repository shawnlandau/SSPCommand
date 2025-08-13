'use client';

import { X } from 'lucide-react';
import { Stage } from '@/types';

interface StageFilterProps {
  selectedStages: Stage[];
  onStageChange: (stages: Stage[]) => void;
  className?: string;
}

const stages: Stage[] = ['Prospect', 'Qualify', 'Develop', 'Propose', 'CloseWon', 'CloseLost'];

const stageColors: Record<Stage, string> = {
  Prospect: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  Qualify: 'bg-accent-100 text-accent-700 border-accent-200',
  Develop: 'bg-warning-100 text-warning-700 border-warning-200',
  Propose: 'bg-warning-100 text-warning-700 border-warning-200',
  CloseWon: 'bg-success-100 text-success-700 border-success-200',
  CloseLost: 'bg-danger-100 text-danger-700 border-danger-200'
};

export default function StageFilter({
  selectedStages,
  onStageChange,
  className = ''
}: StageFilterProps) {
  const toggleStage = (stage: Stage) => {
    if (selectedStages.includes(stage)) {
      onStageChange(selectedStages.filter(s => s !== stage));
    } else {
      onStageChange([...selectedStages, stage]);
    }
  };

  const clearAll = () => {
    onStageChange([]);
  };

  const selectAll = () => {
    onStageChange(stages);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-800">
          Filter by Stage
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-accent-600 hover:text-accent-700 font-medium"
          >
            Select All
          </button>
          <span className="text-neutral-600">•</span>
          <button
            onClick={clearAll}
            className="text-xs text-neutral-600 hover:text-neutral-800"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => {
          const isSelected = selectedStages.includes(stage);
          return (
            <button
              key={stage}
              onClick={() => toggleStage(stage)}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200
                ${isSelected 
                  ? `${stageColors[stage]} shadow-soft` 
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }
              `}
            >
              {stage}
              {isSelected && (
                <X className="w-3 h-3" />
              )}
            </button>
          );
        })}
      </div>

      {selectedStages.length > 0 && (
        <div className="text-xs text-neutral-600">
          {selectedStages.length} stage{selectedStages.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
