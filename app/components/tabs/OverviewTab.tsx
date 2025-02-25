'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import ScaleInterpretation from '../ui/ScaleInterpretation';
import { CRITERIA_COLORS } from '../MAUTDashboard';
import { CriteriaName, MAUTData, MethodName } from '../types';

interface OverviewTabProps {
  data: MAUTData;
  handleMethodSelect: (method: MethodName) => void;
  handleCriteriaSelect: (criteria: CriteriaName) => void;
  onValueChange: (method: MethodName, criteria: CriteriaName, newValue: number) => void;
  onWeightChange: (criteria: CriteriaName, newWeight: number) => void;
  criteriaIcons: { [key in CriteriaName]: React.ReactElement };
  TooltipWrapper: React.FC<{ children: React.ReactNode; content: string }>;
  getCriteriaTooltip: (criteria: CriteriaName) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  handleMethodSelect,
  handleCriteriaSelect,
  onValueChange,
  onWeightChange,
  criteriaIcons,
  TooltipWrapper,
  getCriteriaTooltip
}) => {
  if (!data) return null;

  const calculateWeightedScore = (method: MethodName) => {
    return data.baseline.criteria.reduce((total: number, criteria: CriteriaName, index: number) => {
      const value = data.baseline.values[method][index];
      const weight = data.weights[criteria];
      return total + (value * weight);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Baseline Scores (click any criteria for detailed visualization)</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criteria</TableHead>
                {data.baseline.methods.map((method: MethodName) => (
                  <TableHead key={method}>
                    <button
                      onClick={() => handleMethodSelect(method)}
                      className="text-blue-600 hover:underline"
                    >
                      {method}
                    </button>
                  </TableHead>
                ))}
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.baseline.criteria.map((criteria: CriteriaName, rowIndex: number) => {
                const colors = CRITERIA_COLORS[criteria];
                return (
                  <React.Fragment key={criteria}>
                    <TableRow style={{ backgroundColor: colors.light }}>
                      <TableCell>
                        <TooltipWrapper content={getCriteriaTooltip(criteria)}>
                          <div 
                            onClick={() => handleCriteriaSelect(criteria)}
                            className="flex items-center cursor-pointer hover:text-blue-600"
                          >
                            {criteriaIcons[criteria]}
                            <button
                              className="text-lg font-semibold hover:underline"
                              style={{ color: colors.dark }}
                            >
                              {criteria}
                            </button>
                          </div>
                        </TooltipWrapper>
                      </TableCell>
                      {data.baseline.methods.map((method: MethodName) => (
                        <TableCell key={`${method}-${criteria}`}>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={data.baseline.values[method][rowIndex]}
                            onChange={(e) => onValueChange(method, criteria, Number(e.target.value))}
                            className="w-16 p-1 border rounded bg-white"
                            style={{ borderColor: colors.medium }}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={data.weights[criteria]}
                          onChange={(e) => onWeightChange(criteria, Number(e.target.value))}
                          className="w-20 p-1 border rounded bg-white"
                          style={{ borderColor: colors.medium }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ backgroundColor: colors.light }}>
                      <TableCell colSpan={data.baseline.methods.length + 2}>
                        <ScaleInterpretation 
                          scaleInterpretation={data.nonEditableContent.factsAndAssumptions[criteria].scaleInterpretation}
                          criteria={criteria}
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              <TableRow className="font-bold">
                <TableCell>Weighted Score</TableCell>
                {data.baseline.methods.map((method: MethodName) => (
                  <TableCell key={`${method}-weighted`}>
                    {calculateWeightedScore(method).toFixed(2)}
                  </TableCell>
                ))}
                <TableCell>
                  {Object.values(data.weights).reduce((a: number, b: number) => a + b, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Process Overview</h2>
        <div className="grid gap-4">
          {data.nonEditableContent.process.map((step, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">{step.step}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 