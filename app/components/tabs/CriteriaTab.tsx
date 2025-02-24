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

interface CriteriaTabProps {
  data: {
    baseline: {
      criteria: string[];
      methods: string[];
      values: { [key: string]: number[] };
    };
    weights: { [key: string]: number };
  } | null;
  selectedCriteria: string;
  handleMethodSelect: (method: string) => void;
  onValueChange: (method: string, criteria: string, value: number) => void;
  onWeightChange: (criteria: string, value: number) => void;
}

type MethodColors = {
  [key in 'Scrum' | 'XP' | 'Kanban' | 'Scrumban' | 'Our Method']: string;
};

const CriteriaTab: React.FC<CriteriaTabProps> = ({
  data,
  selectedCriteria,
  handleMethodSelect,
  onValueChange,
  onWeightChange,
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
                      onClick={() => handleMethodSelect(method)}
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
                        onValueChange(method, selectedCriteria, Number(e.target.value))
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