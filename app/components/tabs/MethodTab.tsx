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

type MethodName = 'Scrum' | 'XP' | 'Kanban' | 'Scrumban' | 'Our Method';
type CriteriaName = 'Team size' | 'Team distribution' | 'Application Criticality' | 'Requirement Volatility' |
                    'Development Speed' | 'Cost Management' | 'Scalability' | 'Quality Assurance' | 'Workflow Efficiency';

interface MethodTabProps {
  data: {
    baseline: {
      criteria: CriteriaName[];
      methods: MethodName[];
      values: { [key in MethodName]: number[] };
    };
    weights: { [key in CriteriaName]: number };
  } | null;
  selectedMethod: MethodName;
  handleMethodSelect: (method: MethodName) => void;
  handleCriteriaSelect: (criteria: CriteriaName) => void;
  onValueChange: (method: MethodName, criteria: CriteriaName, value: number) => void;
}

type MethodColors = {
  [key in MethodName]: string;
};

const MethodTab: React.FC<MethodTabProps> = ({
  data,
  selectedMethod,
  handleMethodSelect,
  handleCriteriaSelect,
  onValueChange,
}) => {
  if (!data) return null;

  const formatDataForChart = () => {
    return data.baseline.criteria.map((criteria, index) => ({
      criteria,
      score: data.baseline.values[selectedMethod][index],
      weightedScore: data.baseline.values[selectedMethod][index] * data.weights[criteria],
    }));
  };

  const getMethodColor = (method: MethodName): string => {
    return (COLORS as MethodColors)[method] || '#8884d8';
  };

  const calculateTotalScore = () => {
    return data.baseline.criteria.reduce((total, criteria, index) => {
      return total + (data.baseline.values[selectedMethod][index] * data.weights[criteria]);
    }, 0);
  };

  const findStrengths = () => {
    return formatDataForChart()
      .filter(item => item.score >= 4)
      .sort((a, b) => b.score - a.score);
  };

  const findWeaknesses = () => {
    return formatDataForChart()
      .filter(item => item.score <= 3)
      .sort((a, b) => a.score - b.score);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {selectedMethod} Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Raw Scores by Criteria</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatDataForChart()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="criteria" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {formatDataForChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getMethodColor(selectedMethod)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Weighted Scores by Criteria</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatDataForChart()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, Math.max(...formatDataForChart().map(d => d.weightedScore)) * 1.1]} />
                  <YAxis dataKey="criteria" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="weightedScore" radius={[0, 4, 4, 0]}>
                    {formatDataForChart().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getMethodColor(selectedMethod)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Detailed Scores</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criteria</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Weighted Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.baseline.criteria.map((criteria, index) => {
              const score = data.baseline.values[selectedMethod][index];
              const weight = data.weights[criteria];
              const weightedScore = score * weight;

              return (
                <TableRow key={criteria}>
                  <TableCell>
                    <button
                      onClick={() => handleCriteriaSelect(criteria)}
                      className="text-blue-600 hover:underline"
                    >
                      {criteria}
                    </button>
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={score}
                      onChange={(e) =>
                        onValueChange(selectedMethod, criteria, Number(e.target.value))
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </TableCell>
                  <TableCell>{weight.toFixed(2)}</TableCell>
                  <TableCell>{weightedScore.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
            <TableRow className="font-bold">
              <TableCell>Total Score</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{calculateTotalScore().toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Strengths</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {findStrengths().map((item) => (
              <li key={item.criteria}>
                <button
                  onClick={() => handleCriteriaSelect(item.criteria)}
                  className="text-blue-600 hover:underline"
                >
                  {item.criteria}
                </button>
                {' - '}Score: {item.score}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Areas for Improvement</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {findWeaknesses().map((item) => (
              <li key={item.criteria}>
                <button
                  onClick={() => handleCriteriaSelect(item.criteria)}
                  className="text-blue-600 hover:underline"
                >
                  {item.criteria}
                </button>
                {' - '}Score: {item.score}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Compare with Other Methods</h3>
        <div className="flex flex-wrap gap-2">
          {data.baseline.methods
            .filter((method) => method !== selectedMethod)
            .map((method) => (
              <button
                key={method}
                onClick={() => handleMethodSelect(method)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {method}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MethodTab; 