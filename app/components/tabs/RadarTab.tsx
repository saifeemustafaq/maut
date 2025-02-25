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
import { CriteriaName, MAUTData, MethodName } from '../types';

interface RadarTabProps {
  data: MAUTData;
  criteriaIcons: { [key in CriteriaName]: React.ReactElement };
}

type MethodColors = {
  [key in MethodName]: string;
};

interface RadarDataPoint {
  criteria: CriteriaName;
  [key: string]: CriteriaName | number | undefined;
}

const RadarTab: React.FC<RadarTabProps> = ({ data, criteriaIcons }) => {
  const [selectedMethods, setSelectedMethods] = useState<MethodName[]>([]);

  if (!data) return null;

  const formatDataForRadar = () => {
    return data.baseline.criteria.map((criteria, index) => {
      const dataPoint: RadarDataPoint = {
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

  const toggleMethod = (method: MethodName) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const getMethodColor = (method: MethodName): string => {
    return (COLORS as MethodColors)[method as keyof MethodColors] || '#8884d8';
  };

  const MethodSelector = () => (
    <div>
      <div className="flex flex-wrap gap-2">
        {data.baseline.methods.map((method) => (
          <button
            key={method}
            onClick={() => toggleMethod(method)}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              selectedMethods.length === 0 || selectedMethods.includes(method)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{
              borderColor: getMethodColor(method),
              borderWidth: '2px',
              borderStyle: 'solid'
            }}
          >
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getMethodColor(method) }}></span>
            {method}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {selectedMethods.length === 0 
          ? "All methods are currently displayed. Click on methods to filter." 
          : `Showing ${selectedMethods.length} selected method${selectedMethods.length > 1 ? 's' : ''}.`}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Method Comparison</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Methods to Compare</h3>
          <MethodSelector />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {data.baseline.criteria.map((criteria, index) => (
            <div key={criteria} className="bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
              <div className="flex items-center text-sm mb-1 min-w-0">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center mr-1">
                  {criteriaIcons[criteria]}
                </div>
                <span className="font-medium truncate">{criteria}</span>
              </div>
              <div>
                {data.baseline.methods.map((method) => {
                  if (selectedMethods.length === 0 || selectedMethods.includes(method)) {
                    return (
                      <div key={method} className="flex items-center justify-between text-sm pl-6">
                        <span style={{ color: getMethodColor(method) }}>{method}:</span>
                        <span className="font-medium ml-2">{data.baseline.values[method][index]}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Methods to Compare</h3>
          <MethodSelector />
        </div>
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