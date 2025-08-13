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
  Qualify: 'bg-accent-50 text-accent-700 border-accent-200',
  Develop: 'bg-amber-50 text-amber-700 border-amber-200',
  Propose: 'bg-orange-50 text-orange-700 border-orange-200',
  CloseWon: 'bg-green-50 text-green-700 border-green-200',
  CloseLost: 'bg-red-50 text-red-700 border-red-200'
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
        <label className="text-body-sm font-medium text-foreground">
          Filter by Stage
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className="text-caption text-accent-600 hover:text-accent-700 font-medium"
          >
            Select All
          </button>
          <span className="text-foreground-muted">•</span>
          <button
            onClick={clearAll}
            className="text-caption text-foreground-muted hover:text-foreground"
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
                inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-body-sm font-medium transition-all duration-200
                ${isSelected 
                  ? `${stageColors[stage]} shadow-soft` 
                  : 'bg-neutral-50 text-foreground-muted border-neutral-200 hover:bg-neutral-100'
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
        <div className="text-caption text-foreground-muted">
          {selectedStages.length} stage{selectedStages.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
