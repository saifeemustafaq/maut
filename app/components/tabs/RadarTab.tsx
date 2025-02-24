'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { COLORS } from '../MAUTDashboard';

interface RadarTabProps {
  data: {
    baseline: {
      criteria: string[];
      methods: string[];
      values: { [key: string]: number[] };
    };
    weights: { [key: string]: number };
  } | null;
}

type MethodColors = {
  [key in 'Scrum' | 'XP' | 'Kanban' | 'Scrumban' | 'Our Method']: string;
};

const RadarTab: React.FC<RadarTabProps> = ({ data }) => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  if (!data) return null;

  const formatDataForRadar = () => {
    return data.baseline.criteria.map((criteria, index) => {
      const dataPoint: { [key: string]: any } = {
        criteria,
      };

      data.baseline.methods.forEach((method) => {
        if (selectedMethods.length === 0 || selectedMethods.includes(method)) {
          dataPoint[method] = data.baseline.values[method][index];
        }
      });

      return dataPoint;
    });
  };

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const getMethodColor = (method: string): string => {
    return (COLORS as MethodColors)[method as keyof MethodColors] || '#8884d8';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Method Comparison</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.baseline.methods.map((method) => (
            <button
              key={method}
              onClick={() => toggleMethod(method)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedMethods.length === 0 || selectedMethods.includes(method)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={formatDataForRadar()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="criteria" />
              <PolarRadiusAxis domain={[0, 5]} />
              {data.baseline.methods.map((method) => {
                if (selectedMethods.length === 0 || selectedMethods.includes(method)) {
                  const color = getMethodColor(method);
                  return (
                    <Radar
                      key={method}
                      name={method}
                      dataKey={method}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.3}
                    />
                  );
                }
                return null;
              })}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">How to Read This Chart</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Each axis represents a criteria</li>
            <li>Values range from 0 (center) to 5 (outer edge)</li>
            <li>Larger area indicates better overall performance</li>
            <li>Click method names above to compare specific methods</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Key Insights</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Compare shapes to identify strengths and weaknesses</li>
            <li>Look for balanced performance across all criteria</li>
            <li>Consider trade-offs between different methods</li>
            <li>Focus on criteria most important to your project</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RadarTab; 