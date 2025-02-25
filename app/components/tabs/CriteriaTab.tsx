'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { COLORS } from '../MAUTDashboard';
import { CriteriaName, MAUTData, MethodName } from '../types';

interface CriteriaTabProps {
  data: MAUTData;
  selectedCriteria: CriteriaName;
  handleCriteriaSelect: (criteria: CriteriaName) => void;
  handleMethodSelect: (method: MethodName) => void;
  onValueChange: (method: MethodName, criteria: CriteriaName, newValue: number) => void;
  onWeightChange: (criteria: CriteriaName, newWeight: number) => void;
  criteriaIcons: { [key in CriteriaName]: React.ReactElement };
  TooltipWrapper: React.FC<{ children: React.ReactNode; content: string }>;
  getCriteriaTooltip: (criteria: CriteriaName) => string;
}

type MethodColors = {
  [key in MethodName]: string;
};

const CriteriaTab: React.FC<CriteriaTabProps> = ({
  data,
  selectedCriteria,
  handleCriteriaSelect,
  handleMethodSelect,
  onValueChange,
  onWeightChange,
  criteriaIcons,
  TooltipWrapper,
  getCriteriaTooltip
}) => {
  if (!data) return null;

  const criteriaIndex = data.baseline.criteria.indexOf(selectedCriteria);
  
  const formatDataForChart = () => {
    return data.baseline.methods.map((method) => ({
      method,
      score: data.baseline.values[method][criteriaIndex],
      weightedScore: data.baseline.values[method][criteriaIndex] * data.weights[selectedCriteria],
    }));
  };

  const getMethodColor = (method: string): string => {
    return (COLORS as MethodColors)[method as keyof MethodColors] || '#8884d8';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {selectedCriteria} Analysis
        </h2>
        <div className="flex space-x-4 mb-6">
          {data.baseline.criteria.map((criteria) => (
            <TooltipWrapper key={criteria} content={getCriteriaTooltip(criteria)}>
              <button
                onClick={() => handleCriteriaSelect(criteria)}
                className={`flex items-center px-4 py-2 rounded-md ${
                  selectedCriteria === criteria ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {criteriaIcons[criteria]}
                {criteria}
              </button>
            </TooltipWrapper>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Scores by Method</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatDataForChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {formatDataForChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getMethodColor(entry.method)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Weighted Scores</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatDataForChart()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis domain={[0, Math.max(...formatDataForChart().map(d => d.weightedScore)) * 1.1]} />
                  <Tooltip />
                  <Bar dataKey="weightedScore" radius={[4, 4, 0, 0]}>
                    {formatDataForChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getMethodColor(entry.method)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Detailed Comparison</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Raw Score</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Weighted Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.baseline.methods.map((method) => {
              const rawScore = data.baseline.values[method][criteriaIndex];
              const weight = data.weights[selectedCriteria];
              const weightedScore = rawScore * weight;

              return (
                <TableRow key={method}>
                  <TableCell>
                    <button
                      onClick={() => handleMethodSelect(method as MethodName)}
                      className="text-blue-600 hover:underline"
                    >
                      {method}
                    </button>
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={rawScore}
                      onChange={(e) =>
                        onValueChange(method as MethodName, selectedCriteria, Number(e.target.value))
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={weight}
                      onChange={(e) =>
                        onWeightChange(selectedCriteria, Number(e.target.value))
                      }
                      className="w-20 p-1 border rounded"
                    />
                  </TableCell>
                  <TableCell>{weightedScore.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Understanding the Scores</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Raw scores range from 1 to 5</li>
            <li>Higher scores indicate better performance</li>
            <li>Weights reflect criteria importance (0-1)</li>
            <li>Weighted scores show actual impact on final decision</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Analysis Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Compare raw scores to see absolute performance</li>
            <li>Check weighted scores for relative importance</li>
            <li>Consider adjusting weights based on project needs</li>
            <li>Look for significant differences between methods</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CriteriaTab; 