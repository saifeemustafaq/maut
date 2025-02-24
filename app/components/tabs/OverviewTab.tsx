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

interface OverviewTabProps {
  data: {
    baseline: {
      criteria: string[];
      methods: string[];
      values: { [key: string]: number[] };
    };
    weights: { [key: string]: number };
    nonEditableContent: {
      process: Array<{
        step: string;
        description: string;
      }>;
    };
  } | null;
  handleMethodSelect: (method: string) => void;
  handleCriteriaSelect: (criteria: string) => void;
  onValueChange: (method: string, criteria: string, value: number) => void;
  onWeightChange: (criteria: string, value: number) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  handleMethodSelect,
  handleCriteriaSelect,
  onValueChange,
  onWeightChange,
}) => {
  if (!data) return null;

  const calculateWeightedScore = (method: string) => {
    return data.baseline.criteria.reduce((total: number, criteria: string, index: number) => {
      const value = data.baseline.values[method][index];
      const weight = data.weights[criteria];
      return total + (value * weight);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Baseline Scores</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criteria</TableHead>
                {data.baseline.methods.map((method: string) => (
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
              {data.baseline.criteria.map((criteria: string, rowIndex: number) => (
                <TableRow key={criteria}>
                  <TableCell>
                    <button
                      onClick={() => handleCriteriaSelect(criteria)}
                      className="text-blue-600 hover:underline"
                    >
                      {criteria}
                    </button>
                  </TableCell>
                  {data.baseline.methods.map((method: string) => (
                    <TableCell key={`${method}-${criteria}`}>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={data.baseline.values[method][rowIndex]}
                        onChange={(e) => onValueChange(method, criteria, Number(e.target.value))}
                        className="w-16 p-1 border rounded"
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
                      className="w-20 p-1 border rounded"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>Weighted Score</TableCell>
                {data.baseline.methods.map((method: string) => (
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