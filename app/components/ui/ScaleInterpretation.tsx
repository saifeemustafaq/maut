import React from 'react';
import { CRITERIA_COLORS } from '../MAUTDashboard';
import type { CriteriaName } from '../MAUTDashboard';

interface ScaleInterpretationProps {
  scaleInterpretation: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  criteria: CriteriaName;
}

const ScaleInterpretation: React.FC<ScaleInterpretationProps> = ({ scaleInterpretation, criteria }) => {
  const colors = CRITERIA_COLORS[criteria];
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(scaleInterpretation).map(([score, interpretation]) => (
        <div
          key={score}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: colors.light,
            color: '#1a1a1a',
            border: `1px solid ${colors.medium}`,
          }}
        >
          <span className="font-bold mr-2" style={{ color: colors.medium }}>{score} pts</span>
          {interpretation}
        </div>
      ))}
    </div>
  );
};

export default ScaleInterpretation; 